var codigoAtual = 0;
ValidarSessao();

window.onload = function () {

    CarregarDadosUsuario();

    Mask.setData(Selector.$("cadastro"));
    Mask.setData(Selector.$("dataNasc"));
    Mask.setCelular(Selector.$("celular"));
    Mask.setTelefone(Selector.$("telefone"));
    Mask.setMoeda(Selector.$("arquitetoComissao"))
    selecionaPessoa();
    SelecionaAbas(0);

    //ENDEREÇOS
    var divEnderecos = Selector.$('divEnderecos');
    gridEnderecos = new Table('gridEnderecos');
    gridEnderecos.table.setAttribute('class', 'tabela_cinza_foco');
    gridEnderecos.table.setAttribute('cellpadding', '3');
    gridEnderecos.table.setAttribute('cellspacing', '0');

    gridEnderecos.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('CEP'),
        DOM.newText('Endereço'),
        DOM.newText('N°'),
        DOM.newText('Complemento'),
        DOM.newText('Bairro'),
        DOM.newText('Cidade'),
        DOM.newText('Estado'),
        DOM.newText(''),
        DOM.newText('')
    ]);

    divEnderecos.appendChild(gridEnderecos.table);

    //ESTILOS
    var divEstilos = Selector.$('divEstilos');

    gridEstilos = new Table('gridEstilos');
    gridEstilos.table.setAttribute('class', 'tabela_cinza_foco');
    gridEstilos.table.setAttribute('cellpadding', '3');
    gridEstilos.table.setAttribute('cellspacing', '0');

    gridEstilos.addHeader([
        DOM.newText('Estilo'),
        DOM.newText(''),
        DOM.newText('idEstilo')
    ]);

    divEstilos.appendChild(gridEstilos.table);
    gridEstilos.hiddenCol(2);

    //ORÇAMENTOS
    var divPropostas = Selector.$('divPropostas');

    gridProposta = new Table('gridProposta');
    gridProposta.table.setAttribute('class', 'tabela_cinza_foco');
    gridProposta.table.setAttribute('cellpadding', '3');
    gridProposta.table.setAttribute('cellspacing', '0');

    gridProposta.addHeader([
        DOM.newText('Nº Orçamento'),
        DOM.newText('Loja'),
        DOM.newText('Data'),
        DOM.newText('Obra(s)'),
        DOM.newText('Valor Total'),
        DOM.newText('Pagamento'),
        DOM.newText('Vendedor'),
        DOM.newText('Status'),
        DOM.newText('Ver')
    ]);

    divPropostas.appendChild(gridProposta.table);

    //VENDAS
    var divVendas = Selector.$('divVendas');

    gridVendas = new Table('gridVendas');
    gridVendas.table.setAttribute('class', 'tabela_cinza_foco');
    gridVendas.table.setAttribute('cellpadding', '3');
    gridVendas.table.setAttribute('cellspacing', '0');

    gridVendas.addHeader([
        DOM.newText('Nº Pedido'),
        DOM.newText('Loja'),
        DOM.newText('Data'),
        DOM.newText('Obra(s)'),
        DOM.newText('Valor Total'),
        DOM.newText('Pagamento'),
        DOM.newText('Vendedor'),
        DOM.newText('Status'),
        DOM.newText('Ver')
    ]);

    divVendas.appendChild(gridVendas.table);

    //FINANCEIRO
    var divFinanceiro = Selector.$('divFinanceiro');

    gridFinanceiro = new Table('gridFinanceiro');
    gridFinanceiro.table.setAttribute('class', 'tabela_cinza_foco');
    gridFinanceiro.table.setAttribute('cellpadding', '3');
    gridFinanceiro.table.setAttribute('cellspacing', '0');

    gridFinanceiro.addHeader([
        DOM.newText('Nº Pedido'),
        DOM.newText('Loja'),
        DOM.newText('Parcela'),
        DOM.newText('Vencimento'),
        DOM.newText('Valor'),
        DOM.newText('Situação'),
        DOM.newText('Ver')
    ]);

    divFinanceiro.appendChild(gridFinanceiro.table);

    //FOLLOW-UP
    var tabelaFollow = Selector.$('tabelaFollow');

    gridFollow = new Table('gridProposta');
    gridFollow.table.setAttribute('class', 'tabela_cinza_foco');
    gridFollow.table.setAttribute('cellpadding', '5');
    gridFollow.table.setAttribute('cellspacing', '0');

    gridFollow.addHeader([
        DOM.newText('Data'),
        DOM.newText('Tipo'),
        DOM.newText('Obs'),
        DOM.newText('Responsável'),
        DOM.newText('Retorno'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    tabelaFollow.appendChild(gridFollow.table);

    getEstilos(Selector.$('estilos'), 'Selecione...', true);

    gridColecionadores = new Table('gridColecionadores');
    gridColecionadores.table.setAttribute('cellpadding', '4');
    gridColecionadores.table.setAttribute('cellspacing', '0');
    gridColecionadores.table.setAttribute('class', 'tabela_cinza_foco');

    gridColecionadores.addHeader([
        DOM.newText('N°'),
        DOM.newText('Data Cadastro'),
        DOM.newText('Nome'),
        DOM.newText('Tipo Pessoa'),
        DOM.newText('Qtde. Endereços'),
        DOM.newText('Telefones'),
        DOM.newText('E-mail'),
        DOM.newText('Ativo'),
        DOM.newText('Premium'),
        DOM.newText('Arquiteto'),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridColecionadores.table);
    Selector.$('divRel').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
    MostraColecionadores(true);
    Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');

    if(Window.getParameter('novo') != null && Window.getParameter('novo') != 'null'){
        Novo(true);
    }
};

window.onresize = function () {

    if (Selector.$('divRel').clientHeight > 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
    }
};

function MostraColecionadores(aviso) {    

    var ajax = new Ajax('POST', 'php/clientes.php', true);
    var p = 'action=MostraClientes';
    p += '&busca=' + Selector.$('busca').value;
    p += '&todos=' + Selector.$('mostrartodos').checked;
    p += '&mostraClientesPremium=' + Selector.$('mostrarClientesPremium').checked;
    p += '&mostraArquitetos=' + Selector.$('mostrarArquitetos').checked; 
 
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        gridColecionadores.clearRows();

        if (ajax.getResponseText().trim() == '0') {
            if (aviso) {
                var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Nenhum colecionador encontrado", "OK", "", false, "busca");
                mensagem.Show();
            }
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            var ver = DOM.newElement('img');
            ver.setAttribute('src', '../imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Colecionador');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idCliente + ', true)');

            var qtdEnderecos = DOM.newElement('span');
            qtdEnderecos.innerHTML = json[i].qtdEnderecos;

            if(json[i].qtdEnderecos > 0){
                qtdEnderecos.setAttribute('style', 'text-decoration:underline; cursor:pointer');
                qtdEnderecos.setAttribute('onclick', 'PromptEnderecos(' + json[i].idCliente + ')');
            }

            gridColecionadores.addRow([
                DOM.newText(json[i].numeroCliente),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].tipo),
                qtdEnderecos,
                DOM.newText(json[i].telefones),
                DOM.newText(json[i].email),
                DOM.newText(json[i].ativo),
                DOM.newText(json[i].premium),
                DOM.newText(json[i].arquiteto),
                ver
            ]);

            gridColecionadores.setRowData(gridColecionadores.getRowCount() - 1, json[i].idCliente);
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; max-width:50px;');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 6).setAttribute('style', 'text-align:left; width:200px;');
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:60px;' + (json[i].ativo == 'SIM' ? 'color:green;' : 'color:red'));
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:60px;' + (json[i].ativo == 'SIM' ? 'color:green;' : 'color:red'));
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:60px;' + (json[i].arquiteto.substr(0, 3) == 'SIM' ? 'color:green;' : ''));
            gridColecionadores.getCell(gridColecionadores.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:40px;');

            pintaLinhaGrid(gridColecionadores);
        }
    };

    ajax.Request(p);
}

