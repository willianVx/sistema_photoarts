checkSessao();
CheckPermissao(38, false, '', true);

var codigoAtual = 0;
var codigoVersaoAtual = 0;
var mesOrcamentoAtual = 0;
var anoOrcamentoAtual = 0;
var codOrcamentoAtual = 0;
var valorTotalOrcamentoAtual = 0;
var gerarNovaVersao = false;
var perguntaNovaVersao = false;
var tipoProdutoImagem = '';
var CodigoArtista = 0;
var CodigoObra = 0;
var alteracao = false;
var estrela = 0;
var linhaImagemInstaarts = 0;
var mensagemCancelar = false;

var arrayTamanhos = new Array();
var arrayIdTamanhos = new Array();
var arraySelecionados = new Array();
var selecionados = new Array();
var arrayEstrelas = new Array();

var MaskOrcamentos = {

    setMoedaOrcamentos: function (obj) {
        obj.style.textAlign = 'right';
        obj.maxLength = 15;
        obj.value = ',  ';
        obj.onkeypress = function (ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            // permite a propaga��o do BACKSPACE mesmo
            // quando alcan�ado o tamanho m�ximo do texto
            if (keyCode != 8)
                if (obj.value.length >= obj.maxLength)
                    return false;

            // libera as teclas BACKSPACE e TAB
            if (keyCode == 8 || keyCode == 9)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = Number.Filter(obj.value) + String.fromCharCode(keyCode);

            switch (temp.length)
            {
                case 0:
                    obj.value = ',  ';
                    break;

                case 1:
                    obj.value = ', ' + temp;
                    break;

                case 2:
                    obj.value = ',' + temp;
                    break;

                default:
                    temp = temp.substr(0, temp.length - 2) + ',' + temp.substr(temp.length - 2, temp.length - 1);
                    obj.value = temp;
                    break;
            }

            return false;
        }

        obj.onfocus = function () {
            if (Number.getFloat(this.value) == 0.0)
                this.value = ',  ';
        }

        obj.onkeydown = function (ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode != 8)
                return true;

            this.value = this.value.substr(0, this.value.length - 1);
            var temp = Number.Filter(this.value);

            switch (temp.length)
            {
                case 0:
                    this.value = ',  ';
                    break;

                case 1:
                    this.value = ', ' + temp;
                    break;

                case 2:
                    this.value = ',' + temp;
                    break;

                default:
                    temp = temp.substr(0, temp.length - 2) + ',' + temp.substr(temp.length - 2, 2);
                    this.value = temp;
                    break;
            }

            return false;
        }

        obj.onchange = function () {
            alteracao = true;
        }

        /*obj.onblur = function(){
         alteracao = true;
         }*/
    }
}

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Orçamentos</div>";
    carregarmenu();
    getDadosUsuario();
    getStatusOrcamento(Selector.$('statusBusca'), "Filtre por status", true);
    getLojas(Selector.$('statusLoja'), 'Filtre por loja', false);

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    Mask.setData(Selector.$('dataCadastro'));

    gridOrcamentos = new Table('gridOrcamentos');
    gridOrcamentos.table.setAttribute('cellpadding', '4');
    gridOrcamentos.table.setAttribute('cellspacing', '0');
    gridOrcamentos.table.setAttribute('class', 'tabela_cinza_foco');

    gridOrcamentos.addHeader([
        DOM.newText('N°'),
        DOM.newText('Data Cadastro'),
        DOM.newText('Loja'),
        DOM.newText('Cliente'),
        DOM.newText('Obras'),
        DOM.newText('Valor Total'),
        DOM.newText('Marchand'),
        DOM.newText('Status'),
        DOM.newText(''),
        DOM.newText('')
    ]);

    Selector.$('divRel').appendChild(gridOrcamentos.table);

    if (!VerificarAdmin()) {
        gridOrcamentos.hiddenCol(9);
    }

    MostrarOrcamentos();

    Mask.setData(Selector.$('dataCadastro'));
    MaskOrcamentos.setMoedaOrcamentos(Selector.$('frete'));
    MaskOrcamentos.setMoedaOrcamentos(Selector.$('acrescimo'));
    MaskOrcamentos.setMoedaOrcamentos(Selector.$('percDesconto'));
    MaskOrcamentos.setMoedaOrcamentos(Selector.$('valorDesconto'));
    Mask.setOnlyNumbers(Selector.$('qtdeParcelas'));

    gridObras2 = new Table('gridObras2');
    gridObras2.table.setAttribute('cellpadding', '4');
    gridObras2.table.setAttribute('cellspacing', '0');
    gridObras2.table.setAttribute('class', 'tabela_cinza_foco');

    /*gridObras.addHeader([
     DOM.newText('Nº'),
     DOM.newText('Img'),
     DOM.newText('Tipo'),
     DOM.newText('Artista'),
     DOM.newText('Obra'),
     DOM.newText('Tamanho'),
     DOM.newText('Acabamento'),
     DOM.newText('Valor Unitário'),
     DOM.newText('Qtd'),
     DOM.newText('Total'),
     DOM.newText('Obs.'),
     DOM.newText(''),
     DOM.newText(''),
     DOM.newText('idTipo'),
     DOM.newText('idObra'),
     DOM.newText('idArtista'),
     DOM.newText('idTamanho'),
     DOM.newText('idAcabamento'),
     DOM.newText('altura'),
     DOM.newText('largura'),
     DOM.newText('qtd'),
     DOM.newText('percentualDesconto'),
     DOM.newText('valorDesconto'),
     DOM.newText('valorAcrescimo'),
     DOM.newText('valorUnitario'),
     DOM.newText('tiragemMaxima'),
     DOM.newText('tiragemAtual'),
     DOM.newText('estrelas'),
     DOM.newText('imagemObra'),
     DOM.newText('peso'),
     DOM.newText('idGrupoMoldura'),
     DOM.newText('idMoldura')
     ]);*/

    gridObras2.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Nome'),
        DOM.newText('Acabamento'),
        DOM.newText('Tamanhos'),
        DOM.newText('idsTamanhos'),
        DOM.newText('alturas'),
        DOM.newText('larguras'),
        DOM.newText('valores'),
        DOM.newText('selecionados'),
        DOM.newText('idOrcamentoComp'),
        DOM.newText(''),
        DOM.newText('idArtista'),
        DOM.newText('idAcabamento'),
        DOM.newText('idGrupoMoldura'),
        DOM.newText('idMoldura'),
        DOM.newText('idTipoProduto'),
        DOM.newText('estrelas'),
        DOM.newText('qtd vendido'),
        DOM.newText('pesos')
    ]);

    gridObras2.hiddenCol(6);
    gridObras2.hiddenCol(7);
    gridObras2.hiddenCol(8);
    gridObras2.hiddenCol(9);
    gridObras2.hiddenCol(10);
    gridObras2.hiddenCol(11);
    //gridObras2.hiddenCol(12);
    gridObras2.hiddenCol(13);
    gridObras2.hiddenCol(14);
    gridObras2.hiddenCol(15);
    gridObras2.hiddenCol(16);
    gridObras2.hiddenCol(17);
    gridObras2.hiddenCol(18);
    gridObras2.hiddenCol(19);
    gridObras2.hiddenCol(20);

    Selector.$('divObras2').appendChild(gridObras2.table);

    /*gridObras.hiddenCol(13);
     gridObras.hiddenCol(14);
     gridObras.hiddenCol(15);
     gridObras.hiddenCol(16);
     gridObras.hiddenCol(17);
     gridObras.hiddenCol(18);
     gridObras.hiddenCol(19);
     gridObras.hiddenCol(20);
     gridObras.hiddenCol(21);
     gridObras.hiddenCol(22);
     gridObras.hiddenCol(23);
     gridObras.hiddenCol(24);
     gridObras.hiddenCol(25);
     gridObras.hiddenCol(26);
     gridObras.hiddenCol(27);
     gridObras.hiddenCol(28);
     gridObras.hiddenCol(29);
     gridObras.hiddenCol(30);
     gridObras.hiddenCol(31);*/

    //FOLLOW-UP
    var tabelaFollow = Selector.$('tabelaFollow');

    gridFollow = new Table('gridProposta');
    gridFollow.table.setAttribute('class', 'tabela_cinza_foco');
    gridFollow.table.setAttribute('cellpadding', '5');
    gridFollow.table.setAttribute('cellspacing', '0');

    gridFollow.addHeader([
        DOM.newText('Data'),
        DOM.newText('Tipo'),
        DOM.newText('Obs'),
        DOM.newText('Responsável'),
        DOM.newText('Retorno'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);

    tabelaFollow.appendChild(gridFollow.table);

    var c = Window.getParameter('idOrcamento');
    Select.AddItem(Selector.$('enderecos'), 'Selecione um cliente para carregar os endereços', 0);

    if (c == null || c == '') {
        
        getLojas(Selector.$('loja'), 'Selecione uma loja', true);
        getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", true);


        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", (Window.getParameter('idcliente') != null ? false : true));

        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
        Selector.$('loja').setAttribute('onclick', 'CarregaMarchands(true)');

        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", true);
        getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pgto", true);

        //corrige erros de layout 
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

    } else {
        getLojas(Selector.$('loja'), 'Selecione uma loja', false);
        getMarchands(Selector.$('statusvendedores'), "Selecione um Marchand", false);

        getClientesPremium(Selector.$('cliente'), "Selecione um colecionador", (Window.getParameter('idcliente') != null ? false : true));

        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
        Selector.$('loja').setAttribute('onclick', 'CarregaMarchands(true)');

        getTiposTransportes(Selector.$('tipoTransporte'), "Selecione um tipo de entrega", false);
        getFormasPagamentos(Selector.$('formaPagamento'), "Selecione uma forma de pgto", false);

        //corrige erros de layout 
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

        Mostra(c, true);
    }

    if (Window.getParameter('idcliente') != null) {
        Novo(true);
        Selector.$('cliente').value = Window.getParameter('idcliente');
        LoadDadosCliente();
        getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
        Select.Clear(Selector.$('vendedor'));
        Select.AddItem(Selector.$('vendedor'), 'Selecione uma loja para carregar', 0);
    }
};

window.onresize = function () {
    if (Selector.$('divRel').clientHeight != 0) {
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";
    }
};

function AjustarDivs() {

    if (Selector.$('divRel').clientHeight == "0") {
        Selector.$('divContainer').style.maxWidth = '100%';
        Selector.$('divRel').setAttribute('style', 'min-height:250px; background-color:#FFF; height:650px; width:100%; overflow:auto;');
        Selector.$('divCadastro2').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'inline-block';
        Selector.$('statusBusca').style.display = 'inline-block';
        Selector.$('statusvendedores').style.display = 'inline-block';
        Selector.$('statusLoja').style.display = 'inline-block';
        Selector.$('divDatas').style.display = 'inline-block';
        Selector.$('divTodos').style.display = 'none';
        Selector.$('divQtdRegistros').style.display = 'inline-block';
        Selector.$('divRel').style.height = (document.documentElement.clientHeight - 160) + "px";

        Selector.$('btPesquisarCad').style.display = 'inline-block';

    } else {
        Selector.$('divContainer').style.maxWidth = '1350px';
        Selector.$('divCadastro2').setAttribute('style', 'height:625px; width:100%; overflow:hidden;');
        Selector.$('divRel').setAttribute('style', 'height:0px; overflow:hidden;');
        Selector.$('busca').style.display = 'none';
        Selector.$('statusBusca').style.display = 'none';
        Selector.$('statusvendedores').style.display = 'none';
        Selector.$('statusLoja').style.display = 'none';
        Selector.$('divDatas').style.display = 'none';
        Selector.$('divTodos').style.display = 'none';
        Selector.$('divQtdRegistros').style.display = 'none';

        Selector.$('btPesquisarCad').style.display = 'none';
    }
}

function MostrarOrcamentos() {

    gridOrcamentos.clearRows();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=MostrarOrcamentos';
    p += '&busca=' + Selector.$('busca').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&loja=' + Selector.$('statusLoja').value;
    p += '&vendedor=' + Selector.$('statusvendedores').value;
    p += '&limitar=' + (Selector.$('mostrarTodosRegistros').checked ? 0 : 1);

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        var ver;
        var obras;
        var cor;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Orçamento');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'Mostra(' + json[i].idOrcamento + ', true)');

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir Orçamento');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirOrcamentoAux(' + gridOrcamentos.getRowCount() + ')');

            gridOrcamentos.addRow([
                DOM.newText(json[i].numeroOrcamento),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].marchand),
                DOM.newText(json[i].descricaoStatus),
                ver,
                excluir
            ]);

            gridOrcamentos.setRowData(gridOrcamentos.getRowCount() - 1, json[i].idOrcamento);
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; width:200px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;max-width:380px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; ');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; width:90px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 6).setAttribute('style', 'text-align:left; width:120px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:100px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:40px;');
            gridOrcamentos.getCell(gridOrcamentos.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:40px;');

            if (cor) {
                cor = false;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridOrcamentos.setRowBackgroundColor(gridOrcamentos.getRowCount() - 1, "#FFF");
            }
        }

        if (!VerificarAdmin()) {
            gridOrcamentos.hiddenCol(9);
        }

        Selector.$('lblRegistros').innerHTML = (Selector.$('mostrarTodosRegistros').checked ? (json.length == 1 ? json.length + ' registro' : json.length + ' registros') : '20 últimos registros');
    }

    ajax.Request(p);
}

function ExcluirOrcamentoAux(linha) {

    if (!CheckPermissao(41, true, 'Você não possui permissão para excluir um orçamento', false)) {
        return;
    }

    mensagemExcluirOrcamento = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir este orçamento?", "OK", "ExcluirOrcamento(" + linha + ");", true, "");
    mensagemExcluirOrcamento.Show();
}

function ExcluirOrcamento(linha) {

    mensagemExcluirOrcamento.Close();

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=ExcluirOrcamento';
    p += '&idOrcamento=' + gridOrcamentos.getRowData(linha);
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro!", "Erro ao excluir o orçamento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        gridOrcamentos.deleteRow(linha);

        for (var i = 0; i < gridOrcamentos.getRowCount(); i++) {

            gridOrcamentos.getCellObject(i, 9).setAttribute('onclick', 'ExcluirOrcamentoAux(' + i + ')');
        }
    }
}

function Novo(ajustar) {

    if (codigoAtual <= 0) {
        if (!CheckPermissao(39, true, 'Você não possui permissão para cadastrar uma nova proposta', false)) {
            return;
        }
    }

    if (ajustar) {
        codigoAtual = 0;
        AjustarDivs();
    }

    SelecionaAbas(0);
    Limpar();
    Selector.$('dataCadastro').value = Date.GetDate(false);
    Selector.$('situacao').value = 'Novo orçamento';
    Selector.$('loja').focus();
    Selector.$('botNovo').setAttribute('src', 'imagens/validar.png');
    Selector.$('botNovo').setAttribute('title', 'Gravar');
    Selector.$('btNovo').setAttribute('onclick', 'Gravar();');
    Selector.$('botSair').setAttribute('src', 'imagens/cancelar.png');
    Selector.$('botSair').setAttribute('title', 'Cancelar');
}

function CancelarAux() {

    if (alteracao && codigoAtual > 0) {
        criaDiv('divMensagemCancelar');
        //mensagemCancelarAlteracoesOrcamento = new DialogoMensagens("prompt", 130, 400, 150, "4", "Alerta!", "Foram feitas alterações no orçamento, deseja cancelar essas alterações?", "SIM", "Cancelar(); mensagemCancelarAlteracoesOrcamento.Close();", true, "");
        mensagemCancelarAlteracoesOrcamento = new DialogoMensagens("divMensagemCancelar", 130, 400, 150, "4", "Alerta!", "Foram feitas alterações no orçamento, deseja cancelar ou salvar essas alterações?", "SALVAR", "Gravar(); mensagemCancelarAlteracoesOrcamento.Close();", true, "");
        mensagemCancelarAlteracoesOrcamento.Show();
        Selector.$('btcancelar').innerHTML = 'CANCELAR';
        mensagemCancelar = true;
    } else {
        Cancelar();
    }
}

function Cancelar() {

    AjustarDivs();
    Limpar();
    Selector.$('botNovo').setAttribute('src', 'imagens/novo.png');
    Selector.$('botNovo').setAttribute('title', 'Novo');
    Selector.$('btNovo').setAttribute('onclick', 'Novo(true);');
    Selector.$('botSair').setAttribute('src', 'imagens/sair3.png');
    Selector.$('botSair').setAttribute('title', 'Sair');
    
    //MostrarOrcamentos();
}

function Sair() {

    if (Selector.$('botNovo').title == 'Novo') {
        window.location = 'principal.html';
    } else {
        if(codigoAtual <= 0){
            Cancelar();
        }else{
            CancelarAux();
        }
    }
}

function CarregaMarchands(ascinc) {
    if (Selector.$('loja').value != Selector.$('loja').name) {
        Selector.$('loja').name = Selector.$('loja').value;
        getVendedores(Selector.$('vendedor'), "Selecione um marchand", ascinc, 'MARCHANDS', Selector.$('loja').value);
    } else {
        return;
    }
}

function SelecionaAbas(aba) {

    for (var i = 0; i <= 1; i++) {
        Selector.$('aba' + i).setAttribute('class', 'divabas2');
        Selector.$('div' + i).setAttribute('style', 'margin-top:0px; border:none; height:0px; padding:0px; border-top:0px solid;  overflow:hidden');
    }

    Selector.$('aba' + aba).setAttribute('class', 'divabas');//JAIRO MEXER AQUI
    Selector.$('div' + aba).setAttribute('style', 'margin-top:0px; background:#FFF; min-height:600px; overflow:hidden');
}

function botDel_onClick() {

    if (codigoAtual <= 0) {
        MostrarMsg('Nenhum orçamento ativa', '');
        return;
    }

    //FAZER CANCELAMENTO DE PROPOSTA
}

function Limpar() {

    codigoAtual = 0;
    alteracao = false;

    Selector.$('codProposta').innerHTML = '- - -';
    Selector.$('validade').innerHTML = '';
    Selector.$('dataCadastro').value = "";
    Selector.$('loja').selectedIndex = 0;
    Selector.$('cliente').selectedIndex = 0;
    Selector.$('cliente').name = '';
    Selector.$('enderecos').selectedIndex = 0;
    Selector.$('situacao').value = "";
    Selector.$('vendedor').selectedIndex = 0;

    Selector.$('contato').value = "";
    Selector.$('telefone').value = "";
    Selector.$('email').value = "";
    Selector.$('tipoTransporte').selectedIndex = 0;
    Selector.$('divValorFrete').style.display = 'none';

    Selector.$('valor').value = "";
    Selector.$('frete').value = "";
    Selector.$('acrescimo').value = "";
    Selector.$('percDesconto').value = "";
    Selector.$('valorDesconto').value = "";
    Selector.$('valorTotal').value = "";

    Selector.$('obs').value = "";

    Selector.$('formaPagamento').selectedIndex = 0;
    Selector.$('qtdeParcelas').value = '';
    Selector.$('detalhesPagamento').value = '';

    gridObras2.clearRows();
    gridFollow.clearRows();
}

function VerificaCampos() {

    var data_cadastro = Selector.$('dataCadastro');
    if (data_cadastro.value == '') {
        MostrarMsg("Por favor, preencha a data de cadastro", 'dataCadastro');
        SelecionaAbas(0);
        return false;
    }

    var loja = Selector.$('loja');
    if (loja.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione a loja", 'loja');
        SelecionaAbas(0);
        return false;
    }

    var cliente = Selector.$('cliente');
    if (cliente.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um colecionador", 'cliente');
        SelecionaAbas(0);
        return false;
    }

    var vendedor = Selector.$('vendedor');
    if (vendedor.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um marchand", 'vendedor');
        SelecionaAbas(0);
        return false;
    }

    var tipoTransporte = Selector.$('tipoTransporte');
    if (tipoTransporte.selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um tipo de entrega", 'tipoTransporte');
        SelecionaAbas(0);
        return false;
    }

    return true;
}

function Gravar() {

    if (!CheckPermissao(39, true, 'Você não possui permissão para editar uma proposta', false)) {
        return;
    }

    if (!VerificaCampos()) {
        return false;
    }

    if (!checkLogarNovamente()) {
        return false;
    }

    if (mensagemCancelar) {
        mensagemCancelarAlteracoesOrcamento.Close();
    }

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigoAtual;
    p += '&dataCadastro=' + Selector.$('dataCadastro').value;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&idCliente=' + Selector.$('cliente').value;
    p += '&idClienteEndereco=' + Selector.$('enderecos').value;
    p += '&idVendedor=' + Selector.$('vendedor').value;
    p += '&contatoCliente=' + Selector.$('contato').value;
    p += '&telefoneCliente=' + Selector.$('telefone').value;
    p += '&emailCliente=' + Selector.$('email').value;
    p += '&idTipoTransporte=' + Selector.$('tipoTransporte').value;

    //ARRAY COM OBRAS
    /*p += '&idsOrcamentosObras=' + gridObras.getRowsData();
     p += '&observacoes=' + gridObras.getContentRows(10);
     p += '&idsTiposObras=' + gridObras.getContentRows(13);
     p += '&idsObras=' + gridObras.getContentRows(14);
     p += '&idsArtistas=' + gridObras.getContentRows(15);
     p += '&idsTamanhos=' + gridObras.getContentRows(16);
     p += '&idsAcabamentos=' + gridObras.getContentRows(17);
     p += '&totaisObras=' + gridObras.getContentMoneyRows(9);
     p += '&alturas=' + gridObras.getContentMoneyRows(18);
     p += '&larguras=' + gridObras.getContentMoneyRows(19);
     p += '&qtds=' + gridObras.getContentMoneyRows(20);
     p += '&percentuaisDescontos=' + gridObras.getContentMoneyRows(21);
     p += '&valoresDescontos=' + gridObras.getContentMoneyRows(22);
     p += '&valoresAcrescimos=' + gridObras.getContentMoneyRows(23);
     p += '&valoresUnitarios=' + gridObras.getContentMoneyRows(24);
     p += '&tiragens=' + gridObras.getContentRows(25);
     p += '&qtdsVendidos=' + gridObras.getContentRows(26);
     p += '&estrelas=' + gridObras.getContentRows(27);
     p += '&imagens=' + gridObras.getContentRows(28);
     p += '&pesos=' + gridObras.getContentMoneyRows(29);
     p += '&idsGruposMolduras=' + gridObras.getContentRows(30);
     p += '&idsMolduras=' + gridObras.getContentRows(31);*/
    //p += '&idsOrcamentosObras=' + gridObras2.getRowsData();
    p += '&idOrcamentoComp=' + gridObras2.getContentObjectId(11);
    p += '&imagens=' + gridObras2.getContentObjectNameRows(1);
    p += '&idsObras=' + gridObras2.getContentObjectId(1);
    p += '&idsTamanhos=' + gridObras2.getContentObjectId(6);
    p += '&alturas=' + gridObras2.getContentObjectId(7);
    p += '&larguras=' + gridObras2.getContentObjectId(8);
    p += '&valoresUnitarios=' + gridObras2.getContentObjectId(9);
    p += '&selecionados=' + gridObras2.getContentObjectId(10);
    p += '&idsArtistas=' + gridObras2.getContentRows(13);
    p += '&idsAcabamentos=' + gridObras2.getContentRows(14);
    p += '&idsGruposMolduras=' + gridObras2.getContentRows(15);
    p += '&idsMolduras=' + gridObras2.getContentRows(16);
    p += '&idsTiposObras=' + gridObras2.getContentRows(17);
    p += '&estrelas=' + gridObras2.getContentObjectId(18);
    p += '&qtdsVendidos=' + gridObras2.getContentObjectId(19);
    p += '&pesos=' + gridObras2.getContentObjectId(20);
    p += '&qtds=' + gridObras2.getContentObjectId(5);

    p += '&dataContrato=' + dataContrato;
    p += '&periodoDias=' + periodoDiasContrato;
    p += '&numeroContrato=' + numeroContrato;
    p += '&devolvido=' + devolvido;
    p += '&comissaoContrato=' + comissaoContrato;
    p += '&obsContrato=' + obsContrato;

    p += '&valor=' + Selector.$('valor').value;
    p += '&valorFrete=' + Selector.$('frete').value;
    p += '&valorAcrescimo=' + Selector.$('acrescimo').value;
    p += '&percentualDesconto=' + Selector.$('percDesconto').value;
    p += '&valorTotalDesconto=' + Selector.$('valorDesconto').value;
    p += '&valorTotalOrcamento=' + Selector.$('valorTotal').value;
    p += '&obs=' + Selector.$('obs').value;

    p += '&idFormaPagamento=' + Selector.$('formaPagamento').value;
    p += '&qtdeParcelas=' + (Selector.$('qtdeParcelas').value.trim() == '' ? '0' : Selector.$('qtdeParcelas').value);

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        MostrarMsg('Problemas ao gravar o orçamento. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
        return false;
    } else {
        var json = JSON.parse(ajax.getResponseText());

        if (json.status == 'OK') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Aviso", "Cadastro salvo com sucesso", "OK", "", false, "");
            mensagem.Show();
            MostrarOrcamentos();
            codigoAtual = json.idOrcamento;
            alteracao = false;
            Mostra(codigoAtual, false);
            return true;
        } else {
            var msg = 'Problemas ao gravar o orçamento. Tente novamente, caso o erro persista, entre em contato com o suporte técnico. <br /><br />ERRO: ' + json.status;

            var mensagem = new DialogoMensagens("prompt", 180, 410, 150, "1", "Atenção!", msg, "OK", "", false, '');
            mensagem.Show();
            return false;
        }
    }
}

