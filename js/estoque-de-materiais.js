checkSessao();
CheckPermissao(28, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Estoque de Materiais</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getLojas(Selector.$('galeria'), 'Todas', true);
    getComboMateriais(Selector.$('material'), 'Todos', true);
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
    Pesquisar();    
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Pesquisar() {

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/estoque-de-materiais.php', true);
    var p = 'action=Pesquisar';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMaterial=' + Selector.$('material').value;
    p += '&detalhado=' + Selector.$('detalhado').checked;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum material encontrado no estoque";
            return;
        }

        Selector.$('contador').innerHTML = "";

        var div = Selector.$('tabela');

        gridEstoque = new Table('gridEstoque');
        gridEstoque.table.setAttribute('cellpadding', '3');
        gridEstoque.table.setAttribute('cellspacing', '0');
        gridEstoque.table.setAttribute('class', 'tabela_cinza_foco');

        gridEstoque.addHeader([
            DOM.newText('Data Mov.'),
            DOM.newText('Qtde.'),
            DOM.newText('Tipo Mov.'),
            DOM.newText('Galeria'),
            DOM.newText('Material'),
            DOM.newText('Observação'),
            DOM.newText('Entrada'),
            DOM.newText('Saída'),
            DOM.newText('Transferir Estoque'),
            DOM.newText('Excluir')
        ]);

        div.appendChild(gridEstoque.table);

        var json = JSON.parse(ajax.getResponseText() );
        
        for (var i = 0; i < json.length; i++) {

            var Transferir = DOM.newElement('img');
            Transferir.setAttribute('src', 'imagens/menuestoque.png');
            Transferir.setAttribute('title', 'Transferir Estoque');
            Transferir.setAttribute('style', 'cursor:pointer');
            Transferir.setAttribute('onclick', 'TransferirETQ(' + json[i].idMaterial + ',' + json[i].idLoja + ',"' + json[i].qtd + '","' + json[i].largura + '","' + json[i].altura + '","' + json[i].material + '")');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/excluir.png');
            excluir.setAttribute('title', 'Excluir Lançamento');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirLancamentoAux(' + json[i].idEstoqueMaterial + ')');

            var seta = DOM.newElement('img');
            seta.setAttribute('src', 'imagens/setagrande.png');
            var aux = json[i].qtd;
            aux = aux.replace(',', '.');
            var mais = DOM.newElement('img');
            mais.setAttribute('src', 'imagens/mais.png');
            mais.setAttribute('title', 'Lançamento de entrada');
            mais.setAttribute('style', 'cursor:pointer');
            mais.setAttribute('onclick', 'PromptEntradaSaidaEstoque("E", false, "' + json[i].idLoja + '","' + json[i].idMaterial + '", "' + json[i].altura + '", "' + json[i].largura + '", "' + aux + '", ' + gridEstoque.getRowCount() + ')');
            
            var menos = DOM.newElement('img');
            menos.setAttribute('src', 'imagens/menos.png');
            menos.setAttribute('title', 'Lançamento de saída');
            menos.setAttribute('style', 'cursor:pointer');
            menos.setAttribute('onclick', 'PromptEntradaSaidaEstoque("S", false, "' + json[i].idLoja + '","' + json[i].idMaterial + '", "' + json[i].altura + '", "' + json[i].largura + '", "' + aux + '", ' + gridEstoque.getRowCount() + ')');


            if (Selector.$('detalhado').checked) {

                gridEstoque.addRow([
                    DOM.newText(json[i].dataMovimento + " " + json[i].horaMovimento),
                    DOM.newText(json[i].qtd),
                    DOM.newText(json[i].tipoMovimento),
                    DOM.newText(json[i].loja),
                    DOM.newText(json[i].material),
                    DOM.newText(json[i].obs),
                    mais, 
                    menos,
                    Transferir,
                    excluir
                ]);

                gridEstoque.setRowData(gridEstoque.getRowCount() - 1, json[i].idEstoqueMaterial);
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:110px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:40px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:40px;');

                gridEstoque.hiddenCol(8);
            } else {

                gridEstoque.addRow([
                    DOM.newText(''),
                    DOM.newText(json[i].qtd),
                    DOM.newText(json[i].tipoMovimento),
                    DOM.newText(json[i].loja),
                    DOM.newText(json[i].material),
                    DOM.newText(''),
                     mais, 
                    menos,
                    Transferir,
                    excluir
                ]);

                gridEstoque.hiddenCol(0);
                gridEstoque.hiddenCol(5);
                gridEstoque.hiddenCol(9);

                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:80px;');
            }
        }        
        
        Selector.$('contador').innerHTML = gridEstoque.getRowCount() + " Registro(s) encontrado(s)";
        pintaLinhaGrid(gridEstoque);
    };

    ajax.Request(p);
}

