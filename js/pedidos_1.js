checkSessao();

var codigoAtual = 0;
var percentualComissaoMarchand = 0;
var valorComissaoMarchand = 0;
var idFormaPagamento = 0;
var codigoOrcamento = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Pedidos</div>";
    carregarmenu();
    getDadosUsuario();
    SelecionaAbas(0);
    Desabilita(true);

    Mask.setData(Selector.$('dataCadastro'));
    Mask.setData(Selector.$('previsaoEntrega'));

    Mask.setMoeda(Selector.$('frete'));
    Mask.setMoeda(Selector.$('acrescimo'));
    Mask.setMoeda(Selector.$('percDesconto'));
    Mask.setMoeda(Selector.$('valorDesconto'));

    //CRIA TABELA DE OBRAS
    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('cellpadding', '2');
    gridObras.table.setAttribute('cellspacing', '0');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Obra'),
        DOM.newText('Artista'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Total'),
        DOM.newText(''),
        DOM.newText(''),
        DOM.newText('idTipo'),
        DOM.newText('idArtista'),
        DOM.newText('idObra'),
        DOM.newText('idTamanho'),
        DOM.newText('idAcabamento'),
        DOM.newText('altura'),
        DOM.newText('largura'),
        DOM.newText('tiragem'),
        DOM.newText('qtdVendidos'),
        DOM.newText('estrelas'),
        DOM.newText('valor'),
        DOM.newText('qtde'),
        DOM.newText('percentualDesconto'),
        DOM.newText('valorDesconto'),
        DOM.newText('valorAcrescimo'),
        DOM.newText('valorTotal'),
        DOM.newText('obs'),
        DOM.newText('imagem')
    ]);

    Selector.$('divObras').appendChild(gridObras.table);

    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);
    gridObras.hiddenCol(19);
    gridObras.hiddenCol(20);
    gridObras.hiddenCol(21);
    gridObras.hiddenCol(22);
    gridObras.hiddenCol(23);
    gridObras.hiddenCol(24);
    gridObras.hiddenCol(25);

    //CRIA TABELA DE PAGAMENTOS
    gridPagamento = new Table('gridPagamento');
    gridPagamento.table.setAttribute('cellpadding', '2');
    gridPagamento.table.setAttribute('cellspacing', '0');
    gridPagamento.table.setAttribute('class', 'tabela_cinza_foco');

    gridPagamento.addHeader([
        DOM.newText('Parcela'),
        DOM.newText('Valor'),
        DOM.newText('Vencimento'),
        DOM.newText('Status'),
        DOM.newText('Excluir'),
        DOM.newText('Pago')
    ]);

    Selector.$('divPagamento').appendChild(gridPagamento.table);

    gridPagamento.hiddenCol(5);

    //FOLLOW-UP
    var tabelaFollow = Selector.$('tabelaFollow');

    gridFollow = new Table('gridProposta');
    gridFollow.table.setAttribute('class', 'tabela_cinza_foco');
    gridFollow.table.setAttribute('cellpadding', '5');
    gridFollow.table.setAttribute('cellspacing', '0');

    gridFollow.addHeader([
        DOM.newText('Data'),
        DOM.newText('Tipo'),
        DOM.newText('Obs'),
        DOM.newText('Responsável'),
        DOM.newText('Retorno'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    tabelaFollow.appendChild(gridFollow.table);

    var source = Window.getParameter('source');

    if (source == null || source == '') {
        getCentrosCusto(Selector.$('loja'), 'Selecione uma loja', true);
        getClientes(Selector.$('cliente'), "Selecione um cliente", true);
        Select.AddItem(Selector.$('vendedor'), "Selecione uma loja", 0);
        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", true);

        Selector.$('codigo').focus();
    }
    else {
        getCentrosCusto(Selector.$('loja'), 'Selecione uma loja', false);
        getClientes(Selector.$('cliente'), "Selecione um cliente", false);
        Select.AddItem(Selector.$('vendedor'), "Selecione uma loja", 0);
        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", false);

        if (source == 'abrir') {
            //BUSCA O CÓDIGO DO PEDIDO A PARTIR DO CÓDIGO DO ORÇAMENTO

            var ajax = new Ajax('POST', 'php/pedidos.php', false);
            var p = 'action=getIdPedido';
            p += '&idOrcamento=' + Window.getParameter('idOrcamento');

            ajax.Request(p);

            if (ajax.getResponseText() == 0) {
                MostrarMsg('Problemas ao buscar o pedido', '');
            }
            else {
                Mostra(ajax.getResponseText());
            }
        }

        if (source == 'gerar') {            
            var ajax = new Ajax('POST', 'php/propostas.php', false);

            var p = 'action=Mostrar';
            p += '&codigo=' + Window.getParameter('idOrcamento');;

            ajax.Request(p);

            if (ajax.getResponseText() == 0) {
                MostrarMsg('Orçamento não localizado para carregar', 'codigo');
                return;
            }
            
            botNovo_onClick();

            var json = JSON.parse(ajax.getResponseText());           

            codigoOrcamento = json.idOrcamento;            
            
            Select.Show(Selector.$('loja'), json.idLoja);
            CarregaMarchands(false);
           
            Select.Show(Selector.$('cliente'), json.idCliente);
            Select.Show(Selector.$('vendedor'), json.idVendedor);

            Selector.$('contato').value = json.contato;
            Selector.$('telefone').value = json.telefone;
            Selector.$('email').value = json.email;
            
            Select.Show(Selector.$('tipoTransporte'), json.idTransporteTipo);

            Selector.$('valor').value = json.valor;
            Selector.$('frete').value = json.valorFrete;
            Selector.$('acrescimo').value = json.valorAcrescimo;
            Selector.$('percDesconto').value = json.percDesconto;
            Selector.$('valorDesconto').value = json.valorDesconto;
            Selector.$('valorTotal').value = json.valorTotal;
            Selector.$('obs').value = json.obs;

            //Select.Show(Selector.$('formaPagamento'), json.idFormaPagamento);
            //Selector.$('qtdeParcelas').value = json.qtdeParcelas;
            //CalculaPagamento(false, false, false);

            MostraObras(json.arrayObras);
            getFollow();
            
            for(var i=0; i < gridObras.getRowCount(); i++){
                gridObras.setRowData(i, '0');
            }
            
            for(var i=0; i < gridFollow.getRowCount(); i++){
                gridFollow.setRowData(i, '0');
            }
        }
    }
};

function CarregaMarchands(ascinc) {
    if (Selector.$('loja').value !== Selector.$('loja').name) {
        Selector.$('loja').name = Selector.$('loja').value;
        getVendedores(Selector.$('vendedor'), "Selecione um marchand", ascinc, 'MARCHANDS', Selector.$('loja').value);
    }
    else {
        return;
    }
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 1; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid; border-color:#D7D7D7; overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');//JAIRO MEXER AQUI
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; background:#FFF; min-height:440px; border-top:1px solid; border-color:#D7D7D7; overflow:hidden');
}

function Desabilita(Valor) {

    Selector.$('dataCadastro').disabled = Valor;
    Selector.$('loja').disabled = Valor;
    Selector.$('previsaoEntrega').disabled = Valor;
    Selector.$('cliente').disabled = Valor;
    Selector.$('vendedor').disabled = Valor;
    Selector.$('situacao').disabled = Valor;
    Selector.$('contato').disabled = Valor;
    Selector.$('telefone').disabled = Valor;
    Selector.$('email').disabled = Valor;
    Selector.$('tipoTransporte').disabled = Valor;
    Selector.$('valor').disabled = Valor;
    Selector.$('frete').disabled = Valor;
    Selector.$('acrescimo').disabled = Valor;
    Selector.$('percDesconto').disabled = Valor;
    Selector.$('valorDesconto').disabled = Valor;
    Selector.$('valorTotal').disabled = Valor;
    Selector.$('obs').disabled = Valor;
    Selector.$('pesquisarClientes').style.display = (Valor ? "none" : "inline-block");
    Selector.$('adicionarCliente').style.display = (Valor ? "none" : "inline-block");
    Selector.$('addObra').style.display = (Valor ? "none" : "block");
    Selector.$('addPagamento').style.display = (Valor ? "none" : "block");
    Selector.$('codigo').style.display = (!Valor ? "none" : "block");
    Selector.$('d1').style.display = (!Valor ? "none" : "block");
    Selector.$('d2').style.display = (!Valor ? "none" : "block");
    Selector.$('d3').style.display = (!Valor ? "none" : "block");
    Selector.$('d4').style.display = (!Valor ? "none" : "block");

    AjustaImagensEdicao(Selector.$('botNovo'), Selector.$('botModi'), Selector.$('botSair'), Selector.$('botDel'), Selector.$('lupinha'));
}

function D1_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    ajax.Request('action=GetRegistroPrimeiro&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D2_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    ajax.Request('action=GetRegistroAnterior&atual=' + codigoAtual);
    Mostra(ajax.getResponseText());
}

function D3_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    ajax.Request('action=GetRegistroProximo&atual=' + codigoAtual);
    Mostra(ajax.getResponseText());
}

function D4_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    ajax.Request('action=GetRegistroUltimo&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function AjustaImagensEdicao(BotNovo, BotModi, BotSair, BotAux1, BotAux2) {

    if (BotNovo.name === 'NovoTrue') {
        BotNovo.src = 'imagens/validar.png';
        BotNovo.title = 'Salvar';
        BotModi.src = 'imagens/cadastro.png';
        BotSair.src = 'imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotModi.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else if (BotModi.name === 'ModiTrue') {
        BotModi.src = 'imagens/validar.png';
        BotModi.title = 'Salvar';
        BotNovo.src = 'imagens/novo.png';
        BotSair.src = 'imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotNovo.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else {
        BotNovo.src = 'imagens/novo.png';
        BotNovo.title = 'Novo';
        BotModi.src = 'imagens/cadastro.png';
        BotModi.title = 'Modificar';
        BotSair.src = 'imagens/sair3.png';
        BotSair.title = 'Sair';
        BotNovo.style.visibility = 'visible';
        BotModi.style.visibility = 'visible';
        BotSair.style.visibility = 'visible';
        BotAux1.style.visibility = 'visible';
        BotAux2.style.visibility = 'visible';
    }
}

function botNovo_onClick() {

    var botNovo = Selector.$('botNovo');
    var botModi = Selector.$('botModi');

    if (botNovo.name === 'NovoTrue') {
        if (Gravar()) {
            Mostra(codigoAtual);

            botNovo.name = 'NovoFalse';
            botModi.name = 'ModiFalse';
            Desabilita(true);
        }
    } else {

        botNovo.name = 'NovoTrue';
        botModi.name = 'ModiFalse';
        Desabilita(false);

        Limpar();

        SelecionaAbas(0);
        Selector.$('dataCadastro').value = Date.GetDate(false);
        Selector.$('previsaoEntrega').value = CalculaPrevisaoEntrega(Selector.$('dataCadastro').value);
        Selector.$('situacao').value = 'Novo pedido';
        Selector.$('loja').focus();
    }
}

function botModi_onClick() {

    if (codigoAtual <= 0) {
        MostrarMsg('Nenhum pedido ativo', '');
        return;
    }

    if (codigoAtual === '' || parseInt(codigoAtual) === 0) {
        return;
    }

    var botNovo = Selector.$('botNovo');
    var botModi = Selector.$('botModi');

    if (botModi.name === 'ModiTrue') {

        if (Gravar()) {
            Mostra(codigoAtual);
            botModi.name = 'ModiFalse';
            botNovo.name = 'NovoFalse';
            Desabilita(true);
        }
    } else {
        botModi.name = 'ModiTrue';
        botNovo.name = 'NovoFalse';
        Desabilita(false);

        if (gridPagamento.getRowCount() > 0) {
            Selector.$('frete').disabled = true;
            Selector.$('acrescimo').disabled = true;
            Selector.$('percDesconto').disabled = true;
            Selector.$('valorDesconto').disabled = true;
        }
    }
}

function botDel_onClick() {

    if (codigoAtual <= 0) {
        MostrarMsg('Nenhum pedido selecionado.', '');
        return;
    }
}

function botSair_onClick() {

    var botNovo = Selector.$('botNovo');
    var botModi = Selector.$('botModi');

    if (botNovo.name === 'NovoTrue' || botModi.name === 'ModiTrue') {

        if (botNovo.name === 'NovoTrue') {
            botNovo.name = 'NovoFalse';
            botModi.name = 'ModiFalse';
            Limpar();
            Desabilita(true);
        }
        else if (botModi.name === 'ModiTrue') {
            botNovo.name = 'NovoFalse';
            botModi.name = 'ModiFalse';
            Mostra(codigoAtual);
            Desabilita(true);
        }
    }
    else {
        window.location = 'principal.html';
    }
}

function Limpar() {

    codigoAtual = 0;
    Selector.$('codigo').value = '';
    Selector.$('codPedido').innerHTML = '- - -';
    Selector.$('dataCadastro').value = "";
    Selector.$('loja').selectedIndex = 0;
    Selector.$('previsaoEntrega').value = "";
    Selector.$('cliente').selectedIndex = 0;
    Selector.$('situacao').value = "";
    Selector.$('vendedor').selectedIndex = 0;
    Selector.$('contato').value = "";
    Selector.$('telefone').value = "";
    Selector.$('email').value = "";
    Selector.$('tipoTransporte').selectedIndex = 0;
    Selector.$('valor').value = "";
    Selector.$('frete').value = "";
    Selector.$('acrescimo').value = "";
    Selector.$('percDesconto').value = "";
    Selector.$('valorDesconto').value = "";
    Selector.$('valorTotal').value = "";
    Selector.$('obs').value = "";
    gridObras.clearRows();
    gridPagamento.clearRows();
    gridFollow.clearRows();
}

function VerificaCampos() {

    var data_cadastro = Selector.$('dataCadastro');
    if (data_cadastro.value === '') {
        MostrarMsg("Por favor, preencha a data de cadastro", 'dataCadastro');
        SelecionaAbas(0);
        return false;
    }

    var loja = Selector.$('loja');
    if (loja.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione uma loja", 'loja');
        SelecionaAbas(0);
        return false;
    }

    var previsaoEntrega = Selector.$('previsaoEntrega');
    if (previsaoEntrega.value === '') {
        MostrarMsg("Por favor, preencha a data de previsão de entrega", 'previsaoEntrega');
        SelecionaAbas(0);
        return false;
    }

    var cliente = Selector.$('cliente');
    if (cliente.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um cliente", 'cliente');
        SelecionaAbas(0);
        return false;
    }

    var vendedor = Selector.$('vendedor');
    if (vendedor.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um marchand", 'vendedor');
        SelecionaAbas(0);
        return false;
    }

    var tipoTransporte = Selector.$('tipoTransporte');
    if (tipoTransporte.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um tipo de entrega", 'tipoTransporte');
        SelecionaAbas(0);
        return false;
    }

    if (gridObras.getRowCount() <= 0) {
        MostrarMsg("Por favor, adicione uma ou mais obras", '');
        SelecionaAbas(0);
        return false;
    }

    return true;
}

function Gravar() {

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&previsaoEntrega=' + Selector.$('previsaoEntrega').value;
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&idMarchand=' + Selector.$('vendedor').value;
    p += '&idTipoEntrega=' + Selector.$('tipoTransporte').value;
    p += '&valor=' + Selector.$('valor').value;
    p += '&frete=' + Selector.$('frete').value;
    p += '&percentualDesconto=' + Selector.$('percDesconto').value;
    p += '&valorDesconto=' + Selector.$('valorDesconto').value;
    p += '&valorAcrescimo=' + Selector.$('acrescimo').value;
    p += '&valorTotal=' + Selector.$('valorTotal').value;
    p += '&percentualComissao=' + percentualComissaoMarchand;
    p += '&valorComissao=' + Number.FormatMoeda(valorComissaoMarchand.toFixed(2));
    p += '&obs=' + Selector.$('obs').value;

    //ARRAY COM OBRAS
    p += '&idsOrcamentosObras=' + gridObras.getRowsData();
    p += '&observacoes=' + gridObras.getContentRows(24);
    p += '&idsTiposObras=' + gridObras.getContentRows(8);
    p += '&idsObras=' + gridObras.getContentRows(10);
    p += '&idsArtistas=' + gridObras.getContentRows(9);
    p += '&idsTamanhos=' + gridObras.getContentRows(11);
    p += '&idsAcabamentos=' + gridObras.getContentRows(12);
    p += '&totaisObras=' + gridObras.getContentMoneyRows(5);
    p += '&alturas=' + gridObras.getContentMoneyRows(13);
    p += '&larguras=' + gridObras.getContentMoneyRows(14);
    p += '&qtds=' + gridObras.getContentMoneyRows(19);
    p += '&percentuaisDescontos=' + gridObras.getContentMoneyRows(20);
    p += '&valoresDescontos=' + gridObras.getContentMoneyRows(21);
    p += '&valoresAcrescimos=' + gridObras.getContentMoneyRows(22);
    p += '&valoresUnitarios=' + gridObras.getContentMoneyRows(18);
    p += '&tiragens=' + gridObras.getContentRows(15);
    p += '&qtdsVendidos=' + gridObras.getContentRows(16);
    p += '&estrelas=' + gridObras.getContentRows(17);
    p += '&imagens=' + gridObras.getContentRows(25);
    //p += '&pesos=' + gridObras.getContentMoneyRows(26);

    //Manda os dados da grid Pagamento
    p += '&qtdLinhasPagamento=' + gridPagamento.getRowCount();
    p += '&rowDatasPagamento=' + gridPagamento.getRowsData();
    p += '&numerosParcelas=' + gridPagamento.getContentRows(0);
    p += '&valores=' + gridPagamento.getContentMoneyRows(1);
    p += '&datasVencimentos=' + gridPagamento.getContentRows(2);
    p += '&idFormaPagamento=' + idFormaPagamento;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg('Problemas ao gravar o pedido. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } else {
        codigoAtual = ajax.getResponseText();
        return true;
    }
}

function Mostra(Codigo) {

    if (Codigo === '' || parseInt(Codigo) === 0) {
        return;
    }

    Limpar();

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Pedido não localizada', 'codigo');
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    codigoAtual = json.idVenda;
    Selector.$('botCancelarPedido').setAttribute('onclick', 'CancelarPedido(' + json.idVenda + ')');

    Selector.$('codigo').value = codigoAtual;
    Selector.$('codPedido').innerHTML = json.codPedido;

    Selector.$('dataCadastro').value = json.dataCadastro;
    Select.Show(Selector.$('loja'), json.idLoja);
    Selector.$('previsaoEntrega').value = json.dataEntrega;
    Selector.$('situacao').value = json.status;
    Selector.$('situacao').setAttribute('name', json.idStatus);

    Select.Show(Selector.$('cliente'), json.idCliente);
    getVendedores(Selector.$('vendedor'), 'Selecione um marchand', false, 'MARCHANDS', Selector.$('loja').value);

    Select.Show(Selector.$('vendedor'), json.idVendedor);
    Selector.$('contato').value = json.contato;
    Selector.$('telefone').value = json.telefone;
    Selector.$('email').value = json.email;
    Select.Show(Selector.$('tipoTransporte'), json.idTipoEntrega);
    Selector.$('valor').value = json.valor;
    Selector.$('frete').value = json.valorFrete;
    Selector.$('acrescimo').value = json.valorAcrescimo;
    Selector.$('percDesconto').value = json.percentualDesconto;
    Selector.$('valorDesconto').value = json.valorDesconto;
    Selector.$('valorTotal').value = json.valorTotal;
    Selector.$('comissaoVendedor').value = json.valorComissao + " (" + json.percentualComissao + "%)";
    Selector.$('obs').value = json.obs;

    MostraObras(json.arrayObras);
    MostraParcelas(json.arrayParcelas);
    MostraFollowUp();
}

function MostraObras(array) {

    gridObras.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ', ' + json[i].idObra + ')');
       
        gridObras.addRow([
            DOM.newText((json[i].idTipoProduto === '1' ? 'PhotoArts' : 'InstaArts')),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeArtista),
            DOM.newText(json[i].nomeTamanho),
            DOM.newText(json[i].nomeAcabamento),
            DOM.newText(json[i].valor),
            editar,
            excluir,
            DOM.newText(json[i].idTipoProduto),
            DOM.newText(json[i].idArtista),
            DOM.newText(json[i].idObra),
            DOM.newText(json[i].idTamanho),
            DOM.newText(json[i].idAcabamento),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].percentualDesconto),
            DOM.newText(json[i].valorDesconto),
            DOM.newText(json[i].valorAcrescimo),
            DOM.newText(json[i].valorTotal),
            DOM.newText(json[i].obs),
            DOM.newText(json[i].imagem)
        ]);
                

        gridObras.setRowData(gridObras.getRowCount() - 1, json[i].idObra);
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:right;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#FFF");
        }

        gridObras.hiddenCol(8);
        gridObras.hiddenCol(9);
        gridObras.hiddenCol(10);
        gridObras.hiddenCol(11);
        gridObras.hiddenCol(12);
        gridObras.hiddenCol(13);
        gridObras.hiddenCol(14);
        gridObras.hiddenCol(15);
        gridObras.hiddenCol(16);
        gridObras.hiddenCol(17);
        gridObras.hiddenCol(18);
        gridObras.hiddenCol(19);
        gridObras.hiddenCol(20);
        gridObras.hiddenCol(21);
        gridObras.hiddenCol(22);
        gridObras.hiddenCol(23);
        gridObras.hiddenCol(24);
        gridObras.hiddenCol(25);
    }
}

