checkSessao();
CheckPermissao(86, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de Antecipações</div>";
    carregarmenu();
    getDadosUsuario();

    getFormasPagamentos(Selector.$('formaPagamento'), 'Todas', true);
    getLojas(Selector.$('galeria'), 'Todas', true);

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    
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

    if (Selector.$('botPesquisar').value == 'Pesquisando...')
        return;

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-antecipacoes.php', true);
    var p = 'action=Pesquisar';
    p += '&idFormaPagamento=' + Selector.$('formaPagamento').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&situacao=' + Selector.$('situacao').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhuma parcela localizada";
            Selector.$('botPesquisar').value = 'Pesquisar';
            Selector.$('tabela').style.minHeight = '30px';
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
            DOM.newText('N° Pedido'),
            DOM.newText('Data Pedido'),
            DOM.newText('Loja'),
            DOM.newText('Cliente'),
            DOM.newText('Obras'),
            DOM.newText('Parcela'),
            DOM.newText('Valor'),
            DOM.newText('Data Compensação'),
            DOM.newText('Situação'),
            DOM.newText('')
        ]);

        div.appendChild(grid.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var excluir;
        var obras;
        var cor;
        var check;
        var numeroVenda;
        var valorAntecipacao = 0;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir Antecipação');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirAntecipacaoAux(' + grid.getRowCount() + ')');

            check = DOM.newElement('checkbox');
            check.setAttribute('id', json[i].idVenda);
            check.disabled = (Selector.$('situacao').value == '1' ? false : true);
            check.checked = (Selector.$('situacao').value == '1' ? false : true);

            numeroVenda = DOM.newElement('span', json[i].idVendaParcela);
            numeroVenda.innerHTML = json[i].numeroVenda;

            valorAntecipacao += Number.parseFloat(json[i].valorAntecipacao);

            grid.addRow([
                check,
                numeroVenda,
                DOM.newText(json[i].dataVenda),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].parcelas),
                DOM.newText(json[i].valor),
                DOM.newText(json[i].dataCompensacao),
                DOM.newText(json[i].situacao),
                excluir
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idVendaParcelaAntecipacao);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:25px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:75px;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:right; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:120px;');
            grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:40px;');

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
            DOM.newText('Total'),
            DOM.newText(''),
            DOM.newText(Number.FormatMoeda(grid.SumCol(7))),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);
        
        grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');        
        grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'font-size:18px; text-align:center;');
        grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'font-size:18px; text-align:right; width:100px;');

        if(Selector.$('situacao').value == '2'){

            grid.addRow([
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText('Total Antecipação'),
                DOM.newText(''),
                DOM.newText(Number.FormatDinheiro(valorAntecipacao)),
                DOM.newText(''),
                DOM.newText(''),
                DOM.newText('')
            ]);
        
            grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');        
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'font-size:18px; text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'font-size:18px; text-align:right; width:100px;');
        }

        Selector.$('contador').innerHTML = json.length + " parcelas(s) localizada(s)";
        Selector.$('botPesquisar').value = 'Pesquisar';
    };

    Selector.$('botPesquisar').value = 'Pesquisando...';
    ajax.Request(p);
}

function EsconderBotaoAntecipar(){
        
    Selector.$('btAntecipar').style.display = (Selector.$('situacao').value == '1' ? 'inline-block' : 'none');
}

