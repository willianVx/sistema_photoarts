checkSessao();

window.onload = function () {
    
    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Equipamentos</div>";
    carregarmenu();
    getDadosUsuario();
    getTiposEquipamentos(Selector.$('tiposEquipamentos'), 'Selecione um tipo de equipamento', true);

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Equipamento'),
        DOM.newText('Altura'),
        DOM.newText('Largura'),
        DOM.newText('Profundidade/Comprimento'),
        DOM.newText('Peso'),
        DOM.newText('Valor Locação'),
        DOM.newText('Ativo'),
        DOM.newText('Ver')
    ]);

    Selector.$('divTabela').appendChild(grid.table);
    MostraEquipamentos();
};

function PromptEquipamento(codigo) {

    if (!isElement('div', 'PromptEquipamento')) {
        var PromptEquipamento = DOM.newElement('div', 'PromptEquipamento');
        document.body.appendChild(PromptEquipamento);
    }

    var PromptEquipamento = Selector.$('PromptEquipamento');
    PromptEquipamento.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptEquipamento.appendChild(divform);
    
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

    var lblTipoEquipamento = DOM.newElement('label');
    lblTipoEquipamento.innerHTML = "Tipo";

    var tipoEquipamento = DOM.newElement('select', 'tiposEquipamentos2');
    tipoEquipamento.setAttribute('class', 'combo_cinzafoco');
    tipoEquipamento.setAttribute('style', 'width:590px; margin-left:5px;');

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

    var lblNome = DOM.newElement('label');
    lblNome.innerHTML = "Nome";

    var nome = DOM.newElement('text', 'nome');
    nome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    nome.setAttribute('style', 'margin-left:5px; width:605px;');
    nome.setAttribute('placeHolder', 'Ex.: Monitor LCD 21,5”');
    
    var lblValorLocacao = DOM.newElement('label');
    lblValorLocacao.setAttribute('style', 'margin-left:10px;');
    lblValorLocacao.innerHTML = "Valor Locação";

    var valorLocacao = DOM.newElement('text', 'valorLocacao');
    valorLocacao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    valorLocacao.setAttribute('style', 'margin-left:5px; width:100px;');

    var verHistorico = DOM.newElement('img', 'verHistorico');
    verHistorico.setAttribute('src', 'imagens/menu.png');
    verHistorico.setAttribute('title', 'Ver Histórico');
    verHistorico.setAttribute('style', 'float:right; margin-right:10px; margin-top:5px; cursor:pointer; display:none');
    verHistorico.setAttribute('onclick', 'PromptEquipamentoHistorico(' + codigo + ')');

    var lblAltura = DOM.newElement('label');
    lblAltura.innerHTML = "Altura";

    var altura = DOM.newElement('text', 'altura');
    altura.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    altura.setAttribute('style', 'margin-left:5px; width:120px;');

    var lblMetros = DOM.newElement('label');
    lblMetros.setAttribute('style', 'margin-left:3px;');
    lblMetros.innerHTML = "m";

    var lblMetros2 = DOM.newElement('label');
    lblMetros2.setAttribute('style', 'margin-left:3px;');
    lblMetros2.innerHTML = "m";

    var lblMetros3 = DOM.newElement('label');
    lblMetros3.setAttribute('style', 'margin-left:3px;');
    lblMetros3.innerHTML = "m";

    var lblLargura = DOM.newElement('label');
    lblLargura.setAttribute('style', 'margin-left:10px;');
    lblLargura.innerHTML = "Largura";

    var largura = DOM.newElement('text', 'largura');
    largura.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    largura.setAttribute('style', 'margin-left:5px; width:120px;');

    var lblProfundidadeComprimento = DOM.newElement('label');
    lblProfundidadeComprimento.setAttribute('style', 'margin-left:10px;');
    lblProfundidadeComprimento.innerHTML = "Profundidade/Comprimento";

    var profundidadeComprimento = DOM.newElement('text', 'profundidadeComprimento');
    profundidadeComprimento.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    profundidadeComprimento.setAttribute('style', 'margin-left:5px; width:120px;');

    var lblPeso = DOM.newElement('label');
    lblPeso.setAttribute('style', 'margin-left:10px;');
    lblPeso.innerHTML = "Peso";

    var peso = DOM.newElement('text', 'peso');
    peso.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    peso.setAttribute('style', 'margin-left:5px; width:120px;');

    var lblKg = DOM.newElement('label');
    lblKg.setAttribute('style', 'margin-left:3px;');
    lblKg.innerHTML = "Kg";

    var lblDescricaoTecnica = DOM.newElement('label');
    lblDescricaoTecnica.innerHTML = "Descrição Técnica";

    var descricaoTecnica = DOM.newElement('textarea', 'descricaoTecnica');
    descricaoTecnica.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    descricaoTecnica.setAttribute('style', 'width:900px; height:70px;');
    
    var lblMensagemAviso = DOM.newElement('label', 'lblMensagemAviso');
    lblMensagemAviso.innerHTML = "Após gravar o equipamento, será possível adicionar ítens ao estoque";
    lblMensagemAviso.setAttribute('style', 'color:#0033FF; display:none');

    var lblEstoque = DOM.newElement('label', 'lblEstoque');
    lblEstoque.innerHTML = "Estoque";

    var btAdicionar = DOM.newElement('button', 'adicionar');
    btAdicionar.setAttribute('class', 'botaosimplesfoco');
    btAdicionar.setAttribute('style', 'float:right; margin-top:-21px;');
    btAdicionar.setAttribute('onclick', 'PromptEstoqueEquipamento(0, ' + codigo + ');');
    btAdicionar.innerHTML = 'Adicionar +';

    var btGravar = DOM.newElement('button', 'gravar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'GravarEquipamento(' + codigo + ');');
    btGravar.innerHTML = 'Gravar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoEquipamento.Close();');
    btCancelar.innerHTML = 'Cancelar';

    var divGridEstoque = DOM.newElement('div', 'divGridEstoque');
    divGridEstoque.setAttribute('style', 'height:235px; overflow:auto;');

    gridEstoque = new Table('gridEstoque');
    gridEstoque.table.setAttribute('cellpadding', '5');
    gridEstoque.table.setAttribute('cellspacing', '0');
    gridEstoque.table.setAttribute('class', 'tabela_cinza_foco');
    gridEstoque.table.setAttribute('style', 'margin-top:5px;');

    gridEstoque.addHeader([
        DOM.newText('Item'),
        DOM.newText('Data'),
        DOM.newText('Marca'),
        DOM.newText('Modelo'),
        DOM.newText('N° Série'),
        DOM.newText('Descrição'),
        DOM.newText('Qtde'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);
    
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblTipoEquipamento);
    divform.appendChild(lblast2);
    divform.appendChild(tipoEquipamento);
    divform.appendChild(lblDataCadastro);
    divform.appendChild(dataCadastro);
    divform.appendChild(ativo);
    divform.appendChild(lblAtivo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblNome);
    divform.appendChild(lblast3);
    divform.appendChild(nome);
    divform.appendChild(lblValorLocacao);
    divform.appendChild(lblast4);
    divform.appendChild(valorLocacao);
    divform.appendChild(verHistorico);
    divform.innerHTML += '<br>';
    divform.appendChild(lblAltura);
    divform.appendChild(altura);
    divform.appendChild(lblMetros);
    divform.appendChild(lblLargura);
    divform.appendChild(largura);
    divform.appendChild(lblMetros2);
    divform.appendChild(lblProfundidadeComprimento);
    divform.appendChild(profundidadeComprimento);
    divform.appendChild(lblMetros3);
    divform.appendChild(lblPeso);
    divform.appendChild(peso);
    divform.appendChild(lblKg);
    divform.innerHTML += '<br>';
    divform.appendChild(lblDescricaoTecnica);
    divform.innerHTML += '<br>';
    divform.appendChild(descricaoTecnica);
    
    divform.appendChild(lblMensagemAviso);
    if(codigo <= 0){
        Selector.$('lblMensagemAviso').style.display = 'block';
    }
    else{
        Selector.$('lblMensagemAviso').style.display = 'none';
    }
    
    divform.innerHTML += '<br>';
    divform.appendChild(lblEstoque);
    divform.appendChild(btAdicionar);
    divform.innerHTML += '<br id="br1">';
    divform.appendChild(divGridEstoque);
    divform.innerHTML += '<br>';
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoEquipamento = new caixaDialogo('PromptEquipamento', 620, 985, 'padrao/', 130);
    dialogoEquipamento.Show();
    dialogoEquipamento.HideCloseIcon();

    Selector.$('divGridEstoque').appendChild(gridEstoque.table);

    Mask.setMoeda(Selector.$('valorLocacao'));
    Mask.setMoeda(Selector.$('altura'));
    Mask.setMoeda(Selector.$('largura'));
    Mask.setMoeda(Selector.$('profundidadeComprimento'));
    Mask.setMoeda(Selector.$('peso'));

    var scrollY;
    scrollY = window.pageYOffset;

    if (document.all) {
        if (!document.documentElement.scrollTop)
            scrollY = document.body.scrollTop;
        else
            scrollY = document.documentElement.scrollTop;
    } else
        scrollY = window.pageYOffset;

    if (codigo <= 0) {

        getTiposEquipamentos(Selector.$('tiposEquipamentos2'), "Selecione um tipo de equipamento", true);
        Selector.$('dataCadastro').value = Date.GetDate(false);
        Selector.$('ativo').checked = true;
        Selector.$('lblEstoque').style.display = 'none';
        Selector.$('adicionar').style.display = 'none';
        Selector.$('br1').style.display = 'none';
        //Selector.$('br2').style.display = 'none';
        Selector.$('divGridEstoque').style.display = 'none';
        Selector.$('PromptEquipamento').style.height = '370px';
        Selector.$('PromptEquipamento').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (390 / 2)) - 0) + 'px';
        Selector.$('tiposEquipamentos2').focus();
    } else {
        getTiposEquipamentos(Selector.$('tiposEquipamentos2'), "Selecione um tipo de equipamento", false);
        Selector.$('verHistorico').style.display = 'block';
        Selector.$('lblEstoque').style.display = 'block';
        Selector.$('adicionar').style.display = 'block';
        Selector.$('br1').style.display = 'block';
        //Selector.$('br2').style.display = 'block';
        Selector.$('divGridEstoque').style.display = 'block';
        Selector.$('PromptEquipamento').style.height = '600px';
        Selector.$('PromptEquipamento').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (600 / 2)) - 0) + 'px';
        getEquipamento(codigo);
    }
}

