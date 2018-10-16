checkSessao();
CheckPermissao(152, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Tipos de Contatos</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Tipo Contato'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";

    Mostra();
};

window.onresize = function () {

    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-tipos-de-contatos.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgContatos').style.display = "block";
            return;
        }

        Selector.$('divTabela').style.display = "block";
        Selector.$('msgContatos').style.display = "none";

        var json = JSON.parse(ajax.getResponseText()  );
        var editar;

        var cor = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].codigo + ' , "' + json[i].nome + '" , ' + json[i].ativo + ');');

            grid.addRow([
                DOM.newText(json[i].nome),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:50px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:50px');

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

function promptCadastro(codigo, nome, ativo) {

        if(!CheckPermissao(153, true, 'Você não possui permissão para cadastrar/Editar um tipo de contato', false)){
            return;
        }
    

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var div = Selector.$('divCadastro');
    div.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute("style", "float:right;");

    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Contato';

    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "*";
    lblast2.setAttribute("style", "color:red;");

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('onkeydown', 'gravar_onkeydown(event , ' + codigo + ', Gravar)');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute("style", 'width:317px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('for', 'ativo');
    labelativo.setAttribute("style", 'margin-right:5px;');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = 'Gravar';

    //======== Tabela =========//
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast2);
    divform.appendChild(txtnome);
    divform.innerHTML += '<br>';
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.appendChild(cmdTexto1);

    Selector.$('ativo').checked = true;

    if (codigo > 0) {

        Selector.$('nome').value = nome;

        if (ativo != 1)
            Selector.$('ativo').checked = false;
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 180, 400, 'padrao/', 130);
    dialogoCadastro.Show();
    Selector.$('nome').focus();
}

function Gravar(codigo) {

    if(!CheckPermissao(153, true, 'Você não possui permissão para editar um tipo de contato', false)){
        return;
    }

    var nome = Selector.$('nome').value;

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor preencha o campo contato.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-tipos-de-contatos.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nome=' + nome;
    p += '&ativo=' + ativo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == '2') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este tipo de contato já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o tipo de contato. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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