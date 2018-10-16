/* global Selector */

checkSessao();
var qtdmes = 0;
var CodigoArtista = 0;
var CodigoObra = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Painel</div>";
    carregarmenu();
    // GraficoPizza();
    // Graficolinha();
    // GraficoBarra();
    getDadosUsuario();
    getPerfil();
};

function getOrdemProducao() {

    gridOrdens = new Table('gridOrdens');
    gridOrdens.table.setAttribute('cellpadding', '4');
    gridOrdens.table.setAttribute('cellspacing', '0');
    gridOrdens.table.setAttribute('class', 'tabela_jujuba_comum');
    gridOrdens.table.setAttribute('style', 'margin-top:3px;');

    gridOrdens.addHeader([
        DOM.newText('N° OP'),
        DOM.newText('Data'),
        DOM.newText('Pedido'),
        DOM.newText('Galeria'),
        DOM.newText('Situação'),
        DOM.newText('Itens'),
        DOM.newText('Ver')
    ]);

    Selector.$('tabelaOrdens').appendChild(gridOrdens.table);

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', true);
    var p = 'action=MostrarOrdens';
    p += '&de=';
    p += '&ate=';
    p += '&statusBusca=1';
    p += '&buscanumero=';
    p += '&etapa=';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        for (var i = 0; i < json.length; i++) {

            var itens = DOM.newElement('label');
            itens.setAttribute('onclick', 'visualizarItens(' + json[i].codigo + ')');
            itens.innerHTML = json[i].itens + (json[i].itens > 0 ? " <img src='imagens/menu.png' style='vertical-align:middle; cursor:pointer; width:30px;' />" : "");

            var ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'window.location="ordem-de-producao.html?idOrdem=' + json[i].codigo + '"');

            gridOrdens.addRow([
                DOM.newText(json[i].id),
                DOM.newText(json[i].data),
                DOM.newText(json[i].venda),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].status),
                itens,
                ver
            ]);

            gridOrdens.setRowData(gridOrdens.getRowCount() - 1, json[i].idOrcamento);
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:70px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:70px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:90px;');
            gridOrdens.getCell(gridOrdens.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:40px;');

            pintaLinhaGrid(gridOrdens);
        }
    }

    ajax.Request(p);
}

function getStatusPedido(cmb) {

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=getStatusPedido';

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        Select.AddItem(cmb, 'Todos', 0);
        return;
    }

    Select.AddItem(cmb, "Todos status", 0);
    Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVStatus', 'status');
    
    var json = JSON.parse(ajax.getResponseText());

    Select.Show(cmb, json.idUltimoStatus);
}


function getPedidos(origem) {

    if (origem == 1) {
        if (Selector.$('loja').name == Selector.$('loja').value) {
            return;
        }

        Selector.$('loja').name = Selector.$('loja').value;
    } else if (origem == 2) {

        if (Selector.$('cmbStatusPedido').name == Selector.$('cmbStatusPedido').value) {
            return;
        }

        Selector.$('cmbStatusPedido').name = Selector.$('cmbStatusPedido').value;
    } else if (origem == 3) {

        if (Selector.$('cmbPeriodo').name == Selector.$('cmbPeriodo').value) {
            return;
        }

        Selector.$('cmbPeriodo').name = Selector.$('cmbPeriodo').value;
    }

    Selector.$('tabelaPedidos').innerHTML = "<div style='text-align:center; color:#999;font-family:Arial, Helvetica, sans-serif; margin-top:30px'>Aguarde...</div>";

    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=MostrarPedidos';
    p += '&loja=' + Selector.$('loja').value;
    p += '&statusBusca=' + Selector.$('cmbStatusPedido').value;
    p += '&periodo=' + Selector.$('cmbPeriodo').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            Selector.$('tabelaPedidos').innerHTML = "<div style='text-align:center; color:#999;font-family:Arial, Helvetica, sans-serif; margin-top:30px'>Nenhum pedido</div>";
            return;
        }

        gridPedidos = new Table('gridPedidos');
        gridPedidos.table.setAttribute('cellpadding', '4');
        gridPedidos.table.setAttribute('cellspacing', '0');
        gridPedidos.table.setAttribute('class', 'tabela_jujuba_comum');

        gridPedidos.addHeader([
            DOM.newText('Data'),
            DOM.newText('Loja'),
            DOM.newText('Cliente'),
            DOM.newText('Obras'),
            DOM.newText('Status'),
            DOM.newText('')
        ]);

        Selector.$('tabelaPedidos').innerHTML = "<div style='margin-top:3px;'></div>";
        Selector.$('tabelaPedidos').appendChild(gridPedidos.table);

        var json = JSON.parse(ajax.getResponseText() );
        var ver;
        var obras;
        var qtdePagamentos;

        for (var i = 0; i < json.length; i++) {

            qtdePagamentos = DOM.newElement('label');
            qtdePagamentos.innerHTML = json[i].qtdePagamentos;

            if (json[i].qtdePagamentos > '0') {
                qtdePagamentos.setAttribute('style', 'text-decoration:underline; cursor:pointer;');
                qtdePagamentos.setAttribute('onclick', 'PromptPagamentosPedido(' + json[i].idVenda + ', "' + json[i].numeroPedido + '");');
            }

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].numeroPedido + '"');

            gridPedidos.addRow([
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].descricaoStatus),
                ver
            ]);

            gridPedidos.setRowData(gridPedidos.getRowCount() - 1, json[i].idVenda);

            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 1).setAttribute('style', 'text-align:left; width:200px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left; width:200px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 3).setAttribute('style', 'text-align:left; width:380px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:100px;');
            gridPedidos.getCell(gridPedidos.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:40px;');


        }

        pintaLinhaGrid(gridPedidos);
    }

    ajax.Request(p);

}

function getPerfil() {   
    getStatusPedido(Selector.$('cmbStatusPedido'));
   
    //getCentrosCusto(Selector.$('loja'), 'Todas galerias', true);
    getLojas(Selector.$('loja'), 'Todas lojas', true);
    getPeriodos(Selector.$('cmbPeriodo'), 'Selecione um período...', true);
    
    getPedidos();

    var idPerfil = Selector.$('email_user').name;   
    
    getOrdemProducao();

    if (idPerfil == 1) {
        Selector.$('divAvisosWidget').style.display = "none";
        Selector.$('divTitulosVencidosWidget').style.display = "none";
        Selector.$('divAtalhosPerfil1').style.display = "inline-block";
        montaCalendario();
    

    } else if (idPerfil == 2) {
        Selector.$('linha2').style.display = "block";
        Selector.$('divCalendario').style.display = "none";
        Selector.$('divAvisosWidget').style.display = "none";
        Selector.$('rotuloPedidos').innerHTML = "Últ. Pedidos";
        getTitulosVencidos();
       
    } else {
        Selector.$('linha4').style.display = "block";
        Selector.$('divAvisosWidget').style.display = "none";
        getTitulosVencidos();
        montaCalendario();
    }

    ajustaWidgetsPrincipal();
}

