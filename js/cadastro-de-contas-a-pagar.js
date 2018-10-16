checkSessao();
CheckPermissao(75, false, '', true);
var codigoAtual = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Contas à Pagar</div>";
    carregarmenu();
    getDadosUsuario();
    getLojas(Selector.$('statusLoja'), 'Selecione uma loja', false);
    getLojas(Selector.$('loja'), 'Selecione uma loja', false);
    Mask.setData(Selector.$('emissao'));
    Mask.setOnlyNumbers(Selector.$('qtd'));
    Mask.setMoeda(Selector.$('media'));
    Mask.setMoeda(Selector.$('tolerancia'));

    Selector.$('total').style.textAlign = 'right';
    Selector.$('totalpago').style.textAlign = 'right';
    Selector.$('media').style.textAlign = 'right';
    Selector.$('tolerancia').style.textAlign = 'right';

    grid = new Table('grid');
    grid.table.setAttribute('class', 'tabela_cinza_foco');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');

    grid.addHeader([
        DOM.newText(''),
        DOM.newText('Nº'),
        DOM.newText('Data'),
        DOM.newText('Vencimento'),
        DOM.newText('Valor'),
        DOM.newText('Pago'),
        DOM.newText('Data Pago'),
        DOM.newText('R$ Desc.'),
        DOM.newText('R$ Juros'),
        DOM.newText('R$ Pago'),
        DOM.newText('Pago Por'),
        DOM.newText('Forma Pgto.'),
        DOM.newText('Conta'),
        DOM.newText('Obs Pgto.'),
        DOM.newText(''),
        DOM.newText(''),
        DOM.newText('idPagoPor'),
        DOM.newText('idFormaPagamento'),
        DOM.newText('idConta')
    ]);

    grid.hiddenCol(16);
    grid.hiddenCol(17);
    grid.hiddenCol(18);

    Selector.$('divTabela').appendChild(grid.table);

    gridPesquisa = new Table('grid');
    gridPesquisa.table.setAttribute('cellpadding', '5');
    gridPesquisa.table.setAttribute('cellspacing', '0');
    gridPesquisa.table.setAttribute('class', 'tabela_cinza_foco');

    gridPesquisa.addHeader([
        DOM.newText('Título'),
        DOM.newText('C. Custo'),
        DOM.newText('Natureza'),
        DOM.newText('Origem'),
        DOM.newText('Nome'),
        DOM.newText('Qtd. Parcelas'),
        DOM.newText('Valor (R$)'),
        DOM.newText('Situação'),
        DOM.newText('')
    ]);

    Selector.$('tabela').appendChild(gridPesquisa.table);
    getContasPagar();

    //==== VERIFICA SE ESTÁ VINDO DO RELATÓRIO =======
    var source = Window.getParameter('source');
    var idTituloP = Window.getParameter('idTituloP');

    if ((source === null || source === '') && (idTituloP === null || idTituloP === '')) {
        //==== SENÃO, CARREGA AS COMBOS DE FORMA ASCINCRONA =======

        getCentrosCusto(Selector.$('custo'), "Selecione um centro de custo", true);
        getNaturezas(Selector.$('natureza'), "Selecione uma natureza", true);
        getArtistas(Selector.$('fornecedor'), "Selecione um artista", true);
        Limpar();
    } else {

        getCentrosCusto(Selector.$('custo'), "Selecione um centro de custo", false);
        getNaturezas(Selector.$('natureza'), "Selecione uma natureza", false);
        getArtistas(Selector.$('fornecedor'), "Selecione um artista", false);
    }

    if (source === 'relatorio-de-contas-a-pagar') {
        //==== SE SIM, CARREGA AS COMBOS DE FORMA SINCRONA, VERIFICA QUAL O TITULO E MOSTRA ======
        var titulo = Window.getParameter('idTitulo');

        if (titulo !== null && titulo !== '') {

            Novo(titulo);
            Selector.$('botVoltar').style.display = 'inherit';

        } else {
            Limpar();
            Selector.$('botVoltar').style.display = 'none';
        }
    } else if (source == 'fornecedores' || source == 'artistas' || source == 'automoveis' || source == 'repasses-de-artistas' || source == 'repasses-de-marchands' || source == 'repasses-de-marchands-gerentes' || source == 'repasses-de-arquitetos') {

        var idConpag = Window.getParameter('idConpag');

        if (idConpag !== null && idConpag !== '') {

            Novo(idConpag);
            Selector.$('botVoltar').style.display = 'inherit';
        } else {
            Limpar();
            Selector.$('botVoltar').style.display = 'none';
        }
    }

    var idTitulo = Window.getParameter('idTitulo');

    if (idTitulo !== null && idTitulo !== '') {
        Novo(idTitulo);
    }

    ajustaAlturaTabela();
}

window.onresize = function () {

    ajustaAlturaTabela();
}

function ajustaAlturaTabela() {
    Selector.$('tabela').style.height = ((document.documentElement.clientHeight - Selector.$('cabecalho').clientHeight) - 80) + "px";
}

function Novo(codigo) {

    if(codigo <= 0){
        if(!CheckPermissao(76, true, 'Você não possui permissão para cadastrar uma conta à pagar', false)){
            return;
        }
    }else{
         if(!CheckPermissao(168, true, 'Você não possui permissão para Visualizar detalhes sobre Contas a Pagar', false)){
            return;
        }
    }
    
    Limpar();
    
    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').setAttribute('class', 'quadrosimples');
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:50px; background-color:#FFF; overflow:hidden; width:100%; ');
        Selector.$('divCadastro').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        ajustaAlturaTabela();
        getContasPagar();
    } else {
        Selector.$('divContainer').setAttribute('class', '');
        Selector.$('divContainer').style.maxWidth = '1060px';
        Selector.$('divCadastro').setAttribute('style', 'height:auto;  width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';

        if (codigo <= 0) {
            Selector.$('gerarParcelas').style.visibility = "visible";
            Selector.$('emissao').value = Date.GetDate(false);
        } else {
            codigoAtual = codigo;
            Modificar_onClick();
        }
    }
}

function getContasPagar() {

    gridPesquisa.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', true);

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        var visualizar = null;
        var cor = true;

        for (var i = 0; i < json.length; i++) {

            //==== VISUALIZAR PARCELA/TÍTULO ======
            visualizar = DOM.newElement('img');
            visualizar.setAttribute('class', 'efeito-opacidade-75-03');
            visualizar.setAttribute('src', 'imagens/pesquisar.png');
            visualizar.setAttribute('style', 'width:18px; height:18px');
            visualizar.setAttribute('title', 'Editar');
            visualizar.setAttribute('onclick', 'Novo(' + json[i].codigo + ')');

            gridPesquisa.addRow([
                DOM.newText(json[i].titulo),
                DOM.newText(json[i].centroCusto),
                DOM.newText(json[i].natureza),
                DOM.newText(json[i].origem),
                DOM.newText(json[i].nome),
                DOM.newText(json[i].qtdParcelas),
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].situacao),
                visualizar
            ]);

            gridPesquisa.setRowData(gridPesquisa.getRowCount() - 1, json[i].idTitulo);
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 0).style.textAlign = 'center';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 1).style.textAlign = 'left';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 2).style.textAlign = 'left';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 3).style.textAlign = 'left';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 4).style.textAlign = 'left';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 5).style.textAlign = 'center';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 6).style.textAlign = 'right';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 7).style.textAlign = 'left';
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 8).style.textAlign = 'center';

            gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('class', 'cor');

            if (cor) {
                gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('style', 'background-color:#F7F7F7');
                cor = false;
            } else {
                cor = true;
            }

            //==== SE ESTÁ VENCIDO, PINTA O TEXTO DE VERMELHO ======

            if (json[i].idSituacao == '2') {
                gridPesquisa.setRowForegroundColor(gridPesquisa.getRowCount() - 1, '#CC0000');
            }
        }

    };

    var p = 'action=getContasPagar';
    p += '&busca=' + Selector.$('busca').value.trim();
    p += '&loja=' + Selector.$('statusLoja').value;
    p += '&emAberto=' + Selector.$('optEmAberto').checked;
    p += '&pagos=' + Selector.$('optPagos').checked;
    p += '&todos=' + Selector.$('optTodos').checked;

    ajax.Request(p);
}

function Voltar() {

    if (Window.getParameter('source') === 'relatorio-de-contas-a-pagar') {
        window.location = "relatorio-de-contas-a-pagar.html?return=1";
    } else if (Window.getParameter('source') === 'fornecedores') {
        window.location = "fornecedores.html?return=1&idFornecedor=" + Selector.$('fornecedor').value;
    } else if (Window.getParameter('source') === 'artistas') {
        window.location = "cadastro-de-artistas.html?return=1&aba=pagamentos&idArtista=" + Selector.$('fornecedor').value;
    } else if (Window.getParameter('source') === 'automoveis') {
        window.location = "veiculos.html";
    }
}

function setTitulo(titulo) {

    Mostrar(titulo);
    dialogoPesquisa.Close();
}

