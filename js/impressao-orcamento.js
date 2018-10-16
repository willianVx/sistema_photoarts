var codigoAtual = 0;
var codigoVersaoAtual = 0;
var mesOrcamentoAtual = 0;
var anoOrcamentoAtual = 0;
var codOrcamentoAtual = 0;
var valorTotalOrcamentoAtual = 0;
var valorInstalacao = 0;
var valorEnsaio = 0;
var idProduto=0;

window.onload = function () {
    Mostra();
};

function Mostra() {

    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Window.getParameter('codigo');

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );
    
    idProduto = json.idTipoProduto;
    var assinatura='';
    var rodape='';
    var rodape2='';
    
    if(idProduto != '2'){
        //PHOTOARTS
        Selector.$('cabecalho').setAttribute('style', "overflow:hidden; color:#6FAEE3; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;")
        //Selector.$('tipo').innerHTML = (json.loja.indexOf('PHOTOARTS') >= 0 ? json.loja : 'PHOTOARTS - ' + json.loja);
        Selector.$('tipo').innerHTML = json.loja;
        Selector.$('linha2').setAttribute('style', "background:#6FAEE3; padding:4px; margin-bottom:10px;");
        Selector.$('logoTopo').src = "imagens/Logopronto_fundo_branco.jpeg";
        Selector.$('logoTopo').setAttribute('style', "width:150px; height:140px; float:right; margin-top:-53px;");
        
        Selector.$('tabela').setAttribute('style', "border:solid 2px #6FAEE3;  border-top:none; height:240px; padding:0px; padding-top:3px; padding-bottom:3px;");
        
        Selector.$('textoObs').setAttribute('style', "border:solid 2px #6FAEE3;  height:auto; padding:5px; padding-top:3px; padding-bottom:3px;");
        Selector.$('textoTermo').setAttribute('style', "border:solid 2px #6FAEE3;  height:100px; padding:5px; padding-top:3px; padding-bottom:3px;");
        Selector.$('linhatotal').setAttribute('style', "border:solid 2px #6FAEE3; background:#6FAEE3; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;");
        Selector.$('linhatotal2').setAttribute('style', "border:solid 2px #6FAEE3; background:#6FAEE3; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;");
        Selector.$('divTotal').setAttribute('style', "border:solid 2px #6FAEE3; width:25%;");
        
        Selector.$('end').setAttribute('style', "border:solid 2px #6FAEE3;  border-top:none; height:auto; padding:5px; padding-top:3px; padding-bottom:3px;");
               
        assinatura = 'Photoarts Gallery';
        rodape = 'Photoarts Online Gallery - CNPJ: 00.934.702/0001-42';
        rodape2 ='www.photoarts.com.br';
        
        Selector.$('galeriaAssinatura').innerHTML = assinatura + '<br>' + json.vendedor;
        Selector.$('cnpj').innerHTML = rodape;
        Selector.$('site').innerHTML = rodape2;
        
        Selector.$('nomeProd').innerHTML = 'Photoarts';
    }
    else{
        //INSTAARTS
        Selector.$('cabecalho').setAttribute('style', "overflow:hidden; color:#3AB54A; vertical-align:top; display:inline-block; height:55px; width:49.5%; text-align:left; font-weight:bold; font-size:32px; padding-top:20px;")
        //Selector.$('tipo').innerHTML = "INSTAARTS - " + json.loja;
        Selector.$('tipo').innerHTML = json.loja;
        Selector.$('linha2').setAttribute('style', "background:#3AB54A; padding:4px; margin-bottom:10px;");
        Selector.$('logoTopo').src = "imagens/logo_instaarts_fundo_branco.jpeg";
        Selector.$('logoTopo').setAttribute('style', "width:270px; float:right; margin-top:10px;");
        
        Selector.$('tabela').setAttribute('style', "border:solid 2px #3AB54A;  border-top:none; height:240px; padding:0px; padding-top:3px; padding-bottom:3px;");
        
        Selector.$('textoObs').setAttribute('style', "border:solid 2px #3AB54A;  height:auto; padding:5px; padding-top:3px; padding-bottom:3px;");
        Selector.$('textoTermo').setAttribute('style', "border:solid 2px #3AB54A;  height:100px; padding:5px; padding-top:3px; padding-bottom:3px;");
        Selector.$('linhatotal').setAttribute('style', "border:solid 2px #3AB54A; background:#3AB54A; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;");
        Selector.$('linhatotal2').setAttribute('style', "border:solid 2px #3AB54A; background:#3AB54A; padding:5px; padding-top:3px; padding-bottom:3px; padding-left:3px; margin-top:5px;");
        Selector.$('divTotal').setAttribute('style', "border:solid 2px #3AB54A; width:25%;");
        
        Selector.$('end').setAttribute('style', "border:solid 2px #3AB54A;  border-top:none; height:auto; padding:5px; padding-top:3px; padding-bottom:3px;");
        
        assinatura = 'Instaarts';
        rodape = 'InstaArts - O laboratório de arte contemporânea - (11) 4612-6019';
        rodape2 = 'www.instaarts.com.br';
        
        Selector.$('galeriaAssinatura').innerHTML = assinatura + '<br>' + json.vendedor;
        Selector.$('cnpj').innerHTML = rodape;
        Selector.$('site').innerHTML = rodape2;
        Selector.$('nomeProd').innerHTML = 'Instaarts';
    }

    codigoAtual = json.idOrcamento;

    Selector.$('numero').innerHTML = json.proposta;
    Selector.$('dataemissao').innerHTML = json.dataCadastro;
    Selector.$('validade').innerHTML = json.validade;

    Selector.$('cliente').innerHTML = json.cliente;
    Selector.$('responsavel').innerHTML = json.vendedor;
    Selector.$('telefone').innerHTML = json.telefone;
    Selector.$('email').innerHTML = json.email;
    Selector.$('tipoentrega').innerHTML = json.tipoTransporte;

    Selector.$('valor').innerHTML = json.valor;
    Selector.$('frete').innerHTML = json.valorFrete;
    Selector.$('desconto').innerHTML = json.valorDesconto + ' (' + json.percDesconto + '%)';
    Selector.$('total').innerHTML = json.valorTotal;

    if(json.obs == ''){
      Selector.$('obs').style.display = 'none';
    }else{
      Selector.$('obs').innerHTML = json.obs;
    }

    Selector.$('endereco').innerHTML = json.endereco;
    Selector.$('numeroRes').innerHTML = json.numero;
    Selector.$('complemento').innerHTML = json.complemento;
    Selector.$('bairro').innerHTML = json.bairro;
    Selector.$('cidade').innerHTML = json.cidade;
    Selector.$('estado').innerHTML = json.estado;
    Selector.$('cep').innerHTML = json.cep;

    Selector.$('nomeClienteAssinatura').innerHTML = json.cliente;
    Selector.$('diaatual').innerHTML = (json.cidadeLoja == '' ? 'Cotia' : json.cidadeLoja) + ', ' +  json.dataAtual;

    MostraObras(json.arrayObras);
    window.print();
}

