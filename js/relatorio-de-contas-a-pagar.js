checkSessao();
CheckPermissao(79, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de Contas à Pagar</div>";
    carregarmenu();
    getDadosUsuario();

    getLojas(Selector.$('loja'), 'Selecione uma loja', false);
    ajustaAlturaTabela();
    var cmbSituacao = Selector.$('situacao');
    Select.AddItem(cmbSituacao, 'Todos', 0);
    Select.AddItem(cmbSituacao, 'Pagos', 1);
    Select.AddItem(cmbSituacao, 'Em aberto', 2);
    cmbSituacao.selectedIndex = 0;

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText(''),
        DOM.newText('Título'),
        DOM.newText('Parcela'),
        DOM.newText('C. Custo'),
        DOM.newText('Natureza'),
        DOM.newText('Origem'),
        DOM.newText('Nome'),
        DOM.newText('Obs.'),
        DOM.newText('Vencimento'),
        DOM.newText('Valor (R$)'),
        DOM.newText('Pago'),
        DOM.newText('(R$) Desconto'),
        DOM.newText('(R$) Juros'),
        DOM.newText('(R$) Pago'),
        DOM.newText('Pago em'),
        DOM.newText('Pago por'),
        DOM.newText('Obs. Pgto'),
        DOM.newText('Forma'),
        DOM.newText('Conta'),
        DOM.newText('')
    ]);

    Selector.$('divTabela').appendChild(grid.table);

    var retorno = Window.getParameter('return');
    if (retorno === null || retorno === '') {
        //SENÃO ESTIVER VINDO, CARREGA TUDO ASCINCRONO E COLOCA O INTERVALO DE DATAS DO MÊS ATUAL

        getCentrosCusto(Selector.$('custo'), "Filtrar por centro de custo", true);
        getNaturezas(Selector.$('natureza'), "Filtrar por natureza", true);
        getContasBancarias(Selector.$('conta'), "Filtrar por conta", true);
        getFornecedores(Selector.$('fornecedor'), "Filtrar por fornecedor", true);

        setDataDeAte(Selector.$('de'), Selector.$('ate'));
    } else {
        //ESTÁ RETORNANDO DA TELA DE CONTAS Á PAGAR

        getCentrosCusto(Selector.$('custo'), "Filtrar por centro de custo", false);
        getNaturezas(Selector.$('natureza'), "Filtrar por natureza", false);
        getContasBancarias(Selector.$('conta'), "Filtrar por conta", false);
        getFornecedores(Selector.$('fornecedor'), "Filtrar por fornecedor", false);

        var ajax = new Ajax('POST', 'php/relatorio-de-contas-a-pagar.php', false);
        ajax.Request('action=getP');

        var json = JSON.parse(ajax.getResponseText() || "[ ]");

        if (json.origem === '1') {
            Selector.$('artistas').checked = true;
            Selector.$('fornecedor').disabled = true;
        } else if (json.origem === '2') {
            Selector.$('fornecedores').checked = true;
            Selector.$('fornecedor').disabled = true;
        } else if (json.origem === '3') {
            Selector.$('funcionarios').checked = true;
            Selector.$('fornecedor').disabled = true;
        } else if (json.origem === '4') {
            Selector.$('vendedores').checked = true;
            Selector.$('fornecedor').disabled = true;
        } else {
            Selector.$('outros').checked = true;
            Selector.$('fornecedor').disabled = false;
        }

        Select.Show(Selector.$('custo'), json.idCentroCusto);
        Select.Show(Selector.$('natureza'), json.idNatureza);
        Select.Show(Selector.$('fornecedor'), json.idOrigem);

        Selector.$('de').value = json.de;
        Selector.$('ate').value = json.ate;

        if (json.porVencimento === 'true')
            Selector.$('vencimento').checked = true;
        else
            Selector.$('pagamento').checked = true;

        Select.Show(Selector.$('situacao'), json.idSituacao);
        Select.Show(Selector.$('conta'), json.idConta);
        Selector.$('obs').value = json.obs;
    }

    Pesquisar();
};

