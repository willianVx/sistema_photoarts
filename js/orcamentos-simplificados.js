checkSessao();
CheckPermissao(38, false, '', true);

var codigoAtual = 0;
var codigoVersaoAtual = 0;
var mesOrcamentoAtual = 0;
var anoOrcamentoAtual = 0;
var codOrcamentoAtual = 0;
var valorTotalOrcamentoAtual = 0;
var gerarNovaVersao = false;
var perguntaNovaVersao = false;
var tipoProdutoImagem = '';
var arrayTamanhos = new Array();
var arrayIdTamanhos = new Array();
//var arrayIdTamanhosOld = new Array();
var arraySelecionados = new Array();
var selecionados = new Array();

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Orçamentos Simplificados</div>";
    carregarmenu();
    getDadosUsuario();
    getStatusOrcamento(Selector.$('statusBusca'), "Filtre por status", true);
    getLojas(Selector.$('statusLoja'), 'Selecione uma loja', false);

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    Mask.setData(Selector.$('dataCadastro'));
    Mask.setData(Selector.$('dataValidade'));

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
        DOM.newText(''),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridOrcamentos.table);

    if (!VerificarAdmin()) {
        gridOrcamentos.hiddenCol(9);
    }

    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('cellpadding', '4');
    gridObras.table.setAttribute('cellspacing', '0');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
        DOM.newText(''),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Nome'),
        DOM.newText('Acabamento'),
        DOM.newText('Tamanhos'),
        DOM.newText('idsTamanhos'),
        DOM.newText('alturas'),
        DOM.newText('larguras'),
        DOM.newText('valores'),
        DOM.newText('selecionados'),
        DOM.newText('idOrcamentoComp'),
        DOM.newText(''),
        DOM.newText('idArtista'),
        DOM.newText('idAcabamento')
    ]);

    gridObras.hiddenCol(6);
    gridObras.hiddenCol(7);
    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);

    Selector.$('divObras').appendChild(gridObras.table);

    MostrarOrcamentos();

    var c = Window.getParameter('idOrcamento');
    Select.AddItem(Selector.$('enderecos'), 'Selecione um cliente para carregar os endereços', 0);
    Select.AddItem(Selector.$('acabamento'), 'Selecione um tipo', 0);
    Select.AddItem(Selector.$('artista'), 'Selecione um tipo', 0);

    if (c == null || c == '') {

        getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", true);
        getLojas(Selector.$('loja'), 'Selecione uma loja', true);
        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", true);

        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
        Selector.$('loja').setAttribute('onclick', 'CarregaMarchands(true)');

        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", true);
        getTiposProdutos(Selector.$('tipoProduto'), 'Selecione um tipo', true, false);
        getArtistas(Selector.$('artista'), 'Selecione um artista', true);

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
        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", false);

        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
        Selector.$('loja').setAttribute('onclick', 'CarregaMarchands(true)');

        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", false);
        getTiposProdutos(Selector.$('tipoProduto'), 'Selecione um tipo', false, false);
        getArtistas(Selector.$('artista'), 'Selecione um artista', false);

        //corrige erros de layout 
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

        Mostra(c, true);
    }
};

window.onresize = function () {
    if (Selector.$('divRel').clientHeight != 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
    else {
        Selector.$('divCadastro2').style.height = (document.documentElement.clientHeight - 160) + "px";
        Selector.$('div0').style.height = (document.documentElement.clientHeight - 205) + "px";
        Selector.$('divObras').style.height = (document.documentElement.clientHeight - 420) + "px";
    }
};

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('divDatas').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('statusLoja').style.display = 'inline-block';
        Selector.$('divTodos').style.display = 'none';
        Selector.$('divQtdRegistros').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

        Selector.$('btPesquisarCad').style.display = 'inline-block';
    } else {
        Selector.$('divContainer').style.maxWidth = '1350px';
        Selector.$('divCadastro2').setAttribute('style', 'height:585px; width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
        Selector.$('divDatas').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
        Selector.$('statusvendedores').style.display = 'none';
        Selector.$('statusLoja').style.display = 'none';
        Selector.$('divTodos').style.display = 'none';
        Selector.$('divQtdRegistros').style.display = 'none';
        Selector.$('divCadastro2').style.height = (document.documentElement.clientHeight - 160) + "px";
        Selector.$('div0').style.height = (document.documentElement.clientHeight - 205) + "px";
        Selector.$('divObras').style.height = (document.documentElement.clientHeight - 420) + "px";

        Selector.$('btPesquisarCad').style.display = 'none';
    }
}

function MostrarOrcamentos() {

    gridOrcamentos.clearRows();

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
    var p = 'action=MostrarOrcamentos';
    p += '&busca=' + Selector.$('busca').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&loja=' + Selector.$('statusLoja').value;
    p += '&vendedor=' + Selector.$('statusvendedores').value;
    p += '&limitar=' + (Selector.$('mostrarTodosRegistros').checked ? 0 : 1);

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var ver;
        var obras;
        var cor;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Orçamento');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idOrcamentoSimplificado + ', true)');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir Orçamento');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirOrcamentoAux(' + gridOrcamentos.getRowCount() + ')');

            gridOrcamentos.addRow([
                DOM.newText(json[i].numeroOrcamento),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].marchand),
                DOM.newText(json[i].descricaoStatus),
                ver,
                excluir
            ]);

            gridOrcamentos.setRowData(gridOrcamentos.getRowCount() - 1, json[i].idOrcamentoSimplificado);
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; width:200px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 3).setAttribute('style', 'text-align:left; max-width:380px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; width:90px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 6).setAttribute('style', 'text-align:left; width:120px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:30px;');

            if (cor) {
                cor = false;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#FFF");
            }
        }

        if (!VerificarAdmin()) {
            gridOrcamentos.hiddenCol(9);
        }

        Selector.$('lblRegistros').innerHTML = (Selector.$('mostrarTodosRegistros').checked ? (json.length == 1 ? json.length + ' registro' : json.length + ' registros') : '20 últimos registros');
    }

    ajax.Request(p);
}

