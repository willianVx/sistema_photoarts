ValidarSessao();
var codigoAtual = 0;
var codigoVersaoAtual = 0;
var mesOrcamentoAtual = 0;
var anoOrcamentoAtual = 0;
var codOrcamentoAtual = 0;
var valorTotalOrcamentoAtual = 0;
var gerarNovaVersao = false;
var perguntaNovaVersao = false;
var tipoProdutoImagem = '';

window.onload = function () {

    CarregarDadosUsuario();
    getStatusOrcamento(Selector.$('statusBusca'), "Filtre por status", true);
    
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    Mask.setData(Selector.$('dataCadastro'));

    gridOrcamentos = new Table('gridOrcamentos');
    gridOrcamentos.table.setAttribute('cellpadding', '4');
    gridOrcamentos.table.setAttribute('cellspacing', '0');
    gridOrcamentos.table.setAttribute('class', 'tabela_cinza_foco');

    gridOrcamentos.addHeader([
        DOM.newText('N°'),
        DOM.newText('Data Cadastro'),
        DOM.newText('Loja'),
        DOM.newText('Cliente'),
        DOM.newText('Obras'),
        DOM.newText('Valor Total'),
        DOM.newText('Marchand'),
        DOM.newText('Status'),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridOrcamentos.table);

    Mask.setData(Selector.$('dataCadastro'));

    Mask.setMoeda(Selector.$('frete'));
    Mask.setMoeda(Selector.$('acrescimo'));
    Mask.setMoeda(Selector.$('percDesconto'));
    Mask.setMoeda(Selector.$('valorDesconto'));

    Mask.setOnlyNumbers(Selector.$('qtdeParcelas'));

    //CRIA TABELA DE OBRAS
    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('cellpadding', '4');
    gridObras.table.setAttribute('cellspacing', '0');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);

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

    var c = Window.getParameter('idOrcamento');
    Select.AddItem(Selector.$('enderecos'), 'Selecione um cliente para carregar os endereços', 0);

    if (c == null || c == '') {

        getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", false);
        //getCentrosCusto(Selector.$('loja'), 'Selecione uma loja', true);
        //getLojas(Selector.$('loja'), 'Selecione uma loja', true);
        CarregarGalerias(Selector.$('loja'), 'Selecione uma loja', false);
        //getClientes(Selector.$('cliente'), "Selecione um colecionador", true);
        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", true);

        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
        Selector.$('loja').setAttribute('onchange', 'CarregaMarchands(true)');

        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", true);
        getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pgto", true);

        //corrige erros de layout 
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
        
        SetarGaleriaMarchand('loja', 'statusvendedores', 'vendedor');
    }
    else {
        getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", false);
        //getCentrosCusto(Selector.$('loja'), 'Selecione uma loja', false);
        CarregarGalerias(Selector.$('loja'), 'Selecione uma loja', false);
        //getClientes(Selector.$('cliente'), "Selecione um colecionador", false);
        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", false);

        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
        Selector.$('loja').setAttribute('onchange', 'CarregaMarchands(true)');

        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", false);
        getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pgto", false);

        //corrige erros de layout 
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
        
        SetarGaleriaMarchand('loja', 'statusvendedores', 'vendedor');
        
        Mostra(c, true);
    }

    MostrarOrcamentos();

    if(Window.getParameter('novo') == 'true' && Window.getParameter('novo') != null){
        Novo(true, true);
    }
};

window.onresize = function () {
    if (Selector.$('divRel').clientHeight !== 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
};

//--A PARTIR DAQUI TUDO QUE FOR IGUAL NO PROPOSTAS.JS DO ADMIN QUE FOR ALTERADO AQUI DEVE SER ALTERADO LÁ--//

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('divDatas').style.display = 'inline-block';
        Selector.$('btPesquisarCad').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    } else {
        Selector.$('divContainer').style.maxWidth = '1350px';
        Selector.$('divCadastro2').setAttribute('style', 'height:585px;  width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
        Selector.$('divDatas').style.display = 'none';
        Selector.$('btPesquisarCad').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
        Selector.$('statusvendedores').style.display = 'none';
    }
}

function MostrarOrcamentos() {

    gridOrcamentos.clearRows();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=MostrarOrcamentos';
    p += '&busca=' + Selector.$('busca').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&vendedor=' + Selector.$('statusvendedores').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var ver;
        var obras;
        var cor;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', '../imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Orçamento');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idOrcamento + ', true)');

            gridOrcamentos.addRow([
                DOM.newText(json[i].numeroOrcamento),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].marchand),
                DOM.newText(json[i].descricaoStatus),
                ver
            ]);

            gridOrcamentos.setRowData(gridOrcamentos.getRowCount() - 1, json[i].idOrcamento);
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; width:200px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;max-width:380px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; ');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; width:90px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 6).setAttribute('style', 'text-align:left; width:120px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:40px;');

            if (cor) {
                cor = false;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#FFF");
            }
        }
    }

    ajax.Request(p);
}

function Novo(ajustar, setarCampos) {

    //checkPermissao(12, true);

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('dataCadastro').value = Date.GetDate(false);
    Selector.$('situacao').value = 'Novo orçamento';
    Selector.$('loja').focus();
    Selector.$('botNovo').setAttribute('src', '../imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', '../imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');

    if(setarCampos){
        SetarGaleriaMarchand('loja', 'statusvendedores', 'vendedor');
    }
}

function Cancelar() {

    AjustarDivs();
    Limpar();
    Selector.$('botNovo').setAttribute('src', '../imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true, true);');
    Selector.$('botSair').setAttribute('src', '../imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
        Cancelar();
    }
}

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
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid;  overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');//JAIRO MEXER AQUI
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; background:#FFF; min-height:600px; overflow:hidden');
}

/*function Desabilita(Valor) {
 
 Selector.$('dataCadastro').disabled = Valor;
 Selector.$('loja').disabled = Valor;
 Selector.$('cliente').disabled = Valor;
 Selector.$('vendedor').disabled = Valor;
 Selector.$('situacao').disabled = Valor;
 
 Selector.$('pesquisarClientes').style.visibility = (Valor ? 'hidden' : 'visible');
 Selector.$('adicionarCliente').style.visibility  = (Valor ? 'hidden' : 'visible');
 
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
 
 Selector.$('formaPagamento').disabled = Valor;
 Selector.$('qtdeParcelas').disabled = Valor;
 
 Selector.$('addObra').style.display = (Valor ? "none" : "block");
 Selector.$('codigo').style.display = (!Valor ? "none" : "block");
 //Selector.$('mesAnoOrcamento').style.display = (!Valor ? "none" : "block");
 Selector.$('d1').style.display = (!Valor ? "none" : "block");
 Selector.$('d2').style.display = (!Valor ? "none" : "block");
 Selector.$('d3').style.display = (!Valor ? "none" : "block");
 Selector.$('d4').style.display = (!Valor ? "none" : "block");
 
 AjustaImagensEdicao(Selector.$('botNovo'), Selector.$('botModi'), Selector.$('botSair'), Selector.$('botDel'), Selector.$('lupinha'));
 }*/

