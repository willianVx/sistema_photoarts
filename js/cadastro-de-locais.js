checkSessao();

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Locais</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Local'),
        DOM.newText('Endereço'),
        DOM.newText('Tel'),
        DOM.newText('Email'),
        DOM.newText('Qtd Propostas'),
        DOM.newText('Qtd OS'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();

    Selector.$('divTabela').appendChild(grid.table);
    Mostrar();
};

function Mostrar() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-locais.php', true);
    var p = 'action=Mostrar';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgLocais').style.display = "block";
            return;
        }
        Selector.$('divTabela').style.display = "block";
        Selector.$('msgLocais').style.display = "none";

        var json = JSON.parse(ajax.getResponseText() ) ;
        var editar;

        var cor = false;
        alert(ajax.getResponseText());
        for (var i = 0; i < json.length; i++) {
            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro' + '(' + json[i].codigo + ');');

            grid.addRow([
                DOM.newText(json[i].nomeLocal),
                DOM.newText(json[i].endereco),
                DOM.newText(json[i].telefone),
                DOM.newText(json[i].email),
                DOM.newText(json[i].qtdPropostas),
                DOM.newText(json[i].qtdOS),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; width:270px');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; width:100px');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:60px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:60px');

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

function promptCadastro(codigo) {

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var lbllocal = DOM.newElement('label');
    lbllocal.innerHTML = 'Local ';
    lbllocal.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtlocal = DOM.newElement('text');
    txtlocal.setAttribute('id', 'local');
    txtlocal.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtlocal.setAttribute("style", 'margin-left:10px; width:430px');
    txtlocal.setAttribute("placeholder", "Preencha com o nome do local");

    //====== ATIVO ==============//
    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-left:10px; margin-right:5px;');

    var lblativo = DOM.newElement('label');
    lblativo.innerHTML = 'Ativo';
    lblativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblativo.setAttribute("style", 'margin-right:5px;');
    lblativo.setAttribute("for", 'ativo');

    //====== CEP ==============//    
    var lblcep = DOM.newElement('label');
    lblcep.innerHTML = 'CEP ';
    lblcep.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtcep = DOM.newElement('text');
    txtcep.setAttribute('id', 'cep');
    txtcep.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtcep.setAttribute("style", 'margin-left:10px; width:155px');
    txtcep.setAttribute("onblur", "BuscarCEP();");
    txtcep.setAttribute("onkeydown", "cep_keyDown(event);");
    txtcep.setAttribute("placeholder", "Ex 11111-111");

    var lblbuscarcep = DOM.newElement('label', 'lblcep');
    lblbuscarcep.innerHTML = '';
    lblbuscarcep.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblbuscarcep.setAttribute("style", 'margin-left:10px;');

    //====== ENDEREÇO ==============//
    var lblend = DOM.newElement('label');
    lblend.innerHTML = 'Endereço ';
    lblend.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtend = DOM.newElement('text');
    txtend.setAttribute('id', 'endereco');
    txtend.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtend.setAttribute("style", 'margin-left:10px; width:235px');

    //====== NUMERO ==============//
    var lblnumero = DOM.newElement('label');
    lblnumero.innerHTML = 'Nº ';
    lblnumero.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblnumero.setAttribute("style", 'margin-left:10px;');

    var txtnumero = DOM.newElement('text');
    txtnumero.setAttribute('id', 'numero');
    txtnumero.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnumero.setAttribute("style", 'margin-left:10px; width:55px');

    //====== COMPLEMENTO ==============//
    var lblcompl = DOM.newElement('label');
    lblcompl.innerHTML = 'Compl. ';
    lblcompl.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcompl.setAttribute("style", 'margin-left:10px;');

    var txtcompl = DOM.newElement('text');
    txtcompl.setAttribute('id', 'complemento');
    txtcompl.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtcompl.setAttribute("style", 'margin-left:10px; width:75px');

    //====== BAIRRO ==============//
    var lblbairro = DOM.newElement('label');
    lblbairro.innerHTML = 'Bairro ';
    lblbairro.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtbairro = DOM.newElement('text');
    txtbairro.setAttribute('id', 'bairro');
    txtbairro.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtbairro.setAttribute("style", 'margin-left:10px; width:155px');

    //====== CIDADE ==============//
    var lblcidade = DOM.newElement('label');
    lblcidade.innerHTML = 'Cidade ';
    lblcidade.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcidade.setAttribute("style", 'margin-left:10px;');

    var txtcidade = DOM.newElement('text');
    txtcidade.setAttribute('id', 'cidade');
    txtcidade.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtcidade.setAttribute("style", 'margin-left:10px; width:155px');

    //====== ESTADO ==============//
    var lblestado = DOM.newElement('label');
    lblestado.innerHTML = 'Estado ';
    lblestado.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblestado.setAttribute("style", 'margin-left:10px;');

    var txtestado = DOM.newElement('text');
    txtestado.setAttribute('id', 'estado');
    txtestado.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtestado.setAttribute("style", 'margin-left:10px; width:50px');
    txtestado.setAttribute("maxlength", '2');

    //====== TELEFONE ==============//
    var lbltel = DOM.newElement('label');
    lbltel.innerHTML = 'Telefone ';
    lbltel.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txttel = DOM.newElement('text');
    txttel.setAttribute('id', 'telefone');
    txttel.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txttel.setAttribute("style", 'margin-left:10px; width:120px');
    txttel.setAttribute("placeholder", "Ex (11) 1111-1111");

    //====== EMAIL ==============//
    var lblemail = DOM.newElement('label');
    lblemail.innerHTML = 'Email ';
    lblemail.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblemail.setAttribute("style", 'margin-left:10px;');

    var txtemail = DOM.newElement('text');
    txtemail.setAttribute('id', 'email');
    txtemail.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtemail.setAttribute("style", 'margin-left:10px; width:185px');

    //====== SITE ==============//
    var lblsite = DOM.newElement('label');
    lblsite.innerHTML = 'Site ';
    lblsite.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtsite = DOM.newElement('text');
    txtsite.setAttribute('id', 'site');
    txtsite.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtsite.setAttribute("style", 'margin-left:10px; width:295px');

    //====== DATA CADASTRO ==============//
    var lbldata = DOM.newElement('label');
    lbldata.innerHTML = 'Data Cadastro ';
    lbldata.setAttribute('class', 'fonte_Roboto_texto_normal');
    lbldata.setAttribute("style", 'margin-left:10px;');

    var txtdata = DOM.newElement('text');
    txtdata.setAttribute('id', 'data');
    txtdata.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtdata.setAttribute("style", 'margin-left:10px; width:100px; background-color:#EEEEEE;');
    txtdata.setAttribute("disabled", "disabled");

    //============ BOTÕES ==============//
    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = 'Gravar';

    //======== Tabela =========//
    divCadastro.innerHTML += '<br>';
    divCadastro.appendChild(lbllocal);
    divCadastro.appendChild(txtlocal);
    divCadastro.appendChild(boxativo);
    divCadastro.appendChild(lblativo);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(lblcep);
    divCadastro.appendChild(txtcep);
    divCadastro.appendChild(lblbuscarcep);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(lblend);
    divCadastro.appendChild(txtend);
    divCadastro.appendChild(lblnumero);
    divCadastro.appendChild(txtnumero);
    divCadastro.appendChild(lblcompl);
    divCadastro.appendChild(txtcompl);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(lblbairro);
    divCadastro.appendChild(txtbairro);
    divCadastro.appendChild(lblcidade);
    divCadastro.appendChild(txtcidade);
    divCadastro.appendChild(lblestado);
    divCadastro.appendChild(txtestado);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(lbltel);
    divCadastro.appendChild(txttel);
    divCadastro.appendChild(lblemail);
    divCadastro.appendChild(txtemail);
    divCadastro.innerHTML += '<br><br>';
    divCadastro.appendChild(lblsite);
    divCadastro.appendChild(txtsite);
    divCadastro.appendChild(lbldata);
    divCadastro.appendChild(txtdata);
    divCadastro.innerHTML += '<br><br><br>';
    divCadastro.appendChild(cmdTexto1);
    divCadastro.innerHTML += '<br>';

    Selector.$('ativo').checked = true;
    Selector.$('data').value = Date.GetDate(false);

    if (codigo > 0) {

        var ajax = new Ajax("POST", "php/cadastro-de-locais.php", false);
        var p = "action=Editar";
        p += "&codigo=" + codigo;

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        Selector.$('local').value = json.nomeLocal;
        Selector.$('cep').value = json.cep;
        Selector.$('endereco').value = json.endereco;
        Selector.$('numero').value = json.numero;
        Selector.$('complemento').value = json.complemento;
        Selector.$('bairro').value = json.bairro;
        Selector.$('cidade').value = json.cidade;
        Selector.$('estado').value = json.estado;
        Selector.$('telefone').value = json.telefone;
        Selector.$('email').value = json.email;
        Selector.$('site').value = json.site;
        Selector.$('data').value = json.data;
        if (json.ativo == '0')
            Selector.$('ativo').checked = false;
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 440, 585, 'padrao/', 130);
    dialogoCadastro.Show();

    Selector.$('local').focus();

    Mask.setCEP(Selector.$('cep'));
    Mask.setOnlyNumbers(Selector.$('numero'));
    Mask.setTelefone(Selector.$('telef one'));
    Mask.setData(Selector.$('dat a'));
}

function Verificar() {

    if (Selector.$('local').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo local.", "OK", "", false, "local");
        mensagem.Show();
        return false;
    }

    /*if(Selector.$('cep').value.trim() == ''){
     var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo cep.", "OK", "", false, "cep");
     mensagem.Show();
     return false;
     }
     
     if(Selector.$('endereco').value.trim() == ''){
     var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo endereço.", "OK", "", false, "endereco");
     mensagem.Show();
     return false;
     }
     
     if(Selector.$('numero').value.trim() == ''){
     var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo número.", "OK", "", false, "numero");
     mensagem.Show();
     return false;
     }
     
     if(Selector.$('bairro').value.trim() == ''){
     var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo bairro.", "OK", "", false, "bairro");
     mensagem.Show();
     return false;
     }
     
     if(Selector.$('cidade').value.trim() == ''){
     var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo cidade.", "OK", "", false, "cidade");
     mensagem.Show();
     return false;
     }
     
     if(Selector.$('estado').value.trim() == ''){
     var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo estado.", "OK", "", false, "estado");
     mensagem.Show();
     re turn false;
     }*/

    return true;
}

function Gravar(codigo) {

    if (!Verificar())
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-locais.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nomeLocal=' + Selector.$('local').value;
    Selector.$('ativo').checked ? p += '&ativo=1' : p += '&ativo=0';
    p += '&cep=' + Selector.$('cep').value;
    p += '&endereco=' + Selector.$('endereco').value;
    p += '&numero=' + Selector.$('numero').value;
    p += '&complemento=' + Selector.$('complemento').value;
    p += '&bairro=' + Selector.$('bairro').value;
    p += '&cidade=' + Selector.$('cidade').value;
    p += '&estado=' + Selector.$('estado').value;
    p += '&email=' + Selector.$('email').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&site=' + Selector.$('site').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este local já está cadastrado.", "OK", "", false, "local");
            mensagem.Show();
            return;
        }
        else if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o local. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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