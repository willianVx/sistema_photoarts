checkSessao();
CheckPermissao(67, false, '', true);

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Relatório de Pedidos</div>";
    carregarmenu();
    getDadosUsuario();

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));
    
    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    
    var retorno = Window.getParameter('return');

    if (retorno == null || retorno == '') {        
        getLojas(Selector.$('galeria'), 'MARKET PLACE', false);
        CarregaMarchands(false);

        getStatusPedido(Selector.$('status'), 'Todos', true);
        getFormasPagamentos(Selector.$('formas'), "Todos", true);
        checkLoja('galeria');
        checkMarchand('marchand');
        Lista();
    }
    else{
        getLojas(Selector.$('galeria'), 'MARKET PLACE', false);        
        getStatusPedido(Selector.$('status'), 'Todos', false);
         getFormasPagamentos(Selector.$('formas'), "Todos", false);
        
        var ajax = new Ajax('POST', 'php/relatorio-de-panorama-de-vendas.php', false);
        
        ajax.Request('action=getP');
                
        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        Selector.$('de').value = json.de;
        Selector.$('ate').value = json.ate;
        
        Select.Show(Selector.$('galeria'), json.idGaleria);
        CarregaMarchands(false);
        Select.Show(Selector.$('marchand'), json.idMarchand);
        Select.Show(Selector.$('status'), json.idStatus);
        
        
        Lista();
    }

    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function CarregaMarchands(ascinc) {

    if (Selector.$('galeria').value !== Selector.$('galeria').name) {
        Selector.$('galeria').name = Selector.$('galeria').value;
        getVendedores(Selector.$('marchand'), "Todos", ascinc, 'MARCHANDS', Selector.$('galeria').value);
    } else {
        return;
    }
}

window.onresize = function () {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
};