function PromptAnteciparParcelas(){

    if(!CheckPermissao(88, true, 'Você não possui permissão para antecipar', false)){
        return;
    }

    if(Selector.$('formaPagamento').selectedIndex <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor selecionar uma forma de pagamento.", "OK", "", false, "formaPagamento");
        mensagem.Show();
        return false;
    }

    if(grid.getSelCount(0) <= 0){
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Favor selecionar uma ou mais parcelas para antecipar", "OK", "", false, "");
        mensagem.Show();
        return false;
    }

    if (!isElement('div', 'divPromptAnteciparParcelas')) {
        var div = DOM.newElement('div', 'divPromptAnteciparParcelas');
        document.body.appendChild(div);
    }

    var divPromptAnteciparParcelas = Selector.$('divPromptAnteciparParcelas');
    divPromptAnteciparParcelas.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptAnteciparParcelas.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    var divData = DOM.newElement('div');
    divData.setAttribute('class', 'divcontainer');
    divData.setAttribute('style', 'max-width:110px;');

    var lblData = DOM.newElement('label');
    lblData.innerHTML = "Data Antecipação <span style='color:red'>*</span>";
    lblData.setAttribute("style", "text-align:center");

    var txtData = DOM.newElement('text', 'dataAntecipacao');
    txtData.setAttribute('class', 'textbox_cinzafoco');
    txtData.setAttribute('style', 'width:100%;');

    divData.appendChild(lblData);
    divData.appendChild(txtData);

    var divValorTotal = DOM.newElement('div');
    divValorTotal.setAttribute('class', 'divcontainer');
    divValorTotal.setAttribute('style', 'max-width:143px; margin-left:10px;');

    var lblValorTotal = DOM.newElement('label');
    lblValorTotal.innerHTML = "Valor Total";
    lblValorTotal.setAttribute("style", "text-align:center");

    var txtValorTotal = DOM.newElement('text', 'valorTotal');
    txtValorTotal.setAttribute('class', 'textbox_cinzafoco');
    txtValorTotal.setAttribute('style', 'width:100%; text-align:right; background-color:#DCDCDC');

    divValorTotal.appendChild(lblValorTotal);
    divValorTotal.appendChild(txtValorTotal);

    var divValorAntecipacao = DOM.newElement('div');
    divValorAntecipacao.setAttribute('class', 'divcontainer');
    divValorAntecipacao.setAttribute('style', 'max-width:143px; margin-left:10px;');

    var lblValorAntecipacao = DOM.newElement('label');
    lblValorAntecipacao.innerHTML = "Valor Antecipação <span style='color:red'>*</span>";
    lblValorAntecipacao.setAttribute("style", "text-align:center");

    var txtValorAntecipacao = DOM.newElement('text', 'valorAntecipacao');
    txtValorAntecipacao.setAttribute('class', 'textbox_cinzafoco');
    txtValorAntecipacao.setAttribute('style', 'width:100%; text-align:right;');

    divValorAntecipacao.appendChild(lblValorAntecipacao);
    divValorAntecipacao.appendChild(txtValorAntecipacao);

    var lblObs = DOM.newElement('label');
    lblObs.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblObs.innerHTML = 'Observação';

    var txtObs = DOM.newElement('textarea', 'obs');
    txtObs.setAttribute('style', 'width:100%; height:70px;');
    txtObs.setAttribute('class', 'textbox_cinzafoco');

    var cmdTexto1 = DOM.newElement('button', 'btAntecipar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'AnteciparParcelas();');
    cmdTexto1.innerHTML = "Gravar";

    var label = DOM.newElement('label', 'e_lblCancelar');
    label.innerHTML = 'Cancelar';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle; float:right; margin-top:5px;');
    label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoAnteciparParcelas.Close();');
    label.innerHTML = 'Cancelar';

    //======== Tabela =========//
    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);
    divform.innerHTML += '<br><br>';
    divform.appendChild(divData);
    divform.appendChild(divValorTotal);
    divform.appendChild(divValorAntecipacao);
    divform.innerHTML += '<br>';
    divform.appendChild(lblObs);
    divform.innerHTML += '<br>';
    divform.appendChild(txtObs);
    divform.innerHTML += '<br><br>';
    divform.appendChild(label);
    divform.appendChild(cmdTexto1);

    dialogoAnteciparParcelas = new caixaDialogo('divPromptAnteciparParcelas', 290, 500, '../padrao/', 140);
    dialogoAnteciparParcelas.Show();

    Mask.setData(Selector.$('dataAntecipacao'));
    Mask.setMoeda(Selector.$('valorAntecipacao'));

    Selector.$('dataAntecipacao').value = Date.GetDate(false);
    Selector.$('valorTotal').value = grid.SumColChecked(7);
    Selector.$('valorAntecipacao').focus();
}

