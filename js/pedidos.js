checkSessao();
CheckPermissao(49, false, '', true);

var codigoAtual = 0;
var codigoAtualProducao = 0;
var percentualComissaoMarchand = 0;
var valorComissaoMarchand = 0;
var idFormaPagamento = 0;
var codigoOrcamento = 0;
var tipoProdutoImagem = '';
var CodigoArtista = 0;
var CodigoObra = 0;
var alteracao = false;
var mensagemCancelar = false;

var tipoArquiteto = 0;
var dataContrato = "";
var periodoDiasContrato = "";
var numeroContrato = "";
var obsContrato = "";
var devolvido = "0";
var comissaoContrato = "";

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Pedidos</div>";
    carregarmenu();
    getDadosUsuario();
    getStatusPedido(Selector.$('statusBusca'), "Filtre por status", false);
    getLojas(Selector.$('statusLoja'), 'Selecione uma loja', false);

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    Select.Show(Selector.$('statusTipo'), 1);

    MostrarPedidos();

    Mask.setData(Selector.$('dataCadastro'));
    Mask.setData(Selector.$('previsaoEntrega'));

    Mask.setMoeda(Selector.$('frete'));
    Mask.setMoeda(Selector.$('acrescimo'));
    Mask.setMoeda(Selector.$('percDesconto'));
    Mask.setMoeda(Selector.$('valorDesconto'));

    Mask.setOnlyNumbers(Selector.$('consignacaoDias'));

    //CRIA TABELA DE OBRAS
    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('cellpadding', '2');
    gridObras.table.setAttribute('cellspacing', '0');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
        DOM.newText('Nº'),
        DOM.newText('Img'),
        DOM.newText('Tipo'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtd'),
        DOM.newText('Total'),
        DOM.newText('Obs.'),
        DOM.newText(''),
        DOM.newText(''),
        DOM.newText('idTipo'),
        DOM.newText('idObra'),
        DOM.newText('idArtista'),
        DOM.newText('idTamanho'),
        DOM.newText('idAcabamento'),
        DOM.newText('altura'),
        DOM.newText('largura'),
        DOM.newText('qtd'),
        DOM.newText('percentualDesconto'),
        DOM.newText('valorDesconto'),
        DOM.newText('valorAcrescimo'),
        DOM.newText('valorUnitario'),
        DOM.newText('tiragemMaxima'),
        DOM.newText('tiragemAtual'),
        DOM.newText('estrelas'),
        DOM.newText('imagemObra'),
        DOM.newText('peso'),
        DOM.newText('idGrupoMoldura'),
        DOM.newText('idMoldura')
    ]);

    Selector.$('divObras').appendChild(gridObras.table);

    
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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);

    //CRIA TABELA DE OBRAS PRODUCAO
    gridObrasProducao = new Table('gridObrasProducao');
    gridObrasProducao.table.setAttribute('cellpadding', '2');
    gridObrasProducao.table.setAttribute('cellspacing', '0');
    gridObrasProducao.table.setAttribute('class', 'tabela_cinza_foco');

    gridObrasProducao.addHeader([
        DOM.newText(''),
        DOM.newText('Tipo'),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtd'),
        DOM.newText('Total'),
        DOM.newText('Obs.'),
        DOM.newText('Estoque'),
        DOM.newText('Ver'),
        DOM.newText('idTipo'),
        DOM.newText('idObra'),
        DOM.newText('idArtista'),
        DOM.newText('idTamanho'),
        DOM.newText('idAcabamento'),
        DOM.newText('altura'),
        DOM.newText('largura'),
        DOM.newText('qtd'),
        DOM.newText('percentualDesconto'),
        DOM.newText('valorDesconto'),
        DOM.newText('valorAcrescimo'),
        DOM.newText('valorUnitario'),
        DOM.newText('tiragemMaxima'),
        DOM.newText('tiragemAtual'),
        DOM.newText('estrelas'),
        DOM.newText('imagemObra'),
        DOM.newText('peso'),
        DOM.newText('idGrupoMoldura'),
        DOM.newText('idMoldura')
    ]);

    Selector.$('tabelaProducao').appendChild(gridObrasProducao.table);

    gridObrasProducao.hiddenCol(8);
    gridObrasProducao.hiddenCol(12);
    gridObrasProducao.hiddenCol(13);
    gridObrasProducao.hiddenCol(14);
    gridObrasProducao.hiddenCol(15);
    gridObrasProducao.hiddenCol(16);
    gridObrasProducao.hiddenCol(17);
    gridObrasProducao.hiddenCol(18);
    gridObrasProducao.hiddenCol(19);
    gridObrasProducao.hiddenCol(20);
    gridObrasProducao.hiddenCol(21);
    gridObrasProducao.hiddenCol(22);
    gridObrasProducao.hiddenCol(23);
    gridObrasProducao.hiddenCol(24);
    gridObrasProducao.hiddenCol(25);
    gridObrasProducao.hiddenCol(26);
    gridObrasProducao.hiddenCol(27);
    gridObrasProducao.hiddenCol(28);
    gridObrasProducao.hiddenCol(29);
    gridObrasProducao.hiddenCol(30);

    //CRIA TABELA DE PAGAMENTOS
    gridPagamento = new Table('gridPagamento');
    gridPagamento.table.setAttribute('cellpadding', '2');
    gridPagamento.table.setAttribute('cellspacing', '0');
    gridPagamento.table.setAttribute('class', 'tabela_cinza_foco');

    gridPagamento.addHeader([
        DOM.newText('Nº'),
        DOM.newText('Valor'),
        DOM.newText('Situação'),
        DOM.newText('Excluir'),
        DOM.newText(''),
        DOM.newText(''),
        DOM.newText(''),
        DOM.newText('codigo vale'),
        DOM.newText('idValePresenteTroca')
    ]);

    Selector.$('divPagamento').appendChild(gridPagamento.table);

    gridPagamento.hiddenCol(4);
    gridPagamento.hiddenCol(5);
    gridPagamento.hiddenCol(6);
    gridPagamento.hiddenCol(7);
    gridPagamento.hiddenCol(8);

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

    Selector.$('divLink').style.display = 'none';

    var source = Window.getParameter('source');
    Select.AddItem(Selector.$('enderecos'), 'Selecione um cliente para carregar os endereços', 0);

    if (source == null || source == '') {
        var c = Window.getParameter('idPedido');

        if (c == null || c == '') {
            getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", false);
            getLojas(Selector.$('loja'), 'Selecione uma loja', true);
            getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", (Window.getParameter('idcliente') != null || Window.getParameter('idPedido') ? false : true));
            Select.AddItem(Selector.$('vendedor'), "Selecione uma loja", 0);
            getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", true);

            //corrige erros de layout 
            Selector.$('divContainer').style.maxWidth = '100%';
            Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
            Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
            Selector.$('busca').style.display = 'inline-block';
            Selector.$('statusBusca').style.display = 'inline-block';
            Selector.$('statusvendedores').style.display = 'inline-block';
            Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
        }
        else {
            getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", false);
            getLojas(Selector.$('loja'), 'Selecione uma loja', false);
            getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", (Window.getParameter('idcliente') != null || Window.getParameter('idPedido') != null ? false : true));
            Select.AddItem(Selector.$('vendedor'), "Selecione uma loja", 0);
            getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", false);

            Mostra(c, true);

            var org = Window.getParameter('org');

            if (org == null || org == '') {
                return;
            }

            switch (org) {
                case 'panorama-de-vendas':
                    Selector.$('linkVoltar').setAttribute('href', 'relatorio-de-panorama-de-vendas.html?return=1');
                    Selector.$('divLink').style.display = 'inline-block';
                    break;

                case 'relatorio-de-pedidos':
                    Selector.$('linkVoltar').setAttribute('href', 'relatorio-de-pedidos.html?return=1');
                    Selector.$('divLink').style.display = 'inline-block';
                    break;
            }

        }
    }
    else {

        getLojas(Selector.$('loja'), 'Selecione uma loja', false);
        getClientesPremium(Selector.$('cliente'), "Selecione um cliente", (Window.getParameter('idcliente') != null ? false : true));
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
                Mostra(ajax.getResponseText(), true);
            }
        }

        if (source == 'gerar') {

            Novo(true);

            var ajax = new Ajax('POST', (Window.getParameter('idOrcamento') == null ? 'php/orcamentos-simplificados.php' : 'php/propostas.php'), false);
            var p = 'action=Mostrar';
            p += '&viaPedido=true';
            p += '&codigo=' + (Window.getParameter('idOrcamento') == null ? Window.getParameter('idOrcamentoSimplificado') : Window.getParameter('idOrcamento'));

            ajax.Request(p);

            if (ajax.getResponseText() == 0) {
                MostrarMsg('Orçamento não localizado para carregar', 'codigo');
                return;
            }

            var json = JSON.parse(ajax.getResponseText() );

            codigoOrcamento = json.idOrcamento;

            Select.Show(Selector.$('loja'), json.idLoja);
            CarregaMarchands(false);

            Select.Show(Selector.$('cliente'), json.idCliente);
            getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
            Select.Show(Selector.$('enderecos'), json.idClienteEndereco);
            Select.Show(Selector.$('vendedor'), json.idVendedor);
            getComissaoMarchand();

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
                
            MostraObras(json.arrayObras);

            for (var i = 0; i < gridObras.getRowCount(); i++) {
                gridObras.setRowData(i, 0);
            }

            for (var i = 0; i < gridFollow.getRowCount(); i++) {
                gridFollow.setRowData(i, '0');
            }

            Totaliza(true, false, false, false, false);
        }
    }

    var idPedido = Window.getParameter('idPedido');

    if (idPedido != null && idPedido != '') {
        Mostra(parseInt(idPedido, false));
    }

    if(Window.getParameter('idcliente') != null){
        Novo(true);
        Selector.$('cliente').value = Window.getParameter('idcliente');
        LoadDadosCliente();
        getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
        Select.Clear(Selector.$('vendedor'));
        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
    }
};

window.onresize = function () {
    if (Selector.$('divRel').clientHeight != 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
};

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('statusLoja').style.display = 'inline-block';
        Selector.$('statusTipo').style.display = 'inline-block';

        Selector.$('divTodos').style.display = 'none';
        Selector.$('divDatas').style.display = 'inline-block';
        Selector.$('divQtdRegistros').style.display = 'inline-block';
        Selector.$('btPesquisarCad').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

    } else {
        Selector.$('divContainer').style.maxWidth = '1350px';
        Selector.$('divCadastro2').setAttribute('style', 'height:640px; min-height:640px; width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
        Selector.$('statusvendedores').style.display = 'none';
        Selector.$('statusTipo').style.display = 'none';
        Selector.$('statusLoja').style.display = 'none';
        Selector.$('divTodos').style.display = 'none';
        Selector.$('divDatas').style.display = 'none';
        Selector.$('divQtdRegistros').style.display = 'none';
        Selector.$('btPesquisarCad').style.display = 'none';

        Selector.$('contratoArquiteto').style.display = "none";
    }
}

function MostrarPedidos() {

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=MostrarPedidos';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&busca=' + Selector.$('busca').value;
    p += '&statusTipo=' + Selector.$('statusTipo').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&loja=' + Selector.$('statusLoja').value;
    p += '&vendedor=' + Selector.$('statusvendedores').value;
    p += '&limitar=' + (Selector.$('mostrarTodosRegistros').checked ? 0 : 1);

    Selector.$('lblRegistros').innerHTML = "";

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            Selector.$('divRel').style.textAlign = 'center';
            Selector.$('divRel').innerHTML = "Nenhum pedido encontrado";
            Selector.$('lblRegistros').innerHTML = "";
            return;
        }

        Selector.$('divRel').style.textAlign = 'left';
        Selector.$('lblRegistros').innerHTML = "";
        Selector.$('divRel').innerHTML = '';

        gridPedidos = new Table('gridPedidos');
        gridPedidos.table.setAttribute('cellpadding', '4');
        gridPedidos.table.setAttribute('cellspacing', '0');
        gridPedidos.table.setAttribute('class', 'tabela_cinza_foco');

        gridPedidos.addHeader([
            DOM.newText('N°'),
            DOM.newText('Data Cadastro'),
            DOM.newText('Data Pedido'),
            DOM.newText('Loja'),
            DOM.newText('Cliente'),
            DOM.newText('Obras'),
            DOM.newText('Qtde. Pagamentos'),
            DOM.newText('Valor Total'),
            DOM.newText('Marchand'),
            DOM.newText('Status'),
            DOM.newText(''),
            DOM.newText('')
        ]);

        Selector.$('divRel').appendChild(gridPedidos.table);

        if (!VerificarAdmin()) {
            gridPedidos.hiddenCol(11);
        }

        gridPedidos.clearRows();

        var json = JSON.parse(ajax.getResponseText() );
                      
        var ver;
        var obras;
        var qtdePagamentos;
        var cor;

        for (var i = 0; i < json.length; i++) {

            qtdePagamentos = DOM.newElement('label');

            if (json[i].consignacao == '1') {
                qtdePagamentos.innerHTML = 'Consignação';
            }
            else {
                qtdePagamentos.innerHTML = json[i].qtdePagamentos;
            }

            if (json[i].qtdePagamentos > '0') {
                qtdePagamentos.setAttribute('style', 'text-decoration:underline; cursor:pointer;');
                qtdePagamentos.setAttribute('onclick', 'PromptPagamentosPedido(' + json[i].idVenda + ');');
            }

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idVenda + ', true)');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir Pedido');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirPedidoAux(' + gridPedidos.getRowCount() + ')');

            gridPedidos.addRow([
                DOM.newText(json[i].numeroPedido),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].dataVenda),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                qtdePagamentos,
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].marchand),
                DOM.newText(json[i].descricaoStatus),
                ver,
                excluir
            ]);

            gridPedidos.setRowData(gridPedidos.getRowCount() - 1, json[i].idVenda);
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 3).setAttribute('style', 'text-align:left; width:200px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;max-width:200px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 5).setAttribute('style', 'text-align:left; width:390px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:100px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 7).setAttribute('style', 'text-align:right; width:100px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 8).setAttribute('style', 'text-align:left; width:150px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:100px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:40px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:40px;');

            if (cor) {
                cor = false;
                gridPedidos.setRowBackgroundColor(gridPedidos.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridPedidos.setRowBackgroundColor(gridPedidos.getRowCount() - 1, "#FFF");
            }
            
            if(json[i].consignacao == '1'){
                gridPedidos.setRowForegroundColor(gridPedidos.getRowCount() - 1, '#14af0a');
            }
        }

        if (!VerificarAdmin()) {
            gridPedidos.hiddenCol(11);
        }

        if (Selector.$('de').value.trim() != '' && Selector.$('ate').value.trim() != '') {
            Selector.$('lblRegistros').innerHTML = (json.length == 1 ? json.length + ' registro' : json.length + ' registros');
        } else {
            Selector.$('lblRegistros').innerHTML = (Selector.$('mostrarTodosRegistros').checked ? (json.length == 1 ? json.length + ' registro' : json.length + ' registros') : '20 últimos registros');
        }
    };

    Selector.$('divRel').innerHTML = 'Aguarde, pesquisando pedidos...';
    ajax.Request(p);
    
}

function ExcluirPedidoAux(linha) {

    if (!CheckPermissao(52, true, 'Você não possui permissão para excluir um pedido', false)) {
        return;
    }

    mensagemExcluirPedido = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este pedido?", "OK", "ExcluirPedido(" + linha + ");", true, "");
    mensagemExcluirPedido.Show();
}

function ExcluirPedido(linha) {

    mensagemExcluirPedido.Close();

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=ExcluirPedido';
    p += '&idPedido=' + gridPedidos.getRowData(linha);
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro!", "Erro ao excluir o pedido. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        gridPedidos.deleteRow(linha);
    }
}

function Novo(ajustar) {

    if (codigoAtual <= 0) {
        if (!CheckPermissao(50, true, 'Você não possui permissão para cadastrar um novo pedido', false)) {
            return;
        }

    checkLoja('loja');
    checkMarchand('vendedor');
    }

    if (ajustar) {
        AjustarDivs();
    }
    
    SelecionaAbas(0);
    Selector.$('dataCadastro').value = Date.GetDate(false);
    Selector.$('previsaoEntrega').value = Date.GetDatePlus( 10, false);
    Selector.$('situacao').value = 'Novo pedido';
    Selector.$('loja').focus();
    Selector.$('botNovo').setAttribute('src', 'imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', 'imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');
}

function CancelarAux(){

    if(alteracao){
        criaDiv('divMensagemCancelar');
        //mensagemCancelarAlteracoesOrcamento = new DialogoMensagens("prompt", 130, 400, 150, "4", "Alerta!", "Foram feitas alterações no orçamento, deseja cancelar essas alterações?", "SIM", "Cancelar(); mensagemCancelarAlteracoesOrcamento.Close();", true, "");
        mensagemCancelarAlteracoesOrcamento = new DialogoMensagens("divMensagemCancelar", 130, 400, 150, "4", "Alerta!", "Foram feitas alterações no orçamento, deseja cancelar ou salvar essas alterações?", "SALVAR", "Gravar(); mensagemCancelarAlteracoesOrcamento.Close();", true, "");
        mensagemCancelarAlteracoesOrcamento.Show();
        Selector.$('btcancelar').innerHTML = 'CANCELAR';
        mensagemCancelar = true;
        alteracao=false;
    }else{
        Cancelar();
    }
}