function Mostra(Codigo, ajustar) {

    if (!CheckPermissao(166, true, 'Você não possui permissão para visualizar detalhes sobre o orçamento', false)) {
        return;
    }


    if (Codigo == '' || parseInt(Codigo) == 0) {
        return;
    }

    codigoAtual = Codigo;

    Novo(ajustar);
    Limpar();

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Codigo;

    ajax.Request(p);

    if (ajax.getResponseText() == 0) {
        MostrarMsg('Orçamento não localizado', 'codigo');
        return;
    }
    
    var json = JSON.parse(ajax.getResponseText());
    
    codigoAtual = json.idOrcamento;
    Selector.$('botCancelarOrcamento').setAttribute('onclick', 'CancelarOrcamentoAux(' + json.idOrcamento + ');');
    Selector.$('botGerarPedido').setAttribute('onclick', 'GerarPedidoAux(' + json.idOrcamento + ');');
    Selector.$('botImprimirOrcamento').setAttribute('onclick', 'ImprimirOrcamento(' + json.idOrcamento + ');');
    Selector.$('botGerarPdfOrcamento').setAttribute('onclick', 'GerarPdfOrcamento();');
    Selector.$('botEnviarOrcamentoEmail').setAttribute('onclick', 'EnviarPdfOrcamentoEmailAux();');

    Selector.$('codProposta').innerHTML = json.proposta;
    Selector.$('dataCadastro').value = json.dataCadastro;
    Selector.$('validade').innerHTML = json.validade;
    Selector.$('validade').setAttribute('name', json.dataValidade);
    Select.Show(Selector.$('loja'), json.idLoja);
    CarregaMarchands(false);

    Selector.$('situacao').setAttribute('name', json.idSituacao);
    Selector.$('situacao').value = json.situacao;

    Select.Show(Selector.$('cliente'), json.idCliente);
    getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
    Select.Show(Selector.$('enderecos'), json.idClienteEndereco);
    Select.Show(Selector.$('vendedor'), json.idVendedor);
    getComissaoMarchand();

    tipoArquiteto = json.arquiteto;

    if (tipoArquiteto == "1") {
        Selector.$('contratoArquiteto').style.display = "inline-block";
    }

    dataContrato = json.dataContrato;
    periodoDiasContrato = json.periodoDiasContrato;
    numeroContrato = json.numeroContrato;
    obsContrato = json.obsContrato;
    devolvido = json.devolvido;
    comissaoContrato = json.comissaoContrato;

    Selector.$('contato').value = json.contato;
    Selector.$('telefone').value = json.telefone;
    Selector.$('email').value = json.email;
    Select.Show(Selector.$('tipoTransporte'), json.idTransporteTipo);
    VerificarFrete();

    Selector.$('valor').value = json.valor;
    Selector.$('frete').value = json.valorFrete;
    Selector.$('acrescimo').value = json.valorAcrescimo;
    Selector.$('percDesconto').value = json.percDesconto;
    Selector.$('valorDesconto').value = json.valorDesconto;
    Selector.$('valorTotal').value = json.valorTotal;
    Selector.$('obs').value = json.obs;

    Select.Show(Selector.$('formaPagamento'), json.idFormaPagamento);
    Selector.$('qtdeParcelas').value = json.qtdeParcelas;
    CalculaPagamento(false, false, false);

    //MostraObras(json.arrayObras);
    MostrarObrasSalvas();
    getFollow();

    if (!CheckPermissao(40, false, '', false)) {
        Selector.$('divValores').style.display = 'none';
        gridObras.hiddenCol(7);
    }
}

function ImprimirOrcamento(idOrcamento) {

    if (!CheckPermissao(44, true, 'Você não possui permissão para imprimir orçamento', false)) {
        return;
    }

    if (idOrcamento <= 0)
        return;

    var div = Selector.$("prompt");
    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:block');

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblast1 = DOM.newElement('label');
    lblast1.innerHTML = "* ";
    lblast1.setAttribute("style", "float:right; color:red;");

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

    var lblTitulo = DOM.newElement('label');
    lblTitulo.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblTitulo.appendChild(DOM.newText('Opções de impressão:'));

    var lblDireita = DOM.newElement('label');
    lblDireita.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblDireita.appendChild(DOM.newText('Imagem a direita/Texto a esquerda.'));

    var lblEsquerda = DOM.newElement('label');
    lblEsquerda.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblEsquerda.appendChild(DOM.newText('Imagem a esquerda/Texto a direita.'));

    var radioTipo1 = DOM.newElement('radio');
    radioTipo1.setAttribute('id', 'opcao1');
    radioTipo1.setAttribute('name', 'opcaoTextoImagem');
    radioTipo1.setAttribute('value', 'primeira');

    var radioTipo2 = DOM.newElement('radio');
    radioTipo2.setAttribute('id', 'opcao2');
    radioTipo2.setAttribute('name', 'opcaoTextoImagem');
    radioTipo2.setAttribute('checked', 'checked');

    var lblValores = DOM.newElement('label');
    lblValores.appendChild(DOM.newText('Deseja imprimir o orçamento com valor total?'));

    var chck = DOM.newElement('checkbox');
    chck.setAttribute('id', 'chckValores');
    chck.setAttribute('checked', 'checked');

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'btGerarPdf');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', 'ImprimirAux(' + idOrcamento + ')');
    elemento.innerHTML = "Gerar";

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);

    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(radioTipo2);
    divform.appendChild(lblast2);
    divform.appendChild(lblEsquerda);
    divform.innerHTML += '<br>';

    divform.appendChild(radioTipo1);
    divform.appendChild(lblast2);
    divform.appendChild(lblDireita);

    divform.innerHTML += '<br><br>';
    divform.appendChild(chck);
    divform.appendChild(lblValores);

    divform.innerHTML += '<br><br>';
    divform.appendChild(elemento);

    dialogo = new caixaDialogo('prompt', 210, 550, 'padrao/', 111);
    dialogo.Show();
    // window.open('impressao-orcamento.html?codigo=' + idOrcamento, 'printOrc');
}

function ImprimirAux(idOrcamento) {

    dialogo.Close();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    //var p = 'action=GerarPdfOrcamentoImg';
    var p = 'action=GerarPdfOrcamento2';
    p += '&idOrcamento=' + idOrcamento;
    p += '&opcaoTexto=' + (Selector.$('opcao1').checked == true ? '1' : '2');
    p += '&opcaoValores=' + (Selector.$('chckValores').checked == true ? '1' : '2');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        //dialogoCarregando.Close();
        Selector.$('btGerarPdf').innerHTML = 'Gerar';
        Selector.$('imgImprimir').setAttribute('src', 'imagens/relatorio.png');

        if (ajax.getResponseText() != '0') {
            window.open(ajax.getResponseText());
        }
    }

    //tabela.setAttribute('style', 'overflow:auto; background-image:url(imagens/loading.gif); background-repeat:no-repeat; background-position: center;');
    //Selector.$('imgImprimir').setAttribute('src', 'imagens/grid_carregando.gif');

    /*if(!isElement('div', 'divmensagem')){
     var div = DOM.newElement('div', 'divmensagem');
     div.setAttribute('style', 'display:inline-block; opacity:0.5; vertical-align:middle; width:100%;');
     document.body.appendChild(div);
     }*/

    //var div = Selector.$('divmensagem');
    //var div = DOM.newElement('div','divmensagem');
    //document.body.appendChild(div);
    //div.setAttribute('style', 'display:inline-block; opacity:0.5; vertical-align:middle; width:100%;');

    /*elemento = DOM.newElement('img');
     elemento.setAttribute('src', 'imagens/loading.gif');
     
     div.appendChild(elemento);
     dialogoCarregando = new caixaDialogo('divmensagem',200, 200, 'padrao/', 111);
     dialogoCarregando.Show();*/

    Selector.$('btGerarPdf').innerHTML = 'Gerando...';
    ajax.Request(p);
}

function CancelarOrcamentoAux(idOrcamento) {

    if (!CheckPermissao(43, true, 'Você não possui permissão para cancelar um orçamento', false)) {
        return;
    }

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('O orçamento já encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        MostrarMsg('O orçamento já virou pedido, não é possível cancelar', '');
        return;
    }

    mensagemCancelarOrcamento = new DialogoMensagens("prompt", 120, 400, 150, "4", "Alerta!", "Deseja realmente cancelar o orçamento n° " + Selector.$('codProposta').innerHTML + "?", "SIM", "CancelarOrcamento(" + idOrcamento + ")", true, "");
    mensagemCancelarOrcamento.Show();
}

function CancelarOrcamento(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('O orçamento já encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        MostrarMsg('O orçamento já virou pedido, não é possível cancelar', '');
        return;
    }

    mensagemCancelarOrcamento.Close();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=CancelarOrcamento';
    p += '&idOrcamento=' + idOrcamento;

    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == 1) {
            MostrarMsg('Orçamento cancelado com sucesso', '');
            Mostra(idOrcamento, false);
            MostrarOrcamentos();
        } else {
            MostrarMsg('Problemas ao cancelar o orçamento. Tente novamente, caso o erro persista contate o suporte técnico', '');
        }

        Selector.$('imgCancelar').src = 'imagens/cancelar.png';
    };

    Selector.$('imgCancelar').src = 'imagens/loading.gif';
    ajax.Request(p);
}

function GerarPedidoAux(idOrcamento) {

    if (!CheckPermissao(42, true, 'Você não possui permissão para gerar pedido através do orçamento', false)) {
        return;
    }

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('Não é possível gerar pedido, o orçamento encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        var mensagem = new DialogoMensagens("prompt", 195, 350, 150, "2", "Atenção!", 'O orçamento já virou pedido.<br /><br />' + Selector.$('situacao').value + '<br /><br /><a href="pedidos.html?idOrcamento=' + idOrcamento + '&source=abrir">Abrir Pedido</a>', "OK", "", false, '');
        mensagem.Show();
        return;
    }

    mensagemGerarPedido = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja gerar venda a partir do orçamento nº " + Selector.$('codProposta').innerHTML + "?", "OK", "GerarPedido(" + idOrcamento + ");", true, "");
    mensagemGerarPedido.Show();
}

function GerarPedido(idOrcamento) {

    if (idOrcamento <= 0)
        return;

    if (Selector.$('situacao').name.toString() == '4') {
        MostrarMsg('Não é possível gerar pedido, o orçamento encontra-se cancelado', '');
        return;
    }

    if (Selector.$('situacao').name.toString() == '3') {
        var mensagem = new DialogoMensagens("prompt", 195, 350, 150, "2", "Atenção!", 'O orçamento já virou pedido.<br /><br />' + Selector.$('situacao').value + '<br /><br /><a href="pedidos.html?idOrcamento=' + idOrcamento + '&source=abrir">Abrir Pedido</a>', "OK", "", false, '');
        mensagem.Show();
        return;
    }

    mensagemGerarPedido.Close();

    window.location = 'pedidos.html?idOrcamento=' + idOrcamento + '&source=gerar';
}

function MostraObras(array) {

    gridObras.clearRows();

    if (array == '0')
        return;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        var divEditarDuplicar = DOM.newElement('div');

        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px; display:inline-block');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var duplicar = DOM.newElement('img');
        duplicar.setAttribute('src', 'imagens/duplicate.png');
        duplicar.setAttribute('title', 'Duplicar Obra');
        duplicar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
        duplicar.setAttribute('class', 'efeito-opacidade-75-04');
        duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

        divEditarDuplicar.appendChild(editar);
        divEditarDuplicar.appendChild(duplicar);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        var imgelemento = DOM.newElement('img');
        imgelemento.setAttribute('id', 'o_imagem2' + i);
        imgelemento.setAttribute('src', 'imagens/semarte.png');
        imgelemento.setAttribute('class', 'textbox_cinzafoco');
        imgelemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:30px; cursor:pointer;');
        imgelemento.setAttribute("name", '');
        // imgelemento.setAttribute("onclick", "verimagem('" + i + "','" + json[i].altura + "','" + json[i].largura + "');");

        var pasta = 'obras';

        gridObras.addRow([
            DOM.newText(gridObras.getRowCount() + 1),
            imgelemento,
            DOM.newText(json[i].nomeTipo),
            DOM.newText(json[i].nomeArtista),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == 3 ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipo == '3' ? json[i].nomeProduto : json[i].nomeAcabamento + (json[i].moldura != '' ? ' - Mold.: ' + json[i].moldura : ''))),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].valorTotal),
            DOM.newText(json[i].obs),
            divEditarDuplicar,
            excluir,
            //OCULTOS
            DOM.newText(json[i].idTipo),
            DOM.newText(json[i].idObra),
            DOM.newText(json[i].idArtista),
            DOM.newText(json[i].idTamanho),
            DOM.newText((json[i].idTipo == '3' ? json[i].idProduto : json[i].idAcabamento)),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].percentualDesconto),
            DOM.newText(json[i].valorDesconto),
            DOM.newText(json[i].valorAcrescimo),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].tiragem),
            DOM.newText(json[i].qtdVendido),
            DOM.newText(json[i].estrelas),
            DOM.newText(json[i].imagem),
            DOM.newText(json[i].peso),
            DOM.newText(json[i].idMolduraGrupo),
            DOM.newText(json[i].idMoldura)
        ]);

        gridObras.setRowData(gridObras.getRowCount() - 1, json[i].idOrcamentoComp);
        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:20px');
        gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:right; width:100px;');
        gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:right;');
        gridObras.getCell(gridObras.getRowCount() - 1, 10).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:50px;');
        gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#FFF");
        }

        if (gridObras.getCellText(i, 28) == '' || gridObras.getCellText(i, 28).split('/')[gridObras.getCellText(i, 28).split('/').length - 1] == 'semarte.png') {
            Selector.$('o_imagem2').src = 'imagens/semarte.png';
        } else {
            Selector.$('o_imagem2' + i).name = gridObras.getCellText(i, 28);
            Selector.$('o_imagem2' + i).src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(i, 28);
            Selector.$('o_imagem2' + i).title = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(i, 28);
            Selector.$('o_imagem2' + i).setAttribute('style', 'cursor:pointer; title="Ver Imagem"; width:60px; height:60px; ');
            // Selector.$('o_imagem2' + i).setAttribute("onclick", "verimagem('" + i + "','" + json[i].altura + "','" + json[i].largura + "');");
            //imgelemento.setAttribute("onclick", "MostraImagemTamanhoReal('imagens/obras/" + Selector.$('o_imagem2' + i).getAttribute('name') + "');");
            Selector.$('o_imagem2' + i).setAttribute("onclick", "MostraImagemTamanhoReal('imagens/obras/" + gridObras.getCellText(i, 28) + "');");
        }
    }

    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);
    gridObras.hiddenCol(19);
    gridObras.hiddenCol(20);
    gridObras.hiddenCol(21);
    gridObras.hiddenCol(22);
    gridObras.hiddenCol(23);
    gridObras.hiddenCol(24);
    gridObras.hiddenCol(25);
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);
    gridObras.hiddenCol(31);
}

function verimagem(linha, altura, largura) {

    Naltura = altura.split(',');
    Nlargura = largura.split(',');

    if (!isElement('div', 'divI')) {
        var divI = DOM.newElement('div', 'divI');
        document.body.appendChild(divI);
    }

    var divaux = Selector.$('divI');

    Selector.$('divI').innerHTML = '';
    var divImg2 = DOM.newElement('div');
    divImg2.setAttribute('style', 'text-align:center');

    var elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem3');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px;');
    elemento.setAttribute("name", '');
    divImg2.appendChild(elemento);
    divaux.appendChild(divImg2);
    divaux.innerHTML += '<br />';
    var pasta = 'obras';
    if (gridObras.getCellText(linha, 28) == '' || gridObras.getCellText(linha, 28).split('/')[gridObras.getCellText(linha, 28).split('/').length - 1] == 'semarte.png') {
        Selector.$('o_imagem3').src = 'imagens/semarte.png';
    } else {

        Selector.$('o_imagem3').name = gridObras.getCellText(linha, 28);
        Selector.$('o_imagem3').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(linha, 28);
        Selector.$('o_imagem3').title = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(linha, 28);
        Selector.$('o_imagem3').setAttribute('style', 'cursor:pointer; height:30%; width:220px;');

    }

    dialogoMsg = new caixaDialogo('divI', 200, 300, 'padrao/', 130);
    dialogoMsg.Show();
}

