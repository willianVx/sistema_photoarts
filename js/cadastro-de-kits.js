checkSessao();

window.onload = function () {
    
    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Kits</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Kit'),
        DOM.newText('Qtde Equipamentos'),
        DOM.newText('Valor Locaçao'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('divTabela').appendChild(grid.table);
    MostraKits();
};

function PromptKit(idKit) {

    if (!isElement('div', 'PromptKit')) {
        var PromptKit = DOM.newElement('div', 'PromptKit');
        document.body.appendChild(PromptKit);
    }

    var PromptKit = Selector.$('PromptKit');
    PromptKit.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptKit.appendChild(divform);

    var lblNomeKit = DOM.newElement('label');
    lblNomeKit.innerHTML = "Kit";

    var kit = DOM.newElement('text', 'kit');
    kit.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    kit.setAttribute('style', 'width:590px; margin-left:5px;');
    kit.setAttribute('placeHolder', 'Ex.: Transmissão simultânea com 2 câmeras e gravação do PGM em HD ');

    var lblDataCadastro = DOM.newElement('label');
    lblDataCadastro.setAttribute('style', 'margin-left:10px;');
    lblDataCadastro.innerHTML = "Data Cadastro";

    var dataCadastro = DOM.newElement('text', 'dataCadastro');
    dataCadastro.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    dataCadastro.setAttribute('style', 'margin-left:5px; width:100px;');
    dataCadastro.setAttribute('disabled', 'disabled');

    var lblAtivo = DOM.newElement('label');
    lblAtivo.setAttribute('style', 'margin-left:5px;');
    lblAtivo.setAttribute('for', 'ativo');
    lblAtivo.innerHTML = "Ativo";

    var ativo = DOM.newElement('checkbox', 'ativo');
    ativo.setAttribute('style', 'margin-left:10px;');

    var lblValorLocacao = DOM.newElement('label');
    lblValorLocacao.innerHTML = "Valor Locação";

    var valorLocacao = DOM.newElement('text', 'valorLocacao');
    valorLocacao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    valorLocacao.setAttribute('style', 'margin-left:5px; width:100px;');

    var verHistorico = DOM.newElement('img', 'verHistorico');
    verHistorico.setAttribute('src', 'imagens/menu.png');
    verHistorico.setAttribute('title', 'Ver Histórico');
    verHistorico.setAttribute('style', 'float:right; margin-right:670px; margin-top:5px; cursor:pointer; display:none');
    verHistorico.setAttribute('onclick', 'PromptKitHistorico(' + idKit + ')');
    
    var lblMensagemAviso = DOM.newElement('label', 'lblMensagemAviso');
    lblMensagemAviso.innerHTML = "Após gravar o Kit, será possível adicionar a composição de equipamentos";
    lblMensagemAviso.setAttribute('style', 'color:#0033FF; display:none');

    var lblEquipamentos = DOM.newElement('label', 'lblEquipamentos');
    lblEquipamentos.innerHTML = "Equipamentos";

    var btAdicionar = DOM.newElement('button', 'adicionar');
    btAdicionar.setAttribute('class', 'botaosimplesfoco');
    btAdicionar.setAttribute('style', 'float:right; margin-top:-21px;');
    btAdicionar.setAttribute('onclick', 'PromptEquipamentoKit(' + idKit + ', 0);');
    btAdicionar.innerHTML = 'Adicionar +';

    var btGravar = DOM.newElement('button', 'gravar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'GravarKit(' + idKit + ');');
    btGravar.innerHTML = 'Gravar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoKit.Close();');
    btCancelar.innerHTML = 'Cancelar';

    var divGridEquipamentos = DOM.newElement('div', 'divGridEquipamentos');
    divGridEquipamentos.setAttribute('style', 'height:285px; overflow:auto;');

    gridEquipamentos = new Table('gridEquipamentos');
    gridEquipamentos.table.setAttribute('cellpadding', '5');
    gridEquipamentos.table.setAttribute('cellspacing', '0');
    gridEquipamentos.table.setAttribute('class', 'tabela_cinza_foco');
    gridEquipamentos.table.setAttribute('style', 'margin-top:5px;');

    gridEquipamentos.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Equipamento'),
        DOM.newText('Qtde'),
        DOM.newText('Data Cadastro'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    divform.appendChild(lblNomeKit);
    divform.appendChild(kit);
    divform.appendChild(lblDataCadastro);
    divform.appendChild(dataCadastro);
    divform.appendChild(ativo);
    divform.appendChild(lblAtivo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblValorLocacao);
    divform.appendChild(valorLocacao);
    divform.appendChild(verHistorico);
    
    divform.appendChild(lblMensagemAviso);
    if(idKit <= 0){
        Selector.$('lblMensagemAviso').style.display = 'block';
    }
    else{
        Selector.$('lblMensagemAviso').style.display = 'none';
    }
    
    divform.innerHTML += '<br id="br1"><br id="br2">';
    divform.appendChild(lblEquipamentos);
    divform.appendChild(btAdicionar);
    divform.innerHTML += '<br id="br3">';
    divform.appendChild(divGridEquipamentos);
    divform.innerHTML += '<br>';
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoKit = new caixaDialogo('PromptKit', 500, 985, 'padrao/', 130);
    dialogoKit.Show();
    dialogoKit.HideCloseIcon();

    Selector.$('divGridEquipamentos').appendChild(gridEquipamentos.table);

    Mask.setMoeda(Selector.$('valorLocacao'));

    var scrollY;
    scrollY = window.pageYOffset;

    if (document.all) {
        if (!document.documentElement.scrollTop)
            scrollY = document.body.scrollTop;
        else
            scrollY = document.documentElement.scrollTop;
    } else
        scrollY = window.pageYOffset;

    if (idKit <= 0) {

        Selector.$('dataCadastro').value = Date.GetDate(false);
        Selector.$('ativo').checked = true;
        Selector.$('lblEquipamentos').style.display = 'none';
        Selector.$('adicionar').style.display = 'none';
        Selector.$('br1').style.display = 'none';
        Selector.$('br2').style.display = 'none';
        Selector.$('br3').style.display = 'none';
        Selector.$('divGridEquipamentos').style.display = 'none';
        Selector.$('PromptKit').style.height = '185px';
        Selector.$('PromptKit').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (170 / 2)) - 0) + 'px';
        Selector.$('kit').focus();
    } else {
        Selector.$('verHistorico').style.display = 'block';
        Selector.$('lblEquipamentos').style.display = 'block';
        Selector.$('adicionar').style.display = 'block';
        Selector.$('br1').style.display = 'block';
        Selector.$('br2').style.display = 'block';
        Selector.$('br3').style.display = 'block';
        Selector.$('divGridEquipamentos').style.display = 'block';
        Selector.$('PromptKit').style.height = '510px';
        Selector.$('PromptKit').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (515 / 2)) - 0) + 'px';
        getKit(idKit);
    }
}