function Cancelar() {

    AjustarDivs();
    Limpar();
    Selector.$('botNovo').setAttribute('src', 'imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
    Selector.$('botSair').setAttribute('src', 'imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');

    //MostrarPedidos();
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    }else{
        if(codigoAtual <= 0){
            Cancelar();
        }else{
            CancelarAux();
       }
    }
}

function CarregaMarchands(ascinc) {
    if (Selector.$('loja').value != Selector.$('loja').name) {
        Selector.$('loja').name = Selector.$('loja').value;
        getVendedores(Selector.$('vendedor'), "Selecione um marchand", ascinc, 'MARCHANDS', Selector.$('loja').value);
    }
    else {
        return;
    }
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 2; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');//JAIRO MEXER AQUI
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; background:#FFF; min-height:440px;  overflow:hidden');
}

function botDel_onClick() {

    if (codigoAtual <= 0) {
        MostrarMsg('Nenhum pedido selecionado.', '');
        return;
    }
}

function Limpar() {

    codigoAtual = 0;
    codigoAtualProducao = 0;
    alteracao = false;

    Selector.$('codPedido').innerHTML = '- - -';
    Selector.$('orcamento').innerHTML = '';
    Selector.$('orcamento').href = '#';

    Selector.$('botCancelarPedido').setAttribute('onclick', '');
    Selector.$('botImprimirPedido').setAttribute('onclick', '');
    Selector.$('botGerarPdfPedido').setAttribute('onclick', '');
    Selector.$('botEnviarPedidoEmail').setAttribute('onclick', '');
    Selector.$('loja').name = '';
    Selector.$('dataCadastro').value = "";
    Selector.$('loja').selectedIndex = 0;
    Selector.$('previsaoEntrega').value = "";
    Selector.$('cliente').selectedIndex = 0;
    Selector.$('enderecos').selectedIndex = 0;
    Selector.$('situacao').value = "";
    Selector.$('vendedor').selectedIndex = 0;
    Selector.$('contato').value = "";
    Selector.$('telefone').value = "";
    Selector.$('email').value = "";
    Selector.$('tipoTransporte').selectedIndex = 0;
    Selector.$('divValorFrete').style.display = 'none';
    Selector.$('valor').value = "";
    Selector.$('frete').value = "";
    Selector.$('acrescimo').value = "";
    Selector.$('percDesconto').value = "";
    Selector.$('valorDesconto').value = "";
    Selector.$('valorTotal').value = "";
    Selector.$('valorSaldo').value = "";
    Selector.$('comissaoVendedor').value = "";
    Selector.$('obs').value = "";

    gridObras.clearRows();
    gridPagamento.clearRows();
    gridFollow.clearRows();
    gridObrasProducao.clearRows();


    tipoArquiteto = 0;
    dataContrato = "";
    periodoDiasContrato = "";
    numeroContrato = "";
    obsContrato = "";
    devolvido = "0";
    comissaoContrato = "";
}

function VerificaCampos() {

    var data_cadastro = Selector.$('dataCadastro');
    if (data_cadastro.value == '') {
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
    if (previsaoEntrega.value == '') {
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

    if (Selector.$('consignacao').checked) {
        if (parseInt(Selector.$('consignacaoDias').value) <= 0) {
            MostrarMsg("Por favor, informe a quantidade de dias da consignação", 'consignacaoDias');
            SelecionaAbas(0);
            return false;
        }

        if (Selector.$('consignacaoDados').value.trim() == '') {
            MostrarMsg("Por favor, informe os dados do cheque da consignação", 'consignacaoDados');
            SelecionaAbas(0);
            return false;
        }
    }

    return true;
}

function Gravar() {

    if (!CheckPermissao(50, true, 'Você não possui permissão para editar um pedido', false)) {
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    if (!checkLogarNovamente()) {
        return false;
    }

    if(mensagemCancelar){
        mensagemCancelarAlteracoesOrcamento.Close();
    }
  
    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&codOrcamento=' + codigoOrcamento;
    p += '&orcamentoSimplificado=' + (Window.getParameter('idOrcamentoSimplificado') == null ? '0' : '1');
    p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&previsaoEntrega=' + Selector.$('previsaoEntrega').value;
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&idClienteEndereco=' + Selector.$('enderecos').value;
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

    p += '&consignacao=' + Selector.$('consignacao').checked;
    p += '&consignacaoDias=' + Selector.$('consignacaoDias').value;
    p += '&consignacaoDados=' + Selector.$('consignacaoDados').value.trim();

    if (Window.getParameter('source') == 'gerar') {
        p += '&gerar=true';
    }

    p += '&dataContrato=' + dataContrato;
    p += '&periodoDias=' + periodoDiasContrato;
    p += '&numeroContrato=' + numeroContrato;
    p += '&devolvido=' + devolvido;
    p += '&comissaoContrato=' + comissaoContrato;
    p += '&obsContrato=' + obsContrato;

    //ARRAY COM OBRAS

    p += '&idsVendasObras=' + gridObras.getRowsData();
    p += '&observacoes=' + gridObras.getContentRows(9);
    p += '&idsTiposObras=' + gridObras.getContentRows(12);
    p += '&idsObras=' + gridObras.getContentRows(13);
    p += '&idsArtistas=' + gridObras.getContentRows(14);
    p += '&idsTamanhos=' + gridObras.getContentRows(15);
    p += '&idsAcabamentos=' + gridObras.getContentRows(16);
    p += '&totaisObras=' + gridObras.getContentMoneyRows(8);
    p += '&alturas=' + gridObras.getContentMoneyRows(17);
    p += '&larguras=' + gridObras.getContentMoneyRows(18);
    p += '&qtds=' + gridObras.getContentMoneyRows(19);
    p += '&percentuaisDescontos=' + gridObras.getContentMoneyRows(20);
    p += '&valoresDescontos=' + gridObras.getContentMoneyRows(21);
    p += '&valoresAcrescimos=' + gridObras.getContentMoneyRows(22);
    p += '&valoresUnitarios=' + gridObras.getContentMoneyRows(23);
    p += '&tiragens=' + gridObras.getContentRows(24);
    p += '&qtdsVendidos=' + gridObras.getContentRows(25);
    p += '&estrelas=' + gridObras.getContentRows(26);
    p += '&imagens=' + gridObras.getContentRows(27);
    p += '&pesos=' + gridObras.getContentMoneyRows(28);
    p += '&idsGruposMolduras=' + gridObras.getContentRows(29);
    p += '&idsMolduras=' + gridObras.getContentRows(30);

    //Manda os dados da grid Pagamento
    p += '&id=' + gridPagamento.getRowsData();
    p += '&parcela=' + gridPagamento.getContentRows(0);
    p += '&valorParcela=' + gridPagamento.getContentMoneyRows(1);
    p += '&forma=' + gridPagamento.getContentRows(4);
    p += '&data=' + gridPagamento.getContentRows(5);
    p += '&recibo=' + gridPagamento.getContentRows(6);
    p += '&idValePresenteTroca=' + gridPagamento.getContentRows(8);

    var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Aguarde!!", "Aguarde enquanto o pedido é gravado.", "wait", "", false, "");
    mensagem.Show();
    
    ajax.Request(p);
    
    if (ajax.getResponseText() == '0') {
        MostrarMsg('Problemas ao gravar o pedido. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } else {
        MostrarPedidos();
        codigoAtual = ajax.getResponseText();
        Mostra(codigoAtual, false);
        SelecionaAbas(0);

        mensagem.Close();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 160, "3", "Aviso", "Cadastro salvo com sucesso", "OK", "", false, "");
        mensagem.Show();
        return true;
    }
}

function Mostra(Codigo, ajustar) {

    if(!CheckPermissao(167, true, 'Você não possui permissão para Visualizar detalhes sobre o  pedido', false)){
        return;
    }

    if (Codigo == '' || parseInt(Codigo) == 0) {
        return;
    }

    codigoAtual = Codigo;
    Novo(ajustar);
    Limpar();

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Pedido não localizado', 'codigo');
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    codigoAtual = json.idVenda;
    codigoAtualProducao = json.idOrdemProducao;
    Selector.$('botCancelarPedido').setAttribute('onclick', 'CancelarPedidoAux(' + json.idVenda + ')');
    Selector.$('botImprimirPedido').setAttribute('onclick', 'ImprimirPedido(' + json.idVenda + ')');
    Selector.$('botGerarPdfPedido').setAttribute('onclick', 'GerarPdfPedido();');
    Selector.$('botEnviarPedidoEmail').setAttribute('onclick', 'EnviarPdfPedidoEmailAux();');
    Selector.$('btenviarAviso').setAttribute('onclick', 'AvisoRetirada('+Codigo+');');

    Selector.$('botBaixarEstoque').setAttribute('onclick', 'BaixarEstoque(0);');
    Selector.$('codPedido').innerHTML = json.codPedido;


    if (parseInt(json.idOrcamento) > 0) {
        Selector.$('orcamento').innerHTML = 'Gerado via orçamento ' + json.idOrcamento;
        Selector.$('orcamento').href = 'propostas.html?idOrcamento=' + parseInt(json.idOrcamento);
    }
    else {
        Selector.$('orcamento').innerHTML = '';
        Selector.$('orcamento').href = '#';
    }

    Selector.$('dataCadastro').value = json.dataCadastro;
    Select.Show(Selector.$('loja'), json.idLoja);
    Selector.$('previsaoEntrega').value = json.dataEntrega;
    Selector.$('situacao').value = json.status;
    Selector.$('situacao').setAttribute('name', json.idStatus);

    Select.Show(Selector.$('cliente'), json.idCliente);
    getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
    Select.Show(Selector.$('enderecos'), json.idClienteEndereco);
    LoadDadosCliente();
    getVendedores(Selector.$('vendedor'), 'Selecione um marchand', false, 'MARCHANDS', Selector.$('loja').value);

    Select.Show(Selector.$('vendedor'), json.idVendedor);
    getComissaoMarchand();
    Selector.$('contato').value = json.contato;
    Selector.$('telefone').value = json.telefone;
    Selector.$('email').value = json.email;
    Select.Show(Selector.$('tipoTransporte'), json.idTipoEntrega);
    VerificarFrete();
    Selector.$('valor').value = json.valor;
    Selector.$('frete').value = json.valorFrete;
    Selector.$('acrescimo').value = json.valorAcrescimo;
    Selector.$('percDesconto').value = json.percentualDesconto;
    Selector.$('valorDesconto').value = json.valorDesconto;
    Selector.$('valorTotal').value = json.valorTotal;
    Selector.$('comissaoVendedor').value = json.valorComissao + " (" + json.percentualComissao + "%)";
    Selector.$('obs').value = json.obs;

    Selector.$('consignacao').checked = (json.consignacao == '1' ? 'checked' : false);
    DadosConsig();
    Selector.$('consignacaoDias').value = json.consignacaoDias;
    Selector.$('consignacaoDados').value = json.consignacaoDados;

    tipoArquiteto = json.arquiteto;

    if(tipoArquiteto == "1") {
        Selector.$('contratoArquiteto').style.display = "inline-block";
    }

    dataContrato = json.dataContrato;
    periodoDiasContrato = json.periodoDiasContrato;
    numeroContrato = json.numeroContrato;
    obsContrato = json.obsContrato;
    devolvido = json.devolvido;
    comissaoContrato = json.comissaoContrato;

    MostraObras(json.arrayObras);
    MostraObrasProducao(json.arrayObrasProducao);
    MostraParcelas(json.arrayParcelas);
    MostraFollowUp();
    Totaliza();

    if (!CheckPermissao(51, false, '', false)) {
        Selector.$('divPagamentos').style.display = 'none';
        Selector.$('divValores').style.display = 'none';
        gridObras.hiddenCol(8);
    }
}

function ImprimirPedido(idPedido) {

    if (!CheckPermissao(56, true, 'Você não possui permissão para imprimir pedido', false)) {
        return;
    }

    if (idPedido <= 0)
        return;

    window.open('impressao-pedido.html?codigo=' + idPedido, 'printPed');
}

function MostraObrasProducao(array) {

    if (array == '0')
        return;

    gridObrasProducao.clearRows();
    
    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObrasProducao.getRowCount() + ')');

        var chk = DOM.newElement('checkbox');

        var imagem = DOM.newElement('img');

        if (json[i].pasta != '' && json[i].imagem != '') {

            if (json[i].imagem.split('.')[1] == 'zip' || json[i].imagem.split('.')[1] == 'rar') {

                imagem.setAttribute('src', "imagens/zip.png");
                imagem.setAttribute('title', "Baixar Arquivo");
                imagem.setAttribute("onclick", "BaixarImagemReal('" + "imagens/" + json[i].pasta + "/" + json[i].imagem + "');");
            } else {

                imagem.setAttribute('src', "imagens/" + json[i].pasta + "/" + json[i].imagem);
                imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + json[i].pasta + "/" + json[i].imagem + "');");
            }
        } else {
            imagem.setAttribute('src', "imagens/semarte.png");
        }

        imagem.setAttribute('style', 'width:50px; cursor:pointer;');

        var divEstoque = DOM.newElement('div');
        var estoque = DOM.newElement('span');

        if (json[i].idTipoProduto != '2') {

            if (json[i].idOrdemProducao == '0') {

                if (json[i].qtdEstoque > 0) {
                    estoque.innerHTML = parseInt(json[i].qtdEstoque) + ' em estoque na loja ' + Select.GetText(Selector.$('loja')).toLowerCase() + '. (Pronta Entrega)';
                    chk.disabled = true;
                } else if (json[i].qtdEstoque <= 0 && json[i].qtdEstoqueLojas > 0) {
                    estoque.innerHTML = "<span title='Clique para ver a lista de lojas' style='text-decoration:underline; cursor:pointer;' onclick='PromptEstoqueLojas(" + json[i].arrayOutrasLojas + ", " + gridObrasProducao.getRowCount() + ");'>" + parseInt(json[i].qtdEstoqueLojas) + ' em estoque em outras lojas</span>. (Transferir Estoque ou Gerar OP)';
                    chk.disabled = false;
                    chk.checked = false;
                } else if (json[i].qtdEstoque <= 0 && json[i].qtdEstoqueLojas <= 0 && json[i].idVendaCompEstoque <= 0) {
                    estoque.innerHTML = 'Sem nenhum estoque. Gerar OP (Encomenda)';
                    chk.disabled = false;
                    chk.checked = false;
                } else {
                    estoque.innerHTML = 'Realizado baixa no estoque';
                    chk.disabled = true;
                    chk.checked = false;
                }
            } else {
                estoque.innerHTML = 'OP N° ' + json[i].idOrdemProducao + ' (Encomenda)';
                chk.disabled = true;
                chk.checked = true;
            }
        } else {

            if (json[i].idOrdemProducao != '0') {
                estoque.innerHTML = 'OP N° ' + json[i].idOrdemProducao + ' (Encomenda)';
                chk.disabled = true;
                chk.checked = true;
            } else {
                estoque.innerHTML = 'Gerar OP (Encomenda)';
                chk.disabled = false;
                chk.checked = false;
            }
        }

        var imgBaixarEstoque = DOM.newElement('img');
        imgBaixarEstoque.setAttribute('src', 'imagens/baixar-estoque.png');
        imgBaixarEstoque.setAttribute('style', 'margin-left:10px; vertical-align:middle; cursor:pointer;');
        imgBaixarEstoque.setAttribute('title', 'Baixar obra do estoque');
        imgBaixarEstoque.setAttribute('onclick', 'BaixarEstoque(' + json[i].idVendaComp + ');');

        divEstoque.appendChild(estoque);

        if (json[i].idOrdemProducaoComp == '0' && json[i].qtdEstoque > 0) {
            divEstoque.appendChild(imgBaixarEstoque);
        }

        var ver = DOM.newElement('img');
        ver.setAttribute('src', 'imagens/pesquisar.png');
        ver.setAttribute('title', 'Ver OP');
        ver.setAttribute('style', 'cursor:pointer;');
        ver.setAttribute('onclick', 'VerOp(' + json[i].idOrdemProducao + ')');

        gridObrasProducao.addRow([
            chk,
            DOM.newText(json[i].nomeTipo),
            imagem,
            DOM.newText(json[i].nomeArtista),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == 3 ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipo == '3' ? json[i].nomeProduto : json[i].nomeAcabamento)),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].valorTotal),
            DOM.newText((json[i].idOrdemProducao > 0 ? 'gerada OP Nº ' + json[i].idOrdemProducao + (json[i].refeita == '1' ? ' - Refeita' : '') : '')),
            divEstoque,
            ver,
            //OCULTOS
            DOM.newText(json[i].idTipo),
            DOM.newText(json[i].idObra),
            DOM.newText(json[i].idArtista),
            DOM.newText(json[i].idTamanho),
            DOM.newText((json[i].idTipo == '3' ? json[i].idProduto : json[i].idAcabamento)),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].percentualDesconto),
            DOM.newText(json[i].valorDesconto),
            DOM.newText(json[i].valorAcrescimo),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].tiragem),
            DOM.newText(json[i].qtdVendido),
            DOM.newText(json[i].estrelas),
            DOM.newText(json[i].imagem),
            DOM.newText(json[i].peso),
            DOM.newText(json[i].idMolduraGrupo),
            DOM.newText(json[i].idMoldura)
        ]);

        gridObrasProducao.setRowData(gridObrasProducao.getRowCount() - 1, json[i].idVendaComp);
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;width:40px');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 8).setAttribute('style', 'text-align:right;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 9).setAttribute('style', 'text-align:left;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 10).setAttribute('style', 'text-align:center;');
        gridObrasProducao.getCell(gridObrasProducao.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:30px');

        if (cor) {
            cor = false;
            gridObrasProducao.setRowBackgroundColor(gridObrasProducao.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridObrasProducao.setRowBackgroundColor(gridObrasProducao.getRowCount() - 1, "#FFF");
        }
    }

    gridObrasProducao.hiddenCol(8);
    gridObrasProducao.hiddenCol(12);
    gridObrasProducao.hiddenCol(13);
    gridObrasProducao.hiddenCol(14);
    gridObrasProducao.hiddenCol(15);
    gridObrasProducao.hiddenCol(16);
    gridObrasProducao.hiddenCol(17);
    gridObrasProducao.hiddenCol(18);
    gridObrasProducao.hiddenCol(19);
    gridObrasProducao.hiddenCol(20);
    gridObrasProducao.hiddenCol(21);
    gridObrasProducao.hiddenCol(22);
    gridObrasProducao.hiddenCol(23);
    gridObrasProducao.hiddenCol(24);
    gridObrasProducao.hiddenCol(25);
    gridObrasProducao.hiddenCol(26);
    gridObrasProducao.hiddenCol(27);
    gridObrasProducao.hiddenCol(28);
    gridObrasProducao.hiddenCol(29);
    gridObrasProducao.hiddenCol(30);
}

function VerOp(op) {

    if (op <= 0) {
        return;
    }

    window.location = 'ordem-de-producao.html?idOrdem=' + op;
}

function MostraObras(array) {
    var pasta =  '';

    if (array == '0')
        return;

    gridObras.clearRows();
    
    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var divEditarDuplicar = DOM.newElement('div');

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px; display:inline-block');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var duplicar = DOM.newElement('img');
        duplicar.setAttribute('src', 'imagens/duplicate.png');
        duplicar.setAttribute('title', 'Duplicar Obra');
        duplicar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
        duplicar.setAttribute('class', 'efeito-opacidade-75-04');
        duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

        divEditarDuplicar.appendChild(editar);
        divEditarDuplicar.appendChild(duplicar);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px;');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        var imgelemento = DOM.newElement('img');
        imgelemento.setAttribute('id', 'o_imagem2'+ i);
        imgelemento.setAttribute('src', 'imagens/semarte.png');
        imgelemento.setAttribute('class', 'textbox_cinzafoco');
        imgelemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:30px; cursor:pointer;');
        imgelemento.setAttribute("name", '');

        if(json[i].idTipoProduto == '1'){
            pasta = 'obras';
        }else if(json[i].idTipoProduto == '2'){
            pasta = 'instaarts';
        }else{
            pasta = 'produtos';
        }

        gridObras.addRow([
            DOM.newText(gridObras.getRowCount() + 1),
            imgelemento,
            DOM.newText(json[i].nomeTipo),
            DOM.newText(json[i].nomeArtista),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == '3' ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipo == '3' ? json[i].nomeProduto : json[i].nomeAcabamento + (json[i].moldura != '' ? ' - Mold.: ' + json[i].moldura : ''))),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].valorTotal),
            DOM.newText(json[i].obs),
            divEditarDuplicar,
            excluir,
            //OCULTOS
            DOM.newText(json[i].idTipo),
            DOM.newText(json[i].idObra),
            DOM.newText(json[i].idArtista),
            DOM.newText(json[i].idTamanho),
            DOM.newText((json[i].idTipo == '3' ? json[i].idProduto : json[i].idAcabamento)),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].percentualDesconto),
            DOM.newText(json[i].valorDesconto),
            DOM.newText(json[i].valorAcrescimo),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].tiragem),
            DOM.newText(json[i].qtdVendido),
            DOM.newText(json[i].estrelas),
            DOM.newText(json[i].imagem),
            DOM.newText(json[i].peso),
            DOM.newText(json[i].idMolduraGrupo),
            DOM.newText(json[i].idMoldura)
        ]);

        gridObras.setRowData(gridObras.getRowCount() - 1, json[i].idVendaComp);
        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:right;');
        gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:50px;');
        gridObras.getCell(gridObras.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:20px');
        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#FFF");
        }

         if (gridObras.getCellText(i, 27) == '' || gridObras.getCellText(i, 27).split('/')[gridObras.getCellText(i, 27).split('/').length - 1] == 'semarte.png') {
            Selector.$('o_imagem2' + i).src = 'imagens/semarte.png';
        } else {
            Selector.$('o_imagem2' + i).name = gridObras.getCellText(i, 27);
            Selector.$('o_imagem2' + i).src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(i, 27);
            Selector.$('o_imagem2' + i).title = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(i, 27);
            Selector.$('o_imagem2' + i).setAttribute('style','cursor:pointer; title="Ver Imagem"; width:60px; height:60px; ');
           // Selector.$('o_imagem2' + i).setAttribute("onclick", "verimagem('" + i + "','" + json[i].altura + "','" + json[i].largura + "');");
            //imgelemento.setAttribute("onclick", "MostraImagemTamanhoReal('imagens/obras/" + Selector.$('o_imagem2' + i).getAttribute('name') + "');");
            Selector.$('o_imagem2' + i).setAttribute("onclick", 'MostraImagemTamanhoReal("imagens/' + pasta + '/' + gridObras.getCellText(i,27) + '");');
        }

    }   
    
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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);
}

