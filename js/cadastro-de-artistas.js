/* global gridArtistas, Selector, DOM, Window */

checkSessao();
CheckPermissao(1, false, '', true);

var codigoAtual = 0;
var codigoObra = 0;
var codigoConsignacao = 0;
var arrayEstilos = new Array();
var arrayTamanhos = new Array();
var arrayAlturas = new Array();
var arrayLarguras = new Array();
var arrayTiragens = new Array();
var arrayTipoPagamento = new Array();

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Artistas</div>";

    Selector.$('divContainer').style.maxWidth = '100%';
    Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
    Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
    Selector.$('busca').style.display = 'inline-block';
    Selector.$('statusBusca').style.display = 'inline-block';
    Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    carregarmenu();
        
    getDadosUsuario();

    Mask.setCPF(Selector.$('cpf'));
    Mask.setCEP(Selector.$("cep"));
    Mask.setMoeda(Selector.$('comissao'));
    SelecionaAbas(0);
    
    getDiasRepasse(Selector.$('diaRepasse'));
    
    getEstilos(Selector.$('estilos'), "Selecione um estilo", true);

    var divEstilos = Selector.$('divEstilos');

    gridEstilos = new Table('gridEstilos');
    gridEstilos.table.setAttribute('class', 'tabela_cinza_foco');
    gridEstilos.table.setAttribute('cellpadding', '2');
    gridEstilos.table.setAttribute('cellspacing', '0');

    gridEstilos.addHeader([
        DOM.newText('Estilo'),
        DOM.newText('')
    ]);

    divEstilos.appendChild(gridEstilos.table);

    var divObras = Selector.$('divObras');

    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');
    gridObras.table.setAttribute('cellpadding', '3');
    gridObras.table.setAttribute('cellspacing', '0');

    gridObras.addHeader([
        DOM.newText('Imagem'),
        DOM.newText('Nome'),
        DOM.newText('Estilo'),
        DOM.newText('Descrição'),
        DOM.newText('Cadastro'),
        DOM.newText('Qtd. Vendida'),
        DOM.newText('Ativo'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    divObras.appendChild(gridObras.table);

    var divConsignacoes = Selector.$('divConsignacoes');

    gridConsignacoes = new Table('gridObras');
    gridConsignacoes.table.setAttribute('class', 'tabela_cinza_foco');
    gridConsignacoes.table.setAttribute('cellpadding', '3');
    gridConsignacoes.table.setAttribute('cellspacing', '0');

    gridConsignacoes.addHeader([
        DOM.newText('Imagem'),
        DOM.newText('Nome'),
        DOM.newText('Estilo'),
        DOM.newText('Descrição'),
        DOM.newText('Tamanho'),
        DOM.newText('Valor Consig.'),
        DOM.newText('Valor Venda'),
        DOM.newText('Qtde.'),
        DOM.newText('Qtde. Vendida'),
        DOM.newText('Ativo'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    divConsignacoes.appendChild(gridConsignacoes.table);

    var divPagamentos = Selector.$('divPagamentos');

    gridPagamentos = new Table('gridPagamentos');
    gridPagamentos.table.setAttribute('class', 'tabela_cinza_foco');
    gridPagamentos.table.setAttribute('cellpadding', '3');
    gridPagamentos.table.setAttribute('cellspacing', '0');

    gridPagamentos.addHeader([
        DOM.newText('Descrição'),
        DOM.newText('Total'),
        DOM.newText('Comissão'),
        DOM.newText('Qtde. Parcelas'),
        DOM.newText('Valor Total Pago'),
        DOM.newText('Valor à Pagar'),
        DOM.newText('Ver')
    ]);

    divPagamentos.appendChild(gridPagamentos.table);

    if (Window.getParameter('return') !== null && Window.getParameter('return') !== '0') {

        SelecionaAbas(3);
        Mostra(Window.getParameter('idArtista'));
    }

    CompleteTipoPagamento();

    $('#tipoPagamento').autocomplete({
        source: function (request, response) {
            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
            response($.grep(arrayTipoPagamento, function (item) {
                return matcher.test(item);
            }));
        }
    });

    var tdv = Selector.$('tabeladevendas');

    gridVendas = new Table('gridVendas');
    gridVendas.table.setAttribute('class', 'tabela_cinza_foco');
    gridVendas.table.setAttribute('cellpadding', '3');
    gridVendas.table.setAttribute('cellspacing', '0');

    gridVendas.addHeader([
        DOM.newText('Data'),
        DOM.newText('Pedido'),
        DOM.newText('Cliente'),
        DOM.newText('OP'),
        DOM.newText('Nº Série'),
        DOM.newText('Tiragem'),
        DOM.newText('Valor'),
        DOM.newText('Cond. Pagamento'),
        DOM.newText('Ver')
    ]);

    tdv.appendChild(gridVendas.table);

    gridArtistas = new Table('gridArtistas');
    gridArtistas.table.setAttribute('cellpadding', '4');
    gridArtistas.table.setAttribute('cellspacing', '0');
    gridArtistas.table.setAttribute('class', 'tabela_cinza_foco');

    gridArtistas.addHeader([
        DOM.newText('Cód.'),
        DOM.newText('Artista'),
        DOM.newText('Nacionalidade'),
        DOM.newText('Contatos'),
        DOM.newText('Pagamento'),
        DOM.newText('Dia Repasse'),
        DOM.newText('Comissão'),
        DOM.newText('N° Obras'),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridArtistas.table);
    Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    Limpar();
      
    ListaDeArtistas();
    
};

window.onresize = function () {

    if (Selector.$('divRel').clientHeight > 0) {

        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
};

function Novo(ajustar) {

    if(!CheckPermissao(2, true, 'Você não possui permissão para cadastrar um novo artista', false)){
        return;
    }

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('botNovo').setAttribute('src', 'imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', 'imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
        Cancelar();
    }
}

function Cancelar() {

    AjustarDivs();
    ListaDeArtistas();
    Limpar();
    Selector.$('botNovo').setAttribute('src', 'imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
    Selector.$('botSair').setAttribute('src', 'imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');
}

function ListaDeArtistas() {

    gridArtistas.clearRows();

    var inativos = Selector.$('inativos').checked ? "0" : "1";
    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=ListaDeArtistas';
    p += '&ativo=' + inativos;
    p += '&busca=' + Selector.$('busca').value.trim();

    ajax.Request(p);
    
    var json = JSON.parse(ajax.getResponseText() );

    for (var i = 0; i < json.length; i++) {
        var editar = DOM.newElement('img');
        editar.src = "imagens/pesquisar.png";
        editar.setAttribute('onclick', 'Mostra(' + json[i].idArtista + ')');
        editar.setAttribute('style', 'cursor:pointer;');

        gridArtistas.addRow([
            DOM.newText(json[i].cod),
            DOM.newText(json[i].artista),
            DOM.newText(json[i].nacionalidade),
            DOM.newText(json[i].contatos),
            DOM.newText(json[i].pagamento),
            DOM.newText(json[i].diaRepasse),
            DOM.newText(json[i].comissao),
            DOM.newText(json[i].numObras),
            editar
        ]);

        gridArtistas.getCell(i, 0).setAttribute('style', 'text-align:center;');
        gridArtistas.getCell(i, 1).setAttribute('style', 'text-align:left;');
        gridArtistas.getCell(i, 2).setAttribute('style', 'text-align:left;');
        gridArtistas.getCell(i, 3).setAttribute('style', 'text-align:left;');
        gridArtistas.getCell(i, 4).setAttribute('style', 'text-align:left;');
        gridArtistas.getCell(i, 5).setAttribute('style', 'text-align:center;');
        gridArtistas.getCell(i, 6).setAttribute('style', 'text-align:right;');
        gridArtistas.getCell(i, 7).setAttribute('style', 'text-align:center;');
        gridArtistas.getCell(i, 8).setAttribute('style', 'text-align:center;');
    }

    pintaLinhaGrid(gridArtistas);
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 4; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid; border-color:#D7D7D7; overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; background:#FFF; min-height:500px;  height:auto; border-top:1px solid; border-color:#D7D7D7; overflow:hidden');
}

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    } else {
        Selector.$('divContainer').style.maxWidth = '1060px';
        Selector.$('divCadastro2').setAttribute('style', 'height:auto;  width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
    }
}

function Desabilita(Valor) {

    Selector.$('ativo').disabled = Valor;
    Selector.$('nome').disabled = Valor;
    Selector.$('masculino').disabled = Valor;
    Selector.$('feminino').disabled = Valor;
    Selector.$('cep').disabled = Valor;
    Selector.$('endereco').disabled = Valor;
    Selector.$('numero').disabled = Valor;
    Selector.$('complemento').disabled = Valor;
    Selector.$('bairro').disabled = Valor;
    Selector.$('cidade').disabled = Valor;
    Selector.$('estado').disabled = Valor;
    Selector.$('nacionalidade').disabled = Valor;
    Selector.$('telefone').disabled = Valor;
    Selector.$('celular').disabled = Valor;
    Selector.$('email').disabled = Valor;
    Selector.$('tipoPagamento').disabled = Valor;
    Selector.$('dadosPagamento').disabled = Valor;
    Selector.$('diaRepasse').disabled = Valor;
    Selector.$('comissao').disabled = Valor;
    Selector.$('estilos').disabled = Valor;
    Selector.$('verHistorico').disabled = !Valor;

    AjustaImagensEdicao(Selector.$('botNovo'), Selector.$('botModi'), Selector.$('botSair'), Selector.$('botDel'), Selector.$('lupinha'));
}

function AjustaImagensEdicao(BotNovo, BotModi, BotSair, BotAux1, BotAux2) {

    if (BotNovo.name == 'NovoTrue') {
        BotNovo.src = 'imagens/validar.png';
        BotNovo.title = 'Salvar';
        BotModi.src = 'imagens/cadastro.png';
        BotSair.src = 'imagens/cancelar.png';
        BotSair.title = 'Cancelar';
        BotModi.style.visibility = 'hidden';
        BotAux1.style.visibility = 'hidden';
        BotAux2.style.visibility = 'hidden';
    }
    else if (BotModi.name == 'ModiTrue') {
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

function Limpar() {

    codigoAtual = 0;
    Selector.$('ativo').checked = false;
    Selector.$('masculino').checked = true;
    Selector.$('feminino').checked = false;
    Selector.$('nome').value = "";
    Selector.$('cpf').value = "";
    Selector.$('cep').name = "";
    Selector.$('cep').value = "";
    Selector.$('endereco').value = "";
    Selector.$('numero').value = "";
    Selector.$('complemento').value = "";
    Selector.$('bairro').value = "";
    Selector.$('cidade').value = "";
    Selector.$('estado').value = "";
    Selector.$('nacionalidade').value = "";
    Selector.$('telefone').value = "";
    Selector.$('celular').value = "";
    Selector.$('email').value = "";
    Selector.$('tipoPagamento').value = "";
    Selector.$('dadosPagamento').value = "";
    Selector.$('diaRepasse').selectedIndex = 0;
    Selector.$('comissao').value = "";
    Selector.$('sobre').value = "";
    Selector.$('obs').value = "";
    Selector.$('busca').value = "";
    Selector.$('ultimaAtualizacaopor').innerHTML = "";
    gridEstilos.clearRows();
    gridObras.clearRows();
    gridConsignacoes.clearRows();
}

function VerificaCampos() {

    if (Selector.$('nome').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o nome do artista", "OK", "", false, "nome");
        mensagem.Show();
        return false;
    }

    if (Selector.$('nacionalidade').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a nacionalidade.", "OK", "", false, "nacionalidade");
        mensagem.Show();
        return false;
    }
    if (Selector.$('email').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe um e-mail.", "OK", "", false, "email");
        mensagem.Show();
        return false;
    }
    if (Selector.$('tipoPagamento').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o tipo de pagamento.", "OK", "", false, "tipoPagamento");
        mensagem.Show();
        return false;
    }
    if (Selector.$('dadosPagamento').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe os dados do pagamento.", "OK", "", false, "dadosPagamento");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar() {

    if(!CheckPermissao(2, true, 'Você não possui permissão para cadastrar um novo artista', false)){
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;

    if (Selector.$('ativo').checked == true) {
        p += '&ativo=1';
    } else {
        p += '&ativo=0';
    }

    if (Selector.$('masculino').checked == true) {
        p += '&sexo=M';
    } else {
        p += '&sexo=F';
    }

    p += '&nome=' + Selector.$('nome').value;
    p += '&cpf=' + Selector.$('cpf').value;
    p += '&cep=' + Selector.$('cep').value;
    p += '&endereco=' + Selector.$('endereco').value;
    p += '&numero=' + Selector.$('numero').value;
    p += '&complemento=' + Selector.$('complemento').value;
    p += '&bairro=' + Selector.$('bairro').value;
    p += '&cidade=' + Selector.$('cidade').value;
    p += '&estado=' + Selector.$('estado').value;
    p += '&nacionalidade=' + Selector.$('nacionalidade').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&celular=' + Selector.$('celular').value;
    p += '&email=' + Selector.$('email').value;
    p += '&tipoPagamento=' + Selector.$('tipoPagamento').value;
    p += '&dadosPagamento=' + Selector.$('dadosPagamento').value;
    //p += '&contaCorrente=' + Selector.$('contaCorrente').value;
    p += '&diaRepasse=' + Selector.$('diaRepasse').value;
    p += '&comissao=' + Selector.$('comissao').value;
    p += '&sobre=' + Selector.$('sobre').value;
    p += '&obs=' + Selector.$('obs').value;

    for (var i = 0; i < gridEstilos.getRowCount(); i++) {

        if (gridEstilos.getCellObject(i, 0).id !== 0) {
            arrayEstilos.push(gridEstilos.getCellObject(i, 0).id);
        }
    }

    p += '&estilos=' + arrayEstilos;
    
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt2", 120, 500, 150, "1", "Erro", "Erro ao gravar o artista. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return false;
    } else {
        arrayEstilos.length = 0;
        codigoAtual = ajax.getResponseText();
        Selector.$('estilos').selectedIndex = 0;
        Novo(true);
        ListaDeArtistas();

        Selector.$('botNovo').setAttribute('src', 'imagens/novo.png');
        Selector.$('botNovo').setAttribute('title', 'Novo');
        Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
        Selector.$('botSair').setAttribute('src', 'imagens/sair3.png');
        Selector.$('botSair').setAttribute('title', 'Sair');
        return true;
    }
}

function Mostra(Codigo) {
    
     if(!CheckPermissao(161, true, 'Você não possui permissão para Visualizar detalhes sobre o  artista', false)){
        return;
    }
    

    Novo(true);
    Limpar();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Registro não localizado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    codigoAtual = json.codigo;
    Selector.$('ativo').checked = (json.ativo == '1' ? true : false);

    if (json.sexo == 'M') {
        Selector.$('masculino').checked = true;
    } else {
        Selector.$('feminino').checked = true;
    }

    Selector.$('nome').value = json.artista;
    Selector.$('cpf').value = json.cpf;
    Selector.$('cep').value = json.cep;
    Selector.$('endereco').value = json.endereco;
    Selector.$('numero').value = json.numero;
    Selector.$('complemento').value = json.complemento;
    Selector.$('bairro').value = json.bairro;
    Selector.$('cidade').value = json.cidade;
    Selector.$('estado').value = json.estado;
    Selector.$('nacionalidade').value = json.nacionalidade;
    Selector.$('telefone').value = json.telefone;
    Selector.$('celular').value = json.celular;
    Selector.$('email').value = json.email;
    Selector.$('tipoPagamento').value = json.tipoPagamento;
    Selector.$('dadosPagamento').value = json.dadosPagamento;
    Selector.$('diaRepasse').value = json.diaRepasse;
    Selector.$('comissao').value = json.comissao;
    Selector.$('sobre').value = json.sobre;
    Selector.$('obs').value = json.obs;
    Selector.$('ultimaAtualizacaopor').innerHTML = json.usuario;

    MostrarEstilosArtista(Codigo);
    MostrarObrasArtista(Codigo);
    MostrarConsignacoesArtista(Codigo);
    TabelaDeVendas(Codigo);
    Selector.$('emAberto').checked = true;
    MostrarPagamentosArtista(Codigo, 2);

    if(!CheckPermissao(6, false, '', false)){
        Selector.$('aba3').style.display = 'none';
        Selector.$('div3').style.display = 'none';
    }

    if(!CheckPermissao(7, false, '', false)){
        Selector.$('aba4').style.display = 'none';
        Selector.$('div4').style.display = 'none';
    }

    if(!CheckPermissao(51, false, '', false)){
        gridConsignacoes.hiddenCol(5);
        gridConsignacoes.hiddenCol(6);
        gridVendas.hiddenCol(6);
        gridVendas.hiddenCol(7);
        gridPagamentos.hiddenCol(1);
        gridPagamentos.hiddenCol(4);
        gridPagamentos.hiddenCol(5);
    }
}

function PesquisarArtistas() {

    gridPesquisa.clearRows();

    var sexo = '';

    if (Selector.$('masc').checked)
        sexo = 'M';

    if (Selector.$('fem').checked)
        sexo = 'F';

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=PesquisarArtistas';
    p += '&nome=' + Selector.$('nome2').value;
    p += '&sexo=' + sexo;
    p += '&endereco=' + Selector.$('endereco2').value;
    p += '&contato=' + Selector.$('telefone2').value;
    p += '&email=' + Selector.$('email2').value;
    p += '&estilo=' + Selector.$('estilos2').value;
      
    ajax.Request(p);


    
    if (ajax.getResponseText() == '') {
        var mensagem = new DialogoMensagens("prompt2", 120, 350, 150, "2", "Atenção!", "Nenhum registro encontrado!", "OK", "", false, "");
        mensagem.Show();
        return;
    }
        
    var json = JSON.parse(ajax.getResponseText() );
    var cor = true;
    for (var i = 0; i < json.length; i++) {

        gridPesquisa.addRow([
            DOM.newText(json[i].artista),
            DOM.newText(json[i].email),
            DOM.newText((json[i].ativo == '1' ? "SIM" : "NÃO"))
        ]);

        gridPesquisa.setRowData(gridPesquisa.getRowCount() - 1, json[i].codigo);
        gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('onclick', 'MostraResultadoPesquisa(' + json[i].codigo + ');');
        gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
        gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:50px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));

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
        //Mostra(Selector.$('codigo').value);
    }
}

function AbrePromptPesquisaArtistas() {

    if (Selector.$("botNovo").name == 'NovoTrue' || Selector.$("botModi").name == 'ModiTrue') {
        return;
    }

    PromptPesquisaArtistas(Selector.$('prompt'));
}

function PromptPesquisaArtistas(div) {

    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:inline-block');

    var lblnome = DOM.newElement('label');
    lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblnome.appendChild(DOM.newText('Nome'));

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome2');
    txtnome.setAttribute('class', 'textbox_cinzafoco');
    txtnome.setAttribute('style', 'width:350px; margin-left:35px; margin-right:25px;');
    txtnome.setAttribute('onkeydown', 'pesquisa_KeyDown();');

    var lblsexo = DOM.newElement('label');
    lblsexo.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblsexo.appendChild(DOM.newText('Sexo'));

    var boxmasc = DOM.newElement('checkbox');
    boxmasc.setAttribute('name', 'sexo');
    boxmasc.setAttribute('id', 'masc');
    boxmasc.setAttribute('style', 'margin-left:5px;');
    boxmasc.setAttribute('onclick', 'CheckSexo("M")');

    var lblmasc = DOM.newElement('label');
    lblmasc.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblmasc.setAttribute('for', 'masc');
    lblmasc.appendChild(DOM.newText('M'));

    var boxfem = DOM.newElement('checkbox');
    boxfem.setAttribute('name', 'sexo');
    boxfem.setAttribute('id', 'fem');
    boxfem.setAttribute('onclick', 'CheckSexo("F")');

    var lblfem = DOM.newElement('label');
    lblfem.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblfem.setAttribute('for', 'fem');
    lblfem.appendChild(DOM.newText('F'));

    var lblenderco = DOM.newElement('label');
    lblenderco.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblenderco.appendChild(DOM.newText('Endereço'));

    var txtenderco = DOM.newElement('text');
    txtenderco.setAttribute('id', 'endereco2');
    txtenderco.setAttribute('class', 'textbox_cinzafoco');
    txtenderco.setAttribute('placeholder', 'Endereço, número, complemento, bairro, cidade ou estado.');
    txtenderco.setAttribute('style', 'width:350px; margin-left:15px; margin-right:25px;');
    txtenderco.setAttribute('onkeydown', 'pesquisa_KeyDown();');

    var lbltelefone = DOM.newElement('label');
    lbltelefone.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lbltelefone.appendChild(DOM.newText('Contato'));

    var txttelefone = DOM.newElement('text');
    txttelefone.setAttribute('id', 'telefone2');
    txttelefone.setAttribute('class', 'textbox_cinzafoco');
    txttelefone.setAttribute('placeholder', 'Tel. | Cel.');
    txttelefone.setAttribute('style', 'width:120px; margin-left:5px;');
    txttelefone.setAttribute('onkeydown', 'pesquisa_KeyDown();');

    var lblemail = DOM.newElement('label');
    lblemail.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblemail.appendChild(DOM.newText('Email'));

    var txtemail = DOM.newElement('text');
    txtemail.setAttribute('id', 'email2');
    txtemail.setAttribute('class', 'textbox_cinzafoco');
    txtemail.setAttribute('placeholder', 'exemplo@email.com');
    txtemail.setAttribute('style', 'width:350px; margin-left:38px;');
    txtemail.setAttribute('onkeydown', 'pesquisa_KeyDown();');

    var lblestilo = DOM.newElement('label');
    lblestilo.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblestilo.appendChild(DOM.newText('Estilo'));

    var cmbestilo = DOM.newElement('select');
    cmbestilo.setAttribute('id', 'estilos2');
    cmbestilo.setAttribute('class', 'combo_cinzafoco');
    cmbestilo.setAttribute('style', 'width:200px; margin-left:37px;');

    var botPesquisar = DOM.newElement('submit');
    botPesquisar.setAttribute('id', 'botEnviar');
    botPesquisar.setAttribute('class', 'botaosimplesfoco');
    botPesquisar.setAttribute('style', 'float:right;');
    botPesquisar.value = 'Pesquisar';
    botPesquisar.setAttribute('onclick', 'PesquisarArtistas();');

    var botCancelar = DOM.newElement('submit');
    botCancelar.setAttribute('id', 'botCancelar');
    botCancelar.setAttribute('class', 'botaosimplesfoco');
    botCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    botCancelar.value = 'Cancelar';
    botCancelar.setAttribute('onclick', 'dialogo.Close();');

    div.appendChild(lblnome);
    div.appendChild(DOM.newText(' '));
    div.appendChild(txtnome);

    div.appendChild(lblsexo);
    div.appendChild(boxmasc);
    div.appendChild(lblmasc);
    div.appendChild(boxfem);
    div.appendChild(lblfem);

    div.innerHTML += '<br /><br />';
    div.appendChild(lblenderco);
    div.appendChild(txtenderco);

    div.appendChild(lbltelefone);
    div.appendChild(txttelefone);
    div.innerHTML += '<br /><br />';

    div.appendChild(lblemail);
    div.appendChild(txtemail);
    div.innerHTML += '<br /><br />';

    div.appendChild(lblestilo);
    div.appendChild(cmbestilo);

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
        DOM.newText('E-mail'),
        DOM.newText('Ativo')
    ]);

    divopcoes.appendChild(gridPesquisa.table);

    dialogo = new caixaDialogo('prompt', 400, 730, 'padrao/', 111);
    dialogo.Show();

    Mask.setCelular(Selector.$('telefone2'));

    getEstilos(Selector.$('estilos2'), "Selecione um estilo", true);
    Selector.$('nome2').focus();
}

function CheckSexo(genero) {

    if (genero == 'M')
        Selector.$('fem').checked = false;

    if (genero == 'F')
        Selector.$('masc').checked = false;
}

function pesquisa_KeyDown(ev) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode == 13) {
        PesquisarArtistas();
    }
}

function PromptHistoricoComissoes( idArtista ) {

    if (idArtista <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, selecione um artista para ver o histórico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'PromptHistoricoComissoes')) {
        var PromptHistoricoComissoes = DOM.newElement('div', 'PromptHistoricoComissoes');
        document.body.appendChild(PromptHistoricoComissoes);
    }

    var PromptHistoricoComissoes = Selector.$('PromptHistoricoComissoes');
    PromptHistoricoComissoes.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptHistoricoComissoes.appendChild(divform);

    var lblHistorico = DOM.newElement('label');
    lblHistorico.innerHTML = "<center>Histórico de Comissões</center>";

    var divGridHistorico = DOM.newElement('div', 'divGridHistorico');
    divGridHistorico.setAttribute('style', 'height:510px; overflow:auto;');

    divform.appendChild(lblHistorico);
    divform.innerHTML += "<br>";
    divform.appendChild(divGridHistorico);

    gridHistorico = new Table('gridHistorico');
    gridHistorico.table.setAttribute('cellpadding', '5');
    gridHistorico.table.setAttribute('cellspacing', '0');
    gridHistorico.table.setAttribute('class', 'tabela_cinza_foco');
    gridHistorico.table.setAttribute('style', 'margin-top:5px;');

    gridHistorico.addHeader([
        DOM.newText('Data'),
        DOM.newText('Comissão'),
        DOM.newText('Usuário')
    ]);

    dialogoHistoricoComissoes = new caixaDialogo('PromptHistoricoComissoes', 530, 500, 'padrao/', 131);
    dialogoHistoricoComissoes.Show();

    Selector.$('divGridHistorico').appendChild(gridHistorico.table);

    gridHistorico.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=getHistoricoComissoes';
    p += '&idArtista=' + idArtista;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var cor = false;

        for (var i = 0; i < json.length; i++) {

            gridHistorico.addRow([
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].percentual),
                DOM.newText(json[i].funcionario)
            ]);

            gridHistorico.setRowData(gridHistorico.getRowCount() - 1, json[i].idArtistaComissao);
            gridHistorico.getCell(gridHistorico.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
            gridHistorico.getCell(gridHistorico.getRowCount() - 1, 1).setAttribute('style', 'text-align:right; width:100px;');
            gridHistorico.getCell(gridHistorico.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');

            if (cor) {
                cor = false;
                gridHistorico.setRowBackgroundColor(gridHistorico.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridHistorico.setRowBackgroundColor(gridHistorico.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function AdicionarEstilo() {

    if (Selector.$('estilos').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Por favor, selecione um estilo.", "OK", "", false, "estilos");
        mensagem.Show();
        return;
    }

    for (var i = 0; i < gridEstilos.getRowCount(); i++) {
        if (gridEstilos.getCellObject(i, 0).innerHTML == Select.GetText(Selector.$('estilos'))) {
            var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Este estilo já foi adicionado.", "OK", "", false, "estilos");
            mensagem.Show();
            return;
        }
    }

    var estilo = DOM.newElement('label', Selector.$('estilos').value);
    estilo.innerHTML = Select.GetText(Selector.$('estilos'));

    var excluir = DOM.newElement('img', 'excluirEstilo');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir estilo');
    excluir.setAttribute('style', 'cursor:pointer; width:15px');
    excluir.setAttribute('onclick', 'Excluir(0, ' + gridEstilos.getRowCount() + ');');

    gridEstilos.addRow([
        estilo,
        excluir
    ]);

    gridEstilos.getCell(gridEstilos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
    gridEstilos.getCell(gridEstilos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:50px;');
}

function MostrarEstilosArtista(idArtista) {

    gridEstilos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=MostrarEstilosArtista';
    p += '&idArtista=' + idArtista;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        var estilo = DOM.newElement('label', 0);
        estilo.innerHTML = json[i].estilo;

        var excluir = DOM.newElement('img', 'excluirEstilo');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir estilo');
        excluir.setAttribute('style', 'cursor:pointer; width:15px');
        excluir.setAttribute('onclick', 'Excluir(' + json[i].idArtistaEstilo + ', ' + gridEstilos.getRowCount() + ');');

        gridEstilos.addRow([
            estilo,
            excluir
        ]);

        gridEstilos.setRowData(i, json[i].idArtistaEstilo);
        gridEstilos.getCell(gridEstilos.getRowCount() - 1, 1).setAttribute('style', 'width:50px; text-align:center');

        if (cor) {
            cor = false;
            gridEstilos.setRowBackgroundColor(gridEstilos.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridEstilos.setRowBackgroundColor(gridEstilos.getRowCount() - 1, "#FFF");
        }
    }
}

function Excluir(idArtistaEstilo, linha) {

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Atenção!", "Deseja realmente excluir este estilo?", "OK", "ExcluirEstilo(" + idArtistaEstilo + ", " + linha + ");", true, "");
    mensagemExcluir.Show();
}

function ExcluirEstilo(idArtistaEstilo, linha) {

    if (idArtistaEstilo <= 0) {

        gridEstilos.deleteRow(linha);

        for (var i = 0; i < gridEstilos.getRowCount(); i++) {

            gridEstilos.getCellObject(i, 1).setAttribute('onclick', 'Excluir(0, ' + i + ')');
        }

    } else {

        var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
        var p = 'action=ExcluirEstilo';
        p += '&idArtistaEstilo=' + idArtistaEstilo;
        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt2", 140, 500, 150, "1", "Erro", "Erro ao excluir o estilo do artista. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {

            MostrarEstilosArtista(codigoAtual);
        }
    }

    mensagemExcluir.Close();
}

function MostrarObrasArtista(idArtista) {

    gridObras.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=MostrarObrasArtista';
    p += '&idArtista=' + idArtista;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        var imagem = DOM.newElement('img');

        if (json[i].imagem == '') {
            imagem.setAttribute('src', 'imagens/login.png');
            imagem.setAttribute('style', 'width:175px; height:125px;');
        } else {
            imagem.setAttribute('src', json[i].imagemMini);
            imagem.setAttribute('style', 'cursor:pointer;');
        }

        imagem.setAttribute('title', json[i].nomeObra);
        imagem.setAttribute('onclick', 'VisualizarImagem("' + json[i].imagemOriginal + '");');

        var qtdeVendido = DOM.newElement('span');
        qtdeVendido.setAttribute('style', 'text-decoration:underline');
        qtdeVendido.setAttribute('style', 'cursor:pointer;');
        qtdeVendido.setAttribute('onclick', 'PromptQtdeVendido(' + json[i].idArtistaObra + ', ' + json[i].qtdeVendidos + ');');
        qtdeVendido.innerHTML = json[i].qtdeVendidos;

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar obra');
        editar.setAttribute('style', 'cursor:pointer;');
        editar.setAttribute('onclick', 'PromptObra(' + json[i].idArtistaObra + ');');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir obra');
        excluir.setAttribute('style', 'cursor:pointer;');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + json[i].idArtistaObra + ');');

        gridObras.addRow([
            imagem,
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].estilo),
            DOM.newText(json[i].descricao),
            DOM.newText(json[i].dataCadastro),
            qtdeVendido,
            DOM.newText(json[i].ativo),
            editar,
            excluir
        ]);

        gridObras.setRowData(i, json[i].idArtistaObra);
        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'width:100px; text-align:center');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'width:80px; text-align:center');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'width:85px; text-align:center');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'width:30px; text-align:center');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'width:30px; text-align:center');
        gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'width:30px; text-align:center');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#FFF");
        }
    }
}

