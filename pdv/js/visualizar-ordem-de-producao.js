ValidarSessao();
var arrayIdsObras = new Array();
var arrayIdsEtapas = new Array();

window.onload = function(){

    CarregarDadosUsuario();
    Selector.$('nomeGaleria').style.fontFamily = 'Verdana,Geneva,sans-serif';
    Selector.$('nomeGaleria').style.fontWeight = '100';
    Selector.$('nomeUsuario').style.fontFamily = 'Verdana,Geneva,sans-serif';
    Selector.$('nomeUsuario').style.fontWeight = '100';
}

function MostrarOnKeyDown(ev) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode == 13) {
        Mostrar();
    }
}

function Mostrar() {

    if(Selector.$('ordemProducao').value.trim() == '' && Selector.$('pedido').value.trim() == ''){
        alert("Digite o n° da ordem de produção ou n° do pedido");
        Selector.$('ordemProducao').focus();
    }

    var ajax = new Ajax('POST', 'php/visualizar-ordem-de-producao.php', false);
    var p = 'action=Mostrar';
    p += '&ordemProducao=' + Selector.$('ordemProducao').value.trim();
    p += '&numeroPedido=' + Selector.$('pedido').value.trim();

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        Selector.$('dados').style.display = 'none';
        Selector.$('dados2').style.display = 'none';
        Selector.$('linhatotal').style.display = 'none';
        Selector.$('tabela').style.display = 'none';
        Selector.$('divqtde').style.display = 'none';
        Selector.$('texto').style.display = 'none';
        Selector.$('imprimir').style.display = 'none';
        Selector.$('gravar').style.display = 'none';
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    Selector.$('ordemProducao').setAttribute('name', json.codigo);
    Selector.$('dataemissao').innerHTML = json.data;
    Selector.$('loja').innerHTML = json.loja;
    Selector.$('previsao').innerHTML = json.previsao;

    if (json.obs == '') {
        Selector.$('obs').style.display = 'none';
    } else {
        Selector.$('obs').innerHTML = json.obs;
    }

    if(json.formaPagamento == ''){
        Selector.$('lblFormaPagamento').style.display = 'none';
        Selector.$('lblFormaPagamento').style.display = 'none';
    }else{
        Selector.$('formaPagamento').innerHTML = json.formaPagamento;
    }

    if(json.numeroPedido == ''){
        //Selector.$('lblNumeroPedido').style.display = 'none';
        //Selector.$('numeroPedido').style.display = 'none';
        Selector.$('numeroPedido').innerHTML = ' - - - ';
    }else{
        Selector.$('numeroPedido').innerHTML = json.numeroPedido;
    }

    if(json.cliente == ''){
        Selector.$('lblCliente').style.display = 'none';
        Selector.$('cliente').style.display = 'none';
    }else{
        Selector.$('cliente').innerHTML = json.cliente;
    }

    MostraItens(json.itens);

    Selector.$('dados').style.display = 'inline-block';
    Selector.$('dados2').style.display = 'inline-block';
    Selector.$('linhatotal').style.display = 'block';
    Selector.$('tabela').style.display = 'block';
    Selector.$('divqtde').style.display = 'block';
    Selector.$('texto').style.display = 'block';

    Selector.$('imprimir').style.display = 'inline-block';
    Selector.$('gravar').style.display = 'inline-block';
    //Selector.$('ordemProducao').value = '';
    //Selector.$('pedido').value = '';
}

