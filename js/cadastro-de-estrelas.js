checkSessao();
CheckPermissao(132, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Estrelas</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Estrela'),
        DOM.newText('De'),
        DOM.newText('Até'),
        DOM.newText('Valorização'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);

    Mostrar();
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

window.onresize = function () {

    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

function Mostrar() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-estrelas.php', true);
    var p = 'action=Mostrar';

    p += '&busca=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
		
        if (ajax.getResponseText() === 0) {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgEstrelas').style.display = "block";
            return;
        }

        Selector.$('divTabela').style.display = "block";
        Selector.$('msgEstrelas').style.display = "none";

        var json = JSON.parse(ajax.getResponseText() );
        var editar;

        var cor = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro(' + i + ');');

            grid.addRow([
                DOM.newText(json[i].estrelas),
                DOM.newText(json[i].de),
                DOM.newText(json[i].ate),
                DOM.newText("R$ " + json[i].valorizacao),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:150px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:150px');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:150px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:right;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:50px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:50px');

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

function promptCadastro(linha) {
    
    if(linha == '-1'){
        if(!CheckPermissao(133, true, 'Você não possui permissão para cadastrar uma estrela', false)){
            return;
        }
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

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "<span style='color:red'>*</span>Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");
    
    divform.appendChild(lblcampo);
    divform.innerHTML += '<br><br>';
    
    //====== ESTRELA ============//

    var lblestrela = DOM.newElement('label');
    lblestrela.innerHTML = "Estrela <span style='color:red'>*</span>";
    lblestrela.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblestrela.setAttribute("style", "font-weight:bold;");

    var txtestrela = DOM.newElement('text');
    txtestrela.setAttribute('id', 'estrela');
    txtestrela.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtestrela.setAttribute("style", 'width:200px; margin-left:5px; margin-right:5px;');
    
    divform.appendChild(lblestrela);
    divform.appendChild(txtestrela);
    
    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute('for', 'ativo');
    labelativo.setAttribute("style", 'margin-right:15px;');
    
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.innerHTML += '<br><br>';
    
    //====== DE ============//

    var lblde = DOM.newElement('label');
    lblde.innerHTML = "De <span style='color:red'>*</span>";
    lblde.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblde.setAttribute("style", "font-weight:bold;");

    var txtde = DOM.newElement('text');
    txtde.setAttribute('id', 'de');
    txtde.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtde.setAttribute("style", 'width:60px; margin-left:5px;');
    
    divform.appendChild(lblde);
    divform.appendChild(txtde);
    
    //====== ATE ============//

    var lblate = DOM.newElement('label');
    lblate.innerHTML = "Até <span style='color:red'>*</span>";
    lblate.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblate.setAttribute("style", "font-weight:bold; margin-left:10px;");

    var txtate = DOM.newElement('text');
    txtate.setAttribute('id', 'ate');
    txtate.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtate.setAttribute("style", 'width:60px; margin-left:5px;');
    
    divform.appendChild(lblate);
    divform.appendChild(txtate);
    
    //====== VALORIZACAO ============//

    var lblval = DOM.newElement('label');
    lblval.innerHTML = "Valorização <span style='color:red'>*</span>";
    lblval.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblval.setAttribute("style", "font-weight:bold; margin-left:10px;");

    var txtval = DOM.newElement('text');
    txtval.setAttribute('id', 'valorizacao');
    txtval.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtval.setAttribute("style", 'width:120px; margin-left:5px;');
    
    divform.appendChild(lblval);
    divform.appendChild(txtval);
    divform.innerHTML += '<br><br>';

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + linha + ')');
    cmdTexto1.innerHTML = "Gravar";
    
    divform.appendChild(cmdTexto1);

    Mask.setOnlyNumbers(Selector.$('estrela'));
    Mask.setOnlyNumbers(Selector.$('de'));
    Mask.setOnlyNumbers(Selector.$('ate'));
    Mask.setMoeda(Selector.$('valorizacao'));

    dialogoCadastro = new caixaDialogo('divCadastro', 230, 485, 'padrao/', 130);
    dialogoCadastro.Show();
    
    if (linha >= 0) {
        Selector.$('estrela').value = grid.getCellText(linha,0);
        Selector.$('ativo').checked = (grid.getCellText(linha,4) == "SIM" ? true : false);
        Selector.$('de').value = grid.getCellText(linha,1);
        Selector.$('ate').value = grid.getCellText(linha,2);
        Selector.$('valorizacao').value = grid.getCellText(linha,3).replace("R$", "");
    } else {
        Selector.$('estrela').focus();
        Selector.$('ativo').checked = true;
    }
}

function Verificar() {
    
    if (Selector.$('estrela').value === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo estrela.", "OK", "", false, "estrela");
        mensagem.Show();
        return false;
    }
    
    if (Selector.$('de').value === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo de.", "OK", "", false, "de");
        mensagem.Show();
        return false;
    }
    
    if (Selector.$('ate').value === '' || Selector.$('ate').value === '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo até.", "OK", "", false, "ate");
        mensagem.Show();
        return false;
    }
    
    if(parseInt(Selector.$('ate').value) <= parseInt(Selector.$('de').value)) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Por favor, digite valores válidos nos campos de e até.", "OK", "", false, "");
        mensagem.Show();
        return false;
    }
    
    if (Selector.$('valorizacao').value.trim() === ',') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo valorização.", "OK", "", false, "valorizacao");
        mensagem.Show();
        return false;
    }
    
    return true;
}

function Gravar(linha) {

    if(!CheckPermissao(133, true, 'Você não possui permissão para editar uma estrela', false)){
        return;
    }

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (!Verificar())
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-estrelas.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + (linha == '-1' ? '0' : grid.getRowData(linha));
    p += '&estrela=' + Selector.$('estrela').value;
    p += '&ativo=' + ativo;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&valorizacao=' + Selector.$('valorizacao').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == -1) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Esta estrela já está cadastrada.", "OK", "", false, "estrela");
            mensagem.Show();
        } else if (ajax.getResponseText() == -2) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Já existe uma estrela entre este de e até.", "OK", "", false, "");
            mensagem.Show();
        } else if (ajax.getResponseText() == 0) {           
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar a estrela. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
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