function getPropostas() {

    var ajax = new Ajax('POST', 'php/clientes.php', true);
    var p = 'action=getPropostas';
    p += '&codigo=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        var cor = true;

        for (var i = 0; i < json.length; i++) {

            var img = DOM.newElement('img');
            img.src = "imagens/pesquisar.png";

            gridProposta.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].situacao),
                DOM.newText(json[i].evento),
                DOM.newText(json[i].versao),
                DOM.newText(json[i].vendedor),
                DOM.newText(json[i].valorTotal),
                img
            ]);

            gridProposta.setRowData(gridProposta.getRowCount() - 1, json[i].codigo);
            gridProposta.getRow(gridProposta.getRowCount() - 1).setAttribute('onclick', 'window.location="orcamentos.html?codigo=' + json[i].codigo + '"');
            gridProposta.getRow(gridProposta.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 5).setAttribute('style', 'text-align:right; ');
            gridProposta.getCell(gridProposta.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; ');

            if (cor) {
                cor = false;
                gridProposta.setRowBackgroundColor(gridProposta.getRowCount() - 1, "#F5F5F5");

            } else {
                cor = true;
                gridProposta.setRowBackgroundColor(gridProposta.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function LoadDadosCliente() {
    var cmb = Selector.$('cliente');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '';
        Selector.$('contato').value = '';
        Selector.$('telefone').value = '';
        Selector.$('email').value = '';
        return;
    }

    if (cmb.name != cmb.value)
        cmb.name = cmb.value;
    else
        return;

    Selector.$('contato').value = '';
    Selector.$('telefone').value = '';
    Selector.$('email').value = '';

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = 'action=LoadDadosCliente';
    p += '&idCliente=' + cmb.value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        if (ajax.getResponseText() == '-1') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        Selector.$('contato').value = json.responsavel;
        Selector.$('telefone').value = json.telefone;
        Selector.$('email').value = json.email;

        if (json.arquiteto == '1') {
            Selector.$('contratoArquiteto').style.display = 'inline-block';
        }
    };

    ajax.Request(p);
}

function BuscaArtistas(codigo) {

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=BuscaArtistas';
    p += '&codigo=' + codigo;
    ajax.Request(p);
    var json = JSON.parse(ajax.getResponseText());
}

function selecionaPessoa() {

    if (Selector.$('cliente_cpf').checked) {
        Mask.setCPF(Selector.$('cliente_in_tipo'));
        Selector.$('cliente_nome').setAttribute('placeholder', 'Nome ou Apelido');
    } else {
        Mask.setCNPJ(Selector.$('cliente_in_tipo'));
        Selector.$('cliente_nome').setAttribute('placeholder', 'Razão ou Fantasia');
    }
}

//OBRAS
function AdicionarObra(codigo) {

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.setAttribute('style', 'text-align:left;');
    divCadastro.setAttribute('align', 'left');
    divCadastro.innerHTML = '';

    divCadastro.innerHTML += '<div class="divcontainer" style="margin-left:10px; max-width:100px;"> ' +
            '<label>Tipo de Produto</label>' +
            '<select id="tipoProduto" onchange="VerificarAcabamento();" style="max-width:100%;" class="combo_cinzafoco"></select></div>';

    divCadastro.innerHTML += '<div id="divProdutos" class="divcontainer" style="margin-left:10px; max-width:350px; display:none;"> ' +
            '<label>Produto</label>' +
            '<select id="produto" onchange="SelecionarProduto();" style="max-width:100%;" class="combo_cinzafoco"></select></div>';

    divCadastro.innerHTML += '<div class="divcontainer" id="divQuantidade" style="margin-left:10px; max-width:90px; display:none;"> ' +
            '<label>Quantidade</label>' +
            '<input type="number" min="1" id="quantidadeProduto" onchange="CalcularValorProduto();" style="max-width:100%;" class="textbox_cinzafoco"/></div>';

    divCadastro.innerHTML += '<div class="divcontainer" id="divValor" style="margin-left:10px; max-width:90px; display:none;"> ' +
            '<label>Valor</label>' +
            '<input type="text" disabled id="valorProduto" style="max-width:100%; background-color:#F5F5F5; text-align:right;" class="textbox_cinzafoco"/></div>';

    divCadastro.innerHTML += '<div id="btAdicionarProduto" class="divcontainer" style="width:100px; display:none; margin-left:10px; vertical-align:middle; padding-bottom:5px;"><button class="botaosimplesfoco" onclick="AdicionarProduto();">Adicionar</button></div>';

    divCadastro.innerHTML += '<div id="divAcabamento" class="divcontainer" style="margin-left:10px; max-width:100px;"> ' +
            '<label>Acabamento</label>' +
            '<select id="acabamento" onchange="SelecionarAcabamento();" style="max-width:100%;" class="combo_cinzafoco"></select></div>';

    divCadastro.innerHTML += '<div id="divGrupoMoldura" class="divcontainer" style="margin-left:10px; max-width:100px;"> ' +
            '<label>Grupo Moldura</label>' +
            '<select id="grupo_moldura" onchange="getMolduras(true)" style="max-width:100%;" class="combo_cinzafoco"></select></div>';

    divCadastro.innerHTML += '<div id="divMoldura" class="divcontainer" style="margin-left:10px; max-width:100px;"> ' +
            '<label>Moldura</label>' +
            '<select id="moldura" style="max-width:100%;" class="combo_cinzafoco"/></div><br>';

    divCadastro.innerHTML += '<div class="divcontainer" id="divAltura" style="margin-left:10px; max-width:90px;"> ' +
            '<label>Altura</label>' +
            '<input type="text" id="altura2" style="max-width:100%;" class="textbox_cinzafoco"/></div>';

    divCadastro.innerHTML += '<div class="divcontainer" id="divLargura" style="margin-left:10px; max-width:90px;"> ' +
            '<label>Largura</label>' +
            '<input type="text" id="largura2" style="max-width:100%;" class="textbox_cinzafoco"/></div>';

    divCadastro.innerHTML += '<div id="divArtista" class="divcontainer" id="divArtista" style="margin-left:10px; max-width:250px;"> ' +
            '<label>Artista</label>' +
            '<select id="artista" onchange="MostrarObras();" style="max-width:100%;" class="combo_cinzafoco"/></div>';

    divCadastro.innerHTML += '<div class="divcontainer" style="margin-left:10px; max-width:150px;"> ' +
            '<label id="escolherTamanho" onclick="PromptEscolherTamanhos();" style="display: none; margin-left:10px; cursor:pointer;">Escolher tamanhos</label></div>';

    divCadastro.innerHTML += '<div class="divcontainer" style="margin-left:10px; max-width:200px;"> ' +
            '<label id="adicionarObra" onclick="AnexarImagem();" style="display: none; margin-left: 10px; cursor:pointer;">Adicionar imagem</label> <label id="adicionarInstaSemImagem" style="display:none; text-decoration:underline; cursor:pointer;" title="Clique para adicionar Instaarts sem imagem" onclick="AdicionarInstaartsSemImagem();"> (Sem imagem)</label>' +
            '<label style="margin-left:10px" id="msgLoad"></label></div><br/>';

    divCadastro.innerHTML += '<div id="divObras" style="width:100%; height: 425px; overflow: auto; margin-bottom:5px;"></div>';
    divCadastro.innerHTML += '<button class="botaosimplesfoco" style="float:right;" onclick="IncluirObrasSelecionadas(); alteracao = true;">Incluir</button>';

    dialogoCadastro = new caixaDialogo('divCadastro', 575, 1150, 'padrao/', 130);
    dialogoCadastro.Show();

    //getTiposProdutos(Selector.$('tipoProduto'), 'Selecione um tipo', true, true);
    Select.AddItem(Selector.$('tipoProduto'), 'Selecione um tipo', 0);
    Select.AddItem(Selector.$('tipoProduto'), 'Photoarts', 1);
    Select.AddItem(Selector.$('tipoProduto'), 'Instaarts', 2);
    Select.AddItem(Selector.$('tipoProduto'), 'Produtos', 3);

    getProdutos(Selector.$('produto'), 'Selecione um produto', true);
    Mask.setOnlyNumbers(Selector.$('quantidadeProduto'));
    Select.AddItem(Selector.$('acabamento'), 'Selecione um tipo', 0);

    getArtistas(Selector.$('artista'), 'Selecione um artista', true);
    getGruposMolduras(Selector.$('grupo_moldura'), 'Selecione um grupo', false);
    Select.AddItem(Selector.$('moldura'), 'Selecione um grupo de moldura', 0);
    Mask.setMoeda(Selector.$('altura2'));
    Mask.setMoeda(Selector.$('largura2'));

    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('cellpadding', '4');
    gridObras.table.setAttribute('cellspacing', '0');
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
        DOM.newText(''),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Nome'),
        DOM.newText('Acabamento'),
        DOM.newText('Tamanhos'),
        DOM.newText('idsTamanhos'),
        DOM.newText('alturas'),
        DOM.newText('larguras'),
        DOM.newText('valores'),
        DOM.newText('selecionados'),
        DOM.newText('idOrcamentoComp'),
        DOM.newText(''),
        DOM.newText('idArtista'),
        DOM.newText('idAcabamento'),
        DOM.newText('linhasGrid'),
        DOM.newText('estrelas'),
        DOM.newText('qtd vendidos'),
        DOM.newText('pesos')
    ]);

    for (var i = 0; i < gridObras2.getRowCount(); i++) {

        gridObras.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);

        gridObras.getRow(i).style.display = 'none';
    }

    gridObras.hiddenCol(6);
    gridObras.hiddenCol(7);
    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    //gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);

    Selector.$('divObras').appendChild(gridObras.table);
    return;
    //Código atualizado em 27/10/2016 - Eduardo Pereira
    CodigoArtista = 0;
    if (codigo == '-1') {

        if (!CheckPermissao(158, true, 'Você não possui permissão para adicionar uma obra no orçamento', false)) {
            return;
        }
    }

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.setAttribute('style', 'text-align:left;');
    divCadastro.setAttribute('align', 'left');
    divCadastro.innerHTML = '';

    //OPTIONS PHOTOARTS OU INSTAARTS
    //PHOTOARTS
    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optPhoto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObras()');
    elemento.setAttribute('style', 'margin-left:155px');
    elemento.setAttribute('checked', 'checked');

    var label = DOM.newElement('label');
    label.innerHTML = 'PhotoArts';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optPhoto');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    //INSTAARTS
    elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optInsta');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObras()');
    elemento.setAttribute('style', 'margin-left:20px');

    label = DOM.newElement('label');
    label.innerHTML = 'InstaArts';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optInsta');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    //PRODUTOS
    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optProduto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObras()');
    elemento.setAttribute('style', 'margin-left:20px');

    var label = DOM.newElement('label');
    label.innerHTML = 'Produtos';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optProduto');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    divCadastro.innerHTML += '<br />';

    //DIV PHOTOARTS
    var divP = DOM.newElement('div', 'o_divPhotoarts');
    divP.setAttribute('style', 'margin-top:10px; text-align:left;');

    //ARTISTA
    label = DOM.newElement('label');
    label.innerHTML = 'Artista ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    /*
     elemento = DOM.newElement('select');
     elemento.setAttribute('id', 'o_artista');
     elemento.setAttribute('class', 'combo_cinzafoco');
     elemento.setAttribute("style", 'width:235px; margin-left:4px;');
     elemento.setAttribute('onchange', 'getObrasArtista(true)');
     */

    elemento = DOM.newElement('input');
    elemento.setAttribute('id', 'o_artista');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('style', 'position: absolute; background: transparent; z-index: 2; width:218px;');
    //elemento.setAttribute('onchange', 'getObrasArtista(true)');

    elemento2 = DOM.newElement('input');
    elemento2.setAttribute('id', 'autocomplete-ajax-x');
    elemento2.setAttribute('disabled', 'disabled');
    elemento2.setAttribute('class', 'textbox_cinzafoco');
    elemento2.setAttribute('style', 'color: #CCC; background: transparent; z-index: 1; width:218px;');
    divP.appendChild(label);
    divP.appendChild(elemento);
    divP.appendChild(elemento2);

    //OBRA
    label = DOM.newElement('label');
    label.innerHTML = 'Obra ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('style', 'position: absolute; background: transparent; z-index: 2; width:218px;');
    elemento.setAttribute('onchange', 'getTamanhosObras(true)');

    elemento2 = DOM.newElement('input');
    elemento2.setAttribute('id', 'o_obra_x');
    elemento2.setAttribute('disabled', 'disabled');
    elemento2.setAttribute('class', 'textbox_cinzafoco');
    elemento2.setAttribute('style', 'color: #CCC; background: transparent; z-index: 1; width:218px;');

    divP.appendChild(label);
    divP.appendChild(elemento);
    divP.appendChild(elemento2);

    divP.innerHTML += '<br />';

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanho');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:218px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDadosTamanho("p")');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Acabamento ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_acabamento');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:190px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //GRUPO MOLDURA    
    label = DOM.newElement('label');
    label.innerHTML = 'Grupo ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_grupoMoldura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:238px; margin-left:4px');
    elemento.setAttribute('onchange', 'getMolduras(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //MOLDURA
    label = DOM.newElement('label');
    label.innerHTML = 'Moldura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_moldura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:216px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //DADOS DO TAMANHO, TIRAGEM, ESTRELAS, ETC
    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_altura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_largura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //TIRAGEM
    label = DOM.newElement('label');
    label.innerHTML = 'Tiragem ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_tiragem');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:45px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //QTDE VENDIDOS
    label = DOM.newElement('label');
    label.innerHTML = 'Qtd. Vendidos ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_qtdeVendidos');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:45px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //ESTRELAS
    label = DOM.newElement('label');
    label.innerHTML = 'Estrelas ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_estrelas');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:42px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divCadastro.appendChild(divP);

    //INSTAARTS
    var divI = DOM.newElement('div', 'o_divInstaarts');
    divI.setAttribute('style', 'margin-top:10px; text-align:left;');

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanhoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:218px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDadosTamanho("i")');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Acabamento ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_acabamentoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:190px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //MOLDURA GRUPO    
    label = DOM.newElement('label');
    label.innerHTML = 'Grupo ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_grupoMolduraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:238px; margin-left:4px');
    elemento.setAttribute('onchange', 'getMolduras(true)');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Moldura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_molduraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:216px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_alturaI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
    elemento.setAttribute('onblur', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_larguraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
    elemento.setAttribute('onblur', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divCadastro.appendChild(divI);
    //FIM divI

    //PRODUTOS
    var divProd = DOM.newElement('div', 'o_divProdutos');
    divProd.setAttribute('style', 'margin-top:10px; text-align:left;');

    //PRODUTO    
    label = DOM.newElement('label');
    label.innerHTML = 'Produto ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_produtoProd');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:508px; margin-left:4px');
    //elemento.setAttribute('onclick', '');
    elemento.setAttribute('onchange', 'getDadosProduto(); getImagemProduto(); ');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    divCadastro.appendChild(divProd);
    //FIM divProd

    //QTDE, VALOR, DESCONTO E TOTAL
    var divTotal = DOM.newElement('div', 'divObrasValores');
    divTotal.setAttribute('style', 'margin-top:8px');

    //VALOR
    label = DOM.newElement('label', 'o_lblValor');
    label.innerHTML = 'Valor';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valor');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('readonly', 'readonly');
    elemento.setAttribute("style", 'width:75px; margin-left:6px; background-color:#F5F5F5; text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //ACRESCIMO
    label = DOM.newElement('label');
    label.innerHTML = 'Acréscimo';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorAcrescimo');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 5,00');
    elemento.setAttribute("style", 'width:73px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, false, false, true)');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //QTDE
    label = DOM.newElement('label');
    label.innerHTML = 'Qtde';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_qtde');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 1');
    elemento.setAttribute('value', '1');
    elemento.setAttribute('onblur', 'TotalizaObras(true, false, false, false); AtualizaEstrela();');
    elemento.setAttribute("style", 'width:35px; margin-left:4px;text-align:center;');
    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //PERCENTUAL DE DESCONTO
    label = DOM.newElement('label');
    label.innerHTML = 'Desconto';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_percDesconto');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 5,00');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, true, false, false)');

    var span = DOM.newElement('label');
    span.setAttribute('class', 'fonte_Roboto_texto_normal');
    span.innerHTML = ' % ou ';

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);
    divTotal.appendChild(span);

    //VALOR DESCONTO
    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorDesconto');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 200,00');
    elemento.setAttribute("style", 'width:73px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, false, true, false)');

    divTotal.appendChild(elemento);

    divTotal.innerHTML += '<br />';

    //VALOR TOTAL
    label = DOM.newElement('label', 'o_lblValorTotal');
    label.innerHTML = 'Valor Total';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorTotal');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('readonly', 'readonly');
    elemento.setAttribute("style", 'width:100px; margin-left:4px; font-size:16px; font-weight:bold; background-color:#F5F5F5; text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //PESO APROXIMADO
    label = DOM.newElement('label', 'o_lblPeso');
    label.innerHTML = '';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px; color:#0A4ADF; font-weight:bold');
    divTotal.appendChild(label);

    divCadastro.appendChild(divTotal);

    //OBS
    label = DOM.newElement('label');
    label.innerHTML = 'Observações';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px;');

    elemento = DOM.newElement('textarea');
    elemento.setAttribute('id', 'o_obs');
    elemento.setAttribute('placeHolder', 'Informe detalhes referente a venda da obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:560px; height:45px; overflow:auto;');

    divCadastro.appendChild(label);
    divCadastro.appendChild(elemento);
    divCadastro.innerHTML += "<br/>";

    divCadastro.innerHTML += "<br/>";

    //IMAGEM OBRA
    var divImg = DOM.newElement('div');
    divImg.setAttribute('style', 'text-align:center; display:inline-block;');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px;');
    elemento.setAttribute("name", '');

    divImg.appendChild(elemento);
    divCadastro.appendChild(divImg);

    divI.innerHTML += '<br/><br/>';

    /*var divIncluirImagem = DOM.newElement('div', 'divIncluirImagem');
     divIncluirImagem.setAttribute('style', 'text-align:center; width:100px; margin:0 auto; display:none;');*/

    label = DOM.newElement('label', 'lblIncluirImagem');
    label.innerHTML = 'Incluir Imagem';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; text-decoration:underline; text-align:center; display:none;');

    divImg.appendChild(label);
    //divCadastro.appendChild(divIncluirImagem);

    var divImgMoldura = DOM.newElement('div', 'divImgMoldura');
    divImgMoldura.setAttribute('style', 'text-align:center; display:inline-block; margin-left:10px; display:none;');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'imagemMoldura');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px; margin-bottom:21px;');
    elemento.setAttribute("name", '');

    divImgMoldura.appendChild(elemento);
    divCadastro.appendChild(divImgMoldura);

    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');

    label = DOM.newElement('label', 'e_lblCancelar');
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle');
    label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); verificaAlteracao(' + codigo + ')');
    label.innerHTML = 'Cancelar';
    divElem.appendChild(label);

    divCadastro.innerHTML += '<br/>';
    divCadastro.appendChild(divElem);

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', 'IncluirObra(' + codigo + ')');
    elemento.innerHTML = "Incluir";

    divCadastro.appendChild(elemento);

    dialogoCadastro = new caixaDialogo('divCadastro', 625, 620, 'padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();
    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    Selector.$('divCadastro').style.overflow = 'hidden';

    Selector.$('o_artista').name = '';
    Selector.$('o_obra').name = '';

    Mask.setMoeda(Selector.$('o_percDesconto'));
    Mask.setMoeda(Selector.$('o_valorDesconto'));
    Mask.setMoeda(Selector.$('o_valorAcrescimo'));

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=BuscaArtistas';
    p += '&codigo=' + codigo;
    ajax.Request(p);

    var json = JSON.parse(ajax.getResponseText());
    var arrayArtistas = new Array();
    var arrayId = new Array();
    var idArtista = 0;

    for (var i = 0; i < json.length; i++) {
        arrayArtistas.push(json[i].artista);
        arrayId.push(json[i].idArtista);
    }
    var countriesArray = $.map(arrayArtistas, function (value, key) {
        return {value: value, data: key};
    });
    //var countriesArray2 = $.map(arrayId, function (value, key) { return { value: value, data: key }; });
    $('#o_artista').autocomplete({
        //serviceUrl: '/autosuggest/service/url',
        lookup: countriesArray,
        lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        }, //,
        onHint: function (hint) {
            $('#autocomplete-ajax-x').val(hint);
        },
        serviceUrl: '/autocomplete/countries',
        onSelect: function (suggestion) {
            idArtista = arrayId[suggestion.data];
            Selector.$('o_artista').setAttribute('name', idArtista);
            Selector.$('o_artista').focus();
            CodigoArtista = idArtista;
            if (Selector.$('o_artista').value.trim() != '') {
                Selector.$('o_artista').setAttribute('onblur', 'CarregaObras(' + CodigoArtista + ')');
            }
        }
    });
    if (codigo >= 0) {
        CodigoObra = gridObras.getCellText(codigo, 14);
        CodigoArtista = gridObras.getCellText(codigo, 15);
        //getArtistas(Selector.$('o_artista'), 'Selecione um artista', false);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', false, 'p');
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', false, 'i');
        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', false);
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', false);

        if (gridObras.getCellText(codigo, 13) == 1) {
            Selector.$('o_optPhoto').checked = 'checked';
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';
            var pasta = 'obras';
            AlternaTipoObras();
            //Select.Show(Selector.$('o_artista'), gridObras.getCellText(codigo, 14));
            Selector.$('o_artista').value = gridObras.getCellText(codigo, 3);
            Selector.$('o_artista').name = gridObras.getCellText(codigo, 15);
            Selector.$('o_obra').name = gridObras.getCellText(codigo, 14);
            Selector.$('o_obra').value = gridObras.getCellText(codigo, 4)
            CarregaObras(CodigoArtista);

            getTamanhosObras(false);
            Select.Show(Selector.$('o_tamanho'), gridObras.getCellText(codigo, 16));
            Select.Show(Selector.$('o_acabamento'), gridObras.getCellText(codigo, 17));
            Selector.$('o_altura').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_largura').value = gridObras.getCellText(codigo, 19);
            Selector.$('o_tiragem').value = gridObras.getCellText(codigo, 25);
            Selector.$('o_qtdeVendidos').value = gridObras.getCellText(codigo, 26);
            Selector.$('o_estrelas').value = gridObras.getCellText(codigo, 27);
            Selector.$('o_valor').value = gridObras.getCellText(codigo, 24);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 20);
            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 22);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 23);
            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 9);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 10);
            if (gridObras.getCellText(codigo, 28) == '' || gridObras.getCellText(codigo, 28).split('/')[gridObras.getCellText(codigo, 28).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
            } else {
                if (gridObras.getCellText(codigo, 28).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 28).split('.')[1] == 'rar') {
                    Selector.$('o_imagem').src = 'imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + gridObras.getCellText(codigo, 28) + '' + "');");
                } else {
                    Selector.$('o_imagem').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 28);
                }
                Selector.$('o_imagem').name = gridObras.getCellText(codigo, 28);
                Selector.$('o_imagem').title = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 28);
            }
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 29) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 29);
            Select.Show(Selector.$('o_grupoMoldura'), gridObras.getCellText(codigo, 30));
            getMoldurasObras(Selector.$('o_moldura'), 'Selecione uma moldura...', false, Selector.$('o_grupoMoldura').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_moldura'), gridObras.getCellText(codigo, 31));
        } else if (gridObras.getCellText(codigo, 13) == 2) {
            Selector.$('o_optInsta').checked = 'checked';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').disabled = 'disabled';

            var pasta = 'instaarts';
            AlternaTipoObras();

            getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);
            Select.Show(Selector.$('o_tamanhoI'), gridObras.getCellText(codigo, 16));
            Select.Show(Selector.$('o_acabamentoI'), gridObras.getCellText(codigo, 17));
            Selector.$('o_alturaI').value = gridObras.getCellText(codigo, 18);
            Selector.$('o_larguraI').value = gridObras.getCellText(codigo, 19);
            Selector.$('o_valor').value = gridObras.getCellText(codigo, 24);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 20);
            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 22);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 23);
            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 9);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 10);
            Selector.$('o_imagem').setAttribute('value', gridObras.getCellText(codigo, 28));

            if (gridObras.getCellText(codigo, 27) == '' || gridObras.getCellText(codigo, 28).split('/')[gridObras.getCellText(codigo, 28).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
            } else {

                if (gridObras.getCellText(codigo, 28).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 28).split('.')[1] == 'rar') {
                    Selector.$('o_imagem').src = 'imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + gridObras.getCellText(codigo, 28) + '' + "');");
                } else if (gridObras.getCellText(codigo, 28).split('.')[1] == 'pdf') {
                    Selector.$('o_imagem').src = 'imagens/pdf.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute('onclick', "window.open('" + "imagens/" + pasta + "/" + gridObras.getCellText(codigo, 28) + "')");
                } else {
                    Selector.$('o_imagem').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 28);
                }

                Selector.$('o_imagem').name = gridObras.getCellText(codigo, 28);
                Selector.$('o_imagem').title = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 28);
            }

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + gridObras.getCellText(codigo, 29) + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = gridObras.getCellText(codigo, 29);

            Select.Show(Selector.$('o_grupoMolduraI'), gridObras.getCellText(codigo, 30));
            getMoldurasObras(Selector.$('o_molduraI'), 'Selecione uma moldura...', false, Selector.$('o_grupoMolduraI').value, Selector.$('o_optPhoto').checked);
            Select.Show(Selector.$('o_molduraI'), gridObras.getCellText(codigo, 31));
        } else {
            Selector.$('o_optInsta').disabled = 'disabled';
            Selector.$('o_optPhoto').disabled = 'disabled';
            Selector.$('o_optProduto').checked = 'checked';

            var pasta = 'produtos';
            AlternaTipoObras();

            getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', false);

            Select.Show(Selector.$('o_produtoProd'), gridObras.getCellText(codigo, 17));

            Selector.$('o_valor').value = gridObras.getCellText(codigo, 24);
            Selector.$('o_qtde').value = gridObras.getCellText(codigo, 20);

            Selector.$('o_percDesconto').value = gridObras.getCellText(codigo, 21);
            Selector.$('o_valorDesconto').value = gridObras.getCellText(codigo, 22);
            Selector.$('o_valorAcrescimo').value = gridObras.getCellText(codigo, 23);

            Selector.$('o_valorTotal').value = gridObras.getCellText(codigo, 9);
            Selector.$('o_obs').value = gridObras.getCellText(codigo, 10);
            Selector.$('o_imagem').setAttribute('name', gridObras.getCellText(codigo, 28));

            if (gridObras.getCellText(codigo, 28) == '' || gridObras.getCellText(codigo, 28).split('/')[gridObras.getCellText(codigo, 28).split('/').length - 1] == 'semarte.png') {
                Selector.$('o_imagem').src = 'imagens/semarte.png';
            } else {

                if (gridObras.getCellText(codigo, 28).split('.')[1] == 'zip' || gridObras.getCellText(codigo, 28).split('.')[1] == 'rar') {
                    Selector.$('o_imagem').src = 'imagens/zip.png';
                    Selector.$('o_imagem').style.cursor = 'pointer';
                    Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + gridObras.getCellText(codigo, 28) + '' + "');");
                } else {
                    Selector.$('o_imagem').src = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 28);
                }

                Selector.$('o_imagem').name = gridObras.getCellText(codigo, 28);
                Selector.$('o_imagem').title = 'imagens/' + pasta + '/mini_' + gridObras.getCellText(codigo, 28);
            }
        }
    } else {

        // getArtistas(Selector.$('o_artista'), 'Selecione um artista', true);
        // Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', 0);
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', 0);
        getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', true, 'p');
        getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', true);
        Select.AddItem(Selector.$('o_moldura'), 'Selecione um grupo', 0);
        Selector.$('o_grupoMoldura').name = '0';

        getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', true);
        getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', true, 'i');
        getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', true);
        Select.AddItem(Selector.$('o_molduraI'), 'Selecione um grupo', 0);
        Selector.$('o_grupoMolduraI').name = '0';

        getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', true);

        AlternaTipoObras();
        Selector.$('o_artista').focus();
    }

    if (!CheckPermissao(40, false, '', false)) {
        Selector.$('divObrasValores').style.display = 'none';
        Selector.$('divObrasValores').childNodes[2].style.display = 'inline-block';
        Selector.$('divObrasValores').childNodes[3].style.display = 'inline-block';
    }
}

function verificaAlteracao(codigo) {

    if (codigo < 0) {
        dialogoCadastro.Close();
        return;
    }

    var validacao = true;

    if (Selector.$('o_artista').value != gridObras.getCellText(codigo, 3)) {
        validacao = false;
    }
    if (Selector.$('o_obra').value != gridObras.getCellText(codigo, 4)) {
        validacao = false;
    }

    if (Selector.$('o_tamanho').value != gridObras.getCellText(codigo, 16)) {
        validacao = false;
    }

    if (Selector.$('o_acabamento').value != gridObras.getCellText(codigo, 17)) {
        validacao = false;
    }

    if (Selector.$('o_altura').value != gridObras.getCellText(codigo, 18)) {
        validacao = false;
    }

    if (Selector.$('o_largura').value != gridObras.getCellText(codigo, 19)) {
        validacao = false;
    }
    if (Selector.$('o_tiragem').value != gridObras.getCellText(codigo, 25)) {
        validacao = false;
    }

    if (Selector.$('o_percDesconto').value != gridObras.getCellText(codigo, 21)) {
        validacao = false;
    }

    if (Selector.$('o_valor').value != gridObras.getCellText(codigo, 24)) {
        validacao = false;
    }

    if (Selector.$('o_valorAcrescimo').value != gridObras.getCellText(codigo, 23)) {
        validacao = false;
    }
    if (Selector.$('o_valorDesconto').value != gridObras.getCellText(codigo, 22)) {
        validacao = false;
    }

    if (Selector.$('o_obs').value != gridObras.getCellText(codigo, 10)) {
        validacao = false;
    }

    if (Select.Show(Selector.$('o_moldura'), gridObras.getCellText(codigo, 31))) {
        validacao = false;
    }

    if (validacao == false) {
        mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Aviso", "Deseja descartas as alterações?", "OK", "verificaAlteracaoAux()", true, "");
        mensagem.Show();
    } else {
        dialogoCadastro.Close();
    }
}

function verificaAlteracaoAux() {
    dialogoCadastro.Close();
    mensagem.Close();
}

function getMolduras(ascinc) {

    getMoldurasObras(Selector.$('moldura'), 'Selecione uma moldura', ascinc, Selector.$('grupo_moldura').value, (Selector.$('tipoProduto').selectedIndex == 1 ? true : false));
    return;
    var cmb = (Selector.$('o_optPhoto').checked ? Selector.$('o_grupoMoldura') : Selector.$('o_grupoMolduraI'));
    var cmbMoldura = (Selector.$('o_optPhoto').checked ? Selector.$('o_moldura') : Selector.$('o_molduraI'));

    if (cmb.selectedIndex <= 0) {
        Select.Clear(cmbMoldura);
        Select.AddItem(cmbMoldura, 'Selecione um grupo', 0);
    }

    if (cmb.value != cmb.name) {
        cmb.name = cmb.value;

        getMoldurasObras(cmbMoldura, 'Selecione uma moldura...', ascinc, cmb.value, Selector.$('o_optPhoto').checked);
        getDetalhesAcabamento();
    }
}

function AlternaTipoObras() {

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';
        dialogoCadastro.Realinhar(550, 620);

        getTamanhosObras(true);
        Selector.$('divImgMoldura').style.display = 'none';
        Selector.$('lblIncluirImagem').style.display = 'none';
    } else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        dialogoCadastro.Realinhar(525, 620);

        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('divImgMoldura').style.display = 'none';
        Selector.$('o_imagem').setAttribute('onclick', 'AnexarImagem()');
        Selector.$('lblIncluirImagem').style.display = 'block';
    } else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

        dialogoCadastro.Realinhar(445, 620);
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('divImgMoldura').style.display = 'none';
        Selector.$('o_imagem').setAttribute('onclick', 'AnexarImagem()');
        Selector.$('lblIncluirImagem').style.display = 'block';
    }
}