function selecionaPessoa() {

    if (Selector.$('fisica').checked) {
        Mask.setCPF(Selector.$('cpf'));
        Selector.$("masc").checked = true;
        Selector.$("rotulodatanasc").innerHTML = "Data de Nascimento";
        Selector.$("cpf").setAttribute('placeHolder', 'Ex.: 123.456.789-09');
        Selector.$("rotulorg").innerHTML = "RG";
        Selector.$("rotulonome").innerHTML = "Nome";
        Selector.$("rotuloapelido").innerHTML = "Apelido";
        Selector.$("rotulocpf").innerHTML = "CPF";

        Selector.$('divSexoMasc').style.display = 'inline-block';
        Selector.$('divSexoFem').style.display = 'inline-block';
    }
    else {
        Mask.setCNPJ(Selector.$('cpf'));
        Selector.$('cpf').setAttribute('placeHolder', 'Ex.: 01.234.567/0001-01');
        Selector.$("rotulorg").innerHTML = "IE";
        Selector.$("rotulodatanasc").innerHTML = "Data de Fundação";
        Selector.$("rotulonome").innerHTML = "Razão";
        Selector.$("rotuloapelido").innerHTML = "Fantasia";
        Selector.$("rotulocpf").innerHTML = "CNPJ";

        Selector.$('divSexoMasc').style.display = 'none';
        Selector.$('divSexoFem').style.display = 'none';
    }
    
    Selector.$('cpf').value = "";
    Selector.$('cpf').name = false;
    Selector.$('rg').value = "";
    Selector.$('dataNasc').value = "";
    Selector.$('nome').value = "";
    Selector.$('apelido').value = "";
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 4; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid; border-color:#D7D7D7; overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; background:#FFF;min-height:440px; height:450px; border-top:1px solid; border-color:#D7D7D7; overflow:hidden; z-index:1');
}

function Desabilita(Valor) {

    Selector.$('fisica').disabled = Valor;
    Selector.$('juridica').disabled = Valor;
    Selector.$('cpf').disabled = Valor;
    Selector.$('rg').disabled = Valor;
    Selector.$('dataNasc').disabled = Valor;

    Selector.$('masc').disabled = Valor;
    Selector.$('femin').disabled = Valor;

    Selector.$('nome').disabled = Valor;
    Selector.$('apelido').disabled = Valor;
    Selector.$('cadastro').disabled = Valor;
    Selector.$('ativo').disabled = Valor;
    Selector.$('premium').disabled = Valor;
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

    Selector.$('estilos').disabled = Valor;
    Selector.$('btnAdicionarEstilo').disabled = Valor;
    Selector.$('obs').disabled = Valor;

    Selector.$('codigo').style.display = (!Valor ? "none" : "block");
    Selector.$('d1').style.display = (!Valor ? "none" : "block");
    Selector.$('d2').style.display = (!Valor ? "none" : "block");
    Selector.$('d3').style.display = (!Valor ? "none" : "block");
    Selector.$('d4').style.display = (!Valor ? "none" : "block");

    AjustaImagensEdicao(Selector.$('botNovo'), Selector.$('botModi'), Selector.$('botSair'), Selector.$('botDel'), Selector.$('lupinha'));
}

