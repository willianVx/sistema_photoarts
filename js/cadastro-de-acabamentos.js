checkSessao();
CheckPermissao(120, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Acabamentos</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Nome'),
        DOM.newText('Data'),
        DOM.newText('Preço Base'),
        DOM.newText('Peso Base'),
        DOM.newText('InstaArts'),
        DOM.newText('PhotoArts'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('divTabela').appendChild(grid.table);
    Mostra();
    Selector.$('busca').focus();
    
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px"; 
};

window.onresize = function () {
    
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-acabamentos.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value.trim();

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        var editar;

        for (var i = 0; i < json.length; i++) {

            var nome = json[i].nome;
            var data = json[i].data;
            var precoBase = json[i].precoBase;
            var pesoBase = json[i].pesoBase;
            var instaArts = json[i].instaArts;
            var photoArts = json[i].photoArts;
            var ativo = json[i].ativo;

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('style', 'cursor:pointer;');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].idAcabamento + ');');

            grid.addRow([
                DOM.newText(nome),
                DOM.newText(data),
                DOM.newText(precoBase),
                DOM.newText(pesoBase + " Kg"),
                DOM.newText(instaArts),
                DOM.newText(photoArts),
                DOM.newText(ativo),
                editar
            ]);

            grid.setRowData(i, json[i].idAcabamento);
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center');

            if (i % 2 !== 0) {
                grid.getRow(grid.getRowCount() - 1).style.backgroundColor = "#EDEDED";
            }

            if (json[i].instaArts === 'NÃO') {
                grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'width:30px; text-align:center; color:red');
            } else {
                grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'width:30px; text-align:center; color:green');
            }

            if (json[i].photoArts === 'NÃO') {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'width:30px; text-align:center; color:red');
            } else {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'width:30px; text-align:center; color:green');
            }

            if (json[i].ativo === 'NÃO') {
                grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'width:30px; text-align:center; color:red');
            } else {
                grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'width:30px; text-align:center; color:green');
            }
        }
    };

    ajax.Request(p);
}

