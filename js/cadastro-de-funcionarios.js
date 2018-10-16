checkSessao();
CheckPermissao(15, false, '', true);

var codigoAtual = 0;
var temLogin = "";

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Funcionários</div>";
    carregarmenu();
    getDadosUsuario();
    
    Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
    Mask.setCPF(Selector.$('cpf'));
    Mask.setData(Selector.$("dataNascimento"));
    Mask.setCEP(Selector.$("cep"));
    Mask.setCelular(Selector.$("celular"));
    Mask.setTelefone(Selector.$("telefone"));
    getBancos(Selector.$('banco'), "Selecione um banco", true);
    getDepartamentos(Selector.$('departamento'), "Selecione um departamento", true);
    getCargos(Selector.$('cargo'), "Selecione um cargo", true);

    gridFuncionarios = new Table('gridFuncionarios');
    gridFuncionarios.table.setAttribute('cellpadding', '4');
    gridFuncionarios.table.setAttribute('cellspacing', '0');
    gridFuncionarios.table.setAttribute('class', 'tabela_cinza_foco');

    gridFuncionarios.addHeader([
        DOM.newText('Nome'),
        DOM.newText('CPF'),
        DOM.newText('Endereço'),
        DOM.newText('Telefone'),
        DOM.newText('Celular'),
        DOM.newText('Email'),
        DOM.newText('Ativo'),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridFuncionarios.table);

    MostrarFuncionarios();

    var divPermissoes = Selector.$('divPermissoes');

    gridPermissoes = new Table('gridPermissoes');
    gridPermissoes.table.setAttribute('class', 'tabela_cinza_foco');
    gridPermissoes.table.setAttribute('cellpadding', '5');
    gridPermissoes.table.setAttribute('cellspacing', '0');

    gridPermissoes.addHeader([
        DOM.newText(''),
        DOM.newText('Tela'),
        DOM.newText('Permissão')
    ]);

    divPermissoes.appendChild(gridPermissoes.table);

    getPermissoes();

    var divAcessos = Selector.$('divAcessos');

    gridAcessos = new Table('gridAcessos');
    gridAcessos.table.setAttribute('class', 'tabela_cinza_foco');
    gridAcessos.table.setAttribute('cellpadding', '5');
    gridAcessos.table.setAttribute('cellspacing', '0');

    gridAcessos.addHeader([
        DOM.newText('Data'),
        DOM.newText('IP'),
        DOM.newText('Tipo'),
        DOM.newText('Browser'),
        DOM.newText('Status')
    ]);

    divAcessos.appendChild(gridAcessos.table);

    var divAvisos = Selector.$('divAvisos');

    gridAvisos = new Table('gridAvisos');
    gridAvisos.table.setAttribute('class', 'tabela_cinza_foco');
    gridAvisos.table.setAttribute('cellpadding', '5');
    gridAvisos.table.setAttribute('cellspacing', '0');

    gridAvisos.addHeader([
        DOM.newText('Data'),
        DOM.newText('Hora'),
        DOM.newText('Descrição'),
        DOM.newText('Lido'),
        DOM.newText('Editar'),
        DOM.newText('Excluir'),
        DOM.newText('')
    ]);

    divAvisos.appendChild(gridAvisos.table);

    gridAvisos.hiddenCol(6);
    
};

window.onresize = function () {

    if (Selector.$('divRel').clientHeight > 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
};

function Novo(ajustar) {

    if(!CheckPermissao(157, true, 'Você não possui permissão para cadastrar um novo funcionário', false)){
        return;
    }

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('cpf').focus();
    Selector.$('ativo').checked = true;
    Selector.$('botNovo').setAttribute('src', 'imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', 'imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');
}

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    } else {
        Selector.$('divContainer').style.maxWidth = '980px';
        Selector.$('divCadastro2').setAttribute('style', 'height:600px; width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
    }
}