function MostraEquipamentos() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', true);
    var p = 'action=MostraEquipamentos';
    p += '&idTipoEquipamento=' + Selector.$('tiposEquipamentos').value;
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('mensagemEquipamentos').style.display = 'block';
            Selector.$('divTabela').style.display = 'none';
            return;
        }

        Selector.$('divTabela').style.display = 'block';
        Selector.$('mensagemEquipamentos').style.display = 'none';

        grid.clearRows();

        var json = JSON.parse(ajax.getResponseText()  );
        var ver;
        var cor = false;

        for (var i = 0; i < json.length; i++) {

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/modificar.png');
            ver.setAttribute('title', 'Editar');
            ver.setAttribute('class', 'efeito-opacidade-75-04');
            ver.setAttribute('onclick', 'PromptEquipamento(' + json[i].idEquipamento + ');');

            grid.addRow([
                DOM.newText(json[i].equipamentoTipo),
                DOM.newText(json[i].equipamento),
                DOM.newText(json[i].altura),
                DOM.newText(json[i].largura),
                DOM.newText(json[i].comprimento),
                DOM.newText(json[i].peso),
                DOM.newText(json[i].valorLocacao),
                DOM.newText(json[i].ativo),
                ver
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idEquipamento);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right; width:90px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:right; width:90px');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:right; width:90px');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; width:90px');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:right; width:100px');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:40px');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px');

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

    var tipoEquipamento = Selector.$('tiposEquipamentos2');
    if (tipoEquipamento.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione um tipo de equipamento", "OK", "", false, "tiposEquipamentos2");
        mensagem.Show();
        return false;
    }

    var nome = Selector.$('nome');
    if (nome.value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Nome", "OK", "", false, "nome");
        mensagem.Show();
        return false;
    }

    var valorLocacao = Selector.$('valorLocacao');
    if (valorLocacao.value.trim() === '' || valorLocacao.value.trim() === ',') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Valor Locação", "OK", "", false, "valorLocacao");
        mensagem.Show();
        return false;
    }

    return true;
}