function promptCadastro(codigo) {

    
        if(!CheckPermissao(121, true, 'Você não possui permissão para Cadastrar/Editar um acabamento', false)){
            return;
        }
    

    if (!isElement('div', 'divCadastro')) {
        var divCadastro = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(divCadastro);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divCadastro.appendChild(divform);

    lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Nome:';

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute('placeholder', 'Nome do acabamento');
    txtnome.setAttribute("style", 'margin-left:10px; width:300px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    boxativo.setAttribute("style", 'margin-left:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.setAttribute('for', 'ativo');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');

    //==== PREÇO E PESO ====//

    lblpreco = DOM.newElement('label');
    lblpreco.innerHTML = 'Preço Base:';

    var txtpreco = DOM.newElement('text');
    txtpreco.setAttribute('id', 'precoBase');
    txtpreco.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtpreco.setAttribute("style", 'margin-left:10px; margin-right:10px; width:100px');

    lblpeso = DOM.newElement('label');
    lblpeso.innerHTML = 'Peso Base:';

    var txtpeso = DOM.newElement('text');
    txtpeso.setAttribute('id', 'pesoBase');
    txtpeso.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtpeso.setAttribute("style", 'margin-left:10px; margin-right:5px; width:100px');

    lblkg = DOM.newElement('label');
    lblkg.innerHTML = 'Kg';
    lblkg.setAttribute('class', 'fonte_arial_form');

    //============ PHOTO E INSTA =================//

    //==== PREÇO ATE 1M  ====//

    lblAte1MSE = DOM.newElement('label');
    //lblAte1MSE.innerHTML = 'Base até 1M (S/E):';
    lblAte1MSE.innerHTML = 'Moldura Tipo #1: ';

    var txtprecoAte1mSE = DOM.newElement('text');
    txtprecoAte1mSE.setAttribute('id', 'precoBaseAte1mSE');
    txtprecoAte1mSE.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtprecoAte1mSE.setAttribute("style", 'margin-left:10px; margin-right:10px; width:100px');

    lblpesoAte1MCE = DOM.newElement('label');
    lblpesoAte1MCE.innerHTML = 'Moldura Tipo #2: ';

    var txtpesoAte1mCE = DOM.newElement('text');
    txtpesoAte1mCE.setAttribute('id', 'precoBaseAte1mCE');
    txtpesoAte1mCE.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtpesoAte1mCE.setAttribute("style", 'margin-left:10px; margin-right:5px; width:100px');

    //==== PREÇO ACIMA 1M  ====//

    lblprecoAcima1mSE = DOM.newElement('label');
    lblprecoAcima1mSE.innerHTML = 'Moldura Tipo #3: ';

    var txtprecoAcima1mSE = DOM.newElement('text');
    txtprecoAcima1mSE.setAttribute('id', 'precoBaseAcima1mSE');
    txtprecoAcima1mSE.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtprecoAcima1mSE.setAttribute("style", 'margin-left:10px; margin-right:10px; width:100px');

    lblpesoAcima1mCE = DOM.newElement('label');
    lblpesoAcima1mCE.innerHTML = 'Valor Extra :';

    var txtpesoAcima1mCE = DOM.newElement('text');
    txtpesoAcima1mCE.setAttribute('id', 'precoBaseAcima1mCE');
    txtpesoAcima1mCE.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtpesoAcima1mCE.setAttribute("style", 'margin-left:10px; margin-right:5px; width:100px');

    //============ PHOTO E INSTA =================//

    var boxphoto = DOM.newElement('checkbox');
    boxphoto.setAttribute('id', 'photo');

    var labelphoto = DOM.newElement('label');
    labelphoto.setAttribute('for', 'photo');
    labelphoto.innerHTML = 'PhotoArts';
    labelphoto.setAttribute("style", 'margin-right:30px; margin-left:5px;');

    var boxinsta = DOM.newElement('checkbox');
    boxinsta.setAttribute('id', 'insta');

    var labelinsta = DOM.newElement('label');
    labelinsta.setAttribute('for', 'insta');
    labelinsta.innerHTML = 'InstaArts';
    labelinsta.setAttribute("style", 'margin-right:30px; margin-left:5px;');

    var chkBloquear1M = DOM.newElement('checkbox', 'chkBloquear1M');

    var lblBloquear1M = DOM.newElement('label');
    lblBloquear1M.setAttribute('for', 'chkBloquear1M');
    lblBloquear1M.setAttribute('style', 'margin-left:5px;');
    lblBloquear1M.innerHTML = "Bloquear venda acima de 1m²";

    //============= DATA ================//

    var divdata = DOM.newElement('div', 'divdata');

    //============ BOTÕES ==============//

    cmdTexto2 = DOM.newElement('submit', 'historico');
    cmdTexto2.setAttribute('class', 'botaosimplesfoco');
    cmdTexto2.setAttribute('style', ' display:none; margin-top:-2px;');
    cmdTexto2.setAttribute('onclick', 'verHistorico(' + codigo + ')');
    cmdTexto2.value = 'Ver Histórico';

    cmdTexto1 = DOM.newElement('submit', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'margin-top:-2px; float:right; margin-left:20px;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.value = 'Gravar';

    cmdTexto = DOM.newElement('submit', 'cancelar');
    cmdTexto.setAttribute('class', 'botaosimplesfoco');
    cmdTexto.setAttribute('style', 'margin-top:-2px; margin-left:10px; float:right;');
    cmdTexto.setAttribute('onclick', 'dialogoCadastro.Close();');
    cmdTexto.value = 'Cancelar';

    //======== Tabela =========//

    divform.appendChild(lblnome);
    divform.appendChild(txtnome);
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    divform.innerHTML += '<br>';
    divform.appendChild(lblpreco);
    divform.appendChild(txtpreco);
    divform.appendChild(lblpeso);
    divform.appendChild(txtpeso);
    divform.appendChild(lblkg);
    divform.innerHTML += '<br>';
    divform.appendChild(lblAte1MSE);
    divform.appendChild(txtprecoAte1mSE);
    divform.appendChild(lblpesoAte1MCE);
    divform.appendChild(txtpesoAte1mCE);
    divform.innerHTML += '<br>';
    divform.appendChild(lblprecoAcima1mSE);
    divform.appendChild(txtprecoAcima1mSE);
    divform.appendChild(lblpesoAcima1mCE);
    divform.appendChild(txtpesoAcima1mCE);
    divform.innerHTML += '<br>';
    divform.appendChild(boxinsta);
    divform.appendChild(labelinsta);
    divform.appendChild(boxphoto);
    divform.appendChild(labelphoto);
    divform.appendChild(chkBloquear1M);
    divform.appendChild(lblBloquear1M);
    divform.innerHTML += '<br><br>';
    divform.appendChild(divdata);
    divform.innerHTML += '<br>';
    divform.appendChild(cmdTexto2);
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);
    Mask.setMoeda(Selector.$('precoBase'));
    Mask.setMoeda(Selector.$('pesoBase'));
    Mask.setMoeda(Selector.$('precoBaseAte1mSE'));
    Mask.setMoeda(Selector.$('precoBaseAte1mCE'));
    Mask.setMoeda(Selector.$('precoBaseAcima1mSE'));
    Mask.setMoeda(Selector.$('precoBaseAcima1mCE'));

    dialogoCadastro = new caixaDialogo('divCadastro', 295, 555, '/padrao/', 130);

    Selector.$('divCadastro').setAttribute('class', 'divbranca divcadastrostyle');

    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();

    if (codigo > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-acabamentos.php', true);
        var p = 'action=Editar';
        p += '&codigo=' + codigo;

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText() );

            Selector.$('nome').value = json[0].nome;
            Selector.$('precoBase').value = json[0].precoBase;
            Selector.$('pesoBase').value = json[0].pesoBase;

            Selector.$('precoBaseAte1mSE').value = json[0].precoBaseAte1mSE;
            Selector.$('precoBaseAte1mCE').value = json[0].precoBaseAte1mCE;
            Selector.$('precoBaseAcima1mSE').value = json[0].precoBaseAcima1mSE;
            Selector.$('precoBaseAcima1mCE').value = json[0].precoBaseAcima1mCE;

            if (json[0].funcionario !== '') {

                var labeldata = DOM.newElement('label');
                labeldata.setAttribute('class', 'fonte_Roboto_texto_normal');
                labeldata.setAttribute("style", 'margin-right:5px;');
                labeldata.innerHTML = "Ultima Atualização: " + json[0].dataAtualizacao + " por " + json[0].funcionario;
                Selector.$('divdata').appendChild(labeldata);
                Selector.$('historico').style.display = 'inline';
            }

            if (1 == json[0].instaArts)
                Selector.$('insta').checked = true;

            if (1 == json[0].photoArts)
                Selector.$('photo').checked = true;

            if (1 == json[0].ativo)
                Selector.$('ativo').checked = true;

            if (1 == json[0].bloquearVendaUltrapassou1M)
                Selector.$('chkBloquear1M').checked = true;
        };

        ajax.Request(p);
    } else {

        Selector.$('nome').focus();
        Selector.$('ativo').checked = true;
    }
}