function PromptObra(codigo) {

    if(!CheckPermissao(2, true, 'Você não possui permissão para cadastrar uma nova obra para o artista', false)){
        return;
    }

    codigoObra = codigo;


    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 450, 150, "2", "Atenção!", "Por favor, selecione um artista para cadastrar uma obra.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'PromptObra')) {
        var PromptObra = DOM.newElement('div', 'PromptObra');
        document.body.appendChild(PromptObra);
    }

    var PromptObra = Selector.$('PromptObra');
    PromptObra.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptObra.appendChild(divform);

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "*";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblaste = DOM.newElement('label');
    lblaste.innerHTML = "*";
    lblaste.setAttribute("style", "color:red;");

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");

    var lblNome = DOM.newElement('label');
    lblNome.innerHTML = "Nome";

    var nome = DOM.newElement('text', 'nome2');
    nome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    nome.setAttribute('style', 'margin-left:0px; width:440px;');
    nome.setAttribute('placeHolder', 'Ex.: Monalisa');

    var lblAtivo = DOM.newElement('label');
    lblAtivo.setAttribute('style', 'margin-left:5px;');
    lblAtivo.setAttribute('for', 'ativo2');
    lblAtivo.innerHTML = "Ativo";

    var ativo = DOM.newElement('checkbox', 'ativo2');
    ativo.setAttribute('style', 'margin-left:10px;');

    var lblestilo = DOM.newElement('label');
    lblestilo.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblestilo.appendChild(DOM.newText('Estilo'));

    var cmbestilo = DOM.newElement('select');
    cmbestilo.setAttribute('id', 'estilos3');
    cmbestilo.setAttribute('class', 'combo_cinzafoco');
    cmbestilo.setAttribute('style', 'width:440px;');

    var lblDescricao = DOM.newElement('label');
    lblDescricao.innerHTML = "Descrição";

    var descricao = DOM.newElement('textarea', 'descricao');
    descricao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    descricao.setAttribute('style', 'width:320px; height:170px;');
    descricao.setAttribute('placeHolder', 'Descrição sobre a obra');

    var divImagem = DOM.newElement('div', 'divImagem');
    divImagem.setAttribute('style', 'float:right; width:180px; height:130px; border:1px solid lightgray; text-align:center;');

    var imagem = DOM.newElement('img', 'imagem');
    imagem.setAttribute('src', 'imagens/login.png');
    imagem.setAttribute('width', '175');
    imagem.setAttribute('height', '125');
    imagem.setAttribute('name', '');

    var btAdicionar = DOM.newElement('button', 'adicionarImagem');
    btAdicionar.setAttribute('class', 'botaosimplesfoco');
    btAdicionar.setAttribute('style', 'float:right; margin-right:30px; margin-top:-40px;');
    btAdicionar.setAttribute('onclick', 'IncluirImagem();');
    btAdicionar.innerHTML = 'Incluir Imagem';

    divImagem.appendChild(imagem);

    var lblTamanhos = DOM.newElement('label');
    lblTamanhos.innerHTML = "Tamanhos";

    var btIncluir = DOM.newElement('button', 'btIncluir');
    btIncluir.setAttribute('class', 'botaosimplesfoco');
    btIncluir.setAttribute('style', 'margin-left:10px;');
    btIncluir.setAttribute('onclick', 'PromptTamanhosObra(' + codigo + ', 0, -1, 0, true);');
    btIncluir.innerHTML = 'Incluir +';

    var divGrid = DOM.newElement('div', 'divGrid');
    divGrid.setAttribute('style', 'height:160px; overflow:auto;');

    gridTamanhos = new Table('gridTamanhos');
    gridTamanhos.table.setAttribute('cellpadding', '3');
    gridTamanhos.table.setAttribute('cellspacing', '0');
    gridTamanhos.table.setAttribute('class', 'tabela_cinza_foco');
    gridTamanhos.table.setAttribute('style', 'margin-top:5px;');

    gridTamanhos.addHeader([
        DOM.newText('Tamanho'),
        DOM.newText('Medida'),
        DOM.newText('Qtde Tiragem'),
        DOM.newText('Qtde Vendido'),
        DOM.newText('Editar'),
        DOM.newText('Excluir'),
        DOM.newText('idTamanho')
    ]);

    var btGravar = DOM.newElement('button', 'gravar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'GravarObra(' + codigo + ');');
    btGravar.innerHTML = 'Gravar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoObra.Close();');
    btCancelar.innerHTML = 'Cancelar';

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br/>';
    divform.appendChild(lblNome);
    divform.appendChild(lblaste);
    divform.innerHTML += '<br/>';
    divform.appendChild(nome);
    divform.appendChild(ativo);
    divform.appendChild(lblAtivo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblestilo);
    divform.appendChild(lblaste);
    divform.innerHTML += '<br>';
    divform.appendChild(cmbestilo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblDescricao);
    divform.appendChild(lblaste);
    divform.innerHTML += '<br>';
    divform.appendChild(descricao);
    divform.appendChild(divImagem);
    divform.appendChild(btAdicionar);
    divform.innerHTML += '<br>';
    divform.appendChild(lblTamanhos);
    divform.appendChild(btIncluir);
    divform.innerHTML += '<br>';
    divform.appendChild(divGrid);
    divform.innerHTML += '<br>';
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoObra = new caixaDialogo('PromptObra', 615, 590, 'padrao/', 130);
    dialogoObra.Show();

    Selector.$('divGrid').appendChild(gridTamanhos.table);

    gridTamanhos.hiddenCol(6);


    if (codigo <= 0) {
        Selector.$('ativo2').checked = true;
        Selector.$('nome2').focus();
        getEstilos(Selector.$('estilos3'), "Selecione um estilo", true);
    } else {
        getEstilos(Selector.$('estilos3'), "Selecione um estilo", false);
        getObra(codigo);
    }

}