function Cancelar() {

    AjustarDivs();
    Limpar();
    Selector.$('botNovo').setAttribute('src', 'imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
    Selector.$('botSair').setAttribute('src', 'imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
        Cancelar();
    }
}

function MostrarFuncionarios() {    
    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', true);
    var p = 'action=MostrarFuncionarios';
    p += '&busca=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        gridFuncionarios.clearRows();

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var ver;
        var cor;

        for (var i = 0; i < json.length; i++) {

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Funcionário');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idFuncionario + ', true)');

            gridFuncionarios.addRow([
                DOM.newText(json[i].funcionario),
                DOM.newText(json[i].cpf),
                DOM.newText(json[i].endereco),
                DOM.newText(json[i].telefone),
                DOM.newText(json[i].celular),
                DOM.newText(json[i].email),
                DOM.newText(json[i].ativo),
                ver
            ]);

            gridFuncionarios.setRowData(gridFuncionarios.getRowCount() - 1, json[i].idFuncionario);
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:100px;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 5).setAttribute('style', 'text-align:left; width:200px;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:80px;');
            gridFuncionarios.getCell(gridFuncionarios.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:30px;');

            if (cor) {
                cor = false;
                gridFuncionarios.setRowBackgroundColor(gridFuncionarios.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridFuncionarios.setRowBackgroundColor(gridFuncionarios.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 3; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid; border-color:#D7D7D7; overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; min-height:500px;  height:auto; border-top:1px solid; border-color:#D7D7D7; overflow:hidden');
}

function Desabilita(Valor) {

    Selector.$('cpf').disabled = Valor;
    Selector.$('rg').disabled = Valor;
    Selector.$('dataNascimento').disabled = Valor;
    Selector.$('ativo').disabled = Valor;
    Selector.$('admin').disabled = Valor;
    Selector.$('usuario').disabled = Valor;
    Selector.$('nome').disabled = Valor;
    Selector.$('login').disabled = Valor;
    Selector.$('cep').disabled = Valor;
    Selector.$('endereco').disabled = Valor;
    Selector.$('numero').disabled = Valor;
    Selector.$('complemento').disabled = Valor;
    Selector.$('bairro').disabled = Valor;
    Selector.$('cidade').disabled = Valor;
    Selector.$('estado').disabled = Valor;
    Selector.$('telefone').disabled = Valor;
    Selector.$('celular').disabled = Valor;
    Selector.$('email').disabled = Valor;
    Selector.$('perfil').disabled = Valor;
    Selector.$('banco').disabled = Valor;
    Selector.$('agencia').disabled = Valor;
    Selector.$('contaCorrente').disabled = Valor;
    Selector.$('departamento').disabled = Valor;
    Selector.$('cargo').disabled = Valor;
    Selector.$('obs').disabled = Valor;
}

function D1_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    ajax.Request('action=GetRegistroPrimeiro&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D2_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    ajax.Request('action=GetRegistroAnterior&atual=' + codigoAtual + "&codigo=" + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D3_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    ajax.Request('action=GetRegistroProximo&atual=' + codigoAtual + "&codigo=" + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D4_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    ajax.Request('action=GetRegistroUltimo&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function AjustaImagensEdicao(BotNovo, BotModi, BotSair, BotAux1, BotAux2) {

    if (BotNovo.name === 'NovoTrue') {
        BotNovo.src = 'imagens/validar.png';
        BotNovo.title = 'Salvar';
        BotModi.src = 'imagens/cadastro.png';
        BotSair.src = 'imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotModi.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else if (BotModi.name === 'ModiTrue') {
        BotModi.src = 'imagens/validar.png';
        BotModi.title = 'Salvar';
        BotNovo.src = 'imagens/novo.png';
        BotSair.src = 'imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotNovo.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else {
        BotNovo.src = 'imagens/novo.png';
        BotNovo.title = 'Novo';
        BotModi.src = 'imagens/cadastro.png';
        BotModi.title = 'Modificar';
        BotSair.src = 'imagens/sair3.png';
        BotSair.title = 'Sair';
        BotNovo.style.visibility = 'visible';
        BotModi.style.visibility = 'visible';
        BotSair.style.visibility = 'visible';
        BotAux1.style.visibility = 'visible';
        BotAux2.style.visibility = 'visible';
    }
}

function botNovo_onClick() {

    checkPermissao(8, true);

    if (Selector.$('botModi').name === 'ModiTrue') {
        return;
    }

    var botNovo = Selector.$('botNovo');
    var botModi = Selector.$('botModi');

    if (botNovo.name === 'NovoTrue') {
        if (Gravar()) {
            Mostra(codigoAtual);
            botNovo.name = 'NovoFalse';
            botModi.name = 'ModiFalse';
            Desabilita(true);
        }
    } else {
        botNovo.name = 'NovoTrue';
        botModi.name = 'ModiFalse';
        Desabilita(false);
        Limpar();
        Selector.$('ativo').checked = true;
        Selector.$('cpf').focus();
    }
}

function botModi_onClick() {

    checkPermissao(8, true);

    if (Selector.$('botNovo').name === 'NovoTrue') {
        return;
    }

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Nenhum registro ativo", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (codigoAtual === '' || parseInt(codigoAtual) === 0) {
        return;
    }

    var botNovo = Selector.$('botNovo');
    var botModi = Selector.$('botModi');

    if (botModi.name === 'ModiTrue') {

        if (Gravar()) {
            Mostra(codigoAtual);
            botModi.name = 'ModiFalse';
            botNovo.name = 'NovoFalse';
            Desabilita(true);
        }
    } else {
        botModi.name = 'ModiTrue';
        botNovo.name = 'NovoFalse';
        Desabilita(false);
    }
}

function botDel_onClick() {

    if (Selector.$("botNovo").name === 'NovoTrue' || Selector.$("botModi").name === 'ModiTrue') {
        return;
    }

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Nenhum registro ativo", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Não é possível excluir funcionarios, favor editar o cadastro e inativá-lo.", "OK", "", false, "");
    mensagem.Show();
}

function botSair_onClick() {

    var botNovo = Selector.$('botNovo');
    var botModi = Selector.$('botModi');

    if (botNovo.name === 'NovoTrue' || botModi.name === 'ModiTrue') {

        if (botNovo.name === 'NovoTrue') {
            botNovo.name = 'NovoFalse';
            botModi.name = 'ModiFalse';
            Limpar();
            Desabilita(true);
        }
        else if (botModi.name === 'ModiTrue') {
            botNovo.name = 'NovoFalse';
            botModi.name = 'ModiFalse';
            Mostra(codigoAtual);
            Desabilita(true);
        }
    }
    else {
        window.location = 'principal.html';
    }
}

function Limpar() {

    codigoAtual = 0;

    Selector.$('cpf').value = "";
    Selector.$('cpf').name = "";
    Selector.$('rg').value = "";
    Selector.$('dataNascimento').value = "";
    Selector.$('ativo').checked = false;
    Selector.$('admin').checked = false;
    Selector.$('usuario').checked = false;
    Selector.$('nome').value = "";
    Selector.$('login').value = "";
    Selector.$('cep').name = "";
    Selector.$('cep').value = "";
    Selector.$('endereco').value = "";
    Selector.$('numero').value = "";
    Selector.$('complemento').value = "";
    Selector.$('bairro').value = "";
    Selector.$('cidade').value = "";
    Selector.$('estado').value = "";
    Selector.$('telefone').value = "";
    Selector.$('celular').value = "";
    Selector.$('email').value = "";
    Selector.$('perfil').selectedIndex = 0;
    Selector.$('banco').selectedIndex = 0;
    Selector.$('agencia').value = "";
    Selector.$('contaCorrente').value = "";
    Selector.$('departamento').selectedIndex = 0;
    Selector.$('cargo').selectedIndex = 0;
    Selector.$('obs').value = "";
    Selector.$('foto').src = 'imagens/fotoPadrao.jpg';
    Selector.$('foto').name = '';
    Selector.$('fotofunc').setAttribute('style', 'background-image:url(imagens/fotoPadrao.jpg); background-repeat:no-repeat; background-position: center; background-size:52px;');

    Selector.$('ultimaAtualizacaopor').innerHTML = "";
    gridAcessos.clearRows();
}

function VerificaCampos() {

    if (!ValidarCpf(Selector.$('cpf').value.replace(".", "").replace(".", "").replace("-", "").trim())) {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe um CPF válido.", "OK", "", false, "cpf");
        mensagem.Show();
        return false;
    }

    if (Selector.$('cpf').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o cpf do funcionário", "OK", "", false, "cpf");
        mensagem.Show();
        return false;
    }

    if (Selector.$('rg').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o RG do funcionário", "OK", "", false, "rg");
        mensagem.Show();
        return false;
    }
    if (Selector.$('nome').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o nome do funcionário", "OK", "", false, "nome");
        mensagem.Show();
        return false;
    }

    if (Selector.$('dataNascimento').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe a data de nascimento do funcionário", "OK", "", false, "dataNascimento");
        mensagem.Show();
        return false;
    }

    if (Selector.$('cep').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o CEP do funcionário", "OK", "", false, "cep");
        mensagem.Show();
        return false;
    }

    if (Selector.$('endereco').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o endereço do funcionário", "OK", "", false, "endereco");
        mensagem.Show();
        return false;
    }

    if (Selector.$('numero').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o número do funcionário", "OK", "", false, "numero");
        mensagem.Show();
        return false;
    }

    if (Selector.$('bairro').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o bairro do funcionário", "OK", "", false, "bairro");
        mensagem.Show();
        return false;
    }

    if (Selector.$('cidade').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe a cidade do funcionário", "OK", "", false, "cidade");
        mensagem.Show();
        return false;
    }

    if (Selector.$('estado').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, informe o estado do funcionário", "OK", "", false, "estado");
        mensagem.Show();
        return false;
    }

    if (Selector.$('telefone').value.trim() === "" && Selector.$('celular').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt2", 120, 400, 150, "2", "Atenção!", "Por favor, informe o telefone ou o celular do funcionário.", "OK", "", false, "telefone");
        mensagem.Show();
        return false;
    }

    if (Selector.$('perfil').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 120, 400, 150, "2", "Atenção!", "Por favor, informe o perfil do funcionário", "OK", "", false, "perfil");
        mensagem.Show();
        return false;
    }

    if (Selector.$('email').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 120, 400, 150, "2", "Atenção!", "Por favor, informe o email do funcionário", "OK", "", false, "email");
        mensagem.Show();
        return false;
    }
     if (Selector.$('emailCorporativo').value.trim() === "" ) {
        var mensagem = new DialogoMensagens("prompt2", 120, 400, 150, "2", "Atenção!", "Por favor, informe o email do funcionário", "OK", "", false, "email");
        mensagem.Show();
        return false;
    }

    if (Selector.$('departamento').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 120, 400, 150, "2", "Atenção!", "Por favor, selecione o departamento do funcionário", "OK", "", false, "departamento");
        mensagem.Show();
        return false;
    }

    if (Selector.$('cargo').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o cargo do funcionário", "OK", "", false, "cargo");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar() {

    if(!CheckPermissao(157, true, 'Você não possui permissão para editar um funcionário', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    if (Selector.$('cpf').name == "true") {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Este CPF já está cadastrado.", "OK", "", false, "cpf");
        mensagem.Show();
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&cpf=' + Selector.$('cpf').value;
    p += '&rg=' + Selector.$('rg').value;
    p += '&dataNascimento=' + (Selector.$('dataNascimento').value.trim() === '' ? '0000-00-00' : Selector.$('dataNascimento').value);

    if (Selector.$('ativo').checked === true) {
        p += '&ativo=1';
    } else {
        p += '&ativo=0';
    }

    if (Selector.$('admin').checked === true) {
        p += '&admin=1';
    } else {
        p += '&admin=0';
    }

    if (Selector.$('usuario').checked === true) {
        p += '&usuario=1';
    } else {
        p += '&usuario=0';
    }

    p += '&nome=' + Selector.$('nome').value;
    p += '&login=' + Selector.$('login').value;
    p += '&cep=' + Selector.$('cep').value;
    p += '&endereco=' + Selector.$('endereco').value;
    p += '&numero=' + Selector.$('numero').value;
    p += '&complemento=' + Selector.$('complemento').value;
    p += '&bairro=' + Selector.$('bairro').value;
    p += '&cidade=' + Selector.$('cidade').value;
    p += '&estado=' + Selector.$('estado').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&celular=' + Selector.$('celular').value;
    p += '&email=' + Selector.$('email').value;
    p += '&emailCorporativo=' + Selector.$('emailCorporativo').value;
    p += '&idPerfil=' + Selector.$('perfil').value;
    p += '&idBanco=' + Selector.$('banco').value;
    p += '&agencia=' + Selector.$('agencia').value;
    p += '&contaCorrente=' + Selector.$('contaCorrente').value;
    p += '&idDepartamento=' + Selector.$('departamento').value;
    p += '&idCargo=' + Selector.$('cargo').value;
    p += '&obs=' + Selector.$('obs').value;

    ajax.Request(p);

    if (ajax.getResponseText() === '-1') {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Este login já está cadastrado.", "OK", "", false, "login");
        mensagem.Show();
        return false;
    } else if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt2", 140, 350, 150, "1", "Erro", "Erro ao gravar o funcionário. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return false;
    } else {
        if (Selector.$('login').value == '') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Funcionário cadastrado com sucesso!", "OK", "", false, "");
            mensagem.Show();
        } else if (Selector.$('login').value !== temLogin) {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "3", "Sucesso!", "Funcionário cadastrado com sucesso! Para logar no sistema, a senha é a mesma que o login.", "OK", "", false, "");
            mensagem.Show();
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Funcionário cadastrado com sucesso!", "OK", "", false, "");
            mensagem.Show();
        }
        codigoAtual = ajax.getResponseText();
        GravarPermissoes(codigoAtual);
        return true;
    }
}

function Mostra(Codigo, ajustar) {
    if(!CheckPermissao(165, true, 'Você não possui permissão para Visualizar detalhes sobre o  funcionario', false)){
        return;
    }
    if (Codigo === '' || parseInt(Codigo) === 0) {
        return;
    }

    Novo(ajustar);
    Limpar();

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);
      
    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Registro não localizado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var json = JSON.parse(ajax.getResponseText()); 

    codigoAtual = json.codigo;
    Selector.$('cpf').value = json.cpf;
    Selector.$('rg').value = json.rg;
    Selector.$('dataNascimento').value = json.dataNascimento;
    Selector.$('ativo').checked = (json.ativo === '1' ? true : false);
    Selector.$('admin').checked = (json.admin === '1' ? true : false);
    Selector.$('usuario').checked = (json.usuario === '1' ? true : false);
    Selector.$('btResetar').style.display = (json.usuario === '1' ? 'inline-block' : 'none');
    Selector.$('nome').value = json.funcionario;
    Selector.$('login').value = json.login;
    Selector.$('usuarioBloqueado').style.display = (json.tentativas > 3 ? 'inline-block' : 'none');
    Selector.$('btDesbloquear').style.display = (json.tentativas > 3 ? 'inline-block' : 'none');
    
    temLogin = json.login;
    
    Selector.$('cep').value = json.cep;
    Selector.$('endereco').value = json.endereco;
    Selector.$('numero').value = json.numero;
    Selector.$('complemento').value = json.complemento;
    Selector.$('bairro').value = json.bairro;
    Selector.$('cidade').value = json.cidade;
    Selector.$('estado').value = json.estado;
    Selector.$('telefone').value = json.telefone;
    Selector.$('celular').value = json.celular;
    Selector.$('email').value = json.email;
    Selector.$('emailCorporativo').value = json.emailCorporativo;
    Selector.$('perfil').value = json.idPerfil;
    Selector.$('banco').value = json.idBanco;
    Selector.$('agencia').value = json.agencia;
    Selector.$('contaCorrente').value = json.conta;
    Selector.$('departamento').value = json.idDepartamento;
    Selector.$('cargo').value = json.idCargo;
    Selector.$('obs').value = json.obs;
    Selector.$('ultimaAtualizacaopor').innerHTML = json.usuario2;

    if (json.imagem === '') {
        Selector.$('foto').src = 'imagens/fotoPadrao.jpg';
        Selector.$('fotofunc').setAttribute('style', 'background-image:url(imagens/fotoPadrao.jpg); background-repeat:no-repeat; background-position: center; background-size:52px;');
    } else {
        Selector.$('foto').src = 'imagens/usuarios/' + "mini_" + json.imagem;

        var aleatorio = Math.random();
        var aux = aleatorio.toString().split(".");
        aleatorio = aux[1].substr(0, 4);
        Selector.$('fotofunc').setAttribute('style', 'background-image:url(imagens/usuarios/mini_' + json.imagem + '?' + aleatorio + '); background-repeat:no-repeat; background-position: center; background-size:52px;');
    }

    MostraPermissoes(Codigo);
    MostrarAcessos(Codigo);
    MostraAvisos(Codigo);
}

