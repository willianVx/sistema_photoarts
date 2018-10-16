checkSessao();
CheckPermissao(117, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de Aniversáriantes</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataSemanaDeAte(Selector.$('de'), Selector.$('ate'));
    Lista();

    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Lista() {

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-aniversariantes.php', true);
    var p = 'action=MostrarAniversariantes';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum aniversariante localizado";
            return;
        }

        var div = Selector.$('tabela');

        grid = new Table('grid');
        grid.table.setAttribute('cellpadding', '3');
        grid.table.setAttribute('cellspacing', '0');
        grid.table.setAttribute('class', 'tabela_cinza_foco');

        grid.addHeader([
            DOM.newText('Nome'),
            DOM.newText('Data Nascimento'),
            DOM.newText('Email'),
            DOM.newText(''),
            DOM.newText('')
        ]);

        div.appendChild(grid.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var email;
        var ver;
        var cor;

        for (var i = 0; i < json.length; i++) {

            email = DOM.newElement('img');
            email.setAttribute('src', 'imagens/email2.png');
            email.setAttribute('title', 'Enviar Email');
            email.setAttribute('style', 'cursor:pointer');
            email.setAttribute('onclick', 'EnviarEmailParabens(' + grid.getRowCount() + ');');

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Cliente');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'window.location="cadastro-de-colecionadores.html?idCliente=' + json[i].idCliente + '"');

            grid.addRow([
                DOM.newText(json[i].nome),
                DOM.newText(json[i].dataNascimento),
                DOM.newText(json[i].email),
                email,
                ver
            ]);

            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:50px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:50px;');

            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }

        Selector.$('contador').innerHTML = json.length + " aniversariante(s) localizado(s)";
    };

    ajax.Request(p);
}

function botExportar_onClick() {

    if(!CheckPermissao(119, true, 'Você não possui permissão para gerar excel do relatório de aniversariantes', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-aniversariantes.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;

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

    if(!CheckPermissao(118, true, 'Você não possui permissão para imprimir o relatório de aniversariantes', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-aniversariantes');
}

function Limpar() {

    setDataSemanaDeAte(Selector.$('de'), Selector.$('ate'));
}

function EnviarEmailParabens(linha){

    if(grid.getCellText(linha, 2) == ''){
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este cliente não possui e-mail cadastrado, cadastre um e-mail para enviar o pedido.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var email = DOM.newElement('img');
    email.setAttribute('src', 'imagens/email2.png');
    email.setAttribute('title', 'Enviar Email');
    email.setAttribute('style', 'cursor:pointer');
    email.setAttribute('onclick', 'EnviarEmailParabens(' + linha + ');');

    var carregando = DOM.newElement('img');
    carregando.setAttribute('src', 'imagens/grid_carregando.gif');

    var ajax = new Ajax('POST', 'php/relatorio-de-aniversariantes.php', true);
    var p = 'action=EnviarEmailParabens';
    p += '&cliente=' + grid.getCellText(linha, 0);
    p += '&email=' + grid.getCellText(linha, 2);
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        grid.setCellObject(linha, 3, email);
        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    grid.setCellObject(linha, 3, carregando);
    ajax.Request(p);
}