checkSessao();
CheckPermissao(33, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Estoque de Produtos</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    getLojas(Selector.$('galeria'), 'Todas', true);
    getArtistas(Selector.$('artista'), 'Todos', true);
    Select.AddItem(Selector.$('obra'), 'Selecione um artista', 0);
    getTamanhos(Selector.$('tamanho'), 'Todos', true);
    getAcabamentos(Selector.$('acabamento'), 'Todos', true);
    getProdutos(Selector.$('produto'), 'Todos', true);
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
    Selector.$('de').value = '';
    Pesquisar();
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function getObrasArtista(assincrona, cmbObra, cmbArtista) {

    Select.Clear(Selector.$(cmbObra));

    var ajax = new Ajax('POST', 'php/propostas.php', assincrona);
    var p = 'action=getObras';
    p += '&idArtista=' + Selector.$(cmbArtista).value;

    if (assincrona) {

        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$(cmbObra));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            Select.AddItem(Selector.$(cmbObra), 'Todas', '0');
            Select.FillWithJSON(Selector.$(cmbObra), ajax.getResponseText(), 'codigo', 'obra');
        };

        Select.AddItem(Selector.$(cmbObra), 'Carregando obras...', '0');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        Select.AddItem(Selector.$(cmbObra), 'Todas', '0');
        Select.FillWithJSON(Selector.$(cmbObra), ajax.getResponseText(), 'codigo', 'obra');
    }
}

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Pesquisar() {

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/estoque-de-produtos.php', true);
    var p = 'action=Pesquisar';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idArtista=' + Selector.$('artista').value;
    p += '&idObra=' + Selector.$('obra').value;
    p += '&idTamanho=' + Selector.$('tamanho').value;
    p += '&idAcabamento=' + Selector.$('acabamento').value;
    p += '&holograma=' + Selector.$('holograma').value;
    p += '&idProduto=' + Selector.$('produto').value;
    p += '&detalhado=' + Selector.$('detalhado').checked;
    p += '&itensEstoque=' + Selector.$('itensEstoque').checked;
    p += '&tipoProduto=' + Selector.$('tipoProduto').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum item encontrado no estoque";
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
            DOM.newText('Tipo Prod.'),
            DOM.newText('Descrição'),
            DOM.newText('Holograma'),
            DOM.newText('Observação'),
            DOM.newText('Entrada'),
            DOM.newText('Saída'),
            DOM.newText('Excluir'),
            DOM.newText('Transferir Estoque')
        ]);

        div.appendChild(gridEstoque.table);

        var json = JSON.parse(ajax.getResponseText() );

        for (var i = 0; i < json.length; i++) {

            var Transferir = DOM.newElement('img');
            Transferir.setAttribute('src', 'imagens/menuestoque.png');
            Transferir.setAttribute('title', 'Transferir Estoque');
            Transferir.setAttribute('style', 'cursor:pointer');
            Transferir.setAttribute('onclick', 'TransferirETQ("' + json[i].nomeProduto + '",' + json[i].idLoja + ',' + json[i].idTipoProduto + ',' +
                    json[i].idProduto + ',' + json[i].idObra + ',' + json[i].idArtista + ',' +
                    json[i].idAcabamento + ',' + json[i].idTamanho + ',"' + json[i].qtd + '","' +
                    json[i].largura + '","' + json[i].altura + '")');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/excluir.png');
            excluir.setAttribute('title', 'Excluir Lançamento');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirLancamentoAux(' + json[i].idEstoqueProduto + ')');

            var seta = DOM.newElement('img');
            seta.setAttribute('src', 'imagens/setagrande.png');
            
            var mais = DOM.newElement('img');
            mais.setAttribute('src', 'imagens/mais.png');
            mais.setAttribute('title', 'Lançamento de entrada');
            mais.setAttribute('style', 'cursor:pointer');
            mais.setAttribute('onclick', 'PromptEntradaSaidaEstoque("E", false, ' + json[i].idLoja + ', ' + json[i].idTipoProduto + ', ' + json[i].idProduto + ', ' + json[i].idObra + ', ' + json[i].idArtista + ', ' + json[i].idAcabamento + ', ' + json[i].idTamanho + ', "' + json[i].largura + '", "' + json[i].altura + '")');
            
            var menos = DOM.newElement('img');
            menos.setAttribute('src', 'imagens/menos.png');
            menos.setAttribute('title', 'Lançamento de saída');
            menos.setAttribute('style', 'cursor:pointer');
            menos.setAttribute('onclick', 'PromptEntradaSaidaEstoque("S", false, ' + json[i].idLoja + ', ' + json[i].idTipoProduto + ', ' + json[i].idProduto + ', ' + json[i].idObra + ', ' + json[i].idArtista + ', ' + json[i].idAcabamento + ', ' + json[i].idTamanho + ', "' + json[i].largura + '", "' + json[i].altura + '")');

            if (Selector.$('detalhado').checked) {

                gridEstoque.addRow([
                    DOM.newText(json[i].dataMovimento + " " + json[i].horaMovimento),
                    DOM.newText(json[i].qtd),
                    DOM.newText(json[i].tipoMovimento),
                    DOM.newText(json[i].loja),
                    DOM.newText(json[i].tipoProduto),
                    DOM.newText(json[i].descricao),
                    DOM.newText(json[i].holograma),
                    DOM.newText(json[i].obs),
                    mais, 
                    menos,
                    excluir,
                    DOM.newText('')
                ]);

                gridEstoque.setRowData(gridEstoque.getRowCount() - 1, json[i].idEstoqueProduto);
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:110px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:80px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:100px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:60px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:60px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:40px;');
                gridEstoque.hiddenCol(11);
            } else {
                
                if(Selector.$('itensEstoque').checked)
                    if(parseFloat(json[i].qtd) <= 0) 
                        continue;

                gridEstoque.addRow([
                    DOM.newText(''),
                    DOM.newText(json[i].qtd),
                    DOM.newText(json[i].tipoMovimento),
                    DOM.newText(json[i].loja),
                    DOM.newText(json[i].tipoProduto),
                    DOM.newText(json[i].descricao),
                    DOM.newText(''),
                    DOM.newText(''),
                    mais,
                    menos,
                    DOM.newText(''),
                    Transferir
                ]);

                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 4).setAttribute('style', 'text-align:center;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:60px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:60px;');
                gridEstoque.getCell(gridEstoque.getRowCount() - 1, 10).setAttribute('style', 'text-align:center; width:80px;');

                gridEstoque.hiddenCol(0);
                gridEstoque.hiddenCol(6);
                gridEstoque.hiddenCol(7);
                gridEstoque.hiddenCol(10);
            }
        }

        Selector.$('contador').innerHTML = gridEstoque.getRowCount() + " Registro(s) encontrado(s)";
        pintaLinhaGrid(gridEstoque);
    };

    ajax.Request(p);
}

