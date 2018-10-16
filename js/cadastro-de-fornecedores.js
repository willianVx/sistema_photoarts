checkSessao();
CheckPermissao(12, false, '', true);
var codigoAtual = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Fornecedores</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setCEP(Selector.$("cep"));
    Mask.setData(Selector.$("cadastro"));
    Mask.setOnlyNumbers(Selector.$("numero"));
    Mask.setCelular(Selector.$("celular"));
    Mask.setTelefone(Selector.$("telefone"));
    SelecionaAbas(0);

    gridFornecedores = new Table('gridFornecedores');
    gridFornecedores.table.setAttribute('cellpadding', '4');
    gridFornecedores.table.setAttribute('cellspacing', '0');
    gridFornecedores.table.setAttribute('class', 'tabela_cinza_foco');

    gridFornecedores.addHeader([
        DOM.newText('Fornecedor'),
        DOM.newText('CPF/CNPJ'),
        DOM.newText('Endereço'),
        DOM.newText('Telefone'),
        DOM.newText('Celular'),
        DOM.newText('Email'),
        DOM.newText('Ativo'),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridFornecedores.table);
    Selector.$('divRel').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
    MostrarFornecedores();

    var divFinanceiro = Selector.$('divFinanceiro');

    gridFinanceiro = new Table('gridFinanceiro');
    gridFinanceiro.table.setAttribute('class', 'tabela_cinza_foco');
    gridFinanceiro.table.setAttribute('cellpadding', '5');
    gridFinanceiro.table.setAttribute('cellspacing', '0');

    gridFinanceiro.addHeader([
        DOM.newText('Descriçao'),
        DOM.newText('Parcela'),
        DOM.newText('Vencimento'),
        DOM.newText('Valor'),
        DOM.newText('Situação'),
        DOM.newText('Valor Pago'),
        DOM.newText('Ver')
    ]);

    divFinanceiro.appendChild(gridFinanceiro.table);

    var data = new Date();
    var dia = (data.getDate()).toString();
    var mes = data.getMonth() + 1;

    if (mes < 10) {
        mes = '0'.concat(mes.toString());
    } else {
        mes.toString();
    }

    var ano = (data.getFullYear()).toString();
    var diadecadastro = dia.concat('/'.concat(mes).concat('/'.concat(ano)));

    Selector.$('cadastro').value = diadecadastro;
};