/*function D1_onClick() {
 
 if (Selector.$('codigo').value.trim() === "") {
 Selector.$('codigo').value = 0;
 }
 
 var ajax = new Ajax('POST', 'php/propostas.php', false);
 ajax.Request('action=GetRegistroPrimeiro&codigo=' + Selector.$('codigo').value);
 Mostra(ajax.getResponseText());
 }
 
 function D2_onClick() {
 
 if (Selector.$('codigo').value.trim() === "") {
 Selector.$('codigo').value = 0;
 }
 
 var ajax = new Ajax('POST', 'php/propostas.php', false);
 ajax.Request('action=GetRegistroAnterior&atual=' + codigoAtual);
 Mostra(ajax.getResponseText());
 }
 
 function D3_onClick() {
 
 if (Selector.$('codigo').value.trim() === "") {
 Selector.$('codigo').value = 0;
 }
 
 var ajax = new Ajax('POST', 'php/propostas.php', false);
 ajax.Request('action=GetRegistroProximo&atual=' + codigoAtual);
 
 Mostra(ajax.getResponseText());
 }
 
 function D4_onClick() {
 
 if (Selector.$('codigo').value.trim() === "") {
 Selector.$('codigo').value = 0;
 }
 
 var ajax = new Ajax('POST', 'php/propostas.php', false);
 ajax.Request('action=GetRegistroUltimo&codigo=' + Selector.$('codigo').value);
 
 Mostra(ajax.getResponseText());
 }*/

/*function AjustaImagensEdicao(BotNovo, BotModi, BotSair, BotAux1, BotAux2) {
 
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
 }*/

/*function botNovo_onClick() {
 
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
 Selector.$('situacao').value = 'Novo orçamento';
 Selector.$('loja').focus();
 }
 }
 
 function botModi_onClick() {
 
 if (codigoAtual <= 0) {
 MostrarMsg('Nenhum orçamento ativa', '');
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
 }
 }*/

function botDel_onClick() {

    if (codigoAtual <= 0) {
        MostrarMsg('Nenhum orçamento ativa', '');
        return;
    }

    //FAZER CANCELAMENTO DE PROPOSTA
}

/*function botSair_onClick() {
 
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
 }*/

function Limpar() {

    codigoAtual = 0;
    //Selector.$('codigo').value = '';

    Selector.$('codProposta').innerHTML = '- - -';
    //Select.Clear(Selector.$('versaoProposta'));
    //Selector.$('versaoProposta').name = '';

    Selector.$('validade').innerHTML = '';

    //Selector.$('ultimaAtualizacaopor').innerHTML = "";
    Selector.$('dataCadastro').value = "";
    Selector.$('loja').selectedIndex = 0;
    Selector.$('cliente').selectedIndex = 0;
    Selector.$('cliente').name = '';
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

    Selector.$('obs').value = "";

    Selector.$('formaPagamento').selectedIndex = 0;
    Selector.$('qtdeParcelas').value = '';
    Selector.$('detalhesPagamento').value = '';

    gridObras.clearRows();
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
        MostrarMsg("Por favor, selecione a loja", 'loja');
        SelecionaAbas(0);
        return false;
    }

    var cliente = Selector.$('cliente');
    if (cliente.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um colecionador", 'cliente');
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

    /*if (gridObras.getRowCount() <= 0) {
        MostrarMsg("Por favor, adicione uma ou mais obras.", '');
        SelecionaAbas(0);
        return false;
    }*/

    /*var formaPagamento = Selector.$('formaPagamento');
    if (formaPagamento.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione uma forma de pagamento", 'formaPagamento');
        SelecionaAbas(0);
        return false;
    }*/

    /*var qtdeParcelas = Selector.$('qtdeParcelas');
    if (qtdeParcelas.value == '' || parseInt(qtdeParcelas.value) <= 0) {
        MostrarMsg("Por favor, informe a quantidade de parcelas", 'qtdeParcelas');
        SelecionaAbas(0);
        return false;
    }*/

    return true;
}

function Gravar() {

    if (!VerificaCampos()) {
        return false;
    }

    if(!checkLogarNovamente()){
        return false;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&idClienteEndereco=' + Selector.$('enderecos').value;
    p += '&idVendedor=' + Selector.$('vendedor').value;
    p += '&contatoCliente=' + Selector.$('contato').value;
    p += '&telefoneCliente=' + Selector.$('telefone').value;
    p += '&emailCliente=' + Selector.$('email').value;
    p += '&idTipoTransporte=' + Selector.$('tipoTransporte').value;

    //ARRAY COM OBRAS
    p += '&idsOrcamentosObras=' + gridObras.getRowsData();
    p += '&observacoes=' + gridObras.getContentRows(7);
    p += '&idsTiposObras=' + gridObras.getContentRows(10);
    p += '&idsObras=' + gridObras.getContentRows(11);
    p += '&idsArtistas=' + gridObras.getContentRows(12);
    p += '&idsTamanhos=' + gridObras.getContentRows(13);
    p += '&idsAcabamentos=' + gridObras.getContentRows(14);
    p += '&totaisObras=' + gridObras.getContentMoneyRows(6);
    p += '&alturas=' + gridObras.getContentMoneyRows(15);
    p += '&larguras=' + gridObras.getContentMoneyRows(16);
    p += '&qtds=' + gridObras.getContentMoneyRows(17);
    p += '&percentuaisDescontos=' + gridObras.getContentMoneyRows(18);
    p += '&valoresDescontos=' + gridObras.getContentMoneyRows(19);
    p += '&valoresAcrescimos=' + gridObras.getContentMoneyRows(20);
    p += '&valoresUnitarios=' + gridObras.getContentMoneyRows(21);
    p += '&tiragens=' + gridObras.getContentRows(22);
    p += '&qtdsVendidos=' + gridObras.getContentRows(23);
    p += '&estrelas=' + gridObras.getContentRows(24);
    p += '&imagens=' + gridObras.getContentRows(25);
    p += '&pesos=' + gridObras.getContentMoneyRows(26);
    p += '&idsGruposMolduras=' + gridObras.getContentRows(27);
    p += '&idsMolduras=' + gridObras.getContentRows(28);

    p += '&valor=' + Selector.$('valor').value;
    p += '&valorFrete=' + Selector.$('frete').value;
    p += '&valorAcrescimo=' + Selector.$('acrescimo').value;
    p += '&percentualDesconto=' + Selector.$('percDesconto').value;
    p += '&valorTotalDesconto=' + Selector.$('valorDesconto').value;
    p += '&valorTotalOrcamento=' + Selector.$('valorTotal').value;
    p += '&obs=' + Selector.$('obs').value;

    p += '&idFormaPagamento=' + Selector.$('formaPagamento').value;
    p += '&qtdeParcelas=' + (Selector.$('qtdeParcelas').value.trim() == '' ? '0' : Selector.$('qtdeParcelas').value);

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg('Problemas ao gravar o orçamento. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } else {
        var json = JSON.parse(ajax.getResponseText());

        if (json.status == 'OK') {
            Cancelar();
            MostrarOrcamentos();
            codigoAtual = json.idOrcamento;
            return true;
        }
        else {
            var msg = 'Problemas ao gravar o orçamento. Tente novamente, caso o erro persista, entre em contato com o suporte técnico. <br /><br />ERRO: ' + json.status;

            var mensagem = new DialogoMensagens("prompt", 180, 410, 150, "1", "Atenção!", msg, "OK", "", false, '');
            mensagem.Show();
            return false;
        }
    }
}

function Mostra(Codigo, ajustar) {

    //checkPermissao(12, true);

    if (Codigo === '' || parseInt(Codigo) === 0) {
        //MostrarMsg('Proposta não localizada', 'codigo');
        return;
    }

    Novo(ajustar, false);
    Limpar();

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Orçamento não localizado', 'codigo');
        return;
    }

    var json = JSON.parse(ajax.getResponseText());
    codigoAtual = json.idOrcamento;

    Selector.$('botCancelarOrcamento').setAttribute('onclick', 'CancelarOrcamentoAux(' + json.idOrcamento + ');');
    Selector.$('botGerarPedido').setAttribute('onclick', 'GerarPedidoAux(' + json.idOrcamento + ');');
    Selector.$('botImprimirOrcamento').setAttribute('onclick', 'ImprimirOrcamento(' + json.idOrcamento + ');');
    Selector.$('botGerarPdfOrcamento').setAttribute('onclick', 'GerarPdfOrcamento();');
    Selector.$('botEnviarOrcamentoEmail').setAttribute('onclick', 'EnviarPdfOrcamentoEmail();');

    //Selector.$('codigo').value = codigoAtual;

    Selector.$('codProposta').innerHTML = json.proposta;
    Selector.$('dataCadastro').value = json.dataCadastro;
    Selector.$('validade').innerHTML = json.validade;
    Selector.$('validade').setAttribute('name', json.dataValidade);
    Select.Show(Selector.$('loja'), json.idLoja);
    CarregaMarchands(false);

    Selector.$('situacao').setAttribute('name', json.idSituacao);
    Selector.$('situacao').value = json.situacao;

    Select.Show(Selector.$('cliente'), json.idCliente);
    getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
    Select.Show(Selector.$('enderecos'), json.idClienteEndereco);
    Select.Show(Selector.$('vendedor'), json.idVendedor);
    getComissaoMarchand();

    Selector.$('contato').value = json.contato;
    Selector.$('telefone').value = json.telefone;
    Selector.$('email').value = json.email;
    Select.Show(Selector.$('tipoTransporte'), json.idTransporteTipo);
    VerificarFrete();

    Selector.$('valor').value = json.valor;
    Selector.$('frete').value = json.valorFrete;
    Selector.$('acrescimo').value = json.valorAcrescimo;
    Selector.$('percDesconto').value = json.percDesconto;
    Selector.$('valorDesconto').value = json.valorDesconto;
    Selector.$('valorTotal').value = json.valorTotal;
    Selector.$('obs').value = json.obs;

    Select.Show(Selector.$('formaPagamento'), json.idFormaPagamento);
    Selector.$('qtdeParcelas').value = json.qtdeParcelas;
    CalculaPagamento(false, false, false);

    MostraObras(json.arrayObras);
    getFollow();
}