function verHistorico(codigo) {

    //- - - - DivTabela - - - - - - -//

    if (!isElement('div', 'divTabelaHist')) {
        var divTabelaHist = DOM.newElement('div', 'divTabelaHist');
        divTabelaHist.setAttribute('class', 'divbrancasimples');
        divTabelaHist.setAttribute('style', 'height:170px; padding:5px; width:100%; overflow:auto');
        Selector.$('divCadastro').appendChild(divTabelaHist);
    }

    dialogoCadastro.Realinhar(490, 555);

    //- - - - - - BOTÃO OCULTAR - - - - -//   

    Selector.$('historico').value = "Ocultar Histórico";
    Selector.$('historico').setAttribute('onclick', 'OcultarHistorico(' + codigo + ')');

    // - - - - - - - - - - - - - - //  

    Selector.$('divTabelaHist').innerHTML = '';
    Selector.$('divTabelaHist').style.display = "inline-block";
    //- - - - - Grid - - - - -//

    gridHist = new Table('grid');
    gridHist.table.setAttribute('cellpadding', '5');
    gridHist.table.setAttribute('cellspacing', '5');
    gridHist.table.setAttribute('class', 'tabela_cinza_foco');

    gridHist.addHeader([
        DOM.newText('Data'),
        DOM.newText('Nome'),
        DOM.newText('Valor'),
        DOM.newText('Peso'),
        DOM.newText('Insta'),
        DOM.newText('Photo'),
        DOM.newText('Responsavel')
    ]);

    Selector.$('divTabelaHist').appendChild(gridHist.table);

    var ajax = new Ajax('POST', 'php/cadastro-de-acabamentos.php', true);
    var p = 'action=verHistorico';
    p += '&codigo=' + codigo;

    var stop = ajax.ajax.onreadystatechange = setInterval(function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        for (var i = 0; i < json.length; i++) {

            var nome = json[i].nome;
            var data = json[i].data;
            var precoBase = json[i].precoBase;
            var pesoBase = json[i].pesoBase;
            var instaArts = json[i].instaArts;
            var photoArts = json[i].photoArts;
            var funcionario = json[i].funcionario;

            gridHist.addRow([
                DOM.newText(data),
                DOM.newText(nome),
                DOM.newText(precoBase),
                DOM.newText(pesoBase + " Kg"),
                DOM.newText(instaArts),
                DOM.newText(photoArts),
                DOM.newText(funcionario)
            ]);

            gridHist.setRowData(i, 'hist');
            gridHist.getCell(gridHist.getRowCount() - 1, 0).setAttribute('style', 'text-align:center');
            gridHist.getCell(gridHist.getRowCount() - 1, 1).setAttribute('style', 'text-align:center');
            gridHist.getCell(gridHist.getRowCount() - 1, 2).setAttribute('style', 'text-align:center');
            gridHist.getCell(gridHist.getRowCount() - 1, 3).setAttribute('style', 'text-align:center');

            if (i % 2 !== 0) {
                gridHist.getRow(gridHist.getRowCount() - 1).style.backgroundColor = "#EDEDED";
            }

            if (json[i].instaArts === 'NÃO') {
                gridHist.getCell(gridHist.getRowCount() - 1, 4).setAttribute('style', 'width:30px; text-align:center; color:red');
            } else {
                gridHist.getCell(gridHist.getRowCount() - 1, 4).setAttribute('style', 'width:30px; text-align:center; color:green');
            }

            if (json[i].photoArts === 'NÃO') {
                gridHist.getCell(gridHist.getRowCount() - 1, 5).setAttribute('style', 'width:30px; text-align:center; color:red');
            } else {
                gridHist.getCell(gridHist.getRowCount() - 1, 5).setAttribute('style', 'width:30px; text-align:center; color:green');
            }

        }

        if (Selector.$('historico').value == "Ocultar Histórico")
            Selector.$('divTabelaHist').style.display = "block";

        clearInterval(stop);
    }, 0500);

    ajax.Request(p);
}

