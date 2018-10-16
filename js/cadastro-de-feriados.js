checkSessao();
CheckPermissao(136, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Feriados</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Data'),
        DOM.newText('Data Final'),
        DOM.newText('Nome'),
        DOM.newText('Bancario'),
        DOM.newText('Operacional'),
        DOM.newText('Recorrente'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('divTabela').appendChild(grid.table);
    Selector.$('busca').focus();
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";

    Mostrar();
};

window.onresize = function () {

    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

function Mostrar() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-feriados.php', true);
    var p = 'action=Mostrar';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgFeriados').style.display = "block";
            return;
        }

        Selector.$('divTabela').style.display = "block";
        Selector.$('msgFeriados').style.display = "none";

        var json = JSON.parse(ajax.getResponseText() );
        var editar;
        var cores = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('width', '20');
            editar.setAttribute('height', '20');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].codigo + ', "' + json[i].data + '", "' + json[i].datafinal + '", "' + json[i].nome + '", ' + json[i].bancario + ', ' + json[i].operacional + ', ' + json[i].recorrente + ', ' + json[i].ativo + ');');
            editar.setAttribute('title', 'Editar Feriado');

            grid.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].datafinal),
                DOM.newText(json[i].nome),
                DOM.newText((json[i].bancario == 1 ? "SIM" : "NÃO")),
                DOM.newText((json[i].operacional == 1 ? "SIM" : "NÃO")),
                DOM.newText((json[i].recorrente == 1 ? "SIM" : "NÃO")),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:80px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:90px' + (json[i].bancario == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:90px' + (json[i].operacional == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:90px' + (json[i].recorrente == 0 ? ';color:#9B0000' : ';color:#228B22'));
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:60px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:60px;');

            if (cores) {
                cores = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");

            } else {
                cores = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function promptCadastro(codigo, data, dataFinal, nome, bancario, operacional, recorrente, ativo) {

    
        if(!CheckPermissao(137, true, 'Você não possui permissão para cadastrar/editar um feriado', false)){
            return;
        }
    

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divCadastro.appendChild(divform);

    var lbldata = DOM.newElement('label');
    lbldata.innerHTML = ' Data ';

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "color:red;");

    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "* ";
    lblast2.setAttribute("style", "color:red;");

    var lblast3 = DOM.newElement('label');
    lblast3.innerHTML = "* ";
    lblast3.setAttribute("style", "color:red;");

    lbldata.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtdata = DOM.newElement('text');
    txtdata.setAttribute('id', 'data');
    txtdata.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtdata.setAttribute("style", 'margin-left:5px; width:127px');
    //========================================================================================
    var lbldataFinal = DOM.newElement('label');
    lbldataFinal.innerHTML = ' Data Final ';

    lbldataFinal.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtdataFinal = DOM.newElement('text');
    txtdataFinal.setAttribute('id', 'dataFinal');
    txtdataFinal.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtdataFinal.setAttribute("style", 'margin-left:5px; width:127px');
    //==========================================================================================

    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = ' Nome do feriado ';

    lblnome.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute("style", 'margin-left:5px; margin-right:5px; width:200px');
    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute('for', 'ativo');

    //====== BANCARIO =============//

    var boxbancario = DOM.newElement('checkbox');
    boxbancario.setAttribute('id', 'bancario');
    boxbancario.setAttribute("style", 'margin-right:5px;');

    var labelbancario = DOM.newElement('label');
    labelbancario.innerHTML = 'Bancário';
    labelbancario.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelbancario.setAttribute('for', 'bancario');
    labelbancario.setAttribute("style", 'margin-right:35px;');
    //====== OPERACIONAL ==============//

    var boxoperacional = DOM.newElement('checkbox');
    boxoperacional.setAttribute('id', 'operacional');
    boxoperacional.setAttribute("style", 'margin-right:5px;');

    var labeloperacional = DOM.newElement('label');
    labeloperacional.innerHTML = 'Operacional';
    labeloperacional.setAttribute('class', 'fonte_Roboto_texto_normal');
    labeloperacional.setAttribute('for', 'operacional');
    labeloperacional.setAttribute("style", 'margin-right:35px;');

    //====== RECORRENTE ==============//
    var boxrecorrente = DOM.newElement('checkbox');
    boxrecorrente.setAttribute('id', 'recorrente');
    boxrecorrente.setAttribute("style", 'margin-right:5px;');

    var labelrecorrente = DOM.newElement('label');
    labelrecorrente.innerHTML = 'Recorrente';
    labelrecorrente.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelrecorrente.setAttribute('for', 'recorrente');
    labelrecorrente.setAttribute("style", 'margin-right:5px;');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = "Gravar";

    //======== Tabela =========//

    divform.innerHTML += '<br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast);
    divform.appendChild(txtnome);
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lbldata);
    divform.appendChild(lblast2);
    divform.appendChild(txtdata);
    divform.appendChild(lbldataFinal);
    divform.appendChild(lblast3);
    divform.appendChild(txtdataFinal);
    divform.innerHTML += '<br><br>';
    divform.appendChild(boxbancario);
    divform.appendChild(labelbancario);
    divform.appendChild(boxoperacional);
    divform.appendChild(labeloperacional);
    divform.appendChild(boxrecorrente);
    divform.appendChild(labelrecorrente);
    divform.innerHTML += '<br><br><br>';

    divform.appendChild(cmdTexto1);
    divform.innerHTML += '<br>';

    Selector.$('bancario').checked = false;
    Selector.$('operacional').checked = false;
    Selector.$('recorrente').checked = false;
    Selector.$('ativo').checked = true;

    if (codigo > 0) {
        Selector.$('data').value = data;
        Selector.$('dataFinal').value = dataFinal;
        Selector.$('nome').value = nome;

        if (bancario == 1)
            Selector.$('bancario').checked = true;
        if (operacional == 1)
            Selector.$('operacional').checked = true;
        if (recorrente == 1)
            Selector.$('recorrente').checked = true;
        if (ativo == 0)
            Selector.$('ativo').checked = false;
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 270, 470, 'padrao/', 130);

    dialogoCadastro.Show();
    Mask.setData(Selector.$('data'));
    Mask.setData(Selector.$('dataFinal'));
    Selector.$('nome').focus();
}