function PesquisarFuncionarios() {

    gridPesquisa.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=PesquisarFuncionarios';
    p += '&nome=' + Selector.$('nome2').value;
    ajax.Request(p);

    if (ajax.getResponseText() === '') {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Nenhum registro encontrado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    var cor = true;

    for (var i = 0; i < json.length; i++) {

        gridPesquisa.addRow([
            DOM.newText(json[i].funcionario),
            DOM.newText(json[i].cpf),
            DOM.newText((json[i].ativo === '1' ? "SIM" : "NÃO"))
        ]);

        gridPesquisa.setRowData(gridPesquisa.getRowCount() - 1, json[i].codigo);
        gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('onclick', 'MostraResultadoPesquisa(' + json[i].codigo + ');');
        gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
        gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));

        if (cor) {
            cor = false;
            gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, "#FFF");
        }
    }
}

function MostraResultadoPesquisa(codigo) {

    gridPesquisa.clearRows();
    Selector.$('nome2').value = "";
    Mostra(codigo);
    dialogo.Close();
}

function codigo_KeyDown(ev) {
    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode == 13) {
        Mostra(Selector.$('codigo').value);
    }
}

function AbrePromptPesquisaFuncionarios() {

    if (Selector.$("botNovo").name === 'NovoTrue' || Selector.$("botModi").name === 'ModiTrue') {
        return;
    }

    PromptPesquisaFuncionarios(Selector.$('prompt'));
}