function MostraObras(array) {

    var div = Selector.$('tabela');
    div.innerHTML = '';

    if (array == '0') {
        div.innerHTML = 'Nenhuma obra localizada no orçamento';
        return;
    }

    //CRIA TABELA DE OBRAS
    gridObras = new Table('gridObras');
    gridObras.table.setAttribute('cellpadding', '4');
    gridObras.table.setAttribute('cellspacing', '0');
    if(idProduto != '2'){
        gridObras.table.setAttribute('class', 'tabela_cinza_foco');
    }
    else{
        gridObras.table.setAttribute('class', 'tabela_verde');
    }

    gridObras.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtd'),
        DOM.newText('Total'),
        DOM.newText('Peso')/*,
        DOM.newText('Obs.')*/
    ]);

    div.appendChild(gridObras.table);

    var cor = false;
    var json = JSON.parse(array );

    for (var i = 0; i < json.length; i++) {

        gridObras.addRow([
            DOM.newText(json[i].nomeTipo),
            DOM.newText(NomeSobrenome(json[i].nomeArtista)),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == 3 ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipoProduto == 3 ? json[i].nomeProduto : json[i].nomeAcabamento) + (json[i].moldura == '' ? '' : ' (Mold.: ' + json[i].moldura + ')')),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].valorTotal),
            DOM.newText((json[i].idTipoProduto == 3 ? '- - -' : json[i].peso + ' KG'))/*,
            DOM.newText(json[i].obs)*/
        ]);

        gridObras.setRowData(gridObras.getRowCount() - 1, json[i].idOrcamentoComp);
        gridObras.getCell(gridObras.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;width:40px');
        gridObras.getCell(gridObras.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gridObras.getCell(gridObras.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gridObras.getCell(gridObras.getRowCount() - 1, 6).setAttribute('style', 'text-align:right;');
        gridObras.getCell(gridObras.getRowCount() - 1, 7).setAttribute('style', 'text-align:right;');
        //gridObras.getCell(gridObras.getRowCount() - 1, 8).setAttribute('style', 'text-align:left;');

        if (cor) {
            cor = false;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridObras.setRowBackgroundColor(gridObras.getRowCount() - 1, "#FFF");
        }
    }
}

function NomeSobrenome(nome) {
    var a = nome.split(' ');
    var nome = a[0] + ' ' + a[1];

    if (a[1].length <= 3) {
        if (a.length > 2) {
            nome += ' ' + a[2];
        }
    }
    
    return nome;
}