function MostraKits() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', true);
    var p = 'action=MostraKits';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('mensagemKits').style.display = 'block';
            Selector.$('divTabela').style.display = 'none';
            return;
        }

        Selector.$('divTabela').style.display = 'block';
        Selector.$('mensagemKits').style.display = 'none';

        grid.clearRows();

        var json = JSON.parse(ajax.getResponseText() || "[]");
        var editar;
        var cor = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'PromptKit(' + json[i].idKit + ');');

            grid.addRow([
                DOM.newText(json[i].kit),
                DOM.newText(json[i].qtdeEquipamentos),
                DOM.newText(json[i].valorLocacaoKit),
                DOM.newText(json[i].ativo),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idKit);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:150px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right; width:100px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:50px');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:30px');

            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function Verifica() {

    var kit = Selector.$('kit');
    if (kit.value.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, preencha o campo Kit", "OK", "", false, "kit");
        mensagem.Show();
        return false;
    }

    var valorLocacao = Selector.$('valorLocacao');
    if (valorLocacao.value.trim() === '' || valorLocacao.value.trim() === ',') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, preencha o campo Valor Locação", "OK", "", false, "valorLocacao");
        mensagem.Show();
        return false;
    }

    return true;
}

function GravarKit(idKit) {

    if (!Verifica()) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', true);
    var p = 'action=GravarKit';
    p += '&idKit=' + idKit;
    p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&ativo=' + (Selector.$('ativo').checked ? '1' : '0');
    p += '&kit=' + Selector.$('kit').value;
    p += '&valorLocacaoKit=' + Selector.$('valorLocacao').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() === '0') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o kit. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() === '-1') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Este kit já está cadastrado.", "OK", "", false, "");
            mensagem.Show();
            return false;
        } else {
            dialogoKit.Close();
            MostraKits();
            
            if(idKit <= 0){
                PromptKit(ajax.getResponseText());
            }
        }
    };
    
    Selector.$('gravar').disabled = true;
    Selector.$('gravar').innerHTML = "Gravando";
    ajax.Request(p);
}