function GravarObra(codigo) {

    if(!CheckPermissao(2, true, 'Você não possui permissão para editar uma obra do artista', false)){
        return;
    }

    if (Selector.$('nome2').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o nome da obra", "OK", "", false, "nome2");
        mensagem.Show();
        return;
    }

    if (Selector.$('estilos3').value == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o estilo da obra", "OK", "", false, "estilos3");
        mensagem.Show();
        return;
    }

    if (Selector.$('descricao').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a descrição da obra", "OK", "", false, "descricao");
        mensagem.Show();
        return;
    }

    if (Selector.$('imagem').name == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, inclua a imagem da obra", "OK", "", false, "adicionarImagem");
        mensagem.Show();
        return;
    }

    if (gridTamanhos.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, inclua um tamanho.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=GravarObra';
    p += '&idArtistaObra=' + codigo;
    p += '&idArtista=' + codigoAtual;
    p += '&nome=' + Selector.$('nome2').value;
    p += '&ativo=' + (Selector.$('ativo2').checked ? '1' : '0');
    p += '&estilo=' + Selector.$('estilos3').value;
    p += '&descricao=' + Selector.$('descricao').value;
    p += '&imagem=' + Selector.$('imagem').name;

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        arrayTamanhos.push(gridTamanhos.getCellText(i, 6));

        var medidas = gridTamanhos.getCellText(i, 1).split('x');
        var alturas = medidas[0].trim().replace('.', '').replace(',', '.');
        var larguras = medidas[1].trim().replace('.', '').replace(',', '.');

        arrayAlturas.push(alturas);
        arrayLarguras.push(larguras);
        arrayTiragens.push(gridTamanhos.getCellText(i, 2));
    }

    p += '&ids=' + gridTamanhos.getRowsData();
    p += '&tamanhos=' + arrayTamanhos;
    p += '&qtdeVendidos=' + gridTamanhos.getContentObjectValueRows(3);
    p += '&alturas=' + arrayAlturas;
    p += '&larguras=' + arrayLarguras;
    p += '&tiragens=' + arrayTiragens;
 
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao gravar a obra. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Esta obra já está cadastrado.", "OK", "", false, "");
            mensagem.Show();
            return false;
        } else {
            arrayTamanhos.length = 0;
            arrayAlturas.length = 0;
            arrayLarguras.length = 0;
            arrayTiragens.length = 0;
            dialogoObra.Close();
            MostrarObrasArtista(codigoAtual);
        }
    };

    Selector.$('gravar').innerHTML = "Gravando";
    ajax.Request(p);
}

