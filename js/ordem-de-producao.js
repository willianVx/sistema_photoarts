checkSessao();
CheckPermissao(109, false, '', true);

var codigoAtual = 0;
var venda = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Ordem de Produção</div>";
    carregarmenu();
    getDadosUsuario();

    if (Window.getParameter('relatorio') == null || Window.getParameter('relatorio') == '') {
        Select.Show(Selector.$('statusBusca'), 1);
    }

    Mask.setData(Selector.$('dataCadastro'));
    gridOrdens = new Table('gridOrdens');
    gridOrdens.table.setAttribute('cellpadding', '4');
    gridOrdens.table.setAttribute('cellspacing', '0');
    gridOrdens.table.setAttribute('class', 'tabela_cinza_foco');

    gridOrdens.addHeader([
        DOM.newText('N° OP'),
        DOM.newText('Data'),
        DOM.newText('Pedido'),
        DOM.newText('Cliente'),
        DOM.newText('Galeria'),
        DOM.newText('Situação'),
        DOM.newText('Refeita'),
        DOM.newText('Itens'),
        DOM.newText('Editar'),
        DOM.newText('Cancelar'),
        DOM.newText('Finalizar')
    ]);

    Selector.$('divRel').appendChild(gridOrdens.table);

    Mask.setData(Selector.$('dataCadastro'));
    Mask.setData(Selector.$('previsao'));

    //CRIA TABELA DE OBRAS
    gridObras = new Table('gridItens');
    gridObras.table.setAttribute('cellpadding', '4');
    gridObras.table.setAttribute('cellspacing', '0');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtde'),
        DOM.newText('Etapa'),
        DOM.newText('Selo'),
        DOM.newText('Certificado'),
        DOM.newText('Editar'),
        DOM.newText('Excluir'),
        DOM.newText('altura'),
        DOM.newText('largura'),
        DOM.newText('idArtista'),
        DOM.newText('idObra'),
        DOM.newText('idTamanho'),
        DOM.newText('IdAcabamento'),
        DOM.newText('idGrupo'),
        DOM.newText('idMoldura'),
        DOM.newText('idProduto'),
        DOM.newText('obs'),
        DOM.newText('idTipoProduto')
    ]);

    Selector.$('divItens').appendChild(gridObras.table);

    gridObrasComp = new Table('gridObrasComp');
    gridObrasComp.table.setAttribute('cellpadding', '4');
    gridObrasComp.table.setAttribute('cellspacing', '0');
    gridObrasComp.table.setAttribute('class', 'tabela_cinza_foco');

    gridObrasComp.addHeader([
        DOM.newText(''),
        DOM.newText(''),
        DOM.newText('')
    ]);

    Selector.$('tabelaObras').appendChild(gridObrasComp.table);

    ocultaColunasObras();

    Mask.setOnlyNumbers(Selector.$('buscanumero'));
    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getEtapasOrdensProducao(Selector.$('statusEtapas'), "Selecione uma Etapa", false);
    Selector.$('de').value = SubtrairData(Selector.$('de').value, 3);

    getLojas(Selector.$('loja'), "Selecione uma loja", false);

    var c = Window.getParameter('idOrdem');

    if (c == null || c == '') {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'inline-block';
        Selector.$('ate').style.display = 'inline-block';
        Selector.$('buscanumero').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusEtapas').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
    else {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'inline-block';
        Selector.$('ate').style.display = 'inline-block';
        Selector.$('buscanumero').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusEtapas').style.display = 'inline-block';
        Selector.$('btPesq').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

        Mostra(c, true);
    }

    MostrarOrdens();
};

window.onresize = function () {
    if (Selector.$('divRel').clientHeight !== 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
};

function ocultaColunasObras() {
    for (var i = 13; i <= 23; i++) {
        gridObras.hiddenCol(i);
    }
}

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'inline-block';
        Selector.$('ate').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('buscanumero').style.display = 'inline-block';
        Selector.$('buscanumeropedido').style.display = 'inline-block';
        Selector.$('statusEtapas').style.display = 'inline-block';
        Selector.$('btPesq').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
        Selector.$('filtroRefeitas').style.display = 'inline-block';
        Selector.$('lblFiltroRefeitas').style.display = 'inline-block';
    } else {
        Selector.$('divContainer').style.maxWidth = '1160px';
        Selector.$('divCadastro2').setAttribute('style', 'height:530px;  width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'none';
        Selector.$('ate').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
        Selector.$('buscanumero').style.display = 'none';
        Selector.$('buscanumeropedido').style.display = 'none';
        Selector.$('statusEtapas').style.display = 'none';
        Selector.$('btPesq').style.display = 'none';
        Selector.$('filtroRefeitas').style.display = 'none';
        Selector.$('lblFiltroRefeitas').style.display = 'none';
    }
}

function MostrarOrdens() {    

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
    var p = 'action=MostrarOrdens';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&buscanumero=' + Selector.$('buscanumero').value;
    p += '&buscanumeropedido=' + Selector.$('buscanumeropedido').value;
    p += '&etapa=' + Selector.$('statusEtapas').value;
    p += '&refeitas=' + Selector.$('filtroRefeitas').checked;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        gridOrdens.clearRows();
        
        if (ajax.getResponseText() == '0') {
            return;
        }        

        var json = JSON.parse(ajax.getResponseText() || "[ ]");

        for (var i = 0; i < json.length; i++) {

            var itens = DOM.newElement('label');
            itens.setAttribute('onclick', 'visualizarItens(' + json[i].codigo + ')');
            itens.innerHTML = json[i].itens + (json[i].itens > 0 ? " <img src='imagens/menu.png' style='vertical-align:middle; cursor:pointer; width:30px;' />" : "");

            var editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/editar.png');
            editar.setAttribute('title', 'Editar Ordem de Compra');
            editar.setAttribute('style', 'cursor:pointer');
            editar.setAttribute('onclick', 'Mostra(' + json[i].codigo + ', true)');

            if (json[i].cancelada == '0' && json[i].finalizada == '0') {

                var cancelar = DOM.newElement('img');
                cancelar.setAttribute('src', 'imagens/fechar.png');
                cancelar.setAttribute('title', 'Cancelar ordem de compra');
                cancelar.setAttribute('style', 'cursor:pointer');
                cancelar.setAttribute('onclick', 'CancelarOrdem(' + json[i].codigo + ')');

                var finalizar = DOM.newElement('img');
                finalizar.setAttribute('src', 'imagens/finalizar.png');
                finalizar.setAttribute('title', 'Finalizar ordem de Produção');
                finalizar.setAttribute('style', 'cursor:pointer');
                finalizar.setAttribute('onclick', 'Finalizar(' + json[i].codigo + ')');

            } else {

                var cancelar = DOM.newElement('label');
                var finalizar = DOM.newElement('label');
            }

            gridOrdens.addRow([
                DOM.newText(json[i].id),
                DOM.newText(json[i].data),
                DOM.newText(json[i].venda),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].status),
                DOM.newText(json[i].refeita),
                itens,
                editar,
                cancelar,
                finalizar
            ]);

            gridOrdens.setRowData(gridOrdens.getRowCount() - 1, json[i].idOrcamento);
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:70px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:70px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:50px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:50px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:40px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:40px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:50px;');
            pintaLinhaGrid(gridOrdens);
        }
    }

    ajax.Request(p);
}