function PromptEntradaSaidaEstoque(tipoMovimento, assinc, idLoja, idMaterial, altura, largura, qtd, linha) {

    if(!CheckPermissao((tipoMovimento == 'E' ? 29 : 30), true, 'Você não possui permissão para lançar' + (tipoMovimento == 'E' ? ' entrada' : ' saída') + ' no estoque de materias.', false)){
        return;
    }

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.setAttribute('style', 'text-align:left;');
    divCadastro.setAttribute('align', 'left');
    divCadastro.innerHTML = '';

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = (tipoMovimento == 'E' ? 'Entrada' : 'Saída') + ' Estoque';
    lblTitulo.setAttribute('style', 'text-align:center; font-family:arial');
    divCadastro.appendChild(lblTitulo);

    var lblGaleria = DOM.newElement('label');
    lblGaleria.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblGaleria.innerHTML = 'Galeria';

    var cmbGaleria = DOM.newElement('select', 'e_galeria');
    cmbGaleria.setAttribute('class', 'textbox_cinzafoco');
    cmbGaleria.setAttribute("style", 'width:100%');

    divCadastro.appendChild(lblGaleria);
    divCadastro.innerHTML += '<br>';
    divCadastro.appendChild(cmbGaleria);

    var lblMaterial = DOM.newElement('label');
    lblMaterial.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblMaterial.innerHTML = 'Material';

    var cmbMaterial = DOM.newElement('select', 'e_material');
    cmbMaterial.setAttribute('class', 'textbox_cinzafoco');
    cmbMaterial.setAttribute("style", 'width:92%');
    cmbMaterial.setAttribute("onchange", 'Selector.$("e_altura").focus(); getUnidadeMedidaMaterial();');

    var lblUnidadeMedida = DOM.newElement('label', 'unidadeMedida');
    lblUnidadeMedida.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblUnidadeMedida.setAttribute('style', 'margin-left:10px; display:none;');
    lblUnidadeMedida.innerHTML = 'UN';

    divCadastro.innerHTML += '<br>';
    divCadastro.appendChild(lblMaterial);
    divCadastro.innerHTML += "<br>";
    divCadastro.appendChild(cmbMaterial);
    divCadastro.appendChild(lblUnidadeMedida);

    var divAltura = DOM.newElement('div');
    divAltura.setAttribute('style', 'width:125px; display:inline-block;');

    var lblAltura = DOM.newElement('label');
    lblAltura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAltura.innerHTML = 'Altura';

    var txtAltura = DOM.newElement('text', 'e_altura');
    txtAltura.setAttribute('class', 'textbox_cinzafoco');
    txtAltura.setAttribute("style", 'width:100%');

    divAltura.appendChild(lblAltura);
    divAltura.innerHTML += '<br>';
    divAltura.appendChild(txtAltura);
    divCadastro.appendChild(divAltura);

    var divLargura = DOM.newElement('div');
    divLargura.setAttribute('style', 'width:125px; display:inline-block; margin-left:10px;');

    var lblLargura = DOM.newElement('label');
    lblLargura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblLargura.innerHTML = 'Largura';

    var txtLargura = DOM.newElement('text', 'e_largura');
    txtLargura.setAttribute('class', 'textbox_cinzafoco');
    txtLargura.setAttribute("style", 'width:100%');

    divLargura.appendChild(lblLargura);
    divLargura.innerHTML += '<br>';
    divLargura.appendChild(txtLargura);
    divCadastro.appendChild(divLargura);

    var divQuantidade = DOM.newElement('div');
    divQuantidade.setAttribute('style', 'width:100px; display:inline-block; margin-left:10px;');

    var lblQuantidade = DOM.newElement('label');
    lblQuantidade.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblQuantidade.innerHTML = 'Quantidade';

    var txtQuantidade = DOM.newElement('text', 'e_qtd');
    txtQuantidade.setAttribute('class', 'textbox_cinzafoco');
    txtQuantidade.setAttribute("style", 'width:100%');

    divQuantidade.appendChild(lblQuantidade);
    divQuantidade.innerHTML += '<br>';
    divQuantidade.appendChild(txtQuantidade);
    divCadastro.appendChild(divQuantidade);

    divCadastro.innerHTML += '<br>';

    var lblObs = DOM.newElement('label');
    lblObs.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblObs.innerHTML = 'Observação';
    divCadastro.appendChild(lblObs);

    divCadastro.innerHTML += '<br>';

    var txtObs = DOM.newElement('textarea', 'e_obs');
    txtObs.setAttribute('class', 'textbox_cinzafoco');
    txtObs.setAttribute("style", 'width:100%; height:50px;');
    divCadastro.appendChild(txtObs);

    divCadastro.innerHTML += '<br><br>';

    var lblCancelar = DOM.newElement('button', 'e_lblCancelar');
    lblCancelar.setAttribute('class', 'botaosimplesfoco');
    lblCancelar.setAttribute('style', 'cursor:pointer; vertical-align:bottom; float:right;');
    lblCancelar.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');
    lblCancelar.innerHTML = 'Cancelar';

    divCadastro.appendChild(lblCancelar);

    var btGravar = DOM.newElement('button', 'e_btGravar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'margin-right: 5px; float:right;');
    btGravar.setAttribute('onclick', 'GravarMovimentoEstoque("' + tipoMovimento + '");');
    btGravar.innerHTML = "Gravar";

    divCadastro.appendChild(btGravar);

    dialogoCadastro = new caixaDialogo('divCadastro', 400, 415, 'padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();

    Selector.$('e_galeria').focus();

    getLojas(Selector.$('e_galeria'), 'Selecione uma galeria', false);
    getComboMateriais(Selector.$('e_material'), 'Selecione um material', false);

    Mask.setMoeda(Selector.$('e_altura'));
    Mask.setMoeda(Selector.$('e_largura'));
    Mask.setOnlyNumbers(Selector.$('e_qtd'));

    if(linha >= 0){
        Selector.$('e_galeria').value = idLoja ;
        Selector.$('e_material').value = idMaterial;
        Selector.$('e_altura').value = altura;
        Selector.$('e_largura').value = largura;
        Selector.$('e_qtd').focus();
        Selector.$('e_obs').value = gridEstoque.getCellText(linha,5);
    }
}

function getUnidadeMedidaMaterial() {

    if (Selector.$('e_material').value == '0') {
        Selector.$('unidadeMedida').style.display = "none";
        return;
    }

    var ajax = new Ajax('POST', 'php/estoque-de-materiais.php', false);
    var p = 'action=getUnidadeMedidaMaterial';
    p += '&idMaterial=' + Selector.$('e_material').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    } else {
        Selector.$('unidadeMedida').innerHTML = ajax.getResponseText();
        Selector.$('unidadeMedida').style.display = "inline-block";
    }
}

function GravarMovimentoEstoque(tipoMovimento) {

    if (Selector.$('e_galeria').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione uma galeria", 'e_galeria');
        return;
    }

    if (Selector.$('e_material').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um material", 'e_material');
        return;
    }

    if (Selector.$('e_qtd').value.trim() == '' || Selector.$('e_qtd').value.trim() == '0') {
        MostrarMsg("Por favor, digite a quantidade", 'e_qtd');
        return;
    }

    var ajax = new Ajax('POST', 'php/estoque-de-materiais.php', true);
    var p = 'action=GravarMovimentoEstoque';
    p += '&tipoMovimento=' + tipoMovimento;
    p += '&idGaleria=' + Selector.$('e_galeria').value;
    p += '&idMaterial=' + Selector.$('e_material').value;
    p += '&altura=' + Selector.$('e_altura').value;
    p += '&largura=' + Selector.$('e_largura').value;
    p += '&qtd=' + Selector.$('e_qtd').value;
    p += '&obs=' + Selector.$('e_obs').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('e_btGravar').innerHTML = "Gravar";

        if (ajax.getResponseText() == '0') {
            MostrarMsg('Problemas ao gravar o movimento do estoque. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
            return;
        } else if (ajax.getResponseText() == '2') {
            MostrarMsg('Não há quantidade disponível para realizar a saída do estoque.', '');
            return;
        } else if (ajax.getResponseText() == '3') {
            MostrarMsg('Não é possível lançar uma quantidade maior do que a quantidade do estoque.', 'e_qtd');
            return;
        } else {
            Pesquisar();
            dialogoCadastro.Close();
        }
    };

    Selector.$('e_btGravar').innerHTML = "Gravando...";
    ajax.Request(p);
}

function ExcluirLancamentoAux(idEstoqueMaterial) {

    if(!CheckPermissao(31, true, 'Você não possui permissão para excluir um lançamento do estoque', false)){
        return;
    }

    mensagemExcluirLancamento = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este lançamento?", "OK", "ExcluirLancamento(" + idEstoqueMaterial + ");", true, "");
    mensagemExcluirLancamento.Show();
}

function ExcluirLancamento(idEstoqueMaterial) {

    mensagemExcluirLancamento.Close();

    var ajax = new Ajax('POST', 'php/estoque-de-materiais.php', true);
    var p = 'action=ExcluirLancamento';
    p += '&idEstoqueMaterial=' + idEstoqueMaterial;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            MostrarMsg('Problemas ao excluir o lançamento do estoque. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
            return;
        }

        Pesquisar();
    };

    ajax.Request(p);
}