function ImprimirOrcamento(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    window.open('impressao-orcamento.html?codigo=' + idOrcamento, 'printOrc');
}

function CancelarOrcamentoAux(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('O orçamento já encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        MostrarMsg('O orçamento já virou pedido, não é possível cancelar', '');
        return;
    }

    mensagemCancelarOrcamento = new DialogoMensagens("prompt", 120, 400, 150, "4", "Alerta!", "Deseja realmente cancelar o orçamento n° " + Selector.$('codProposta').innerHTML + "?", "SIM", "CancelarOrcamento(" + idOrcamento + ")", true, "");
    mensagemCancelarOrcamento.Show();
}

function CancelarOrcamento(idOrcamento) {

    /*if(!confirm('Deseja realmente cancelar o orçamento nº ' + Selector.$('codProposta').innerHTML + '?')){
     return;
     }*/

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('O orçamento já encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        MostrarMsg('O orçamento já virou pedido, não é possível cancelar', '');
        return;
    }

    mensagemCancelarOrcamento.Close();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=CancelarOrcamento';
    p += '&idOrcamento=' + idOrcamento;

    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == 1) {
            MostrarMsg('Orçamento cancelado com sucesso', '');
            Mostra(idOrcamento, false);
            MostrarOrcamentos();
        }
        else {
            MostrarMsg('Problemas ao cancelar o orçamento. Tente novamente, caso o erro persista contate o suporte técnico', '');
        }

        Selector.$('imgCancelar').src = '../imagens/cancelar.png';
    };

    Selector.$('imgCancelar').src = '../imagens/loading.gif';
    ajax.Request(p);
}

function GerarPedidoAux(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('Não é possível gerar pedido, o orçamento encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        var mensagem = new DialogoMensagens("prompt", 195, 350, 150, "2", "Atenção!", 'O orçamento já virou pedido.<br /><br />' + Selector.$('situacao').value + '<br /><br /><a href="pedidos.html?idOrcamento=' + idOrcamento + '&source=abrir">Abrir Pedido</a>', "OK", "", false, '');
        mensagem.Show();
        return;
    }

    mensagemGerarPedido = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja gerar venda a partir do orçamento nº " + Selector.$('codProposta').innerHTML + "?", "OK", "GerarPedido(" + idOrcamento + ");", true, "");
    mensagemGerarPedido.Show();
}

function GerarPedido(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('Não é possível gerar pedido, o orçamento encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        var mensagem = new DialogoMensagens("prompt", 195, 350, 150, "2", "Atenção!", 'O orçamento já virou pedido.<br /><br />' + Selector.$('situacao').value + '<br /><br /><a href="pedidos.html?idOrcamento=' + idOrcamento + '&source=abrir">Abrir Pedido</a>', "OK", "", false, '');
        mensagem.Show();
        return;
    }

    mensagemGerarPedido.Close();

    /*if(!confirm('Deseja gerar venda a partir do orçamento nº ' + Selector.$('codProposta').innerHTML + '?')){
     return;
     }*/

    window.location = 'pedidos.html?idOrcamento=' + idOrcamento + '&source=gerar';
}

function MostraObras(array) {

    gridObras.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var divEditarDuplicar = DOM.newElement('div');

        var editar = DOM.newElement('img');
        editar.setAttribute('src', '../imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var duplicar = DOM.newElement('img');
        duplicar.setAttribute('src', '../imagens/duplicate.png');
        duplicar.setAttribute('title', 'Duplicar Obra');
        duplicar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
        duplicar.setAttribute('class', 'efeito-opacidade-75-04');
        duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

        divEditarDuplicar.appendChild(editar);
        divEditarDuplicar.appendChild(duplicar);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', '../imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        gridObras.addRow([
            DOM.newText(json[i].nomeTipo),
            DOM.newText(json[i].nomeArtista),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == 3 ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipo == '3' ? json[i].nomeProduto : json[i].nomeAcabamento + (json[i].moldura != '' ? ' - ' + json[i].moldura : ''))),
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

        gridObras.setRowData(gridObras.getRowCount() - 1, json[i].idOrcamentoComp);
        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:right;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:50px;');
        gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#FFF");
        }
    }

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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
}

