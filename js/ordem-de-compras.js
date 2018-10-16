checkSessao();
CheckPermissao(24, false, '', true);

var codigoAtual = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Ordem de Compras</div>";
    carregarmenu();
    getDadosUsuario();

    getLojas(Selector.$('statusLoja'), "Selecione uma loja", true);

    if (Window.getParameter('situacao') == null || Window.getParameter('situacao') == '') {
        Select.Show(Selector.$('statusBusca'), 1);
    }

    Mask.setData(Selector.$('dataCadastro'));
    gridOrdens = new Table('gridOrdens');
    gridOrdens.table.setAttribute('cellpadding', '4');
    gridOrdens.table.setAttribute('cellspacing', '0');
    gridOrdens.table.setAttribute('class', 'tabela_cinza_foco');

    gridOrdens.addHeader([
        DOM.newText('N° OC'),
        DOM.newText('Data'),
        DOM.newText('Loja'),
        DOM.newText('Previsão'),
        DOM.newText('Fornecedor'),
        DOM.newText('Itens'),
        DOM.newText('Situação'),
        DOM.newText('Editar'),
        DOM.newText('Cancelar'),
        DOM.newText('Finalizar')
    ]);

    Selector.$('divRel').appendChild(gridOrdens.table);

    Mask.setData(Selector.$('dataCadastro'));
    Mask.setData(Selector.$('previsao'));

    //CRIA TABELA DE OBRAS
    gridItens = new Table('gridItens');
    gridItens.table.setAttribute('cellpadding', '4');
    gridItens.table.setAttribute('cellspacing', '0');
    gridItens.table.setAttribute('class', 'tabela_cinza_foco');

    gridItens.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Descrição'),
        DOM.newText('Valor Unitário'),
        DOM.newText('Qtde'),
        DOM.newText('Valor Total'),
        DOM.newText('Editar'),
        DOM.newText('Excluir'),
        DOM.newText('idMaterial'),
        DOM.newText('idProduto'),
        DOM.newText('altura'),
        DOM.newText('largura')
    ]);

    Selector.$('divItens').appendChild(gridItens.table);

    gridItens.hiddenCol(8);
    gridItens.hiddenCol(9);
    gridItens.hiddenCol(10);
    gridItens.hiddenCol(11);

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataDeAte(Selector.$('de'), Selector.$('ate'));

    getLojas(Selector.$('loja'), "Selecione uma loja", true);
    getFornecedores(Selector.$('fornecedor'), "Selecione um Fornecedor", true);

    var c = Window.getParameter('idOrdem');

    if (c == null || c == '') {
        getFornecedores(Selector.$('statusfornecedor'), "Selecione um Fornecedor", true);

        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'inline-block';
        Selector.$('ate').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusfornecedor').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

    }
    else {
        getFornecedores(Selector.$('statusfornecedor'), "Selecione um Fornecedor", false)
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'inline-block';
        Selector.$('ate').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusfornecedor').style.display = 'inline-block';
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

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'inline-block';
        Selector.$('ate').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusLoja').style.display = 'inline-block';
        Selector.$('statusfornecedor').style.display = 'inline-block';
        Selector.$('btPesq').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    } else {
        Selector.$('divContainer').style.maxWidth = '1060px';
        Selector.$('divCadastro2').setAttribute('style', 'height:530px;  width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('de').style.display = 'none';
        Selector.$('ate').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
        Selector.$('statusLoja').style.display = 'none';
        Selector.$('statusfornecedor').style.display = 'none';
        Selector.$('btPesq').style.display = 'none';
    }
}

