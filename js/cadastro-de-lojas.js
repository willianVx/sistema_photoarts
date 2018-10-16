checkSessao();
CheckPermissao(18, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Lojas</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Loja'),
        DOM.newText('CNPJ'),
        DOM.newText('Endereço'),
        DOM.newText('Telefone'),
        DOM.newText('E-mail'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();

    Selector.$('divTabela').appendChild(grid.table);
    Mostra();
};

function Mostra() {
     
   
    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-lojas.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == 0) {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var editar;

        for (var i = 0; i < json.length; i++) {
            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro' + '(' + json[i].idLoja + ');');
            
            grid.addRow([
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cnpj), 
                DOM.newText(json[i].endereco),
                DOM.newText(json[i].telefone),
                DOM.newText(json[i].email),
                DOM.newText(json[i].ativo),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; width:200px;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px;');        
            
            if (json[i].ativo == 'SIM') {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; color:green;');
            } else {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; color:red;');
            }
            
            if (i % 2 != 0) {
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");

            } else {
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function promptCadastro(codigo) {

    if(codigo <= 0){
        if(!CheckPermissao(19, true, 'Você não possui permissão para cadastrar uma nova loja', false)){
            return;
        }
    }

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var divLoja = DOM.newElement('div');
    divLoja.setAttribute('class', 'divcontainer');

    var lblLoja = DOM.newElement('label');
    lblLoja.innerHTML = 'Loja';
    lblLoja.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtLoja = DOM.newElement('input');
    txtLoja.setAttribute('type', 'text');
    txtLoja.setAttribute('id', 'loja');
    txtLoja.setAttribute('class', 'textbox_cinzafoco');
    txtLoja.setAttribute("style", 'width:320px; margin-left:5px;');

    var lblCnpj = DOM.newElement('label');
    lblCnpj.innerHTML = 'CNPJ';
    lblCnpj.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCnpj.setAttribute('style', 'margin-left:10px;');

    var txtCnpj = DOM.newElement('input');
    txtCnpj.setAttribute('type', 'text');
    txtCnpj.setAttribute('id', 'cnpj');
    txtCnpj.setAttribute('class', 'textbox_cinzafoco');
    txtCnpj.setAttribute("style", 'width:150px; margin-left:5px;');

    var ativo = DOM.newElement('checkbox');
    ativo.setAttribute('id', 'ativo');
    ativo.setAttribute('style', 'margin-left:10px;');

    var lblAtivo = DOM.newElement('label');
    lblAtivo.innerHTML = 'Ativo';
    lblAtivo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAtivo.setAttribute('for', 'ativo');

    divLoja.appendChild(lblLoja);
    divLoja.appendChild(txtLoja);
    divLoja.appendChild(lblCnpj);
    divLoja.appendChild(txtCnpj);
    divLoja.appendChild(ativo);
    divLoja.appendChild(lblAtivo);

    var divEndereco = DOM.newElement('div');
    divEndereco.setAttribute('class', 'divcontainer');

    var lblCep = DOM.newElement('label');
    lblCep.innerHTML = 'CEP';
    lblCep.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtCep = DOM.newElement('input');
    txtCep.setAttribute('type', 'text');
    txtCep.setAttribute('id', 'cep');
    txtCep.setAttribute('class', 'textbox_cinzafoco');
    txtCep.setAttribute("style", 'width:80px; margin-left:5px;');
    txtCep.setAttribute("onblur", 'BuscarCEP();');

    var lblBuscaCep = DOM.newElement('label', 'lblcep');
    lblBuscaCep.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblBuscaCep.setAttribute('style', 'margin-left:5px;');

    var lblEndereco = DOM.newElement('label');
    lblEndereco.innerHTML = 'Endereço';
    lblEndereco.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblEndereco.setAttribute('style', 'margin-left:10px;');

    var txtEndereco = DOM.newElement('input');
    txtEndereco.setAttribute('type', 'text');
    txtEndereco.setAttribute('id', 'endereco');
    txtEndereco.setAttribute('class', 'textbox_cinzafoco');
    txtEndereco.setAttribute("style", 'width:260px; margin-left:5px;');

    var lblNumero = DOM.newElement('label');
    lblNumero.innerHTML = 'N°';
    lblNumero.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNumero.setAttribute('style', 'margin-left:10px;');

    var txtNumero = DOM.newElement('input');
    txtNumero.setAttribute('type', 'text');
    txtNumero.setAttribute('id', 'numero');
    txtNumero.setAttribute('class', 'textbox_cinzafoco');
    txtNumero.setAttribute("style", 'width:75px; margin-left:5px;');

    var lblComplemento = DOM.newElement('label');
    lblComplemento.innerHTML = 'Complemento';
    lblComplemento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblComplemento.setAttribute('style', 'margin-left:10px;');

    var txtComplemento = DOM.newElement('input');
    txtComplemento.setAttribute('type', 'text');
    txtComplemento.setAttribute('id', 'complemento');
    txtComplemento.setAttribute('class', 'textbox_cinzafoco');
    txtComplemento.setAttribute("style", 'width:110px; margin-left:5px;');

    var lblBairro = DOM.newElement('label');
    lblBairro.innerHTML = 'Bairro';
    lblBairro.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtBairro = DOM.newElement('input');
    txtBairro.setAttribute('type', 'text');
    txtBairro.setAttribute('id', 'bairro');
    txtBairro.setAttribute('class', 'textbox_cinzafoco');
    txtBairro.setAttribute("style", 'width:270px; margin-left:5px;');

    var lblCidade = DOM.newElement('label');
    lblCidade.innerHTML = 'Cidade';
    lblCidade.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCidade.setAttribute('style', 'margin-left:10px;');

    var txtCidade = DOM.newElement('input');
    txtCidade.setAttribute('type', 'text');
    txtCidade.setAttribute('id', 'cidade');
    txtCidade.setAttribute('class', 'textbox_cinzafoco');
    txtCidade.setAttribute("style", 'width:270px; margin-left:5px;');

    var lblEstado = DOM.newElement('label');
    lblEstado.innerHTML = 'Estado';
    lblEstado.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblEstado.setAttribute('style', 'margin-left:10px;');

    var txtEstado = DOM.newElement('input');
    txtEstado.setAttribute('type', 'text');
    txtEstado.setAttribute('id', 'estado');
    txtEstado.setAttribute('class', 'textbox_cinzafoco');
    txtEstado.setAttribute("style", 'width:60px; margin-left:5px;');
    txtEstado.setAttribute("maxLength", '2');

    var lblTelefone = DOM.newElement('label');
    lblTelefone.innerHTML = 'Telefone';
    lblTelefone.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtTelefone = DOM.newElement('input');
    txtTelefone.setAttribute('type', 'text');
    txtTelefone.setAttribute('id', 'telefone');
    txtTelefone.setAttribute('class', 'textbox_cinzafoco');
    txtTelefone.setAttribute("style", 'width:100px; margin-left:5px;');

    var lblEmail = DOM.newElement('label');
    lblEmail.innerHTML = 'E-mail';
    lblEmail.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblEmail.setAttribute('style', 'margin-left:10px;');

    var txtEmail = DOM.newElement('input');
    txtEmail.setAttribute('type', 'text');
    txtEmail.setAttribute('id', 'email');
    txtEmail.setAttribute('class', 'textbox_cinzafoco');
    txtEmail.setAttribute("style", 'width:320px; margin-left:5px;');

    divEndereco.appendChild(lblCep);
    divEndereco.appendChild(txtCep);
    divEndereco.appendChild(lblBuscaCep);
    divEndereco.appendChild(lblEndereco);
    divEndereco.appendChild(txtEndereco);
    divEndereco.appendChild(lblNumero);
    divEndereco.appendChild(txtNumero);
    divEndereco.appendChild(lblComplemento);
    divEndereco.appendChild(txtComplemento);
    divEndereco.appendChild(lblBairro);
    divEndereco.appendChild(txtBairro);
    divEndereco.appendChild(lblCidade);
    divEndereco.appendChild(txtCidade);
    divEndereco.appendChild(lblEstado);
    divEndereco.appendChild(txtEstado);
    divEndereco.appendChild(lblTelefone);
    divEndereco.appendChild(txtTelefone);
    divEndereco.appendChild(lblEmail);
    divEndereco.appendChild(txtEmail);

    var cmdGrava = DOM.newElement('button', 'gravar');
    cmdGrava.setAttribute('class', 'botaosimplesfoco');
    cmdGrava.setAttribute('style', 'float:right; margin-right:9px; margin-top:8px;');
    cmdGrava.setAttribute('onclick', 'Gravar(0)');
    cmdGrava.innerHTML = "Gravar";

    divCadastro.appendChild(divLoja);
    divCadastro.innerHTML += '<br />';
    divCadastro.appendChild(divEndereco);
    divCadastro.appendChild(cmdGrava);

    Selector.$('ativo').checked = true;

    dialogoCadastro = new caixaDialogo('divCadastro', 240, 800, 'padrao/', 130);
    dialogoCadastro.Show();
    Selector.$('loja').focus();
    Mask.setCNPJ(Selector.$('cnpj'));
    Mask.setCEP(Selector.$('cep'));
    Mask.setTelefone(Selector.$('telefone'));

    if (codigo > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-lojas.php', false);
        var p = 'action=MostrarLoja';
        p += '&codigo=' + codigo;
        ajax.Request(p);

        if (ajax.getResponseText() == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        Selector.$('loja').value = json.loja;
        Selector.$('cnpj').value = json.cnpj;
        Selector.$('ativo').checked = (json.ativo == '1' ? true : false);
        Selector.$('cep').value = json.cep;
        Selector.$('endereco').value = json.endereco;
        Selector.$('numero').value = json.numero;
        Selector.$('complemento').value = json.complemento;
        Selector.$('bairro').value = json.bairro;
        Selector.$('cidade').value = json.cidade;
        Selector.$('estado').value = json.estado;
        Selector.$('telefone').value = json.telefone;
        Selector.$('email').value = json.email;
        Selector.$('gravar').setAttribute('onclick', 'Gravar(' + codigo + ')');
    }
}

function Verifica() {

    if (Selector.$('loja').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o nome da loja.", "OK", "", false, "loja");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar(codigo) {

    if(!CheckPermissao(19, true, 'Você não possui permissão para editar uma loja', false)){
        return;
    }

    if (!Verifica()) {
        return;
    }
    
    var ajax = new Ajax('POST', 'php/cadastro-de-lojas.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&loja=' + Selector.$('loja').value;
    p += '&cnpj=' + Selector.$('cnpj').value;
    p += '&ativo=' + (Selector.$('ativo').checked == true ? 1 : 0);
    p += '&cep=' + Selector.$('cep').value;
    p += '&endereco=' + Selector.$('endereco').value;
    p += '&numero=' + Selector.$('numero').value;
    p += '&complemento=' + Selector.$('complemento').value;
    p += '&bairro=' + Selector.$('bairro').value;
    p += '&cidade=' + Selector.$('cidade').value;
    p += '&estado=' + Selector.$('estado').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&email=' + Selector.$('email').value;    
    ajax.Request(p);
    
    if (ajax.getResponseText() == '2') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Loja já cadastrada.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (ajax.getResponseText() == '1') {
        dialogoCadastro.Close();
        Mostra();
        return;
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Problemas ao gravar a loja, se o erro persistir contate o suporte.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}