function PromptEntradaSaidaEstoque(tipoMovimento, assinc, idLoja, idTipoProduto, idProduto, idObra, idArtista, idAcabamento, idTamanho, largura, altura) {

    if(!CheckPermissao((tipoMovimento == 'E' ? 34 : 35), true, 'Você não possui permissão para lançar' + (tipoMovimento == 'E' ? ' entrada' : ' saída') + ' no estoque de produtos.', false)){
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

    var divProdutoObra = DOM.newElement('div');
    divProdutoObra.setAttribute('style', 'width:140px; margin:0 auto;');

    var radioProduto = DOM.newElement('radio', 'e_radioProduto');
    radioProduto.setAttribute('checked', 'checked');
    radioProduto.setAttribute('name', 'e_tipoProduto');
    radioProduto.setAttribute('onclick', 'AlternarTipoProduto();');

    var lblRadioProduto = DOM.newElement('label');
    lblRadioProduto.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblRadioProduto.setAttribute('for', 'e_radioProduto');
    lblRadioProduto.innerHTML = 'Produto';

    var radioObra = DOM.newElement('radio', 'e_radioObra');
    radioObra.setAttribute('name', 'e_tipoProduto');
    radioObra.setAttribute('style', 'margin-left:10px;');
    radioObra.setAttribute('onclick', 'AlternarTipoProduto();');

    var lblRadioObra = DOM.newElement('label');
    lblRadioObra.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblRadioObra.setAttribute('for', 'e_radioObra');
    lblRadioObra.innerHTML = 'Obra';

    divProdutoObra.appendChild(radioProduto);
    divProdutoObra.appendChild(lblRadioProduto);
    divProdutoObra.appendChild(radioObra);
    divProdutoObra.appendChild(lblRadioObra);
    divCadastro.appendChild(divProdutoObra);

    var divProduto = DOM.newElement('div', 'e_divProduto');
    divProduto.setAttribute('style', 'border:1px solid lightgray; padding:10px;');

    var lblProduto = DOM.newElement('label');
    lblProduto.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblProduto.innerHTML = 'Produto';

    var cmbProduto = DOM.newElement('select', 'e_produto');
    cmbProduto.setAttribute('class', 'textbox_cinzafoco');
    cmbProduto.setAttribute("style", 'width:100%');
    cmbProduto.setAttribute("onchange", 'Selector.$("e_altura").focus();');

    divCadastro.innerHTML += '<br>';
    divProduto.appendChild(lblProduto);
    divProduto.innerHTML += "<br>";
    divProduto.appendChild(cmbProduto);
    divCadastro.appendChild(divProduto);

    var divObra = DOM.newElement('div', 'e_divObra');
    divObra.setAttribute('style', 'padding:10px; border:1px solid lightgray; display:none; margin-bottom:10px;');

    var divArtista = DOM.newElement('div');
    divArtista.setAttribute('style', 'width:275px; display:inline-block');

    var lblArtista = DOM.newElement('label');
    lblArtista.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblArtista.innerHTML = 'Artista';

    var cmbArtista = DOM.newElement('select', 'e_artista');
    cmbArtista.setAttribute('class', 'textbox_cinzafoco');
    cmbArtista.setAttribute("style", 'width:100%');
    cmbArtista.setAttribute("onchange", 'getObrasArtista(true, "\e_obra\", "\e_artista\");');

    divCadastro.innerHTML += '<br>';
    divArtista.appendChild(lblArtista);
    divArtista.innerHTML += '<br>';
    divArtista.appendChild(cmbArtista);
    divObra.appendChild(divArtista);

    var divCmbObra = DOM.newElement('div');
    divCmbObra.setAttribute('style', 'width:245px; display:inline-block; margin-left:10px;');

    var lblObra = DOM.newElement('label');
    lblObra.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblObra.innerHTML = 'Obra';

    var cmbObra = DOM.newElement('select', 'e_obra');
    cmbObra.setAttribute('class', 'textbox_cinzafoco');
    cmbObra.setAttribute('onchange', 'getTamanhosObras(true)');
    cmbObra.setAttribute("style", 'width:100%');

    divCmbObra.appendChild(lblObra);
    divCmbObra.innerHTML += '<br>';
    divCmbObra.appendChild(cmbObra);
    divObra.appendChild(divCmbObra);

    var divTamanho = DOM.newElement('div');
    divTamanho.setAttribute('style', 'width:260px; display:inline-block;');

    var lblTamanho = DOM.newElement('label');
    lblTamanho.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblTamanho.innerHTML = 'Tamanho';

    var cmbTamanho = DOM.newElement('select', 'e_tamanho');
    cmbTamanho.setAttribute('class', 'textbox_cinzafoco');
    cmbTamanho.setAttribute("style", 'width:100%');
    cmbTamanho.setAttribute("onchange", 'MostrarTamanho();');

    divTamanho.appendChild(lblTamanho);
    divTamanho.innerHTML += '<br>';
    divTamanho.appendChild(cmbTamanho);
    divObra.appendChild(divTamanho);

    var divAcabamento = DOM.newElement('div');
    divAcabamento.setAttribute('style', 'width:260px; display:inline-block; margin-left:10px;');

    var lblAcabamento = DOM.newElement('label');
    lblAcabamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAcabamento.innerHTML = 'Acabamento';

    var cmbAcabamento = DOM.newElement('select', 'e_acabamento');
    cmbAcabamento.setAttribute('class', 'textbox_cinzafoco');
    cmbAcabamento.setAttribute("style", 'width:100%');

    divAcabamento.appendChild(lblAcabamento);
    divAcabamento.innerHTML += '<br>';
    divAcabamento.appendChild(cmbAcabamento);
    divObra.appendChild(divAcabamento);

    divCadastro.appendChild(divObra);

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

    var divHolograma = DOM.newElement('div');
    divHolograma.setAttribute('style', 'width:125px; display:inline-block; margin-left:10px;');

    var lblHolograma = DOM.newElement('label');
    lblHolograma.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblHolograma.innerHTML = 'Holograma';

    var txtHolograma = DOM.newElement('text', 'e_holograma');
    txtHolograma.setAttribute('class', 'textbox_cinzafoco');
    txtHolograma.setAttribute("style", 'width:100%');

    divHolograma.appendChild(lblHolograma);
    divHolograma.innerHTML += '<br>';
    divHolograma.appendChild(txtHolograma);
    divCadastro.appendChild(divHolograma);

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

    var lblCancelar = DOM.newElement('label', 'e_lblCancelar');
    lblCancelar.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCancelar.setAttribute('style', 'cursor:pointer; vertical-align:bottom; float:right; margin-top:5px;');
    lblCancelar.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');
    lblCancelar.innerHTML = 'Cancelar';

    divCadastro.appendChild(lblCancelar);

    var btGravar = DOM.newElement('button', 'e_btGravar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'margin-right: 5px; float:right;');
    btGravar.setAttribute('onclick', 'GravarMovimentoEstoque("' + tipoMovimento + '");');
    btGravar.innerHTML = "Gravar";

    divCadastro.appendChild(btGravar);

    dialogoCadastro = new caixaDialogo('divCadastro', 470, 600, 'padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();
    
    Mask.setMoeda(Selector.$('e_altura'));
    Mask.setMoeda(Selector.$('e_largura'));
    Mask.setOnlyNumbers(Selector.$('e_qtd'));
    
    getLojas(Selector.$('e_galeria'), 'Selecione uma galeria', assinc);
    getProdutos(Selector.$('e_produto'), 'Selecione um produto', assinc);
    
    if(assinc == true) {
        Selector.$('e_galeria').focus();
    } else {
        Selector.$('e_galeria').value = idLoja;
        
        if(idTipoProduto == 3) {
            Selector.$('e_radioProduto').checked = true;

            AlternarTipoProduto();

            Selector.$('e_produto').value = idProduto;
        } else {
            Selector.$('e_radioObra').checked = true;

            AlternarTipoProduto();
            
            Selector.$('e_artista').value = idArtista;
            
            getObrasArtista(false, "e_obra", "e_artista");
            
            Selector.$('e_obra').value = idObra;
            Selector.$('e_tamanho').value = idTamanho;
            Selector.$('e_acabamento').value = idAcabamento;
        }

        Selector.$('e_altura').value = altura;
        Selector.$('e_largura').value = largura;
        Selector.$('e_qtd').focus();
    }
}

function getTamanhosObras(assincrona) {

    var ajax = new Ajax('POST', 'php/propostas.php', assincrona);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + Selector.$('e_obra').value;

    if (assincrona) {

        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('e_tamanho'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText() );
            Select.AddItem(Selector.$('e_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('e_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
        };

        Select.AddItem(Selector.$('e_tamanho'), 'Carregando tamanhos...', '0', '');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        Select.AddItem(Selector.$('e_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('e_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
    }
}

function AlternarTipoProduto() {

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

    Selector.$('e_altura').value = '';
    Selector.$('e_largura').value = '';
    Selector.$('e_qtd').value = '';
    Selector.$('e_obs').value = '';

    if (Selector.$('e_radioProduto').checked) {

        Selector.$('e_divObra').style.display = 'none';
        Selector.$('e_divProduto').style.display = 'block';
        dialogoCadastro.Realinhar(470, 620);

        getProdutos(Selector.$('e_produto'), 'Selecione um produto', false);
    } else {

        Selector.$('e_divProduto').style.display = 'none';
        Selector.$('e_divObra').style.display = 'block';

        Select.Clear(Selector.$('e_obra'));
        dialogoCadastro.Realinhar(540, 620);

        getArtistas(Selector.$('e_artista'), 'Selecione um artista', false);
        Select.AddItem(Selector.$('e_obra'), 'Selecione um artista', 0);
        getTamanhos(Selector.$('e_tamanho'), 'Selecione um tamanho', false);
        getAcabamentos(Selector.$('e_acabamento'), 'Selecione um acabamento', false);
    }
}

function MostrarTamanho() {

    var tamanho = Select.GetText(Selector.$('e_tamanho')).split('(')[1].split(')');
    var altura = tamanho[0].split('x')[0];
    var largura = tamanho[0].split('x')[1];

    Selector.$('e_altura').value = altura;
    Selector.$('e_largura').value = largura;

    if (altura > 0 && largura > 0) {
        Selector.$('e_altura').disabled = true;
        Selector.$('e_largura').disabled = true;
    } else {
        Selector.$('e_altura').disabled = false;
        Selector.$('e_largura').disabled = false;
    }
}

function GravarMovimentoEstoque(tipoMovimento) {

    if (Selector.$('e_galeria').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione uma galeria", 'e_galeria');
        return;
    }

    if (Selector.$('e_radioProduto').checked) {

        if (Selector.$('e_produto').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione um produto", 'e_produto');
            return;
        }

        if (Selector.$('e_qtd').value.trim() == '' || Selector.$('e_qtd').value.trim() == '0') {
            MostrarMsg("Por favor, digite a quantidade", 'e_qtd');
            return;
        }
    } else {

        if (Selector.$('e_artista').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione um artista", 'e_artista');
            return;
        }

        if (Selector.$('e_obra').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione uma obra", 'e_obra');
            return;
        }

        if (Selector.$('e_tamanho').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione um tamanho", 'e_tamanho');
            return;
        }

        if (Selector.$('e_acabamento').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione um acabamento", 'e_acabamento');
            return;
        }

        if (Select.GetText(Selector.$('e_tamanho')).indexOf('PERSONALIZADO') >= 0) {

            if (Selector.$('e_altura').value.trim() == '' || Selector.$('e_altura').value.trim() == '0,00' || Selector.$('e_altura').value.trim() == ',' || Selector.$('e_altura').value.trim() == '0') {
                MostrarMsg("Por favor, digite a altura", 'e_altura');
                return;
            }

            if (Selector.$('e_largura').value.trim() == '' || Selector.$('e_largura').value.trim() == '0,00' || Selector.$('e_largura').value.trim() == ',' || Selector.$('e_largura').value.trim() == '0') {
                MostrarMsg("Por favor, digite a altura", 'e_largura');
                return;
            }
        }

        if (Selector.$('e_qtd').value.trim() == '' || Selector.$('e_qtd').value.trim() == '0') {
            MostrarMsg("Por favor, digite a quantidade", 'e_qtd');
            return;
        }
    }

    var ajax = new Ajax('POST', 'php/estoque-de-produtos.php', true);
    var p = 'action=GravarMovimentoEstoque';
    p += '&tipoMovimento=' + tipoMovimento;
    p += '&idGaleria=' + Selector.$('e_galeria').value;
    p += '&idProduto=' + (Selector.$('e_radioProduto').checked ? Selector.$('e_produto').value : '0');
    p += '&idTipoProduto=' + (Selector.$('e_radioProduto').checked ? '3' : '1');
    p += '&idArtista=' + (Selector.$('e_radioProduto').checked ? '0' : Selector.$('e_artista').value);
    p += '&idObra=' + (Selector.$('e_radioProduto').checked ? '0' : Selector.$('e_obra').value);
    p += '&idTamanho=' + (Selector.$('e_radioProduto').checked ? '0' : Selector.$('e_tamanho').value);
    p += '&idAcabamento=' + (Selector.$('e_radioProduto').checked ? '0' : Selector.$('e_acabamento').value);
    p += '&altura=' + Selector.$('e_altura').value;
    p += '&largura=' + Selector.$('e_largura').value;
    p += '&qtd=' + Selector.$('e_qtd').value;
    p += '&holograma=' + Selector.$('e_holograma').value;
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

function ExcluirLancamentoAux(idEstoqueProduto) {

    if(!CheckPermissao(36, true, 'Você não possui permissão para excluir um lançamento do estoque', false)){
        return;
    }

    mensagemExcluirLancamento = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este lançamento?", "OK", "ExcluirLancamento(" + idEstoqueProduto + ");", true, "");
    mensagemExcluirLancamento.Show();
}

function ExcluirLancamento(idEstoqueProduto) {

    mensagemExcluirLancamento.Close();

    var ajax = new Ajax('POST', 'php/estoque-de-produtos.php', true);
    var p = 'action=ExcluirLancamento';
    p += '&idEstoqueProduto=' + idEstoqueProduto;

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

function LimparFiltros() {

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Selector.$('galeria').value = 0;
    Selector.$('artista').value = 0;
    getObrasArtista(false, 'obra', 'artista');
    Select.SetText(Selector.$('obra'), 'Selecione um artista');
    Selector.$('tamanho').value = 0;
    Selector.$('acabamento').value = 0;
    Selector.$('produto').value = 0;
    Selector.$('detalhado').checked = false;
    Selector.$('itensEstoque').checked = false;
    gridEstoque.clearRows();
    Selector.$('contador').innerHTML = "";
    Selector.$('tipoProduto').value = 0;
}

function TransferirETQ(nomeProduto, idLoja, idTipoProduto, idProduto, idObra, idArtista, idAcabamento, idTamanho, qtd, largura, altura) {

    if(!CheckPermissao(37, true, 'Você não possui permissão para transferir o estoque', false)){
        return;
    }

    if (parseInt(qtd) <= 0) {
        MostrarMsg("Não é possivel transferir pois não há itens no estoque nesta galeria", '');
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
    lblTitulo.innerHTML = 'Transferência de Estoque';
    lblTitulo.setAttribute('style', 'text-align:center; font-family:arial');
    divCadastro.appendChild(lblTitulo);

    var lblGaleria = DOM.newElement('label');
    lblGaleria.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblGaleria.innerHTML = 'Galeria De';

    var cmbGaleria = DOM.newElement('select', 'e_galeria');
    cmbGaleria.setAttribute('class', 'textbox_cinzafoco');
    cmbGaleria.setAttribute("style", 'width:100%');

    divCadastro.appendChild(lblGaleria);
    divCadastro.innerHTML += '<br>';
    divCadastro.appendChild(cmbGaleria);

    var divProdutoObra = DOM.newElement('div');
    divProdutoObra.setAttribute('style', 'width:140px; margin:0 auto;');

    var radioProduto = DOM.newElement('radio', 'e_radioProduto');
    radioProduto.setAttribute('checked', 'checked');
    radioProduto.setAttribute('name', 'e_tipoProduto');
    radioProduto.setAttribute('onclick', 'AlternarTipoProduto();');

    var lblRadioProduto = DOM.newElement('label');
    lblRadioProduto.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblRadioProduto.setAttribute('for', 'e_radioProduto');
    lblRadioProduto.innerHTML = 'Produto';

    var radioObra = DOM.newElement('radio', 'e_radioObra');
    radioObra.setAttribute('name', 'e_tipoProduto');
    radioObra.setAttribute('style', 'margin-left:10px;');
    radioObra.setAttribute('onclick', 'AlternarTipoProduto();');

    var lblRadioObra = DOM.newElement('label');
    lblRadioObra.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblRadioObra.setAttribute('for', 'e_radioObra');
    lblRadioObra.innerHTML = 'Obra';

    divProdutoObra.appendChild(radioProduto);
    divProdutoObra.appendChild(lblRadioProduto);
    divProdutoObra.appendChild(radioObra);
    divProdutoObra.appendChild(lblRadioObra);
    divCadastro.appendChild(divProdutoObra);

    var divProduto = DOM.newElement('div', 'e_divProduto');
    divProduto.setAttribute('style', 'border:1px solid lightgray; padding:10px;');

    var lblProduto = DOM.newElement('label');
    lblProduto.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblProduto.innerHTML = 'Produto';

    var cmbProduto = DOM.newElement('select', 'e_produto');
    cmbProduto.setAttribute('class', 'textbox_cinzafoco');
    cmbProduto.setAttribute("style", 'width:100%');
    cmbProduto.setAttribute("onchange", 'Selector.$("e_altura").focus();');

    divCadastro.innerHTML += '<br>';
    divProduto.appendChild(lblProduto);
    divProduto.innerHTML += "<br>";
    divProduto.appendChild(cmbProduto);
    divCadastro.appendChild(divProduto);

    var divObra = DOM.newElement('div', 'e_divObra');
    divObra.setAttribute('style', 'padding:10px; border:1px solid lightgray; display:none; margin-bottom:10px;');

    var divArtista = DOM.newElement('div');
    divArtista.setAttribute('style', 'width:275px; display:inline-block');

    var lblArtista = DOM.newElement('label');
    lblArtista.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblArtista.innerHTML = 'Artista';

    var cmbArtista = DOM.newElement('select', 'e_artista');
    cmbArtista.setAttribute('class', 'textbox_cinzafoco');
    cmbArtista.setAttribute("style", 'width:100%');
    cmbArtista.setAttribute("onchange", 'getObrasArtista(true, "\e_obra\", "\e_artista\");');

    divCadastro.innerHTML += '<br>';
    divArtista.appendChild(lblArtista);
    divArtista.innerHTML += '<br>';
    divArtista.appendChild(cmbArtista);
    divObra.appendChild(divArtista);

    var divCmbObra = DOM.newElement('div');
    divCmbObra.setAttribute('style', 'width:245px; display:inline-block; margin-left:10px;');

    var lblObra = DOM.newElement('label');
    lblObra.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblObra.innerHTML = 'Obra';

    var cmbObra = DOM.newElement('select', 'e_obra');
    cmbObra.setAttribute('class', 'textbox_cinzafoco');
    cmbObra.setAttribute("style", 'width:100%');

    divCmbObra.appendChild(lblObra);
    divCmbObra.innerHTML += '<br>';
    divCmbObra.appendChild(cmbObra);
    divObra.appendChild(divCmbObra);

    var divTamanho = DOM.newElement('div');
    divTamanho.setAttribute('style', 'width:260px; display:inline-block;');

    var lblTamanho = DOM.newElement('label');
    lblTamanho.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblTamanho.innerHTML = 'Tamanho';

    var cmbTamanho = DOM.newElement('select', 'e_tamanho');
    cmbTamanho.setAttribute('class', 'textbox_cinzafoco');
    cmbTamanho.setAttribute("style", 'width:100%');
    cmbTamanho.setAttribute("onchange", 'MostrarTamanho();');

    divTamanho.appendChild(lblTamanho);
    divTamanho.innerHTML += '<br>';
    divTamanho.appendChild(cmbTamanho);
    divObra.appendChild(divTamanho);

    var divAcabamento = DOM.newElement('div');
    divAcabamento.setAttribute('style', 'width:260px; display:inline-block; margin-left:10px;');

    var lblAcabamento = DOM.newElement('label');
    lblAcabamento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAcabamento.innerHTML = 'Acabamento';

    var cmbAcabamento = DOM.newElement('select', 'e_acabamento');
    cmbAcabamento.setAttribute('class', 'textbox_cinzafoco');
    cmbAcabamento.setAttribute("style", 'width:100%');

    divAcabamento.appendChild(lblAcabamento);
    divAcabamento.innerHTML += '<br>';
    divAcabamento.appendChild(cmbAcabamento);
    divObra.appendChild(divAcabamento);

    divCadastro.appendChild(divObra);

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
    lblQuantidade.innerHTML = 'Qtde Atual';

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
    lblObs.setAttribute('style', 'display:none');
    lblObs.innerHTML = 'Observação';
    divCadastro.appendChild(lblObs);

    divCadastro.innerHTML += '<br>';

    var txtObs = DOM.newElement('textarea', 'e_obs');
    txtObs.setAttribute('class', 'textbox_cinzafoco');
    txtObs.setAttribute("style", 'width:100%; height:50px; display:none');
    divCadastro.appendChild(txtObs);

    var lblGaleria = DOM.newElement('label');
    lblGaleria.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblGaleria.innerHTML = 'Galeria Para';

    var cmbGaleria = DOM.newElement('select', 'e_galeriaPara');
    cmbGaleria.setAttribute('class', 'textbox_cinzafoco');
    cmbGaleria.setAttribute("style", 'width:100%');

    divCadastro.appendChild(lblGaleria);
    divCadastro.innerHTML += '<br>';
    divCadastro.appendChild(cmbGaleria);

    var divQuantidadeT = DOM.newElement('div');
    divQuantidadeT.setAttribute('style', 'width:100px; display:inline-block; ');

    var lblQuantidadeT = DOM.newElement('label');
    lblQuantidadeT.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblQuantidadeT.innerHTML = 'Qtde Atual';

    var txtQuantidadeT = DOM.newElement('text', 'e_qtdPara');
    txtQuantidadeT.setAttribute('class', 'textbox_cinzafoco');
    txtQuantidadeT.setAttribute("style", 'width:100%');

    divQuantidadeT.appendChild(lblQuantidadeT);
    divQuantidadeT.innerHTML += '<br>';
    divQuantidadeT.appendChild(txtQuantidadeT);
    divCadastro.appendChild(divQuantidadeT);

    divCadastro.innerHTML += '<br><br>';

    var lblCancelar = DOM.newElement('label', 'e_lblCancelar');
    lblCancelar.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCancelar.setAttribute('style', 'cursor:pointer; vertical-align:bottom; float:right; margin-top:5px;');
    lblCancelar.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');
    lblCancelar.innerHTML = 'Cancelar';

    divCadastro.appendChild(lblCancelar);

    var btGravar = DOM.newElement('button', 'e_btGravar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'margin-right: 5px; float:right;');
    btGravar.setAttribute('onclick', 'TransferirEstoque("' + idTipoProduto + '","' + largura + '", "' + altura + '")');
    btGravar.innerHTML = "Transferir";

    divCadastro.appendChild(btGravar);

    dialogoCadastro = new caixaDialogo('divCadastro', 470, 600, 'padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();

    Selector.$('e_galeria').focus();

    getLojas(Selector.$('e_galeria'), 'Selecione uma galeria', false);
    getLojas(Selector.$('e_galeriaPara'), 'Selecione uma galeria', false);
    getProdutos(Selector.$('e_produto'), 'Selecione um produto', false);

    Mask.setMoeda(Selector.$('e_altura'));
    Mask.setMoeda(Selector.$('e_largura'));
    Mask.setOnlyNumbers(Selector.$('e_qtd'));
    Mask.setOnlyNumbers(Selector.$('e_qtdPara'));

    /*DAQUI PRA BAIXO É TRANSFERENCIA DE ESTOQUE*/

    Select.Show(Selector.$('e_galeria'), idLoja);

    if (idTipoProduto == 3)
        Selector.$('e_radioProduto').checked = true;
    else
        Selector.$('e_radioObra').checked = true;

    AlternarTipoProduto();

    if (idTipoProduto == 3) {
        dialogoCadastro.Realinhar(520, 620);
        Select.Show(Selector.$('e_produto'), parseInt(idProduto));
    } else {
        dialogoCadastro.Realinhar(590, 620);
        Select.Show(Selector.$('e_artista'), idArtista);
        getObrasArtista(false, "e_obra", "e_artista");
        Select.Show(Selector.$('e_obra'), idObra);
        Select.Show(Selector.$('e_tamanho'), idTamanho);
        Select.Show(Selector.$('e_acabamento'), idAcabamento);
    }

    Selector.$('e_qtd').value = qtd;
    Selector.$('e_altura').value = Number.FormatMoeda(altura);
    Selector.$('e_largura').value = Number.FormatMoeda(largura);

    Selector.$('e_galeria').disabled = true;
    Selector.$('e_radioProduto').disabled = true;
    Selector.$('e_radioObra').disabled = true;
    Selector.$('e_produto').disabled = true;
    Selector.$('e_altura').disabled = true;
    Selector.$('e_largura').disabled = true;
    Selector.$('e_qtd').disabled = true;
    Selector.$('e_artista').disabled = true;
    Selector.$('e_obra').disabled = true;
    Selector.$('e_tamanho').disabled = true;
    Selector.$('e_acabamento').disabled = true;

    Selector.$('e_galeriaPara').focus();
}

function TransferirEstoque(tipo, largura, altura) {

    if (Selector.$('e_galeriaPara').selectedIndex <= 0) {
        MostrarMsg("Por favor Selecione a Galeria de Destino", 'e_galeriaPara');
        return;
    }

    if (Selector.$('e_galeria').selectedIndex == Selector.$('e_galeriaPara').selectedIndex) {
        MostrarMsg("Não é possivel transferir para a mesma galeria, favor selecionar outra", 'e_galeriaPara');
        return;
    }

    if (Selector.$('e_qtdPara').value.trim() <= 0) {
        MostrarMsg("Por favor informe uma quantidade válida!", 'e_qtdPara');
        return;
    }

    if (parseInt(Selector.$('e_qtdPara').value) <= 0) {
        MostrarMsg("Por favor informe uma quantidade válida!", 'e_qtdPara');
        return;
    }

    if (parseInt(Selector.$('e_qtdPara').value) > parseInt(Selector.$('e_qtd').value)) {
        MostrarMsg("Por favor informe uma quantidade menor ou igual a " + Selector.$('e_qtd').value, 'e_qtdPara');
        return;
    }

    if (Selector.$('e_btGravar').innerHTML !== "Transferir") {
        return;
    }

    Selector.$('e_btGravar').innerHTML = "Transferindo...";

    var ajax = new Ajax('POST', 'php/estoque-de-produtos.php', true);
    var p = 'action=TransferirEstoque';
    p += '&qtd=' + Selector.$('e_qtdPara').value;
    p += '&produto=' + Selector.$('e_produto').value;
    p += '&artista=' + Selector.$('e_artista').value;
    p += '&obra=' + Selector.$('e_obra').value;
    p += '&tamanho=' + Selector.$('e_tamanho').value;
    p += '&acabamento=' + Selector.$('e_acabamento').value;
    p += '&galeriaDe=' + Selector.$('e_galeria').value;
    p += '&galeriaPara=' + Selector.$('e_galeriaPara').value;
    p += '&galeriaNomeDe=' + Select.GetText(Selector.$('e_galeria'));
    p += '&galeriaNomePara=' + Select.GetText(Selector.$('e_galeriaPara'));
    p += '&largura=' + largura;
    p += '&altura=' + altura;
    p += '&idTipoProduto=' + tipo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('e_btGravar').innerHTML = "Transferir";

        if (ajax.getResponseText() == '0') {
            MostrarMsg('Problemas ao transferir o estoque. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
            return;
        }

        dialogoCadastro.Close();
        Pesquisar();
    };

    ajax.Request(p);
}