var codigoAtual = 0;
var codigoVersaoAtual = 0;
var mesOrcamentoAtual = 0;
var anoOrcamentoAtual = 0;
var codOrcamentoAtual = 0;
var valorTotalOrcamentoAtual = 0;
var valorInstalacao = 0;
var valorEnsaio = 0;

window.onload = function () {
    Mostra();
};

function Mostra() {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Window.getParameter('codigo');

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    codigoAtual = json.idOrcamento;
    corPdf = (json.idTipoProduto == '1' ? '#6FAEE3' : '#3AB54A');

    Selector.$('cabecalho').style.color = corPdf;
    Selector.$('linha2').style.background = corPdf;
    Selector.$('linhatotal').style.background = corPdf;
    Selector.$('linhatotal').style.border = 'solid 2px ' + corPdf;
    Selector.$('tabela').style.border = 'solid 2px ' + corPdf;
    Selector.$('divValorTotal').style.border = 'solid 2px ' + corPdf;
    Selector.$('texto').style.border = 'solid 2px ' + corPdf;
    Selector.$('textoTermos').style.border = 'solid 2px ' + corPdf;
    Selector.$('divEndereco').style.border = 'solid 2px ' + corPdf;
    Selector.$('divEndereco').style.background = corPdf;
    Selector.$('divEnderecoResult').style.border = 'solid 2px ' + corPdf;

    Selector.$('numero').innerHTML = json.codPedido;
    //Selector.$('tipo').innerHTML = (json.loja.indexOf('PHOTOARTS') >= 0 ? json.loja : 'PHOTOARTS - ' + json.loja);
    Selector.$('tipo').innerHTML = json.loja;
    Selector.$('dataemissao').innerHTML = json.dataCadastro;
    Selector.$('validade').innerHTML = json.entrega;

    Selector.$('logo').src = 'imagens/' + (json.idTipoProduto == '1' ? '../../imagens/Logopronto_fundo_branco.jpeg' : '../../imagens/logo_instaarts_fundo_branco.jpeg');
    Selector.$('logo').setAttribute('style', (json.idTipoProduto == '1' ? 'width:150px; height:140px; float:right; margin-top:-53px;' : 'width:270px; height:auto; float:right; margin-top:10px;'));

    Selector.$('cliente').innerHTML = json.cliente;
    
    Selector.$('responsavel').innerHTML = json.vendedor;
    Selector.$('telefone').innerHTML = json.telefone;
    Selector.$('email').innerHTML = json.email;
    Selector.$('tipoentrega').innerHTML = json.tipoTransporte;

    Selector.$('valor').innerHTML = json.valor;
    Selector.$('frete').innerHTML = json.valorFrete;
    Selector.$('desconto').innerHTML = json.valorDesconto + ' (' + json.percentualDesconto + '%)';
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

    Selector.$('galeriaAssinatura').innerHTML = (json.idTipoProduto == '1' ? 'Photoarts Gallery' : 'Instaarts') + '<br>' + json.vendedor;
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
    gridObras.table.setAttribute('class', 'tabela_cinza_foco');

    gridObras.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Qtd'),
        DOM.newText('Total'),
        DOM.newText('Peso')
    ]);

    div.appendChild(gridObras.table);
    gridObras.getHeadCell(0).style.background = corPdf;
    gridObras.getHeadCell(1).style.background = corPdf;
    gridObras.getHeadCell(2).style.background = corPdf;
    gridObras.getHeadCell(3).style.background = corPdf;
    gridObras.getHeadCell(4).style.background = corPdf;
    gridObras.getHeadCell(5).style.background = corPdf;
    gridObras.getHeadCell(6).style.background = corPdf;
    gridObras.getHeadCell(7).style.background = corPdf;

    var cor = false;
    var json = JSON.parse(array);

    for (var i = 0; i < json.length; i++) {

        gridObras.addRow([
            DOM.newText(json[i].nomeTipo),
            DOM.newText(NomeSobrenome(json[i].nomeArtista)),
            DOM.newText(json[i].nomeObra),
            DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == 3 ? '' : ' (' + Math.round(json[i].altura.replace(',', '.')) + 'x' + Math.round(json[i].largura.replace(',', '.')) + ')')),
            DOM.newText((json[i].idTipoProduto == 3 ? json[i].nomeProduto : json[i].nomeAcabamento) + (json[i].moldura == '' ? '' : ' (Mold.: ' + json[i].moldura + ')')),
            DOM.newText(json[i].qtde),
            DOM.newText(json[i].valorTotal),
            DOM.newText((json[i].idTipoProduto == 3 ? '- - -' : json[i].peso + ' KG'))
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