function PromptPesquisaFuncionarios(div) {

    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:block');

    var lblnome = DOM.newElement('label');
    lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblnome.appendChild(DOM.newText('Nome'));

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome2');
    txtnome.setAttribute('class', 'textbox_cinzafoco');
    txtnome.setAttribute('style', 'width:350px; margin-left:5px;');
    txtnome.setAttribute('onkeydown', 'pesquisa_KeyDown();');

    var botPesquisar = DOM.newElement('submit');
    botPesquisar.setAttribute('id', 'botEnviar');
    botPesquisar.setAttribute('class', 'botaosimplesfoco');
    botPesquisar.setAttribute('style', 'float:right;');
    botPesquisar.value = 'Pesquisar';
    botPesquisar.setAttribute('onclick', 'PesquisarFuncionarios();');

    var botCancelar = DOM.newElement('submit');
    botCancelar.setAttribute('id', 'botCancelar');
    botCancelar.setAttribute('class', 'botaosimplesfoco');
    botCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    botCancelar.value = 'Cancelar';
    botCancelar.setAttribute('onclick', 'dialogo.Close();');

    div.appendChild(lblnome);
    div.appendChild(DOM.newText(' '));
    div.appendChild(txtnome);

    div.appendChild(DOM.newText(' '));
    div.appendChild(botCancelar);
    div.appendChild(botPesquisar);
    div.innerHTML += '<br /><br />';

    var divopcoes = DOM.newElement('div', 'divFooterR');
    divopcoes.setAttribute('id', 'divopcoes');
    divopcoes.setAttribute('style', 'height:200px; overflow:auto;');

    Selector.$('prompt').appendChild(divopcoes);

    gridPesquisa = new Table('gridPesquisa');
    gridPesquisa.table.setAttribute('class', 'tabela_cinza_foco');
    gridPesquisa.table.setAttribute('cellpadding', '5');
    gridPesquisa.table.setAttribute('cellspacing', '0');

    gridPesquisa.addHeader([
        DOM.newText('Nome'),
        DOM.newText('CPF'),
        DOM.newText('Ativo')
    ]);

    divopcoes.appendChild(gridPesquisa.table);

    dialogo = new caixaDialogo('prompt', 290, 730, 'padrao/', 111);
    dialogo.Show();

    Selector.$('nome2').focus();
}