function getTitulosVencidos() {

    Selector.$('tabelavencidos').innerHTML = "<div style='text-align:center; color:#999;font-family:Arial, Helvetica, sans-serif; margin-top:30px'>Aguarde...</div>";

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = 'action=getTitulosVencidos';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            Selector.$('tabelavencidos').innerHTML = "<div style='text-align:center; color:#999;font-family:Arial, Helvetica, sans-serif; margin-top:30px'>Nenhum título encontrado</div>";
            return;
        }

        Selector.$('tabelavencidos').innerHTML = "<div style='margin-top:3px;'></div>";


        grid = new Table('grid');
        grid.table.setAttribute('cellpadding', '5');
        grid.table.setAttribute('cellspacing', '0');
        grid.table.setAttribute('class', 'tabela_jujuba_comum');

        grid.addHeader([
            DOM.newText(''),
            DOM.newText('Parcela'),
            DOM.newText('Vencimento'),
            DOM.newText('Valor (R$)'),
            DOM.newText('')
        ]);

        Selector.$('tabelavencidos').appendChild(grid.table);

        var json = JSON.parse(ajax.getResponseText() );
        for (var i = 0; i < json.length; i++) {

            //==== VISUALIZAR PARCELA/TÍTULO ======
            var visualizar = DOM.newElement('img');
            visualizar.setAttribute('class', 'efeito-opacidade-75-03');
            visualizar.setAttribute('src', 'imagens/pesquisar.png');
            visualizar.setAttribute('style', 'width:18px; height:18px');
            visualizar.setAttribute('title', 'Visualizar');
            visualizar.setAttribute('onclick', 'window.location="cadastro-de-contas-a-pagar.html?idTitulo=' + json[i].codigo + '"');

            grid.addRow([
                DOM.newText("#" + json[i].codigo),
                DOM.newText(json[i].parcela),
                DOM.newText(json[i].data),
                DOM.newText(json[i].valor),
                visualizar
            ]);

            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:30px;');

            if (json[i].vencido === '1') {
                grid.setRowForegroundColor(grid.getRowCount() - 1, '#CC0000');
            }


        }

        pintaLinhaGrid(grid);

    }


    ajax.Request(p);

}

function  montaCalendario() {

    gridCalendario = new Table('grid');
    gridCalendario.table.setAttribute('class', 'tabela_jujuba_comum_vermelha');

    gridCalendario.table.setAttribute('cellspacing', '0');
    gridCalendario.table.setAttribute('style', 'text-align:right; font-size:9px; vertical-align:top ');

    gridCalendario.addHeader([
        DOM.newText('Dom'),
        DOM.newText('Seg'),
        DOM.newText('Ter'),
        DOM.newText('Qua'),
        DOM.newText('Qui'),
        DOM.newText('Sex'),
        DOM.newText('Sáb')
    ]);

    Selector.$('divtabelacalendario').appendChild(gridCalendario.table);

    getCalendarioPrincipal();
    AjustaAlturaCalendario();

}


window.onresize = function () {

    ajustaWidgetsPrincipal();
};

function GraficoBarra() {

    var randomnb = function () {
        return Math.round(Math.random() * 300)
    };

    var options = {
        responsive: true
    };

    var data = {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        datasets: [
            {
                label: "Dados primários",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: [randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb()]
            },
            {
                label: "Dados secundários",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90, randomnb(), randomnb(), randomnb(), randomnb(), randomnb()]
            }
        ]
    };

    var ctx = document.getElementById("GraficoBarra").getContext("2d");
    var BarChart = new Chart(ctx).Bar(data, options);

}

function Graficolinha() {

    var randomnb = function () {
        return Math.round(Math.random() * 300);
    };

    var options = {
        responsive: true
    };

    var data = {
        labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        datasets: [
            {
                label: "Dados primários",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb(), randomnb()]
            },
            {
                label: "Dados secundários",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 90, 200, 87, 20, 50, 20]
            }
        ]
    };

    var ctx = document.getElementById("GraficoLine").getContext("2d");
    var LineChart = new Chart(ctx).Line(data, options);

}

function GraficoPizza() {

    var randomnb = function () {
        return Math.round(Math.random() * 300)
    };

    var options = {
        responsive: true
    };

    var data = [
        {
            value: randomnb(),
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "Fornecedores"
        },
        {
            value: randomnb(),
            color: "#46BFBD",
            highlight: "#5AD3D1",
            label: "Clientes"
        },
        {
            value: randomnb(),
            color: "#FDB45C",
            highlight: "#FFC870",
            label: "Amigos  "
        }
    ]


    var ctx = document.getElementById("GraficoDonut").getContext("2d");
    var PizzaChart = new Chart(ctx).Doughnut(data, options);
}

$('#cssmenu li.active').addClass('open').children('ul').show();
$('#cssmenu li.has-sub>a').on('click', function () {
    $(this).removeAttr('href');
    var element = $(this).parent('li');
    if (element.hasClass('open')) {
        element.removeClass('open');
        element.find('li').removeClass('open');
        element.find('ul').slideUp(200);
    }
    else {
        element.addClass('open');
        element.children('ul').slideDown(200);
        element.siblings('li').children('ul').slideUp(200);
        element.siblings('li').removeClass('open');
        element.siblings('li').find('li').removeClass('open');
        element.siblings('li').find('ul').slideUp(200);
    }
});



function mesProximo() {
    qtdmes = qtdmes + 1;
    getCalendarioPrincipal();
    AjustaAlturaCalendario();
}

function mesAnterior() {
    qtdmes = qtdmes - 1;
    getCalendarioPrincipal();
    AjustaAlturaCalendario();
}