function MostraParcelas(array) {

    gridPagamento.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        if (json[i].idFormaPagamento > '1') {

            var status = DOM.newElement('label');
            status.innerHTML = "Pago";

            var imgStatus = DOM.newElement('img');
            imgStatus.src = 'imagens/pesquisar.png';
            imgStatus.setAttribute('style', 'margin-left:10px; width:14px; height:14px; cursor:pointer;');
            imgStatus.setAttribute('title', 'Visualizar Parcela');
            imgStatus.setAttribute('onclick', 'PromptPagarParcela(' + gridPagamento.getRowCount() + ', ' + json[i].idVendaParcela + ', false)');

            var divStatus = DOM.newElement('div');
            divStatus.appendChild(status);
            divStatus.appendChild(imgStatus);

            idFormaPagamento = json[i].idFormaPagamento;
        } else {

            var status = DOM.newElement('label');
            status.innerHTML = "Em aberto";

            var imgStatus = DOM.newElement('img');
            imgStatus.src = 'imagens/money2.png';
            imgStatus.setAttribute('style', 'margin-left:10px; width:14px; height:14px; cursor:pointer;');
            imgStatus.setAttribute('title', 'Pagar Parcela');
            imgStatus.setAttribute('onclick', 'PromptPagarParcela(' + gridPagamento.getRowCount() + ', ' + json[i].idVendaParcela + ', true)');

            var divStatus = DOM.newElement('div');
            divStatus.appendChild(status);
            divStatus.appendChild(imgStatus);
        }

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirParcela(' + gridPagamento.getRowCount() + ', ' + json[i].idVendaParcela + ')');

        gridPagamento.addRow([
            DOM.newText(json[i].parcela),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].dataVencimento),
            divStatus,
            excluir,
            DOM.newText(json[i].idFormaPagamento)
        ]);

        gridPagamento.hiddenCol(5);

        gridPagamento.setRowData(gridPagamento.getRowCount() - 1, json[i].idVendaParcela);
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'text-align:right; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:30px;');

        if (cor) {
            cor = false;
            gridPagamento.setRowBackgroundColor(gridPagamento.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridPagamento.setRowBackgroundColor(gridPagamento.getRowCount() - 1, "#FFF");
        }
    }
}