function D1_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    ajax.Request('action=GetRegistroPrimeiro&codigo=' + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D2_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    ajax.Request('action=GetRegistroAnterior&atual=' + codigoAtual + "&codigo=" + Selector.$('codigo').value);
    Mostra(ajax.getResponseText());
}

function D3_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    ajax.Request('action=GetRegistroProximo&atual=' + codigoAtual + "&codigo=" + Selector.$('codigo').value);

    Mostra(ajax.getResponseText());
}

function D4_onClick() {

    if (Selector.$('codigo').value.trim() === "") {
        Selector.$('codigo').value = 0;
    }

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    ajax.Request('action=GetRegistroUltimo&codigo=' + Selector.$('codigo').value);

    Mostra(ajax.getResponseText());
}

function AjustaImagensEdicao(BotNovo, BotModi, BotSair, BotAux1, BotAux2) {

    if (BotNovo.name === 'NovoTrue') {
        BotNovo.src = '../imagens/validar.png';
        BotNovo.title = 'Salvar';
        BotModi.src = '../imagens/cadastro.png';
        BotSair.src = '../imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotModi.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else if (BotModi.name === 'ModiTrue') {
        BotModi.src = '../imagens/validar.png';
        BotModi.title = 'Salvar';
        BotNovo.src = '../imagens/novo.png';
        BotSair.src = '../imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotNovo.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else {
        BotNovo.src = '../imagens/novo.png';
        BotNovo.title = 'Novo';
        BotModi.src = '../imagens/cadastro.png';
        BotModi.title = 'Modificar';
        BotSair.src = '../imagens/sair3.png';
        BotSair.title = 'Sair';
        BotNovo.style.visibility = 'visible';
        BotModi.style.visibility = 'visible';
        BotSair.style.visibility = 'visible';
        BotAux1.style.visibility = 'visible';
        BotAux2.style.visibility = 'visible';
    }
}

function botNovo_onClick() {

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

    if (Selector.$('botNovo').name === 'NovoTrue') {
        return;
    }

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Nenhum registro ativo", "OK", "", false, "");
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
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Nenhum registro ativo", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var mensagem = new DialogoMensagens("prompt1", 120, 500, 150, "2", "Atenção!", "Não é possível excluir clientes, favor editar o cadastro e inativá-lo.", "OK", "", false, "");
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

    SelecionaAbas(0);

    codigoAtual = 0;

    Selector.$('fisica').checked = true;
    selecionaPessoa();
    Selector.$('cpf').value = "";
    Selector.$('masc').checked = true;
    Selector.$('ativo').checked = true;
    Selector.$('premium').checked = false;
    Selector.$('arquiteto').checked = false;
    Selector.$('arquitetoComissao').value = "";
    Selector.$('ultimaAtualizacaopor').innerHTML = "";
    
    Selector.$('nome').value = "";
    Selector.$('apelido').value = "";
    Selector.$('rg').value = "";
    Selector.$('dataNasc').value = "";
    Selector.$('cadastro').value = "";

    Selector.$('responsavel').value = "";
    Selector.$('telefone').value = "";
    Selector.$('celular').value = "";
    Selector.$('email').value = "";
    Selector.$('site').value = "";

    Selector.$('estilos').selectedIndex = 0;
    Selector.$('obs').value = "";

    gridEstilos.clearRows();
    gridProposta.clearRows();
    gridVendas.clearRows();
    gridFinanceiro.clearRows();
    gridFollow.clearRows();
}