function IncluirImagem() {

    var aleatorio = Math.random();
    var aux = aleatorio.toString().split(".");
    aleatorio = aux[1].substr(0, 4);

    var nome = Selector.$('nome2').value.replace(' ', '_') + aleatorio;//Number.Complete(parseInt(codigoAtual), 6, "0", true);
    var path = '../imagens/obras/';
    var funcao = 'SalvarImagemObra';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg,jpg');
}

function SalvarImagemObra(path) {

    var vetor = path.split("/");
    dialog.Close();

    Selector.$('imagem').name = vetor[vetor.length - 1];

    GerarMiniaturaObra(path);

    if (codigoObra > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
        var p = 'action=AtualizarImagemObra';
        p += '&idObra=' + codigoObra;
        p += '&imagem=' + Selector.$('imagem').name;
        ajax.Request(p);
    }
}

function GerarMiniaturaObra(path) {

    if (codigoAtual <= 0)
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=GerarMiniaturaObra';
    p += '&imagem=' + Selector.$('imagem').name;
    p += '&idArtistaObra=' + codigoAtual;

    ajax.Request(p);

    var json = JSON.parse(ajax.getResponseText() );

    if (ajax.getResponseText() !== "0") {
        Selector.$('imagem').src = json.foto;
        Selector.$('imagem').setAttribute('style', 'width:auto; height:auto;');
    } else {
        var vetor = path.split("../");
        Selector.$('imagem').src = vetor[1];
        Selector.$('imagem').setAttribute('style', 'width:175px; height:125px;');
    }

    Selector.$('adicionarImagem').innerHTML = "Excluir Imagem";
    Selector.$('adicionarImagem').setAttribute('onclick', 'ExcluirImagemObra(0);');
}