function Novo(ajustar) {

    Selector.$('controles').style.display = "none";
    //checkPermissao(12, true);
    if(!CheckPermissao(160, true, 'Você não possui permissão para Visualizar detalhes sobre o  colecionador', false)){
        return;
    }
    codigoAtual = 0;

    if (ajustar)
        AjustarDivs();


    SelecionaAbas(0);
    Limpar();
    Selector.$('dataCadastro').value = Date.GetDate(false);
    Selector.$('situacao').value = 'Nova Ordem de Produção';
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
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
        Cancelar();
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

function botDel_onClick() {

    if (codigoAtual <= 0) {
        MostrarMsg('Nenhuma ordem de compra ativa', '');
        return;
    }

    //FAZER CANCELAMENTO DE PROPOSTA
}

function Limpar() {

    codigoAtual = 0;
    Selector.$('status').innerHTML = '';
    Selector.$('codOrdem').innerHTML = '- - -';
    Selector.$('dataCadastro').value = "";
    Selector.$('previsao').value = "";
    Selector.$('situacao').value = "";
    Selector.$('qtdObras').value = "";
    Selector.$('obs').value = "";
    Selector.$('refeita').checked = false;
    Selector.$('pedido').value = "";
    Selector.$('loja').selectedIndex = 0;
    Selector.$('cliente').value = '';
    gridObras.clearRows();
}

function VerificaCampos() {

    if (Selector.$('situacao').value == "Ordem Cancelada" || Selector.$('situacao').value == "Ordem Finalizada") {
        MostrarMsg("Não é possivel editar " + Selector.$('situacao').value, 'dataCadastro');
        return;
    }

    if (Selector.$('dataCadastro').value == '') {
        MostrarMsg("Por favor, preencha a data de cadastro", 'dataCadastro');
        return false;
    }

    if (Selector.$('loja').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione uma loja", 'loja');
        return false;
    }

    if (gridObras.getRowCount() <= 0) {
        MostrarMsg("Por favor, adicione uma ou mais obras.", '');
        return false;
    }

    for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {

        if (gridObras.getCellObject(i, 8).selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione uma etapa para a obra de número " + gridObras.getCellText(i, 0), '');
            return false;
        }
    }

    return true;
}

function Gravar() {

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&data=' + Selector.$('dataCadastro').value;
    p += '&previsao=' + Selector.$('previsao').value;
    p += '&obs=' + Selector.$('obs').value;
    p += '&refeita=' + (Selector.$('refeita').checked ? '1' : '0');
    p += '&loja=' + Selector.$('loja').value;
    p += '&idVenda=' + venda;

    //ARRAY COM OBRAS
    p += '&idsOrcamentosObras=' + gridObras.getRowsData();
    //p += '&imagens=' + gridObras.getContentObjectRowsSrcFile(2);
    p += '&imagens=' + gridObras.getContentObjectRowsTitle(2);
    p += '&qtds=' + gridObras.getContentMoneyRows(7);
    p += '&etapas=' + gridObras.getContentObjectValueRows(8);

    p += '&nomeEtapas=' + gridObras.getContentObjectTextComboRows(8).join("|crio|");

    p += '&selos=' + gridObras.getContentObjectValueRows(9);
    p += '&alturas=' + gridObras.getContentMoneyRows(13);
    p += '&larguras=' + gridObras.getContentMoneyRows(14);
    p += '&idsArtistas=' + gridObras.getContentRows(15);
    p += '&idsObras=' + gridObras.getContentRows(16);
    p += '&idsTamanhos=' + gridObras.getContentRows(17);
    p += '&idsAcabamentos=' + gridObras.getContentRows(18);
    p += '&idsGruposMolduras=' + gridObras.getContentRows(19);
    p += '&idsMolduras=' + gridObras.getContentRows(20);
    p += '&idsProdutos=' + gridObras.getContentRows(21);
    p += '&observacoes=' + gridObras.getContentRows(22);  //IMPORTANTE ARRUMAR DEPOIS
    p += '&tipo=' + gridObras.getContentRows(23);

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg('Problemas ao gravar a ordem de compra. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } else {
        Cancelar();
        MostrarOrdens();
        return true;
    }
}

function Mostra(codigo, ajustar) {

     if(!CheckPermissao(169, true, 'Você não possui permissão para Editar ordem de produção', false)){
        return;
    }
    if (codigo === '' || parseInt(codigo) === 0) {
        return;
    }
    Novo(ajustar);
    
    Selector.$('controles').style.display = "inline-block";
    Limpar();

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Ordem de produção não localizada', '');
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    codigoAtual = json.codigo;

    Selector.$('botFinalizarOrdemCompra').setAttribute('onclick', 'Finalizar(' + json.codigo + ');');
    Selector.$('botCancelarOrdem').setAttribute('onclick', 'CancelarOrdem(' + json.codigo + ');');
    Selector.$('botGerarPdf').setAttribute('onclick', 'GerarPdfOrdemProducao(' + json.codigo + ');');
    Selector.$('botImprimirOrdem').setAttribute('onclick', 'ImprimirOrdem(' + json.codigo + ');');
    //Selector.$('botEnviarOrdemEmail').setAttribute('onclick', 'EnviarPdfOrdemEmail(' + json.codigo + ');');

    Selector.$('cliente').value = json.cliente;
    if(json.cliente == ''){
        Selector.$('divCliente').style.display = 'none';
    }else{
        Selector.$('divCliente').style.display = 'inline-block';
    }
    Selector.$('codOrdem').innerHTML = json.id;
    Selector.$('dataCadastro').value = json.data;
    Selector.$('previsao').value = json.previsao;
    Selector.$('obs').value = json.obs;
    Selector.$('refeita').checked = (json.refeita == '1' ? true : false);

    Selector.$('botCancelarOrdem').style.display = "inline-block";
    Selector.$('botGerarPdf').style.display = "inline-block";
    Selector.$('botFinalizarOrdemCompra').style.display = "inline-block";
    // Selector.$('botEnviarOrdemEmail').style.display = "inline-block";
    Selector.$('botImprimirOrdem').style.display = "inline-block";

    if (json.cancelada == '1') {
        Selector.$('botCancelarOrdem').style.display = "none";
        Selector.$('botGerarPdf').style.display = "none";
        Selector.$('botFinalizarOrdemCompra').style.display = "none";
        //  Selector.$('botEnviarOrdemEmail').style.display = "none";
        Selector.$('botImprimirOrdem').style.display = "none";
        Selector.$('situacao').value = "Ordem Cancelada";
        Selector.$('status').innerHTML = 'Cancelada em ' + json.dataCancelada + " por " + json.usuarioCancelou;
    } else if (json.finalizada == '1') {
        Selector.$('botCancelarOrdem').style.display = "none";
        Selector.$('botFinalizarOrdemCompra').style.display = "none";
        Selector.$('situacao').value = "Ordem Finalizada";
        Selector.$('status').innerHTML = 'Finalizada em ' + json.dataFinalizada + " por " + json.usuarioFinalizou;
    } else {
        Selector.$('situacao').value = "Ordem Em Aberto";
        Selector.$('status').innerHTML = "";
    }

    Selector.$('pedido').value = json.codVenda;
    Select.Show(Selector.$('loja'), json.idLoja);

    MostraObras(json.itens, json.etapas);
    MostraObrasStatus(json.itens);

    Totaliza();
}

function ImprimirOrdem(idOrdem) {

    if(!CheckPermissao(110, true, 'Você não possui permissão para imprimir a ordem de produção', false)){
        return;
    }

    if (codigoAtual <= 0)
        return;

    window.open('impressao-ordem-de-producao.html?codigo=' + idOrdem, 'printOrdemCompra');
}

function pad(width, string, padding) {
    return (width <= string.length) ? string : pad(width, padding + string, padding)
}

function Finalizar(idOrdem) {

    if(!CheckPermissao(113, true, 'Você não possui permissão para finalizar a ordem de produção', false)){
        return;
    }

    if (!isElement('div', 'divFinalizar')) {
        var div = DOM.newElement('div', 'divFinalizar');
        document.body.appendChild(div);
    }

    var div = Selector.$('divFinalizar');

    div.innerHTML = "<h1 class='rotulotitulos' style='font-size: 14px; font-weight: bold; text-align: left;'>Finalizar Ordem de Produçao Nº " + pad(6, idOrdem, "0") + "</h1>";

    div.innerHTML += ' <div  id="d_parcelas"  class="divcontainer" style="max-width: 80px;"> ' +
            '<label id="lblobras">Obras</label> </div>';

    div.innerHTML += "<div id='tblobras' style='background:#EEEEEE; margin-bottom:10px; height:370px; width:100%; overflow:auto'> </div>  ";

    div.innerHTML += '<div align="left"  class="divcontainer"  style="max-width:400px; display:inline-block;"><label>Finalizar ordem de Produção e Incluir itens em estoque.</label></div>';

    div.innerHTML += '<div align="right" style="float:right; width:300px;"><div class="divcontainer" style="max-width: 100px; "> ' +
            '<input type="submit"  class="botaosimplesfoco" onclick="Finalizar_Aux(' + idOrdem + ')"  value="Finalizar" /> ' +
            '</div><div class="divcontainer" style="max-width: 60px; "> ' +
            '<a class="legendaCancelar" onclick="dialogoFinalizar.Close()">Cancelar</a> ' +
            '</div></div>';

    dialogoFinalizar = new caixaDialogo('divFinalizar', 500, 900, 'padrao/', 130);
    dialogoFinalizar.Show();

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=getDadosConpag&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        dialogoFinalizar.Close();
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    gridItens = new Table('gridOrdens');
    gridItens.table.setAttribute('cellpadding', '4');
    gridItens.table.setAttribute('cellspacing', '0');
    gridItens.table.setAttribute('class', 'tabela_cinza_foco');

    gridItens.addHeader([
        DOM.newText('Item'),
        DOM.newText('Imagens'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtde'),
        DOM.newText('Etapa')
    ]);

    Selector.$('tblobras').appendChild(gridItens.table);

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=getEtapasOrdensProducao';
    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        dialogoFinalizar.Close();
        MostrarMsg('Nenhuma etapa cadastrada!', '');
        return;
    }

    var etapas = ajax.getResponseText();

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=getItens';
    p += '&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        dialogoFinalizar.Close();
        MostrarMsg('Nenhuma obra localizada para esta ordem de produção', '');
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    for (var i = 0; i < json.length; i++) {

        var imagem = DOM.newElement('img');
        imagem.src = json[i].imagem;
        imagem.setAttribute('style', 'width:50px');
        imagem.title = json[i].imagem;

        var etapa = DOM.newElement('select');
        etapa.setAttribute('style', 'width:300px');
        etapa.setAttribute('class', 'combo_cinzafoco');
        Select.AddItem(etapa, "Selecione uma Etapa", 0);
        if (etapas !== 0)
            Select.FillWithJSON(etapa, etapas, "codigo", "nome");

        Select.Show(etapa, json[i].idEtapa);

        gridItens.addRow([
            DOM.newText(gridItens.getRowCount() + 1),
            imagem,
            DOM.newText(json[i].artista),
            DOM.newText(json[i].obra),
            DOM.newText(json[i].tamanho),
            DOM.newText(json[i].acabamento),
            DOM.newText(json[i].qtd),
            etapa
        ]);

        gridItens.setRowData(gridItens.getRowCount() - 1, json[i].codigo);
        gridItens.getCell(gridItens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:40px');
        gridItens.getCell(gridItens.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 4).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;width:300px');
    }

    pintaLinhaGrid(gridItens);
}

function Finalizar_Aux(idOrdem) {

    if (!isElement('div', 'divFinalizarP')) {
        var div = DOM.newElement('div', 'divFinalizarP');
        document.body.appendChild(div);
    }

    for (var i = 0; i < gridItens.getRowCount(); i++) {

        if (parseInt(gridItens.getCellObject(i, 7).selectedIndex) !== parseInt(gridItens.getCellObject(i, 7).length - 1)) {
            mensagemFinalizarItem = new DialogoMensagens("divFinalizarP", 125, 380, 150, "4", "Atenção!", "Existem Etapas não concluídas, deseja finaliza-las agora?", "OK", "mensagemFinalizarItem.Close(); Finalizar_Aux_Processar(" + idOrdem + ")", true, "");
            mensagemFinalizarItem.Show();
            return;
        }
    }

    Finalizar_Aux_Processar(idOrdem);
}

function Finalizar_Aux_Processar(idOrdem) {

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=Finalizar';
    p += '&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg('Problemas ao finalizar a ordem de produçao. Tente novamente mais tarde, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } else {
        dialogoFinalizar.Close();
        MostrarOrdens();
        if (Selector.$('divRel').clientHeight == "0") {
            Sair();
        }
        return true;
    }
}

function visualizarItens(idOrdem) {

    if (!isElement('div', 'divVisualizar')) {
        var div = DOM.newElement('div', 'divVisualizar');
        document.body.appendChild(div);
    }

    var div = Selector.$('divVisualizar');
    div.innerHTML = "<div id='tblitem' style='background:#FFF; height:560px; width:100%; overflow:auto'> </div>";

    dialogoVisualizar = new caixaDialogo('divVisualizar', 600, 1000, 'padrao/', 130);
    dialogoVisualizar.Show();

    gitens = new Table('gridItens');
    gitens.table.setAttribute('cellpadding', '4');
    gitens.table.setAttribute('cellspacing', '0');
    gitens.table.setAttribute('class', 'tabela_cinza_foco');

    gitens.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Obras'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Etapa'),
        DOM.newText('Selo')
    ]);

    Selector.$('tblitem').appendChild(gitens.table);

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=getItens&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    for (var i = 0; i < json.length; i++) {

        if (json[i].imagem !== "") {
            var imagem = DOM.newElement('img');
            imagem.setAttribute('src', json[i].imagem);
            imagem.setAttribute('style', 'width:50px; cursor:pointer;');
            imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + json[i].imagem + "');");
        } else {
            var imagem = DOM.newElement('label');
        }

        gitens.addRow([
            DOM.newText(gitens.getRowCount() + 1),
            DOM.newText(json[i].tipo),
            imagem,
            DOM.newText(json[i].artista),
            DOM.newText(json[i].obra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == '3' ? '' : ' (' + json[i].altura + 'x' + json[i].largura + ')')),
            DOM.newText(json[i].acabamento),
            DOM.newText(json[i].etapa),
            DOM.newText(json[i].selo)
        ]);

        gitens.setRowData(gitens.getRowCount() - 1, json[i].codigo);
        gitens.getCell(gitens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:40px');
        gitens.getCell(gitens.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 8).setAttribute('style', 'text-align:left;');
    }

    pintaLinhaGrid(gitens);
}

