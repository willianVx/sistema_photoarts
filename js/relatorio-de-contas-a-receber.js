checkSessao();
CheckPermissao(91, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Rel. Contas à Receber</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getLojas(Selector.$('galeria'), 'Todas', true);
    CarregaMarchands(true);
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

    var ajax = new Ajax('POST', 'php/relatorio-de-contas-a-receber.php', true);
    var p = 'action=Pesquisar';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idLoja=' + Selector.$('galeria').value;
    p += '&idVendedor=' + Selector.$('marchand').value;
    p += '&situacao=' + Selector.$('situacao').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum orçamento localizado";
            return;
        }

        var div = Selector.$('tabela');

        grid = new Table('grid');
        grid.table.setAttribute('cellpadding', '3');
        grid.table.setAttribute('cellspacing', '0');
        grid.table.setAttribute('class', 'tabela_cinza_foco');

        grid.addHeader([
            DOM.newText('Nº Venda'),
            DOM.newText('Data Pedido'),
            DOM.newText('Loja'),
            DOM.newText('Colecionador'),
            DOM.newText('Marchand'),
            DOM.newText('Parcela'),
            DOM.newText('Valor'),
            DOM.newText('Dt. Compensação'),
            DOM.newText('Valor Comp'),
            DOM.newText('Forma de Pag.'),
            DOM.newText('Nº Recibo'),
            DOM.newText('Situação'),
            DOM.newText('')
        ]);

        div.appendChild(grid.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var valorTotalAntecipacao = 0;

        for (var i = 0; i < json.length; i++) {

            valorTotalAntecipacao += parseFloat(json[i].valorAntecipacao);

            var ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Orçamento');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Abrir(' + json[i].idVenda + ')');

            grid.addRow([
                DOM.newText(json[i].id),
                DOM.newText(json[i].data),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].vendedor),
                DOM.newText(json[i].parcela + "/" + json[i].parcelas),
                DOM.newText(json[i].valor),
                DOM.newText(json[i].compensacao),
                DOM.newText(json[i].valorComp),
                DOM.newText(json[i].forma),
                DOM.newText(json[i].recibo),
                DOM.newText(json[i].situacao),
                ver
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idOrcamento);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width: 100px');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:right;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width: 100px;');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:right;');
            grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 11).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:40px;');
            pintaLinhaGrid(grid);
        }

        grid.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('Total'),
            DOM.newText('R$:. ' + Number.FormatMoeda(grid.SumCol(6))),
            DOM.newText('')
        ]);

        grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');
        grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'font-size:16px; text-align:right;');
        grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'font-size:16px; text-align:right;');

        if(Selector.$('situacao').value == '1' || Selector.$('situacao').value == '2' && valorTotalAntecipacao > 0){

            grid.addRow([
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText('Total Antecipação'),
                DOM.newText('R$:. ' + Number.FormatDinheiro(valorTotalAntecipacao)),
                DOM.newText('')
            ]);

            grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');
            grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'font-size:16px; text-align:right;');
            grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'font-size:16px; text-align:right;');
        }

        Selector.$('contador').innerHTML = json.length + " registros(s) localizado(s)";
    };

    ajax.Request(p);
}

function Abrir(id) {

    if (id <= 0)
        return;

    window.location = 'pedidos.html?idPedido=' + id;
}

function botExportar_onClick() {

    if(!CheckPermissao(93, true, 'Você não possui permissão para gerar o excel do relatório de contas à receber', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-contas-a-receber.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idLoja=' + Selector.$('galeria').value;
    p += '&idVendedor=' + Selector.$('marchand').value;
    p += '&situacao=' + Selector.$('situacao').value;

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

    if(!CheckPermissao(92, true, 'Você não possui permissão para imprimir o relatório de contas à receber', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-contas-a-receber');
}

function Limpar() {
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Selector.$('galeria').selectedIndex = 0;
    Selector.$('marchand').selectedIndex = 0;
    grid.clearRows();
    Selector.$('contador').innerHTML = "Nenhum registro localizado";
    Selector.$('de').focus();
}