checkSessao();
CheckPermissao(94, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Fluxo de Caixa</div>";
    getDadosUsuario();
    carregarmenu();
    ajustaAlturaTabela();

    getLojas(Selector.$('loja'), 'Todas as lojas', false);

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '3');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Data'),
        DOM.newText('Loja'),
        DOM.newText('Descrição'),
        DOM.newText('Valor'),
        DOM.newText('Saldo')
    ]);

    Selector.$('divTabela').appendChild(grid.table);

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Mostrar();
};

window.onresize = function () {
    ajustaAlturaTabela();
};

function ajustaAlturaTabela() {
    Selector.$('divTabela').style.height = ((document.documentElement.clientHeight - Selector.$('cabecalho').clientHeight - Selector.$('divBarraFerramentas').clientHeight) - 80) + "px";
};

function Mostrar() {

    var ajax = new Ajax('POST', 'php/fluxo-de-caixa.php', true);

    grid.clearRows();

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('botPesquisar').disabled = false;

        if (ajax.getResponseText() === '-1') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var data = "";
        var saldoAnterior = 0;
        var somatoria = 0;
        var textoSomatoria = '';
        var lblVazio1 = '';
        var lblVazio2 = '';
        var lblVazio3 = '';
        var lblVazio4 = '';

        for (var i = 0; i < json.length; i++) {

            if (i === 0) {

                lblVazio1 = DOM.newElement('label');
                lblVazio1.innerHTML = "";

                saldoAnterior = json[0].saldoAnterior;

                grid.addRow([
                    DOM.newText(json[0].ultimoDiaMes),
                    DOM.newText(''),
                    DOM.newText('SALDO ANTERIOR'),
                    lblVazio1,
                    DOM.newText(saldoAnterior)
                ]);

                grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:right; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:right; font-weight:bold');
            }

            if (json[i].dataPago !== data) {

                if (i > 0 && i !== json.length) {

                    if (textoSomatoria.length == 8) {
                        if (textoSomatoria.indexOf('-') == 0) {
                            textoSomatoria = textoSomatoria.replace('.', '');
                        }
                    }

                    lblVazio2 = DOM.newElement('label');
                    lblVazio2.innerHTML = "";

                    grid.addRow([
                        DOM.newText(''),
                        DOM.newText(''),
                        DOM.newText("SALDO DIA"),
                        lblVazio2,
                        DOM.newText(textoSomatoria)
                    ]);

                    grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'border:none;');
                    grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; font-weight:bold');
                    grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; font-weight:bold');
                    grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'border:none;');
                    grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:right; font-weight:bold');
                }

                data = json[i].dataPago;

                lblVazio3 = DOM.newElement('label');
                lblVazio3.innerHTML = "";

                grid.addRow([
                    DOM.newText(json[i].dataPago),
                    DOM.newText(''),
                    DOM.newText(''),
                    lblVazio3,
                    DOM.newText('')
                ]);

                grid.getCell(grid.getRowCount() - 1, 0).style.textAlign = 'center';

                grid.getCell(grid.getRowCount() - 1, 0).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 1).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 2).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 3).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 4).style.border = 'none';
            }

            var valorPago = DOM.newElement('label');

            if (json[i].debito === '1') {

                valorPago.innerHTML = "-" + json[i].valorPago;
                valorPago.setAttribute('style', 'color:red');

                if (i === 0) {
                    var primeiroValor = DOM.newElement('label');
                    primeiroValor.innerHTML = "-" + json[i].valorPago;
                    primeiroValor.setAttribute('style', 'color:red');
                }

                var valorNegativo = json[i].valorPago;
                valorNegativo = valorNegativo.replace(".", "").replace(",", ".");
                valorNegativo = parseFloat(valorNegativo) * -1;
                json[i].valorPago = valorNegativo;

            } else {
                valorPago.innerHTML = json[i].valorPago;

                if (i === 0) {
                    var primeiroValor = DOM.newElement('label');
                    primeiroValor.innerHTML = json[i].valorPago;
                }

                var valor = json[i].valorPago;
                valor = valor.replace(".", "").replace(",", ".");
                valor = parseFloat(valor);
                json[i].valorPago = valor;
            }

            if (i === 0) {

                var resultado = saldoAnterior;
                resultado = resultado.replace(".", "").replace(",", ".");
                resultado = parseFloat(resultado);
                saldoAnterior = resultado;
                somatoria = saldoAnterior + json[i].valorPago;
            } else {

                somatoria += json[i].valorPago;
            }

            textoSomatoria = Number.FormatDinheiro(somatoria);

            if (i === 0) {

                grid.addRow([
                    DOM.newText(''),
                    DOM.newText(json[i].loja),
                    DOM.newText((json[i].descricao == null ? '' : json[i].descricao)),
                    primeiroValor,
                    DOM.newText('')
                ]);

                grid.getCell(grid.getRowCount() - 1, 0).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 1).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 2).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 3).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 4).style.border = 'none';
            } else {

                grid.addRow([
                    DOM.newText(''),
                    DOM.newText(json[i].loja),
                    DOM.newText((json[i].descricao == null ? '' : json[i].descricao)),
                    valorPago,
                    DOM.newText('')
                ]);

                grid.getCell(grid.getRowCount() - 1, 0).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 1).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 2).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 3).style.border = 'none';
                grid.getCell(grid.getRowCount() - 1, 4).style.border = 'none';
            }

            if (json.length === (i + 1)) {

                lblVazio4 = DOM.newElement('label');
                lblVazio4.innerHTML = "";

                grid.addRow([
                    DOM.newText(''),
                    DOM.newText(''),
                    DOM.newText("SALDO FINAL"),
                    lblVazio4,
                    DOM.newText(textoSomatoria)
                ]);

                grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'border:none;');
                grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'border:none;');
                grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:right; font-weight:bold');
            }

            grid.getCell(grid.getRowCount() - 1, 0).style.textAlign = 'center';
            grid.getCell(grid.getRowCount() - 1, 2).style.textAlign = 'left';
            grid.getCell(grid.getRowCount() - 1, 3).style.textAlign = 'right';
            grid.getCell(grid.getRowCount() - 1, 4).style.textAlign = 'right';

            pintaLinhaGrid(grid);
        }

        for (var j = 0; j < grid.getRowCount(); j++) {
            grid.getCell(j, 3).style.textAlign = 'right';
        }
    };

    var p = 'action=Pesquisar';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&loja=' + Selector.$('loja').value;
    p += '&debitos=' + Selector.$('debitos').checked;
    p += '&creditos=' + Selector.$('creditos').checked;

    Selector.$('botPesquisar').disabled = true;

    ajax.Request(p);
}

function GerarImpressao() {

    if(!CheckPermissao(95, true, 'Você não possui permissão para imprimir o fluxo de caixa', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "2", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=fluxo-de-caixa');
}

function botExportar_onClick() {

    if(!CheckPermissao(96, true, 'Você não possui permissão para gerar o excel do fluxo de caixa', false)){
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/fluxo-de-caixa.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&loja=' + Selector.$('loja').value;
    p += '&debitos=' + Selector.$('debitos').checked;
    p += '&creditos=' + Selector.$('creditos').checked;
    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }
}