function CancelarOrdem(idOrdem) {

    if(!CheckPermissao(111, true, 'Você não possui permissão para cancelar a ordem de produção', false)){
        return;
    }

    if (idOrdem <= 0)
        return;

    mensagemCancelarOrdem = new DialogoMensagens("prompt", 120, 400, 150, "4", "Alerta!", "Deseja realmente cancelar esta ordem de produção ?", "SIM", "CancelarOrdemAux(" + idOrdem + ")", true, "");
    mensagemCancelarOrdem.Show();
}

function CancelarOrdemAux(idOrdem) {

    mensagemCancelarOrdem.Close();

    if (idOrdem <= 0)
        return;

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
    var p = 'action=CancelarOrdem';
    p += '&codigo=' + idOrdem;

    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == 1) {
            MostrarMsg('Ordem de produção cancelada com sucesso', '');
            Mostra(idOrdem, false);
            MostrarOrdens();
        }
        else {
            MostrarMsg('Problemas ao cancelar a ordem de produção. Tente novamente, caso o erro persista contate o suporte técnico', '');
        }

        Selector.$('imgCancelar').src = 'imagens/cancelar.png';
    };

    Selector.$('imgCancelar').src = 'imagens/loading.gif';
    ajax.Request(p);
}

function MostraObras(array, etapas) {

    gridObras.clearRows();

    if (array == '0')
        return;

    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var imagem = DOM.newElement('img');

        if(json[i].imagem.split('.')[1] == 'rar' || json[i].imagem.split('.')[1] == 'zip'){
            imagem.src = 'imagens/zip.png';
            imagem.setAttribute("onclick", "BaixarImagemReal('" + json[i].imagem + "');");
        }else{
            imagem.src = json[i].imagem;
            imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + json[i].imagem + "');");
        }

        imagem.setAttribute('style', 'width:50px; cursor:pointer;');
        imagem.title = json[i].imagem;

        if (json[i].idTipoProduto == 1) {
            var certificado = DOM.newElement('img');
            certificado.setAttribute('src', 'imagens/imprimir.png');
            certificado.setAttribute('title', 'Certificado');
            certificado.setAttribute('style', 'width:15px');
            certificado.setAttribute('class', 'efeito-opacidade-75-04');
            certificado.setAttribute('onclick', 'ImprimirCertificado(' + gridObras.getRowCount() + ')');
        } else {
            var certificado = DOM.newElement('label');
        }

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
        excluir.setAttribute('onclick', 'ExcluirObra(' + gridObras.getRowCount() + ')');

        var etapa = DOM.newElement('select');
        etapa.setAttribute('style', 'width:200px');
        etapa.setAttribute('class', 'combo_cinzafoco');
        Select.AddItem(etapa, "Selecione uma Etapa", 0);
        if (etapas !== 0)
            Select.FillWithJSON(etapa, etapas, "codigo", "nome");

        Select.Show(etapa, json[i].idEtapa);

        var selo = DOM.newElement('text');
        selo.setAttribute('style', 'width:100px');
        selo.setAttribute('class', 'textbox_cinzafoco');
        selo.value = json[i].selo;

        gridObras.addRow([
            DOM.newText(gridObras.getRowCount() + 1),
            DOM.newText(json[i].tipo),
            imagem,
            DOM.newText(json[i].artista),
            DOM.newText(json[i].obra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == '3' ? '' : ' (' + json[i].altura + 'x' + json[i].largura + ')')),
            DOM.newText((json[i].idTipoProduto == '3' ? json[i].nomeProduto : json[i].acabamento + (json[i].moldura != '' ? ' - ' + json[i].moldura : ''))),
            DOM.newText(json[i].qtd),
            etapa,
            selo,
            certificado,
            editar,
            excluir,
            //OCULTOS
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(json[i].idArtista),
            DOM.newText(json[i].idObra),
            DOM.newText(json[i].idTamanho),
            DOM.newText(json[i].idAcabamento),
            DOM.newText(json[i].idGrupo),
            DOM.newText(json[i].idMoldura),
            DOM.newText(json[i].idProduto),
            DOM.newText(json[i].obs),
            DOM.newText(json[i].idTipoProduto)
        ]);

        gridObras.setRowData(gridObras.getRowCount() - 1, json[i].codigo);
        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:20px');
    }

    pintaLinhaGrid(gridObras);
    ocultaColunasObras();
}

