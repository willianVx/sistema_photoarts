checkSessao();
CheckPermissao(20, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Marchands</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Nome'),
        DOM.newText('Loja'),
        DOM.newText('Desc. Máximo'),
        DOM.newText('Desc. Máx. Obras'),
        DOM.newText('% Comissão'),
        DOM.newText('Gerente'),
        DOM.newText('PDV'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('busca').focus();

    Selector.$('divTabela').appendChild(grid.table);

    Mostra();
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

window.onresize = function () {
    
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

function Mostra() {

    var ajax = new Ajax('POST', 'php/cadastro-de-marchands.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        grid.clearRows();

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
            editar.setAttribute('onclick', 'promptCadastro' + '(' + json[i].idVendedor + ');');

            var vendedor = json[i].vendedor;

            if (json[i].idFuncionario == 0)
                vendedor = vendedor.concat(' *');

            grid.addRow([
                DOM.newText(vendedor),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].descontomaximo.concat(' %')),
                DOM.newText(json[i].descontomaximoobras.concat(' %')),
                DOM.newText(json[i].comissao.concat(' %')),
                DOM.newText(json[i].gerente),
                DOM.newText(json[i].pdv),
                DOM.newText(json[i].ativo),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:right');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:right');

            if (json[i].gerente == 'SIM') {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; color:green;');
            } else {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; color:red;');
            }

            if (json[i].pdv == 'SIM') {
                grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; color:green;');
            } else {
                grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; color:red;');
            }

            if (json[i].ativo == 'SIM') {
                grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; color:green;');
            } else {
                grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; color:red;');
            }

            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:center');

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
        if(!CheckPermissao(21, true, 'Você não possui permissão para cadastrar um novo marchand', false)){
            return;
        }
    }

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var radioFuncionario = DOM.newElement('radio');
    radioFuncionario.setAttribute('name', 'tipo');
    radioFuncionario.setAttribute('id', 'funcionario');
    radioFuncionario.setAttribute('onclick', 'FormataCampos("tipo")');

    var lblFuncionario = DOM.newElement('label');
    lblFuncionario.innerHTML = 'Funcionário';
    lblFuncionario.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblFuncionario.setAttribute('for', 'funcionario');

    var radioAvulso = DOM.newElement('radio');
    radioAvulso.setAttribute('name', 'tipo');
    radioAvulso.setAttribute('id', 'avulso');
    radioAvulso.setAttribute('onclick', 'FormataCampos("tipo")');

    var lblAvulso = DOM.newElement('label');
    lblAvulso.innerHTML = 'Avulso';
    lblAvulso.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAvulso.setAttribute('for', 'avulso');

    var ativo = DOM.newElement('checkbox');
    ativo.setAttribute('id', 'ativo');
    ativo.setAttribute('style', 'margin-left:100px;');

    var lblAtivo = DOM.newElement('label');
    lblAtivo.innerHTML = 'Ativo';
    lblAtivo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAtivo.setAttribute('for', 'ativo');

    var inAvulso = DOM.newElement('input');
    inAvulso.setAttribute('type', 'text');
    inAvulso.setAttribute('id', 'inAvulso');
    inAvulso.setAttribute('placeholder', 'Insira o nome do vendedor');
    inAvulso.setAttribute('class', 'textbox_cinzafoco');
    inAvulso.setAttribute("style", 'width:300px; display:none; margin-top:4px');

    var cmbFuncionario = DOM.newElement('select');
    cmbFuncionario.setAttribute('id', 'cmbFuncionario');
    cmbFuncionario.setAttribute('class', 'combo_cinzafoco');
    cmbFuncionario.setAttribute("style", 'width:300px; cursor:pointer; margin-top:4px');
    cmbFuncionario.setAttribute('onkeydown', 'gravar_onkeydown(event , ' + codigo + ', Gravar)');

    var cmbGaleria = DOM.newElement('select');
    cmbGaleria.setAttribute('id', 'cmbGaleria');
    cmbGaleria.setAttribute('class', 'combo_cinzafoco');
    cmbGaleria.setAttribute("style", 'width:300px; cursor:pointer; margin-top:4px');

    var divDesc = DOM.newElement('div');
    divDesc.setAttribute('class', 'divcontainer');
    divDesc.setAttribute('style', 'max-width: 90px');

    var lblDesc = DOM.newElement('label');
    lblDesc.innerHTML = 'Desc. Máximo';
    lblDesc.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtDesc = DOM.newElement('input');
    txtDesc.setAttribute('type', 'text');
    txtDesc.setAttribute('id', 'desconto');
    txtDesc.setAttribute('class', 'textbox_cinzafoco');
    txtDesc.setAttribute('placeholder', '0,00');
    txtDesc.setAttribute('onkeypress', 'FormataCampos("desc")');
    txtDesc.setAttribute("style", 'margin-left: 4px; margin-right:5px; width:65px; text-align:right');

    divDesc.appendChild(lblDesc);
    divDesc.appendChild(txtDesc);
    divDesc.innerHTML += '%';

    var divDescOrc = DOM.newElement('div');
    divDescOrc.setAttribute('class', 'divcontainer');
    divDescOrc.setAttribute('style', 'max-width: 135px');

    var lblDescOrc = DOM.newElement('label');
    lblDescOrc.innerHTML = 'Desc. Máximo Obras';
    lblDescOrc.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtDescOrc = DOM.newElement('input');
    txtDescOrc.setAttribute('type', 'text');
    txtDescOrc.setAttribute('id', 'descontoObras');
    txtDescOrc.setAttribute('class', 'textbox_cinzafoco');
    txtDescOrc.setAttribute('placeholder', '0,00');
    txtDescOrc.setAttribute('onkeypress', 'FormataCampos("desc")');
    txtDescOrc.setAttribute("style", 'margin-left: 4px; margin-right:5px; width:65px; text-align:right');

    divDescOrc.appendChild(lblDescOrc);
    divDescOrc.innerHTML += '<br />';
    divDescOrc.appendChild(txtDescOrc);
    divDescOrc.innerHTML += '%';

    var divCom = DOM.newElement('div');
    divCom.setAttribute('class', 'divcontainer');
    divCom.setAttribute('style', 'max-width: 90px; margin-left:5px');

    var lblComissao = DOM.newElement('label');
    lblComissao.innerHTML = 'Comissão';
    lblComissao.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtComissao = DOM.newElement('input');
    txtComissao.setAttribute('type', 'text');
    txtComissao.setAttribute('id', 'comissao');
    txtComissao.setAttribute('class', 'textbox_cinzafoco');
    txtComissao.setAttribute('placeholder', '0,00');
    txtComissao.setAttribute('onkeypress', 'FormataCampos("comi");');
    txtComissao.setAttribute("style", ' margin-left: 4px;  margin-right:5px; width:65px; text-align:right;');

    divCom.appendChild(lblComissao);
    divCom.appendChild(txtComissao);
    divCom.innerHTML += '%';

    var boxGerente = DOM.newElement('checkbox', 'gerente');
    boxGerente.setAttribute('style', 'margin-left:4px;');

    var lblGerente = DOM.newElement('label');
    lblGerente.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblGerente.setAttribute('for', 'gerente');
    lblGerente.innerHTML = 'Gerente';


    var boxPDV = DOM.newElement('checkbox', 'pdv');
    boxPDV.setAttribute('style', 'margin-left:14px;');

    var lblPDV = DOM.newElement('label');
    lblPDV.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblPDV.setAttribute('for', 'pdv');
    lblPDV.innerHTML = 'PDV';

    var cmdGrava = DOM.newElement('button', 'gravar');
    cmdGrava.setAttribute('class', 'botao_azul');
    cmdGrava.setAttribute('style', 'float:right; margin-right:9px; margin-top:8px;');
    cmdGrava.setAttribute('onclick', 'Gravar(0)');
    cmdGrava.innerHTML = "Gravar";

    var cmdDestravar = DOM.newElement('button', 'cmddestravar');
    cmdDestravar.setAttribute('class', 'botaosimplesfoco');
    cmdDestravar.setAttribute('style', 'float:left; margin-right:9px; margin-top:8px;');
    cmdDestravar.setAttribute('onclick', 'Desbloquear(' + codigo + ')');
    cmdDestravar.innerHTML = "Desbloquear";

    var cmdResetar = DOM.newElement('button', 'resetar');
    cmdResetar.setAttribute('class', 'botaosimplesfoco');
    cmdResetar.setAttribute('style', 'float:left; margin-right:9px; margin-top:8px;');
    cmdResetar.setAttribute('onclick', 'ResetarSenha(' + codigo + ')');
    cmdResetar.innerHTML = "Resetar senha";

    divCadastro.appendChild(radioFuncionario);
    divCadastro.appendChild(lblFuncionario);
    divCadastro.appendChild(radioAvulso);
    divCadastro.appendChild(lblAvulso);
    divCadastro.appendChild(ativo);
    divCadastro.appendChild(lblAtivo);
    divCadastro.innerHTML += '<br />';
    divCadastro.appendChild(cmbFuncionario);
    divCadastro.appendChild(inAvulso);
    divCadastro.appendChild(cmbGaleria);
    divCadastro.innerHTML += '<br />';
    divCadastro.appendChild(divDesc);
    divCadastro.appendChild(divDescOrc);
    divCadastro.appendChild(divCom);
    divCadastro.innerHTML += '<br />';
    divCadastro.appendChild(boxGerente);
    divCadastro.appendChild(lblGerente);

    divCadastro.appendChild(boxPDV);
    divCadastro.appendChild(lblPDV);
    divCadastro.innerHTML += '<br />';

    if (codigo > 0) {

        divCadastro.appendChild(cmdDestravar);
        divCadastro.appendChild(cmdResetar);
    }

    divCadastro.appendChild(cmdGrava);

    Selector.$('funcionario').checked = true;
    Selector.$('ativo').checked = true;

    dialogoCadastro = new caixaDialogo('divCadastro', 270, 365, 'padrao/', 130);

    dialogoCadastro.Show();
    Selector.$('desconto').style.maxLength = 6;
    Selector.$('comissao').style.maxLength = 6;

    var ajax = new Ajax('POST', 'php/cadastro-de-marchands.php', false);
    var p = 'action=ComboFuncionarios';

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    Select.Clear(Selector.$('cmbFuncionario'));

    Select.AddItem(Selector.$('cmbFuncionario'), 'Selecione um funcionário...', 0);
    Select.FillWithJSON(Selector.$('cmbFuncionario'), ajax.getResponseText(), 'idFuncionario', 'funcionario');
    getLojas(Selector.$('cmbGaleria'), 'Selecione uma loja', false);

    Selector.$('cmbFuncionario').focus();

    if (codigo > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-marchands.php', false);
        var p = 'action=MostraVendedor';
        p += '&codigo=' + codigo;

        ajax.Request(p);

        if (ajax.getResponseText() == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        if (json.tentativas < 3)
            Selector.$('cmddestravar').style.display = "none";

        if (json.ativo == 1) {
            Selector.$('ativo').checked = true;
        } else {
            Selector.$('ativo').checked = false;
        }

        if (json.gerente == 1) {
            Selector.$('gerente').checked = true;
        }

        if (json.pdv == 1) {
            Selector.$('pdv').checked = true;
        }

        if (json.idFuncionario == 0) {
            Selector.$('avulso').checked = true;
            Selector.$('inAvulso').value = json.vendedor;
        } else {
            Selector.$('cmbFuncionario').value = json.idFuncionario;
            Selector.$('funcionario').checked = true;
        }

        FormataCampos('tipo');

        Selector.$('cmbGaleria').value = json.idLoja;

        Selector.$('desconto').value = json.descontomaximo;
        Selector.$('descontoObras').value = json.descontomaximoobras;
        Selector.$('comissao').value = json.comissao;
        Selector.$('gravar').setAttribute('onclick', 'Gravar(' + codigo + ')');
    }
}


function Desbloquear(codigo) {
    var ajax = new Ajax('POST', 'php/cadastro-de-marchands.php', false);
    var p = 'action=Desbloquear';
    p += '&codigo=' + codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "Usuário já se encontra desbloqueado.", "OK", "", false, "");
    } else {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Atenção!", "Usuário desbloqueado com sucesso", "OK", "", false, "");
    }

    mensagem.Show();

}

function ResetarSenha(codigo) {

    if(!CheckPermissao(22, true, 'Você não possui permissão para editar um marchand', false)){
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-marchands.php', false);
    var p = 'action=Resetar';
    p += '&codigo=' + codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "A senha já é photoarts!", "OK", "", false, "");
    } else {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Atenção!", "Senha resetada com sucesso!", "OK", "", false, "");
    }

    mensagem.Show();

}

