checkSessao();
CheckPermissao(140, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Tamanhos</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Tamanho'),
        DOM.newText('Medida'),
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

    var ajax = new Ajax('POST', 'php/cadastro-de-tamanhos.php', true);
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

        var json = JSON.parse(ajax.getResponseText()  );
        var editar;

        var cor = false;

        if (json.length == 1)
            Selector.$('qtdTamanhos').innerHTML = json.length + " tamanho encontrado";
        else
            Selector.$('qtdTamanhos').innerHTML = json.length + " tamanhos encontrados";

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro' +
                    '(' + json[i].codigo + ', "' + json[i].tamanho + '", ' +
                    '"' + json[i].altura + '", "' + json[i].largura + '", ' + json[i].ativo + ');');

            grid.addRow([
                DOM.newText(json[i].tamanho),
                DOM.newText(json[i].medida),
                DOM.newText(json[i].dataCadastro),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:50px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:50px');

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

function promptCadastro(codigo, tamanho, altura, largura, ativo) {

    
        if(!CheckPermissao(141, true, 'Você não possui permissão para cadastrar/editar um tamanho', false)){
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
    txtnome.setAttribute("style", 'width:207px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute('for', 'ativo');
    labelativo.setAttribute("style", 'margin-right:15px;');

    //====== ALTURA E LARGURA ==============//

    var lblaltura = DOM.newElement('label');
    lblaltura.innerHTML = 'Altura ';
    lblaltura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblaltura.setAttribute("style", "font-weight:bold;");

    var txtaltura = DOM.newElement('text', 'altura');
    txtaltura.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtaltura.setAttribute("style", 'width:90px');

    var lblalturacm = DOM.newElement('label');
    lblalturacm.innerHTML = 'cm';
    lblalturacm.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblalturacm.setAttribute("style", "font-weight:bold;");

    var lbllargura = DOM.newElement('label');
    lbllargura.innerHTML = 'Largura ';
    lbllargura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lbllargura.setAttribute("style", "font-weight:bold; margin-left:15px;");

    var txtlargura = DOM.newElement('text', 'largura');
    txtlargura.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtlargura.setAttribute("style", 'width:90px');

    var lbllarguracm = DOM.newElement('label');
    lbllarguracm.innerHTML = 'cm';
    lbllarguracm.setAttribute('class', 'fonte_Roboto_texto_normal');
    lbllarguracm.setAttribute("style", "font-weight:bold;");

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
    divform.appendChild(lblaltura);
    divform.appendChild(txtaltura);
    divform.appendChild(lblalturacm);
    divform.appendChild(lbllargura);
    divform.appendChild(txtlargura);
    divform.appendChild(lbllarguracm);
    divform.appendChild(cmdTexto1);

    Selector.$('ativo').checked = true;

    Mask.setMoeda(Selector.$('altura'));
    Mask.setMoeda(Selector.$('largura'));

    if (codigo > 0) {

        Selector.$('nome').value = tamanho;
        Selector.$('altura').value = altura;
        Selector.$('largura').value = largura;
        if (ativo != 1)
            Selector.$('ativo').checked = false;
    }

    dialogoCadastro = new caixaDialogo('divCadastro', 200, 400, 'padrao/', 130);
    dialogoCadastro.Show();
    Selector.$('nome').focus();
}

function Gravar(codigo) {

    if(!CheckPermissao(141, true, 'Você não possui permissão para editar um tamanho', false)){
        return;
    }

    var nome = Selector.$('nome').value;
    var altura = Selector.$('altura').value;
    var largura = Selector.$('largura').value;

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo nome.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    if (largura.trim() == ',')
        largura = '';

    if (altura.trim() == ',')
        altura = '';

    var ajax = new Ajax('POST', 'php/cadastro-de-tamanhos.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nome=' + nome;
    p += '&ativo=' + ativo;
    p += '&altura=' + altura;
    p += '&largura=' + largura;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == -1) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este tamanho já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o tamanho. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
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