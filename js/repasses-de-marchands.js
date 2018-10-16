checkSessao();
CheckPermissao(101, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Repasses de Marchands</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getLojas(Selector.$('loja'), 'Todas', true);
    getMarchandsGerentes(Selector.$('marchand'), 'Todos', true, 0, 0);    
    Pesquisar();
    
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";    
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function SelecionarTodos() {

    for (var i = 0; i < grid.getRowCount(); i++) {

        if (!grid.getCellObject(i, 0).disabled) {
            grid.getCellObject(i, 0).checked = Selector.$('chkSelTodos').checked;
        }
    }
}

function Pesquisar() {

    if(Selector.$('marchand').value > 0 && Selector.$('situacao').value == '1'){
        Selector.$('btFechar').style.display = 'inline-block';
    }else{
        Selector.$('btFechar').style.display = 'none';
    }

    if (Selector.$('botPesquisar').value == 'Pesquisando...')
        return;

    Selector.$('tabela').innerHTML = "";

    var dataDe = Selector.$('de');
    var dataAte = Selector.$('ate');

    if(dataDe.value.trim() == ''){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor preencher o campo de.", "OK", "", false, "de");
        mensagem.Show();
        return;
    }

    if(dataAte.value.trim() == ''){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor preencher o campo até.", "OK", "", false, "ate");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/repasses-de-marchands.php', true);
    var p = 'action=Pesquisar';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('loja').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&situacao=' + Selector.$('situacao').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhuma venda localizada";
            Selector.$('botPesquisar').value = 'Pesquisar';
            Selector.$('tabela').style.minHeight = '30px';
            Selector.$('tabela').innerHTML = '<label style="font-family: PT Sans, RobotoBlack, RobotoCondensed, Arial, Helvetica, sans-serif;">Nenhum registro encontrado</label>';
            return;
        }

        var div = Selector.$('tabela');

        grid = new Table('grid');
        grid.table.setAttribute('cellpadding', '3');
        grid.table.setAttribute('cellspacing', '0');
        grid.table.setAttribute('class', 'tabela_cinza_foco');

        var checkTodos = DOM.newElement('checkbox', 'chkSelTodos');
        checkTodos.setAttribute('onclick', 'SelecionarTodos()');

        grid.addHeader([
            checkTodos,
            DOM.newText('Loja'),
            DOM.newText('N° Pedido'),
            DOM.newText('Data Pedido'),
            DOM.newText('Marchand'),
            DOM.newText('Obras'),
            DOM.newText('Valor Total'),
            DOM.newText('Parcelas'),
            DOM.newText('Comissão'),
            DOM.newText('Comissão Parcela'),
            DOM.newText('Situação'),
            DOM.newText('')
        ]);

        div.appendChild(grid.table);

        if(Selector.$('situacao').value == '1'){
            grid.hiddenCol(11);
        }

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var cor;
        var check;
        var parcelas;
        var verConpag;
        var obras;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('span');
            obras.innerHTML = json[i].obras;

            parcelas = DOM.newElement('span');
            parcelas.setAttribute('style', 'text-decoration:underline; cursor:pointer');
            parcelas.setAttribute('title', 'Ver detalhes de pagamento do pedido');
            parcelas.setAttribute('onclick', 'PromptPagamentoPedido(' + parseInt(json[i].numeroPedido) + ')');
            parcelas.innerHTML = json[i].parcelas;
            parcelas.setAttribute('id', json[i].idVendaParcela);

            check = DOM.newElement('checkbox');
            check.disabled = (Selector.$('situacao').value == '1' ? false : true);
            check.checked = (Selector.$('situacao').value == '1' ? false : true);

            verConpag = DOM.newElement('img');
            verConpag.setAttribute('src', 'imagens/pesquisar.png');
            verConpag.setAttribute('style', 'cursor:pointer;');
            verConpag.setAttribute('title', 'Ver conpag');
            verConpag.setAttribute('onclick', 'window.location="cadastro-de-contas-a-pagar.html?source=repasses-de-marchands&idConpag=' + json[i].idConpag + '"');

            grid.addRow([
                check,
                DOM.newText(json[i].loja),
                DOM.newText(json[i].numeroPedido),
                DOM.newText(json[i].dataVenda),
                DOM.newText(json[i].vendedor),
                obras,
                DOM.newText(json[i].valorTotal),
                parcelas,
                DOM.newText(json[i].comissao),
                DOM.newText(json[i].comissaoParcela),
                DOM.newText(json[i].situacao),
                verConpag
            ]);

            if(Selector.$('situacao').value == '1'){
                grid.hiddenCol(11);
            }

            grid.setRowData(grid.getRowCount() - 1, json[i].idVendaComp);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:25px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:70px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:90px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:right; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:right; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'text-align:right; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 11).setAttribute('style', 'text-align:center;');

            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }

        grid.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText((Selector.$('situacao').value == '1' ? 'Total à Pagar' : 'Total Pago')),
            DOM.newText(Number.FormatMoeda(grid.SumCol(8))),
            DOM.newText(Number.FormatMoeda(grid.SumCol(9))),
            DOM.newText(''),
            DOM.newText('')
        ]);

        if(Selector.$('situacao').value == '1'){
            grid.hiddenCol(11);
        }
        
        grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');        
        grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'font-size:15px; text-align:center;');
        grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'font-size:15px; text-align:right; width:100px;');
        grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'font-size:15px; text-align:right; width:100px;');

        Selector.$('contador').innerHTML = json.length + " vendas(s) localizada(s)";
        Selector.$('botPesquisar').value = 'Pesquisar';
    };

    Selector.$('botPesquisar').value = 'Pesquisando...';
    ajax.Request(p);
}