function IncluirObra(linha) {

    if (linha != '-1') {
        if (!CheckPermissao(158, true, 'Você não possui permissão para editar uma obra do orçamento', false)) {
            return;
        }
    }

    var altura;
    var largura;

    if (Selector.$('o_optPhoto').checked) {

        altura = (parseFloat(Selector.$('o_altura').value) / 100);
        largura = (parseFloat(Selector.$('o_largura').value) / 100);

        var metro = (altura * largura);

        if (Selector.$('o_artista').value.trim() == '') {
            MostrarMsg('Por favor, selecione um artista', 'o_artista');
            return;
        }

        if (Selector.$('o_obra').value.trim() == '') {
            MostrarMsg('Por favor, selecione uma obra', 'o_obra');
            return;
        }

        if (Selector.$('o_tamanho').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um tamanho', 'o_tamanho');
            return;
        }

        if (Selector.$('o_acabamento').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um acabamento', 'o_acabamento');
            return;
        }

        if (Selector.$('o_acabamento').options[Selector.$('o_acabamento').selectedIndex].id == '1') {

            if (parseFloat(metro) > 1) {
                MostrarMsg('Não é possível utilizar este acabamento, pois o tamanho da obra é maior que 1m².', 'o_acabamento');
                return;
            }
        }
    }

    if (Selector.$('o_optInsta').checked) {

        altura = (parseFloat(Selector.$('o_alturaI').value) / 100);
        largura = (parseFloat(Selector.$('o_larguraI').value) / 100);

        var metro = (altura * largura);

        if (Selector.$('o_tamanhoI').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um tamanho', 'o_tamanho');
            return;
        }

        if (Selector.$('o_acabamentoI').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um acabamento', 'o_acabamento');
            return;
        }

        if (Selector.$('o_acabamentoI').options[Selector.$('o_acabamentoI').selectedIndex].id == '1') {

            if (parseFloat(metro) > 1) {
                MostrarMsg('Não é possível utilizar este acabamento, pois o tamanho da obra é maior que 1m².', 'o_acabamentoI');
                return;
            }
        }
    }

    if (Selector.$('o_optProduto').checked) {
        if (Selector.$('o_produtoProd').selectedIndex <= 0) {
            MostrarMsg('Por favor, selecione um produto', 'o_produtoProd');
            return;
        }
    }

    if (Number.parseFloat(Selector.$('o_valorTotal').value) <= 0) {
        MostrarMsg('Por favor, verifique o valor total', 'o_artista');
        return;
    }

    var tipo = 0;
    var nomeTipo = '';
    var photoArts = Selector.$('o_optPhoto').checked;
    var instaArts = Selector.$('o_optInsta').checked;
    var pasta = '';

    if (photoArts) {
        nomeTipo = 'PhotoArts';
        tipo = 1;
        pasta = 'obras';
    } else if (instaArts) {
        nomeTipo = 'InstaArts';
        tipo = 2;
        pasta = 'instaarts';
    } else {
        nomeTipo = 'Produtos'
        tipo = 3;
        pasta = 'produtos';
    }

    //var pasta = 'obras';
    var imgelemento = DOM.newElement('img');
    imgelemento.setAttribute('id', 'o_imagem2');
    imgelemento.setAttribute('class', 'textbox_cinzafoco');
    imgelemento.setAttribute('src', 'imagens/' + pasta + '/mini_' + Selector.$('o_imagem').getAttribute('name'));
    imgelemento.setAttribute('style', 'cursor:pointer; title="Ver Imagem"; width:60px; height:60px;');
    imgelemento.setAttribute("onclick", "MostraImagemTamanhoReal('imagens/obras/" + Selector.$('o_imagem').getAttribute('name') + "');");
    //imgelemento.setAttribute("onclick", "verimagem('" + linha + "','" + (photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0')) + "','" + (photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0')) + "');");

    if (linha >= 0) {

        gridObras.setCellObject(linha, 0, DOM.newText(linha + 1));
        gridObras.setCellObject(linha, 1, imgelemento);
        gridObras.setCellText(linha, 2, nomeTipo);
        gridObras.setCellText(linha, 3, (photoArts ? Selector.$('o_artista').value : '- - -'));
        gridObras.setCellText(linha, 4, (photoArts ? Selector.$('o_obra').value : '- - -'));
        gridObras.setCellText(linha, 5, (photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -')));
        gridObras.setCellText(linha, 6, (photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd')))));
        gridObras.setCellText(linha, 7, Selector.$('o_valor').value);
        gridObras.setCellText(linha, 8, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 9, Selector.$('o_valorTotal').value);
        gridObras.setCellText(linha, 10, Selector.$('o_obs').value);

        //OCULTAS        
        gridObras.setCellText(linha, 13, tipo);
        gridObras.setCellText(linha, 14, (photoArts ? CodigoObra : '0'));
        gridObras.setCellText(linha, 15, (photoArts ? CodigoArtista : '0'));
        gridObras.setCellText(linha, 16, (photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0')));
        gridObras.setCellText(linha, 17, (photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value)));
        gridObras.setCellText(linha, 18, (photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0')));
        gridObras.setCellText(linha, 19, (photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0')));
        gridObras.setCellText(linha, 20, Selector.$('o_qtde').value);
        gridObras.setCellText(linha, 21, Selector.$('o_percDesconto').value);
        gridObras.setCellText(linha, 22, Selector.$('o_valorDesconto').value);
        gridObras.setCellText(linha, 23, Selector.$('o_valorAcrescimo').value);
        gridObras.setCellText(linha, 24, Selector.$('o_valor').value);
        gridObras.setCellText(linha, 25, (photoArts ? Selector.$('o_tiragem').value : '0'));
        gridObras.setCellText(linha, 26, (photoArts ? Selector.$('o_qtdeVendidos').value : '0'));
        gridObras.setCellText(linha, 27, (photoArts ? Selector.$('o_estrelas').value : '0'));
        gridObras.setCellText(linha, 28, Selector.$('o_imagem').getAttribute('name'));
        gridObras.setCellText(linha, 29, (photoArts || instaArts ? Selector.$('o_lblPeso').name : '0'));
        gridObras.setCellText(linha, 30, (photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0')));
        gridObras.setCellText(linha, 31, (photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0')));

    } else {

        var divEditarDuplicar = DOM.newElement('div');
        var editar = DOM.newElement('img');
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('title', 'Editar');
        editar.setAttribute('style', 'width:15px; display:inline-block');
        editar.setAttribute('class', 'efeito-opacidade-75-04');
        editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

        var duplicar = DOM.newElement('img');
        duplicar.setAttribute('src', 'imagens/duplicate.png');
        duplicar.setAttribute('title', 'Duplicar Obra');
        duplicar.setAttribute('style', 'width:15px; display:inline-block; margin-left:10px;');
        duplicar.setAttribute('class', 'efeito-opacidade-75-04');
        duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

        divEditarDuplicar.appendChild(editar);
        divEditarDuplicar.appendChild(duplicar);

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/lixo.png');
        excluir.setAttribute('title', 'Excluir');
        excluir.setAttribute('class', 'efeito-opacidade-75-04');
        excluir.setAttribute('style', 'width:15px');
        excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

        gridObras.addRow([
            DOM.newText((gridObras.getRowCount() + 1)),
            imgelemento,
            DOM.newText(nomeTipo),
            DOM.newText((photoArts ? Selector.$('o_artista').value : '- - -')),
            DOM.newText((photoArts ? Selector.$('o_obra').value : '- - -')),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_tamanho')) : (instaArts ? Select.GetText(Selector.$('o_tamanhoI')) : '- - -'))),
            DOM.newText((photoArts ? Select.GetText(Selector.$('o_acabamento')) + (Selector.$('o_moldura').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_moldura')) : '') : (instaArts ? Select.GetText(Selector.$('o_acabamentoI')) + (Selector.$('o_molduraI').value > 0 ? ' - Mold.: ' + Select.GetText(Selector.$('o_molduraI')) : '') : Select.GetText(Selector.$('o_produtoProd'))))),
            DOM.newText(Selector.$('o_valor').value),
            DOM.newText(Selector.$('o_qtde').value),
            DOM.newText(Selector.$('o_valorTotal').value),
            DOM.newText(Selector.$('o_obs').value),
            divEditarDuplicar,
            excluir,
            //OCULTOS
            DOM.newText(tipo),
            DOM.newText((photoArts ? Selector.$('o_obra').name : '0')),
            DOM.newText((photoArts ? Selector.$('o_artista').name : '0')),
            DOM.newText((photoArts ? Selector.$('o_tamanho').value : (instaArts ? Selector.$('o_tamanhoI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_acabamento').value : (instaArts ? Selector.$('o_acabamentoI').value : Selector.$('o_produtoProd').value))),
            DOM.newText((photoArts ? Selector.$('o_altura').value : (instaArts ? Selector.$('o_alturaI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_largura').value : (instaArts ? Selector.$('o_larguraI').value : '0'))),
            DOM.newText(Selector.$('o_qtde').value),
            DOM.newText(Selector.$('o_percDesconto').value),
            DOM.newText(Selector.$('o_valorDesconto').value),
            DOM.newText(Selector.$('o_valorAcrescimo').value),
            DOM.newText(Selector.$('o_valor').value),
            DOM.newText((photoArts ? Selector.$('o_tiragem').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_qtdeVendidos').value : '0')),
            DOM.newText((photoArts ? Selector.$('o_estrelas').value : '0')),
            DOM.newText(Selector.$('o_imagem').getAttribute('name')),
            DOM.newText((photoArts || instaArts ? Selector.$('o_lblPeso').name : '0')),
            DOM.newText((photoArts ? Selector.$('o_grupoMoldura').value : (instaArts ? Selector.$('o_grupoMolduraI').value : '0'))),
            DOM.newText((photoArts ? Selector.$('o_moldura').value : (instaArts ? Selector.$('o_molduraI').value : '0')))
        ]);
    }

    var cor = false;
    for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {
        gridObras.getCell(i, 0).setAttribute('style', 'text-align:center;width:20px');
        gridObras.getCell(i, 1).setAttribute('style', 'text-align:left;width:60px; height:60px;');
        gridObras.getCell(i, 2).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(i, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 5).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 6).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 7).setAttribute('style', 'text-align:right; width:100px;');
        gridObras.getCell(i, 8).setAttribute('style', 'text-align:center;');
        gridObras.getCell(i, 9).setAttribute('style', 'text-align:right;');
        gridObras.getCell(i, 10).setAttribute('style', 'text-align:left;');
        gridObras.getCell(i, 11).setAttribute('style', 'text-align:center; width:50px;');
        gridObras.getCell(i, 12).setAttribute('style', 'text-align:center; width:20px');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);
    gridObras.hiddenCol(19);
    gridObras.hiddenCol(20);
    gridObras.hiddenCol(21);
    gridObras.hiddenCol(22);
    gridObras.hiddenCol(23);
    gridObras.hiddenCol(24);
    gridObras.hiddenCol(25);
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);
    gridObras.hiddenCol(31);

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    dialogoCadastro.Close();

    Totaliza(true, false, false, false, false);
    CalculaPagamento(false, true, false);
    alteracao = true;
}

function CarregaObras(codigo) {
    if (Selector.$('o_artista').value.trim() != '') {

        var arrayObras = new Array();
        var arrayIdObras = new Array();
        var ajax = new Ajax('POST', 'php/propostas.php', false);
        var p = 'action=BuscaObras';
        p += '&codigo=' + codigo;
        ajax.Request(p);

        var json2 = JSON.parse(ajax.getResponseText());
        var arrayArtistas = new Array();
        var arrayIdObras = new Array();
        var idObra = 0;

        for (var i = 0; i < json2.length; i++) {
            arrayObras.push(json2[i].obra);
            arrayIdObras.push(json2[i].idObra);
        }
        var countriesArray = $.map(arrayObras, function (value, key) {
            return {value: value, data: key};
        });
        //var countriesArray2 = $.map(arrayId, function (value, key) { return { value: value, data: key }; });
        $('#o_obra').autocomplete({
            //serviceUrl: '/autosuggest/service/url',
            lookup: countriesArray,
            lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
                return re.test(suggestion.value);
            }, //,
            onHint: function (hint) {
                $('#o_obra_x').val(hint);
            },
            serviceUrl: '/autocomplete/countries',
            onSelect: function (suggestion) {
                idObra = arrayIdObras[suggestion.data];
                Selector.$('o_obra').setAttribute('name', idObra);
                Selector.$('o_obra').focus();
                Selector.$('o_obra').setAttribute('onblur', 'getTamanhosObras(true)');
                CodigoObra = idObra;
            }
        });

        getObrasArtista(false)
    } else {

        Selector.$('o_obra').value = '';
        Selector.$('o_obra').name = 0;
        Selector.$('o_artista').value = '';
        Selector.$('o_artista').name = 0;
    }
}

function getObrasArtista(ascinc) {
    if (Selector.$('o_artista').value != Selector.$('o_artista').name) {

        //Selector.$('o_artista').name = Selector.$('o_artista').value.toString();
    } else {
        return;
    }

    Select.Clear(Selector.$('o_obra'));

    if (Selector.$('o_artista').name == '0') {
        //Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', '0', '');
        getTamanhosObras();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', ascinc);
    var p = 'action=getObras';
    p += '&idArtista=' + Selector.$('o_artista').getAttribute('name');
    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_obra'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                return;
            }

            Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
            Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');

        };

        Select.AddItem(Selector.$('o_obra'), 'Carregando obras...', '0', '');

        ajax.Request(p);
    } else {
        ajax.Request(p);

        Select.Clear(Selector.$('o_obra'));

        if (ajax.getResponseText() == '0') {
            return;
        }

        Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
        Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
    }
}

function getTamanhosObras(ascinc) {

    if (Selector.$('o_obra').value != Selector.$('o_obra').name) {
        //Selector.$('o_obra').name = Selector.$('o_obra').value;
        Selector.$('o_acabamento').selectedIndex = 0;
        Selector.$('o_grupoMoldura').selectedIndex = 0;
        Selector.$('o_moldura').selectedIndex = 0;

        Selector.$('o_altura').value = '';
        Selector.$('o_largura').value = '';
        Selector.$('o_tiragem').value = '';
        Selector.$('o_qtdeVendidos').value = '';
        Selector.$('o_estrelas').value = '';

        Selector.$('o_valor').value = '';
        Selector.$('o_qtde').value = '1';
        Selector.$('o_percDesconto').value = '';
        Selector.$('o_valorDesconto').value = '';
        Selector.$('o_valorAcrescimo').value = '';

        Selector.$('o_valorTotal').value = '';
        Selector.$('o_lblPeso').innerHTML = '';
    } else {
        return;
    }

    if (Selector.$('o_artista').value.trim() == '' || Selector.$('o_obra').value.trim() == '') {
        Select.Clear(Selector.$('o_tamanho'));
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', ascinc);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + CodigoObra;

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_tamanho'));

            if (!ajax.isStateOK()) {
                return;
            }
            if (ajax.getResponseText() == '0') {
                return;
            }
            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_imagem').src = json[0].imagem;
            Selector.$('o_imagem').setAttribute('name', json[0].img);
            Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');

            Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');

            getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));

        };
        Select.AddItem(Selector.$('o_tamanho'), 'Carregando tamanhos...', '0', '');
        ajax.Request(p);
    } else {
        ajax.Request(p);

        Select.Clear(Selector.$('o_tamanho'));

        if (ajax.getResponseText() == '0') {
            return;
        }
        var json = JSON.parse(ajax.getResponseText());
        Selector.$('o_imagem').src = json[0].imagem;
        Selector.$('o_imagem').setAttribute('name', json[0].img);
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
    }
}

function getDadosTamanho(item) {

    if (item == 'p') {
        if (Selector.$('o_tamanho').value != Selector.$('o_tamanho').name) {
            Selector.$('o_tamanho').name = Selector.$('o_tamanho').value;

            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_grupoMoldura').selectedIndex = 0;
            Selector.$('o_moldura').selectedIndex = 0;

            Selector.$('o_altura').value = '';
            Selector.$('o_largura').value = '';
            Selector.$('o_tiragem').value = '';
            Selector.$('o_qtdeVendidos').value = '';
            Selector.$('o_estrelas').value = '';

            Selector.$('o_valor').value = '';
            Selector.$('o_qtde').value = '1';
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
            Selector.$('o_valorAcrescimo').value = '';

            Selector.$('o_valorTotal').value = '';
            Selector.$('o_lblPeso').innerHTML = '';
        } else {
            return;
        }

        if (Selector.$('o_tamanho').value == '0' || Selector.$('o_artista').name == '0' || Selector.$('o_obra').name == '0') {
            if (Selector.$('o_artista').name == '0' || Selector.$('o_obra').name == '0') {
                Select.Clear(Selector.$('o_tamanho'));
                Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
            }

            Selector.$('o_tamanho').value = '0';
            Selector.$('o_altura').value = '';
            Selector.$('o_largura').value = '';
            Selector.$('o_tiragem').value = '';
            Selector.$('o_qtdeVendidos').value = '';
            Selector.$('o_estrelas').value = '';
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDadosTamanho';
        p += '&idArtistaObraTamanho=' + Selector.$('o_tamanho').value;
        p += '&item=' + item;
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_altura').value = json.altura;
            Selector.$('o_largura').value = json.largura;
            Selector.$('o_tiragem').value = json.tiragemMaxima;
            Selector.$('o_qtdeVendidos').value = json.qtdTotalVendida;
            Selector.$('o_estrelas').value = json.estrelas;
            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_acabamento').value = 0;
            Selector.$('o_acabamento').name = 0;

            if (json.estrelas != json.estrelaAtualOrcamento) {
                var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Mudança de Estrela", "OK", "", false, "");
                mensagem.Show();
                return;
            }
        };

        ajax.Request(p);
    }
    if (item == 'i') {
        if (Selector.$('o_tamanhoI').value != Selector.$('o_tamanhoI').name) {
            Selector.$('o_tamanhoI').name = Selector.$('o_tamanhoI').value;

            Selector.$('o_alturaI').value = '';
            Selector.$('o_larguraI').value = '';

            Selector.$('o_valor').value = '';
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
            Selector.$('o_valorAcrescimo').value = '';
            Selector.$('o_valorTotal').value = '';
            Selector.$('o_lblPeso').innerHTML = '';
        } else {
            return;
        }

        if (Selector.$('o_tamanhoI').value == '0') {
            Selector.$('o_acabamentoI').selectedIndex = 0;
            Selector.$('o_acabamentoI').value = 0;
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDadosTamanho';
        p += '&idTamanho=' + Selector.$('o_tamanhoI').value;
        p += '&item=' + item;

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == 0) {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            if (Number.parseFloat(json.altura) <= 0) {
                Selector.$('o_alturaI').style.backgroundColor = "#FFF";
                Selector.$('o_alturaI').removeAttribute("readonly");
                Selector.$('o_alturaI').value = json.altura;

                Mask.setMoeda(Selector.$('o_alturaI'));
            } else {
                Selector.$('o_alturaI').style.backgroundColor = "#F5F5F5";
                Selector.$('o_alturaI').setAttribute("readonly", "readonly");
                Selector.$('o_alturaI').value = json.altura;
            }

            if (Number.parseFloat(json.largura) <= 0) {
                Selector.$('o_larguraI').style.backgroundColor = "#FFF";
                Selector.$('o_larguraI').removeAttribute("readonly");
                Selector.$('o_larguraI').value = json.largura;

                Mask.setMoeda(Selector.$('o_larguraI'));
            } else {
                Selector.$('o_larguraI').style.backgroundColor = "#F5F5F5";
                Selector.$('o_larguraI').setAttribute("readonly", "readonly");
                Selector.$('o_larguraI').value = json.largura;
            }

            if (Number.parseFloat(json.altura) <= 0) {
                Selector.$('o_alturaI').select();
            } else {
                if (Number.parseFloat(json.largura) <= 0) {
                    Selector.$('o_larguraI').select();
                }
            }

            Selector.$('o_acabamentoI').selectedIndex = 0;
            Selector.$('o_acabamentoI').value = 0;
            Selector.$('o_acabamentoI').name = 0;
        };

        ajax.Request(p);
    }
}

function AtualizaEstrela() {

    if (Selector.$('o_qtde').value <= 0) {
        var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Digite uma quantidade válida", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=AtualizaEstrela';
    p += '&idArtistaObraTamanho=' + Selector.$('o_tamanho').value;
    p += '&qtd=' + Selector.$('o_qtde').value;
    ajax.Request(p);
    var json = JSON.parse(ajax.getResponseText());
    Selector.$('o_estrelas').value = json.estrelas;
    if (json.estrelas != json.estrelaAtual) {
        var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Mudança de Estrela", "OK", "", false, "");
        mensagem.Show();
        return;
    }
}

function AtualizaEstrela2(linha, idArtistaObraTamanho, selecionado, obra, artista) {

    if (!selecionado) {

        if (isElement('div', 'divCadastro') && Selector.$('divCadastro').style.visibility == 'visible') {
            if (isElement('input', 'lbl-estr-' + linha + '-' + idArtistaObraTamanho)) {
                Selector.$('lbl-estr-' + linha + '-' + idArtistaObraTamanho).innerHTML = Selector.$('lbl-estr-' + linha + '-' + idArtistaObraTamanho).getAttribute('name');
                estrela = Selector.$('lbl-estr-' + linha + '-' + idArtistaObraTamanho).getAttribute('name');
            } else {
                var nameInput = Selector.$('tam-' + idArtistaObraTamanho).getAttribute('name');
                Selector.$('lbl-estr-' + nameInput + '-' + idArtistaObraTamanho).innerHTML = Selector.$('lbl-estr-' + nameInput + '-' + idArtistaObraTamanho).getAttribute('name');
                estrela = Selector.$('lbl-estr-' + nameInput + '-' + idArtistaObraTamanho).getAttribute('name');
            }
        } else {

            if (isElement('input', 'lbl-estr-f-' + linha + '-' + idArtistaObraTamanho)) {
                Selector.$('lbl-estr-f-' + linha + '-' + idArtistaObraTamanho).innerHTML = Selector.$('lbl-estr-f-' + linha + '-' + idArtistaObraTamanho).getAttribute('name');
                estrela = Selector.$('lbl-estr-f-' + linha + '-' + idArtistaObraTamanho).getAttribute('name');
            } else {
                var nameInput = Selector.$('tam-f-' + idArtistaObraTamanho).getAttribute('name');
                Selector.$('lbl-estr-f-' + nameInput + '-' + idArtistaObraTamanho).innerHTML = Selector.$('lbl-estr-f-' + nameInput + '-' + idArtistaObraTamanho).getAttribute('name');
                estrela = Selector.$('lbl-estr-f-' + nameInput + '-' + idArtistaObraTamanho).getAttribute('name');
            }
        }

        return estrela;
    } else {

        var ajax = new Ajax('POST', 'php/propostas.php', false);
        var p = 'action=AtualizaEstrela';
        p += '&idArtistaObraTamanho=' + idArtistaObraTamanho;
        p += '&qtd=1';
        ajax.Request(p);

        var json = JSON.parse(ajax.getResponseText());

        if (isElement('div', 'divCadastro') && Selector.$('divCadastro').style.visibility == 'visible') {
            if (isElement('input', 'lbl-estr-' + linha + '-' + idArtistaObraTamanho)) {
                Selector.$('lbl-estr-' + linha + '-' + idArtistaObraTamanho).innerHTML = json.estrelas;
            } else {
                var nameInput = Selector.$('tam-' + idArtistaObraTamanho).getAttribute('name');
                Selector.$('lbl-estr-' + nameInput + '-' + idArtistaObraTamanho).innerHTML = json.estrelas;
            }
        } else {

            if (isElement('input', 'lbl-estr-f-' + linha + '-' + idArtistaObraTamanho)) {
                Selector.$('lbl-estr-f-' + linha + '-' + idArtistaObraTamanho).innerHTML = json.estrelas;
            } else {
                var nameInput = Selector.$('tam-f-' + idArtistaObraTamanho).getAttribute('name');
                Selector.$('lbl-estr-f-' + nameInput + '-' + idArtistaObraTamanho).innerHTML = json.estrelas;
            }
        }

        estrela = json.estrelas;

        if (json.estrelas != json.estrelaAtual) {            
            mensagemQtdEstrela = new DialogoMensagens("prompt1" + parseInt(Math.random()*1000000), 140, 380, 150, "2", "Atenção", "Mudança de ESTRELA para o tamanho selecionado da obra '" + obra + "'", "OK", "", false, "");
            mensagemQtdEstrela.Show();
            
            if (selecionado) {
                EnviarEmailEstrelaOrcamento(json.estrelas, json.estrelaAtual, obra, artista);
            }
        }

        return estrela;
    }
}

function EnviarEmailEstrelaOrcamento(estrela, estrelaAtual, obra, artista) {

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = "action=EnviarEmailEstrela";
    p += "&estrela=" + estrela;
    p += "&estrelaAtual=" + estrelaAtual;
    p += "&obra=" + obra;
    p += "&artista=" + artista;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == "0") {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
        } else {            
            //mensagemQtdEstrela.Close();
        }
    };

    ajax.Request(p);
}

function getDadosProduto() {

    var cmb = Selector.$('o_produtoProd');

    if (cmb.selectedIndex <= 0) {
        cmb.name = '0';
        Selector.$('o_valor').value = '0,00';
        Selector.$('o_valorTotal').value = '0,00';
        return;
    }

    if (cmb.name != cmb.value) {
        cmb.name = cmb.value;
    } else {
        return;
    }

    var aux = Select.GetText(cmb).split('-');
    Selector.$('o_valor').value = aux[aux.length - 1];

    Selector.$('o_qtde').value = '1';

    TotalizaObras(true, false, false, false);
}

function getDetalhesAcabamento() {

    var valor = Selector.$('o_valor');
    var valorTotal = Selector.$('o_valorTotal');

    if (Selector.$('o_optPhoto').checked) {

        if (Selector.$('o_acabamento').value != Selector.$('o_acabamento').name) {
            Selector.$('o_acabamento').name = Selector.$('o_acabamento').value;
        } else {
            if (Selector.$('o_moldura').value != Selector.$('o_moldura').name) {
                Selector.$('o_moldura').name = Selector.$('o_moldura').value;
            } else {
                return;
            }

        }

        var artista = Selector.$('o_artista').getAttribute('name');
        var obra = Selector.$('o_obra').getAttribute('name');
        var tamanho = Selector.$('o_tamanho');
        var acabamento = Selector.$('o_acabamento');

        var moldura = Selector.$('o_moldura');

        var altura = Selector.$('o_altura');
        var largura = Selector.$('o_largura');
        var estrelas = Selector.$('o_estrelas');

        if (artista <= 0 || obra <= 0 || tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {

            valor.value = '';
            valorTotal.value = '';
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDetalhesAcabamento';
        p += '&idArtista=' + artista.value;
        p += '&idObra=' + obra.value;
        p += '&idObraTamanho=' + tamanho.value;
        p += '&idAcabamento=' + acabamento.value;
        p += '&idMoldura=' + moldura.value;
        p += '&altura=' + altura.value;
        p += '&largura=' + largura.value;
        p += '&estrelas=' + estrelas.value;
        p += '&item=' + (Selector.$('o_optPhoto').checked ? 'p' : 'i');

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            valor.value = json.valorObra;
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            if (json.imagemMoldura == 0) {
                Selector.$('divImgMoldura').style.display = 'none';
            } else {
                Selector.$('divImgMoldura').style.display = 'inline-block';
                Selector.$('divImgMoldura').style.verticalAlign = 'top';
                Selector.$('imagemMoldura').src = 'imagens/molduras/' + json.imagemMoldura;
            }

            TotalizaObras(true, false, false, false);
            //Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    } else {

        var tamanho = Selector.$('o_tamanhoI');
        var acabamento = Selector.$('o_acabamentoI');
        var moldura = Selector.$('o_molduraI');

        if (tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {
            valor.value = '';
            valorTotal.value = '';
            return;
        }

        var altura = Selector.$('o_alturaI');
        var largura = Selector.$('o_larguraI');

        if (Number.parseFloat(altura.value) <= 0) {
            MostrarMsg('Por favor, informe a altura da obra para que seja calculado o valor', 'o_alturaI');
            Selector.$('o_acabamentoI').selectedIndex = 0;
            return;
        }

        if (Number.parseFloat(largura.value) <= 0) {
            MostrarMsg('Por favor, informe a largura da obra para que seja calculado o valor', 'o_larguraI');
            Selector.$('o_acabamentoI').selectedIndex = 0;
            return;
        }

        var ajax = new Ajax('POST', 'php/propostas.php', true);
        var p = 'action=getDetalhesAcabamento';
        p += '&idObraTamanho=' + tamanho.value;
        p += '&idAcabamento=' + acabamento.value;
        p += '&idMoldura=' + moldura.value;
        p += '&altura=' + altura.value;
        p += '&largura=' + largura.value;
        p += '&item=' + (Selector.$('o_optPhoto').checked ? 'p' : 'i');

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            if (json.status != 'OK') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            valor.value = json.valorObra;
            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            if (json.imagemMoldura == 0) {
                Selector.$('divImgMoldura').style.display = 'none';
            } else {
                Selector.$('divImgMoldura').style.display = 'inline-block';
                Selector.$('divImgMoldura').style.verticalAlign = 'top';
                Selector.$('imagemMoldura').src = 'imagens/molduras/' + json.imagemMoldura;
            }

            TotalizaObras(true, false, false, false);
            //Selector.$('o_qtde').select();
        };
        ajax.Request(p);
    }
}

function ExcluirObraAux(linha) {

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta obra?", "OK", "ExcluirObra(" + linha + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirObra(linha) {

    if (linha >= 0) {

        mensagemExcluirObra.Close();

        if (gridObras.getRowCount() == 1) {
            gridObras.clearRows();
        } else {

            gridObras.deleteRow(linha);

            var cor = false;
            for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {
                //Botão Editar
                gridObras.getCellObject(i, 9).childNodes[0].setAttribute('onclick', 'AdicionarObra(' + i + ');');
                //Botão Duplicar
                gridObras.getCellObject(i, 9).childNodes[1].setAttribute('onclick', 'DuplicarObra(' + i + ');');
                gridObras.getCellObject(i, 10).setAttribute('onclick', 'ExcluirObraAux(' + i + ');');

                if (cor) {
                    cor = false;
                    gridObras.setRowBackgroundColor(i, "#F5F5F5");

                } else {
                    cor = true;
                    gridObras.setRowBackgroundColor(i, "#FFF");
                }
            }
        }

        Totaliza(true, false, false, false, false);
        CalculaPagamento(false, true, false);
    }
}

function TotalizaObras(is_qtd, is_percDesconto, is_valorDesconto, is_valorAcrescimo) {

    //FAZER A TOTALIZA OBRA
    var valorAcrescimo = Number.parseFloat(Selector.$('o_valorAcrescimo').value);
    if (is_valorAcrescimo) {
        if (valorAcrescimo > 0) {
            if (valorAcrescimo > (total)) {
                //Selector.$('o_valorAcrescimo').value = Number.FormatDinheiro((total));
                //valorAcrescimo = total;
            }
        } else {
            Selector.$('o_valorAcrescimo').value = '';
        }
    }

    var total = (Number.parseFloat(Selector.$('o_valor').value) + valorAcrescimo) * Number.parseFloat(Selector.$('o_qtde').value);
    var percDesconto = Number.parseFloat(Selector.$('o_percDesconto').value);
    var valorDesconto = Number.parseFloat(Selector.$('o_valorDesconto').value);

    if (total <= 0) {
        return;
    }

    if (is_qtd || is_percDesconto) {
        if (percDesconto > 0) {
            if (percDesconto > 100) {
                Selector.$('o_percDesconto').value = '100,00';
                percDesconto = 100;
            } else if (descontoMaximoObra == '0,00' || descontoMaximoObra == '') {
                Selector.$('o_percDesconto').value = '0,00';
                percDesconto = 0;
            } else if (percDesconto > Number.parseFloat(descontoMaximoObra) && !VerificarAdmin()) {
                Selector.$('o_percDesconto').value = Number.parseFloat(descontoMaximoObra);
                percDesconto = Number.parseFloat(descontoMaximoObra);
            }

            Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total) * (percDesconto / 100));
        } else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    if (is_valorDesconto) {
        if (valorDesconto > 0) {
            if (valorDesconto > (total)) {
                Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total));
                valorDesconto = total;
            } else if (descontoMaximoObra == '0,00' || descontoMaximoObra == '') {
                Selector.$('o_percDesconto').value = '0,00';
                Selector.$('o_valorDesconto').value = '0,00';
                valorDesconto = 0;
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) > Number.parseFloat(descontoMaximoObra) && !VerificarAdmin()) {
                Selector.$('o_percDesconto').value = Number.parseFloat(descontoMaximoObra);
                percDesconto = Number.parseFloat(descontoMaximoObra);
                Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total) * (percDesconto / 100));
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) <= Number.parseFloat(descontoMaximoObra) || VerificarAdmin()) {
                Selector.$('o_percDesconto').value = Number.FormatDinheiro((valorDesconto / (total)) * 100);
            }
        } else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    Selector.$('o_valorTotal').value = Number.FormatDinheiro((total) - Number.parseFloat(Selector.$('o_valorDesconto').value)); //+ Number.parseFloat(Selector.$('o_valorAcrescimo').value)
}

function CalculaPagamento(is_totaliza, is_formaPagamento, is_qtdParcelas) {
    var total = Number.parseFloat(Selector.$('valorTotal').value);
    var qtdParcelas = parseInt(Selector.$('qtdeParcelas').value);

    if (total <= 0 || Selector.$('qtdeParcelas').value == '' || qtdParcelas <= 0) {
        Selector.$('detalhesPagamento').value = '';
        return;
    }

    var texto = 'Em ' + qtdParcelas + ' parcela' + (qtdParcelas > 1 ? 's' : '') + ' de R$ ' + Number.FormatDinheiro(Number.Arredonda(total / qtdParcelas, 2)) + (Selector.$('formaPagamento').selectedIndex > 0 ? ' - ' + Select.GetText(Selector.$('formaPagamento')) : '');
    Selector.$('detalhesPagamento').value = texto.toString();

}
//FIM OBRAS

//TOTALIZA GERAL
function Totaliza(is_grids, is_frete, is_acrescimo, is_percDesconto, is_valorDesconto) {

    //var total1 = Number.getFloat(gridObras.SumCol(9));
    var total1 = Calcular2();
    Selector.$('valor').value = Number.FormatDinheiro(total1);

    var valorFrete = Number.parseFloat(Selector.$('frete').value);
    var valorAcrescimo = Number.parseFloat(Selector.$('acrescimo').value);
    var percDesconto = Number.parseFloat(Selector.$('percDesconto').value);
    var valorDesconto = Number.parseFloat(Selector.$('valorDesconto').value);

    if (total1 <= 0) {
        return;
    }

    if (is_grids || is_percDesconto) {
        if (percDesconto > 0) {
            if (percDesconto > 100) {
                Selector.$('percDesconto').value = '100,00';
                percDesconto = 100;
            } else if (descontoMaximo == '0,00' || descontoMaximo == '') {
                Selector.$('percDesconto').value = '0,00';
                percDesconto = 0;
            } else if (percDesconto > Number.parseFloat(descontoMaximo) && !VerificarAdmin()) {
                Selector.$('percDesconto').value = Number.parseFloat(descontoMaximo);
                percDesconto = Number.parseFloat(descontoMaximo);
            }

            Selector.$('valorDesconto').value = Number.FormatDinheiro((total1) * (percDesconto / 100));
        } else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    if (is_valorDesconto) {
        if (valorDesconto > 0) {
            if (valorDesconto > (total1)) {
                Selector.$('valorDesconto').value = Number.FormatDinheiro((total1));
                valorDesconto = total1;
            } else if (descontoMaximo == '0,00' || descontoMaximo == '') {
                Selector.$('percDesconto').value = '0,00';
                Selector.$('valorDesconto').value = '0,00';
                valorDesconto = 0;
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total1)) * 100)) > Number.parseFloat(descontoMaximo) && !VerificarAdmin()) {
                Selector.$('percDesconto').value = Number.parseFloat(descontoMaximo);
                percDesconto = Number.parseFloat(descontoMaximo);
                Selector.$('valorDesconto').value = Number.FormatDinheiro((total1) * (percDesconto / 100));
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total1)) * 100)) <= Number.parseFloat(descontoMaximo) || VerificarAdmin()) {
                Selector.$('percDesconto').value = Number.FormatDinheiro((valorDesconto / (total1)) * 100);
            }
        } else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    alteracao = true;
    Selector.$('valorTotal').value = Number.FormatDinheiro((total1 - Number.parseFloat(Selector.$('valorDesconto').value)) + valorFrete + valorAcrescimo);
}

//ABA FOLLOW-UP
function getFollow() {

    gridFollow.clearRows();

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=getFollow';
    p += '&codigo=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        var cor = true;

        for (var i = 0; i < json.length; i++) {

            var editar = DOM.newElement('img');
            editar.src = "imagens/modificar.png";
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('style', 'width:15px');
            editar.setAttribute('onclick', 'editarFollow(' + json[i].codigo + ')');

            var excluir = DOM.newElement('img');
            excluir.src = "imagens/lixo.png";
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('style', 'width:15px');
            excluir.setAttribute('onclick', 'excluirFollow(' + json[i].codigo + ')');

            gridFollow.addRow([
                DOM.newText(json[i].data),
                DOM.newText(json[i].tipo),
                DOM.newText(json[i].obs),
                DOM.newText(json[i].usuario),
                DOM.newText(json[i].retorno.substr(0, 16)),
                editar,
                excluir
            ]);

            gridFollow.setRowData(gridFollow.getRowCount() - 1, json[i].codigo);

            gridFollow.getRow(gridFollow.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 0).setAttribute('style', 'width:100px; text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 1).setAttribute('style', 'max-width:200px;text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 3).setAttribute('style', 'width:180px; text-align:left; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 4).setAttribute('style', 'width:140px;text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 5).setAttribute('style', 'width:30px;  text-align:center; ');
            gridFollow.getCell(gridFollow.getRowCount() - 1, 6).setAttribute('style', 'width:30px;  text-align:center; ');

            if (cor) {
                cor = false;
                gridFollow.setRowBackgroundColor(gridFollow.getRowCount() - 1, "#F5F5F5");

            } else {
                cor = true;
                gridFollow.setRowBackgroundColor(gridFollow.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);

}

function excluirFollow(codigo) {

    if (!CheckPermissao(36, true, 'Você não possui permissão para excluir um follow up', false)) {
        return;
    }

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este Follow-up?", "SIM", "excluirFollow_Aux(" + codigo + ")", true, "");
    mensagemExcluir.Show();
}

function excluirFollow_Aux(codigo) {

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    ajax.Request('action=ExcluirFollowUP&codigo=' + codigo);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    mensagemExcluir.Close();
    getFollow();
}

function editarFollow(codigo) {

    if (codigo <= 0) {
        if (!CheckPermissao(47, true, 'Você não possui permissão para criar um novo follow up', false)) {
            return;
        }
    }

    if (codigoAtual <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Pequisa uma proposta para adicionar follow-up", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var div = Selector.$("prompt");
    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:block');

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

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

    var lblnome = DOM.newElement('label');
    lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblnome.appendChild(DOM.newText('Tipo'));

    var txttipo = DOM.newElement('select');
    txttipo.setAttribute('id', 'tiposcontatos');
    txttipo.setAttribute('class', 'combo_cinzafoco');
    txttipo.setAttribute('style', 'width:100%; margin-left:5px;');

    getTiposFollow(txttipo);

    var lbltexto = DOM.newElement('label');
    lbltexto.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lbltexto.appendChild(DOM.newText('Obs'));

    var txttexto = DOM.newElement('textarea');
    txttexto.setAttribute('id', 'obsfollow');
    txttexto.setAttribute('class', 'textbox_cinzafoco');
    txttexto.setAttribute('style', 'width:100%; height:200px; margin-left:5px;');

    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast2);
    divform.appendChild(DOM.newText(' '));
    divform.appendChild(txttipo);
    divform.appendChild(lbltexto);
    divform.appendChild(lblast3);
    divform.appendChild(txttexto);

    var btGravar = DOM.newElement('submit');
    btGravar.setAttribute('id', 'botEnviar');
    btGravar.setAttribute('class', 'botaosimplesfoco');
    btGravar.setAttribute('style', 'float:right;');
    btGravar.value = 'Gravar';
    btGravar.setAttribute('onclick', 'GravarFollow(' + codigo + ');');

    divform.appendChild(DOM.newText(' '));

    divform.innerHTML += "<div style='width:120px; vertical-align:center; display:inline-block'><input id='checkretorno' onclick='mostraRetorno()' type='checkbox'><label class='fonte_Roboto_titulo_normal' for='checkretorno'> Data Retorno</label></div>";

    var txtretorno = DOM.newElement('text');
    txtretorno.setAttribute('id', 'retorno');
    txtretorno.setAttribute('class', 'textbox_cinzafoco');
    txtretorno.setAttribute('style', 'width:110px; vertical-align:center; margin-left:10px;');
    txtretorno.setAttribute('placeholder', 'ex:11/11/2012');

    var txthoraretorno = DOM.newElement('text');
    txthoraretorno.setAttribute('id', 'horaretorno');
    txthoraretorno.setAttribute('class', 'textbox_cinzafoco');
    txthoraretorno.setAttribute('style', 'width:90px; vertical-align:center; margin-left:5px;');
    txthoraretorno.setAttribute('placeholder', 'ex: 08:00');

    var divretorno = DOM.newElement('div', 'divretorno');
    divretorno.setAttribute('style', 'display:inline-block;  vertical-align:middle; width:0px; height:40px; overflow:hidden');
    divform.appendChild(divretorno);

    divretorno.appendChild(txtretorno);
    divretorno.appendChild(txthoraretorno);
    divform.appendChild(btGravar);
    divform.innerHTML += '<br /><br />';

    dialogo = new caixaDialogo('prompt', 410, 550, 'padrao/', 111);
    dialogo.Show();

    Mask.setData(Selector.$('retorno'));
    Mask.setHora(Selector.$('horaretorno', false));

    if (codigo <= 0) {
        Selector.$('tiposcontatos').focus();
    } else {

        var ajax = new Ajax('POST', 'php/propostas.php', false);

        ajax.Request('action=pesquisarFollow&codigo=' + codigo);

        if (ajax.getResponseText() == '0') {
            Selector.$('tiposcontatos').focus();
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Select.Show(Selector.$('tiposcontatos'), json.tipo);
        Selector.$('obsfollow').value = json.obs;


        if (json.retorno != '0000-00-00' && json.retorno != "") {
            Selector.$('checkretorno').checked = true;
            Selector.$('retorno').value = json.retorno;
            Selector.$('horaretorno').value = json.horaretorno;
            mostraRetorno();
        }
    }
}

function mostraRetorno() {

    if (Selector.$('checkretorno').checked) {

        Selector.$('divretorno').style.width = "270px";

    } else {
        Selector.$('divretorno').style.width = "0px";
    }
}

function getTiposFollow(cmb) {

    var ajax = new Ajax('POST', 'php/propostas.php', false);

    ajax.Request('action=getTiposFollow');

    if (ajax.getResponseText() == '0') {
        return;
    }

    Select.AddItem(cmb, "Selecione...", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
}

function GravarFollow(codigo) {

    if (codigoAtual <= 0)
        return;

    if (!CheckPermissao(47, true, 'Você não possui permissão para editar um follow up', false)) {
        return;
    }

    if (Selector.$('tiposcontatos').value <= 0) {
        Selector.$('retorno').focus();
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o tipo de contato.", "OK", "", false, "tiposcontatos");
        mensagem.Show();
        return;
    }

    if (Selector.$('obsfollow').value.trim() == "") {
        Selector.$('retorno').focus();
        var mensagem = new DialogoMensagens("prompt1", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo de obs.", "OK", "", false, "obsfollow");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', false);

    var p = "action=GravarFollow";
    p += "&codigo=" + codigo;
    p += "&orcamento=" + codigoAtual;
    p += "&tipo=" + Selector.$('tiposcontatos').value;
    p += "&obs=" + Selector.$('obsfollow').value;
    p += "&checkretorno=" + Selector.$('checkretorno').checked;
    p += "&retorno=" + Selector.$('retorno').value;
    p += "&horaretorno=" + Selector.$('horaretorno').value;

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 500, 150, "1", "Erro", "Erro ao gravar o follow-up. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        Selector.$('retorno').style.visibility = "hidden";
        Selector.$('horaretorno').style.visibility = "hidden";
        dialogo.Close();
        getFollow();
    }
}
//FIM FOLLOW-UP

/*function AnexarImagem() {
 var pasta = "";
 if (Selector.$('o_optPhoto').checked) {
 pasta = 'obras';
 } else if (Selector.$('o_optInsta').checked) {
 pasta = 'instaarts';
 } else {
 pasta = 'produtos';
 }
 
 var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
 var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
 var path = '../imagens/' + pasta + '/';
 var funcao = 'ArmazenarPath';
 
 DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp, zip, rar, pdf');
 }
 
 function ArmazenarPath(path) {
 
 var pasta = "";
 if (Selector.$('o_optPhoto').checked) {
 pasta = 'obras';
 } else if (Selector.$('o_optInsta').checked) {
 pasta = 'instaarts';
 } else {
 pasta = 'produtos';
 }
 
 ExcluirImagem();
 
 var vetor = path.split("/");
 var extensao = vetor[vetor.length - 1].split(".")[1];
 var arquivo = vetor[vetor.length - 1];
 
 dialog.Close();
 
 Selector.$('o_imagem').setAttribute('name', arquivo);
 Selector.$('o_imagem').setAttribute('title', 'imagens/' + pasta + '/' + arquivo + '');
 
 if (extensao == 'zip' || extensao == 'rar') {
 Selector.$('o_imagem').setAttribute('src', 'imagens/zip.png');
 Selector.$('o_imagem').style.cursor = 'pointer';
 Selector.$('o_imagem').setAttribute("onclick", "BaixarImagemReal('" + 'imagens/' + pasta + '/' + arquivo + '' + "');");
 } else if (extensao == 'pdf') {
 Selector.$('o_imagem').setAttribute('src', 'imagens/pdf.png');
 Selector.$('o_imagem').style.cursor = 'pointer';
 Selector.$('o_imagem').setAttribute('onclick', "window.open('" + "imagens/" + pasta + "/" + arquivo + "" + "')");
 } else {
 Selector.$('o_imagem').setAttribute('src', 'imagens/' + pasta + '/' + arquivo + '');
 GerarMiniaturaImagem();
 }
 }
 
 function ExcluirImagem() {
 
 var pasta = "";
 if (Selector.$('o_optPhoto').checked) {
 pasta = 'obras';
 } else if (Selector.$('o_optInsta').checked) {
 pasta = 'instaarts';
 } else {
 pasta = 'produtos';
 }
 
 if (Selector.$('o_imagem').getAttribute('name').trim() == '')
 return;
 
 var file = Selector.$('o_imagem').getAttribute('name').split(".");
 file = file[file.length - 1];
 
 var ajax = new Ajax('POST', 'php/propostas.php', false);
 var p = 'action=ExcluirImagem';
 p += '&imagem=' + file;
 p += '&pasta=' + pasta;
 ajax.Request(p);
 }
 
 function GerarMiniaturaImagem() {
 
 var pasta = "";
 if (Selector.$('o_optPhoto').checked) {
 pasta = 'obras';
 } else if (Selector.$('o_optInsta').checked) {
 pasta = 'instaarts';
 } else {
 pasta = 'produtos';
 }
 
 var ajax = new Ajax('POST', 'php/propostas.php', false);
 var p = 'action=GerarMiniaturaImagem';
 p += '&imagem=' + Selector.$('o_imagem').getAttribute('name');
 p += '&pasta=' + pasta;
 
 ajax.Request(p);
 
 var vetor = Selector.$('o_imagem').getAttribute('name').split(".");
 var extensao = vetor[vetor.length - 1];
 
 if (extensao != 'jpg' && extensao != 'jpeg') {
 
 Selector.$('o_imagem').setAttribute('name', vetor[0] + '.jpg');
 Selector.$('o_imagem').setAttribute('src', 'imagens/' + pasta + '/mini_' + vetor[0] + '.jpg');
 }
 }*/

function AnexarImagem() {

    if (arrayTamanhos.length <= 0 && arrayIdTamanhos.length <= 0) {
        MostrarMsg("Por favor, escolha os tamanhos", '');
        return;
    }

    var pasta = "";
    if (Selector.$('tipoProduto').value == '1') {
        pasta = 'obras';
    } else {
        pasta = 'instaarts';
    }

    var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
    var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
    var path = '../imagens/' + pasta + '/';
    var funcao = 'ArmazenarPath';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp');
}

function ArmazenarPath(path) {

    var pasta = "";
    if (Selector.$('tipoProduto').value == '1') {
        pasta = 'obras';
    } else {
        pasta = 'instaarts';
    }

    GerarMiniaturaImagem(path, 0);

    var vetor = path.split("/");
    var extensao = vetor[vetor.length - 1].split(".")[1];
    var arquivo = vetor[vetor.length - 1];

    var checkboxObra = DOM.newElement('checkbox', '0');
    checkboxObra.setAttribute('onclick', 'InserirLinha(' + gridObras.getRowCount() + ')');
    //checkboxObra.setAttribute('checked', 'checked');
    checkboxObra.setAttribute('idTipoProduto', 2);
    

    var imgObra = DOM.newElement('img');
    imgObra.setAttribute('name', arquivo);
    imgObra.setAttribute('src', 'imagens/' + pasta + '/' + arquivo + '');
    imgObra.setAttribute('style', 'width:120px; height:auto;');

    var divTamanhos = DOM.newElement('div', '1');

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir tamanho');
    excluir.setAttribute('style', 'cursor:pointer');
    excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + gridObras.getRowCount() + ')');

    gridObras.addRow([
        checkboxObra,
        imgObra,
        DOM.newText('INSTAARTS'),
        DOM.newText('INSTAARTS'),
        DOM.newText(Select.GetText(Selector.$('acabamento'))),
        divTamanhos,
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        excluir,
        DOM.newText(0),
        DOM.newText(Selector.$('acabamento').value),
        DOM.newText('-1'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span')
    ]);

    gridObras.hiddenCol(0);
    gridObras.hiddenCol(6);
    gridObras.hiddenCol(7);
    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);

    //gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
    //gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');

    if (arrayTamanhos.length > 0 && arrayIdTamanhos.length > 0) {
        var valor;
        var peso;
        for (var j = 0; j < arrayTamanhos.length; j++) {
            valor = 0;
            valor = CalcularValorTamanhoInstaArts(gridObras.getCellText(gridObras.getRowCount() - 1, 14), arrayIdTamanhos[j], parseFloat(arrayTamanhos[j].split('(')[1].split('x')[0]), parseFloat(arrayTamanhos[j].split(')')[0].split('x')[1]), Selector.$('moldura').value, true);
            peso = 0;
            peso = CalcularValorTamanhoInstaArts(gridObras.getCellText(gridObras.getRowCount() - 1, 14), arrayIdTamanhos[j], parseFloat(arrayTamanhos[j].split('(')[1].split('x')[0]), parseFloat(arrayTamanhos[j].split(')')[0].split('x')[1]), Selector.$('moldura').value, false);

            //id="' + arrayIdTamanhos[j] + (gridObras.getRowCount() - 1) + j + '"
            //name="' + Number.ValorE(valor) + '"
            //id="chk-' + j + '-' + (gridObras.getRowCount() -1) + '"
            //onclick="InserirSelecionado(' + (gridObras.getRowCount() - 1) + ')"
            //id="tam-' + arrayIdTamanhos[j] + '"
            gridObras.getCellObject(gridObras.getRowCount() - 1, 5).innerHTML += '<input type="checkbox" name="gname-' + (gridObras.getRowCount() - 1) + '" id="tam-' + ((gridObras2.getRowCount() <= 0 ? (gridObras.getRowCount() - 1) : gridObras2.getRowCount()) + '-' + arrayIdTamanhos[j]) + '" onclick="InserirSelecionado(' + (gridObras.getRowCount() - 1) + ', ' + arrayIdTamanhos[j] + ')"/>' +
                    //'<label for="tam-1' + ((gridObras2.getRowCount() <= 0 ? (gridObras.getRowCount() - 1) : gridObras2.getRowCount()) + '-' + arrayIdTamanhos[j]) + ' - R$ ' + valor + '</label>' +
                    '<label for="ttam-' + ((gridObras.getRowCount() - 1) + '-' + arrayIdTamanhos[j]) + '">' + arrayTamanhos[j] + ' - R$ ' + valor + '</label>' +
                    '<br>';

            gridObras.getCellObject(gridObras.getRowCount() - 1, 6).id += arrayIdTamanhos[j] + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 7).id += parseFloat(arrayTamanhos[j].split('(')[1].split('x')[0]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 8).id += parseFloat(arrayTamanhos[j].split(')')[0].split('x')[1]) + ((j + 1) < arrayTamanhos.length ? ',' : '');

            gridObras.getCellObject(gridObras.getRowCount() - 1, 9).id += Number.ValorE(valor) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            //gridObras.getCellObject(gridObras.getRowCount() - 1, 9).id += Number.ValorE(arrayTamanhos[j].split('R$')[1].trim()) + ((j + 1) < arrayTamanhos.length ? ',' : '');

            gridObras.getCellObject(gridObras.getRowCount() - 1, 10).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 11).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 16).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 17).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 18).id += Number.ValorE(peso) + ((j + 1) < arrayTamanhos.length ? ',' : '');
        }
    }

    pintaLinhaGrid(gridObras);
    dialog.Close();
}