function codigo_KeyDown(ev) {
    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode == 13) {
        Mostra(Selector.$('codigo').value);
    }
}

function AbrePromptPesquisaPedidos() {
    PromptPesquisaPedidos(Selector.$('prompt'));
}

function PromptPesquisaPedidos(div) {

    div.innerHTML = "";

    var lblDataCadastro = DOM.newElement('label');
    lblDataCadastro.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblDataCadastro.appendChild(DOM.newText('Data Cadastro'));

    var txtDataCadastro = DOM.newElement('text', 'dataCadastro2');
    txtDataCadastro.setAttribute('class', 'textbox_cinzafoco');
    txtDataCadastro.setAttribute('style', 'width:100px; margin-left:5px;');

    var lblLoja = DOM.newElement('label');
    lblLoja.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblLoja.setAttribute('style', 'margin-left:10px;');
    lblLoja.appendChild(DOM.newText('Loja'));

    var cmbLoja = DOM.newElement('select');
    cmbLoja.setAttribute('id', 'loja2');
    cmbLoja.setAttribute('class', 'combo_cinzafoco');
    cmbLoja.setAttribute('style', 'width:220px; margin-left:5px;');
    cmbLoja.setAttribute('onchange', 'getVendedores(Selector.$("marchand"), "Selecione um marchand", true, "MARCHANDS", Selector.$("loja2").value);');

    var lblMarchand = DOM.newElement('label');
    lblMarchand.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblMarchand.setAttribute('style', 'margin-left:10px;');
    lblMarchand.appendChild(DOM.newText('Marchand'));

    var cmbMarchand = DOM.newElement('select', 'marchand');
    cmbMarchand.setAttribute('class', 'combo_cinzafoco');
    cmbMarchand.setAttribute('style', 'width:220px; margin-left:5px;');

    var lblPrevisaoEntrega = DOM.newElement('label');
    lblPrevisaoEntrega.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblPrevisaoEntrega.appendChild(DOM.newText('Previsão Entrega'));

    var txtPrevisaoEntrega = DOM.newElement('text', 'previsaoEntrega2');
    txtPrevisaoEntrega.setAttribute('class', 'textbox_cinzafoco');
    txtPrevisaoEntrega.setAttribute('style', 'width:100px; margin-left:5px;');

    var lblClientes = DOM.newElement('label');
    lblClientes.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblClientes.setAttribute('style', 'margin-left:10px;');
    lblClientes.appendChild(DOM.newText('Cliente'));

    var cmbCliente = DOM.newElement('select', 'cliente2');
    cmbCliente.setAttribute('class', 'combo_cinzafoco');
    cmbCliente.setAttribute('style', 'width:280px; margin-left:5px;');

    var botPesquisar = DOM.newElement('submit');
    botPesquisar.setAttribute('id', 'botEnviar');
    botPesquisar.setAttribute('class', 'botaosimplesfoco');
    botPesquisar.setAttribute('style', '  float:right; margin-right:10px;');
    botPesquisar.value = 'Pesquisar';
    botPesquisar.setAttribute('onclick', 'PesquisarPedidos();');

    var botCancelar = DOM.newElement('submit');
    botCancelar.setAttribute('id', 'botCancelar');
    botCancelar.setAttribute('class', 'botaosimplesfoco');
    botCancelar.setAttribute('style', 'float:right;');
    botCancelar.value = 'Cancelar';
    botCancelar.setAttribute('onclick', 'dialogo.Close();');

    div.appendChild(lblDataCadastro);
    div.appendChild(txtDataCadastro);
    div.appendChild(lblLoja);
    div.appendChild(cmbLoja);
    div.appendChild(lblMarchand);
    div.appendChild(cmbMarchand);
    div.innerHTML += '<br /><br />';
    div.appendChild(lblPrevisaoEntrega);
    div.appendChild(txtPrevisaoEntrega);
    div.appendChild(lblClientes);
    div.appendChild(cmbCliente);
    div.appendChild(botCancelar);
    div.appendChild(botPesquisar);
    div.innerHTML += '<br /><br />';

    var divopcoes = DOM.newElement('div', 'divFooterR');
    divopcoes.setAttribute('id', 'divopcoes');
    divopcoes.setAttribute('style', 'height:250px; overflow:auto;');

    Selector.$('prompt').appendChild(divopcoes);

    gridPesquisa = new Table('gridPesquisa');
    gridPesquisa.table.setAttribute('class', 'tabela_cinza_foco');
    gridPesquisa.table.setAttribute('cellpadding', '5');
    gridPesquisa.table.setAttribute('cellspacing', '0');

    gridPesquisa.addHeader([
        DOM.newText('Data Venda'),
        DOM.newText('Loja'),
        DOM.newText('Previsão Entrega'),
        DOM.newText('Cliente'),
        DOM.newText('Marchand')
    ]);

    divopcoes.appendChild(gridPesquisa.table);

    dialogo = new caixaDialogo('prompt', 400, 800, 'padrao/', 111);
    dialogo.Show();

    getCentrosCusto(Selector.$('loja2'), 'Selecione uma loja', true);
    Select.AddItem(Selector.$('marchand'), "Selecione uma loja", 0);
    getClientes(Selector.$('cliente2'), "Selecione um cliente", true);
    Mask.setData(Selector.$('dataCadastro2'));
    Mask.setData(Selector.$('previsaoEntrega2'));
}

function PesquisarPedidos() {

    gridPesquisa.clearRows();

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=PesquisarPedidos';
    p += '&dataCadastro=' + Selector.$('dataCadastro2').value;
    p += '&loja=' + Selector.$('loja2').value;
    p += '&marchand=' + Selector.$('marchand').value;
    p += '&previsaoEntrega=' + Selector.$('previsaoEntrega2').value;
    p += '&cliente=' + Selector.$('cliente2').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var cor = true;

        for (var i = 0; i < json.length; i++) {

            gridPesquisa.addRow([
                DOM.newText(json[i].dataVenda),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].dataEntrega),
                DOM.newText(json[i].apelido),
                DOM.newText(json[i].marchand)
            ]);

            gridPesquisa.setRowData(gridPesquisa.getRowCount() - 1, json[i].idVenda);
            gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('onclick', 'MostraResultadoPesquisa(' + json[i].idVenda + ');');
            gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:90px;');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');

            if (cor) {
                cor = false;
                gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, "#FFF");
            }
        }
    }

    ajax.Request(p);
}

function MostraResultadoPesquisa(idVenda) {

    dialogo.Close();
    Mostra(idVenda);
}

function LoadDadosCliente() {

    var cmb = Selector.$('cliente');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '';
        Selector.$('contato').value = '';
        Selector.$('telefone').value = '';
        Selector.$('email').value = '';
        return;
    }

    if (cmb.name !== cmb.value)
        cmb.name = cmb.value;
    else
        return;

    Selector.$('contato').value = '';
    Selector.$('telefone').value = '';
    Selector.$('email').value = '';

    var ajax = new Ajax('POST', 'php/photoarts.php', true);

    var p = 'action=LoadDadosCliente';
    p += '&idCliente=' + cmb.value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() === '-1') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        Selector.$('contato').value = json.responsavel;
        Selector.$('telefone').value = json.telefone;
        Selector.$('email').value = json.email;
    };

    ajax.Request(p);
}