function PromptTamanhosObra(idObra, idTamanhoObra, linha, idArtistaObraTamanho, novo) {

    if (!isElement('div', 'PromptTamanhosObra')) {
        var PromptTamanhosObra = DOM.newElement('div', 'PromptTamanhosObra');
        document.body.appendChild(PromptTamanhosObra);
    }

    var PromptTamanhosObra = Selector.$('PromptTamanhosObra');
    PromptTamanhosObra.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptTamanhosObra.appendChild(divform);

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

    var lblast4 = DOM.newElement('label');
    lblast4.innerHTML = "*";
    lblast4.setAttribute("style", "color:red;");

    var lblast5 = DOM.newElement('label');
    lblast5.innerHTML = "*";
    lblast5.setAttribute("style", "color:red;");

    var lblTamanho = DOM.newElement('label');
    lblTamanho.innerHTML = "Tamanho";

    var tamanho = DOM.newElement('select', 'tamanho');
    tamanho.setAttribute('class', 'combo_cinzafoco');
    tamanho.setAttribute('style', 'margin-left:5px; width:300px;');
    tamanho.setAttribute('onchange', 'MostraMedidasTamanho(' + idObra + ');');

    var lblAltura = DOM.newElement('label');
    lblAltura.innerHTML = "Altura";

    var altura = DOM.newElement('text', 'altura');
    altura.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    altura.setAttribute('style', 'margin-left:5px; width:130px; background-color:#F5F5F5;');
    altura.setAttribute('disabled', 'disabled');

    var lblLargura = DOM.newElement('label');
    lblLargura.innerHTML = "Largura";
    lblLargura.setAttribute('style', 'margin-left:5px;');

    var largura = DOM.newElement('text', 'largura');
    largura.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    largura.setAttribute('style', 'margin-left:5px; width:130px; background-color:#F5F5F5;');
    largura.setAttribute('disabled', 'disabled');

    var lblTiragemMaxima = DOM.newElement('label');
    lblTiragemMaxima.innerHTML = "Tiragem Máxima";

    var tiragemMaxima = DOM.newElement('text', 'tiragemMaxima');
    tiragemMaxima.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    tiragemMaxima.setAttribute('style', 'margin-left:5px; width:90px;');

    var lblQtdeVendida = DOM.newElement('label');
    lblQtdeVendida.innerHTML = "Qtde Vendida";
    lblQtdeVendida.setAttribute('style', 'margin-left:5px; display:none;');

    var qtdeVendida = DOM.newElement('text', 'qtdeVendida');
    qtdeVendida.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    qtdeVendida.setAttribute('style', 'margin-left:5px; width:80px; display:none; background-color:#F5F5F5;');
    qtdeVendida.setAttribute('disabled', 'disabled');

    var btGravar = DOM.newElement('button', 'btAdicionar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'AdicionarTamanho(' + linha + ');');
    btGravar.innerHTML = 'Adicionar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoTamanhosObra.Close();');
    btCancelar.innerHTML = 'Cancelar';

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblTamanho);
    divform.appendChild(lblast2);
    divform.appendChild(tamanho);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblAltura);
    divform.appendChild(lblast3);
    divform.appendChild(altura);
    divform.appendChild(lblLargura);
    divform.appendChild(lblast4);
    divform.appendChild(largura);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblTiragemMaxima);
    divform.appendChild(lblast5);
    divform.appendChild(tiragemMaxima);
    divform.appendChild(lblQtdeVendida);
    divform.appendChild(qtdeVendida);
    divform.innerHTML += '<br><br>';
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoTamanhosObra = new caixaDialogo('PromptTamanhosObra', 290, 450, 'padrao/', 131);
    dialogoTamanhosObra.Show();

    Mask.setOnlyNumbers(Selector.$('tiragemMaxima'));
    Mask.setMoeda(Selector.$('largura'));
    Mask.setMoeda(Selector.$('altura'));
    
    if (idTamanhoObra <= 0 && linha <= 0) {
        getTamanhos(Selector.$('tamanho'), "Selecione um tamanho", true);
        Selector.$('tamanho').focus();
    } else if (linha >= 0) {
        getTamanhos(Selector.$('tamanho'), "Selecione um tamanho", false);
        getTamanhoObra(idTamanhoObra, linha, idArtistaObraTamanho, novo);
    }
}

function MostraMedidasTamanho(idObra) {
    if (Selector.$('tamanho').value <= 0)
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=MostraMedidasTamanho';
    p += '&idTamanho=' + Selector.$('tamanho').value;
    p += '&idObra=' + idObra;
    ajax.Request(p);

    var json = JSON.parse(ajax.getResponseText() );

    if (json.altura == '' || json.altura == '0,00') {
        Selector.$('altura').disabled = false;
        Selector.$('altura').style.backgroundColor = "#FFF";
    } else {
        Selector.$('altura').disabled = true;
        Selector.$('altura').style.backgroundColor = "#F5F5F5";
    }

    if (json.largura == '' || json.largura == '0,00') {
        Selector.$('largura').disabled = false;
        Selector.$('largura').style.backgroundColor = "#FFF";
    } else {
        Selector.$('largura').disabled = true;
        Selector.$('largura').style.backgroundColor = "#F5F5F5";
    }

    Selector.$('altura').value = json.altura;
    Selector.$('largura').value = json.largura;
    Selector.$('qtdeVendida').value = json.qtdeVendida;
}

function AdicionarTamanho(idArtistaObraTamanho) {

    if (Selector.$('tamanho').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Por favor, selecione um tamanho.", "OK", "", false, "tamanho");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('altura').value) == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Por favor, digite uma altura.", "OK", "", false, "altura");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('largura').value) == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Por favor, digite uma largura.", "OK", "", false, "largura");
        mensagem.Show();
        return;
    }

    if (Selector.$('tiragemMaxima').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Por favor, digite a tiragem máxima.", "OK", "", false, "tiragemMaxima");
        mensagem.Show();
        return;
    }

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        if (gridTamanhos.getCellObject(i, 0).innerHTML.indexOf("PERSONALIZADO") >= 0 && Select.GetText(Selector.$('tamanho')).indexOf("PERSONALIZADO") >= 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Este tipo de tamanho já foi adicionado.", "OK", "", false, "tamanho");
            mensagem.Show();
            return;
        } else if (gridTamanhos.getCellObject(i, 0).innerHTML == Select.GetText(Selector.$('tamanho')) && i != idArtistaObraTamanho) {
            var mensagem = new DialogoMensagens("prompt", 120, 300, 150, "2", "Atenção!", "Este tipo de tamanho já foi adicionado.", "OK", "", false, "tamanho");
            mensagem.Show();
            return;
        }
    }

    var tamanho = DOM.newElement('label', Selector.$('tamanho').value);
    tamanho.innerHTML = Select.GetText(Selector.$('tamanho'));

    var editar = DOM.newElement('img');
    editar.setAttribute('src', 'imagens/modificar.png');
    editar.setAttribute('title', 'Editar tamanho');
    editar.setAttribute('style', 'cursor:pointer;');

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir tamanho');
    excluir.setAttribute('style', 'cursor:pointer;');

    var texto = DOM.newElement('text');
    texto.setAttribute('style', 'width:35px; height:14px;text-align:center');
    texto.setAttribute('onBlur', 'AvisoAlteraValor();');
    texto.value = '0';

    var altura = '';
    var largura = '';
    if (Selector.$('altura').value.split(',')[1].trim().length == 1) {
        altura = "0,0" + Selector.$('altura').value.split(',')[1].trim();
    } else if (Selector.$('altura').value.split(',')[1].trim().length == 2 && Selector.$('altura').value.split(',')[0].trim().length == 0) {
        altura = "0" + Selector.$('altura').value;
    } else {
        altura = Selector.$('altura').value;
    }

    if (Selector.$('largura').value.split(',')[1].trim().length == 1) {
        largura = "0,0" + Selector.$('largura').value.split(',')[1].trim();
    } else if (Selector.$('largura').value.split(',')[1].trim().length == 2 && Selector.$('largura').value.split(',')[0].trim().length == 0) {
        largura = "0" + Selector.$('largura').value;
    } else {
        largura = Selector.$('largura').value;
    }

    if (idArtistaObraTamanho < 0) {
        gridTamanhos.addRow([
            tamanho,
            DOM.newText(altura + ' x ' + largura),
            DOM.newText(Selector.$('tiragemMaxima').value),
            texto,
            editar,
            excluir,
            DOM.newText(Selector.$('tamanho').value)
        ]);

        gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
        gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:80px;');
        gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
        gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:80px;');
        gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:30px;');
        gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px;');
    }
    else{
        gridTamanhos.setCellObject(idArtistaObraTamanho, 0, tamanho);
        gridTamanhos.setCellText(idArtistaObraTamanho, 1, altura + ' x ' + largura);
        gridTamanhos.setCellText(idArtistaObraTamanho, 2, Selector.$('tiragemMaxima').value);
    }

    gridTamanhos.hiddenCol(6);

    dialogoTamanhosObra.Close();

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        editar.setAttribute('onclick', 'PromptTamanhosObra(0, ' + gridTamanhos.getCellObject(i, 0).id + ', ' + i + ', ' + (gridTamanhos.getCellObject(i, 0).id != "0" ? "0" : idArtistaObraTamanho) + ', ' + (gridTamanhos.getCellObject(i, 0).id == "0" ? false : true) + ');');
        excluir.setAttribute('onclick', 'ExcluirTamanhoAux(0, ' + i + ');');
    }
}
function AvisoAlteraValor (){
    if(isElement('div', 'prompt1')){
        mensagem.Close();
    }
    mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção!", "A alteração deste campo acarretará em mudança de valores em todo o sistema.", "OK", "", false, "");
    mensagem.Show();
    return;
}