function AdicionarInstaartsSemImagem() {

    if (arrayTamanhos.length <= 0 && arrayIdTamanhos.length <= 0) {
        MostrarMsg("Por favor, escolha os tamanhos", '');
        return;
    }

    var checkboxObra = DOM.newElement('checkbox', '0');
    checkboxObra.setAttribute('onclick', 'InserirLinha(' + gridObras.getRowCount() + ')');
    checkboxObra.setAttribute('idTipoProduto', 2);    
    //checkboxObra.setAttribute('checked', 'checked');
    //checkboxObra.checked = true;

    var imgObra = DOM.newElement('img');
    imgObra.setAttribute('name', 'semimagem.png');
    imgObra.setAttribute('src', 'imagens/semimagem.png');
    imgObra.setAttribute('style', 'width:120px; height:auto;');

    var divTamanhos = DOM.newElement('div', '1');

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir tamanho');
    excluir.setAttribute('style', 'cursor:pointer');
    excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + gridObras.getRowCount() + ')');

    gridObras.addRow([
        checkboxObra,
        imgObra,
        DOM.newText('INSTAARTS'),
        DOM.newText('INSTAARTS'),
        DOM.newText(Select.GetText(Selector.$('acabamento'))),
        divTamanhos,
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        excluir,
        DOM.newText(0),
        DOM.newText(Selector.$('acabamento').value),
        DOM.newText('-1'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span')
    ]);

    gridObras.hiddenCol(0);
    gridObras.hiddenCol(6);
    gridObras.hiddenCol(7);
    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);

    //gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');

    if (arrayTamanhos.length > 0 && arrayIdTamanhos.length > 0) {

        var valor;
        var peso;

        for (var j = 0; j < arrayTamanhos.length; j++) {
            valor = 0;
            valor = CalcularValorTamanhoInstaArts(gridObras.getCellText(gridObras.getRowCount() - 1, 14), arrayIdTamanhos[j], parseFloat(arrayTamanhos[j].split('(')[1].split('x')[0]), parseFloat(arrayTamanhos[j].split(')')[0].split('x')[1]), Selector.$('moldura').value, true);
            peso = 0;
            peso = CalcularValorTamanhoInstaArts(gridObras.getCellText(gridObras.getRowCount() - 1, 14), arrayIdTamanhos[j], parseFloat(arrayTamanhos[j].split('(')[1].split('x')[0]), parseFloat(arrayTamanhos[j].split(')')[0].split('x')[1]), Selector.$('moldura').value, false);

            gridObras.getCellObject(gridObras.getRowCount() - 1, 5).innerHTML += '<input type="checkbox" name="gname-' + (gridObras.getRowCount() - 1) + '" id="tam-' + ((gridObras.getRowCount() - 1) + '-' + arrayIdTamanhos[j]) + '" onclick="InserirSelecionado(' + (gridObras.getRowCount() - 1) + ', ' + arrayIdTamanhos[j] + ')"/>' +
                    '<label for="ttam-' + ((gridObras.getRowCount() - 1) + '-' + arrayIdTamanhos[j]) + '">' + arrayTamanhos[j] + ' - R$ ' + valor + '</label>' +
                    '<br>';

            gridObras.getCellObject(gridObras.getRowCount() - 1, 6).id += arrayIdTamanhos[j] + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 7).id += parseFloat(arrayTamanhos[j].split('(')[1].split('x')[0]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 8).id += parseFloat(arrayTamanhos[j].split(')')[0].split('x')[1]) + ((j + 1) < arrayTamanhos.length ? ',' : '');

            gridObras.getCellObject(gridObras.getRowCount() - 1, 9).id += Number.ValorE(valor) + ((j + 1) < arrayTamanhos.length ? ',' : '');

            gridObras.getCellObject(gridObras.getRowCount() - 1, 10).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 11).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 16).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 17).id += '0' + ((j + 1) < arrayTamanhos.length ? ',' : '');
            gridObras.getCellObject(gridObras.getRowCount() - 1, 18).id += Number.ValorE(peso) + ((j + 1) < arrayTamanhos.length ? ',' : '');
        }
    }

    pintaLinhaGrid(gridObras);
}