function AdicionarObra(codigo) {
    if (Selector.$('botNovo').name !== 'NovoTrue' && Selector.$('botModi').name !== 'ModiTrue')
        return;

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.setAttribute('style', 'text-align:left;');
    divCadastro.setAttribute('align', 'left');
    divCadastro.innerHTML = '';

    //OPTIONS PHOTOARTS OU INSTAARTS
    //PHOTOARTS
    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optPhoto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObras()');
    elemento.setAttribute('style', 'margin-left:200px');
    elemento.setAttribute('checked', 'checked');

    var label = DOM.newElement('label');
    label.innerHTML = 'PhotoArts';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optPhoto');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    //INSTAARTS
    elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optInsta');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObras()');
    elemento.setAttribute('style', 'margin-left:20px');

    label = DOM.newElement('label');
    label.innerHTML = 'InstaArts';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optInsta');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    divCadastro.innerHTML += '<br />';

    //DIV PHOTOARTS
    var divP = DOM.newElement('div', 'o_divPhotoarts');
    divP.setAttribute('style', 'margin-top:10px; text-align:left;');

    //ARTISTA
    label = DOM.newElement('label');
    label.innerHTML = 'Artista ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    //label.setAttribute('style', 'margin-left:40px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_artista');
    elemento.setAttribute('class', 'combo_cinzafoco');
    elemento.setAttribute("style", 'width:235px; margin-left:4px;');
    elemento.setAttribute('onchange', 'getObrasArtista(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //OBRA
    label = DOM.newElement('label');
    label.innerHTML = 'Obra ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:235px; margin-left:4px');
    elemento.setAttribute('onchange', 'getTamanhosObras(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanho');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:218px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDadosTamanho("p")');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Acabamento ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_acabamento');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:190px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //DADOS DO TAMANHO, TIRAGEM, ESTRELAS, ETC
    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    //label.setAttribute('style', 'margin-left:40px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_altura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_largura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //TIRAGEM
    label = DOM.newElement('label');
    label.innerHTML = 'Tiragem ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_tiragem');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:45px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //QTDE VENDIDOS
    label = DOM.newElement('label');
    label.innerHTML = 'Qtd. Vendidos ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_qtdeVendidos');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:45px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //ESTRELAS
    label = DOM.newElement('label');
    label.innerHTML = 'Estrelas ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_estrelas');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:42px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divCadastro.appendChild(divP);

    //INSTAARTS
    var divI = DOM.newElement('div', 'o_divInstaarts');
    divI.setAttribute('style', 'margin-top:10px; text-align:left;');

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanhoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:218px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDadosTamanho("i")');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Acabamento ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_acabamentoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:190px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    //label.setAttribute('style', 'margin-left:40px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_alturaI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
    elemento.setAttribute('onblur', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_larguraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
    elemento.setAttribute('onblur', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divCadastro.appendChild(divI);
    //FIM divI

    //QTDE, VALOR, DESCONTO E TOTAL
    var divTotal = DOM.newElement('div');
    divTotal.setAttribute('style', 'margin-top:8px');

    //VALOR
    label = DOM.newElement('label', 'o_lblValor');
    label.innerHTML = 'Valor';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valor');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('readonly', 'readonly');
    elemento.setAttribute("style", 'width:75px; margin-left:6px; background-color:#F5F5F5; text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //QTDE
    label = DOM.newElement('label');
    label.innerHTML = 'Qtde';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_qtde');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 1');
    elemento.setAttribute('value', '1');
    elemento.setAttribute('onblur', 'TotalizaObras(true, false, false, false)');
    elemento.setAttribute("style", 'width:35px; margin-left:4px;text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //PERCENTUAL DE DESCONTO
    label = DOM.newElement('label');
    label.innerHTML = 'Desconto';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_percDesconto');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 5,00');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, true, false, false)');

    var span = DOM.newElement('label');
    span.setAttribute('class', 'fonte_Roboto_texto_normal');
    span.innerHTML = ' % ou ';

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);
    divTotal.appendChild(span);

    //VALOR DESCONTO
    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorDesconto');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 200,00');
    elemento.setAttribute("style", 'width:73px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, false, true, false)');

    divTotal.appendChild(elemento);

    //ACRESCIMO
    label = DOM.newElement('label');
    label.innerHTML = 'Acréscimo';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorAcrescimo');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 5,00');
    elemento.setAttribute("style", 'width:73px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, false, false, true)');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    divTotal.innerHTML += '<br />';

    //VALOR TOTAL
    label = DOM.newElement('label', 'o_lblValorTotal');
    label.innerHTML = 'Valor Total';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorTotal');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('readonly', 'readonly');
    elemento.setAttribute("style", 'width:100px; margin-left:4px; font-size:16px; font-weight:bold; background-color:#F5F5F5; text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //PESO APROXIMADO
    label = DOM.newElement('label', 'o_lblPeso');
    label.innerHTML = '';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px; color:#0A4ADF; font-weight:bold');
    divTotal.appendChild(label);

    divCadastro.appendChild(divTotal);

    //OBS
    label = DOM.newElement('label');
    label.innerHTML = 'Observações';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px;');

    elemento = DOM.newElement('textarea');
    elemento.setAttribute('id', 'o_obs');
    elemento.setAttribute('placeHolder', 'Informe detalhes referente a venda da obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:560px; height:60px;');

    divCadastro.appendChild(label);
    divCadastro.appendChild(elemento);

    //IMAGEM OBRA
    var divImg = DOM.newElement('div');
    divImg.setAttribute('style', 'text-align:center');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:170px; height:100px;');
    elemento.setAttribute("name", '');

    divImg.appendChild(elemento);

    divCadastro.appendChild(divImg);

    divI.innerHTML += '<br />';

    var divIncluirImagem = DOM.newElement('div', 'divIncluirImagem');
    divIncluirImagem.setAttribute('style', 'text-align:center; width:100px; margin:0 auto; display:none;');

    label = DOM.newElement('label', 'lblIncluirImagem');
    label.innerHTML = 'Incluir Imagem';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; text-decoration:underline; text-align:center;');
    label.setAttribute('onclick', 'AnexarImagem()');

    divIncluirImagem.appendChild(label);
    divCadastro.appendChild(divIncluirImagem);

    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');

    label = DOM.newElement('label', 'e_lblCancelar');
    label.innerHTML = 'Cancelar';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle');
    label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close()');
    label.innerHTML = 'Cancelar';
    divElem.appendChild(label);

    divCadastro.appendChild(divElem);

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', 'IncluirObra(' + codigo + ')');
    elemento.innerHTML = "Incluir";

    divCadastro.appendChild(elemento);

    dialogoCadastro = new caixaDialogo('divCadastro', 505, 620, 'padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();
    Selector.$('divCadastro').setAttribute('class', 'divbranca efeito_delay');
    Selector.$('divCadastro').style.overflow = 'hidden';

    Mask.setMoeda(Selector.$('o_alturaI'));
    Mask.setMoeda(Selector.$('o_larguraI'));
    Mask.setMoeda(Selector.$('o_percDesconto'));
    Mask.setMoeda(Selector.$('o_valorDesconto'));
    Mask.setMoeda(Selector.$('o_valorAcrescimo'));

    if (codigo >= 0) {
        getArtistas(Selector.$('o_artista'), 'Selecione um artista', false);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', false, 'p');
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', false, 'i');

        if (gridObras.getCellText(codigo, 10) == 1) {
            Selector.$('o_optPhoto').checked = 'checked';
            Selector.$('o_optInsta').disabled = 'disabled';
            AlternaTipoObras();

            Select.Show(Selector.$('o_artista'), gridObras.getCellText(codigo, 12));

            getObrasArtista(false);
            Select.Show(Selector.$('o_obra'), gridObras.getCellText(codigo, 11));

            getTamanhosObras(false);
            Select.Show(Selector.$('o_tamanho'), gridObras.getCellText(codigo, 13));

            Select.Show(Selector.$('o_acabamento'), gridObras.getCellText(codigo, 14));

            Selector.$('o_altura').value = gridObras.getCellText(codigo, 15);
            Selector.$('o_largura').value = gridObras.getCellText(codigo, 16);
            Selector.$('o_tiragem').value = gridObras.getCellText(codigo, 22);
            Selector.$('o_qtdeVendidos').value = gridObras.getCellText(codigo, 23);
            Selector.$('o_estrelas').value = gridObras.getCellText(codigo, 24);

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 17);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 19);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 20);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 6);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 7);
            Selector.$('o_imagem').src = gridObras.getCellText(codigo, 25);

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 26) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 26);
        }
        else {
            Selector.$('o_optInsta').checked = 'checked';
            Selector.$('o_optPhoto').disabled = 'disabled';
            AlternaTipoObras();

            getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);
            Selector.$('o_tamanhoI').name = gridObras.getCellText(codigo, 11);
            Select.Show(Selector.$('o_tamanhoI'), gridObras.getCellText(codigo, 11));

            Select.Show(Selector.$('o_acabamentoI'), gridObras.getCellText(codigo, 12));

            Selector.$('o_alturaI').value = gridObras.getCellText(codigo, 13);
            Selector.$('o_larguraI').value = gridObras.getCellText(codigo, 14);

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 19);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 20);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 22);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 5);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 24);
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 25));
            Selector.$('o_imagem').src = 'imagens/instaarts/mini_' + gridObras.getCellText(codigo, 25);

            //Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 26) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            //Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 26);
        }
    } else {
        getArtistas(Selector.$('o_artista'), 'Selecione um artista', true);
        Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', 0);
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', 0);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', true, 'p');

        getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', true);
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', true, 'i');

        AlternaTipoObras();
    }

    Selector.$('o_artista').focus();
}