function getTamanhoObra(idTamanhoObra, linha, idArtistaObraTamanho, novo) {

    Selector.$('btAdicionar').innerHTML = "Gravar";

    Selector.$('tamanho').value = idTamanhoObra;
    Selector.$('altura').value = gridTamanhos.getCellText(linha, 1).split('x')[0].trim();
    Selector.$('largura').value = gridTamanhos.getCellText(linha, 1).split('x')[1].trim();
    Selector.$('tiragemMaxima').value = gridTamanhos.getCellText(linha, 2);
}

function EditarTamanhoObra(linha, novo, idArtistaObraTamanho) {

    gridTamanhos.getCellObject(linha, 0).innerHTML = Select.GetText(Selector.$('tamanho'));

    gridTamanhos.setCellText(linha, 1, Selector.$('altura').value + "x" + Selector.$('largura').value);
    gridTamanhos.setCellText(linha, 2, Selector.$('tiragemMaxima').value);
    gridTamanhos.setCellText(linha, 3, Selector.$('qtdeVendida').value);

    if (novo) {
        gridTamanhos.getCellObject(linha, 0).id = Selector.$('tamanho').value;

    } else {

        gridTamanhos.setRowData(linha, Selector.$('tamanho').value);

        var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);

        var p = 'action=EditarTamanhoObra';
        p += '&idArtistaObraTamanho=' + idArtistaObraTamanho;
        p += '&idTamanho=' + gridTamanhos.getRowData(linha);
        p += '&altura=' + Selector.$('altura').value;
        p += '&largura=' + Selector.$('largura').value;
        p += '&tiragemMaxima=' + Selector.$('tiragemMaxima').value;

        ajax.Request(p);
    }

    Selector.$('btAdicionar').innerHTML = "Adicionar";
    Selector.$('btAdicionar').setAttribute('onclick', 'AdicionarTamanho(0);');
    dialogoTamanhosObra.Close();
}

function ExcluirTamanhoAux(idArtistaObraTamanho, linha) {

    mensagemExcluirTamanho = new DialogoMensagens("prompt", 120, 350, 150, "4", "Atenção!", "Deseja realmente excluir este tamanho?", "OK", "ExcluirTamanhoObra(" + idArtistaObraTamanho + ", " + linha + ");", true, "");
    mensagemExcluirTamanho.Show();
}

function ExcluirTamanhoObra(idArtistaObraTamanho, linha) {

    if (idArtistaObraTamanho <= 0) {

        gridTamanhos.deleteRow(linha);

        for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

            gridTamanhos.getCellObject(i, 5).setAttribute('onclick', 'ExcluirTamanhoAux(0, ' + i + ')');
        }

    } else {

        var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
        var p = 'action=ExcluirTamanhoObra';
        p += '&idArtistaObraTamanho=' + idArtistaObraTamanho;
        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt2", 140, 500, 150, "1", "Erro", "Erro ao excluir o tamanho da obra. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {

            MostraTamanhosObra(codigoObra);
        }
    }

    mensagemExcluirTamanho.Close();
}

function getObra(idObra) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=getObra';
    p += '&idObra=' + idObra;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    Selector.$('nome2').value = json.nomeObra;

    if (json.ativo == '1') {
        Selector.$('ativo2').checked = true;
    } else {
        Selector.$('ativo2').checked = false;
    }

    Selector.$('descricao').value = json.descricao;

    if (json.imagem == '') {
        Selector.$('imagem').setAttribute('src', 'imagens/login.png');
        Selector.$('imagem').setAttribute('style', 'width:175px; height:125px;');
    } else {
        Selector.$('imagem').src = json.imagemMini;
        Selector.$('imagem').setAttribute('style', 'width:auto; height:auto');
    }

    Selector.$('imagem').name = json.imagem;


    if (json.imagem !== '') {
        Selector.$('adicionarImagem').innerHTML = 'Excluir Imagem';
        Selector.$('adicionarImagem').setAttribute('onclick', 'ExcluirImagemObra(' + idObra + ')');
    }

    MostraTamanhosObra(idObra);    
    Selector.$('estilos3').value = json.estilo;
}

function MostraTamanhosObra(idObra) {

    gridTamanhos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=MostraTamanhosObra';
    p += '&idObra=' + idObra;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        


        for (var i = 0; i < json.length; i++) {

            var tamanho = DOM.newElement('label', 0);
            tamanho.innerHTML = json[i].nomeTamanho;

            var editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar tamanho');
            editar.setAttribute('style', 'cursor:pointer;');
            editar.setAttribute('onclick', 'PromptTamanhosObra(' + idObra + ', ' + json[i].idTamanho + ', ' + i + ', ' + json[i].idArtistaObraTamanho + ', ' + false + ');');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir tamanho');
            excluir.setAttribute('style', 'cursor:pointer;');
            excluir.setAttribute('onclick', 'ExcluirTamanhoAux(' + json[i].idArtistaObraTamanho + ', ' + i + ');');

            var texto = DOM.newElement('text');
            texto.setAttribute('style', 'width:35px; height:14px;text-align:center');
            texto.value = json[i].qtdeVendidas;
            texto.setAttribute('onBlur', 'AvisoAlteraValor();');

            if (json[i].admin != '1') {
                texto.setAttribute('disabled', 'disabled');
            }

            gridTamanhos.addRow([
                tamanho,
                DOM.newText(json[i].medidas),
                DOM.newText(json[i].tiragemMaxima),
                texto, //DOM.newText(json[i].qtdeVendidas),
                editar,
                excluir,
                DOM.newText(json[i].idTamanho)
            ]);

            gridTamanhos.setRowData(i, json[i].idArtistaObraTamanho);
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:80px;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:80px;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:30px;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px;');

            gridTamanhos.hiddenCol(6);
        }
    };

    ajax.Request(p);
}

function ExcluirImagemObra(idObra) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=ExcluirImagemObra';
    p += '&idObra=' + idObra;
    p += '&imagem=' + Selector.$('imagem').name;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao excluir a imagem. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {

        Selector.$('imagem').src = 'imagens/login.png';
        Selector.$('imagem').setAttribute('style', 'width:175px; height:125px;');
        Selector.$('imagem').name = "";

        Selector.$('adicionarImagem').innerHTML = "Incluir Imagem";
        Selector.$('adicionarImagem').setAttribute('onclick', 'IncluirImagem();');
    }
}

function ExcluirObraAux(idObra) {

    if(!CheckPermissao(3, true, 'Você não possui permissão para excluir uma obra do artista', false)){
        return;
    }

    mensagemExcluirObra = new DialogoMensagens("prompt", 120, 350, 150, "4", "Atenção!", "Deseja realmente excluir esta obra?", "OK", "ExcluirObra(" + idObra + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirObra(idObra) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=ExcluirObra';
    p += '&idObra=' + idObra;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao excluir a obra. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Não é possível excluir esta obra, pois já existem vendas dessa obra.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        MostrarObrasArtista(codigoAtual);
        mensagemExcluirObra.Close();
    }
}

