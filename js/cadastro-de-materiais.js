checkSessao();
CheckPermissao(144, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Materiais</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Material'),
        DOM.newText('Unid. Med.'),
        DOM.newText('Est. mínimo'),
        DOM.newText('Data Cadastro'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 180) + "px";

    Mostrar();
};

window.onresize = function () {

    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 180) + "px";
};

function Mostrar() {

    grid.clearRows();
    Selector.$('qtdTamanhos').innerHTML = '';

    var ajax = new Ajax('POST', 'php/cadastro-de-materiais.php', true);
    var p = 'action=Mostrar';

    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == 0) {

            Selector.$('divTabela').style.display = "none";
            Selector.$('msgTamanhos').style.display = "block";
            return;
        }

        Selector.$('divTabela').style.display = "block";
        Selector.$('msgTamanhos').style.display = "none";

        var json = JSON.parse(ajax.getResponseText() );
        var editar;

        var cor = false;

        if (json.length == 1)
            Selector.$('qtdTamanhos').innerHTML = json.length + " material encontrado";
        else
            Selector.$('qtdTamanhos').innerHTML = json.length + " materiais encontrados";

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro' +
                    '(' + json[i].codigo +
                    ', "' + json[i].material + '", ' +
                    '"' + json[i].descricao + '", ' +
                    '"' + json[i].idUnidadeMedida + '", ' +
                    '"' + json[i].estoqueMinimo +
                    '", ' + json[i].ativo + ');');

            grid.addRow([
                DOM.newText(json[i].material),
                DOM.newText(json[i].unidadeMedida),
                DOM.newText(json[i].estoqueMinimo),
                DOM.newText(json[i].dataCadastro),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:90px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:90px');
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

function promptCadastro(codigo, produto, descricao, idUnMed, estoque, ativo) {

           if(!CheckPermissao(145, true, 'Você não possui permissão para cadastrar/editar um material', false)){
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

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");

    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Nome ';
    lblnome.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblnome.setAttribute("style", "font-weight:bold;");

    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "* ";
    lblast2.setAttribute("style", "color:red;");

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute("style", 'width:280px');
    txtnome.setAttribute("placeHolder", 'Ex.: Moldura');

    //DESCRIÇÃO
    var lbldesc = DOM.newElement('label');
    lbldesc.innerHTML = 'Descrição';
    lbldesc.setAttribute('class', 'fonte_Roboto_texto_normal');
    lbldesc.setAttribute("style", "font-weight:bold;");

    var txtdesc = DOM.newElement('textarea');
    txtdesc.setAttribute('id', 'descricao');
    txtdesc.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtdesc.setAttribute("style", 'width:425px; height:60px;');
    txtdesc.setAttribute("placeHolder", 'Informe uma descrição do produto');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute('for', 'ativo');
    labelativo.setAttribute("style", 'margin-right:15px;');

    //====== VALOR E ESTQOUE MÍNIMO ==============//

    var lblaltura = DOM.newElement('label');
    lblaltura.innerHTML = 'Unid. Med. ';
    lblaltura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblaltura.setAttribute("style", "font-weight:bold;");

    var txtaltura = DOM.newElement('select', 'unidMed');
    txtaltura.setAttribute('class', 'combo_cinzafoco');
    txtaltura.setAttribute("style", 'margin-left:4px; width:90px');

    var lblest = DOM.newElement('label');
    lblest.innerHTML = 'Estoque mínimo ';
    lblest.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblest.setAttribute("style", "font-weight:bold; margin-left:6px;");

    var txtest = DOM.newElement('text', 'estoque');
    txtest.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtest.setAttribute("style", 'margin-left:4px; width:90px; text-align:center');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = "Gravar";

    //======== Tabela =========//
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast2);
    divform.appendChild(txtnome);
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.innerHTML += '<br>';
    divform.appendChild(lbldesc);
    divform.innerHTML += '<br>';
    divform.appendChild(txtdesc);
    divform.innerHTML += '<br>';
    divform.appendChild(lblaltura);
    divform.appendChild(txtaltura);
    divform.appendChild(lblest);
    divform.appendChild(txtest);
    divform.innerHTML += '<br>';
    divform.appendChild(cmdTexto1);

    Selector.$('ativo').checked = true;
    Mask.setOnlyNumbers(Selector.$('estoque'));

    if (codigo > 0) {
        getUnidadesMedidas(Selector.$('unidMed'), 'Selecione...', false);

        Selector.$('nome').value = produto;
        Select.Show(Selector.$('unidMed'), idUnMed);
        Selector.$('estoque').value = estoque;
        Selector.$('descricao').value = descricao;

        if (ativo != 1)
            Selector.$('ativo').checked = false;
    }
    else {
        getUnidadesMedidas(Selector.$('unidMed'), 'Selecione...', true);
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 285, 500, 'padrao/', 130);
    dialogoCadastro.Show();
    Selector.$('nome').focus();
}

function Gravar(codigo) {

    if(!CheckPermissao(145, true, 'Você não possui permissão para editar um material', false)){
        return;
    }

    var nome = Selector.$('nome').value;
    var descricao = Selector.$('descricao').value;
    var unidMed = Selector.$('unidMed');
    var estoque = Selector.$('estoque').value;

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo nome.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    if (unidMed.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a unidade de medida", "OK", "", false, "unidMed");
        mensagem.Show();
        return;
    }

    if (estoque.trim() === ',')
        estoque = '';

    var ajax = new Ajax('POST', 'php/cadastro-de-materiais.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nome=' + nome;
    p += '&descricao=' + descricao;
    p += '&ativo=' + ativo;
    p += '&idUnidadeMedida=' + unidMed.value;
    p += '&estoque=' + estoque;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        console.error(ajax.getResponseText());

        if (ajax.getResponseText() == -1) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este material já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o material. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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
    Selector.$('gravar').innerHTML = "Gravando..";

    ajax.Request(p);
}