function AjustaAlturaCalendario() {

    // var alturaCelula = parseInt(Selector.$('divtabelacalendario').clientHeight / gridCalendario.getRowCount());
    var alturaCelula = parseInt(370 / (gridCalendario.getRowCount() + 1));
    for (var r = 0; r <= gridCalendario.getRowCount() - 1; r++) {


        for (var c = 0; c <= 6; c++) {
            gridCalendario.getCell(r, c).style.height = alturaCelula + "px";
            gridCalendario.getCell(r, c).setAttribute('style', 'width: 14%; height:' + alturaCelula + 'px; overflow:auto');
        }
    }
}

function getCalendarioPrincipal() {
    //Selector.$('divdia30').childNodes.length
    Selector.$('divtabelacalendariolinha').innerHTML = "";
    gridCalendario.clearRows();

    var ajax = new Ajax('POST', 'php/calendario.php', false);
    ajax.Request('action=getData&qtdmes=' + qtdmes);

    var json = JSON.parse(ajax.getResponseText());

    if (ajax.getResponseText() === '0') {
        Selector.$('divtabelacalendario').innerHTML = "Problemas de conexÃ£o com o banco de dados";
        return;
    }

    //var json = JSON.parse(ajax.getResponseText() );
    var linhas = parseInt((parseInt(json[0].ultimo) + parseInt(json[0].diasemana)) / 7);

    if ((parseInt(json[0].ultimo) + parseInt(json[0].diasemana)) % 7 !== 0) {
        linhas++;
    }

    Selector.$('rotulomes').innerHTML = json[0].mes;

    for (var i = 0; i < linhas; i++) {

        gridCalendario.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);
    }

    var diaSemana = parseInt(json[0].diasemana);

    for (var i = 1; i <= json[0].ultimo; i++) {

        var divdialinha = DOM.newElement('div', 'divdialinha' + i);
        divdialinha.setAttribute('class', 'divdialinha');

        divdialinha.innerHTML = "<div class='divdiascalendario' >" + i + "<span class='diasemanacalendario'> " + getDiaSemana(diaSemana) + "</span></div>";

        Selector.$('divtabelacalendariolinha').appendChild(divdialinha);

        var divdialinhaInterna = DOM.newElement('div', 'divdialinhaInterna' + i);
        divdialinhaInterna.setAttribute('style', 'display:inline-block');
        divdialinha.appendChild(divdialinhaInterna);

        var divdiab = DOM.newElement('div', 'divdiab' + i);
        divdiab.setAttribute('style', 'text-align:left; vertical-align:top; overflow:hidden; width:auto; display:inline-block; font-size:9px; line-height:10px ');
        divdialinhaInterna.appendChild(divdiab);
        divdialinhaInterna.innerHTML += "<BR>";
        var divdiafestab = DOM.newElement('div', 'divdiafestab' + i);
        divdiafestab.setAttribute('style', 'text-align:left; vertical-align:top; overflow:hidden; width:auto; display:inline-block; font-size:9px; line-height:10px ');
        divdialinhaInterna.appendChild(divdiafestab);

        if (diaSemana == 6)
            diaSemana = 0;
        else
            diaSemana++;
    }

    var dia = 1;
    for (var i = 0; i <= gridCalendario.getRowCount() - 1; i++) {

        for (var c = (i == 0 ? json[0].diasemana : 0); c <= 6; c++) {

            gridCalendario.setCellText(i, c, dia);

            var divestouro = DOM.newElement('div', 'divestouro' + dia);
            divestouro.setAttribute('style', 'text-align:left; float:left; width:100%;  display:inline-block; font-size:9px; line-height:10px ');
            gridCalendario.getCell(i, c).appendChild(divestouro);

            var divdia = DOM.newElement('div', 'divdia' + dia);
            divdia.setAttribute('style', 'text-align:left; float:left; overflow:hidden; max-height:16px; width:100%; display:inline-block; font-size:9px; line-height:10px ');
            gridCalendario.getCell(i, c).appendChild(divdia);

            var divdiafesta = DOM.newElement('div', 'divdiafesta' + dia);
            divdiafesta.setAttribute('style', 'text-align:left; float:left; overflow:hidden; max-height:16px; width:100%; display:inline-block; font-size:9px; line-height:10px ');
            gridCalendario.getCell(i, c).appendChild(divdiafesta);

            dia++;

            if (dia > json[0].ultimo)
                break;
        }
        if (dia > json[0].ultimo)
            break;
    }

    if (json.length == 1)
        return;

    for (var i = 1; i < json.length; i++) {

        for (var r = 0; r <= gridCalendario.getRowCount() - 1; r++) {

            for (var c = 0; c <= 6; c++) {

                if (gridCalendario.getCellText(r, c) == json[i].dia) {

                    var festa = DOM.newElement('div');
                    festa.setAttribute('style', 'overflow:hidden; text-align:left; white-space:nowrap; cursor:pointer; float:left;  width:100%; display:inline-block; font-size:9px; line-height:10px ');
                    festa.innerHTML = "<img style='vertical-align:middle' src='imagens/" + json[i].imagem + "'/> " + json[i].cliente + "<br>";
                    festa.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].codigo + '"');

                    var festa2 = DOM.newElement('div');
                    festa2.setAttribute('style', 'font: 20px/26px "MuseoSans_900"; overflow:hidden; text-align:left; cursor:pointer; float:left;  width:100%; color:#545454; display:inline-block; font-size:9px; line-height:10px ');
                    festa2.innerHTML = "<img style='vertical-align:middle' src='imagens/" + json[i].imagem + "'/> " + json[i].cliente + "<br>";
                    festa2.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].codigo + '"');

                    if (json[i].orcamento !== '1') {
                        Selector.$('divdia' + json[i].dia).appendChild(festa);
                        Selector.$('divdiab' + json[i].dia).appendChild(festa2);
                        //   gridCalendario.getCell(r, c).appendChild(festa);
                        if (parseInt(Selector.$('divdia' + json[i].dia).childNodes.length) == 2) {
                            Selector.$('divdia' + json[i].dia).style.maxHeight = '32px';
                        }
                    } else {
                        Selector.$('divdiafesta' + json[i].dia).appendChild(festa);
                        Selector.$('divdiafestab' + json[i].dia).appendChild(festa2);
                        if (parseInt(Selector.$('divdiafesta' + json[i].dia).childNodes.length) == 2) {
                            Selector.$('divdiafesta' + json[i].dia).style.maxHeight = '32px';
                        }
                    }

                    if ((parseInt(Selector.$('divdia' + json[i].dia).childNodes.length) + parseInt(Selector.$('divdiafesta' + json[i].dia).childNodes.length) > 2)) {

                        Selector.$('divdia' + json[i].dia).style.display = 'none';
                        Selector.$('divdiafesta' + json[i].dia).style.display = 'none';
                        Selector.$('divestouro' + json[i].dia).innerHTML = "";

                        if (parseInt(Selector.$('divdia' + json[i].dia).childNodes.length) > 0) {
                            Selector.$('divestouro' + json[i].dia).innerHTML = "<span onclick='visualizarVendasDia(" + json[i].dia + ",1)'><img style='vertical-align:middle' src='imagens/variascores.png'/> " +
                                    "+" + parseInt(Selector.$('divdia' + json[i].dia).childNodes.length) + " OS(s)</span><BR>";
                        }

                        if (parseInt(Selector.$('divdiafesta' + json[i].dia).childNodes.length) > 0) {
                            Selector.$('divestouro' + json[i].dia).innerHTML += "<span onclick='visualizarVendasDia(" + json[i].dia + ",0)'><img style='vertical-align:middle' src='imagens/variascores.png'/>" +
                                    " +" + parseInt(Selector.$('divdiafesta' + json[i].dia).childNodes.length) + " Proposta(s)</span><BR>";
                        }
                    }
                }
            }
        }
    }

    AjustaAlturaCalendario();
}



