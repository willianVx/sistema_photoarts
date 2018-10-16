checkSessao();
var edicao = false;
var codigoAtual = 0;
var idCardapioGrupo = 0;
var enviarConviteNovamente = false;
var cancelado = false;
var qtdePagantes = 0;
var qtdeNaoPagantes = 0;
var valorAdicionalAntesFesta = 0;
var valorAdicionalDiaFesta = 0;
var avisoDecoracaoFesta = false;
var duracaoFesta = "";
var idAviso = 0;
var ultimoIdCardapioItem = 0;
var latitudeEnd = "";
var longitudeEnd = "";
var qtdOpcionaisAdicionados = 0;
var qtdAlteracoes = 0;
var verificaParcela = 0;

window.onresize = function () {
    emEdicao(edicao);
};

function emEdicao(valor) {

    edicao = valor;

    if (valor) {
        Selector.$('conteudo').style.maxWidth = "1150px";
        Selector.$('relatoriotabela').style.height = "0px";
        Selector.$('divRelatorio').style.height = "0px";
        Selector.$('contador').style.display = "none";
        Selector.$('divCadastro').style.height = "auto";
        Selector.$('divCadastro').style.minHeight = "700px";
    } else {
        Selector.$('conteudo').style.width = "98%";
        Selector.$('conteudo').style.maxWidth = "98%";
        Selector.$('divCadastro').style.height = "0px";
        Selector.$('divCadastro').style.minHeight = "0px";
        Selector.$('divRelatorio').style.height = "auto";
        Selector.$('contador').style.display = "block";
        Selector.$('relatoriotabela').style.height = (document.documentElement.clientHeight - (Selector.$('barraEdicao').clientHeight) - 120) + "px";
    }
}

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Contratos</div>";
    checkPermissao(20, false);

    getDadosUsuario();
    carregarmenu();
    SelecionaAbas(0);
    emEdicao(false);
    VerificarAlterarCliente();

    Mask.setData(Selector.$('nascimento'));

    gridContratos = new Table('gridContratos');
    gridContratos.table.setAttribute('cellpadding', '3');
    gridContratos.table.setAttribute('cellspacing', '0');
    gridContratos.table.setAttribute('class', 'tabela_jujuba_comum');

    gridContratos.addHeader([
        DOM.newText(''), //VERIFICAR PENDENCIA
        DOM.newText('Cliente'),
        DOM.newText('Data'),
        DOM.newText('Local'),
        DOM.newText('Pacote'),
        DOM.newText('Decoração'),
        DOM.newText('Contrato'),
        DOM.newText('Data Cad.'),
        DOM.newText('Situação'),
        DOM.newText('Valor'),
        DOM.newText('Opcionais'),
        DOM.newText('Desconto'),
        DOM.newText('Total'),
        DOM.newText('Tipo Festa'),
        DOM.newText('Festa'),
        DOM.newText('Ver')
    ]);

  //  gridContratos.hiddenCol(5);

    Selector.$('relatoriotabela').appendChild(gridContratos.table);

    getClientes(Selector.$('cliente'), "Selecione um cliente", false);
    Mask.setData(Selector.$('dataCotacao'));
    Selector.$('dataCotacao').value = Date.GetDate(false);
    getLocais(Selector.$('local'), "Selecione um local", false);
    Select.AddItem(Selector.$('pacote'), "Selecione um local", 0);
    getDecoracoes(Selector.$('decoracao'), "Selecione...", false);
    Mask.setData(Selector.$('dataFesta'));

    $("#dataFesta").datepicker({
        dateFormat: "dd/mm/yy"
    });

    Mask.setHora(Selector.$('horario1'), false);
    Mask.setHora(Selector.$('horario2'), false);
    getTiposFestas(Selector.$('tipo'), "Selecione...", false);

    gridOpcionais = new Table('gridOpcionais');
    gridOpcionais.table.setAttribute('cellpadding', '3');
    gridOpcionais.table.setAttribute('cellspacing', '0');
    gridOpcionais.table.setAttribute('class', 'tabela_jujuba_comum');

    gridOpcionais.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Descrição'),
        DOM.newText('Valor'),
        DOM.newText('Qtde.'),
        DOM.newText('Total'),
        DOM.newText('Editar'),
        DOM.newText('Excluir'),
        DOM.newText('Situação'),
        DOM.newText('idOpcional'),
        DOM.newText('idDecoracao'),
        DOM.newText('idCardapioGrupo'),
        DOM.newText('idCardapioItem')
    ]);

    Selector.$('divOpcionais').appendChild(gridOpcionais.table);

    gridOpcionais.hiddenCol(8);
    gridOpcionais.hiddenCol(9);
    gridOpcionais.hiddenCol(10);
    gridOpcionais.hiddenCol(11);

    Mask.setMoeda(Selector.$('valor'));
    Mask.setMoeda(Selector.$('percentualDesconto'));
    Mask.setMoeda(Selector.$('valorDesconto'));
    Mask.setMoeda(Selector.$('valorAcrescimo'));

    Mask.setOnlyNumbers(Selector.$('qtdeAdultosPagantes'));
    Mask.setOnlyNumbers(Selector.$('qtdeAdultosNaoPagantes'));
    Mask.setOnlyNumbers(Selector.$('qtdeCriancasPagantes'));
    Mask.setOnlyNumbers(Selector.$('qtdeCriancasNaoPagantes'));

    MostrarContratos();

    gridLista = new Table('gridLista');
    gridLista.table.setAttribute('cellpadding', '3');
    gridLista.table.setAttribute('cellspacing', '0');
    gridLista.table.setAttribute('class', 'tabela_jujuba_comum');

    gridLista.addHeader([
        DOM.newText('N°'),
        DOM.newText('Tipo'),
        DOM.newText('Nome'),
        DOM.newText('RG'),
        DOM.newText('Idade'),
        DOM.newText('Classificação'),
        DOM.newText('Telefone'),
        DOM.newText('E-mail'),
        DOM.newText('Enviar'),
        DOM.newText('Imprimir'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    Selector.$('divLista').appendChild(gridLista.table);

    gridPagamento = new Table('gridPagamento');
    gridPagamento.table.setAttribute('cellpadding', '3');
    gridPagamento.table.setAttribute('cellspacing', '0');
    gridPagamento.table.setAttribute('class', 'tabela_jujuba_comum');

    gridPagamento.addHeader([
        DOM.newText('Parcela'),
        DOM.newText('Vencimento'),
        DOM.newText('Valor'),
        DOM.newText('Valor Pago'),
        DOM.newText('Forma Pgto.'),
        DOM.newText('Obs'),
        DOM.newText('Situação'),
        DOM.newText('Confirmar'),
        DOM.newText('Recibo'),
        DOM.newText('Editar'),
        DOM.newText('Excluir'),
        DOM.newText('idFormaPagamento'),
        DOM.newText('obs')
    ]);

    gridPagamento.hiddenCol(11);
    gridPagamento.hiddenCol(12);

    Selector.$('divPagamento').appendChild(gridPagamento.table);

    gridPendencias = new Table('gridPendencias');
    gridPendencias.table.setAttribute('cellpadding', '3');
    gridPendencias.table.setAttribute('cellspacing', '0');
    gridPendencias.table.setAttribute('class', 'tabela_jujuba_comum');

    gridPendencias.addHeader([
        DOM.newText('Descrição'),
        DOM.newText('Qtde. de Escolhas'),
        DOM.newText('Situação'),
        DOM.newText('Escolher')
    ]);

    Selector.$('divPendencias').appendChild(gridPendencias.table);

    gridFollowUp = new Table('gridFollowUp');
    gridFollowUp.table.setAttribute('cellpadding', '3');
    gridFollowUp.table.setAttribute('cellspacing', '0');
    gridFollowUp.table.setAttribute('class', 'tabela_jujuba_comum');

    gridFollowUp.addHeader([
        DOM.newText('Data Cadastro'),
        DOM.newText('Contato Tipo'),
        DOM.newText('Obs'),
        DOM.newText('Data Retorno'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    Selector.$('divFollowUp').appendChild(gridFollowUp.table);

    gridEmail = new Table('gridEmail');
    gridEmail.table.setAttribute('cellpadding', '3');
    gridEmail.table.setAttribute('cellspacing', '0');
    gridEmail.table.setAttribute('class', 'tabela_jujuba_comum');

    gridEmail.addHeader([
        DOM.newText('Data'),
        DOM.newText('De'),
        DOM.newText('Assunto'),
        DOM.newText('Anexos'),
        DOM.newText('Status'),
        DOM.newText('Prévia'),
        DOM.newText('Excluir')
    ]);

    gridEmail.hiddenCol(1);

    Selector.$('divEmails').appendChild(gridEmail.table);

    if ((Window.getParameter('idReserva') != null || Window.getParameter('idReserva') > '0') && (Window.getParameter('idContrato') != null || Window.getParameter('idContrato') > '0')) {
        getContrato(Window.getParameter('idReserva'), Window.getParameter('idContrato'));
    } else if (Window.getParameter('idReserva') != null || Window.getParameter('idReserva') > '0') {
        getContrato(Window.getParameter('idReserva'), 0);
    }

    if (Window.getParameter('c') > 0) {
        codigoAtual = Window.getParameter('c');
        getContrato(0, codigoAtual);
    } else if (Window.getParameter('c') == 0) {
        Novo(1);
    }

    if (Window.getParameter('aba') != null || Window.getParameter('aba') > '0') {
        SelecionaAbas(parseInt(Window.getParameter('aba')));

        if (Window.getParameter('source') == 'cadastro-de-cotacoes') {
            getContrato(0, Window.getParameter('idContrato'));
        }

        if (Window.getParameter('source') == 'relatorio-de-contas-a-receber') {
            getContrato(0, Window.getParameter('idContrato'));
            Selector.$('botVoltar').style.display = 'inherit';
        }
    }

    if (Window.getParameter('follow') !== null) {
        SelecionaAbas(5);
    }
};

function MostraEmails() {

    if (Selector.$('cliente').value <= 0)
        return;

    gridEmail.clearRows();
    Selector.$('qtdEmails').innerHTML = '';

    var ajax = new Ajax('POST', 'php/cadastro-de-clientes.php', true);
    var p = 'action=MostraEmailsContrato';
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&data=' + Selector.$('dataCotacao').value;
    p += '&festa=' + Selector.$('dataFesta').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );

        for (var i = 0; i < json.length; i++) {

            var ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Prévia Email');
            ver.setAttribute('class', 'efeito-opacidade-75-04');
            ver.setAttribute('onclick', 'AbrirEmail(' + json[i].codigo + ');');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'ExcluirEmail(' + json[i].codigo + ');');

            var email = DOM.newElement('img');
            email.setAttribute('src', 'imagens/' + (json[i].lido == "SIM" ? "lido" : "mensagem") + '.png');
            email.setAttribute('title', (json[i].lido == "SIM" ? "Lido" : "Não lido"));
            email.setAttribute('class', 'efeito-opacidade-75-04');
            email.setAttribute('onclick', 'AbrirEmail(' + json[i].codigo + ');');

            gridEmail.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].nome + " <" + json[i].email + ">"),
                DOM.newText(json[i].assunto),
                DOM.newText(json[i].anexos),
                email,
                ver,
                excluir
            ]);

            gridEmail.setRowData(gridEmail.getRowCount() - 1, json[i].codigo);
            gridEmail.getCell(gridEmail.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:100px;' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));
            gridEmail.getCell(gridEmail.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; width:auto;' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));
            gridEmail.getCell(gridEmail.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; width:auto;' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));
            gridEmail.getCell(gridEmail.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:40px' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));
            gridEmail.getCell(gridEmail.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:center; width:40px' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));
            gridEmail.getCell(gridEmail.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:center; width:40px' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));
            gridEmail.getCell(gridEmail.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:center; width:40px' + (json[i].lido == "SIM" ? '' : 'font-weight:bolder; color:#000'));

            gridEmail.hiddenCol(1);
        }

        pintaLinhaGrid(gridEmail);
        Selector.$('qtdEmails').innerHTML = i + ' email(s)';
    };

    ajax.Request(p);
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 6; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; width:100%; height:0px; padding:0px; overflow:hidden;');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px;  min-height:510px; width:100%; height:auto; padding:0px; overflow:hidden');
}

function Novo(aba) {

    checkPermissao(21, true);
    emEdicao(true);
    Limpar();
    avisoDecoracaoFesta = false;
    codigoAtual = 0;
    Selector.$('dataCotacao').focus();
    Selector.$('dataCotacao').value = Date.GetDate(false);
    Selector.$('situacaoCotacao').value = "A Realizar";
    Selector.$('btCancelarContrato').style.display = 'none';
    //Selector.$('divFesta').style.maxWidth = '315px';
    //Selector.$('divSituacao').style.maxWidth = '215px';
    Selector.$('situacaoCotacao').style.backgroundColor = '#F5F5F5';
    Selector.$('btGerarPdfContrato').style.display = 'none';
    Selector.$('btEnviarContratoEmail').style.display = 'none';
    Selector.$("botImprimir").setAttribute("onclick", "VerEditarCliente(false)");
    if (aba == 1) {
        Selector.$('aba0').style.display = 'none';
        Selector.$('div0').style.display = 'none';
        SelecionaAbas(1);
    } else {
        Selector.$('aba0').style.display = 'inline-block';
        Selector.$('div0').style.display = 'inline-block';
        SelecionaAbas(0);
    }
}

function Limpar() {

    Selector.$('divGridOpcionaisResumo').innerHTML = '';
    Selector.$('divGridPendenciasResumo').innerHTML = '';

    Selector.$('cliente').selectedIndex = 0;
    Selector.$('contatos').value = "";
    Selector.$('email').value = "";
    Selector.$('dataCotacao').value = "";
    Select.Clear(Selector.$('pacote'));
    Select.AddItem(Selector.$('pacote'), "Selecione um local", 0);
    Selector.$('local').selectedIndex = 0;
    Selector.$('decoracao').selectedIndex = 0;
    Selector.$('dataFesta').value = "";
    Selector.$('horario1').value = "";
    Selector.$('horario2').value = "";
    Selector.$('tipo').selectedIndex = 0;
    Selector.$('festa').value = "";
    Selector.$('nascimento').value = "";
    Selector.$('irmaos').value = "";
    Selector.$('mae').value = "";
    Selector.$('pai').value = "";
    Selector.$('situacaoCotacao').value = "";
    gridOpcionais.clearRows();
    Selector.$('valor').value = "";
    Selector.$('valorOpcionais').value = "";
    Selector.$('percentualDesconto').value = "";
    Selector.$('valorDesconto').value = "";
    Selector.$('valorAcrescimo').value = "";
    //Selector.$('motivoAcrescimo').value = "";
    Selector.$('valorTotal').value = "";
    Selector.$('valorPago').value = "";
    Selector.$('saldoPagar').value = "";
    Selector.$('obs').value = "";
    Selector.$('obsInterna').value = "";
    Selector.$('qtdOpcionais').innerHTML = "";

    Selector.$('qtdePagantes').value = "";
    Selector.$('qtdeNaoPagantes').value = "";
    Selector.$('avisoCodigoContrato').innerHTML = '';
    Selector.$('avisoCodigoCotacao').innerHTML = "";
    Selector.$('avisoDataFesta').innerHTML = "";

    Selector.$('irmaos_resumo').innerHTML = "";
    Selector.$('mae_resumo').innerHTML = "";
    Selector.$('pai_resumo').innerHTML = "";
    Selector.$('obs_resumo').innerHTML = "";
    Selector.$('obsinterna_resumo').innerHTML = "";
    Selector.$('aniversariante_resumo').innerHTML = "";

    gridLista.clearRows();
    Selector.$('qtdConvidados').innerHTML = "";
    Selector.$('qtdConvidadosPagantes').innerHTML = "";
    Selector.$('qtdConvidadosNaoPagantes').innerHTML = "";
    Selector.$('qtdeAdultosPagantes').value = 0;
    Selector.$('qtdeCriancasPagantes').value = 0;
    Selector.$('qtdeAdultosNaoPagantes').value = 0;
    Selector.$('qtdeCriancasNaoPagantes').value = 0;

    gridPagamento.clearRows();
    Selector.$('qtdParcelas').innerHTML = "";
    Selector.$('valorTotal2').value = "0,00";
    Selector.$('valorPago2').value = "0,00";
    Selector.$('saldoPagar2').value = "0,00";

    gridPendencias.clearRows();
    gridFollowUp.clearRows();
    gridEmail.clearRows();
}

function Cancelar() {

    if (Window.getParameter('idReserva') !== null || Window.getParameter('idReserva') > '0') {
        location.search = '';
    }
    emEdicao(false);
    Limpar();
    codigoAtual = 0;
    MostrarContratos();
}

function PromptPacoteComposicao() {

    if (Selector.$('pacote').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um pacote para ver a composição.", "OK", "", false, "pacote");
        mensagem.Show();
        return false;
    }

    if (!isElement('div', 'divPacoteComposicao')) {
        var div = DOM.newElement('div', 'divPacoteComposicao');
        document.body.appendChild(div);
    }

    var divPacoteComposicao = Selector.$('divPacoteComposicao');
    divPacoteComposicao.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPacoteComposicao.appendChild(divform);

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = "Composição do Pacote: " + Select.GetText(Selector.$('pacote'));
    lblTitulo.setAttribute("style", "text-align:center");

    var divComposicao = DOM.newElement('div', 'divComposicao');
    divComposicao.setAttribute('style', 'height:380px; overflow:auto');

    gridPacoteComposicao = new Table('gridPacoteComposicao');
    gridPacoteComposicao.table.setAttribute('cellpadding', '3');
    gridPacoteComposicao.table.setAttribute('cellspacing', '0');
    gridPacoteComposicao.table.setAttribute('class', 'tabela_jujuba_comum');

    gridPacoteComposicao.addHeader([
        DOM.newText('Grupo'),
        DOM.newText('Item')
    ]);

    //======== Tabela =========//
    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divComposicao);

    dialogoPacoteComposicao = new caixaDialogo('divPacoteComposicao', 500, 700, 'padrao/', 140);
    dialogoPacoteComposicao.Show();

    Selector.$('divComposicao').appendChild(gridPacoteComposicao.table);
    MostraPacoteComposicao(Selector.$('pacote').value);
}

function Voltar() {

    if (Window.getParameter('source') === 'relatorio-de-contas-a-receber') {
        window.location = "relatorio-de-contas-a-receber.html?return=1";
    }/* else if (Window.getParameter('source') === 'fornecedores') {
     window.location = "fornecedores.html?return=1&idFornecedor=" + Selector.$('fornecedor').value;
     }*/
}

function MostraPacoteComposicao(idPacote) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostraPacoteComposicao';
    p += '&idPacote=' + idPacote;
    p += '&idContrato=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var nomeGrupo = "";

        for (var i = 0; i < json.length; i++) {

            if (nomeGrupo != json[i].nomeGrupo) {
                nomeGrupo = json[i].nomeGrupo;

                gridPacoteComposicao.addRow([
                    DOM.newText(json[i].nomeGrupo),
                    DOM.newText('')
                ]);

                gridPacoteComposicao.getCell(gridPacoteComposicao.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:300px');
                gridPacoteComposicao.getCell(gridPacoteComposicao.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left;');
            }

            gridPacoteComposicao.addRow([
                DOM.newText(''),
                DOM.newText(json[i].nomeItem)
            ]);

            gridPacoteComposicao.getCell(gridPacoteComposicao.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:300px');
            gridPacoteComposicao.getCell(gridPacoteComposicao.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left;');
        }

        pintaLinhaGrid(gridPacoteComposicao);
    };

    ajax.Request(p);
}

function PromptAdicionarOpcional(codigo, linha) {

    if (cancelado || Selector.$('situacaoCotacao').value.trim() === 'Festa Cancelada' && linha == '-1') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Não é possível adicionar um opcional pois o contrato está cancelado", "OK", "", false, "");
        mensagem.Show();
        return;
    } else if (cancelado || Selector.$('situacaoCotacao').value.trim() === 'Festa Cancelada' && linha >= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Não é possível editar um opcional pois o contrato está cancelado", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'divAdicionarOpcional')) {
        var div = DOM.newElement('div', 'divAdicionarOpcional');
        document.body.appendChild(div);
    }

    var divAdicionarOpcional = Selector.$('divAdicionarOpcional');
    divAdicionarOpcional.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divAdicionarOpcional.appendChild(divform);

    var divTipos = DOM.newElement('div');
    divTipos.setAttribute('style', 'width:260px; margin:0 auto;');

    var chkOpcional = DOM.newElement('radio', 'chkOpcional');
    chkOpcional.setAttribute('name', 'tipo');
    chkOpcional.setAttribute('checked', 'checked');
    chkOpcional.setAttribute('onclick', 'SelecionaTipo(1, true, ' + linha + ', ' + codigo + ');');

    var lblOpcional = DOM.newElement('label');
    lblOpcional.innerHTML = "Opcional";
    lblOpcional.setAttribute("for", "chkOpcional");
    lblOpcional.setAttribute("style", "text-align:center");

    var chkDecoracao = DOM.newElement('radio', 'chkDecoracao');
    chkDecoracao.setAttribute('name', 'tipo');
    chkDecoracao.setAttribute('style', 'margin-left:10px;');
    chkDecoracao.setAttribute('onclick', 'SelecionaTipo(2, true, ' + linha + ', ' + codigo + ');');

    var lblDecoracao = DOM.newElement('label');
    lblDecoracao.innerHTML = "Decoração";
    lblDecoracao.setAttribute("for", "chkDecoracao");
    lblDecoracao.setAttribute("style", "text-align:center");

    var chkItemCardapio = DOM.newElement('radio', 'chkItemCardapio');
    chkItemCardapio.setAttribute('name', 'tipo');
    chkItemCardapio.setAttribute('style', 'margin-left:10px;');
    chkItemCardapio.setAttribute('onclick', 'SelecionaTipo(3, true, ' + linha + ', ' + codigo + ');');

    var lblItemCardapio = DOM.newElement('label');
    lblItemCardapio.innerHTML = "Item Cardápio";
    lblItemCardapio.setAttribute("for", "chkItemCardapio");
    lblItemCardapio.setAttribute("style", "text-align:center");

    var cmbTipo = DOM.newElement('select', 'tipoOpcional');
    cmbTipo.setAttribute('class', 'combo_cinzafoco');
    cmbTipo.setAttribute('style', 'width:100%;');
    cmbTipo.setAttribute('onchange', 'getInfoTipoOpcional();');

    var lblValor = DOM.newElement('label');
    lblValor.innerHTML = "Valor";

    var txtValor = DOM.newElement('text', 'valorOpcional');
    txtValor.setAttribute('class', 'textbox_cinzafoco');
    txtValor.setAttribute('style', 'width:100px;');
    txtValor.setAttribute('onblur', 'CalculaValorTotalOpcional();');

    var lblTipoValor = DOM.newElement('label', 'lblTipoValor');
    lblTipoValor.innerHTML = "Valor Unitário";
    lblTipoValor.setAttribute('style', 'margin-left:10px; display:none;');

    var lblQtde = DOM.newElement('label', 'lblQtde');
    lblQtde.innerHTML = "Qtde.";
    lblQtde.setAttribute('style', 'margin-left:85px;');

    var txtQtde = DOM.newElement('number', 'qtdeOpcional');
    txtQtde.setAttribute('class', 'textbox_cinzafoco');
    txtQtde.setAttribute('style', 'width:70px; margin-left:10px;');
    txtQtde.setAttribute('min', '1');
    txtQtde.setAttribute('onchange', 'CalculaValorTotalOpcional();');

    var lblValorTotal = DOM.newElement('label');
    lblValorTotal.innerHTML = "Valor Total";
    lblValorTotal.setAttribute('style', 'margin-left:50px;');

    var txtValorTotal = DOM.newElement('text', 'valorTotalOpcional');
    txtValorTotal.setAttribute('class', 'textbox_cinzafoco');
    txtValorTotal.setAttribute('readonly', 'readonly');
    txtValorTotal.setAttribute('style', 'width:140px; margin-left:10px; background-color:#F5F5F5');

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'AdicionarOpcional(' + codigo + ', ' + linha + ')');
    cmdTexto1.innerHTML = "Adicionar";

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoAdicionarOpcional.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    //======== Tabela =========//
    divTipos.appendChild(chkOpcional);
    divTipos.appendChild(lblOpcional);
    divTipos.appendChild(chkDecoracao);
    divTipos.appendChild(lblDecoracao);
    divTipos.appendChild(chkItemCardapio);
    divTipos.appendChild(lblItemCardapio);
    divform.appendChild(divTipos);
    divform.innerHTML += '<br>';
    divform.appendChild(cmbTipo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblValor);
    divform.appendChild(lblQtde);
    divform.appendChild(lblValorTotal);
    divform.innerHTML += '<br>';
    divform.appendChild(txtValor);
    divform.appendChild(lblTipoValor);
    divform.appendChild(txtQtde);
    divform.appendChild(txtValorTotal);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoAdicionarOpcional = new caixaDialogo('divAdicionarOpcional', 235, 520, 'padrao/', 140);
    dialogoAdicionarOpcional.Show();

    Mask.setMoeda(Selector.$('valorOpcional'));
    Mask.setOnlyNumbers(Selector.$('qtdeOpcional'));

    avisoDecoracaoFesta = false;

    if (codigo <= 0 && linha === -1) {
        getOpcionais(Selector.$('tipoOpcional'), "Selecione um opcional", Selector.$('local').value, true);
        Selector.$('qtdeOpcional').value = 1;
    }

    if (codigo > 0 || linha >= 0) {
        Selector.$('gravar').innerHTML = "Gravar";
    }

    if (linha >= 0) {

        if (gridOpcionais.getCellText(linha, 0) === 'Opcional') {
            Selector.$('chkOpcional').checked = true;
            SelecionaTipo(1, false, linha, codigo);
        } else if (gridOpcionais.getCellText(linha, 0) === 'Decoração') {
            Selector.$('chkDecoracao').checked = true;
            SelecionaTipo(2, false, linha, codigo);
        } else {
            Selector.$('chkItemCardapio').checked = true;
            SelecionaTipo(3, false, linha, codigo);
        }

        if (gridOpcionais.getCellText(linha, 0).trim() === 'Item Cardápio' || gridOpcionais.getCellText(linha, 0).trim() === 'Ítem Cardápio') {
            Select.ShowText(Selector.$('tipoOpcional'), gridOpcionais.getCellObject(linha, 1).innerHTML.split("ÍTEM:")[1].trim());
        } else {
            Select.ShowText(Selector.$('tipoOpcional'), gridOpcionais.getCellObject(linha, 1).childNodes[0].innerHTML.trim());
        }

        getInfoTipoOpcional();
        Selector.$('valorOpcional').value = gridOpcionais.getCellText(linha, 2);
        Selector.$('qtdeOpcional').value = gridOpcionais.getCellText(linha, 3);
        Selector.$('valorTotalOpcional').value = gridOpcionais.getCellText(linha, 4);
    }
}

function SelecionaTipo(tipo, assincrono, linha, codigo) {

    var idLocal = Selector.$('local').value;
    var select = Selector.$('tipoOpcional');

    switch (tipo) {

        case 1:
            getOpcionais(select, "Selecione um opcional", idLocal, assincrono);
            select.setAttribute('onchange', 'getInfoTipoOpcional();');
            break;
        case 2:
            //getDecoracoes(select, "Selecione...", assincrono);
            getDecoracoesShowingDisponibilidade(select, 'Selecione uma decoração', assincrono);
            //select.setAttribute('onchange', 'getInfoTipoOpcional();VerificaDecoracaoContrato(Selector.$("tipoOpcional").value, ' + linha + ', ' + codigo + ');');
            select.setAttribute('onchange', 'getInfoTipoOpcional();');
            break;
        case 3:
            //getItensCardapio(Selector.$('tipoOpcional'), "Selecione um ítem", assincrono);
            getItensCardapioGrupos(select, "Selecione um ítem", assincrono);
            select.setAttribute('onchange', 'getInfoTipoOpcional();');
            break;
    }
}

function getInfoTipoOpcional() {

    //var ajax = new Ajax('POST', 'php/cadastro-de-cotacoes.php', false);
    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=getInfoTipoOpcional';

    var tipo;

    if (Selector.$('chkOpcional').checked) {
        tipo = 1;
        p += '&tipo=' + tipo;
    } else if (Selector.$('chkDecoracao').checked) {
        tipo = 2;
        p += '&tipo=' + tipo;
    } else {
        tipo = 3;
        p += '&tipo=' + tipo;
    }

    p += '&idTipo=' + Selector.$('tipoOpcional').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        Selector.$('lblTipoValor').style.display = 'inline-block';
        Selector.$('lblTipoValor').innerHTML = json.tipoValor;
        Selector.$('valorOpcional').value = json.valor;

        if (tipo === 1) {
            Selector.$('lblQtde').style.marginLeft = '177px';
        } else if (tipo === 2) {
            Selector.$('lblQtde').style.marginLeft = '95px';
        }

        if (tipo === 3) {
            Selector.$('valorOpcional').value = '';
            Selector.$('valorOpcional').focus();
            Selector.$('lblTipoValor').style.display = 'none';
            Selector.$('lblTipoValor').innerHTML = '';
            Selector.$('lblQtde').style.marginLeft = '90px';
            idCardapioGrupo = json.idCardapioGrupo;
        }

        if (Selector.$('valorOpcional').value.trim() !== '' || Selector.$('valorOpcional').value.trim() !== ',') {
            CalculaValorTotalOpcional();
        }
    };

    ajax.Request(p);
}

function CalculaValorTotalOpcional() {

    var valor = Number.parseFloat(Selector.$('valorOpcional').value);
    var qtd = parseInt(Selector.$('qtdeOpcional').value);
    var valorTotal = (valor * qtd);

    Selector.$('valorTotalOpcional').value = Number.FormatMoeda(valorTotal.toFixed(2));
}

function getValorPacote() {

    //var ajax = new Ajax('POST', 'php/cadastro-de-cotacoes.php', false);
    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=getValorPacote';
    p += '&idPacote=' + Selector.$('pacote').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );

        Selector.$('valor').value = json.valorPacote;
        Selector.$('qtdePagantes').value = json.qtdPagantes;
        Selector.$('qtdeNaoPagantes').value = json.qtdNaoPagantes;
        Selector.$('qtdePagantes').setAttribute('min', json.qtdPagantes);
        Selector.$('qtdeNaoPagantes').setAttribute('min', json.qtdNaoPagantes);
        duracaoFesta = json.duracaoFesta;
        qtdePagantes = json.qtdPagantes;
        qtdeNaoPagantes = json.qtdNaoPagantes;
        valorAdicionalAntesFesta = json.valorAdicionalAntesFesta;
        valorAdicionalDiaFesta = json.valorAdicionalDiaFesta;
        CalcularValorAdicionalPagantes();
        CalcularValorTotal();
    };

    ajax.Request(p);
}