function PesquisarTitulos() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', true);

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        gridPesquisa.clearRows();

        Selector.$('PesquisarA').innerHTML = 'Pesquisar';

        if (ajax.getResponseText() == '-1') {
            Selector.$('PesquisarA').innerHTML = 'Pesquisar';
            Selector.$('PesquisarA').disabled = false;

            Selector.$('p_centroCusto').disabled = false;
            Selector.$('p_natureza').disabled = false;
            Selector.$('p_fornecedor').disabled = false;

            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        var cor = true;

        for (var i = 0; i < json.length; i++) {

            var origem = '';
            var nome = '';

            if (json[i].idArtista !== '') {
                origem = 'Artistas';
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

            gridPesquisa.addRow([
                DOM.newText(json[i].codTitulo),
                DOM.newText(json[i].centroCusto),
                DOM.newText(json[i].natureza),
                DOM.newText(origem),
                DOM.newText(nome),
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].qtdeParcelas),
                DOM.newText(json[i].descricao)
            ]);

            gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('class', 'cor');
            gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridPesquisa.getRow(gridPesquisa.getRowCount() - 1).setAttribute('onclick', 'setTitulo(' + json[i].codigo + ');');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 0).setAttribute('style', 'text-align:center');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 1).setAttribute('style', 'width:100px;');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 2).setAttribute('style', 'width:100px;');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 3).setAttribute('style', 'text-align:center');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 4).setAttribute('style', 'width:200px;');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 5).setAttribute('style', 'text-align:right');
            gridPesquisa.getCell(gridPesquisa.getRowCount() - 1, 6).setAttribute('style', 'text-align:center');

            if (cor) {
                gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, '#EEEEEE');
                cor = false;
            } else {
                gridPesquisa.setRowBackgroundColor(gridPesquisa.getRowCount() - 1, '#FFFFFF');
                cor = true;
            }
        }

        Selector.$('PesquisarA').value = 'Pesquisar';
        Selector.$('PesquisarA').disabled = false;
        Selector.$('p_centroCusto').disabled = false;
        Selector.$('p_natureza').disabled = false;
        Selector.$('p_fornecedor').disabled = false;
    };

    var p = 'action=PesquisarTitulos';
    p += '&idCentroCusto=' + Selector.$('p_centroCusto').value;
    p += '&idNatureza=' + Selector.$('p_natureza').value;

    if (Selector.$('artistas2').checked) {
        p += '&origem=1';
    } else if (Selector.$('fornecedores2').checked) {
        p += '&origem=2';
    } else if (Selector.$('funcionarios2').checked) {
        p += '&origem=3';
    } else {
        p += '&origem=4';
    }

    p += '&idOrigem=' + Selector.$('p_fornecedor').value;

    Selector.$('PesquisarA').innerHTML = 'Pesquisando...';
    Selector.$('PesquisarA').disabled = true;

    Selector.$('p_centroCusto').disabled = true;
    Selector.$('p_natureza').disabled = true;
    Selector.$('p_fornecedor').disabled = true;

    ajax.Request(p);
}

function Pesquisar_onClick() {

    if (!isElement('div', 'promptPesquisar')) {
        var divPesquisa = DOM.newElement('div', 'promptPesquisar');
        document.body.appendChild(divPesquisa);
    }

    var div = Selector.$('promptPesquisar');

    div.innerHTML = '';

    //----------CENTRO DE CUSTO----------//
    var lblCentro = DOM.newElement('label');
    lblCentro.setAttribute("Style", "color: #000; margin-right:5px;");
    lblCentro.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCentro.appendChild(DOM.newText('Centro de Custo:'));

    var cmbCentro = DOM.newElement('select');
    cmbCentro.setAttribute('id', 'p_centroCusto');
    cmbCentro.setAttribute("style", 'margin-right:5px; width: 235px');
    cmbCentro.setAttribute('class', 'textbox_cinza');

    //----------NATUREZA----------//
    var lblNatureza = DOM.newElement('label');
    lblNatureza.setAttribute("Style", "color: #000; margin-right:5px;");
    lblNatureza.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNatureza.appendChild(DOM.newText('Natureza:'));

    var cmbNatureza = DOM.newElement('select');
    cmbNatureza.setAttribute('id', 'p_natureza');
    cmbNatureza.setAttribute("style", 'margin-right:5px; width: 235px');
    cmbNatureza.setAttribute('class', 'textbox_cinza');

    var radioArtistas = DOM.newElement('radio', 'artistas2');
    radioArtistas.setAttribute('name', 'origem');
    radioArtistas.setAttribute('checked', 'checked');
    radioArtistas.setAttribute('onclick', 'LoadTipo("' + 1 + '", true, "p_fornecedor", "Filtrar por artista")');

    var lblArtistas = DOM.newElement('label');
    lblArtistas.setAttribute("Style", "color: #000; margin-right:5px;");
    lblArtistas.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblArtistas.appendChild(DOM.newText('Artistas'));

    var radioFornecedores = DOM.newElement('radio', 'fornecedores2');
    radioFornecedores.setAttribute('name', 'origem');
    radioFornecedores.setAttribute('onclick', 'LoadTipo("' + 2 + '", true, "p_fornecedor", "Filtrar por fornecedor")');

    var lblFornecedores = DOM.newElement('label');
    lblFornecedores.setAttribute("Style", "color: #000; margin-right:5px;");
    lblFornecedores.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblFornecedores.appendChild(DOM.newText('Fornecedores'));

    var radioFuncionarios = DOM.newElement('radio', 'funcionarios2');
    radioFuncionarios.setAttribute('name', 'origem');
    radioFuncionarios.setAttribute('onclick', 'LoadTipo("' + 3 + '", true, "p_fornecedor", "Filtrar por funcionário")');

    var lblFuncionarios = DOM.newElement('label');
    lblFuncionarios.setAttribute("Style", "color: #000; margin-right:5px;");
    lblFuncionarios.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblFuncionarios.appendChild(DOM.newText('Funcionários'));

    var radioVendedores = DOM.newElement('radio', 'vendedores2');
    radioVendedores.setAttribute('name', 'origem');
    radioVendedores.setAttribute('onclick', 'LoadTipo("' + 4 + '", true, "p_fornecedor", "Filtrar por vendedor")');

    var lblVendedores = DOM.newElement('label');
    lblVendedores.setAttribute("Style", "color: #000; margin-right:5px;");
    lblVendedores.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblVendedores.appendChild(DOM.newText('Vendedores'));

    //----------FORNECEDOR----------//

    var cmbFornecedor = DOM.newElement('select');
    cmbFornecedor.setAttribute('id', 'p_fornecedor');
    cmbFornecedor.setAttribute("style", 'margin:0px; width: 520px;');
    cmbFornecedor.setAttribute('class', 'textbox_cinza');

    //----------Botões----------//

    var PesquisarA = DOM.newElement('button', 'PesquisarA');
    PesquisarA.setAttribute('class', 'botaosimplesfoco');
    PesquisarA.setAttribute('style', 'float:right;');
    PesquisarA.innerHTML = 'Pesquisar';
    PesquisarA.setAttribute('onclick', 'PesquisarTitulos();');

    //--------Fim Botões---------//

    var divAux = DOM.newElement('div');
    divAux.setAttribute('class', 'tabelarel');
    divAux.setAttribute('style', 'height:270px; overflow: auto;');

    gridPesquisa = new Table('grid');
    gridPesquisa.table.setAttribute('class', 'tabela_cinza_foco');
    gridPesquisa.table.setAttribute('cellpadding', '5');
    gridPesquisa.table.setAttribute('cellspacing', '0');

    gridPesquisa.addHeader([
        DOM.newText('Título'),
        DOM.newText('Centro de Custo'),
        DOM.newText('Natureza'),
        DOM.newText('Origem'),
        DOM.newText('Nome'),
        DOM.newText('Valor Total (R$)'),
        DOM.newText('Qtde. Parc.'),
        DOM.newText('Descrição')
    ]);

    //----------Inserir na DIV---------//

    div.appendChild(lblCentro);
    div.appendChild(cmbCentro);
    div.appendChild(lblNatureza);
    div.appendChild(cmbNatureza);
    div.innerHTML += '<br /><br>';
    div.appendChild(radioArtistas);
    div.appendChild(lblArtistas);
    div.appendChild(radioFornecedores);
    div.appendChild(lblFornecedores);
    div.appendChild(radioFuncionarios);
    div.appendChild(lblFuncionarios);
    div.appendChild(radioVendedores);
    div.appendChild(lblVendedores);
    div.innerHTML += '<br />';
    div.appendChild(cmbFornecedor);
    div.appendChild(PesquisarA);
    div.innerHTML += '<br><br>';
    divAux.appendChild(gridPesquisa.table);
    div.appendChild(divAux);

    //----------FIM-----------//

    var div1 = DOM.newElement('div', 'divFooterR');
    document.body.appendChild(div1);
    var div2 = DOM.newElement('div', 'divFooterL');
    document.body.appendChild(div2);

    dialogoPesquisa = new caixaDialogo('promptPesquisar', 420, 900, './padrao/', 111);
    dialogoPesquisa.Show();

    getCentrosCusto(Selector.$('p_centroCusto'), "Filtrar por centro de custo", true);
    getNaturezas(Selector.$('p_natureza'), "Filtrar por natureza", true);
    getArtistas(Selector.$('p_fornecedor'), "Filtrar por artista", true);
}