function ExcluirOrcamentoAux(linha) {

    if (!CheckPermissao(41, true, 'Você não possui permissão para excluir um orçamento', false)) {
        return;
    }

    mensagemExcluirOrcamento = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este orçamento?", "OK", "ExcluirOrcamento(" + linha + ");", true, "");
    mensagemExcluirOrcamento.Show();
}

function ExcluirOrcamento(linha) {

    mensagemExcluirOrcamento.Close();

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', false);
    var p = 'action=ExcluirOrcamento';
    p += '&idOrcamento=' + gridOrcamentos.getRowData(linha);
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro!", "Erro ao excluir o orçamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        gridOrcamentos.deleteRow(linha);
    }
}

function Novo(ajustar) {

    if (codigoAtual <= 0) {
        if (!CheckPermissao(39, true, 'Você não possui permissão para cadastrar uma nova proposta', false)) {
            return;
        }
    }

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('dataCadastro').value = Date.GetDate(false);
    Selector.$('situacao').value = 'Novo orçamento';
    var data = new Date();
    Selector.$('dataValidade').value = Date.FormatDDMMYYYY(Date.AddDate('d', data, 30), false);
    Selector.$('loja').focus();
    Selector.$('botNovo').setAttribute('src', 'imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', 'imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');
}

function Cancelar() {

    AjustarDivs();
    Limpar();
    Selector.$('botNovo').setAttribute('src', 'imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
    Selector.$('botSair').setAttribute('src', 'imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');
    
    //MostrarOrcamentos();
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
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

    /*for (var i = 0; i <= 0; i++) {
     Selector.$('aba' + i).setAttribute('class', 'divabas2');
     Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid;  overflow:hidden');
     }*/

    Selector.$('aba0').setAttribute('class', 'divabas');//JAIRO MEXER AQUI
    //Selector.$('div0').setAttribute('style', 'margin-top:0px; background:#FFF;  overflow:hidden');
}

function Limpar() {

    codigoAtual = 0;

    Selector.$('codProposta').innerHTML = '- - -';
    Selector.$('dataCadastro').value = "";
    Selector.$('dataValidade').value = "";
    Selector.$('loja').selectedIndex = 0;
    Selector.$('cliente').selectedIndex = 0;
    Selector.$('enderecos').selectedIndex = 0;
    //Selector.$('situacao').value = "";
    Selector.$('vendedor').selectedIndex = 0;
    //Selector.$('email').value = "";
    Selector.$('tipoTransporte').selectedIndex = 0;
    Selector.$('btCalcularFrete').style.display = 'none';
    Selector.$('tipoProduto').selectedIndex = 0;
    Selector.$('acabamento').selectedIndex = 0;
    Selector.$('artista').selectedIndex = 0;
    gridObras.clearRows();

    Selector.$('obs').value = "";

    Selector.$('tipoProduto').disabled = false;
    Selector.$('acabamento').disabled = false;
    Selector.$('artista').disabled = false;
}

function VerificaCampos() {

    var data_cadastro = Selector.$('dataCadastro');
    if (data_cadastro.value == '') {
        MostrarMsg("Por favor, preencha a data de cadastro", 'dataCadastro');
        SelecionaAbas(0);
        return false;
    }

    var data_validade = Selector.$('dataValidade');
    if (data_validade.value == '') {
        MostrarMsg("Por favor, preencha a data de validade", 'dataValidade');
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

    if (gridObras.getRowCount() <= 0) {
        MostrarMsg("Por favor, adicione obras no orçamento", 'tipoProduto');
        return;
    }

    return true;
}

function Gravar() {

    if (!CheckPermissao(39, true, 'Você não possui permissão para editar uma proposta', false)) {
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    if (!checkLogarNovamente()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&idTipoProduto=' + Selector.$('tipoProduto').value;
    //p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&dataValidade=' + Selector.$('dataValidade').value;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&idClienteEndereco=' + Selector.$('enderecos').value;
    p += '&idVendedor=' + Selector.$('vendedor').value;
    p += '&idTipoTransporte=' + Selector.$('tipoTransporte').value;
    p += '&idAcabamento=' + Selector.$('acabamento').value;
    p += '&idArtista=' + Selector.$('artista').value;
    p += '&obs=' + Selector.$('obs').value;

    //ARRAY COM OBRAS
    p += '&idOrcamentoSimplificadoComp=' + gridObras.getContentSelectObjectId(11);
    p += '&imagem=' + gridObras.getContentSelectObjectNameRows(1);
    p += '&idObra=' + gridObras.getContentSelectObjectRows(0);
    p += '&idTamanho=' + gridObras.getContentSelectObjectId(6);
    p += '&altura=' + gridObras.getContentSelectObjectId(7);
    p += '&largura=' + gridObras.getContentSelectObjectId(8);
    p += '&valor=' + gridObras.getContentSelectObjectId(9);
    p += '&selecionados=' + gridObras.getContentSelectObjectId(10);

    p += '&idsArtistas=' + gridObras.getContentSelectRows(13);
    p += '&idsAcabamentos=' + gridObras.getContentSelectRows(14);

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        MostrarMsg('Problemas ao gravar o orçamento. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } 
    else {
        //alert(ajax.getResponseText())
        var json = JSON.parse(ajax.getResponseText() );

        if (json.status == 'OK') {
            Cancelar();
            MostrarOrcamentos();
            codigoAtual = json.idOrcamentoSimplificado;
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

    if (Codigo == '' || parseInt(Codigo) == 0) {
        return;
    }

    codigoAtual = Codigo;

    Novo(ajustar);
    Limpar();

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Orçamento não localizado', 'codigo');
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    codigoAtual = json.idOrcamento;

    if (json.idVenda <= 0) {
        Selector.$('botGerarPedido').style.display = 'inline-block';
    } else {
        Selector.$('botGerarPedido').style.display = 'none';
    }

    Selector.$('botGerarPdfOrcamento').style.display = 'inline-block';
    Selector.$('botEnviarOrcamentoEmail').style.display = 'inline-block';

    //Selector.$('botCancelarOrcamento').setAttribute('onclick', 'CancelarOrcamentoAux(' + json.idOrcamento + ');');
    Selector.$('botGerarPedido').setAttribute('onclick', 'GerarPedidoAux(' + json.idOrcamento + ');');
    //Selector.$('botImprimirOrcamento').setAttribute('onclick', 'ImprimirOrcamento(' + json.idOrcamento + ');');
    Selector.$('botGerarPdfOrcamento').setAttribute('onclick', 'GerarPdfOrcamento();');
    Selector.$('botEnviarOrcamentoEmail').setAttribute('onclick', 'EnviarPdfOrcamentoEmail();');

    Selector.$('codProposta').innerHTML = json.proposta;
    Selector.$('dataCadastro').value = json.dataCadastro;
    Selector.$('dataValidade').value = json.dataValidade;
    Select.Show(Selector.$('loja'), json.idLoja);
    Select.Show(Selector.$('cliente'), json.idCliente);
    getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
    
    Select.Show(Selector.$('enderecos'), json.idClienteEndereco);
    
    Selector.$('cliente').name = json.email;
    CarregaMarchands(false);
    Select.Show(Selector.$('vendedor'), json.idVendedor);
    Select.Show(Selector.$('tipoTransporte'), json.idTransporteTipo);
    Selector.$('obs').value = json.obs;
    Select.Show(Selector.$('tipoProduto'), json.idTipoProduto);
    VerificarAcabamento();
    Select.Show(Selector.$('acabamento'), json.idAcabamento);
    Select.Show(Selector.$('artista'), json.idArtista);

    //Selector.$('situacao').setAttribute('name', json.idSituacao);
    Selector.$('situacao').value = json.situacao;

    MostrarObrasSalvas();

    Selector.$('tipoProduto').disabled = true;
    
    if (json.idVenda > 0) {
        Selector.$('acabamento').disabled = true;
        Selector.$('artista').disabled = true;
        Selector.$('escolherTamanho').style.display = 'none';
        Selector.$('adicionarObra').style.display = 'none';
    }

    if (Selector.$('tipoProduto') == '1') {
        gridObras.hiddenCol(10);
    }

    /*if(!CheckPermissao(40, false, '', false)){
     Selector.$('divValores').style.display = 'none';
     gridObras.hiddenCol(6);
     }*/
}

function GerarPedidoAux(idOrcamento) {

    if (!CheckPermissao(42, true, 'Você não possui permissão para gerar pedido através do orçamento', false)) {
        return;
    }

    if (idOrcamento <= 0)
        return;

    /*if (Selector.$('situacao').name.toString() == '4') {
     MostrarMsg('Não é possível gerar pedido, o orçamento encontra-se cancelado', '');
     return;
     }*/

    /*if (Selector.$('situacao').name.toString() == '3') {
     var mensagem = new DialogoMensagens("prompt", 195, 350, 150, "2", "Atenção!", 'O orçamento já virou pedido.<br /><br />' + Selector.$('situacao').value + '<br /><br /><a href="pedidos.html?idOrcamento=' + idOrcamento + '&source=abrir">Abrir Pedido</a>', "OK", "", false, '');
     mensagem.Show();
     return;
     }*/

    mensagemGerarPedido = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja gerar venda a partir do orçamento nº " + Selector.$('codProposta').innerHTML + "?", "OK", "GerarPedido(" + idOrcamento + ");", true, "");
    mensagemGerarPedido.Show();
}

function GerarPedido(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    mensagemGerarPedido.Close();

    window.location = 'pedidos.html?idOrcamentoSimplificado=' + idOrcamento + '&source=gerar';
}

function LoadDadosCliente() {

    var cmb = Selector.$('cliente');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '';
        return;
    }

    cmb.name = '';

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = 'action=LoadDadosCliente';
    p += '&idCliente=' + cmb.value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == '-1') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        cmb.name = json.email;
    };

    ajax.Request(p);
}

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

function mostraRetorno() {

    if (Selector.$('checkretorno').checked) {

        Selector.$('divretorno').style.width = "270px";

    } else {
        Selector.$('divretorno').style.width = "0px";
    }
}

function AnexarImagem() {

    if (arrayTamanhos.length <= 0 && arrayIdTamanhos.length <= 0) {
        MostrarMsg("Por favor, escolha os tamanhos", '');
        return;
    }

    var pasta = "";
    if (Selector.$('tipoProduto').value == '1') {
        pasta = 'obras';
    } else {
        pasta = 'instaarts';
    }

    var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
    var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
    var path = '../imagens/' + pasta + '/';
    var funcao = 'ArmazenarPath';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp');
}

function ArmazenarPath(path) {

    var pasta = "";
    if (Selector.$('tipoProduto').value == '1') {
        pasta = 'obras';
    } else {
        pasta = 'instaarts';
    }

    GerarMiniaturaImagem(path);

    var vetor = path.split("/");
    var extensao = vetor[vetor.length - 1].split(".")[1];
    var arquivo = vetor[vetor.length - 1];

    var checkboxObra = DOM.newElement('checkbox', '0');

    var imgObra = DOM.newElement('img');
    imgObra.setAttribute('name', arquivo);
    imgObra.setAttribute('src', 'imagens/' + pasta + '/' + arquivo + '');
    imgObra.setAttribute('style', 'width:120px; height:auto;');

    var divTamanhos = DOM.newElement('div');

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir tamanho');
    excluir.setAttribute('style', 'cursor:pointer');
    excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + gridObras.getRowCount() + ')');

    gridObras.addRow([
        checkboxObra,
        imgObra,
        DOM.newText('INSTAARTS'),
        DOM.newText('INSTAARTS'),
        DOM.newText(Select.GetText(Selector.$('acabamento'))),
        divTamanhos,
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        excluir,
        DOM.newText(Selector.$('artista').value),
        DOM.newText(Selector.$('acabamento').value)
    ]);

    gridObras.hiddenCol(6);
    gridObras.hiddenCol(7);
    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);

    gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');

    gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');

    if (arrayTamanhos.length > 0 && arrayIdTamanhos.length > 0) {
        var valor;
        for (var j = 0; j < arrayTamanhos.length; j++) {
            valor = 0;
            valor = CalcularValorTamanhoInstaArts(gridObras.getCellText(gridObras.getRowCount() - 1, 14), arrayIdTamanhos[j], arrayTamanhos[j].split('(')[1].split('x')[0], arrayTamanhos[j].split(')')[0].split('x')[1]);
            
            gridObras.getCellObject(gridObras.getRowCount() - 1, 5).innerHTML += '<input type="checkbox" id="' + arrayIdTamanhos[j] + (gridObras.getRowCount() - 1) + j + '" onclick="InserirSelecionado(' + (gridObras.getRowCount() - 1) + ')"/>' + 
                                                                                 '<label for="' + arrayIdTamanhos[j] + (gridObras.getRowCount() - 1) + j + '">' + arrayTamanhos[j] + ' - R$ ' + valor + '</label>' + 
                                                                                 '<br>';                                                                        
            
            gridObras.getCellObject(gridObras.getRowCount() - 1, 6).id += arrayIdTamanhos[j] + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 7).id += Number.ValorE(arrayTamanhos[j].split('(')[1].split('x')[0]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 8).id += Number.ValorE(arrayTamanhos[j].split(')')[0].split('x')[1]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            
            gridObras.getCellObject(gridObras.getRowCount() - 1, 9).id += Number.ValorE(valor) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            //gridObras.getCellObject(gridObras.getRowCount() - 1, 9).id += Number.ValorE(arrayTamanhos[j].split('R$')[1].trim()) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            
            gridObras.getCellObject(gridObras.getRowCount() - 1, 10).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 11).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
        }
    }

    pintaLinhaGrid(gridObras);
    dialog.Close();
}

function GerarMiniaturaImagem(path) {

    var pasta = "";
    if (Selector.$('tipoProduto').value == '1') {
        pasta = 'obras';
    } else {
        pasta = 'instaarts';
    }

    var vetor = path.split("/");
    var arquivo = vetor[vetor.length - 1];

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=GerarMiniaturaImagem';
    p += '&imagem=' + arquivo;
    p += '&pasta=' + pasta;

    ajax.Request(p);
}

function GerarPdfOrcamento() {

    if (!CheckPermissao(45, true, 'Você não possui permissão para gerar o pdf do orçamento', false)) {
        return;
    }

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
    var p = 'action=GerarPdfOrcamento';
    p += '&idOrcamento=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgPdfOrcamento').setAttribute('src', 'imagens/relatorio.png');

        if (ajax.getResponseText() != '') {
            window.open(ajax.getResponseText());
        }
    }

    Selector.$('imgPdfOrcamento').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function EnviarPdfOrcamentoEmail() {

    if (!CheckPermissao(46, true, 'Você não possui permissão para enviar o pdf do orçamento por email', false)) {
        return;
    }

    if (Selector.$('cliente').name.trim() == '' || Selector.$('cliente').name.trim() == 'não possui') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este cliente não possui e-mail cadastrado, cadastre um e-mail para enviar o orçamento.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
    var p = 'action=EnviarPdfOrcamentoEmail';
    p += '&idOrcamento=' + codigoAtual;
    p += '&cliente=' + Select.GetText(Selector.$('cliente'));
    p += '&email=' + Selector.$('cliente').name;
    p += '&dataValidade=' + Selector.$('dataValidade').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgOrcamentoEmail').setAttribute('src', 'imagens/email2.png');

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

    Selector.$('imgOrcamentoEmail').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function VerificarAcabamento() {

    if (Selector.$('tipoProduto').value == '0') {
        Select.Clear(Selector.$('acabamento'));
        Select.AddItem(Selector.$('acabamento'), 'Selecione um tipo de produto', 0);
        return;
    } else {
        getAcabamentos(Selector.$('acabamento'), 'Selecione um acabamento', false, (Selector.$('tipoProduto').value == '1' ? 'p' : 'i'));

        if (Selector.$('tipoProduto').value == '2') {
            gridObras.clearRows();
            Selector.$('escolherTamanho').style.display = 'inline-block';
            Selector.$('adicionarObra').style.display = 'inline-block';
            Selector.$('divArtista').style.display = 'none';
        } else {
            Selector.$('escolherTamanho').style.display = 'none';
            Selector.$('adicionarObra').style.display = 'none';
            Selector.$('divArtista').style.display = 'inline-block';
        }

        MostrarObras();
    }
}

function LimparGridObras() {
    var total = gridObras.getRowCount();

    for (var i = gridObras.getRowCount() - 1; i >= 0; i--) {

        if (!gridObras.getCellObject(i, 0).checked) {
            gridObras.deleteRow(i);
        }
    }
}

function MostrarObras() {

    if (Selector.$('tipoProduto').value == '1' || codigoAtual > 0) {

        //Selector.$('divArtista').style.display = 'inline-block';

        if (Selector.$('acabamento').selectedIndex <= 0) {
            LimparGridObras();
            Selector.$('msgLoad').innerHTML = "Selecione um acabamento";
            return;
        }

        if (Selector.$('tipoProduto').value == '1') {
            if (Selector.$('artista').selectedIndex <= 0) {
                LimparGridObras();
                Selector.$('msgLoad').innerHTML = "Selecione um artista";
                return;
            }
        }

        var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
        var p = 'action=MostrarObras';
        p += '&idOrcamentoSimplificado=' + codigoAtual;
        p += '&idAcabamento=' + Selector.$('acabamento').value;
        p += '&idArtista=' + Selector.$('artista').value;
        p += '&salvas=0';

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            LimparGridObras();

            if (ajax.getResponseText() == '0') {
                Selector.$('divObras').innerHTML = '';
                Selector.$('msgLoad').innerHTML = "Nenhuma obra encontrada";
                return;
            }

            var json = JSON.parse(ajax.getResponseText() );

            Selector.$('msgLoad').innerHTML = json.length + " obra(s) encontrada(s)";

            for (var i = 0; i < json.length; i++) {

                var checkboxObra = DOM.newElement('checkbox', json[i].idArtistaObra);

                var imgObra = DOM.newElement('img');
                imgObra.setAttribute('src', 'imagens/' + (Selector.$('tipoProduto').value == '1' ? 'obras' : 'instaarts') + '/' + json[i].imagem);
                imgObra.setAttribute('style', 'width:120px; height:auto;');
                imgObra.setAttribute('name', json[i].imagem);

                var divTamanhos = DOM.newElement('div', i);

                var excluir = DOM.newElement('img');
                excluir.setAttribute('src', 'imagens/lixo.png');
                excluir.setAttribute('title', 'Excluir tamanho');
                excluir.setAttribute('style', 'cursor:pointer');
                excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + i + ')');

                gridObras.addRow([
                    checkboxObra,
                    imgObra,
                    DOM.newText(Select.GetText(Selector.$('artista'))),
                    DOM.newText(json[i].nomeObra),
                    DOM.newText(Select.GetText(Selector.$('acabamento'))),
                    divTamanhos,
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    excluir,
                    DOM.newText(Selector.$('artista').value),
                    DOM.newText(Selector.$('acabamento').value)
                ]);

                gridObras.hiddenCol(6);
                gridObras.hiddenCol(7);
                gridObras.hiddenCol(8);
                gridObras.hiddenCol(9);
                gridObras.hiddenCol(10);
                gridObras.hiddenCol(11);
                gridObras.hiddenCol(12);
                gridObras.hiddenCol(13);
                gridObras.hiddenCol(14);

                gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
                gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
                gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');

                gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');

                if (json[i].tamanhos != '0') {

                    var jsonTamanhos = JSON.parse(json[i].tamanhos );
                    var lin = gridObras.getRowCount() - 1;

                    for (var j = 0; j < jsonTamanhos.length; j++) {

                        arraySelecionados.push(jsonTamanhos[j].selecionado);

                        //gridObras.setRowData(i, (codigoAtual <= 0 ? 0 : jsonTamanhos[j].idOrcamentoSimplificadoComp));
                        gridObras.getCellObject(lin, 5).innerHTML += '<input type="checkbox" ' + (jsonTamanhos[j].selecionado == '1' ? 'checked' : '') + ' onclick="InserirSelecionado(' + lin + ')" id="' + jsonTamanhos[j].idArtistaObraTamanho + '"/><label for="' + jsonTamanhos[j].idArtistaObraTamanho + '">' + jsonTamanhos[j].nomeTamanho + ' (' + jsonTamanhos[j].altura + 'x' + jsonTamanhos[j].largura + ')' + ' - R$' + jsonTamanhos[j].valor + '</label><br>';
                        gridObras.getCellObject(lin, 6).id += jsonTamanhos[j].idArtistaObraTamanho + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 7).id += Number.ValorE(jsonTamanhos[j].altura) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 8).id += Number.ValorE(jsonTamanhos[j].largura) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 9).id += Number.ValorE(jsonTamanhos[j].valor) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 10).id += jsonTamanhos[j].selecionado + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 11).id += jsonTamanhos[j].idOrcamentoSimplificadoComp + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    }
                }
            }

            if (Selector.$('tipoProduto').value == '1') {
                gridObras.hiddenCol(12);
            } else {
                gridObras.visibleCol(12);
            }

            pintaLinhaGrid(gridObras);

            for (var k = 0; k < gridObras.getRowCount(); k++) {

                if (gridObras.getCellObject(k, 10).id.indexOf('1') >= 0) {
                    gridObras.getCellObject(k, 0).checked = true;
                }

                if (!gridObras.getCellObject(k, 0).checked) {
                    gridObras.getRow(k).setAttribute('class', 'pintaFundoNovo');
                }
            }
        };

        Selector.$('msgLoad').innerHTML = "Aguarde, carregando obras...";
        ajax.Request(p);
    }
    else {

        Selector.$('divArtista').style.display = 'none';
        Selector.$('msgLoad').innerHTML = '';
    }
}