function getDiaSemana(dia) {

    switch (dia) {
        case 0:
            return "Dom.";
            break;
        case 1:
            return "Seg.";
            break;
        case 2:
            return "Ter.";
            break;
        case 3:
            return "Qua.";
            break;
        case 4:
            return "Qui.";
            break;
        case 5:
            return "Sex.";
            break;
        case 6:
            return "Sáb.";
            break;
    }
}



function visualizarVendasDia(dia, contrato) {

    Selector.$('prompt').innerHTML = "";


    var ajax = new Ajax('POST', 'php/calendario.php', false);
    var p = 'action=visualizarVendasDia';
    p += '&qtdmes=' + qtdmes;
    p += '&dia=' + dia;

    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var titulo = DOM.newElement('h1');
    titulo.setAttribute('style', 'color:#555555; font: 20px/26px "MuseoSans_900" ');
    titulo.innerHTML = 'Entrega(s) para o dia ' + dia;
    Selector.$('prompt').appendChild(titulo);

    var div = DOM.newElement('div');
    div.setAttribute('style', 'background:#FAFAFA; height:280px;  overflow:auto');
    Selector.$('prompt').appendChild(div);

    gridFestas = new Table('grid');
    gridFestas.table.setAttribute('class', 'tabela_jujuba_comum');
    gridFestas.table.setAttribute('cellpadding', '0');
    gridFestas.table.setAttribute('cellspacing', '0');
    gridFestas.addHeader([
        DOM.newText('Cliente'),
        DOM.newText(''),
        DOM.newText('Status'),
        DOM.newText('')

    ]);
    div.appendChild(gridFestas.table);

    var json = JSON.parse(ajax.getResponseText());

    for (var i = 0; i < json.length; i++) {

        var ver = DOM.newElement('img');
        ver.setAttribute('src', 'imagens/pesquisar.png');
        ver.setAttribute('class', 'efeito-opacidade-75-03');

        var imgstatus = DOM.newElement('img');
        imgstatus.setAttribute('src', 'imagens/' + json[i].imagem);

        gridFestas.addRow([
            DOM.newText(json[i].cliente),
            imgstatus,
            DOM.newText(json[i].status),
            ver
        ]);

        gridFestas.setRowData(gridFestas.getRowCount() - 1, json[i].codigo);
        gridFestas.getRow(gridFestas.getRowCount() - 1).setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].codigo + '"');
        gridFestas.getCell(gridFestas.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:left; width:auto;');
        gridFestas.getCell(gridFestas.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:50px;');
        gridFestas.getCell(gridFestas.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:center; width:50px;');
        gridFestas.getCell(gridFestas.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:50px;');

    }

    pintaLinhaGrid(gridFestas);

    dialogoCadastro = new caixaDialogo('prompt', 400, 480, 'padrao/', 130);
    dialogoCadastro.Show();
}

function visualizarItens(idOrdem) {

    if (!isElement('div', 'divVisualizar')) {
        var div = DOM.newElement('div', 'divVisualizar');
        document.body.appendChild(div);
    }

    var div = Selector.$('divVisualizar');
    div.innerHTML = "<div id='tblitem' style='background:#FFF; height:360px; width:100%; overflow:auto'> </div>";

    dialogoVisualizar = new caixaDialogo('divVisualizar', 600, 1000, 'padrao/', 130);
    dialogoVisualizar.Show();

    gitens = new Table('gridItens');
    gitens.table.setAttribute('cellpadding', '4');
    gitens.table.setAttribute('cellspacing', '0');
    gitens.table.setAttribute('class', 'tabela_cinza_foco');

    gitens.addHeader([
        DOM.newText('Item'),
        DOM.newText('Tipo'),
        DOM.newText('Imagem'),
        DOM.newText('Artista'),
        DOM.newText('Obras'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Etapa'),
        DOM.newText('Selo')
    ]);

    Selector.$('tblitem').appendChild(gitens.table);

    var ajax = new Ajax('POST', 'php/ordem-de-producao.php', false);
    var p = 'action=getItens&codigo=' + idOrdem;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    for (var i = 0; i < json.length; i++) {

        if (json[i].imagem !== "") {

            var imagem = DOM.newElement('img');

            if(json[i].imagem.split('.')[1] == 'zip' || json[i].imagem.split('.')[1] == 'rar'){
                imagem.setAttribute('src', 'imagens/zip.png');
                imagem.setAttribute('title', 'Baixar Arquivo');
                imagem.setAttribute("onclick", "BaixarImagemReal('" + json[i].imagem + "');");
            }else{
                imagem.setAttribute('src', json[i].imagem);
                imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + json[i].imagem + "');");
            }

            imagem.setAttribute('style', 'width:50px; cursor:pointer;');
        } else {
            var imagem = DOM.newElement('label');
        }

        gitens.addRow([
            DOM.newText(gitens.getRowCount() + 1),
            DOM.newText(json[i].tipo),
            imagem,
            DOM.newText(json[i].artista),
            DOM.newText(json[i].obra),
            DOM.newText(json[i].tamanho),
            DOM.newText(json[i].acabamento),
            DOM.newText(json[i].etapa),
            DOM.newText(json[i].selo)
        ]);

        gitens.setRowData(gitens.getRowCount() - 1, json[i].codigo);
        gitens.getCell(gitens.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:40px');
        gitens.getCell(gitens.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 2).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 5).setAttribute('style', 'text-align:center;');
        gitens.getCell(gitens.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 7).setAttribute('style', 'text-align:left;');
        gitens.getCell(gitens.getRowCount() - 1, 8).setAttribute('style', 'text-align:left;');
    }

    pintaLinhaGrid(gitens);
}


function MostrarPedidosAndamento(){

    var ajax = new Ajax('POST', 'php/principal.php', true);
    var p = 'action=MostrarPedidosAndamento';
    p+= '&idLoja=' + Selector.$('lojas').value;

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        gridPedidosAndamento.clearRows();

        if(ajax.getResponseText() == '0'){
            return;
        }else{

            var json = JSON.parse(ajax.getResponseText());
            var obras;
            var ver;

            for(var i = 0; i < json.length; i++){

                obras = DOM.newElement('img');
                obras.setAttribute('src', './../imagens/menu.png');
                obras.setAttribute('title', 'Ver as obras do pedido');
                obras.setAttribute('onclick', 'VerObrasPedido(' + json[i].idVenda + ')');

                ver = DOM.newElement('img');
                ver.setAttribute('src', './../imagens/pesquisar.png');
                ver.setAttribute('title', 'Ver pedido');
                ver.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].idVenda + '"');

                gridPedidosAndamento.addRow([
                    DOM.newText(json[i].dataVenda),
                    DOM.newText(json[i].cliente),
                    DOM.newText(json[i].loja),
                    DOM.newText(json[i].dataEntrega),
                    obras,
                    DOM.newText(json[i].situacao),
                    ver
                ]);

                gridPedidosAndamento.setRowData(gridPedidosAndamento.getRowCount() - 1, json[i].idVenda);
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:90px;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:70px;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:50px;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 5).setAttribute('style', 'text-align:left; width:200px;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px;');
            }

            pintaLinhaGrid(gridPedidosAndamento);
        }
    };

    ajax.Request(p);
}

