checkSessao();

window.onload = function () {

    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Tipo de logistica'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);
    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);
    Mostra();

};


function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/logisticas.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgLogistica').style.display = "block";
            return;
        }
        
        Selector.$('divTabela').style.display = "block";
        Selector.$('msgLogistica').style.display = "none";

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
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:90px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px');

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


    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Logistica';
    lblnome.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('onkeydown', 'gravar_onkeydown(event , ' + codigo + ', Gravar)');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute("style", 'margin-left:10px; width:310px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    //box.setAttribute('class', 'textbox_cinza');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('for', 'ativo');
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute("style", 'margin-right:5px;');


    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = 'Gravar';

    /*cmdTexto = DOM.newElement('div', 'cancelar');
     cmdTexto.setAttribute('class', 'botaosimplesfoco');
     cmdTexto.setAttribute('style', ' display:inline-block; margin-left:15px; float:right;');
     cmdTexto.setAttribute('onclick', 'dialogoCadastro.Close();');
     cmdTexto.innerHTML = 'Cancelar';*/

    //======== Tabela =========//
    divCadastro.innerHTML += '<br>';
    divCadastro.appendChild(lblnome);
    divCadastro.appendChild(txtnome);
    divCadastro.innerHTML += '<br><br><br>';
    divCadastro.appendChild(boxativo);
    divCadastro.appendChild(labelativo);
    //divCadastro.appendChild(cmdTexto);
    divCadastro.appendChild(cmdTexto1);
    divCadastro.innerHTML += '<br>';

    Selector.$('ativo').checked = true;

    if (codigo > 0) {

        Selector.$('nome').value = nome;

        if (ativo != 1)
            Selector.$('ativo').checked = false;
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 160, 420, 'padrao/', 130);

    dialogoCadastro.Show();

    Selector.$('nome').focus();

}

function Gravar(codigo) {

    var nome = Selector.$('nome').value;

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor preencha o campo logistica.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/logisticas.php', true);
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
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este tipo de logística já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o tipo de logística. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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