function PromptFecharRepasses(){

    if(!CheckPermissao(102, true, 'Você não possui permissão para fazer o fechamentos dos repasses', false)){
        return;
    }

    if(Selector.$('loja').selectedIndex <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Favor selecionar uma loja", "OK", "", false, "loja");
        mensagem.Show();
        return;
    }

    if(grid.getSelCount(0) <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Favor selecionar uma ou mais vendas para fechar", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (!isElement('div', 'divPromptFecharRepasses')) {
        var div = DOM.newElement('div', 'divPromptFecharRepasses');
        document.body.appendChild(div);
    }

    var divPromptFecharRepasses = Selector.$('divPromptFecharRepasses');
    divPromptFecharRepasses.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptFecharRepasses.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var divCentroCusto = DOM.newElement('div');
    divCentroCusto.setAttribute('class', 'divcontainer');
    divCentroCusto.setAttribute('style', 'max-width:250px;');

    var lblCentroCusto = DOM.newElement('label');
    lblCentroCusto.innerHTML = "Centro de Custo <span style='color:red'>*</span>";

    var cmbCentroCusto = DOM.newElement('select', 'centroCusto');
    cmbCentroCusto.setAttribute('class', 'combo_cinzafoco');
    cmbCentroCusto.setAttribute('style', 'width:100%');

    divCentroCusto.appendChild(lblCentroCusto);
    divCentroCusto.appendChild(cmbCentroCusto);

    var divNatureza = DOM.newElement('div');
    divNatureza.setAttribute('class', 'divcontainer');
    divNatureza.setAttribute('style', 'max-width:250px; margin-left:10px;');

    var lblNatureza = DOM.newElement('label');
    lblNatureza.innerHTML = "Natureza <span style='color:red'>*</span>";

    var cmbNatureza = DOM.newElement('select', 'natureza');
    cmbNatureza.setAttribute('class', 'combo_cinzafoco');
    cmbNatureza.setAttribute('style', 'width:100%');

    divNatureza.appendChild(lblNatureza);
    divNatureza.appendChild(cmbNatureza);

    var divValorTotal = DOM.newElement('div');
    divValorTotal.setAttribute('class', 'divcontainer');
    divValorTotal.setAttribute('style', 'max-width:160px;');

    var lblValorTotal = DOM.newElement('label');
    lblValorTotal.innerHTML = "Valor Total";
    lblValorTotal.setAttribute("style", "text-align:center");

    var txtValorTotal = DOM.newElement('text', 'valorTotal');
    txtValorTotal.setAttribute('class', 'textbox_cinzafoco');
    txtValorTotal.setAttribute('style', 'width:100%; text-align:right; background-color:#F5F5F5;');
    txtValorTotal.disabled = true;

    divValorTotal.appendChild(lblValorTotal);
    divValorTotal.appendChild(txtValorTotal);

    var divQtdParcelas = DOM.newElement('div');
    divQtdParcelas.setAttribute('class', 'divcontainer');
    divQtdParcelas.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblQtdParcelas = DOM.newElement('label');
    lblQtdParcelas.innerHTML = "Qtde. Parcelas <span style='color:red'>*</span>";
    lblQtdParcelas.setAttribute("style", "text-align:center");

    var txtQtdParcelas = DOM.newElement('text', 'qtdParcelas');
    txtQtdParcelas.setAttribute('class', 'textbox_cinzafoco');
    txtQtdParcelas.setAttribute('style', 'width:100%; text-align:right;');

    divQtdParcelas.appendChild(lblQtdParcelas);
    divQtdParcelas.appendChild(txtQtdParcelas);

    var divVencimento = DOM.newElement('div');
    divVencimento.setAttribute('class', 'divcontainer');
    divVencimento.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblVencimento = DOM.newElement('label');
    lblVencimento.innerHTML = "1° Vencimento <span style='color:red'>*</span>";
    lblVencimento.setAttribute("style", "text-align:center");

    var txtVencimento = DOM.newElement('text', 'primeiroVencimento');
    txtVencimento.setAttribute('class', 'textbox_cinzafoco');
    txtVencimento.setAttribute('style', 'width:100%; text-align:right;');

    divVencimento.appendChild(lblVencimento);
    divVencimento.appendChild(txtVencimento);

    var btGerarParcelas = DOM.newElement('button', 'btGerarParcelas');
    btGerarParcelas.setAttribute('class', 'botaosimplesfoco');
    btGerarParcelas.setAttribute('style', 'margin-left:10px; vertical-align:middle');
    btGerarParcelas.setAttribute('onclick', 'GerarParcelasRepasses();');
    btGerarParcelas.innerHTML = "Gerar Parcelas";

    var divParcelas = DOM.newElement('div', 'divParcelas');
    divParcelas.setAttribute('style', 'width:100%; height:200px; overflow:auto');

    var cmdTexto1 = DOM.newElement('button', 'btFechar2');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'FecharRepasses();');
    cmdTexto1.innerHTML = "Fechar";

    var label = DOM.newElement('label');
    label.innerHTML = 'Cancelar';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle; float:right; margin-top:5px;');
    label.setAttribute('onclick', 'Selector.$("divPromptFecharRepasses").setAttribute("class", "divbranca"); dialogoFecharRepasses.Close();');
    label.innerHTML = 'Cancelar';

    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br><br>';
    divform.appendChild(divCentroCusto);
    divform.appendChild(divNatureza);
    divform.appendChild(divValorTotal);
    divform.appendChild(divQtdParcelas);
    divform.appendChild(divVencimento);
    divform.appendChild(btGerarParcelas);
    divform.innerHTML += '<br>';
    divform.appendChild(divParcelas);
    divform.innerHTML += '<br><br>';
    divform.appendChild(label);
    divform.appendChild(cmdTexto1);

    dialogoFecharRepasses = new caixaDialogo('divPromptFecharRepasses', 465, 600, '../padrao/', 140);
    dialogoFecharRepasses.Show();

    gridParcelas = new Table('gridParcelas');
    gridParcelas.table.setAttribute('cellpadding', '4');
    gridParcelas.table.setAttribute('cellspacing', '0');
    gridParcelas.table.setAttribute('class', 'tabela_cinza_foco');

    gridParcelas.addHeader([
        DOM.newText('N°'),
        DOM.newText('Valor'),
        DOM.newText('Vencimento')
    ]);

    Selector.$('divParcelas').appendChild(gridParcelas.table);

    getCentrosCusto(Selector.$('centroCusto'), 'Selecione um centro de custo', true);
    getNaturezas(Selector.$('natureza'), 'Selecione uma natureza', true);
    Selector.$('centroCusto').focus();

    Selector.$('valorTotal').value = Number.FormatMoeda(grid.SumColChecked(9));
    Mask.setOnlyNumbers(Selector.$('qtdParcelas'));
    Selector.$('qtdParcelas').value = 1;
    Mask.setData(Selector.$('primeiroVencimento'));
}