function MostrarObrasSalvas() {

    if (Selector.$('tipoProduto').value == '1' || codigoAtual > 0) {


        var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
        var p = 'action=MostrarObras';
        p += '&idOrcamentoSimplificado=' + codigoAtual;
        p += '&idAcabamento=' + Selector.$('acabamento').value;
        p += '&idArtista=' + Selector.$('artista').value;
        p += '&salvas=1';

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            gridObras.clearRows();
            
            //alert(ajax.getResponseText())
            if (ajax.getResponseText() == '0') {
                Selector.$('divObras').innerHTML = '';
                Selector.$('msgLoad').innerHTML = "Nenhuma obra encontrada";
                return;
            }

            Selector.$('msgLoad').innerHTML = "";
            var json = JSON.parse(ajax.getResponseText() );

            for (var i = 0; i < json.length; i++) {

                var checkboxObra = DOM.newElement('checkbox', json[i].idArtistaObra);

                var imgObra = DOM.newElement('img');
                imgObra.setAttribute('src', 'imagens/' + (Selector.$('tipoProduto').value == '1' ? 'obras' : 'instaarts') + '/' + json[i].imagem);
                imgObra.setAttribute('style', 'width:120px; height:auto;');
                imgObra.setAttribute('name', json[i].imagem);

                var divTamanhos = DOM.newElement('div', i);

                var excluir = DOM.newElement('img');
                excluir.setAttribute('src', 'imagens/lixo.png');
                excluir.setAttribute('title', 'Excluir tamanho');
                excluir.setAttribute('style', 'cursor:pointer');
                excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + i + ')');

                gridObras.addRow([
                    checkboxObra,
                    imgObra,
                    DOM.newText(json[i].nomeArtista),
                    DOM.newText(json[i].nomeObra),
                    DOM.newText(json[i].nomeAcabamento),
                    divTamanhos,
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    excluir,
                    DOM.newText(json[i].idArtista),
                    DOM.newText(json[i].idAcabamento)
                ]);

                gridObras.hiddenCol(6);
                gridObras.hiddenCol(7);
                gridObras.hiddenCol(8);
                gridObras.hiddenCol(9);
                gridObras.hiddenCol(10);
                gridObras.hiddenCol(11);
                gridObras.hiddenCol(12);
                gridObras.hiddenCol(13);
                gridObras.hiddenCol(14);

                gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
                gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
                gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');

                gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');

                if (json[i].tamanhos != '0') {

                    var jsonTamanhos = JSON.parse(json[i].tamanhos );
                    var lin = gridObras.getRowCount() - 1;

                    for (var j = 0; j < jsonTamanhos.length; j++) {

                        arraySelecionados.push(jsonTamanhos[j].selecionado);

                        //gridObras.setRowData(i, (codigoAtual <= 0 ? 0 : jsonTamanhos[j].idOrcamentoSimplificadoComp));
                        gridObras.getCellObject(lin, 5).innerHTML += '<input type="checkbox" ' + (jsonTamanhos[j].selecionado == '1' ? 'checked' : '') + ' onclick="InserirSelecionado(' + lin + ')" id="' + jsonTamanhos[j].idArtistaObraTamanho + (i) + '' + (j) + '"/><label for="' + jsonTamanhos[j].idArtistaObraTamanho + (i) + '' + (j) + '">' + jsonTamanhos[j].nomeTamanho + ' (' + jsonTamanhos[j].altura + 'x' + jsonTamanhos[j].largura + ')' + ' - R$' + jsonTamanhos[j].valor + '</label><br>';
                        gridObras.getCellObject(lin, 6).id += jsonTamanhos[j].idArtistaObraTamanho + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 7).id += Number.ValorE(jsonTamanhos[j].altura) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 8).id += Number.ValorE(jsonTamanhos[j].largura) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 9).id += Number.ValorE(jsonTamanhos[j].valor) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 10).id += jsonTamanhos[j].selecionado + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 11).id += jsonTamanhos[j].idOrcamentoSimplificadoComp + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    }
                }
            }

            if (Selector.$('tipoProduto').value == '1') {
                gridObras.hiddenCol(12);
            } else {
                gridObras.visibleCol(12);
            }

            for (var k = 0; k < gridObras.getRowCount(); k++) {

                if (gridObras.getCellObject(k, 10).id.indexOf('1') >= 0) {
                    gridObras.getCellObject(k, 0).checked = true;
                }
            }

            pintaLinhaGrid(gridObras);
        };

        Selector.$('msgLoad').innerHTML = "Aguarde, carregando obras...";
        ajax.Request(p);
    }
    else {

        Selector.$('divArtista').style.display = 'none';
        Selector.$('msgLoad').innerHTML = '';
    }
}

