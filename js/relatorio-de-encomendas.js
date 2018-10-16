checkSessao();
CheckPermissao(67, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de Encomendas</div>";
    carregarmenu();
    getDadosUsuario();
    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getLojas(Selector.$('galeria'), 'Todas', true);
    CarregaMarchands(true);
    //getStatusPedido(Selector.$('status'), 'Todos', true);
    Select.AddItem(Selector.$('status'), 'REALIZADO', 1);
    Select.AddItem(Selector.$('status'), 'EM PRODUÇÃO', 2);
    Select.AddItem(Selector.$('status'), 'PREPARADO P/ ENVIO', 3);
    Select.AddItem(Selector.$('status'), 'DISPONÍVEL P/ RETIRAR', 4);
    Select.AddItem(Selector.$('status'), 'EM TRANSPORTE', 5);
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

    if (Selector.$('botPesquisar').value == 'Pesquisando...')
        return;

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-encomendas.php', true);
    var p = 'action=MostrarPedidos';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idStatus=' + Selector.$('status').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum pedido localizado no período";
            Selector.$('botPesquisar').value = 'Pesquisar';
            Selector.$('tabela').style.minHeight = '30px';
            return;
        }

        var div = Selector.$('tabela');

        grid = new Table('grid');
        grid.table.setAttribute('cellpadding', '3');
        grid.table.setAttribute('cellspacing', '0');
        grid.table.setAttribute('class', 'tabela_cinza_foco');

        grid.addHeader([
            DOM.newText('N°'),
            DOM.newText('Data Cadastro'),
            DOM.newText('Data Pedido'),
            DOM.newText('Data Entrega'),
            DOM.newText('Colecionador'),
            DOM.newText('Obras'),
            DOM.newText('Status'),
            DOM.newText('')
        ]);

        div.appendChild(grid.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var ver;
        var obras;
        var cor;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'AbrirPedido(' + json[i].idPedido + ')');

            grid.addRow([
                DOM.newText(json[i].numeroPedido),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].dataVenda),
                DOM.newText(json[i].dataEntrega),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].descricaoStatus),
                ver
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idPedido);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:40px;');

            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }

        Selector.$('contador').innerHTML = json.length + " pedido(s) localizado(s)";
        Selector.$('botPesquisar').value = 'Pesquisar';
    };

    Selector.$('botPesquisar').value = 'Pesquisando...';
    ajax.Request(p);
}

function AbrirPedido(idPed) {
    if (idPed <= 0)
        return;

    window.location = 'pedidos.html?idPedido=' + idPed;
}

function botExportar_onClick() {

    if(!CheckPermissao(69, true, 'Você não possui permissão para gerar excel do relatório de pedidos', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-encomendas.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idStatus=' + Selector.$('status').value;

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

    if(!CheckPermissao(68, true, 'Você não possui permissão para imprimir o relatório de pedidos', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-encomendas');
}

function Limpar() {

    setDataDeAte(Selector.$('de'), Selector.$('ate'));

    Selector.$('galeria').selectedIndex = 0;
    Selector.$('marchand').selectedIndex = 0;

    grid.clearRows();
    Selector.$('contador').innerHTML = "";

    Selector.$('de').focus();
}

function GerarPdf() {

    var ajax = new Ajax('POST', 'php/relatorio-de-encomendas.php', true);
    var p = 'action=GerarPdf';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idStatus=' + Selector.$('status').value;

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