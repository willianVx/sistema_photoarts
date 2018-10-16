checkSessao();

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Vendedores</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Vendedor'),
        DOM.newText('Desconto'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);
    Mostra();
};

function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-vendedores.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgEventos').style.display = "block";
            return;
        }

        Selector.$('divTabela').style.display = "block";
        Selector.$('msgEventos').style.display = "none";

        var json = JSON.parse(ajax.getResponseText()  );
        var editar;

        var cor = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].codigo + ', "' + json[i].vendedor + '", "' + json[i].descontoMaximo + '", ' + json[i].ativo + ');');

            grid.addRow([
                DOM.newText(json[i].vendedor),
                DOM.newText(json[i].descontoMaximo),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:right; width:150px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:90px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));

            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function promptCadastro(codigo, nome, desconto, ativo) {

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Vendedor: ';
    lblnome.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute("onkeydown", "gravar_onkeydown(event, " + codigo + ", Gravar);");
    txtnome.setAttribute("style", 'margin-left:10px; width:265px');

    var lblDesconto = DOM.newElement('label');
    lblDesconto.innerHTML = 'Desconto Máximo: ';
    lblDesconto.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtDesconto = DOM.newElement('text');
    txtDesconto.setAttribute('id', 'desconto');
    txtDesconto.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtDesconto.setAttribute("onkeydown", "gravar_onkeydown(event, " + codigo + ", Gravar);");
    txtDesconto.setAttribute("style", 'margin-left:10px; width:155px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    //box.setAttribute('class', 'textbox_cinza');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute("style", 'margin-right:5px;');
    labelativo.setAttribute("for", 'ativo');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = 'Gravar';

    //======== Tabela =========//
    divCadastro.appendChild(lblnome);
    divCadastro.appendChild(txtnome);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(lblDesconto);
    divCadastro.appendChild(txtDesconto);
    divCadastro.appendChild(boxativo);
    divCadastro.appendChild(labelativo);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(cmdTexto1);
    divCadastro.innerHTML += '<br>';

    dialogoCadastro = new caixaDialogo('divCadastro', 175, 380, 'padrao/', 130);
    dialogoCadastro.Show();

    Selector.$('nome').focus();
    Mask.setMoeda(Selector.$('desconto'));
    Selector.$('ativo').checked = true;

    if (codigo > 0) {

        Selector.$('nome').value = nome;
        Selector.$('desconto').value = desconto;

        if (ativo !== 1)
            Selector.$('ativo').checked = false;
    }
}

function Gravar(codigo) {

    var nome = Selector.$('nome').value;
    var desconto = Selector.$('desconto').value;

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Nome.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    if (desconto.trim() === '' || desconto.trim() === ',') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Desconto Máximo.", "OK", "", false, "desconto");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-vendedores.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nome=' + nome;
    p += '&desconto=' + desconto;
    p += '&ativo=' + ativo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == '2') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este vendedor já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o vendedor. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            dialogoCadastro.Close();
            Selector.$('busca').value = '';
            Mostra();
            return;
        }
    };

    Selector.$('gravar').disabled = true;
    Selector.$('gravar').innerHTML = "Gravando";

    ajax.Request(p);
}