function VerObrasPedido(idVenda){

    if (!isElement('div', 'divPromptObrasPedido')) {
        var div = DOM.newElement('div', 'divPromptObrasPedido');
        document.body.appendChild(div);
    }

    var divPromptObrasPedido = Selector.$('divPromptObrasPedido');
    divPromptObrasPedido.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptObrasPedido.appendChild(divform);

    var divObrasPedido = DOM.newElement('div', 'divObrasPedido');
    divObrasPedido.setAttribute('style', 'width:100%; height:400px; border: 1px solid lightgray; overflow:auto;');

    gridObrasPedido = new Table('gridObrasPedido');
    gridObrasPedido.table.setAttribute('cellpadding', '3');
    gridObrasPedido.table.setAttribute('cellspacing', '0');
    gridObrasPedido.table.setAttribute('class', 'tabela_jujuba_comum');

    gridObrasPedido.addHeader([
        DOM.newText(''),
        DOM.newText('Tipo'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Acabamento'),
        DOM.newText('Tamanho'),
        DOM.newText('Valor'),
        DOM.newText('Qtde.'),
        DOM.newText('Valor Total')
    ]);

    divform.appendChild(divObrasPedido);

    dialogoObrasPedido = new caixaDialogo('divPromptObrasPedido', 455, 1000, '../padrao/', 141);
    dialogoObrasPedido.Show();

    Selector.$('divObrasPedido').appendChild(gridObrasPedido.table);

    var ajax = new Ajax('POST', 'php/principal.php', true);
    var p = 'action=MostrarObrasPedido';
    p+= '&idVenda=' + idVenda;

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        if(ajax.getResponseText() == '0'){
            return;
        }else{

            var json = JSON.parse(ajax.getResponseText());
            var imagem;

            for(var i = 0; i < json.length; i++){

                imagem = DOM.newElement('img');
                imagem.setAttribute('src', json[i].imagemObraMini);
                imagem.setAttribute('onclick', 'window.open("' + json[i].imagemObra + '")');
                imagem.setAttribute('alt', 'Obra: ' + json[i].nomeObra);

                gridObrasPedido.addRow([
                    imagem,
                    DOM.newText(json[i].tipoProduto),
                    DOM.newText(json[i].artista),
                    DOM.newText(json[i].nomeObra),
                    DOM.newText(json[i].nomeAcabamento),
                    DOM.newText(json[i].tamanho),
                    DOM.newText(json[i].valor),
                    DOM.newText(json[i].qtd),
                    DOM.newText(json[i].valorTotal)
                ]);

                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; width:100px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:left;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:width:150px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:150px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:right; width:100px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:70px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:right; width:100px;');
            }

            pintaLinhaGrid(gridObrasPedido);
        }
    };

    ajax.Request(p);
}