function pesquisa_KeyDown(ev) {
    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode == 13) {
        PesquisarClientes();
    }
}

function ExcluirFotoFuncionario() {

    if (codigoAtual <= 0 && Selector.$('foto').name == "")
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=ExcluirFotoFuncionario';
    p += '&foto=' + Selector.$('foto').name;
    p += '&idFuncionario=' + codigoAtual;

    ajax.Request(p);
}

function AlterarFoto() {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt2", 140, 350, 150, "2", "Atenção!", "Nenhum registro ativo. Selecione um registro e edite para alterar a foto.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    ExcluirFotoFuncionario();

    var nome = Number.Complete(parseInt(codigoAtual), 6, "0", true);
    var path = '../imagens/usuarios/';
    var funcao = 'SalvarFotoFuncionario';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg,jpg');
}

function SalvarFotoFuncionario(path) {

    var vetor = path.split("/");
    dialog.Close();

    Selector.$('foto').name = vetor[vetor.length - 1];

    GeraMiniaturaFuncionario(path);

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=SalvarFotoFuncionario';
    p += '&foto=' + Selector.$('foto').name;
    p += '&idFuncionario=' + codigoAtual;

    ajax.Request(p);

    Mostra(codigoAtual);
}

function GeraMiniaturaFuncionario(path) {

    if (codigoAtual <= 0)
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=GeraMiniaturaFuncionario';
    p += '&foto=' + Selector.$('foto').name;
    p += '&idFuncionario=' + codigoAtual;

    ajax.Request(p);

    var json = JSON.parse(ajax.getResponseText() );

    var aleatorio = Math.random();
    var aux = aleatorio.toString().split(".");
    aleatorio = aux[1].substr(0, 4);

    if (ajax.getResponseText() !== "0") {
        Selector.$('foto').src = json.foto + "?" + aleatorio;
        Selector.$('foto').setAttribute('style', 'width:auto; height:auto;');
    } else {
        var vetor = path.split("../");
        Selector.$('foto').src = vetor[1];
        Selector.$('foto').setAttribute('style', 'width:168px; height:168px;');
    }
}

