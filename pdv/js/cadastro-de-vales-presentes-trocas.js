ValidarSessao();

window.onload = function(){

    CarregarDadosUsuario();

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    CarregarGaleriasPdv(Selector.$('galeria'), "Todas", false, Selector.$('nomeGaleria').name);
    getClientesPremium(Selector.$('cliente2'), 'Todos os colecionadores', true);

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Data'),
        DOM.newText('Galeria'),
        DOM.newText('Colecionador'),
        DOM.newText('Código'),
        DOM.newText('Situação'),
        DOM.newText('Valor'),
        DOM.newText('Validade'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);

    Mostra();
};

window.onresize = function () {
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 150) + "px";
};

function Mostra() {

    var ajax = new Ajax('POST', 'php/cadastro-de-vales-presentes-trocas.php', true);
    var p = 'action=Mostra';
    p += '&tipoData=' + (Selector.$('dataCadastro').checked ? 'D' : 'V');
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idCliente=' + Selector.$('cliente2').value;
    p += '&situacao=' + Selector.$('situacao').value;
    p += '&codigo=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }
        
        grid.clearRows();

        if (ajax.getResponseText() == 0) {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var editar;
        var excluir;
        var situacao;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', '../imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].idValePresenteTroca + ');');

            excluir = DOM.newElement('img');
            excluir.setAttribute('src', '../imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'ExcluirValeAux(' + json[i].idValePresenteTroca + ');');

            situacao = DOM.newElement('span');
            if(parseInt(json[i].idVenda) > 0){
                situacao.innerHTML = 'Utilizado no pedido <span style="text-decoration:underline; cursor:pointer;" onclick="window.location=\'pedidos.html?idPedido=' + parseInt(json[i].idVenda) + '\'">' + json[i].idVenda + '</span>';
            }else{
                situacao.innerHTML = 'Não utilizado';
            }

            grid.addRow([
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].codigo),
                situacao,
                DOM.newText(json[i].valor),
                DOM.newText('Até ' + json[i].dataValidade),
                (parseInt(json[i].idVenda) > 0 ? DOM.newText('') : editar),
                (parseInt(json[i].idVenda) > 0 ? DOM.newText('') : excluir)
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idValePresenteTroca);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:250px;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; width:150px;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:50px;');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:50px;');
        }

        pintaLinhaGrid(grid);
    };

    ajax.Request(p);
}

function GerarRandomChar(){

    var ascii = [[48, 57],[64,90],[97,122]];
    var n = Math.floor(Math.random() * ascii.length);
    return String.fromCharCode(Math.floor(Math.random()*(ascii[n][1]-ascii[n][0]))+ascii[n][0]);
}

function GerarCodigoVale(){

    var qtdCaracteres = 6;
    var codigo = '';

    for(var i = 0; i < qtdCaracteres; i++){
        codigo += GerarRandomChar();
    }

    return codigo.toUpperCase();
}