function PromptQtdeVendido(idObra, qtdeVendido) {

    if (idObra <= 0) {
        return;
    }

    if (!isElement('div', 'PromptQtdeVendido')) {
        var PromptQtdeVendido = DOM.newElement('div', 'PromptQtdeVendido');
        document.body.appendChild(PromptQtdeVendido);
    }

    var PromptQtdeVendido = Selector.$('PromptQtdeVendido');
    PromptQtdeVendido.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptQtdeVendido.appendChild(divform);

    var divGridQtdeVendidos = DOM.newElement('div', 'divGridQtdeVendidos');
    divGridQtdeVendidos.setAttribute('style', 'height:510px; overflow:auto;');

    divform.innerHTML += "<br>";
    divform.appendChild(divGridQtdeVendidos);

    gridQtdeVendidos = new Table('gridQtdeVendidos');
    gridQtdeVendidos.table.setAttribute('cellpadding', '5');
    gridQtdeVendidos.table.setAttribute('cellspacing', '0');
    gridQtdeVendidos.table.setAttribute('class', 'tabela_cinza_foco');
    gridQtdeVendidos.table.setAttribute('style', 'margin-top:5px;');

    gridQtdeVendidos.addHeader([
        DOM.newText('Tamanho'),
        DOM.newText('Medida'),
        DOM.newText('Tiragem'),
        DOM.newText('Qtde. Vendidos')
    ]);

    dialogoQtdeVendidos = new caixaDialogo('PromptQtdeVendido', 530, 500, 'padrao/', 131);
    dialogoQtdeVendidos.Show();

    Selector.$('divGridQtdeVendidos').appendChild(gridQtdeVendidos.table);

    gridQtdeVendidos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=getQtdeTamanhosVendidos';
    p += '&idObra=' + idObra;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var cor = false;
        


        for (var i = 0; i < json.length; i++) {

            gridQtdeVendidos.addRow([
                DOM.newText(json[i].nomeTamanho),
                DOM.newText(json[i].medidas),
                DOM.newText(json[i].tiragemMaxima),
                DOM.newText(json[i].qtdeVendidos)
            ]);

            //gridQtdeVendidos.setRowData(gridQtdeVendidos.getRowCount() - 1, json[i].idVendaComp);
            gridQtdeVendidos.getCell(gridQtdeVendidos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridQtdeVendidos.getCell(gridQtdeVendidos.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            gridQtdeVendidos.getCell(gridQtdeVendidos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');

            if (cor) {
                cor = false;
                gridQtdeVendidos.setRowBackgroundColor(gridQtdeVendidos.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridQtdeVendidos.setRowBackgroundColor(gridQtdeVendidos.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function PromptConsignacao(codigo) {

    if(!CheckPermissao(2, true, 'Você não possui permissão para cadastrar uma consignação', false)){
        return;
    }

    codigoConsignacao = codigo;

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 450, 150, "2", "Atenção!", "Por favor, selecione um artista para cadastrar uma consignação.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'PromptConsignacao')) {
        var PromptConsignacao = DOM.newElement('div', 'PromptConsignacao');
        document.body.appendChild(PromptConsignacao);
    }

    var PromptConsignacao = Selector.$('PromptConsignacao');
    PromptConsignacao.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptConsignacao.appendChild(divform);

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

    var lblNome = DOM.newElement('label');
    lblNome.innerHTML = "Nome";

    var nome = DOM.newElement('text', 'nome3');
    nome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    nome.setAttribute('style', 'margin-left:0px; width:440px;');

    var lblAtivo = DOM.newElement('label');
    lblAtivo.setAttribute('style', 'margin-left:5px;');
    lblAtivo.setAttribute('for', 'ativo2');
    lblAtivo.innerHTML = "Ativo";

    var ativo = DOM.newElement('checkbox', 'ativo3');
    ativo.setAttribute('style', 'margin-left:10px;');

    var lblestilo = DOM.newElement('label');
    lblestilo.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblestilo.appendChild(DOM.newText('Estilo'));

    var cmbestilo = DOM.newElement('select');
    cmbestilo.setAttribute('id', 'estilos4');
    cmbestilo.setAttribute('class', 'combo_cinzafoco');
    cmbestilo.setAttribute('style', 'width:440px;');

    var lblDescricao = DOM.newElement('label');
    lblDescricao.innerHTML = "Descrição";

    var descricao = DOM.newElement('textarea', 'descricao2');
    descricao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    descricao.setAttribute('style', 'width:320px; height:170px;');

    var divImagem = DOM.newElement('div');
    divImagem.setAttribute('style', 'float:right; width:180px; height:130px; border:1px solid lightgray; text-align:center;');

    var imagem = DOM.newElement('img', 'imagem2');
    imagem.setAttribute('src', 'imagens/login.png');
    imagem.setAttribute('width', '175');
    imagem.setAttribute('height', '125');
    imagem.setAttribute('name', '');

    var btAdicionar = DOM.newElement('button', 'adicionarImagem2');
    btAdicionar.setAttribute('class', 'botaosimplesfoco');
    btAdicionar.setAttribute('style', 'float:right; margin-right:30px; margin-top:-40px;');
    btAdicionar.setAttribute('onclick', 'IncluirImagemConsignacao();');
    btAdicionar.innerHTML = 'Incluir Imagem';

    divImagem.appendChild(imagem);

    var lblTamanho = DOM.newElement('label');
    lblTamanho.innerHTML = "Tamanho";

    var tamanho = DOM.newElement('text', 'tamanho');
    tamanho.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    tamanho.setAttribute('style', 'margin-left:5px; width:183px;');
    tamanho.setAttribute('placeholder', 'Ex: 30x45');

    var lblQtde = DOM.newElement('label');
    lblQtde.setAttribute('style', 'margin-left:5px;');
    lblQtde.innerHTML = "Quantidade";

    var qtde = DOM.newElement('text', 'qtde');
    qtde.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    qtde.setAttribute('style', 'margin-left:5px; width:183px;');

    var lblValorConsignacao = DOM.newElement('label');
    lblValorConsignacao.innerHTML = "Valor Consignacao";

    var valorConsignacao = DOM.newElement('text', 'valorConsignacao');
    valorConsignacao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    valorConsignacao.setAttribute('style', 'margin-left:5px; width:155px;');

    var lblValorVenda = DOM.newElement('label');
    lblValorVenda.setAttribute('style', 'margin-left:5px;');
    lblValorVenda.innerHTML = "Valor Venda";

    var valorVenda = DOM.newElement('text', 'valorVenda');
    valorVenda.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    valorVenda.setAttribute('style', 'margin-left:5px; width:155px;');

    var btGravar = DOM.newElement('button', 'gravar2');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'GravarConsignacao(' + codigo + ');');
    btGravar.innerHTML = 'Gravar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoConsignacao.Close();');
    btCancelar.innerHTML = 'Cancelar';

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br>';
    divform.appendChild(lblNome);
    divform.appendChild(lblast2);
    divform.innerHTML += '<br>';
    divform.appendChild(nome);
    divform.appendChild(ativo);
    divform.appendChild(lblAtivo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblestilo);
    divform.appendChild(lblast2);
    divform.innerHTML += '<br>';
    divform.appendChild(cmbestilo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblDescricao);
    divform.appendChild(lblast2);
    divform.innerHTML += '<br>';
    divform.appendChild(descricao);
    divform.appendChild(divImagem);
    divform.appendChild(btAdicionar);
    divform.innerHTML += '<br>';
    divform.appendChild(lblTamanho);
    divform.appendChild(lblast2);
    divform.appendChild(tamanho);
    divform.appendChild(lblQtde);
    divform.appendChild(lblast2);
    divform.appendChild(qtde);
    divform.innerHTML += '<br>';
    divform.appendChild(lblValorConsignacao);
    divform.appendChild(lblast2);
    divform.appendChild(valorConsignacao);
    divform.appendChild(lblValorVenda);
    divform.appendChild(lblast2);
    divform.appendChild(valorVenda);
    divform.innerHTML += '<br>';
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoConsignacao = new caixaDialogo('PromptConsignacao', 490, 590, 'padrao/', 130);
    dialogoConsignacao.Show();

    Mask.setOnlyNumbers(Selector.$('qtde'));
    Mask.setMoeda(Selector.$('valorConsignacao'));
    Mask.setMoeda(Selector.$('valorVenda'));

    if (codigo <= 0) {
        getEstilos(Selector.$('estilos4'), "Selecione um estilo", true);
        Selector.$('ativo3').checked = true;
        Selector.$('nome3').focus();
    } else {
        getEstilos(Selector.$('estilos4'), "Selecione um estilo", false);
        getConsignacao(codigo);
    }
}

function GravarConsignacao(codigo) {

    if(!CheckPermissao(2, true, 'Você não possui permissão para editar uma consignação', false)){
        return;
    }

    if (Selector.$('nome3').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o nome da consignação", "OK", "", false, "nome3");
        mensagem.Show();
        return;
    }

    if (Selector.$('estilos4').value == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um estilo", "OK", "", false, "nome3");
        mensagem.Show();
        return;
    }

    if (Selector.$('descricao2').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a descrição da consignação", "OK", "", false, "descricao2");
        mensagem.Show();
        return;
    }
    
    if (Selector.$('tamanho').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o tamanho da consignação", "OK", "", false, "tamanho");
        mensagem.Show();
        return;
    }

    if (Selector.$('qtde').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a quantidade da consignação", "OK", "", false, "qtde");
        mensagem.Show();
        return;
    }

    if (Selector.$('valorConsignacao').value.trim() == "" || Selector.$('valorConsignacao').value.trim() == ",") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o valor da consignação", "OK", "", false, "valorConsignacao");
        mensagem.Show();
        return;
    }

    if (Selector.$('valorVenda').value.trim() == "" || Selector.$('valorVenda').value.trim() == ",") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o valor de venda", "OK", "", false, "valorVenda");
        mensagem.Show();
        return;
    }

    if (Selector.$('imagem2').name == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, inclua a imagem da consignação", "OK", "", false, "adicionarImagem2");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=GravarConsignacao';
    p += '&idArtistaConsignacao=' + codigo;
    p += '&idArtista=' + codigoAtual;
    p += '&nome=' + Selector.$('nome3').value;
    p += '&ativo=' + (Selector.$('ativo3').checked ? '1' : '0');
    p += '&estilo=' + Selector.$('estilos4').value;
    p += '&descricao=' + Selector.$('descricao2').value;
    p += '&tamanho=' + Selector.$('tamanho').value;
    p += '&qtde=' + Selector.$('qtde').value;
    p += '&valorConsignacao=' + Selector.$('valorConsignacao').value;
    p += '&valorVenda=' + Selector.$('valorVenda').value;
    p += '&imagem=' + Selector.$('imagem2').name;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('gravar2').innerHTML = "Gravar";

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao gravar a consignação. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            dialogoConsignacao.Close();
            MostrarConsignacoesArtista(codigoAtual);
        }
    };

    Selector.$('gravar2').innerHTML = "Gravando";
    ajax.Request(p);
}

function IncluirImagemConsignacao() {

    var aleatorio = Math.random();
    var aux = aleatorio.toString().split(".");
    aleatorio = aux[1].substr(0, 4);

    var nome = Selector.$('nome3').value.replace(' ', '_') + aleatorio;//Number.Complete(parseInt(codigoAtual), 6, "0", true);
    var path = '../imagens/obras/consignacoes/';
    var funcao = 'SalvarImagemConsignacao';
    
    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg,jpg');
}

function SalvarImagemConsignacao(path) {

    var vetor = path.split("/");
    dialog.Close();

    Selector.$('imagem2').name = vetor[vetor.length - 1];

    GerarMiniaturaConsignacao(path);

    if (codigoConsignacao > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
        var p = 'action=AtualizarImagemConsignacao';
        p += '&idConsignacao=' + codigoConsignacao;
        p += '&imagem=' + Selector.$('imagem2').name;
        ajax.Request(p);
    }
}

function GerarMiniaturaConsignacao(path) {

    if (codigoAtual <= 0)
        return;

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=GerarMiniaturaConsignacao';
    p += '&imagem=' + Selector.$('imagem2').name;
    p += '&idArtistaConsignacao=' + codigoAtual;

    ajax.Request(p);

    var json = JSON.parse(ajax.getResponseText() );

    if (ajax.getResponseText() !== "0") {
        Selector.$('imagem2').src = json.foto;
        Selector.$('imagem2').setAttribute('style', 'width:auto; height:auto;');
    } else {
        var vetor = path.split("../");
        Selector.$('imagem2').src = vetor[1];
        Selector.$('imagem2').setAttribute('style', 'width:175px; height:125px;');
    }

    Selector.$('adicionarImagem2').innerHTML = "Excluir Imagem";
    Selector.$('adicionarImagem2').setAttribute('onclick', 'ExcluirImagemConsignacao(0);');
}

function MostrarConsignacoesArtista(idArtista) {

    gridConsignacoes.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=MostrarConsignacoesArtista';
    p += '&idArtista=' + idArtista;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        var imagem = DOM.newElement('img');

        if (json[i].imagem == '') {
            imagem.setAttribute('src', 'imagens/login.png');
            imagem.setAttribute('style', 'width:175px; height:125px;');
        } else {
            imagem.setAttribute('src', json[i].imagemMini);
            imagem.setAttribute('style', 'cursor:pointer; max-width:64px');
            imagem.setAttribute('onclick', 'VisualizarImagem("' + json[i].imagemOriginal + '");');
        }

        imagem.setAttribute('title', json[i].nome);

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar obra');
        editar.setAttribute('style', 'cursor:pointer;');
        editar.setAttribute('onclick', 'PromptConsignacao(' + json[i].idArtistaConsignacao + ');');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir consignação');
        excluir.setAttribute('style', 'cursor:pointer;');
        excluir.setAttribute('onclick', 'ExcluirConsignacaoAux(' + json[i].idArtistaConsignacao + ');');

        gridConsignacoes.addRow([
            imagem,
            DOM.newText(json[i].nome),
            DOM.newText(json[i].estilo),
            DOM.newText(json[i].descricao),
            DOM.newText(json[i].tamanho),
            DOM.newText(json[i].valorConsignacao),
            DOM.newText(json[i].valorVenda),
            DOM.newText(json[i].quantidade),
            DOM.newText(json[i].qtdeVendidas),
            DOM.newText(json[i].ativo),
            editar,
            excluir
        ]);

        gridConsignacoes.setRowData(i, json[i].idArtistaConsignacao);
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 0).setAttribute('style', 'width:100px; text-align:center');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 4).setAttribute('style', 'width:80px; text-align:center');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 5).setAttribute('style', 'width:80px; text-align:right');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 6).setAttribute('style', 'width:80px; text-align:right');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 7).setAttribute('style', 'width:60px; text-align:center');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 8).setAttribute('style', 'width:60px; text-align:center');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 9).setAttribute('style', 'width:50px; text-align:center');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 10).setAttribute('style', 'width:30px; text-align:center');
        gridConsignacoes.getCell(gridConsignacoes.getRowCount() - 1, 11).setAttribute('style', 'width:30px; text-align:center');

        if (cor) {
            cor = false;
            gridConsignacoes.setRowBackgroundColor(gridConsignacoes.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridConsignacoes.setRowBackgroundColor(gridConsignacoes.getRowCount() - 1, "#FFF");
        }
    }
}