window.onresize = function () {
    Selector.$('divRel').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Novo(ajustar) {

    if(!CheckPermissao(13, true, 'Você não possui permissão para cadastrar um novo fornecedor', false)){
        return;
    }

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('cadastro').value = Date.GetDate(false);
    Selector.$('fisica').checked = true;
    selecionaPessoa();
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
        Selector.$('divContainer').style.maxWidth = '825px';
        Selector.$('divCadastro2').setAttribute('style', 'height:500px; width:100%; overflow:hidden;');
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

function MostrarFornecedores() {

    gridFornecedores.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', true);
    var p = 'action=MostrarFornecedores';
    p += '&busca=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var ver;
        var cor;

        for (var i = 0; i < json.length; i++) {

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Fornecedor');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idFornecedor + ', true)');

            gridFornecedores.addRow([
                DOM.newText(json[i].razaoFornecedor + ' (' + json[i].fornecedor + ')'),
                DOM.newText(json[i].cpfCnpj),
                DOM.newText(json[i].endereco),
                DOM.newText(json[i].telefone),
                DOM.newText(json[i].celular),
                DOM.newText(json[i].email),
                DOM.newText(json[i].ativo),
                ver
            ]);

            gridFornecedores.setRowData(gridFornecedores.getRowCount() - 1, json[i].idFornecedor);
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:100px;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 5).setAttribute('style', 'text-align:left; width:200px;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:80px;');
            gridFornecedores.getCell(gridFornecedores.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:30px;');

            if (cor) {
                cor = false;
                gridFornecedores.setRowBackgroundColor(gridFornecedores.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridFornecedores.setRowBackgroundColor(gridFornecedores.getRowCount() - 1, "#FFF");
            }
        }
    };
    pintaLinhaGrid(gridFornecedores);
    
    ajax.Request(p);
}

function selecionaPessoa() {

    if (Selector.$('fisica').checked) {
        Mask.setCPF(Selector.$('cpf'));
        Selector.$("rotulorg").innerHTML = "RG";
        Selector.$("rotulonome").innerHTML = "Nome";
        Selector.$("rotuloapelido").innerHTML = "Apelido";
        Selector.$("rotulocpf").innerHTML = "CPF";
    }
    else {
        Mask.setCNPJ(Selector.$('cpf'));
        Selector.$("rotulorg").innerHTML = "IE";
        Selector.$("rotulonome").innerHTML = "Razão";
        Selector.$("rotuloapelido").innerHTML = "Fantasia";
        Selector.$("rotulocpf").innerHTML = "CNPJ";
    }
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 1; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid; border-color:#D7D7D7; overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; min-height:440px;  height:auto; border-top:1px solid; border-color:#D7D7D7; overflow:hidden');
}

function Desabilita(Valor) {

    Selector.$('fisica').disabled = Valor;
    Selector.$('juridica').disabled = Valor;
    Selector.$('cpf').disabled = Valor;
    Selector.$('rg').disabled = Valor;
    Selector.$('razaoSocial').disabled = Valor;
    Selector.$('nome').disabled = Valor;
    Selector.$('cadastro').disabled = Valor;
    Selector.$('ativo').disabled = Valor;
    Selector.$('cep').disabled = Valor;
    Selector.$('endereco').disabled = Valor;
    Selector.$('numero').disabled = Valor;
    Selector.$('complemento').disabled = Valor;
    Selector.$('bairro').disabled = Valor;
    Selector.$('cidade').disabled = Valor;
    Selector.$('estado').disabled = Valor;
    Selector.$('responsavel').disabled = Valor;
    Selector.$('telefone').disabled = Valor;
    Selector.$('celular').disabled = Valor;
    Selector.$('email').disabled = Valor;
    Selector.$('site').disabled = Valor;
    Selector.$('obs').disabled = Valor;
}

function D1_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
    ajax.Request('action=GetRegistroPrimeiro&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D2_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
    ajax.Request('action=GetRegistroAnterior&atual=' + codigoAtual + "&codigo=" + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D3_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
    ajax.Request('action=GetRegistroProximo&atual=' + codigoAtual + "&codigo=" + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D4_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
    ajax.Request('action=GetRegistroUltimo&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function botNovo_onClick() {

    checkPermissao(6, true);

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
        Selector.$('fisica').checked = true;
        selecionaPessoa();
        Selector.$('cadastro').value = Date.GetDate(false);
        Selector.$('cpf').focus();
    }
}

function botModi_onClick() {

    checkPermissao(6, true);

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

    var mensagem = new DialogoMensagens("prompt2", 120, 500, 150, "2", "Atenção!", "Não é possível excluir fornecedores, favor editar o cadastro e inativá-lo.", "OK", "", false, "");
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

    Selector.$('fisica').checked = false;
    Selector.$('juridica').checked = false;
    Selector.$('cpf').value = "";
    Selector.$('rg').value = "";
    Selector.$('cep').name = "";
    Selector.$('cep').value = "";
    Selector.$('ativo').checked = false;
    Selector.$('ultimaAtualizacaopor').innerHTML = "";
    Selector.$('razaoSocial').value = "";
    Selector.$('nome').value = "";
    Selector.$('cadastro').value = "";
    Selector.$('endereco').value = "";
    Selector.$('numero').value = "";
    Selector.$('complemento').value = "";
    Selector.$('bairro').value = "";
    Selector.$('cidade').value = "";
    Selector.$('estado').value = "";
    Selector.$('responsavel').value = "";
    Selector.$('telefone').value = "";
    Selector.$('celular').value = "";
    Selector.$('email').value = "";
    Selector.$('site').value = "";
    Selector.$('obs').value = "";
    gridFinanceiro.clearRows();
}

function VerificaCampos() {

    if (Selector.$('razaoSocial').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe " + (Selector.$('fisica').checked ? "o nome" : "a Razão") + " do fornecedor", "OK", "", false, "razaoSocial");
        mensagem.Show();
        return false;
    }

    if (Selector.$('nome').value.trim() === "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe " + (Selector.$('fisica').checked ? "o apelido" : "o nome fantasia") + " do fornecedor", "OK", "", false, "nome");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar() {

    if(!CheckPermissao(13, true, 'Você não possui permissão para editar um fornecedor', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&razaoSocial=' + Selector.$('razaoSocial').value;
    p += '&nome=' + Selector.$('nome').value;
    if (Selector.$('ativo').checked === true) {
        p += '&ativo=1';
    } else {
        p += '&ativo=0';
    }
    if (Selector.$('fisica').checked === true) {
        p += '&tipo=F';
    } else {
        p += '&tipo=J';
    }
    p += '&cpf=' + Selector.$('cpf').value;
    p += '&rgIe=' + Selector.$('rg').value;
    p += '&cadastro=' + Selector.$('cadastro').value;
    p += '&cep=' + Selector.$('cep').value;
    p += '&endereco=' + Selector.$('endereco').value;
    p += '&numero=' + Selector.$('numero').value;
    p += '&complemento=' + Selector.$('complemento').value;
    p += '&bairro=' + Selector.$('bairro').value;
    p += '&cidade=' + Selector.$('cidade').value;
    p += '&estado=' + Selector.$('estado').value;
    p += '&responsavel=' + Selector.$('responsavel').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&celular=' + Selector.$('celular').value;
    p += '&email=' + Selector.$('email').value;
    p += '&site=' + Selector.$('site').value;
    p += '&obs=' + Selector.$('obs').value;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt2", 140, 500, 150, "1", "Erro", "Erro ao gravar o fornecedor. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return false;
    } else {
        Cancelar();
        MostrarFornecedores();
        codigoAtual = ajax.getResponseText();
        return true;
    }
}

function Mostra(Codigo, ajustar) {

     if(!CheckPermissao(164, true, 'Você não possui permissão para Visualizar detalhes sobre o  fornecedor', false)){
        return;
    }
    if (Codigo === '' || parseInt(Codigo) === 0) {
        return;
    }

    Novo(ajustar);
    Limpar();

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
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
    Selector.$('razaoSocial').value = json.razaoFornecedor;
    Selector.$('nome').value = json.fornecedor;
    Selector.$('cadastro').value = json.cadastro;
    Selector.$('cep').value = json.cep;
    Selector.$('cep').name = json.cep;
    Selector.$('endereco').value = json.endereco;
    Selector.$('numero').value = json.numero;
    Selector.$('complemento').value = json.complemento;
    Selector.$('bairro').value = json.bairro;
    Selector.$('cidade').value = json.cidade;
    Selector.$('estado').value = json.estado;
    Selector.$('responsavel').value = json.responsavel;
    Selector.$('telefone').value = json.telefone;
    Selector.$('celular').value = json.celular;
    Selector.$('email').value = json.email;
    Selector.$('site').value = json.site;
    Selector.$('obs').value = json.obs;
    Selector.$('ultimaAtualizacaopor').innerHTML = json.usuario;
    Selector.$('ativo').checked = (json.ativo === '1' ? true : false);

    if (json.tipo === 'F') {
        Selector.$('fisica').checked = true;
    } else {
        Selector.$('juridica').checked = true;
    }

    selecionaPessoa();
    Selector.$('cpf').value = json.cpfCnpj;
    Selector.$('rg').value = json.rgIe;
    MostraFinanceiro(2);

    if(!CheckPermissao(14, false, '', false)){
        Selector.$('aba1').style.display = 'none';
        Selector.$('div1').style.display = 'none';
    }
}

function PesquisarFornecedores() {

    gridPesquisa.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', false);
    var p = 'action=PesquisarFornecedores';
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
            DOM.newText(json[i].razaoFornecedor),
            DOM.newText(json[i].fornecedor),
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

function AbrePromptPesquisaFornecedores() {
    if (Selector.$("botNovo").name === 'NovoTrue' || Selector.$("botModi").name === 'ModiTrue') {
        return;
    }

    PromptPesquisaFornecedores(Selector.$('prompt'));
}

function PromptPesquisaFornecedores(div) {

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
    botPesquisar.setAttribute('onclick', 'PesquisarFornecedores();');

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
        DOM.newText('Razão Social'),
        DOM.newText('Fornecedor'),
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

function MostraFinanceiro(tipo) {

    gridFinanceiro.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-fornecedores.php', true);
    var p = 'action=MostraFinanceiro';
    p += '&codigo=' + codigoAtual;
    p += '&tipo=' + tipo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var visualizar;
        var descricao;
        var numero;
        var dataVencimento;
        var valor;
        var situacao;
        var valorPago;
        var cor = true;

        for (var i = 0; i < json.length; i++) {

            descricao = DOM.newElement('label');
            descricao.innerHTML = json[i].descricao;

            numero = DOM.newElement('label');
            numero.innerHTML = json[i].numero;

            dataVencimento = DOM.newElement('label');
            dataVencimento.innerHTML = json[i].dataVencimento;

            valor = DOM.newElement('label');
            valor.innerHTML = json[i].valor;

            situacao = DOM.newElement('label');
            situacao.innerHTML = json[i].situacao;

            valorPago = DOM.newElement('label');
            valorPago.innerHTML = json[i].valorPago;

            visualizar = DOM.newElement('img');
            visualizar.setAttribute('src', 'imagens/pesquisar.png');
            visualizar.setAttribute('title', 'Editar');
            visualizar.setAttribute('class', 'efeito-opacidade-75-04');
            visualizar.setAttribute('onclick', 'VisualizarParcela(' + json[i].idConpag + ');');

            gridFinanceiro.addRow([
                descricao,
                numero,
                dataVencimento,
                valor,
                situacao,
                valorPago,
                visualizar
            ]);

            gridFinanceiro.setRowData(i, json[i].idConpagParcela);
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 1).setAttribute('style', 'text-align:center');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 2).setAttribute('style', 'text-align:center');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 3).setAttribute('style', 'text-align:right');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 4).setAttribute('style', 'text-align:center');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 5).setAttribute('style', 'text-align:right');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 6).setAttribute('style', 'text-align:center');

            if (json[i].vencido === '1' && json[i].situacao === 'Em aberto') {
                gridFinanceiro.getCellObject(i, 0).setAttribute('style', 'color:red');
                gridFinanceiro.getCellObject(i, 1).setAttribute('style', 'color:red');
                gridFinanceiro.getCellObject(i, 2).setAttribute('style', 'color:red');
                gridFinanceiro.getCellObject(i, 3).setAttribute('style', 'color:red');
                gridFinanceiro.getCellObject(i, 4).setAttribute('style', 'color:red');
                gridFinanceiro.getCellObject(i, 5).setAttribute('style', 'color:red');
            }

            if (cor) {
                cor = false;
                gridFinanceiro.setRowBackgroundColor(gridFinanceiro.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridFinanceiro.setRowBackgroundColor(gridFinanceiro.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function VisualizarParcela(idConpag) {

    window.location = 'cadastro-de-contas.html?source=fornecedores&idConpag=' + idConpag;
}