function MostraItens(array) {

    var div = Selector.$('tabela');
    div.innerHTML = '';

    if (array == '0') {
        div.innerHTML = 'Nenhum item localizado na ordem de compra';
        return;
    }

    var json = JSON.parse(array);
    Selector.$('qtd').innerHTML = json.length;
    arrayIdsObras.length = 0;
    var corPdf = '';
    var logo = '';

    for(var i = 0; i < json.length; i++){

        if(i == 0){

            if(json[i].tipo == 'InstaArts'){
                logo = '../imagens/logo_instaarts_fundo_branco.jpeg';
                Selector.$('logo').setAttribute('style', 'width:250px; height:auto; float:right; margin-top:30px;');
                corPdf = '#3AB54A';
            }else if(json[i].tipo == 'PhotoArts'){
                logo = '../imagens/Logopronto_fundo_branco.jpeg';
                Selector.$('logo').setAttribute('style', 'width:auto; height:100px; float:right; margin-top:10px;');
                corPdf = '#6FAEE3';
            }else{
                logo = '../imagens/Logopronto_fundo_branco.jpeg';
                Selector.$('logo').setAttribute('style', 'width:auto; height:100px; float:right; margin-top:10px;');
                corPdf = '#6FAEE3';
            }

            Selector.$('logo').src = logo;
            Selector.$('linha2').style.background = corPdf;
            Selector.$('linhatotal').style.background = corPdf;
            Selector.$('linhatotal').style.border = 'solid 2px ' + corPdf;
            Selector.$('tabela').style.border = 'solid 2px ' + corPdf;
            Selector.$('texto').style.border = 'solid 2px ' + corPdf;
        }

        arrayIdsObras.push(json[i].codigo);

        var divObra = DOM.newElement('div');
        divObra.setAttribute('style', 'width:99.6%; border:1px solid ' + corPdf + '; margin-top:5px; display:inline-block; height:auto;');

        var divFoto = DOM.newElement('div');
        divFoto.setAttribute('style', 'width:20%; height:auto; display:inline-block; ' + (json.length == 1 ? 'vertical-align:top;' : 'vertical-align:middle;') + ' margin-right:5px; padding:5px;');

        var imagem = DOM.newElement('img');
        imagem.setAttribute('src', json[i].imagem);
        imagem.setAttribute('style', 'width:100%; height:auto; vertical-align:bottom;');
        divFoto.appendChild(imagem);

        var divInfoObra = DOM.newElement('div');
        divInfoObra.setAttribute('style', 'width:55%; height:auto; display:inline-block; ' + (json.length == 1 ? 'vertical-align:top;' : 'vertical-align:middle;') + ' padding:5px;');

        var lblTipo = DOM.newElement('label');
        lblTipo.innerHTML = '<b>Tipo: </b>' + json[i].tipo;
        divInfoObra.appendChild(lblTipo);

        divInfoObra.innerHTML += '<br>';

        var lblArtista = DOM.newElement('label');
        lblArtista.innerHTML = '<b>Artista: </b>' + json[i].artista;
        divInfoObra.appendChild(lblArtista);

        divInfoObra.innerHTML += '<br>';

        var lblObra = DOM.newElement('label');
        lblObra.innerHTML = '<b>Obra: </b>' + json[i].obra;
        divInfoObra.appendChild(lblObra);

        divInfoObra.innerHTML += '<br>';

        var lblTamanho = DOM.newElement('label');
        lblTamanho.innerHTML = '<b>Tamanho: </b>' + json[i].nomeTamanho + ' (' + json[i].altura +'x' + json[i].largura + ')';
        divInfoObra.appendChild(lblTamanho);

        divInfoObra.innerHTML += '<br>';

        var lblAcabamento = DOM.newElement('label');
        lblAcabamento.innerHTML = '<b>Acabamento: </b>' + json[i].acabamento;
        divInfoObra.appendChild(lblAcabamento);

        divInfoObra.innerHTML += '<br>';

        var lblMoldura = DOM.newElement('label');
        lblMoldura.innerHTML = '<b>Moldura: </b>' + json[i].moldura;
        divInfoObra.appendChild(lblMoldura);

        divInfoObra.innerHTML += '<br>';

        var lblQtde = DOM.newElement('label');
        lblQtde.innerHTML = (json[i].qtd > 1 ? '<span style="font-size:14px; color:red;"><b>Qtde: </b>' + json[i].qtd + '</span>' : '<b>Qtde: </b>' + json[i].qtd + '');
        divInfoObra.appendChild(lblQtde);

        divInfoObra.innerHTML += '<br>';

        var lblEtapa = DOM.newElement('label');
        lblEtapa.innerHTML = '<b>Etapa: </b>'; //+ json[i].etapa;
        divInfoObra.appendChild(lblEtapa);

        var cmbEtapa = DOM.newElement('select', 'etapa' + i);
        cmbEtapa.setAttribute('style', 'width:340px');
        cmbEtapa.setAttribute('class', 'combo_cinzafoco');
        divInfoObra.appendChild(cmbEtapa);

        var divStatus = DOM.newElement('div');
        divStatus.setAttribute('style', 'width:auto; height:auto; display:inline-block; padding:5px; ' + (json.length == 1 ? 'vertical-align:top;' : 'vertical-align:middle;') + '');

        if(json[i].opStatus != '0'){

            var jsonOpStatus = JSON.parse(json[i].opStatus);

            for(var j = 0; j < jsonOpStatus.length; j++){

                var chkStatus = DOM.newElement('checkbox');
                chkStatus.setAttribute('disabled', 'disabled');
                if(jsonOpStatus[j].ok == '1'){
                    chkStatus.setAttribute('checked', 'checked');
                    chkStatus.setAttribute('onclick', 'AtualizarStatusOpComp(' + json[i].codigo + ', ' + jsonOpStatus[j].idOpCompStatus + ', 0)');
                }else{
                    chkStatus.setAttribute('onclick', 'AtualizarStatusOpComp(' + json[i].codigo + ', ' + jsonOpStatus[j].idOpCompStatus + ', 1)');
                }
                divStatus.appendChild(chkStatus);

                var lblStatus = DOM.newElement('label');
                lblStatus.innerHTML = jsonOpStatus[j].opCompStatus;
                divStatus.appendChild(lblStatus);

                divStatus.innerHTML += '<br>';
            }
        }

        divObra.appendChild(divFoto);
        divObra.appendChild(divInfoObra);
        divObra.appendChild(divStatus);
        div.appendChild(divObra);

        getEtapasOrdensProducao(Selector.$('etapa' + i), 'Selecione uma etapa', false);
        Select.ShowText(Selector.$('etapa' + i), json[i].etapa);
    }
}