function getPermissoes() {

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=getPermissoes';
    ajax.Request(p);

    if (ajax.getResponseText() === '') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() ) ;
    var tela = "";
    var chave = "";
    var cores = false;

    for (var i = 0; i < json.length; i++) {

        var checkbox = DOM.newElement('checkbox', "per" + json[i].idChave);

        var seta = DOM.newElement('img');
        seta.src = "imagens/setagrande.png";
        seta.setAttribute('style', 'margin-left:20px;');

        if (tela !== json[i].tela) {
            tela = json[i].tela;

            gridPermissoes.addRow([
                DOM.newText(''),
                DOM.newText(json[i].tela)
            ]);
        }

        if (chave !== json[i].chave) {

            chave = json[i].chave;

            gridPermissoes.addRow([
                checkbox,
                seta,
                DOM.newText(json[i].permissao)
            ]);
        }

        gridPermissoes.setRowData(gridPermissoes.getRowCount() - 1, json[i].idChave);
        gridPermissoes.getCell(gridPermissoes.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px;');
        gridPermissoes.getCell(gridPermissoes.getRowCount() - 1, 1).setAttribute('style', 'width:400px;');

        if (cores) {
            cores = false;
            gridPermissoes.getRow(gridPermissoes.getRowCount() - 1).setAttribute('class', 'selecioneLista');
        } else {
            gridPermissoes.getRow(gridPermissoes.getRowCount() - 1).setAttribute('class', 'selecioneLista2');
            cores = true;
        }
    }
}

function GravarPermissoes(codigo) {

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=DeletaPermissoes&codigo=' + codigo;
    ajax.Request(p);

    for (var i = 0; i < gridPermissoes.getRowCount(); i++) {

        if (gridPermissoes.getCellObject(i, 0).checked === true) {

            var p = 'action=GravarPermissoes';
            p += '&codigo=' + codigo;
            p += '&chave=' + gridPermissoes.getRowData(i);

            ajax.Request(p);
        }
    }
}

function MostraPermissoes(codigo) {

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=MostraPermissoes';
    p += '&codigo=' + codigo;
    ajax.Request(p);

    if (ajax.getResponseText() === '') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    for (var i = 0; i < json.length; i++) {

        Selector.$('per' + json[i].id_chave).checked = true;
    }
}

function DesabilitarGridPermissoes(Valor) {

    for (var i = 0; i < gridPermissoes.getRowCount(); i++) {
        gridPermissoes.getCellObject(i, 0).disabled = Valor;
    }
}

function MostrarAcessos(codigo) {

    gridAcessos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=MostrarAcessos';
    p += '&idFuncionario=' + codigo;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    var tipo;
    var cores = false;

    for (var i = 0; i < json.length; i++) {

        tipo = DOM.newElement('img');

        if (json[i].mobile === '1') {
            tipo.setAttribute('src', 'imagens/mobile.png');
            tipo.setAttribute('title', 'Logado através de um dispositivo móvel');
        } else {
            tipo.setAttribute('src', 'imagens/desktop.png');
            tipo.setAttribute('title', 'Logado através de um desktop');
        }

        gridAcessos.addRow([
            DOM.newText(json[i].data),
            DOM.newText(json[i].ip),
            tipo,
            DOM.newText(json[i].browser),
            DOM.newText(json[i].status)
        ]);

        gridAcessos.setRowData(i, json[i].idFuncionarioAcesso);
        gridAcessos.getCell(gridAcessos.getRowCount() - 1, 0).setAttribute('style', 'width:100px; text-align:center');
        gridAcessos.getCell(gridAcessos.getRowCount() - 1, 1).setAttribute('style', 'width:90px; text-align:center');
        gridAcessos.getCell(gridAcessos.getRowCount() - 1, 2).setAttribute('style', 'width:50px; text-align:center');

        if (cores) {
            cores = false;
            gridAcessos.getRow(gridAcessos.getRowCount() - 1).setAttribute('class', 'selecioneLista');
        } else {
            gridAcessos.getRow(gridAcessos.getRowCount() - 1).setAttribute('class', 'selecioneLista2');
            cores = true;
        }
    }
}

function DesbloquearUsuario() {

    if (codigoAtual <= 0) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=DesbloquearUsuario';
    p += '&idFuncionario=' + codigoAtual;
    ajax.Request(p);

    if (ajax.getResponseText() != '0') {

        Selector.$('usuarioBloqueado').style.display = 'none';
        Selector.$('btDesbloquear').style.display = 'none';
    }
}

function ResetarSenhaUsuarioAux() {

    mensagemResetarSenha = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente resetar a senha do usuário?", "OK", "ResetarSenhaUsuario();", true, "");
    mensagemResetarSenha.Show();
}