function getMolduras(ascinc) {
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

function AlternaTipoObrasPrincipal() {

    var scrollX, scrollY;
    if (document.all) {
        if (!document.documentElement.scrollLeft)
            scrollX = document.body.scrollLeft;
        else
            scrollX = document.documentElement.scrollLeft;

        if (!document.documentElement.scrollTop)
            scrollY = document.body.scrollTop;
        else
            scrollY = document.documentElement.scrollTop;
    } else {
        scrollX = window.pageXOffset;
        scrollY = window.pageYOffset;
    }

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';

        //Selector.$('divCadastro').style.height = "430px";
        dialogoCadastro.Realinhar(470, 620);

        //Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (430 / 2)) - 0) + 'px';
        //Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";

        Selector.$('o_artista').focus();
        getTamanhosObras(true);
        Selector.$('o_imagem').style.display = 'block';
        Selector.$('o_imagem').style.margin = '0px auto';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        //Selector.$('divCadastro').style.height = "270px";
        dialogoCadastro.Realinhar(310, 620);

        //Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (270 / 2)) - 0) + 'px';
        //Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";

        Selector.$('o_tamanhoI').focus();
        Selector.$('o_imagem').src = './../imagens/semarte.png';
        Selector.$('o_imagem').style.display = 'none';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

        //Selector.$('divCadastro').style.height = "240px";
        dialogoCadastro.Realinhar(240, 620);

        //Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (240 / 2)) - 0) + 'px';
        //Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";

        Selector.$('o_produtoProd').focus();
        Selector.$('o_imagem').src = './../imagens/semarte.png';
        Selector.$('o_imagem').style.display = 'none';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
}


function AdicionarObra(codigo) {
CodigoArtista = 0;
    if (codigo == '-1') {

        if (!CheckPermissao(159, true, 'Você não possui permissão para adicionar uma obra no orçamento', false)) {
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
    
    //elemento = DOM.newElement('select');
    //elemento.setAttribute('id', 'o_artista');
    //elemento.setAttribute('class', 'combo_cinzafoco');
    //elemento.setAttribute("style", 'width:235px; margin-left:4px;');
    //elemento.setAttribute('onchange', 'getObrasArtista(true)');
    

    elemento = DOM.newElement('input');
    elemento.setAttribute('id','o_artista');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('style', 'position: absolute; background: transparent; z-index: 2; width:218px;');
    //elemento.setAttribute('onchange', 'getObrasArtista(true)');

    elemento2 = DOM.newElement('input');
    elemento2.setAttribute('id','autocomplete-ajax-x');
    elemento2.setAttribute('disabled','disabled');
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
    elemento2.setAttribute('id','o_obra_x');
    elemento2.setAttribute('disabled','disabled');
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
    elemento.setAttribute('onchange', 'getDetalhesAcabamento(); MostrarEstoqueObra();');

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
    elemento.setAttribute('onchange', 'getDetalhesAcabamento();');

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
    elemento.setAttribute('onchange', 'getDadosProduto(); getImagemProduto();');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_alturaP');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px;');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_larguraP');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px;');

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
    elemento.setAttribute("style", 'width:560px; height:40px;');

    divCadastro.appendChild(label);
    divCadastro.appendChild(elemento);

    //IMAGEM OBRA
    var divImg = DOM.newElement('div');
    divImg.setAttribute('style', 'text-align:center');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem');
    elemento.setAttribute('src', 'imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px; cursor:pointer;');
    elemento.setAttribute("name", '');
    elemento.setAttribute('onclick', 'MostraImagemTamanhoReal("nenhuma");');

    divImg.appendChild(elemento);

    divCadastro.appendChild(divImg);

    divI.innerHTML += '<br />';

    var divIncluirImagem = DOM.newElement('div', 'divIncluirImagem');
    divIncluirImagem.setAttribute('style', 'text-align:center; width:100px; margin:0 auto; display:none;');

    label = DOM.newElement('label', 'lblIncluirImagem');
    label.innerHTML = 'Incluir Imagem';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; text-decoration:underline; text-align:center;');

    divIncluirImagem.appendChild(label);
    divCadastro.appendChild(divIncluirImagem);

    var lblInfoEstoque = DOM.newElement('label', 'lblInfoEstoque');
    lblInfoEstoque.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblInfoEstoque.setAttribute('style', 'float:left; font-size:10px;');
    lblInfoEstoque.innerHTML = '';
    divCadastro.appendChild(lblInfoEstoque);

    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');

    label = DOM.newElement('label', 'e_lblCancelar');
    label.innerHTML = 'Cancelar';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle; display:none;');
   // label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');
    label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); verificaAlteracao('+ codigo +')');
    label.innerHTML = 'Cancelar';
    divElem.appendChild(label);

    divCadastro.appendChild(divElem);

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right; display:none;');
    elemento.setAttribute('onclick', 'IncluirObra(' + codigo + ')');
    elemento.innerHTML = "Incluir";

    divCadastro.appendChild(elemento);

    dialogoCadastro = new caixaDialogo('divCadastro', 545, 620, '../padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    Selector.$('divCadastro').style.overflow = 'hidden';

    Mask.setMoeda(Selector.$('o_percDesconto'));
    Mask.setMoeda(Selector.$('o_valorDesconto'));
    Mask.setMoeda(Selector.$('o_valorAcrescimo'));
    Mask.setMoeda(Selector.$('o_larguraP'));
    Mask.setMoeda(Selector.$('o_alturaP'));

    // Carrega o campo artistas com  o Autocomplete
    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=BuscaArtistas';
    p += '&codigo=' + codigo;
    ajax.Request(p);
 
    var json = JSON.parse(ajax.getResponseText());
    var arrayArtistas = new Array();
    var arrayId = new Array();
    var idArtista = 0;

    for(var i=0; i < json.length; i++) {
        arrayArtistas.push(json[i].artista);
        arrayId.push(json[i].idArtista);
    }
    var countriesArray = $.map(arrayArtistas, function (value, key) { return { value: value, data: key }; });
      //var countriesArray2 = $.map(arrayId, function (value, key) { return { value: value, data: key }; });
    $('#o_artista').autocomplete({
        //serviceUrl: '/autosuggest/service/url',
        lookup: countriesArray, 
       lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },//,
        onHint: function (hint) {
            $('#autocomplete-ajax-x').val(hint);
        },
         serviceUrl: '/autocomplete/countries',
        onSelect: function (suggestion) {
            idArtista = arrayId[suggestion.data];
            Selector.$('o_artista').setAttribute('name', idArtista);
            Selector.$('o_artista').focus();
            CodigoArtista = idArtista;
            if(Selector.$('o_artista').value.trim() != ''){
                 Selector.$('o_artista').setAttribute('onblur', 'CarregaObras('+ CodigoArtista +')');
            }
        } 
    });
   //getArtistas(Selector.$('o_artista'), 'Selecione um artista', true);
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
    

    if (!CheckPermissao(51, false, '', false)) {
        Selector.$('divObrasValores').style.display = 'none';
        Selector.$('divObrasValores').childNodes[2].style.display = 'inline-block';
        Selector.$('divObrasValores').childNodes[3].style.display = 'inline-block';
    }
}


function AlternaTipoObras() {

    Selector.$('lblInfoEstoque').innerHTML = '';

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';

        dialogoCadastro.Realinhar(535, 620);

        getTamanhosObras(true);
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        dialogoCadastro.Realinhar(505, 620);

        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem()');
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

        dialogoCadastro.Realinhar(465, 620);

        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        Selector.$('divIncluirImagem').style.display = 'block';
        Selector.$('lblIncluirImagem').setAttribute('onclick', 'AnexarImagem()');
    }
}