function MostraParcelas(array) {

    if (array == '0')
        return;

    gridPagamento.clearRows();
    
    var json = JSON.parse(array);
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        var status = DOM.newElement('label');
        status.setAttribute('style', 'font-size:11px');

        if (json[i].idValePresenteTroca > 0) {
            status.innerHTML = 'Vale Presente/Troca. Cod: ' + json[i].codigoVale;
        } else {
            status.innerHTML = "Pago em " + json[i].cadastro + ' por ' + json[i].forma + ' ' + (json[i].recibo == "" ? "" : "- Nº Recibo " + json[i].recibo) + " para " + json[i].data;
        }

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'cursor:pointer;width:15px');
        excluir.setAttribute('onclick', 'ExcluirParcelaAux(' + gridPagamento.getRowCount() + ')');

        gridPagamento.addRow([
            DOM.newText(json[i].parcela),
            DOM.newText(json[i].valor),
            DOM.newText(status.innerHTML),
            excluir,
            DOM.newText(json[i].idForma),
            DOM.newText(json[i].data),
            DOM.newText(json[i].recibo),
            DOM.newText(json[i].codigoVale),
            DOM.newText(json[i].idValePresenteTroca)
        ]);

        gridPagamento.hiddenCol(4);
        gridPagamento.hiddenCol(5);
        gridPagamento.hiddenCol(6);
        gridPagamento.hiddenCol(7);
        gridPagamento.hiddenCol(8);

        gridPagamento.setRowData(gridPagamento.getRowCount() - 1, json[i].codigo);
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'text-align:right; width:70px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:20px;');

        if (cor) {
            cor = false;
            gridPagamento.setRowBackgroundColor(gridPagamento.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridPagamento.setRowBackgroundColor(gridPagamento.getRowCount() - 1, "#FFF");
        }
    }
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

    if (cmb.name != cmb.value)
        cmb.name = cmb.value;
    else
        return;

    Selector.$('contato').value = '';
    Selector.$('telefone').value = '';
    Selector.$('email').value = '';

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=LoadDadosCliente';
    p += '&idCliente=' + cmb.value;

    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    Selector.$('contato').value = json.responsavel;
    Selector.$('telefone').value = json.telefone;
    Selector.$('email').value = json.email;

    tipoArquiteto = json.arquiteto;
    comissaoContrato = json.arquitetoComissao;

    if(tipoArquiteto == "1") {
        Selector.$('contratoArquiteto').style.display = "inline-block";
    }

    /*ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == '-1') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        Selector.$('contato').value = json.responsavel;
        Selector.$('telefone').value = json.telefone;
        Selector.$('email').value = json.email;

        tipoArquiteto = json.arquiteto;
        comissaoContrato = json.arquitetoComissao;

        if(tipoArquiteto == "1") {
            Selector.$('contratoArquiteto').style.display = "inline-block";
        }
    };

    ajax.Request(p); */
}

function AdicionarObra(codigo) {
    
    CodigoArtista = 0;
    if (codigo == '-1') {

        if (!CheckPermissao(159, true, 'Você não possui permissão para adicionar uma obra no orçamento', false)) {
            return;
        }
    }

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
    elemento.setAttribute('style', 'margin-left:155px');
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

    //PRODUTOS
    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optProduto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObras()');
    elemento.setAttribute('style', 'margin-left:20px');

    var label = DOM.newElement('label');
    label.innerHTML = 'Produtos';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optProduto');

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

    elemento = DOM.newElement('input');
    elemento.setAttribute('id','o_artista');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('style', 'position: absolute; background: transparent; z-index: 2; width:218px;');
    //elemento.setAttribute('onchange', 'getObrasArtista(true)');

    elemento2 = DOM.newElement('input');
    elemento2.setAttribute('id','autocomplete-ajax-x');
    elemento2.setAttribute('disabled','disabled');
    elemento2.setAttribute('class', 'textbox_cinzafoco');
    elemento2.setAttribute('style', 'color: #CCC; background: transparent; z-index: 1; width:218px;');
    divP.appendChild(label);
    divP.appendChild(elemento);
    divP.appendChild(elemento2);

   //OBRA
    label = DOM.newElement('label');
    label.innerHTML = 'Obra ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('style', 'position: absolute; background: transparent; z-index: 2; width:218px;');
    elemento.setAttribute('onchange', 'getTamanhosObras(true)');

    elemento2 = DOM.newElement('input');
    elemento2.setAttribute('id','o_obra_x');
    elemento2.setAttribute('disabled','disabled');
    elemento2.setAttribute('class', 'textbox_cinzafoco');
    elemento2.setAttribute('style', 'color: #CCC; background: transparent; z-index: 1; width:218px;');

    divP.appendChild(label);
    divP.appendChild(elemento);
    divP.appendChild(elemento2);

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
    elemento.setAttribute('onchange', 'getDetalhesAcabamento(); MostrarEstoqueObra();');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //GRUPO MOLDURA    
    label = DOM.newElement('label');
    label.innerHTML = 'Grupo ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_grupoMoldura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:238px; margin-left:4px');
    elemento.setAttribute('onchange', 'getMolduras(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //MOLDURA
    label = DOM.newElement('label');
    label.innerHTML = 'Moldura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_moldura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:216px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //DADOS DO TAMANHO, TIRAGEM, ESTRELAS, ETC
    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

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
    elemento.setAttribute('onchange', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //MOLDURA GRUPO    
    label = DOM.newElement('label');
    label.innerHTML = 'Grupo ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_grupoMolduraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:238px; margin-left:4px');
    elemento.setAttribute('onchange', 'getMolduras(true)');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Moldura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_molduraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:216px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

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

    //PRODUTOS
    var divProd = DOM.newElement('div', 'o_divProdutos');
    divProd.setAttribute('style', 'margin-top:10px; text-align:left;');

    //PRODUTO    
    label = DOM.newElement('label');
    label.innerHTML = 'Produto ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_produtoProd');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:508px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDadosProduto(); getImagemProduto();');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_alturaP');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px;');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_larguraP');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px;');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    divCadastro.appendChild(divProd);
    //FIM divProd

    //QTDE, VALOR, DESCONTO E TOTAL
    var divTotal = DOM.newElement('div', 'divObrasValores');
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
    elemento.setAttribute('onblur', 'TotalizaObras(true, false, false, false); AtualizaEstrela();');
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
    elemento.setAttribute("style", 'width:560px; height:45px;overflow:auto;');

    divCadastro.appendChild(label);
    divCadastro.appendChild(elemento);
    
    //Msg Estoque
    var lblInfoEstoque = DOM.newElement('label', 'lblInfoEstoque');
    lblInfoEstoque.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblInfoEstoque.setAttribute('style', 'float:left; font-size:10px;');
    lblInfoEstoque.innerHTML = '';
    divCadastro.appendChild(lblInfoEstoque);
    divCadastro.innerHTML += '<br/>';

    //IMAGEM OBRA
    var divImg = DOM.newElement('div');
    divImg.setAttribute('style', 'text-align:center; display:inline-block;');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px; cursor:pointer;');
    elemento.setAttribute("name", '');
    elemento.setAttribute('onclick', 'MostraImagemTamanhoReal("nenhuma");');

    divImg.appendChild(elemento);
    divCadastro.appendChild(divImg);

    divI.innerHTML += '<br/><br/>';

    label = DOM.newElement('label', 'lblIncluirImagem');
    label.innerHTML = 'Incluir Imagem';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; text-decoration:underline; text-align:center; display:none;');

    divImg.appendChild(label);

    var divImgMoldura = DOM.newElement('div', 'divImgMoldura');
    divImgMoldura.setAttribute('style', 'text-align:center; display:inline-block; margin-left:10px; display:none;');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'imagemMoldura');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px; margin-bottom:21px;');
    elemento.setAttribute("name", '');

    divImgMoldura.appendChild(elemento);
    divCadastro.appendChild(divImgMoldura);

    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');
    
    divCadastro.innerHTML += '<br/>';
    
    divCadastro.appendChild(divElem);
         
    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right; vertical-align:middle;');
    elemento.setAttribute('onclick', 'IncluirObra(' + codigo + ')');
    elemento.innerHTML = "Incluir";
    divCadastro.appendChild(elemento);

    elemento = DOM.newElement('button', 'o_botCancelar');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'cursor:pointer; margin-right: 5px; vertical-align:top;');  
    elemento.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); verificaAlteracao('+ codigo +')');
    elemento.innerHTML = 'Cancelar';
    divCadastro.appendChild(elemento);

    dialogoCadastro = new caixaDialogo('divCadastro', 545, 620, '../padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    Selector.$('divCadastro').style.overflow = 'hidden';

    Mask.setMoeda(Selector.$('o_percDesconto'));
    Mask.setMoeda(Selector.$('o_valorDesconto'));
    Mask.setMoeda(Selector.$('o_valorAcrescimo'));
    Mask.setMoeda(Selector.$('o_larguraP'));
    Mask.setMoeda(Selector.$('o_alturaP'));

    // Carrega o campo artistas com  o Autocomplete
    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=BuscaArtistas';
    p += '&codigo=' + codigo;
    ajax.Request(p);
 
    var json = JSON.parse(ajax.getResponseText() );
    var arrayArtistas = new Array();
    var arrayId = new Array();
    var idArtista = 0;

    for(var i=0; i < json.length; i++) {
        arrayArtistas.push(json[i].artista);
        arrayId.push(json[i].idArtista);
    }
    var countriesArray = $.map(arrayArtistas, function (value, key) { return { value: value, data: key }; });
      //var countriesArray2 = $.map(arrayId, function (value, key) { return { value: value, data: key }; });
    $('#o_artista').autocomplete({
        //serviceUrl: '/autosuggest/service/url',
        lookup: countriesArray, 
       lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },//,
        onHint: function (hint) {
            $('#autocomplete-ajax-x').val(hint);
        },
         serviceUrl: '/autocomplete/countries',
        onSelect: function (suggestion) {
            idArtista = arrayId[suggestion.data];
            Selector.$('o_artista').setAttribute('name', idArtista);
            Selector.$('o_artista').focus();
            CodigoArtista = idArtista;
            if(Selector.$('o_artista').value.trim() != ''){
                 Selector.$('o_artista').setAttribute('onblur', 'CarregaObras('+ CodigoArtista +')');
            }
        } 
    });

    if (codigo >= 0) {  
        CodigoObra = gridObras.getCellText(codigo, 13);
        CodigoArtista = gridObras.getCellText(codigo, 14);

        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', false, 'p');
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', false, 'i');
        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', false);
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', false);

        if (gridObras.getCellText(codigo, 12) == 1) {

            Selector.$('o_optPhoto').checked = 'checked';
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';
            var pasta = 'obras';
            AlternaTipoObras();
            Selector.$('o_artista').value = gridObras.getCellText(codigo,3);
            Selector.$('o_artista').name = gridObras.getCellText(codigo, 14);
            Selector.$('o_obra').name = gridObras.getCellText(codigo, 13);
            Selector.$('o_obra').value = gridObras.getCellText(codigo,4);
            CarregaObras(CodigoArtista);

            getTamanhosObras(false);
            Select.Show(Selector.$('o_tamanho'), gridObras.getCellText(codigo, 15));
            Select.Show(Selector.$('o_acabamento'), gridObras.getCellText(codigo, 16));
    
            Selector.$('o_altura').value = gridObras.getCellText(codigo, 17);
            Selector.$('o_largura').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_tiragem').value = gridObras.getCellText(codigo, 24);
            Selector.$('o_qtdeVendidos').value = gridObras.getCellText(codigo, 25);
            Selector.$('o_estrelas').value = gridObras.getCellText(codigo, 26);
            Selector.$('o_valor').value = gridObras.getCellText(codigo, 23);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 19);
            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 20);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 22);
            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 8);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 9);          
            Selector.$('o_imagem').setAttribute('value', gridObras.getCellText(codigo, 27));
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 27));

            if (gridObras.getCellText(codigo, 27) == '' || gridObras.getCellText(codigo, 27).split('/')[gridObras.getCellText(codigo, 27).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
                Selector.$('o_imagem').setAttribute('onclick', 'MostraImagemTamanhoReal("nenhuma");');
            } else {

                if (gridObras.getCellText(codigo, 27).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 27).split('.')[1] == 'rar') {
                    Selector.$('o_imagem').src = 'imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + gridObras.getCellText(codigo, 27) + '' + "');");
                } else {
                    Selector.$('o_imagem').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 27);
                    Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + pasta + "/" + gridObras.getCellText(codigo, 27) + "');");
                }
            }

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 28) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 28);

            Select.Show(Selector.$('o_grupoMoldura'), gridObras.getCellText(codigo, 29));
            getMoldurasObras(Selector.$('o_moldura'), 'Selecione uma moldura...', false, Selector.$('o_grupoMoldura').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_moldura'), gridObras.getCellText(codigo, 30));
        }
        else if (gridObras.getCellText(codigo, 12) == 2) {

            Selector.$('o_optInsta').checked = 'checked';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';

            var pasta = 'instaarts';

            AlternaTipoObras();
            
            getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);
            Select.Show(Selector.$('o_tamanhoI'), gridObras.getCellText(codigo, 15));

            Select.Show(Selector.$('o_acabamentoI'), gridObras.getCellText(codigo, 16));

            Selector.$('o_alturaI').value = gridObras.getCellText(codigo, 17);
            Selector.$('o_larguraI').value = gridObras.getCellText(codigo, 18);

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 23);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 19);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 20);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 22);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 8);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 9);
            Selector.$('o_imagem').setAttribute('value', gridObras.getCellText(codigo, 27));
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 27));

            if (gridObras.getCellText(codigo, 27) == '' || gridObras.getCellText(codigo, 27).split('/')[gridObras.getCellText(codigo, 27).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
                Selector.$('o_imagem').setAttribute('onclick', 'MostraImagemTamanhoReal("nenhuma");');
            } else {

                if (gridObras.getCellText(codigo, 27).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 27).split('.')[1] == 'rar') {
                    Selector.$('o_imagem').src = 'imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + gridObras.getCellText(codigo, 27) + '' + "');");
                } else if (gridObras.getCellText(codigo, 27).split('.')[1] == 'pdf') {
                    Selector.$('o_imagem').src = 'imagens/pdf.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute('onclick', "window.open('" + "imagens/" + pasta + "/" + gridObras.getCellText(codigo, 27) + "')");
                } else {
                    Selector.$('o_imagem').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 27);
                    Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + pasta + "/" + gridObras.getCellText(codigo, 27) + "');");
                }
            }

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 28) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 28);

            Select.Show(Selector.$('o_grupoMolduraI'), gridObras.getCellText(codigo, 29));
            getMoldurasObras(Selector.$('o_molduraI'), 'Selecione uma moldura...', false, Selector.$('o_grupoMolduraI').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_molduraI'), gridObras.getCellText(codigo, 30));
            
        }
        else {
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').checked = 'checked';

            var pasta = 'produtos';

            AlternaTipoObras();

            getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', false);

            Select.Show(Selector.$('o_produtoProd'), gridObras.getCellText(codigo, 16));

            Selector.$('o_alturaP').value = gridObras.getCellText(codigo, 17);
            Selector.$('o_larguraP').value = gridObras.getCellText(codigo, 18);

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 23);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 19);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 20);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 22);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 8);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 9);
            Selector.$('o_imagem').src = 'imagens/semarte.png';
            Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
            Selector.$('o_imagem').setAttribute('value', gridObras.getCellText(codigo, 27));
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 27));

            if (gridObras.getCellText(codigo, 27) == '' || gridObras.getCellText(codigo, 27).split('/')[gridObras.getCellText(codigo, 27).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
                Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
            } else {

                if (gridObras.getCellText(codigo, 27).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 27).split('.')[1] == 'rar') {
                    Selector.$('o_imagem').src = 'imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + gridObras.getCellText(codigo, 27) + '' + "');");
                } else if (gridObras.getCellText(codigo, 27).split('.')[1] == 'pdf') {
                    Selector.$('o_imagem').src = 'imagens/pdf.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                } else {
                    Selector.$('o_imagem').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 27);
                    Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + pasta + "/" + gridObras.getCellText(codigo, 27) + "');");
                }
            }
        }
    }
    else {

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', 0);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', true, 'p');
        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', true);
        Select.AddItem(Selector.$('o_moldura'), 'Selecione um grupo', 0);
        Selector.$('o_grupoMoldura').name = '0';

        getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', true);
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', true, 'i');
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', true);
        Select.AddItem(Selector.$('o_molduraI'), 'Selecione um grupo', 0);
        Selector.$('o_grupoMolduraI').name = '0';

        getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', true);

        AlternaTipoObras();
        Selector.$('o_artista').focus();
    }

    if (!CheckPermissao(51, false, '', false)) {
        Selector.$('divObrasValores').style.display = 'none';
        Selector.$('divObrasValores').childNodes[2].style.display = 'inline-block';
        Selector.$('divObrasValores').childNodes[3].style.display = 'inline-block';
    }
}