function InserirSelecionado(linha) {

    var qtdSelecionados = 0;
    selecionados.length = 0;
    arraySelecionados.length = 0;
    for (var i = 0; i < gridObras.getCellObject(linha, 5).childNodes.length; i++) {

        if (gridObras.getCellObject(linha, 5).childNodes[i].nodeType == '1') {

            if (gridObras.getCellObject(linha, 5).childNodes[i].checked) {
                selecionados.push(1);
                arraySelecionados.push(1);
                qtdSelecionados++;
            } else if (gridObras.getCellObject(linha, 5).childNodes[i].checked == false) {
                selecionados.push(0);
                arraySelecionados.push(0);
            }
        }
    }

    gridObras.getCellObject(linha, 10).id = selecionados;

    if (qtdSelecionados <= 0) {
        gridObras.getCellObject(linha, 0).checked = false;
    } else {
        gridObras.getCellObject(linha, 0).checked = true;
    }
}

function PromptEscolherTamanhos() {

    if (Selector.$('acabamento').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um acabamento", 'acabamento');
        return;
    }

    if (!isElement('div', 'divPromptEscolherTamanhos')) {
        var div = DOM.newElement('div', 'divPromptEscolherTamanhos');
        document.body.appendChild(div);
    }

    var divPromptEscolherTamanhos = Selector.$('divPromptEscolherTamanhos');
    divPromptEscolherTamanhos.setAttribute('style', 'text-align:left;');
    divPromptEscolherTamanhos.setAttribute('align', 'left');
    divPromptEscolherTamanhos.innerHTML = '';

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
    elemento.setAttribute("style", 'width:260px; margin-left:4px');
    elemento.setAttribute('onchange', 'VerificarTamanho()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    var divAlturaLargura = DOM.newElement('div', 'divAlturaLargura');
    divAlturaLargura.setAttribute('style', 'width:310px; display:none; margin-left:10px;');

    lblAltura = DOM.newElement('label');
    lblAltura.innerHTML = 'Altura ';
    lblAltura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAltura.setAttribute('style', 'margin-left:0px');

    divAlturaLargura.appendChild(lblAltura);

    var altura = DOM.newElement('input', 'altura');
    altura.setAttribute('class', 'textbox_cinzafoco');
    altura.setAttribute('style', 'width:100px;');

    divAlturaLargura.appendChild(altura);

    lblLargura = DOM.newElement('label');
    lblLargura.innerHTML = 'Largura ';
    lblLargura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblLargura.setAttribute('style', 'margin-left:10px');

    divAlturaLargura.appendChild(lblLargura);

    var largura = DOM.newElement('input', 'largura');
    largura.setAttribute('class', 'textbox_cinzafoco');
    largura.setAttribute('style', 'width:100px; margin-left:5px');

    divAlturaLargura.appendChild(largura);
    divI.appendChild(divAlturaLargura);

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'float:right;');
    elemento.setAttribute('onclick', 'IncluirTamanho(true);');
    elemento.innerHTML = "Incluir";
    divI.appendChild(elemento);

    var divTamanhos = DOM.newElement('div', 'divTamanhos');
    divTamanhos.setAttribute('style', 'width:100%; height:250px; border:1px solid lightgray; overflow:auto;');
    divI.appendChild(divTamanhos);

    divPromptEscolherTamanhos.appendChild(divI);

    elemento = DOM.newElement('button');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'float:right;');
    elemento.setAttribute('onclick', 'ArmazenarTamanhos(true, true);');
    elemento.innerHTML = "OK";

    divPromptEscolherTamanhos.innerHTML += '<br>';
    divPromptEscolherTamanhos.appendChild(elemento);

    dialogoTamanhos = new caixaDialogo('divPromptEscolherTamanhos', 390, 445, 'padrao/', 130);
    dialogoTamanhos.Show();

    gridTamanhos = new Table('gridTamanhos');
    gridTamanhos.table.setAttribute('cellpadding', '4');
    gridTamanhos.table.setAttribute('cellspacing', '0');
    gridTamanhos.table.setAttribute('class', 'tabela_cinza_foco');

    gridTamanhos.addHeader([
        DOM.newText('Tamanho'),
        DOM.newText(''),
        DOM.newText('')
    ]);

    Selector.$('divTamanhos').appendChild(gridTamanhos.table);
    gridTamanhos.hiddenCol(2);

    gridTamanhos.clearRows();
    Selector.$('divPromptEscolherTamanhos').setAttribute('class', 'divbranca');
    Selector.$('divPromptEscolherTamanhos').style.overflow = 'hidden';
    getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);
    Mask.setMoeda(Selector.$('altura'));
    Mask.setMoeda(Selector.$('largura'));
    Selector.$('o_tamanhoI').focus();

    if (arrayTamanhos.length > 0 && arrayIdTamanhos.length > 0 && codigoAtual <= 0) {

        for (var i = 0; i < arrayTamanhos.length; i++) {

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir tamanho');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirTamanho(' + gridTamanhos.getRowCount() + ')');

            gridTamanhos.addRow([
                DOM.newText(arrayTamanhos[i]),
                excluir,
                DOM.newText(arrayIdTamanhos[i])
            ]);

            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:30px;');

            gridTamanhos.hiddenCol(2);
            pintaLinhaGrid(gridTamanhos);
        }
    } 
    else {

        for (var i = 0; i < gridObras.getRowCount(); i++) {

            var idsTamanhos = gridObras.getCellObject(i, 6).id.split(',');
            var alturas = gridObras.getCellObject(i, 7).id.split(',');
            var larguras = gridObras.getCellObject(i, 8).id.split(',');

            for (var j = 0; j < idsTamanhos.length; j++) {

                Selector.$('o_tamanhoI').value = idsTamanhos[j];

                if (Selector.$('o_tamanhoI').selectedIndex == 1) {
                    VerificarTamanho();
                    Selector.$('altura').value = Number.FormatMoeda(alturas[j]);
                    Selector.$('largura').value = Number.FormatMoeda(larguras[j]);
                }

                IncluirTamanho(false);
            }
        }

        Selector.$('o_tamanhoI').value = 0;
        Selector.$('divAlturaLargura').style.display = 'none';
        dialogoTamanhos.Realinhar(390, 445);
        ArmazenarTamanhos(false, false);
    }
}