function GerarMiniaturaImagem(path, tipo) {

    var pasta = "";
    if (tipo == 0) {

        if (Selector.$('tipoProduto').value == '1') {
            pasta = 'obras';
        } else {
            pasta = 'instaarts';
        }
    } else {
        pasta = 'instaarts';
    }

    var vetor = path.split("/");
    var arquivo = vetor[vetor.length - 1];

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=GerarMiniaturaImagem';
    p += '&imagem=' + arquivo;
    p += '&pasta=' + pasta;

    ajax.Request(p);
}

function GerarPdfOrcamento() {

    if (!CheckPermissao(45, true, 'Você não possui permissão para gerar o pdf do orçamento', false)) {
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=GerarPdfOrcamento';
    p += '&idOrcamento=' + codigoAtual;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgPdfOrcamento').setAttribute('src', 'imagens/relatorio.png');

        if (ajax.getResponseText() != '') {
            window.open(ajax.getResponseText());
        }
    }

    Selector.$('imgPdfOrcamento').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function EnviarPdfOrcamentoEmailAux() {

    if (!isElement('div', 'divMensagemEmail')) {
        var divMensagemEmail = DOM.newElement('div', 'divMensagemEmail');
        document.body.appendChild(divMensagemEmail);
    }

    var divMensagemEmail = Selector.$('divMensagemEmail');
    divMensagemEmail.innerHTML = '';
    var lblNome = DOM.newElement('label');
    lblNome.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNome.innerHTML = 'Mensagem';

    var txtarea = DOM.newElement('textarea');
    txtarea.setAttribute('class', 'textbox_cinzafoco');
    txtarea.setAttribute('style', 'width:600px; height:100px;');
    txtarea.setAttribute('id', 'mensagemopc');
    divMensagemEmail.appendChild(txtarea);

    divMensagemEmail.innerHTML += "<br/>";
    divMensagemEmail.innerHTML += "<br/>";

    var cmdPesquisar = DOM.newElement('button', 'cliente_pesquisar');
    cmdPesquisar.setAttribute('style', 'float:right;');
    cmdPesquisar.setAttribute('class', 'botaosimplesfoco');
    cmdPesquisar.setAttribute('onclick', 'EnviarPdfOrcamentoEmail()');
    cmdPesquisar.innerHTML = 'Enviar';
    divMensagemEmail.appendChild(cmdPesquisar);

    dialogoMsg = new caixaDialogo('divMensagemEmail', 300, 650, 'padrao/', 130);
    dialogoMsg.Show();

    tinyMCE.init({
        selector: 'textarea#mensagemopc',
        theme: "modern",
        entity_encoding: "raw",
        language: "pt_BR",
    });
}

function EnviarPdfOrcamentoEmail() {

    if (!CheckPermissao(46, true, 'Você não possui permissão para enviar o pdf do orçamento por email', false)) {
        return;
    }

    if (Selector.$('email').value.trim() == '' || Selector.$('email').value.trim() == 'não possui') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "Este cliente não possui e-mail cadastrado, cadastre um e-mail para enviar o orçamento.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var descricao = tinyMCE.get('mensagemopc').getContent();
    
    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=EnviarPdfOrcamentoEmail';
    p += '&idOrcamento=' + codigoAtual;
    p += '&cliente=' + Select.GetText(Selector.$('cliente'));
    p += '&email=' + Selector.$('email').value;
    p += '&dataValidade=' + Selector.$('validade').getAttribute('name');
    p += '&vendedor=' + Selector.$('vendedor').value;
    p += '&nomeVendedor=' + Select.GetText(Selector.$('vendedor'));
    //p += '&mensagemopc=' + descricao.encodeText();
    p += '&mensagemopc=' + descricao;

    dialogoMsg.Close();
    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgOrcamentoEmail').setAttribute('src', 'imagens/email2.png');

        if (ajax.getResponseText() == '1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;                        
        } else {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o orçamento por email. Se o erro persistir contate o suporte técnico. - " + ajax.getResponseText(), "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('imgOrcamentoEmail').setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function DuplicarObra(linha) {

    var divEditarDuplicar = DOM.newElement('div');

    var editar = DOM.newElement('img');
    editar.setAttribute('src', 'imagens/modificar.png');
    editar.setAttribute('title', 'Editar');
    editar.setAttribute('style', 'width:15px; display:inline-block');
    editar.setAttribute('class', 'efeito-opacidade-75-04');
    editar.setAttribute('onclick', 'AdicionarObra(' + gridObras.getRowCount() + ')');

    var duplicar = DOM.newElement('img');
    duplicar.setAttribute('src', 'imagens/duplicate.png');
    duplicar.setAttribute('title', 'Duplicar Obra');
    duplicar.setAttribute('style', 'height:14px; display:inline-block; margin-left:10px;');
    duplicar.setAttribute('class', 'efeito-opacidade-75-04');
    duplicar.setAttribute('onclick', 'DuplicarObra(' + gridObras.getRowCount() + ')');

    divEditarDuplicar.appendChild(editar);
    divEditarDuplicar.appendChild(duplicar);

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir');
    excluir.setAttribute('class', 'efeito-opacidade-75-04');
    excluir.setAttribute('style', 'width:15px;');
    excluir.setAttribute('onclick', 'ExcluirObraAux(' + gridObras.getRowCount() + ')');

    var pasta = 'obras';
    var imgelemento = DOM.newElement('img');
    imgelemento.setAttribute('id', 'o_imagem2');
    imgelemento.setAttribute('class', 'textbox_cinzafoco');
    imgelemento.setAttribute('src', 'imagens/' + pasta + '/mini_' + gridObras.getCellObject(linha, 1).getAttribute('name'));
    imgelemento.setAttribute('name', gridObras.getCellObject(linha, 1).getAttribute('name'));
    imgelemento.setAttribute('style', 'cursor:pointer; title="Ver Imagem"; width:60px; height:60px;');
    imgelemento.setAttribute("onclick", "MostraImagemTamanhoReal('imagens/obras/" + gridObras.getCellObject(linha, 1).getAttribute('name') + "');");

    gridObras.addRow([
        DOM.newText(gridObras.getRowCount()),
        imgelemento,
        DOM.newText(gridObras.getCellText(linha, 2)),
        DOM.newText(gridObras.getCellText(linha, 3)),
        DOM.newText(gridObras.getCellText(linha, 4)),
        DOM.newText(gridObras.getCellText(linha, 5)),
        DOM.newText(gridObras.getCellText(linha, 6)),
        DOM.newText(gridObras.getCellText(linha, 7)),
        DOM.newText(gridObras.getCellText(linha, 8)),
        DOM.newText(gridObras.getCellText(linha, 9)),
        DOM.newText(gridObras.getCellText(linha, 10)),
        divEditarDuplicar,
        excluir,
        DOM.newText(gridObras.getCellText(linha, 13)),
        DOM.newText(gridObras.getCellText(linha, 14)),
        DOM.newText(gridObras.getCellText(linha, 15)),
        DOM.newText(gridObras.getCellText(linha, 16)),
        DOM.newText(gridObras.getCellText(linha, 17)),
        DOM.newText(gridObras.getCellText(linha, 18)),
        DOM.newText(gridObras.getCellText(linha, 19)),
        DOM.newText(gridObras.getCellText(linha, 20)),
        DOM.newText(gridObras.getCellText(linha, 21)),
        DOM.newText(gridObras.getCellText(linha, 22)),
        DOM.newText(gridObras.getCellText(linha, 23)),
        DOM.newText(gridObras.getCellText(linha, 24)),
        DOM.newText(gridObras.getCellText(linha, 25)),
        DOM.newText(gridObras.getCellText(linha, 26)),
        DOM.newText(gridObras.getCellText(linha, 27)),
        DOM.newText(gridObras.getCellText(linha, 28)),
        DOM.newText(gridObras.getCellText(linha, 29)),
        DOM.newText(gridObras.getCellText(linha, 30)),
        DOM.newText(gridObras.getCellText(linha, 31))
    ]);


    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);
    gridObras.hiddenCol(19);
    gridObras.hiddenCol(20);
    gridObras.hiddenCol(21);
    gridObras.hiddenCol(22);
    gridObras.hiddenCol(23);
    gridObras.hiddenCol(24);
    gridObras.hiddenCol(25);
    gridObras.hiddenCol(26);
    gridObras.hiddenCol(27);
    gridObras.hiddenCol(28);
    gridObras.hiddenCol(29);
    gridObras.hiddenCol(30);
    gridObras.hiddenCol(31);

    gridObras.setRowData(gridObras.getRowCount() - 1, 0);
    gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:20px');
    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;width:40px');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;width:40px');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:right; width:100px');
    gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:center;');
    gridObras.getCell(gridObras.getRowCount() - 1, 9).setAttribute('style', 'text-align:right;');
    gridObras.getCell(gridObras.getRowCount() - 1, 10).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:50px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:20px');

    var cor = false;
    for (var i = 0; i <= gridObras.getRowCount() - 1; i++) {

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(i, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(i, "#FFF");
        }
    }

    Totaliza(true, true, true, true, true);
}

function cliente_onblur() {

    if (Selector.$('contato').value.trim() == '') {
        LoadDadosCliente();
        getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);

        if (Selector.$('enderecos').length == 2) {
            Selector.$('tipoTransporte').focus();
        }
    }
}

function VerificarAcabamento() {

    if (Selector.$('tipoProduto').value == '0') {
        Select.Clear(Selector.$('acabamento'));
        Select.AddItem(Selector.$('acabamento'), 'Selecione um tipo de produto', 0);
        gridObras.clearRows();
        return;
    } else {
        getAcabamentos(Selector.$('acabamento'), 'Selecione um acabamento', false, (Selector.$('tipoProduto').value == '1' ? 'p' : 'i'));

        if (Selector.$('tipoProduto').value == '2') {
            //gridObras.clearRows();
            Selector.$('divProdutos').style.display = 'none';
            Selector.$('divQuantidade').style.display = 'none';
            Selector.$('divValor').style.display = 'none';
            Selector.$('btAdicionarProduto').style.display = 'none';
            Selector.$('divAcabamento').style.display = 'inline-block';
            Selector.$('divGrupoMoldura').style.display = 'inline-block';
            Selector.$('divMoldura').style.display = 'inline-block';
            Selector.$('escolherTamanho').style.display = 'inline-block';
            Selector.$('adicionarObra').style.display = 'inline-block';
            Selector.$('adicionarInstaSemImagem').style.display = 'inline-block';
            Selector.$('divArtista').style.display = 'none';
            Selector.$('divAltura').style.display = 'none';
            Selector.$('divLargura').style.display = 'none';
            gridObras.clearRows();
        } else if (Selector.$('tipoProduto').value == '1') {
            Selector.$('divProdutos').style.display = 'none';
            Selector.$('divQuantidade').style.display = 'none';
            Selector.$('divValor').style.display = 'none';
            Selector.$('btAdicionarProduto').style.display = 'none';
            Selector.$('divAcabamento').style.display = 'inline-block';
            Selector.$('divGrupoMoldura').style.display = 'inline-block';
            Selector.$('divMoldura').style.display = 'inline-block';
            Selector.$('escolherTamanho').style.display = 'none';
            Selector.$('adicionarObra').style.display = 'none';
            Selector.$('adicionarInstaSemImagem').style.display = 'none';
            Selector.$('divArtista').style.display = 'inline-block';
            Selector.$('divAltura').style.display = 'inline-block';
            Selector.$('divLargura').style.display = 'inline-block';
            gridObras.clearRows();
        } else {

            Selector.$('divProdutos').style.display = 'inline-block';
            Selector.$('divQuantidade').style.display = 'inline-block';
            Selector.$('divValor').style.display = 'inline-block';
            Selector.$('btAdicionarProduto').style.display = 'inline-block';
            Selector.$('divAcabamento').style.display = 'none';
            Selector.$('divGrupoMoldura').style.display = 'none';
            Selector.$('divMoldura').style.display = 'none';
            Selector.$('divAltura').style.display = 'none';
            Selector.$('divLargura').style.display = 'none';
            Selector.$('divArtista').style.display = 'none';
            Selector.$('escolherTamanho').style.display = 'none';
            Selector.$('adicionarObra').style.display = 'none';
            Selector.$('adicionarInstaSemImagem').style.display = 'none';
            gridObras.clearRows();
            return;
        }

        MostrarObras();
    }
}

function MostrarObras() {

    if (Selector.$('tipoProduto').value == '1' || codigoAtual > 0) {

        if (Selector.$('acabamento').selectedIndex <= 0) {
            LimparGridObras();
            Selector.$('msgLoad').innerHTML = "Selecione um acabamento";
            return;
        }

        if (Selector.$('tipoProduto').value == '1') {
            if (Selector.$('artista').selectedIndex <= 0) {
                LimparGridObras();
                Selector.$('msgLoad').innerHTML = "Selecione um artista";
                return;
            }
        }

        var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
        var p = 'action=MostrarObras';
        p += '&idOrcamentoSimplificado=' + codigoAtual;
        p += '&idAcabamento=' + Selector.$('acabamento').value;
        p += '&idArtista=' + Selector.$('artista').value;
        p += '&idMoldura=' + Selector.$('moldura').value;
        p += '&salvas=0';
        p += '&altura=' + Selector.$('altura2').value.trim();
        p += '&largura=' + Selector.$('largura2').value.trim();
        p += '&item=' + Selector.$('tipoProduto').value;
        p += '&idsTamanhos=' + arrayIdTamanhos;

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            //LimparGridObras();
            gridObras.clearRows();

            if (ajax.getResponseText() == '0') {
                Selector.$('divObras').innerHTML = '';
                Selector.$('msgLoad').innerHTML = "Nenhuma obra encontrada";
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            Selector.$('msgLoad').innerHTML = json.length + " obra(s) encontrada(s)";

            for (var i = 0; i < json.length; i++) {

                var checkboxObra = DOM.newElement('checkbox', json[i].idArtistaObra);
                checkboxObra.setAttribute('idTipoProduto', 1);

                var imgObra = DOM.newElement('img');
                imgObra.setAttribute('src', 'imagens/' + (Selector.$('tipoProduto').value == '1' ? 'obras' : 'instaarts') + '/' + json[i].imagem);
                imgObra.setAttribute('style', 'width:120px; height:auto;');
                imgObra.setAttribute('name', json[i].imagem);

                var divTamanhos = DOM.newElement('div', '1');

                var excluir = DOM.newElement('img');
                excluir.setAttribute('src', 'imagens/lixo.png');
                excluir.setAttribute('title', 'Excluir tamanho');
                excluir.setAttribute('style', 'cursor:pointer');
                excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + i + ')');

                gridObras.addRow([
                    checkboxObra,
                    imgObra,
                    DOM.newText(Select.GetText(Selector.$('artista'))),
                    DOM.newText(json[i].nomeObra),
                    DOM.newText(Select.GetText(Selector.$('acabamento'))),
                    divTamanhos,
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    excluir,
                    DOM.newText(Selector.$('artista').value),
                    DOM.newText(Selector.$('acabamento').value),
                    DOM.newText('-1'),
                    DOM.newElement('span'),
                    DOM.newElement('span'),
                    DOM.newElement('span')
                ]);

                gridObras.hiddenCol(6);
                gridObras.hiddenCol(7);
                gridObras.hiddenCol(8);
                gridObras.hiddenCol(9);
                gridObras.hiddenCol(10);
                gridObras.hiddenCol(11);
                gridObras.hiddenCol(12);
                gridObras.hiddenCol(13);
                gridObras.hiddenCol(14);
                gridObras.hiddenCol(15);
                gridObras.hiddenCol(16);
                gridObras.hiddenCol(17);
                gridObras.hiddenCol(18);

                gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px;');
                gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
                gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
                gridObras.getCell(gridObras.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');

                if (json[i].tamanhos != '0') {

                    var jsonTamanhos = JSON.parse(json[i].tamanhos);
                    var lin = gridObras.getRowCount() - 1;

                    for (var j = 0; j < jsonTamanhos.length; j++) {

                        arraySelecionados.push(jsonTamanhos[j].selecionado);
                        gridObras.getCellObject(lin, 5).innerHTML += '<input name="' + lin + '" type="checkbox" ' + (jsonTamanhos[j].selecionado == '1' ? 'checked' : '') + ' onclick="InserirSelecionado(' + lin + ', ' + jsonTamanhos[j].idArtistaObraTamanho + ')" id="tam-' + jsonTamanhos[j].idArtistaObraTamanho + '"/><label>' + jsonTamanhos[j].nomeTamanho + ' (' + jsonTamanhos[j].altura + 'x' + jsonTamanhos[j].largura + ')' + ' - R$' + jsonTamanhos[j].valor + ' | Qtd. Vendido: ' + jsonTamanhos[j].qtdTotalVendida + ' - Estrelas: <label id="lbl-estr-' + i + '-' + jsonTamanhos[j].idArtistaObraTamanho + '" name="' + jsonTamanhos[j].estrelas + '">' + jsonTamanhos[j].estrelas + '</label></label><br>';
                        gridObras.getCellObject(lin, 6).id += jsonTamanhos[j].idArtistaObraTamanho + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 7).id += jsonTamanhos[j].altura + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 8).id += jsonTamanhos[j].largura + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 9).id += Number.ValorE(jsonTamanhos[j].valor) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 10).id += jsonTamanhos[j].selecionado + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 11).id += jsonTamanhos[j].idOrcamentoSimplificadoComp + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 16).id += jsonTamanhos[j].estrelas + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 17).id += jsonTamanhos[j].qtdTotalVendida + ((j + 1) < jsonTamanhos.length ? ',' : '');
                        gridObras.getCellObject(lin, 18).id += jsonTamanhos[j].pesoObra + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    }
                }
            }

            if (Selector.$('tipoProduto').value == '1') {
                gridObras.hiddenCol(12);
            } else {
                gridObras.visibleCol(12);
            }

            pintaLinhaGrid(gridObras);

            if (gridObras2.getRowCount() > 0 && Selector.$('tipoProduto').value == '1') {

                for (var k = 0; k < gridObras.getRowCount(); k++) {

                    for (var l = 0; l < gridObras2.getRowCount(); l++) {

                        if (gridObras2.getCellText(l, 13) == gridObras.getCellText(k, 13) && gridObras2.getRowData(l) == gridObras.getCellObject(k, 0).id && gridObras2.getCellText(l, 14) == gridObras.getCellText(k, 14)) {
                            gridObras.getCellObject(k, 0).checked = true;
                            gridObras.setCellText(k, 15, l);

                            gridObras.getCell(k, 5).innerHTML = '';

                            var cloneTamanhos = gridObras2.getCellObject(l, 5).cloneNode(true);
                            var conteudoTamanhos = gridObras2.getCellObject(l, 5).innerHTML.replace(/id="tam-f-/g, 'id="tam-').replace(/id="lbl-estr-f-/g, 'id="lbl-estr-');

                            var divTamanhos = DOM.newElement('div');
                            divTamanhos.innerHTML = conteudoTamanhos;
                            gridObras.setCellObject(k, 5, divTamanhos);

                            gridObras2.setCellObject(l, 5, cloneTamanhos);

                            gridObras.getCellObject(k, 10).id = gridObras2.getCellObject(l, 10).id;
                            gridObras.getCellObject(k, 11).id = gridObras2.getCellObject(l, 11).id;
                            gridObras.getCellObject(k, 16).id = gridObras2.getCellObject(l, 18).id;
                            gridObras.getCellObject(k, 17).id = gridObras2.getCellObject(l, 19).id;
                        }
                    }

                    if (Selector.$('divCadastro').style.visibility == 'visible') {

                        var qtd = gridObras.getCellObject(k, 6).id.split(',').length;
                        var idTamanho = gridObras.getCellObject(k, 6).id.split(',');
                        var selecionado = gridObras.getCellObject(k, 10).id.split(',');
                        for (var m = 0; m < qtd; m++) {

                            Selector.$('tam-' + idTamanho[m]).setAttribute('onclick', 'InserirSelecionado(' + k + ', ' + idTamanho[m] + ')');
                            if (selecionado[m] == 1) {
                                Selector.$('tam-' + idTamanho[m]).checked = true;
                            }
                        }
                    }
                }
            }
        };

        Selector.$('msgLoad').innerHTML = "Aguarde, carregando obras...";
        ajax.Request(p);
    } else {

        Selector.$('divArtista').style.display = 'none';
        Selector.$('msgLoad').innerHTML = '';
    }
}