function getKit(idKit) {

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', false);
    var p = 'action=getKit';
    p += '&idKit=' + idKit;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() || "[]");

    Selector.$('dataCadastro').value = json.dataCadastro;
    if (json.ativo === '1') {
        Selector.$('ativo').checked = true;
    } else {
        Selector.$('ativo').checked = false;
    }
    Selector.$('kit').value = json.kit;
    Selector.$('valorLocacao').value = json.valorLocacaoKit;

    MostraEquipamentosKit(idKit);
}

function MostraEquipamentosKit(idKit) {

    gridEquipamentos.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', false);
    var p = 'action=MostraEquipamentosKit';
    p += '&idKit=' + idKit;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() || "[]");
    var editar;
    var excluir;
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'PromptEquipamentoKit(' + idKit + ', ' + json[i].idKitComp + ');');

        excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Editar');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('onclick', 'ExcluirEquipamentoKit(' + idKit + ', ' + json[i].idKitComp + ');');

        gridEquipamentos.addRow([
            DOM.newText(i + 1),
            DOM.newText(json[i].equipamentoTipo),
            DOM.newText(json[i].equipamento),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].dataCadastro),
            editar,
            excluir
        ]);

        gridEquipamentos.setRowData(gridEquipamentos.getRowCount() - 1, json[i].idKitComp);
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:30px;');
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; width:100px;');
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:60px;');
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:90px');
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px;');
        gridEquipamentos.getCell(gridEquipamentos.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px');

        if (cor) {
            cor = false;
            gridEquipamentos.setRowBackgroundColor(gridEquipamentos.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridEquipamentos.setRowBackgroundColor(gridEquipamentos.getRowCount() - 1, "#FFF");
        }
    }

    Selector.$('lblEquipamentos').innerHTML = "Equipamentos" + " <label style='font-weight:100;'>( " + (gridEquipamentos.getRowCount() === 1 ? gridEquipamentos.getRowCount() + " item adicionado" : gridEquipamentos.getRowCount() + " itens adicionados") + " )</label>";
}