function Lista() {

    if (Selector.$('botPesquisar').value == 'Pesquisando...')
        return;

    Selector.$('tabela').innerHTML = "";

    var ajax = new Ajax('POST', 'php/relatorio-de-pedidos.php', true);
    var p = 'action=MostrarPedidos';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idStatus=' + Selector.$('status').value;
    p += '&idFormaPagamento=' + Selector.$('formas').value;
    p += '&dtCadastro=' + (Selector.$('dtCadastro').checked ===  true ? '1' : '0');

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('contador').innerHTML = "Nenhum pedido localizado no período";
            Selector.$('botPesquisar').value = 'Pesquisar';
            Selector.$('tabela').style.minHeight = '30px';
            return;
        }

        var div = Selector.$('tabela');

        grid = new Table('grid');
        grid.table.setAttribute('cellpadding', '3');
        grid.table.setAttribute('cellspacing', '0');
        grid.table.setAttribute('class', 'tabela_cinza_foco');

        grid.addHeader([
            DOM.newText('N°'),
            DOM.newText('Data Cadastro'),
            DOM.newText('Data Pedido'),
            DOM.newText('Loja'),
            DOM.newText('Colecionador'),
            DOM.newText('Obras'),
            DOM.newText('Valor'),
            DOM.newText('Frete'),
            DOM.newText('Total'),
            DOM.newText('Pagamento'),
            DOM.newText('Marchand'),
            DOM.newText('Status'),
            DOM.newText(''),
            DOM.newText('')
        ]);

        div.appendChild(grid.table);

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var ver;
        var obras;
        var cor;
        var status;

        for (var i = 0; i < json.length; i++) {

            obras = DOM.newElement('label');
            obras.innerHTML = json[i].obras;

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Pedido');
            ver.setAttribute('style', 'cursor:pointer');
            ver.setAttribute('onclick', 'AbrirPedido(' + json[i].idPedido + ')');

            status = DOM.newElement('select');
            status.setAttribute('id', 'selectStatus'+json[i].idPedido);
            status.setAttribute('class', 'combo_cinzafoco');
            status.setAttribute('style', 'width:150px;');
         


            email = DOM.newElement('img');
            email.setAttribute('src', 'imagens/email2.png');
            email.setAttribute('title', 'Enviar E-mail - Aviso de retirada');
            email.setAttribute('style', 'cursor:pointer');
            email.setAttribute('id', 'imgpedido'+ i);
            email.setAttribute('onclick', 'AvisoRetirada(' + json[i].idPedido + ',' + i + ')');

            grid.addRow([
                DOM.newText(json[i].numeroPedido),
                DOM.newText(json[i].dataCadastro),
                DOM.newText(json[i].dataVenda),
                DOM.newText(json[i].loja),
                DOM.newText(json[i].cliente),
                obras,
                DOM.newText(json[i].valor),
                DOM.newText(json[i].valorFrete),
                DOM.newText(json[i].valorTotal),
                DOM.newText(json[i].formaPagamento),
                DOM.newText(json[i].marchand),
                status,
                //DOM.newText(json[i].descricaoStatus),
                email,
                ver
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idPedido);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:50px');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:left; width:200px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:left; width:380px;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:right; width:90px;');
            grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'text-align:right; width:90px;');
            grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'text-align:right; width:90px;');
            grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:120px;');
            grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'text-align:left; width:120px;');
            grid.getCell(grid.getRowCount() - 1, 11).setAttribute('style', 'text-align:center; width:40px;');
            grid.getCell(grid.getRowCount() - 1, 12).setAttribute('style', 'text-align:center; width:40px;');
            getStatusPedido(Selector.$('selectStatus'+json[i].idPedido ), 'Todos', false);
            grid.getCellObject(i,11).value = json[i].idStatus;
            status.setAttribute('onchange', 'MudaStatusPedido(' + json[i].idPedido + ','+ Selector.$('selectStatus'+json[i].idPedido+'').value +')');
            

            
            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }

        grid.addRow([
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('Total'),
            DOM.newText(Number.FormatMoeda(grid.SumCol(6))),
            DOM.newText(Number.FormatMoeda(grid.SumCol(7))),
            DOM.newText(Number.FormatMoeda(grid.SumCol(8))),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText(''),
            DOM.newText('')
        ]);

        grid.getRow(grid.getRowCount() - 1).setAttribute('style', 'font-size:18px; font-weight:bold');

        grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'font-size:18px;text-align:center; width:50px');
        grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'font-size:18px;text-align:center; width:100px;');
        grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'font-size:18px;text-align:left; width:200px;');
        grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'font-size:18px;text-align:left;');
        grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'font-size:18px;text-align:left; width:380px;');
        grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'font-size:18px;text-align:right; width:90px;');
        grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'font-size:18px;text-align:right; width:90px;');
        grid.getCell(grid.getRowCount() - 1, 7).setAttribute('style', 'font-size:18px;text-align:right; width:90px;');

        grid.getCell(grid.getRowCount() - 1, 8).setAttribute('style', 'font-size:18px;text-align:center; width:120px;');

        grid.getCell(grid.getRowCount() - 1, 9).setAttribute('style', 'font-size:18px;text-align:left; width:120px;');
        grid.getCell(grid.getRowCount() - 1, 10).setAttribute('style', 'font-size:18px;text-align:center; width:100px;');
        grid.getCell(grid.getRowCount() - 1, 11).setAttribute('style', 'font-size:18px;text-align:center; width:40px;');
        grid.getCell(grid.getRowCount() - 1, 12).setAttribute('style', 'font-size:18px;text-align:center; width:40px;');


        Selector.$('contador').innerHTML = json.length + " pedido(s) localizado(s)";
        Selector.$('botPesquisar').value = 'Pesquisar';

    };

    Selector.$('botPesquisar').value = 'Pesquisando...';
    ajax.Request(p);
}


function MudaStatusPedido (idPedido, vlAnterior){
    mensagemAviso = new DialogoMensagens("prompt", 140, 350, 150, "2", "Aviso !", "Deseja mudar o status deste pedido? ", "OK", "MudaStatusPedidoAux("+idPedido+")", true, "");
    mensagemAviso.Show();
    Selector.$('btcancel').setAttribute('onclick','retornarValor('+idPedido+','+vlAnterior+')');


}