function GravarEquipamento(codigo) {

    if (!Verifica()) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', true);
    var p = 'action=GravarEquipamento';
    p += '&idEquipamento=' + codigo;
    p += '&idTipoEquipamento=' + Selector.$('tiposEquipamentos2').value;
    p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&ativo=' + (Selector.$('ativo').checked ? '1' : '0');
    p += '&nome=' + Selector.$('nome').value;
    p += '&valorLocacao=' + Selector.$('valorLocacao').value;
    p += '&altura=' + (Selector.$('altura').value.trim());
    p += '&largura=' + Selector.$('largura').value;
    p += '&profundidadeComprimento=' + Selector.$('profundidadeComprimento').value;
    p += '&peso=' + Selector.$('peso').value;
    p += '&descricaoTecnica=' + Selector.$('descricaoTecnica').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao gravar o equipamento. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() === '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este equipamento já está cadastrado.", "OK", "", false, "");
            mensagem.Show();
            return false;
        } else {
            dialogoEquipamento.Close();
            MostraEquipamentos();
            
            if(codigo <= 0){
                PromptEquipamento(ajax.getResponseText());
            }
        }
    };
    
    Selector.$('gravar').disabled = true;
    Selector.$('gravar').innerHTML = "Gravando";
    ajax.Request(p);
}