function Excluir_Aux(linha) {

    mensagemExcluirParc2.Close();

    if (grid.getRowData(linha) > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
        var p = 'action=ExcluirParcela';
        p += '&codParcela=' + grid.getRowData(linha);

        ajax.Request(p);

        if (ajax.getResponseText() === 'OK') {
            grid.deleteRow(linha);
        } else {
            var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Não foi possível exluir a parcela. Tente novamente, caso o problema persista, contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
        }
    } else {
        grid.deleteRow(linha);
    }

    //ATUALIZA OS NÚMEROS DAS LINHAS NAS FUNÇÕES
    for (var i = 0; i < grid.getRowCount(); i++) {
        grid.getCellObject(i, 5).setAttribute('onclick', 'Pagar(' + i + ')');
        grid.getCellObject(i, 14).setAttribute('onclick', 'Editar(' + i + ')');
        grid.getCellObject(i, 15).setAttribute('onclick', 'Excluir(' + i + ')');
    }
}

function Excluir(linha) {

    if(!CheckPermissao(78, true, 'Você não possui permissão para excluir uma parcela', false)){
        return;
    }
    
    mensagemExcluirParc2 = new DialogoMensagens("prompt", 165, 380, 150, "4", "Atenção!", "Deseja realmente excluír a parcela N° " + parseInt(grid.getCellText(linha, 1)) + "?<br /><br />ATENÇÃO: OPERAÇÃO IRREVERSÍVEL", "OK", "Excluir_Aux(" + linha + ");", true, "");
    mensagemExcluirParc2.Show();
}

function Excluir_AuxParc() {

    mensagemExcluirParc.Close();

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    var p = 'action=Excluir';
    p += '&codigo=' + codigoAtual;

    ajax.Request(p);

    if (ajax.getResponseText() === 'OK') {
        Limpar();
    } else {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "4", "Erro!", "Não foi possível exluir o título. Tente novamente, caso o problema persista, contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
    }
}

function Excluir_onClick() {

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 135, 340, 150, "4", "Atenção!", "Nenhum registro ativo.<br />Selecione um título para excluir.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    mensagemExcluirParc = new DialogoMensagens("prompt", 185, 380, 150, "4", "Atenção!", "Deseja realmente excluír o título N° " + parseInt(codigoAtual) + "?<br /> <br />ATENÇÃO: As parcelas também serão excluídas.<br />OPERAÇÃO IRREVERSÍVEL", "OK", "Excluir_AuxParc();", true, "");
    mensagemExcluirParc.Show();
}

function Sair_onClick() {

    Novo(0);
}

function EditarAux(linha) {

    mensagemEditarParc.Close();

    if (codigoAtual > 0) {
        if (Salvar()) {
            Mostrar(codigoAtual);
        }
    }

    editarParcela(linha);
}

function Editar(linha) {

    editarParcela(linha);
}

function Modificar_onClick() {

    Mostrar(codigoAtual);

    if (grid.getRowCount() > 0)
        Selector.$('gerarParcelas').style.visibility = 'hidden';
    else
        Selector.$('gerarParcelas').style.visibility = 'visible';
}

function Gravar_onClick() {

    if (Salvar()) {
        Novo(0);
    }
}

function d_gerarParcelas() {

    var numParcelas = Selector.$('d_qtdeParcelas');
    if (numParcelas.value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha a quantidade de parcelas", "OK", "", false, "d_qtdeParcelas");
        mensagem.Show();
        return;
    }

    var dataPrimeiroVencimento = Selector.$('d_dataPrimeiroVencimento');
    if (!Date.isDate(dataPrimeiroVencimento.value.trim())) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Por favor, preencha a data do primeiro vencimento", "OK", "", false, "d_dataPrimeiroVencimento");
        mensagem.Show();
        return;
    }

    var valorParcela = Selector.$('d_valorParcela');
    var valorTotal = Selector.$('d_valorTotal');

    if (valorParcela.value.trim() === '' && valorTotal.value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Por favor, preencha o valor da parcela ou o valor total para que o sistema calcule", "OK", "", false, "d_valorParcela");
        mensagem.Show();
        return;
    }

    dialogoGerar.Close();

    grid.clearRows();

    var tolUlt = false;
    var aux = null;
    var cor;

    for (var i = 1; i <= numParcelas.value; i++) {

        tolUlt = VerificaTolerancia(valorParcela.value, Selector.$('media').value, Selector.$('tolerancia').value, Selector.$('total').value, Selector.$('qtd').value);
        aux = null;

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('class', 'efeito-opacidade-75-03');
        editar.setAttribute('style', 'width:18px; height:18px');
        editar.setAttribute('title', 'Editar');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('class', 'efeito-opacidade-75-03');
        excluir.setAttribute('style', 'width:18px; height:18px');
        excluir.setAttribute('title', 'Excluir');

        var pago = DOM.newElement('img');
        pago.setAttribute('src', 'imagens/money2.png');
        pago.setAttribute('class', 'efeito-opacidade-75-03');
        pago.setAttribute('style', 'width:18px; height:18px');
        pago.setAttribute('title', 'Efetuar pagamento');
        pago.setAttribute('onclick', 'Pagar(' + grid.getRowCount() + ', false)');

        if (tolUlt) {
            aux = DOM.newElement('img');
            aux.setAttribute('src', 'imagens/exclamation.png');
            aux.setAttribute('class', 'efeito-opacidade-75-03');
            aux.setAttribute('style', 'width:18px; height:18px');
            aux.setAttribute('title', 'Tolerância Ultrapassada!');
        }
        else {
            aux = DOM.newElement('a');
            aux.appendChild(DOM.newText(''));
        }

        grid.addRow([
            aux,
            DOM.newText(Number.Complete(i, 4, '0', true)),
            DOM.newText(Date.GetDate(false)),
            DOM.newText(Date.ConvertToString(Date.AddDate("m", Date.ConvertToDate(dataPrimeiroVencimento.value), i - 1), false)),
            DOM.newText(valorParcela.value),
            pago,
            DOM.newText('- - -'),
            DOM.newText('0,00'),
            DOM.newText('0,00'),
            DOM.newText('0,00'),
            DOM.newText('- - -'),
            DOM.newText('- - -'),
            DOM.newText('- - -'),
            DOM.newText(''),
            editar,
            excluir,
            DOM.newText('0'),
            DOM.newText('0'),
            DOM.newText('0')
        ]);

        grid.hiddenCol(16);
        grid.hiddenCol(17);
        grid.hiddenCol(18);

        grid.getRow(grid.getRowCount() - 1).setAttribute('class', 'cor');
        grid.getCell(grid.getRowCount() - 1, 0).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 1).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 2).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 3).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 4).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 5).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 6).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 7).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 8).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 9).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 10).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 11).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 12).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 13).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 14).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 15).style.textAlign = 'center';
        grid.setRowData(grid.getRowCount() - 1, 0);

        if ((grid.getRowCount() % 2) === 0)
            cor = true;
        else
            cor = false;

        if (cor) {
            grid.setRowBackgroundColor(grid.getRowCount() - 1, '#EEEEEE');
            cor = false;
        } else {
            grid.setRowBackgroundColor(grid.getRowCount() - 1, '#FFFFFF');
            cor = true;
        }

        if (Date.AddDate("m", Date.ConvertToDate(dataPrimeiroVencimento.value), i - 1) < Date.ConvertToDate(Date.GetDate(false)))
            grid.setRowForegroundColor(grid.getRowCount() - 1, '#CC0000');
        else
            grid.setRowForegroundColor(grid.getRowCount() - 1, 'black');

        grid.getCellObject(grid.getRowCount() - 1, 14).setAttribute('onclick', 'Editar(' + (grid.getRowCount() - 1) + ')');
        grid.getCellObject(grid.getRowCount() - 1, 15).setAttribute('onclick', 'Excluir(' + (grid.getRowCount() - 1) + ')');
    }

    Selector.$('total').value = Number.FormatDinheiro(grid.SumColnoFixed(4));
    Selector.$('totalpago').value = Number.FormatDinheiro(grid.SumColnoFixed(9));
    Selector.$('qtd').value = grid.getRowCount();
}