function VerificaCampos() {

    if (Selector.$('nome').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, informe a razão do cliente.", "OK", "", false, "nome");
        mensagem.Show();
        return false;
    }

    if (Selector.$('telefone').value.trim() === '' && Selector.$('celular').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, informe o número de telefone ou celular do cliente.", "OK", "", false, "telefone");
        mensagem.Show();
        return false;
    }

    if (Selector.$('email').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, informe um e-mail do cliente.", "OK", "", false, "email");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar() {

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&nome=' + Selector.$('nome').value;
    p += '&apelido=' + Selector.$('apelido').value;

    if (Selector.$('ativo').checked) {
        p += '&ativo=1';
    } else {
        p += '&ativo=0';
    }

    if (Selector.$('premium').checked) {
        p += '&premium=1';
    } else {
        p += '&premium=0';
    }
    
    if (Selector.$('arquiteto').checked) {
        p += '&arquiteto=1';        
        p += '&arquitetoComissao=' + Selector.$('arquitetoComissao').value;
    } else {
        p += '&arquiteto=0';        
        p += '&arquitetoComissao=0';
    }

    if (Selector.$('fisica').checked === true) {
        p += '&tipo=F';
    } else {
        p += '&tipo=J';
    }

    p += '&cpf=' + Selector.$('cpf').value;
    p += '&rg=' + Selector.$('rg').value;
    p += '&sexoM=' + Selector.$('masc').checked;
    p += '&dataNasc=' + Selector.$('dataNasc').value;
    p += '&cadastro=' + Selector.$('cadastro').value;
    p += '&responsavel=' + Selector.$('responsavel').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&celular=' + Selector.$('celular').value;
    p += '&email=' + Selector.$('email').value;
    p += '&site=' + Selector.$('site').value;
    p += '&obs=' + Selector.$('obs').value;
    p += '&idsClientesEstilos=' + gridEstilos.getRowsData();
    p += '&idsEstilos=' + gridEstilos.getContentRows(2);
    p += '&idsClienteEnderecos=' + gridEnderecos.getRowsData();
    p += '&tiposEnderecos=' + gridEnderecos.getContentRows(0);
    p += '&ceps=' + gridEnderecos.getContentRows(1);
    p += '&enderecos=' + gridEnderecos.getContentRows(2);
    p += '&numeros=' + gridEnderecos.getContentRows(3);
    p += '&complementos=' + gridEnderecos.getContentRows(4);
    p += '&bairros=' + gridEnderecos.getContentRows(5);
    p += '&cidades=' + gridEnderecos.getContentRows(6);
    p += '&estados=' + gridEnderecos.getContentRows(7);
    ajax.Request(p);

    if (parseInt(ajax.getResponseText()) == 0) {
        var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao gravar o colecionador. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return false;
    } else {
        Cancelar();
        MostraColecionadores(true);
        codigoAtual = ajax.getResponseText();
        return true;
    }
}

function MostraOld(Codigo) {

    if (Codigo === '' || parseInt(Codigo) === 0) {
        return;
    }

    Limpar();
    var ajax = new Ajax('POST', 'php/clientes.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;
    ajax.Request(p);
    if (ajax.getResponseText() == 0) {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Registro não localizado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var json = JSON.parse(ajax.getResponseText());
    codigoAtual = json.codigo;
    Selector.$('codigo').value = codigoAtual;
    Selector.$('nome').value = json.nome;
    Selector.$('apelido').value = json.apelido;
    Selector.$('cadastro').value = json.cadastro;
    Selector.$('rg').value = json.rg;
    Selector.$('dataNasc').value = json.dataNasc;
    if (json.sexoM == 'M')
        Selector.$('masc').checked = 'checked';
    else
        Selector.$('femin').checked = 'checked';
    Selector.$('cep').value = json.cep;
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
    Selector.$('ativo').checked = (json.ativo == '1' ? 'checked' : '');
    if (json.tipo === 'F') {
        Selector.$('fisica').checked = true;
    } else {
        Selector.$('juridica').checked = true;
    }

    selecionaPessoa();
    Selector.$('cpf').value = json.cpf;
    MostrarEstilos(json.arrayEstilos);
    getFollow();
}

function Mostra(Codigo, ajustar) {

    if (Codigo === '' || parseInt(Codigo) === 0) {
        return;
    }

    Novo(ajustar);
    Limpar();

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Registro não localizado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var json = JSON.parse(ajax.getResponseText());
    codigoAtual = json.codigo;
    
    if (json.tipo === 'F') {
        Selector.$('fisica').checked = true;
    } else {
        Selector.$('juridica').checked = true;
    }

    selecionaPessoa();
    Selector.$('cpf').value = json.cpf;
    Selector.$('nome').value = json.nome;
    Selector.$('apelido').value = json.apelido;
    Selector.$('cadastro').value = json.cadastro;
    Selector.$('rg').value = json.rg;
    Selector.$('dataNasc').value = json.dataNasc;

    if (json.sexoM == 'M')
        Selector.$('masc').checked = 'checked';
    else
        Selector.$('femin').checked = 'checked';

    Selector.$('responsavel').value = json.responsavel;
    Selector.$('telefone').value = json.telefone;
    Selector.$('celular').value = json.celular;
    Selector.$('email').value = json.email;
    Selector.$('site').value = json.site;
    Selector.$('obs').value = json.obs;
    Selector.$('ultimaAtualizacaopor').innerHTML = json.usuario;
    Selector.$('ativo').checked = (json.ativo == '1' ? 'checked' : '');
    Selector.$('premium').checked = (json.premium == '1' ? 'checked' : '');
    Selector.$('arquiteto').checked = (json.arquiteto == '1' ? 'checked' : '');
    Selector.$('arquitetoComissao').value = json.arquitetoComissao;
    arquiteto_click();
    
    MostrarEstilos(json.arrayEstilos);
    MostrarEnderecos(json.arrayEnderecos);
    MostrarOrcamentos(json.arrayOrcamentos);
    MostrarVendas(json.arrayVendas);
    MostrarFinanceiro();
    getFollow();
}

function Novo(ajustar) {

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('cadastro').value = Date.GetDate(false);
    Selector.$('cpf').focus();

    Selector.$('botNovo').setAttribute('src', '../imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', '../imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');
}

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('mostrartodos').style.display = 'inline-block';
        Selector.$('lblmostrartodos').style.display = 'inline-block';
        Selector.$('mostrarClientesPremium').style.display = 'inline-block';
        Selector.$('lblMostrarClientesPremium').style.display = 'inline-block';
        Selector.$('mostrarArquitetos').style.display = 'inline-block';
        Selector.$('lblMostrarArquitetos').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    } else {
        Selector.$('divContainer').style.maxWidth = '1060px';
        Selector.$('divCadastro2').setAttribute('style', 'height:530px; padding:0px; width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
        Selector.$('mostrartodos').style.display = 'none';
        Selector.$('lblmostrartodos').style.display = 'none';
        Selector.$('mostrarClientesPremium').style.display = 'none';
        Selector.$('lblMostrarClientesPremium').style.display = 'none';
        Selector.$('mostrarArquitetos').style.display = 'none';
        Selector.$('lblMostrarArquitetos').style.display = 'none';
    }
}

function Cancelar() {

    AjustarDivs();
    Limpar();
    Selector.$('botNovo').setAttribute('src', '../imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
    Selector.$('botSair').setAttribute('src', '../imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
        Cancelar();
    }
}

function PesquisarClientes() {

    gridPesquisa.clearRows();

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    var p = 'action=PesquisarClientes';
    p += '&nome=' + Selector.$('nome2').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Nenhum registro encontrado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var json = JSON.parse(ajax.getResponseText());
    var cor = true;

    for (var i = 0; i < json.length; i++) {

        gridPesquisa.addRow([
            DOM.newText(json[i].nome),
            DOM.newText(json[i].apelido),
            DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO"))
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

function AbrePromptPesquisaUsuarios() {

    if (Selector.$("botNovo").name === 'NovoTrue' || Selector.$("botModi").name === 'ModiTrue') {
        return;
    }

    PromptPesquisaClientes(Selector.$('prompt'));
}

function PromptPesquisaClientes(div) {

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
    botPesquisar.setAttribute('style', '  float:right;');
    botPesquisar.value = 'Pesquisar';
    botPesquisar.setAttribute('onclick', 'PesquisarClientes();');

    div.appendChild(lblnome);
    div.appendChild(DOM.newText(' '));
    div.appendChild(txtnome);
    div.appendChild(DOM.newText(' '));
    //div.appendChild(botCancelar);
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
        DOM.newText('Cliente'),
        DOM.newText('Fantasia'),
        DOM.newText('Ativo')
    ]);
    divopcoes.appendChild(gridPesquisa.table);
    dialogo = new caixaDialogo('prompt', 290, 730, '../padrao/', 111);
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

function getPropostas() {

    var ajax = new Ajax('POST', 'php/clientes.php', true);
    var p = 'action=getPropostas';
    p += '&codigo=' + codigoAtual;
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var cor = true;
        for (var i = 0; i < json.length; i++) {

            var img = DOM.newElement('img');
            img.src = "../imagens/pesquisar.png";
            img.setAttribute('class', 'efeito-opacidade-75-04');
            gridProposta.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].situacao),
                DOM.newText(json[i].evento),
                DOM.newText(json[i].versao),
                DOM.newText(json[i].vendedor),
                DOM.newText(json[i].valor),
                img

            ]);
            gridProposta.setRowData(gridProposta.getRowCount() - 1, json[i].codigo);
            gridProposta.getRow(gridProposta.getRowCount() - 1).setAttribute('onclick', 'window.location="orcamentos.html?codigo=' + json[i].codigo + '"');
            gridProposta.getRow(gridProposta.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 5).setAttribute('style', 'width:140px;  text-align:right; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 6).setAttribute('style', 'width:100px;  text-align:center; ');
            if (cor) {
                cor = false;
                gridProposta.setRowBackgroundColor(gridProposta.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridProposta.setRowBackgroundColor(gridProposta.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function getFollow() {

    gridFollow.clearRows();
    var ajax = new Ajax('POST', 'php/clientes.php', true);
    var p = 'action=getFollow';
    p += '&codigo=' + codigoAtual;
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var cor = true;
        for (var i = 0; i < json.length; i++) {

            var editar = DOM.newElement('img');
            editar.src = "../imagens/modificar.png";
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('style', 'width:15px');
            editar.setAttribute('onclick', 'editarFollow(' + json[i].codigo + ')');
            var excluir = DOM.newElement('img');
            excluir.src = "../imagens/lixo.png";
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('style', 'width:15px');
            excluir.setAttribute('onclick', 'excluirFollow(' + json[i].codigo + ')');
            gridFollow.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].tipo),
                DOM.newText(json[i].obs),
                DOM.newText(json[i].usuario),
                DOM.newText(json[i].retorno),
                editar,
                excluir

            ]);
            gridFollow.setRowData(gridFollow.getRowCount() - 1, json[i].codigo);
            gridFollow.getRow(gridFollow.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 0).setAttribute('style', 'width:110px;text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 1).setAttribute('style', 'width:150px;text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 3).setAttribute('style', 'width:150px;text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 4).setAttribute('style', 'width:150px;text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 5).setAttribute('style', 'width:20px;  text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 6).setAttribute('style', 'width:20px;  text-align:center; ');
            if (cor) {
                cor = false;
                gridFollow.setRowBackgroundColor(gridFollow.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridFollow.setRowBackgroundColor(gridFollow.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function excluirFollow(codigo) {

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este Follow-up?", "SIM", "excluirFollow_Aux(" + codigo + ")", true, "");
    mensagemExcluir.Show();
}

function excluirFollow_Aux(codigo) {

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    ajax.Request('action=ExcluirFollowUP&codigo=' + codigo);
    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    mensagemExcluir.Close();
    getFollow();
}

function editarFollow(codigo) {

    if (codigoAtual <= 0) {
        if (botNovo.name === 'NovoTrue') {
            var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Para adicionar um contato será necessário primeiro gravar o colecionador", "OK", "", false, "");
            mensagem.Show();
        }
        else {
            var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, pesquise um colecionador para lançar um contato", "OK", "", false, "");
            mensagem.Show();
        }
        return;
    }

    var div = Selector.$("prompt");
    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:block');
    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);
    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");
    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");
    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "*";
    lblast2.setAttribute("style", "color:red;");
    var lblast3 = DOM.newElement('label');
    lblast3.innerHTML = "*";
    lblast3.setAttribute("style", "color:red;");
    var lblnome = DOM.newElement('label');
    lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblnome.appendChild(DOM.newText('Tipo'));
    var txttipo = DOM.newElement('select');
    txttipo.setAttribute('id', 'tiposcontatos');
    txttipo.setAttribute('class', 'combo_cinzafoco');
    txttipo.setAttribute('style', 'width:100%; margin-left:5px;');
    getTiposFollow(txttipo);
    var lbltexto = DOM.newElement('label');
    lbltexto.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lbltexto.appendChild(DOM.newText('Obs'));
    var txttexto = DOM.newElement('textarea');
    txttexto.setAttribute('id', 'obsfollow');
    txttexto.setAttribute('class', 'textbox_cinzafoco');
    txttexto.setAttribute('style', 'width:100%; height:200px; margin-left:5px;');
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast2);
    divform.appendChild(DOM.newText(' '));
    divform.appendChild(txttipo);
    divform.appendChild(lbltexto);
    divform.appendChild(lblast3);
    divform.appendChild(txttexto);
    var btGravar = DOM.newElement('submit');
    btGravar.setAttribute('id', 'botEnviar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.value = 'Gravar';
    btGravar.setAttribute('onclick', 'GravarFollow(' + codigo + ');');
    divform.appendChild(DOM.newText(' '));
    divform.innerHTML += "<div style='width:120px; vertical-align:center; display:inline-block'><input id='checkretorno' onclick='mostraRetorno()' type='checkbox'><label class='fonte_Roboto_titulo_normal' for='checkretorno'> Data Retorno</label></div>";
    var txtretorno = DOM.newElement('text');
    txtretorno.setAttribute('id', 'retorno');
    txtretorno.setAttribute('class', 'textbox_cinzafoco');
    txtretorno.setAttribute('style', 'width:110px; vertical-align:center; margin-left:10px;');
    txtretorno.setAttribute('placeholder', 'ex:11/11/2012');
    var txthoraretorno = DOM.newElement('text');
    txthoraretorno.setAttribute('id', 'horaretorno');
    txthoraretorno.setAttribute('class', 'textbox_cinzafoco');
    txthoraretorno.setAttribute('style', 'width:90px; vertical-align:center; margin-left:5px;');
    txthoraretorno.setAttribute('placeholder', 'ex: 08:00');
    var divretorno = DOM.newElement('div', 'divretorno');
    divretorno.setAttribute('style', 'display:inline-block;  vertical-align:middle; width:0px; height:40px; overflow:hidden');
    divform.appendChild(divretorno);
    divretorno.appendChild(txtretorno);
    divretorno.appendChild(txthoraretorno);
    divform.appendChild(btGravar);
    divform.innerHTML += '<br /><br />';
    dialogo = new caixaDialogo('prompt', 410, 550, '../padrao/', 111);
    dialogo.Show();
    Mask.setData(Selector.$('retorno'));
    Mask.setHora(Selector.$('horaretorno'), false);
    if (codigo <= 0) {
        Selector.$('tiposcontatos').focus();
    } else {

        var ajax = new Ajax('POST', 'php/clientes.php', false);
        ajax.Request('action=pesquisarFollow&codigo=' + codigo);
        if (ajax.getResponseText() === '0') {
            Selector.$('tiposcontatos').focus();
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Select.Show(Selector.$('tiposcontatos'), json.tipo);
        Selector.$('obsfollow').value = json.obs;
        if (json.retorno !== '0000-00-00' && json.retorno !== "") {
            Selector.$('checkretorno').checked = true;
            Selector.$('retorno').value = json.retorno;
            Selector.$('horaretorno').value = json.horaretorno;
            mostraRetorno();
        }
    }
}

function mostraRetorno() {

    if (Selector.$('checkretorno').checked) {

        Selector.$('divretorno').style.width = "270px";
    } else {
        Selector.$('divretorno').style.width = "0px";
    }
}

function getTiposFollow(cmb) {

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    ajax.Request('action=getTiposFollow');
    if (ajax.getResponseText() === '0') {
        return;
    }

    Select.AddItem(cmb, "Selecione...", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
}

function GravarFollow(codigo) {

    if (codigoAtual <= 0)
        return;
    if (Selector.$('tiposcontatos').value <= 0) {
        Selector.$('retorno').focus();
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o tipo de contato.", "OK", "", false, "tiposcontatos");
        mensagem.Show();
        return;
    }

    if (Selector.$('obsfollow').value.trim() == "") {
        Selector.$('retorno').focus();
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo de obs.", "OK", "", false, "obsfollow");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    var p = "action=GravarFollow";
    p += "&codigo=" + codigo;
    p += "&cliente=" + codigoAtual;
    p += "&tipo=" + Selector.$('tiposcontatos').value;
    p += "&obs=" + Selector.$('obsfollow').value;
    p += "&checkretorno=" + Selector.$('checkretorno').checked;
    p += "&retorno=" + Selector.$('retorno').value;
    p += "&horaretorno=" + Selector.$('horaretorno').value;
    ajax.Request(p);
    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao gravar o follow-up. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        Selector.$('retorno').style.visibility = "hidden";
        Selector.$('horaretorno').style.visibility = "hidden";
        dialogo.Close();
        getFollow();
    }
}

//ENDEREÇOS
function MostrarEnderecos(array) {

    gridEnderecos.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var editar = DOM.newElement('img');
        editar.setAttribute('src', '../imagens/modificar.png');
        editar.setAttribute('style', 'width:18px; height:18px; cursor:pointer;');
        editar.setAttribute('title', 'Editar Endereço');
        editar.setAttribute('onclick', 'PromptColecionadorEndereco(' + gridEnderecos.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', '../imagens/excluir.png');
        excluir.setAttribute('style', 'width:18px; height:18px; cursor:pointer');
        excluir.setAttribute('title', 'Excluir Endereço');
        excluir.setAttribute('onclick', 'ExcluirEnderecoColecionadorAux(' + gridEnderecos.getRowCount() + ')');

        gridEnderecos.addRow([
            DOM.newText(json[i].tipoEndereco),
            DOM.newText(json[i].cep),
            DOM.newText(json[i].endereco),
            DOM.newText(json[i].numero),
            DOM.newText(json[i].complemento),
            DOM.newText(json[i].bairro),
            DOM.newText(json[i].cidade),
            DOM.newText(json[i].estado),
            editar,
            excluir
        ]);

        gridEnderecos.setRowData(gridEnderecos.getRowCount() - 1, json[i].idClienteEndereco);
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:70px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:50px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; max-width:125px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:50px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:30px;');
        pintaLinhaGrid(gridEnderecos);
    }
}

//ORÇAMENTOS
function MostrarOrcamentos(array) {

    gridProposta.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var ver = DOM.newElement('img');
        ver.setAttribute('src', '../imagens/pesquisar.png');
        ver.setAttribute('style', 'width:18px; height:18px; cursor:pointer;');
        ver.setAttribute('title', 'Ver Orçamento');
        ver.setAttribute('onclick', 'window.location="propostas.html?idOrcamento=' + json[i].idOrcamento + '"');

        var obras = DOM.newElement('span');
        obras.innerHTML = json[i].obras;

        var pagamento = DOM.newElement('span');
        pagamento.innerHTML = 'Em ' + json[i].qtdParcelas + (json[i].qtdParcelas == '1' ? ' parcela' : ' parcelas') + ' de R$ ' + Number.FormatDinheiro(Number.Arredonda(Number.parseFloat(json[i].valorTotal) / json[i].qtdParcelas, 2)) + ' - ' + json[i].formaPagamento;

        gridProposta.addRow([
            DOM.newText(json[i].numeroOrcamento),
            DOM.newText(json[i].loja),
            DOM.newText(json[i].dataOrcamento),
            obras,
            DOM.newText(json[i].valorTotal),
            pagamento,
            DOM.newText(json[i].vendedor),
            DOM.newText(json[i].status),
            ver,
        ]);

        gridProposta.setRowData(gridProposta.getRowCount() - 1, json[i].idOrcamento);
        gridProposta.getCell(gridProposta.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 4).setAttribute('style', 'text-align:right;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
        gridProposta.getCell(gridProposta.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px;');
        pintaLinhaGrid(gridProposta);
    }
}

//VENDAS
function MostrarVendas(array) {

    gridVendas.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var ver = DOM.newElement('img');
        ver.setAttribute('src', '../imagens/pesquisar.png');
        ver.setAttribute('style', 'width:18px; height:18px; cursor:pointer;');
        ver.setAttribute('title', 'Ver Pedido');
        ver.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].idVenda + '"');

        var obras = DOM.newElement('span');
        obras.innerHTML = json[i].obras;

        var pagamento = DOM.newElement('span');
        pagamento.innerHTML = 'Em ' + json[i].qtdParcelas + (json[i].qtdParcelas == '1' ? ' parcela' : ' parcelas') + ' de R$ ' + Number.FormatDinheiro(Number.Arredonda(Number.parseFloat(json[i].valorTotal) / json[i].qtdParcelas, 2)) + ' - ' + json[i].formaPagamento;

        gridVendas.addRow([
            DOM.newText(json[i].numeroVenda),
            DOM.newText(json[i].loja),
            DOM.newText(json[i].dataVenda),
            obras,
            DOM.newText(json[i].valorTotal),
            pagamento,
            DOM.newText(json[i].vendedor),
            DOM.newText(json[i].status),
            ver,
        ]);

        gridVendas.setRowData(gridVendas.getRowCount() - 1, json[i].idVenda);
        gridVendas.getCell(gridVendas.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 4).setAttribute('style', 'text-align:right;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
        gridVendas.getCell(gridVendas.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px;');
        pintaLinhaGrid(gridVendas);
    }
}

//FINANCEIRO
function MostrarFinanceiro() {

    gridFinanceiro.clearRows();

    var ajax = new Ajax('POST', 'php/clientes.php', true);
    var p = 'action=MostrarFinanceiro';
    p+= '&idCliente=' + codigoAtual;
    p+= '&situacaoFinanceiro=' + (Selector.$('pagos').checked ? '1' : (Selector.$('emAberto').checked ? '2' : '3'));

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        if(ajax.getResponseText() == '0'){
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            var ver = DOM.newElement('img');
            ver.setAttribute('src', '../imagens/pesquisar.png');
            ver.setAttribute('style', 'width:18px; height:18px; cursor:pointer;');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].idVenda + '"');

            gridFinanceiro.addRow([
                DOM.newText(json[i].numeroVenda),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].parcela),
                DOM.newText(json[i].dataVencimento),
                DOM.newText(json[i].valor),
                DOM.newText(json[i].status),
                ver,
            ]);

            gridFinanceiro.setRowData(gridFinanceiro.getRowCount() - 1, json[i].idVenda);
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 4).setAttribute('style', 'text-align:right;width:100px; ');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            gridFinanceiro.getCell(gridFinanceiro.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px;');
            pintaLinhaGrid(gridFinanceiro);
        }
    }

    ajax.Request(p);
}

//ESTILOS
function MostrarEstilos(array) {
    gridEstilos.clearRows();
    if (array == '0')
        return;
    var cor = false;
    var json = JSON.parse(array);
    for (var i = 0; i < json.length; i++) {

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', '../imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirEstilo(' + gridEstilos.getRowCount() + ')');
        gridEstilos.addRow([
            DOM.newText(json[i].estilo),
            excluir,
            DOM.newText(json[i].idEstilo)
        ]);
        gridEstilos.setRowData(gridEstilos.getRowCount() - 1, json[i].idClienteEstilo);
        gridEstilos.getCell(gridEstilos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
        gridEstilos.getCell(gridEstilos.getRowCount() - 1, 1).setAttribute('style', 'width:18px; text-align:center;');
        if (cor) {
            cor = false;
            gridEstilos.setRowBackgroundColor(gridEstilos.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridEstilos.setRowBackgroundColor(gridEstilos.getRowCount() - 1, "#FFF");
        }

        gridEstilos.hiddenCol(2);
    }
}

function AdicionarEstilo() {
    var cmb = Selector.$('estilos');
    if (cmb.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um estilo", "OK", "", false, "estilos");
        mensagem.Show();
        return;
    }

    for (var i = 0; i <= gridEstilos.getRowCount() - 1; i++) {
        if (cmb.value == gridEstilos.getCellText(i, 2)) {
            var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Este estilo já está cadastrado.", "OK", "", false, "estilos");
            mensagem.Show();
            return;
        }
    }

    var excluir = DOM.newElement('img');
    excluir.src = "../imagens/lixo.png";
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('style', 'width:15px');
    excluir.setAttribute('onclick', 'ExcluirEstilo(' + gridEstilos.getRowCount() + ')');
    gridEstilos.addRow([
        DOM.newText(Select.GetText(cmb)),
        excluir,
        DOM.newText(cmb.value)
    ]);
    gridEstilos.getCell(gridEstilos.getRowCount() - 1, 1).setAttribute('style', 'width:20px; text-align:center');
    gridEstilos.hiddenCol(2);
    var cor = false;
    for (var i = 0; i <= gridEstilos.getRowCount() - 1; i++) {
        if (cor) {
            cor = false;
            gridEstilos.setRowBackgroundColor(gridEstilos.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridEstilos.setRowBackgroundColor(gridEstilos.getRowCount() - 1, "#FFF");
        }
    }

    cmb.selectedIndex = 0;
}

function ExcluirEstilo(linha) {
    if (botNovo.name !== 'NovoTrue' && botModi.name !== 'ModiTrue')
        return;
    if (linha >= 0) {
        if (!confirm('Deseja excluir o estilo?'))
            return;
        if (gridEstilos.getRowCount() === 1)
            gridEstilos.clearRows();
        else {
            gridEstilos.deleteRow(linha);
            //REFATORA AS LINHAS
            var cor = false;
            for (var i = 0; i <= gridEstilos.getRowCount() - 1; i++) {
                gridEstilos.getCellObject(i, 1).setAttribute('onclick', 'ExcluirEstilo(' + i + ');');
                if (cor) {
                    cor = false;
                    gridEstilos.setRowBackgroundColor(i, "#F5F5F5");
                } else {
                    cor = true;
                    gridEstilos.setRowBackgroundColor(i, "#FFF");
                }
            }
        }
    }
}
//FIM ESTILOS

function PromptEnderecos(idCliente){

    if (!isElement('div', 'divPromptEnderecos')) {
        var div = DOM.newElement('div', 'divPromptEnderecos');
        document.body.appendChild(div);
    }

    var divPromptEnderecos = Selector.$('divPromptEnderecos');
    divPromptEnderecos.innerHTML = '';

    gridVerEnderecos = new Table('gridVerEnderecos');
    gridVerEnderecos.table.setAttribute('class', 'tabela_cinza_foco');
    gridVerEnderecos.table.setAttribute('cellpadding', '3');
    gridVerEnderecos.table.setAttribute('cellspacing', '0');

    gridVerEnderecos.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('CEP'),
        DOM.newText('Endereço'),
        DOM.newText('N°'),
        DOM.newText('Complemento'),
        DOM.newText('Bairro'),
        DOM.newText('Cidade'),
        DOM.newText('Estado')
    ]);

    divPromptEnderecos.appendChild(gridVerEnderecos.table);

    dialogoEnderecos = new caixaDialogo('divPromptEnderecos', 300, 900, '../padrao/', 130);
    dialogoEnderecos.Show();

    var ajax = new Ajax('POST', 'php/clientes.php', false);
    var p = 'action=getEnderecos';
    p+= '&idCliente=' + idCliente;
    ajax.Request(p);

    if(ajax.getResponseText() == '0'){
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    for (var i = 0; i < json.length; i++) {

        gridVerEnderecos.addRow([
            DOM.newText(json[i].tipoEndereco),
            DOM.newText(json[i].cep),
            DOM.newText(json[i].endereco),
            DOM.newText(json[i].numero),
            DOM.newText(json[i].complemento),
            DOM.newText(json[i].bairro),
            DOM.newText(json[i].cidade),
            DOM.newText(json[i].estado)
        ]);

        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:70px;');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:50px;');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; max-width:125px;');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridVerEnderecos.getCell(gridVerEnderecos.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:50px;');
        pintaLinhaGrid(gridVerEnderecos);
    }
}

function arquiteto_click(){
    if(Selector.$('arquiteto').checked){ 
        Selector.$('arquitetoComissao').disabled=false;
        Selector.$('arquitetoComissao').focus();
    } 
    else{
        Selector.$('arquitetoComissao').disabled='disabled';
    }
}