function Gravar(codigo) {

    if(!CheckPermissao(118, true, 'Você não possui permissão para editar um acabamento', false)){
        return;
    }

    var nome = Selector.$('nome').value;
    var ativo;
    var photoArts;
    var instaArts;
    var bloquearVenda;

    if (nome.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor preencha o campo nome.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    if (Selector.$('precoBase').value.trim() == '' || Selector.$('precoBase').value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor preencha o campo Preço Base.", "OK", "", false, "precoBase");
        mensagem.Show();
        return;
    }
    if (Selector.$('pesoBase').value.trim() == '' || Selector.$('pesoBase').value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor preencha o campo Peso Base.", "OK", "", false, "pesoBase");
        mensagem.Show();
        return;
    }

    if (Selector.$('precoBaseAte1mSE').value.trim() == '' || Selector.$('precoBaseAte1mSE').value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 125, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Preço Base até 1 M² Sem Estrela", "OK", "", false, "precoBaseAte1mSE");
        mensagem.Show();
        return;
    }

    if (Selector.$('precoBaseAte1mCE').value.trim() == '' || Selector.$('precoBaseAte1mCE').value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 125, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Preço Base até 1 M² Com Estrela.", "OK", "", false, "precoBaseAte1mCE");
        mensagem.Show();
        return;
    }

    if (Selector.$('precoBaseAcima1mSE').value.trim() == '' || Selector.$('precoBaseAcima1mSE').value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 125, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Preço Base acima de 1 M² Sem Estrela.", "OK", "", false, "precoBaseAcima1mSE");
        mensagem.Show();
        return;
    }

    if (Selector.$('precoBaseAcima1mCE').value.trim() == '' || Selector.$('precoBaseAcima1mCE').value.trim() == ',') {
        var mensagem = new DialogoMensagens("prompt", 125, 350, 150, "2", "Atenção!", "Por favor, preencha o campo Preço Base acima de 1 M² Com Estrela.", "OK", "", false, "precoBaseAcima1mCE");
        mensagem.Show();
        return;
    }

    (Selector.$('ativo').checked ? ativo = 1 : ativo = 0);
    (Selector.$('photo').checked ? photoArts = 1 : photoArts = 0);
    (Selector.$('insta').checked ? instaArts = 1 : instaArts = 0);
    (Selector.$('chkBloquear1M').checked ? bloquearVenda = 1 : bloquearVenda = 0);

    var ajax = new Ajax('POST', 'php/cadastro-de-acabamentos.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nome=' + nome;
    p += '&ativo=' + ativo;
    p += '&precoBase=' + Selector.$('precoBase').value;
    p += '&pesoBase=' + Selector.$('pesoBase').value;
    p += '&photoArts=' + photoArts;
    p += '&instaArts=' + instaArts;
    p += '&precoBaseAte1mSE=' + Selector.$('precoBaseAte1mSE').value;
    p += '&precoBaseAte1mCE=' + Selector.$('precoBaseAte1mCE').value;
    p += '&precoBaseAcima1mSE=' + Selector.$('precoBaseAcima1mSE').value;
    p += '&precoBaseAcima1mCE=' + Selector.$('precoBaseAcima1mCE').value;
    p += '&bloquearVenda=' + bloquearVenda;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() === '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro!", "Problemas ao gravar o Acabamento. Tente novamente, se o erro persistir contate o suporte técnico.", "OK", "", false, "campo");
            mensagem.Show();
            return;
        } else {

            if (ajax.getResponseText() === '2') {
                var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este Acabamento já está cadastrado.", "OK", "", false, "campo");
                mensagem.Show();
                return;
            }

            dialogoCadastro.Close();
            Mostra();
        }
    };

    ajax.Request(p);
}

function OcultarHistorico(codigo) {

    dialogoCadastro.Realinhar(295, 555);
    Selector.$('divTabelaHist').style.display = "none";
    Selector.$('historico').setAttribute('onclick', 'verHistorico(' + codigo + ')');
    Selector.$('historico').value = "Ver Histórico";
}