/*function PesquisarPropostas() {
 
 gridPesquisa.clearRows();
 
 var ajax = new Ajax('POST', 'php/clientes.php', false);
 var p = 'action=PesquisarClientes';
 p += '&nome=' + Selector.$('nome2').value;
 
 ajax.Request(p);
 
 if (ajax.getResponseText() === '') {
 alert("Nenhum registro encontrado!");
 return;
 }
 
 var json = JSON.parse(ajax.getResponseText());
 
 var cor = true;
 
 for (var i = 0; i < json.length; i++) {
 
 gridPesquisa.addRow([
 DOM.newText(json[i].nome),
 DOM.newText(json[i].apelido),
 DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO"))
 ]);
 
 gridPesquisa.setRowData(gridPesquisa.getRowCount() - 1, json[i].codigo);
 gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('onclick', 'MostraResultadoPesquisa(' + json[i].codigo + ');');
 gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
 gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
 if (cor) {
 cor = false;
 gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, "#F5F5F5");
 
 } else {
 cor = true;
 gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, "#FFF");
 }
 }
 }
 
 function MostraResultadoPesquisa(codigo) {
 
 gridPesquisa.clearRows();
 Selector.$('nome2').value = "";
 Mostra(codigo);
 dialogo.Close();
 }
 
 function codigo_KeyDown(ev) {
 ev = window.event || ev;
 var keyCode = ev.keyCode || ev.which;
 
 if (keyCode == 13) {
 Mostra(Selector.$('codigo').value);
 }
 }
 
 function AbrePromptPesquisaPropostas() {
 PromptPesquisaClientes(Selector.$('prompt'));
 }
 
 function PromptPesquisaPropostas(div) {
 
 div.innerHTML = "";
 div.setAttribute('style', 'height:230px; display:block');
 
 var lblnome = DOM.newElement('label');
 lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
 lblnome.appendChild(DOM.newText('Nome'));
 
 var txtnome = DOM.newElement('text');
 txtnome.setAttribute('id', 'nome2');
 txtnome.setAttribute('class', 'textbox_cinzafoco');
 txtnome.setAttribute('style', 'width:350px; margin-left:5px;');
 txtnome.setAttribute('onkeydown', 'pesquisa_KeyDown();');
 
 var botPesquisar = DOM.newElement('submit');
 botPesquisar.setAttribute('id', 'botEnviar');
 botPesquisar.setAttribute('class', 'botaosimplesfoco');
 botPesquisar.setAttribute('style', '  float:right; magin-left:10px;');
 botPesquisar.value = 'Pesquisar';
 botPesquisar.setAttribute('onclick', 'PesquisarClientes();');
 
 var botCancelar = DOM.newElement('submit');
 botCancelar.setAttribute('id', 'botCancelar');
 botCancelar.setAttribute('class', 'botaosimplesfoco');
 botCancelar.setAttribute('style', 'float:right; magin-left:10px;');
 botCancelar.value = 'Cancelar';
 botCancelar.setAttribute('onclick', 'dialogo.Close();');
 
 div.appendChild(lblnome);
 div.appendChild(DOM.newText(' '));
 div.appendChild(txtnome);
 
 div.appendChild(DOM.newText(' '));
 div.appendChild(botCancelar);
 div.appendChild(botPesquisar);
 div.innerHTML += '<br /><br />';
 
 var divopcoes = DOM.newElement('div', 'divFooterR');
 divopcoes.setAttribute('id', 'divopcoes');
 divopcoes.setAttribute('style', 'height:200px; overflow:auto;');
 
 Selector.$('prompt').appendChild(divopcoes);
 
 gridPesquisa = new Table('gridPesquisa');
 gridPesquisa.table.setAttribute('class', 'tabela_cinza_foco');
 gridPesquisa.table.setAttribute('cellpadding', '5');
 gridPesquisa.table.setAttribute('cellspacing', '0');
 
 gridPesquisa.addHeader([
 DOM.newText('Cliente'),
 DOM.newText('Fantasia'),
 DOM.newText('Ativo')
 ]);
 
 divopcoes.appendChild(gridPesquisa.table);
 
 dialogo = new caixaDialogo('prompt', 290, 730, 'padrao/', 111);
 dialogo.Show();
 
 Selector.$('nome2').focus();
 }*/

