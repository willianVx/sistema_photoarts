checkSessao();
CheckPermissao(138, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Formas de Pagamento</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Forma de pagamento'),
        DOM.newText('Qtd dias'),
        DOM.newText('%Taxa'),
        DOM.newText('Pagar'),
        DOM.newText('Receber'),
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

    var ajax = new Ajax('POST', 'php/formas-de-pagamento.php', true);
    var p = 'action=Mostrar';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {


        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgForma').style.display = "block";
            return;
        }

        Selector.$('divTabela').style.display = "block";
        Selector.$('msgForma').style.display = "none";

        var json = JSON.parse(ajax.getResponseText() );
        var editar;
        var cores = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('width', '20');
            editar.setAttribute('height', '20');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].codigo + ',"' + json[i].formaPagamento + '", ' + json[i].pagar + ', ' + json[i].receber + ', ' + json[i].ativo + ',' + json[i].qtd + ',' + json[i].taxa + ');');
            editar.setAttribute('title', 'Editar pagamento');

            grid.addRow([
                DOM.newText(json[i].formaPagamento),
                DOM.newText(json[i].qtd),
                DOM.newText(json[i].taxa),
                DOM.newText((json[i].pagar == 1 ? "SIM" : "NÃO")),
                DOM.newText((json[i].receber == 1 ? "SIM" : "NÃO")),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left; width:500px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:50px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:50px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:60px;' + (json[i].pagar == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:60px;' + (json[i].receber == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:60px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:60px;');

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

function promptCadastro(codigo, formaPagamento, pagar, receber, ativo, qtd, taxa) {

    
    if(!CheckPermissao(139, true, 'Você não possui permissão para cadastrar/editar uma forma de pagamento', false)){
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

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.innerHTML = ' Forma de Pagamento ';
    lblFormaPagamento.setAttribute('id', 'formaPagamento');
    lblFormaPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtFormaPagamento = DOM.newElement('text');
    txtFormaPagamento.setAttribute('id', 'pagamento');
    txtFormaPagamento.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtFormaPagamento.setAttribute("onkeydown", "gravar_onkeydown(event, " + codigo + ", Gravar);");
    txtFormaPagamento.setAttribute("style", 'width:230px');

    var lblQtdDias = DOM.newElement('label');
    lblQtdDias.innerHTML = 'Qtde dias compensação';
    lblQtdDias.setAttribute('id', 'lblqtdDias');
    lblQtdDias.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtQtdeDias = DOM.newElement('text');
    txtQtdeDias.setAttribute('id', 'qtdDias');
    txtQtdeDias.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtQtdeDias.setAttribute("style", 'width:90px; margin-left:10px;');

    var lblTaxa = DOM.newElement('label');
    lblTaxa.innerHTML = '%Taxa';
    lblTaxa.setAttribute('id', 'lblTaxa');
    lblTaxa.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtTaxa = DOM.newElement('text');
    txtTaxa.setAttribute('id', 'taxa');
    txtTaxa.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtTaxa.setAttribute("style", 'width:90px; margin-left:10px;');

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "* ";
    lblast2.setAttribute("style", " color:red;");
    //====== BOX ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute('for', 'ativo');
    labelativo.setAttribute('style', 'margin-right:15px;');
    //==========================================================================   
    var boxPagar = DOM.newElement('checkbox');
    boxPagar.setAttribute('id', 'pagar');

    var labelPagar = DOM.newElement('label');
    labelPagar.innerHTML = 'Pagar';
    labelPagar.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelPagar.setAttribute('for', 'pagar');

    //======================================================================
    var boxReceber = DOM.newElement('checkbox');
    boxReceber.setAttribute('id', 'receber');
    boxReceber.setAttribute("style", 'margin-left:20px;');

    var labelReceber = DOM.newElement('label');
    labelReceber.innerHTML = 'Receber';
    labelReceber.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelReceber.setAttribute('for', 'receber');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-top:8px;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = "Gravar";

    //======== Tabela =========//
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblFormaPagamento);
    divform.appendChild(lblast2);
    divform.innerHTML += '<br>';
    divform.appendChild(txtFormaPagamento);
    divform.innerHTML += '<br>';
    divform.appendChild(lblQtdDias);
    divform.appendChild(txtQtdeDias);
    divform.innerHTML += '<br>';
    divform.appendChild(lblTaxa);
    divform.appendChild(txtTaxa);
    divform.innerHTML += '<br>';
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.appendChild(boxPagar);
    divform.appendChild(labelPagar);
    divform.appendChild(boxReceber);
    divform.appendChild(labelReceber);
    divform.innerHTML += '<br>';
    divform.appendChild(cmdTexto1);

    if (codigo > 0) {

        Selector.$('pagamento').value = formaPagamento;
        Selector.$('qtdDias').value = qtd;
        Selector.$('taxa').value = taxa;

        if (ativo == 0) {
            Selector.$('ativo').checked = false;
        } else {
            Selector.$('ativo').checked = true;
        }

        if (pagar == 0) {
            Selector.$('pagar').checked = false;
        } else {
            Selector.$('pagar').checked = true;
        }

        if (receber == 0) {
            Selector.$('receber').checked = false;
        } else {
            Selector.$('receber').checked = true;
        }
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 280, 350, 'padrao/', 130);
    dialogoCadastro.Show();
    Selector.$('formaPagamento').focus();
}

function VerificaCampos() {

    var pagamento = Selector.$('pagamento').value;
    var pagar = Selector.$('pagar');
    var receber = Selector.$('receber');

    if (pagamento.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Forma de pagamento.", "OK", "", false, "pagamento");
        mensagem.Show();
        return false;
    }

    if (((Selector.$('pagar').checked) && (Selector.$('receber').checked)) || (!(Selector.$('pagar').checked) &&
            !(Selector.$('receber').checked))) {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a opção Pagar ou Receber.", "OK", "", false, "");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar(codigo) {

    if(!CheckPermissao(139, true, 'Você não possui permissão para editar um feriado', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/formas-de-pagamento.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&formaPagamento=' + Selector.$('pagamento').value;
    p += '&ativo=' + (Selector.$('ativo').checked ? '1' : '0');
    p += '&pagar=' + (Selector.$('pagar').checked ? '1' : '0');
    p += '&receber=' + (Selector.$('receber').checked ? '1' : '0');
    p += '&qtd=' + Selector.$('qtdDias').value;
    p += '&taxa=' + Selector.$('taxa').value;
    
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
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar a forma de pagamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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