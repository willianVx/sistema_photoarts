
window.onload = function () {
    Mostra();
};

function Mostra() {

    var ajax = new Ajax('POST', 'php/ordem-de-compras.php', false);
    var p = 'action=Mostrar';
    p += '&codigo=' + Window.getParameter('codigo');

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText() );

    codigoAtual = json.idOrcamento;

    Selector.$('numero').innerHTML = json.id;
    Selector.$('dataemissao').innerHTML = json.data;
    Selector.$('loja').innerHTML = json.loja;
    Selector.$('fornecedor').innerHTML = json.fornecedor;
    Selector.$('previsao').innerHTML = json.previsao;
    Selector.$('nomeUsuarioAssinatura').innerHTML = json.usuarioComprou;


    if (json.obs == '') {
        Selector.$('obs').style.display = 'none';
    } else {
        Selector.$('obs').innerHTML = json.obs;
    }

    Selector.$('diaatual').innerHTML = 'Cotia, ' + json.dataAtual;

    MostraItens(json.itens);
    window.print();
}

function MostraItens(array) {

    var div = Selector.$('tabela');
    div.innerHTML = '';

    if (array == '0') {
        div.innerHTML = 'Nenhum item localizado na ordem de compra';
        return;
    }

    gridItens = new Table('gridItens');
    gridItens.table.setAttribute('cellpadding', '4');
    gridItens.table.setAttribute('cellspacing', '0');
    gridItens.table.setAttribute('class', 'tabela_cinza_foco');

    gridItens.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Descrição'),
        DOM.newText('Altura'),
        DOM.newText('Largura'),
        DOM.newText('Qtd'),
        DOM.newText('Valor'),
        DOM.newText('Total')
    ]);

    div.appendChild(gridItens.table);

    var cor = false;
    var json = JSON.parse(array );

    Selector.$('qtd').innerHTML = json.length;

    for (var i = 0; i < json.length; i++) {

        gridItens.addRow([
            DOM.newText((json[i].idMaterial > 0 ? 'MATERIAL' : 'PRODUTO')),
            DOM.newText((json[i].idMaterial > 0 ? json[i].material : json[i].produto)),
            DOM.newText(json[i].altura),
            DOM.newText(json[i].largura),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].valor),
            DOM.newText(json[i].total) 
        ]);

  
        gridItens.getCell(gridItens.getRowCount() - 1, 0).setAttribute('style', 'text-align:left;width:70px');
        gridItens.getCell(gridItens.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gridItens.getCell(gridItens.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 3).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 4).setAttribute('style', 'text-align:center;');
        gridItens.getCell(gridItens.getRowCount() - 1, 5).setAttribute('style', 'text-align:right;');
        gridItens.getCell(gridItens.getRowCount() - 1, 6).setAttribute('style', 'text-align:right;');


        if (cor) {
            cor = false;
            gridItens.setRowBackgroundColor(gridItens.getRowCount() - 1, "#F5F5F5");

        } else {
            cor = true;
            gridItens.setRowBackgroundColor(gridItens.getRowCount() - 1, "#FFF");
        }
    }
    
    
    Selector.$('total').innerHTML = Number.FormatMoeda(gridItens.SumCol(6));
}

  