checkSessao();
CheckPermissao(170, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de RT</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Mask.setOnlyNumbers(Selector.$('periodo'));
    Mask.setOnlyNumbers(Selector.$('contrato'));
    Lista();

    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Lista() {

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-rt.php', true);
    var p = 'action=MostrarRT';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&periodoDiasContrato=' + Selector.$('periodo').value;
    p += '&numeroContrato=' + Selector.$('contrato').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum RT localizado";
            return;
        }

        var div = Selector.$('tabela');

        gridRT = new Table('gridRT');
        gridRT.table.setAttribute('cellpadding', '3');
        gridRT.table.setAttribute('cellspacing', '0');
        gridRT.table.setAttribute('class', 'tabela_cinza_foco');

        gridRT.addHeader([
            DOM.newText('N° Pedido'),
            DOM.newText('Colecionador'),
            DOM.newText('Taxa Comissão'),
            DOM.newText('Nº Contrato'),
            DOM.newText('Data Contrato'),
            DOM.newText('Período Dias Contrato'),
            DOM.newText('Obs Contrato'),
            DOM.newText('Devolvido'),
            DOM.newText('')
        ]);

        div.appendChild(gridRT.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var ver;
        var cor;

        for (var i = 0; i < json.length; i++) {

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'AbrirPedido(' + json[i].idVenda + ', ' + json[i].idCliente + ')');

            gridRT.addRow([
                DOM.newText(json[i].numeroPedido),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].comissaoContrato + " %"),  
                DOM.newText(json[i].numeroContrato),
                DOM.newText(json[i].dataContrato),
                DOM.newText(json[i].periodoDiasContrato),
                DOM.newText(json[i].obsContrato),
                DOM.newText((json[i].devolvido == "1" ? "SIM" : "NÃO")), 
                ver
            ]);

            gridRT.setRowData(gridRT.getRowCount() - 1, json[i].idVenda);
            gridRT.getCell(gridRT.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px');
            gridRT.getCell(gridRT.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
            gridRT.getCell(gridRT.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            gridRT.getCell(gridRT.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:90px;');
            gridRT.getCell(gridRT.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:100px;');
            gridRT.getCell(gridRT.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:140px;');
            gridRT.getCell(gridRT.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
            gridRT.getCell(gridRT.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:90px;');
            gridRT.getCell(gridRT.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:40px;');

            if (cor) {
                cor = false;
                gridRT.setRowBackgroundColor(gridRT.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridRT.setRowBackgroundColor(gridRT.getRowCount() - 1, "#FFF");
            }
        }

        Selector.$('contador').innerHTML = json.length + " RT(s) localizado(s)";
    };

    ajax.Request(p);
}

function AbrirPedido(idPedido, idCliente) {

    if (idPedido <= 0)
        return;

    window.location = 'pedidos.html?idPedido=' + idPedido + '&idcliente=' + idCliente;
}

function botExportar_onClick() {

    if(!CheckPermissao(172, true, 'Você não possui permissão para gerar excel do relatório de RT', false)){
        return;
    }

    if (gridRT.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-rt.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&periodoDiasContrato=' + Selector.$('periodo').value;
    p += '&numeroContrato=' + Selector.$('contrato').value;

    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }
}

function Imprimir_onClick() {

    if(!CheckPermissao(171, true, 'Você não possui permissão para imprimir o relatório de RT', false)){
        return;
    }

    if (gridRT.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-rt');
}

function Limpar() {

    setDataDeAte(Selector.$('de'), Selector.$('ate'));

    Selector.$('periodo').value = "";
    Selector.$('contrato').value = "";

    gridRT.clearRows();
    Selector.$('contador').innerHTML = "";

    Selector.$('de').focus();
}