function retornarValor(idPedido , vlAnterior){
    Selector.$('selectStatus'+idPedido).value = vlAnterior;
    mensagemAviso.Close();
}
function MudaStatusPedidoAux (idPedido){
    mensagemAviso.Close();

    var ajax = new Ajax('POST','php/relatorio-de-pedidos.php', true);
    var p = 'action=MudaStatusPedido';
    p += '&idPedido=' + idPedido;
    p += '&status=' + Selector.$('selectStatus'+idPedido).value;
    p += '&statusDesc=' + Select.GetText(Selector.$('selectStatus'+idPedido));

    ajax.Request(p);
     if (ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        codigoAtualProducao = ajax.getResponseText();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Status atualizado com sucesso!", "OK", "", false, "");
        mensagem.Show();
        Lista();
        return;
    }
}

function AvisoRetirada (idPedido, linha){
   
   mensagemAviso = new DialogoMensagens("prompt", 140, 350, 150, "2", "Aviso !", "E-mail destinado a clientes com o tipo de entrega 'RETIRADA', deseja realizar o envio? ", "OK", "AvisoRetiradaAux("+idPedido+", "+linha+")", true, "");
   mensagemAviso.Show();
}

function AvisoRetiradaAux (idPedido, linha){

    mensagemAviso.Close();
    var ajax = new Ajax('POST', 'php/pedidos.php', true);
    var p = 'action=AvisoRetirada';
    p += '&idPedido=' + idPedido;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('imgpedido' + linha).setAttribute('src', 'imagens/email2.png');
        if (ajax.getResponseText() == '0') {
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao enviar o pedido por email. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "3", "Sucesso!", "Email enviado com sucesso!", "OK", "", false, "");
            mensagem.Show();
            return;
        }
    }

    Selector.$('imgpedido'+ linha).setAttribute('src', 'imagens/grid_carregando.gif');
    ajax.Request(p);
}

function AbrirPedido(idPed) {
    if (idPed <= 0)
        return;
    window.open("pedidos.html?idPedido=" + idPed + "&org=relatorio-de-pedidos","_blank");
   // window.location = 'pedidos.html?idPedido=' + idPed + '&org=relatorio-de-pedidos';
}

function botExportar_onClick() {

    if (!CheckPermissao(69, true, 'Você não possui permissão para gerar excel do relatório de pedidos', false)) {
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 125, 340, 150, "4", "Atenção!", "Faça uma pesquisa para gerar o arquivo excel.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/relatorio-de-pedidos.php', false);
    var p = 'action=ExportarPlanilha';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idStatus=' + Selector.$('status').value;
    p += '&idFormaPagamento=' + Selector.$('formas').value;
    p += '&dtCadastro=' + (Selector.$('dtCadastro').checked ===  true ? '1' : '0');

    ajax.Request(p);

    if (ajax.getResponseText() == '-1') {
        var mensagem = new DialogoMensagens("prompt", 155, 340, 150, "1", "Erro!", "Problemas ao gerar a planilha. Tente novamente, caso o erro persista, contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        window.open(ajax.getResponseText());
    }
}

function Imprimir_onClick() {

    if (!CheckPermissao(68, true, 'Você não possui permissão para imprimir o relatório de pedidos', false)) {
        return;
    }

    if (grid.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 430, 150, "4", "Atenção!", "Faça uma pesquisa para visualizar a impressão do relatório.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    window.open('impressao-de-relatorios.html?source=relatorio-de-pedidos');
}

function Limpar() {

    setDataDeAte(Selector.$('de'), Selector.$('ate'));
    Selector.$('formas').selectedIndex = 0;
    Selector.$('galeria').selectedIndex = 0;
    Selector.$('marchand').selectedIndex = 0;

    grid.clearRows();
    Selector.$('contador').innerHTML = "";

    Selector.$('de').focus();
}

function GerarPdf() {

    var ajax = new Ajax('POST', 'php/relatorio-de-pedidos.php', true);
    var p = 'action=GerarPdf';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&idGaleria=' + Selector.$('galeria').value;
    p += '&idMarchand=' + Selector.$('marchand').value;
    p += '&idStatus=' + Selector.$('status').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() != '') {
            window.open(ajax.getResponseText());
        }
    }

    ajax.Request(p);
}