function GerarParcelasRepasses(){

    if(Selector.$('qtdParcelas').value.trim() == '0' || Selector.$('qtdParcelas').value.trim() == ''){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor informar a quantidade de parcelas", "OK", "", false, "qtdParcelas");
        mensagem.Show();
        return;
    }

    if(Selector.$('primeiroVencimento').value.trim() == ''){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor informar a primeira data de vencimento", "OK", "", false, "primeiroVencimento");
        mensagem.Show();
        return;
    }

    if (gridParcelas.getRowCount() > 0) {

        if (!confirm('Já existem parcelas geradas, ao gerar novas parcelas as antigas serão excluídas. Deseja continuar?'))
            return;
    }

    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth();
    var ano = data.getFullYear();
    var totalParcelas = parseInt(Selector.$('qtdParcelas').value);
    var valorTotal = Selector.$('valorTotal').value;

    var valorParcela = Number.parseFloat(valorTotal) / totalParcelas;

    var diferenca = valorTotal - (valorParcela * totalParcelas);

    for (var i = 0; i < totalParcelas; i++) {

        var valor = valorParcela;

        if (diferenca > 0 && i == 0)
            var valor = valorParcela + diferenca;
        else
            var valor = valorParcela;

        var txtparc = DOM.newElement('text');
        txtparc.setAttribute('class', 'textbox_cinzafoco');
        txtparc.setAttribute("style", 'width:120px; text-align:center; margin:0px; background:#FFF');
        Mask.setOnlyNumbers(txtparc);
        txtparc.value = Number.FormatDinheiro(valor);

        var txtdata = DOM.newElement('text');
        txtdata.setAttribute('class', 'textbox_cinzafoco');
        txtdata.setAttribute("style", 'width:120px; text-align:center; margin:0px; background:#FFF');
        Mask.setData(txtdata);
        txtdata.value = SomarMes(Selector.$('primeiroVencimento').value, i);

        gridParcelas.addRow([
            DOM.newText(gridParcelas.getRowCount() + 1),
            txtparc,
            txtdata
        ]);

        gridParcelas.getCell(gridParcelas.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px;');
        gridParcelas.getCell(gridParcelas.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
        gridParcelas.getCell(gridParcelas.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
    }

    pintaLinhaGrid(gridParcelas);
}

function SomarMes(data, meses) {

    data = data.split('/');
    if (data[1].substr(0, 1) === '0') {
        data[1] = data[1].replace('0', '');
    }

    dia = parseInt(data[0]);
    mes = parseInt(data[1]);
    ano = parseInt(data[2]);
    mes = mes + meses;
    while (mes > 12) {
        mes = mes - 12;
        ano++;
    }

    if (mes.toString().length === 1) {
        mes = "0" + mes.toString();
    }

    if (dia.toString().length === 1) {
        dia = "0" + dia.toString();
    }

    while (VerificaData(dia.toString() + "/" + mes.toString() + "/" + ano) === false) {
        dia--;
    }

    return dia + "/" + mes + "/" + ano;
}

function VerificaData(digData) {

    var bissexto = 0;
    var data = digData;
    var tam = data.length;
    if (tam === 10)
    {
        var dia = data.substr(0, 2);
        var mes = data.substr(3, 2);
        var ano = data.substr(6, 4);
        if ((ano > 1900) || (ano < 2100))
        {
            switch (mes)
            {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    if (dia <= 31)
                    {
                        return true;
                    }
                    break

                case '04':
                case '06':
                case '09':
                case '11':
                    if (dia <= 30)
                    {
                        return true;
                    }
                    break
                case '02':
                    /* Validando ano Bissexto / fevereiro / dia */
                    if ((ano % 4 == 0) || (ano % 100 == 0) || (ano % 400 == 0))
                    {
                        bissexto = 1;
                    }
                    if ((bissexto == 1) && (dia <= 29))
                    {
                        return true;
                    }
                    if ((bissexto != 1) && (dia <= 28))
                    {
                        return true;
                    }
                    break
            }
        }
    }

    return false;
}

function FecharRepasses(){

    if(Selector.$('centroCusto').selectedIndex <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor selecionar um centro de custo", "OK", "", false, "centroCusto");
        mensagem.Show();
        return;
    }

    if(Selector.$('natureza').selectedIndex <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor selecionar uma natureza", "OK", "", false, "natureza");
        mensagem.Show();
        return;
    }

    if(gridParcelas.getRowCount() <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor gerar as parcelas para realizar o fechamento", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var arrayIdVendas = new Array();
    var arrayParcelas = new Array();
    var arrayComissoes = new Array();
    var arrayComissoesParcela = new Array();
    var arrayIdVendasComp = new Array();
    var arrayIdVendasParcela = new Array();

    for(var i = 0; i < grid.getRowCount() -1; i++){

        if(grid.getCellObject(i, 0).checked){
            arrayIdVendas.push(parseInt(grid.getCellText(i, 2)));
            arrayParcelas.push(grid.getCellObject(i, 7).innerHTML.split('de')[0].trim());
            arrayComissoes.push(Number.ValorE(grid.getCellText(i, 8)));
            arrayComissoesParcela.push(Number.ValorE(grid.getCellText(i, 9)));
            arrayIdVendasComp.push(grid.getRowData(i));
            arrayIdVendasParcela.push(grid.getCellObject(i, 7).id);
        }
    }

    var ajax = new Ajax('POST', 'php/repasses-de-marchands.php', true);
    var p = 'action=FecharRepasses';
    p+= '&de=' + Selector.$('de').value;
    p+= '&ate=' + Selector.$('ate').value;
    p+= '&idCentroCusto=' + Selector.$('centroCusto').value;
    p+= '&idNatureza=' + Selector.$('natureza').value;
    p+= '&idLoja=' + Selector.$('loja').value;
    p+= '&idMarchand=' + Selector.$('marchand').value;
    p+= '&idVenda=' + arrayIdVendas;
    p+= '&idVendaComp=' + arrayIdVendasComp;
    p+= '&idVendaParcela=' + arrayIdVendasParcela;
    p+= '&parcela=' + arrayParcelas;
    p+= '&comissao=' + arrayComissoes;
    p+= '&comissaoParcela=' + arrayComissoesParcela;
    p+= '&valorTotal=' + Selector.$('valorTotal').value;
    p+= '&qtdParcelas=' + Selector.$('qtdParcelas').value;

    //PARCELAS
    p += '&numsParcelas=' + gridParcelas.getContentRows(0);
    p += '&valoresParcelas=' + gridParcelas.getContentObjectValueMoneyRows(1);
    p += '&vencimentosParcelas=' + gridParcelas.getContentObjectValueRows(2);

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        Selector.$('btFechar2').innerHTML = 'Fechar';

        if(ajax.getResponseText() != 'OK'){
            console.log(ajax.getResponseText());
            var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro!", "Erro ao fechar os repasses, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();            
        }else{

            Limpar();
            dialogoFecharRepasses.Close();
            var mensagem = new DialogoMensagens("prompt1", 120, 500, 150, "4", "Sucesso!", "Fechamento do repasse realizado com sucesso!", "OK", "", false, "");
            mensagem.Show();
        }
    };

    Selector.$('btFechar2').innerHTML = 'Fechando...';
    ajax.Request(p);
}

function Limpar(){

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Selector.$('loja').value = 0;
    Selector.$('marchand').value = 0;
    Selector.$('situacao').value = 1;
    Pesquisar();
}

function Imprimir_onClick() {

    if(!CheckPermissao(103, true, 'Você não possui permissão para imprimir o repasses de marchands', false)){
        return;
    }

    if(!isElement('table', 'grid')){
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=repasses-de-marchands');
}

function botExportar_onClick() {

    if(!CheckPermissao(104, true, 'Você não possui permissão para gerar o excel dos repasses dos marchands', false)){
        return;
    }

    if(!isElement('table', 'grid')){
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/repasses-de-marchands.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('loja').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&situacao=' + Selector.$('situacao').value;

    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }
}

function PromptPagamentoPedido(idVenda){

    if (!isElement('div', 'divPromptPagamentoPedido')) {
        var div = DOM.newElement('div', 'divPromptPagamentoPedido');
        document.body.appendChild(div);
    }

    var divPromptPagamentoPedido = Selector.$('divPromptPagamentoPedido');
    divPromptPagamentoPedido.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptPagamentoPedido.appendChild(divform);

    var lblTitulo = DOM.newElement('label');
    lblTitulo.innerHTML = 'Pagamentos do Pedido N° ' + Number.Complete(idVenda, 5, '0', true);

    var divPagamento = DOM.newElement('div', 'divPagamento');
    divPagamento.setAttribute('style', 'width:100%; height:260px; overflow:auto');

    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(divPagamento);

    dialogoPagamentoPedido = new caixaDialogo('divPromptPagamentoPedido', 350, 600, '../padrao/', 140);
    dialogoPagamentoPedido.Show();

    gridPagamentosPedido = new Table('gridPagamentosPedido');
    gridPagamentosPedido.table.setAttribute('cellpadding', '4');
    gridPagamentosPedido.table.setAttribute('cellspacing', '0');
    gridPagamentosPedido.table.setAttribute('class', 'tabela_cinza_foco');

    gridPagamentosPedido.addHeader([
        DOM.newText('N°'),
        DOM.newText('Valor'),
        DOM.newText('Situação')
    ]);

    Selector.$('divPagamento').appendChild(gridPagamentosPedido.table);

    var ajax = new Ajax('POST', 'php/repasses-de-marchands.php', false);
    var p = 'action=getPagamentosPedidos';
    p+= '&idVenda=' + idVenda;
    ajax.Request(p);

    if(ajax.getResponseText() != '0'){

        var json = JSON.parse(ajax.getResponseText() || "[ ]");

        for (var i = 0; i < json.length; i++) {

            var status = DOM.newElement('label');
            status.setAttribute('style', 'font-size:11px');
            status.innerHTML = "Pago em " + json[i].cadastro + ' por ' + json[i].forma + ' ' + (json[i].recibo == "" ? "" : "- Nº Recibo " + json[i].recibo) + " para " + json[i].dataPara;

            gridPagamentosPedido.addRow([
                DOM.newText(json[i].parcela),
                DOM.newText(json[i].valor),
                DOM.newText(status.innerHTML)
            ]);

            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 1).setAttribute('style', 'text-align:right; width:70px;');
            gridPagamentosPedido.getCell(gridPagamentosPedido.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');

            pintaLinhaGrid(gridPagamentosPedido);
        }
    }
}