function verificaAlteracao (codigo){ 


    if(codigo < 0){
        dialogoCadastro.Close();
        return;
    }

    

    var validacao = true;
    if(Selector.$('o_artista').value != gridObras.getCellText(codigo,3)){
       validacao = false;
    }
     if(Selector.$('o_obra').value != gridObras.getCellText(codigo,4)){
          validacao = false;
    }   

    if(Selector.$('o_tamanho').value != gridObras.getCellText(codigo, 15)){
         validacao = false;
    }   

    if(Selector.$('o_acabamento').value != gridObras.getCellText(codigo, 16)){
         validacao = false;
    }

    if(Selector.$('o_altura').value != gridObras.getCellText(codigo, 17)){
          validacao = false;
    }

    if(Selector.$('o_largura').value != gridObras.getCellText(codigo, 18)){
          validacao = false;
    }
    if(Selector.$('o_tiragem').value != gridObras.getCellText(codigo, 24)){
          validacao = false;
    }

    if(Selector.$('o_percDesconto').value != gridObras.getCellText(codigo, 20)){
          validacao = false;
    }

    if(Selector.$('o_valor').value != gridObras.getCellText(codigo, 23)){
        validacao = false;
    }

    if(Selector.$('o_valorAcrescimo').value != gridObras.getCellText(codigo, 22)){
          validacao = false;
    }
     if(Selector.$('o_valorDesconto').value != gridObras.getCellText(codigo, 21)){
         validacao = false;
    }

     if(Selector.$('o_obs').value != gridObras.getCellText(codigo, 9)){
          validacao = false;
    }   
    if(Select.Show(Selector.$('o_moldura'), gridObras.getCellText(codigo, 30))){
          validacao = false;
    }
    if(validacao == false){
        mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Aviso", "Deseja descartas as alterações?", "OK", "verificaAlteracaoAux()", true, "");
        mensagem.Show();

    }else{
        dialogoCadastro.Close();

    }
            
            
}

function verificaAlteracaoAux(){
        dialogoCadastro.Close();
        mensagem.Close();
}
    


function CarregaObras (codigo){
    if(Selector.$('o_artista').value.trim() != ''){

        var  arrayObras = new Array ();
        var arrayIdObras = new Array ();
        var ajax = new Ajax('POST', 'php/propostas.php', false);
        var p = 'action=BuscaObras';
        p += '&codigo=' + codigo;
        ajax.Request(p);

        var json2 = JSON.parse(ajax.getResponseText() );
        var arrayArtistas = new Array();
        var arrayIdObras = new Array();
        var idObra = 0;

        for(var i=0; i < json2.length; i++) {
            arrayObras.push(json2[i].obra);
            arrayIdObras.push(json2[i].idObra);
        }
        var countriesArray = $.map(arrayObras, function (value, key) { return { value: value, data: key }; });
          //var countriesArray2 = $.map(arrayId, function (value, key) { return { value: value, data: key }; });
        $('#o_obra').autocomplete({
            //serviceUrl: '/autosuggest/service/url',
            lookup: countriesArray, 
           lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
                var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
                return re.test(suggestion.value);
            },//,
            onHint: function (hint) {
                $('#o_obra_x').val(hint);
            },
             serviceUrl: '/autocomplete/countries',
            onSelect: function (suggestion) {
                idObra = arrayIdObras[suggestion.data];
                Selector.$('o_obra').setAttribute('name', idObra);
                Selector.$('o_obra').focus();
                Selector.$('o_obra').setAttribute('onblur', 'getTamanhosObras(true)');
                CodigoObra = idObra;
            } 
        });

        getObrasArtista(false);
    }else{

        Selector.$('o_obra').value  = '';
        Selector.$('o_obra').name  = 0;
        Selector.$('o_artista').value  = '';
        Selector.$('o_artista').name  = 0;
    }
}

function getMolduras(ascinc) {

    var cmb = (Selector.$('o_optPhoto').checked ? Selector.$('o_grupoMoldura') : Selector.$('o_grupoMolduraI'));
    var cmbMoldura = (Selector.$('o_optPhoto').checked ? Selector.$('o_moldura') : Selector.$('o_molduraI'));

    if (cmb.selectedIndex <= 0) {
        Select.Clear(cmbMoldura);
        Select.AddItem(cmbMoldura, 'Selecione um grupo', 0);
    }

    if (cmb.value != cmb.name) {
        cmb.name = cmb.value;

        getMoldurasObras(cmbMoldura, 'Selecione uma moldura...', ascinc, cmb.value, Selector.$('o_optPhoto').checked);
        getDetalhesAcabamento();
    }
}

function getDetalhesAcabamento() {

    var valor = Selector.$('o_valor');
    var valorTotal = Selector.$('o_valorTotal');

    if (Selector.$('o_optPhoto').checked) {
        if (Selector.$('o_acabamento').value != Selector.$('o_acabamento').name) {
            Selector.$('o_acabamento').name = Selector.$('o_acabamento').value;
        }
        else {
            if (Selector.$('o_moldura').value != Selector.$('o_moldura').name) {
                Selector.$('o_moldura').name = Selector.$('o_moldura').value;
            }
            else {
                return;
            }
        }

        var artista = Selector.$('o_artista').getAttribute('name');
        var obra = Selector.$('o_obra').getAttribute('name');
        var tamanho = Selector.$('o_tamanho');
        var acabamento = Selector.$('o_acabamento');

        var moldura = Selector.$('o_moldura');

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
        p += '&idMoldura=' + moldura.value;
        p += '&altura=' + altura.value;
        p += '&largura=' + largura.value;
        p += '&estrelas=' + estrelas.value;
        p += '&item=' + (Selector.$('o_optPhoto').checked ? 'p' : 'i');

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText() );

            valor.value = json.valorObra;

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            if(json.imagemMoldura == 0){
                Selector.$('divImgMoldura').style.display = 'none';
            }else{
                Selector.$('divImgMoldura').style.display = 'inline-block';
                Selector.$('divImgMoldura').style.verticalAlign = 'top';
                Selector.$('imagemMoldura').src = 'imagens/molduras/' + json.imagemMoldura;
            }

            TotalizaObras(true, false, false, false);
            //Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
    else {

        var tamanho = Selector.$('o_tamanhoI');
        var acabamento = Selector.$('o_acabamentoI');
        var moldura = Selector.$('o_molduraI');

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
        p += '&idMoldura=' + moldura.value;
        p += '&altura=' + altura.value;
        p += '&largura=' + largura.value;
        p += '&item=' + (Selector.$('o_optPhoto').checked ? 'p' : 'i');

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
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

            if(json.imagemMoldura == 0){
                Selector.$('divImgMoldura').style.display = 'none';
            }else{
                Selector.$('divImgMoldura').style.display = 'inline-block';
                Selector.$('divImgMoldura').style.verticalAlign = 'top';
                Selector.$('imagemMoldura').src = 'imagens/molduras/' + json.imagemMoldura;
            }

            TotalizaObras(true, false, false, false);
            //Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
}

function TotalizaObras(is_qtd, is_percDesconto, is_valorDesconto, is_valorAcrescimo) {
    //FAZER A TOTALIZA OBRA
    var valorAcrescimo = Number.parseFloat(Selector.$('o_valorAcrescimo').value);
    
    if (is_valorAcrescimo) {
        if (valorAcrescimo > 0) {
            if (valorAcrescimo > (total)) {
                //Selector.$('o_valorAcrescimo').value = Number.FormatDinheiro((total));
                //valorAcrescimo = total;
            }
        }
        else {
            Selector.$('o_valorAcrescimo').value = '';
        }
    }
    
    var total = (Number.parseFloat(Selector.$('o_valor').value)+valorAcrescimo) * Number.parseFloat(Selector.$('o_qtde').value);
    var percDesconto = Number.parseFloat(Selector.$('o_percDesconto').value);
    var valorDesconto = Number.parseFloat(Selector.$('o_valorDesconto').value);
    

    if (total <= 0) {
        return;
    }

    if (is_qtd || is_percDesconto) {
        if (percDesconto > 0) {
            if (percDesconto > 100) {
                Selector.$('o_percDesconto').value = '100,00';
                percDesconto = 100;
            } else if (descontoMaximoObra == '0,00' || descontoMaximoObra == '') {
                Selector.$('o_percDesconto').value = '0,00';
                percDesconto = 0;
            } else if (percDesconto > Number.parseFloat(descontoMaximoObra) && !VerificarAdmin()) {
                Selector.$('o_percDesconto').value = Number.parseFloat(descontoMaximoObra);
                percDesconto = Number.parseFloat(descontoMaximoObra);
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
            } else if (descontoMaximoObra == '0,00' || descontoMaximoObra == '') {
                Selector.$('o_percDesconto').value = '0,00';
                Selector.$('o_valorDesconto').value = '0,00';
                valorDesconto = 0;
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) > Number.parseFloat(descontoMaximoObra) && !VerificarAdmin()) {

                Selector.$('o_percDesconto').value = Number.parseFloat(descontoMaximoObra);
                percDesconto = Number.parseFloat(descontoMaximoObra);
                Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total) * (percDesconto / 100));

            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) <= Number.parseFloat(descontoMaximoObra) || VerificarAdmin()) {
                Selector.$('o_percDesconto').value = Number.FormatDinheiro((valorDesconto / (total)) * 100);
            }
        }
        else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    Selector.$('o_valorTotal').value = Number.FormatDinheiro((total) - Number.parseFloat(Selector.$('o_valorDesconto').value)); //+ Number.parseFloat(Selector.$('o_valorAcrescimo').value)
}

function AlternaTipoObras() {
    Selector.$('lblInfoEstoque').innerHTML = '';

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';
        dialogoCadastro.Realinhar(550, 620);

        getTamanhosObras(true);
        //Selector.$('divIncluirImagem').style.display = 'none';
        Selector.$('divImgMoldura').style.display = 'none';
        Selector.$('lblIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        dialogoCadastro.Realinhar(535, 620);

        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        //Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('divImgMoldura').style.display = 'none';
        Selector.$('lblIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem()');
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

        dialogoCadastro.Realinhar(490, 620);

        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        //Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('divImgMoldura').style.display = 'none';
        Selector.$('lblIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem()');
    }
}

function getDadosProduto() {

    var cmb = Selector.$('o_produtoProd');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '0';
        Selector.$('o_valor').value = '0,00';
        Selector.$('o_valorTotal').value = '0,00';
        return;
    }

    if (cmb.name != cmb.value) {
        cmb.name = cmb.value;
    }
    else {
        return;
    }
    var aux = Select.GetText(cmb).split('-');
    Selector.$('o_valor').value = aux[aux.length - 1];

    Selector.$('o_qtde').value = '1';
    Selector.$('o_qtde').select();

    TotalizaObras(true, false, false, false);
}

