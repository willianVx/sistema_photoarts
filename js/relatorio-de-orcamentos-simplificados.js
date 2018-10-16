checkSessao();
CheckPermissao(64, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de Orçamentos Simplificados</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getLojas(Selector.$('galeria'), 'Todas', true);
    CarregaMarchands(true);
    getArtistas(Selector.$('artista'), 'Selecione um artista', true);
    Selector.$('tipoProduto').selectedIndex = 0;
    Lista();

    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function CarregaMarchands(ascinc) {

    if (Selector.$('galeria').value !== Selector.$('galeria').name) {
        Selector.$('galeria').name = Selector.$('galeria').value;
        getVendedores(Selector.$('marchand'), "Todos", ascinc, 'MARCHANDS', Selector.$('galeria').value);
    }else {
        return;
    }
}

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Lista() {

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-orcamentos-simplificados.php', true);
    var p = 'action=MostrarOrcamentos';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idTipoProduto=' + Selector.$('tipoProduto').value;
    p += '&idArtista=' + Selector.$('artista').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum orçamento localizado";
            return;
        }

        var div = Selector.$('tabela');

        gridOrcamentos = new Table('gridOrcamentos');
        gridOrcamentos.table.setAttribute('cellpadding', '3');
        gridOrcamentos.table.setAttribute('cellspacing', '0');
        gridOrcamentos.table.setAttribute('class', 'tabela_cinza_foco');

        gridOrcamentos.addHeader([
            DOM.newText('N°'),
            DOM.newText('Data Cadastro'),
            DOM.newText('Data Validade'),
            DOM.newText('Loja'),
            DOM.newText('Colecionador'),
            DOM.newText('Obras'),
            DOM.newText('Total'),
            DOM.newText('Marchand'),
            DOM.newText('Status'),
            DOM.newText('')
        ]);

        div.appendChild(gridOrcamentos.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
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
            ver.setAttribute('onclick', 'AbrirOrcamento(' + json[i].idOrcamentoSimplificado + ')');

            gridOrcamentos.addRow([
                DOM.newText(json[i].numeroOrcamento),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].dataValidade),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].marchand),
                DOM.newText(json[i].descricaoStatus),
                ver
            ]);

            gridOrcamentos.setRowData(gridOrcamentos.getRowCount() - 1, json[i].idOrcamentoSimplificado);
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 6).setAttribute('style', 'text-align:right; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 8).setAttribute('style', 'text-align:center;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:30px;');

            if (cor) {
                cor = false;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#FFF");
            }
        }

        gridOrcamentos.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('Total'),
            DOM.newText(Number.FormatMoeda(gridOrcamentos.SumCol(6))),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);

        gridOrcamentos.getRow(gridOrcamentos.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 0).setAttribute('style', 'font-size:18px; text-align:center;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 1).setAttribute('style', 'font-size:18px; text-align:center; width:100px;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 2).setAttribute('style', 'font-size:18px; text-align:center; width:100px;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 3).setAttribute('style', 'font-size:18px; text-align:left;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 4).setAttribute('style', 'font-size:18px; text-align:left;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 5).setAttribute('style', 'font-size:18px; text-align:left;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 6).setAttribute('style', 'font-size:18px; text-align:right; width:100px;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 7).setAttribute('style', 'font-size:18px; text-align:left;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 8).setAttribute('style', 'font-size:18px; text-align:center;');
        gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 9).setAttribute('style', 'font-size:18px; text-align:center; width:30px;');

        Selector.$('contador').innerHTML = json.length + " orçamento(s) localizado(s)";
    };

    ajax.Request(p);
}

function AbrirOrcamento(idOrc) {

    if (idOrc <= 0)
        return;

    window.location = 'orcamentos-simplificados.html?idOrcamento=' + idOrc;
}

function botExportar_onClick() {

    if(!CheckPermissao(66, true, 'Você não possui permissão para gerar excel do relatório de orçamentos', false)){
        return;
    }

    if (gridOrcamentos.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-orcamentos-simplificados.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idTipoProduto=' + Selector.$('tipoProduto').value;
    p += '&idArtista=' + Selector.$('artista').value;

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

    if(!CheckPermissao(65, true, 'Você não possui permissão para imprimir o relatório de orçamentos', false)){
        return;
    }

    if (gridOrcamentos.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-orcamentos-simplificados');
}

function Limpar() {

    setDataDeAte(Selector.$('de'), Selector.$('ate'));

    Selector.$('galeria').selectedIndex = 0;
    Selector.$('marchand').selectedIndex = 0;
    gridOrcamentos.clearRows();
    Selector.$('contador').innerHTML = "";
    Selector.$('de').focus();
    Selector.$('tipoProduto').selectedIndex = 0;
    Selector.$('artista').selectedIndex = 0;
}