function LimparGridObras() {
    var total = gridObras.getRowCount();

    for (var i = gridObras.getRowCount() - 1; i >= 0; i--) {

        if (!gridObras.getCellObject(i, 0).checked) {
            gridObras.deleteRow(i);
        }
    }
}

function SelecionarAcabamento() {

    if (Selector.$('artista').selectedIndex > 0) {
        MostrarObras();
    }

    if (Selector.$('acabamento').selectedIndex <= 0) {
        Selector.$('msgLoad').style.display = 'inline-block';
    } else {
        Selector.$('msgLoad').style.display = 'none';
    }
}

function PromptEscolherTamanhos() {

    if (Selector.$('acabamento').selectedIndex <= 0) {
        MostrarMsg("Por favor, selecione um acabamento", 'acabamento');
        return;
    }

    if (!isElement('div', 'divPromptEscolherTamanhos')) {
        var div = DOM.newElement('div', 'divPromptEscolherTamanhos');
        document.body.appendChild(div);
    }

    var divPromptEscolherTamanhos = Selector.$('divPromptEscolherTamanhos');
    divPromptEscolherTamanhos.setAttribute('style', 'text-align:left;');
    divPromptEscolherTamanhos.setAttribute('align', 'left');
    divPromptEscolherTamanhos.innerHTML = '';

    //INSTAARTS
    var divI = DOM.newElement('div', 'o_divInstaarts');
    divI.setAttribute('style', 'margin-top:10px; text-align:left;');

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanhoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:260px; margin-left:4px');
    elemento.setAttribute('onchange', 'VerificarTamanho()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    var divAlturaLargura = DOM.newElement('div', 'divAlturaLargura');
    divAlturaLargura.setAttribute('style', 'width:310px; display:none; margin-left:10px;');

    lblAltura = DOM.newElement('label');
    lblAltura.innerHTML = 'Altura ';
    lblAltura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAltura.setAttribute('style', 'margin-left:0px');

    divAlturaLargura.appendChild(lblAltura);

    var altura = DOM.newElement('input', 'altura');
    altura.setAttribute('class', 'textbox_cinzafoco');
    altura.setAttribute('style', 'width:100px;');

    divAlturaLargura.appendChild(altura);

    lblLargura = DOM.newElement('label');
    lblLargura.innerHTML = 'Largura ';
    lblLargura.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblLargura.setAttribute('style', 'margin-left:10px');

    divAlturaLargura.appendChild(lblLargura);

    var largura = DOM.newElement('input', 'largura');
    largura.setAttribute('class', 'textbox_cinzafoco');
    largura.setAttribute('style', 'width:100px; margin-left:5px');

    divAlturaLargura.appendChild(largura);
    divI.appendChild(divAlturaLargura);

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'float:right;');
    elemento.setAttribute('onclick', 'IncluirTamanho(true);');
    elemento.innerHTML = "Incluir";
    divI.appendChild(elemento);

    var divTamanhos = DOM.newElement('div', 'divTamanhos');
    divTamanhos.setAttribute('style', 'width:100%; height:250px; border:1px solid lightgray; overflow:auto;');
    divI.appendChild(divTamanhos);

    divPromptEscolherTamanhos.appendChild(divI);

    elemento = DOM.newElement('button');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'float:right;');
    elemento.setAttribute('onclick', 'ArmazenarTamanhos(true, true);');
    elemento.innerHTML = "OK";

    divPromptEscolherTamanhos.innerHTML += '<br>';
    divPromptEscolherTamanhos.appendChild(elemento);

    dialogoTamanhos = new caixaDialogo('divPromptEscolherTamanhos', 390, 445, 'padrao/', 131);
    dialogoTamanhos.Show();

    Mask.setMoeda(Selector.$('altura'));
    Mask.setMoeda(Selector.$('largura'));

    gridTamanhos = new Table('gridTamanhos');
    gridTamanhos.table.setAttribute('cellpadding', '4');
    gridTamanhos.table.setAttribute('cellspacing', '0');
    gridTamanhos.table.setAttribute('class', 'tabela_cinza_foco');

    gridTamanhos.addHeader([
        DOM.newText('Tamanho'),
        DOM.newText(''),
        DOM.newText('')
    ]);

    Selector.$('divTamanhos').appendChild(gridTamanhos.table);
    gridTamanhos.hiddenCol(2);

    gridTamanhos.clearRows();
    Selector.$('divPromptEscolherTamanhos').setAttribute('class', 'divbranca');
    Selector.$('divPromptEscolherTamanhos').style.overflow = 'hidden';
    getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', false);
    Mask.setMoeda(Selector.$('altura'));
    Mask.setMoeda(Selector.$('largura'));
    Selector.$('o_tamanhoI').focus();

    if (arrayTamanhos.length > 0 && arrayIdTamanhos.length > 0 && codigoAtual <= 0) {

        for (var i = 0; i < arrayTamanhos.length; i++) {

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir tamanho');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'ExcluirTamanho(' + gridTamanhos.getRowCount() + ')');

            gridTamanhos.addRow([
                DOM.newText(arrayTamanhos[i]),
                excluir,
                DOM.newText(arrayIdTamanhos[i])
            ]);

            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
            gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:30px;');

            gridTamanhos.hiddenCol(2);
            pintaLinhaGrid(gridTamanhos);
        }
    } else {

        for (var i = 0; i < gridObras.getRowCount(); i++) {

            if (gridObras.getRow(i).style.display != 'none') {

                var idsTamanhos = gridObras.getCellObject(i, 6).id.split(',');
                var alturas = gridObras.getCellObject(i, 7).id.split(',');
                var larguras = gridObras.getCellObject(i, 8).id.split(',');

                for (var j = 0; j < idsTamanhos.length; j++) {

                    Selector.$('o_tamanhoI').value = idsTamanhos[j];

                    if (Selector.$('o_tamanhoI').selectedIndex == 1) {
                        VerificarTamanho();
                        Selector.$('altura').value = Number.FormatMoeda(alturas[j]);
                        Selector.$('largura').value = Number.FormatMoeda(larguras[j]);
                    }

                    IncluirTamanho(false);
                }
            }
        }

        //Selector.$('o_tamanhoI').value = 0;
        Selector.$('o_tamanhoI').selectedIndex = 1;
        //Selector.$('divAlturaLargura').style.display = 'none';
        //dialogoTamanhos.Realinhar(390, 445);
        VerificarTamanho();
        ArmazenarTamanhos(false, false);
    }
}

function VerificarTamanho() {

    Selector.$('altura').value = '';
    Selector.$('largura').value = '';

    if (Selector.$('o_tamanhoI').selectedIndex == 1) {
        Selector.$('divAlturaLargura').style.display = 'inline-block';
        dialogoTamanhos.Realinhar(390, 760);
        Selector.$('altura').focus();
    } else {
        Selector.$('divAlturaLargura').style.display = 'none';
        dialogoTamanhos.Realinhar(390, 445);
    }
}

function IncluirTamanho(mensagem) {

    if (Selector.$('o_tamanhoI').selectedIndex == 1) {

        if (Selector.$('altura').value.trim() == ',' || Selector.$('altura').value.trim() == '') {
            MostrarMsg("Por favor, informe a altura", 'altura');
            return;
        }

        if (Selector.$('largura').value.trim() == ',' || Selector.$('largura').value.trim() == '') {
            MostrarMsg("Por favor, informe a largura", 'largura');
            return;
        }
    } else {

        if (Selector.$('o_tamanhoI').selectedIndex <= 0) {
            MostrarMsg("Por favor, selecione um tamanho", 'o_tamanhoI');
            return;
        }
    }

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        if (Selector.$('o_tamanhoI').selectedIndex == 1) {

            if (gridTamanhos.getCellText(i, 0).trim() == 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ')') {
                if (mensagem) {
                    MostrarMsg("Este tamanho já foi adicionado", '');
                }
                return;
            }
        } else {

            if (gridTamanhos.getCellText(i, 0).split(' - ')[0] == Select.GetText(Selector.$('o_tamanhoI'))) {
                if (mensagem) {
                    MostrarMsg("Este tamanho já foi adicionado", '');
                }
                return;
            }
        }
    }

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir tamanho');
    excluir.setAttribute('style', 'cursor:pointer');
    excluir.setAttribute('onclick', 'ExcluirTamanho(' + gridTamanhos.getRowCount() + ')');

    gridTamanhos.addRow([
        //DOM.newText((Selector.$('o_tamanhoI').selectedIndex == 1 ? 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ') - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value) : Select.GetText(Selector.$('o_tamanhoI')) + ' - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value))),
        DOM.newText((Selector.$('o_tamanhoI').selectedIndex == 1 ? 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ') ' : Select.GetText(Selector.$('o_tamanhoI')))),
        excluir,
        DOM.newText(Selector.$('o_tamanhoI').value)
    ]);

    gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;');
    gridTamanhos.getCell(gridTamanhos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:30px;');

    gridTamanhos.hiddenCol(2);
    pintaLinhaGrid(gridTamanhos);

    Selector.$('altura').value = '';
    Selector.$('largura').value = '';
}

function ArmazenarTamanhos(fechar, incluir) {

    arrayTamanhos.length = 0;
    arrayIdTamanhos.length = 0;
    arraySelecionados.length = 0;

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {

        arrayTamanhos.push(gridTamanhos.getCellText(i, 0));
        arrayIdTamanhos.push(gridTamanhos.getCellText(i, 2));
    }

    if (fechar) {
        dialogoTamanhos.Close();
    }

    /*if (codigoAtual > 0 && Selector.$('tipoProduto').value == '2' && incluir) {
     
     for (var i = 0; i < gridObras.getRowCount(); i++) {
     
     gridObras.getCellObject(i, 5).innerHTML = '';
     gridObras.getCellObject(i, 6).id = '';
     gridObras.getCellObject(i, 7).id = '';
     gridObras.getCellObject(i, 8).id = '';
     gridObras.getCellObject(i, 9).id = '';
     var aux = gridObras.getCellObject(i, 10).id;
     gridObras.getCellObject(i, 10).id = '';           
     
     var valor;
     
     for (var j = 0; j < arrayTamanhos.length; j++) {
     valor = 0;
     valor = CalcularValorTamanhoInstaArts(gridObras.getCellText(i, 14), arrayIdTamanhos[j], arrayTamanhos[j].split('(')[1].split('x')[0], arrayTamanhos[j].split(')')[0].split('x')[1], Selector.$('moldura').value);
     
     gridObras.getCellObject(i, 5).innerHTML += '<input type="checkbox" id="' + arrayIdTamanhos[j] + (i) + '' + (j) + '" onclick="InserirSelecionado(' + i + ')" ' + (aux.split(',')[j] == '1' ? 'checked' : '') + '/>' + 
     '<label for="' + arrayIdTamanhos[j] + (i) + '' + (j) + '">' + arrayTamanhos[j] + ' - R$ ' + valor + '</label>' + 
     '<br>';                
     
     gridObras.getCellObject(i, 6).id += arrayIdTamanhos[j] + ((j + 1) < arrayTamanhos.length ? ',' : '');
     gridObras.getCellObject(i, 7).id += Number.ValorE(arrayTamanhos[j].split('(')[1].split('x')[0]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
     gridObras.getCellObject(i, 8).id += Number.ValorE(arrayTamanhos[j].split(')')[0].split('x')[1]) + ((j + 1) < arrayTamanhos.length ? ',' : '');
     //gridObras.getCellObject(i, 7).id += Number.ValorE(arrayTamanhos[j].split('R$')[1].trim()) + ((j + 1) < arrayTamanhos.length ? ',' : '');
     
     //DOM.newText((Selector.$('o_tamanhoI').selectedIndex == 1 ? 'PERSONALIZADO (' + Selector.$('altura').value + 'x' + Selector.$('largura').value + ') - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value) : Select.GetText(Selector.$('o_tamanhoI')) + ' - R$' + CalcularValorTamanhoInstaArts(Selector.$('acabamento').value, Selector.$('o_tamanhoI').value, Selector.$('altura').value, Selector.$('largura').value))),
     
     gridObras.getCellObject(i, 9).id += Number.ValorE(valor) + ((j + 1) < arrayTamanhos.length ? ',' : '');
     
     gridObras.getCellObject(i, 10).id += (Selector.$(arrayIdTamanhos[j] + (i) + '' + j).checked ? '1' : '0') + ((j + 1) < arrayTamanhos.length ? ',' : '');
     //gridObras.getCellObject(i, 9).id += '0' + ((j+1) < arrayTamanhos.length ? ',' : '');
     }
     }
     }*/
}

function ExcluirTamanho(linha) {

    gridTamanhos.deleteRow(linha);

    for (var i = 0; i < gridTamanhos.getRowCount(); i++) {
        gridTamanhos.getCellObject(i, 1).setAttribute('onclick', 'ExcluirTamanho(' + i + ')');
    }

    pintaLinhaGrid(gridTamanhos);
}

function CalcularValorTamanhoInstaArts(idAcabamento, idTamanho, altura, largura, idMoldura, valorOuPeso) {

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', false);
    var p = 'action=CalcularValorTamanhoInstaArts';
    p += '&idAcabamento=' + idAcabamento;
    p += '&idTamanho=' + idTamanho;
    p += '&idMoldura=' + idMoldura;
    p += '&altura=' + altura;
    p += '&largura=' + largura;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return '0,00';
    } else {

        var json = JSON.parse(ajax.getResponseText());

        if (valorOuPeso) {
            //return ajax.getResponseText();
            return json.valorObra;
        } else {
            return json.pesoObra;
        }
    }
}

function ExcluirInstaartsAux(linha) {

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", "Deseja realmente excluir esta imagem?", "OK", "ExcluirInstaarts(" + linha + ");", true, "");
    mensagemExcluirObra.Show();
}

function ExcluirInstaarts(linha) {

    gridObras.deleteRow(linha);

    for (var i = 0; i < gridObras.getRowCount(); i++) {
        gridObras.getCellObject(i, 10).setAttribute('onclick', 'ExcluirInstaartsAux(' + i + ')');
    }

    pintaLinhaGrid(gridObras);
    mensagemExcluirObra.Close();
}

function InserirSelecionado(linha, idCheck) {

    var qtdSelecionados = 0;
    selecionados.length = 0;
    arraySelecionados.length = 0;
    arrayEstrelas.length = 0;

    if (isElement('div', 'divCadastro') && Selector.$('divCadastro').style.visibility == 'visible') {

        var qtd = gridObras.getCellObject(linha, 11).id.split(',').length;
        var idTamanho = gridObras.getCellObject(linha, 6).id.split(',');
        for (var i = 0; i < qtd; i++) {
            if (gridObras.getCellObject(linha, 0).id == '0') {

                if ((isElement('input', 'tam-' + linha + '-' + idTamanho[i]) && Selector.$('tam-' + linha + '-' + idTamanho[i]).checked) || (isElement('input', 'tam-' + gridObras2.getRowCount() + '-' + idTamanho[i]) && Selector.$('tam-' + gridObras2.getRowCount() + '-' + idTamanho[i]).checked)) {
                    selecionados.push(1);
                    arraySelecionados.push(1);
                    qtdSelecionados++;
                } else {
                    selecionados.push(0);
                    arraySelecionados.push(0);
                }
            } else {

                if (Selector.$('tam-' + idTamanho[i]).checked) {
                    arrayEstrelas.push(AtualizaEstrela2(linha, idTamanho[i], true, gridObras.getCellText(linha, 3), gridObras.getCellText(linha, 2)));
                    selecionados.push(1);
                    arraySelecionados.push(1);
                    qtdSelecionados++;
                } else {
                    selecionados.push(0);
                    arraySelecionados.push(0);
                    arrayEstrelas.push(AtualizaEstrela2(linha, idTamanho[i], false, '', ''));
                }
            }
        }

        gridObras.getCellObject(linha, 10).id = selecionados;
        gridObras.getCellObject(linha, 16).id = arrayEstrelas;

        if (qtdSelecionados <= 0) {
            gridObras.getCellObject(linha, 0).checked = false;
        } else {
            gridObras.getCellObject(linha, 0).checked = true;
        }

    } else {

        var qtd = gridObras2.getCellObject(linha, 6).id.split(',').length;
        var idTamanho = gridObras2.getCellObject(linha, 6).id.split(',');
        for (var i = 0; i < qtd; i++) {

            if (gridObras2.getCellText(linha, 17) == '2' || gridObras2.getCellText(linha, 17) == 2) {
                //isElement('input', 'tam-f-' + i + '-' + idTamanho[i]) && Selector.$('tam-f-' + i + '-' + idTamanho[i]).checked || 
                if (isElement('input', 'tam-f-' + linha + '-' + idTamanho[i]) && Selector.$('tam-f-' + linha + '-' + idTamanho[i]).checked) {
                    selecionados.push(1);
                    arraySelecionados.push(1);
                    qtdSelecionados++;
                } else {
                    selecionados.push(0);
                    arraySelecionados.push(0);
                }
            } else {

                if (isElement('input', 'tam-f-' + idTamanho[i]) && Selector.$('tam-f-' + idTamanho[i]).checked) {
                    arrayEstrelas.push(AtualizaEstrela2(linha, idTamanho[i], true, gridObras2.getCellText(linha, 3), gridObras2.getCellText(linha, 2)));
                    selecionados.push(1);
                    arraySelecionados.push(1);
                    qtdSelecionados++;
                } else {
                    selecionados.push(0);
                    arraySelecionados.push(0);

                    if (gridObras2.getCellText(linha, 17) == '1' || gridObras2.getCellText(linha, 17) == 1) {
                        arrayEstrelas.push(AtualizaEstrela2(linha, idTamanho[i], false, '', ''));
                    }
                }
            }
        }

        gridObras2.getCellObject(linha, 10).id = selecionados;
        gridObras2.getCellObject(linha, 18).id = arrayEstrelas;
        Calcular2();
    }
}