window.onresize = function () {
    ajustaAlturaTabela();
}

function ajustaAlturaTabela() {
    Selector.$('divTabela').style.height = ((document.documentElement.clientHeight - Selector.$('cabecalho').clientHeight - Selector.$('divBarraFerramentas').clientHeight) - 80) + "px";
}

function botExportar_onClick() {

    if(!CheckPermissao(82, true, 'Você não possui permissão para gerar excel do relatório de contas à pagar', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-contas-a-pagar.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&idCentroCusto=' + Selector.$('custo').value;
    p += '&idNatureza=' + Selector.$('natureza').value;

    if (Selector.$('artistas').checked) {
        p += '&origem=1';
    } else if (Selector.$('fornecedores').checked) {
        p += '&origem=2';
    } else if (Selector.$('funcionarios').checked) {
        p += '&origem=3';
    } else if (Selector.$('vendedores').checked) {
        p += '&origem=4';
    }

    p += '&idOrigem=' + Selector.$('fornecedor').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&porVencimento=' + Selector.$('vencimento').checked;
    p += '&idSituacao=' + Selector.$('situacao').value;
    p += '&idConta=' + Selector.$('conta').value;
    p += '&obs=' + Selector.$('obs').value;
    //p += '&comProjecao=' + Selector.$('projecao').checked;  
    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }
}

function Imprimir_onClick() {

    if(!CheckPermissao(81, true, 'Você não possui permissão para imprimir o relatório de contas à pagar', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-contas-a-pagar');
}

function d_gravarPagamento(linha) {

    var dataPago = Selector.$('p_dataPago');
    if (!Date.isDate(dataPago.value)) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Data de pagamento inválida", "OK", "", false, "p_dataPago");
        mensagem.Show();
        return;
    }

    var pagoPor = Selector.$('p_pagoPor');
    if (pagoPor.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione quem efetuou o pagamento", "OK", "", false, "p_pagoPor");
        mensagem.Show();
        return;
    }

    var formaPgto = Selector.$('p_formaPagamento');
    if (formaPgto.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a forma de pagamento", "OK", "", false, "p_formaPagamento");
        mensagem.Show();
        return;
    }

    var conta = Selector.$('p_conta');
    if (conta.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a conta", "OK", "", false, "p_conta");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-contas-a-pagar.php', true);
    var p = 'action=Pagar';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('p_gravarPagamento').value = 'Gravar';
        Selector.$('p_gravarPagamento').disabled = false;

        if (ajax.getResponseText() === 'ERRO') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Erro!", "Erro ao realizar o pagamento. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        Pesquisar();
        dialogoPagar.Close();
    };

    p += '&idParcela=' + grid.getRowData(linha);
    p += '&pago=' + Selector.$('p_chkPago').checked;
    p += '&dataPago=' + Selector.$('p_dataPago').value;
    p += '&valorDesconto=' + Selector.$('p_valorDesconto').value;
    p += '&valorJuros=' + Selector.$('p_valorJuros').value;
    p += '&valorPago=' + Selector.$('p_valorPago').value;
    p += '&idUsuarioPago=' + Selector.$('p_pagoPor').value;
    p += '&idFormaPagamento=' + Selector.$('p_formaPagamento').value;
    p += '&idConta=' + Selector.$('p_conta').value;
    p += '&obsPago=' + Selector.$('p_obsPagamento').value;

    ajax.Request(p);

    Selector.$('p_gravarPagamento').value = 'Gravando..';
    Selector.$('p_gravarPagamento').disabled = true;
}

function p_calcularValorPago(parcela) {

    var desconto = Selector.$('p_valorDesconto').value.trim();
    var juros = Selector.$('p_valorJuros').value.trim();

    parcela = Number.getFloat(parcela.toString().replace('.', ''));

    if (desconto !== '')
        desconto = Number.getFloat(desconto.toString().replace('.', ''));
    else
        desconto = 0;

    if (juros !== '')
        juros = Number.getFloat(juros.toString().replace('.', ''));
    else
        juros = 0;

    if (Number.getFloat(Selector.$('p_valorDesconto').value.toString().replace('.', '')) > Number.getFloat(Selector.$('p_valorPago').value.toString().replace('.', ''))) {

        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Valor do desconto não pode ser maior que o valor pago.", "OK", "", false, "p_valorDesconto");
        mensagem.Show();
        Selector.$('p_valorDesconto').value = '';
        return;
    }

    var aux = parcela + juros - desconto;
    Selector.$('p_valorPago').value = Number.FormatDinheiro(aux);
}

function Pagar(linha, pago) {

    if (linha < 0)
        return;

    if(!CheckPermissao(80, true, 'Você não possui permissão para pagar uma parcela', false)){
        return;
    }

    if (!isElement('div', 'promptPagar')) {
        var divPagar = DOM.newElement('div', 'promptPagar');
        document.body.appendChild(divPagar);
    }

    var div = Selector.$('promptPagar');
    var title = '';

    if (pago)
        title = "Editar Pagamento da Parcela N° " + grid.getCellText(linha, 2).toString().replace('/', ' de ');
    else
        title = "Efetuar Pagamento da Parcela N° " + grid.getCellText(linha, 2).toString().replace('/', ' de ');

    div.innerHTML = '';

    //----------Pago----------//

    var lblPago = DOM.newElement('label');
    lblPago.setAttribute("style", "color: #000; margin-left:2px;");
    lblPago.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblPago.appendChild(DOM.newText('Pago'));

    var chkPago = DOM.newElement('checkbox');
    chkPago.setAttribute('id', 'p_chkPago');
    chkPago.setAttribute("style", 'margin-left:1px;');

    //----------Valor da Parcela----------//

    var lblValorParcela = DOM.newElement('label');
    lblValorParcela.setAttribute("style", "color: #000; margin-left:37px; font-size:10px; color: gray");
    lblValorParcela.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorParcela.appendChild(DOM.newText('Valor Parcela (R$): '));

    var lblValorParcela2 = DOM.newElement('label');
    lblValorParcela2.setAttribute('id', 'p_valorParcela');
    lblValorParcela2.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorParcela2.setAttribute("style", 'margin-left:2px; font-size: 18px; font-weight: bold; color: gray');
    lblValorParcela2.appendChild(DOM.newText(grid.getCellText(linha, 9)));

    //----------Data Pago----------//

    var lblDataPago = DOM.newElement('label');
    lblDataPago.setAttribute("style", "color: #000; margin-left:2px;");
    lblDataPago.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblDataPago.appendChild(DOM.newText('Data Pago:'));

    var txtDataPago = DOM.newElement('text');
    txtDataPago.setAttribute('id', 'p_dataPago');
    txtDataPago.setAttribute('class', 'textbox_cinza');
    txtDataPago.setAttribute('size', '12');
    txtDataPago.setAttribute('class', 'textbox_cinza');
    txtDataPago.setAttribute("style", 'margin-left:25px; margin-top:10px; height:32px');

    //---------Valor Desconto---------//

    var lblValorDesconto = DOM.newElement('label');
    lblValorDesconto.setAttribute("style", "color: #000; margin-left:2px;");
    lblValorDesconto.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorDesconto.appendChild(DOM.newText('Desconto (R$):'));

    var txtValorDesconto = DOM.newElement('text');
    txtValorDesconto.setAttribute('id', 'p_valorDesconto');
    txtValorDesconto.setAttribute('class', 'textbox_cinza');
    txtValorDesconto.setAttribute('size', '12');
    txtValorDesconto.setAttribute('class', 'textbox_cinza');
    txtValorDesconto.setAttribute("style", 'margin-left:4px; margin-top:5px; text-align: right;  height:32px');

    //---------Valor Juros---------//

    var lblValorJuros = DOM.newElement('label');
    lblValorJuros.setAttribute("Style", "color: #000; margin-left:5px;");
    lblValorJuros.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorJuros.appendChild(DOM.newText('Juros (R$):'));

    var txtValorJuros = DOM.newElement('text');
    txtValorJuros.setAttribute('id', 'p_valorJuros');
    txtValorJuros.setAttribute('class', 'textbox_cinza');
    txtValorJuros.setAttribute('size', '12');
    txtValorJuros.setAttribute('class', 'textbox_cinza');
    txtValorJuros.setAttribute("Style", 'margin-left:4px; margin-top:5px; text-align: right;  height:32px');

    //---------Valor Pago---------//

    var lblValorPago = DOM.newElement('label');
    lblValorPago.setAttribute("Style", "color: #000; margin-left:2px;");
    lblValorPago.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValorPago.appendChild(DOM.newText('Pago (R$):'));

    var txtValorPago = DOM.newElement('text');
    txtValorPago.setAttribute('id', 'p_valorPago');
    txtValorPago.setAttribute('class', 'textbox_cinza');
    txtValorPago.setAttribute('size', '12');
    txtValorPago.setAttribute('readonly', 'readonly');
    txtValorPago.setAttribute('class', 'textbox_cinza');
    txtValorPago.setAttribute("Style", 'margin-left:27px; margin-top:5px; text-align: right; background-color: #DFE7EB;  height:32px');

    //---------Pago Por---------//

    var lblPagoPor = DOM.newElement('label');
    lblPagoPor.setAttribute("Style", "color: #000; margin-left:2px;");
    lblPagoPor.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblPagoPor.appendChild(DOM.newText('Pago Por:'));

    var cmbPagoPor = DOM.newElement('select');
    cmbPagoPor.setAttribute('id', 'p_pagoPor');
    cmbPagoPor.setAttribute('class', 'combo_cinza');
    cmbPagoPor.setAttribute("style", 'margin-left:32px; margin-top:5px; width: 280px;  height:32px');

    //---------Forma de Pagamento---------//

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.setAttribute("Style", "color: #000; margin-left:2px;");
    lblFormaPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblFormaPagamento.appendChild(DOM.newText('Forma Pgto.:'));

    var cmbFormaPagamento = DOM.newElement('select');
    cmbFormaPagamento.setAttribute('id', 'p_formaPagamento');
    cmbFormaPagamento.setAttribute('class', 'combo_cinza');
    cmbFormaPagamento.setAttribute("style", 'margin-left:16px; margin-top:5px; width: 118px;  height:32px');

    //---------Conta---------//

    var lblConta = DOM.newElement('label');
    lblConta.setAttribute("Style", "color: #000; margin-left:5px;");
    lblConta.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblConta.appendChild(DOM.newText('Conta:'));

    var cmbConta = DOM.newElement('select');
    cmbConta.setAttribute('id', 'p_conta');
    cmbConta.setAttribute('class', 'combo_cinza');
    cmbConta.setAttribute("style", 'margin-left:4px; margin-top:5px; width: 117px; margin-bottom:5px;  height:32px');

    //---------Obs. Pagamento---------//

    var lblObsPagamento = DOM.newElement('label');
    lblObsPagamento.setAttribute("Style", "color: #000; margin-left:2px;");
    lblObsPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblObsPagamento.appendChild(DOM.newText('Observação:'));

    var txtObsPagamento = DOM.newElement('textarea');
    txtObsPagamento.setAttribute('id', 'p_obsPagamento');
    txtObsPagamento.setAttribute('class', 'textbox_cinza');
    txtObsPagamento.setAttribute('rows', '5');
    txtObsPagamento.setAttribute('class', 'textbox_cinza');
    txtObsPagamento.setAttribute("Style", 'margin-left:2px; margin-top:5px; width: 365px;  height:70px');

    //----------Botões----------//

    var btnGravar = DOM.newElement('div');
    btnGravar.setAttribute('id', 'p_gravarPagamento');
    btnGravar.setAttribute('class', 'botao_div_cinza_com_sombra');
    btnGravar.setAttribute("Style", 'margin-top:10px; float:right; width: 80px;');
    btnGravar.innerHTML = 'Gravar';
    btnGravar.setAttribute('onclick', 'd_gravarPagamento(' + linha + ');');

    //----------Inserir na DIV---------//

    div.appendChild(chkPago);
    div.appendChild(lblPago);
    div.appendChild(lblValorParcela);
    div.appendChild(lblValorParcela2);
    div.innerHTML += "<br />";
    div.appendChild(lblDataPago);
    div.appendChild(txtDataPago);
    div.innerHTML += "<br />";
    div.appendChild(lblValorDesconto);
    div.appendChild(txtValorDesconto);
    div.appendChild(lblValorJuros);
    div.appendChild(txtValorJuros);
    div.innerHTML += "<br />";
    div.appendChild(lblValorPago);
    div.appendChild(txtValorPago);
    div.innerHTML += "<br />";
    div.appendChild(lblPagoPor);
    div.appendChild(cmbPagoPor);
    div.innerHTML += "<br />";
    div.appendChild(lblFormaPagamento);
    div.appendChild(cmbFormaPagamento);
    div.appendChild(lblConta);
    div.appendChild(cmbConta);
    div.innerHTML += "<br />";
    div.appendChild(lblObsPagamento);
    div.innerHTML += "<br />";
    div.appendChild(txtObsPagamento);
    div.innerHTML += "<br />";
    div.appendChild(btnGravar);

    //----------FIM-----------//

    dialogoPagar = new caixaDialogo('promptPagar', 400, 440, '../padrao/', 111);
    dialogoPagar.Show();

    Mask.setData(Selector.$('p_dataPago'));
    Mask.setMoeda(Selector.$('p_valorDesconto'));
    Mask.setMoeda(Selector.$('p_valorJuros'));
    Selector.$('p_valorDesconto').setAttribute('onblur', "p_calcularValorPago('" + grid.getCellText(linha, 9) + "')");
    Selector.$('p_valorJuros').setAttribute('onblur', "p_calcularValorPago('" + grid.getCellText(linha, 9) + "')");

    if (!pago) {
        //NOVA PAGAMENTO
        getFuncionarios(Selector.$('p_pagoPor'), "Selecione um funcionário", false);
        getFormasPagamentos(Selector.$('p_formaPagamento'), "Selecione uma forma de pagamento", true);
        getContasBancarias(Selector.$('p_conta'), 'Selecione uma conta', true);

        Selector.$('p_valorPago').value = grid.getCellText(linha, 9);
        Selector.$('p_chkPago').checked = true;
        Selector.$('p_dataPago').value = Date.GetDate(false);
        Select.Show(Selector.$('p_pagoPor'), Selector.$('nome_user').name);
    } else {

        //EDITAR PAGAMENTO
        getFuncionarios(Selector.$('p_pagoPor'), "Selecione um funcionário", false);
        getFormasPagamentos(Selector.$('p_formaPagamento'), "Selecione uma forma de pagamento", false);
        getContasBancarias(Selector.$('p_conta'), 'Selecione uma conta', false);

        if (grid.getCellObject(linha, 9).toString() === '')
            Selector.$('p_chkPago').checked = true;
        else
            Selector.$('p_chkPago').checked = false;

        Selector.$('p_dataPago').value = grid.getCellText(linha, 14);
        Selector.$('p_valorDesconto').value = grid.getCellText(linha, 11);
        Selector.$('p_valorJuros').value = grid.getCellText(linha, 12);
        Selector.$('p_valorPago').value = grid.getCellText(linha, 13);
        Select.ShowText(Selector.$('p_pagoPor'), grid.getCellText(linha, 15));
        Select.ShowText(Selector.$('p_formaPagamento'), grid.getCellText(linha, 16));
        Select.ShowText(Selector.$('p_conta'), grid.getCellText(linha, 18));
        Selector.$('p_obsPagamento').value = grid.getCellText(linha, 16);
    }

    Selector.$('p_dataPago').select();
    p_calcularValorPago(grid.getCellText(linha, 9));
}

function Visualizar(idTitulo) {

    if (idTitulo > 0)
        window.location = "cadastro-de-contas-a-pagar.html?source=relatorio-de-contas-a-pagar&idTitulo=" + idTitulo;
}

function Pesquisar() {

    var ajax = new Ajax('POST', 'php/relatorio-de-contas-a-pagar.php', true);
    grid.clearRows();

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('botPesquisar').innerHTML = 'Pesquisar';
        Selector.$('botPesquisar').disabled = false;

        if (ajax.getResponseText() === '-1') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var tolUlt = null;
        var pago = null;
        var visualizar = null;
        var cor = true;

        for (var i = 0; i < json.length; i++) {

            //==== SE ULTRAPASSOU A TOLERÊNCIA ======
            if (json[i].toleranciaUltrapassada === '-1') {
                tolUlt = DOM.newElement('img');
                tolUlt.setAttribute('src', 'imagens/exclamation.png');
                tolUlt.setAttribute('class', 'efeito-opacidade-75-03');
                tolUlt.setAttribute('style', 'width:18px; height:18px');
                tolUlt.setAttribute('title', 'Tolerância Ultrapassada!');
            }
            else {
                tolUlt = DOM.newElement('a');
                tolUlt.appendChild(DOM.newText(''));
            }

            //==== SE ESTÁ PAGO OU NÃO ======
            if (json[i].pago === '- - -') {

                if (json[i].projetado === '-1') {
                    pago = DOM.newElement('label');
                    pago.appendChild(DOM.newText('- - -'));
                } else {
                    pago = DOM.newElement('img', 'NÃO');
                    pago.setAttribute('src', 'imagens/money2.png');
                    pago.setAttribute('class', 'efeito-opacidade-75-03');
                    pago.setAttribute('style', 'width:18px; height:18px');
                    pago.setAttribute('title', 'Efetuar pagamento');
                    pago.setAttribute('onclick', 'Pagar(' + grid.getRowCount() + ', false)');
                }
            } else {
                pago = DOM.newElement('a', 'SIM');
                pago.setAttribute('onclick', 'Pagar(' + grid.getRowCount() + ', true)');
                pago.setAttribute('style', 'color:#333; cursor:pointer;');
                pago.setAttribute('title', 'Pago, clique para editar');
                pago.appendChild(DOM.newText('SIM'));
            }

            //==== VISUALIZAR PARCELA/TÍTULO ======
            visualizar = DOM.newElement('img');
            visualizar.setAttribute('class', 'efeito-opacidade-75-03');
            visualizar.setAttribute('src', 'imagens/pesquisar.png');
            visualizar.setAttribute('style', 'width:18px; height:18px');
            visualizar.setAttribute('title', 'Visualizar');
            visualizar.setAttribute('onclick', 'Visualizar(' + json[i].codigo + ')');

            var origem = '';
            var nome = '';

            if (json[i].artista !== '') {
                origem = 'Artista';
                nome = json[i].artista;
            } else if (json[i].fornecedor !== '') {
                origem = 'Fornecedores';
                nome = json[i].fornecedor;
            } else if (json[i].funcionario !== '') {
                origem = 'Funcionários';
                nome = json[i].funcionario;
            } else {
                origem = 'Vendedores';
                nome = json[i].vendedor;
            }

            grid.addRow([
                tolUlt,
                DOM.newText(json[i].titulo),
                DOM.newText(json[i].parcela),
                DOM.newText(json[i].centroCusto),
                DOM.newText(json[i].natureza),
                DOM.newText(origem),
                DOM.newText(nome),
                DOM.newText(json[i].obs),
                DOM.newText(json[i].dataVencimento),
                DOM.newText(json[i].valor),
                pago,
                DOM.newText(json[i].valorDesconto),
                DOM.newText(json[i].valorJuros),
                DOM.newText(json[i].valorPago),
                DOM.newText(json[i].dataPago),
                DOM.newText(json[i].pagoPor),
                DOM.newText(json[i].obsPgto),
                DOM.newText(json[i].formaPagamento),
                DOM.newText(json[i].conta),
                visualizar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idParcela);
            grid.getCell(grid.getRowCount() - 1, 0).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 1).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 2).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 3).style.textAlign = 'left';
            grid.getCell(grid.getRowCount() - 1, 4).style.textAlign = 'left';
            grid.getCell(grid.getRowCount() - 1, 5).style.textAlign = 'left';
            grid.getCell(grid.getRowCount() - 1, 6).style.textAlign = 'left';
            grid.getCell(grid.getRowCount() - 1, 7).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 8).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 9).style.textAlign = 'right';
            grid.getCell(grid.getRowCount() - 1, 10).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 11).style.textAlign = 'right';
            grid.getCell(grid.getRowCount() - 1, 12).style.textAlign = 'right';
            grid.getCell(grid.getRowCount() - 1, 13).style.textAlign = 'right';
            grid.getCell(grid.getRowCount() - 1, 14).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 15).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 16).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 17).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 18).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 19).style.textAlign = 'center';

            grid.getRow(grid.getRowCount() - 1).setAttribute('class', 'cor');

            if (cor) {
                grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'background-color:#F7F7F7');
                cor = false;
            } else {
                cor = true;
            }

            //==== SE ESTÁ VENCIDO, PINTA O TEXTO DE VERMELHO ======
            if (json[i].vencido === '1') {
                if (json[i].pago === '- - -')
                    grid.setRowForegroundColor(grid.getRowCount() - 1, '#CC0000');
            }

            //==== SE É PROJEÇÃO, PINTA O TEXTO DE VERDE ======
            if (json[i].projetado === '-1')
                grid.setRowForegroundColor(grid.getRowCount() - 1, '#000099');
        }

        var total = DOM.newElement('label');
        total.innerHTML = "<strong style='font-size:14px; float:left;'>TOTAL (" + grid.getRowCount() + ")</strong>";

        grid.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            total,
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(Number.FormatDinheiro(grid.SumColnoFixed(9))),
            DOM.newText(''),
            DOM.newText(Number.FormatDinheiro(grid.SumColnoFixed(11))),
            DOM.newText(Number.FormatDinheiro(grid.SumColnoFixed(12))),
            DOM.newText(Number.FormatDinheiro(grid.SumColnoFixed(13))),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);

        grid.getCell(grid.getRowCount() - 1, 1).setAttribute('colspan', '1');
        grid.getCell(grid.getRowCount() - 1, 2).setAttribute('colspan', '1');
        grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'text-align:right; width:100px; font-weight:bold; font-size:14px;');
        grid.getCell(grid.getRowCount() - 1, 11).setAttribute('style', 'text-align:right; width:100px; font-weight:bold; font-size:14px;');
        grid.getCell(grid.getRowCount() - 1, 12).setAttribute('style', 'text-align:right; width:100px; font-weight:bold; font-size:14px;');
        grid.getCell(grid.getRowCount() - 1, 13).setAttribute('style', 'text-align:right; width:100px; font-weight:bold; font-size:14px;');
    };

    var p = 'action=Pesquisar';
    p += '&idCentroCusto=' + Selector.$('custo').value;
    p += '&idNatureza=' + Selector.$('natureza').value;
    p += '&origem=' + Selector.$('cmbOrigem').value;
    p += '&loja=' + Selector.$('loja').value;
    p += '&idOrigem=' + Selector.$('fornecedor').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&porVencimento=' + Selector.$('vencimento').checked;
    p += '&idSituacao=' + Selector.$('situacao').value;
    p += '&idConta=' + Selector.$('conta').value;
    p += '&obs=' + Selector.$('obs').value;

    Selector.$('botPesquisar').innerHTML = 'Pesquisando...';
    Selector.$('botPesquisar').disabled = true;

    ajax.Request(p);
}

function Limpar() {

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Selector.$('obs').value = "";
    Selector.$('custo').selectedIndex = 0;
    Selector.$('natureza').selectedIndex = 0;
    Selector.$('situacao').selectedIndex = 0;
    Selector.$('conta').selectedIndex = 0;
    Selector.$('fornecedor').selectedIndex = 0;
    Selector.$('artistas').checked = true;
    grid.clearRows();
}