function AdicionarOpcional(codigo, linha) {

    if (Selector.$('chkOpcional').checked) {

        if (Selector.$('tipoOpcional').selectedIndex <= 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um opcional.", "OK", "", false, "tipoOpcional");
            mensagem.Show();
            return false;
        }
    }

    if (Selector.$('chkDecoracao').checked) {

        if (Selector.$('tipoOpcional').selectedIndex <= 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione uma decoração.", "OK", "", false, "tipoOpcional");
            mensagem.Show();
            return false;
        }

        if (avisoDecoracaoFesta == false && (!VerificaDecoracaoContrato(Selector.$('tipoOpcional').value, linha, codigo)))
            return false;
    }

    if (Selector.$('chkItemCardapio').checked) {

        if (Selector.$('tipoOpcional').selectedIndex <= 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um item.", "OK", "", false, "tipoOpcional");
            mensagem.Show();
            return false;
        }
    }

    if (Selector.$('valorOpcional').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor.", "OK", "", false, "valorOpcional");
        mensagem.Show();
        return false;
    }

    if (Selector.$('qtdeOpcional').value.trim() === '' || Selector.$('qtdeOpcional').value.trim() === '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a quantidade.", "OK", "", false, "qtdeOpcional");
        mensagem.Show();
        return false;
    }

    for (var i = 0; i < gridOpcionais.getRowCount(); i++) {

        if (Select.GetText(Selector.$('tipoOpcional')) === gridOpcionais.getCellText(i, 1) && linha === -1) {

            if (Selector.$('chkOpcional').checked) {
                MostrarMsg('Este opcional já foi adicionado.', 'tipoOpcional');
            } else if (Selector.$('chkOpcional').checked) {
                MostrarMsg('Esta decoração já foi adicionada.', 'tipoOpcional');
            } else {
                MostrarMsg('Este ítem já foi adicionado.', 'tipoOpcional');
            }

            return;
        }
    }

    var editar = DOM.newElement('img');
    editar.setAttribute('src', 'imagens/edit.png');
    editar.setAttribute('title', 'Editar');
    editar.setAttribute('class', 'efeito-opacidade-75-04');
    editar.setAttribute('onclick', 'PromptAdicionarOpcional(' + codigo + ', ' + gridOpcionais.getRowCount() + ')');

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/ativar.png');
    excluir.setAttribute('title', 'Excluir');
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('onclick', 'ExcluirOpcionalAux(' + codigo + ', ' + gridOpcionais.getRowCount() + ')');
    
    var tipo = "";
    var idOpcional = 0;
    var idDecoracao = 0;
    var idCardapioItem = 0;
    //var itemCardapio = "";
    var itemCardapio = DOM.newElement('span');

    if (Selector.$('chkOpcional').checked) {
        tipo = "Opcional";
        idOpcional = Selector.$('tipoOpcional').value;
    } else if (Selector.$('chkDecoracao').checked) {
        tipo = "Decoração";
        idDecoracao = Selector.$('tipoOpcional').value;
    } else {
        tipo = "Ítem Cardápio";
        idCardapioItem = Selector.$('tipoOpcional').value;
    }

    if (tipo === 'Ítem Cardápio') {

        itemCardapio.innerHTML = "GRUPO: " + Selector.$('tipoOpcional').options[Selector.$('tipoOpcional').selectedIndex].id + " - ÍTEM: " + Select.GetText(Selector.$('tipoOpcional'));
    } else {

        var divItemCardapio = DOM.newElement('div');

        itemCardapio.innerHTML = Select.GetText(Selector.$('tipoOpcional'));

        divItemCardapio.appendChild(itemCardapio);
    }

    if (linha >= 0) {

        editar.setAttribute('onclick', 'PromptAdicionarOpcional(' + codigo + ', ' + linha + ')');
        excluir.setAttribute('onclick', 'ExcluirOpcional(' + codigo + ', ' + linha + ')');

        gridOpcionais.setCellText(linha, 0, tipo);
        gridOpcionais.setCellText(linha, 1, (tipo === 'Ítem Cardápio' ? itemCardapio : divItemCardapio));
        gridOpcionais.setCellText(linha, 2, Selector.$('valorOpcional').value);
        gridOpcionais.setCellText(linha, 3, Selector.$('qtdeOpcional').value);
        gridOpcionais.setCellText(linha, 4, Selector.$('valorTotalOpcional').value);
        gridOpcionais.setCellObject(linha, 5, editar);
        gridOpcionais.setCellObject(linha, 6, excluir);
        
        if(gridOpcionais.getCellObject(linha, 7).nodeName == 'LABEL') {
            
            var situacao = DOM.newElement('label');        
            situacao.innerHTML = gridOpcionais.getCellObject(0, 7).innerHTML;
           
            gridOpcionais.setCellObject(linha, 7, situacao);
        }
        
        gridOpcionais.setCellText(linha, 8, idOpcional);
        gridOpcionais.setCellText(linha, 9, idDecoracao);
        gridOpcionais.setCellText(linha, 10, idCardapioGrupo);
        gridOpcionais.setCellText(linha, 11, idCardapioItem);
    } else {
        
        var situacao = DOM.newElement('label');        
        situacao.innerHTML = "Aprovado";
        
        gridOpcionais.addRow([
            DOM.newText(tipo),
            //DOM.newText(itemCardapio),
            (tipo === 'Ítem Cardápio' ? itemCardapio : divItemCardapio),
            DOM.newText(Selector.$('valorOpcional').value),
            DOM.newText(Selector.$('qtdeOpcional').value),
            DOM.newText(Selector.$('valorTotalOpcional').value),
            editar,
            excluir,
            situacao,
            DOM.newText(idOpcional),
            DOM.newText(idDecoracao),
            DOM.newText(idCardapioGrupo),
            DOM.newText(idCardapioItem)
        ]);

        gridOpcionais.setRowData(gridOpcionais.getRowCount(), 0);

        for (var j = 0; j <= gridOpcionais.getRowCount() - 1; j++) {

            gridOpcionais.getCell(j, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridOpcionais.getCell(i, 1).setAttribute('style', 'border:none; text-align:left;');
            gridOpcionais.getCell(i, 2).setAttribute('style', 'border:none; text-align:right; width:150px;');
            gridOpcionais.getCell(i, 3).setAttribute('style', 'border:none; text-align:center; width:70px;');
            gridOpcionais.getCell(i, 4).setAttribute('style', 'border:none; text-align:right; width:150px;');
            gridOpcionais.getCell(i, 5).setAttribute('style', 'border:none; text-align:center; width:30px;');
            gridOpcionais.getCell(i, 6).setAttribute('style', 'border:none; text-align:center; width:30px;');
            gridOpcionais.getCell(i, 7).setAttribute('style', 'border:none; text-align:center;');
        }
    }

    gridOpcionais.hiddenCol(8);
    gridOpcionais.hiddenCol(9);
    gridOpcionais.hiddenCol(10);
    gridOpcionais.hiddenCol(11);

    pintaLinhaGrid(gridOpcionais);

    if (codigo > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=EditarOpcional';
        p += '&idOpcional=' + codigo;

        if (Selector.$('chkOpcional').checked) {
            p += '&idTipoOpcional=' + Selector.$('tipoOpcional').value;
            p += '&idDecoracao=0';
            p += '&idCardapioItem=0';
        } else if (Selector.$('chkDecoracao').checked) {
            p += '&idTipoOpcional=0';
            p += '&idDecoracao=' + Selector.$('tipoOpcional').value;
            p += '&idCardapioItem=0';
        } else {
            p += '&idTipoOpcional=0';
            p += '&idDecoracao=0';
            p += '&idCardapioItem=' + Selector.$('tipoOpcional').value;
        }

        p += '&valor=' + Selector.$('valorOpcional').value;
        p += '&qtd=' + Selector.$('qtdeOpcional').value;
        p += '&valorTotal=' + Selector.$('valorTotalOpcional').value;
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }
    }

    if (gridOpcionais.getRowCount() == 1)
        Selector.$('qtdOpcionais').innerHTML = " (" + gridOpcionais.getRowCount() + " opcional adicionado)";
    else
        Selector.$('qtdOpcionais').innerHTML = " (" + gridOpcionais.getRowCount() + " opcionais adicionados)";
    
    var valorTotal = 0;
    for (var i = 0; i < gridOpcionais.getRowCount(); i++) {
        if(gridOpcionais.getCellObject(i, 7).nodeName == 'LABEL') {
            if (gridOpcionais.getCellObject(i, 7).innerHTML == "Aprovado")
                valorTotal += Number.getFloat(gridOpcionais.getCellText(i, 4).toString().replace('.', ''));
        }
    }

    Selector.$('valorOpcionais').value = Number.FormatMoeda(valorTotal.toFixed(2));
    var valor = Number.parseFloat(Selector.$('valor').value);
    var valorOpcionais = Number.parseFloat(Selector.$('valorOpcionais').value);
    var valorTotal = (valor + valorOpcionais);
    Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    CalcularValorTotal();
    dialogoAdicionarOpcional.Close();
}

function ExcluirOpcionalAux(idOpcional, linha) {

    if (cancelado || Selector.$('situacaoCotacao').value.trim() == 'Festa Cancelada') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Não é possível excluir um opcional pois o contrato está cancelado", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    mensagemExcluirItem = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este opcional?", "OK", "ExcluirOpcional(" + idOpcional + ", " + linha + ");", true, "");
    mensagemExcluirItem.Show();
}

function ExcluirOpcional(idOpcional, linha) {

    mensagemExcluirItem.Close();
    gridOpcionais.deleteRow(linha);

    for (var i = 0; i < gridOpcionais.getRowCount(); i++) {

        gridOpcionais.getCellObject(i, 5).setAttribute('onclick', 'PromptAdicionarOpcional(' + gridOpcionais.getRowData(i) + ', ' + i + ')');
        gridOpcionais.getCellObject(i, 6).setAttribute('onclick', 'ExcluirOpcionalAux(' + gridOpcionais.getRowData(i) + ', ' + i + ')');
    }

    if (idOpcional > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=ExcluirOpcional';
        p += '&idOpcional=' + idOpcional;
        ajax.Request(p);
    }

    if (gridOpcionais.getRowCount() == 1)
        Selector.$('qtdOpcionais').innerHTML = " (" + gridOpcionais.getRowCount() + " opcional adicionado)";
    else
        Selector.$('qtdOpcionais').innerHTML = " (" + gridOpcionais.getRowCount() + " opcionais adicionados)";
    
    var valorTotal = 0;
    for (var i = 0; i < gridOpcionais.getRowCount(); i++) {
        if(gridOpcionais.getCellObject(i, 7).nodeName == 'LABEL') {
            if (gridOpcionais.getCellObject(i, 7).innerHTML == "Aprovado")
                valorTotal += Number.getFloat(gridOpcionais.getCellText(i, 4).toString().replace('.', ''));
        }
    }

    Selector.$('valorOpcionais').value = Number.FormatMoeda(valorTotal.toFixed(2));
    var valor = Number.parseFloat(Selector.$('valor').value);
    var valorOpcionais = Number.parseFloat(Selector.$('valorOpcionais').value);
    var valorTotal = (valor + valorOpcionais);
    Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    CalcularValorTotal();
}

function CalcularValorTotal() {

    var valor = Number.parseFloat(Selector.$('valor').value);
    var valorOpcionais = Number.parseFloat(Selector.$('valorOpcionais').value);
    var valorAdicPagantes = Number.parseFloat(Selector.$('valorAdicionalPagantes').value);
    var subtotal = (valor + valorOpcionais + valorAdicPagantes);
    var valorAcrescimo = Number.parseFloat(Selector.$('valorAcrescimo').value);
    var valorDesconto = 0;
    var valorTotal = 0;
    var valorTotalPagar = 0;

    Selector.$('percentualDesconto').onblur = function () {

        if (Selector.$('percentualDesconto').value.trim() === ',' || Selector.$('percentualDesconto').value.trim() === '' || Selector.$('percentualDesconto').value.trim() === '0') {
            Selector.$('percentualDesconto').value = '0';
            Selector.$('valorDesconto').value = '0,00';
        }

        if (Selector.$('percentualDesconto').value > 100 || Selector.$('percentualDesconto').value > 100, 00) {
            Selector.$('percentualDesconto').value = '100';
        }

        Selector.$('valorDesconto').value = '';
        valorDesconto = ((subtotal * Number.parseFloat(Selector.$('percentualDesconto').value)) / 100);
        Selector.$('valorDesconto').value = Number.FormatDinheiro(valorDesconto);

        valorTotal = ((subtotal + valorAcrescimo) - Number.parseFloat(Selector.$('valorDesconto').value));
        Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    }

    Selector.$('valorDesconto').onblur = function () {

        if (Selector.$('valorDesconto').value.trim() === ',' || Selector.$('valorDesconto').value.trim() === '' || Selector.$('valorDesconto').value.trim() === '0') {
            Selector.$('valorDesconto').value = '0,00';
            Selector.$('percentualDesconto').value = '0';
        }

        if (Number.parseFloat(Selector.$('valorDesconto').value) > valor) {
            MostrarMsg("O valor de desconto não pode ser maior que o valor do contrato.", 'valorDesconto');
            return;
        }

        valorDesconto = (Number.ValorE(Selector.$('valorDesconto').value) * 100) / subtotal;
        Selector.$('percentualDesconto').value = Number.FormatMoeda(valorDesconto.toFixed(2));

        valorTotal = ((subtotal + valorAcrescimo) - Number.parseFloat(Selector.$('valorDesconto').value));
        Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    }

    valorTotal = ((subtotal + valorAcrescimo) - Number.parseFloat(Selector.$('valorDesconto').value));
    Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
    valorTotalPagar = (Number.parseFloat(Selector.$('valorTotal').value) - Number.parseFloat(Selector.$('valorPago').value) < 0 ? 0.00 : Number.parseFloat(Selector.$('valorTotal').value) - Number.parseFloat(Selector.$('valorPago').value));
    Selector.$('saldoPagar').value = Number.FormatMoeda(valorTotalPagar.toFixed(2));
    Selector.$('valorTotal2').value = Selector.$('valorTotal').value;
    Selector.$('valorPago2').value = Selector.$('valorPago').value;
    Selector.$('saldoPagar2').value = Selector.$('saldoPagar').value;
}

function ValidarCampos() {

    if (Selector.$('cliente').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um cliente.", "OK", "", false, "cliente");
        mensagem.Show();
        return false;
    }

    if (Selector.$('dataCotacao').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a data do contrato.", "OK", "", false, "dataCotacao");
        mensagem.Show();
        return false;
    }

    if (Selector.$('local').value <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um local.", "OK", "", false, "local");
        mensagem.Show();
        return false;
    }

    if (Selector.$('pacote').value <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um pacote.", "OK", "", false, "pacote");
        mensagem.Show();
        return false;
    }

    if (Selector.$('qtdePagantes').value.trim() === '' || Selector.$('qtdePagantes').value.trim() == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a quantidade de pagantes.", "OK", "", false, "qtdePagantes");
        mensagem.Show();
        return false;
    }

    if (Selector.$('dataFesta').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a data da festa.", "OK", "", false, "dataFesta");
        mensagem.Show();
        return false;
    }

    if (Selector.$('horario1').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o horário de início da festa.", "OK", "", false, "horario1");
        mensagem.Show();
        return false;
    }

    if (Selector.$('horario2').value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o horário do fim da festa.", "OK", "", false, "horario2");
        mensagem.Show();
        return false;
    }

    if (Selector.$('horario1').value.split(":")[0] > Selector.$('horario2').value.split(":")[0]) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe um horário correto.", "OK", "", false, "horario1");
        mensagem.Show();
        return false;
    }

    if (Selector.$('horario1').value.split(":")[0] == Selector.$('horario2').value.split(":")[0]) {
        if (Selector.$('horario1').value.split(":")[1] > Selector.$('horario2').value.split(":")[1]) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe um horário correto.", "OK", "", false, "horario1");
            mensagem.Show();
            return false;
        }
    }

    if (codigoAtual <= 0) {

        if (VerificaDataCotacao(true) == '1' || VerificaDataCotacao(true) == '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Já existe uma festa com essa data e neste período.", "OK", "", false, "dataFesta");
            mensagem.Show();
            return false;
        }

        if (VerificaDataCotacao(true) == '2' || VerificaDataCotacao(true) == '-2') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Já existe uma festa entre o período de 2hs.", "OK", "", false, "horario1");
            mensagem.Show();
            return false;
        }
    }

    if (Selector.$('tipo').selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o tipo de festa.", "OK", "", false, "tipo");
        mensagem.Show();
        return false;
    }

    if (Selector.$('valor').value.trim() == ',' || Selector.$('valor').value.trim() == '0,00' || Selector.$('valor').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "O valor não pode ser 0,00. Por favor, informe outro valor.", "OK", "", false, "festa");
        mensagem.Show();
        return false;
    }

    return true;
}

