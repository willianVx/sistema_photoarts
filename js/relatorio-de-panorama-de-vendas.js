checkSessao();
CheckPermissao(70, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Panorama de Vendas</div>";
    carregarmenu();
    getDadosUsuario();
    
    Select.Show(Selector.$('statusTipo'), 1);

    var retorno = Window.getParameter('return');

    if (retorno == null || retorno == ''){
        getLojas(Selector.$('loja'), 'Todas as lojas', true);
        Lista();
    }
    else{
        getLojas(Selector.$('loja'), 'Todas as lojas', false);
        
        var ajax = new Ajax('POST', 'php/relatorio-de-panorama-de-vendas.php', false);
        
        ajax.Request('action=getP');
                
        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        
        Select.Show(Selector.$('dias'), json.dias);
        Select.Show(Selector.$('loja'), json.idLoja);
        
        Lista();
    }
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Lista() {

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-panorama-de-vendas.php', true);
    var p = 'action=MostrarVendas';
    p += '&dias=' + Selector.$('dias').value;
    p += '&idLoja=' + Selector.$('loja').value;
    p += '&statusTipo=' + Selector.$('statusTipo').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            Selector.$('contador').innerHTML = "Nenhuma venda localizada para o período";
            return;
        }

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var dia = "";
        var idia = 0;
        var idVenda = 0;
        var totalDias = 0;

        for (var i = 0; i < json.length; i++) {

            if (dia != json[i].dia) {
                dia = json[i].dia;
                idia++;
                Selector.$('tabela').innerHTML += '<div class="tituloPanoramaData" style="text-align:left">' + json[i].diaSemana + ", " + json[i].dataEntrega + ' - <span id="qtdDias' + idia + '">0</span> Venda(s) para o dia </div>';
            }

            if (idVenda != json[i].idVenda) {

                idVenda = json[i].idVenda;
                totalDias++;
                Selector.$('qtdDias' + idia).innerHTML = parseInt(Selector.$('qtdDias' + idia).innerHTML) + 1;

                var html = '<div id=' + json[i].idVenda + ' class="divPanorama fonte_Roboto_texto_normal" style="width:100%; text-align:left; box-sizing:border-box; max-width:1360px; height:auto; padding:10px; border:1px solid black; margin-top:5px;  display:inline-block;">' +
                        '<input type="button" class="botaosimplesfoco"  style="float:right;" ' +
                        'value="Acessar Pedido" onclick="window.location=\'pedidos.html?idPedido=' + json[i].idVenda + '&org=panorama-de-vendas\'"/>' +
                        '<div style="font-size:18px"><strong>N° Pedido: </strong>' + json[i].numeroVenda + (json[i].consignacao=='1' ? ' <span style="color:#209219">(Consignação)</span>' : '') + '</div>' +
                        '<div><strong>Data Pedido: </strong>' + json[i].dataVenda + ' (<strong>Data Entrega: </strong>' + json[i].dataEntrega + ')</div>' +
                        '<div><strong>Loja: </strong>' + json[i].loja + '</div>' +
                        '<div><strong>Colecionador: </strong>' + json[i].cliente + '</div>' +
                        '<div><strong>Marchand: </strong>' + json[i].vendedor + '</div>' +
                        '<div><strong>Tipo Entrega: </strong>' + json[i].tipoTransporte + '</div>' +
                        '<div><strong>Status: </strong>' + json[i].status + '</div>' +
                        '<div><strong>Valor Total: </strong> R$ ' + json[i].valorTotal + '</div>' +
                        '<div><strong>Obs: </strong>' + json[i].obs + '</div><br>';
                Selector.$('tabela').innerHTML += html;

                grid = new Table('grid');
                grid.table.setAttribute('cellpadding', '5');
                grid.table.setAttribute('cellspacing', '0');
                grid.table.setAttribute('class', 'tabela_cinza_foco');

                grid.addHeader([
                    DOM.newText(''),
                    DOM.newText('Tipo'),
                    DOM.newText('Artista'),
                    DOM.newText('Obra'),
                    DOM.newText('Tamanho'),
                    DOM.newText('Acabamento'),
                    DOM.newText('Qtd'),
                    DOM.newText('Valor'),
                    DOM.newText('Peso'),
                    DOM.newText('Obs.')
                ]);

                Selector.$(json[i].idVenda).appendChild(grid.table);
            }

            var imagem = DOM.newElement('img');

            if (json[i].pasta !== '' && json[i].imagem !== '') {

                if (json[i].imagem.split('.')[1] == 'zip' || json[i].imagem.split('.')[1] == 'rar') {

                    imagem.setAttribute('src', "imagens/zip.png");
                    imagem.setAttribute('title', "Baixar Arquivo");
                    imagem.setAttribute("onclick", "BaixarImagemReal('" + "imagens/" + json[i].pasta + "/" + json[i].imagem + "');");
                } else {

                    imagem.setAttribute('src', "imagens/" + json[i].pasta + "/" + json[i].imagem);
                    imagem.setAttribute("onclick", "MostraImagemTamanhoReal('" + "imagens/" + json[i].pasta + "/" + json[i].imagem + "');");
                }
            } else {
                imagem.setAttribute('src', "imagens/semarte.png");
            }

            imagem.setAttribute('style', 'width:50px; cursor:pointer;');

            grid.addRow([
                imagem,
                DOM.newText(json[i].tipoProduto),
                DOM.newText(json[i].artista),
                DOM.newText(json[i].nomeObra),
                DOM.newText((json[i].tipoProduto == '1' ? json[i].nomeTamanho : json[i].nomeTamanhoInsta) + ' (' + json[i].altura + 'x' + json[i].largura + ')'),
                DOM.newText(json[i].nomeAcabamento + (json[i].moldura != '' ? ' (' + json[i].moldura + ')' : '')),
                DOM.newText(json[i].qtd),
                DOM.newText(json[i].valorTotalObra),
                DOM.newText(json[i].pesoObra),
                DOM.newText(json[i].obsObra)
            ]);

            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:right;');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:right;');

            pintaLinhaGrid(grid);
        }

        Selector.$('contador').innerHTML = totalDias + " Venda(s) localizada(s)";
    };

    ajax.Request(p);
}

function botExportar_onClick() {

    if (!CheckPermissao(71, true, 'Você não possui permissão para gerar excel do relatório de panorama de pedidos', false)) {
        return;
    }

    if (Selector.$('tabela').innerHTML == '') {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-panorama-de-vendas.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&dias=' + Selector.$('dias').value;

    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }
}