function getPropostas() {

    var ajax = new Ajax('POST', 'php/clientes.php', true);
    var p = 'action=getPropostas';
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

            var img = DOM.newElement('img');
            img.src = "../imagens/pesquisar.png";

            gridProposta.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].situacao),
                DOM.newText(json[i].evento),
                DOM.newText(json[i].versao),
                DOM.newText(json[i].vendedor),
                DOM.newText(json[i].valorTotal),
                img
            ]);

            gridProposta.setRowData(gridProposta.getRowCount() - 1, json[i].codigo);
            gridProposta.getRow(gridProposta.getRowCount() - 1).setAttribute('onclick', 'window.location="orcamentos.html?codigo=' + json[i].codigo + '"');
            gridProposta.getRow(gridProposta.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; ');

            if (cor) {
                cor = false;
                gridProposta.setRowBackgroundColor(gridProposta.getRowCount() - 1, "#F5F5F5");

            } else {
                cor = true;
                gridProposta.setRowBackgroundColor(gridProposta.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function LoadDadosCliente() {
    var cmb = Selector.$('cliente');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '';
        Selector.$('contato').value = '';
        Selector.$('telefone').value = '';
        Selector.$('email').value = '';
        Selector.$('adicionarCliente').setAttribute('onclick', 'PromptCadastrarClienteRapido(0)');
        return;
    }

    if (cmb.name !== cmb.value)
        cmb.name = cmb.value;
    else
        return;

    Selector.$('contato').value = '';
    Selector.$('telefone').value = '';
    Selector.$('email').value = '';

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
    var p = 'action=LoadDadosCliente';
    p += '&idCliente=' + cmb.value;
    
    Selector.$('adicionarCliente').setAttribute('onclick', 'PromptCadastrarClienteRapido(' + cmb.value + ')');
    
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
/*
 function PesquisarClientes() {
 
 if (!isElement('div', 'divPesquisa_cliente')) {
 var divPesquisa_cliente = DOM.newElement('div', 'divPesquisa_cliente');
 document.body.appendChild(divPesquisa_cliente);
 }
 
 var divPesquisa_cliente = Selector.$('divPesquisa_cliente');
 divPesquisa_cliente.innerHTML = '';
 
 var lblNome = DOM.newElement('label');
 lblNome.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblNome.innerHTML = 'Nome';
 divPesquisa_cliente.appendChild(lblNome);
 
 var txtNome = DOM.newElement('input', 'cliente_nome');
 txtNome.setAttribute('type', 'text');
 txtNome.setAttribute('style', 'width:380px; margin: 0px 8px; ');
 txtNome.setAttribute('class', 'textbox_cinzafoco');
 divPesquisa_cliente.appendChild(txtNome);
 
 var cbAtivo = DOM.newElement('checkbox', 'cliente_ativo');
 divPesquisa_cliente.appendChild(cbAtivo);
 
 var lblAtivo = DOM.newElement('label');
 lblAtivo.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblAtivo.innerHTML = 'Ativo';
 divPesquisa_cliente.appendChild(lblAtivo);
 
 divPesquisa_cliente.innerHTML += '<br/><br/>';
 
 var rdCpf = DOM.newElement('radio');
 rdCpf.setAttribute('id', 'cliente_cpf');
 rdCpf.setAttribute('name', 'cliente_tipo');
 rdCpf.setAttribute('style', 'cursor:pointer;');
 rdCpf.setAttribute('onclick', 'selecionaPessoa()');
 divPesquisa_cliente.appendChild(rdCpf);
 
 var lblCpf = DOM.newElement('label');
 lblCpf.setAttribute('style', 'cursor:pointer;');
 lblCpf.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblCpf.setAttribute('for', 'cliente_cpf');
 lblCpf.innerHTML = 'CPF';
 lblCpf.setAttribute('onclick', 'selecionaPessoa()');
 divPesquisa_cliente.appendChild(lblCpf);
 
 var rdCnpj = DOM.newElement('radio', 'cliente_cnpj');
 rdCnpj.setAttribute('id', 'cliente_cnpj');
 rdCnpj.setAttribute('style', 'margin-left: 10px; cursor:pointer;');
 rdCnpj.setAttribute('name', 'cliente_tipo');
 rdCnpj.setAttribute('onclick', 'selecionaPessoa()');
 divPesquisa_cliente.appendChild(rdCnpj);
 
 var lblCnpj = DOM.newElement('label');
 lblCnpj.setAttribute('style', 'cursor:pointer;');
 lblCnpj.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblCnpj.setAttribute('for', 'cliente_cnpj');
 lblCnpj.innerHTML = 'CNPJ';
 lblCnpj.setAttribute('onclick', 'selecionaPessoa()');
 divPesquisa_cliente.appendChild(lblCnpj);
 
 var lblTelefone = DOM.newElement('label');
 lblTelefone.setAttribute('style', 'margin-left: 135px;');
 lblTelefone.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblTelefone.innerHTML = 'Telefone';
 divPesquisa_cliente.appendChild(lblTelefone);
 
 var lblCelular = DOM.newElement('label');
 lblCelular.setAttribute('style', 'margin-left: 82px;');
 lblCelular.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblCelular.innerHTML = 'Celular';
 divPesquisa_cliente.appendChild(lblCelular);
 
 divPesquisa_cliente.innerHTML += "<br/>";
 
 var txtTipoCliente = DOM.newElement('input', 'cliente_in_tipo');
 txtTipoCliente.setAttribute('type', 'text');
 txtTipoCliente.setAttribute('style', 'width:165px;');
 txtTipoCliente.setAttribute('class', 'textbox_cinzafoco');
 divPesquisa_cliente.appendChild(txtTipoCliente);
 
 var txtTelefone = DOM.newElement('input', 'cliente_in_telefone');
 txtTelefone.setAttribute('type', 'text');
 txtTelefone.setAttribute('style', 'width:115px; margin-left:75px;');
 txtTelefone.setAttribute('class', 'textbox_cinzafoco');
 divPesquisa_cliente.appendChild(txtTelefone);
 
 var txtCelular = DOM.newElement('input', 'cliente_in_celular');
 txtCelular.setAttribute('type', 'text');
 txtCelular.setAttribute('style', 'width:115px; margin-left:15px;');
 txtCelular.setAttribute('class', 'textbox_cinzafoco');
 divPesquisa_cliente.appendChild(txtCelular);
 
 divPesquisa_cliente.innerHTML += "<br/><br/>";
 
 var cmdPesquisar = DOM.newElement('button', 'cliente_pesquisar');
 cmdPesquisar.setAttribute('style', 'float:right;');
 cmdPesquisar.setAttribute('class', 'botaosimplesfoco');
 cmdPesquisar.setAttribute('onclick', 'MostraResultadoClientes()');
 cmdPesquisar.innerHTML = 'Pesquisar';
 divPesquisa_cliente.appendChild(cmdPesquisar);
 
 divPesquisa_cliente.innerHTML += "<br/>";
 
 var lblAviso = DOM.newElement('label');
 lblAviso.setAttribute('class', 'fonte_Roboto_texto_normal');
 lblAviso.innerHTML = '* clique sobre o cliente para selecioná-lo';
 divPesquisa_cliente.appendChild(lblAviso);
 
 divPesquisa_cliente.innerHTML += "<br/><br/>";
 
 var tbPesquisa = DOM.newElement('div', 'tbPesquisa');
 tbPesquisa.setAttribute('style', 'height:270px; overflow:auto;');
 divPesquisa_cliente.appendChild(tbPesquisa);
 
 divPesquisa_cliente = new caixaDialogo('divPesquisa_cliente', 350, 540, 'padrao/', 130);
 divPesquisa_cliente.Show();
 
 Mask.setOnlyNumbers(Selector.$('cliente_in_telefone'));
 Selector.$('cliente_cpf').checked = true;
 selecionaPessoa();
 
 //TABELA DE CLIENTES
 
 gridClientes = new Table('gridLogisticas');
 gridClientes.table.setAttribute('cellpadding', '2');
 gridClientes.table.setAttribute('cellspacing', '0');
 gridClientes.table.setAttribute('class', 'tabela_cinza_foco');
 
 gridClientes.addHeader([
 DOM.newText('Nome'),
 DOM.newText('Fantasia'),
 DOM.newText('CPF / CNPJ'),
 DOM.newText('Telefone'),
 DOM.newText('Celular')
 ]);
 
 Selector.$('tbPesquisa').appendChild(gridClientes.table);
 
 //FIM TABELA CLIENTES
 }
 
 function MostraResultadoClientes() {
 
 var ajax = new Ajax('POST', 'php/propostas.php', true);
 var p = "action=MostraResultadoClientes";
 p += "&nome=" + Selector.$('cliente_nome').value;
 p += "&tipo=" + Selector.$('cliente_in_tipo').value;
 p += "&telefone=" + Selector.$('cliente_in_telefone').value;
 p += "&celular=" + Selector.$('cliente_in_celular').value;
 alert(p);
 ajax.ajax.onreadystatechange = function () {
 alert(ajax.isStateOK());
 if (!ajax.isStateOK())
 return;
 
 alert(ajax.getResponseText());
 
 //var json = JSON.parse(ajax.getResponseText());
 
 //Mostra
 };
 
 ajax.Request(p);
 }
 */

function selecionaPessoa() {

    if (Selector.$('cliente_cpf').checked) {
        Mask.setCPF(Selector.$('cliente_in_tipo'));
        Selector.$('cliente_nome').setAttribute('placeholder', 'Nome ou Apelido');
    }
    else {
        Mask.setCNPJ(Selector.$('cliente_in_tipo'));
        Selector.$('cliente_nome').setAttribute('placeholder', 'Razão ou Fantasia');
    }
}

//OBRAS
function AdicionarObra(codigo) {
    /*if (Selector.$('botNovo').name !== 'NovoTrue' && Selector.$('botModi').name !== 'ModiTrue')
     return;*/

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

    divCadastro.appendChild(divI);//FIM divI

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

    /*ACABAMENTO
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
     divI.appendChild(elemento);*/

    divCadastro.appendChild(divProd);
    //FIM divProd

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
    elemento.setAttribute("style", 'width:560px; height:40px;');

    divCadastro.appendChild(label);
    divCadastro.appendChild(elemento);

    //IMAGEM OBRA
    var divImg = DOM.newElement('div');
    divImg.setAttribute('style', 'text-align:center');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem');
    elemento.setAttribute('src', '../imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px;');
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
    //label.setAttribute('onclick', 'AnexarImagem()');

    divIncluirImagem.appendChild(label);
    divCadastro.appendChild(divIncluirImagem);

    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');

    label = DOM.newElement('label', 'e_lblCancelar');
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle');
    label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');
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

    dialogoCadastro = new caixaDialogo('divCadastro', 545, 620, '../padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();
    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    Selector.$('divCadastro').style.overflow = 'hidden';

    Mask.setMoeda(Selector.$('o_percDesconto'));
    Mask.setMoeda(Selector.$('o_valorDesconto'));
    Mask.setMoeda(Selector.$('o_valorAcrescimo'));

    if (codigo >= 0) {
        getArtistas(Selector.$('o_artista'), 'Selecione um artista', false);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', false, 'p');
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', false, 'i');
        
        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', false);
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', false);

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

            if (gridObras.getCellText(codigo, 25) == '' || gridObras.getCellText(codigo, 25).split('/')[gridObras.getCellText(codigo, 25).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = '../imagens/semarte.png';
            } else {
                Selector.$('o_imagem').src = '../imagens/obras/mini_' + gridObras.getCellText(codigo, 25);
            }

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 26) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 26);
            
            Select.Show(Selector.$('o_grupoMoldura'), gridObras.getCellText(codigo, 27));
            getMoldurasObras(Selector.$('o_moldura'), 'Selecione uma moldura...', false, Selector.$('o_grupoMoldura').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_moldura'), gridObras.getCellText(codigo, 28));
        }
        else if (gridObras.getCellText(codigo, 10) == 2) {

            var pasta = 'instaarts';

            Selector.$('o_optInsta').checked = 'checked';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';
            AlternaTipoObras();

            getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);
            Select.Show(Selector.$('o_tamanhoI'), gridObras.getCellText(codigo, 13));

            Select.Show(Selector.$('o_acabamentoI'), gridObras.getCellText(codigo, 14));

            Selector.$('o_alturaI').value = gridObras.getCellText(codigo, 15);
            Selector.$('o_larguraI').value = gridObras.getCellText(codigo, 16);

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 17);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 19);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 20);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 6);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 7);
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 25));

            if (gridObras.getCellText(codigo, 25) == '' || gridObras.getCellText(codigo, 25).split('/')[gridObras.getCellText(codigo, 25).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
            } else {

                if(gridObras.getCellText(codigo, 25).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 25).split('.')[1] == 'rar'){
                    Selector.$('o_imagem').src = '../imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + '../imagens/' + pasta + '/' + gridObras.getCellText(codigo, 25) + '' + "');");
                }else if(gridObras.getCellText(codigo, 25).split('.')[1] == 'pdf') {
                    Selector.$('o_imagem').src = '../imagens/pdf.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute('onclick', "window.open('" + "../imagens/" + pasta + "/" + gridObras.getCellText(codigo, 25) + "')");
                }else{
                    Selector.$('o_imagem').src = '../imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 25);
                }

                Selector.$('o_imagem').name = gridObras.getCellText(codigo, 25);
                Selector.$('o_imagem').title = '../imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 25);
            }

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 26) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 26);
            
            Select.Show(Selector.$('o_grupoMolduraI'), gridObras.getCellText(codigo, 27));
            getMoldurasObras(Selector.$('o_molduraI'), 'Selecione uma moldura...', false, Selector.$('o_grupoMolduraI').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_molduraI'), gridObras.getCellText(codigo, 28));
        }
        else {
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').checked = 'checked';
            AlternaTipoObras();

            getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', false);

            Select.Show(Selector.$('o_produtoProd'), gridObras.getCellText(codigo, 14));

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 17);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 19);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 20);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 6);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 7);
            Selector.$('o_imagem').src = '../imagens/semarte.png';
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 25));

            if (gridObras.getCellText(codigo, 25) == '' || gridObras.getCellText(codigo, 25).split('/')[gridObras.getCellText(codigo, 25).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = '../imagens/semarte.png';
            } else {
                Selector.$('o_imagem').src = '../imagens/produtos/mini_' + gridObras.getCellText(codigo, 25);
            }
        }
    }
    else {
        getArtistas(Selector.$('o_artista'), 'Selecione um artista', true);
        Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', 0);
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', 0);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', true, 'p');
        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', true);
        Select.AddItem(Selector.$('o_moldura'), 'Selecione um grupo', 0);
        Selector.$('o_grupoMoldura').name='0';

        getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', true);
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', true, 'i');
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', true);
        Select.AddItem(Selector.$('o_molduraI'), 'Selecione um grupo', 0);
        Selector.$('o_grupoMolduraI').name='0';

        getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', true);

        AlternaTipoObras();
    }

    Selector.$('o_artista').focus();
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