function gerarParcelasAux() {

    if (Selector.$('prompt').style.visibility === 'visible')
        mensagemGerar.Close();

    if (!isElement('div', 'promptParcela')) {
        var divParcela = DOM.newElement('div', 'promptParcela');
        document.body.appendChild(divParcela);
    }

    var divParcela = Selector.$('promptParcela');
    divParcela.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divParcela.appendChild(divform);

    DialogBox.imagePath = './../../padrao/';

    //----------Numero Parcela----------//

    var lblParcela = DOM.newElement('label');
    lblParcela.setAttribute("Style", "color: #000; margin-left:5px;");
    lblParcela.appendChild(DOM.newText('Qtde. Parcelas:'));

    var txtParcela = DOM.newElement('text');
    txtParcela.setAttribute('id', 'd_qtdeParcelas');
    txtParcela.setAttribute('class', 'textbox_cinza');
    txtParcela.setAttribute('size', '5');
    txtParcela.setAttribute("Style", 'margin-left:10px; margin-top:5px');

    //---------Data Primeiro Vencimento---------//

    var lblVencimento = DOM.newElement('label');
    lblVencimento.setAttribute("Style", "color: #000; margin-left:5px;");
    lblVencimento.appendChild(DOM.newText('1° Vencimento:'));

    var txtVencimento = DOM.newElement('text');
    txtVencimento.setAttribute('id', 'd_dataPrimeiroVencimento');
    txtVencimento.setAttribute('class', 'textbox_cinza');
    txtVencimento.setAttribute('size', '12');
    txtVencimento.setAttribute("Style", 'margin-left:11px; margin-top:5px');

    //---------Valor de Cada Parcela ---------//

    var lblValorParcela = DOM.newElement('label');
    lblValorParcela.setAttribute("Style", "color: #000; margin-left:5px;");
    lblValorParcela.appendChild(DOM.newText('Valor de Cada Parcela (R$):'));

    var txtValorParcela = DOM.newElement('text');
    txtValorParcela.setAttribute('id', 'd_valorParcela');
    txtValorParcela.setAttribute('class', 'textbox_cinza');
    txtValorParcela.setAttribute('size', '12');
    txtValorParcela.setAttribute("Style", 'margin-left:12px; margin-top:5px; text-align: right; margin-bottom: 5px');

    //--------- OU ---------//

    var lblOu = DOM.newElement('label');
    lblOu.setAttribute("Style", "color: #000; margin-left:55px;");
    lblOu.appendChild(DOM.newText('ou'));

    //---------Valor Total ---------//

    var lblValorTotal = DOM.newElement('label');
    lblValorTotal.setAttribute("Style", "color: #000; margin-left:5px;");
    lblValorTotal.appendChild(DOM.newText('Valor Total do Título (R$):'));

    var txtValorTotal = DOM.newElement('text');
    txtValorTotal.setAttribute('id', 'd_valorTotal');
    txtValorTotal.setAttribute('class', 'textbox_cinza');
    txtValorTotal.setAttribute('size', '12');
    txtValorTotal.setAttribute('onclick', 'calcularValores()');
    txtValorTotal.setAttribute("Style", 'margin-left:24px; margin-top:5px; text-align: right');

    //----------Botões----------//

    var btnLimpar = DOM.newElement('button');
    btnLimpar.setAttribute('id', 'd_limparGeracao');
    btnLimpar.setAttribute('class', 'botaosimplesfoco');
    btnLimpar.setAttribute("style", 'float:left; margin-left:10px;');
    btnLimpar.innerHTML = 'Limpar';
    btnLimpar.setAttribute('onclick', 'd_limparGerarParc();');

    var btnGravar = DOM.newElement('button');
    btnGravar.setAttribute('id', 'd_GerarParcelas');
    btnGravar.setAttribute('class', 'botaosimplesfoco');
    btnGravar.setAttribute("style", 'float:left');
    btnGravar.innerHTML = 'Gerar';
    btnGravar.setAttribute('onclick', 'd_gerarParcelas();');

    //----------Inserir na DIV---------//

    divform.appendChild(lblParcela);
    divform.appendChild(txtParcela);
    divform.innerHTML += "<br />";
    divform.appendChild(lblVencimento);
    divform.appendChild(txtVencimento);
    divform.innerHTML += "<br />";
    divform.appendChild(lblValorParcela);
    divform.appendChild(txtValorParcela);
    divform.innerHTML += "<br />";
    divform.appendChild(lblOu);
    divform.innerHTML += "<br />";
    divform.appendChild(lblValorTotal);
    divform.appendChild(txtValorTotal);
    divform.innerHTML += "<br />";
    divform.innerHTML += "<br />";
    divform.appendChild(btnGravar);
    divform.appendChild(btnLimpar);

    //----------FIM-----------//

    dialogoGerar = new caixaDialogo('promptParcela', 270, 370, '../padrao/', 111);
    dialogoGerar.Show();

    Mask.setOnlyNumbers(Selector.$('d_qtdeParcelas'));
    Mask.setData(Selector.$('d_dataPrimeiroVencimento'));
    Mask.setMoeda(Selector.$('d_valorParcela'));
    Mask.setMoeda(Selector.$('d_valorTotal'));
    Selector.$('d_qtdeParcelas').setAttribute('onblur', "calcularValores(true, false, false)");
    Selector.$('d_valorParcela').setAttribute('onblur', "calcularValores(false, true, false)");
    Selector.$('d_valorTotal').setAttribute('onblur', "calcularValores(false, false, true)");
    Selector.$('d_qtdeParcelas').select();
}

function d_limparGerarParc() {

    Selector.$('d_qtdeParcelas').value = '';
    Selector.$('d_valorParcela').value = '';
    Selector.$('d_valorTotal').value = '';
    Selector.$('d_qtdeParcelas').focus();
}

function calcularValores(orQtde, orParcela, orTotal) {

    if (orQtde) {
        Selector.$('d_valorParcela').value = '';
        Selector.$('d_valorTotal').value = '';
        return;
    }

    if (orParcela)
        Selector.$('d_valorTotal').value = '';

    if (orTotal)
        Selector.$('d_valorParcela').value = '';

    var qtde = Selector.$('d_qtdeParcelas').value;
    var valorParcela = Selector.$('d_valorParcela').value;
    var valorTotal = Selector.$('d_valorTotal').value;

    if (qtde.trim() === '' && valorParcela.trim() === '' && valorTotal.trim() === '')
        return;

    if (qtde.trim() === '')
        return;

    qtde = parseInt(qtde);
    if (qtde <= 0)
        return;

    valorParcela = Number.parseFloat(valorParcela);
    valorTotal = Number.parseFloat(valorTotal);

    if (valorTotal > 0 && valorParcela > 0)
        return;

    var aux = 0;

    if (valorParcela > 0) {
        aux = valorParcela * qtde;
        Selector.$('d_valorTotal').value = Number.FormatDinheiro(aux);
    }
    else {
        aux = valorTotal / qtde;
        Selector.$('d_valorParcela').value = Number.FormatDinheiro(aux);
    }
}

function gerarParcelas() {

    var tolerancia = Selector.$('tolerancia');
    var media = Selector.$('media');

    if (grid.getRowCount() > 0) {
        mensagemGerar = new DialogoMensagens("prompt", 205, 380, 150, "4", "Atenção!", "Ao gerar novas parcelas as anteriores serão excluídas.<br/><br/>Deseja continuar?", "OK", "gerarParcelasAux();", true, "");
        mensagemGerar.Show();
    }else {

        gerarParcelasAux();
    }
}