function AdicionarItem(linha) {

    if (Selector.$('situacao').value == "Ordem Cancelada" || Selector.$('situacao').value == "Ordem Finalizada") {
        MostrarMsg("Não é possivel editar " + Selector.$('situacao').value, 'dataCadastro');
        return;
    }

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.setAttribute('style', 'text-align:left;');
    divCadastro.setAttribute('align', 'left');
    divCadastro.innerHTML = '';

    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'material');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoItens()');
    elemento.setAttribute('style', 'margin-left:155px');
    elemento.setAttribute('checked', 'checked');

    var label = DOM.newElement('label');
    label.innerHTML = 'Material';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'material');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'produto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoItens()');
    elemento.setAttribute('style', 'margin-left:20px');

    var label = DOM.newElement('label');
    label.innerHTML = 'Produtos';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'produto');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    divCadastro.innerHTML += "<BR>";

    var elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'cmbItens');
    elemento.setAttribute('class', 'combo_cinzafoco');
    elemento.setAttribute("style", 'width:430px;margin-left:0px;');
    elemento.setAttribute('onchange', 'getItensArtista()');
    divCadastro.appendChild(elemento);
    divCadastro.innerHTML += "<BR>";

    var divCaixa = DOM.newElement('div');
    divCaixa.setAttribute('class', 'divcontainer');
    divCaixa.setAttribute('style', 'width:100px; margin-right:5px;');
    divCadastro.appendChild(divCaixa);

    //ALTURA
    var label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    divCaixa.appendChild(label);

    var elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'altura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:100%; margin-left:0px;');
    divCaixa.appendChild(elemento);

    //LARGURA
    var divCaixa = DOM.newElement('div');
    divCaixa.setAttribute('class', 'divcontainer');
    divCaixa.setAttribute('style', 'width:100px;margin-right:5px;');
    divCadastro.appendChild(divCaixa);

    var label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    divCaixa.appendChild(label);

    var elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'largura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:100%; margin-left:0px;');
    divCaixa.appendChild(elemento);

    //Valor
    var divCaixa = DOM.newElement('div');
    divCaixa.setAttribute('class', 'divcontainer');
    divCaixa.setAttribute('style', 'width:100px;margin-right:5px;');
    divCadastro.appendChild(divCaixa);


    var label = DOM.newElement('label');
    label.innerHTML = 'Valor UN.* ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    divCaixa.appendChild(label);

    var elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'valorunitario');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:100%; margin-left:0px;');
    elemento.setAttribute("onkeyup", 'totalizaPrompt()');
    divCaixa.appendChild(elemento);

    //Valor
    var divCaixa = DOM.newElement('div');
    divCaixa.setAttribute('class', 'divcontainer');
    divCaixa.setAttribute('style', 'width:100px;margin-right:5px;');
    divCadastro.appendChild(divCaixa);


    var label = DOM.newElement('label');
    label.innerHTML = 'Quantidade *';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    divCaixa.appendChild(label);

    var elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'quantidade');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:100%; margin-left:0px;');
    elemento.setAttribute("onkeyup", 'totalizaPrompt()');
    divCaixa.appendChild(elemento);

    divCadastro.innerHTML += "<BR>";

    // Total
    var divCaixa = DOM.newElement('div');
    divCaixa.setAttribute('class', 'divcontainer');
    divCaixa.setAttribute('style', 'width:100px;margin-right:5px;');
    divCadastro.appendChild(divCaixa);


    var label = DOM.newElement('label');
    label.innerHTML = 'Valor Total';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    divCaixa.appendChild(label);

    var elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'promptTotal');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:130%; margin-left:0px; background:#EEEEEE');
    elemento.disabled = true;
    divCaixa.appendChild(elemento);

    divCadastro.innerHTML += "<BR>";

    //BOTÃO SALVAR
    var elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', 'IncluirItem(' + linha + ')');
    elemento.innerHTML = "Incluir";

    divCadastro.appendChild(elemento);

    dialogoCadastro = new caixaDialogo('divCadastro', 245, 520, 'padrao/', 130);
    dialogoCadastro.Show();

    Mask.setMoeda(Selector.$('altura'));
    Mask.setMoeda(Selector.$('largura'));
    Mask.setMoeda(Selector.$('valorunitario'));
    Mask.setOnlyNumbers(Selector.$('quantidade'));

    if (linha >= 0) {

        var codigoItem = 0;


        if (gridItens.getCellText(linha, 8) > 0) {
            Selector.$('material').checked = true;
            codigoItem = gridItens.getCellText(linha, 8);
        } else {
            Selector.$('produto').checked = true;
            codigoItem = gridItens.getCellText(linha, 9);
        }

        AlternaTipoItens();

        Select.Show(Selector.$('cmbItens'), codigoItem);

        Selector.$('altura').value = gridItens.getCellText(linha, 10);
        Selector.$('largura').value = gridItens.getCellText(linha, 11);
        Selector.$('valorunitario').value = gridItens.getCellText(linha, 3);
        Selector.$('quantidade').value = gridItens.getCellText(linha, 4);
        Selector.$('promptTotal').value = gridItens.getCellText(linha, 5);

    } else {

        Selector.$('material').checked = true;
        AlternaTipoItens();
    }
}