function getEquipamento(idEquipamento) {

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', false);
    var p = 'action=getEquipamento';
    p += '&idEquipamento=' + idEquipamento;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    Selector.$('tiposEquipamentos2').value = json.idEquipamentoTipo;
    Selector.$('dataCadastro').value = json.dataCadastro;
    if (json.ativo === '1') {
        Selector.$('ativo').checked = true;
    } else {
        Selector.$('ativo').checked = false;
    }
    Selector.$('nome').value = json.equipamento;
    Selector.$('valorLocacao').value = json.valorLocacao;
    Selector.$('altura').value = json.altura;
    Selector.$('largura').value = json.largura;
    Selector.$('profundidadeComprimento').value = json.comprimento;
    Selector.$('peso').value = json.peso;
    Selector.$('descricaoTecnica').value = json.descricaoTecnica;

    MostraEstoqueEquipamento(idEquipamento);
}

function MostraEstoqueEquipamento(idEquipamento) {

    gridEstoque.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', false);
    var p = 'action=MostraEstoqueEquipamento';
    p += '&idEquipamento=' + idEquipamento;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText()  );
    var editar;
    var cor = false;

    for (var i = 0; i < json.length; i++) {

        editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'PromptEstoqueEquipamento(' + json[i].idEquipamentoEstoque + ', ' + idEquipamento + ');');

        gridEstoque.addRow([
            DOM.newText(i + 1),
            DOM.newText(json[i].dataCadastro),
            DOM.newText(json[i].marca),
            DOM.newText(json[i].modelo),
            DOM.newText(json[i].numeroSerie),
            DOM.newText(json[i].descricao),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].ativo),
            editar
        ]);

        gridEstoque.setRowData(gridEstoque.getRowCount() - 1, json[i].idEquipamentoEstoque);
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 0).setAttribute('style', 'text-align:center');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:80px;');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:90px');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:80px');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:50px');
        gridEstoque.getCell(gridEstoque.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px');

        if (cor) {
            cor = false;
            gridEstoque.setRowBackgroundColor(gridEstoque.getRowCount() - 1, "#F5F5F5");
        } else {
            cor = true;
            gridEstoque.setRowBackgroundColor(gridEstoque.getRowCount() - 1, "#FFF");
        }
    }

    Selector.$('lblEstoque').innerHTML += " <label style='font-weight:100;'>( " + (gridEstoque.getRowCount() === 1 ? gridEstoque.getRowCount() + " item adicionado" : gridEstoque.getRowCount() + " itens adicionados") + " )</label>";
}