function AtualizarStatusOpComp(idOrdemProducaoComp, idOpCompStatus, check){

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=AtualizarStatusOpComp';
    p+= '&idOrdemProducaoComp=' + idOrdemProducaoComp;
    p+= '&idOpCompStatus=' + idOpCompStatus;
    p+= '&check=' + check;
    ajax.Request(p);
}

function Imprimir(){

    Selector.$('imprimir').style.visibility = 'hidden';
    Selector.$('gravar').style.visibility = 'hidden';
    window.print();
    Selector.$('imprimir').style.visibility = 'visible';
    Selector.$('gravar').style.visibility = 'visible';
}

function Gravar(){

    arrayIdsEtapas.length = 0;

    var ajax = new Ajax('POST', 'php/visualizar-ordem-de-producao.php', true);
    var p = 'action=Gravar';
    p+= '&idObras=' + arrayIdsObras;

    for(var i = 0; i < Selector.$('tabela').childNodes.length; i++){

        arrayIdsEtapas.push(Selector.$('etapa' + i).value);
    }

    p+= '&idEtapa=' + arrayIdsEtapas;

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        Selector.$('gravar').value = 'Gravar';

        if(ajax.getResponseText() == '0'){
            alert("Erro ao atualizar a OP");
            //MostrarMsg('Problemas ao atualizar a OP. Tente novamente, caso o erro persista, entre em contato com o suporte técnico.', '');
            return;
        }

        alert("OP atualizado com sucesso!");
        //MostrarMsg('OP atualizado com sucesso!', '');
    };

    Selector.$('gravar').value = 'Gravando...';
    ajax.Request(p);
}

function GerarPdfOrdemProducao() {

    var ajax = new Ajax('POST', 'php/visualizar-ordem-de-producao.php', true);
    var p = 'action=GerarPdfOrdem';
    p += '&idOrdem=' + Selector.$('ordemProducao').getAttribute('name');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() !== '') {
            window.open(ajax.getResponseText());
        }
    }

    ajax.Request(p);
}