function TransferirETQ(codigo, loja, qtd, largura, altura, nome) {

    if(!CheckPermissao(32, true, 'Você não possui permissão para transferir o estoque', false)){
        return;
    }

    if(parseInt(qtd) == 0){
        MostrarMsg("A quantidade disponível em estoque é 0, não é possível transferir.", '');
        return;
    }

    if (!isElement('div', 'divTransf')) {
        var div = DOM.newElement('div', 'divTransf');
        document.body.appendChild(div);
    } else {
        var div = Selector.$('divTransf');
    }

    div.innerHTML = '<h1 id="nomeMaterial" class="fonte_Roboto_titulo_normal">' + nome + '</h1>';

    div.innerHTML += '<div class="divcontainer" style="max-width: 300px;">' +
            '<label>Galeria De</label>' +
            '<select class="combo_cinzafoco" disabled="disabled" id="galeriaDe" style="width:100%;" ></select>' +
            '<label>Qtde Atual</label><br />' +
            '<input type="text" class="textbox_cinzafoco" id="qtdAtual"  style="width:100px; background:#EEEEEE" readonly="readonly"/>' +
            '</div> ';

    div.innerHTML += '<div class="divcontainer" style="max-width: 300px;">' +
            '<label>Galeria Para</label>' +
            '<select class="combo_cinzafoco" id="galeriaPara" style="width:100%;" ></select>' +
            '<label>Qtde</label><br />' +
            '<input type="text" class="textbox_cinzafoco" id="qtdPara" style="width:100px;"  />' +
            '</div> ';

    div.innerHTML += '<div align="right" style="float:right; width:300px;"><div class="divcontainer" style="max-width: 100px; "> ' +
            '<input id="cmdTransferir" type="submit"  class="botaosimplesfoco" onclick="TransferirEstoque(' + codigo + ',\'' + largura + '\',\'' + altura + '\')"  value="Transferir" /> ' +
            '</div><div class="divcontainer" style="max-width: 80px; margin-right:5px "> ' +
            '<a class="legendaCancelar" style="margin-left:10px" onclick="dialogoTransf.Close()">Cancelar</a> ' +
            '</div></div>';

    getLojas(Selector.$('galeriaDe'), 'Selecione...', false);
    getLojas(Selector.$('galeriaPara'), 'Selecione...', false);

    dialogoTransf = new caixaDialogo('divTransf', 220, 670, 'padrao/', 130);
    dialogoTransf.Show();

    Selector.$('qtdAtual').value = qtd;
    Select.Show(Selector.$('galeriaDe'), loja);
    Mask.setOnlyNumbers(Selector.$('qtdPara'));
    Selector.$('qtdPara').focus();
}