function GravarAux() {

    checkPermissao(21, true);

    if (!ValidarCampos()) {
        return false;
    }

    if (Selector.$('qtdeNaoPagantes').value.trim() == '') {
        Selector.$('qtdeNaoPagantes').value = 0;
    }

    if (Selector.$('qtdeAdultosPagantes').value.trim() == '') {
        Selector.$('qtdeAdultosPagantes').value = 0;
    }

    if (Selector.$('qtdeCriancasPagantes').value.trim() == '') {
        Selector.$('qtdeCriancasPagantes').value = 0;
    }

    if (Selector.$('qtdeAdultosNaoPagantes').value.trim() == '') {
        Selector.$('qtdeAdultosNaoPagantes').value = 0;
    }

    if (Selector.$('qtdeCriancasNaoPagantes').value.trim() == '') {
        Selector.$('qtdeCriancasNaoPagantes').value = 0;
    }

    qtdAlteracoes = 0;

    if (codigoAtual > 0) {

        var mensagem = '<strong>Informações Alteradas:</strong><br><br>';

        if (Selector.$('cliente').value != Selector.$('cliente').name) {
            mensagem += '<strong>Cliente:</strong> ' + Select.GetText(Selector.$('cliente')) + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('dataCotacao').value != Selector.$('dataCotacao').name) {
            mensagem += '<strong>Data Contrato:</strong> ' + Selector.$('dataCotacao').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('local').value != Selector.$('local').name) {
            mensagem += '<strong>Local:</strong> ' + Select.GetText(Selector.$('local')) + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('pacote').value != Selector.$('pacote').name) {
            mensagem += '<strong>Pacote:</strong> ' + Select.GetText(Selector.$('pacote')) + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('qtdePagantes').value != Selector.$('qtdePagantes').name) {
            mensagem += '<strong>Qtde. Pagantes:</strong> ' + Selector.$('qtdePagantes').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('qtdeNaoPagantes').value != Selector.$('qtdeNaoPagantes').name) {
            mensagem += '<strong>Qtde. Não Pagantes:</strong> ' + Selector.$('qtdeNaoPagantes').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('qtdeAdultosPagantes').value != Selector.$('qtdeAdultosPagantes').name) {
            mensagem += '<strong>Adultos Pagantes:</strong> ' + Selector.$('qtdeAdultosPagantes').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('qtdeCriancasPagantes').value != Selector.$('qtdeCriancasPagantes').name) {
            mensagem += '<strong>Crianças Pagantes:</strong> ' + Selector.$('qtdeCriancasPagantes').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('qtdeAdultosNaoPagantes').value != Selector.$('qtdeAdultosNaoPagantes').name) {
            mensagem += '<strong>Adultos Não Pagantes:</strong> ' + Selector.$('qtdeAdultosNaoPagantes').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('qtdeCriancasNaoPagantes').value != Selector.$('qtdeCriancasNaoPagantes').name) {
            mensagem += '<strong>Crianças Não Pagantes:</strong> ' + Selector.$('qtdeCriancasNaoPagantes').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('dataFesta').value != Selector.$('dataFesta').name) {
            mensagem += '<strong>Data Festa:</strong> ' + Selector.$('dataFesta').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('horario1').value != Selector.$('horario1').name) {
            mensagem += '<strong>Horário De:</strong> ' + Selector.$('horario1').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('horario2').value != Selector.$('horario2').name) {
            mensagem += '<strong>Horário Até:</strong> ' + Selector.$('horario2').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('decoracao').value != Selector.$('decoracao').name) {
            if (Selector.$('decoracao').value == 0) {
                mensagem += '<strong>Decoração:</strong> Nenhuma<br>';
            } else {
                mensagem += '<strong>Decoração:</strong> ' + Select.GetText(Selector.$('decoracao')) + '<br>';
            }
            qtdAlteracoes++;
        }

        if (Selector.$('tipo').value != Selector.$('tipo').name) {
            mensagem += '<strong>Tipo:</strong> ' + Select.GetText(Selector.$('tipo')) + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('festa').value != Selector.$('festa').name) {
            mensagem += '<strong>Evento:</strong> ' + Selector.$('festa').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('mae').value != Selector.$('mae').name && Selector.$('mae').value != '') {
            mensagem += '<strong>Mãe:</strong> ' + Selector.$('mae').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('pai').value != Selector.$('pai').name && Selector.$('pai').value != '') {
            mensagem += '<strong>Pai:</strong> ' + Selector.$('pai').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('irmaos').value != Selector.$('irmaos').name && Selector.$('irmaos').value != '') {
            mensagem += '<strong>Irmãos:</strong> ' + Selector.$('irmaos').value + '<br>';
            qtdAlteracoes++;
        }

        if (gridOpcionais.getRowCount() > qtdOpcionaisAdicionados) {
            mensagem += '<strong>Opcionais acrescentados:</strong> ' + (parseInt(gridOpcionais.getRowCount() - parseInt(qtdOpcionaisAdicionados))) + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('valor').value != Selector.$('valor').name) {
            mensagem += '<strong>Valor:</strong> R$' + Selector.$('valor').value + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('percentualDesconto').value != Selector.$('percentualDesconto').name) {
            mensagem += '<strong>Percentual Desconto:</strong> ' + (Selector.$('percentualDesconto').value.trim() == '' || Selector.$('percentualDesconto').value.trim() == ',' ? '0,00%' : (Selector.$('percentualDesconto').value) + "%") + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('valorDesconto').value != Selector.$('valorDesconto').name) {
            mensagem += '<strong>Valor Desconto:</strong> R$' + (Selector.$('valorDesconto').value.trim() == '' || Selector.$('valorDesconto').value.trim() == ',' ? '0,00' : Selector.$('valorDesconto').value) + '<br>';
            qtdAlteracoes++;
        }

        if (Selector.$('valorAcrescimo').value != Selector.$('valorAcrescimo').name) {
            mensagem += '<strong>Valor Acréscimo:</strong> R$' + (Selector.$('valorAcrescimo').value.trim() == '' || Selector.$('valorAcrescimo').value.trim() == ',' ? '0,00' : Selector.$('valorAcrescimo').value) + '<br>';
            qtdAlteracoes++;
        }

        mensagem += '<br>Deseja realmente alterar essas informações?';

        if (qtdAlteracoes > 0) {

            mensagemAlterarInformacoes = new DialogoMensagens("prompt", 500, 450, 150, "4", "", mensagem, "OK", "Gravar();", true, "");
            mensagemAlterarInformacoes.Show();

            var scrollX, scrollY;
            if (document.all) {
                if (!document.documentElement.scrollLeft)
                    scrollX = document.body.scrollLeft;
                else
                    scrollX = document.documentElement.scrollLeft;

                if (!document.documentElement.scrollTop)
                    scrollY = document.body.scrollTop;
                else
                    scrollY = document.documentElement.scrollTop;
            } else {
                scrollX = window.pageXOffset;
                scrollY = window.pageYOffset;
            }

            Selector.$('prompt').style.height = 'auto';
            Selector.$('prompt').style.maxHeight = '640px';
            Selector.$('prompt').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (Selector.$('prompt').clientHeight / 2)) - 0) + 'px';
        } else {

            Gravar();
        }
    } else {

        var mensagem = '<strong>Informações Cadastradas:</strong><br><br>';
        mensagem += '<strong>Cliente:</strong> ' + Select.GetText(Selector.$('cliente')) + ' <strong> - Contatos:</strong> ' + Selector.$('contatos').value + ' <strong> - E-mail:</strong> ' + Selector.$('email').value;
        mensagem += '<br><strong>Data Contrato:</strong> ' + Selector.$('dataCotacao').value;
        mensagem += '<br><strong>Local:</strong> ' + Select.GetText(Selector.$('local'));
        mensagem += '<br><strong>Pacote:</strong> ' + Select.GetText(Selector.$('pacote'));
        mensagem += '<br><strong>Qtde. Pagantes:</strong> ' + Selector.$('qtdePagantes').value + '(' + Selector.$('qtdeAdultosPagantes').value + ' adultos e ' + Selector.$('qtdeCriancasPagantes').value + ' crianças)';
        mensagem += '<br><strong>Qtde. Não Pagantes:</strong> ' + Selector.$('qtdeNaoPagantes').value + '(' + Selector.$('qtdeAdultosNaoPagantes').value + ' adultos e ' + Selector.$('qtdeCriancasNaoPagantes').value + ' crianças)';
        mensagem += '<br><strong>Data Festa:</strong> ' + Selector.$('dataFesta').value;
        mensagem += '<strong> Horário:</strong> Das ' + Selector.$('horario1').value + ' às ' + Selector.$('horario2').value + 'h';
        mensagem += '<br><strong>Decoração:</strong> ' + (Selector.$('decoracao').value == '0' ? 'Nenhuma' : Select.GetText(Selector.$('decoracao')));
        mensagem += '<br><strong>Tipo:</strong> ' + Select.GetText(Selector.$('tipo'));
        mensagem += '<br><strong>Evento:</strong> ' + Selector.$('festa').value;
        (Selector.$('mae').value != '' ? mensagem += '<br><strong>Mãe:</strong> ' + Selector.$('mae').value : '');
        (Selector.$('pai').value != '' ? mensagem += '<br><strong>Pai:</strong> ' + Selector.$('pai').value : '');
        (Selector.$('irmaos').value != '' ? mensagem += '<br><strong>Irmãos:</strong> ' + Selector.$('irmaos').value : '');
        mensagem += '<br><strong>Qtde. Opcionais:</strong> ' + gridOpcionais.getRowCount();
        mensagem += '<br><strong>Valor:</strong> R$' + Selector.$('valor').value;
        mensagem += '<br><strong>Valor Adicional Pagantes:</strong> R$' + Selector.$('valorAdicionalPagantes').value;
        mensagem += '<br><strong>Valor Opcionais:</strong> R$' + Selector.$('valorOpcionais').value;
        mensagem += '<br><strong>Perc. Desconto:</strong> ' + (Selector.$('percentualDesconto').value.trim() == ',' || Selector.$('percentualDesconto').value.trim() == '' ? '0,00%' : Selector.$('percentualDesconto').value + '%');
        mensagem += '<strong> - Valor Desconto:</strong> R$' + (Selector.$('valorDesconto').value.trim() == ',' || Selector.$('valorDesconto').value.trim() == '' ? '0,00' : Selector.$('valorDesconto').value);
        mensagem += '<br><strong>Valor Acréscimo:</strong> R$' + (Selector.$('valorAcrescimo').value.trim() == ',' || Selector.$('valorAcrescimo').value.trim() == '' ? '0,00' : Selector.$('valorAcrescimo').value);
        mensagem += '<br><strong>Valor Total:</strong> R$' + Selector.$('valorTotal').value;
        mensagem += '<br><br>Deseja realmente cadastrar essas informações?';

        mensagemInformacoesCadastradas = new DialogoMensagens("prompt", 500, 650, 150, "4", "", mensagem, "OK", "Gravar();", true, "");
        mensagemInformacoesCadastradas.Show();

        var scrollX, scrollY;
        if (document.all) {
            if (!document.documentElement.scrollLeft)
                scrollX = document.body.scrollLeft;
            else
                scrollX = document.documentElement.scrollLeft;

            if (!document.documentElement.scrollTop)
                scrollY = document.body.scrollTop;
            else
                scrollY = document.documentElement.scrollTop;
        } else {
            scrollX = window.pageXOffset;
            scrollY = window.pageYOffset;
        }

        Selector.$('prompt').style.height = 'auto';
        Selector.$('prompt').style.maxHeight = '640px';
        Selector.$('prompt').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (Selector.$('prompt').clientHeight / 2)) - 0) + 'px';
    }
}

function Gravar() {

    if (qtdAlteracoes > 0) {
        mensagemAlterarInformacoes.Close();
    } else {

        if (codigoAtual <= 0) {
            mensagemInformacoesCadastradas.Close();
        }
    }

    if (cancelado || Selector.$('situacaoCotacao').value.trim() == 'Festa Cancelada') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Não é possível realizar nenhuma alteração, pois a festa está cancelada", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!ValidarCampos()) {
        return false;
    }

    if (Selector.$('avisoDataFesta').innerHTML != '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Já existe uma festa para a data.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (Selector.$('contatos').name == '') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Cliente sem CPF/CNPJ, por favor, edite ele e preencha o campo de CPF/CNPJ.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=Gravar';
    p += '&idCotacao=' + Window.getParameter('idReserva');
    p += '&idContrato=' + codigoAtual;
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&contatoCliente=' + Selector.$('contatos').value;
    p += '&emailCliente=' + Selector.$('email').value;
    p += '&dataCotacao=' + Selector.$('dataCotacao').value;
    p += '&idLocal=' + Selector.$('local').value;
    p += '&idPacote=' + Selector.$('pacote').value;
    p += '&qtdePagantes=' + Selector.$('qtdePagantes').value;
    p += '&qtdeNaoPagantes=' + Selector.$('qtdeNaoPagantes').value;
    p += '&idDecoracao=' + Selector.$('decoracao').value;
    p += '&dataFesta=' + Selector.$('dataFesta').value;
    p += '&horarioDe=' + Selector.$('horario1').value;
    p += '&horarioAte=' + Selector.$('horario2').value;
    p += '&idTipoFesta=' + Selector.$('tipo').value;
    p += '&nomeFesta=' + Selector.$('festa').value;
    p += '&nomeIrmaos=' + Selector.$('irmaos').value;
    p += '&nomeMae=' + Selector.$('mae').value;
    p += '&nomePai=' + Selector.$('pai').value;
    p += '&valor=' + Selector.$('valor').value;
    p += '&valorAdicionalPagantes=' + Selector.$('valorAdicionalPagantes').value;
    p += '&valorOpcionais=' + Selector.$('valorOpcionais').value;
    p += '&percentualDesconto=' + Selector.$('percentualDesconto').value;
    p += '&valorDesconto=' + Selector.$('valorDesconto').value;
    p += '&valorAcrescimo=' + Selector.$('valorAcrescimo').value;
    p += '&valorTotal=' + Selector.$('valorTotal').value;
    p += '&obs=' + Selector.$('obs').value;
    p += '&obsInterna=' + Selector.$('obsInterna').value;
    p += '&nascimento=' + Selector.$('nascimento').value;
    p += '&idade=' + getIdadeAniversariante(Selector.$('nascimento').value, Selector.$('dataFesta').value);
    //Manda do dados da grid opcionais
    p += '&qtdLinhas=' + gridOpcionais.getRowCount();
    p += '&rowDatas=' + gridOpcionais.getRowsData();
    p += '&idOpcionais=' + gridOpcionais.getContentRows(8);
    p += '&idDecoracoes=' + gridOpcionais.getContentRows(9);
    p += '&idCardapiosGrupos=' + gridOpcionais.getContentRows(10);
    p += '&idCardapiosItens=' + gridOpcionais.getContentRows(11);
    p += '&valores=' + gridOpcionais.getContentMoneyRows(2);
    p += '&qtds=' + gridOpcionais.getContentRows(3);
    p += '&total=' + gridOpcionais.getContentMoneyRows(4);
    p += '&qtdeAdultosPagantes=' + Selector.$('qtdeAdultosPagantes').value;
    p += '&qtdeAdultosNaoPagantes=' + Selector.$('qtdeAdultosNaoPagantes').value;
    p += '&qtdeCriancasPagantes=' + Selector.$('qtdeCriancasPagantes').value;
    p += '&qtdeCriancasNaoPagantes=' + Selector.$('qtdeCriancasNaoPagantes').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o contrato. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {

            codigoAtual = ajax.getResponseText();

            GravarParcelas();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Operação efetuada com sucesso!", "OK", "", false, "");
            mensagem.Show();      
            var reserva = 0;
            if (Window.getParameter('idReserva') !== null || Window.getParameter('idReserva') > '0') {
                reserva = Window.getParameter('idReserva');
            }
            
            getContrato(reserva, codigoAtual);
        }
    };

    ajax.Request(p);
}

function MostrarContratos() {

    gridContratos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostrarContratos';
    p += '&busca=' + Selector.$('busca').value;
    p += '&situacao=' + Selector.$('situacao').value;
    p += '&situacao2=' + Selector.$('situacaoQuitadas').value;
    p += '&limite=' + !Selector.$('mostrarTudo').checked;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            Selector.$('relatoriotabela').style.display = "none";
            Selector.$('msgContratos').style.display = "block";
            Selector.$('qtdContratos').innerHTML = "";
            return;
        }

        Selector.$('relatoriotabela').style.display = "block";
        Selector.$('msgContratos').style.display = "none";

        var json = JSON.parse(ajax.getResponseText()  );
        var ver;
        var valorOpcionais;
        var pendencia;

        for (var i = 0; i < json.length; i++) {

            if (json[i].pendencia !== '') {
                pendencia = DOM.newElement('img');
                pendencia.setAttribute('src', 'imagens/exclamation.png');
                pendencia.setAttribute('title', 'Pendente');
                pendencia.setAttribute('style', 'width:15px');
                pendencia.setAttribute('class', 'efeito-opacidade-75-04');
            } else {
                pendencia = DOM.newText('');
            }

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Contrato');
            ver.setAttribute('style', 'width:15px');
            ver.setAttribute('class', 'efeito-opacidade-75-04');
            ver.setAttribute('onclick', 'getContrato(0, ' + json[i].idContrato + ');');

            valorOpcionais = DOM.newElement('label');

            if (json[i].arrayOpcionais !== '0') {

                valorOpcionais.setAttribute('title', 'Clique para ver a lista de opcionais');
                valorOpcionais.setAttribute('style', 'text-decoration:underline; cursor:pointer');
                valorOpcionais.setAttribute('onclick', "PromptOpcionais('" + json[i].arrayOpcionais + "');");
            }

            valorOpcionais.innerHTML = json[i].valorOpcionais;

            gridContratos.addRow([
                pendencia,
                DOM.newText(json[i].razaoSocial),
                DOM.newText(json[i].dataFesta),
                DOM.newText(json[i].nomeLocal),
                DOM.newText(json[i].nomePacote),
                DOM.newText(json[i].nomeDecoracao),
                DOM.newText(json[i].contrato),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].situacao),
                DOM.newText(json[i].valor),
                valorOpcionais,
                DOM.newText(json[i].valorDesconto),
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].tipoFesta),
                DOM.newText(json[i].tituloFesta),
                ver
            ]);

            gridContratos.setRowData(gridContratos.getRowCount() - 1, json[i].idContrato);
            gridContratos.getCell(gridContratos.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:10px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left;  ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:left;  ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left;  ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:left;  ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 9).setAttribute('style', 'border:none; text-align:right; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 10).setAttribute('style', 'border:none; text-align:right; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 11).setAttribute('style', 'border:none; text-align:right; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 12).setAttribute('style', 'border:none; text-align:right; width:100px;');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 13).setAttribute('style', 'border:none; text-align:left ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 14).setAttribute('style', 'border:none; text-align:left;  ');
            gridContratos.getCell(gridContratos.getRowCount() - 1, 15).setAttribute('style', 'border:none; text-align:center; width:30px;');

            if (json[i].situacao == 'Festa Cancelada') {
                gridContratos.getCell(gridContratos.getRowCount() - 1, 8).setAttribute('style', 'border:none; color:red; text-align:left; ');
            }
        }

        pintaLinhaGrid(gridContratos);

        if (gridContratos.getRowCount() > 0) {
            Selector.$('qtdContratos').innerHTML = (!Selector.$('mostrarTudo').checked && json.length >= 50 ? "últimos " : "") + json.length + " contrato" + (json.length <= 1 ? "" : "s");
        }
    };

    ajax.Request(p);
}

function PromptOpcionais(array) {

    if (!isElement('div', 'divOpcionais2')) {
        var div = DOM.newElement('div', 'divOpcionais2');
        document.body.appendChild(div);
    }

    var divOpcionais = Selector.$('divOpcionais2');
    divOpcionais.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divOpcionais.appendChild(divform);

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = "Opcionais";
    lblTitulo.setAttribute("style", "text-align:center");

    var divListaOpcionais = DOM.newElement('div', 'divListaOpcionais');
    divListaOpcionais.setAttribute('style', 'height:380px; overflow:auto');

    gridListaOpcionais = new Table('gridListaOpcionais');
    gridListaOpcionais.table.setAttribute('cellpadding', '3');
    gridListaOpcionais.table.setAttribute('cellspacing', '0');
    gridListaOpcionais.table.setAttribute('class', 'tabela_jujuba_comum');

    gridListaOpcionais.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Descrição'),
        DOM.newText('Valor'),
        DOM.newText('Qtde.'),
        DOM.newText('Total')
    ]);

    //======== Tabela =========//
    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divListaOpcionais);

    dialogoOpcionais = new caixaDialogo('divOpcionais2', 500, 700, 'padrao/', 140);
    dialogoOpcionais.Show();

    Selector.$('divListaOpcionais').appendChild(gridListaOpcionais.table);

    gridListaOpcionais.clearRows();

    if (array == '0')
        return;

    var json = JSON.parse(array  );

    for (var i = 0; i < json.length; i++) {

        gridListaOpcionais.addRow([
            DOM.newText(json[i].tipo),
            DOM.newText(json[i].tipoOpcional),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].valorTotal)
        ]);

        gridListaOpcionais.getCell(i, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
        gridListaOpcionais.getCell(i, 1).setAttribute('style', 'border:none; text-align:left; width:250px;');
        gridListaOpcionais.getCell(i, 2).setAttribute('style', 'border:none; text-align:right; width:100px;');
        gridListaOpcionais.getCell(i, 3).setAttribute('style', 'border:none; text-align:center; width:70px;');
        gridListaOpcionais.getCell(i, 4).setAttribute('style', 'border:none; text-align:right; width:100px;');
    }

    pintaLinhaGrid(gridListaOpcionais);
}