function promptCadastro(codigo) {

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';

    var divData = DOM.newElement('div');
    divData.setAttribute('class', 'divcontainer');
    divData.setAttribute('style', 'max-width: 90px');

    var lblData = DOM.newElement('label');
    lblData.innerHTML = 'Data';
    lblData.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtData = DOM.newElement('input');
    txtData.setAttribute('type', 'text');
    txtData.setAttribute('id', 'data');
    txtData.setAttribute('class', 'textbox_cinzafoco');
    txtData.setAttribute('style', 'background-color:#F5F5F5');
    txtData.disabled = true;

    divData.appendChild(lblData);
    divData.appendChild(txtData);

    var divCodigo = DOM.newElement('div');
    divCodigo.setAttribute('class', 'divcontainer');
    divCodigo.setAttribute('style', 'max-width: 100px; margin-left:5px;');

    var lblCodigo = DOM.newElement('label');
    lblCodigo.innerHTML = 'Código';
    lblCodigo.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtCodigo = DOM.newElement('input');
    txtCodigo.setAttribute('type', 'text');
    txtCodigo.setAttribute('id', 'codigo');
    txtCodigo.setAttribute('class', 'textbox_cinzafoco');
    txtCodigo.setAttribute('style', 'background-color:#F5F5F5');
    txtCodigo.disabled = true;

    divCodigo.appendChild(lblCodigo);
    divCodigo.appendChild(txtCodigo);

    var divGaleria = DOM.newElement('div');
    divGaleria.setAttribute('class', 'divcontainer');
    divGaleria.setAttribute('style', 'max-width: 250px; margin-left:5px');

    var lblGaleria = DOM.newElement('label');
    lblGaleria.innerHTML = 'Galeria';
    lblGaleria.setAttribute('class', 'fonte_Roboto_texto_normal');

    var cmbGaleria = DOM.newElement('select');
    cmbGaleria.setAttribute('id', 'galeria2');
    cmbGaleria.setAttribute('class', 'combo_cinzafoco');

    divGaleria.appendChild(lblGaleria);
    divGaleria.appendChild(cmbGaleria);

    var divCliente = DOM.newElement('div');
    divCliente.setAttribute('class', 'divcontainer');
    divCliente.setAttribute('style', 'max-width: 390px; margin-left:5px');

    var lblCliente = DOM.newElement('label');
    lblCliente.innerHTML = 'Colecionador';
    lblCliente.setAttribute('class', 'fonte_Roboto_texto_normal');

    var cmbCliente = DOM.newElement('select');
    cmbCliente.setAttribute('id', 'cliente');
    cmbCliente.setAttribute('class', 'combo_cinzafoco');

    divCliente.appendChild(lblCliente);
    divCliente.appendChild(cmbCliente);

    var imgPesquisarCliente = DOM.newElement('img');
    imgPesquisarCliente.setAttribute('src', '../imagens/pesquisar.png');
    imgPesquisarCliente.setAttribute('class', 'efeito-opacidade-75-03');
    imgPesquisarCliente.setAttribute('style', 'vertical-align:middle; margin-left:10px');
    imgPesquisarCliente.setAttribute('title', 'Pesquisar clientes');
    imgPesquisarCliente.setAttribute('onclick', 'PromptPesquisarClientes();');

    var imgNovoCliente = DOM.newElement('img');
    imgNovoCliente.setAttribute('src', '../imagens/cadastro.png');
    imgNovoCliente.setAttribute('class', 'efeito-opacidade-75-03');
    imgNovoCliente.setAttribute('style', 'vertical-align:middle; margin-left:10px');
    imgNovoCliente.setAttribute('title', 'Cadastrar novo cliente');
    imgNovoCliente.setAttribute('onclick', 'PromptCadastrarClienteRapido();');

    var divValidade = DOM.newElement('div');
    divValidade.setAttribute('class', 'divcontainer');
    divValidade.setAttribute('style', 'max-width: 235px; margin-left:5px');

    var lblValidade = DOM.newElement('label');
    lblValidade.innerHTML = 'Validade';
    lblValidade.setAttribute('class', 'fonte_Roboto_texto_normal');

    var cmbValidade = DOM.newElement('select');
    cmbValidade.setAttribute('id', 'validade');
    cmbValidade.setAttribute('class', 'combo_cinzafoco');

    divValidade.appendChild(lblValidade);
    divValidade.appendChild(cmbValidade);

    var divValor = DOM.newElement('div');
    divValor.setAttribute('class', 'divcontainer');
    divValor.setAttribute('style', 'max-width: 205px; margin-left:5px;');

    var lblValor = DOM.newElement('label');
    lblValor.innerHTML = 'Valor';
    lblValor.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtValor = DOM.newElement('input');
    txtValor.setAttribute('type', 'text');
    txtValor.setAttribute('id', 'valor');
    txtValor.setAttribute('class', 'textbox_cinzafoco');

    divValor.appendChild(lblValor);
    divValor.appendChild(txtValor);

    var divFormaPagamento = DOM.newElement('div');
    divFormaPagamento.setAttribute('class', 'divcontainer');
    divFormaPagamento.setAttribute('style', 'max-width: 250px; margin-left:5px');

    var lblFormaPagamento = DOM.newElement('label');
    lblFormaPagamento.innerHTML = 'Forma Pagamento';
    lblFormaPagamento.setAttribute('class', 'fonte_Roboto_texto_normal');

    var cmbFormaPagamento = DOM.newElement('select');
    cmbFormaPagamento.setAttribute('id', 'formaPagamento');
    cmbFormaPagamento.setAttribute('class', 'combo_cinzafoco');

    divFormaPagamento.appendChild(lblFormaPagamento);
    divFormaPagamento.appendChild(cmbFormaPagamento);

    var divRecibo = DOM.newElement('div');
    divRecibo.setAttribute('class', 'divcontainer');
    divRecibo.setAttribute('style', 'max-width: 190px; margin-left:5px;');

    var lblRecibo = DOM.newElement('label');
    lblRecibo.innerHTML = 'Recibo';
    lblRecibo.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtRecibo = DOM.newElement('input');
    txtRecibo.setAttribute('type', 'text');
    txtRecibo.setAttribute('id', 'recibo');
    txtRecibo.setAttribute('class', 'textbox_cinzafoco');

    divRecibo.appendChild(lblRecibo);
    divRecibo.appendChild(txtRecibo);

    var divQtdParcelas = DOM.newElement('div');
    divQtdParcelas.setAttribute('class', 'divcontainer');
    divQtdParcelas.setAttribute('style', 'max-width: 100px; margin-left:5px;');

    var lblQtdParcelas = DOM.newElement('label');
    lblQtdParcelas.innerHTML = 'Qtde. Parcelas';
    lblQtdParcelas.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtQtdParcelas = DOM.newElement('input');
    txtQtdParcelas.setAttribute('type', 'text');
    txtQtdParcelas.setAttribute('id', 'qtdParcelas');
    txtQtdParcelas.setAttribute('class', 'textbox_cinzafoco');

    divQtdParcelas.appendChild(lblQtdParcelas);
    divQtdParcelas.appendChild(txtQtdParcelas);

    var cmdGrava = DOM.newElement('button', 'gravar');
    cmdGrava.setAttribute('class', 'botaosimplesfoco');
    cmdGrava.setAttribute('style', 'float:right; margin-right:9px; margin-top:15px;');
    cmdGrava.setAttribute('onclick', 'Gravar(' + codigo + ');');
    cmdGrava.innerHTML = "Gravar";

    var cancelar = DOM.newElement('label', 'e_lblCancelar');
    cancelar.innerHTML = 'Cancelar';
    cancelar.setAttribute('class', 'fonte_Roboto_texto_normal');
    cancelar.setAttribute('style', 'cursor:pointer; vertical-align:bottom; float:right; margin-top:20px;');
    cancelar.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');    

    divCadastro.appendChild(divData);
    divCadastro.appendChild(divCodigo);
    divCadastro.appendChild(divGaleria);
    divCadastro.appendChild(divCliente);
    divCadastro.appendChild(imgPesquisarCliente);
    divCadastro.appendChild(imgNovoCliente);
    divCadastro.appendChild(divValidade);
    divCadastro.appendChild(divValor);
    divCadastro.appendChild(divFormaPagamento);
    divCadastro.appendChild(divRecibo);
    divCadastro.appendChild(divQtdParcelas);
    divCadastro.appendChild(cancelar);
    divCadastro.appendChild(cmdGrava);

    dialogoCadastro = new caixaDialogo('divCadastro', 330, 500, '../padrao/', 130);
    dialogoCadastro.Show();

    Selector.$('data').value = Date.GetDate(false);
    Selector.$('codigo').value = GerarCodigoVale();
    
    Select.AddItem(Selector.$('validade'), 'Selecione um período de validade', 0);
    Select.AddItem(Selector.$('validade'), '15 dias (Válido até ' + SomarDias(Selector.$('data').value, 15) + ')', 15);
    Select.AddItem(Selector.$('validade'), '30 dias (Válido até ' + SomarDias(Selector.$('data').value, 30) + ')', 30);
    Select.AddItem(Selector.$('validade'), '60 dias (Válido até ' + SomarDias(Selector.$('data').value, 60) + ')', 60);
    Select.AddItem(Selector.$('validade'), '90 dias (Válido até ' + SomarDias(Selector.$('data').value, 90) + ')', 90);
    Select.AddItem(Selector.$('validade'), '6 meses (Válido até ' + SomarDias(Selector.$('data').value, 180) + ')', 180);
    Select.AddItem(Selector.$('validade'), '1 ano (Válido até ' + SomarDias(Selector.$('data').value, 365) + ')', 365);
    Mask.setMoeda(Selector.$('valor'));
    Mask.setOnlyNumbers(Selector.$('qtdParcelas'));

    CarregarGaleriasPdv(Selector.$('galeria2'), "Todas", false, Selector.$('nomeGaleria').name);
    
    if(codigo <= 0){
        getFormasPagamentos(Selector.$('formaPagamento'), 'Selecione uma forma de pagamento', true);
        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", true);
        Selector.$('validade').focus();
        Selector.$('qtdParcelas').value = '1';

    }else{
        getFormasPagamentos(Selector.$('formaPagamento'), 'Selecione uma forma de pagamento', false);
        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", false);
        
        var ajax = new Ajax('POST', 'php/cadastro-de-vales-presentes-trocas.php', false);
        var p = 'action=getValePresenteTroca';
        p+= '&idValePresenteTroca=' + codigo;
        ajax.Request(p);

        if(ajax.getResponseText() == '0'){
            return;
        }else{

            var json = JSON.parse(ajax.getResponseText());

            Selector.$('data').value = json.dataCadastro;
            Selector.$('codigo').value = json.codigo;
            Selector.$('galeria2').value = json.idGaleria;
            Selector.$('cliente').value = json.idCliente;
            Selector.$('validade').value = json.validade;
            Selector.$('valor').value = json.valor;
            Selector.$('formaPagamento').value = json.idFormaPagamento;
            Selector.$('recibo').value = json.recibo;
            Selector.$('qtdParcelas').value = json.qtdParcelas;
        }
    }
}