function IncluirObra(linha) {

    if (linha != '-1') {
        if (!CheckPermissao(159, true, 'Você não possui permissão para editar uma obra do pedido', false)) {
            return;
        }
    }

    var altura;
    var largura;

    if (Selector.$('o_optPhoto').checked) {

        altura = (parseFloat(Selector.$('o_altura').value) / 100);
        largura = (parseFloat(Selector.$('o_largura').value) / 100);

        var metro = (altura * largura);

        if (Selector.$('o_artista').value.trim() == '') {
            MostrarMsg('Por favor, selecione um artista', 'o_artista');
            return;
        }
        if (Selector.$('o_obra').value.trim() == '') {
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

        if (Selector.$('o_acabamento').options[Selector.$('o_acabamento').selectedIndex].id == '1') {

            if (parseFloat(metro) > 1) {
                MostrarMsg('Não é possível utilizar este acabamento, pois o tamanho da obra é maior que 1m².', 'o_acabamento');
                return;
            }
        }
    }

    if (Selector.$('o_optInsta').checked) {

        altura = (parseFloat(Selector.$('o_alturaI').value) / 100);
        largura = (parseFloat(Selector.$('o_larguraI').value) / 100);

        var metro = (altura * largura);

        if (Selector.$('o_tamanhoI').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um tamanho', 'o_tamanho');
            return;
        }

        if (Selector.$('o_acabamentoI').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um acabamento', 'o_acabamento');
            return;
        }

        if (Selector.$('o_acabamentoI').options[Selector.$('o_acabamentoI').selectedIndex].id == '1') {

            if (parseFloat(metro) > 1) {
                MostrarMsg('Não é possível utilizar este acabamento, pois o tamanho da obra é maior que 1m².', 'o_acabamentoI');
                return;
            }
        }
    }

    if (Selector.$('o_optProduto').checked) {
        if (Selector.$('o_produtoProd').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um produto', 'o_produtoProd');
            return;
        }
    }

    var pasta = '';
    var tipo = 0;
    var nomeTipo = '';
    var photoArts = Selector.$('o_optPhoto').checked;
    var instaArts = Selector.$('o_optInsta').checked;

    if (photoArts) {
        nomeTipo = 'PhotoArts';
        tipo = 1;
        pasta = 'obras';
    }
    else if (instaArts) {
        nomeTipo = 'InstaArts';
        tipo = 2;
        pasta = 'instaarts';
    }
    else {
        nomeTipo = 'Produtos';
        tipo = 3;
        pasta = 'produtos';
    }
     
    var imgelemento = DOM.newElement('img');
        imgelemento.setAttribute('id', 'o_imagem2');
        imgelemento.setAttribute('class', 'textbox_cinzafoco');
        imgelemento.setAttribute('src', 'imagens/' + pasta + '/mini_' + Selector.$('o_imagem').getAttribute('name'));
        imgelemento.setAttribute('style','cursor:pointer; title="Ver Imagem"; width:60px; height:60px;');
        imgelemento.setAttribute("onclick", "MostraImagemTamanhoReal( 'imagens/" + pasta + '/' + Selector.$('o_imagem').getAttribute('name') + "');");
    
    if (linha >= 0) {

        gridObras.setCellObject(linha, 0, DOM.newText(linha + 1));
        gridObras.setCellObject(linha, 1, imgelemento);
        gridObras.setCellText(linha, 2, nomeTipo);
        gridObras.setCellText(linha, 3, (photoArts ? Selector.$('o_artista').value : '- - -'));
        gridObras.setCellText(linha, 4, (photoArts ? Selector.$('o_obra').value : '- - -'));
        gridObras.setCellText(linha, 5, (photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -')));
        gridObras.setCellText(linha, 6, (photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd')))));
        gridObras.setCellText(linha, 7, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 8, Selector.$('o_valorTotal').value);
        gridObras.setCellText(linha, 9, Selector.$('o_obs').value);
        //OCULTAS
        gridObras.setCellText(linha, 12, tipo);
        gridObras.setCellText(linha, 13, (photoArts ? CodigoObra : '0'));
        gridObras.setCellText(linha, 14, (photoArts ? CodigoArtista : '0'));
        gridObras.setCellText(linha, 15, (photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0')));
        gridObras.setCellText(linha, 16, (photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value)));
        gridObras.setCellText(linha, 17, (photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : Selector.$('o_alturaP').value)));
        gridObras.setCellText(linha, 18, (photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : Selector.$('o_larguraP').value)));
        gridObras.setCellText(linha, 19, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 20, Selector.$('o_percDesconto').value);
        gridObras.setCellText(linha, 21, Selector.$('o_valorDesconto').value);
        gridObras.setCellText(linha, 22, Selector.$('o_valorAcrescimo').value);
        gridObras.setCellText(linha, 23, Selector.$('o_valor').value);
        gridObras.setCellText(linha, 24, (photoArts ? Selector.$('o_tiragem').value : '0'));
        gridObras.setCellText(linha, 25, (photoArts ? Selector.$('o_qtdeVendidos').value : '0'));
        gridObras.setCellText(linha, 26, (photoArts ? Selector.$('o_estrelas').value : '0'));
        gridObras.setCellText(linha, 27, Selector.$('o_imagem').getAttribute('name'));
        gridObras.setCellText(linha, 28, (photoArts || instaArts ? Selector.$('o_lblPeso').name : '0'));
        gridObras.setCellText(linha, 29, (photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0')));
        gridObras.setCellText(linha, 30, (photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0')));
        
    }
    else {

        var divEditarDuplicar = DOM.newElement('div');

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px; display:inline-block');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var duplicar = DOM.newElement('img');
        duplicar.setAttribute('src', 'imagens/duplicate.png');
        duplicar.setAttribute('title', 'Duplicar Obra');
        duplicar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
        duplicar.setAttribute('class', 'efeito-opacidade-75-04');
        duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

        divEditarDuplicar.appendChild(editar);
        divEditarDuplicar.appendChild(duplicar);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        gridObras.addRow([
            DOM.newText(gridObras.getRowCount() + 1),
            imgelemento,
            DOM.newText(nomeTipo),
            DOM.newText((photoArts ? Selector.$('o_artista').value : '- - -')),
            DOM.newText((photoArts ? Selector.$('o_obra').value : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -'))),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd'))))),
            DOM.newText(Selector.$('o_qtde').value),
            DOM.newText(Selector.$('o_valorTotal').value),
            DOM.newText(Selector.$('o_obs').value),
            divEditarDuplicar,
            excluir,
            //OCULTOS
            DOM.newText(tipo),
            DOM.newText((photoArts ? Selector.$('o_obra').name : '0')),
            DOM.newText((photoArts ? Selector.$('o_artista').name : '0')),
            DOM.newText((photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value))),
            DOM.newText((photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : Selector.$('o_alturaP').value))),
            DOM.newText((photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : Selector.$('o_alturaP').value))),
            DOM.newText(Selector.$('o_qtde').value),
            DOM.newText(Selector.$('o_percDesconto').value),
            DOM.newText(Selector.$('o_valorDesconto').value),
            DOM.newText(Selector.$('o_valorAcrescimo').value),
            DOM.newText(Selector.$('o_valor').value),
            DOM.newText((photoArts ? Selector.$('o_tiragem').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_qtdeVendidos').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_estrelas').value : '0')),
            DOM.newText(Selector.$('o_imagem').getAttribute('name')),
            DOM.newText((photoArts || instaArts ? Selector.$('o_lblPeso').name : '0')),
            DOM.newText((photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0')))
        ]);
    }
    var cor = false;
    for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {
        gridObras.getCell(i, 0).setAttribute('style', 'text-align:center;width:20px');
        gridObras.getCell(i, 1).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(i, 2).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 5).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 6).setAttribute('style', 'text-align:center;');
        gridObras.getCell(i, 7).setAttribute('style', 'text-align:right;');
        gridObras.getCell(i, 8).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 9).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 10).setAttribute('style', 'text-align:center;');
        gridObras.getCell(i, 11).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

  
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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    dialogoCadastro.Close();
    Totaliza(true, false, false, false, false);
    alteracao = true;
}

function Totaliza(is_grids, is_frete, is_acrescimo, is_percDesconto, is_valorDesconto) {

    var total1 = Number.getFloat(gridObras.SumCol(8));
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
            } else if (descontoMaximo == '0,00' || descontoMaximo == '') {
                Selector.$('percDesconto').value = '0,00';
                percDesconto = 0;
            } else if (percDesconto > Number.parseFloat(descontoMaximo) && !VerificarAdmin()) {
                Selector.$('percDesconto').value = Number.parseFloat(descontoMaximo);
                percDesconto = Number.parseFloat(descontoMaximo);
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
            } else if (descontoMaximo == '0,00' || descontoMaximo == '') {
                Selector.$('percDesconto').value = '0,00';
                Selector.$('valorDesconto').value = '0,00';
                valorDesconto = 0;
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total1)) * 100)) > Number.parseFloat(descontoMaximo) && !VerificarAdmin()) {
                Selector.$('percDesconto').value = Number.parseFloat(descontoMaximo);
                percDesconto = Number.parseFloat(descontoMaximo);
                Selector.$('valorDesconto').value = Number.FormatDinheiro((total1) * (percDesconto / 100));
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total1)) * 100)) <= Number.parseFloat(descontoMaximo) || VerificarAdmin()) {
                Selector.$('percDesconto').value = Number.FormatDinheiro((valorDesconto / (total1)) * 100);
            }
        }
        else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    Selector.$('valorTotal').value = Number.FormatDinheiro((total1 - Number.parseFloat(Selector.$('valorDesconto').value)) + valorFrete + valorAcrescimo);

    Selector.$('valorSaldo').value = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorTotal').value) - Number.getFloat(gridPagamento.SumCol(1)));
    getPercentualComissaoMarchand();
}

function getObrasArtista(assincrona) {

    Select.Clear(Selector.$('o_obra'));
    if (Selector.$('o_artista').value != Selector.$('o_artista').name) {

        //Selector.$('o_artista').name = Selector.$('o_artista').value.toString();
    }




    if (Selector.$('o_artista').value == '0') {
        getDadosTamanho('p');
       // Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregas', '0', '');
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

            if (ajax.getResponseText() == '0') {
                return;
            }

            Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
            Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
        };

        Select.AddItem(Selector.$('o_obra'), 'Carregando obras...', '0', '');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            return;
        }

        Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
        Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
    }
}

function getTamanhosObras(assincrona) {

    Selector.$('lblInfoEstoque').innerHTML = '';

    if (Selector.$('o_obra').value != Selector.$('o_obra').name) {
        //Selector.$('o_obra').name = Selector.$('o_obra').value;
        Selector.$('o_acabamento').selectedIndex = 0;
        Selector.$('o_grupoMoldura').selectedIndex = 0;
        Selector.$('o_moldura').selectedIndex = 0;

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

    if (Selector.$('o_artista').value == '0' || Selector.$('o_obra').value == '0') {
        Select.Clear(Selector.$('o_tamanho'));
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', assincrona);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + CodigoObra;

    if (assincrona) {

        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_tamanho'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_imagem').src = json[0].imagem;
            Selector.$('o_imagem').setAttribute('name', json[0].img);
            Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px; cursor:pointer;');
            Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + json[0].imagemReal + "');");

            Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
        };

        Select.AddItem(Selector.$('o_tamanho'), 'Carregando tamanhos...', '0', '');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Selector.$('o_imagem').src = json[0].imagem;
        Selector.$('o_imagem').setAttribute('name', json[0].img);
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px; cursor:pointer;');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + json[0].imagem + "');");

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
    }
    
    
}