function VerificarTamanho() {

    Selector.$('altura').value = '';
    Selector.$('largura').value = '';

    if (Selector.$('o_tamanhoI').selectedIndex == 1) {
        Selector.$('divAlturaLargura').style.display = 'inline-block';
        dialogoTamanhos.Realinhar(390, 760);
        Selector.$('altura').focus();
    } else {
        Selector.$('divAlturaLargura').style.display = 'none';
        dialogoTamanhos.Realinhar(390, 445);
    }
}

function IncluirTamanho(mensagem) {

    if (Selector.$('o_tamanhoI').selectedIndex == 1) {

        if (Selector.$('altura').value.trim() == ',' || Selector.$('altura').value.trim() == '') {
            MostrarMsg("Por favor, informe a altura", 'altura');
            return;
        }

        if (Selector.$('largura').value.trim() == ',' || Selector.$('largura').value.trim() == '') {
            MostrarMsg("Por favor, informe a largura", 'largura');
            return;
        }
    } 
    else {

        if (Selector.$('o_tamanhoI').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione um tamanho", 'o_tamanhoI');
            return;
        }
    }

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        if (Selector.$('o_tamanhoI').selectedIndex == 1) {

            if (gridTamanhos.getCellText(i, 0).trim() == 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ')') {
                if (mensagem) {
                    MostrarMsg("Este tamanho já foi adicionado", '');
                }
                return;
            }
        } else {

            if (gridTamanhos.getCellText(i, 0).split(' - ')[0] == Select.GetText(Selector.$('o_tamanhoI'))) {
                if (mensagem) {
                    MostrarMsg("Este tamanho já foi adicionado", '');
                }
                return;
            }
        }
    }

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir tamanho');
    excluir.setAttribute('style', 'cursor:pointer');
    excluir.setAttribute('onclick', 'ExcluirTamanho(' + gridTamanhos.getRowCount() + ')');

    gridTamanhos.addRow([
        //DOM.newText((Selector.$('o_tamanhoI').selectedIndex == 1 ? 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ') - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value) : Select.GetText(Selector.$('o_tamanhoI')) + ' - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value))),
        DOM.newText((Selector.$('o_tamanhoI').selectedIndex == 1 ? 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ') ' : Select.GetText(Selector.$('o_tamanhoI')))),
        excluir,
        DOM.newText(Selector.$('o_tamanhoI').value)
    ]);

    gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
    gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:30px;');

    gridTamanhos.hiddenCol(2);
    pintaLinhaGrid(gridTamanhos);

    Selector.$('altura').value = '';
    Selector.$('largura').value = '';
}