function ResetarSenhaUsuario() {

    if (codigoAtual <= 0) {
        return;
    }

    mensagemResetarSenha.Close();

    var ajax = new Ajax('POST', 'php/cadastro-de-funcionarios.php', false);
    var p = 'action=ResetarSenhaUsuario';
    p += '&idFuncionario=' + codigoAtual;
    p += '&login=' + Selector.$('login').value;
    ajax.Request(p);

    if (ajax.getResponseText() != '0') {

        Selector.$('usuarioBloqueado').style.display = 'none';
        Selector.$('btDesbloquear').style.display = 'none';
        var mensagem = new DialogoMensagens("prompt", 120, 350, 170, "3", "Sucesso!", "Senha resetada com sucesso!", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function PromptNovoAviso(codigo, linha) {

    if(codigo <= 0){

        if(!CheckPermissao(16, true, 'Você não possui permissão para cadastrar um novo aviso', false)){
            return;
        }
    }
    
    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Grave o registro primeiro", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    
    if(!isElement('div', 'promptNovoAviso')) {
        var div = DOM.newElement('div', 'promptNovoAviso');
        document.body.appendChild(div);
    }
    
    var div = Selector.$("promptNovoAviso");
    div.innerHTML = "";
    
    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "<span style='color:red;'>*</span> Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");
    
    var lblFunc = DOM.newElement('label');
    lblFunc.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblFunc.innerHTML = "Funcionário";
    
    var cmbFunc = DOM.newElement('select', 'cmbFuncionario');
    cmbFunc.setAttribute('class', 'combo_cinzafoco');
    cmbFunc.setAttribute('style', 'width:100%;');
    
    var divDataAviso = DOM.newElement('div');
    divDataAviso.setAttribute('class', 'divcontainer');
    divDataAviso.setAttribute('style', 'max-width:130px;');
    
    var lblDataAviso = DOM.newElement('label');
    lblDataAviso.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblDataAviso.innerHTML = "Data Aviso <span style='color:red'>*</span>";
    
    var txtDataAviso = DOM.newElement('text', 'dataAviso');
    txtDataAviso.setAttribute('class', 'textbox_cinzafoco');
    txtDataAviso.setAttribute('style', 'width:100%;');
    
    divDataAviso.appendChild(lblDataAviso);
    divDataAviso.appendChild(txtDataAviso);
    
    var divHoraAviso = DOM.newElement('div');
    divHoraAviso.setAttribute('class', 'divcontainer');
    divHoraAviso.setAttribute('style', 'max-width:100px; margin-left:10px;');
    
    var lblHoraAviso = DOM.newElement('label');
    lblHoraAviso.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblHoraAviso.innerHTML = "Hora Aviso <span style='color:red'>*</span>";

    var txtHoraAviso = DOM.newElement('text', 'horaAviso');
    txtHoraAviso.setAttribute('class', 'textbox_cinzafoco');
    txtHoraAviso.setAttribute('style', 'width:100%');
    
    divHoraAviso.appendChild(lblHoraAviso);
    divHoraAviso.appendChild(txtHoraAviso);
    
    var lbltexto = DOM.newElement('label');
    lbltexto.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lbltexto.innerHTML = "Descrição <span style='color:red'>*</span>";

    var txttexto = DOM.newElement('textarea');
    txttexto.setAttribute('id', 'descricaoAviso');
    txttexto.setAttribute('class', 'textbox_cinzafoco');
    txttexto.setAttribute('style', 'width:100%; height:80px;');
    
    var lblLink = DOM.newElement('label');
    lblLink.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblLink.innerHTML = "Link";
    
    var txtLink = DOM.newElement('text', 'link');
    txtLink.setAttribute('class', 'textbox_cinzafoco');
    txtLink.setAttribute('style', 'width:100%;');
    
    var chkLido = DOM.newElement('checkbox', 'chkLido');
    chkLido.setAttribute('style', 'margin-left:10px;');
    
    var lblLido = DOM.newElement('label');
    lblLido.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblLido.setAttribute('for', 'chkLido');
    lblLido.innerHTML = "Lido";
    
    var btGravar = DOM.newElement('submit', 'gravarAviso');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.value = 'Gravar';
    btGravar.setAttribute('onclick', 'GravarAviso(' + codigo + ');');

    divform.appendChild(lblcampo);
    divform.innerHTML += '<br/><br/>';
    divform.appendChild(lblFunc);
    divform.appendChild(cmbFunc);
    divform.appendChild(divDataAviso);
    divform.appendChild(divHoraAviso);
    divform.appendChild(chkLido);
    divform.appendChild(lblLido);
    divform.innerHTML += '<br/>';
    divform.appendChild(lbltexto);
    divform.appendChild(txttexto);
    divform.appendChild(lblLink);
    divform.appendChild(txtLink);
    
    divform.innerHTML += '<br/><br/>';
    divform.appendChild(btGravar);

    dialogoAviso = new caixaDialogo('promptNovoAviso', 410, 550, 'padrao/', 135);
    dialogoAviso.Show();
    
    Mask.setData(Selector.$('dataAviso'));
    Mask.setHora(Selector.$('horaAviso', false));
    
    Selector.$('dataAviso').placeHolder = Date.GetDate(false);
    Selector.$('horaAviso').placeHolder = Date.GetHora(false);
    
    if(codigo == 0) {
        
        getFuncionarios(Selector.$('cmbFuncionario'), "Todos", true);
        
    } else {
        getFuncionarios(Selector.$('cmbFuncionario'), "Todos", false);
        Selector.$('cmbFuncionario').value = codigoAtual;
        Selector.$('cmbFuncionario').disabled = true;
        
        Selector.$('dataAviso').value = gridAvisos.getCellText(linha, 0);
        Selector.$('horaAviso').value = gridAvisos.getCellText(linha, 1);
        Selector.$('chkLido').checked = (gridAvisos.getCellObject(linha, 3).name == '1' ? true : false);
        Selector.$('descricaoAviso').value = gridAvisos.getCellText(linha, 2);
        Selector.$('link').value = gridAvisos.getCellText(linha, 6);
    }
}

function VerificarAviso() {
    
    if (Selector.$('dataAviso').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe uma data de aviso.", "OK", "", false, "dataAviso");
        mensagem.Show();
        return false;
    }
    
    if (!Date.isDate(Selector.$('dataAviso').value)) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe uma data válida.", "OK", "", false, "dataAviso");
        mensagem.Show();
        return false;
    }
    
    if (Selector.$('horaAviso').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe uma hora de aviso.", "OK", "", false, "horaAviso");
        mensagem.Show();
        return false;
    }
    
    if (!Date.isHora(Selector.$('horaAviso').value, false)) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe uma hora válida.", "OK", "", false, "horaAviso");
        mensagem.Show();
        return false;
    }
    
    if (Selector.$('descricaoAviso').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe uma descrição para o aviso.", "OK", "", false, "descricaoAviso");
        mensagem.Show();
        return false;
    }
    
    return true;
}