function PromptEquipamentoKit(idKit, idKitComp) {

    if (!isElement('div', 'PromptEquipamentoKit')) {
        var PromptEquipamentoKit = DOM.newElement('div', 'PromptEquipamentoKit');
        document.body.appendChild(PromptEquipamentoKit);
    }

    var PromptEquipamentoKit = Selector.$('PromptEquipamentoKit');
    PromptEquipamentoKit.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptEquipamentoKit.appendChild(divform);

    var lblTipo = DOM.newElement('label', 'lblTipo');
    lblTipo.innerHTML = "Tipo";

    var tipoEquipamento = DOM.newElement('select', 'tiposEquipamentos');
    tipoEquipamento.setAttribute('class', 'combo_cinzafoco');
    tipoEquipamento.setAttribute('style', 'width:575px; margin-left:5px;');

    var lblEquipamento = DOM.newElement('label', 'lblEquipamento');
    lblEquipamento.innerHTML = "Equipamento";

    var equipamento = DOM.newElement('select', 'equipamento');
    equipamento.setAttribute('class', 'combo_cinzafoco');
    equipamento.setAttribute('style', 'width:520px; margin-left:5px;');
    equipamento.setAttribute('onchange', 'getValorQtdEquipamento();');

    var lblValorLocacao = DOM.newElement('label');
    lblValorLocacao.innerHTML = "Valor Locação";

    var valorLocacao = DOM.newElement('text', 'valorLocacao2');
    valorLocacao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    valorLocacao.setAttribute('style', 'margin-left:5px; width:100px;');
    valorLocacao.setAttribute('disabled', 'disabled');

    var lblQtdEstoque = DOM.newElement('label');
    lblQtdEstoque.setAttribute('style', 'margin-left:10px;');
    lblQtdEstoque.innerHTML = "Qtde em Estoque";

    var qtdEstoque = DOM.newElement('text', 'qtdEstoque');
    qtdEstoque.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    qtdEstoque.setAttribute('style', 'margin-left:5px; width:100px;');
    qtdEstoque.setAttribute('disabled', 'disabled');

    var lblQtdKit = DOM.newElement('label');
    lblQtdKit.setAttribute('style', 'margin-left:10px;');
    lblQtdKit.innerHTML = "Qtde em Kit";

    var qtdKit = DOM.newElement('text', 'qtdKit');
    qtdKit.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    qtdKit.setAttribute('style', 'margin-left:5px; width:100px;');

    var btGravar = DOM.newElement('button', 'gravar2');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'GravarEquipamentoKit(' + idKit + ', ' + idKitComp + ')');
    btGravar.innerHTML = 'Gravar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoEquipamentoKit.Close();');
    btCancelar.innerHTML = 'Cancelar';

    divform.appendChild(lblTipo);
    divform.appendChild(tipoEquipamento);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblEquipamento);
    divform.appendChild(equipamento);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblValorLocacao);
    divform.appendChild(valorLocacao);
    divform.appendChild(lblQtdEstoque);
    divform.appendChild(qtdEstoque);
    divform.appendChild(lblQtdKit);
    divform.appendChild(qtdKit);
    divform.innerHTML += '<br><br>';
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoEquipamentoKit = new caixaDialogo('PromptEquipamentoKit', 270, 700, 'padrao/', 131);
    dialogoEquipamentoKit.Show();

    Select.AddItem(Selector.$('equipamento'), "Selecione um tipo de equipamento", 0);
    Mask.setMoeda(Selector.$('valorLocacao2'));
    Mask.setOnlyNumbers(Selector.$('qtdEstoque'));
    Mask.setOnlyNumbers(Selector.$('qtdKit'));

    if (idKitComp <= 0) {
        getTiposEquipamentos(Selector.$('tiposEquipamentos'), "Selecione um tipo de equipamento", true);
        Selector.$('tiposEquipamentos').focus();
    } else {
        getTiposEquipamentos(Selector.$('tiposEquipamentos'), "Selecione um tipo de equipamento", false);
        getEquipamentoKit(idKitComp);
    }

    Selector.$('tiposEquipamentos').setAttribute('onchange', 'getEquipamentosPorTipo(Selector.$("tiposEquipamentos").value , Selector.$("equipamento"), "Selecione um equipamento", true);');
}

function getEquipamentoKit(idKitComp) {

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', false);
    var p = 'action=getEquipamentoKit';
    p += '&idKitComp=' + idKitComp;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() || "[]");

    Selector.$('tiposEquipamentos').value = json.idEquipamentoTipo;
    getEquipamentosPorTipo(Selector.$('tiposEquipamentos').value, Selector.$('equipamento'), "Selecione um equipamento", false);
    Selector.$('equipamento').value = json.idEquipamento;
    Selector.$('valorLocacao2').value = json.valorLocacao;
    Selector.$('qtdEstoque').value = json.qtdEstoque;
    Selector.$('qtdKit').value = json.qtdKit;
}