function ArmazenarTamanhos(fechar, incluir) {

    arrayTamanhos.length = 0;
    arrayIdTamanhos.length = 0;
    arraySelecionados.length = 0;

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        arrayTamanhos.push(gridTamanhos.getCellText(i, 0));
        arrayIdTamanhos.push(gridTamanhos.getCellText(i, 2));
    }

    if (fechar) {
        dialogoTamanhos.Close();
    }

    if (codigoAtual > 0 && Selector.$('tipoProduto').value == '2' && incluir) {

        for (var i = 0; i < gridObras.getRowCount(); i++) {

            gridObras.getCellObject(i, 5).innerHTML = '';
            gridObras.getCellObject(i, 6).id = '';
            gridObras.getCellObject(i, 7).id = '';
            gridObras.getCellObject(i, 8).id = '';
            gridObras.getCellObject(i, 9).id = '';
            var aux = gridObras.getCellObject(i, 10).id;
            gridObras.getCellObject(i, 10).id = '';           

            var valor;

            for (var j = 0; j < arrayTamanhos.length; j++) {
                valor = 0;
                valor = CalcularValorTamanhoInstaArts(gridObras.getCellText(i, 14), arrayIdTamanhos[j], arrayTamanhos[j].split('(')[1].split('x')[0], arrayTamanhos[j].split(')')[0].split('x')[1]);
                
                gridObras.getCellObject(i, 5).innerHTML += '<input type="checkbox" id="' + arrayIdTamanhos[j] + (i) + '' + (j) + '" onclick="InserirSelecionado(' + i + ')" ' + (aux.split(',')[j] == '1' ? 'checked' : '') + '/>' + 
                        '<label for="' + arrayIdTamanhos[j] + (i) + '' + (j) + '">' + arrayTamanhos[j] + ' - R$ ' + valor + '</label>' + 
                        '<br>';                
                
                gridObras.getCellObject(i, 6).id += arrayIdTamanhos[j] + ((j + 1) < arrayTamanhos.length ? ',' : '');
                gridObras.getCellObject(i, 7).id += Number.ValorE(arrayTamanhos[j].split('(')[1].split('x')[0]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
                gridObras.getCellObject(i, 8).id += Number.ValorE(arrayTamanhos[j].split(')')[0].split('x')[1]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
                //gridObras.getCellObject(i, 7).id += Number.ValorE(arrayTamanhos[j].split('R$')[1].trim()) + ((j + 1) < arrayTamanhos.length ? ',' : '');

                //DOM.newText((Selector.$('o_tamanhoI').selectedIndex == 1 ? 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ') - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value) : Select.GetText(Selector.$('o_tamanhoI')) + ' - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value))),
                                
                gridObras.getCellObject(i, 9).id += Number.ValorE(valor) + ((j + 1) < arrayTamanhos.length ? ',' : '');

                gridObras.getCellObject(i, 10).id += (Selector.$(arrayIdTamanhos[j] + (i) + '' + j).checked ? '1' : '0') + ((j + 1) < arrayTamanhos.length ? ',' : '');
                //gridObras.getCellObject(i, 9).id += '0' + ((j+1) < arrayTamanhos.length ? ',' : '');
            }
        }
    }
}

function ExcluirTamanho(linha) {

    gridTamanhos.deleteRow(linha);

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {
        gridTamanhos.getCellObject(i, 1).setAttribute('onclick', 'ExcluirTamanho(' + i + ')');
    }

    pintaLinhaGrid(gridTamanhos);
}

function CalcularValorTamanhoInstaArts(idAcabamento, idTamanho, altura, largura) {

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', false);
    var p = 'action=CalcularValorTamanhoInstaArts';
    p += '&idAcabamento=' + idAcabamento;
    p += '&idTamanho=' + idTamanho;
    p += '&altura=' + altura;
    p += '&largura=' + largura;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return '0,00';
    } else {

        return ajax.getResponseText();
    }
}

function ExcluirInstaartsAux(linha) {

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta imagem?", "OK", "ExcluirInstaarts(" + linha + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirInstaarts(linha) {

    gridObras.deleteRow(linha);

    for (var i = 0; i < gridObras.getRowCount(); i++) {
        gridObras.getCellObject(i, 10).setAttribute('onclick', 'ExcluirInstaartsAux(' + i + ')');
    }

    pintaLinhaGrid(gridObras);
    mensagemExcluirObra.Close();
}