function getContrato(idCotacao, idContrato) {

    Novo((idContrato > 0 ? 0 : 1));

    Selector.$('divGridOpcionaisResumo').innerHTML = '';
    Selector.$('divGridPendenciasResumo').innerHTML = '';

    if (idContrato > 0) {
        Selector.$('avisoCodigoContrato').style.display = 'inline-block';
        Selector.$('avisoCodigoCotacao').style.display = 'inline-block';
        codigoAtual = idContrato;
    } else {
        Selector.$('avisoCodigoContrato').style.display = 'none';
        Selector.$('avisoCodigoCotacao').style.display = 'none';
        codigoAtual = 0;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=getContrato';
    p += '&idCotacao=' + idCotacao;
    p += '&idContrato=' + idContrato;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );

        Selector.$('btGerarPdfContrato').style.display = 'inline-block';
        Selector.$('btGerarPdfContrato').style.marginLeft = '15px';
        Selector.$('btEnviarContratoEmail').style.display = 'inline-block';

        if (json.codigoContrato == '0') {
            Selector.$('avisoCodigoContrato').innerHTML = '';
        } else {
            Selector.$('avisoCodigoContrato').innerHTML = 'Contrato: ' + json.codigoContrato;
        }

        if (json.codigoCotacao == '0') {
            Selector.$('avisoCodigoCotacao').innerHTML = "";
        } else {
            Selector.$('avisoCodigoCotacao').innerHTML = "(Gerado por reserva " + json.codigoCotacao + ")";
            Selector.$('avisoCodigoCotacao').setAttribute('href', 'cadastro-de-reservas.html?source=cadastro-de-contratos&aba=0&idReserva=' + json.idCotacao);
        }

        if (json.codigoCotacao > 0) {
            Selector.$('pacote').disabled = false;
        } else {
            Selector.$('pacote').disabled = false;
        }

        Selector.$("botImprimir").setAttribute("onclick", "VerEditarCliente(false)");
        Selector.$('nascimento').value = json.nascimento;

        Selector.$('cliente').value = json.idCliente;
        Selector.$('cliente').name = json.idCliente;
        getInfoCliente();
        Selector.$('dataCotacao').value = json.dataCotacao;
        Selector.$('dataCotacao').name = json.dataCotacao;
        Selector.$('local').value = json.idLocal;
        Selector.$('local').name = json.idLocal;
        getPacotes(Selector.$('pacote'), 'Selecione um pacote', false, Selector.$('local').value);
        Selector.$('pacote').value = json.idPacote;
        Selector.$('pacote').name = json.idPacote;
        getValorPacote();
        Selector.$('decoracao').value = json.idDecoracao;
        Selector.$('decoracao').name = json.idDecoracao;
        Selector.$('dataFesta').value = json.dataFesta;
        Selector.$('dataFesta').name = json.dataFesta;
        Selector.$('horario1').value = json.horaDe;
        Selector.$('horario1').name = json.horaDe;
        Selector.$('horario2').value = json.horaAte;
        Selector.$('horario2').name = json.horaAte;
        Selector.$('tipo').value = json.idTipoFesta;
        Selector.$('tipo').name = json.idTipoFesta;
        Selector.$('festa').value = json.tituloFesta;
        Selector.$('festa').name = json.tituloFesta;

        Selector.$('mae').value = json.nomeMae;
        Selector.$('mae').name = json.nomeMae;
        Selector.$('pai').value = json.nomePai;
        Selector.$('pai').name = json.nomePai;
        Selector.$('irmaos').value = json.irmaos;
        Selector.$('irmaos').name = json.irmaos;
        Selector.$('irmaos_resumo').innerHTML = json.irmaos;

        Selector.$('aniversariante_resumo').innerHTML = json.tituloFesta + (json.nascimento != '' ? " (" + getIdadeAniversariante(json.nascimento, json.dataFesta) + ")" : '');
        Selector.$('obs_resumo').value = json.obs;
        Selector.$('obsinterna_resumo').innerHTML = json.obsInterna;
        Selector.$('situacaoCotacao').value = json.situacao;
        Selector.$('qtdePagantes').value = json.qtdePagantes;
        Selector.$('qtdePagantes').name = json.qtdePagantes;
        Selector.$('qtdeNaoPagantes').value = json.qtdeNaoPagantes;
        Selector.$('qtdeNaoPagantes').name = json.qtdeNaoPagantes;

        Selector.$('qtdeAdultosPagantes').value = json.qtdeAdultosPagantes;
        Selector.$('qtdeAdultosPagantes').name = json.qtdeAdultosPagantes;
        Selector.$('qtdeCriancasPagantes').value = json.qtdeCriancasPagantes;
        Selector.$('qtdeCriancasPagantes').name = json.qtdeCriancasPagantes;
        Selector.$('qtdeAdultosNaoPagantes').value = json.qtdeAdultosNaoPagantes;
        Selector.$('qtdeAdultosNaoPagantes').name = json.qtdeAdultosNaoPagantes;
        Selector.$('qtdeCriancasNaoPagantes').value = json.qtdeCriancasNaoPagantes;
        Selector.$('qtdeCriancasNaoPagantes').name = json.qtdeCriancasNaoPagantes;
        Selector.$('valorAdicionalPagantes').value = json.valorAdicionalPagantes;

        if (json.cancelado === '1') {
            Selector.$('btCancelarContrato').style.display = 'none';
            Selector.$('situacaoCotacao').style.backgroundColor = '#F08080';
        } else {
            Selector.$('btCancelarContrato').style.display = 'inline-block';
            Selector.$('situacaoCotacao').style.backgroundColor = '#F5F5F5';
        }

        Selector.$('divGridOpcionaisResumo').innerHTML = '';

        gridOpcionaisResumo = new Table('gridOpcionaisResumo');
        gridOpcionaisResumo.table.setAttribute('cellpadding', '0');
        gridOpcionaisResumo.table.setAttribute('cellspacing', '0');
        gridOpcionaisResumo.table.setAttribute('class', 'tabela_jujuba_comum');

        gridOpcionaisResumo.addHeader([
            DOM.newText('Tipo'),
            DOM.newText('Descrição'),
            DOM.newText('Valor'),
            DOM.newText('Qtd'),
            DOM.newText('Total'),
            DOM.newText('Situação')
        ]);

        gridOpcionaisResumo.getHeadCell(0).setAttribute('style', 'padding: 1px; text-align:center');
        gridOpcionaisResumo.getHeadCell(1).setAttribute('style', 'padding: 1px; text-align:center');
        gridOpcionaisResumo.getHeadCell(2).setAttribute('style', 'padding: 1px; text-align:center');
        gridOpcionaisResumo.getHeadCell(3).setAttribute('style', 'padding: 1px; text-align:center');
        gridOpcionaisResumo.getHeadCell(4).setAttribute('style', 'padding: 1px; text-align:center');
        gridOpcionaisResumo.getHeadCell(5).setAttribute('style', 'padding: 1px; text-align:center');

        Selector.$('divGridOpcionaisResumo').appendChild(gridOpcionaisResumo.table);

        if (json.arrayOpcionais !== '0') {

            var jsonArray = JSON.parse(json.arrayOpcionais  );
            gridOpcionais.clearRows();

            for (var i = 0; i < jsonArray.length; i++) {

                var editar = DOM.newElement('img');
                editar.setAttribute('src', 'imagens/edit.png');
                editar.setAttribute('title', 'Editar');
                editar.setAttribute('class', 'efeito-opacidade-75-04');
                editar.setAttribute('onclick', 'PromptAdicionarOpcional(' + jsonArray[i].idContratoComp + ', ' + gridOpcionais.getRowCount() + ')');

                var excluir = DOM.newElement('img');
                excluir.setAttribute('src', 'imagens/ativar.png');
                excluir.setAttribute('title', 'Excluir');
                excluir.setAttribute('class', 'efeito-opacidade-75-04');
                excluir.setAttribute('onclick', 'ExcluirOpcionalAux(' + jsonArray[i].idContratoComp + ', ' + gridOpcionais.getRowCount() + ')');
                
                var situacao = DOM.newElement('div');
                
                if(jsonArray[i].situacao == "Pendente") {

                    var aprovar = DOM.newElement('img');
                    aprovar.setAttribute('src', 'imagens/validar.png');
                    aprovar.setAttribute('title', 'Aprovado');
                    aprovar.setAttribute('style', 'width:15px; display:inline-block');
                    aprovar.setAttribute('class', 'efeito-opacidade-75-04');
                    aprovar.setAttribute('onclick', 'AprovarOpcional(1, ' + jsonArray[i].idContratoComp + ', ' + gridOpcionais.getRowCount() + ')');

                    var reprovar = DOM.newElement('img');
                    reprovar.setAttribute('src', 'imagens/cancelar.png');
                    reprovar.setAttribute('title', 'Reprovado');
                    reprovar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
                    reprovar.setAttribute('class', 'efeito-opacidade-75-04');
                    reprovar.setAttribute('onclick', 'AprovarOpcional(2, ' + jsonArray[i].idContratoComp + ', ' + gridOpcionais.getRowCount() + ')');
                    
                    situacao.appendChild(aprovar);
                    situacao.appendChild(reprovar);
                } else if(jsonArray[i].situacao == "Aprovado") {
                    var situacao = DOM.newElement('label');
                    situacao.innerHTML = jsonArray[i].situacao;
                } else {
                    var situacao = DOM.newElement('label');
                    situacao.innerHTML = jsonArray[i].situacao;
                }

                var opcional = DOM.newElement('span');

                if(jsonArray[i].tipo == 'Opcional'){

                    var divOpcional = DOM.newElement('div');

                    var ok = DOM.newElement('span');
                    ok.setAttribute('title', (jsonArray[i].ok == '1' ? 'Clique aqui para marcar como Pendente' : 'Clique aqui para marcar como OK'));
                    ok.setAttribute('onclick', 'PromptObsOpcionalOk(' + jsonArray[i].idContratoComp + ', ' + (jsonArray[i].ok == '1' ? '0' : '1') + ', "' + jsonArray[i].obsOk + '");');
                    ok.innerHTML = (jsonArray[i].externo == '1' ? (jsonArray[i].ok == '1' ? '(OK)' : '(Pendente)') : '');
                    ok.setAttribute('style', 'text-decoration:underline');
                    
                    opcional.innerHTML = jsonArray[i].tipoOpcional + ' ';

                    divOpcional.appendChild(opcional);
                    divOpcional.appendChild(ok);
                }else{
                    opcional.innerHTML = jsonArray[i].tipoOpcional;
                }
                
                gridOpcionais.addRow([
                    DOM.newText(jsonArray[i].tipo),
                    (jsonArray[i].tipo == 'Opcional' ? divOpcional : opcional),
                    DOM.newText(jsonArray[i].valor),
                    DOM.newText(jsonArray[i].qtd),
                    DOM.newText(jsonArray[i].valorTotal),
                    editar,
                    excluir,
                    situacao,
                    DOM.newText(jsonArray[i].idOpcional),
                    DOM.newText(jsonArray[i].idDecoracao),
                    DOM.newText(jsonArray[i].idCardapioGrupo),
                    DOM.newText(jsonArray[i].idCardapioItem)
                ]);

                gridOpcionais.hiddenCol(8);
                gridOpcionais.hiddenCol(9);
                gridOpcionais.hiddenCol(10);
                gridOpcionais.hiddenCol(11);

                if (idContrato > '0') {
                    gridOpcionais.setRowData(gridOpcionais.getRowCount() - 1, jsonArray[i].idContratoComp);
                } else if (idCotacao > '0') {
                    gridOpcionais.setRowData(gridOpcionais.getRowCount() - 1, 0);
                }

                gridOpcionais.getCell(i, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
                gridOpcionais.getCell(i, 1).setAttribute('style', 'border:none; text-align:left;');
                gridOpcionais.getCell(i, 2).setAttribute('style', 'border:none; text-align:right; width:150px;');
                gridOpcionais.getCell(i, 3).setAttribute('style', 'border:none; text-align:center; width:70px;');
                gridOpcionais.getCell(i, 4).setAttribute('style', 'border:none; text-align:right; width:150px;');
                gridOpcionais.getCell(i, 5).setAttribute('style', 'border:none; text-align:center; width:30px;');
                gridOpcionais.getCell(i, 6).setAttribute('style', 'border:none; text-align:center; width:30px;');
                gridOpcionais.getCell(i, 7).setAttribute('style', 'border:none; text-align:center;');
                
                var situacao2 = DOM.newElement("span");
            
                if (jsonArray[i].situacao == 'Pendente')
                    situacao2.setAttribute('style', 'color:red;');

                situacao2.innerHTML = jsonArray[i].situacao;

                var opcional2 = DOM.newElement('span');

                if(jsonArray[i].tipo == 'Opcional'){

                    var divOpcional2 = DOM.newElement('div');

                    var ok2 = DOM.newElement('span');
                    ok2.setAttribute('title', (jsonArray[i].ok == '1' ? 'Clique aqui para marcar como Pendente' : 'Clique aqui para marcar como OK'));
                    ok2.setAttribute('onclick', 'PromptObsOpcionalOk(' + jsonArray[i].idContratoComp + ', ' + (jsonArray[i].ok == '1' ? '0' : '1') + ', "' + jsonArray[i].obsOk + '");');
                    ok2.innerHTML = (jsonArray[i].externo == '1' ? (jsonArray[i].ok == '1' ? '(OK)' : '(Pendente)') : '');
                    ok2.setAttribute('style', 'text-decoration:underline');
                    
                    opcional2.innerHTML = jsonArray[i].tipoOpcional + ' ';

                    divOpcional2.appendChild(opcional2);
                    divOpcional2.appendChild(ok2);
                }else{
                    opcional2.innerHTML = jsonArray[i].tipoOpcional;
                }

                gridOpcionaisResumo.addRow([
                    DOM.newText(jsonArray[i].tipo),
                    (jsonArray[i].tipo == 'Opcional' ? divOpcional2 : opcional2),
                    DOM.newText(jsonArray[i].valor),
                    DOM.newText(jsonArray[i].qtd),
                    DOM.newText(jsonArray[i].valorTotal),
                    situacao2
                ]);

                gridOpcionaisResumo.getCell(i, 0).setAttribute('style', 'border:none; padding-left:3px; padding-right:3px; text-align:left; width:100px;');
                gridOpcionaisResumo.getCell(i, 1).setAttribute('style', 'border:none; padding-left:3px; padding-right:3px; text-align:left;');
                gridOpcionaisResumo.getCell(i, 2).setAttribute('style', 'border:none; padding-left:3px; padding-right:3px; text-align:right; width:60px;');
                gridOpcionaisResumo.getCell(i, 3).setAttribute('style', 'border:none; padding-left:3px; padding-right:3px; text-align:center; width:40px;');
                gridOpcionaisResumo.getCell(i, 4).setAttribute('style', 'border:none; padding-left:3px; padding-right:3px; text-align:right; width:60px;');
                gridOpcionaisResumo.getCell(i, 5).setAttribute('style', 'border:none; padding-left:3px; padding-right:3px; text-align:left; width:80px;');
            }

            pintaLinhaGrid(gridOpcionais);
            pintaLinhaGrid(gridOpcionaisResumo);
            qtdOpcionaisAdicionados = gridOpcionais.getRowCount();
        }

        if (gridOpcionais.getRowCount() == 1)
            Selector.$('qtdOpcionais').innerHTML = " (" + gridOpcionais.getRowCount() + " opcional adicionado)";
        else
            Selector.$('qtdOpcionais').innerHTML = " (" + gridOpcionais.getRowCount() + " opcionais adicionados)";

        Selector.$('valor').value = json.valor;
        Selector.$('valor').name = json.valor;
        Selector.$('valorOpcionais').value = json.valorOpcionais;
        Selector.$('percentualDesconto').value = json.percDesconto;
        Selector.$('percentualDesconto').name = json.percDesconto;
        Selector.$('valorDesconto').value = json.valorDesconto;
        Selector.$('valorDesconto').name = json.valorDesconto;
        Selector.$('valorAcrescimo').value = json.valorAcrescimo;
        Selector.$('valorAcrescimo').name = json.valorAcrescimo;
        Selector.$('valorTotal').value = json.valorTotal;
        Selector.$('valorPago').value = json.valorPago;

        if (idContrato > '0') {
            Selector.$('saldoPagar').value = json.saldoPagar;
        } else if (idCotacao > '0') {
            Selector.$('saldoPagar').value = Selector.$('valorTotal').value;
        }

        Selector.$('obs').value = json.obs;
        Selector.$('obs').name = json.obs;

        Selector.$('obsInterna').value = json.obsInterna;
        Selector.$('obsInterna').name = json.obsInterna;

        Selector.$('valorTotal2').value = Selector.$('valorTotal').value;
        Selector.$('valorPago2').value = Selector.$('valorPago').value;
        Selector.$('saldoPagar2').value = Selector.$('saldoPagar').value;

        //ESSA GRID É PREENCHIDA NA FUNÇÃO MostrarPendenciasContratoDetalhado().
        gridPendenciasResumo = new Table('gridPendenciasResumo');
        gridPendenciasResumo.table.setAttribute('cellpadding', '0');
        gridPendenciasResumo.table.setAttribute('cellspacing', '0');
        gridPendenciasResumo.table.setAttribute('class', 'tabela_jujuba_comum');

        gridPendenciasResumo.addHeader([
            DOM.newText('Descrição'),
            DOM.newText('Qtde'),
            DOM.newText('Situação')
        ]);

        gridPendenciasResumo.getHeadCell(0).setAttribute('style', 'padding: 1px;  padding-right:3px; text-align:center');
        gridPendenciasResumo.getHeadCell(1).setAttribute('style', 'padding: 1px;  padding-right:3px; text-align:center');
        gridPendenciasResumo.getHeadCell(2).setAttribute('style', 'padding: 1px;  padding-right:3px; text-align:center');

        Selector.$('divGridPendenciasResumo').appendChild(gridPendenciasResumo.table);

        MostrarListaConvidados();
        MostrarParcelas();
        MostrarPendenciasContratoDetalhado();
        MostrarFollowUp();
        MostraEmails();

        //RESUMO
        Selector.$('cliente_resumo').innerHTML = Select.GetText(Selector.$('cliente'));
        Selector.$('contatos_resumo').innerHTML = json.contatoCliente;
        Selector.$('local_resumo').innerHTML = Select.GetText(Selector.$('local'));
        Selector.$('pacote_resumo').innerHTML = Select.GetText(Selector.$('pacote'));

        var pagantes = "";
        if(Selector.$('qtdeAdultosPagantes').value > '0'){

            pagantes = (Selector.$('qtdeAdultosPagantes').value == '1' ? Selector.$('qtdeAdultosPagantes').value + " adulto" : Selector.$('qtdeAdultosPagantes').value +" adultos");

            if(Selector.$('qtdeCriancasPagantes').value > '0'){

                pagantes += " e " + (Selector.$('qtdeCriancasPagantes').value == '1' ? Selector.$('qtdeCriancasPagantes').value + " criança" : Selector.$('qtdeCriancasPagantes').value + " crianças");
            }
        }else if(Selector.$('qtdeCriancasPagantes').value > '0'){

            pagantes = (Selector.$('qtdeCriancasPagantes').value == '1' ? Selector.$('qtdeCriancasPagantes').value + " criança" : Selector.$('qtdeCriancasPagantes').value + " crianças");
        }else{
            pagantes = "";
        }

        var naopagantes = "";
        if(Selector.$('qtdeAdultosNaoPagantes').value > '0'){

            naopagantes = (Selector.$('qtdeAdultosNaoPagantes').value == '1' ? Selector.$('qtdeAdultosNaoPagantes').value + " adulto" : Selector.$('qtdeAdultosNaoPagantes').value + " adultos");

            if(Selector.$('qtdeCriancasNaoPagantes').value > '0'){

                naopagantes += " e " + (Selector.$('qtdeCriancasNaoPagantes').value == '1' ? Selector.$('qtdeCriancasNaoPagantes').value + " criança" : Selector.$('qtdeCriancasNaoPagantes').value + " crianças");
            }
        }else if(Selector.$('qtdeCriancasNaoPagantes').value > '0'){

            naopagantes = (Selector.$('qtdeCriancasNaoPagantes').value == '1' ? Selector.$('qtdeCriancasNaoPagantes').value + " criança" : Selector.$('qtdeCriancasNaoPagantes').value + " crianças");
        }else{
            naopagantes = "";
        }

        Selector.$('qtdePagantes_resumo').innerHTML = Selector.$('qtdePagantes').value + (pagantes != '' ? ' (' + pagantes + ')' : '');
        Selector.$('qtdeNaoPagantes_resumo').innerHTML = Selector.$('qtdeNaoPagantes').value + (naopagantes != '' ? ' (' + naopagantes + ')' : '');
        Selector.$('data_resumo').innerHTML = "<b>" + json.dataFesta + " (" + getDiaSemanaCompleto(json.diasemana) + ")</b>";
        Selector.$('horario_resumo').innerHTML = 'Das ' + json.horaDe + ' às ' + json.horaAte + 'h';
        Selector.$('decoracao_resumo').innerHTML = (json.idDecoracao == '0' ? 'Escolher' : Select.GetText(Selector.$('decoracao')));
        Selector.$('valor_resumo').innerHTML = json.valor;
        Selector.$('valorAdicionalPagantes_resumo').innerHTML = json.valorAdicionalPagantes;
        Selector.$('valorOpcionais_resumo').innerHTML = json.valorOpcionais;
        Selector.$('valorDesconto_resumo').innerHTML = "- " + json.valorDesconto; //+ ' (' + json.percDesconto + '%)';
        Selector.$('valorAcrescimo_resumo').innerHTML = json.valorAcrescimo;
        Selector.$('valorTotal_resumo').innerHTML = json.valorTotal;
        Selector.$('valorPago_resumo').innerHTML = json.valorPago;
        Selector.$('saldoPagar_resumo').innerHTML = json.saldoPagar;

        if (parseFloat(json.saldoPagar) > 0) {
            Selector.$('saldoPagar_resumo').style.color = "red";
        } else {
            Selector.$('saldoPagar_resumo').style.color = "";
        }

        idadeAniversariante();
    };

    ajax.Request(p);
}

function PromptObsOpcionalOk(idContratoComp, ok, obs){

    if (!isElement('div', 'divPromptObsOpcionalOk')) {
        var div = DOM.newElement('div', 'divPromptObsOpcionalOk');
        document.body.appendChild(div);
    }

    var divPromptObsOpcionalOk = Selector.$('divPromptObsOpcionalOk');
    divPromptObsOpcionalOk.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptObsOpcionalOk.appendChild(divform);

    var lblObs = DOM.newElement('label');
    lblObs.innerHTML = "Obs";

    var txtObsOk = DOM.newElement('textarea', 'obsOk');
    txtObsOk.setAttribute('class', 'textbox_cinzafoco');
    txtObsOk.setAttribute('style', 'width:100%; height:100px;');

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'SetarOpcionalOk(' + idContratoComp + ', ' + ok + ')');
    cmdTexto1.innerHTML = (ok == '0' ? 'Pendente' : 'OK');

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoObsOk.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    divform.appendChild(lblObs);
    divform.innerHTML += '<br>';
    divform.appendChild(txtObsOk);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoObsOk = new caixaDialogo('divPromptObsOpcionalOk', 230, 450, 'padrao/', 140);
    dialogoObsOk.Show();

    Selector.$('obsOk').value = obs;
}

function SetarOpcionalOk(idContratoComp, ok){

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=SetarOpcionalOk';
    p+= '&idContrato=' + codigoAtual;
    p+= '&idContratoComp=' + idContratoComp;
    p+= '&ok=' + ok;
    p+= '&obs=' + Selector.$('obsOk').value;
    ajax.Request(p);

    if(ajax.getResponseText() == '0'){
        return;
    }

    getContrato(0, codigoAtual);
    dialogoObsOk.Close();
}