function MostrarOrdens() {

    gridOrdens.clearRows();

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', true);
    var p = 'action=MostrarOrdens';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&loja=' + Selector.$('statusLoja').value;
    p += '&fornecedor=' + Selector.$('statusfornecedor').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

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
                finalizar.setAttribute('title', 'Finalizar ordem de compra');
                finalizar.setAttribute('style', 'cursor:pointer');
                finalizar.setAttribute('onclick', 'Finalizar(' + json[i].codigo + ')');

            } else {

                var cancelar = DOM.newElement('label');
                var finalizar = DOM.newElement('label');
            }

            gridOrdens.addRow([
                DOM.newText(json[i].id),
                DOM.newText(json[i].data),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].previsao),
                DOM.newText(json[i].fornecedor),
                itens,
                DOM.newText(json[i].status),
                editar,
                cancelar,
                finalizar
            ]);

            gridOrdens.setRowData(gridOrdens.getRowCount() - 1, json[i].idOrcamento);
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:70px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 3).setAttribute('style', 'text-align:center;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:90px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:40px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:40px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:40px;');
        }
        
        pintaLinhaGrid(gridOrdens);
    }

    ajax.Request(p);
}

function Novo(ajustar) {

    if(!CheckPermissao(25, true, 'Você não possui permissão para cadastrar uma nova ordem de compra', false)){
        return;
    }

    Selector.$('controles').style.display = "none";

    codigoAtual = 0;

    if (ajustar)
        AjustarDivs();


    SelecionaAbas(0);
    Limpar();
    Selector.$('dataCadastro').value = Date.GetDate(false);
    Selector.$('situacao').value = 'Nova Ordem de Compra';
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

    for (var i = 0; i <= 0; i++) {
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
    Selector.$('qtdItens').value = ""
    Selector.$('total').value = "";
    Selector.$('obs').value = "";

    Selector.$('loja').selectedIndex = 0;
    Selector.$('fornecedor').selectedIndex = 0;

    gridItens.clearRows();
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

    if (Selector.$('fornecedor').selectedIndex <= 0) {
        MostrarMsg("Por favor, informe um fornecedor", 'fornecedor');
        return false;
    }

    if (gridItens.getRowCount() <= 0) {
        MostrarMsg("Por favor, adicione uma ou mais itens.", '');
        return false;
    }

    return true;
}

function Gravar() {

    if(!CheckPermissao(25, true, 'Você não possui permissão para editar uma ordem de compra', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&data=' + Selector.$('dataCadastro').value;
    p += '&previsao=' + Selector.$('previsao').value;
    p += '&fornecedor=' + Selector.$('fornecedor').value;
    p += '&obs=' + Selector.$('obs').value;
    p += '&qtdItens=' + Selector.$('qtdItens').value;
    p += '&total=' + Selector.$('total').value;
    p += '&loja=' + Selector.$('loja').value;
    p += '&codigos=' + gridItens.getRowsData();
    p += '&itens=' + gridItens.getContentRows(0);
    p += '&valores=' + gridItens.getContentMoneyRows(3);
    p += '&qtd=' + gridItens.getContentRows(4);
    p += '&totais=' + gridItens.getContentMoneyRows(5);
    p += '&idMateriais=' + gridItens.getContentRows(8);
    p += '&idProdutos=' + gridItens.getContentRows(9);
    p += '&altura=' + gridItens.getContentMoneyRows(10);
    p += '&largura=' + gridItens.getContentMoneyRows(11);

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

    if (codigo === '' || parseInt(codigo) === 0) {
        return;
    }

    Novo(ajustar);
    Selector.$('controles').style.display = "inline-block";
    Limpar();

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Ordem de compra não localizada', '');
        return;
    }

    var json = JSON.parse(ajax.getResponseText());
    codigoAtual = json.codigo;

    Selector.$('botFinalizarOrdemCompra').setAttribute('onclick', 'Finalizar(' + json.codigo + ');');
    Selector.$('botCancelarOrdem').setAttribute('onclick', 'CancelarOrdem(' + json.codigo + ');');
    Selector.$('botGerarPdf').setAttribute('onclick', 'GerarPdfOrdemCompra(' + json.codigo + ');');
    Selector.$('botImprimirOrdem').setAttribute('onclick', 'ImprimirOrdem(' + json.codigo + ');');
    Selector.$('botEnviarOrdemEmail').setAttribute('onclick', 'EnviarPdfOrdemEmail(' + json.codigo + ');');

    Selector.$('codOrdem').innerHTML = json.id;
    Selector.$('dataCadastro').value = json.data;
    Selector.$('previsao').value = json.previsao;
    Selector.$('obs').value = json.obs;

    Selector.$('botCancelarOrdem').style.display = "inline-block";
    Selector.$('botGerarPdf').style.display = "inline-block";
    Selector.$('botFinalizarOrdemCompra').style.display = "inline-block";
    Selector.$('botEnviarOrdemEmail').style.display = "inline-block";
    Selector.$('botImprimirOrdem').style.display = "inline-block";

    if (json.cancelada == '1') {
        Selector.$('botCancelarOrdem').style.display = "none";
        Selector.$('botGerarPdf').style.display = "none";
        Selector.$('botFinalizarOrdemCompra').style.display = "none";
        Selector.$('botEnviarOrdemEmail').style.display = "none";
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

    if (json.idConpag > 0)
        Selector.$('status').innerHTML += " (Conpag " + json.idConpag + ")";

    Select.Show(Selector.$('fornecedor'), json.idFornecedor);
    Select.Show(Selector.$('loja'), json.idLoja);

    MostraItens(json.itens);

    Totaliza();
}

function ImprimirOrdem(idOrdem) {

    if (codigoAtual <= 0)
        return;

    window.open('impressao-ordem-de-compra.html?codigo=' + idOrdem, 'printOrdemCompra');
}

function pad(width, string, padding) {
    return (width <= string.length) ? string : pad(width, padding + string, padding)
}

function Finalizar(idOrdem) {

    if(!CheckPermissao(27, true, 'Você não possui permissão para finalizar uma ordem de compra', false)){
        return;
    }

    if (!isElement('div', 'divFinalizar')) {
        var div = DOM.newElement('div', 'divFinalizar');
        document.body.appendChild(div);
    }

    var div = Selector.$('divFinalizar');


    div.innerHTML = "<h1 class='rotulotitulos' style='font-size: 14px; font-weight: bold; text-align: left;'>Finalizar Ordem de Compra Nº " + pad(6, idOrdem, "0") + "</h1>";

    div.innerHTML += ' <div class="divcontainer" style="max-width: 150px;"> ' +
            '<label>Nº  NF / Recibo</label> ' +
            '<input id="recibo" type="text" style="width:100%;"  class="textbox_cinzafoco" /></div>';


    div.innerHTML += ' <div class="divcontainer" style="max-width: 150px; padding-top:10px"> ' +
            '<input id="gerarContas" type="checkbox" onclick="ocultarConpag()" /> <label for="gerarContas">Gerar Contas à Pagar?</label></div><BR>';


    div.innerHTML += ' <div id="d_centrocusto" class="divcontainer" style="max-width: 230px;"> ' +
            '<label>Centro de Custo </label> ' +
            '<select id="c_centrocusto"  style="width:100%; background:#EEEEEE"  class="combo_cinzafoco"></select></div>';

    div.innerHTML += ' <div  id="d_natureza"  class="divcontainer" style="max-width: 230px;"> ' +
            '<label>Natureza </label> ' +
            '<select id="c_natureza"  style="width:100%; background:#EEEEEE"  class="combo_cinzafoco"></select></div>';

    div.innerHTML += ' <div id="d_total" class="divcontainer" style="max-width: 150px;"> ' +
            '<label>Valor Total</label> ' +
            '<input id="c_total" type="text" style="width:100%; background:#EEEEEE" readonly="readonly"  class="textbox_cinzafoco" /></div>';

    div.innerHTML += ' <div  id="d_parcelas"  class="divcontainer" style="max-width: 80px;"> ' +
            '<label id="lblparcelas">Qtd. Parcelas</label> ' +
            '<input id="c_parcelas" type="text" style="width:100%;" class="textbox_cinzafoco" /></div>';

    div.innerHTML += ' <div  id="d_vencimento"  class="divcontainer" style="max-width: 110px;"> ' +
            '<label id="lblvencimento">1º Vencimento</label> ' +
            '<input id="c_vencimento" type="text" placeHolder="ex 11/11/2016" style="width:100%;" class="textbox_cinzafoco" /></div>';

    div.innerHTML += ' <div  id="dcmdgerarparc" class="divcontainer" style="max-width: 60px; "> ' +
            '<input  type="submit" id="cmdgerarparc" onclick="gerarParcelas(' + idOrdem + ')" class="botaosimplesfoco" style="margin-top:-4px; " value="Gerar Parcelas" /></div>';

    div.innerHTML += "<div id='tblparcelas' style='background:#EEEEEE; margin-bottom:10px; height:200px; width:100%; overflow:auto'> </div>  ";

    div.innerHTML += '<div align="right"><div class="divcontainer" style="max-width: 100px; "> ' +
            '<input type="submit"  class="botaosimplesfoco" onclick="Finalizar_Aux(' + idOrdem + ')"  value="Finalizar" /> ' +
            '</div><div class="divcontainer" style="max-width: 60px; "> ' +
            '<a class="legendaCancelar" onclick="dialogoFinalizar.Close()">Cancelar</a> ' +
            '</div></div>';


    dialogoFinalizar = new caixaDialogo('divFinalizar', 490, 520, 'padrao/', 130);
    dialogoFinalizar.Show();

    ocultarConpag();

    getCentrosCusto(Selector.$('c_centrocusto'), "Selecione...", true);
    getNaturezas(Selector.$('c_natureza'), "Selecione...", true);

    Mask.setData(Selector.$('c_vencimento'));
    Selector.$('recibo').focus();


    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=getDadosConpag&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        dialogoFinalizar.Close();
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    Selector.$('c_total').value = json.total;
    Selector.$('c_vencimento').value = json.data;
    Selector.$('c_parcelas').value = 1;


    gridParcelas = new Table('gridOrdens');
    gridParcelas.table.setAttribute('cellpadding', '4');
    gridParcelas.table.setAttribute('cellspacing', '0');
    gridParcelas.table.setAttribute('class', 'tabela_cinza_foco');

    gridParcelas.addHeader([
        DOM.newText('N°'),
        DOM.newText('Valor'),
        DOM.newText('Vencimento')
    ]);

    Selector.$('tblparcelas').appendChild(gridParcelas.table);
}

function ocultarConpag() {

    if (!Selector.$('gerarContas').checked) {

        dialogoFinalizar.Realinhar(180, 520);
        Selector.$('d_centrocusto').style.display = "none";
        Selector.$('d_natureza').style.display = "none";
        Selector.$('d_total').style.display = "none";
        Selector.$('d_parcelas').style.display = "none";
        Selector.$('d_vencimento').style.display = "none";
        Selector.$('dcmdgerarparc').style.display = "none";
        Selector.$('tblparcelas').style.display = "none";

    } else {

        dialogoFinalizar.Realinhar(490, 520);
        Selector.$('d_centrocusto').style.display = "inline-block";
        Selector.$('d_natureza').style.display = "inline-block";
        Selector.$('d_total').style.display = "inline-block";
        Selector.$('d_parcelas').style.display = "inline-block";
        Selector.$('d_vencimento').style.display = "inline-block";
        Selector.$('dcmdgerarparc').style.display = "inline-block";
        Selector.$('tblparcelas').style.display = "inline-block";


    }


}

function Finalizar_Aux(idOrdem) {

    if (Selector.$('gerarContas').checked) {

        if (Selector.$('c_centrocusto').selectedIndex <= 0) {
            MostrarMsg("Por favor, informe um centro de custo!", 'c_centrocusto');
            return false;
        }

        if (Selector.$('c_natureza').selectedIndex <= 0) {
            MostrarMsg("Por favor, informe um centro de custo!", 'c_natureza');
            return false;
        }

        if (gridParcelas.getRowCount() <= 0) {
            MostrarMsg("Por favor, gere alguma parcela", '');
            return false;
        }

        for (var i = 0; i < gridParcelas.getRowCount(); i++) {
            if (!Date.isDate(gridParcelas.getCellObject(i, 2).value)) {
                MostrarMsg("Por favor, informe uma data válida para a parcela de número " + gridParcelas.getCellText(i, 0), '');
                return;
            }

            if (Number.parseFloat(gridParcelas.getCellObject(i, 1).value) <= 0) {
                MostrarMsg("Por favor, informe um valor válido para a  parcela de número " + gridParcelas.getCellText(i, 0), '');
                return;
            }
        }
    }

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=Finalizar';
    p += '&codigo=' + idOrdem;
    p += '&gerarcontas=' + (Selector.$('gerarContas').checked ? 1 : 0);
    p += '&recibo=' + Selector.$('recibo').value;
    p += '&centrocusto=' + Selector.$('c_centrocusto').value;
    p += '&natureza=' + Selector.$('c_natureza').value;
    p += '&total=' + Selector.$('c_total').value;
    p += '&qtdParcelas=' + Selector.$('c_parcelas').value;
    p += '&parcela=' + gridParcelas.getContentRows(0);
    p += '&valor=' + gridParcelas.getContentObjectValueMoneyRows(1);
    p += '&vencimento=' + gridParcelas.getContentObjectValueRows(2);

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        MostrarMsg('Problemas ao gravar a ordem de compra. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
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
    div.innerHTML = "<div id='tblitem' style='background:#FFF; height:360px; width:100%; overflow:auto'> </div>";

    dialogoVisualizar = new caixaDialogo('divVisualizar', 400, 720, 'padrao/', 130);
    dialogoVisualizar.Show();


    gitens = new Table('gridItens');
    gitens.table.setAttribute('cellpadding', '4');
    gitens.table.setAttribute('cellspacing', '0');
    gitens.table.setAttribute('class', 'tabela_cinza_foco');

    gitens.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Descrição'),
        DOM.newText('altura'),
        DOM.newText('largura'),
        DOM.newText('Valor Unit.'),
        DOM.newText('Qtde'),
        DOM.newText('Valor Total')

    ]);

    Selector.$('tblitem').appendChild(gitens.table);

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=getItens&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var cor = false;
    var json = JSON.parse(ajax.getResponseText());

    for (var i = 0; i < json.length; i++) {

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
        excluir.setAttribute('onclick', 'ExcluirItem(' + gridItens.getRowCount() + ')');

        gitens.addRow([
            DOM.newText(gridItens.getRowCount() + 1),
            DOM.newText((json[i].material == "" ? "PRODUTO" : "MATERIAL")),
            DOM.newText((json[i].material == "" ? json[i].produto : json[i].material)),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].total)
        ]);

        gitens.setRowData(gitens.getRowCount() - 1, json[i].codigo);
        gitens.getCell(gitens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:40px');
        gitens.getCell(gitens.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 3).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 4).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 5).setAttribute('style', 'text-align:right;');
        gitens.getCell(gitens.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 7).setAttribute('style', 'text-align:right;');

        if (cor) {
            cor = false;
            gitens.setRowBackgroundColor(gitens.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gitens.setRowBackgroundColor(gitens.getRowCount() - 1, "#FFF");
        }
    }
}