function PromptEstoqueEquipamento(idEquipamentoEstoque, idEquipamento) {

    if (!isElement('div', 'PromptEstoqueEquipamento')) {
        var PromptEstoqueEquipamento = DOM.newElement('div', 'PromptEstoqueEquipamento');
        document.body.appendChild(PromptEstoqueEquipamento);
    }

    var PromptEstoqueEquipamento = Selector.$('PromptEstoqueEquipamento');
    PromptEstoqueEquipamento.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptEstoqueEquipamento.appendChild(divform);
    
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

    var lblEquipamento = DOM.newElement('label', 'lblEquipamento');
    lblEquipamento.innerHTML = "<label style=font-weight:100>Equipamento:</label>";

    var lblAtivo = DOM.newElement('label');
    lblAtivo.setAttribute('style', 'float:left');
    lblAtivo.setAttribute('for', 'ativo');
    lblAtivo.innerHTML = "Ativo";

    var ativo = DOM.newElement('checkbox', 'ativo2');
    ativo.setAttribute('style', 'float:left;');

    var lblMarca = DOM.newElement('label');
    lblMarca.innerHTML = "Marca";

    var marca = DOM.newElement('text', 'marca');
    marca.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    marca.setAttribute('style', 'margin-left:5px; width:165px;');

    var lblModelo = DOM.newElement('label');
    lblModelo.setAttribute('style', 'margin-left:10px;');
    lblModelo.innerHTML = "Modelo";

    var modelo = DOM.newElement('text', 'modelo');
    modelo.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    modelo.setAttribute('style', 'margin-left:5px; width:165px;');

    var lblNumeroSerie = DOM.newElement('label');
    lblNumeroSerie.setAttribute('style', 'margin-left:10px;');
    lblNumeroSerie.innerHTML = "N° Série";

    var numeroSerie = DOM.newElement('text', 'numeroSerie');
    numeroSerie.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    numeroSerie.setAttribute('style', 'margin-left:5px; width:110px;');

    var lblDescricao = DOM.newElement('label');
    lblDescricao.setAttribute('style', 'margin-left:3px;');
    lblDescricao.innerHTML = "Descrição";

    var descricao = DOM.newElement('textarea', 'descricao');
    descricao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    descricao.setAttribute('style', 'margin-left:5px; width:610px; height:70px;');

    var btGravar = DOM.newElement('button', 'gravar2');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.setAttribute('onclick', 'GravarEstoqueEquipamento(' + idEquipamentoEstoque + ', ' + idEquipamento + ')');
    btGravar.innerHTML = 'Gravar';

    var btCancelar = DOM.newElement('button', 'cancelar');
    btCancelar.setAttribute('class', 'botaosimplesfoco');
    btCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    btCancelar.setAttribute('onclick', 'dialogoEstoqueEquipamento.Close();');
    btCancelar.innerHTML = 'Cancelar';
    
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblEquipamento);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblMarca);
    divform.appendChild(lblast2);
    divform.appendChild(marca);
    divform.appendChild(lblModelo);
    divform.appendChild(lblast3);
    divform.appendChild(modelo);
    divform.appendChild(lblNumeroSerie);
    divform.appendChild(numeroSerie);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblDescricao);
    divform.innerHTML += '<br>';
    divform.appendChild(descricao);
    divform.innerHTML += '<br><br>';
    divform.appendChild(ativo);
    divform.appendChild(lblAtivo);
    divform.appendChild(btCancelar);
    divform.appendChild(btGravar);

    dialogoEstoqueEquipamento = new caixaDialogo('PromptEstoqueEquipamento', 305, 700, 'padrao/', 131);
    dialogoEstoqueEquipamento.Show();

    Selector.$('lblEquipamento').innerHTML += " " + Selector.$('nome').value;

    if (idEquipamentoEstoque <= 0) {

        Selector.$('marca').focus();
        Selector.$('ativo2').checked = true;
    } else {
        getEstoqueEquipamento(idEquipamentoEstoque);
    }
}