function getTamanhosObras(assincrona) {

    Selector.$('lblInfoEstoque').innerHTML = '';

    if (Selector.$('o_obra').value !== Selector.$('o_obra').name) {
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
    }
    else {
        return;
    }

    if (Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {
        Select.Clear(Selector.$('o_tamanho'));
        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('nenhuma');");
        return;
    }

    var ajax = new Ajax('POST', 'php/propostas.php', assincrona);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + CodigoObra;

    if (assincrona) {

        ajax.ajax.onreadystatechange = function () {

            Select.Clear(Selector.$('o_tamanho'));

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());
            Selector.$('o_imagem').src = json[0].imagem;
            Selector.$('o_imagem').setAttribute('name', json[0].img);
            Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px; cursor:pointer;');
            Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + json[0].imagemReal + "');");

            Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
        };

        Select.AddItem(Selector.$('o_tamanho'), 'Carregando tamanhos...', '0', '');

        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        Selector.$('o_imagem').src = json[0].imagem;
        Selector.$('o_imagem').setAttribute('name', json[0].img);
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px; cursor:pointer;');
        Selector.$('o_imagem').setAttribute("onclick", "MostraImagemTamanhoReal('" + json[0].imagem + "');");

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
    }
}
function CarregaObras (codigo){
    if(Selector.$('o_artista').value.trim() != ''){

     var  arrayObras = new Array ();
    var arrayIdObras = new Array ();
    var ajax = new Ajax('POST', 'php/propostas.php', false);
    var p = 'action=BuscaObras';
    p += '&codigo=' + codigo;
    ajax.Request(p);
 
    var json2 = JSON.parse(ajax.getResponseText());
    var arrayArtistas = new Array();
    var arrayIdObras = new Array();
    var idObra = 0;

    for(var i=0; i < json2.length; i++) {
        arrayObras.push(json2[i].obra);
        arrayIdObras.push(json2[i].idObra);
    }
    var countriesArray = $.map(arrayObras, function (value, key) { return { value: value, data: key }; });
      //var countriesArray2 = $.map(arrayId, function (value, key) { return { value: value, data: key }; });
    $('#o_obra').autocomplete({
        //serviceUrl: '/autosuggest/service/url',
        lookup: countriesArray, 
       lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
            var re = new RegExp('\\b' + $.Autocomplete.utils.escapeRegExChars(queryLowerCase), 'gi');
            return re.test(suggestion.value);
        },//,
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
    }else{

        Selector.$('o_obra').value  = '';
        Selector.$('o_obra').name  = 0;
        Selector.$('o_artista').value  = '';
        Selector.$('o_artista').name  = 0;
    }
}

function getObrasArtista(ascinc) {
    if (Selector.$('o_artista').value !== Selector.$('o_artista').name) {

        //Selector.$('o_artista').name = Selector.$('o_artista').value.toString();
    }
    else {
        return;
    }

    Select.Clear(Selector.$('o_obra'));

    if (Selector.$('o_artista').name === '0') {
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

            if (ajax.getResponseText() === '0') {
                return;
            }

            Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
            Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');

        };

        Select.AddItem(Selector.$('o_obra'), 'Carregando obras...', '0', '');

        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        Select.Clear(Selector.$('o_obra'));

        if (ajax.getResponseText() === '0') {
            return;
        }

        Select.AddItem(Selector.$('o_obra'), 'Selecione uma obra', '0', '');
        Select.FillWithJSON(Selector.$('o_obra'), ajax.getResponseText(), 'codigo', 'obra');
    }
}