function getDadosTamanho(item) {

        if (item == 'p') {
        if (Selector.$('o_tamanho').value != Selector.$('o_tamanho').name) {
            Selector.$('o_tamanho').name = Selector.$('o_tamanho').value;

            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_grupoMoldura').selectedIndex = 0;
            Selector.$('o_moldura').selectedIndex = 0;

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

        if (Selector.$('o_tamanho').value == '0' || Selector.$('o_artista').name == '0' || Selector.$('o_obra').name == '0') {

            if (Selector.$('o_artista').name == '0' || Selector.$('o_obra').name == '0') {
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

            if (ajax.getResponseText() == '0') {
                return;
            }
            var json = JSON.parse(ajax.getResponseText());
           // alert(json.estrelas);
            //alert(json.estrelaAtual);
            Selector.$('o_altura').value = json.altura;
            Selector.$('o_largura').value = json.largura;
            Selector.$('o_tiragem').value = json.tiragemMaxima;
            Selector.$('o_qtdeVendidos').value = json.qtdTotalVendida;
            Selector.$('o_estrelas').value = json.estrelas;

            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_acabamento').value = 0;
            Selector.$('o_acabamento').name = 0;

            /*
        if(json.estrelas != json.estrelaAtual){
            //var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Mudança de Estrela", "OK", "", false, "");
            //mensagem.Show();
            return;
         }*/

        };

        ajax.Request(p);
    }
    if (item == 'i') {
        if (Selector.$('o_tamanhoI').value != Selector.$('o_tamanhoI').name) {
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

        if (Selector.$('o_tamanhoI').value == '0') {
            Selector.$('o_acabamentoI').selectedIndex = 0;
            Selector.$('o_acabamentoI').value = 0;
            Selector.$('o_acabamentoI').name = 0;
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

            if (ajax.getResponseText() == 0) {
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
            Selector.$('o_acabamentoI').name = 0;
        };

        ajax.Request(p);
    }
}
function AtualizaEstrela() {

    if(Selector.$('o_qtde').value <= 0){
        var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Digite uma quantidade válida", "OK", "", false, "");
         mensagem.Show();
         return;
    }
    
    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=AtualizaEstrela';
    p += '&idArtistaObraTamanho=' + Selector.$('o_tamanho').value;
    p += '&qtd=' + Selector.$('o_qtde').value;
    ajax.Request(p);
    var json = JSON.parse(ajax.getResponseText());
    Selector.$('o_estrelas').value = json.estrelas;
    if(json.estrelas != json.estrelaAtual){
        mensagemQtdEstrela = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Mudança de Estrela", "OK", "EnviarEmailEstrela(" + json.estrelas + ", " + json.estrelaAtual + ");", false, "");
        mensagemQtdEstrela.Show();
        return;
    }
}

function EnviarEmailEstrela(estrela, estrelaAtual) {

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = "action=EnviarEmailEstrela";
    p += "&estrela=" + estrela;
    p += "&estrelaAtual=" + estrelaAtual;
    p += "&obra=" + Selector.$('o_obra').value;
    p += "&artista=" + Selector.$('o_artista').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if(ajax.getResponseText() == "0") {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            mensagemQtdEstrela.Close();
        }
    }

    ajax.Request(p);
}

function ExcluirObraAux(linha) {

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 152, "4", "Atenção", "Deseja realmente excluir esta obra?", "OK", "ExcluirObra(" + linha + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirObra(linha) {

    mensagemExcluirObra.Close();

    if (gridPagamento.getRowCount() > 0 && gridObras.getRowData(linha) > 0) {
        MostrarMsg("Não é possível excluir a obra, pois o pagamento do pedido foi gerado.", "");
        return;
    }

    var idObra = gridObras.getRowData(linha);

    if (idObra > 0) {

        var ajax = new Ajax('POST', 'php/pedidos.php', false);
        var p = 'action=ExcluirObra';
        p += '&idPedido=' + codigoAtual;
        p += '&idObra=' + idObra;
        p += '&idTamanho=' + gridObras.getCellText(linha,15);
        p += '&numeroObras=' + gridObras.getCellText(0,7);
        ajax.Request(p);
    }

    gridObras.deleteRow(linha);
    var cor = false;

    for (var i = 0; i < gridObras.getRowCount(); i++) {

        //Botão Editar
        gridObras.getCellObject(i, 10).childNodes[0].setAttribute('onclick', 'AdicionarObra(' + i + ')');
        //Botão Duplicar
        gridObras.getCellObject(i, 10).childNodes[1].setAttribute('onclick', 'DuplicarObra(' + i + ')');
        gridObras.getCellObject(i, 11).setAttribute('onclick', 'ExcluirObra(' + i + ')');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");
        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

    Selector.$('valor').value = Number.FormatMoeda(gridObras.SumCol(8));
    Selector.$('valorTotal').value = Number.FormatMoeda(gridObras.SumCol(8));
    getPercentualComissaoMarchand();
    CalcularValorTotal();
}

function CalculaPrevisaoEntrega(dataAtual) {
    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=CalculaPrevisaoEntrega';
    p += '&dataAtual=' + dataAtual;

    ajax.Request(p);
      
    dataEntrega = ajax.getResponseText();

    return dataEntrega;
}

function CalcularValorTotal() {

    var valor = Number.parseFloat(Selector.$('valor').value);
    var valorFrete = Number.parseFloat(Selector.$('frete').value);
    var valorAcrescimo = Number.parseFloat(Selector.$('acrescimo').value);
    var valorDesconto = 0;
    var valorTotal = 0;

    Selector.$('percDesconto').onblur = function () {

        if (Selector.$('percDesconto').value.trim() == ',' || Selector.$('percDesconto').value.trim() == '' || Selector.$('percDesconto').value.trim() == '0') {
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
        Selector.$('valorSaldo').value = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorTotal').value) - Number.getFloat(gridPagamento.SumCol(1)));
    }

    Selector.$('valorDesconto').onblur = function () {

        if (Selector.$('valorDesconto').value.trim() == ',' || Selector.$('valorDesconto').value.trim() == '' || Selector.$('valorDesconto').value.trim() == '0') {
            Selector.$('valorDesconto').value = '0,00';
            Selector.$('percDesconto').value = '0';
        }

        if (Number.parseFloat(Selector.$('valorDesconto').value) > valor) {
            MostrarMsg("O valor de desconto não pode ser maior que o valor do pedido.", 'valorDesconto');
            return;
        }

        valorDesconto = (Number.ValorE(Selector.$('valorDesconto').value) * 100) / valor;
        Selector.$('percDesconto').value = valorDesconto.toFixed(0);

        valorTotal = ((valor + valorFrete + valorAcrescimo) - Number.parseFloat(Selector.$('valorDesconto').value));
        Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
        valorComissaoMarchand = ((valorTotal * Number.parseFloat(percentualComissaoMarchand)) / 100);
        Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
    }

    valorTotal = ((valor + valorFrete + valorAcrescimo) - Number.parseFloat(Selector.$('valorDesconto').value));
    Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    valorComissaoMarchand = ((valorTotal * Number.parseFloat(percentualComissaoMarchand)) / 100);
    Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
    Selector.$('valorSaldo').value = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorTotal').value) - Number.getFloat(gridPagamento.SumCol(1)));
}

function getPercentualComissaoMarchand() {

    if (Selector.$('valorTotal').value.trim() == '' || Selector.$('valorTotal').value.trim() == ',') {
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=getPercentualComissaoMarchand';
    p += '&idMarchand=' + Selector.$('vendedor').value;
    ajax.Request(p);

    if (ajax.getResponseText() != '0') {
        percentualComissaoMarchand = ajax.getResponseText();
        Selector.$('comissaoVendedor').value = "(" + percentualComissaoMarchand + "%)";

        if (Selector.$('valorTotal').value.trim() != '' || Selector.$('valorTotal').value.trim() != ',') {
            valorComissaoMarchand = ((Number.parseFloat(Selector.$('valorTotal').value) * Number.parseFloat(percentualComissaoMarchand)) / 100);
            Selector.$('comissaoVendedor').value = Number.FormatMoeda(valorComissaoMarchand.toFixed(2)) + " (" + percentualComissaoMarchand + "%)";
        }
    }
}

function PromptStatus() {

    if (!CheckPermissao(54, true, 'Você não possui permissão para visualizar o histórico de status do pedido', false)) {
        return;
    }

    if (codigoAtual <= 0) {
        MostrarMsg("Selecione ou grave um pedido para visulizar o histórico ou alterar um status.", '');
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

    dialogoStatus = new caixaDialogo('promptStatus', 450, 500, '../padrao/', 130);
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
    
    if (ajax.getResponseText() == '0') {
        Select.AddItem(cmb, 'Não foi encontrado nenhum status', 0);
        return;
    }

    Select.AddItem(cmb, "Selecione um status", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVStatus', 'status');    

    var json = JSON.parse(ajax.getResponseText() );
        
    Select.Show(cmb, json.idUltimoStatus);
    
}

function MostraHistoricoStatusPedido() {

    gridStatus.clearRows();

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=MostraHistoricoStatusPedido';
    p += '&idPedido=' + codigoAtual;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
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

    if (!CheckPermissao(53, true, 'Você não possui permissão para alterar o status de um pedido', false)) {
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=AlterarStatusPedido';
    p += '&idPedido=' + codigoAtual;
    p += '&idStatus=' + Selector.$('cmbStatus').value;
    p += '&descricaoStatus=' + Select.GetText(Selector.$('cmbStatus'));

    ajax.Request(p);

    if (ajax.getResponseText() != '0') {
        dialogoStatus.Close();
        Mostra(codigoAtual, false);
        MostraHistoricoStatusPedido();
    }
}

function PromptGerarPagamento() {
    Totaliza(true, false, false, false, false);
    
    if (Number.parseFloat(Selector.$('valorSaldo').value) <= 0) {
        MostrarMsg("Não existe valor a ser pago.", "");
        return;
    }

    if (!isElement('div', 'divPromptGerarParcelas')) {
        var div = DOM.newElement('div', 'divPromptGerarParcelas');
        document.body.appendChild(div);
    }

    var divPromptGerarParcelas = Selector.$('divPromptGerarParcelas');
    divPromptGerarParcelas.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptGerarParcelas.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var divData = DOM.newElement('div');
    divData.setAttribute('class', 'divcontainer');
    divData.setAttribute('style', 'max-width:100px;');

    var lblData = DOM.newElement('label');
    lblData.innerHTML = "Data <span style='color:red'>*</span>";
    lblData.setAttribute("style", "text-align:center");

    var txtData = DOM.newElement('text', 'dataPagamento');
    txtData.setAttribute('class', 'textbox_cinzafoco');
    txtData.setAttribute('style', 'width:100%;');

    divData.appendChild(lblData);
    divData.appendChild(txtData);

    var divSaldo = DOM.newElement('div');
    divSaldo.setAttribute('class', 'divcontainer');
    divSaldo.setAttribute('style', 'max-width:120px; margin-left:10px;');

    var lblSaldo = DOM.newElement('label');
    lblSaldo.innerHTML = "Valor Pago <span style='color:red'>*</span>";
    lblSaldo.setAttribute("style", "text-align:center");

    var txtSaldo = DOM.newElement('text', 'saldoPagar3');
    txtSaldo.setAttribute('class', 'textbox_cinzafoco');
    txtSaldo.setAttribute('style', 'width:100%; text-align:right;');

    divSaldo.appendChild(lblSaldo);
    divSaldo.appendChild(txtSaldo);

    var divRecibo = DOM.newElement('div');
    divRecibo.setAttribute('class', 'divcontainer');
    divRecibo.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblRecibo = DOM.newElement('label');
    lblRecibo.innerHTML = "Nº Recibo";
    lblRecibo.setAttribute("style", "text-align:center");

    var txtRecibo = DOM.newElement('text', 'numrecibo');
    txtRecibo.setAttribute('class', 'textbox_cinzafoco');
    txtRecibo.setAttribute('style', 'width:100%; text-align:right;');

    divRecibo.appendChild(lblRecibo);
    divRecibo.appendChild(txtRecibo);

    var divFormaPagamento = DOM.newElement('div');
    divFormaPagamento.setAttribute('class', 'divcontainer');
    divFormaPagamento.setAttribute('style', 'max-width:300px;');

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.innerHTML = "Forma Pagamento <span style='color:red'>*</span>";
    lblFormaPagamento.setAttribute("style", "text-align:center");

    var cmbFormaPagamento = DOM.newElement('select', 'formaPagamento');
    cmbFormaPagamento.setAttribute('style', 'width:100%;');
    cmbFormaPagamento.setAttribute('class', 'combo_cinzafoco');

    divFormaPagamento.appendChild(lblFormaPagamento);
    divFormaPagamento.appendChild(cmbFormaPagamento);

    var divQtdeParcelas = DOM.newElement('div');
    divQtdeParcelas.setAttribute('class', 'divcontainer');
    divQtdeParcelas.setAttribute('style', 'max-width:100px;');

    var lblQtdParcelas = DOM.newElement('label');
    lblQtdParcelas.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblQtdParcelas.innerHTML = 'Qtde. Parcelas';

    var cmbQtdParcelas = DOM.newElement('text', 'qtdParcelas');
    cmbQtdParcelas.setAttribute('style', 'width:100%;');
    cmbQtdParcelas.setAttribute('class', 'textbox_cinzafoco');
    cmbQtdParcelas.setAttribute('value', '1');

    divQtdeParcelas.appendChild(lblQtdParcelas);
    divQtdeParcelas.appendChild(cmbQtdParcelas);

    var cmdTexto1 = DOM.newElement('button', 'btGerarParcelas2');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'AdicionarParcelas()');
    cmdTexto1.innerHTML = "Gerar";

    //====== Tabela ======//
    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br>';
    divform.appendChild(divData);
    divform.appendChild(divSaldo);
    divform.innerHTML += '<br>';
    divform.appendChild(divFormaPagamento);
    divform.appendChild(divRecibo);
    divform.innerHTML += '<br>';

    divform.appendChild(divQtdeParcelas);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto1);

    dialogoGerarParcelas = new caixaDialogo('divPromptGerarParcelas', 290, 500, '../padrao/', 140);
    dialogoGerarParcelas.Show();

    Mask.setData(Selector.$('dataPagamento'));
    Selector.$('dataPagamento').value = Date.GetDate(false);
    Mask.setMoeda(Selector.$('saldoPagar3'));
    Mask.setOnlyNumbers(Selector.$('qtdParcelas'));

    Selector.$('saldoPagar3').value = Selector.$('valorSaldo').value;
    getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", false);

    for (var i = 1; i < 4; i++) {
        Select.AddItem(Selector.$('qtdParcelas'), i + "x", i);
    }
}

function AdicionarParcelas() {

    if (Selector.$('dataPagamento').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a data do pagamento", "OK", "", false, "dataPagamento");
        mensagem.Show();
        return;
    }

    if (!Date.isDate(Selector.$('dataPagamento').value)) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha uma data correta.", "OK", "", false, "dataPagamento");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('saldoPagar3').value) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor pago.", "OK", "", false, "saldoPagar3");
        mensagem.Show();
        return;
    }

    if (Selector.$('formaPagamento').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione a forma de pagamento", "OK", "", false, "formaPagamento");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('qtdParcelas').value) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Informe uma qtde válida de parcelas", "OK", "", false, "qtdParcelas");
        mensagem.Show();
        return;
    }

    var status = DOM.newElement('label');
    status.setAttribute('style', 'font-weight:100; font-size:12px;');
    status.innerHTML = "Pago em " + Selector.$('dataPagamento').value + " por " + Select.GetText(Selector.$('formaPagamento')) +
            (Selector.$('numrecibo').value.trim() == "" ? "" : " - Nº Recibo " + Selector.$('numrecibo').value.trim()) + " para ";

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=getQtdDiasPag';
    p += '&codigo=' + Selector.$('formaPagamento').value;
    ajax.Request(p);

    var dias = ajax.getResponseText();
    var valorParcela = Number.FormatDinheiro(Number.parseFloat(Selector.$('saldoPagar3').value) / parseInt(Selector.$('qtdParcelas').value));

    var dataPagto = new Date(Date.ConvertToDate(Selector.$('dataPagamento').value));
    dataPagto.setDate(dataPagto.getDate() + parseInt(dias));
    var dataPagto = zr(dataPagto.getDate().toString()) + "/" + zr((dataPagto.getMonth() + 1).toString()) + "/" + zr(dataPagto.getFullYear().toString());

    var mes = 0;
    var valorTotalSobra = (Number.parseFloat(valorParcela) * parseInt(Selector.$('qtdParcelas').value));
    var sobra = (Number.parseFloat(Selector.$('saldoPagar3').value) - valorTotalSobra).toFixed(2);
    var valorParcela2 = Number.FormatDinheiro(Number.parseFloat(valorParcela) + parseFloat(sobra));

    for (var i = 0; i < parseInt(Selector.$('qtdParcelas').value); i++) {

        var vencimento = new Date(Date.ConvertToDate(dataPagto));
        vencimento.setMonth(vencimento.getMonth() + mes);
        var novaData = zr(vencimento.getDate().toString()) + "/" + zr((vencimento.getMonth() + 1).toString()) + "/" + zr(vencimento.getFullYear().toString());

        novaData = proximoDiaUtil(novaData);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('onclick', 'ExcluirParcelaAux(' + gridPagamento.getRowCount() + ')');

        gridPagamento.addRow([
            DOM.newText((parseInt(gridPagamento.getRowCount()) + 1)),
            DOM.newText((i == 0 ? valorParcela2 : valorParcela)),
            DOM.newText(status.innerHTML + novaData),
            excluir,
            DOM.newText(Selector.$('formaPagamento').value),
            DOM.newText(novaData),
            DOM.newText(Selector.$('numrecibo').value),
            DOM.newText(''),
            DOM.newText(0)
        ]);

        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:35px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:right; width:80px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; ');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:30px;');

        mes++;
    }
    gridPagamento.hiddenCol(4);
    gridPagamento.hiddenCol(5);
    gridPagamento.hiddenCol(6);
    gridPagamento.hiddenCol(7);
    gridPagamento.hiddenCol(8);

    pintaLinhaGrid(gridPagamento);

    var saldoAPagar = (Number.parseFloat(Selector.$('valorSaldo').value) - Number.parseFloat(Selector.$('saldoPagar3').value));
    Selector.$('valorSaldo').value = Number.FormatDinheiro(saldoAPagar);

    dialogoGerarParcelas.Close();
    alteracao = true;
}

function zr(campo) {
    if (campo.length == 1)
        return "0" + campo;
    else
        return campo;
}

function ExcluirParcelaAux(linha) {

    mensagemExcluirParcela = new DialogoMensagens("prompt", 120, 380, 150, "4", "Atenção!", "Deseja realmente excluir este pagamento?", "OK", "ExcluirParcela(" + linha + ");", true, "");
    mensagemExcluirParcela.Show();
}

function ExcluirParcela(linha) {

    mensagemExcluirParcela.Close();
    gridPagamento.deleteRow(linha);

    for (var i = 0; i < gridPagamento.getRowCount(); i++) {
        gridPagamento.setCellText(i, 0, (i + 1));
        gridPagamento.getCellObject(i, 3).setAttribute('onclick', 'ExcluirParcelaAux(' + i + ')');
    }

    Totaliza();
}

function mostraRetorno() {

    if (Selector.$('checkretorno').checked) {
        Selector.$('divretorno').style.width = "270px";
    } else {
        Selector.$('divretorno').style.width = "0px";
    }
}

//FOLLOW
function GravarFollowUp(codigo) {

    if (codigoAtual <= 0)
        return;

    if (!CheckPermissao(60, true, 'Você não possui permissão para editar um follow up', false)) {
        return;
    }

    if (Selector.$('tiposcontatos').selectedIndex <= 0) {
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

    if (ajax.getResponseText() == '0') {
        MostrarMsg("Erro ao gravar o follow-up. Se o erro persistir contate o suporte técnico.", '');
        return;
    } else {
        Selector.$('retorno').style.visibility = "hidden";
        Selector.$('horaretorno').style.visibility = "hidden";
        dialogoFollowUp.Close();
        MostraFollowUp();
    }
}

function ExcluirFollowUp(codigo) {

    if (!CheckPermissao(61, true, 'Você não possui permissão para excluir um follow up', false)) {
        return;
    }

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este Follow-up?", "SIM", "ExcluirFollowUpAux(" + codigo + ")", true, "");
    mensagemExcluir.Show();
}

function ExcluirFollowUpAux(codigo) {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    ajax.Request('action=ExcluirFollowUP&codigo=' + codigo);
    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    mensagemExcluir.Close();
    MostraFollowUp();
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

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
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

    if (codigo <= 0) {
        if (!CheckPermissao(60, true, 'Você não possui permissão para criar um novo follow up', false)) {
            return;
        }
    }

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
    dialogoFollowUp = new caixaDialogo('prompt', 410, 550, '../padrao/', 140);
    dialogoFollowUp.Show();
    Mask.setData(Selector.$('retorno'));
    Mask.setHora(Selector.$('horaretorno', false));
    if (codigo <= 0) {
        Selector.$('tiposcontatos').focus();
    } else {

        var ajax = new Ajax('POST', 'php/pedidos.php', false);
        ajax.Request('action=getFollowUp&codigo=' + codigo);
        if (ajax.getResponseText() == '0') {
            Selector.$('tiposcontatos').focus();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        Select.Show(Selector.$('tiposcontatos'), json.tipo);
        Selector.$('obsfollow').value = json.obs;
        if (json.retorno != '0000-00-00' && json.retorno != "") {
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
    if (ajax.getResponseText() == '0') {
        return;
    }

    Select.AddItem(cmb, "Selecione...", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
}
//FIM FOLLOW

function AnexarImagem() {

    var pasta = "";
    if (Selector.$('o_optPhoto').checked) {
        pasta = 'obras';
    } else if (Selector.$('o_optInsta').checked) {
        pasta = 'instaarts';
    } else {
        pasta = 'produtos';
    }

    var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
    var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
    // var path = (tipoProdutoImagem == 'instaarts' ? '../imagens/instaarts/' : '../imagens/produtos/');
    var path = '../imagens/' + pasta + '/';
    var funcao = 'ArmazenarPath';
    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp, zip, rar, pdf');
}

function ArmazenarPath(path) {

    var pasta = "";
    if (Selector.$('o_optPhoto').checked) {
        pasta = 'obras';
    } else if (Selector.$('o_optInsta').checked) {
        pasta = 'instaarts';
    } else {
        pasta = 'produtos';
    }

    ExcluirImagem();
    var vetor = path.split("/");
    var extensao = vetor[vetor.length - 1].split(".")[1];
    var arquivo = vetor[vetor.length - 1];
    dialog.Close();

    Selector.$('o_imagem').setAttribute('name', arquivo);
    Selector.$('o_imagem').setAttribute('title', 'imagens/' + pasta + '/' + arquivo + '');

    if (extensao == 'zip' || extensao == 'rar') {
        Selector.$('o_imagem').setAttribute('src', 'imagens/zip.png');
        Selector.$('o_imagem').style.cursor = 'pointer';
        Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + arquivo + '' + "');");
    } else if (extensao == 'pdf') {
        Selector.$('o_imagem').setAttribute('src', 'imagens/pdf.png');
        Selector.$('o_imagem').style.cursor = 'pointer';
        Selector.$('o_imagem').setAttribute('onclick', "window.open('" + "imagens/" + pasta + "/" + arquivo + "" + "')");
    } else {
        Selector.$('o_imagem').setAttribute('src', 'imagens/' + pasta + '/' + arquivo + '');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + pasta + "/" + arquivo + "" + "');");
        GerarMiniaturaImagem();
    }
}

function ExcluirImagem() {

    var pasta = "";
    if (Selector.$('o_optPhoto').checked) {
        pasta = 'obras';
    } else if (Selector.$('o_optInsta').checked) {
        pasta = 'instaarts';
    } else {
        pasta = 'produtos';
    }

    if (Selector.$('o_imagem').getAttribute('name').trim() == '')
        return;
    var file = Selector.$('o_imagem').getAttribute('name').split(".");
    file = file[file.length - 1];
    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=ExcluirImagem';
    p += '&imagem=' + file;
    p += '&pasta=' + pasta;
    ajax.Request(p);
}

function GerarMiniaturaImagem() {

    var pasta = "";
    if (Selector.$('o_optPhoto').checked) {
        pasta = 'obras';
    } else if (Selector.$('o_optInsta').checked) {
        pasta = 'instaarts';
    } else {
        pasta = 'produtos';
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=GerarMiniaturaImagem';
    p += '&imagem=' + Selector.$('o_imagem').getAttribute('name');
    p += '&pasta=' + pasta;
    ajax.Request(p);
    var vetor = Selector.$('o_imagem').getAttribute('name').split(".");
    var extensao = vetor[vetor.length - 1];
    if (extensao != 'jpg' && extensao != 'jpeg') {

        Selector.$('o_imagem').setAttribute('name', vetor[0] + '.jpg');
        Selector.$('o_imagem').setAttribute('src', 'imagens/' + pasta + '/mini_' + vetor[0] + '.jpg');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + pasta + "/" + vetor[0] + ".jpg" + "');");
    }
}

function CancelarPedidoAux(idPedido) {

    if (!CheckPermissao(55, true, 'Você não possui permissão para cancelar um pedido', false)) {
        return;
    }

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

    mensagemCancelarPedido = new DialogoMensagens("prompt", 120, 400, 150, "4", "Alerta!", "Deseja realmente cancelar o pedido n° " + Selector.$('codPedido').innerHTML + "?", "SIM", "CancelarPedido(" + idPedido + ")", true, "");
    mensagemCancelarPedido.Show();
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

    mensagemCancelarPedido.Close();

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=CancelarPedido';
    p += '&idPedido=' + idPedido;
    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK())
            return;
        if (ajax.getResponseText() == 1) {
            Mostra(idPedido, false);
            MostrarMsg('Pedido cancelado com sucesso', '');
            MostrarPedidos();
        }
        else {
            MostrarMsg('Problemas ao cancelar o pedido. Tente novamente, caso o erro persista contate o suporte técnico', '');
        }

        Selector.$('imgCancelar').src = 'imagens/cancelar.png';
    };
    Selector.$('imgCancelar').src = 'imagens/loading.gif';
    ajax.Request(p);
}

function PromptPagamentosPedido(idPedido) {

    if (!isElement('div', 'divPagamentosPedido')) {
        var div = DOM.newElement('div', 'divPagamentosPedido');
        document.body.appendChild(div);
    }

    var divPagamentosPedido = Selector.$('divPagamentosPedido');
    divPagamentosPedido.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPagamentosPedido.appendChild(divform);

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = "Pagamentos do Pedido N°: " + Number.Complete(idPedido, 5, "0", true);
    lblTitulo.setAttribute("style", "text-align:center; font-family:arial;");

    var divPagamentosPedido2 = DOM.newElement('div', 'divPagamentosPedido2');
    divPagamentosPedido2.setAttribute('style', 'height:380px; overflow:auto');

    gridPagamentosPedido = new Table('gridPagamentosPedido');
    gridPagamentosPedido.table.setAttribute('cellpadding', '3');
    gridPagamentosPedido.table.setAttribute('cellspacing', '0');
    gridPagamentosPedido.table.setAttribute('class', 'tabela_cinza_foco');
    gridPagamentosPedido.addHeader([
        DOM.newText('N°'),
        DOM.newText('Valor'),
        DOM.newText('Data Pago'),
        DOM.newText('Status')
    ]);
    //====== Tabela ======//
    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divPagamentosPedido2);
    dialogoPagamentosPedido = new caixaDialogo('divPagamentosPedido', 500, 700, '../padrao/', 140);
    dialogoPagamentosPedido.Show();
    Selector.$('divPagamentosPedido2').appendChild(gridPagamentosPedido.table);
    MostrarPagamentosPedido(idPedido);
}

function MostrarPagamentosPedido(idPedido) {

    gridPagamentosPedido.clearRows();
    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=MostrarPagamentosPedido';
    p += '&idPedido=' + idPedido;
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        for (var i = 0; i < json.length; i++) {

            var status = '';
            if (json[i].idValePresenteTroca > 0) {
                status = 'Vale Presente/Troca. Cod: ' + json[i].codigoVale;
            } else {
                status = "Pago em " + json[i].cadastro + ' por ' + json[i].forma + (json[i].recibo == "" ? "" : " - Nº Rec " + json[i].recibo) + " para " + json[i].data;
            }

            gridPagamentosPedido.addRow([
                DOM.newText(json[i].parcela),
                DOM.newText(json[i].valor),
                DOM.newText(json[i].data),
                DOM.newText(status)
            ]);

            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:60px');
            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:right; width:100px;');
            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:left;  ');

            pintaLinhaGrid(gridPagamentosPedido);
        }
    };

    ajax.Request(p);
}

function GerarPdfPedido() {

    if (!CheckPermissao(57, true, 'Você não possui permissão para gerar o pdf do pedido', false)) {
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=GerarPdfPedido';
    p += '&idPedido=' + codigoAtual;
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgPdfPedido').setAttribute('src', 'imagens/relatorio.png');
        if (ajax.getResponseText() != '') {
            window.open(ajax.getResponseText());
        }
    }

    Selector.$('imgPdfPedido').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function EnviarPdfPedidoEmailAux ( ){

    /*
    var div = criaDiv('divMensagem');

    div.innerHTML += '<div class="divcontainer" style="max-width:90%"> ' +
    '<label>Mensagem</label> ' +
    '<textarea  class="textbox_cinzafoco" id="mensagem"style="width:600px; height:100px;"></textarea></div>';



    div.innerHTML += '<br><br><div class="divcontainer" style="max-width:100%;">' + 
    '<div align="right" style="width: 100%; vertical-align: middle; display: inline-block;">' + 
    '<div id="btNovo" style=" border:none;" class="botaotituloultimoEDICAO"  onclick="Sair();"> <img src="imagens/cancelar.png" id="botSair"   style="float:none; display:block; margin-left:auto; margin-right:auto;" title="Gravar"></div>' + 
    '<div id="btSair" style="margin-right:1px; border:none;" class="botaotituloultimoEDICAO" onclick="EnviarPdfOrcamentoEmail();"><img src="imagens/validar.png"  id="botNovo" style="float:none; display:block; margin-left:auto; margin-right:auto;" title="Cancelar"></div></div>';

                                                                                           
    dialogoMensagem = new caixaDialogoResponsiva('divMensagem', 260, 680, '../padrao/', 130);
    dialogoMensagem.Show();
    */

     if (!isElement('div', 'divMensagemEmail')) {
        var divMensagemEmail = DOM.newElement('div', 'divMensagemEmail');
        document.body.appendChild(divMensagemEmail);
    }

    var divMensagemEmail = Selector.$('divMensagemEmail');
    divMensagemEmail.innerHTML = '';
    var lblNome = DOM.newElement('label');
    lblNome.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNome.innerHTML = 'Mensagem';
    //divMensagemEmail.appendChild(lblNome);

  

    var txtarea = DOM.newElement('textarea');
    txtarea.setAttribute('class', 'textbox_cinzafoco');
    txtarea.setAttribute('style', 'width:600px; height:100px;');
    txtarea.setAttribute('id', 'mensagemopc');
    divMensagemEmail.appendChild(txtarea);


    divMensagemEmail.innerHTML += "<br/>";
    divMensagemEmail.innerHTML += "<br/>";

    var cmdPesquisar = DOM.newElement('button', 'cliente_pesquisar');
    cmdPesquisar.setAttribute('style', 'float:right;');
    cmdPesquisar.setAttribute('class', 'botaosimplesfoco');
    cmdPesquisar.setAttribute('onclick', 'EnviarPdfPedidoEmail()');
    cmdPesquisar.innerHTML = 'Enviar';
    divMensagemEmail.appendChild(cmdPesquisar);
    dialogoMsg = new caixaDialogo('divMensagemEmail', 300, 650, 'padrao/', 130);
    dialogoMsg.Show();

    tinyMCE.init({
        selector: 'textarea#mensagemopc',
        theme : "modern",
        entity_encoding : "raw",
        language : "pt_BR",
    });
}


function EnviarPdfPedidoEmail() {

    if (!CheckPermissao(58, true, 'Você não possui permissão para enviar o pdf do pedido por email', false)) {
        return;
    }

    if (Selector.$('email').value.trim() == '' || Selector.$('email').value.trim() == 'não possui') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este cliente não possui e-mail cadastrado, cadastre um e-mail para enviar o pedido.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    var descricao = tinyMCE.get('mensagemopc').getContent();

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=EnviarPdfPedidoEmail';
    p += '&idPedido=' + codigoAtual;
    p += '&cliente=' + Select.GetText(Selector.$('cliente'));
    p += '&email=' + Selector.$('email').value;
    p += '&vendedor=' + Selector.$('vendedor').value;
    p += '&nomeVendedor=' + Select.GetText(Selector.$('vendedor'));
    p += '&mensagemopc=' + descricao;
        
    dialogoMsg.Close();
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgPedidoEmail').setAttribute('src', 'imagens/email2.png');
        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o pedido por email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('imgPedidoEmail').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function gerarOrdemProducao() {

    if (!CheckPermissao(62, true, 'Você não possui permissão para gerar ordem de produção', false)) {
        return;
    }

    var xRowCount = gridObras.getRowCount();
        
    if (codigoAtual <= 0 || xRowCount <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "Por favor gravar primeiro o pedido antes de gerar a Ordem de compra!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (codigoAtualProducao > 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Já existe uma ordem de Produção Nº " + codigoAtualProducao + " vinculada a este pedido", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (gridObrasProducao.getSelCount(1) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione uma obra para gerar OP.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!confirm('Deseja gerar OP para os itens selecionados?'))
        return;

    if (Selector.$('loja').value <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "Por favor selecionar uma loja!", "OK", "", false, "loja");
        mensagem.Show();
        return;
    }

    var codigos = "";
    for (var i = 0; i <= gridObrasProducao.getRowCount() - 1; i++) {
        if (gridObrasProducao.getCellObject(i, 1).disabled == false || gridObrasProducao.getCellObject(i, 1).checked) {
            if (codigos == "")
                codigos = gridObrasProducao.getRowData(i);
            else
                codigos = codigos + ", " + gridObrasProducao.getRowData(i);
        }
    }

    if (codigos == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "Por favor selecione pelo menos um item na lista", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=gerarOrdemProducao';
    p += '&idVenda=' + codigoAtual;
    p += '&loja=' + Selector.$('loja').value;
    p += '&previsao=' + Selector.$('previsaoEntrega').value;
    p += '&obs=' + Selector.$('obs').value;
    p += '&codigos=' + codigos;
    p += '&refeita=0';
    ajax.Request(p);
    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gerar a ordem de produção. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        codigoAtualProducao = ajax.getResponseText();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Ordem de produção gerada com sucesso!", "OK", "", false, "");
        mensagem.Show();
        Mostra(codigoAtual, false);
        return;
    }
}

function proximoDiaUtil(data) {

    var novaData = new Date(Date.ConvertToDate(data));

    var dias;
    if (novaData.getUTCDay() == 0)
        dias = 1;
    else if (novaData.getUTCDay() == 6)
        dias = 2;
    else
        dias = 0;

    var dia = novaData.getDate();
    var mes = novaData.getMonth();
    var ano = novaData.getFullYear();

    if (novaData.getDate() != data.substr(0, 2)) {
        dia = data.substr(0, 2);
    }

    novaData.setDate(parseInt(dia) + dias);

    dia = novaData.getDate();
    mes = novaData.getMonth();
    ano = novaData.getFullYear();

    return zr(dia.toString()) + "/" + zr((mes + 1).toString()) + "/" + zr(ano.toString());
}

function DuplicarObra(linha) {

    var divEditarDuplicar = DOM.newElement('div');

    var editar = DOM.newElement('img');
    editar.setAttribute('src', 'imagens/modificar.png');
    editar.setAttribute('title', 'Editar');
    editar.setAttribute('style', 'width:15px; display:inline-block');
    editar.setAttribute('class', 'efeito-opacidade-75-04');
    editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

    var duplicar = DOM.newElement('img');
    duplicar.setAttribute('src', 'imagens/duplicate.png');
    duplicar.setAttribute('title', 'Duplicar Obra');
    duplicar.setAttribute('style', 'height:14px; display:inline-block; margin-left:10px;');
    duplicar.setAttribute('class', 'efeito-opacidade-75-04');
    duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

    divEditarDuplicar.appendChild(editar);
    divEditarDuplicar.appendChild(duplicar);

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir');
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('style', 'width:15px;');
    excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        var pasta = 'obras';
        var imgelemento = DOM.newElement('img');
        imgelemento.setAttribute('id', 'o_imagem2');
        imgelemento.setAttribute('class', 'textbox_cinzafoco');
        imgelemento.setAttribute('src', 'imagens/' + pasta + '/mini_' + gridObras.getCellObject(linha,1).getAttribute('name'));
        imgelemento.setAttribute('name', gridObras.getCellObject(linha,1).getAttribute('name'));
        imgelemento.setAttribute('style','cursor:pointer; title="Ver Imagem"; width:60px; height:60px;');
        imgelemento.setAttribute("onclick", "MostraImagemTamanhoReal( 'imagens/" + pasta + '/' + gridObras.getCellObject(linha,1).getAttribute('name') + "');");
      
    gridObras.addRow([
        DOM.newText(gridObras.getRowCount()),
        imgelemento,
        DOM.newText(gridObras.getCellText(linha, 2)),
        DOM.newText(gridObras.getCellText(linha, 3)),
        DOM.newText(gridObras.getCellText(linha, 4)),
        DOM.newText(gridObras.getCellText(linha, 5)),
        DOM.newText(gridObras.getCellText(linha, 6)),
        DOM.newText(gridObras.getCellText(linha, 7)),
        DOM.newText(gridObras.getCellText(linha, 8)),
        DOM.newText(gridObras.getCellText(linha, 9)),
        divEditarDuplicar,
        excluir,
        DOM.newText(gridObras.getCellText(linha, 12)),
        DOM.newText(gridObras.getCellText(linha, 13)),
        DOM.newText(gridObras.getCellText(linha, 14)),
        DOM.newText(gridObras.getCellText(linha, 15)),
        DOM.newText(gridObras.getCellText(linha, 16)),
        DOM.newText(gridObras.getCellText(linha, 17)),
        DOM.newText(gridObras.getCellText(linha, 18)),
        DOM.newText(gridObras.getCellText(linha, 19)),
        DOM.newText(gridObras.getCellText(linha, 20)),
        DOM.newText(gridObras.getCellText(linha, 21)),
        DOM.newText(gridObras.getCellText(linha, 22)),
        DOM.newText(gridObras.getCellText(linha, 23)),
        DOM.newText(gridObras.getCellText(linha, 24)),
        DOM.newText(gridObras.getCellText(linha, 25)),
        DOM.newText(gridObras.getCellText(linha, 26)),
        DOM.newText(gridObras.getCellText(linha, 27)),
        DOM.newText(gridObras.getCellText(linha, 28)),
        DOM.newText(gridObras.getCellText(linha, 29)),
        DOM.newText(gridObras.getCellText(linha, 20)),

    ]);

    
    
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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);

    gridObras.setRowData(gridObras.getRowCount() - 1, 0);
    gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:20px');
    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;width:40px');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
    gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:right;');
    gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:center;');
    gridObras.getCell(gridObras.getRowCount() - 1, 10).setAttribute('style', 'text-align:center;');
    gridObras.getCell(gridObras.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:20px');

    var cor = false;
    for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }
    
         

    Totaliza(true, true, true, true, true);
}

function BaixarEstoque(idVendaComp) {

    if (!CheckPermissao(59, true, 'Você não possui permissão para baixar estoque do pedido', false)) {
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=BaixarEstoque';
    p += '&idVenda=' + codigoAtual;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&idsVendasComp=' + gridObras.getRowsData();
    p += '&idVendaComp=' + idVendaComp;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Alerta", "A baixa destes itens já foi realizada.", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        if (ajax.getResponseText() == '1' || json.erro == '1') {
            //Nenhum produto ou obra para realizar a baixa
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Alerta", "Nenhum produto ou obra para dar baixa", "OK", "", false, "");
            mensagem.Show();
        } else if (json.erro == '2') {
            //Qtd não disponivel no estoque 
            var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "2", "Alerta", json.mensagem, "OK", "", false, "");
            mensagem.Show();

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

            Selector.$('prompt').style.height = 'auto';
            Selector.$('prompt').style.maxHeight = '640px';
            Selector.$('prompt').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (Selector.$('prompt').clientHeight / 2)) - 0) + 'px';
        } else if (ajax.getResponseText() == '3') {
            //Erro ao baixar o estoque
            var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "2", "Alerta", 'Ocorreu um erro ao realizar a baixa no estoque, tente novamente. Se o problema persistir entre em contato com o suporte técnico.', "OK", "", false, "");
            mensagem.Show();
        } else {
            //Baixa do estoque realizado com sucesso
            var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "3", "Sucesso", json.mensagem, "OK", "", false, "");
            mensagem.Show();

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

            Selector.$('prompt').style.height = 'auto';
            Selector.$('prompt').style.maxHeight = '640px';
            Selector.$('prompt').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (Selector.$('prompt').clientHeight / 2)) - 0) + 'px';
            Mostra(codigoAtual, false);
        }
    };

    ajax.Request(p);
}