function VerificaCampos() {

    var nome = Selector.$('nome').value;
    var data = Selector.$('data').value;
    var dataFinal = Selector.$('dataFinal').value;

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo nome.", "OK", "", false, "nome");
        mensagem.Show();
        return false;
    }

    if (data.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo data.", "OK", "", false, "data");
        mensagem.Show();
        return false;
    }

    if (dataFinal.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo data final.", "OK", "", false, "dataFinal");
        mensagem.Show();
        return false;
    }

    if (!Date.isDate(data)) {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Campo data inválido. Por favor, preencha com uma data existente.", "OK", "", false, "data");
        mensagem.Show();
        return false;
    }

    if (!Date.isDate(dataFinal)) {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Campo data final inválido. Por favor, preencha com uma data existente.", "OK", "", false, "dataFinal");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar(codigo) {

    if(!CheckPermissao(137, true, 'Você não possui permissão para editar um feriado', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-feriados.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&data=' + Selector.$('data').value;
    p += '&datafinal=' + Selector.$('dataFinal').value;
    p += '&obs=' + Selector.$('nome').value;

    Selector.$('ativo').checked ? p += '&ativo=1' : p += '&ativo=0';
    Selector.$('bancario').checked ? p += '&bancario=1' : p += '&bancario=0';
    Selector.$('operacional').checked ? p += '&operacional=1' : p += '&operacional=0';
    Selector.$('recorrente').checked ? p += '&recorrente=1' : p += '&recorrente=0';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == '2') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este feriado já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o feriado. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            dialogoCadastro.Close();
            Selector.$('busca').value = '';
            Mostrar();
            return;
        }
    };

    Selector.$('gravar').disabled = true;
    Selector.$('gravar').innerHTML = "Gravando";

    ajax.Request(p);
}