function getDadosTamanho(item) {

        if (item === 'p') {
        if (Selector.$('o_tamanho').value !== Selector.$('o_tamanho').name) {
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
        }
        else {
            return;
        }

        if (Selector.$('o_tamanho').value === '0' || Selector.$('o_artista').name === '0' || Selector.$('o_obra').name === '0') {

            if (Selector.$('o_artista').name === '0' || Selector.$('o_obra').name === '0') {
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

            if (ajax.getResponseText() === '0') {
                return;
            }
            var json = JSON.parse(ajax.getResponseText());
           // alert(json.estrelas);
            //alert(json.estrelaAtual);
            Selector.$('o_altura').value = json.altura;
            Selector.$('o_largura').value = json.largura;
            Selector.$('o_tiragem').value = json.tiragemMaxima;
            Selector.$('o_qtdeVendidos').value = json.tiragemAtual;
            Selector.$('o_estrelas').value = json.estrelas;

            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_acabamento').value = 0;
            Selector.$('o_acabamento').name = 0;


        if(json.estrelas != json.estrelaAtual){
            var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Mudança de Estrela", "OK", "", false, "");
            mensagem.Show();
            return;
         }

        };

        ajax.Request(p);
    }
    if (item === 'i') {
        if (Selector.$('o_tamanhoI').value !== Selector.$('o_tamanhoI').name) {
            Selector.$('o_tamanhoI').name = Selector.$('o_tamanhoI').value;

            Selector.$('o_alturaI').value = '';
            Selector.$('o_larguraI').value = '';

            Selector.$('o_valor').value = '';
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
            Selector.$('o_valorAcrescimo').value = '';
            Selector.$('o_valorTotal').value = '';
            Selector.$('o_lblPeso').innerHTML = '';
        }
        else {
            return;
        }

        if (Selector.$('o_tamanhoI').value === '0') {
            Selector.$('o_acabamentoI').selectedIndex = 0;
            Selector.$('o_acabamentoI').value = 0;
            Selector.$('o_acabamentoI').name = 0;
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

            if (ajax.getResponseText() === 0) {
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            if (Number.parseFloat(json.altura) <= 0) {
                Selector.$('o_alturaI').style.backgroundColor = "#FFF";
                Selector.$('o_alturaI').removeAttribute("readonly");
                Selector.$('o_alturaI').value = json.altura;

                Mask.setMoeda(Selector.$('o_alturaI'));
            }
            else {
                Selector.$('o_alturaI').style.backgroundColor = "#F5F5F5";
                Selector.$('o_alturaI').setAttribute("readonly", "readonly");
                Selector.$('o_alturaI').value = json.altura;
            }

            if (Number.parseFloat(json.largura) <= 0) {
                Selector.$('o_larguraI').style.backgroundColor = "#FFF";
                Selector.$('o_larguraI').removeAttribute("readonly");
                Selector.$('o_larguraI').value = json.largura;

                Mask.setMoeda(Selector.$('o_larguraI'));
            }
            else {
                Selector.$('o_larguraI').style.backgroundColor = "#F5F5F5";
                Selector.$('o_larguraI').setAttribute("readonly", "readonly");
                Selector.$('o_larguraI').value = json.largura;
            }

            if (Number.parseFloat(json.altura) <= 0) {
                Selector.$('o_alturaI').select();
            }
            else {
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


function getDetalhesAcabamento() {

    var valor = Selector.$('o_valor');
    var valorTotal = Selector.$('o_valorTotal');

    if (Selector.$('o_optPhoto').checked) {
        if (Selector.$('o_acabamento').value !== Selector.$('o_acabamento').name) {
            Selector.$('o_acabamento').name = Selector.$('o_acabamento').value;
        }
        else {
            if (Selector.$('o_moldura').value !== Selector.$('o_moldura').name) {
                Selector.$('o_moldura').name = Selector.$('o_moldura').value;
            }
            else {
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

        if (artista.selectedIndex <= 0 || obra.selectedIndex <= 0 ||
                tamanho.selectedIndex <= 0 || acabamento.selectedIndex <= 0) {

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

            if (ajax.getResponseText() === '0') {
                var mensagem = new DialogoMensagens("prompt1", 140, 500, 150, "1", "Erro", "Erro ao calcular, tente novamente. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            valor.value = json.valorObra;

            Selector.$('o_lblPeso').innerHTML = 'Peso aproximado: ' + json.pesoObra + ' Kg <span style="font-size:10px">(por unidade)</span>';
            Selector.$('o_lblPeso').name = json.pesoObra;

            TotalizaObras(true, false, false, false);
           // Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
    else {

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

            if (ajax.getResponseText() === '0') {
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

            TotalizaObras(true, false, false, false);
           Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
}

function MostrarEstoqueObra() {

    if (Selector.$('loja').selectedIndex <= 0 || Selector.$('o_artista').selectedIndex <= 0 || Selector.$('o_obra').selectedIndex <= 0 || Selector.$('o_tamanho').selectedIndex <= 0 || Selector.$('o_acabamento').selectedIndex <= 0) {
        return;
    }

    Selector.$('lblInfoEstoque').innerHTML = '';

    var ajax = new Ajax('POST', 'php/pedidos.php', false);
    var p = 'action=MostrarEstoqueObra';
    p += '&idObra=' + Selector.$('o_obra').value;
    p += '&idTamanho=' + Selector.$('o_tamanho').value;
    p += '&idAcabamento=' + Selector.$('o_acabamento').value;
    p += '&idLoja=' + Selector.$('loja').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        Selector.$('lblInfoEstoque').innerHTML = 'Nenhuma obra em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '. Obra à produzir.';
        return;
    }

    var json = JSON.parse(ajax.getResponseText());

    if (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) <= 0 && parseInt(json[json.length - 1].qtdOutrasLojasComEstoque) <= 0) {
        Selector.$('lblInfoEstoque').innerHTML = 'Nenhuma obra em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '. Obra à produzir.';
        return;
    } else {
        Selector.$('lblInfoEstoque').innerHTML = (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) == 1 ? '1 obra em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '.' : parseInt(json[json.length - 1].qtdObrasLojaSelecionada) + ' obras em estoque em ' + Select.GetText(Selector.$('loja')).toLowerCase() + '.');

        if (json[json.length - 1].idsVendas.split(',').length == '1' && json[json.length - 1].idsVendas != '0') {
            if (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) == 1) {
                Selector.$('lblInfoEstoque').innerHTML += '<br> Obra vinculada ao pedido n° ' + json[json.length - 1].idsVendas;
            }
        } else {
            if (parseInt(json[json.length - 1].qtdObrasLojaSelecionada) > 1) {
                Selector.$('lblInfoEstoque').innerHTML += '<br> Obras vinculadas a outros pedidos';
            }
        }

        return;
    }

    if (parseInt(json[json.length - 1].qtdOutrasLojasComEstoque) > 0) {
        Selector.$('lblInfoEstoque').innerHTML += (parseInt(json[json.length - 1].qtdTotal) == 1 ? ' 1 obra em estoque em outra loja' : " <span title='Clique para ver a lista de lojas' style='text-decoration:underline; cursor:pointer;' onclick='PromptEstoqueLojas(" + ajax.getResponseText() + ", -1);'>" + parseInt(json[json.length - 1].qtdTotal) + " obras em estoque em outras " + parseInt(json[json.length - 1].qtdOutrasLojasComEstoque) + " loja(s).<span>");
    } else {
        Selector.$('lblInfoEstoque').innerHTML += 'Nenhuma obra em estoque em outras lojas. Obra à produzir.';
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
        }
        else {
            Selector.$('o_valorAcrescimo').value = '';
        }
    }
    
    var total = (Number.parseFloat(Selector.$('o_valor').value)+valorAcrescimo) * Number.parseFloat(Selector.$('o_qtde').value);
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
        }
        else {
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
        }
        else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    Selector.$('o_valorTotal').value = Number.FormatDinheiro((total) - Number.parseFloat(Selector.$('o_valorDesconto').value)); //+ Number.parseFloat(Selector.$('o_valorAcrescimo').value)
}

function Totaliza(is_grids, is_frete, is_acrescimo, is_percDesconto, is_valorDesconto) {

    var total1 = Number.getFloat(gridObras.SumCol(8));
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
        }
        else {
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
        }
        else {
            Selector.$('percDesconto').value = '';
            Selector.$('valorDesconto').value = '';
        }
    }

    Selector.$('valorTotal').value = Number.FormatDinheiro((total1 - Number.parseFloat(Selector.$('valorDesconto').value)) + valorFrete + valorAcrescimo);

    Selector.$('valorSaldo').value = Number.FormatDinheiro(Number.parseFloat(Selector.$('valorTotal').value) - Number.getFloat(gridPagamento.SumCol(1)));
    getPercentualComissaoMarchand();
}

function AtualizaEstrela (){
     var ajax = new Ajax('POST', 'php/propostas.php', false);
        var p = 'action=AtualizaEstrela';
        p += '&idArtistaObraTamanho=' + Selector.$('o_tamanho').value;
        p += '&qtd=' + Selector.$('o_qtde').value;
        ajax.Request(p);
        var json = JSON.parse(ajax.getResponseText());
        Selector.$('o_estrelas').value = json.estrelas;
        if(json.estrelas != json.estrelaAtual){
            var mensagem = new DialogoMensagens("prompt1", 140, 380, 150, "2", "Atenção", "Mudança de Estrela", "OK", "", false, "");
            mensagem.Show();
            return;
        }
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
    }
    else {
        return;
    }

    var aux = Select.GetText(cmb).split('-');
    Selector.$('o_valor').value = aux[aux.length - 1];

    Selector.$('o_qtde').value = '1';
    Selector.$('o_qtde').select();

    TotalizaObras(true, false, false, false);
}