checkSessao();
CheckPermissao(134, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Etapas de Produção</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Ordem'),
        DOM.newText('Etapa'),
        DOM.newText('Descrição'),
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

    var ajax = new Ajax('POST', 'php/cadastro-de-etapas-de-producao.php', true);
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
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].codigo + ',' + json[i].ordem + ', "' + json[i].etapa + '",\n\
 "' + json[i].descricao + '", ' + json[i].ativo + ');');
            editar.setAttribute('title', 'Editar Etapa');

            grid.addRow([
                DOM.newText(json[i].ordem),
                DOM.newText(json[i].etapa),
                DOM.newText(json[i].descricao),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:60px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:60px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:40px;');

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

function promptCadastro(codigo, ordem, etapa, descricao, ativo) {

    
        if(!CheckPermissao(135, true, 'Você não possui permissão para cadastrar/editar uma etapa de produção', false)){
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

    var lblEtapa = DOM.newElement('label');
    lblEtapa.innerHTML = ' Etapa ';

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "*";
    lblast2.setAttribute("style", "color:red;");

    var lblast3 = DOM.newElement('label');
    lblast3.innerHTML = "*";
    lblast3.setAttribute("style", "color:red;");

    var lblast4 = DOM.newElement('label');
    lblast4.innerHTML = "*";
    lblast4.setAttribute("style", "color:red;");

    lblEtapa.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtEtapa = DOM.newElement('text');
    txtEtapa.setAttribute('id', 'etapa');
    txtEtapa.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtEtapa.setAttribute("style", 'margin-left:5px; width:180px');

    //========================================================================================

    var lblOrdem = DOM.newElement('label');
    lblOrdem.innerHTML = ' Ordem ';

    lblOrdem.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtOrdem = DOM.newElement('text');
    txtOrdem.setAttribute('id', 'ordem');
    txtOrdem.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtOrdem.setAttribute("style", 'margin-left:5px; margin-right:5px; width:80px');

    //=========================================================================================

    var lblDescricao = DOM.newElement('label');
    lblDescricao.innerHTML = ' Descrição ';

    lblDescricao.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtDescricao = DOM.newElement('textarea');
    txtDescricao.setAttribute('id', 'descricao');
    txtDescricao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtDescricao.setAttribute("style", 'margin-left:1px; width:348px; height:80px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-left:40px;');


    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute('for', 'ativo');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-top:8px;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = "Gravar";

    //======== Tabela =========//
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br>';
    divform.appendChild(lblOrdem);
    divform.appendChild(lblast2);
    divform.appendChild(txtOrdem);
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblEtapa);
    divform.appendChild(lblast3);
    divform.appendChild(txtEtapa);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblDescricao);
    divform.appendChild(lblast4);
    divform.appendChild(txtDescricao);
    divform.innerHTML += '<br>';
    divform.appendChild(cmdTexto1);

    Selector.$('ativo').checked = true;

    if (codigo > 0) {
        Selector.$('etapa').value = etapa;
        Selector.$('ordem').value = ordem;
        Selector.$('descricao').value = descricao;
        if (ativo == 0)
            Selector.$('ativo').checked = false;
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 320, 430, 'padrao/', 130);

    dialogoCadastro.Show();
    Mask.setOnlyNumbers(Selector.$('ordem'));
    Selector.$('ordem').focus();
}

function VerificaCampos() {

    var ordem = Selector.$('ordem').value;
    var etapa = Selector.$('etapa').value;
    var descricao = Selector.$('descricao').value;

    if (ordem.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo ordem.", "OK", "", false, "ordem");
        mensagem.Show();
        return false;
    }

    if (etapa.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo etapa.", "OK", "", false, "etapa");
        mensagem.Show();
        return false;
    }

    if (descricao.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo data descrição.", "OK", "", false, "descricao");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar(codigo) {

    if(!CheckPermissao(135, true, 'Você não possui permissão para editar uma etapa de produção', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-etapas-de-producao.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&ordem=' + Selector.$('ordem').value;
    p += '&etapa=' + Selector.$('etapa').value;
    p += '&descricao=' + Selector.$('descricao').value;
    Selector.$('ativo').checked ? p += '&ativo=1' : p += '&ativo=0';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == 2) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Esta etapa já está cadastrada.", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar a etapa. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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