function d_gravarParcela(linha) {

    var numParcela = Selector.$('d_numParcela');
    if (numParcela.value === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 152, "2", "Atenção!", "Por favor, preencha o número da parcela", "OK", "", false, "d_numParcela");
        mensagem.Show();
        return false;
    }

    if (linha < 0) {

        var achou = false;

        for (var i = 0; i < grid.getRowCount(); i++) {
            if (parseInt(grid.getCellText(i, 1)) === parseInt(numParcela.value.trim())) {
                achou = true;
                i = 10000;
            }
        }

        if (achou) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 152, "2", "Atenção!", "Este número de parcela já existe. Favor conferir.", "OK", "", false, "d_numParcela");
            mensagem.Show();
            return false;
        }
    }

    var dataVencimento = Selector.$('d_dataVencimento');
    if (!Date.isDate(dataVencimento.value)) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 152, "2", "Atenção!", "Data de vencimento inválida", "OK", "", false, "d_dataVencimento");
        mensagem.Show();
        return false;
    }

    var valor = Selector.$('d_valor');
    if (valor.value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 152, "2", "Atenção!", "Por favor, preencha o valor da parcela", "OK", "", false, "d_valor");
        mensagem.Show();
        return false;
    }

    //VERIFICA SE ULTRAPASSOU A TOLERANCIA
    var tolUlt = VerificaTolerancia(valor.value, Selector.$('media').value, Selector.$('tolerancia').value, Selector.$('total').value, Selector.$('qtd').value);
    var aux = null;

    if (linha < 0) {

        //NOVA PARCELA
        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('class', 'efeito-opacidade-75-03');
        editar.setAttribute('style', 'width:18px; height:18px');
        editar.setAttribute('title', 'Editar');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('class', 'efeito-opacidade-75-03');
        excluir.setAttribute('style', 'width:18px; height:18px');
        excluir.setAttribute('title', 'Excluir');

        var pago = DOM.newElement('img');
        pago.setAttribute('src', 'imagens/money2.png');
        pago.setAttribute('class', 'efeito-opacidade-75-03');
        pago.setAttribute('style', 'width:18px; height:18px');
        pago.setAttribute('title', 'Efetuar pagamento');
        pago.setAttribute('onclick', 'Pagar(' + grid.getRowCount() + ', false)');

        if (tolUlt) {
            aux = DOM.newElement('img');
            aux.setAttribute('src', 'imagens/exclamation.png');
            aux.setAttribute('class', 'efeito-opacidade-75-03');
            aux.setAttribute('style', 'width:18px; height:18px');
            aux.setAttribute('title', 'Tolerância Ultrapassada!');
        }
        else {
            aux = DOM.newElement('a');
            aux.appendChild(DOM.newText(''));
        }

        grid.addRow([
            aux,
            DOM.newText(Number.Complete(numParcela.value, 4, '0', true)),
            DOM.newText(Date.GetDate(false)),
            DOM.newText(dataVencimento.value),
            DOM.newText(valor.value),
            pago,
            DOM.newText('- - -'),
            DOM.newText('0,00'),
            DOM.newText('0,00'),
            DOM.newText('0,00'),
            DOM.newText('- - -'),
            DOM.newText('- - -'),
            DOM.newText('- - -'),
            DOM.newText(''),
            editar,
            excluir,
            DOM.newText('0'),
            DOM.newText('0'),
            DOM.newText('0')
        ]);

        grid.hiddenCol(16);
        grid.hiddenCol(17);
        grid.hiddenCol(18);
        grid.getRow(grid.getRowCount() - 1).setAttribute('class', 'cor');
        grid.getCell(grid.getRowCount() - 1, 0).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 1).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 2).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 3).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 4).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 5).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 6).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 7).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 8).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 9).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 10).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 11).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 12).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 13).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 14).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 15).style.textAlign = 'center';
        grid.setRowData(grid.getRowCount() - 1, 0);

        var cor;

        if ((grid.getRowCount() % 2) === 0)
            cor = true;
        else
            cor = false;

        if (cor) {
            grid.setRowBackgroundColor(grid.getRowCount() - 1, '#EEEEEE');
            cor = false;
        } else {
            grid.setRowBackgroundColor(grid.getRowCount() - 1, '#FFFFFF');
            cor = true;
        }

        if (Date.ConvertToDate(dataVencimento.value) < Date.ConvertToDate(Date.GetDate(false)))
            grid.setRowForegroundColor(grid.getRowCount() - 1, '#CC0000');

        grid.getCellObject(grid.getRowCount() - 1, 14).setAttribute('onclick', 'Editar(' + (grid.getRowCount() - 1) + ')');
        grid.getCellObject(grid.getRowCount() - 1, 15).setAttribute('onclick', 'Excluir(' + (grid.getRowCount() - 1) + ')');
    }
    else {

        //EDIÇÃO DA PARCELA
        if (tolUlt) {
            aux = DOM.newElement('img');
            aux.setAttribute('src', 'imagens/exclamation.png');
            aux.setAttribute('style', 'width:18px; height:18px');
            aux.setAttribute('title', 'Tolerância Ultrapassada!');
        } else {
            aux = DOM.newElement('a');
            aux.appendChild(DOM.newText(''));
        }

        grid.setCellObject(linha, 0, aux);
        grid.setCellText(linha, 1, Selector.$('d_numParcela').value);
        grid.setCellText(linha, 3, Selector.$('d_dataVencimento').value);
        grid.setCellText(linha, 4, Selector.$('d_valor').value);

        if (Date.ConvertToDate(dataVencimento.value) < Date.ConvertToDate(Date.GetDate(false)))
            grid.setRowForegroundColor(linha, '#CC0000');
        else
            grid.setRowForegroundColor(linha, 'black');
    }

    Selector.$('total').value = Number.FormatDinheiro(grid.SumColnoFixed(4));
    Selector.$('totalpago').value = Number.FormatDinheiro(grid.SumColnoFixed(9));
    Selector.$('qtd').value = grid.getRowCount();
    dialogoEditar.Close();
}

function d_gravarPagamento(linha) {
    var pago = null;

    if (Selector.$('p_chkPago').checked) {
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

        pago = DOM.newElement('a');
        pago.setAttribute('onclick', 'Pagar(' + linha + ', true)');
        pago.setAttribute('title', 'Pago, clique para editar');
        pago.appendChild(DOM.newText('SIM'));

        grid.setCellObject(linha, 5, pago);
        grid.setCellText(linha, 6, dataPago.value);
        grid.setCellText(linha, 7, (Selector.$('p_valorDesconto').value.trim() === '' ? '0,00' : Selector.$('p_valorDesconto').value.trim()));
        grid.setCellText(linha, 8, (Selector.$('p_valorJuros').value.trim() === '' ? '0,00' : Selector.$('p_valorJuros').value.trim()));
        grid.setCellText(linha, 9, Selector.$('p_valorPago').value);
        grid.setCellText(linha, 10, Select.GetText(Selector.$('p_pagoPor')));
        grid.setCellText(linha, 11, Select.GetText(Selector.$('p_formaPagamento')));
        grid.setCellText(linha, 12, Select.GetText(Selector.$('p_conta')));
        grid.setCellText(linha, 13, Selector.$('p_obsPagamento').value);
        grid.setCellText(linha, 16, Selector.$('p_pagoPor').value);
        grid.setCellText(linha, 17, Selector.$('p_formaPagamento').value);
        grid.setCellText(linha, 18, Selector.$('p_conta').value);
        grid.hiddenCol(16);
        grid.hiddenCol(17);
        grid.hiddenCol(18);
    } else {
        pago = DOM.newElement('img');
        pago.setAttribute('src', 'imagens/money2.png');
        pago.setAttribute('style', 'width:18px; height:18px');
        pago.setAttribute('title', 'Efetuar pagamento');
        pago.setAttribute('onclick', 'Pagar(' + linha + ', false)');

        grid.setCellObject(linha, 5, pago);
        grid.setCellText(linha, 6, '- - -');
        grid.setCellText(linha, 7, '0,00');
        grid.setCellText(linha, 8, '0,00');
        grid.setCellText(linha, 9, '0,00');
        grid.setCellText(linha, 10, '- - -');
        grid.setCellText(linha, 11, '- - -');
        grid.setCellText(linha, 12, '- - -');
        grid.setCellText(linha, 13, '');
        grid.setCellText(linha, 16, '0');
        grid.setCellText(linha, 17, '0');
        grid.setCellText(linha, 18, '0');
        grid.hiddenCol(16);
        grid.hiddenCol(17);
        grid.hiddenCol(18);
    }

    grid.setRowForegroundColor(grid.getRowCount() - 1, '#000');

    Selector.$('totalpago').value = Number.FormatDinheiro(grid.SumColnoFixed(9));
    dialogoPagar.Close();
}

function PagarAux(linha, pago) {

    mensagemPagar.Close();

    if (codigoAtual > 0) {
        if (Salvar()) {
            Mostrar(codigoAtual)
        }
    }

    Pagar(linha, pago);
}