function CancelarOrdem(idOrdem) {

    if(!CheckPermissao(26, true, 'Você não possui permissão para cancelar uma ordem de compra', false)){
        return;
    }

    if (idOrdem <= 0)
        return;

    mensagemCancelarOrdem = new DialogoMensagens("prompt", 120, 400, 150, "4", "Alerta!", "Deseja realmente cancelar esta ordem de compra ?", "SIM", "CancelarOrdemAux(" + idOrdem + ")", true, "");
    mensagemCancelarOrdem.Show();
}

function CancelarOrdemAux(idOrdem) {

    mensagemCancelarOrdem.Close();

    if (idOrdem <= 0)
        return;


    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', true);
    var p = 'action=CancelarOrdem';
    p += '&codigo=' + idOrdem;

    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK())
            return;

        if (parseInt(ajax.getResponseText()) == 1) {
            MostrarMsg('Ordem de compra cancelada com sucesso', '');
            Mostra(idOrdem, false);
            MostrarOrdens();
        }
        else {
            MostrarMsg('Problemas ao cancelar a ordem de compra. Tente novamente, caso o erro persista contate o suporte técnico', '');
        }

        Selector.$('imgCancelar').src = 'imagens/cancelar.png';
    };

    Selector.$('imgCancelar').src = 'imagens/loading.gif';
    ajax.Request(p);
}