function MostrarEstoqueObra() {

    if (Selector.$('loja').selectedIndex <= 0 || Selector.$('o_artista').selectedIndex <= 0 || Selector.$('o_obra').selectedIndex <= 0 || Selector.$('o_tamanho').selectedIndex <= 0 || Selector.$('o_acabamento').selectedIndex <= 0) {
        return;
    }

    Selector.$('lblInfoEstoque').innerHTML = '';

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=MostrarEstoqueObra';
    p += '&idObra=' + Selector.$('o_obra').getAttribute('name');
    p += '&idTamanho=' + Selector.$('o_tamanho').getAttribute('name');
    p += '&idAcabamento=' + Selector.$('o_acabamento').getAttribute('name');
    p += '&idLoja=' + Selector.$('loja').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        Selector.$('lblInfoEstoque').innerHTML = 'Nenhuma obra em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '. Obra à produzir.';
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
        
    if ( json == 0 || ( parseInt(json[json.length - 1].qtdObrasLojaSelecionada) <= 0 && parseInt(json[json.length - 1].qtdOutrasLojasComEstoque) <= 0 ) ) {
        Selector.$('lblInfoEstoque').innerHTML = 'Nenhuma obra em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '. Obra à produzir.';
        return;
    } else {
        Selector.$('lblInfoEstoque').innerHTML = (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) == 1 ? '1 obra em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '.' : parseInt(json[json.length - 1].qtdObrasLojaSelecionada) + ' obras em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '.');

        if (json[json.length - 1].idsVendas.split(',').length == '1' && json[json.length - 1].idsVendas != '0') {
            if (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) == 1) {
                Selector.$('lblInfoEstoque').innerHTML += '<br> Obra vinculada ao pedido n° ' + json[json.length - 1].idsVendas;
            }
        } else {
            if (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) > 1) {
                Selector.$('lblInfoEstoque').innerHTML += '<br> Obras vinculadas a outros pedidos';
            }
        }

        return;
    }

    if (parseInt(json[json.length - 1].qtdOutrasLojasComEstoque) > 0) {
        Selector.$('lblInfoEstoque').innerHTML += (parseInt(json[json.length - 1].qtdTotal) == 1 ? ' 1 obra em estoque em outra loja' : " <span title='Clique para ver a lista de lojas' style='text-decoration:underline; cursor:pointer;' onclick='PromptEstoqueLojas(" + ajax.getResponseText() + ", -1);'>" + parseInt(json[json.length - 1].qtdTotal) + " obras em estoque em outras " + parseInt(json[json.length - 1].qtdOutrasLojasComEstoque) + " loja(s).<span>");
    } else {
        Selector.$('lblInfoEstoque').innerHTML += 'Nenhuma obra em estoque em outras lojas. Obra à produzir.';
    }
}