function AlternaTipoItens() {

    Select.Clear(Selector.$('cmbItens'));
    Selector.$('cmbItens').name = 0;

    if (Selector.$('material').checked) {
        getComboMateriais(Selector.$('cmbItens'), "Selecione um Material", false);
    } else {
        getComboProdutos(Selector.$('cmbItens'), "Selecione um Produto", false);
    }

    Selector.$('altura').value = "";
    Selector.$('largura').value = "";
    Selector.$('valorunitario').value = "";
    Selector.$('quantidade').value = "";
    Selector.$('promptTotal').value = "";
}

function totalizaPrompt() {

    Selector.$('promptTotal').value = "";
    if (Number.parseFloat(Selector.$('valorunitario').value) <= 0 || Number.parseFloat(Selector.$('quantidade').value) <= 0) {
        return;
    }

    Selector.$('promptTotal').value = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorunitario').value) * Number.parseFloat(Selector.$('quantidade').value));
}

function IncluirItem(linha) {

    if (Selector.$('cmbItens').selectedIndex <= 0) {
        MostrarMsg('Por favor, selecione um item', 'cmbItens');
        return;
    }


    if (parseInt(Selector.$('quantidade').value) <= 0) {
        MostrarMsg('Por favor, informe uma quantidade válida!', 'quantidade');
        return;
    }


    if (Number.parseFloat(Selector.$('valorunitario').value) <= 0) {
        MostrarMsg('Por favor, informe uma valor!', 'valorunitario');
        return;
    }

    for (var i = 0; i <= gridItens.getRowCount() - 1; i++) {
        if (linha !== i) {
            if (gridItens.getCellText(i, (Selector.$('material').checked ? 8 : 9)) == Selector.$('cmbItens').value) {
                MostrarMsg('Este ' + (Selector.$('material').checked ? "material" : "produto") + " ja se encontra na lista.", '');
                return;
            }
        }
    }

    if (linha >= 0) {

        gridItens.setCellText(linha, 1, (Selector.$('material').checked ? 'MATERIAL' : 'PRODUTO'));
        gridItens.setCellText(linha, 2, Select.GetText(Selector.$('cmbItens')));
        gridItens.setCellText(linha, 3, Number.FormatDinheiro(Number.parseFloat(Selector.$('valorunitario').value)));
        gridItens.setCellText(linha, 4, parseInt(Selector.$('quantidade').value));
        gridItens.setCellText(linha, 5, Selector.$('promptTotal').value);
        gridItens.setCellText(linha, 8, (Selector.$('material').checked ? Selector.$('cmbItens').value : '0'));
        gridItens.setCellText(linha, 9, (Selector.$('material').checked ? '0' : Selector.$('cmbItens').value));
        gridItens.setCellText(linha, 10, Number.FormatDinheiro(Number.parseFloat(Selector.$('altura').value)));
        gridItens.setCellText(linha, 11, Number.FormatDinheiro(Number.parseFloat(Selector.$('largura').value)));

    } else {

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarItem(' + gridItens.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObra(' + gridItens.getRowCount() + ')');

        gridItens.addRow([
            DOM.newText(gridItens.getRowCount() + 1),
            DOM.newText((Selector.$('material').checked ? 'MATERIAL' : 'PRODUTO')),
            DOM.newText(Select.GetText(Selector.$('cmbItens'))),
            DOM.newText(Number.FormatDinheiro(Number.parseFloat(Selector.$('valorunitario').value))),
            DOM.newText(parseInt(Selector.$('quantidade').value)),
            DOM.newText(Number.FormatDinheiro(Number.parseFloat(Selector.$('promptTotal').value))),
            editar,
            excluir,
            DOM.newText((Selector.$('material').checked ? Selector.$('cmbItens').value : '0')),
            DOM.newText((Selector.$('material').checked ? '0' : Selector.$('cmbItens').value)),
            DOM.newText(Number.FormatDinheiro(Number.parseFloat(Selector.$('altura').value))),
            DOM.newText(Number.FormatDinheiro(Number.parseFloat(Selector.$('largura').value)))
        ]);

        gridItens.setRowData(gridItens.getRowCount() - 1, 0);
    }

    var cor = false;
    for (var i = 0; i <= gridItens.getRowCount() - 1; i++) {

        gridItens.getCell(i, 0).setAttribute('style', 'text-align:center; width:40px');
        gridItens.getCell(i, 1).setAttribute('style', 'text-align:left;');
        gridItens.getCell(i, 2).setAttribute('style', 'text-align:left;');
        gridItens.getCell(i, 3).setAttribute('style', 'text-align:right;');
        gridItens.getCell(i, 4).setAttribute('style', 'text-align:center;');
        gridItens.getCell(i, 5).setAttribute('style', 'text-align:right;');
        gridItens.getCell(i, 6).setAttribute('style', 'text-align:center; width:20px');
        gridItens.getCell(i, 7).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridItens.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridItens.setRowBackgroundColor(i, "#FFF");
        }

        ocultaColunasObras();
    }

    dialogoCadastro.Close();
    Totaliza();
}

function getItensArtista() {

    if (Selector.$('cmbItens').value == Selector.$('cmbItens').name)
        return;

    Selector.$('cmbItens').name = Selector.$('cmbItens').value;

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=getInfoItem';
    p += '&codigo=' + Selector.$('cmbItens').value;
    p += '&material=' + (Selector.$('material').checked ? "1" : "0");
    ajax.Request(p);

    if (ajax.getResponseText() == '0' || ajax.getResponseText() == 0) {
        Selector.$('altura').value = "0,00";
        Selector.$('largura').value = "0,00";
        Selector.$('valorunitario').value = "0,00";
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    Selector.$('quantidade').value = 1;
    Selector.$('altura').value = json.altura;
    Selector.$('largura').value = json.largura;
    Selector.$('valorunitario').value = json.valor;

    totalizaPrompt();
}

function getTamanhosObras(ascinc) {

    if (Selector.$('o_obra').value !== Selector.$('o_obra').name) {
        Selector.$('o_obra').name = Selector.$('o_obra').value;
    }
    else {
        return;
    }

    if (Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {

        Select.Clear(Selector.$('o_tamanho'));

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));
        return;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', ascinc);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + Selector.$('o_obra').value;

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_tamanho'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText() || "[ ]");
            Selector.$('o_imagem').src = json[0].imagem;
            Selector.$('o_imagem').setAttribute('name', json[0].img);
            Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px; cursor:pointer;');
            Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + json[0].imagemReal + "');");

            Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');

            getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));
        };

        Select.AddItem(Selector.$('o_tamanho'), 'Carregando tamanhos...', '0', '');

        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        Select.Clear(Selector.$('o_tamanho'));

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Selector.$('o_imagem').src = json[0].imagem;
        Selector.$('o_imagem').setAttribute('name', json[0].img);
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px; cursor:pointer;');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + json[0].imagemReal + "');");

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');

        //getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));
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

            Selector.$('o_qtde').value = '1';

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

        var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
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

            var json = JSON.parse(ajax.getResponseText() || "[ ]");

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

            var json = JSON.parse(ajax.getResponseText() || "[ ]");

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