function IncluirObrasSelecionadas() {

    if (Selector.$('tipoProduto').selectedIndex == 0 && gridObras.getRowCount() <= 0) {
        MostrarMsg("Por favor, selecione o tipo de produto", 'tipoProduto');
        return;
    }

    if (Selector.$('tipoProduto').value != '3') {

        if (Selector.$('acabamento').selectedIndex == 0 && gridObras.getRowCount() <= 0) {
            MostrarMsg("Por favor, selecione o acabamento", 'acabamento');
            return;
        }
    }

    if (Selector.$('tipoProduto').value == '1') {

        if (Selector.$('artista').selectedIndex == 0 && gridObras.getRowCount() <= 0) {
            MostrarMsg("Por favor, selecione o artista", 'artista');
            return;
        }
    }

    if (Selector.$('tipoProduto').value == '1') {//PHOTOARTS

        if (gridObras.getSelCount(0) <= 0) {
            MostrarMsg("Por favor, selecione uma ou mais obras", '');
            return;
        }

        var tamanhosSelecionados = false;
        for (var i = 0; i < gridObras.getRowCount(); i++) {

            if (gridObras.getCellObject(i, 0).checked) {

                var selecionados = gridObras.getCellObject(i, 10).id.split(',');
                for (var j = 0; j < selecionados.length; j++) {

                    if (selecionados[j] == '1') {
                        tamanhosSelecionados = true;
                        break;
                    } else {
                        tamanhosSelecionados = false;
                    }
                }
            }
        }

        if (!tamanhosSelecionados) {
            MostrarMsg("Por favor, selecione o(s) tamanho(s) de acordo com as obras selecionadas", '');
            return;
        }
    } else if (Selector.$('tipoProduto').value == '2') {//INSTAARTS

        if (gridObras.getRowCount() <= 0) {
            MostrarMsg("Por favor, adicione uma ou mais imagens Instaarts", '');
            return;
        }

        var qtdSel = 0;
        for (var i = 0; i < gridObras.getRowCount(); i++) {
            for (var j = 0; j < gridObras.getCellObject(i, 5).childNodes.length; j++) {
                if (gridObras.getCellObject(i, 5).childNodes[j].type == 'checkbox') {
                    if(gridObras.getCellObject(i, 5).childNodes[j].checked){
                        qtdSel++;
                    }
                }
            }
        }
        
        if(qtdSel <= 0){
            MostrarMsg("Por favor, selecione um ou mais tamanhos", '');
            return;
        }


    } else if (Selector.$('tipoProduto').value == '3') { //PRODUTOS

        if (gridObras.getRowCount() <= 0) {
            MostrarMsg("Por favor, adicione um ou mais produtos", '');
            return;
        }
    }

    var tipoProduto = 0;
    //Selector.$('tipoProduto').value = 0;
    for (var i = 0; i < gridObras.getRowCount(); i++) {

        if (gridObras.getCellObject(i, 0).checked) {

            tipoProduto = gridObras.getCellObject(i, 0).getAttribute('idTipoProduto');

            var img = DOM.newElement('img');
            img.setAttribute('style', 'width:150px; cursor:pointer');
            img.src = gridObras.getCellObject(i, 1).src;
            img.setAttribute('name', gridObras.getCellObject(i, 1).getAttribute('name'));
            img.setAttribute('id', gridObras.getCellObject(i, 0).getAttribute('id'));

            if (gridObras.getCellObject(i, 1).getAttribute('name') == 'semimagem.png') {
                img.setAttribute('onclick', 'AlterarImagemInstaarts(' + gridObras2.getRowCount() + ')');
                img.setAttribute('title', 'Clique para alterar a imagem');
            } else {

                if (gridObras.getCellObject(i, 1).getAttribute('name') != '') {
                    img.setAttribute('onclick', 'MostraImagemTamanhoReal("' + gridObras.getCellObject(i, 1).src + '")');
                }
            }

            if (tipoProduto != '3') {
                var conteudoTamanhos = gridObras.getCellObject(i, 5).innerHTML.replace(/id="tam-/g, 'id="tam-f-').replace(/id="lbl-estr-/g, 'id="lbl-estr-f-');
            } else {
                var conteudoTamanhos = gridObras.getCellObject(i, 5).innerHTML;
            }

            var divTamanhos = DOM.newElement('div', gridObras.getCellObject(i, 5).getAttribute('id'));
            divTamanhos.innerHTML = conteudoTamanhos;

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'Excluir2Aux(' + gridObras2.getRowCount() + ')');

            var divAcabamentoMoldura = DOM.newElement('div');

            var acabamento = DOM.newElement('span');
            acabamento.innerHTML = gridObras.getCellText(i, 4);

            divAcabamentoMoldura.appendChild(acabamento);

            if (tipoProduto != '3') {

                var moldura = DOM.newElement('span');
                moldura.setAttribute('style', 'font-weight:bold; text-decoration:underline;');

                if (Selector.$('moldura').options[Selector.$('moldura').selectedIndex].id != '') {
                    moldura.setAttribute('onclick', 'MostraImagemTamanhoReal("./imagens/molduras/' + Selector.$('moldura').options[Selector.$('moldura').selectedIndex].id + '")');
                    moldura.style.cursor = 'pointer';
                }

                if (Selector.$('moldura').selectedIndex > 0) {
                    moldura.innerHTML = 'Moldura: ' + Select.GetText(Selector.$('moldura'));
                } else {
                    moldura.innerHTML = '';
                }

                divAcabamentoMoldura.innerHTML += '<br/>';
                divAcabamentoMoldura.appendChild(moldura);
            }

            var lblTamanhos = DOM.newElement('span');
            lblTamanhos.setAttribute('id', gridObras.getCellObject(i, 6).id);

            var lblAlturas = DOM.newElement('span');
            lblAlturas.setAttribute('id', gridObras.getCellObject(i, 7).id);

            var lblLarguras = DOM.newElement('span');
            lblLarguras.setAttribute('id', gridObras.getCellObject(i, 8).id);

            var lblValor = DOM.newElement('span', gridObras.getCellObject(i, 9).id);

            var lblSelecionados = DOM.newElement('span', gridObras.getCellObject(i, 10).id);
            var lblIdOrcamentosComp = DOM.newElement('span', gridObras.getCellObject(i, 11).id);

            var linhaGrid = gridObras.getCellText(i, 15);

            var lblEstrelas = DOM.newElement('span', gridObras.getCellObject(i, 16).id);
            var lblQtdVendido = DOM.newElement('span', gridObras.getCellObject(i, 17).id);
            var lblPesos = DOM.newElement('span', gridObras.getCellObject(i, 18).id);

            if (linhaGrid == '-1') {

                gridObras2.addRow([
                    DOM.newText((tipoProduto == '1' ? 'Photoarts' : (tipoProduto == '2' ? 'Instaarts' : 'Produtos'))),
                    img,
                    DOM.newText(gridObras.getCellText(i, 2)),
                    DOM.newText(gridObras.getCellText(i, 3)),
                    //DOM.newText(gridObras.getCellText(i, 4)),
                    divAcabamentoMoldura,
                    divTamanhos,
                    lblTamanhos,
                    lblAlturas,
                    lblLarguras,
                    lblValor,
                    lblSelecionados,
                    lblIdOrcamentosComp,
                    excluir,
                    DOM.newText(gridObras.getCellText(i, 13)),
                    DOM.newText(gridObras.getCellText(i, 14)),
                    DOM.newText((tipoProduto != '3' ? Selector.$('grupo_moldura').value : 0)),
                    DOM.newText((tipoProduto != '3' ? Selector.$('moldura').value : 0)),
                    DOM.newText(tipoProduto),
                    lblEstrelas,
                    lblQtdVendido,
                    lblPesos
                ]);

            } else {

                gridObras2.getCellObject(linhaGrid, 5).innerHTML = '';
                gridObras2.getCellObject(linhaGrid, 5).appendChild(divTamanhos);
                gridObras2.getCellObject(linhaGrid, 6).id = gridObras.getCellObject(i, 6).id;
                gridObras2.getCellObject(linhaGrid, 7).id = gridObras.getCellObject(i, 7).id;
                gridObras2.getCellObject(linhaGrid, 8).id = gridObras.getCellObject(i, 8).id;
                gridObras2.getCellObject(linhaGrid, 9).id = gridObras.getCellObject(i, 9).id;
                gridObras2.getCellObject(linhaGrid, 10).id = gridObras.getCellObject(i, 10).id;
                gridObras2.getCellObject(linhaGrid, 11).id = gridObras.getCellObject(i, 11).id;
                gridObras2.getCellObject(linhaGrid, 18).id = gridObras.getCellObject(i, 16).id;
                gridObras2.getCellObject(linhaGrid, 19).id = gridObras.getCellObject(i, 17).id;
                gridObras2.getCellObject(linhaGrid, 20).id = gridObras.getCellObject(i, 18).id;
            }

            gridObras2.hiddenCol(6);
            gridObras2.hiddenCol(7);
            gridObras2.hiddenCol(8);
            gridObras2.hiddenCol(9);
            gridObras2.hiddenCol(10);
            gridObras2.hiddenCol(11);
            gridObras2.hiddenCol(13);
            gridObras2.hiddenCol(14);
            gridObras2.hiddenCol(15);
            gridObras2.hiddenCol(16);
            gridObras2.hiddenCol(17);
            gridObras2.hiddenCol(18);
            gridObras2.hiddenCol(19);
            gridObras2.hiddenCol(20);

            gridObras2.setRowData(gridObras2.getRowCount() - 1, gridObras.getCellObject(i, 0).getAttribute('id'));
            gridObras2.getCell(gridObras2.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:150px;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');
        }
    }

    //if(tipoProduto != '3'){

    for (var j = 0; j < gridObras2.getRowCount(); j++) {

        var qtd = gridObras2.getCellObject(j, 6).id.split(',').length;
        var idTamanho = gridObras2.getCellObject(j, 6).id.split(',');
        var selecionado = gridObras2.getCellObject(j, 10).id.split(',');
        for (var k = 0; k < qtd; k++) {

            if (gridObras2.getCellText(j, 17) == '2' || gridObras2.getCellText(j, 17) == 2) {

                if (isElement('input', 'tam-f-' + j + '-' + idTamanho[k])) {

                    Selector.$('tam-f-' + j + '-' + idTamanho[k]).setAttribute('onclick', 'InserirSelecionado(' + j + ', ' + idTamanho[k] + '); alteracao = true;');
                    if (selecionado[k] == 1 || selecionado[k] == '1') {
                        Selector.$('tam-f-' + j + '-' + idTamanho[k]).checked = true;
                    }
                }
            } else if (gridObras2.getCellText(j, 17) == '1' || gridObras2.getCellText(j, 17) == 1) {
                Selector.$('tam-f-' + idTamanho[k]).setAttribute('onclick', 'InserirSelecionado(' + j + ', ' + idTamanho[k] + '); alteracao = true;');
                if (selecionado[k] == 1 || selecionado[k] == '1') {
                    Selector.$('tam-f-' + idTamanho[k]).checked = true;
                }
            }
        }
    }
    //}

    pintaLinhaGrid(gridObras2);
    dialogoCadastro.Close();
    Calcular2();
}

function Calcular2() {

    var valor = 0;

    for (var i = 0; i < gridObras2.getRowCount(); i++) {

        var qtd = gridObras2.getCellObject(i, 6).id.split(',').length;
        var selecionado = gridObras2.getCellObject(i, 10).id.split(',');
        var valorObra = gridObras2.getCellObject(i, 9).id.split(',');
        for (var j = 0; j < qtd; j++) {

            if (selecionado[j] == 1) {
                valor = valor + parseFloat(valorObra[j]);
            }
        }
    }

    Selector.$('valor').value = Number.FormatDinheiro(valor);
    Selector.$('valorTotal').value = Number.FormatDinheiro(valor);
    return valor;
}

function Excluir2Aux(linha) {

    var mensagem = '';
    if (gridObras2.getCellText(linha, 17) == '3') {
        mensagem = 'Deseja realmente excluir este produto?';
    } else {
        mensagem = 'Deseja realmente excluir esta obra?';
    }

    mensagemExcluirObra = new DialogoMensagens("prompt", 125, 380, 150, "4", "Atenção!", mensagem, "OK", "Excluir2(" + linha + ");", true, "");
    mensagemExcluirObra.Show();
}

function Excluir2(linha) {

    gridObras2.deleteRow(linha);

    for (var i = 0; i < gridObras2.getRowCount(); i++) {
        gridObras2.getCellObject(i, 12).setAttribute('onclick', 'Excluir2Aux(' + i + ')');
    }

    pintaLinhaGrid(gridObras2);
    mensagemExcluirObra.Close();
    Calcular2();
}

function MostrarObrasSalvas() {

    var ajax = new Ajax('POST', 'php/orcamentos-simplificados.php', true);
    var p = 'action=MostrarObras';
    p += '&idOrcamentoSimplificado=' + codigoAtual;
    //p += '&idAcabamento=' + Selector.$('acabamento').value;
    //p += '&idArtista=' + Selector.$('artista').value;
    p += '&salvas=1';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        gridObras2.clearRows();

        if (ajax.getResponseText() == '0') {
            Selector.$('divObras').innerHTML = '';
            //Selector.$('msgLoad').innerHTML = "Nenhuma obra encontrada";
            return;
        }

        //Selector.$('msgLoad').innerHTML = "";
        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            //var checkboxObra = DOM.newElement('checkbox', json[i].idArtistaObra);

            var imgObra = DOM.newElement('img');

            if (json[i].imagem == '') {

                imgObra.setAttribute('src', 'imagens/semarte.png');
                imgObra.setAttribute('style', 'width:120px; height:auto;');
                imgObra.setAttribute('name', '');
                imgObra.setAttribute('id', json[i].idArtistaObra);
            } else if (json[i].imagem == 'semimagem.png') {
                imgObra.setAttribute('src', 'imagens/semimagem.png');
                imgObra.setAttribute('style', 'width:120px; height:auto; cursor:pointer');
                imgObra.setAttribute('name', 'semimagem.png');
                imgObra.setAttribute('onclick', 'AlterarImagemInstaarts(' + gridObras2.getRowCount() + ')');
                imgObra.setAttribute('title', 'Clique para alterar a imagem');
                imgObra.setAttribute('id', 0);
            } else {
                imgObra.setAttribute('src', 'imagens/' + (json[i].idTipoProduto == '1' ? 'obras' : (json[i].idTipoProduto == '2' ? 'instaarts' : 'produtos')) + '/' + json[i].imagem);
                imgObra.setAttribute('style', 'width:120px; height:auto; cursor:pointer');
                imgObra.setAttribute('name', json[i].imagem);
                imgObra.setAttribute('id', json[i].idArtistaObra);
                imgObra.setAttribute('onclick', 'MostraImagemTamanhoReal("imagens/' + (json[i].idTipoProduto == '1' ? 'obras/' : 'instaarts/') + json[i].imagem + '")');
            }

            var divAcabamentoMoldura = DOM.newElement('div');

            var acabamento = DOM.newElement('span');
            acabamento.innerHTML = json[i].nomeAcabamento;

            var moldura = DOM.newElement('span');
            moldura.setAttribute('style', 'font-weight:bold; text-decoration:underline;');

            if (json[i].imagemMoldura != '') {
                moldura.setAttribute('onclick', 'MostraImagemTamanhoReal("./imagens/molduras/' + json[i].imagemMoldura + '")');
                moldura.style.cursor = 'pointer';
            }

            if (json[i].idMoldura > 0) {
                moldura.innerHTML = 'Moldura: ' + json[i].moldura;
            } else {
                moldura.innerHTML = '';
            }

            divAcabamentoMoldura.appendChild(acabamento);
            divAcabamentoMoldura.innerHTML += '<br/>';
            divAcabamentoMoldura.appendChild(moldura);

            var divTamanhos = DOM.newElement('div', (json[i].idTipoProduto == '3' ? json[i].qtd : 1));

            if (json[i].idTipoProduto == '3') {
                divTamanhos.innerHTML = json[i].quantidadeValor;
            }

            var excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('style', 'cursor:pointer');
            excluir.setAttribute('onclick', 'Excluir2Aux(' + i + ')');

            gridObras2.addRow([
                //checkboxObra,
                DOM.newText((json[i].idTipoProduto == '1' ? 'Photoarts' : (json[i].idTipoProduto == '2' ? 'Instaarts' : 'Produto'))),
                imgObra,
                DOM.newText(json[i].nomeArtista),
                DOM.newText(json[i].nomeObra),
                //DOM.newText(json[i].nomeAcabamento),
                divAcabamentoMoldura,
                divTamanhos,
                DOM.newElement('span'),
                DOM.newElement('span'),
                DOM.newElement('span'),
                DOM.newElement('span'),
                DOM.newElement('span'),
                DOM.newElement('span'),
                excluir,
                DOM.newText(json[i].idArtista),
                DOM.newText(json[i].idAcabamento),
                DOM.newText(json[i].idMolduraGrupo),
                DOM.newText(json[i].idMoldura),
                DOM.newText(json[i].idTipoProduto),
                DOM.newElement('span'),
                DOM.newElement('span'),
                DOM.newElement('span')
            ]);

            gridObras2.hiddenCol(6);
            gridObras2.hiddenCol(7);
            gridObras2.hiddenCol(8);
            gridObras2.hiddenCol(9);
            gridObras2.hiddenCol(10);
            gridObras2.hiddenCol(11);
            gridObras2.hiddenCol(13);
            gridObras2.hiddenCol(14);
            gridObras2.hiddenCol(15);
            gridObras2.hiddenCol(16);
            gridObras2.hiddenCol(17);
            gridObras2.hiddenCol(18);
            gridObras2.hiddenCol(19);
            gridObras2.hiddenCol(20);

            gridObras2.setRowData(gridObras2.getRowCount() - 1, json[i].idArtistaObra);
            gridObras2.getCell(gridObras2.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:150px;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            gridObras2.getCell(gridObras2.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');

            var lin = (gridObras2.getRowCount() - 1);
            if (json[i].tamanhos != '0') {

                var jsonTamanhos = JSON.parse(json[i].tamanhos);

                for (var j = 0; j < jsonTamanhos.length; j++) {

                    arraySelecionados.push(jsonTamanhos[j].selecionado);

                    gridObras2.getCellObject(lin, 5).innerHTML += '<input name="' + lin + '" type="checkbox" ' + (jsonTamanhos[j].selecionado == '1' ? 'checked' : '') + ' onclick="InserirSelecionado(' + lin + ', ' + jsonTamanhos[j].idArtistaObraTamanho + '); alteracao = true;" id="tam-f-' + (json[i].idTipoProduto == '2' ? i + '-' + jsonTamanhos[j].idArtistaObraTamanho : jsonTamanhos[j].idArtistaObraTamanho) + '"/><label>' + jsonTamanhos[j].nomeTamanho + ' (' + jsonTamanhos[j].altura + 'x' + jsonTamanhos[j].largura + ')' + ' - R$' + jsonTamanhos[j].valor + (json[i].idTipoProduto == '2' ? '' : ' | Qtd. Vendido: ' + jsonTamanhos[j].qtdVendidoAtual + ' - Estrelas: <label id="lbl-estr-f-' + i + '-' + jsonTamanhos[j].idArtistaObraTamanho + '" name="' + jsonTamanhos[j].estrelas + '">' + jsonTamanhos[j].estrelas + '</label>') + '</label><br>';
                    gridObras2.getCellObject(lin, 6).id += jsonTamanhos[j].idArtistaObraTamanho + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 7).id += Number.ValorE(jsonTamanhos[j].altura) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 8).id += Number.ValorE(jsonTamanhos[j].largura) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 9).id += Number.ValorE(jsonTamanhos[j].valor) + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 10).id += jsonTamanhos[j].selecionado + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 11).id += jsonTamanhos[j].idOrcamentoSimplificadoComp + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 18).id += jsonTamanhos[j].estrelas + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 19).id += jsonTamanhos[j].qtdVendidoAtual + ((j + 1) < jsonTamanhos.length ? ',' : '');
                    gridObras2.getCellObject(lin, 20).id += jsonTamanhos[j].pesoObra + ((j + 1) < jsonTamanhos.length ? ',' : '');
                }
            } else {

                gridObras2.getCellObject(lin, 6).id += 0;
                gridObras2.getCellObject(lin, 7).id += 0;
                gridObras2.getCellObject(lin, 8).id += 0;
                gridObras2.getCellObject(lin, 9).id += json[i].valor;
                gridObras2.getCellObject(lin, 10).id += 1;
                gridObras2.getCellObject(lin, 11).id += json[i].idOrcamentoComp;
                gridObras2.getCellObject(lin, 18).id += 0;
                gridObras2.getCellObject(lin, 19).id += 0;
                gridObras2.getCellObject(lin, 20).id += 0;
            }
        }

        /*if (Selector.$('tipoProduto').value == '1') {
         gridObras2.hiddenCol(12);
         } else {
         gridObras2.visibleCol(12);
         }*/

        /*for (var k = 0; k < gridObras.getRowCount(); k++) {
         
         if (gridObras.getCellObject(k, 10).id.indexOf('1') >= 0) {
         gridObras.getCellObject(k, 0).checked = true;
         }
         }*/

        pintaLinhaGrid(gridObras2);
    };

    //Selector.$('msgLoad').innerHTML = "Aguarde, carregando obras...";
    ajax.Request(p);
}

function InserirLinha(linhaGrid) {

    if (gridObras.getCellObject(linhaGrid, 0).checked) {

        gridObras2.addRow([
            DOM.newText(''),
            DOM.newElement('span'),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newElement('span'),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);

        gridObras2.hiddenCol(6);
        gridObras2.hiddenCol(7);
        gridObras2.hiddenCol(8);
        gridObras2.hiddenCol(9);
        gridObras2.hiddenCol(10);
        gridObras2.hiddenCol(11);
        gridObras2.hiddenCol(13);
        gridObras2.hiddenCol(14);
        gridObras2.hiddenCol(15);
        gridObras2.hiddenCol(16);
        gridObras2.hiddenCol(17);
        gridObras2.hiddenCol(18);
        gridObras2.hiddenCol(19);
        gridObras2.hiddenCol(20);

        //gridObras2.setRowData(gridObras2.getRowCount() - 1, 0);
        gridObras2.getCell(gridObras2.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
        gridObras2.getCell(gridObras2.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:150px;');
        gridObras2.getCell(gridObras2.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridObras2.getCell(gridObras2.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras2.getCell(gridObras2.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras2.getCell(gridObras2.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridObras2.getCell(gridObras2.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:30px;');
        //var cloneTamanhos = gridObras2.getCellObject(linhaGrid, 5).cloneNode(true);
        //gridObras.setCellObject(linhaGrid, 5, cloneTamanhos);
    } else {

        //gridObras2.deleteRow(gridObras.getCellObject(linhaGrid, 0).getAttribute('name'));
        gridObras2.deleteRow(linhaGrid);
        for (var i = 0; i < gridObras.getRowCount(); i++) {

            //gridObras.getCellObject(i, 0).setAttribute('onclick', 'InserirLinha(' + i + ')');
            if (gridObras.getCellObject(i, 0).checked) {

                for (j = 0; j < gridObras2.getRowCount(); j++) {
                    gridObras.getCellObject(i, 0).setAttribute('name', j);
                }
            }
        }
    }
}

function CalcularFrete() {

    if (Selector.$('enderecos').selectedIndex == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Aviso", "Nenhum endereço de destino selecionado/cadastrado.", "OK", "", false, "enderecos");
        mensagem.Show();
        return;
    }

    if (gridObras2.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Aviso", "Inclua uma obra para calcular o frete.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', true);
    var p = 'action=CalcularFrete';
    p += '&nCdEmpresa=' + '';
    p += '&sDsSenha=' + '';
    p += '&nCdServico=' + (Selector.$('tipoTransporte').value == '5' ? 41106 : (Selector.$('tipoTransporte').value == '4' ? 40010 : ''));
    p += '&sCepOrigem=' + Selector.$('loja').options[Selector.$('loja').selectedIndex].id;
    p += '&sCepDestino=' + Selector.$('enderecos').options[Selector.$('enderecos').selectedIndex].id;
    p += '&selecionados=' + gridObras2.getContentObjectId(10);
    p += '&pesos=' + gridObras2.getContentObjectId(20);
    p += '&alturas=' + gridObras2.getContentObjectId(7);
    p += '&larguras=' + gridObras2.getContentObjectId(8);
    p += '&nCdFormato=' + 1;
    p += '&nVlComprimento=' + 16;
    p += '&nVlDiametro=' + 0;
    p += '&sCdMaoPropria=' + 'N';
    p += '&nVlValorDeclarado=' + 0;
    p += '&sCdAvisoRecebimento=' + 'N';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('btCalcularFrete').value = 'Calcular Frete';

        switch (ajax.getResponseText()) {

            case '-2':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "CEP de origem inválido.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-3':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "CEP de destino inválido.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-4':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "Peso excedido", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-16':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura não pode ser maior que 105cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-17':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A altura não pode ser maior que 105cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-18':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A altura não pode ser inferior que 2cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-20':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura não pode ser inferior que 11cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-23':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "A soma resultante do comprimento + largura + altura não deve superar a 200cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-33':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Sistema temporariamente fora do ar. Favor tentar mais tarde.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-44':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura nao pode ser inferior a 11cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '-45':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura nao pode ser maior que 60cm.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '007':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Localidade de destino não abrange o serviço informado.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '008':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Serviço indisponível para o trecho informado.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            case '7':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Serviço indisponível, tente mais tarde.", "OK", "", false, "");
                mensagem.Show();
                Selector.$('divValorFrete').style.display = 'none';
                break;

            default:
                var json = JSON.parse(ajax.getResponseText());
                Selector.$('divValorFrete').style.display = 'inline-block';
                Selector.$('valorFrete').innerHTML = json.valorFrete;
                Selector.$('prazoEntrega').innerHTML = json.prazoEntrega;
                Selector.$('frete').value = json.valorFrete.replace('R$ ', '');
                Totaliza(false, true, false, false, false);
        }
    }

    Selector.$('btCalcularFrete').value = 'Calculando...';
    ajax.Request(p);
}

function AlterarImagemInstaarts(linha) {

    var data = ((Date.GetDate(true)).toString()).replace('/', '').replace('/', '').replace(' ', '').replace(':', '').replace(':', '');
    var nome = data + '-' + Number.Complete(parseInt(Math.random() * 10), 6, '0', true);
    var path = '../imagens/instaarts/';
    var funcao = 'ArmazenarPathInstaarts';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg, jpg, png, bmp');
    linhaImagemInstaarts = linha;
}

function ArmazenarPathInstaarts(path) {

    GerarMiniaturaImagem(path, 2);

    var vetor = path.split("/");
    var extensao = vetor[vetor.length - 1].split(".")[1];
    var arquivo = vetor[vetor.length - 1];

    gridObras2.getCellObject(linhaImagemInstaarts, 1).setAttribute('src', 'imagens/instaarts/' + arquivo + '');
    gridObras2.getCellObject(linhaImagemInstaarts, 1).setAttribute('name', arquivo);
    gridObras2.getCellObject(linhaImagemInstaarts, 1).setAttribute('title', '');
    gridObras2.getCellObject(linhaImagemInstaarts, 1).setAttribute('onclick', 'MostraImagemTamanhoReal("imagens/instaarts/' + arquivo + '")');
    gridObras2.getCellObject(linhaImagemInstaarts, 1).setAttribute('id', 0);
    dialog.Close();
}

function SelecionarProduto() {

    var aux = Select.GetText(Selector.$('produto')).split('-');
    Selector.$('valorProduto').value = aux[aux.length - 1];

    Selector.$('quantidadeProduto').value = '1';
}

function CalcularValorProduto() {

    var valor = Select.GetText(Selector.$('produto')).split('-');
    valor = valor[valor.length - 1];

    var quantidade = parseInt(Selector.$('quantidadeProduto').value.trim());

    Selector.$('valorProduto').value = Number.FormatDinheiro((parseFloat(valor) * quantidade));
}

function AdicionarProduto() {

    if (Selector.$('produto').selectedIndex <= 0) {

        MostrarMsg("Por favor, selecione o produto", 'produto');
        return;
    }

    if (Selector.$('quantidadeProduto').value.trim() <= 0) {
        MostrarMsg("A quantidade não pode ser 0", 'quantidadeProduto');
        return;
    }

    var checkboxProduto = DOM.newElement('checkbox', Selector.$('produto').value);
    checkboxProduto.setAttribute('onclick', 'InserirLinha(' + gridObras.getRowCount() + ')');
    checkboxProduto.setAttribute('checked', 'checked');
    checkboxProduto.setAttribute('idTipoProduto', 3);

    var imgProduto = DOM.newElement('img');

    if (Selector.$('produto').options[Selector.$('produto').selectedIndex].id == '') {
        imgProduto.setAttribute('name', '');
        imgProduto.setAttribute('src', 'imagens/semarte.png');
    } else {
        imgProduto.setAttribute('name', Selector.$('produto').options[Selector.$('produto').selectedIndex].id);
        imgProduto.setAttribute('src', 'imagens/produtos/' + Selector.$('produto').options[Selector.$('produto').selectedIndex].id + '');
    }

    imgProduto.setAttribute('style', 'width:120px; height:auto;');

    var divTamanhos = DOM.newElement('div', Selector.$('quantidadeProduto').value.trim());
    divTamanhos.innerHTML = 'Quantidade: ' + Selector.$('quantidadeProduto').value + ' - Valor: ' + Selector.$('valorProduto').value;

    var excluir = DOM.newElement('img');
    excluir.setAttribute('src', 'imagens/lixo.png');
    excluir.setAttribute('title', 'Excluir produto');
    excluir.setAttribute('style', 'cursor:pointer');
    excluir.setAttribute('onclick', 'ExcluirInstaartsAux(' + gridObras.getRowCount() + ')');

    gridObras.addRow([
        checkboxProduto,
        imgProduto,
        DOM.newText('PRODUTO'),
        DOM.newText(Select.GetText(Selector.$('produto'))),
        DOM.newText('- - -'),
        divTamanhos,
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        excluir,
        DOM.newText(0),
        DOM.newText(0),
        DOM.newText('-1'),
        DOM.newElement('span'),
        DOM.newElement('span'),
        DOM.newElement('span')
    ]);

    gridObras.hiddenCol(0);
    gridObras.hiddenCol(6);
    gridObras.hiddenCol(7);
    gridObras.hiddenCol(8);
    gridObras.hiddenCol(9);
    gridObras.hiddenCol(10);
    gridObras.hiddenCol(11);
    gridObras.hiddenCol(12);
    gridObras.hiddenCol(13);
    gridObras.hiddenCol(14);
    gridObras.hiddenCol(15);
    gridObras.hiddenCol(16);
    gridObras.hiddenCol(17);
    gridObras.hiddenCol(18);

    gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:200px;');
    gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
    gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');

    gridObras.getCellObject(gridObras.getRowCount() - 1, 6).id += 0;
    gridObras.getCellObject(gridObras.getRowCount() - 1, 7).id += 0;
    gridObras.getCellObject(gridObras.getRowCount() - 1, 8).id += 0;
    gridObras.getCellObject(gridObras.getRowCount() - 1, 9).id += Number.ValorE(Selector.$('valorProduto').value.trim());
    gridObras.getCellObject(gridObras.getRowCount() - 1, 10).id += 1;
    gridObras.getCellObject(gridObras.getRowCount() - 1, 11).id += '0';
    gridObras.getCellObject(gridObras.getRowCount() - 1, 16).id += '0';
    gridObras.getCellObject(gridObras.getRowCount() - 1, 17).id += '0';
    gridObras.getCellObject(gridObras.getRowCount() - 1, 18).id += 0;

    pintaLinhaGrid(gridObras);
}