function MostraItens(array) {

    gridItens.clearRows();

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
        editar.setAttribute('onclick', 'AdicionarItem(' + gridItens.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirItem(' + gridItens.getRowCount() + ')');

        var alt = '';
        if (Number.parseFloat(json[i].altura) > 0 || Number.parseFloat(json[i].altura) > 0) {
            alt = ' (' + parseFloat(json[i].altura) + ' X ' + parseFloat(json[i].largura) + ')';
        }

        gridItens.addRow([
            DOM.newText(gridItens.getRowCount() + 1),
            DOM.newText((json[i].material == "" ? "PRODUTO" : "MATERIAL")),
            DOM.newText((json[i].material == "" ? json[i].produto : json[i].material) + alt),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].total),
            editar,
            excluir,
            DOM.newText(json[i].idMaterial),
            DOM.newText(json[i].idProduto),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura)
        ]);

        gridItens.setRowData(gridItens.getRowCount() - 1, json[i].codigo);
        gridItens.getCell(gridItens.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;width:40px');
        gridItens.getCell(gridItens.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 6).setAttribute('style', 'text-align:right;');
        gridItens.getCell(gridItens.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');

        gridItens.getCell(gridItens.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:20px');
        gridItens.getCell(gridItens.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:20px');

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
            gridItens.setRowBackgroundColor(gridItens.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridItens.setRowBackgroundColor(gridItens.getRowCount() - 1, "#FFF");
        }
    }

    gridItens.hiddenCol(8);
    gridItens.hiddenCol(9);
    gridItens.hiddenCol(10);
    gridItens.hiddenCol(11);
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
    label.innerHTML = 'Altura (cm) ';
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
    label.innerHTML = 'Largura (cm)';
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
    label.innerHTML = 'Valor Unit.* ';
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
                if (parseFloat(gridItens.getCellText(i, 10)) == parseFloat(Selector.$('altura').value) && parseFloat(gridItens.getCellText(i, 11)) == parseFloat(Selector.$('largura').value)) {
                    MostrarMsg('Este ' + (Selector.$('material').checked ? "material" : "produto") + " ja se encontra na lista.", '');
                    return;
                }
            }
        }
    }


    if (linha >= 0) {
        var alt = '';
        if (Number.parseFloat(Selector.$('altura').value) > 0 || Number.parseFloat(Selector.$('largura').value) > 0) {
            alt = ' (' + parseFloat(Selector.$('altura').value) + ' X ' + parseFloat(Selector.$('largura').value) + ')';
        }

        gridItens.setCellText(linha, 1, (Selector.$('material').checked ? 'MATERIAL' : 'PRODUTO'));
        gridItens.setCellText(linha, 2, Select.GetText(Selector.$('cmbItens')) + alt);
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
        excluir.setAttribute('onclick', 'ExcluirItem(' + gridItens.getRowCount() + ')');

        var alt = '';
        if (Number.parseFloat(Selector.$('altura').value) > 0 || Number.parseFloat(Selector.$('largura').value) > 0) {
            alt = ' (' + parseFloat(Selector.$('altura').value) + ' X ' + parseFloat(Selector.$('largura').value) + ')';
        }

        gridItens.addRow([
            DOM.newText(gridItens.getRowCount() + 1),
            DOM.newText((Selector.$('material').checked ? 'MATERIAL' : 'PRODUTO')),
            DOM.newText(Select.GetText(Selector.$('cmbItens')) + alt),
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

        gridItens.hiddenCol(8);
        gridItens.hiddenCol(9);
        gridItens.hiddenCol(10);
        gridItens.hiddenCol(11);
    }

    dialogoCadastro.Close();

    Totaliza();

}

function getItensArtista() {

    if (Selector.$('cmbItens').value == Selector.$('cmbItens').name)
        return;

    Selector.$('cmbItens').name = Selector.$('cmbItens').value;

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
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
        getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));
        return;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', ascinc);
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

            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_imagem').src = json[0].imagem;
            Selector.$('o_imagem').setAttribute('name', json[0].img);
            Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');

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
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');

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

        var ajax = new Ajax('POST', 'php/ordem-de-compras.php', true);
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

        /*if (Selector.$('o_acabamentoI').value !== Selector.$('o_acabamentoI').name) {
         Selector.$('o_acabamentoI').name = Selector.$('o_acabamentoI').value;
         }else {
         return;
         }*/

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

        //var valor = Selector.$('o_valor');
        //var valorTotal = Selector.$('o_valorTotal');

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

            valor.value = json.valorObra;
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            TotalizaObras(true, false, false, false);
            Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
}