function getDadosTamanhoTiragem() {

    if (Selector.$('o_tamanho').value <= 0)
        return;

    var item = (Selector.$('o_optPhoto').checked ? 'p' : 'i');

    if (item === 'p') {

        var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
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
            Selector.$('o_tiragem').value = json.tiragemMaxima;
            Selector.$('o_qtdeVendidos').value = json.tiragemAtual;
            Selector.$('o_estrelas').value = json.estrelas;
        };

        ajax.Request(p);
    }
}

function getDadosProduto() {

    var cmb = Selector.$('o_produtoProd');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '0';
        return;
    }

    if (cmb.name != cmb.value) {
        cmb.name = cmb.value;
    }
    else {
        return;
    }

    var aux = Select.GetText(cmb).split('-');

    Selector.$('o_qtde').value = '1';
    Selector.$('o_qtde').select();
}

function getDetalhesAcabamento() {

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

        var moldura = Selector.$('o_moldura');

        var altura = Selector.$('o_altura');
        var largura = Selector.$('o_largura');
        var estrelas = Selector.$('o_estrelas');

        if (artista.selectedIndex <= 0 || obra.selectedIndex <= 0 ||
                tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {

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

            if (ajax.getResponseText() === '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    } else {

        var tamanho = Selector.$('o_tamanhoI');
        var acabamento = Selector.$('o_acabamentoI');
        var moldura = Selector.$('o_molduraI');

        if (tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {

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

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
}

function ExcluirObraAux(linha) {

    if (linha >= 0) {
        mensagemExcluirItem.Close();
        if (gridObras.getRowCount() == 1) {
            gridObras.clearRows();
        } else {
            gridObras.deleteRow(linha);
            for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {
                gridObras.setCellText(i, 0, i + 1);
                gridObras.getCellObject(i, 10).setAttribute('onclick', 'ImprimirCertificado(' + i + ');');
                gridObras.getCellObject(i, 11).setAttribute('onclick', 'AdicionarObra(' + i + ');');
                gridObras.getCellObject(i, 12).setAttribute('onclick', 'ExcluirObra(' + i + ');');

            }
            pintaLinhaGrid(gridObras);
        }
    }

    Totaliza();
}

function ExcluirObra(linha) {

    if(!CheckPermissao(115, true, 'Você não possui permissão para excluir a obra da OP', false)){
        return;
    }

    if (Selector.$('situacao').value == "Ordem Cancelada" || Selector.$('situacao').value == "Ordem Finalizada") {
        MostrarMsg("Não é possivel editar " + Selector.$('situacao').value, 'dataCadastro');
        return;
    }

    if (parseInt(Selector.$('pedido').value) > 0) {
        MostrarMsg("Não é possivel excluir este item pois está vinculado ao pedido Nº" + Selector.$('pedido').value, '');
        return;
    }

    mensagemExcluirItem = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este item?", "OK", "ExcluirObraAux(" + linha + ")", true, "");
    mensagemExcluirItem.Show();
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

function Totaliza() {
    Selector.$('qtdObras').value = gridObras.getRowCount();
}

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
    var path = '../imagens/' + pasta + '/';
    var funcao = 'ArmazenarPath';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp, zip, rar');
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

    if(extensao == 'zip' || extensao == 'rar'){
        Selector.$('o_imagem').setAttribute('src', 'imagens/zip.png');
        Selector.$('o_imagem').style.cursor = 'pointer';
        Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + arquivo + '' + "');");
    }else{
        Selector.$('o_imagem').setAttribute('src', 'imagens/' + pasta + '/' + arquivo + '');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + 'imagens/' + pasta + '/' + arquivo + '' + "');");
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

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
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

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=GerarMiniaturaImagem';
    p += '&imagem=' + Selector.$('o_imagem').getAttribute('name');
    p += '&pasta=' + pasta;

    ajax.Request(p);

    var vetor = Selector.$('o_imagem').getAttribute('name').split(".");
    var extensao = vetor[vetor.length - 1];

    if (extensao !== 'jpg' && extensao !== 'jpeg') {

        Selector.$('o_imagem').setAttribute('name', vetor[0] + '.jpg');
        Selector.$('o_imagem').setAttribute('src', 'imagens/' + pasta + '/mini_' + vetor[0] + '.jpg');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + 'imagens/' + pasta + '/' + vetor[0] + '.jpg' + "');");
    }
}

function GerarPdfOrdemProducao(codigo) {

    if(!CheckPermissao(112, true, 'Você não possui permissão para gerar o pdf da ordem de produção', false)){
        return;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
    var p = 'action=GerarPdfOrdem';
    p += '&idOrdem=' + codigo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() !== '') {
            window.open(ajax.getResponseText());
        }
    }

    ajax.Request(p);
}

function gerarParcelas(idOrdem) {

    if (Number.parseFloat(Selector.$('c_total').value) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Nao existe nenhum valor a ser parcelado!", "OK", "", false, "c_total");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('c_parcelas').value) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Favor Informar uma quantidade válida!", "OK", "", false, "c_parcelas");
        mensagem.Show();
        return;
    }

    if (gridParcelas.getRowCount() > 0) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Já existe parcelas geradas, favor excluí-las!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    AdicionarParcelas();
}

function AdicionarParcelas() {

    Selector.$('cmdgerarparc').style.display = "none";
    Selector.$('c_parcelas').style.display = "none";
    Selector.$('c_vencimento').style.display = "none";
    Selector.$('lblparcelas').style.display = "none";
    Selector.$('lblvencimento').style.display = "none";

    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth();
    var ano = data.getFullYear();
    var totalParcelas = parseInt(Selector.$('c_parcelas').value);
    var valorTotal = Selector.$('c_total').value;

    var valorParcela = Number.parseFloat(valorTotal) / totalParcelas;

    var diferenca = valorTotal - (valorParcela * totalParcelas);

    for (var i = 0; i < totalParcelas; i++) {

        var situacao = 'Vencido';
        if (parseInt(SomarMes(Selector.$('c_vencimento').value, i).substring(6, 10)) > parseInt(ano)) {
            situacao = 'Em aberto';
        } else if (parseInt(SomarMes(Selector.$('c_vencimento').value, i).substring(6, 10)) == parseInt(ano)) {
            if (parseInt(SomarMes(Selector.$('c_vencimento').value, i).substring(3, 5)) > parseInt(mes + 1)) {
                situacao = 'Em aberto';
            } else if (parseInt(SomarMes(Selector.$('c_vencimento').value, i).substring(3, 5)) == parseInt(mes + 1)) {
                if (parseInt(SomarMes(Selector.$('c_vencimento').value, i).substring(0, 2)) >= parseInt(dia)) {
                    situacao = 'Em aberto';
                }
            }
        }

        var valor = valorParcela;

        if (diferenca > 0 && i == 0)
            var valor = valorParcela + diferenca;
        else
            var valor = valorParcela;

        var txtparc = DOM.newElement('text');
        txtparc.setAttribute('class', 'textbox_cinzafoco');
        txtparc.setAttribute("style", 'width:120px; text-align:center; margin:0px; background:#FFF');
        Mask.setOnlyNumbers(txtparc);
        txtparc.value = Number.FormatDinheiro(valor);

        var txtdata = DOM.newElement('text');
        txtdata.setAttribute('class', 'textbox_cinzafoco');
        txtdata.setAttribute("style", 'width:120px; text-align:center; margin:0px; background:#FFF');
        Mask.setData(txtdata);
        txtdata.value = SomarMes(Selector.$('c_vencimento').value, i);

        gridParcelas.addRow([
            DOM.newText(gridParcelas.getRowCount() + 1),
            txtparc,
            txtdata
        ]);

        gridParcelas.getCell(gridParcelas.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px;');
        gridParcelas.getCell(gridParcelas.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
        gridParcelas.getCell(gridParcelas.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
    }

    pintaLinhaGrid(gridParcelas);
}

function AdicionarObra(codigo) {

    if(codigo == '-1'){
        if(!CheckPermissao(160, true, 'Você não possui permissão para adicionar obras na OP', false)){
            return;
        }
    }

    if (Selector.$('situacao').value == "Ordem Cancelada" || Selector.$('situacao').value == "Ordem Finalizada") {
        MostrarMsg("Não é possivel editar " + Selector.$('situacao').value, 'dataCadastro');
        return;
    }

    if (parseInt(Selector.$('pedido').value) > 0 && codigo >= 0) {
        MostrarMsg("Não é possivel editar este item pois está vinculado ao pedido Nº" + Selector.$('pedido').value, '');
        return;
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

    //MOLDURA
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
    //elemento.setAttribute('onclick', '');
    elemento.setAttribute('onchange', 'getDadosProduto(); getImagemProduto();');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    divCadastro.appendChild(divProd);
    //FIM divProd

    //QTDE
    var divTotal = DOM.newElement('div');
    divTotal.setAttribute('style', 'margin-top:8px');

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
    // elemento.setAttribute('onblur', 'TotalizaObras(true, false, false, false)');
    elemento.setAttribute("style", 'width:35px; margin-left:4px;text-align:center;');

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
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px; cursor:pointer;');
    elemento.setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
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

    dialogoCadastro = new caixaDialogo('divCadastro', 545, 620, 'padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();
    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    Selector.$('divCadastro').style.overflow = 'hidden';

    if (codigo >= 0) {

        getArtistas(Selector.$('o_artista'), 'Selecione um artista', false);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', false, 'p');
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', false, 'i');

        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', false);
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', false);

        if (gridObras.getCellText(codigo, 23) == 1) {
            Selector.$('o_optPhoto').checked = 'checked';
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';

            AlternaTipoObras();

            Select.Show(Selector.$('o_artista'), gridObras.getCellText(codigo, 15));

            getObrasArtista(false);
            Select.Show(Selector.$('o_obra'), gridObras.getCellText(codigo, 16));

            getTamanhosObras(false);
            Select.Show(Selector.$('o_tamanho'), gridObras.getCellText(codigo, 17));

            Select.Show(Selector.$('o_acabamento'), gridObras.getCellText(codigo, 18));

            Selector.$('o_altura').value = gridObras.getCellText(codigo, 13);
            Selector.$('o_largura').value = gridObras.getCellText(codigo, 14);
            // Selector.$('o_tiragem').value = gridObras.getCellText(codigo, 22);
            // Selector.$('o_qtdeVendidos').value = gridObras.getCellText(codigo, 23);
            // Selector.$('o_estrelas').value = gridObras.getCellText(codigo, 24);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 7);

            Selector.$('o_obs').value = gridObras.getCellText(codigo, 22);

            if (gridObras.getCellObject(codigo, 2).title == '' || gridObras.getCellObject(codigo, 2).title.split('/')[gridObras.getCellObject(codigo, 2).title.split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
                Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
            } else {
                Selector.$('o_imagem').src = gridObras.getCellObject(codigo, 2).src;
                Selector.$('o_imagem').title = gridObras.getCellObject(codigo, 2).title;
                Selector.$('o_imagem').setAttribute("onclick", gridObras.getCellObject(codigo, 2).getAttribute('onclick'));
            }

            //   Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 26) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            //   Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 26);

            Select.Show(Selector.$('o_grupoMoldura'), gridObras.getCellText(codigo, 19));
            getMoldurasObras(Selector.$('o_moldura'), 'Selecione uma moldura...', false, Selector.$('o_grupoMoldura').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_moldura'), gridObras.getCellText(codigo, 20));
        }
        else if (gridObras.getCellText(codigo, 23) == 2) {
            Selector.$('o_optInsta').checked = 'checked';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';
            AlternaTipoObras();

            getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);

            Select.Show(Selector.$('o_tamanhoI'), gridObras.getCellText(codigo, 17));

            getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));

            Select.Show(Selector.$('o_acabamentoI'), gridObras.getCellText(codigo, 18));

            Selector.$('o_alturaI').value = gridObras.getCellText(codigo, 13);
            Selector.$('o_larguraI').value = gridObras.getCellText(codigo, 14);

            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 7);

            Selector.$('o_obs').value = gridObras.getCellText(codigo, 22);
            Selector.$('o_imagem').setAttribute('title', gridObras.getCellObject(codigo, 2));

            if (gridObras.getCellObject(codigo, 2).title == '' || gridObras.getCellObject(codigo, 2).title.split('/')[gridObras.getCellObject(codigo, 2).title.split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
                Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
            } else {
                Selector.$('o_imagem').src = gridObras.getCellObject(codigo, 2).src;
                Selector.$('o_imagem').title = gridObras.getCellObject(codigo, 2).title;
                Selector.$('o_imagem').setAttribute("onclick", gridObras.getCellObject(codigo, 2).getAttribute('onclick'));
            }

            //Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 26) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            //Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 26);

            Select.Show(Selector.$('o_grupoMolduraI'), gridObras.getCellText(codigo, 19));
            getMoldurasObras(Selector.$('o_molduraI'), 'Selecione uma moldura...', false, Selector.$('o_grupoMolduraI').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_molduraI'), gridObras.getCellText(codigo, 20));
        }
        else {
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').checked = 'checked';
            AlternaTipoObras();

            getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', false);

            Select.Show(Selector.$('o_produtoProd'), gridObras.getCellText(codigo, 21));

            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 7);

            Selector.$('o_obs').value = gridObras.getCellText(codigo, 22);
            //Selector.$('o_imagem').src = 'imagens/semarte.png';
            //Selector.$('o_imagem').setAttribute('title', gridObras.getCellObject(codigo, 2).title);

            if (gridObras.getCellObject(codigo, 2).title == '' || gridObras.getCellObject(codigo, 2).title.split('/')[gridObras.getCellObject(codigo, 2).title.split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
                Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
            } else {
                Selector.$('o_imagem').src = gridObras.getCellObject(codigo, 2).src;
                Selector.$('o_imagem').title = gridObras.getCellObject(codigo, 2).title;
                Selector.$('o_imagem').setAttribute("onclick", gridObras.getCellObject(codigo, 2).getAttribute('onclick'));
            }
        }

        getDadosTamanhoTiragem();
    }
    else {
        getArtistas(Selector.$('o_artista'), 'Selecione um artista', true);
        Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', 0);
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

function getObrasArtista(ascinc) {

    if (Selector.$('o_artista').value !== Selector.$('o_artista').name) {
        Selector.$('o_artista').name = Selector.$('o_artista').value;
    }
    else {
        return;
    }

    Select.Clear(Selector.$('o_obra'));

    if (Selector.$('o_artista').value === '0') {

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

function AlternaTipoObras() {

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';
        dialogoCadastro.Realinhar(490, 620);
        // Selector.$('o_artista').focus();
        getTamanhosObras(true);
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';
        dialogoCadastro.Realinhar(470, 620);
        //Selector.$('o_tamanhoI').focus();
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem()');
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';
        dialogoCadastro.Realinhar(390, 620);
        //Selector.$('o_produtoProd').focus();
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem()');
    }
}

function IncluirObra(linha) {

    if(!CheckPermissao(160, true, 'Você não possui permissão para editar a obra da OP', false)){
        return;
    }

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
        nomeTipo = 'Produtos';
        tipo = 3;
    }

    if (linha >= 0) {

        gridObras.setCellText(linha, 1, nomeTipo);
        gridObras.getCellObject(linha, 2).src = Selector.$('o_imagem').src;
        gridObras.getCellObject(linha, 2).title = Selector.$('o_imagem').title;
        gridObras.getCellObject(linha, 2).setAttribute("onclick", Selector.$('o_imagem').getAttribute('onclick'));
        gridObras.setCellText(linha, 3, (photoArts ? Select.GetText(Selector.$('o_artista')) : '- - -'));
        gridObras.setCellText(linha, 4, (photoArts ? Select.GetText(Selector.$('o_obra')) : '- - -'));
        gridObras.setCellText(linha, 5, (photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -')));
        gridObras.setCellText(linha, 6, (photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd')))));
        gridObras.setCellText(linha, 7, Selector.$('o_qtde').value);

        //OCULTAS        
        gridObras.setCellText(linha, 13, (photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0')));
        gridObras.setCellText(linha, 14, (photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0')));
        gridObras.setCellText(linha, 15, (photoArts ? Selector.$('o_artista').value : '0'));
        gridObras.setCellText(linha, 16, (photoArts ? Selector.$('o_obra').value : '0'));
        gridObras.setCellText(linha, 17, (photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0')));
        gridObras.setCellText(linha, 18, (photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value)));
        gridObras.setCellText(linha, 19, (photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0')));
        gridObras.setCellText(linha, 20, (photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0')));
        gridObras.setCellText(linha, 21, (tipo == 3 ? Selector.$('o_produtoProd').value : '0'));
        gridObras.setCellText(linha, 22, Selector.$('o_obs').value);
        gridObras.setCellText(linha, 23, tipo);

    }
    else {

        var imagem = DOM.newElement('img');
        imagem.src = Selector.$('o_imagem').src;
        imagem.setAttribute('style', 'width:50px; cursor:pointer;');
        imagem.setAttribute("onclick", Selector.$('o_imagem').getAttribute('onclick'));
        imagem.title = Selector.$('o_imagem').title;

        var certificado = DOM.newElement('img');
        certificado.setAttribute('src', 'imagens/imprimir.png');
        certificado.setAttribute('title', 'Certificado');
        certificado.setAttribute('style', 'width:15px');
        certificado.setAttribute('class', 'efeito-opacidade-75-04');
        certificado.setAttribute('onclick', 'ImprimirCertificado(' + gridObras.getRowCount() + ')');

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
        excluir.setAttribute('onclick', 'ExcluirObra(' + gridObras.getRowCount() + ')');

        var etapa = DOM.newElement('select');
        etapa.setAttribute('style', 'width:200px');
        etapa.setAttribute('class', 'combo_cinzafoco');

        var selo = DOM.newElement('text');
        selo.setAttribute('style', 'width:100px');
        selo.setAttribute('class', 'textbox_cinzafoco');

        gridObras.addRow([
            DOM.newText(gridObras.getRowCount() + 1),
            DOM.newText(nomeTipo),
            imagem,
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_artista')) : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_obra')) : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -'))),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd'))))),
            DOM.newText(Selector.$('o_qtde').value),
            etapa,
            selo,
            certificado,
            editar,
            excluir,
            //OCULTOS
            DOM.newText((photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_artista').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_obra').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value))),
            DOM.newText((photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0'))),
            DOM.newText((tipo == 3 ? Selector.$('o_produtoProd').value : '0')),
            DOM.newText(Selector.$('o_obs').value),
            DOM.newText(tipo)
        ]);

        getEtapasOrdensProducao(etapa, "Selecione", false);
        Select.Show(etapa, 1);

        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:20px');
    }

    ocultaColunasObras();

    Selector.$('qtdObras').value = gridObras.getRowCount();
    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    dialogoCadastro.Close();
}

function ImprimirCertificado(linha) {

    if(!CheckPermissao(114, true, 'Você não possui permissão para imprimir o certificado da obra', false)){
        return;
    }

    if (gridObras.getRowData(linha) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "2", "Atenção", "Favor Salvar primeiro antes de imprimir", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
    var p = 'action=GerarPdfCertificado';
    p += '&codigo=' + gridObras.getRowData(linha);

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() !== '') {

            window.open(ajax.getResponseText());
        }
    }

    ajax.Request(p);
}

function MostraObrasStatus(array) {

    gridObrasComp.clearRows();

    if (array == '0')
        return;

    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var imagem = DOM.newElement('img');

        if(json[i].imagem.split('.')[1] == 'rar' || json[i].imagem.split('.')[1] == 'zip'){
            imagem.src = 'imagens/zip.png';
            imagem.setAttribute("onclick", "BaixarImagemReal('" + json[i].imagem + "');");
        }else{
            imagem.src = json[i].imagem;
            imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + json[i].imagem + "');");
        }

        imagem.setAttribute('style', 'width:100%; cursor:pointer;');
        imagem.title = json[i].imagem;

        var lblDados = DOM.newElement('label');
        lblDados.setAttribute('style', 'font-weight:100;');
        lblDados.innerHTML = '<b>Tipo: </b>' + json[i].tipo;
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Artista: </b>' + json[i].artista;
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Obra: </b>' + json[i].obra;
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Tamanho: </b>' + json[i].nomeTamanho + ' (' + json[i].altura +'x' + json[i].largura + ')';
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Acabamento: </b>' + json[i].acabamento;
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Moldura: </b>' + json[i].moldura;
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Qtde: </b>' + json[i].qtd;
        lblDados.innerHTML += '<br>';
        lblDados.innerHTML += '<b>Etapa: </b>' + json[i].etapa;

        var divStatus = DOM.newElement('div');

        if(json[i].opStatus != '0'){

            var jsonOpStatus = JSON.parse(json[i].opStatus || "[ ]");

            for(var j = 0; j < jsonOpStatus.length; j++){

                var chkStatus = DOM.newElement('checkbox', json[i].codigo + '_' + jsonOpStatus[j].idOpCompStatus);
                if(jsonOpStatus[j].ok == '1'){
                    chkStatus.setAttribute('checked', 'checked');
                    chkStatus.setAttribute('onclick', 'AtualizarStatusOpComp(' + json[i].codigo + ', ' + jsonOpStatus[j].idOpCompStatus + ', 0)');
                }else{
                    chkStatus.setAttribute('onclick', 'AtualizarStatusOpComp(' + json[i].codigo + ', ' + jsonOpStatus[j].idOpCompStatus + ', 1)');
                }
                divStatus.appendChild(chkStatus);

                var lblStatus = DOM.newElement('label');
                lblStatus.setAttribute('style', 'font-weight:100;');
                lblStatus.setAttribute('for', json[i].codigo + '_' + jsonOpStatus[j].idOpCompStatus);
                lblStatus.innerHTML = jsonOpStatus[j].opCompStatus;
                divStatus.appendChild(lblStatus);

                divStatus.innerHTML += '<br>';
            }
        }

        gridObrasComp.addRow([
            imagem,
            lblDados,
            divStatus,
        ]);

        gridObrasComp.getCell(gridObrasComp.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:150px;');
        gridObrasComp.getCell(gridObrasComp.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridObrasComp.getCell(gridObrasComp.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    }

    pintaLinhaGrid(gridObrasComp);
}

function AtualizarStatusOpComp(idOrdemProducaoComp, idOpCompStatus, check){

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=AtualizarStatusOpComp';
    p+= '&idOrdemProducaoComp=' + idOrdemProducaoComp;
    p+= '&idOpCompStatus=' + idOpCompStatus;
    p+= '&check=' + check;
    ajax.Request(p);
}