function PromptListaConvidados(idConvidado, linha) {

    if (codigoAtual == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, grave o contrato antes.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'divPromptListaConvidados')) {
        var div = DOM.newElement('div', 'divPromptListaConvidados');
        document.body.appendChild(div);
    }

    var divPromptListaConvidados = Selector.$('divPromptListaConvidados');
    divPromptListaConvidados.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptListaConvidados.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var lblTipoConvidado = DOM.newElement('label');
    lblTipoConvidado.innerHTML = "Tipo Convidado <span style='color:red'>*</span>";
    lblTipoConvidado.setAttribute("style", "text-align:center");

    var cmbTipoConvidade = DOM.newElement('select', 'tipoConvidado');
    cmbTipoConvidade.setAttribute('class', 'combo_cinzafoco');
    cmbTipoConvidade.setAttribute('style', 'width:100%;');

    var lblNome = DOM.newElement('label');
    lblNome.innerHTML = "Nome <span style='color:red'>*</span>";
    lblNome.setAttribute("style", "text-align:center");

    var txtNome = DOM.newElement('text', 'nomeConvidado');
    txtNome.setAttribute('class', 'textbox_cinzafoco');
    txtNome.setAttribute('style', 'width:100%');

    var divRg = DOM.newElement('div');
    divRg.setAttribute('class', 'divcontainer');
    divRg.setAttribute('style', 'max-width:150px');

    var lblRg = DOM.newElement('label');
    lblRg.innerHTML = "RG";
    lblRg.setAttribute("style", "text-align:center;");

    var txtRg = DOM.newElement('text', 'rg');
    txtRg.setAttribute('class', 'textbox_cinzafoco');
    txtRg.setAttribute('style', 'width:100%;');

    divRg.appendChild(lblRg);
    divRg.appendChild(txtRg);

    var divIdade = DOM.newElement('div');
    divIdade.setAttribute('class', 'divcontainer');
    divIdade.setAttribute('style', 'max-width:85px; margin-left:10px;');

    var lblIdade = DOM.newElement('label');
    lblIdade.innerHTML = "Idade";
    lblIdade.setAttribute("style", "text-align:center");

    var txtIdade = DOM.newElement('text', 'idade');
    txtIdade.setAttribute('class', 'textbox_cinzafoco');
    txtIdade.setAttribute('style', 'width:100%;');

    divIdade.appendChild(lblIdade);
    divIdade.appendChild(txtIdade);

    var divTelefone = DOM.newElement('div');
    divTelefone.setAttribute('class', 'divcontainer');
    divTelefone.setAttribute('style', 'max-width:110px; margin-left:10px;');

    var lblTelefone = DOM.newElement('label');
    lblTelefone.innerHTML = "Telefone";
    lblTelefone.setAttribute("style", "text-align:center");

    var txtTelefone = DOM.newElement('text', 'telefone');
    txtTelefone.setAttribute('class', 'textbox_cinzafoco');
    txtTelefone.setAttribute('style', 'width:100%;');

    divTelefone.appendChild(lblTelefone);
    divTelefone.appendChild(txtTelefone);

    var lblEmail = DOM.newElement('label');
    lblEmail.innerHTML = "E-mail";
    lblEmail.setAttribute("style", "text-align:center");

    var txtEmail = DOM.newElement('text', 'emailConvidado');
    txtEmail.setAttribute('class', 'textbox_cinzafoco');
    txtEmail.setAttribute('style', 'width:100%');

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'GravarConvidado(' + idConvidado + ', ' + linha + ')');
    cmdTexto1.innerHTML = "Gravar";

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoListaConvidados.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    //======== Tabela =========//
    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br>';
    divform.appendChild(lblTipoConvidado);
    divform.innerHTML += '<br>';
    divform.appendChild(cmbTipoConvidade);
    divform.innerHTML += '<br>';
    divform.appendChild(lblNome);
    divform.innerHTML += '<br>';
    divform.appendChild(txtNome);
    divform.innerHTML += '<br>';
    divform.appendChild(divRg);
    divform.appendChild(divIdade);
    divform.appendChild(divTelefone);
    divform.innerHTML += '<br>';
    divform.appendChild(lblEmail);
    divform.innerHTML += '<br>';
    divform.appendChild(txtEmail);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoListaConvidados = new caixaDialogo('divPromptListaConvidados', 340, 450, 'padrao/', 140);
    dialogoListaConvidados.Show();

    Mask.setCelular(Selector.$('telefone'));
    Mask.setOnlyNumbers(Selector.$('idade'));
    getTiposConvidados(Selector.$('tipoConvidado'), 'Selecione um tipo de convidado', false);

    if (idConvidado > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=getConvidado';
        p += '&idConvidado=' + idConvidado;
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        Selector.$('tipoConvidado').value = json.idTipoConvidado;
        Selector.$('nomeConvidado').value = json.nomeConvidado;
        Selector.$('rg').value = json.rgConvidado;
        Selector.$('idade').value = json.idadeConvidado;
        Selector.$('telefone').value = json.telConvidado;
        Selector.$('emailConvidado').value = json.emailConvidado;
    } else {
        Selector.$('tipoConvidado').focus();
    }
}

function GravarConvidado(idConvidado, linha) {

    var tipoConvidado = Selector.$('tipoConvidado');
    if (tipoConvidado.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um tipo de convidado.", "OK", "", false, "tipoConvidado");
        mensagem.Show();
        return;
    }

    var nomeConvidado = Selector.$('nomeConvidado').value.trim();
    if (nomeConvidado === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o nome do convidado.", "OK", "", false, "nomeConvidado");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=GravarConvidado';
    p += '&idContrato=' + codigoAtual;
    p += '&idConvidado=' + idConvidado;
    p += '&idTipoConvidado=' + tipoConvidado.value;
    p += '&nomeConvidado=' + nomeConvidado;
    p += '&rg=' + Selector.$('rg').value;
    p += '&idade=' + Selector.$('idade').value;
    p += '&telefone=' + Selector.$('telefone').value;
    p += '&email=' + Selector.$('emailConvidado').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o convidado. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            dialogoListaConvidados.Close();
            MostrarListaConvidados();
        }
    };

    ajax.Request(p);
}

function MostrarListaConvidados() {

    gridLista.clearRows();
    Selector.$('pai_resumo').innerHTML = "";
    Selector.$('mae_resumo').innerHTML = "";

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostrarListaConvidados';
    p += '&idContrato=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('qtdConvidados').innerHTML = "";
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var editar;
        var excluir;
        var email;
        var imprimir;
        var qtdPagantesLista = 0;
        var qtdNaoPagantesLista = 0;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/edit.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'PromptListaConvidados(' + json[i].idContratoLista + ', ' + gridLista.getRowCount() + ')');

            excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/ativar.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'ExcluirConvidadoAux(' + json[i].idContratoLista + ', ' + gridLista.getRowCount() + ')');

            email = DOM.newElement('img');

            if (json[i].conviteEmail === '0') {
                email.setAttribute('src', 'imagens/email.png');
                email.setAttribute('title', 'Enviar o convite por email');
                email.setAttribute('onclick', 'EnviarConvite(' + gridLista.getRowCount() + ', ' + json[i].idContratoLista + ')');
            } else {
                email.setAttribute('src', 'imagens/email2.png');
                email.setAttribute('title', 'Convite enviado em ' + json[i].dataConviteEmail + ' por ' + json[i].usuarioConviteEmail);
                email.setAttribute('onclick', 'EnviarConviteNovamente(' + gridLista.getRowCount() + ', ' + json[i].idContratoLista + ')');
            }

            imprimir = DOM.newElement('img');

            if (json[i].conviteImpresso === '0') {
                imprimir.setAttribute('src', 'imagens/imprimir.png');
                imprimir.setAttribute('title', 'Imprimir o convite');
                imprimir.setAttribute('onclick', 'ImprimirConvite(' + json[i].idContratoLista + ', ' + codigoAtual + ')');
            } else {
                email.setAttribute('src', 'imagens/imprimir2.png');
                email.setAttribute('title', 'Convite impresso em ' + json[i].dataConviteImpresso + ' por ' + json[i].usuarioConviteImpresso);
                email.setAttribute('onclick', 'ImprimirConvite(' + json[i].idContratoLista + ', ' + codigoAtual + ')');
            }

            if (json[i].pagante == 'Pagante') {
                qtdPagantesLista++;
            } else if (json[i].pagante == 'Não Pagante') {
                qtdNaoPagantesLista++;
            }

            if (json[i].idTipoConvidado == 3) {
                if (Selector.$('mae_resumo').innerHTML == "") {
                    Selector.$('mae_resumo').innerHTML = json[i].nomeConvidado;
                } else {
                    Selector.$('mae_resumo').innerHTML += ", " + json[i].nomeConvidado;
                }
            }

            if (json[i].idTipoConvidado == 2) {
                if (Selector.$('pai_resumo').innerHTML == "") {
                    Selector.$('pai_resumo').innerHTML = json[i].nomeConvidado;
                } else {
                    Selector.$('pai_resumo').innerHTML += ", " + json[i].nomeConvidado;
                }
            }

            gridLista.addRow([
                DOM.newText(i + 1),
                DOM.newText(json[i].tipoConvidado),
                DOM.newText(json[i].nomeConvidado),
                DOM.newText(json[i].rgConvidado),
                DOM.newText((json[i].idadeConvidado === '1' ? json[i].idadeConvidado + " ano" : json[i].idadeConvidado + " anos")),
                DOM.newText(json[i].pagante),
                DOM.newText(json[i].telConvidado),
                DOM.newText(json[i].emailConvidado),
                email,
                imprimir,
                editar,
                excluir
            ]);

            gridLista.setRowData(gridLista.getRowCount() - 1, json[i].idContratoLista);
            gridLista.getCell(gridLista.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:70px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; width:120px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; width:200px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:center; width:60px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:center; width:90px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:center; width:150px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:left; width:150px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:center; width:35px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 9).setAttribute('style', 'border:none; text-align:center; width:35px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 10).setAttribute('style', 'border:none; text-align:center; width:35px;');
            gridLista.getCell(gridLista.getRowCount() - 1, 11).setAttribute('style', 'border:none; text-align:center; width:35px;');
        }

        pintaLinhaGrid(gridLista);

        if (gridLista.getRowCount() > 0) {
            Selector.$('qtdConvidados').innerHTML = (gridLista.getRowCount() === '1' ? gridLista.getRowCount() + " convidado na lista" : gridLista.getRowCount() + " convidados na lista");

            if (qtdPagantesLista > 0) {

                var qtdPagantesAMais = 0;
                qtdPagantesAMais = qtdPagantesLista - qtdePagantes;

                if (qtdPagantesAMais > 0) {
                    var lblPagantesAMais = (qtdPagantesAMais == 1 ? ' (' + qtdPagantesAMais + ' excedente)' : ' (' + qtdPagantesAMais + ' excedentes)');
                } else {
                    var lblPagantesAMais = "";
                }

                Selector.$('qtdConvidadosPagantes').innerHTML = (qtdPagantesLista === 1 ? qtdPagantesLista + " convidado pagante" : qtdPagantesLista + " convidados pagantes") + lblPagantesAMais;
            }

            if (qtdNaoPagantesLista > 0) {
                var qtdNaoPagantesAMais = 0;
                qtdNaoPagantesAMais = qtdNaoPagantesLista - qtdeNaoPagantes;

                if (qtdNaoPagantesAMais > 0) {
                    var lblNaoPagantesAMais = (qtdNaoPagantesAMais == 1 ? ' (' + qtdNaoPagantesAMais + ' excedente)' : ' (' + qtdNaoPagantesAMais + ' excedentes)');
                } else {
                    var lblNaoPagantesAMais = "";
                }

                Selector.$('qtdConvidadosNaoPagantes').innerHTML = (qtdNaoPagantesLista === 1 ? qtdNaoPagantesLista + " convidado não pagante" : qtdNaoPagantesLista + " convidados não pagantes") + lblNaoPagantesAMais;
            }
        }
    };

    ajax.Request(p);
}

function ExcluirConvidadoAux(idConvidado, linha) {

    mensagemExcluirConvidado = new DialogoMensagens("prompt", 120, 380, 150, "4", "Atenção!", "Deseja realmente excluir este convidado?", "OK", "ExcluirConvidado(" + idConvidado + ", " + linha + ");", true, "");
    mensagemExcluirConvidado.Show();
}

function ExcluirConvidado(idConvidado, linha) {

    mensagemExcluirConvidado.Close();

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=ExcluirConvidado';
    p += '&idConvidado=' + idConvidado;
    ajax.Request(p);

    if (ajax.getResponseText() !== '0') {
        gridLista.deleteRow(linha);

        var qtdPagantesLista = 0;
        var qtdNaoPagantesLista = 0;

        for (var i = 0; i < gridLista.getRowCount(); i++) {

            if (gridLista.getCellText(i, 5) == 'Pagante') {
                qtdPagantesLista++;
            } else if (gridLista.getCellText(i, 5) == 'Não Pagante') {
                qtdNaoPagantesLista++;
            }

            gridLista.setCellText(i, 0, (i + 1));
            gridLista.getCellObject(i, 10).setAttribute('onclick', 'PromptListaConvidados(' + gridLista.getRowData(i) + ', ' + i + ')');
            gridLista.getCellObject(i, 11).setAttribute('onclick', 'ExcluirConvidadoAux(' + gridLista.getRowData(i) + ', ' + i + ')');
        }

        pintaLinhaGrid(gridLista);

        Selector.$('qtdConvidados').innerHTML = (gridLista.getRowCount() === '1' ? gridLista.getRowCount() + " convidado na lista" : gridLista.getRowCount() + " convidados na lista");


        var qtdPagantesAMais = 0;
        qtdPagantesAMais = qtdPagantesLista - qtdePagantes;

        if (qtdPagantesAMais > 0) {
            var lblPagantesAMais = (qtdPagantesAMais == 1 ? ' (' + qtdPagantesAMais + ' excedente)' : ' (' + qtdPagantesAMais + ' excedentes)');
        } else {
            var lblPagantesAMais = "";
        }

        Selector.$('qtdConvidadosPagantes').innerHTML = (qtdPagantesLista === 1 ? qtdPagantesLista + " convidado pagante" : qtdPagantesLista + " convidados pagantes") + lblPagantesAMais;

        var qtdNaoPagantesAMais = 0;
        qtdNaoPagantesAMais = qtdNaoPagantesLista - qtdeNaoPagantes;

        if (qtdNaoPagantesAMais > 0) {
            var lblNaoPagantesAMais = (qtdNaoPagantesAMais == 1 ? ' (' + qtdNaoPagantesAMais + ' excedente)' : ' (' + qtdNaoPagantesAMais + ' excedentes)');
        } else {
            var lblNaoPagantesAMais = "";
        }

        Selector.$('qtdConvidadosNaoPagantes').innerHTML = (qtdNaoPagantesLista === 1 ? qtdNaoPagantesLista + " convidado não pagante" : qtdNaoPagantesLista + " convidados não pagantes") + lblNaoPagantesAMais;
        MostrarListaConvidados();
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir o convidado. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function EnviarConviteNovamente(linha, idConvidado) {

    if (gridLista.getCellText(linha, 7).trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este convidado não possui email, insira um email para enviar o convite", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    mensagemEnviarConvite = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja enviar o convite novamente?", "OK", "EnviarConvite(" + linha + ", " + idConvidado + ");", true, "");
    mensagemEnviarConvite.Show();
    enviarConviteNovamente = true;
}

function EnviarConvite(linha, idConvidado) {

    if (enviarConviteNovamente) {
        mensagemEnviarConvite.Close();
    } else {

        if (gridLista.getCellText(linha, 7).trim() == '') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este convidado não possui email, insira um email para enviar o convite", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    if (Select.GetText(Selector.$('tipo')).indexOf('ANIVER') >= '0') {

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
        var p = 'action=EnviarConvite';
        p += '&idConvidado=' + idConvidado;
        p += '&idContrato=' + codigoAtual;
        p += '&nomeConvidado=' + gridLista.getCellText(linha, 2);
        p += '&emailConvidado=' + gridLista.getCellText(linha, 7);
        p += '&nomeFesta=' + Selector.$('festa').value;
        p += '&latitude=' + latitudeEnd;
        p += '&longitude=' + longitudeEnd;

        var carregando = DOM.newElement('img');
        carregando.setAttribute('src', 'imagens/grid_carregando.gif');

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o convite. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
                mensagem.Show();
                return;
            } else {
                var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Convite enviado com sucesso", "OK", "", false, "");
                mensagem.Show();
                MostrarListaConvidados();
                return;
            }
        }

        gridLista.setCellObject(linha, 8, carregando);
        ajax.Request(p);
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Envio de email somente pode ser enviado quando o tipo da festa é aniversário.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function ImprimirConvite(idConvidado, idContrato) {

    window.open('php/convite.php?idContrato=' + idContrato);
}

function PromptGerarParcelas() {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, grave o contrato antes.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (Selector.$('saldoPagar2').value.trim() == '0,00' || Selector.$('saldoPagar2').value.trim() == '0.00') {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Não é possível gerar as parcelas, pois a festa já foi paga.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'divPromptGerarParcelas')) {
        var div = DOM.newElement('div', 'divPromptGerarParcelas');
        document.body.appendChild(div);
    }

    var divPromptGerarParcelas = Selector.$('divPromptGerarParcelas');
    divPromptGerarParcelas.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptGerarParcelas.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var divSaldo = DOM.newElement('div');
    divSaldo.setAttribute('class', 'divcontainer');
    divSaldo.setAttribute('style', 'max-width:100px;');

    var lblSaldo = DOM.newElement('label');
    lblSaldo.innerHTML = "Saldo";
    lblSaldo.setAttribute("style", "text-align:center");

    var txtSaldo = DOM.newElement('text', 'saldoPagar3');
    txtSaldo.setAttribute('class', 'textbox_cinzafoco');
    txtSaldo.setAttribute('style', 'width:100%; background-color:#F5F5F5; text-align:right; font-weigth:bold;');
    txtSaldo.setAttribute('readonly', 'readonly');

    divSaldo.appendChild(lblSaldo);
    divSaldo.appendChild(txtSaldo);

    var divPrimeiroVencimento = DOM.newElement('div');
    divPrimeiroVencimento.setAttribute('class', 'divcontainer');
    divPrimeiroVencimento.setAttribute('style', 'max-width:105px; margin-left:10px;');

    var lblPrimeiroVencimento = DOM.newElement('label');
    lblPrimeiroVencimento.innerHTML = "1° Vencimento <span style='color:red'>*</span>";
    lblPrimeiroVencimento.setAttribute("style", "text-align:center");

    var txtPrimeiroVencimento = DOM.newElement('text', 'primeiroVencimento');
    txtPrimeiroVencimento.setAttribute('class', 'textbox_cinzafoco');
    txtPrimeiroVencimento.setAttribute('style', 'width:100%');

    divPrimeiroVencimento.appendChild(lblPrimeiroVencimento);
    divPrimeiroVencimento.appendChild(txtPrimeiroVencimento);

    var divQtdeParcelas = DOM.newElement('div');
    divQtdeParcelas.setAttribute('class', 'divcontainer');
    divQtdeParcelas.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblQtdeParcelas = DOM.newElement('label');
    lblQtdeParcelas.innerHTML = "Qtde. Parcelas <span style='color:red'>*</span>";
    lblQtdeParcelas.setAttribute("style", "text-align:center");

    var txtQtdeParcelas = DOM.newElement('number', 'qtdeParcelas');
    txtQtdeParcelas.setAttribute('class', 'textbox_cinzafoco');
    txtQtdeParcelas.setAttribute('style', 'width:100%');
    txtQtdeParcelas.setAttribute('min', '1');
    txtQtdeParcelas.setAttribute('onchange', 'CalcularValorParcelas();');

    divQtdeParcelas.appendChild(lblQtdeParcelas);
    divQtdeParcelas.appendChild(txtQtdeParcelas);

    var divValorParcelas = DOM.newElement('div');
    divValorParcelas.setAttribute('class', 'divcontainer');
    divValorParcelas.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblValorParcelas = DOM.newElement('label');
    lblValorParcelas.innerHTML = "Valor Parcela";
    lblValorParcelas.setAttribute("style", "text-align:center");

    var txtValorParcela = DOM.newElement('text', 'valorParcela');
    txtValorParcela.setAttribute('class', 'textbox_cinzafoco');
    txtValorParcela.setAttribute('style', 'width:100%; background-color:#F5F5F5; text-align:right; font-weigth:bold;');
    txtValorParcela.setAttribute('readonly', 'readonly');

    divValorParcelas.appendChild(lblValorParcelas);
    divValorParcelas.appendChild(txtValorParcela);

    var chkPago = DOM.newElement('checkbox', 'pago2');
    chkPago.setAttribute('onclick', '(Selector.$("pago2").checked ? Selector.$("formaPagamento2").focus() : "");');

    var lblPago = DOM.newElement('label');
    lblPago.innerHTML = "Pago?";
    lblPago.setAttribute("style", "text-align:center");
    lblPago.setAttribute("for", "pago");

    var divValorPago = DOM.newElement('div');
    divValorPago.setAttribute('class', 'divcontainer');
    divValorPago.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblValorPago = DOM.newElement('label');
    lblValorPago.innerHTML = "Valor Pago <span style='color:red'>*</span>";
    lblValorPago.setAttribute("style", "text-align:center");

    var txtValorPago = DOM.newElement('text', 'valorPagoParcela2');
    txtValorPago.setAttribute('class', 'textbox_cinzafoco');
    txtValorPago.setAttribute('onblur', 'VerificarValores();');
    txtValorPago.setAttribute('style', 'width:100%; text-align:right;');
    txtValorPago.setAttribute('disabled', 'disabled');

    divValorPago.appendChild(lblValorPago);
    divValorPago.appendChild(txtValorPago);

    var divFormaPagamento = DOM.newElement('div');
    divFormaPagamento.setAttribute('class', 'divcontainer');
    divFormaPagamento.setAttribute('style', 'max-width:260px; margin-left:10px;');

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.innerHTML = "Forma Pgto <span style='color:red'>*</span>";
    lblFormaPagamento.setAttribute("style", "text-align:center");

    var cmbFormaPagamento = DOM.newElement('select', 'formaPagamento2');
    cmbFormaPagamento.setAttribute('class', 'combo_cinzafoco');
    cmbFormaPagamento.setAttribute('style', 'width:100%');

    divFormaPagamento.appendChild(lblFormaPagamento);
    divFormaPagamento.appendChild(cmbFormaPagamento);

    var cmdTexto1 = DOM.newElement('button', 'btGerarParcelas2');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    //cmdTexto1.setAttribute('onclick', 'GerarParcelas()');
    cmdTexto1.setAttribute('onclick', 'AdicionarParcelas()');
    cmdTexto1.innerHTML = "Gerar";

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoGerarParcelas.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    //======== Tabela =========//
    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br><br>';
    divform.appendChild(divSaldo);
    //divform.innerHTML += '<br>';
    divform.appendChild(divPrimeiroVencimento);
    divform.appendChild(divQtdeParcelas);
    divform.appendChild(divValorParcelas);
    divform.innerHTML += '<br>';
    divform.appendChild(chkPago);
    divform.appendChild(lblPago);
    divform.appendChild(divValorPago);
    divform.appendChild(divFormaPagamento);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoGerarParcelas = new caixaDialogo('divPromptGerarParcelas', 260, 525, 'padrao/', 140);
    dialogoGerarParcelas.Show();

    Selector.$('saldoPagar3').value = Selector.$('saldoPagar2').value;
    Mask.setData(Selector.$('primeiroVencimento'));
    Mask.setOnlyNumbers(Selector.$('qtdeParcelas'));
    Selector.$('qtdeParcelas').value = 1;
    Selector.$('valorPagoParcela2').value = Selector.$('saldoPagar3').value;
    getFormasPagamento(Selector.$('formaPagamento2'), 'Selecione uma forma de pagamento', false);

    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth();
    var ano4 = data.getFullYear();
    Selector.$('primeiroVencimento').value = (dia < 10 ? "0" + dia : dia) + '/' + ((mes + 1) < 10 ? "0" + (mes + 1) : (mes + 1)) + '/' + ano4;

    Selector.$('qtdeParcelas').select();
    Selector.$('qtdeParcelas').focus();
    CalcularValorParcelas();
}

function CalcularValorParcelas() {

    if (Selector.$('qtdeParcelas').value.trim() == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "A quantidade de parcelas não pode ser 0.", "OK", "", false, "qtdeParcelas");
        mensagem.Show();
        return;
    }

    var saldo = Number.parseFloat(Selector.$('saldoPagar3').value);
    var qtdParcelas = parseInt(Selector.$('qtdeParcelas').value);
    var valorParcelas = (saldo / qtdParcelas);

    Selector.$('valorParcela').value = Number.FormatMoeda(valorParcelas.toFixed(2));
}