function Verifica() {

    if (Selector.$('cliente').selectedIndex == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione um colecionador.", "OK", "", false, "cliente");
        mensagem.Show();
        return false;
    }

    if (Selector.$('validade').selectedIndex == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione um período de validade.", "OK", "", false, "validade");
        mensagem.Show();
        return false;
    }

    if (Selector.$('valor').value.trim() == ',' || Selector.$('valor').value.trim() == '0,00'){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor preencher o valor.", "OK", "", false, "valor");
        mensagem.Show();
        return false;
    }

    if (Selector.$('formaPagamento').selectedIndex == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Selecione uma forma de pagamento.", "OK", "", false, "formaPagamento");
        mensagem.Show();
        return false;
    }

    if (Selector.$('qtdParcelas').value.trim() == '' || Selector.$('qtdParcelas').value.trim() == ''){
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor preencher a qtd de parcelas.", "OK", "", false, "qtdParcelas");
        mensagem.Show();
        return false;
    }    

    return true;
}

function Gravar(codigo) {

    if (!Verifica()) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-vales-presentes-trocas.php', false);
    var p = 'action=Gravar';
    p += '&idValePresenteTroca=' + codigo;
    p += '&dataCadastro=' + Selector.$('data').value;
    p += '&codigo=' + Selector.$('codigo').value;
    p += '&idGaleria=' + Selector.$('galeria2').value;
    p += '&idColecionador=' + Selector.$('cliente').value;
    p += '&validade=' + Selector.$('validade').value;
    p += '&valor=' + Selector.$('valor').value;
    p += '&idFormaPagamento=' + Selector.$('formaPagamento').value;
    p += '&recibo=' + Selector.$('recibo').value;
    p += '&qtdParcelas=' + Selector.$('qtdParcelas').value;

    ajax.Request(p);

    if (ajax.getResponseText() == '2') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Esse código já está cadastrado. Foi gerado um novo código.", "OK", "", false, "");
        mensagem.Show();
        Selector.$('codigo').value = GerarCodigoVale();
        return;
    }

    if (ajax.getResponseText() == '1') {
        dialogoCadastro.Close();
        Mostra();
        return;
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function ExcluirValeAux(idValePresenteTroca) {

    mensagemExcluirPedido = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este vale?", "OK", "ExcluirVale(" + idValePresenteTroca + ");", true, "");
    mensagemExcluirPedido.Show();
}

function ExcluirVale(idValePresenteTroca) {

    mensagemExcluirPedido.Close();

    var ajax = new Ajax('POST', 'php/cadastro-de-vales-presentes-trocas.php', false);
    var p = 'action=ExcluirVale';
    p += '&idValePresenteTroca=' + idValePresenteTroca;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro!", "Erro ao excluir o vale. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        Mostra();
    }
}