function getEstoqueEquipamento(idEquipamentoEstoque) {

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', false);
    var p = 'action=getEstoqueEquipamento';
    p += '&idEquipamentoEstoque=' + idEquipamentoEstoque;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText()  );

    if (json.ativo === '1') {
        Selector.$('ativo2').checked = true;
    } else {
        Selector.$('ativo2').checked = false;
    }

    Selector.$('marca').value = json.marca;
    Selector.$('modelo').value = json.modelo;
    Selector.$('numeroSerie').value = json.numeroSerie;
    Selector.$('descricao').value = json.descricao;
}

function GravarEstoqueEquipamento(idEquipamentoEstoque, idEquipamento) {

    var marca = Selector.$('marca');
    if (marca.value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Marca", "OK", "", false, "marca");
        mensagem.Show();
        return;
    }

    var modelo = Selector.$('modelo');
    if (modelo.value.trim() === '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Modelo", "OK", "", false, "modelo");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', true);
    var p = 'action=GravarEstoqueEquipamento';
    p += '&idEquipamentoEstoque=' + idEquipamentoEstoque;
    p += '&idEquipamento=' + idEquipamento;
    p += '&ativo=' + (Selector.$('ativo2').checked ? '1' : '0');
    p += '&marca=' + marca.value;
    p += '&modelo=' + modelo.value;
    p += '&numeroSerie=' + Selector.$('numeroSerie').value;
    p += '&descricao=' + Selector.$('descricao').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        Selector.$('gravar2').disabled = false;
        Selector.$('gravar2').innerHTML = "Gravar";

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao gravar o estoque desse equipamento. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() === '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este item já está cadastrado.", "OK", "", false, "");
            mensagem.Show();
            return false;
        } else {
            dialogoEstoqueEquipamento.Close();
            MostraEstoqueEquipamento(idEquipamento);
        }
    };
    
    Selector.$('gravar2').disabled = true;
    Selector.$('gravar2').innerHTML = "Gravando";
    ajax.Request(p);
}

function PromptEquipamentoHistorico(idEquipamento) {

    if (!isElement('div', 'PromptEquipamentoHistorico')) {
        var PromptEquipamentoHistorico = DOM.newElement('div', 'PromptEquipamentoHistorico');
        document.body.appendChild(PromptEquipamentoHistorico);
    }

    var PromptEquipamentoHistorico = Selector.$('PromptEquipamentoHistorico');
    PromptEquipamentoHistorico.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    PromptEquipamentoHistorico.appendChild(divform);

    var lblHistorico = DOM.newElement('label');
    lblHistorico.innerHTML = "<center>Histórico do Equipamento</center>";

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

    dialogoEquipamentoHistorico = new caixaDialogo('PromptEquipamentoHistorico', 530, 500, 'padrao/', 131);
    dialogoEquipamentoHistorico.Show();

    Selector.$('divGridHistorico').appendChild(gridHistorico.table);

    gridHistorico.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-equipamentos.php', true);
    var p = 'action=getHistoricoEquipamento';
    p += '&idEquipamento=' + idEquipamento;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var cor = false;

        for (var i = 0; i < json.length; i++) {

            gridHistorico.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].valorLocacao),
                DOM.newText(json[i].funcionario)
            ]);

            gridHistorico.setRowData(gridHistorico.getRowCount() - 1, json[i].idEquipamentoHistorico);
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