function AdicionarParcelas() {

    if (Selector.$('primeiroVencimento').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a data do 1º vencimento.", "OK", "", false, "primeiroVencimento");
        mensagem.Show();
        return;
    }

    if (Selector.$('primeiroVencimento').value.length < 10) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha uma data correta.", "OK", "", false, "primeiroVencimento");
        mensagem.Show();
        return;
    }

    if (Selector.$('qtdeParcelas').value.trim() == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "A quantidade de parcelas não pode ser 0.", "OK", "", false, "qtdeParcelas");
        mensagem.Show();
        return;
    }

    if(Selector.$('pago2').checked){
        if(Selector.$('formaPagamento2').selectedIndex <= 0){
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione a forma de pagamento.", "OK", "", false, "formaPagamento2");
            mensagem.Show();
            return;
        }
    }

    if (codigoAtual <= 0) {
        gridPagamento.clearRows();
    }

    var contador = gridPagamento.getRowCount() + parseInt(Selector.$('qtdeParcelas').value);
    var inicio = gridPagamento.getRowCount();

    for (var i = inicio; i < contador; i++) {

        var confirmar = DOM.newElement('label');
        var recibo = DOM.newElement('label');

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/edit.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'PromptParcela(0, false, ' + i + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/ativar.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('onclick', 'ExcluirParcelaAux(0, ' + gridPagamento.getRowCount() + ', 0)');

        gridPagamento.addRow([
            DOM.newText((gridPagamento.getRowCount() > 0 ? gridPagamento.getRowCount() + 1 : i + 1)),
            DOM.newText(SomarMes(Selector.$('primeiroVencimento').value, (i - inicio))),
            DOM.newText(Number.FormatDinheiro(Number.parseFloat(Selector.$('saldoPagar3').value) / parseInt(Selector.$('qtdeParcelas').value))),
            DOM.newText((Selector.$('pago2').checked ? Selector.$('valorParcela').value : '0,00')),
            DOM.newText((Selector.$('formaPagamento2').value == '0' || !Selector.$('pago2').checked ? '' : Select.GetText(Selector.$('formaPagamento2')))),
            DOM.newText(''),
            DOM.newText((Selector.$('pago2').checked ? 'Pago' : 'Em aberto')),
            confirmar,
            recibo,
            editar,
            excluir,
            DOM.newText(Selector.$('formaPagamento2').value),
            DOM.newText('')
        ]);

        gridPagamento.hiddenCol(11);
        gridPagamento.hiddenCol(12);

        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:50px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:70px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:right; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:right; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:130px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:200px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:left; width:100px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:30px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:center; width:30px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 9).setAttribute('style', 'border:none; text-align:center; width:30px;');
        gridPagamento.getCell(gridPagamento.getRowCount() - 1, 10).setAttribute('style', 'border:none; text-align:center; width:30px;');
    }

    pintaLinhaGrid(gridPagamento);
    dialogoGerarParcelas.Close();
}

function GravarParcelas() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);

    for (var i = 0; i < gridPagamento.getRowCount(); i++) {

        var p = 'action=GerarParcelas';
        p += '&idContrato=' + codigoAtual;
        p += '&numParcela=' + gridPagamento.getCellText(i, 0);
        p += '&dataVencimento=' + gridPagamento.getCellText(i, 1);
        p += '&valor=' + gridPagamento.getCellText(i, 2);
        p += '&pago=' + (gridPagamento.getCellText(i, 6) == 'Pago' ? '1' : '0');
        p += '&valorPago=' + gridPagamento.getCellText(i, 3);
        p += '&idFormaPagamento=' + gridPagamento.getCellText(i, 11);
        p += '&obs=' + gridPagamento.getCellText(i, 12);
        p += '&rowData=' + gridPagamento.getRowData(i);
        ajax.Request(p);
    }
}

function MostrarParcelas() {

    gridPagamento.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostrarParcelas';
    p += '&idContrato=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('qtdParcelas').innerHTML = "";
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var editar;
        var excluir;
        var confirmar;
        var recibo;

        for (var i = 0; i < json.length; i++) {

            if (json[i].incluidaCliente == '1' && json[i].confirmadaAdmin == '0') {
                confirmar = DOM.newElement('img');
                confirmar.setAttribute('src', 'imagens/aviso_ok.png');
                confirmar.setAttribute('title', 'Confirmar parcela adicionada pelo cliente');
                confirmar.setAttribute('class', 'efeito-opacidade-75-04');
                confirmar.setAttribute('onclick', 'ConfirmarPagamentoCliente(' + json[i].idContratoPagamento + ', ' + gridPagamento.getRowCount() + ');');
            } else {
                confirmar = DOM.newElement('label');
            }

            if (json[i].pago === '0') {
                recibo = DOM.newElement('label');
            } else {
                recibo = DOM.newElement('img');
                recibo.setAttribute('src', 'imagens/imprimir.png');
                recibo.setAttribute('title', 'Imprimir recibo de pagamento');
                recibo.setAttribute('class', 'efeito-opacidade-75-04');
                recibo.setAttribute('onclick', 'ImprimirReciboPagamento(' + json[i].idContratoPagamento + ', ' + gridPagamento.getRowCount() + ');');
            }

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/edit.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'PromptParcela(' + json[i].idContratoPagamento + ', ' + (json[i].pago == 1 ? 'true' : 'false') + ', ' + gridPagamento.getRowCount() + ')');

            excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/ativar.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'ExcluirParcelaAux(' + json[i].idContratoPagamento + ', ' + gridPagamento.getRowCount() + ', ' + json[i].pago + ')');

            gridPagamento.addRow([
                //DOM.newText(json[i].parcela),
                DOM.newText(i + 1),
                DOM.newText(json[i].dataVencimento),
                DOM.newText(json[i].valor),
                DOM.newText(json[i].valorPago),
                DOM.newText(json[i].formaPagamento),
                DOM.newText(json[i].obs),
                DOM.newText(json[i].situacao),
                confirmar,
                recibo,
                editar,
                excluir,
                DOM.newText(json[i].formaPagamento),
                DOM.newText(json[i].obs)
            ]);

            if (json[i].pago === '0') {
                var valorPago = DOM.newElement('img');
                valorPago.setAttribute('src', 'imagens/os.png');
                valorPago.setAttribute('title', 'Pagar parcela');
                valorPago.setAttribute('style', 'margin-left:10px; vertical-align:middle');
                valorPago.setAttribute('onclick', 'PromptParcela(' + json[i].idContratoPagamento + ', true, ' + (gridPagamento.getRowCount() - 1) + ')');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).appendChild(valorPago);
            }

            gridPagamento.hiddenCol(11);
            gridPagamento.hiddenCol(12);

            gridPagamento.setRowData(gridPagamento.getRowCount() - 1, json[i].idContratoPagamento);
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:50px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:70px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:right; width:100px;');

            if (json[i].pago === '0') {
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:50px;');
            } else {
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:right; width:100px;');
            }

            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:130px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:200px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:left; width:100px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:30px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:center; width:30px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 9).setAttribute('style', 'border:none; text-align:center; width:30px;');
            gridPagamento.getCell(gridPagamento.getRowCount() - 1, 10).setAttribute('style', 'border:none; text-align:center; width:30px;');
        }

        pintaLinhaGrid(gridPagamento);

        if (gridPagamento.getRowCount() > 0) {
            Selector.$('qtdParcelas').innerHTML = (gridPagamento.getRowCount() === '1' ? gridPagamento.getRowCount() + " parcela" : gridPagamento.getRowCount() + " parcelas");
        }
    };

    ajax.Request(p);
}

function PromptParcela(idParcela, pagar, linha) {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, grave o contrato antes.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'divPromptParcela')) {
        var div = DOM.newElement('div', 'divPromptParcela');
        document.body.appendChild(div);
    }

    var divPromptParcela = Selector.$('divPromptParcela');
    divPromptParcela.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptParcela.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var divNumeroParcela = DOM.newElement('div');
    divNumeroParcela.setAttribute('class', 'divcontainer');
    divNumeroParcela.setAttribute('style', 'max-width:100px;');

    var lblNumeroParcela = DOM.newElement('label');
    lblNumeroParcela.innerHTML = "N° Parcela";
    lblNumeroParcela.setAttribute("style", "text-align:center");

    var txtNumeroParcela = DOM.newElement('text', 'numeroParcela');
    txtNumeroParcela.setAttribute('class', 'textbox_cinzafoco');
    txtNumeroParcela.setAttribute('style', 'width:100%; background-color:#F5F5F5; text-align:right; font-weigth:bold;');
    txtNumeroParcela.setAttribute('readonly', 'readonly');

    divNumeroParcela.appendChild(lblNumeroParcela);
    divNumeroParcela.appendChild(txtNumeroParcela);

    var divVencimento = DOM.newElement('div');
    divVencimento.setAttribute('class', 'divcontainer');
    divVencimento.setAttribute('style', 'max-width:105px; margin-left:10px; margin-right:10px;');

    var lblVencimento = DOM.newElement('label');
    lblVencimento.innerHTML = "Vencimento <span style='color:red'>*</span>";
    lblVencimento.setAttribute("style", "text-align:center");

    var txtVencimento = DOM.newElement('text', 'vencimento');
    txtVencimento.setAttribute('class', 'textbox_cinzafoco');
    txtVencimento.setAttribute('style', 'width:100%');

    divVencimento.appendChild(lblVencimento);
    divVencimento.appendChild(txtVencimento);

    var divValor = DOM.newElement('div');
    divValor.setAttribute('class', 'divcontainer');
    divValor.setAttribute('style', 'max-width:100px;');

    var lblValor = DOM.newElement('label');
    lblValor.innerHTML = "Valor <span style='color:red'>*</span>";
    lblValor.setAttribute("style", "text-align:center");

    var txtValor = DOM.newElement('text', 'valorParcela2');
    txtValor.setAttribute('class', 'textbox_cinzafoco');
    txtValor.setAttribute('style', 'width:100%');

    divValor.appendChild(lblValor);
    divValor.appendChild(txtValor);

    var chkPago = DOM.newElement('checkbox', 'pago');
    chkPago.setAttribute('onclick', 'Pago()');

    var lblPago = DOM.newElement('label');
    lblPago.innerHTML = "Pago?";
    lblPago.setAttribute("style", "text-align:center");
    lblPago.setAttribute("for", "pago");

    var divValorPago = DOM.newElement('div');
    divValorPago.setAttribute('class', 'divcontainer');
    divValorPago.setAttribute('style', 'max-width:100px;');

    var lblValorPago = DOM.newElement('label');
    lblValorPago.innerHTML = "Valor Pago <span style='color:red'>*</span>";
    lblValorPago.setAttribute("style", "text-align:center");

    var txtValorPago = DOM.newElement('text', 'valorPagoParcela');
    txtValorPago.setAttribute('class', 'textbox_cinzafoco');
    txtValorPago.setAttribute('onblur', 'VerificarValores();');
    txtValorPago.setAttribute('style', 'width:100%');

    divValorPago.appendChild(lblValorPago);
    divValorPago.appendChild(txtValorPago);

    var divFormaPagamento = DOM.newElement('div');
    divFormaPagamento.setAttribute('class', 'divcontainer');
    divFormaPagamento.setAttribute('style', 'max-width:250px; margin-left:10px;');

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.innerHTML = "Forma Pgto <span style='color:red'>*</span>";
    lblFormaPagamento.setAttribute("style", "text-align:center");

    var cmbFormaPagamento = DOM.newElement('select', 'formaPagamento');
    cmbFormaPagamento.setAttribute('class', 'combo_cinzafoco');
    cmbFormaPagamento.setAttribute('style', 'width:100%');

    divFormaPagamento.appendChild(lblFormaPagamento);
    divFormaPagamento.appendChild(cmbFormaPagamento);

    var lblObs = DOM.newElement('label');
    lblObs.innerHTML = "Observação";
    lblObs.setAttribute("style", "text-align:center");

    var txtObs = DOM.newElement('textarea', 'obs4');
    txtObs.setAttribute('class', 'textbox_cinzafoco');
    txtObs.setAttribute('style', 'width:100%; height:70px;');

    var cmdTexto1 = DOM.newElement('button', 'btParcela');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    //cmdTexto1.setAttribute('onclick', 'GravarParcela(' + idParcela + ')');
    cmdTexto1.setAttribute('onclick', 'AdicionarParcelaUnica()');
    cmdTexto1.innerHTML = "Gravar";

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoParcela.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    //======== Tabela =========//
    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br><br>';
    divform.appendChild(divNumeroParcela);
    divform.appendChild(divVencimento);
    divform.appendChild(divValor);
    divform.innerHTML += '<br>';
    divform.appendChild(chkPago);
    divform.appendChild(lblPago);
    divform.innerHTML += '<br>';
    divform.appendChild(divValorPago);
    divform.appendChild(divFormaPagamento);
    divform.innerHTML += '<br>';
    divform.appendChild(lblObs);
    divform.innerHTML += '<br>';
    divform.appendChild(txtObs);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoParcela = new caixaDialogo('divPromptParcela', 365, 500, 'padrao/', 140);
    dialogoParcela.Show();

    Selector.$('numeroParcela').value = (parseInt(gridPagamento.getRowCount()) + 1);
    Mask.setData(Selector.$('vencimento'));
    Mask.setMoeda(Selector.$('valorParcela2'));
    Mask.setMoeda(Selector.$('valorPagoParcela'));

    Selector.$('vencimento').focus();

    verificaParcela = 0;

    if (linha < 0 || pagar == false) {
        getFormasPagamento(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", true);
    }

    if (idParcela <= 0 && linha >= 0) {
        Selector.$('numeroParcela').value = gridPagamento.getCellText(linha, 0);
        Selector.$('vencimento').value = gridPagamento.getCellText(linha, 1);
        Selector.$('valorParcela2').value = gridPagamento.getCellText(linha, 2);

        if (gridPagamento.getCellText(linha, 4) !== '') {
            getFormasPagamento(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", false);
            Selector.$('pago').checked = true;
            Selector.$('valorPagoParcela').value = gridPagamento.getCellText(linha, 3);
            Selector.$('formaPagamento').value = gridPagamento.getCellText(linha, 11);
            Selector.$('obs4').value = gridPagamento.getCellText(linha, 5);
        } else {
            getFormasPagamento(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", true);
            //Selector.$('pago').checked = false;
            Selector.$('valorPagoParcela').value = '';
            Selector.$('formaPagamento').value = '';
            Selector.$('obs4').value = '';
        }
    }

    if (idParcela > 0) {

        Selector.$('pago').checked = true;

        getFormasPagamento(Selector.$('formaPagamento'), "Selecione uma forma de pagamento", false);
        Selector.$('btParcela').innerHTML = "Alterar";

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=getParcela';
        p += '&idParcela=' + idParcela;
        ajax.Request(p);

        if (ajax.getResponseText() != '0') {

            var json = JSON.parse(ajax.getResponseText()  );

            Selector.$('numeroParcela').value = json.parcela;
            Selector.$('vencimento').value = json.dataVencimento;
            Selector.$('valorParcela2').value = json.valor;
            Selector.$('valorPagoParcela').value = json.valorPago;
            Selector.$('formaPagamento').value = json.idFormaPagamento;
            Selector.$('obs4').value = json.obs;
        }
    }

    if (idParcela > 0 && pagar) {
        Selector.$('pago').checked = true;
        Selector.$('btParcela').innerHTML = "Pagar";
    }

    if (idParcela > 0 || linha >= 0) {
        Selector.$('pago').checked = true;
        Selector.$('btParcela').setAttribute('onclick', 'GravarParcela(' + idParcela + ', ' + linha + ')');
        Selector.$('valorPagoParcela').focus();
    }

    if (linha == -1) {

        var data = new Date();
        var dia = data.getDate();
        var mes = data.getMonth();
        var ano4 = data.getFullYear();
        Selector.$('vencimento').value = (dia < 10 ? "0" + dia : dia) + '/' + ((mes + 1) < 10 ? "0" + (mes + 1) : (mes + 1)) + '/' + ano4;
        Selector.$('valorParcela2').focus();
    }

    Pago();
}

function VerificarValores() {

    if (Number.Filter(Selector.$('valorPagoParcela').value) == Number.Filter(Selector.$('valorParcela2').value)) {
        Selector.$('valorPagoParcela').value == '';

        var temp = Number.Filter(Selector.$('valorParcela2').value);

        switch (temp.length)
        {
            case 0:
                Selector.$('valorPagoParcela').value = ',  ';
                break;

            case 1:
                Selector.$('valorPagoParcela').value = ', ' + temp;
                break;

            case 2:
                Selector.$('valorPagoParcela').value = ',' + temp;
                break;

            default:
                temp = temp.substr(0, temp.length - 2) + ',' + temp.substr(temp.length - 2, 2);
                Selector.$('valorPagoParcela').value = temp;
                break;
        }
    }
}

function AdicionarParcelaUnica() {

    var vencimento = Selector.$('vencimento');
    if (vencimento.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a data de vencimento.", "OK", "", false, "vencimento");
        mensagem.Show();
        return;
    }

    var valor = Selector.$('valorParcela2');
    if (valor.value.trim() === '' || valor.value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor.", "OK", "", false, "valorParcela2");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('valorParcela2').value) > Number.parseFloat(Selector.$('valorTotal2').value)) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "O valor da parcela não pode ser maior que o valor total.", "OK", "", false, "valorParcela2");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('valorPagoParcela').value) > Number.parseFloat(Selector.$('valorTotal2').value)) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "O valor pago da parcela não pode ser maior que o valor total.", "OK", "", false, "valorPagoParcela");
        mensagem.Show();
        return;
    }

    var valorPago = Selector.$('valorPagoParcela');
    var formaPagamento = Selector.$('formaPagamento');
    var confirmar = DOM.newElement('label');
    var recibo = DOM.newElement('label');

    if (Selector.$('pago').checked == true) {

        if (valorPago.value.trim() === '' || valorPago.value.trim() === ',' || parseFloat(valorPago.value.replace(',', '.').replace('.', '').trim()) == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor pago.", "OK", "", false, "valorPagoParcela");
            mensagem.Show();
            return;
        }

        if (formaPagamento.selectedIndex <= 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a forma de pagamento.", "OK", "", false, "formaPagamento");
            mensagem.Show();
            return;
        }

        GravarParcela(0, -1);
        return;

    } else {

        if ((valorPago.value.trim() != ',' || valorPago.value.trim() != '') && formaPagamento.value != '0' /*&& verificaParcela == 0*/) {
            // verificaParcela = 1;
            mensagemValorParcela = new DialogoConfirmacao("prompt", 140, 350, 150, "4", "Atenção!", "Pago não esta selecionado, deseja pagar esta parcela?", "OK", "Selector.$('pago').checked=true;mensagemValorParcela.Close();GravarParcela(0,-1);", "Cancelar", "mensagemValorParcela.Close();");
            mensagemValorParcela.Show();
            return;
        }
    }

    editar = DOM.newElement('img');
    editar.setAttribute('src', 'imagens/edit.png');
    editar.setAttribute('title', 'Editar');
    editar.setAttribute('class', 'efeito-opacidade-75-04');
    editar.setAttribute('onclick', 'PromptParcela(0, ' + (Selector.$('pago').checked ? 'true' : 'false') + ', ' + gridPagamento.getRowCount() + ')');

    excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/ativar.png');
    excluir.setAttribute('title', 'Excluir');
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('onclick', 'ExcluirParcelaAux(0, ' + gridPagamento.getRowCount() + ', ' + (Selector.$('pago').checked ? '1' : '0') + ')');

    gridPagamento.addRow([
        DOM.newText(gridPagamento.getRowCount() + 1),
        DOM.newText(Selector.$('vencimento').value),
        DOM.newText(Number.FormatDinheiro(Number.parseFloat(Selector.$('valorParcela2').value))),
        DOM.newText((Selector.$('pago').checked ? Number.FormatDinheiro(Number.parseFloat(Selector.$('valorPagoParcela').value)) : '0,00')),
        DOM.newText((Selector.$('formaPagamento').value == '0' || !Selector.$('pago').checked ? '' : Select.GetText(Selector.$('formaPagamento')))),
        DOM.newText((Selector.$('pago').checked ? Selector.$('obs4').value : '')),
        DOM.newText((Selector.$('pago').checked ? 'Pago' : 'Em aberto')),
        confirmar,
        recibo,
        editar,
        excluir,
        DOM.newText((Selector.$('pago').checked ? Selector.$('formaPagamento').value : '0')),
        DOM.newText((Selector.$('pago').checked ? Selector.$('obs4').value : ''))
    ]);

    gridPagamento.hiddenCol(11);
    gridPagamento.hiddenCol(12);

    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:50px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:70px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:right; width:100px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:right; width:100px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:130px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:200px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:left; width:100px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:30px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:center; width:30px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 9).setAttribute('style', 'border:none; text-align:center; width:30px;');
    gridPagamento.getCell(gridPagamento.getRowCount() - 1, 10).setAttribute('style', 'border:none; text-align:center; width:30px;');

    pintaLinhaGrid(gridPagamento);

    totalizaParcelas();
    dialogoParcela.Close();
}

function Pago() {

    if (Selector.$('pago').checked === true) {
        Selector.$('valorPagoParcela').focus();
        if (Selector.$('valorPagoParcela').value.replace(',', '').trim() == "") {
            Selector.$('valorPagoParcela').value = Selector.$('valorParcela2').value;
        }
    } else {
        if (Selector.$('valorPagoParcela').value.replace(',', '').trim() !== '') {
            Selector.$('valorPagoParcela').value = "";
            Selector.$('formaPagamento').selectedIndex = 0;
        }
    }
}

function GravarParcela(idParcela, linha) {

    var vencimento = Selector.$('vencimento');
    if (vencimento.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a data de vencimento.", "OK", "", false, "vencimento");
        mensagem.Show();
        return;
    }

    var valor = Selector.$('valorParcela2');
    if (valor.value.trim() === '' || valor.value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor.", "OK", "", false, "valorParcela2");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('valorParcela2').value) > Number.parseFloat(Selector.$('valorTotal2').value)) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "O valor da parcela não pode ser maior que o valor total.", "OK", "", false, "valorParcela2");
        mensagem.Show();
        return;
    }

    if (Number.parseFloat(Selector.$('valorPagoParcela').value) > Number.parseFloat(Selector.$('valorTotal2').value)) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "O valor pago da parcela não pode ser maior que o valor total.", "OK", "", false, "valorPagoParcela");
        mensagem.Show();
        return;
    }

    var valorPago = Selector.$('valorPagoParcela');
    var formaPagamento = Selector.$('formaPagamento');
    var recibo;
    var confirmar = DOM.newElement('label');

    if (Selector.$('pago').checked == true) {

        recibo = DOM.newElement('img');
        recibo.setAttribute('src', 'imagens/imprimir.png');
        recibo.setAttribute('title', 'Imprimir recibo de pagamento');
        recibo.setAttribute('class', 'efeito-opacidade-75-04');
        recibo.setAttribute('onclick', 'ImprimirReciboPagamento(' + idParcela + ', ' + linha + ');');

        if (valorPago.value.trim() === '' || valorPago.value.trim() === ',') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor pago.", "OK", "", false, "valorPagoParcela");
            mensagem.Show();
            return;
        }

        if (formaPagamento.value <= 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a forma de pagamento.", "OK", "", false, "formaPagamento");
            mensagem.Show();
            return;
        }

        if (idParcela <= 0) {
            GravarParcela_Aux(idParcela, linha);
            return;
        }

    } else {

        recibo = DOM.newElement('label');

        if ((valorPago.value.trim() != ',' || valorPago.value.trim() != '') && formaPagamento.value != '0' && verificaParcela == 0) {
            verificaParcela = 1;
            mensagemValorParcela = new DialogoConfirmacao("prompt", 140, 350, 150, "4", "Atenção!", "Pago não esta selecionado, deseja pagar esta parcela?", "OK", "Selector.$('pago').checked=true;mensagemValorParcela.Close();GravarParcela(" + idParcela + ", " + linha + ");", "Cancelar", "mensagemValorParcela.Close();GravarParcela(" + idParcela + ", " + linha + ");");
            mensagemValorParcela.Show();
            return;
        }
    }

    if (linha >= 0 && idParcela <= 0) {

        var img = DOM.newElement("img");
        img.setAttribute('class', 'efeito-opacidade-75-04');
        img.setAttribute('onclick', 'PromptParcela(' + idParcela + ', true, ' + linha + ');');
        img.setAttribute('src', 'imagens/editar.png');
        img.setAttribute('title', 'Editar');

        var valorPagoParcela = '';
        if (Selector.$('pago').checked) {
            if (Selector.$('valorPagoParcela').value.trim() == ',' || Selector.$('valorPagoParcela').value.trim() == '') {
                valorPagoParcela = '0,00';
            } else {
                valorPagoParcela = Selector.$('valorPagoParcela').value;
            }
        } else {
            valorPagoParcela = '0,00';
        }

        gridPagamento.setCellText(linha, 1, Selector.$('vencimento').value);
        gridPagamento.setCellText(linha, 2, Selector.$('valorParcela2').value);
        gridPagamento.setCellText(linha, 3, valorPagoParcela);
        gridPagamento.setCellText(linha, 4, (Selector.$('pago').checked ? Select.GetText(Selector.$('formaPagamento')) : ''));
        gridPagamento.setCellText(linha, 5, (Selector.$('pago').checked ? Selector.$('obs4').value : ''));
        gridPagamento.setCellText(linha, 6, (Selector.$('pago').checked ? 'Pago' : 'Em aberto'));
        gridPagamento.setCellObject(linha, 7, confirmar);
        gridPagamento.setCellObject(linha, 8, recibo);
        gridPagamento.setCellObject(linha, 9, img);
        gridPagamento.setCellText(linha, 11, (Selector.$('pago').checked ? Selector.$('formaPagamento').value : '0'));
        gridPagamento.setCellText(linha, 12, (Selector.$('pago').checked ? Selector.$('obs4').value : ''));

        dialogoParcela.Close();
    } else if (idParcela > 0) {

        GravarParcela_Aux(idParcela, linha);
    }

    totalizaParcelas();
}

