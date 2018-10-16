window.onload = function () {
    Mostra();
};

function Mostra() {

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Window.getParameter('codigo');

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    Selector.$('numero').innerHTML = json.id;
    Selector.$('dataemissao').innerHTML = json.data;
    Selector.$('loja').innerHTML = json.loja;
    Selector.$('previsao').innerHTML = json.previsao;

    if (json.obs == '') {
        Selector.$('obs').style.display = 'none';
    } else {
        Selector.$('obs').innerHTML = json.obs;
    }

    Selector.$('diaatual').innerHTML = 'Cotia, ' + json.dataAtual;

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
}

function MostraItens(array) {

    var div = Selector.$('tabela');
    div.innerHTML = '';

    if (array == '0') {
        div.innerHTML = 'Nenhum item localizado na ordem de compra';
        return;
    }

    var json = JSON.parse(array );
    Selector.$('qtd').innerHTML = json.length;

    for(var i = 0; i < json.length; i++){

        if(i == 0){

            if(json[i].tipo == 'InstaArts'){
                logo = 'imagens/logo_instaarts_fundo_branco.jpeg';
                corPdf = '#3AB54A';
                Selector.$('galeriaAssinatura').innerHTML = 'InstaArts';
                Selector.$('cnpj').innerHTML = 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019';
                Selector.$('site').innerHTML = 'www.instaarts.com.br';
            }else if(json[i].tipo == 'PhotoArts'){
                logo = 'imagens/Logopronto_fundo_branco.jpeg';
                corPdf = '#6FAEE3';
                Selector.$('galeriaAssinatura').innerHTML = 'PhotoArts';
                Selector.$('cnpj').innerHTML = 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42';
                Selector.$('site').innerHTML = 'www.photoarts.com.br';
            }else{
                logo = 'imagens/Logopronto_fundo_branco.jpeg';
                corPdf = '#6FAEE3';
                Selector.$('galeriaAssinatura').innerHTML = 'PhotoArts';
                Selector.$('cnpj').innerHTML = 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42';
                Selector.$('site').innerHTML = 'www.photoarts.com.br';
            }

            Selector.$('logo').src = logo;
            (json[i].tipo == 'InstaArts' ? Selector.$('logo').setAttribute('style', 'width:225px; height:auto; float:right; margin-top:30px') : '');
            Selector.$('linha2').style.background = corPdf;
            Selector.$('linhatotal').style.background = corPdf;
            Selector.$('linhatotal').style.border = 'solid 2px ' + corPdf;
            Selector.$('tabela').style.border = 'solid 2px ' + corPdf;
            Selector.$('texto').style.border = 'solid 2px ' + corPdf;
            Selector.$('cabecalho').style.color = corPdf;
        }

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
        lblEtapa.innerHTML = '<b>Etapa: </b>' + json[i].etapa;
        divInfoObra.appendChild(lblEtapa);

        var divStatus = DOM.newElement('div');
        divStatus.setAttribute('style', 'width:auto; height:auto; display:inline-block; padding:5px; ' + (json.length == 1 ? 'vertical-align:top;' : 'vertical-align:middle;') + '');

        if(json[i].opStatus != '0'){

            var jsonOpStatus = JSON.parse(json[i].opStatus );

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
    }

    //window.print();

    /*gridItens = new Table('gridItens');
    gridItens.table.setAttribute('cellpadding', '4');
    gridItens.table.setAttribute('cellspacing', '0');
    gridItens.table.setAttribute('class', 'tabela_cinza_foco');

    gridItens.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtde'),
        DOM.newText('Etapa')
    ]);

    div.appendChild(gridItens.table);

    var cor = false;
    var json = JSON.parse(array);

    Selector.$('qtd').innerHTML = json.length;

    for (var i = 0; i < json.length; i++) {

        gridItens.addRow([
            DOM.newText(gridItens.getRowCount() + 1),
            DOM.newText(json[i].tipo),
            DOM.newText(json[i].artista),
            DOM.newText(json[i].obra),
            DOM.newText(json[i].tamanho),
            DOM.newText(json[i].acabamento),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].etapanumero)
        ]);

        gridItens.getCell(gridItens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:20px');
        gridItens.getCell(gridItens.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;');

        if (cor) {
            cor = false;
            gridItens.setRowBackgroundColor(gridItens.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridItens.setRowBackgroundColor(gridItens.getRowCount() - 1, "#FFF");
        }
    }*/
}

function AtualizarStatusOpComp(idOrdemProducaoComp, idOpCompStatus, check){

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=AtualizarStatusOpComp';
    p+= '&idOrdemProducaoComp=' + idOrdemProducaoComp;
    p+= '&idOpCompStatus=' + idOpCompStatus;
    p+= '&check=' + check;
    ajax.Request(p);
}