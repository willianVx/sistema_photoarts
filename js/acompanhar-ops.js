checkSessao();
CheckPermissao(116, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Acompanhamento de OP's</div>";
    carregarmenu();
    getDadosUsuario();
    getLojas(Selector.$('galeria'), 'Todas', false);
    getEtapasOrdensProducao(Selector.$('etapas'), "Selecione uma Etapa", false);
    Select.Show(Selector.$('statusBusca'), 1);
    Mask.setOnlyNumbers(Selector.$('codigo'));
    Lista();
};

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Lista() {

    if (Selector.$('botPesquisar').value == 'Pesquisando...')
        return;

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=getEtapasOrdensProducao';
    
    ajax.Request(p);
    var ArrayEtapas = ajax.getResponseText();

    var ajax = new Ajax('POST', 'php/acompanhar-ops.php', true);
    var p = 'action=Pesquisar';
    p += '&loja=' + Selector.$('galeria').value;
    p += '&dias=' + Selector.$('dias').value;
    p += '&etapa=' + Selector.$('etapas').value;
    p += '&statusBusca=' + Selector.$('statusBusca').value;
    p += '&codigo=' + Selector.$('codigo').value;
    p += '&pedido=' + Selector.$('pedido').value;
    p += '&refeitas=' + Selector.$('filtroRefeitas').checked;

    ajax.ajax.onreadystatechange = function () {
        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhuma ordem de produção localizada no período";
            Selector.$('botPesquisar').value = 'Pesquisar';
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );
        var div = Selector.$('tabela');

        var codigo = 0;

        for (var i = 0; i < json.length; i++) {

            if (codigo !== json[i].codigo) {
                codigo = json[i].codigo;
                div.innerHTML += '<div class="divbranca" style="max-width:970px; text-align:left"> ' +
                        '<h1 class="fonte_Roboto_titulo_normal"><span>ORDEM DE PRODUÇÃO Nº ' + json[i].codigo + (json[i].refeita == '1' ? ' (Refeita) ' : ' ') + (parseInt(json[i].idVenda)>0 ? ' - - - - - Pedido Nº: ' + json[i].idVenda : '') + '</span>' +
                        '<label style="float:right"><span style="color:#CCC; font-weight:normal">Previsão - </span> ' + json[i].previsao + '</label></h1>' +
                        '<h1 class="fonte_Roboto_texto_normal"><span>' + json[i].obs + '</span></h1>' +
                        '<div id="tabela' + json[i].codigo + '" style="background:#E8E8E8; min-height:10px;"> </div></div>';

                var grid = new Table('grid' + json[i].codigo);
                grid.table.setAttribute('id', 'grid' + json[i].codigo);
                grid.table.setAttribute('cellpadding', '4');
                grid.table.setAttribute('cellspacing', '0');
                grid.table.setAttribute('class', 'tabela_cinza_foco');

                grid.addHeader([
                    DOM.newText('Item'),
                    DOM.newText('Imagens'),
                    DOM.newText('Artista'),
                    DOM.newText('Obra'),
                    DOM.newText('Tamanho'),
                    DOM.newText('Acabamento'),
                    DOM.newText('Qtde'),
                    DOM.newText('Etapa')
                ]);

                Selector.$('tabela' + json[i].codigo).appendChild(grid.table);
            }

            var imagem = DOM.newElement('img');
            imagem.src = json[i].imagem;
            imagem.setAttribute('style', 'width:50px; cursor:pointer');
            imagem.title = json[i].imagem;
            imagem.setAttribute('onclick', 'MostraImagemTamanhoReal("' + json[i].imagem + '")');

            var etapa = null;

            var etapa = DOM.newElement('select', 'combo' + json[i].codigoComp);
            etapa.setAttribute('id', 'combo' + json[i].codigoComp);
            etapa.setAttribute('style', 'width:300px');
            etapa.setAttribute('class', 'combo_cinzafoco');
            etapa.setAttribute('onchange', 'AlterarEtapa("combo' + json[i].codigoComp + '",' + json[i].codigoComp + ')');

            grid.addRow([
                DOM.newText(grid.getRowCount() + 1),
                imagem,
                DOM.newText(json[i].artista),
                DOM.newText(json[i].obra),
                DOM.newText(json[i].nomeTamanho + (json[i].idTipoProduto == '3' ? '' : ' (' + json[i].altura + 'x' + json[i].largura + ')')),
                DOM.newText(json[i].acabamento),
                DOM.newText(json[i].qtd),
                etapa
            ]);

            Select.AddItem(etapa, "Selecione uma Etapa", 0);

            if (ArrayEtapas !== 0)
                Select.FillWithJSON(Selector.$('combo' + json[i].codigoComp), ArrayEtapas, "codigo", "nome");

            //Select.Show(Selector.$('combo' + json[i].codigoComp), json[i].idEtapa);

            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center;width:40px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:center;width:300px');
        }

        for (var i = 0; i < json.length; i++) {
            Select.Show(Selector.$('combo' + json[i].codigoComp), json[i].idEtapa);
            Selector.$('combo' + json[i].codigoComp).name = json[i].idEtapa;
        }

        Selector.$('contador').innerHTML = json.length + " pedido(s) localizado(s)";
        Selector.$('botPesquisar').value = 'Pesquisar';
    };

    Selector.$('botPesquisar').value = 'Pesquisando...';
    ajax.Request(p);
}

function Limpar() {

    Selector.$('galeria').selectedIndex = 0;
    Selector.$('dias').selectedIndex = 0;
    Selector.$('etapas').selectedIndex = 0;
    Selector.$('codigo').value = "";
    Selector.$('contador').innerHTML = "";
    Selector.$('tabela').innerHTML = "";
    Selector.$('filtroRefeitas').checked = false;
}

function AlterarEtapa(cmb, codigo) {

    if (Selector.$(cmb).name == Selector.$(cmb).value)
        return;

    Selector.$(cmb).name = Selector.$(cmb).value;

    var ajax = new Ajax('POST', 'php/acompanhar-ops.php', false);
    var p = 'action=alterarEtapa&codigo=' + codigo + '&etapa=' + Selector.$(cmb).value + '&nomeEtapa=' + Select.GetText(Selector.$(cmb));
    ajax.Request(p);
}

function LimparTable(){
    Selector.$('tabela').innerHTML = "";
    Selector.$('contador').innerHTML = 'Selecione os filtros e clique em "Pesquisar"';
}