function PromptEstoqueLojas(resultado, linha) {

    if (!isElement('div', 'divEstoqueLojas')) {
        var div = DOM.newElement('div', 'divEstoqueLojas');
        document.body.appendChild(div);
    }

    var divEstoqueLojas = Selector.$('divEstoqueLojas');
    divEstoqueLojas.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divEstoqueLojas.appendChild(divform);

    var lblTitulo = DOM.newElement('h3');

    if (linha >= 0) {
        lblTitulo.innerHTML = "Estoque: " + gridObrasProducao.getCellText(linha, 4) + ' - ' + gridObrasProducao.getCellText(linha, 5) + ' - ' + gridObrasProducao.getCellText(linha, 6);
    } else {
        lblTitulo.innerHTML = "Estoque: " + Select.GetText(Selector.$('o_obra')) + ' - ' + Select.GetText(Selector.$('o_tamanho')) + ' - ' + Select.GetText(Selector.$('o_acabamento'));
    }
    lblTitulo.setAttribute("style", "text-align:center; font-family:arial;");

    var divListaLojas = DOM.newElement('div', 'divListaLojas');
    divListaLojas.setAttribute('style', 'height:380px; overflow:auto');

    gridListaLojas = new Table('gridListaLojas');
    gridListaLojas.table.setAttribute('cellpadding', '3');
    gridListaLojas.table.setAttribute('cellspacing', '0');
    gridListaLojas.table.setAttribute('class', 'tabela_cinza_foco');

    gridListaLojas.addHeader([
        DOM.newText('Loja'),
        DOM.newText('Qtde.')
    ]);

    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divListaLojas);
    dialogoPagamentosPedido = new caixaDialogo('divEstoqueLojas', 500, 700, '../padrao/', 140);
    dialogoPagamentosPedido.Show();

    Selector.$('divListaLojas').appendChild(gridListaLojas.table);

    var json = JSON.parse(JSON.stringify(resultado) );

    for (var i = 0; i < json.length; i++) {

        if (json[i].idLoja != Selector.$('loja').value) {

            gridListaLojas.addRow([
                DOM.newText(json[i].loja),
                DOM.newText(json[i].qtdEstoque)
            ]);

            gridListaLojas.getCell(gridListaLojas.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            gridListaLojas.getCell(gridListaLojas.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
        }
    }

    pintaLinhaGrid(gridListaLojas);
}

function PromptAdicionarVale() {

    if (Number.parseFloat(Selector.$('valorSaldo').value) <= 0) {
        MostrarMsg("Não existe valor a ser pago.", "");
        return;
    }

    if (!isElement('div', 'divPromptAdicionarVale')) {
        var div = DOM.newElement('div', 'divPromptAdicionarVale');
        document.body.appendChild(div);
    }

    var divPromptAdicionarVale = Selector.$('divPromptAdicionarVale');
    divPromptAdicionarVale.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptAdicionarVale.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var divCodigo = DOM.newElement('div');
    divCodigo.setAttribute('class', 'divcontainer');
    divCodigo.setAttribute('style', 'max-width:225px;');

    var txtCodigo = DOM.newElement('text', 'codigoVale');
    txtCodigo.setAttribute('class', 'textbox_cinzafoco');
    txtCodigo.setAttribute('style', 'width:100%;');
    txtCodigo.setAttribute('placeholder', 'Digite o código do vale presente/troca');

    divCodigo.appendChild(txtCodigo);

    var divStatusCodigo = DOM.newElement('div');
    divStatusCodigo.setAttribute('class', 'divcontainer');
    divStatusCodigo.setAttribute('style', 'max-width:100%; text-align:center;');

    var lblStatusCodigo = DOM.newElement('label', 'statusCodigo');
    lblStatusCodigo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblStatusCodigo.innerHTML = '';

    divStatusCodigo.appendChild(lblStatusCodigo);

    var cmdTexto1 = DOM.newElement('button', 'btPesquisarVale');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'PesquisarVale();');
    cmdTexto1.innerHTML = "Pesquisar";

    var cmdTexto2 = DOM.newElement('button', 'btAdicionarVale');
    cmdTexto2.setAttribute('class', 'botaosimplesfoco');
    cmdTexto2.setAttribute('style', 'float:right; margin-right:10px; display:none;');
    cmdTexto2.setAttribute('onclick', 'AdicionarVale();');
    cmdTexto2.innerHTML = "Adicionar";

    //====== Tabela ======//
    divform.appendChild(divCodigo);
    divform.appendChild(cmdTexto1);
    divform.innerHTML += '<br>';
    divform.appendChild(divStatusCodigo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto2);

    dialogoAdicionarVale = new caixaDialogo('divPromptAdicionarVale', 180, 410, '../padrao/', 140);
    dialogoAdicionarVale.Show();

    Selector.$('codigoVale').focus();
}

function PesquisarVale() {

    if (Selector.$('codigoVale').value.trim() == '') {
        MostrarMsg("Digite um código", "codigoVale");
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=PesquisarVale';
    p += '&codigo=' + Selector.$('codigoVale').value.trim();

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            Selector.$('statusCodigo').innerHTML = 'Código não encontrado';
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        Selector.$('codigoVale').name = json.idValePresenteTroca;

        for (var i = 0; i < gridPagamento.getRowCount(); i++) {

            if (Selector.$('codigoVale').value.trim() == gridPagamento.getCellText(i, 2).split('Cod:')[1].trim()) {
                Selector.$('statusCodigo').innerHTML = 'Este vale presente/troca já foi adicionado neste pedido.';
                Selector.$('btAdicionarVale').style.display = 'none';
                return;
            }
        }

        if (json.vencido == '1') {
            Selector.$('statusCodigo').innerHTML = 'Vale presente/troca vencido';
            Selector.$('btAdicionarVale').style.display = 'none';
            return;
        } else if (json.idGaleria != Selector.$('loja').value && json.idGaleria != '0') {
            Selector.$('statusCodigo').innerHTML = 'Este vale presente/troca não pode ser usado nesta galeria. Vale cadastrado na galeria ' + json.loja;
            Selector.$('btAdicionarVale').style.display = 'none';
            return;
        } else if (parseInt(json.idVenda) > 0) {
            Selector.$('statusCodigo').innerHTML = 'Este vale presente/troca já foi usado no pedido ' + json.idVenda;
            Selector.$('btAdicionarVale').style.display = 'none';
            return;
        } else {
            Selector.$('statusCodigo').innerHTML = 'Validade: até ' + json.dataValidade + '<br>Valor: <span id="valorVale">' + json.valor + '</span>';
            Selector.$('statusCodigo').innerHTML += '<span style="display:none;"><span id="formaPagamentoVale">' + json.idFormaPagamento + '</span><span id="reciboVale">' + json.recibo + '</span><span id="dataVale">' + json.dataCadastro + '</span></span>';
            Selector.$('btAdicionarVale').style.display = 'inline-block';
        }
    };

    ajax.Request(p);
}

function AdicionarVale() {

    if (Selector.$('codigoVale').value.trim() == '') {
        MostrarMsg("Digite um código", "codigoVale");
        return;
    }

    for (var i = 0; i < gridPagamento.getRowCount(); i++) {

        if (Selector.$('codigoVale').value.trim() == gridPagamento.getCellText(i, 2).split('Cod:')[1].trim()) {
            MostrarMsg("Este vale presente/troca já foi adicionado.", "codigoVale");
            return;
        }
    }

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir');
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('onclick', 'ExcluirParcelaAux(' + gridPagamento.getRowCount() + ')');

    gridPagamento.addRow([
        DOM.newText((gridPagamento.getRowCount() + 1)),
        DOM.newText(Selector.$('valorVale').innerHTML),
        DOM.newText('Vale Presente/Troca. Cod: ' + Selector.$('codigoVale').value),
        excluir,
        DOM.newText(Selector.$('formaPagamentoVale').innerHTML),
        DOM.newText(Selector.$('dataVale').innerHTML),
        DOM.newText(Selector.$('reciboVale').innerHTML),
        DOM.newText(Selector.$('codigoVale').value),
        DOM.newText(Selector.$('codigoVale').getAttribute('name'))
    ]);

    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:35px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:right; width:80px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; ');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:30px;');

    gridPagamento.hiddenCol(4);
    gridPagamento.hiddenCol(5);
    gridPagamento.hiddenCol(6);
    gridPagamento.hiddenCol(7);
    gridPagamento.hiddenCol(8);

    pintaLinhaGrid(gridPagamento);

    var saldoAPagar = (Number.parseFloat(Selector.$('valorSaldo').value) - Number.parseFloat(Selector.$('valorVale').innerHTML));
    //Selector.$('valorSaldo').value = Number.FormatDinheiro(saldoAPagar);
    Selector.$('valorSaldo').value = (saldoAPagar < 0 ? '0,00' : Number.FormatDinheiro(saldoAPagar));

    dialogoAdicionarVale.Close();
    alteracao = true;
}

function PromptObrasRefazer() {

    if (!CheckPermissao(63, true, 'Você não possui permissão para refazer uma OP', false)) {
        return;
    }

    if (!isElement('div', 'divVisualizar')) {
        var div = DOM.newElement('div', 'divVisualizar');
        document.body.appendChild(div);
    }

    var div = Selector.$('divVisualizar');
    div.innerHTML = '';
    div.innerHTML = "<div id='tblitem' style='background:#FFF; height:530px; width:100%; overflow:auto'> </div>";

    dialogoVisualizar = new caixaDialogo('divVisualizar', 600, 1000, 'padrao/', 130);
    dialogoVisualizar.Show();

    gridObrasRefazer = new Table('gridObrasRefazer');
    gridObrasRefazer.table.setAttribute('cellpadding', '4');
    gridObrasRefazer.table.setAttribute('cellspacing', '0');
    gridObrasRefazer.table.setAttribute('class', 'tabela_cinza_foco');

    gridObrasRefazer.addHeader([
        DOM.newText(''),
        DOM.newText('Tipo'),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Obras'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtd')
    ]);
      
    var label = DOM.newElement('label', 'e_lblCancelar');
    label.innerHTML = 'Cancelar';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle; float:right; margin-top:5px;');
    label.setAttribute('onclick', 'Selector.$("divVisualizar").setAttribute("class", "divbranca"); dialogoVisualizar.Close();');
    label.innerHTML = 'Cancelar';
    div.appendChild(label);

    //BOTÃO SALVAR
    //var elemento = DOM.newElement('button', 'o_botIncluir');
    //elemento.setAttribute('class', 'botaosimplesfoco');
    //elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    //elemento.setAttribute('onclick', 'GerarOpRefeita();');
    //elemento.innerHTML = "Refazer OP";
    //div.appendChild(elemento);
    
     var divCancel = DOM.newElement('div');
    divCancel.setAttribute('style', 'float:right; margin-top:5px; vertical-align:middle; margin-right:10px;');
    
    var chkCancel = DOM.newElement('checkbox', 'e_chkCancel');   
    
    var lbl = DOM.newElement('label');
    lbl.setAttribute('class', 'fonte_Roboto_texto_normal');
    lbl.setAttribute('for', 'e_chkCancel');
    lbl.innerHTML = "Cancelar OP's anteriores";    
    
    divCancel.appendChild(chkCancel);
    divCancel.appendChild(lbl);
    
    div.appendChild(divCancel);

    Selector.$('tblitem').appendChild(gridObrasRefazer.table);

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=MostrarObrasRefazer&idVenda=' + codigoAtual;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    for (var i = 0; i < json.length; i++) {

        var chk = DOM.newElement('checkbox');

        var imagem = DOM.newElement('img');

        if (json[i].pasta != '' && json[i].imagem != '') {

            if (json[i].imagem.split('.')[1] == 'zip' || json[i].imagem.split('.')[1] == 'rar') {

                imagem.setAttribute('src', "imagens/zip.png");
                imagem.setAttribute('title', "Baixar Arquivo");
                imagem.setAttribute("onclick", "BaixarImagemReal('" + "imagens/" + json[i].pasta + "/" + json[i].imagem + "');");
            } else {

                imagem.setAttribute('src', "imagens/" + json[i].pasta + "/" + json[i].imagem);
                imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + json[i].pasta + "/" + json[i].imagem + "');");
            }
        } else {
            imagem.setAttribute('src', "imagens/semarte.png");
        }

        imagem.setAttribute('style', 'width:50px; cursor:pointer;');

        gridObrasRefazer.addRow([
            chk,
            DOM.newText(json[i].nomeTipo),
            imagem,
            DOM.newText(json[i].nomeArtista),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == 3 ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipo == '3' ? json[i].nomeProduto : json[i].nomeAcabamento)),
            DOM.newText(json[i].qtde)
        ]);

        gridObrasRefazer.setRowData(gridObrasRefazer.getRowCount() - 1, json[i].idVendaComp);
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;width:40px');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridObrasRefazer.getCell(gridObrasRefazer.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;');
    }

    pintaLinhaGrid(gridObrasRefazer);
    //div.innerHTML += '<input type="button" value="Gerar OP" class="botaosimplesfoco" style="float:right;" onclick="GerarOpRefeita();"></input>';
}

function GerarOpRefeita() {

    if (gridObrasRefazer.getSelCount(0) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione uma obra para gerar OP.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var codigos = "";
    for (var i = 0; i <= gridObrasRefazer.getRowCount() - 1; i++) {
        if (gridObrasRefazer.getCellObject(i, 0).disabled == false || gridObrasRefazer.getCellObject(i, 0).checked) {
            if (codigos == "")
                codigos = gridObrasRefazer.getRowData(i);
            else
                codigos = codigos + ", " + gridObrasRefazer.getRowData(i);
        }
    }

    if (codigos == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "Por favor, selecione pelo menos um item na lista", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=gerarOrdemProducao';
    p += '&idVenda=' + codigoAtual;
    p += '&loja=' + Selector.$('loja').value;
    p += '&previsao=' + Selector.$('previsaoEntrega').value;
    p += '&obs=' + Selector.$('obs').value;
    p += '&codigos=' + gridObrasRefazer.getRowDataSelectedRows(0);//codigos;
    p += '&refeita=1';
    p += '&cancelarAnteriores=' + Selector.$('e_chkCancel').checked;
    
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gerar a ordem de produção refeita. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        dialogoVisualizar.Close();
        codigoAtualProducao = ajax.getResponseText();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Ordem de produção refeita gerada com sucesso!", "OK", "", false, "");
        mensagem.Show();
        Mostra(codigoAtual, false);
        return;
    }
}

//CONSIGNAÇÃO
function DadosConsig() {
    if (Selector.$('consignacao').checked) {
        Selector.$('divConsig').style.visibility = 'visible';
    }
    else {
        Selector.$('divConsig').style.visibility = 'hidden';
    }
}

function AvisoRetirada(idPedido){

    mensagemAviso = new DialogoMensagens("prompt", 140, 350, 150, "2", "Aviso !", "E-mail destinado a clientes com o tipo de entrega 'RETIRADA', deseja realizar o envio? ", "OK", "AvisoRetiradaAux("+idPedido+")", true, "");
    mensagemAviso.Show();
}

function AvisoRetiradaAux(idPedido){

    mensagemAviso.Close();
    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=AvisoRetirada';
    p += '&idPedido=' + idPedido;
    p += '&vendedor=' + Selector.$('vendedor').value;
    p += '&nomeVendedor=' + Select.GetText(Selector.$('vendedor'));
    
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('btenviarAviso2' ).setAttribute('src', 'imagens/email3.png');
        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o pedido por email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('btenviarAviso2').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}