function AnteciparParcelas(){

    if(Selector.$('dataAntecipacao').value.trim() == ''){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor preencher a data da antecipação", "OK", "", false, "dataAntecipacao");
        mensagem.Show();
        return;
    }

    if(Selector.$('valorAntecipacao').value.trim() == '' || Selector.$('valorAntecipacao').value.trim() == ',' || Selector.$('valorAntecipacao').value.trim() == '0,00'){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor preencher o valor da antecipação", "OK", "", false, "valorAntecipacao");
        mensagem.Show();
        return;
    }

    var arrayParcelasVendas = new Array();
    for(var i = 0; i < grid.getRowCount() -1; i++){

        if(grid.getCellObject(i, 0).checked){
            arrayParcelasVendas.push(grid.getCellObject(i, 1).id);
        }
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-antecipacoes.php', true);
    var p = 'action=AnteciparParcelas';
    p+= '&idParcelasVendas=' + arrayParcelasVendas;
    p+= '&dataAntecipacao=' + Selector.$('dataAntecipacao').value;
    p+= '&valorTotal=' + Selector.$('valorTotal').value;
    p+= '&valorAntecipacao=' + Selector.$('valorAntecipacao').value;
    p+= '&obs=' + Selector.$('obs').value;
    p+= '&idFormaPagamento=' + Selector.$('formaPagamento').value;

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        if(ajax.getResponseText() == '0'){
            var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro!", "Erro ao antecipar as parcelas, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        }else{
            dialogoAnteciparParcelas.Close();
            Pesquisar();
        }
    };

    ajax.Request(p);
}

function ExcluirAntecipacaoAux(linha){

    if(!CheckPermissao(87, true, 'Você não possui permissão para excluir uma antecipação', false)){
        return;
    }

    if(Selector.$('situacao').value == '1'){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Não há antecipação para excluir", "OK", "", false, "");
        mensagem.Show();
        return;
    }else{

        mensagemExcluirAntecipacao = new DialogoMensagens("prompt", 120, 350, 150, "4", "Atenção!", "Deseja realmente excluir a antecipação?", "OK", "ExcluirAntecipacao(" + linha + ");", true, "");
        mensagemExcluirAntecipacao.Show();
    }
}

function ExcluirAntecipacao(linha){

    mensagemExcluirAntecipacao.Close();

    var ajax = new Ajax('POST', 'php/relatorio-de-antecipacoes.php', true);
    var p = 'action=ExcluirAntecipacao';
    p+= '&idVendaParcelaAntecipacao=' + grid.getRowData(linha);

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        if(ajax.getResponseText() == '0'){
            var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro!", "Erro ao excluir a antecipação, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        Pesquisar();
        var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "4", "Sucesso!", "Antecipação excluída com sucesso!", "OK", "", false, "");
        mensagem.Show();
    };

    ajax.Request(p);
}

function Limpar(){

    Selector.$('formaPagamento').value = 0;
    Selector.$('galeria').value = 0;
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Selector.$('situacao').value = 1;
    Pesquisar();
}

function Imprimir_onClick() {

    if(!CheckPermissao(89, true, 'Você não possui permissão para imprimir o relatório de antecipações', false)){
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

    window.open('impressao-de-relatorios.html?source=relatorio-de-antecipacoes');
}

function botExportar_onClick() {

    if(!CheckPermissao(90, true, 'Você não possui permissão para gerar excel do relatório de antecipações', false)){
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

    var ajax = new Ajax('POST', 'php/relatorio-de-antecipacoes.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&idFormaPagamento=' + Selector.$('formaPagamento').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
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