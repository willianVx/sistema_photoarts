checkSessao();
CheckPermissao(83, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Receitas Avulsas</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Data'),
        DOM.newText('Descrição'),
        DOM.newText('Valor'),
        DOM.newText('Forma Pagamento'),
        DOM.newText('Excluir')
    ]);

    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);

    getFormasPagamentos(Selector.$('forma'), "Todas Formas de Pagamento", true);

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    setDataDeAte(Selector.$('de'), Selector.$('ate'));

    Mostra();    
    
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 170) + "px"; 
};

window.onresize = function () {    
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 170) + "px";
};

function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/receitas-avulsas.php', true);
    var p = 'action=Mostra';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&forma=' + Selector.$('forma').value;
    p += '&busca=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
          
            Selector.$('msgDept').style.display = "block";
            return;
        }
 
        Selector.$('msgDept').style.display = "none";

        var json = JSON.parse(ajax.getResponseText());
  
        for (var i = 0; i < json.length; i++) {

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'Excluir(' + json[i].codigo + ');');

            grid.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].descricao),
                DOM.newText(json[i].valor),
                DOM.newText(json[i].forma),
                excluir
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width: 100px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right; width: 90px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:left; width:220px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:50px');

            pintaLinhaGrid(grid);
        }
    };

    ajax.Request(p);
}

function Gravar(codigo) {

    if (Selector.$('data').value.trim() === '') {
        Selector.$('data').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo data.", "OK", "", false, "data");
        mensagem.Show();
        return;
    }

    if (Selector.$('descricao').value.trim() === '') {
        Selector.$('descricao').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo descrição.", "OK", "", false, "descricao");
        mensagem.Show();
        return;
    }

    if (Selector.$('formapagamento').selectedIndex <= 0) {
        Selector.$('formapagamento').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, imforme a forma de pagamento.", "OK", "", false, "formapagamento");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/receitas-avulsas.php', false);
    var p = 'action=Gravar';
    p += '&data=' + Selector.$('data').value.trim();
    p += '&descricao=' + Selector.$('descricao').value.trim();
    p += '&valor=' + Number.parseFloat(Selector.$('valor').value);
    p += '&forma=' + Selector.$('formapagamento').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '2') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Esta receita já está cadastrada.", "OK", "", false, "");
        mensagem.Show();
    } else if (ajax.getResponseText() == 0) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
    } else {
        dialogoCadastro.Close();
        Mostra();
    }
}

function Excluir(codigo) {

    if(!CheckPermissao(85, true, 'Você não possui permissão para excluir uma receita avulsa', false)){
        return;
    }

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta receita?", "OK", "Excluir_Aux(" + codigo + ");", true, "");
    mensagemExcluirObra.Show();
}

function Excluir_Aux(codigo) {

    mensagemExcluirObra.Close();

    var ajax = new Ajax('POST', 'php/receitas-avulsas.php', false);
    var p = 'action=Excluir';
    p += '&codigo=' + codigo;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Atenção!", "Problemas ao Excluir Favor tente mais Tarde", "OK", "", false, "");
    } else {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Atenção!", "Receita Excluida com Sucesso", "OK", "", false, "");
    }

    mensagem.Show();
    Mostra();
}

function promptCadastro() {

    if(!CheckPermissao(84, true, 'Você não possui permissão para cadastrar receitas avulsas', false)){
        return;
    }

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divCadastro.appendChild(divform);

    var lbldata = DOM.newElement('label');
    lbldata.innerHTML = 'Data';
    lbldata.setAttribute('style', 'margin-right:5px;');
    divform.appendChild(lbldata);

    var txtdata = DOM.newElement('text');
    txtdata.setAttribute('id', 'data');
    txtdata.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtdata.setAttribute("style", 'width:100px');
    divform.appendChild(txtdata);

    divform.innerHTML += "<BR>";

    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Descrição';
    lblnome.setAttribute('style', 'margin-right:5px;');
    divform.appendChild(lblnome);
    divform.innerHTML += "<BR>";

    var txtdescricao = DOM.newElement('textarea');
    txtdescricao.setAttribute('id', 'descricao');
    txtdescricao.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtdescricao.setAttribute("style", 'width:100%; height:60px;');
    divform.appendChild(txtdescricao);

    divform.innerHTML += "<BR>";

    var lbldata = DOM.newElement('label');
    lbldata.innerHTML = 'Valor';
    lbldata.setAttribute('style', 'margin-right:5px;');
    divform.appendChild(lbldata);

    var txtvalor = DOM.newElement('text');
    txtvalor.setAttribute('id', 'valor');
    txtvalor.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtvalor.setAttribute("style", 'width:100px');
    divform.appendChild(txtvalor);

    divform.innerHTML += "<BR>";

    var lblforma = DOM.newElement('label');
    lblforma.innerHTML = 'Forma Pagamento';
    lblforma.setAttribute('style', 'margin-right:5px;');
    divform.appendChild(lblforma);

    var txtforma = DOM.newElement('select');
    txtforma.setAttribute('id', 'formapagamento');
    txtforma.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtforma.setAttribute("style", 'width:100%');
    divform.appendChild(txtforma);

    divform.innerHTML += "<BR>";

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar()');
    cmdTexto1.innerHTML = 'Gravar';
    divform.appendChild(cmdTexto1);

    dialogoCadastro = new caixaDialogo('divCadastro', 310, 420, 'padrao/', 130);
    dialogoCadastro.Show();

    getFormasPagamentos(Selector.$('formapagamento'), "Selecione...", false);

    Mask.setData(Selector.$('data'));
    Mask.setMoeda(Selector.$('valor'));
    Selector.$('data').focus();
}

function formaClick() {

    if (Selector.$('forma').value == Selector.$('forma').name) {
        return;
    }

    Selector.$('forma').name = Selector.$('forma').value;   
    Mostra();
}