function Pagar(linha, pago) {

    if(!CheckPermissao(77, true, 'Você não possui permissão para pagar uma parcela', false)){
        return;
    }

    if (!isElement('div', 'promptPagar')) {
        var divPagar = DOM.newElement('div', 'promptPagar');
        document.body.appendChild(divPagar);
    }

    var divPagar = Selector.$('promptPagar');
    divPagar.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPagar.appendChild(divform);

    //----------Pago----------//

    var lblPago = DOM.newElement('label');
    lblPago.setAttribute("style", "color: #000; margin-left:2px;");
    //lblPago.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblPago.appendChild(DOM.newText('Pago'));

    var chkPago = DOM.newElement('checkbox');
    chkPago.setAttribute('id', 'p_chkPago');
    chkPago.setAttribute("style", 'margin-left:1px;');

    //----------Valor da Parcela----------//

    var lblValorParcela = DOM.newElement('label');
    lblValorParcela.setAttribute("style", "color: #000; margin-left:37px; font-size:10px; color: gray");
    lblValorParcela.appendChild(DOM.newText('Valor Parcela (R$): '));

    var lblValorParcela2 = DOM.newElement('label');
    lblValorParcela2.setAttribute('id', 'p_valorParcela');
    lblValorParcela2.setAttribute("style", 'margin-left:2px; font-size: 18px; font-weight: bold; color: gray');
    lblValorParcela2.appendChild(DOM.newText(grid.getCellText(linha, 4)));
    //----------Data Pago----------//

    var lblDataPago = DOM.newElement('label');
    lblDataPago.setAttribute("style", "color: #000; margin-left:2px;");
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
    lblPagoPor.appendChild(DOM.newText('Pago Por:'));

    var cmbPagoPor = DOM.newElement('select');
    cmbPagoPor.setAttribute('id', 'p_pagoPor');
    cmbPagoPor.setAttribute('class', 'combo_cinza');
    cmbPagoPor.setAttribute("style", 'margin-left:32px; margin-top:5px; width: 280px;  height:32px');

    //---------Forma de Pagamento---------//

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.setAttribute("Style", "color: #000; margin-left:2px;");
    lblFormaPagamento.appendChild(DOM.newText('Forma Pgto.:'));

    var cmbFormaPagamento = DOM.newElement('select');
    cmbFormaPagamento.setAttribute('id', 'p_formaPagamento');
    cmbFormaPagamento.setAttribute('class', 'combo_cinza');
    cmbFormaPagamento.setAttribute("style", 'margin-left:16px; margin-top:5px; width: 280px;  height:32px');

    //---------Conta---------//

    var lblConta = DOM.newElement('label');
    lblConta.setAttribute("Style", "color: #000; margin-left:5px;");
    lblConta.appendChild(DOM.newText('Conta:'));

    var cmbConta = DOM.newElement('select');
    cmbConta.setAttribute('id', 'p_conta');
    cmbConta.setAttribute('class', 'combo_cinza');
    cmbConta.setAttribute("style", 'margin-left:20px; margin-top:5px; width: 280px; margin-bottom:5px;  height:32px');

    //---------Obs. Pagamento---------//

    var lblObsPagamento = DOM.newElement('label');
    lblObsPagamento.setAttribute("Style", "color: #000; margin-left:2px;");
    lblObsPagamento.appendChild(DOM.newText('Observação:'));

    var txtObsPagamento = DOM.newElement('textarea');
    txtObsPagamento.setAttribute('id', 'p_obsPagamento');
    txtObsPagamento.setAttribute('class', 'textbox_cinza');
    txtObsPagamento.setAttribute('rows', '5');
    txtObsPagamento.setAttribute('class', 'textbox_cinza');
    txtObsPagamento.setAttribute("Style", 'margin-left:2px; margin-top:5px; width: 365px;  height:70px');

    //----------Botões----------//

    var btnGravar = DOM.newElement('button', 'p_gravarPagamento');
    btnGravar.setAttribute('class', 'botaosimplesfoco');
    btnGravar.setAttribute('style', 'margin-top:10px; float:right; width: 80px;');
    btnGravar.setAttribute('onclick', 'd_gravarPagamento(' + linha + ');');
    btnGravar.innerHTML = 'Gravar';
    //----------Inserir na DIV---------//

    divform.appendChild(chkPago);
    divform.appendChild(lblPago);
    divform.appendChild(lblValorParcela);
    divform.appendChild(lblValorParcela2);
    divform.innerHTML += "<br />";
    divform.appendChild(lblDataPago);
    divform.appendChild(txtDataPago);
    divform.innerHTML += "<br />";
    divform.appendChild(lblValorDesconto);
    divform.appendChild(txtValorDesconto);
    divform.appendChild(lblValorJuros);
    divform.appendChild(txtValorJuros);
    divform.innerHTML += "<br />";
    divform.appendChild(lblValorPago);
    divform.appendChild(txtValorPago);
    divform.innerHTML += "<br />";
    divform.appendChild(lblPagoPor);
    divform.appendChild(cmbPagoPor);
    divform.innerHTML += "<br />";
    divform.appendChild(lblFormaPagamento);
    divform.appendChild(cmbFormaPagamento);
    divform.appendChild(lblConta);
    divform.appendChild(cmbConta);
    divform.innerHTML += "<br />";
    divform.appendChild(lblObsPagamento);
    divform.innerHTML += "<br />";
    divform.appendChild(txtObsPagamento);
    divform.innerHTML += "<br />";
    divform.appendChild(btnGravar);

    //----------FIM-----------//

    dialogoPagar = new caixaDialogo('promptPagar', 445, 470, '../padrao/', 111);
    dialogoPagar.Show();

    Mask.setData(Selector.$('p_dataPago'));
    Mask.setMoeda(Selector.$('p_valorDesconto'));
    Mask.setMoeda(Selector.$('p_valorJuros'));

    Selector.$('p_valorDesconto').setAttribute('onblur', "p_calcularValorPago('" + grid.getCellText(linha, 4) + "')");
    Selector.$('p_valorJuros').setAttribute('onblur', "p_calcularValorPago('" + grid.getCellText(linha, 4) + "')");     //Selector.$('p_valorPago').setAttribute('onkeypress', "return (MaskMoeda(this, event))");

    if (!pago) {

        //NOVA PAGAMENTO
        getFuncionarios(Selector.$('p_pagoPor'), "Selecione um funcionário", false);
        Select.Show(Selector.$('p_pagoPor'), Selector.$('nome_user').name);
        getFormasPagamentos(Selector.$('p_formaPagamento'), "Selecione uma forma de pagamento", true);
        getContasBancarias(Selector.$('p_conta'), "Selecione uma conta", true);

        Selector.$('p_valorPago').value = grid.getCellText(linha, 4);
        Selector.$('p_chkPago').checked = true;
        Selector.$('p_dataPago').value = Date.GetDate(false);
        Selector.$('p_obsPagamento').value = grid.getCellText(linha, 13);
        Select.Show(Selector.$('p_pagoPor'), Selector.$('nome_user').name);
    } else {

        //EDITAR PAGAMENTO
        getFuncionarios(Selector.$('p_pagoPor'), "Selecione...", false);
        getFormasPagamentos(Selector.$('p_formaPagamento'), "Selecione...", false);
        getContasBancarias(Selector.$('p_conta'), "Selecione uma conta", false);

        if (grid.getCellObject(linha, 5).toString() === '')
            Selector.$('p_chkPago').checked = true;
        else
            Selector.$('p_chkPago').checked = false;

        Selector.$('p_dataPago').value = grid.getCellText(linha, 6);
        Selector.$('p_valorDesconto').value = grid.getCellText(linha, 7);
        Selector.$('p_valorJuros').value = grid.getCellText(linha, 8);
        Selector.$('p_valorPago').value = grid.getCellText(linha, 9);
        Selector.$('p_obsPagamento').value = grid.getCellText(linha, 13);


        Select.ShowText(Selector.$('p_pagoPor'), grid.getCellText(linha, 10));
        Select.ShowText(Selector.$('p_formaPagamento'), grid.getCellText(linha, 11));
        Select.ShowText(Selector.$('p_conta'), grid.getCellText(linha, 12));
    }

    Selector.$('p_dataPago').select();
    p_calcularValorPago(grid.getCellText(linha, 4));
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

    var aux = parcela + juros - desconto;

    if (Number.getFloat(Selector.$('p_valorDesconto').value.toString().replace('.', '')) > Number.getFloat(Selector.$('p_valorPago').value.toString().replace('.', ''))) {

        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Valor do desconto não pode ser maior que o valor pago.", "OK", "", false, "p_valorDesconto");
        mensagem.Show();
        Selector.$('p_valorDesconto').value = '';
        return;
    }

    Selector.$('p_valorPago').value = Number.FormatDinheiro(aux);
}

function editarParcelaAux(linha) {

    if (Selector.$('prompt').style.visibility === 'visible')
        mensagemEditar.Close();

    if (!isElement('div', 'promptParcela')) {
        var divParcela = DOM.newElement('div', 'promptParcela');
        document.body.appendChild(divParcela);
    }

    var div = Selector.$('promptParcela');
    div.innerHTML = '';
    DialogBox.imagePath = './../padrao/';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = " Campos obrigatórios";
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

    //----------Numero Parcela----------//

    var lblParcela = DOM.newElement('label');
    lblParcela.setAttribute("Style", "color: #000; margin-left:5px;");
    lblParcela.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblParcela.appendChild(DOM.newText('N° Parcela '));

    var txtParcela = DOM.newElement('text');
    txtParcela.setAttribute('id', 'd_numParcela');
    txtParcela.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtParcela.setAttribute("style", 'width:230px; margin-top:5px');

    //---------Data Vencimento---------//

    var lblVencimento = DOM.newElement('label');
    lblVencimento.setAttribute("style", "color: #000; margin-left:5px;");
    lblVencimento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblVencimento.appendChild(DOM.newText('Vencimento '));

    var txtVencimento = DOM.newElement('text');
    txtVencimento.setAttribute('id', 'd_dataVencimento');
    txtVencimento.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtVencimento.setAttribute("style", 'width:230px; margin-top:5px');

    //---------Valor---------//

    var lblValor = DOM.newElement('label');
    lblValor.setAttribute("Style", "color: #000; margin-left:5px;");
    lblValor.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblValor.appendChild(DOM.newText('Valor (R$) '));

    var txtValor = DOM.newElement('text');
    txtValor.setAttribute('id', 'd_valor');
    txtValor.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtValor.setAttribute("style", 'width:230px; margin-top:5px; text-align: right');

    //----------Botões----------//

    var btnGravar = DOM.newElement('button', 'd_IncluirParcela');
    btnGravar.setAttribute('class', 'botaosimplesfoco');
    btnGravar.setAttribute('style', 'margin-top:10px; margin-left:161px;');
    btnGravar.setAttribute('onclick', 'd_gravarParcela(' + linha + ');');
    btnGravar.innerHTML = 'Gravar';

    //----------Inserir na DIV---------//

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += "<br /><br />";
    divform.appendChild(lblParcela);
    divform.appendChild(lblast2);
    divform.innerHTML += "<br />";
    divform.appendChild(txtParcela);
    divform.innerHTML += "<br />";
    divform.appendChild(lblVencimento);
    divform.appendChild(lblast3);
    divform.innerHTML += "<br />";
    divform.appendChild(txtVencimento);
    divform.innerHTML += "<br />";
    divform.appendChild(lblValor);
    divform.appendChild(lblast4);
    divform.innerHTML += "<br />";
    divform.appendChild(txtValor);
    divform.innerHTML += "<br />";
    divform.appendChild(btnGravar);

    //----------FIM-----------//

    dialogoEditar = new caixaDialogo('promptParcela', 300, 315, '../padrao/', 151);
    dialogoEditar.Show();

    Mask.setOnlyNumbers(Selector.$('d_numParcela'));
    Mask.setData(Selector.$('d_dataVencimento'));
    Mask.setMoeda(Selector.$('d_valor'));

    if (linha < 0) {         //NOVA PARCELA
        if (grid.getRowCount() === 0)
            Selector.$('d_numParcela').value = 1;
        else
            Selector.$('d_numParcela').value = parseInt(grid.getCellText(grid.getRowCount() - 1, 1)) + 1;

    } else {
        //EDITAR PARCELA
        Selector.$('d_numParcela').value = grid.getCellText(linha, 1);
        Selector.$('d_dataVencimento').value = grid.getCellText(linha, 3);
        Selector.$('d_valor').value = grid.getCellText(linha, 4);
    }

    Selector.$('d_dataVencimento').focus();
}