function GravarParcela_Aux(idParcela, linha) {

    var valorPagoParcela = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorPagoParcela').value));
    var vencimento = Selector.$('vencimento');
    var valor = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorParcela2').value));

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=GravarParcela';
    p += '&idContrato=' + codigoAtual;
    p += '&idParcela=' + idParcela;
    p += '&numeroParcela=' + Selector.$('numeroParcela').value;
    p += '&vencimento=' + vencimento.value;
    p += '&valor=' + valor;
    p += '&pago=' + (Selector.$('pago').checked ? '1' : '0');
    p += '&valorPago=' + valorPagoParcela;
    p += '&formaPagamento=' + (Selector.$('pago').checked ? Selector.$('formaPagamento').value : '0');
    p += '&obs=' + (Selector.$('pago').checked ? Selector.$('obs4').value : '');
    p += '&desfazerPago=' + (Selector.$('pago').checked === false ? '1' : '0');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('btParcela').innerHTML = "Gravar";

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar a parcela. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {

            var confirmar = DOM.newElement('label');

            if (linha == -1) {

                recibo = DOM.newElement('img');
                recibo.setAttribute('src', 'imagens/imprimir.png');
                recibo.setAttribute('title', 'Imprimir recibo de pagamento');
                recibo.setAttribute('class', 'efeito-opacidade-75-04');
                recibo.setAttribute('onclick', 'ImprimirReciboPagamento(' + idParcela + ', ' + linha + ');');

                var editar = DOM.newElement('img');
                editar.setAttribute('src', 'imagens/edit.png');
                editar.setAttribute('title', 'Editar');
                editar.setAttribute('class', 'efeito-opacidade-75-04');
                editar.setAttribute('onclick', 'PromptParcela( ' + ajax.getResponseText() + ', ' + (Selector.$('pago').checked ? 'true' : 'false') + ', ' + gridPagamento.getRowCount() + ')');

                var excluir = DOM.newElement('img');
                excluir.setAttribute('src', 'imagens/ativar.png');
                excluir.setAttribute('title', 'Excluir');
                excluir.setAttribute('class', 'efeito-opacidade-75-04');
                excluir.setAttribute('onclick', 'ExcluirParcelaAux(' + ajax.getResponseText() + ', ' + gridPagamento.getRowCount() + ', ' + (Selector.$('pago').checked ? '1' : '0') + ')');

                gridPagamento.addRow([
                    DOM.newText(gridPagamento.getRowCount() + 1),
                    DOM.newText(Selector.$('vencimento').value),
                    DOM.newText(valor),
                    DOM.newText(valorPagoParcela),
                    DOM.newText((Selector.$('formaPagamento').value == '0' || !Selector.$('pago').checked ? '' : Select.GetText(Selector.$('formaPagamento')))),
                    DOM.newText((Selector.$('pago').checked ? Selector.$('obs4').value : '')),
                    DOM.newText((Selector.$('pago').checked ? 'Pago' : 'Em aberto')),
                    confirmar,
                    recibo,
                    editar,
                    excluir,
                    DOM.newText((Selector.$('pago').checked ? Selector.$('formaPagamento').value : '0')),
                    DOM.newText((Selector.$('pago').checked ? Selector.$('obs4').value : ''))
                ]);

                gridPagamento.hiddenCol(11);
                gridPagamento.hiddenCol(12);

                gridPagamento.setRowData(gridPagamento.getRowCount() - 1, ajax.getResponseText());
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:50px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:70px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:right; width:100px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:right; width:100px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:130px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:200px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:left; width:100px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:30px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:center; width:30px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 9).setAttribute('style', 'border:none; text-align:center; width:30px;');
                gridPagamento.getCell(gridPagamento.getRowCount() - 1, 10).setAttribute('style', 'border:none; text-align:center; width:30px;');

                pintaLinhaGrid(gridPagamento);
                dialogoParcela.Close();
                totalizaParcelas();
                return;
            } else {

                var recibo;

                if (Selector.$('pago').checked) {

                    recibo = DOM.newElement('img');
                    recibo.setAttribute('src', 'imagens/imprimir.png');
                    recibo.setAttribute('title', 'Imprimir recibo de pagamento');
                    recibo.setAttribute('class', 'efeito-opacidade-75-04');
                    recibo.setAttribute('onclick', 'ImprimirReciboPagamento(' + idParcela + ', ' + linha + ');');
                } else {
                    recibo = DOM.newElement('label');
                }

                var img = DOM.newElement("img");
                img.setAttribute('class', 'efeito-opacidade-75-04');
                img.setAttribute('onclick', 'PromptParcela(' + idParcela + ', true, ' + linha + ');');
                img.setAttribute('src', 'imagens/editar.png');
                img.setAttribute('title', 'Editar');

                var excluir = DOM.newElement('img');
                excluir.setAttribute('src', 'imagens/ativar.png');
                excluir.setAttribute('title', 'Excluir');
                excluir.setAttribute('class', 'efeito-opacidade-75-04');
                excluir.setAttribute('onclick', 'ExcluirParcelaAux(' + idParcela + ', ' + linha + ', ' + (Selector.$('pago').checked ? '1' : '0') + ')');

                gridPagamento.setRowData(linha, ajax.getResponseText());
                //   alert("atualizando linha " + linha + " valor = "  + valor + " valor Pago = " + valorPagoParcela);
                gridPagamento.setCellText(linha, 1, Selector.$('vencimento').value);
                gridPagamento.getCell(linha, 2).innerHTML = valor;
                gridPagamento.getCell(linha, 3).innerHTML = valorPagoParcela;
                (Selector.$('pago').checked ? gridPagamento.getCell(linha, 3).style.textAlign = 'right' : 'center');
                gridPagamento.setCellText(linha, 4, (Selector.$('pago').checked ? Select.GetText(Selector.$('formaPagamento')) : ''));
                gridPagamento.setCellText(linha, 5, Selector.$('obs4').value);
                gridPagamento.setCellText(linha, 6, (Selector.$('pago').checked ? 'Pago' : 'em Aberto'));
                gridPagamento.setCellObject(linha, 7, confirmar);
                gridPagamento.setCellObject(linha, 8, recibo);
                gridPagamento.setCellObject(linha, 9, img);
                gridPagamento.setCellObject(linha, 10, excluir);
                gridPagamento.setCellText(linha, 11, Selector.$('formaPagamento').value);
                gridPagamento.setCellText(linha, 12, Selector.$('obs4').value); //??????????
                dialogoParcela.Close();
                totalizaParcelas();
                return;
            }
        }
    };

    Selector.$('btParcela').innerHTML = "Gravando";
    ajax.Request(p);
}

function ExcluirParcelaAux(idParcela, linha, pago) {

    if (pago == '1') {
        mensagemExcluirParcela = new DialogoMensagens("prompt", 140, 380, 150, "4", "Atenção!", "Não é possível excluir esta parcela, pois ela já foi paga.", "OK", "", false, "");
        mensagemExcluirParcela.Show();
        return;
    }

    mensagemExcluirParcela = new DialogoMensagens("prompt", 120, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta parcela?", "OK", "ExcluirParcela(" + idParcela + ", " + linha + ");", true, "");
    mensagemExcluirParcela.Show();
}

function ExcluirParcela(idParcela, linha) {

    mensagemExcluirParcela.Close();

    var valorPago = (Number.parseFloat(Selector.$('valorPago2').value) - (gridPagamento.getCellText(linha, 4) == 'Pago' ? Number.parseFloat(gridPagamento.getCellText(linha, 3)) : 0));
    Selector.$('valorPago2').value = Number.FormatDinheiro(valorPago);

    var saldoAPagar = ((gridPagamento.getCellText(linha, 4) == 'Pago' ? Number.parseFloat(gridPagamento.getCellText(linha, 3)) : 0) + Number.parseFloat(Selector.$('saldoPagar2').value));
    Selector.$('saldoPagar2').value = Number.FormatDinheiro(saldoAPagar);

    gridPagamento.deleteRow(linha);

    for (var i = 0; i < gridPagamento.getRowCount(); i++) {

        gridPagamento.setCellText(i, 0, (i + 1));
        gridPagamento.getCellObject(i, 9).setAttribute('onclick', 'PromptParcela(' + (idParcela <= 0 ? 0 : gridPagamento.getRowData(i)) + ', ' + (gridPagamento.getCellText(i, 4) != '' ? 'true' : 'false') + ', ' + i + ')');
        gridPagamento.getCellObject(i, 10).setAttribute('onclick', 'ExcluirParcelaAux(' + (idParcela <= 0 ? 0 : gridPagamento.getRowData(i)) + ', ' + i + ', ' + (gridPagamento.getCellText(i, 4) !== '' ? '1' : '0') + ')');
    }

    pintaLinhaGrid(gridPagamento);

    if (idParcela > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=ExcluirParcela';
        p += '&idParcela=' + idParcela;

        ajax.Request(p);

        if (ajax.getResponseText() !== '0') {
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir a parcela. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }
}

function PromptFollowUp(idFollowUp) {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, grave o contrato antes.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'divPromptFollowUp')) {
        var div = DOM.newElement('div', 'divPromptFollowUp');
        document.body.appendChild(div);
    }

    var divPromptFollowUp = Selector.$('divPromptFollowUp');
    divPromptFollowUp.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptFollowUp.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var lblContatoTipo = DOM.newElement('label');
    lblContatoTipo.innerHTML = "Tipo Contato <span style='color:red'>*</span>";
    lblContatoTipo.setAttribute("style", "text-align:center");

    var cmbContatoTipo = DOM.newElement('select', 'contatoTipo');
    cmbContatoTipo.setAttribute('class', 'combo_cinzafoco');
    cmbContatoTipo.setAttribute('style', 'width:100%;');

    var lblObs = DOM.newElement('label');
    lblObs.innerHTML = "Obs <span style='color:red'>*</span>";
    lblObs.setAttribute("style", "text-align:center");

    var txtObs = DOM.newElement('textarea', 'obs2');
    txtObs.setAttribute('class', 'textbox_cinzafoco');
    txtObs.setAttribute('style', 'width:100% height:100px;');

    var lblDataRetorno = DOM.newElement('label');
    lblDataRetorno.innerHTML = "Data Retorno";
    lblDataRetorno.setAttribute("style", "text-align:center");

    var txtDataRetorno = DOM.newElement('text', 'dataRetorno');
    txtDataRetorno.setAttribute('class', 'textbox_cinzafoco');
    txtDataRetorno.setAttribute('style', 'width:135px;');
    txtDataRetorno.setAttribute('placeholder', 'dd/mm/aaaa HH:MM');

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'GravarFollowUp(' + idFollowUp + ')');
    cmdTexto1.innerHTML = "Gravar";

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoFollowUp.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    //======== Tabela =========//
    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br>';
    divform.appendChild(lblContatoTipo);
    divform.innerHTML += '<br>';
    divform.appendChild(cmbContatoTipo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblObs);
    divform.innerHTML += '<br>';
    divform.appendChild(txtObs);
    divform.innerHTML += '<br>';
    divform.appendChild(lblDataRetorno);
    divform.innerHTML += '<br>';
    divform.appendChild(txtDataRetorno);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoFollowUp = new caixaDialogo('divPromptFollowUp', 295, 450, 'padrao/', 140);
    dialogoFollowUp.Show();

    getContatosTipos(Selector.$('contatoTipo'), "Selecione um tipo de contato", false);
    Mask.setData(Selector.$('dataRetorno'), true);

    if (idFollowUp > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=getFollowUp';
        p += '&idFollowUp=' + idFollowUp;
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        Selector.$('contatoTipo').value = json.idContatoTipo;
        Selector.$('obs2').value = json.obs;
        Selector.$('dataRetorno').value = json.dataRetorno;
        idAviso = json.idAviso;
    } else {
        Selector.$('contatoTipo').focus();
    }
}

function GravarFollowUp(idFollowUp) {

    var tipoContato = Selector.$('contatoTipo');
    if (tipoContato.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um tipo de contato.", "OK", "", false, "contatoTipo");
        mensagem.Show();
        return false;
    }

    var obs = Selector.$('obs2').value;
    if (obs.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a observação.", "OK", "", false, "obs2");
        mensagem.Show();
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=GravarFollowUp';
    p += '&idContrato=' + codigoAtual;
    p += '&idFollowUp=' + idFollowUp;
    p += '&idContatoTipo=' + tipoContato.value;
    p += '&obs=' + obs;
    p += '&dataRetorno=' + Selector.$('dataRetorno').value.trim();

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o follow up. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            dialogoFollowUp.Close();
            MostrarFollowUp();
        }
    };

    ajax.Request(p);
}