function FormataCampos(campo) {

    if (campo == 'tipo') {

        if (Selector.$('avulso').checked == true) {

            Selector.$('cmbFuncionario').style.display = 'none';
            Selector.$('inAvulso').style.display = 'inline';
            Selector.$('inAvulso').focus();

        } else {

            Selector.$('cmbFuncionario').style.display = 'inline';
            Selector.$('inAvulso').style.display = 'none';
            Selector.$('cmbFuncionario').focus();
        }

    }
    if (campo == 'desc') {
        Mask.setMoeda(Selector.$('desconto'));
        Selector.$('desconto').setAttribute('maxlength', '6');

        Mask.setMoeda(Selector.$('descontoObras'));
        Selector.$('descontoObras').setAttribute('maxlength', '6');
    }

    if (campo == 'comi') {
        Mask.setMoeda(Selector.$('comissao'));
        Selector.$('comissao').setAttribute('maxlength', '6');
    }
}

function Gravar(codigo) {

    if(!CheckPermissao(21, true, 'Você não possui permissão para editar um marchand', false)){
        return;
    }

    if (Verifica()) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-marchands.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&idFuncionario=' + (Selector.$('funcionario').checked == true ? Selector.$('cmbFuncionario').value : '0');
    p += '&idLoja=' + Selector.$('cmbGaleria').value;
    p += '&ativo=' + (Selector.$('ativo').checked == true ? 1 : 0);
    p += '&vendedor=' + (Selector.$('funcionario').checked == true ? Select.GetText(Selector.$('cmbFuncionario')) : Selector.$('inAvulso').value);
    p += '&descontomaximo=' + Number.parseFloat(Selector.$('desconto').value)
    p += '&descontomaximoobras=' + Number.parseFloat(Selector.$('descontoObras').value);
    p += '&comissao=' + Number.parseFloat(Selector.$('comissao').value);
    p += '&gerente=' + (Selector.$('gerente').checked ? 1 : 0);
    p += '&pdv=' + (Selector.$('pdv').checked ? 1 : 0);

    ajax.Request(p);

    if (ajax.getResponseText() == '2') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Marchand já cadastrado.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    if (ajax.getResponseText() == '1') {
        dialogoCadastro.Close();
        Mostra();
        return;
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "descricao");
        mensagem.Show();
        return;
    }
}

function Verifica() {

    if (Selector.$('avulso').checked == true) {

        if (Selector.$('inAvulso').value.trim() == '') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Insira o nome do Marchand.", "OK", "", false, "inAvulso");
            mensagem.Show();
            return true;
        }

    } else {

        if (Selector.$('cmbFuncionario').value == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione um funcionário.", "OK", "", false, "cmbFuncionario");
            mensagem.Show();
            return true;
        }
    }

    if (Selector.$('cmbGaleria').value == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione uma loja.", "OK", "", false, "cmbGaleria");
        mensagem.Show();
        return true;
    }

    if (Selector.$('desconto').value.trim() == ',' || (parseFloat(Selector.$('desconto').value)) > 100) {
        Selector.$('desconto').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Insira um valor valido para desconto se não houver desconto insira o valor 0,00.", "OK", "", false, "desconto");
        mensagem.Show();
        return true;
    }

    if (Selector.$('comissao').value.trim() == ',' || (parseFloat(Selector.$('comissao').value)) > 100) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Insira um valor valido para comissão se não houver comissao insira o valor 0,00.", "OK", "", false, "comissao");
        mensagem.Show();
        return true;
    }

    return false;
}