function getDetalhesAcabamento() {

    var valor = Selector.$('o_valor');
    var valorTotal = Selector.$('o_valorTotal');

    if (Selector.$('o_optPhoto').checked) {

        if (Selector.$('o_acabamento').value !== Selector.$('o_acabamento').name) {
            Selector.$('o_acabamento').name = Selector.$('o_acabamento').value;
        }
        else {
            return;
        }

        var artista = Selector.$('o_artista');
        var obra = Selector.$('o_obra');
        var tamanho = Selector.$('o_tamanho');
        var acabamento = Selector.$('o_acabamento');

        var altura = Selector.$('o_altura');
        var largura = Selector.$('o_largura');
        var estrelas = Selector.$('o_estrelas');

        if (artista.selectedIndex <= 0 || obra.selectedIndex <= 0 ||
                tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {

            valor.value = '';
            valorTotal.value = '';
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDetalhesAcabamento';
        p += '&idArtista=' + artista.value;
        p += '&idObra=' + obra.value;
        p += '&idObraTamanho=' + tamanho.value;
        p += '&idAcabamento=' + acabamento.value;
        p += '&altura=' + altura.value;
        p += '&largura=' + largura.value;
        p += '&estrelas=' + estrelas.value;
        p += '&item=' + (Selector.$('o_optPhoto').checked ? 'p' : 'i');

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            valor.value = json.valorObra;
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            TotalizaObras(true, false, false, false);
            Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    } else {

        var tamanho = Selector.$('o_tamanhoI');
        var acabamento = Selector.$('o_acabamentoI');

        if (tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {
            valor.value = '';
            valorTotal.value = '';
            return;
        }

        var altura = Selector.$('o_alturaI');
        var largura = Selector.$('o_larguraI');

        if (Number.parseFloat(altura.value) <= 0) {
            MostrarMsg('Por favor, informe a altura da obra para que seja calculado o valor', 'o_alturaI');
            Selector.$('o_acabamentoI').selectedIndex = 0;
            return;
        }

        if (Number.parseFloat(largura.value) <= 0) {
            MostrarMsg('Por favor, informe a largura da obra para que seja calculado o valor', 'o_larguraI');
            Selector.$('o_acabamentoI').selectedIndex = 0;
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDetalhesAcabamento';
        p += '&idObraTamanho=' + tamanho.value;
        p += '&idAcabamento=' + acabamento.value;
        p += '&altura=' + altura.value;
        p += '&largura=' + largura.value;
        p += '&item=' + (Selector.$('o_optPhoto').checked ? 'p' : 'i');

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            if (json.status != 'OK') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            valor.value = json.valorObra;
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            TotalizaObras(true, false, false, false);
            Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
}

function TotalizaObras(is_qtd, is_percDesconto, is_valorDesconto, is_valorAcrescimo) {
    //FAZER A TOTALIZA OBRA
    var total = Number.parseFloat(Selector.$('o_valor').value) * Number.parseFloat(Selector.$('o_qtde').value);

    var percDesconto = Number.parseFloat(Selector.$('o_percDesconto').value);
    var valorDesconto = Number.parseFloat(Selector.$('o_valorDesconto').value);

    var valorAcrescimo = Number.parseFloat(Selector.$('o_valorAcrescimo').value);

    if (total <= 0) {
        return;
    }

    if (is_qtd || is_percDesconto) {
        if (percDesconto > 0) {
            if (percDesconto > 100) {
                Selector.$('o_percDesconto').value = '100,00';
                percDesconto = 100;
            }

            Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total) * (percDesconto / 100));
        }
        else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    if (is_valorDesconto) {
        if (valorDesconto > 0) {
            if (valorDesconto > (total)) {
                Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total));
                valorDesconto = total;
            }
            Selector.$('o_percDesconto').value = Number.FormatDinheiro((valorDesconto / (total)) * 100);
        }
        else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    if (is_valorAcrescimo) {
        if (valorAcrescimo > 0) {
            if (valorAcrescimo > (total)) {
                Selector.$('o_valorAcrescimo').value = Number.FormatDinheiro((total));
                valorAcrescimo = total;
            }
        }
        else {
            Selector.$('o_valorAcrescimo').value = '';
        }
    }

    Selector.$('o_valorTotal').value = Number.FormatDinheiro((total) - Number.parseFloat(Selector.$('o_valorDesconto').value) + Number.parseFloat(Selector.$('o_valorAcrescimo').value));
}

function AlternaTipoObras() {

    var scrollX, scrollY;
    if (document.all) {
        if (!document.documentElement.scrollLeft)
            scrollX = document.body.scrollLeft;
        else
            scrollX = document.documentElement.scrollLeft;

        if (!document.documentElement.scrollTop)
            scrollY = document.body.scrollTop;
        else
            scrollY = document.documentElement.scrollTop;
    } else {
        scrollX = window.pageXOffset;
        scrollY = window.pageYOffset;
    }

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';

        Selector.$('divCadastro').style.height = "505px";

        Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (505 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";

        Selector.$('o_artista').focus();
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';

        Selector.$('divCadastro').style.height = "480px";

        Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (460 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";

        Selector.$('o_tamanhoI').focus();
        Selector.$('divIncluirImagem').style.display = 'block';
    }
}

function IncluirObra(linha) {

    if (Selector.$('o_optPhoto').checked) {
        if (Selector.$('o_artista').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um artista', 'o_artista');
            return;
        }

        if (Selector.$('o_obra').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione uma obra', 'o_obra');
            return;
        }

        if (Selector.$('o_tamanho').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um tamanho', 'o_tamanho');
            return;
        }

        if (Selector.$('o_acabamento').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um acabamento', 'o_acabamento');
            return;
        }
    }

    if (Selector.$('o_optInsta').checked) {
        if (Selector.$('o_tamanhoI').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um tamanho', 'o_tamanho');
            return;
        }

        if (Selector.$('o_acabamentoI').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um acabamento', 'o_acabamento');
            return;
        }
    }

    if (Number.parseFloat(Selector.$('o_valorTotal').value) <= 0) {
        MostrarMsg('Por favor, verifique o valor total da obra', 'o_artista');
        return;
    }

    var tipo = 0;
    var nomeTipo = '';
    var photoArts = Selector.$('o_optPhoto').checked;

    if (photoArts) {
        nomeTipo = 'PhotoArts';
        tipo = 1;
    }
    else {
        nomeTipo = 'InstaArts';
        tipo = 2;
    }

    if (linha >= 0) {
        gridObras.setCellText(linha, 0, nomeTipo);
        gridObras.setCellText(linha, 1, (photoArts ? Select.GetText(Selector.$('o_obra')) : '- - -'));
        gridObras.setCellText(linha, 2, (photoArts ? Select.GetText(Selector.$('o_artista')) : '- - -'));
        gridObras.setCellText(linha, 3, (photoArts ? Select.GetText(Selector.$('o_tamanho')) : Select.GetText(Selector.$('o_tamanhoI'))));
        gridObras.setCellText(linha, 4, (photoArts ? Select.GetText(Selector.$('o_acabamento')) : Select.GetText(Selector.$('o_acabamentoI'))));
        gridObras.setCellText(linha, 5, Selector.$('o_valorTotal').value);
        //OCULTAS        
        gridObras.setCellText(linha, 8, tipo);
        gridObras.setCellText(linha, 9, (photoArts ? Selector.$('o_artista').value : '0'));
        gridObras.setCellText(linha, 10, (photoArts ? Selector.$('o_obra').value : '0'));
        gridObras.setCellText(linha, 11, (photoArts ? Selector.$('o_tamanho').value : Selector.$('o_tamanhoI').value));
        gridObras.setCellText(linha, 12, (photoArts ? Selector.$('o_acabamento').value : Selector.$('o_acabamentoI').value));
        gridObras.setCellText(linha, 13, (photoArts ? Selector.$('o_altura').value : Selector.$('o_alturaI').value));
        gridObras.setCellText(linha, 14, (photoArts ? Selector.$('o_largura').value : Selector.$('o_larguraI').value));
        gridObras.setCellText(linha, 15, Selector.$('o_tiragem').value);
        gridObras.setCellText(linha, 16, Selector.$('o_qtdeVendidos').value);
        gridObras.setCellText(linha, 17, Selector.$('o_estrelas').value);
        gridObras.setCellText(linha, 18, Selector.$('o_valor').value);
        gridObras.setCellText(linha, 19, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 20, Selector.$('o_percDesconto').value);
        gridObras.setCellText(linha, 21, Selector.$('o_valorDesconto').value);
        gridObras.setCellText(linha, 22, Selector.$('o_valorAcrescimo').value);
        gridObras.setCellText(linha, 23, Selector.$('o_valorTotal').value);
        gridObras.setCellText(linha, 24, Selector.$('o_obs').value);
        gridObras.setCellText(linha, 25, Selector.$('o_imagem').getAttribute('name'));
        //gridObras.setCellText(linha, 26, Selector.$('o_lblPeso').name);
    }
    else {
        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        gridObras.addRow([
            DOM.newText(nomeTipo),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_obra')) : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_artista')) : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_tamanho')) : Select.GetText(Selector.$('o_tamanhoI')))),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_acabamento')) : Select.GetText(Selector.$('o_acabamentoI')))),
            DOM.newText(Selector.$('o_valorTotal').value),
            editar,
            excluir,
            //OCULTOS
            DOM.newText(tipo),
            DOM.newText((photoArts ? Selector.$('o_artista').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_obra').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_tamanho').value : Selector.$('o_tamanhoI').value)),
            DOM.newText((photoArts ? Selector.$('o_acabamento').value : Selector.$('o_acabamentoI').value)),
            DOM.newText((photoArts ? Selector.$('o_altura').value : Selector.$('o_alturaI').value)),
            DOM.newText((photoArts ? Selector.$('o_largura').value : Selector.$('o_larguraI').value)),
            DOM.newText(Selector.$('o_tiragem').value),
            DOM.newText(Selector.$('o_qtdeVendidos').value),
            DOM.newText(Selector.$('o_estrelas').value),
            DOM.newText(Selector.$('o_valor').value),
            DOM.newText(Selector.$('o_qtde').value),
            DOM.newText(Selector.$('o_percDesconto').value),
            DOM.newText(Selector.$('o_valorDesconto').value),
            DOM.newText(Selector.$('o_valorAcrescimo').value),
            DOM.newText(Selector.$('o_valorTotal').value),
            DOM.newText(Selector.$('o_obs').value),
            DOM.newText(Selector.$('o_imagem').getAttribute('name'))
                    /*DOM.newText((photoArts ? Selector.$('o_tiragem').value : '0')),
                     DOM.newText((photoArts ? Selector.$('o_qtdeVendidos').value : '0')),
                     DOM.newText((photoArts ? Selector.$('o_estrelas').value : '0')),
                     DOM.newText(Selector.$('o_lblPeso').name)*/
        ]);
    }

    var cor = false;
    for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {
        gridObras.getCell(i, 0).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(i, 1).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 2).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 5).setAttribute('style', 'text-align:center;');
        gridObras.getCell(i, 6).setAttribute('style', 'text-align:right;');
        gridObras.getCell(i, 7).setAttribute('style', 'text-align:left;');

        gridObras.getCell(i, 8).setAttribute('style', 'text-align:center; width:20px');
        gridObras.getCell(i, 9).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);
    gridObras.hiddenCol(19);
    gridObras.hiddenCol(20);
    gridObras.hiddenCol(21);
    gridObras.hiddenCol(22);
    gridObras.hiddenCol(23);
    gridObras.hiddenCol(24);
    gridObras.hiddenCol(25);
    //gridObras.hiddenCol(26);

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    dialogoCadastro.Close();
    Totaliza(true, false, false, false, false);
}