function AlternaTipoObras() {
    
    /*var scrollX, scrollY;
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
    }*/

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';

       // Selector.$('divCadastro').style.height = "535px";
       dialogoCadastro.Realinhar(535,620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (535 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_artista').focus();
        getTamanhosObras(true);
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        //Selector.$('divCadastro').style.height = "505px";
        dialogoCadastro.Realinhar(505,620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (505 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_tamanhoI').focus();
        Selector.$('o_imagem').src = '../imagens/semarte.png';
        Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem("instaarts")');
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

       // Selector.$('divCadastro').style.height = "430px";
        dialogoCadastro.Realinhar(430,620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (430 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_produtoProd').focus();
        Selector.$('o_imagem').src = '../imagens/semarte.png';
        Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem("produtos")');
    }
}

function IncluirObra(linha) {

    var altura;
    var largura;

    if (Selector.$('o_optPhoto').checked) {

        altura = (parseFloat(Selector.$('o_altura').value) / 100);
        largura = (parseFloat(Selector.$('o_largura').value) / 100);

        var metro = (altura * largura);

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

        if (Selector.$('o_acabamento').options[Selector.$('o_acabamento').selectedIndex].id === '1') {

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

        if (Selector.$('o_acabamentoI').options[Selector.$('o_acabamentoI').selectedIndex].id === '1') {

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

    if (Number.parseFloat(Selector.$('o_valorTotal').value) <= 0) {
        MostrarMsg('Por favor, verifique o valor total', 'o_artista');
        return;
    }

    var tipo = 0;
    var nomeTipo = '';
    var photoArts = Selector.$('o_optPhoto').checked;
    var instaArts = Selector.$('o_optInsta').checked;

    if (photoArts) {
        nomeTipo = 'PhotoArts';
        tipo = 1;
    }
    else if (instaArts) {
        nomeTipo = 'InstaArts';
        tipo = 2;
    }
    else {
        nomeTipo = 'Produtos'
        tipo = 3;
    }

    if (linha >= 0) {
        gridObras.setCellText(linha, 0, nomeTipo);
        gridObras.setCellText(linha, 1, (photoArts ? Select.GetText(Selector.$('o_artista')) : '- - -'));
        gridObras.setCellText(linha, 2, (photoArts ? Select.GetText(Selector.$('o_obra')) : '- - -'));
        gridObras.setCellText(linha, 3, (photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -')));
        gridObras.setCellText(linha, 4, (photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd')))));
        gridObras.setCellText(linha, 5, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 6, Selector.$('o_valorTotal').value);
        gridObras.setCellText(linha, 7, Selector.$('o_obs').value);

        //OCULTAS        
        gridObras.setCellText(linha, 10, tipo);
        gridObras.setCellText(linha, 11, (photoArts ? Selector.$('o_obra').value : '0'));
        gridObras.setCellText(linha, 12, (photoArts ? Selector.$('o_artista').value : '0'));
        gridObras.setCellText(linha, 13, (photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0')));
        gridObras.setCellText(linha, 14, (photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value)));
        gridObras.setCellText(linha, 15, (photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0')));
        gridObras.setCellText(linha, 16, (photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0')));
        gridObras.setCellText(linha, 17, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 18, Selector.$('o_percDesconto').value);
        gridObras.setCellText(linha, 19, Selector.$('o_valorDesconto').value);
        gridObras.setCellText(linha, 20, Selector.$('o_valorAcrescimo').value);
        gridObras.setCellText(linha, 21, Selector.$('o_valor').value);
        gridObras.setCellText(linha, 22, (photoArts ? Selector.$('o_tiragem').value : '0'));
        gridObras.setCellText(linha, 23, (photoArts ? Selector.$('o_qtdeVendidos').value : '0'));
        gridObras.setCellText(linha, 24, (photoArts ? Selector.$('o_estrelas').value : '0'));
        gridObras.setCellText(linha, 25, Selector.$('o_imagem').getAttribute('name'));
        gridObras.setCellText(linha, 26, (photoArts || instaArts ? Selector.$('o_lblPeso').name : '0'));
        
        gridObras.setCellText(linha, 27, (photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0')));
        gridObras.setCellText(linha, 28, (photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0')));
    }
    else {

        var divEditarDuplicar = DOM.newElement('div');

        var editar = DOM.newElement('img');
        editar.setAttribute('src', '../imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var duplicar = DOM.newElement('img');
        duplicar.setAttribute('src', '../imagens/duplicate.png');
        duplicar.setAttribute('title', 'Duplicar Obra');
        duplicar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
        duplicar.setAttribute('class', 'efeito-opacidade-75-04');
        duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

        divEditarDuplicar.appendChild(editar);
        divEditarDuplicar.appendChild(duplicar);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', '../imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        gridObras.addRow([
            DOM.newText(nomeTipo),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_artista')) : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_obra')) : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -'))),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd'))))),
            DOM.newText(Selector.$('o_qtde').value),
            DOM.newText(Selector.$('o_valorTotal').value),
            DOM.newText(Selector.$('o_obs').value),
            divEditarDuplicar,
            excluir,
            //OCULTOS
            DOM.newText(tipo),
            DOM.newText((photoArts ? Selector.$('o_obra').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_artista').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value))),
            DOM.newText((photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0'))),
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
        gridObras.getCell(i, 0).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(i, 1).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 2).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 5).setAttribute('style', 'text-align:center;');
        gridObras.getCell(i, 6).setAttribute('style', 'text-align:right;');
        gridObras.getCell(i, 7).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 8).setAttribute('style', 'text-align:center; width:50px;');
        gridObras.getCell(i, 9).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    dialogoCadastro.Close();
    Totaliza(true, false, false, false, false);
    CalculaPagamento(false, true, false);
}

function getObrasArtista(ascinc) {
    if (Selector.$('o_artista').value !== Selector.$('o_artista').name) {
        Selector.$('o_artista').name = Selector.$('o_artista').value;
    }
    else {
        return;
    }

    Select.Clear(Selector.$('o_obra'));

    if (Selector.$('o_artista').value === '0') {
        //getDadosTamanho('p');
        Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', '0', '');
        getTamanhosObras();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', ascinc);
    var p = 'action=getObras';
    p += '&idArtista=' + Selector.$('o_artista').value;

    if (ascinc) {
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
    }
    else {
        ajax.Request(p);

        Select.Clear(Selector.$('o_obra'));

        if (ajax.getResponseText() === '0') {
            return;
        }

        Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
        Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
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

function ExcluirObraAux(linha) {

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta obra?", "OK", "ExcluirObra(" + linha + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirObra(linha) {

    /*if (botNovo.name !== 'NovoTrue' && botModi.name !== 'ModiTrue')
     return;*/

    if (linha >= 0) {

        mensagemExcluirObra.Close();

        if (gridObras.getRowCount() == 1) {
            gridObras.clearRows();
        } else {

            gridObras.deleteRow(linha);

            var cor = false;
            for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {
                gridObras.getCellObject(i, 8).setAttribute('onclick', 'AdicionarObra(' + i + ');');
                gridObras.getCellObject(i, 9).setAttribute('onclick', 'ExcluirObraAux(' + i + ');');

                if (cor) {
                    cor = false;
                    gridObras.setRowBackgroundColor(i, "#F5F5F5");

                } else {
                    cor = true;
                    gridObras.setRowBackgroundColor(i, "#FFF");
                }
            }
        }

        Totaliza(true, false, false, false, false);
        CalculaPagamento(false, true, false);
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
            } else if (descontoMaximoObra == '0,00' || descontoMaximoObra == '') {
                Selector.$('o_percDesconto').value = '0,00';
                percDesconto = 0;
            } else if (percDesconto > Number.parseFloat(descontoMaximoObra)) {
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
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) > Number.parseFloat(descontoMaximoObra)) {
                Selector.$('o_percDesconto').value = Number.parseFloat(descontoMaximoObra);
                percDesconto = Number.parseFloat(descontoMaximoObra);
                Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total) * (percDesconto / 100));
            }

            if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) <= Number.parseFloat(descontoMaximoObra)) {
                Selector.$('o_percDesconto').value = Number.FormatDinheiro((valorDesconto / (total)) * 100);
            }
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

function CalculaPagamento(is_totaliza, is_formaPagamento, is_qtdParcelas) {
    var total = Number.parseFloat(Selector.$('valorTotal').value);
    var qtdParcelas = parseInt(Selector.$('qtdeParcelas').value);

    if (total <= 0 || Selector.$('qtdeParcelas').value == '' || qtdParcelas <= 0) {
        Selector.$('detalhesPagamento').value = '';
        return;
    }

    var texto = 'Em ' + qtdParcelas + ' parcela' + (qtdParcelas > 1 ? 's' : '') + ' de R$ ' + Number.FormatDinheiro(Number.Arredonda(total / qtdParcelas, 2)) + (Selector.$('formaPagamento').selectedIndex > 0 ? ' - ' + Select.GetText(Selector.$('formaPagamento')) : '');
    Selector.$('detalhesPagamento').value = texto.toString();

}
//FIM OBRAS

//TOTALIZA GERAL
function Totaliza(is_grids, is_frete, is_acrescimo, is_percDesconto, is_valorDesconto) {

    var total1 = Number.getFloat(gridObras.SumCol(6));
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
            } else if (percDesconto > Number.parseFloat(descontoMaximo)) {
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
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total1)) * 100)) > Number.parseFloat(descontoMaximo)) {
                Selector.$('percDesconto').value = Number.parseFloat(descontoMaximo);
                percDesconto = Number.parseFloat(descontoMaximo);
                Selector.$('valorDesconto').value = Number.FormatDinheiro((total1) * (percDesconto / 100));
            }

            if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total1)) * 100)) <= Number.parseFloat(descontoMaximo)) {
                Selector.$('percDesconto').value = Number.FormatDinheiro((valorDesconto / (total1)) * 100);
            }
        }
        else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    Selector.$('valorTotal').value = Number.FormatDinheiro((total1 - Number.parseFloat(Selector.$('valorDesconto').value)) + valorFrete + valorAcrescimo);
}

//ABA FOLLOW-UP
function getFollow() {

    gridFollow.clearRows();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=getFollow';
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
            editar.src = "../imagens/modificar.png";
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('style', 'width:15px');
            editar.setAttribute('onclick', 'editarFollow(' + json[i].codigo + ')');

            var excluir = DOM.newElement('img');
            excluir.src = "../imagens/lixo.png";
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('style', 'width:15px');
            excluir.setAttribute('onclick', 'excluirFollow(' + json[i].codigo + ')');

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

function excluirFollow(codigo) {

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este Follow-up?", "SIM", "excluirFollow_Aux(" + codigo + ")", true, "");
    mensagemExcluir.Show();
}

function excluirFollow_Aux(codigo) {

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    ajax.Request('action=ExcluirFollowUP&codigo=' + codigo);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    mensagemExcluir.Close();
    getFollow();
}

function editarFollow(codigo) {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Pequisa uma proposta para adicionar follow-up", "OK", "", false, "");
        mensagem.Show();
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
    btGravar.setAttribute('onclick', 'GravarFollow(' + codigo + ');');

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

    dialogo = new caixaDialogo('prompt', 410, 550, '../padrao/', 111);
    dialogo.Show();

    Mask.setData(Selector.$('retorno'));
    Mask.setHora(Selector.$('horaretorno'), false);

    if (codigo <= 0) {
        Selector.$('tiposcontatos').focus();
    } else {

        var ajax = new Ajax('POST', 'php/propostas.php', false);

        ajax.Request('action=pesquisarFollow&codigo=' + codigo);

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

function mostraRetorno() {

    if (Selector.$('checkretorno').checked) {

        Selector.$('divretorno').style.width = "270px";

    } else {
        Selector.$('divretorno').style.width = "0px";
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

function GravarFollow(codigo) {

    if (codigoAtual <= 0)
        return;

    if (Selector.$('tiposcontatos').value <= 0) {
        Selector.$('retorno').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o tipo de contato.", "OK", "", false, "tiposcontatos");
        mensagem.Show();
        return;
    }

    if (Selector.$('obsfollow').value.trim() == "") {
        Selector.$('retorno').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo de obs.", "OK", "", false, "obsfollow");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', false);

    var p = "action=GravarFollow";
    p += "&codigo=" + codigo;
    p += "&orcamento=" + codigoAtual;
    p += "&tipo=" + Selector.$('tiposcontatos').value;
    p += "&obs=" + Selector.$('obsfollow').value;
    p += "&checkretorno=" + Selector.$('checkretorno').checked;
    p += "&retorno=" + Selector.$('retorno').value;
    p += "&horaretorno=" + Selector.$('horaretorno').value;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o follow-up. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        Selector.$('retorno').style.visibility = "hidden";
        Selector.$('horaretorno').style.visibility = "hidden";
        dialogo.Close();
        getFollow();
    }
}
//FIM FOLLOW-UP

function AnexarImagem(tipoProduto) {

    tipoProdutoImagem = tipoProduto;

    var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
    var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
    var path = (tipoProdutoImagem == 'instaarts' ? '../imagens/instaarts/' : '../imagens/produtos/');
    var funcao = 'ArmazenarPath';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', '../padrao/', 'jpeg, jpg, png, bmp, pdf');
}

function ArmazenarPath(path) {

    /*ExcluirImagem();

    var vetor = path.split("/");
    var extensao = vetor[vetor.length - 1].split(".");
    var arquivo = vetor[vetor.length - 1];

    dialog.Close();

    Selector.$('o_imagem').setAttribute('name', arquivo);
    Selector.$('o_imagem').setAttribute('src', (tipoProdutoImagem == 'instaarts' ? '../imagens/instaarts/mini_' : '../imagens/produtos/mini_') + arquivo + '');

    GerarMiniaturaImagem();*/

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
    Selector.$('o_imagem').setAttribute('title', '../imagens/' + pasta + '/' + arquivo + '');

    if(extensao == 'zip' || extensao == 'rar'){
        Selector.$('o_imagem').setAttribute('src', '../imagens/zip.png');
        Selector.$('o_imagem').style.cursor = 'pointer';
        Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + '../imagens/' + pasta + '/' + arquivo + '' + "');");
    }else if(extensao == 'pdf'){
        Selector.$('o_imagem').setAttribute('src', '../imagens/pdf.png');
        Selector.$('o_imagem').style.cursor = 'pointer';
        Selector.$('o_imagem').setAttribute('onclick', "window.open('" + "../imagens/" + pasta + "/" + arquivo + "" + "')");
    }else{
        Selector.$('o_imagem').setAttribute('src', '../imagens/' + pasta + '/' + arquivo + '');
        GerarMiniaturaImagem();
    }
}

function ExcluirImagem() {

    if (Selector.$('o_imagem').getAttribute('name').trim() == '')
        return;

    var file = Selector.$('o_imagem').getAttribute('name').split(".");
    file = file[file.length - 1];

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=ExcluirImagem';
    p += '&imagem=' + file;
    p += '&tipoProdutoImagem=' + tipoProdutoImagem;
    ajax.Request(p);
}

function GerarMiniaturaImagem() {

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=GerarMiniaturaImagem';
    p += '&imagem=' + Selector.$('o_imagem').getAttribute('name');
    p += '&tipoProdutoImagem=' + tipoProdutoImagem;

    ajax.Request(p);

    var vetor = Selector.$('o_imagem').getAttribute('name').split(".");
    var extensao = vetor[vetor.length - 1];

    if (extensao !== 'jpg' && extensao !== 'jpeg') {

        Selector.$('o_imagem').setAttribute('name', vetor[0] + '.jpg');
        Selector.$('o_imagem').setAttribute('src', (tipoProdutoImagem == 'instaarts' ? '../imagens/instaarts/mini_' : '../imagens/produtos/mini_') + vetor[0] + '.jpg');
    }
}

function GerarPdfOrcamento() {

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=GerarPdfOrcamento';
    p += '&idOrcamento=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgPdfOrcamento').setAttribute('src', '../imagens/relatorio.png');

        if (ajax.getResponseText() != '') {
            window.open(ajax.getResponseText());
        }
    }

    Selector.$('imgPdfOrcamento').setAttribute('src', '../imagens/grid_carregando.gif');
    ajax.Request(p);
}

function EnviarPdfOrcamentoEmail() {

    if (Selector.$('email').value.trim() == '' || Selector.$('email').value.trim() == 'não possui') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este cliente não possui e-mail cadastrado, cadastre um e-mail para enviar o orçamento.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=EnviarPdfOrcamentoEmail';
    p += '&idOrcamento=' + codigoAtual;
    p += '&cliente=' + Selector.$('contato').value;
    p += '&email=' + Selector.$('email').value;
    p += '&dataValidade=' + Selector.$('validade').getAttribute('name');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgOrcamentoEmail').setAttribute('src', '../imagens/email2.png');

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o orçamento por email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('imgOrcamentoEmail').setAttribute('src', '../imagens/grid_carregando.gif');
    ajax.Request(p);
}

function DuplicarObra(linha){

    var divEditarDuplicar = DOM.newElement('div');

    var editar = DOM.newElement('img');
    editar.setAttribute('src', '../imagens/modificar.png');
    editar.setAttribute('title', 'Editar');
    editar.setAttribute('style', 'width:15px; display:inline-block');
    editar.setAttribute('class', 'efeito-opacidade-75-04');
    editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

    var duplicar = DOM.newElement('img');
    duplicar.setAttribute('src', '../imagens/duplicate.png');
    duplicar.setAttribute('title', 'Duplicar Obra');
    duplicar.setAttribute('style', 'height:14px; display:inline-block; margin-left:10px;');
    duplicar.setAttribute('class', 'efeito-opacidade-75-04');
    duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

    divEditarDuplicar.appendChild(editar);
    divEditarDuplicar.appendChild(duplicar);

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', '../imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir');
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('style', 'width:15px;');
    excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

    gridObras.addRow([
        DOM.newText(gridObras.getCellText(linha, 0)),
        DOM.newText(gridObras.getCellText(linha, 1)),
        DOM.newText(gridObras.getCellText(linha, 2)),
        DOM.newText(gridObras.getCellText(linha, 3)),
        DOM.newText(gridObras.getCellText(linha, 4)),
        DOM.newText(gridObras.getCellText(linha, 5)),
        DOM.newText(gridObras.getCellText(linha, 6)),
        DOM.newText(gridObras.getCellText(linha, 7)),
        divEditarDuplicar,
        excluir,
        DOM.newText(gridObras.getCellText(linha, 10)),
        DOM.newText(gridObras.getCellText(linha, 11)),
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
        DOM.newText(gridObras.getCellText(linha, 28))
    ]);

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
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);

    gridObras.setRowData(gridObras.getRowCount() - 1, 0);
    gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;width:40px');
    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
    gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:right;');
    gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:50px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:20px');

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

function cliente_onblur() {

    if (Selector.$('contato').value.trim() == '') {
        LoadDadosCliente();
        getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);

        if (Selector.$('enderecos').length == 2) {
            Selector.$('tipoTransporte').focus();
        }
    }
}