function editarParcela(linha) {

    var tolerancia = Selector.$('tolerancia');
    var media = Selector.$('media');

    editarParcelaAux(linha);
}

function VerificaTolerancia(valor, mediaFixa, tolerancia, total, qtdeParcelas) {

    valor = Number.getFloat(valor.toString().replace('.', ''));
    if (mediaFixa !== '')
        mediaFixa = Number.getFloat(mediaFixa.toString().replace('.', ''));
    else
        mediaFixa = 0;

    if (tolerancia !== '')
        tolerancia = Number.getFloat(tolerancia.toString().replace('.', ''));
    else
        tolerancia = 0;

    if (total !== '')
        total = Number.getFloat(total.toString().replace('.', ''));
    else
        total = 0;

    if (qtdeParcelas !== '')
        qtdeParcelas = Number.getFloat(qtdeParcelas.toString().replace('.', ''));
    else
        qtdeParcelas = 0;

    var base = 0;

    if (mediaFixa > 0) {
        if (tolerancia > 0)
            base = mediaFixa + (mediaFixa * (tolerancia / 100));
        else
            base = mediaFixa;
    }
    else {
        if (tolerancia > 0) {
            base = total / qtdeParcelas;
            base = base + (base * (tolerancia / 100));
        }
        else {
            base = valor;
        }
    }

    if (valor > base)
        return true;
    else
        return false;
}

function Validar() {

    var custo = Selector.$('custo');
    if (custo.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o centro de custo", "OK", "", false, "custo");
        mensagem.Show();
        return false;
    }

    var natureza = Selector.$('natureza');
    if (natureza.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione a natureza", "OK", "", false, "natureza");
        mensagem.Show();
        return false;
    }

    var loja = Selector.$('loja');
    if (loja.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione uma loja", "OK", "", false, "loja");
        mensagem.Show();
        return false;
    }

    var fornecedor = Selector.$('fornecedor');
    if (fornecedor.selectedIndex <= 0) {

        var mensagem;

        if (Selector.$('artistas').checked) {
            mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um artista", "OK", "", false, "fornecedor");
        } else if (Selector.$('fornecedores').checked) {
            mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um fornecedor", "OK", "", false, "fornecedor");
        } else if (Selector.$('funcionarios').checked) {
            mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um funcionário", "OK", "", false, "fornecedor");
        } else {
            mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um vendedor", "OK", "", false, "fornecedor");
        }

        mensagem.Show();
        return false;
    }

    var emissao = Selector.$('emissao');
    if (emissao.value === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe data da emissão", "OK", "", false, "emissao");
        mensagem.Show();
        return false;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 130, 350, 150, "2", "Atenção!", "Por favor, insira ao menos uma parcela para o título\n", "OK", "", false, "");
        mensagem.Show();
        return false;
    }

    return true;
}

function Salvar() {

    if(!CheckPermissao(76, true, 'Você não possui permissão para editar o cadastro de contas à pagar', false)){
        return;
    }

    if (!Validar())
        return false;

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    var p = 'action=Salvar';
    p += '&codigoAtual=' + codigoAtual;
    p += '&idCentroCusto=' + Selector.$('custo').value;
    p += '&idNatureza=' + Selector.$('natureza').value;
    p += '&loja=' + Selector.$('loja').value;
    p += '&dataEmissao=' + Selector.$('emissao').value;
    p += '&valorTotal=' + Selector.$('total').value;
    p += '&valorTotalPago=' + Selector.$('totalpago').value;
    p += '&qtdeParcelas=' + Selector.$('qtd').value;
    p += '&mediaFixa=' + Selector.$('media').value;
    p += '&tolerancia=' + Selector.$('tolerancia').value;
    p += '&descricao=' + Selector.$('descricao').value;

    if (Selector.$('artistas').checked) {
        p += '&idArtista=' + Selector.$('fornecedor').value;
        p += '&idFornecedor=0';
        p += '&idFuncionario=0';
        p += '&idVendedor=0';
        p += '&idCliente=0';
    } else if (Selector.$('fornecedores').checked) {
        p += '&idArtista=0';
        p += '&idFornecedor=' + Selector.$('fornecedor').value;
        p += '&idFuncionario=0';
        p += '&idVendedor=0';
        p += '&idCliente=0';
    } else if (Selector.$('funcionarios').checked) {
        p += '&idArtista=0';
        p += '&idFornecedor=0';
        p += '&idFuncionario=' + Selector.$('fornecedor').value;
        p += '&idVendedor=0';
        p += '&idCliente=0';
    } else if (Selector.$('vendedores').checked) {
        p += '&idArtista=0';
        p += '&idFornecedor=0';
        p += '&idFuncionario=0';
        p += '&idVendedor=' + Selector.$('fornecedor').value;
        p += '&idCliente=0';
    } else {
        p += '&idArtista=0';
        p += '&idFornecedor=0';
        p += '&idFuncionario=0';
        p += '&idVendedor=0';
        p += '&idCliente=' + Selector.$('fornecedor').value;
    }

    ajax.Request(p);

    if (ajax.getResponseText() === 'ERRO') {
        var mensagem = new DialogoMensagens("prompt", 150, 350, 150, "1", "Erro!", "Problemas ao gravar o título, tente novamente. Caso o erro persista contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return false;
    } else {
        codigoAtual = ajax.getResponseText();
        SalvarParcelas(codigoAtual);
        Novo(0);
    }
}

function SalvarParcelas(codConpag) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    var p = '';
    var cont = 0;

    for (var i = 0; i < grid.getRowCount(); i++) {

        p = 'action=SalvarParcela';
        p += '&idConpag=' + codConpag;
        p += '&idParcela=' + grid.getRowData(i);
        p += '&toleranciaUltrapassada=' + (grid.getCellObject(i, 0).toString() === '' ? '0' : '-1');
        p += '&numParcela=' + grid.getCellText(i, 1);
        p += '&data=' + grid.getCellText(i, 2);
        p += '&dataVencimento=' + grid.getCellText(i, 3);
        p += '&valor=' + grid.getCellText(i, 4);
        p += '&pago=' + (grid.getCellObject(i, 5).toString() === '' ? '1' : '0');
        p += '&dataPagamento=' + grid.getCellText(i, 6);
        p += '&valorDesconto=' + grid.getCellText(i, 7);
        p += '&valorJuros=' + grid.getCellText(i, 8);
        p += '&valorPago=' + grid.getCellText(i, 9);
        p += '&pagoPor=' + grid.getCellText(i, 16);
        p += '&formaPagamento=' + grid.getCellText(i, 17);
        p += '&conta=' + grid.getCellText(i, 18);
        p += '&obsPagamento=' + grid.getCellText(i, 13);

        ajax.Request(p);

        if (ajax.getResponseText() === 'OK') {
            cont++;
        } else {
            var mensagem = new DialogoMensagens("prompt", 150, 350, 150, "1", "Erro!", "Problemas ao gravar a(s) parcela(s), tente novamente. Caso o erro persista contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    if (cont !== grid.getRowCount()) {
        var mensagem = new DialogoMensagens("prompt", 150, 350, 150, "1", "Erro!", "Problemas ao gravar a(s) parcela(s), tente novamente. Caso o erro persista contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function D1_onClick() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    ajax.Request('action=GetRegistroPrimeiro');
    Mostrar(ajax.getResponseText());
}

function D2_onClick() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    ajax.Request('action=GetRegistroAnterior&atual=' + codigoAtual);
    Mostrar(ajax.getResponseText());
}

function D3_onClick() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    ajax.Request('action=GetRegistroProximo&atual=' + codigoAtual);
    Mostrar(ajax.getResponseText());
}

function D4_onClick() {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    ajax.Request('action=GetRegistroUltimo');
    Mostrar(ajax.getResponseText());
}

function codigo_KeyDown(ev) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        Mostrar(Selector.$('codigo').value);
    }
}