function MostrarFollowUp() {

    gridFollowUp.clearRows();
    Selector.$('qtdFollowUp').innerHTML = '';

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostrarFollowUp';
    p += '&idContrato=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var editar;
        var excluir;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/edit.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'PromptFollowUp(' + json[i].idContato + ')');

            excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/ativar.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'ExcluirFollowUpAux(' + json[i].idContato + ', ' + gridFollowUp.getRowCount() + ')');

            gridFollowUp.addRow([
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].tipoContato),
                DOM.newText(json[i].obs),
                DOM.newText(json[i].dataRetorno),
                editar,
                excluir
            ]);

            gridFollowUp.setRowData(gridFollowUp.getRowCount() - 1, json[i].idContato);
            gridFollowUp.getCell(gridFollowUp.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridFollowUp.getCell(gridFollowUp.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; width:200px;');
            gridFollowUp.getCell(gridFollowUp.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left;');
            gridFollowUp.getCell(gridFollowUp.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:130px;');
            gridFollowUp.getCell(gridFollowUp.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:center; width:40px;');
            gridFollowUp.getCell(gridFollowUp.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:center; width:40px;');
        }

        pintaLinhaGrid(gridFollowUp);

        Selector.$('qtdFollowUp').innerHTML = i + " contato(s)";
    };

    ajax.Request(p);
}

function ExcluirFollowUpAux(idFollowUp, linha) {

    mensagemExcluirFollowUp = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este follow up?", "OK", "ExcluirFollowUp(" + idFollowUp + ", " + linha + ");", true, "");
    mensagemExcluirFollowUp.Show();
}

function ExcluirFollowUp(idFollowUp, linha) {

    mensagemExcluirFollowUp.Close();

    for (var i = 0; i < gridFollowUp.getRowCount(); i++) {

        gridFollowUp.getCellObject(i, 4).setAttribute('onclick', 'PromptFollowUp(' + gridFollowUp.getRowData(i) + ')');
        gridFollowUp.getCellObject(i, 5).setAttribute('onclick', 'ExcluirFollowUpAux(' + gridFollowUp.getRowData(i) + ', ' + i + ')');
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=ExcluirFollowUp';
    p += '&idFollowUp=' + idFollowUp;
    ajax.Request(p);

    if (ajax.getResponseText() !== '0') {
        gridFollowUp.deleteRow(linha);
        pintaLinhaGrid(gridFollowUp);
    }
}

function CancelarContratoAux(idContrato) {

    mensagemCancelarContrato = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente cancelar este contrato?", "OK", "CancelarContrato(" + idContrato + ");", true, "");
    mensagemCancelarContrato.Show();
}

function CancelarContrato(idContrato) {

    //Colocar a verificação de Permissão

    mensagemCancelarContrato.Close();
    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=CancelarContrato';
    p += '&idContrato=' + idContrato;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao cancelar o contrato. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {

        getContrato(0, idContrato);
        cancelado = true;
    }
}

function VerificaDataCotacao(retorno) {

    if (Selector.$('horario1').value.trim() == '' || Selector.$('horario2').value.trim() == '') {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=VerificaDataCotacao';
    p += '&idContrato=' + codigoAtual;
    p += '&dataFesta=' + Selector.$('dataFesta').value;
    p += '&horaDe=' + Selector.$('horario1').value;
    p += '&horaAte=' + Selector.$('horario2').value;
    p += '&idLocal=' + Selector.$('local').value;
    ajax.Request(p);

    if (retorno) {

        return ajax.getResponseText();
    } else {

        if (ajax.getResponseText() == '1' || ajax.getResponseText() == '-1') {
            Selector.$('avisoDataFesta').innerHTML = "Já existe uma festa com essa data e neste período.";
        } else if (ajax.getResponseText() == '2' || ajax.getResponseText() == '-2') {
            Selector.$('avisoDataFesta').innerHTML = "Já existe uma festa entre o período de 2hs.";
        }
    }
}

function CalcularValorAdicionalPagantes() {

    var qtdAdicionado = parseInt(Selector.$('qtdePagantes').value);
    var valorAdicionalPagantes = (qtdAdicionado - qtdePagantes) * Number.parseFloat(valorAdicionalAntesFesta);
    Selector.$('valorAdicionalPagantes').value = Number.FormatMoeda(valorAdicionalPagantes.toFixed(2));
}

function CalcularValorAteFesta() {

    if (Selector.$('horario1').value == '') {
        return;
    }

    if (Selector.$('horario1').value.indexOf(":") <= 0) {
        Selector.$('horario1').value += ":00";
    }

    if (!Date.isHora(Selector.$('horario1').value)) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, digite um horário válido.", "OK", "", false, "horario1");
        mensagem.Show();
        return;
    }

    var horaDe = Selector.$('horario1').value.split(":");
    var horaSomar = duracaoFesta.split(":");
    var horasTotal;
    var minutosTotal;
    var horaFinal;

    horasTotal = parseInt(horaDe[0], 10) + parseInt(horaSomar[0], 10);
    minutosTotal = parseInt(horaDe[1], 10) + parseInt(horaSomar[1], 10);

    if (minutosTotal >= 60) {
        minutosTotal -= 60;
        horasTotal += 1;
    }

    horaFinal = (horasTotal.toString().length == '1' ? '0' : '') + horasTotal + ":" + (minutosTotal.toString().length == '1' ? '0' : '') + minutosTotal;
    Selector.$('horario2').value = horaFinal;
}

function VerificaQtdPagantes() {

    if (parseInt(Selector.$('qtdePagantes').value.trim()) < qtdePagantes) {
        Selector.$('qtdePagantes').value = qtdePagantes;
        return;
    }
}

function VerificaQtdNaoPagantes() {

    if (parseInt(Selector.$('qtdeNaoPagantes').value.trim()) < qtdeNaoPagantes) {
        Selector.$('qtdeNaoPagantes').value = qtdeNaoPagantes;
        return;
    }
}

function MostrarPendenciasContratoDetalhado() {

    gridPendencias.clearRows();
    Selector.$('pendenciasContador').innerHTML = "";

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostrarPendenciasContratoDetalhado';
    p += '&idContrato=' + codigoAtual;

    if ((Window.getParameter('idReserva') != null || Window.getParameter('idReserva') > '0') && (codigoAtual === 0)) {
        p += '&idCotacao=' + Window.getParameter('idReserva');
    } else {
        p += '&idCotacao=' + 0;
    }

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var escolher;
        var situacao;
        var situacaoResumo;
        var numeroPendencias = 0;
        for (var i = 0; i < json.length; i++) {

            escolher = DOM.newElement('img');
            escolher.setAttribute('src', 'imagens/menu.png');
            escolher.setAttribute('title', 'Escolher ítens');
            escolher.setAttribute('class', 'efeito-opacidade-75-04');
            escolher.setAttribute('onclick', 'PromptEscolherItensPendencia(' + json[i].idGrupo + ', "' + json[i].grupo + '", ' + json[i].qtdEscolhas + ', "' + json[i].idItens + '")');

            situacao = DOM.newElement('label');
            situacaoResumo = DOM.newElement('label');

            if (json[i].pendente == '1') {
                situacao.innerHTML = 'Pendente';
                situacao.setAttribute('id', 0);
                situacao.setAttribute('style', 'font-weight:200; color:red;');
                situacaoResumo.innerHTML = 'Pendente';
                situacaoResumo.setAttribute('style', 'font-weight:200; color:red;');
                numeroPendencias++;
            } else {
                situacao.innerHTML = 'Escolhido (' + json[i].escolhas + ')';
                situacao.setAttribute('id', json[i].idItens);
                situacao.setAttribute('style', 'font-weight:200; color:green;');

                situacaoResumo.innerHTML = 'Escolhido (' + json[i].escolhas + ')';
                situacaoResumo.setAttribute('style', 'font-weight:200; color:green;');
            }

            gridPendencias.addRow([
                DOM.newText(json[i].grupo),
                DOM.newText(json[i].qtdEscolhas + (json[i].qtdEscolhas == '1' ? ' escolha' : ' escolhas')),
                situacao,
                escolher
            ]);

            //situacao === 'Pendente' ? nPendencias++ : "";

            gridPendencias.setRowData(gridPendencias.getRowCount() - 1, json[i].idGrupo);
            gridPendencias.getCell(gridPendencias.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:left; width:300px;');
            gridPendencias.getCell(gridPendencias.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:130px;');
            gridPendencias.getCell(gridPendencias.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left;');
            gridPendencias.getCell(gridPendencias.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:60px;');

            gridPendenciasResumo.addRow([
                DOM.newText(json[i].grupo),
                DOM.newText(json[i].qtdEscolhas + (json[i].qtdEscolhas == '1' ? ' escolha' : ' escolhas')),
                situacaoResumo
            ]);

            gridPendenciasResumo.getCell(gridPendenciasResumo.getRowCount() - 1, 0).setAttribute('style', ' padding-left:3px; padding-right:3px; border:none; text-align:left;');
            gridPendenciasResumo.getCell(gridPendenciasResumo.getRowCount() - 1, 1).setAttribute('style', ' padding-left:3px;  padding-right:3px; border:none; text-align:center; width:70px;');
            gridPendenciasResumo.getCell(gridPendenciasResumo.getRowCount() - 1, 2).setAttribute('style', '  padding-left:3px; padding-right:3px; border:none; text-align:left;');
        }

        if (numeroPendencias > 0) {
            Selector.$('pendenciasContador').innerHTML = numeroPendencias + " pendência(s)";
        }

        pintaLinhaGrid(gridPendencias);
        pintaLinhaGrid(gridPendenciasResumo);
    }

    ajax.Request(p);
}

function PromptEscolherItensPendencia(idGrupo, grupo, qtdEscolhas, idItens) {

    ultimoIdCardapioItem = 0;

    if (!isElement('div', 'divPromptEscolherItensPendencia')) {
        var div = DOM.newElement('div', 'divPromptEscolherItensPendencia');
        document.body.appendChild(div);
    }

    var divPromptEscolherItensPendencia = Selector.$('divPromptEscolherItensPendencia');
    divPromptEscolherItensPendencia.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptEscolherItensPendencia.appendChild(divform);

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = "Descrição: " + grupo + " (" + qtdEscolhas + (qtdEscolhas == '1' ? " escolha" : " escolhas") + ")";
    lblTitulo.setAttribute("style", "text-align:center");

    var divItensPendencia = DOM.newElement('div', 'divItensPendencia');
    divItensPendencia.setAttribute('style', 'height:330px; overflow:auto');

    gridItensPendencia = new Table('gridItensPendencia');
    gridItensPendencia.table.setAttribute('cellpadding', '3');
    gridItensPendencia.table.setAttribute('cellspacing', '0');
    gridItensPendencia.table.setAttribute('class', 'tabela_jujuba_comum');

    if (grupo == 'DECORAÇÃO ESCOLHIDA' || grupo == 'DECORAÇÃO') {

        gridItensPendencia.addHeader([
            DOM.newText(''),
            DOM.newText('Decoração')
        ]);

    } else {

        gridItensPendencia.addHeader([
            DOM.newText(''),
            DOM.newText('Item')
        ]);
    }

    var cmdTexto1 = DOM.newElement('button', 'escolher');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'EscolherItens(' + idGrupo + ', "' + grupo + '", ' + qtdEscolhas + ')');
    cmdTexto1.innerHTML = "Escolher";

    //======== Tabela =========//
    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divItensPendencia);
    divform.innerHTML += '<br>';
    divform.appendChild(cmdTexto1);

    dialogoItensPendencia = new caixaDialogo('divPromptEscolherItensPendencia', 520, 600, 'padrao/', 140);
    dialogoItensPendencia.Show();

    Selector.$('divItensPendencia').appendChild(gridItensPendencia.table);

    gridItensPendencia.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=getItensGrupo';
    p += '&idGrupo=' + idGrupo;
    p += '&grupo=' + grupo;
    p+= '&idContrato=' + codigoAtual;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText()  );
    var checkbox;

    for (var i = 0; i < json.length; i++) {

        checkbox = DOM.newElement('checkbox', 'chkItem' + json[i].idCardapioItem);
        checkbox.setAttribute('onclick', 'SelecionarItens(' + json[i].idCardapioItem + ', ' + qtdEscolhas + ', "' + idItens + '")');

        gridItensPendencia.addRow([
            checkbox,
            DOM.newText(json[i].nomeItem)
        ]);

        gridItensPendencia.setRowData(gridItensPendencia.getRowCount() - 1, json[i].idCardapioItem);
        gridItensPendencia.getCell(gridItensPendencia.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:30px;');
        gridItensPendencia.getCell(gridItensPendencia.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left;');

        if (grupo == 'DECORAÇÃO ESCOLHIDA' || grupo == 'DECORAÇÃO') {

            if (json[i].idCardapioItem == idItens) {
                Selector.$('chkItem' + json[i].idCardapioItem).checked = true;
            }
        } else {

            var idsItens = idItens.split(", ");
            for (var j = 0; j < idsItens.length; j++) {

                if (json[i].idCardapioItem == idsItens[j]) {
                    Selector.$('chkItem' + json[i].idCardapioItem).checked = true;
                }
            }
        }
    }

    pintaLinhaGrid(gridItensPendencia);
}

function SelecionarItens(idCardapioItem, qtdEscolhas, idItens) {

    if (ultimoIdCardapioItem <= 0) {

        var idsItens = idItens.split(", ");
        if (idsItens.length > 0) {

            ultimoIdCardapioItem = idsItens[idsItens.length - 1];
        }
    }

    if (Selector.$('chkItem' + idCardapioItem).checked) {

        if (gridItensPendencia.getSelCount(0) > qtdEscolhas) {

            Selector.$('chkItem' + ultimoIdCardapioItem).checked = false;
        }

        ultimoIdCardapioItem = idCardapioItem;
    }
}

function EscolherItens(idGrupo, grupo, qtdEscolhas) {

    if (gridItensPendencia.getSelCount(0) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione algum ítem", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (gridItensPendencia.getSelCount(0) < qtdEscolhas) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione os ítens de acordo com a quantidade de escolhas.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=EscolherItens';
    p += '&idContrato=' + codigoAtual;
    p += '&idGrupo=' + idGrupo;
    p += '&idItens=' + gridItensPendencia.getRowDataSelectedRows(0);
    p += '&grupo=' + grupo;
    p += '&idDecoracao=' + gridItensPendencia.getRowDataSelectedRows(0);
    p += '&cliente=' + Select.GetText(Selector.$('cliente'));

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        } else {

            dialogoItensPendencia.Close();
            GravarParcelas(codigoAtual);
            MostrarPendenciasContratoDetalhado();
            getContrato(0, codigoAtual);
            SelecionaAbas(4);
        }
    }

    ajax.Request(p);
}

function VerificaDecoracaoContrato(decoracao, linha, codigo) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=VerificaDecoracaoContrato';
    p += "&codigo=" + codigo;
    p += '&dataFesta=' + Selector.$('dataFesta').value;
    
    var horarioDe = parseInt(Selector.$('horario1').value.substring(0, 2)) - 2;
    
    p += '&horaDe2=' + horarioDe + Selector.$('horario1').value.substring(2, 5);
    //p += '&horaDe=' + Selector.$('horario1').value;

    var horarioAte = parseInt(Selector.$('horario2').value.substring(0, 2)) + 2;

    p += '&horaAte2=' + horarioAte + Selector.$('horario2').value.substring(2, 5);
    //p += '&horaAte=' + Selector.$('horario2').value;
    p += '&idLocal=' + Selector.$('local').value;
    p += '&idDecoracao=' + decoracao;
    p += '&linha=' + linha;
    p += '&qtd=' + (linha == -2 ? '0' : Selector.$('qtdeOpcional').value);

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        avisoDecoracaoFesta = false;
        return true;
    } else if (ajax.getResponseText() === '1') {
        avisoDecoracaoFesta = true;
        var mensagem = new DialogoMensagens("prompt", 120, 450, 150, "4", "Atenção!", 'Qtd indisponível no estoque.', "OK", "", false, "qtdeOpcional");
        mensagem.Show();
        return false;
    } else {

        var mensagem = '<strong>Já existe uma festa cadastrada nessa data com essa decoração</strong><br/><br/>';
        var json = JSON.parse(ajax.getResponseText()  );

        for (var i = 0; i < json.length; i++) {
            mensagem += '<strong>Cliente:</strong> ' + json[i].nomeCliente + '<br/>';
            mensagem += '<strong>Local:</strong> ' + json[i].nomeLocal + '<br/>';
            mensagem += '<strong>Data Contrato:</strong> ' + json[i].dataCadastro + '<br/>';
        }

        var mensagemContrato = new DialogoMensagens("prompt", 500, 450, 150, "4", "Atenção!", mensagem, "OK", "", false, "");
        mensagemContrato.Show();

        var scrollX, scrollY;
        if (document.all) {
            if (!document.documentElement.scrollLeft)
                scrollX = document.body.scrollLeft;
            else
                scrollX = document.documentElement.scrollLeft;

            if (!document.documentElement.scrollTop)
                scrollY = document.body.scrollTop;
            else
                scrollY = document.documentElement.scrollTop;
        } else {
            scrollX = window.pageXOffset;
            scrollY = window.pageYOffset;
        }

        Selector.$('prompt').style.height = 'auto';
        Selector.$('prompt').style.maxHeight = '640px';
        Selector.$('prompt').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (Selector.$('prompt').clientHeight / 2)) - 0) + 'px';

        avisoDecoracaoFesta = true;
        return false;
    }
}

function getEnderecoNumLocal() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=getEnderecoNumLocal';
    p += '&idLocal=' + Selector.$('local').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return '';
    }

    return ajax.getResponseText();
}

function GerarPdfContrato() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=GerarPdfContrato';
    p += '&idContrato=' + codigoAtual;
    p += '&valorPago=' + Selector.$('valorPago').value;
    p += '&saldoPagar=' + Selector.$('saldoPagar').value;
    p += '&obs=' + Selector.$('obs').value;

    ajax.Request(p);
    window.open(ajax.getResponseText());
}

function ExcluirPdfContrato(file_link) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=ExcluirPdfContrato';
    p += '&file_link=' + file_link;
    ajax.Request(p);
}

function EnviarContratoEmail() {

    if (Selector.$('email').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este cliente não possui e-mail cadastrado, cadastre um e-mail para enviar o contrato.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=EnviarContratoEmail';
    p += '&idContrato=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgContratoEmail').setAttribute('src', 'imagens/email.png');

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o contrato por email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "O pdf do contrato ainda não foi gerado. Clique para gerar o pdf do contrato.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('imgContratoEmail').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function AbrirEmail(codigo) {

    if (!isElement('div', 'divPromptEmail')) {
        var div = DOM.newElement('div', 'divPromptEmail');
        document.body.appendChild(div);
    }

    var div = Selector.$('divPromptEmail');

    div.innerHTML = "<h1 id='passunto' style='width:100%; margin:10px; margin-left:0px; margin-right:0px; height:30px; font-size:20px; overflow:auto; color:#4C4C4C'>Assunto</h1>" +
            "<div id='pmensagem' style='width:935px; overflow:auto; padding:10px; height:510px; background:#FFF>'</div>";

    dialogoEmail = new caixaDialogo('divPromptEmail', 630, 1000, 'padrao/', 130);
    dialogoEmail.Show();

    //div.style.backgroundColor = "#EDEDED";

    var ajax = new Ajax('POST', 'php/cadastro-de-clientes.php', false);
    var p = 'action=AbrirEmail';
    p += '&codigo=' + codigo;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText()  );
    Selector.$('passunto').innerHTML = json.assunto;
    Selector.$('pmensagem').innerHTML = json.mensagem;

    Selector.$('pmensagem').setAttribute('class', 'divbranca');
    Selector.$('pmensagem').setAttribute('style', 'width:935px; overflow:auto; padding:10px; height:510px; background:#FFF');

    if (json.anexos !== '0') {
        var json2 = JSON.parse(json.anexos  );

        Selector.$('pmensagem').innerHTML += "<BR><BR><STRONG>Anexos</STRONG>";
        for (var i = 0; i < json2.length; i++) {

            var vetor = json2[i].anexo.split(".");
            var extensao = vetor[vetor.length - 1].toLowerCase();

            if (extensao == "jpg" || extensao == "jpeg" || extensao == "png" || extensao == "bmp") {
                Selector.$('pmensagem').innerHTML += "<BR><a href= '" + json2[i].anexo + "' target='_blank'><img style='width:150px; vertical-align:middle; height:auto; margin:10px;'  src='" + json2[i].anexo + "'  /></a>";
            } else {
                Selector.$('pmensagem').innerHTML += "<BR><a href= '" + json2[i].anexo + "' target='_blank'>" + json2[i].arquivo + "</a>";
            }
        }
    }

    MostraEmails();
    getNotificacoesEmail();
}

function ExcluirEmail(codigo) {

    mensagemExcluirEmail = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este email?", "SIM", "ExcluirEmail_Aux(" + codigo + ")", true, "");
    mensagemExcluirEmail.Show();
}

function ExcluirEmail_Aux(codigo) {

    mensagemExcluirEmail.Close();

    var ajax = new Ajax('POST', 'php/cadastro-de-clientes.php', false);
    var p = 'action=ExcluirEmail';
    p += '&codigo=' + codigo;

    ajax.Request(p);

    if (ajax.getResponseText() !== '0') {
        MostraEmails();
    }
}

function pesquisarEmail() {

    if (Selector.$("botaopesquisaremails").value == "Pesquisando... Aguarde!")
        return;

    if (Selector.$('cliente').value <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, grave primeiro o cadastro.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    Selector.$("botaopesquisaremails").value = "Pesquisando... Aguarde!";

    gridEmail.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-clientes.php', true);
    var p = 'action=pesquisarEmailsdoCliente';
    p += '&idCliente=' + Selector.$('cliente').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$("botaopesquisaremails").value = "Pesquisar por emails novos";

        if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Nenhuma conta de email configurada no sistema!", "OK", "", false, "");
            mensagem.Show();            
        } else if (ajax.getResponseText() == '-2') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Atenção!", "Problemas para acessar a caixa de email, favor verificar seus dados de acesso!", "OK", "", false, "");
            mensagem.Show();
        } else if (ajax.getResponseText() == '-3') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Nenhum Cliente Cadastrado com este email!", "OK", "", false, "");
            mensagem.Show();
        }

        MostraEmails();
    };

    ajax.Request(p);
}

function totalizaParcelas() {

    var valorPago = gridPagamento.SumCol(3);
    Selector.$('valorPago2').value = Number.FormatMoeda(valorPago);
    var valor = Number.parseFloat(Selector.$('valorTotal2').value) - valorPago;
    Selector.$('saldoPagar2').value = (valor < 0 ? "0,00" : Number.FormatMoeda(valor.toString()));
}

function getIdadeAniversariante(dataNascimento, dataFesta) {

    if (!Date.isDate(dataNascimento) || !Date.isDate(dataFesta)) {
        return '';
    }

    if (dataNascimento.length == 10 && dataFesta.length == 10) {

        var anos = parseInt(dataFesta.substr(6, 4)) - parseInt(dataNascimento.substr(6, 4));
        var diaNascimento = dataNascimento.substr(0, 2);
        var mesNascimento = dataNascimento.substr(3, 2);
        var diaFesta = dataFesta.substr(0, 2);
        var mesFesta = dataFesta.substr(3, 2);

        if (mesNascimento > mesFesta) {
            return anos + " anos a completar";
        } else {
            if (diaNascimento > diaFesta && mesNascimento == mesFesta) {
                return anos + " anos a completar";
            } else {
                return anos + " anos completos ";
            }
        }

        if (anos <= 0) {
            return '';
        }
    } else {
        return '';
    }
}

function idadeAniversariante() {

    if (!Date.isDate(Selector.$('nascimento').value) || !Date.isDate(Selector.$('dataFesta').value)) {
        Selector.$('anosafazer').innerHTML = "";
        return;
    }

    if (Selector.$('nascimento').value.length == 10 && Selector.$('dataFesta').value.length == 10) {
        var anos = parseInt(Selector.$('dataFesta').value.substr(6, 4)) - parseInt(Selector.$('nascimento').value.substr(6, 4));
        var diaNascimento = Selector.$('nascimento').value.substr(0, 2);
        var mesNascimento = Selector.$('nascimento').value.substr(3, 2);
        var diaFesta = Selector.$('dataFesta').value.substr(0, 2);
        var mesFesta = Selector.$('dataFesta').value.substr(3, 2);

        if (mesNascimento > mesFesta) {
            Selector.$('anosafazer').innerHTML = anos + " anos a completar";
        } else {
            if (diaNascimento > diaFesta && mesNascimento == mesFesta) {
                Selector.$('anosafazer').innerHTML = anos + " anos a completar";
            } else {
                Selector.$('anosafazer').innerHTML = anos + " anos completos ";
            }
        }

        if (anos <= 0) {
            Selector.$('anosafazer').innerHTML = "";
        }
    } else {
        Selector.$('anosafazer').innerHTML = "";
    }
}

function ImprimirReciboPagamento(idParcela, linha) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=ImprimirReciboPagamento';
    p += '&idParcela=' + idParcela;

    var carregando = DOM.newElement('img');
    carregando.setAttribute('src', 'imagens/grid_carregando.gif');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gerar o recibo de pagamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
        } else {
            window.open(ajax.getResponseText());
            MostrarParcelas();
        }
    };

    gridPagamento.setCellObject(linha, 8, carregando);
    ajax.Request(p);
}

function ConfirmarPagamentoCliente(idParcela, linha) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=ConfirmarPagamentoCliente';
    p += '&idParcela=' + idParcela;
    p += '&valor=' + gridPagamento.getCellText(linha, 2);

    var carregando = DOM.newElement('img');
    carregando.setAttribute('src', 'imagens/grid_carregando.gif');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao confirmar o pagamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
        } else {
            MostrarParcelas();
        }
    };

    gridPagamento.setCellObject(linha, 7, carregando);
    ajax.Request(p);
}

function emitirComprovantePagamentos() {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Grave primeiro o contrato", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if(gridPagamento.getRowCount() <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Não há pagamentos realizados neste contrato.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if(parseFloat(Selector.$('valorPago2').value) <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Nenhum valor foi pago para esta festa.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=ImprimirReciboPagamentoTotal&codigo=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gerar o recibo de pagamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
        } else {
            window.open(ajax.getResponseText());
        }
    };

    ajax.Request(p);
}

function AprovarOpcional(idContratoCompSituacao, idContratoComp, linha) {
    
    if(idContratoCompSituacao == 1) {
        if (Number.parseFloat(Selector.$('percentualDesconto').value) == 0) {
            mensagemAprovarOpcional = new DialogoMensagens("prompt", 120, 380, 150, "4", "Atenção!", "Deseja realmente aprovar este item?", "OK", "AprovarOpcional_aux(" + idContratoCompSituacao + ", " + idContratoComp + ", " + linha + ");", true, "");
        } else {
            mensagemAprovarOpcional = new DialogoMensagens("prompt", 140, 380, 150, "4", "Atenção!", "Deseja realmente aprovar este item? (Obs: Existe percentual de desconto, favor verificar os valores.)", "OK", "AprovarOpcional_aux(" + idContratoCompSituacao + ", " + idContratoComp + ", " + linha + ");", true, "");
        }
    } else {
        mensagemAprovarOpcional = new DialogoMensagens("prompt", 120, 380, 150, "4", "Atenção!", "Deseja realmente desaprovar este item?", "OK", "AprovarOpcional_aux(" + idContratoCompSituacao + ", " + idContratoComp + ", " + linha + ");", true, "");
    }
    
    mensagemAprovarOpcional.Show();
}

function AprovarOpcional_aux(idContratoCompSituacao, idContratoComp, linha) {
    
    mensagemAprovarOpcional.Close();
    
    var situacao = DOM.newElement('label');
    situacao.innerHTML = (idContratoCompSituacao == 1 ? "Aprovado" : "Reprovado");
    
    gridOpcionais.setCellObject(linha, 7, situacao);
    
    var valorTotal = 0;
    
    if(gridOpcionais.getCellObject(linha, 7).nodeName == 'LABEL') {
        if (gridOpcionais.getCellObject(linha, 7).innerHTML == "Aprovado") {
            valorTotal = Number.getFloat(Selector.$('valorOpcionais').value.replace('.', '').replace(',', '.')) + Number.getFloat(gridOpcionais.getCellText(linha, 4).toString().replace('.', ''));
            
            Selector.$('valorOpcionais').value = Number.FormatMoeda(valorTotal.toFixed(2));
            var valor = Number.parseFloat(Selector.$('valor').value);
            var valorOpcionais = Number.parseFloat(Selector.$('valorOpcionais').value);
            var valorTotal = (valor + valorOpcionais);
            Selector.$('valorTotal').value = Number.FormatMoeda(valorTotal.toFixed(2));
            CalcularValorTotal();
        }
    }
    
    var ajax = new Ajax("POST", "php/cadastro-de-contratos.php", false);
    var p = "action=AprovarOpcional";
    p += "&idContratoCompSituacao=" + idContratoCompSituacao;
    p += "&idContratoComp=" + idContratoComp;
    p += "&idContrato=" + codigoAtual;
    p += "&valorOpcionais=" + Selector.$('valorOpcionais').value;
    p += "&valorTotal=" + Selector.$('valorTotal').value;
    
    ajax.Request(p);
    
    if(ajax.getResponseText() == "0") {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao fazer aprovação dos opcionais. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else if(ajax.getResponseText() == "-1") {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao fazer adição dos valores no contrato. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function MensagemDecoracao(){

    if(Select.GetText(Selector.$('decoracao')).toLowerCase().indexOf('indisponível') > 0){

        var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
        var p = 'action=MensagemDecoracao';
        p+= '&idDecoracao=' + Selector.$('decoracao').value;
        ajax.Request(p);

        if(parseInt(ajax.getResponseText()) == 0){
            return;
        }else{
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "A decoração " + Select.GetText(Selector.$('decoracao')).split('(')[0] + ' está sendo usada no contrato N° ' + ajax.getResponseText(), "OK", "", false, "");
            mensagem.Show();

            var obsInterna = Selector.$('obsInterna').value;
            Selector.$('obsInterna').value = '';
            obsInterna = "A decoração " + Select.GetText(Selector.$('decoracao')).split('(')[0] + ' está sendo usada no contrato N° ' + ajax.getResponseText() + '\n' + obsInterna;
            Selector.$('obsInterna').value = obsInterna;
        }
    }
}