function ExcluirItemAux(linha) {

    if (linha >= 0) {

        mensagemExcluirItem.Close();

        if (gridItens.getRowCount() == 1) {
            gridItens.clearRows();
        } else {

            gridItens.deleteRow(linha);

            var cor = false;
            for (var i = 0; i <= gridItens.getRowCount() - 1; i++) {

                gridItens.setCellText(i, 0, i + 1);
                gridItens.getCellObject(i, 6).setAttribute('onclick', 'AdicionarItem(' + i + ');');
                gridItens.getCellObject(i, 7).setAttribute('onclick', 'ExcluirItemAux(' + i + ');');

                if (cor) {
                    cor = false;
                    gridItens.setRowBackgroundColor(i, "#F5F5F5");

                } else {
                    cor = true;
                    gridItens.setRowBackgroundColor(i, "#FFF");
                }
            }
        }

        Totaliza();

    }

}

function ExcluirItem(linha) {


    if (Selector.$('situacao').value == "Ordem Cancelada" || Selector.$('situacao').value == "Ordem Finalizada") {
        MostrarMsg("Não é possivel editar " + Selector.$('situacao').value, 'dataCadastro');
        return;
    }

    mensagemExcluirItem = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este item?", "OK", "ExcluirItemAux(" + linha + ")", true, "");
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

    Selector.$('total').value = Number.FormatMoeda(gridItens.SumCol(5));
    Selector.$('qtdItens').value = gridItens.getRowCount();

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

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=ExcluirImagem';
    p += '&imagem=' + file;
    ajax.Request(p);
}

function GerarMiniaturaImagem() {

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
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

function GerarPdfOrdemCompra(codigo) {

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', true);
    var p = 'action=GerarPdfOrdem';
    p += '&idOrdem=' + codigo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() != '') {
            window.open(ajax.getResponseText());
        }
    }

    ajax.Request(p);

}

function EnviarPdfOrdemEmail(idOrdem) {


    if (Selector.$('fornecedor').value <= 0) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Por Favor Selecione um Fornecedor ", "OK", "", false, "fornecedor");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', true);
    var p = 'action=EnviarPdfOrdemEmail';
    p += '&idOrdem=' + idOrdem;
    p += '&fornecedor=' + Selector.$('fornecedor').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgOrdemEmail').setAttribute('src', 'imagens/email2.png');

        if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Favor cadastrar um email para este fornecedor ", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar a ordem de compra por email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('imgOrdemEmail').setAttribute('src', 'imagens/grid_carregando.gif');
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

 