function Totaliza(is_grids, is_frete, is_acrescimo, is_percDesconto, is_valorDesconto) {

    var total1 = Number.getFloat(gridObras.SumCol(5));
    Selector.$('valor').value = Number.FormatDinheiro(total1);

    var valorFrete = Number.parseFloat(Selector.$('frete').value);
    var valorAcrescimo = Number.parseFloat(Selector.$('acrescimo').value);
    var percDesconto = Number.parseFloat(Selector.$('percDesconto').value);
    var valorDesconto = Number.parseFloat(Selector.$('valorDesconto').value);

    if (total1 <= 0) {
        return;
    }

    if (is_grids || is_percDesconto) {
        if (percDesconto > 0) {
            if (percDesconto > 100) {
                Selector.$('percDesconto').value = '100,00';
                percDesconto = 100;
            }

            Selector.$('valorDesconto').value = Number.FormatDinheiro((total1) * (percDesconto / 100));
        }
        else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    if (is_valorDesconto) {
        if (valorDesconto > 0) {
            if (valorDesconto > (total1)) {
                Selector.$('valorDesconto').value = Number.FormatDinheiro((total1));
                valorDesconto = total1;
            }
            Selector.$('percDesconto').value = Number.FormatDinheiro((valorDesconto / (total1)) * 100);
        }
        else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    Selector.$('valorTotal').value = Number.FormatDinheiro((total1 - Number.parseFloat(Selector.$('valorDesconto').value)) + valorFrete + valorAcrescimo);
}

function getObrasArtista(assincrona) {

    Select.Clear(Selector.$('o_obra'));

    if (Selector.$('o_artista').value === '0') {
        getDadosTamanho('p');
        Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregas', '0', '');
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', assincrona);
    var p = 'action=getObras';
    p += '&idArtista=' + Selector.$('o_artista').value;

    if (assincrona) {

        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_obra'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
            Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
        };

        Select.AddItem(Selector.$('o_obra'), 'Carregando obras...', '0', '');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
        Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
    }
}

function getTamanhosObras(assincrona) {

    if (Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {

        Select.Clear(Selector.$('o_tamanho'));
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        return;

    }

    var ajax = new Ajax('POST', 'php/propostas.php', assincrona);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + Selector.$('o_obra').value;

    if (assincrona) {

        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_tamanho'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_imagem').src = json[0].imagem;
            Selector.$('o_imagem').setAttribute('style', 'max-width: 170px; max-height:100px');

            Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');

        };

        Select.AddItem(Selector.$('o_tamanho'), 'Carregando tamanhos...', '0', '');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Selector.$('o_imagem').src = json[0].imagem;
        Selector.$('o_imagem').setAttribute('style', 'max-width: 170px; max-height:100px');

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
    }
}

function getDadosTamanho(item) {

    if (item === 'p') {
        if (Selector.$('o_tamanho').value !== Selector.$('o_tamanho').name) {
            Selector.$('o_tamanho').name = Selector.$('o_tamanho').value;

            Selector.$('o_altura').value = '';
            Selector.$('o_largura').value = '';
            Selector.$('o_tiragem').value = '';
            Selector.$('o_qtdeVendidos').value = '';
            Selector.$('o_estrelas').value = '';

            Selector.$('o_valor').value = '';
            Selector.$('o_qtde').value = '1';
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
            Selector.$('o_valorAcrescimo').value = '';

            Selector.$('o_valorTotal').value = '';
            Selector.$('o_lblPeso').innerHTML = '';
        }
        else {
            return;
        }

        if (Selector.$('o_tamanho').value === '0' || Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {

            if (Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {
                Select.Clear(Selector.$('o_tamanho'));
                Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
            }

            Selector.$('o_tamanho').value = '0';
            Selector.$('o_altura').value = '';
            Selector.$('o_largura').value = '';
            Selector.$('o_tiragem').value = '';
            Selector.$('o_qtdeVendidos').value = '';
            Selector.$('o_estrelas').value = '';
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDadosTamanho';
        p += '&idArtistaObraTamanho=' + Selector.$('o_tamanho').value;
        p += '&item=' + item;

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            Selector.$('o_altura').value = json.altura;
            Selector.$('o_largura').value = json.largura;
            Selector.$('o_tiragem').value = json.tiragemMaxima;
            Selector.$('o_qtdeVendidos').value = json.tiragemAtual;
            Selector.$('o_estrelas').value = json.estrelas;

            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_acabamento').value = 0;
        };

        ajax.Request(p);
    }
    if (item === 'i') {
        if (Selector.$('o_tamanhoI').value !== Selector.$('o_tamanhoI').name) {
            Selector.$('o_tamanhoI').name = Selector.$('o_tamanhoI').value;

            Selector.$('o_alturaI').value = '';
            Selector.$('o_larguraI').value = '';

            Selector.$('o_valor').value = '';
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
            Selector.$('o_valorAcrescimo').value = '';
            Selector.$('o_valorTotal').value = '';
            Selector.$('o_lblPeso').innerHTML = '';
        }
        else {
            return;
        }

        if (Selector.$('o_tamanhoI').value === '0') {
            Selector.$('o_acabamentoI').selectedIndex = 0;
            Selector.$('o_acabamentoI').value = 0;
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDadosTamanho';
        p += '&idTamanho=' + Selector.$('o_tamanhoI').value;
        p += '&item=' + item;

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === 0) {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            if (Number.parseFloat(json.altura) <= 0) {
                Selector.$('o_alturaI').style.backgroundColor = "#FFF";
                Selector.$('o_alturaI').removeAttribute("readonly");
                Selector.$('o_alturaI').value = json.altura;

                Mask.setMoeda(Selector.$('o_alturaI'));
            }
            else {
                Selector.$('o_alturaI').style.backgroundColor = "#F5F5F5";
                Selector.$('o_alturaI').setAttribute("readonly", "readonly");
                Selector.$('o_alturaI').value = json.altura;
            }

            if (Number.parseFloat(json.largura) <= 0) {
                Selector.$('o_larguraI').style.backgroundColor = "#FFF";
                Selector.$('o_larguraI').removeAttribute("readonly");
                Selector.$('o_larguraI').value = json.largura;

                Mask.setMoeda(Selector.$('o_larguraI'));
            }
            else {
                Selector.$('o_larguraI').style.backgroundColor = "#F5F5F5";
                Selector.$('o_larguraI').setAttribute("readonly", "readonly");
                Selector.$('o_larguraI').value = json.largura;
            }

            if (Number.parseFloat(json.altura) <= 0) {
                Selector.$('o_alturaI').select();
            }
            else {
                if (Number.parseFloat(json.largura) <= 0) {
                    Selector.$('o_larguraI').select();
                }
            }

            Selector.$('o_acabamentoI').selectedIndex = 0;
            Selector.$('o_acabamentoI').value = 0;
        };

        ajax.Request(p);

    }
}

function ExcluirObraAux(linha, idObra) {

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta obra?", "OK", "ExcluirObra(" + linha + ", " + idObra + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirObra(linha, idObra) {

    if (botNovo.name !== 'NovoTrue' && botModi.name !== 'ModiTrue')
        return;

    if (gridPagamento.getRowCount() > 0) {
        MostrarMsg("Não é possível excluir a obra, pois o pagamento do pedido foi gerado.", "");
        return;
    }

    mensagemExcluirObra.Close();
    gridObras.deleteRow(linha);
    var cor = false;

    for (var i = 0; i < gridObras.getRowCount(); i++) {

        gridObras.getCellObject(i, 6).setAttribute('onclick', 'AdicionarObra(' + i + ', ' + gridObras.getRowData(i) + ')');
        gridObras.getCellObject(i, 7).setAttribute('onclick', 'ExcluirObra(' + i + ', ' + gridObras.getRowData(i) + ')');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");
        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

    if (idObra > 0) {

        var ajax = new Ajax('POST', 'php/pedidos.php', false);
        var p = 'action=ExcluirObra';
        p += '&idPedido=' + codigoAtual;
        p += '&idObra=' + idObra;
        ajax.Request(p);
    }

    Selector.$('valor').value = Number.FormatMoeda(gridObras.SumCol(5));
    Selector.$('valorTotal').value = Number.FormatMoeda(gridObras.SumCol(5));
    getPercentualComissaoMarchand();
    CalcularValorTotal();
}

function CalculaPrevisaoEntrega(dataAtual) {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=CalculaPrevisaoEntrega';
    p += '&dataAtual=' + dataAtual;
    ajax.Request(p);

    return ajax.getResponseText();
}

function CalcularValorTotal() {

    var valor = Number.parseFloat(Selector.$('valor').value);
    var valorFrete = Number.parseFloat(Selector.$('frete').value);
    var valorAcrescimo = Number.parseFloat(Selector.$('acrescimo').value);
    var valorDesconto = 0;
    var valorTotal = 0;

    Selector.$('percDesconto').onblur = function () {

        if (Selector.$('percDesconto').value.trim() === ',' || Selector.$('percDesconto').value.trim() === '' || Selector.$('percDesconto').value.trim() === '0') {
            Selector.$('percDesconto').value = '0';
            Selector.$('valorDesconto').value = '0,00';
        }

        if (Selector.$('percDesconto').value > 100 || Selector.$('percDesconto').value > 100, 00) {
            Selector.$('percDesconto').value = '100';
        }

        Selector.$('valorDesconto').value = '';
        valorDesconto = ((valor * Number.parseFloat(Selector.$('percDesconto').value)) / 100);
        Selector.$('valorDesconto').value = Number.FormatDinheiro(valorDesconto);

        valorTotal = ((valor + valorFrete + valorAcrescimo) - valorDesconto);
        Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
        valorComissaoMarchand = ((valorTotal * Number.parseFloat(percentualComissaoMarchand)) / 100);
        Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
    }

    Selector.$('valorDesconto').onblur = function () {

        if (Selector.$('valorDesconto').value.trim() === ',' || Selector.$('valorDesconto').value.trim() === '' || Selector.$('valorDesconto').value.trim() === '0') {
            Selector.$('valorDesconto').value = '0,00';
            Selector.$('percDesconto').value = '0';
        }

        if (Number.parseFloat(Selector.$('valorDesconto').value) > valor) {
            MostrarMsg("O valor de desconto não pode ser maior que o valor do pedido.", 'valorDesconto');
            return;
        }

        valorDesconto = (Number.ValorE(Selector.$('valorDesconto').value) * 100) / valor;
        Selector.$('percDesconto').value = valorDesconto.toFixed(0);

        valorTotal = ((valor + valorFrete + valorAcrescimo) - valorDesconto);
        Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
        valorComissaoMarchand = ((valorTotal * Number.parseFloat(percentualComissaoMarchand)) / 100);
        Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
    }

    valorTotal = ((valor + valorFrete + valorAcrescimo) - Number.parseFloat(Selector.$('valorDesconto').value));
    Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    valorComissaoMarchand = ((valorTotal * Number.parseFloat(percentualComissaoMarchand)) / 100);
    Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
}

function getPercentualComissaoMarchand() {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=getPercentualComissaoMarchand';
    p += '&idMarchand=' + Selector.$('vendedor').value;
    
    ajax.Request(p);

    if (ajax.getResponseText() !== '0') {
        percentualComissaoMarchand = ajax.getResponseText();
        
        Selector.$('comissaoVendedor').value = "(" + percentualComissaoMarchand + "%)";

        if (Selector.$('valorTotal').value.trim() !== '' || Selector.$('valorTotal').value.trim() !== ',') {
            valorComissaoMarchand = ((Number.parseFloat(Selector.$('valorTotal').value) * Number.parseFloat(percentualComissaoMarchand)) / 100);
            Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
        }
    }
}

function PromptStatus() {

    if (codigoAtual <= 0) {
        MostrarMsg("Selecione um registro para visulizar o histórico de status ou alterar um status.", '');
        return;
    }

    if (!isElement('div', 'promptStatus')) {
        var promptStatus = DOM.newElement('div', 'promptStatus');
        document.body.appendChild(promptStatus);
    }

    var promptStatus = Selector.$('promptStatus');
    promptStatus.innerHTML = '';

    var lblNovoStatus = DOM.newElement('label');
    lblNovoStatus.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNovoStatus.innerHTML = 'Novo Status';
    promptStatus.appendChild(lblNovoStatus);

    var cmbStatus = DOM.newElement('select', 'cmbStatus');
    cmbStatus.setAttribute('style', 'width:365px; margin-left:10px;');
    cmbStatus.setAttribute('class', 'combo_cinzafoco');
    promptStatus.appendChild(cmbStatus);

    promptStatus.innerHTML += "<br><br>";

    var cmdAlterar = DOM.newElement('button', 'btAlterarStatus');
    cmdAlterar.setAttribute('style', 'float:right;');
    cmdAlterar.setAttribute('class', 'botaosimplesfoco');
    cmdAlterar.setAttribute('onclick', 'AlterarStatusPedido();');
    cmdAlterar.innerHTML = 'Alterar';
    promptStatus.appendChild(cmdAlterar);

    promptStatus.innerHTML += "<br><br>";

    var lblHistorico = DOM.newElement('label');
    lblHistorico.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblHistorico.setAttribute('style', 'font-size:15px;');
    lblHistorico.innerHTML = 'Histórico';
    promptStatus.appendChild(lblHistorico);

    var tbPesquisa = DOM.newElement('div', 'tbPesquisa');
    tbPesquisa.setAttribute('style', 'height:300px; margin-top:5px; overflow:auto;');
    promptStatus.appendChild(tbPesquisa);

    dialogoStatus = new caixaDialogo('promptStatus', 450, 500, 'padrao/', 130);
    dialogoStatus.Show();

    getStatusPedido(Selector.$('cmbStatus'));

    gridStatus = new Table('gridStatus');
    gridStatus.table.setAttribute('cellpadding', '2');
    gridStatus.table.setAttribute('cellspacing', '0');
    gridStatus.table.setAttribute('class', 'tabela_cinza_foco');

    gridStatus.addHeader([
        DOM.newText('Data'),
        DOM.newText('Status'),
        DOM.newText('Responsável')
    ]);

    Selector.$('tbPesquisa').appendChild(gridStatus.table);

    MostraHistoricoStatusPedido();
}

function getStatusPedido(cmb) {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=getStatusPedido';
    p += '&idPedido=' + codigoAtual;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        Select.AddItem(cmb, 'Não foi encontrado nenhum status', 0);
        return;
    }

    Select.AddItem(cmb, "Selecione um status", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVStatus', 'status');

    var json = JSON.parse(ajax.getResponseText());
    Select.Show(cmb, json[0].idUltimoStatus);
}

function MostraHistoricoStatusPedido() {

    gridStatus.clearRows();

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=MostraHistoricoStatusPedido';
    p += '&idPedido=' + codigoAtual;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText());
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        gridStatus.addRow([
            DOM.newText(json[i].dataCadastro),
            DOM.newText(json[i].descricaoStatus),
            DOM.newText(json[i].responsavel)
        ]);

        gridStatus.setRowData(gridStatus.getRowCount() - 1, json[i].idVendaStatus);
        gridStatus.getCell(gridStatus.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:90px;');
        gridStatus.getCell(gridStatus.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridStatus.getCell(gridStatus.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');

        if (cor) {
            cor = false;
            gridStatus.setRowBackgroundColor(gridStatus.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridStatus.setRowBackgroundColor(gridStatus.getRowCount() - 1, "#FFF");
        }
    }
}

function AlterarStatusPedido() {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=AlterarStatusPedido';
    p += '&idPedido=' + codigoAtual;
    p += '&idStatus=' + Selector.$('cmbStatus').value;
    p += '&descricaoStatus=' + Select.GetText(Selector.$('cmbStatus'));
    ajax.Request(p);

    if (ajax.getResponseText() !== '0') {
        MostraHistoricoStatusPedido();
    }
}

function PromptGerarPagamento() {

    if (gridPagamento.getRowCount() > 0) {
        MostrarMsg("As parcelas já foram geradas.", '');
        return;
    }

    if (!isElement('div', 'promptGerarPagamento')) {
        var promptGerarPagamento = DOM.newElement('div', 'promptGerarPagamento');
        document.body.appendChild(promptGerarPagamento);
    }

    var promptGerarPagamento = Selector.$('promptGerarPagamento');
    promptGerarPagamento.innerHTML = '';

    var lblValorTotal = DOM.newElement('label');
    lblValorTotal.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorTotal.innerHTML = 'Valor Total';
    promptGerarPagamento.appendChild(lblValorTotal);

    var txtValorTotal = DOM.newElement('text', 'valorTotal2');
    txtValorTotal.setAttribute('style', 'width:170px; margin-left:10px; background-color:#F5F5F5; font-size:14px; font-weight: bold; text-align: center;');
    txtValorTotal.setAttribute('class', 'textbox_cinzafoco');
    txtValorTotal.disabled = true;
    promptGerarPagamento.appendChild(txtValorTotal);

    var lblQtdParcelas = DOM.newElement('label');
    lblQtdParcelas.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblQtdParcelas.setAttribute('style', 'margin-left:10px;');
    lblQtdParcelas.innerHTML = 'Qtde. Parcelas';
    promptGerarPagamento.appendChild(lblQtdParcelas);

    var cmbQtdParcelas = DOM.newElement('select', 'qtdParcelas');
    cmbQtdParcelas.setAttribute('style', 'width:105px; margin-left:10px;');
    cmbQtdParcelas.setAttribute('class', 'combo_cinzafoco');
    cmbQtdParcelas.setAttribute('onchange', 'CalcularValorParcela();');
    promptGerarPagamento.appendChild(cmbQtdParcelas);

    var lblValorParcela = DOM.newElement('label');
    lblValorParcela.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorParcela.innerHTML = 'Valor Parcela';
    promptGerarPagamento.appendChild(lblValorParcela);

    var txtValorParcela = DOM.newElement('text', 'valorParcela');
    txtValorParcela.setAttribute('style', 'width:160px; margin-left:10px; background-color:#F5F5F5; font-size:14px; font-weight: bold; text-align: center;');
    txtValorParcela.setAttribute('class', 'textbox_cinzafoco');
    txtValorParcela.disabled = true;
    promptGerarPagamento.appendChild(txtValorParcela);

    var lblPrimeiroVencimento = DOM.newElement('label');
    lblPrimeiroVencimento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblPrimeiroVencimento.setAttribute('style', 'margin-left:10px;');
    lblPrimeiroVencimento.innerHTML = '1° Vencimento';
    promptGerarPagamento.appendChild(lblPrimeiroVencimento);

    var txtPrimeiroVencimento = DOM.newElement('text', 'primeiroVencimento');
    txtPrimeiroVencimento.setAttribute('style', 'width:100px; margin-left:10px;');
    txtPrimeiroVencimento.setAttribute('class', 'textbox_cinzafoco');
    promptGerarPagamento.appendChild(txtPrimeiroVencimento);

    promptGerarPagamento.innerHTML += "<br><br>";

    var chkPagamentoEfetuado = DOM.newElement('checkbox', 'pagamentoEfetuado');
    chkPagamentoEfetuado.setAttribute('onclick', 'PagamentoEfetuado();');
    promptGerarPagamento.appendChild(chkPagamentoEfetuado);

    var lblPagamentoEfetuado = DOM.newElement('label');
    lblPagamentoEfetuado.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblPagamentoEfetuado.innerHTML = 'Pagamento Efetuado';
    promptGerarPagamento.appendChild(lblPagamentoEfetuado);

    promptGerarPagamento.innerHTML += "<br><br>";

    var lblFormaPagamento = DOM.newElement('label', 'lblFormaPagamento');
    lblFormaPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblFormaPagamento.setAttribute('style', 'display:none;');
    lblFormaPagamento.innerHTML = 'Forma Pagamento';
    promptGerarPagamento.appendChild(lblFormaPagamento);

    var cmbFormaPagamento = DOM.newElement('select', 'formaPagamento');
    cmbFormaPagamento.setAttribute('style', 'width:330px; margin-left:10px; display:none');
    cmbFormaPagamento.setAttribute('class', 'combo_cinzafoco');
    promptGerarPagamento.appendChild(cmbFormaPagamento);

    promptGerarPagamento.innerHTML += "<br><br>";

    var cmdGerar = DOM.newElement('button', 'btGerarParcelas');
    cmdGerar.setAttribute('style', 'float:right;');
    cmdGerar.setAttribute('class', 'botaosimplesfoco');
    cmdGerar.setAttribute('onclick', 'GerarParcelas();');
    cmdGerar.innerHTML = 'Gerar';
    promptGerarPagamento.appendChild(cmdGerar);

    dialogoGerarPagamento = new caixaDialogo('promptGerarPagamento', 270, 500, 'padrao/', 130);
    dialogoGerarPagamento.Show();

    for (var i = 1; i < 11; i++) {

        Select.AddItem(Selector.$('qtdParcelas'), i + "x", i);
    }

    Mask.setData(Selector.$('primeiroVencimento'));
    getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", true);

    Selector.$('valorTotal2').value = Selector.$('valorTotal').value;
    CalcularValorParcela();
}

function PagamentoEfetuado() {

    if (Selector.$('pagamentoEfetuado').checked) {
        Selector.$('lblFormaPagamento').style.display = 'inline-block';
        Selector.$('formaPagamento').style.display = 'inline-block';
    } else {
        Selector.$('lblFormaPagamento').style.display = 'none';
        Selector.$('formaPagamento').style.display = 'none';
    }
}

function CalcularValorParcela() {

    var valorParcela = (Number.parseFloat(Selector.$('valorTotal2').value) / parseInt(Selector.$('qtdParcelas').value));

    Selector.$('valorParcela').value = Number.FormatMoeda(valorParcela.toFixed(2));
}

function GerarParcelas() {

    if (Selector.$('primeiroVencimento').value.trim() === '') {
        MostrarMsg("Por favor, preencha o campo 1° Vencimento", 'primeiroVencimento');
        return;
    }

    var status;
    var excluir;
    var cor = false;

    for (var i = 1; i <= parseInt(Selector.$('qtdParcelas').value); i++) {

        if (Selector.$('pagamentoEfetuado').checked) {

            status = DOM.newElement('label');
            status.innerHTML = "Pago";

            var divStatus = DOM.newElement('div');
            divStatus.appendChild(status);

            idFormaPagamento = Selector.$('formaPagamento').value;
        } else {

            status = DOM.newElement('label');
            status.innerHTML = "Em aberto";

            var imgStatus = DOM.newElement('img');
            imgStatus.src = 'imagens/money2.png';
            imgStatus.setAttribute('style', 'margin-left:10px; width:14px; height:14px; cursor:pointer;');
            imgStatus.setAttribute('title', 'Visualizar Pagamento');
            imgStatus.setAttribute('onclick', 'PromptPagamento()');

            var divStatus = DOM.newElement('div');
            divStatus.appendChild(status);
            //divStatus.appendChild(imgStatus);
        }

        excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir Parcela');
        excluir.setAttribute('style', 'cursor:pointer;');
        excluir.setAttribute('onclick', 'ExcluirParcela(' + gridPagamento.getRowCount() + ', 0);');

        gridPagamento.addRow([
            DOM.newText(i),
            DOM.newText(Selector.$('valorParcela').value),
            DOM.newText(SomarMes(Selector.$('primeiroVencimento').value, i - 1)),
            divStatus,
            excluir,
            DOM.newText(idFormaPagamento),
        ]);

        gridPagamento.hiddenCol(5);

        gridPagamento.setRowData(gridPagamento.getRowCount() - 1, 0);
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:70px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'text-align:right;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'text-align:left; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:20px;');

        if (cor) {
            cor = false;
            gridPagamento.setRowBackgroundColor(gridPagamento.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridPagamento.setRowBackgroundColor(gridPagamento.getRowCount() - 1, "#FFF");
        }
    }

    dialogoGerarPagamento.Close();
}

function ExcluirParcela(linha, idParcela) {

    if (botNovo.name !== 'NovoTrue' && botModi.name !== 'ModiTrue')
        return;

    if (gridPagamento.getCellText(linha, 5) > 0) {
        MostrarMsg("Não é possível excluir esta parcela, pois ela já está paga.", '');
        return;
    }

    if (confirm("Deseja realmente excluir esta parcela?")) {

        gridPagamento.deleteRow(linha);

        var cor = false;

        for (var i = 0; i < gridPagamento.getRowCount(); i++) {

            gridPagamento.getCellObject(i, 4).setAttribute('onclick', 'ExcluirParcela(' + i + ', ' + gridPagamento.getRowData(i) + ')');

            if (cor) {
                cor = false;
                gridPagamento.setRowBackgroundColor(i, "#F5F5F5");
            } else {
                cor = true;
                gridPagamento.setRowBackgroundColor(i, "#FFF");
            }
        }

        if (idParcela > 0) {

            var ajax = new Ajax('POST', 'php/pedidos.php', false);
            var p = 'action=ExcluirParcela';
            p += '&idPedido=' + codigoAtual;
            p += '&idParcela=' + idParcela;
            ajax.Request(p);
        }
    }
}

function PromptPagarParcela(linha, idParcela, pagar) {

    if (!isElement('div', 'promptPagarParcela')) {
        var promptPagarParcela = DOM.newElement('div', 'promptPagarParcela');
        document.body.appendChild(promptPagarParcela);
    }

    var promptPagarParcela = Selector.$('promptPagarParcela');
    promptPagarParcela.innerHTML = '';

    var lblValorParcela = DOM.newElement('label');
    lblValorParcela.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorParcela.innerHTML = 'Valor Parcela';
    promptPagarParcela.appendChild(lblValorParcela);

    var txtValorParcela = DOM.newElement('text', 'valorParcela');
    txtValorParcela.setAttribute('style', 'width:160px; margin-left:10px; background-color:#F5F5F5; font-size:14px; font-weight: bold; text-align: center;');
    txtValorParcela.setAttribute('class', 'textbox_cinzafoco');
    txtValorParcela.disabled = true;
    promptPagarParcela.appendChild(txtValorParcela);

    promptPagarParcela.innerHTML += "<br><br>";

    var lblFormaPagamento = DOM.newElement('label', 'lblFormaPagamento');
    lblFormaPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblFormaPagamento.innerHTML = 'Forma Pgto.';
    promptPagarParcela.appendChild(lblFormaPagamento);

    var cmbFormaPagamento = DOM.newElement('select', 'formaPagamento');
    cmbFormaPagamento.setAttribute('style', 'width:250px; margin-left:10px;');
    cmbFormaPagamento.setAttribute('class', 'combo_cinzafoco');
    promptPagarParcela.appendChild(cmbFormaPagamento);

    promptPagarParcela.innerHTML += "<br><br>";

    var lblDataPagamento = DOM.newElement('label');
    lblDataPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblDataPagamento.innerHTML = 'Data Pgto.';
    promptPagarParcela.appendChild(lblDataPagamento);

    var txtDataPagamento = DOM.newElement('text', 'dataPagamento');
    txtDataPagamento.setAttribute('style', 'width:100px; margin-left:10px;');
    txtDataPagamento.setAttribute('class', 'textbox_cinzafoco');
    promptPagarParcela.appendChild(txtDataPagamento);

    promptPagarParcela.innerHTML += "<br>";

    var cmdGravar = DOM.newElement('button', 'btGravarPagamento');
    cmdGravar.setAttribute('style', 'float:right;');
    cmdGravar.setAttribute('class', 'botaosimplesfoco');
    cmdGravar.setAttribute('onclick', 'GravarPagamentoParcela(' + idParcela + ')');
    cmdGravar.innerHTML = 'Gravar';
    promptPagarParcela.appendChild(cmdGravar);

    dialogoPagarParcela = new caixaDialogo('promptPagarParcela', 230, 390, 'padrao/', 130);
    dialogoPagarParcela.Show();

    if (pagar) {
        getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", true);
        Selector.$('valorParcela').value = gridPagamento.getCellText(linha, 1);
        Selector.$('dataPagamento').value = Date.GetDate(false);
    } else {
        getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", false);

        var ajax = new Ajax('POST', 'php/pedidos.php', false);
        var p = 'action=getParcela';
        p += '&idParcela=' + idParcela;
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        Selector.$('valorParcela').value = json.valorPago;
        Select.Show(Selector.$('formaPagamento'), json.idFormaPagamento);
        Selector.$('dataPagamento').value = json.dataPagamento;
    }

    Mask.setData(Selector.$('dataPagamento'));
}

function GravarPagamentoParcela(idParcela) {

    if (Selector.$('formaPagamento').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione uma forma de pagamento", 'formaPagamento');
        return;
    }

    if (Selector.$('dataPagamento').value === '') {
        MostrarMsg("Por favor, preencha a data de pagamento", 'dataPagamento');
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=GravarPagamentoParcela';
    p += '&idPedido=' + codigoAtual;
    p += '&idParcela=' + idParcela;
    p += '&valorParcela=' + Selector.$('valorParcela').value;
    p += '&idFormaPagamento=' + Selector.$('formaPagamento').value;
    p += '&dataPagamento=' + Selector.$('dataPagamento').value;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg("Ocorreu um erro ao realizar o pagamento da parcela, tente novamente. Se o problema persistir contate o suporte técnico", '');
        return;
    }

    dialogoPagarParcela.Close();
    Mostra(codigoAtual);
}

function MostraFollowUp() {

    gridFollow.clearRows();

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=MostraFollowUp';
    p += '&codigo=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        var cor = true;

        for (var i = 0; i < json.length; i++) {

            var editar = DOM.newElement('img');
            editar.src = "imagens/modificar.png";
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('style', 'width:15px');
            editar.setAttribute('onclick', 'PromptFollowUp(' + json[i].codigo + ')');

            var excluir = DOM.newElement('img');
            excluir.src = "imagens/lixo.png";
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('style', 'width:15px');
            excluir.setAttribute('onclick', 'ExcluirFollowUp(' + json[i].codigo + ')');

            gridFollow.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].tipo),
                DOM.newText(json[i].obs),
                DOM.newText(json[i].usuario),
                DOM.newText(json[i].retorno.substr(0, 16)),
                editar,
                excluir
            ]);


            gridFollow.setRowData(gridFollow.getRowCount() - 1, json[i].codigo);
            gridFollow.getRow(gridFollow.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 0).setAttribute('style', 'width:100px; text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 1).setAttribute('style', 'max-width:200px;text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 3).setAttribute('style', 'width:180px; text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 4).setAttribute('style', 'width:140px;text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 5).setAttribute('style', 'width:30px;  text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 6).setAttribute('style', 'width:30px;  text-align:center; ');

            if (cor) {
                cor = false;
                gridFollow.setRowBackgroundColor(gridFollow.getRowCount() - 1, "#F5F5F5");

            } else {
                cor = true;
                gridFollow.setRowBackgroundColor(gridFollow.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function PromptFollowUp(codigo) {

    if (codigoAtual <= 0) {
        MostrarMsg("Pesquise um pedido para adicionar um Follow-Up", '');
        return;
    }

    var div = Selector.$("prompt");
    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:block');

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");

    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "*";
    lblast2.setAttribute("style", "color:red;");

    var lblast3 = DOM.newElement('label');
    lblast3.innerHTML = "*";
    lblast3.setAttribute("style", "color:red;");

    var lblnome = DOM.newElement('label');
    lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblnome.appendChild(DOM.newText('Tipo'));

    var txttipo = DOM.newElement('select');
    txttipo.setAttribute('id', 'tiposcontatos');
    txttipo.setAttribute('class', 'combo_cinzafoco');
    txttipo.setAttribute('style', 'width:100%; margin-left:5px;');

    getTiposFollow(txttipo);

    var lbltexto = DOM.newElement('label');
    lbltexto.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lbltexto.appendChild(DOM.newText('Obs'));

    var txttexto = DOM.newElement('textarea');
    txttexto.setAttribute('id', 'obsfollow');
    txttexto.setAttribute('class', 'textbox_cinzafoco');
    txttexto.setAttribute('style', 'width:100%; height:200px; margin-left:5px;');

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast2);
    divform.appendChild(DOM.newText(' '));
    divform.appendChild(txttipo);
    divform.appendChild(lbltexto);
    divform.appendChild(lblast3);
    divform.appendChild(txttexto);

    var btGravar = DOM.newElement('submit');
    btGravar.setAttribute('id', 'botEnviar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.value = 'Gravar';
    btGravar.setAttribute('onclick', 'GravarFollowUp(' + codigo + ');');

    divform.appendChild(DOM.newText(' '));

    divform.innerHTML += "<div style='width:120px; vertical-align:center; display:inline-block'><input id='checkretorno' onclick='mostraRetorno()' type='checkbox'><label class='fonte_Roboto_titulo_normal' for='checkretorno'> Data Retorno</label></div>";

    var txtretorno = DOM.newElement('text');
    txtretorno.setAttribute('id', 'retorno');
    txtretorno.setAttribute('class', 'textbox_cinzafoco');
    txtretorno.setAttribute('style', 'width:110px; vertical-align:center; margin-left:10px;');
    txtretorno.setAttribute('placeholder', 'ex:11/11/2012');

    var txthoraretorno = DOM.newElement('text');
    txthoraretorno.setAttribute('id', 'horaretorno');
    txthoraretorno.setAttribute('class', 'textbox_cinzafoco');
    txthoraretorno.setAttribute('style', 'width:90px; vertical-align:center; margin-left:5px;');
    txthoraretorno.setAttribute('placeholder', 'ex: 08:00');

    var divretorno = DOM.newElement('div', 'divretorno');
    divretorno.setAttribute('style', 'display:inline-block;  vertical-align:middle; width:0px; height:40px; overflow:hidden');
    divform.appendChild(divretorno);

    divretorno.appendChild(txtretorno);
    divretorno.appendChild(txthoraretorno);
    divform.appendChild(btGravar);
    divform.innerHTML += '<br /><br />';

    dialogoFollowUp = new caixaDialogo('prompt', 410, 550, 'padrao/', 140);
    dialogoFollowUp.Show();

    Mask.setData(Selector.$('retorno'));
    Mask.setHora(Selector.$('horaretorno', false));

    if (codigo <= 0) {
        Selector.$('tiposcontatos').focus();
    } else {

        var ajax = new Ajax('POST', 'php/pedidos.php', false);
        ajax.Request('action=getFollowUp&codigo=' + codigo);

        if (ajax.getResponseText() === '0') {
            Selector.$('tiposcontatos').focus();
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Select.Show(Selector.$('tiposcontatos'), json.tipo);
        Selector.$('obsfollow').value = json.obs;

        if (json.retorno !== '0000-00-00' && json.retorno !== "") {
            Selector.$('checkretorno').checked = true;
            Selector.$('retorno').value = json.retorno;
            Selector.$('horaretorno').value = json.horaretorno;
            mostraRetorno();
        }
    }
}

function getTiposFollow(cmb) {

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    ajax.Request('action=getTiposFollow');

    if (ajax.getResponseText() === '0') {
        return;
    }

    Select.AddItem(cmb, "Selecione...", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
}

function mostraRetorno() {

    if (Selector.$('checkretorno').checked) {
        Selector.$('divretorno').style.width = "270px";
    } else {
        Selector.$('divretorno').style.width = "0px";
    }
}

function GravarFollowUp(codigo) {

    if (codigoAtual <= 0)
        return;

    if (Selector.$('tiposcontatos').selectedIndex <= 0) {
        //Selector.$('retorno').focus();
        MostrarMsg("Por favor, selecione o tipo de contato.", 'tiposcontatos');
        return;
    }

    if (Selector.$('obsfollow').value.trim() == "") {
        Selector.$('retorno').focus();
        MostrarMsg("Por favor, preencha o campo de obs.", 'obsfollow');
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = "action=GravarFollowUp";
    p += "&codigo=" + codigo;
    p += "&idPedido=" + codigoAtual;
    p += "&tipo=" + Selector.$('tiposcontatos').value;
    p += "&obs=" + Selector.$('obsfollow').value;
    p += "&checkretorno=" + Selector.$('checkretorno').checked;
    p += "&retorno=" + Selector.$('retorno').value;
    p += "&horaretorno=" + Selector.$('horaretorno').value;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg("Erro ao gravar o follow-up. Se o erro persistir contate o suporte técnico.", '');
        //var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o follow-up. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        //mensagem.Show();
        return;
    } else {
        Selector.$('retorno').style.visibility = "hidden";
        Selector.$('horaretorno').style.visibility = "hidden";
        dialogoFollowUp.Close();
        MostraFollowUp();
    }
}

function ExcluirFollowUp(codigo) {

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este Follow-up?", "SIM", "ExcluirFollowUpAux(" + codigo + ")", true, "");
    mensagemExcluir.Show();
}

function ExcluirFollowUpAux(codigo) {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    ajax.Request('action=ExcluirFollowUP&codigo=' + codigo);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    mensagemExcluir.Close();
    MostraFollowUp();
}

function AnexarImagem() {

    var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
    var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
    var path = '../imagens/instaarts/';
    var funcao = 'ArmazenarPath';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp');
}

function ArmazenarPath(path) {

    ExcluirImagem();

    var vetor = path.split("/");
    var extensao = vetor[vetor.length - 1].split(".");
    var arquivo = vetor[vetor.length - 1];

    dialog.Close();

    Selector.$('o_imagem').setAttribute('name', arquivo);
    Selector.$('o_imagem').setAttribute('src', 'imagens/instaarts/mini_' + arquivo + '');

    GerarMiniaturaImagem();
}

function ExcluirImagem() {

    if (Selector.$('o_imagem').getAttribute('name').trim() == '')
        return;

    var file = Selector.$('o_imagem').getAttribute('name').split(".");
    file = file[file.length - 1];

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=ExcluirImagem';
    p += '&imagem=' + file;
    ajax.Request(p);
}

function GerarMiniaturaImagem() {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=GerarMiniaturaImagem';
    p += '&imagem=' + Selector.$('o_imagem').getAttribute('name');

    ajax.Request(p);

    var vetor = Selector.$('o_imagem').getAttribute('name').split(".");
    var extensao = vetor[vetor.length - 1];

    if (extensao !== 'jpg' && extensao !== 'jpeg') {

        Selector.$('o_imagem').setAttribute('name', vetor[0] + '.jpg');
        Selector.$('o_imagem').setAttribute('src', 'imagens/instaarts/mini_' + vetor[0] + '.jpg');
    }
}

function CancelarPedido(idPedido) {
    if (idPedido <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '7') {
        MostrarMsg('O pedido já encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '6') {
        MostrarMsg('O pedido encontra-se entregue, não é possível cancelar', '');
        return;
    }

    if (!confirm('Deseja realmente cancelar o pedido nº ' + Selector.$('codPedido').innerHTML + '?')) {
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', true);

    var p = 'action=CancelarPedido';
    p += '&idPedido=' + idPedido;

    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == 1) {
            MostrarMsg('Pedido cancelado com sucesso', '');
            Mostra(idPedido);
        }
        else {
            MostrarMsg('Problemas ao cancelar o pedido. Tente novamente, caso o erro persista contate o suporte técnico', '');
        }

        Selector.$('imgCancelar').src = 'imagens/cancelar.png';
    };

    Selector.$('imgCancelar').src = 'imagens/loading.gif';
    ajax.Request(p);
}