function getValorQtdEquipamento() {

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', false);
    var p = 'action=getValorQtdEquipamento';
    p += '&idEquipamento=' + Selector.$('equipamento').value;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() || "[]");

    Selector.$('valorLocacao2').value = json.valorLocacao;
    Selector.$('qtdEstoque').value = json.qtdEstoque;
    Selector.$('qtdKit').focus();
}

function GravarEquipamentoKit(idKit, idKitComp) {

    var tipo = Selector.$('tiposEquipamentos');
    if (tipo.selectedIndex <= 0) {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, selecione o tipo de equipamento", "OK", "", false, "tiposEquipamentos");
        mensagem.Show();
        return;
    }

    var equipamento = Selector.$('equipamento');
    if (equipamento.selectedIndex <= 0) {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, selecione o campo Equipamento", "OK", "", false, "equipamento");
        mensagem.Show();
        return;
    }

    var qtdKit = Selector.$('qtdKit');
    if (qtdKit.value.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Por favor, preencha o campo Qtde em Kit", "OK", "", false, "qtdKit");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', true);
    var p = 'action=GravarEquipamentoKit';
    p += '&idKit=' + idKit;
    p += '&idKitComp=' + idKitComp;
    p += '&idEquipamento=' + equipamento.value;
    p += '&qtd=' + qtdKit.value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        Selector.$('gravar2').disabled = false;
        Selector.$('gravar2').innerHTML = "Gravar";

        if (ajax.getResponseText() === '0') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o equipamento desse kit. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() === '-1') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Este item já está cadastrado.", "OK", "", false, "");
            mensagem.Show();
            return false;
        } else {
            dialogoEquipamentoKit.Close();
            MostraEquipamentosKit(idKit);
        }
    };
    
    Selector.$('gravar2').disabled = true;
    Selector.$('gravar2').innerHTML = "Gravando";
    ajax.Request(p);
}

function ExcluirEquipamentoKit(idKit, idKitComp) {

    mensagemExcluir = new DialogoMensagens("prompt", 120, 400, 150, "4", "Alerta!", "Deseja realmente excluir este equipamento deste kit?", "SIM", "ExcluirEquipamentoKitAux(" + idKit + ", " + idKitComp + ")", true, "");
    mensagemExcluir.Show();
}

function ExcluirEquipamentoKitAux(idKit, idKitComp) {

    var ajax = new Ajax("POST", "php/cadastro-de-kits.php", false);
    var p = "action=ExcluirEquipamentoKit";
    p += "&idKitComp=" + idKitComp;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir o equipamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        mensagemExcluir.Close();
        MostraEquipamentosKit(idKit);
        return;
    }
}

function PromptKitHistorico(idKit) {

    if (!isElement('div', 'PromptKitHistorico')) {
        var PromptKitHistorico = DOM.newElement('div', 'PromptKitHistorico');
        document.body.appendChild(PromptKitHistorico);
    }

    var PromptKitHistorico = Selector.$('PromptKitHistorico');
    PromptKitHistorico.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptKitHistorico.appendChild(divform);

    var lblHistorico = DOM.newElement('label');
    lblHistorico.innerHTML = "<center>Histórico do Kit</center>";

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
        DOM.newText('Valor Locação'),
        DOM.newText('Usuario')
    ]);

    dialogoKitHistorico = new caixaDialogo('PromptKitHistorico', 530, 500, 'padrao/', 131);
    dialogoKitHistorico.Show();

    Selector.$('divGridHistorico').appendChild(gridHistorico.table);

    gridHistorico.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-kits.php', true);
    var p = 'action=getHistoricoKit';
    p += '&idKit=' + idKit;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() || "[]");
        var cor = false;

        for (var i = 0; i < json.length; i++) {

            gridHistorico.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].valorLocacaoKit),
                DOM.newText(json[i].funcionario)
            ]);

            gridHistorico.setRowData(gridHistorico.getRowCount() - 1, json[i].idKitHistorico);
            gridHistorico.getCell(gridHistorico.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:110px;');
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