function Limpar() {

    codigoAtual = 0;
    Selector.$('codigo').value = "";
    Selector.$('custo').selectedIndex = 0;
    Selector.$('natureza').selectedIndex = 0;
    Selector.$('fornecedor').selectedIndex = 0;
    Selector.$('loja').selectedIndex = 0;
    Selector.$('emissao').value = '';
    Selector.$('total').value = '';
    Selector.$('totalpago').value = '';
    Selector.$('qtd').value = '';
    Selector.$('media').value = '';
    Selector.$('tolerancia').value = '';
    Selector.$('descricao').value = '';
    Selector.$('artistas').checked = true;
    grid.clearRows();
}


function Desabilitar(valor) {

    Selector.$('custo').disabled = valor;
    Selector.$('natureza').disabled = valor;
    Selector.$('fornecedor').disabled = valor;
    Selector.$('loja').disabled = valor;
    Selector.$('emissao').disabled = valor;
    Selector.$('total').disabled = true;
    Selector.$('totalpago').disabled = true;
    Selector.$('qtd').disabled = true;
    Selector.$('media').disabled = valor;
    Selector.$('tolerancia').disabled = valor;
    Selector.$('descricao').disabled = valor;
    Selector.$('artistas').disabled = valor;
    Selector.$('fornecedores').disabled = valor;
    Selector.$('funcionarios').disabled = valor;
    Selector.$('vendedores').disabled = valor;
    Selector.$('gerarParcelas').disabled = valor;
    Selector.$('incluirParcela').disabled = valor;

    Selector.$('codigo').style.display = (!valor ? "none" : "block");
    Selector.$('d1').style.display = (!valor ? "none" : "block");
    Selector.$('d2').style.display = (!valor ? "none" : "block");
    Selector.$('d3').style.display = (!valor ? "none" : "block");
    Selector.$('d4').style.display = (!valor ? "none" : "block");
}

function MostrarParcelas(codConpag) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    var p = 'action=MostrarParcelas';
    p += '&idConpag=' + codConpag;
    ajax.Request(p);

    grid.clearRows();

    if (ajax.getResponseText() === '-1')
        return;

    var json = JSON.parse(ajax.getResponseText() );
    var editar = null;
    var excluir = null;
    var cor = false;
    var pago = null;
    var tolUlt = null;

    for (var i = 0; i < json.length; i++) {

        editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('class', 'efeito-opacidade-75-03');
        editar.setAttribute('style', 'width:18px; height:18px');
        editar.setAttribute('title', 'Editar');

        excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('class', 'efeito-opacidade-75-03');
        excluir.setAttribute('style', 'width:18px; height:18px');
        excluir.setAttribute('title', 'Excluir');

        if (json[i].pago === '- - -') {
            pago = DOM.newElement('img');
            pago.setAttribute('src', 'imagens/money2.png');
            pago.setAttribute('class', 'efeito-opacidade-75-03');
            pago.setAttribute('style', 'width:18px; height:18px');
            pago.setAttribute('title', 'Efetuar pagamento');
            pago.setAttribute('onclick', 'Pagar(' + grid.getRowCount() + ', false)');
        } else {
            pago = DOM.newElement('a');
            pago.setAttribute('onclick', 'Pagar(' + grid.getRowCount() + ', true)');
            pago.setAttribute('title', 'Pago, clique para editar');
            pago.appendChild(DOM.newText('SIM'));
        }

        if (json[i].toleranciaUltrapassada === '-1') {
            tolUlt = DOM.newElement('img');
            tolUlt.setAttribute('src', 'imagens/exclamation.png');
            tolUlt.setAttribute('class', 'efeito-opacidade-75-03');
            tolUlt.setAttribute('style', 'width:18px; height:18px');
            tolUlt.setAttribute('title', 'Tolerância Ultrapassada!');
        } else {
            tolUlt = DOM.newElement('a');
            tolUlt.appendChild(DOM.newText(''));
        }

        grid.addRow([
            tolUlt,
            DOM.newText(json[i].numero),
            DOM.newText(json[i].data),
            DOM.newText(json[i].dataVencimento),
            DOM.newText(json[i].valor),
            pago,
            DOM.newText(json[i].dataPago),
            DOM.newText(json[i].valorDesconto),
            DOM.newText(json[i].valorJuros),
            DOM.newText(json[i].valorPago),
            DOM.newText(json[i].pagoPor),
            DOM.newText(json[i].formaPagamento),
            DOM.newText(json[i].conta),
            DOM.newText(json[i].obsPago),
            editar,
            excluir,
            DOM.newText(json[i].idUsuarioPago),
            DOM.newText(json[i].idFormaPagamento),
            DOM.newText(json[i].idConta)
        ]);

        grid.hiddenCol(16);
        grid.hiddenCol(17);
        grid.hiddenCol(18);

        grid.getRow(grid.getRowCount() - 1).setAttribute('class', 'cor');
        grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
        grid.getCell(grid.getRowCount() - 1, 0).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 1).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 2).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 3).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 4).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 5).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 6).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 7).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 8).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 9).style.textAlign = 'right';
        grid.getCell(grid.getRowCount() - 1, 10).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 11).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 12).style.textAlign = 'left';
        grid.getCell(grid.getRowCount() - 1, 13).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 14).style.textAlign = 'center';
        grid.getCell(grid.getRowCount() - 1, 15).style.textAlign = 'center';

        if (cor) {
            cor = false;
            grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
        }

        if (json[i].vencido === '1') {
            if (json[i].pago === '- - -')
                grid.setRowForegroundColor(grid.getRowCount() - 1, '#CC0000');
        }

        grid.getCellObject(grid.getRowCount() - 1, 14).setAttribute('onclick', 'Editar(' + (grid.getRowCount() - 1) + ')');
        grid.getCellObject(grid.getRowCount() - 1, 15).setAttribute('onclick', 'Excluir(' + (grid.getRowCount() - 1) + ')');
    }

    Selector.$('total').value = Number.FormatDinheiro(grid.SumColnoFixed(4));
    Selector.$('totalpago').value = Number.FormatDinheiro(grid.SumColnoFixed(9));
    Selector.$('qtd').value = grid.getRowCount();
}

function Mostrar(codigo) {

    if (codigo === '' || codigo <= 0)
        return;

    Limpar();

    var ajax = new Ajax('POST', 'php/cadastro-de-contas-a-pagar.php', false);
    var p = 'action=Mostrar&codigo=' + codigo;
    ajax.Request(p);

    if (ajax.getResponseText() === '0')
        return;

    var json = JSON.parse(ajax.getResponseText() );

    codigoAtual = json.codigo;
    Selector.$('codigo').value = codigoAtual;
    Selector.$('custo').value = json.centrocusto;
    Selector.$('natureza').value = json.natureza;
    Selector.$('loja').value = json.loja;

    if (json.idArtista !== '0') {
        Selector.$('artistas').checked = true;
        LoadTipo('1', false, 'fornecedor', 'Selecione um artista');
        Selector.$('fornecedor').value = json.idArtista;
    } else if (json.fornecedor !== '0') {
        Selector.$('fornecedores').checked = true;
        LoadTipo('2', false, 'fornecedor', 'Selecione um fornecedor');
        Selector.$('fornecedor').value = json.fornecedor;
    } else if (json.idFuncionario !== '0') {
        Selector.$('funcionarios').checked = true;
        LoadTipo('3', false, 'fornecedor', 'Selecione um funcionário');
        Selector.$('fornecedor').value = json.idFuncionario;
    } else if (json.idVendedor !== '0') {
        Selector.$('vendedores').checked = true;
        LoadTipo('4', false, 'fornecedor', 'Selecione um vendedor', 0);
        Selector.$('fornecedor').value = json.idVendedor;
    } else {
        Selector.$('arquitetos').checked = true;
        LoadTipo('5', false, 'fornecedor', 'Selecione um arquiteto', 0);
        Selector.$('fornecedor').value = json.idCliente;
    }

    Selector.$('emissao').value = json.data;
    Selector.$('media').value = json.mediafixa;
    Selector.$('tolerancia').value = json.tolerancia;
    Selector.$('total').value = json.valorTotal;
    Selector.$('qtd').value = json.qtdeParcelas;
    Selector.$('totalpago').value = json.valorTotalPago;
    Selector.$('descricao').value = json.descricao;

    MostrarParcelas(codigoAtual);
}