function GravarAviso(codigo) {

    if(!CheckPermissao(16, true, 'Você não possui permissão para editar um aviso', false)){
        return;
    }
    
    if(!VerificarAviso())
        return;
    
    var ajax = new Ajax("POST", "php/cadastro-de-funcionarios.php", true);
    var p = "action=GravarAviso";
    p += "&idFuncionarioAviso=" + codigo;
    p += "&idFuncionario=" + Selector.$('cmbFuncionario').value;
    p += "&dataAviso=" + Selector.$('dataAviso').value;
    p += "&horaAviso=" + Selector.$('horaAviso').value;
    p += (Selector.$('chkLido').checked ? '&ok=1' : '&ok=0');
    p += "&descricao=" + Selector.$('descricaoAviso').value;
    p += "&link=" + Selector.$('link').value;
    
    ajax.ajax.onreadystatechange = function() {
        
        if(!ajax.isStateOK())
            return;
        
        Selector.$('gravarAviso').value = 'Gravar';
        Selector.$('gravarAviso').disabled = false;
        
        if(ajax.getResponseText() == '1') {
            MostraAvisos(codigoAtual);
            dialogoAviso.Close();
        } else if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o aviso. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
        } else {
            var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o aviso do funcionário " + ajax.getResponseText() + ". Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
        }
    };
    
    Selector.$('gravarAviso').value = 'Gravando';
    Selector.$('gravarAviso').disabled = true;
    
    ajax.Request(p);
}

function MostraAvisos(Codigo) {
    
    gridAvisos.clearRows();
    
    if(Codigo == 0)
        return;
    
    var ajax = new Ajax("POST", "php/cadastro-de-funcionarios.php", false);
    var p = "action=MostraAvisos";
    p += "&idFuncionario=" + Codigo;
    
    ajax.Request(p);
    
    if(ajax.getResponseText() == '0')
        return;
    
    var json = JSON.parse(ajax.getResponseText() );
    
    for(var i=0; i<json.length; i++) {
        
        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('name', json[i].idFuncionarioAviso);
        editar.setAttribute('style', 'cursor:pointer; width:16px');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'PromptNovoAviso('  + json[i].idFuncionarioAviso + ', ' + i + ');');
        
        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/excluir.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('name', json[i].idFuncionarioAviso);
        excluir.setAttribute('style', 'cursor:pointer; width:16px');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('onclick', 'confirmarExcluirAviso('  + json[i].idFuncionarioAviso + ');');
        
        var emailLido = DOM.newElement('img');
        if(json[i].ok == '0') {
            emailLido.setAttribute('src', 'imagens/mensagem.png');
            emailLido.setAttribute('title', 'Não lido');
        } else {
            emailLido.setAttribute('src', 'imagens/mensagemaberta.png');
            emailLido.setAttribute('title', 'Lido');
        }
        emailLido.setAttribute('name', json[i].ok);
        emailLido.setAttribute('style', 'cursor:default; width:20px;');
        emailLido.setAttribute('class', 'efeito-opacidade-75-04');
        
        gridAvisos.addRow([
            DOM.newText(json[i].dataAviso), 
            DOM.newText(json[i].horaAviso), 
            DOM.newText(json[i].descricao), 
            emailLido, 
            editar, 
            excluir, 
            DOM.newText(json[i].link)
        ]);
        
        gridAvisos.hiddenCol(6);
        
        gridAvisos.setRowData(i, json[i].idFuncionarioAviso);
        gridAvisos.getCell(gridAvisos.getRowCount() - 1, 0).setAttribute('style', 'width:100px; text-align:center');
        gridAvisos.getCell(gridAvisos.getRowCount() - 1, 1).setAttribute('style', 'width:80px; text-align:center');
        gridAvisos.getCell(gridAvisos.getRowCount() - 1, 3).setAttribute('style', 'width:60px; text-align:center');
        gridAvisos.getCell(gridAvisos.getRowCount() - 1, 4).setAttribute('style', 'width:60px; text-align:center');
        gridAvisos.getCell(gridAvisos.getRowCount() - 1, 5).setAttribute('style', 'width:60px; text-align:center');
        
        pintaLinhaGrid(gridAvisos);
    }
}

function confirmarExcluirAviso(codigo) {

    if(!CheckPermissao(17, true, 'Você não possui permissão para excluir um aviso', false)){
        return;
    }
 
    mensagemExcluirAviso = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este aviso?", "SIM", "ExcluirAviso(" + codigo + ")", true, "");
    mensagemExcluirAviso.Show();
}

function ExcluirAviso(codigo) {
    
    mensagemExcluirAviso.Close();
    
    var ajax = new Ajax("POST", "php/cadastro-de-funcionarios.php", false);
    var p = "action=ExcluirAviso";
    p += "&idFuncionarioAviso=" + codigo;
    
    ajax.Request(p);
    
    if(ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    
    MostraAvisos(codigoAtual);
}