function getConsignacao(idConsignacao) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=getConsignacao';
    p += '&idConsignacao=' + idConsignacao;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    
    alert( json.tamanho );

    Selector.$('nome3').value = json.nome;

    if (json.ativo == '1') {
        Selector.$('ativo3').checked = true;
    } else {
        Selector.$('ativo3').checked = false;
    }

    Selector.$('descricao2').value = json.descricao;

    if (json.imagem == '') {
        Selector.$('imagem2').setAttribute('src', 'imagens/login.png');
        Selector.$('imagem2').setAttribute('style', 'width:175px; height:125px;');
    } else {
        Selector.$('imagem2').src = json.imagemMini;
    }

    Selector.$('imagem2').name = json.imagem;
    Selector.$('tamanho').value = json.tamanho;
    Selector.$('qtde').value = json.quantidade;
    Selector.$('valorConsignacao').value = json.valorConsignacao;
    Selector.$('valorVenda').value = json.valorVenda;

    if (json.imagem !== '') {

        Selector.$('adicionarImagem2').innerHTML = 'Excluir Imagem';
        Selector.$('adicionarImagem2').setAttribute('onclick', 'ExcluirImagemConsignacao(' + idConsignacao + ')');
    }

    Selector.$('estilos4').value = json.estilo;
}

function ExcluirConsignacaoAux(idConsignacao) {

    if(!CheckPermissao(4, true, 'Você não possui permissão para excluir uma consignação', false)){
        return;
    }

    mensagemExcluirConsignacao = new DialogoMensagens("prompt", 120, 350, 150, "4", "Atenção!", "Deseja realmente excluir esta consignacao?", "OK", "ExcluirConsignacao(" + idConsignacao + ");", true, "");
    mensagemExcluirConsignacao.Show();
}

function ExcluirConsignacao(idConsignacao) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=ExcluirConsignacao';
    p += '&idConsignacao=' + idConsignacao;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao excluir a consignação. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Não é possível excluir esta consignação, pois já existem vendas dessa consignação.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        MostrarConsignacoesArtista(codigoAtual);
        mensagemExcluirConsignacao.Close();
    }
}

function ExcluirImagemConsignacao(idConsignacao) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=ExcluirImagemConsignacao';
    p += '&idConsignacao=' + idConsignacao;
    p += '&imagem=' + Selector.$('imagem2').name;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao excluir a imagem. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {

        Selector.$('imagem2').src = 'imagens/login.png';
        Selector.$('imagem2').setAttribute('style', 'width:175px; height:125px;');
        Selector.$('imagem2').name = "";

        Selector.$('adicionarImagem2').innerHTML = "Incluir Imagem";
        Selector.$('adicionarImagem2').setAttribute('onclick', 'IncluirImagemConsignacao();');
    }
}

function VisualizarImagem(imagem) {

    window.open(imagem);
}

function MostrarPagamentosArtista(idArtista, tipo) {

    gridPagamentos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=MostrarPagamentosArtista';
    p += '&idArtista=' + idArtista;
    p += '&tipo=' + tipo;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }
    
    var json = JSON.parse(ajax.getResponseText() );

    var visualizar;
    var descricao;
    var valorTotal;
    var comissao;
    var qtdeParcelas;
    var valorTotalPago;
    var valorAPagar;
    var cores = false;

    for (var i = 0; i < json.length; i++) {

        descricao = DOM.newElement('span');
        descricao.innerHTML = json[i].descricao;

        valorTotal = DOM.newElement('span');
        valorTotal.innerHTML = json[i].valorTotal;

        comissao = DOM.newElement('span');
        comissao.innerHTML = json[i].comissao;

        qtdeParcelas = DOM.newElement('span');
        qtdeParcelas.innerHTML = json[i].qtdeParcelas;

        valorTotalPago = DOM.newElement('span');
        valorTotalPago.innerHTML = json[i].valorTotalPago;

        valorAPagar = DOM.newElement('span');
        valorAPagar.innerHTML = json[i].valorAPagar;

        visualizar = DOM.newElement('img');
        visualizar.setAttribute('src', 'imagens/pesquisar.png');
        visualizar.setAttribute('title', 'Visualizar');
        visualizar.setAttribute('style', 'cursor:pointer;');
        visualizar.setAttribute('onclick', 'VisualizarConpag(' + json[i].idConpag + ');');

        gridPagamentos.addRow([
            descricao,
            valorTotal,
            comissao,
            qtdeParcelas,
            valorTotalPago,
            valorAPagar,
            visualizar
        ]);

        gridPagamentos.setRowData(i, json[i].idConpag);
        gridPagamentos.getCell(gridPagamentos.getRowCount() - 1, 1).setAttribute('style', 'width:100px; text-align:right');
        gridPagamentos.getCell(gridPagamentos.getRowCount() - 1, 2).setAttribute('style', 'width:150px; text-align:right');
        gridPagamentos.getCell(gridPagamentos.getRowCount() - 1, 3).setAttribute('style', 'width:125px; text-align:center');
        gridPagamentos.getCell(gridPagamentos.getRowCount() - 1, 4).setAttribute('style', 'width:100px; text-align:right');
        gridPagamentos.getCell(gridPagamentos.getRowCount() - 1, 5).setAttribute('style', 'width:100px; text-align:right');
        gridPagamentos.getCell(gridPagamentos.getRowCount() - 1, 6).setAttribute('style', 'width:30px; text-align:center');

        if (cores) {
            cores = false;
            gridPagamentos.setRowBackgroundColor(gridPagamentos.getRowCount() - 1, "#F5F5F5");
        } else {
            cores = true;
            gridPagamentos.setRowBackgroundColor(gridPagamentos.getRowCount() - 1, "#FFF");
        }
    }
}

function VisualizarConpag(idConpag) {

    window.location = 'cadastro-de-contas-a-pagar.html?source=artistas&idConpag=' + idConpag;
}

function CompleteTipoPagamento() {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=CompleteTipoPagamento';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        for (var i = 0; i < json.length; i++) {

            arrayTipoPagamento.push(json[i].tipoPagamento);
        }
    };

    ajax.Request(p);
}

function TabelaDeVendas(codigo) {

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', true);
    var p = 'action=TabelaDeVendas';
    p += '&idArtista=' + codigo;

    gridVendas.clearRows();

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        for (var i = 0; i < json.length; i++) {

            var ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/modificar.png');
            ver.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].pedido + '"');

            var pagamento = DOM.newElement('span');
            pagamento.innerHTML = json[i].pagamento;

            gridVendas.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].pedido),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].op),
                DOM.newText(json[i].serie),
                DOM.newText(json[i].tiragem),
                DOM.newText(json[i].valor),
                pagamento,
                ver
            ]);

            gridVendas.setRowData(json[i].idVenda);
            gridVendas.getCell(gridVendas.getRowCount() - 1, '0').setAttribute('style', 'text-align:center;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '1').setAttribute('style', 'text-align:center;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '2').setAttribute('style', 'text-align:left;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '3').setAttribute('style', 'text-align:center;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '4').setAttribute('style', 'text-align:center;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '5').setAttribute('style', 'text-align:center;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '6').setAttribute('style', 'text-align:right;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '7').setAttribute('style', 'text-align:center;');
            gridVendas.getCell(gridVendas.getRowCount() - 1, '8').setAttribute('style', 'text-align:center; cursor: pointer;');
        }
    };

    ajax.Request(p);
}

function ExportarVendas() {

    if(!CheckPermissao(5, true, 'Você não possui permissão para gerar Excel das vendas', false)){
        return;
    }

    if (gridVendas.getRowCount() <= 0) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
    var p = 'action=ExportarVendas';
    p += '&idArtista=' + codigoAtual;

    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }

}