function TransferirEstoque(codigo, largura, altura) {

    if (Selector.$('galeriaPara').selectedIndex <= 0) {
        MostrarMsg("Por favor Selecione a Galeria de Destino", 'galeriaPara');
        return;
    }

    if (Selector.$('galeriaDe').selectedIndex == Selector.$('galeriaPara').selectedIndex) {
        MostrarMsg("Não é possivel transferir para a mesma galeria, favor selecionar outra", 'galeriaPara');
        return;
    }

    if (Selector.$('qtdPara').value.trim() <= 0) {
        MostrarMsg("Por favor informe uma quantidade válida!", 'qtdPara');
        return;
    }

    if (parseInt(Selector.$('qtdPara').value) <= 0) {
        MostrarMsg("Por favor informe uma quantidade válida!", 'qtdPara');
        return;
    }

    if (parseInt(Selector.$('qtdPara').value) > parseInt(Selector.$('qtdAtual').value)) {
        MostrarMsg("Por favor informe uma quantidade menor ou igual a " + Selector.$('qtdAtual').value, 'qtdPara');
        return;
    }

    if (Selector.$('cmdTransferir').value !== "Transferir") {
        return;
    }

    Selector.$('cmdTransferir').value = "Transferindo...";    
 
    var ajax = new Ajax('POST', 'php/estoque-de-materiais.php', true);
    var p = 'action=TransferirEstoque';
    p += '&codigo=' + codigo;
    p += '&qtd=' + Selector.$('qtdPara').value;
    p += '&galeriaDe=' + Selector.$('galeriaDe').value;
    p += '&galeriaPara=' + Selector.$('galeriaPara').value;
    p += '&galeriaNomeDe=' + Select.GetText(Selector.$('galeriaDe'));
    p += '&galeriaNomePara=' + Select.GetText(Selector.$('galeriaPara'));
    p += '&largura=' + largura;
    p += '&altura=' + altura;
 
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('cmdTransferir').value = "Transferir";

        if (ajax.getResponseText() == '0') {
            MostrarMsg('Problemas ao transferir o estoque. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
            return;
        }
        
        dialogoTransf.Close();
        Pesquisar();
    };
 
    ajax.Request(p);
}