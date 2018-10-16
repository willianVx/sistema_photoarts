var descontoMaximo = 0;
var descontoMaximoObra = 0;
var gerente = 0;

function DestruirSessao() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    ajax.Request('action=DestruirSessao');
}

function ValidarSessao() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    ajax.Request('action=ValidarSessao');

    if (ajax.getResponseText() == '0') {
        window.location = 'index.html?url=' + window.location.href;
    }
}

function CarregarGalerias(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=CarregarGalerias';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhuma loja', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idLoja', 'loja');
            var json = JSON.parse(ajax.getResponseText());

            for (var i = 0; i < json.length; i++) {

                cmb.innerHTML += '<option value=' + json[i].idLoja + ' id="06710660">' + json[i].loja + '</option>';
            }
        };

        Select.AddItem(cmb, 'Carregando as lojas...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhuma loja', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idLoja', 'loja');
        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += '<option value=' + json[i].idLoja + ' id="06710660">' + json[i].loja + '</option>';
        }
    }
}

function CarregarMarchandsGaleria(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=CarregarMarchandsGaleria';
    p += '&idLoja=' + Selector.$('login_galeria').value;

    Select.Clear(cmb);

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum marchand', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVendedor', 'vendedor');
        };

        Select.AddItem(cmb, 'Carregando os marchands...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum marchand', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVendedor', 'vendedor');
    }
}

function CarregarDadosUsuario() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    ajax.Request('action=CarregarDadosUsuario');

    var json = JSON.parse(ajax.getResponseText());

    Selector.$('nomeGaleria').innerHTML = json.galeria;
    Selector.$('nomeGaleria').name = json.idGaleria;
    Selector.$('nomeUsuario').innerHTML = json.vendedor;
    Selector.$('nomeUsuario').name = json.idVendedor;

    document.title += ' | Marchand: ' + json.vendedor.split(', ')[1].trim();
    descontoMaximoObra = json.descontoMaximoObras;
    descontoMaximo = json.descontoMaximo;
    gerente = json.gerente;
}

function isElement(type, id) {

    var as = document.getElementsByTagName(type);
    for (var i = 0; i < as.length; i++) {
        if (as[i].id === id) {
            return true;
        }
    }
    return false;
}

function pintaLinhaGrid(grid) {

    var cor = true;

    for (var i = 0; i <= grid.getRowCount() - 1; i++) {
        cor = !cor;
        grid.getRow(i).setAttribute('class', 'pintaFundo' + (cor ? 1 : 2));
    }
}

function getArtistas(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getArtistas';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum artista', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idArtista', 'artista');
        };

        Select.AddItem(cmb, 'Carregando os artistas...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum artista', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idArtista', 'artista');
    }
}

function getAcabamentos(cmb, texto, assincrono, tipo) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getAcabamentos';
    p += '&tipo=' + tipo;

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum acabamento', 0);
                return;
            }

            var json = JSON.parse(ajax.getResponseText());

            Select.AddItem(cmb, texto, 0);
            for (var i = 0; i < json.length; i++) {

                cmb.innerHTML += "<option value='" + json[i].codigo + "' id=" + json[i].bloquearVendaUltrapassou1M + ">" + json[i].nome + "</option>";
            }
        };

        Select.AddItem(cmb, 'Carregando os acabamentos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum acabamento', 0);
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Select.AddItem(cmb, texto, 0);
        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += "<option value='" + json[i].codigo + "' id=" + json[i].bloquearVendaUltrapassou1M + ">" + json[i].nome + "</option>";
        }
    }
}

function getTamanhos(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getTamanhos';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrada nenhum tamanho', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idTamanho', 'nomeTamanho');
        };

        Select.AddItem(cmb, 'Carregando os tamanhos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrada nenhum tamanho', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idTamanho', 'nomeTamanho');
    }
}

function getDadosTamanho(item) {

    if (item === 'p') {
        if (Selector.$('o_tamanho').value !== Selector.$('o_tamanho').name) {
            Selector.$('o_tamanho').name = Selector.$('o_tamanho').value;

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

        if (Selector.$('o_tamanho').value === '0' || Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {

            if (Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {
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

        var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
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

            Selector.$('o_altura').value = json.altura;
            Selector.$('o_largura').value = json.largura;
            Selector.$('o_tiragem').value = json.tiragemMaxima;
            Selector.$('o_qtdeVendidos').value = json.tiragemAtual;
            Selector.$('o_estrelas').value = json.estrelas;

            Selector.$('o_acabamento').selectedIndex = 0;
            Selector.$('o_acabamento').value = 0;
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
            return;
        }

        var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
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
        };

        ajax.Request(p);
    }
}

function getProdutos(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getProdutos';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum produto', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando os produtos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum produto', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function getObrasArtista(ascinc) {

    if (Selector.$('o_artista').value !== Selector.$('o_artista').name) {
        Selector.$('o_artista').name = Selector.$('o_artista').value;
    }
    else {
        return;
    }

    Select.Clear(Selector.$('o_obra'));

    if (Selector.$('o_artista').value === '0') {
        //getDadosTamanho('p');
        Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', '0', '');
        getTamanhosObras();
        return;
    }

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getObras';
    p += '&idArtista=' + Selector.$('o_artista').value;

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

function AlternaTipoObras() {

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

        //Selector.$('divCadastro').style.height = "505px";
        dialogoCadastro.Realinhar(505, 620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (505 / 2)) - 0) + 'px';
         Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_artista').focus();
        getTamanhosObras(true);
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        //Selector.$('divCadastro').style.height = "480px";
        dialogoCadastro.Realinhar(480, 620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (460 / 2)) - 0) + 'px';
         Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_tamanhoI').focus();
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('divIncluirImagem').style.display = 'block';
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

        //Selector.$('divCadastro').style.height = "450px";
        dialogoCadastro.Realinhar(450, 620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (450 / 2)) - 0) + 'px';
         Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_produtoProd').focus();
        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
}

function getTamanhosObras(ascinc) {

    if (Selector.$('o_obra').value !== Selector.$('o_obra').name) {
        Selector.$('o_obra').name = Selector.$('o_obra').value;
    }
    else {
        return;
    }

    if (Selector.$('o_artista').value === '0' || Selector.$('o_obra').value === '0') {

        Select.Clear(Selector.$('o_tamanho'));

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', '0', '');
        Selector.$('o_imagem').src = './../imagens/semarte.png';
        getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));
        return;
    }

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getTamanhosObras';
    p += '&idObra=' + Selector.$('o_obra').value;

    if (ascinc) {
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
            Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');

            Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
            Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');

            getDadosTamanho((Selector.$('o_optPhoto').checked ? 'p' : 'i'));

        };

        Select.AddItem(Selector.$('o_tamanho'), 'Carregando tamanhos...', '0', '');

        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        Select.Clear(Selector.$('o_tamanho'));

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());
        Selector.$('o_imagem').src = json[0].imagem;
        Selector.$('o_imagem').setAttribute('name', json[0].img);
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');

        Select.AddItem(Selector.$('o_tamanho'), 'Selecione um tamanho', '0', '');
        Select.FillWithJSON(Selector.$('o_tamanho'), ajax.getResponseText(), 'codigo', 'tamanho');
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

        var artista = Selector.$('o_artista');
        var obra = Selector.$('o_obra');
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

        var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
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
            Selector.$('o_qtde').select();
        };

        ajax.Request(p);
    }
    else {

        /*if (Selector.$('o_acabamentoI').value !== Selector.$('o_acabamentoI').name) {
         Selector.$('o_acabamentoI').name = Selector.$('o_acabamentoI').value;
         }else {
         return;
         }*/

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

        //var valor = Selector.$('o_valor');
        //var valorTotal = Selector.$('o_valorTotal');

        var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
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

function TotalizaObras(is_qtd, is_percDesconto, is_valorDesconto, is_valorAcrescimo) {

    //FAZER A TOTALIZA OBRA
    var total = Number.parseFloat(Selector.$('o_valor').value) * Number.parseFloat(Selector.$('o_qtde').value);
    var percDesconto = Number.parseFloat(Selector.$('o_percDesconto').value);
    var valorDesconto = Number.parseFloat(Selector.$('o_valorDesconto').value);
    var valorAcrescimo = Number.parseFloat(Selector.$('o_valorAcrescimo').value);

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
            } else if (percDesconto > Number.parseFloat(descontoMaximoObra)) {
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
            } else if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) > Number.parseFloat(descontoMaximoObra)) {
                Selector.$('o_percDesconto').value = Number.parseFloat(descontoMaximoObra);
                percDesconto = Number.parseFloat(descontoMaximoObra);
                Selector.$('o_valorDesconto').value = Number.FormatDinheiro((total) * (percDesconto / 100));
            }

            if (Number.parseFloat(Number.FormatDinheiro((valorDesconto / (total)) * 100)) <= Number.parseFloat(descontoMaximoObra)) {
                Selector.$('o_percDesconto').value = Number.FormatDinheiro((valorDesconto / (total)) * 100);
            }
        }
        else {
            Selector.$('o_percDesconto').value = '';
            Selector.$('o_valorDesconto').value = '';
        }
    }

    if (is_valorAcrescimo) {
        if (valorAcrescimo > 0) {
            if (valorAcrescimo > (total)) {
                Selector.$('o_valorAcrescimo').value = Number.FormatDinheiro((total));
                valorAcrescimo = total;
            }
        }
        else {
            Selector.$('o_valorAcrescimo').value = '';
        }
    }

    Selector.$('o_valorTotal').value = Number.FormatDinheiro((total) - Number.parseFloat(Selector.$('o_valorDesconto').value) + Number.parseFloat(Selector.$('o_valorAcrescimo').value));
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

DialogoMensagens = function (div, altura, largura, posicaoz, tipo_prompt, titulo, mensagem, nomeBotao, funcaoBotao, mostraBotaoCancelar, campoFocus) {

    Selector.$(div).innerHTML = "<input type='text' id='promptConfirmacaoFoco' />";
    Selector.$('promptConfirmacaoFoco').focus();
    Selector.$(div).innerHTML = "";
    //div = nome da div no html
    //altura = a altura que o prompt vai ter
    //largura = a largura que o prompt vai ter
    ////posicaoz = z-index do prompt
    //tipo_prompt = 1: vermelho (Erro), 2: amarelo (aviso), 3: verde (sucesso) e 4: azul (informação)
    //titulo = o titulo da prompt
    //mensagem = mensagem da prompt
    //nomeBotao = o nome que vai aparecer do botão (não é no botão Cancelar)
    //funcaoBotao = a função que o botão vai chamar (passar esse parametro entre aspaz)
    //botaoCancelar = true ou false (true: mostra o botão Cancelar e false esconde o  botão Cancelar)
    //campoFocus = nome do campo que você quer colocar o foco depois que fechar a prompt

    // Bloqueio
    this.divBlock = document.createElement('div');
    this.divBlock.setAttribute("id", "divBlock");
    this.divBlock.style.position = 'absolute';
    this.divBlock.style.backgroundColor = '#FFF';
    this.divBlock.style.left = '0px';
    this.divBlock.style.top = "0px";
    this.divBlock.style.width = '100%';
    this.divBlock.style.height = '100%';
    this.divBlock.style.filter = 'alpha(opacity=80)';
    this.divBlock.style.opacity = 0.8;
    this.divBlock.style.cursor = 'not-allowed';
    this.divBlock.style.visibility = 'hidden';
    this.divBlock.align = "center";
    this.divBlock.style.zIndex = posicaoz;
    if (typeof (div) === "string") {
        Selector.$(div).style.zIndex = posicaoz + 1;
    } else {
        div.style.zIndex = posicaoz + 1;
    }

    document.body.appendChild(this.divBlock);
    //calcula altura e largura da pagina
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

    this.divBlock.style.top = scrollY + 'px';

    this.imgFechar = document.createElement('img');
    this.imgFechar.setAttribute('title', 'Fechar');
    this.imgFechar.setAttribute('src', './../imagens/fechar.png');
    this.imgFechar.setAttribute('style', 'float: right; cursor:pointer;');
    this.imgFechar.caixaDialogo = this;

    this.imgFechar.onclick = function () {
        this.caixaDialogo.Close();
    };

    this.tituloDiv = document.createElement('h4');
    this.tituloDiv.innerHTML = titulo;
    this.mensagemDiv = document.createElement('p');
    this.mensagemDiv.innerHTML = mensagem;
    this.botao = document.createElement('a');

    if (funcaoBotao === "") {
        this.botao.caixaDialogo = this;
        this.botao.onclick = function () {
            this.caixaDialogo.Close();
        };
    } else {

        this.botao.setAttribute('onclick', funcaoBotao);
    }

    this.botao.innerHTML = nomeBotao;
    this.botaoCancelar = document.createElement('a');
    this.botaoCancelar.style.marginLeft = '5px';
    this.botaoCancelar.setAttribute('class', 'botaobrancosuave_prompt');
    this.botaoCancelar.innerHTML = "Cancelar";
    this.botaoCancelar.caixaDialogo = this;
    this.botaoCancelar.onclick = function () {
        this.caixaDialogo.Close();
    };

    if (tipo_prompt === '1') {
        Selector.$(div).setAttribute('class', 'div_erro');
        this.botao.setAttribute('class', 'botaovermelhosuave_prompt');
    } else if (tipo_prompt === '2') {
        Selector.$(div).setAttribute('class', 'div_alerta');
        this.botao.setAttribute('class', 'botaoamarelosuave_prompt');
    } else if (tipo_prompt === '3') {
        Selector.$(div).setAttribute('class', 'div_sucesso');
        this.botao.setAttribute('class', 'botaoverdesuave_prompt');
    } else {
        Selector.$(div).setAttribute('class', 'div_info');
        this.botao.setAttribute('class', 'botaoazulsuave_prompt');
    }

    if (typeof (div) === "string") {
        Selector.$(div).style.height = altura + "px";
        Selector.$(div).style.width = largura + "px";
        Selector.$(div).style.visibility = 'hidden';
        document.body.appendChild(Selector.$(div));
        Selector.$(div).style.position = "absolute";
        Selector.$(div).style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
        Selector.$(div).style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    } else {
        div.style.height = altura + "px";
        div.style.width = largura + "px";
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        div.style.position = "absolute";
        div.style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
        div.style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    }

    Selector.$(div).appendChild(this.imgFechar);
    Selector.$(div).appendChild(this.tituloDiv);
    Selector.$(div).appendChild(this.mensagemDiv);
    Selector.$(div).appendChild(this.botao);
    if (mostraBotaoCancelar) {
        Selector.$(div).appendChild(this.botaoCancelar);
    }

    this.Show = function () {
        this.divBlock.style.visibility = 'visible';
        if (typeof (div) === "string") {
            Selector.$(div).style.visibility = 'visible';
        } else {
            div.style.visibility = 'visible';
        }

        document.body.style.overflow = 'hidden';
    };
    this.Close = function () {
        this.divBlock.style.visibility = 'hidden';
        if (typeof (div) === "string") {
            Selector.$(div).style.visibility = 'hidden';
        } else {
            div.style.visibility = 'hidden';
        }

        document.body.style.overflow = 'visible';
        if (campoFocus !== '') {

            if (isElement('select', campoFocus)) {
                Selector.$(campoFocus).focus();
            } else if (Selector.$(campoFocus).value !== '') {
                Selector.$(campoFocus).select();
            }

            Selector.$(campoFocus).focus();
        }
    };
    this.HideCloseIcon = function () {
        this.imgFechar.style.visibility = 'hidden';
    };
    this.setColorBlock = function (cor)
    {
        this.divBlock.style.backgroundColor = cor;
    };
    this.setOpacityBlock = function (transparencia)
    {
        this.divBlock.style.filter = 'alpha(opacity=' + transparencia + ')';
        this.divBlock.style.opacity = (transparencia / 100);
    };
    this.setHeight = function (div, heigth) {
        Selector.$(div).style.height = heigth + "px";
    };
    this.setWidth = function (div, width) {
        Selector.$(div).style.width = width + "px";
    };
    caixaDialogo.imagePath = './imagens/';
};

function MostrarMsg(msg, campo) {
    var mensagem = new DialogoMensagens("prompt", 120, 350, 180, "2", "Atenção!", msg, "OK", "", false, campo);
    mensagem.Show();
}

function getStatusOrcamento(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getStatusOrcamento';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum status', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idOStatus', 'status');
        };

        Select.AddItem(cmb, 'Carregando os status...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum status', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idOStatus', 'status');
    }
}

function getMarchands(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getMarchands';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Nenhum marchand encontrado', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);

            var loja = "";

            var json = JSON.parse(ajax.getResponseText());
            for (var i = 0; i < json.length; i++) {

                if (loja !== json[i].loja) {
                    loja = json[i].loja;

                    var objItem = null;
                    objItem = document.createElement('optgroup');
                    objItem.setAttribute('label', loja);
                    cmb.appendChild(objItem);
                }

                Select.AddItem(cmb, json[i].tipo + " - " + json[i].nome, json[i].codigo);
            }
        };

        Select.AddItem(cmb, 'Carregando os marchand...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Nenhum marchand encontrado', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);

        var loja = "";

        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            if (loja !== json[i].loja) {
                loja = json[i].loja;

                var objItem = null;
                objItem = document.createElement('optgroup');
                objItem.setAttribute('label', loja);
                cmb.appendChild(objItem);
            }

            Select.AddItem(cmb, json[i].nome, json[i].codigo);
        }
    }
}

function getClientes(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getClientes';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum cliente', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando os clientes...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum cliente', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function getTiposTransportes(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getTiposTransportes';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum tipo de transporte', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando os tipos de transportes...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum tipo de transporte', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function getFormasPagamentos(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getFormasPagamentos';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrada nenhuma forma de pagamento', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idFormaPagamento', 'formaPagamento');
        };

        Select.AddItem(cmb, 'Carregando as formas de pagamentos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrada nenhuma forma de pagamento', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idFormaPagamento', 'formaPagamento');
    }
}

function getVendedores(cmb, texto, ascinc, condicao, loja) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getVendedores&idLoja=' + loja;

    SelectVendedores.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            SelectVendedores.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum marchand', 0);
                return;
            }

            SelectVendedores.AddItem(cmb, texto, 0);
            SelectVendedores.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome', 'tipo', condicao);
        };

        SelectVendedores.AddItem(cmb, 'Carregando os marchands...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            SelectVendedores.AddItem(cmb, 'Não foi encontrado nenhum marchand', 0);
            return;
        }

        SelectVendedores.AddItem(cmb, texto, 0);
        SelectVendedores.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome', 'tipo', condicao);
    }
}

var SelectVendedores = {
    FillWithJSON: function (obj, txt, idField, nameField, typeField, condicao) {

        if (txt == '')
            return;

        var objJSON = JSON.parse(txt);
        var objItem = null;
        var titulo1 = true;
        var titulo2 = true;

        for (var i in objJSON) {

            if (titulo1 && objJSON[i][typeField] === condicao) {
                var titulo = (SelectVendedores.AddTitle(obj, objJSON[i][typeField]));
                titulo1 = false;

            }

            if (titulo2 && objJSON[i][typeField] !== condicao) {
                var titulo = (SelectVendedores.AddTitle(obj, objJSON[i][typeField]));
                titulo2 = false;
            }

            SelectVendedores.AddItem(titulo, objJSON[i][nameField], objJSON[i][idField], objJSON[i][typeField]);
        }
    },
    AddTitle: function (obj, text) {
        var objTitle = null;
        objTitle = document.createElement('optgroup');
        objTitle.setAttribute('label', text);
        obj.appendChild(objTitle);
        return objTitle;
    },
    AddItem: function (obj, text, value, type) {
        var objItem = null;
        objItem = document.createElement('option');
        objItem.setAttribute('value', value);
        objItem.setAttribute('name', type);
        objItem.appendChild(document.createTextNode(text));
        obj.appendChild(objItem);
    },
    Clear: function (obj) {
        if (obj.childNodes.length > 0) {
            for (var i = obj.childNodes.length - 1; i >= 0; i--) {
                obj.removeChild(obj.childNodes[i]);
            }
        }
    },
    Show: function (obj, id) {


        for (var i = 0; i < obj.length; i++) {
            if (parseInt(id) === parseInt(obj.options[i].value))
            {
                obj.selectedIndex = i;
                return;
            }
        }
    },
    ShowText: function (obj, Text) {

        for (var i = 0; i < obj.length; i++) {
            if (Text == obj.options[i].text)
            {
                obj.selectedIndex = i;
                return;
            }
        }
    },
    GetText: function (obj) {
        return obj.options[obj.selectedIndex].text;
    },
    SetText: function (obj, text) {
        return obj.options[obj.selectedIndex].text = text;
    },
    GetOption: function (obj) {
        return obj.options[obj.selectedIndex];
    }
}

function getComissaoMarchand() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    var p = 'action=getComissaoMarchand';
    p += '&idVendedor=' + Selector.$('vendedor').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '0') {
        return;
    } else {

        var json = JSON.parse(ajax.getResponseText());
        descontoMaximo = json.descontoMaximo;
        descontoMaximoObra = json.descontoMaximoObras;
    }
}

function getGruposMolduras(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getGruposMolduras';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhuma grupo', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando os grupos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum grupo', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function getMoldurasObras(cmb, texto, assincrono, idGrupo, photo) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getMolduras&idGrupo=' + idGrupo + '&photo=' + photo;

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() == '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhuma moldura', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando as molduras...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhuma moldura', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function SetarGaleriaMarchand(idCampoGaleria, idCampoMarchand, idCampoMarchand2) {

    Select.Show(Selector.$(idCampoMarchand), Selector.$('nomeUsuario').name);
    Select.Show(Selector.$(idCampoGaleria), Selector.$('nomeGaleria').name);

    CarregaMarchands(false);

    Select.Show(Selector.$(idCampoMarchand2), Selector.$('nomeUsuario').name);

    /*if (gerente == '0' && Selector.$('nomeUsuario').name > 0 && Selector.$('nomeGaleria').name > 0) {
     Selector.$(idCampoMarchand).disabled = true;
     Selector.$(idCampoGaleria).disabled = true;
     Selector.$(idCampoMarchand2).disabled = true;
     }*/
}

function SelecionaTipoFisicaJuridia() {

    if (Selector.$('cliente_cpf').checked) {
        Mask.setCPF(Selector.$('cliente_in_tipo'));
        Selector.$('cliente_nome').setAttribute('placeholder', 'Nome ou Apelido');
    }
    else {
        Mask.setCNPJ(Selector.$('cliente_in_tipo'));
        Selector.$('cliente_nome').setAttribute('placeholder', 'Razão ou Fantasia');
    }
}

function PromptPesquisarClientes() {

    if (!isElement('div', 'divPesquisa_cliente')) {
        var divPesquisa_cliente = DOM.newElement('div', 'divPesquisa_cliente');
        document.body.appendChild(divPesquisa_cliente);
    }

    var divPesquisa_cliente = Selector.$('divPesquisa_cliente');
    divPesquisa_cliente.innerHTML = '';

    var lblNome = DOM.newElement('label');
    lblNome.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNome.innerHTML = 'Nome';
    divPesquisa_cliente.appendChild(lblNome);

    var txtNome = DOM.newElement('input', 'cliente_nome');
    txtNome.setAttribute('type', 'text');
    txtNome.setAttribute('style', 'width:470px; margin: 0px 8px;');
    txtNome.setAttribute('class', 'textbox_cinzafoco');
    txtNome.setAttribute('onkeydown', 'cliente_nome_down(event)');
    divPesquisa_cliente.appendChild(txtNome);

    var cbAtivo = DOM.newElement('checkbox', 'cliente_ativo');
    divPesquisa_cliente.appendChild(cbAtivo);

    var lblAtivo = DOM.newElement('label');
    lblAtivo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAtivo.innerHTML = 'Ativo';
    divPesquisa_cliente.appendChild(lblAtivo);

    divPesquisa_cliente.innerHTML += '<br/><br/>';

    var rdCpf = DOM.newElement('radio');
    rdCpf.setAttribute('id', 'cliente_cpf');
    rdCpf.setAttribute('name', 'cliente_tipo');
    rdCpf.setAttribute('style', 'cursor:pointer;');
    rdCpf.setAttribute('onclick', 'selecionaPessoa()');
    divPesquisa_cliente.appendChild(rdCpf);

    var lblCpf = DOM.newElement('label');
    lblCpf.setAttribute('style', 'cursor:pointer;');
    lblCpf.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCpf.setAttribute('for', 'cliente_cpf');
    lblCpf.innerHTML = 'CPF';
    lblCpf.setAttribute('onclick', 'selecionaPessoa()');
    divPesquisa_cliente.appendChild(lblCpf);

    var rdCnpj = DOM.newElement('radio', 'cliente_cnpj');
    rdCnpj.setAttribute('id', 'cliente_cnpj');
    rdCnpj.setAttribute('style', 'margin-left: 10px; cursor:pointer;');
    rdCnpj.setAttribute('name', 'cliente_tipo');
    rdCnpj.setAttribute('onclick', 'selecionaPessoa()');
    divPesquisa_cliente.appendChild(rdCnpj);

    var lblCnpj = DOM.newElement('label');
    lblCnpj.setAttribute('style', 'cursor:pointer;');
    lblCnpj.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCnpj.setAttribute('for', 'cliente_cnpj');
    lblCnpj.innerHTML = 'CNPJ';
    lblCnpj.setAttribute('onclick', 'selecionaPessoa()');
    divPesquisa_cliente.appendChild(lblCnpj);

    var lblTelefone = DOM.newElement('label');
    lblTelefone.setAttribute('style', 'margin-left: 73px;');
    lblTelefone.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblTelefone.innerHTML = 'Telefone';
    divPesquisa_cliente.appendChild(lblTelefone);

    var lblCelular = DOM.newElement('label');
    lblCelular.setAttribute('style', 'margin-left: 75px;');
    lblCelular.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCelular.innerHTML = 'Celular';
    divPesquisa_cliente.appendChild(lblCelular);

    divPesquisa_cliente.innerHTML += "<br/>";

    var txtTipoCliente = DOM.newElement('input', 'cliente_in_tipo');
    txtTipoCliente.setAttribute('type', 'text');
    txtTipoCliente.setAttribute('style', 'width:190px;');
    txtTipoCliente.setAttribute('class', 'textbox_cinzafoco');
    divPesquisa_cliente.appendChild(txtTipoCliente);

    var txtTelefone = DOM.newElement('input', 'cliente_in_telefone');
    txtTelefone.setAttribute('type', 'text');
    txtTelefone.setAttribute('style', 'width:130px; margin-left:10px;');
    txtTelefone.setAttribute('class', 'textbox_cinzafoco');
    divPesquisa_cliente.appendChild(txtTelefone);

    var txtCelular = DOM.newElement('input', 'cliente_in_celular');
    txtCelular.setAttribute('type', 'text');
    txtCelular.setAttribute('style', 'width:130px; margin-left:10px;');
    txtCelular.setAttribute('class', 'textbox_cinzafoco');
    divPesquisa_cliente.appendChild(txtCelular);

    var cmdPesquisar = DOM.newElement('button', 'cliente_pesquisar');
    cmdPesquisar.setAttribute('style', 'float:right;');
    cmdPesquisar.setAttribute('class', 'botaosimplesfoco');
    cmdPesquisar.setAttribute('onclick', 'MostraResultadoClientes()');
    cmdPesquisar.innerHTML = 'Pesquisar';
    divPesquisa_cliente.appendChild(cmdPesquisar);

    divPesquisa_cliente.innerHTML += "<br/><br/>";

    var lblAviso = DOM.newElement('label');
    lblAviso.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblAviso.innerHTML = '* clique sobre o cliente para selecioná-lo';
    divPesquisa_cliente.appendChild(lblAviso);

    divPesquisa_cliente.innerHTML += "<br/>";

    var tbPesquisa = DOM.newElement('div', 'tbPesquisa');
    tbPesquisa.setAttribute('style', 'height:300px; margin-top:10px; overflow:auto;');
    divPesquisa_cliente.appendChild(tbPesquisa);

    dialogoPesquisaClientes = new caixaDialogo('divPesquisa_cliente', 500, 650, '../padrao/', 130);
    dialogoPesquisaClientes.Show();

    Mask.setTelefone(Selector.$('cliente_in_telefone'));
    Mask.setOnlyNumbers(Selector.$('cliente_in_celular'));
    Selector.$('cliente_cpf').checked = true;
    Selector.$('cliente_ativo').checked = true;
    SelecionaTipoFisicaJuridia();

    gridClientes = new Table('gridClientes');
    gridClientes.table.setAttribute('cellpadding', '2');
    gridClientes.table.setAttribute('cellspacing', '3');
    gridClientes.table.setAttribute('class', 'tabela_cinza_foco');

    gridClientes.addHeader([
        DOM.newText('Nome'),
        DOM.newText('Apelido'),
        DOM.newText('CPF / CNPJ'),
        DOM.newText('Telefone'),
        DOM.newText('Celular')
    ]);

    Selector.$('tbPesquisa').appendChild(gridClientes.table);

    Selector.$('cliente_nome').focus();
}

function cliente_nome_down(ev) {
    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        MostraResultadoClientes();
    }
}

function MostraResultadoClientes() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
    var p = "action=MostraResultadoClientes";
    p += "&nome=" + Selector.$('cliente_nome').value;
    p += '&ativo=' + Selector.$('cliente_ativo').checked;
    p += "&cpfCnpj=" + Selector.$('cliente_in_tipo').value;
    p += "&telefone=" + Selector.$('cliente_in_telefone').value;
    p += "&celular=" + Selector.$('cliente_in_celular').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        gridClientes.clearRows();

        if (ajax.getResponseText() === '0') {
            MostrarMsg("Nenhum cliente encontrado", 'cliente_nome');
            Selector.$('cliente_pesquisar').innerHTML = 'Pesquisar';
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        var cor = true;
        for (var i = 0; i < json.length; i++) {

            gridClientes.addRow([
                DOM.newText(json[i].nome),
                DOM.newText(json[i].apelido),
                DOM.newText(json[i].cpfCnpj),
                DOM.newText(json[i].telefone),
                DOM.newText(json[i].celular)
            ]);

            gridClientes.setRowData(gridClientes.getRowCount() - 1, json[i].codigo);
            gridClientes.getRow(gridClientes.getRowCount() - 1).setAttribute('onclick', 'MostraResultadoPesquisaClientes(' + json[i].codigo + ');');
            gridClientes.getRow(gridClientes.getRowCount() - 1).setAttribute('style', 'cursor:pointer');
            gridClientes.getCell(gridClientes.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:100px;');
            gridClientes.getCell(gridClientes.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:100px;');
            gridClientes.getCell(gridClientes.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:100px;');

            if (cor) {
                cor = false;
                gridClientes.setRowBackgroundColor(gridClientes.getRowCount() - 1, "#F5F5F5");
            } else {
                cor = true;
                gridClientes.setRowBackgroundColor(gridClientes.getRowCount() - 1, "#FFF");
            }

            Selector.$('cliente_pesquisar').innerHTML = 'Pesquisar';
        }
    };

    Selector.$('cliente_pesquisar').innerHTML = 'Pesquisando...';
    ajax.Request(p);
}

function MostraResultadoPesquisaClientes(codigo) {

    if (window.location.href.split('/')[window.location.href.split('/').length - 1] == 'principal.html') {
        PromptCadastrarClienteRapido(codigo);
        dialogoPesquisaClientes.Close();
    }
    else {
        dialogoPesquisaClientes.Close();
        Select.Show(Selector.$('cliente'), codigo);
        //Selector.$('cliente').onclick();
        
        Selector.$('cliente').name = '';
        LoadDadosCliente();
        getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
        if (Selector.$('enderecos').length == 2) {
            Selector.$('tipoTransporte').focus();
        }
    }
}

function SelecionaTipoFisicaJuridiaCadastroCliente() {

    if (Selector.$('fisica').checked) {
        Mask.setCPF(Selector.$('cpf'));
        Selector.$('masc').checked = true;
        Selector.$('rotulocpf').innerHTML = "CPF";
        Selector.$('rotulorg').innerHTML = "RG";
        Selector.$('rotulodatanasc').innerHTML = "Data de Nascimento";
        Selector.$('rotulonome').innerHTML = "Nome";
        Selector.$('rotuloapelido').innerHTML = "Apelido";
        Selector.$('divSexoMasc').style.display = "inline-block";
        Selector.$('divSexoFem').style.display = "inline-block";
    } else {
        Mask.setCNPJ(Selector.$('cpf'));
        Selector.$('rotulocpf').innerHTML = "CNPJ";
        Selector.$('rotulorg').innerHTML = "IE";
        Selector.$('rotulodatanasc').innerHTML = "Data de Fundação";
        Selector.$('rotulonome').innerHTML = "Razão";
        Selector.$('rotuloapelido').innerHTML = "Fantasia";
        Selector.$('divSexoMasc').style.display = "none";
        Selector.$('divSexoFem').style.display = "none";
    }

    Selector.$('cpf').value = "";
    Selector.$('cpf').name = false;
    Selector.$('rg').value = "";
    Selector.$('dataNasc').value = "";
    Selector.$('nome').value = "";
    Selector.$('apelido').value = "";
}

function PromptCadastrarClienteRapido(idCliente) {

    if (!isElement('div', 'PromptClientes')) {
        var div = DOM.newElement('div', 'PromptClientes');
        document.body.appendChild(div);
    }

    div = Selector.$("PromptClientes");
    div.innerHTML = '';

    div.innerHTML += '<div id="div0" style="margin-top:0px; border-color:#D7D7D7; overflow:hidden" class="divformulario">' +
            '<label style="float:right;"><label style="color:red;">*</label> Campos obrigatórios</label>' +
            '<input style="margin-left:-1px" id="fisica" name="grupo1" type="radio" onclick="SelecionaTipoFisicaJuridiaCadastroCliente();"/><label for="fisica">Física</label>' +
            '<input id= "juridica" name="grupo1" type="radio" onclick="SelecionaTipoFisicaJuridiaCadastroCliente();" /><label for="juridica">Jurídica</label><br />' +
            '<div class="divcontainer" style="max-width: 200px;">' +
            '<label id="rotulocpf">CPF</label>' +
            '<input type="text" style="max-width:200px" id="cpf" class="textbox_cinzafoco"/></div>' +
            '<div class="divcontainer" style="max-width: 150px; margin-left:10px;">' +
            '<label  id="rotulorg">RG</label>' +
            '<input type="text" style="max-width:150px" id="rg" class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style="max-width: 120px; margin-left:10px;">' +
            '<label  id="rotulodatanasc">Data de Nascimento</label>' +
            '<input type="text" style="width:100%"  id="dataNasc" class="textbox_cinzafoco" />' +
            '</div>' +
            '<div id="divSexoMasc" class="divcontainer" style="width:auto; margin-left:5px;">' +
            '<input checked="checked" id="masc" type="radio" name="sexo"  />' +
            '<label for="masc">Masculino</label>' +
            '</div>' +
            '<div id="divSexoFem"  class="divcontainer" style="width:auto; margin-left:5px;">' +
            '<input id="femin" type="radio" name="sexo"  />' +
            '<label for="femin">Feminino</label>' +
            '</div>' +
            '<div class="divcontainer" style="width:auto; margin-left:5px;">' +
            '<input id="ativo" type="checkbox" checked="checked"/>' +
            '<label for="ativo">Ativo</label>' +
            '</div>' +
            '<div class="divcontainer" style="width:auto; margin-left:5px;">' +
            '<input id="premium" type="checkbox"/>' +
            '<label for="premium">Premium</label>' +
            '</div>' +
            '<br />' +
            '<div class="divcontainer" style="max-width: 350px;"><label  id="rotulonome">Nome</label> <label style="color:red;">*</label>' +
            '<input placeHolder="Ex.: João da Silva" type="text" id="nome" style="width:100%"  class="textbox_cinzafoco" /></div>' +
            '<div class="divcontainer" style="max-width: 265px; margin-left:10px;">' +
            '<label  id="rotuloapelido">Apelido</label><label style="color:red;"></label>' +
            '<input placeHolder="Ex.: João" type="text" id="apelido" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style="max-width:150px; margin-left:10px;">' +
            '<label>Data Cadastro</label> <label style="color:red;">*</label>' +
            '<input type="text"  id="cadastro" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div>' +
            '<br />' +
            /*'<div class="divcontainer" style="max-width: 98px;">' +
             '<label>CEP <span id="lblcep"></span></label>' +
             '<input placeHolder="Ex.: 01010-000" id="cep" type="text" style="width:100%"  class="textbox_cinzafoco" onblur="BuscarCEP();" />' +
             '</div>' +
             '<div class="divcontainer" style="max-width: 300px; margin-left:10px;">' +
             '<label>Endereço </label>' +
             '<input id="endereco" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
             '</div>' +
             '<div class="divcontainer" style="max-width: 100px; margin-left:10px;">' +
             '<label>Número </label>' +
             '<input id="numero" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
             '</div>' +
             '<div class="divcontainer" style="max-width: 260px; margin-left:10px;">' +
             '<label>Complemento </label>' +
             '<input id="complemento" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
             '</div>' +
             '<br />' +
             '<div class="divcontainer" style="max-width: 335px;">' +
             '<label>Bairro </label>' +
             '<input id="bairro" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
             '</div>' +
             '<div class="divcontainer" style="max-width: 335px; margin-left:10px;">' +
             '<label>Cidade </label>' +
             '<input id="cidade" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
             '</div>' +
             '<div class="divcontainer" style="max-width: 90px; margin-left:10px;">' +
             '<label>Estado </label>' +
             '<input value="SP" id="estado" type="text" style="width:100%"  maxlength="2" class="textbox_cinzafoco" />' +
             '</div><br />' +*/
            '<div class="divcontainer" style="max-width: 170px;">' +
            '<label>Responsável </label>' +
            '<input placeHolder="Ex.: Carlos" id="responsavel" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style="max-width: 100px; margin-left:10px;">' +
            '<label>Telefone<label style="color:red;">*</label></label>' +
            '<input placeHolder="(11) 4444-5555" id="telefone2" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style="max-width: 105px; margin-left:10px;">' +
            '<label>Celular<label style="color:red;">*</label></label>' +
            '<input placeHolder="(11) 94444-5555" id="celular" type="text" style="width:100%"  class="textbox_cinzafoco  " />' +
            '</div>' +
            '<div class="divcontainer" style="max-width: 170px; margin-left:10px;">' +
            '<label>Email<label style="color:red;">*</label></label>' +
            '<input placeHolder="Ex.: nome@exemplo.com.br" id="email2" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style=" max-width: 195px; margin-left:10px;">' +
            '<label>Site</label>' +
            '<input placeHolder="Ex.: www.meusite.com.br" id="site" type="text"  class="textbox_cinzafoco" style="width:100%" />' +
            '</div>' +
            '<br />' +
            '<div class="divcontainer" style=" width:790px; vertical-align: top; margin-left: 4px">' +
            '<label for="ativo">Observações</label>' +
            '<textarea id="obs" class="textbox_cinzafoco" style="width:100%; height: 90px"></textarea>' +
            '<span class="fonte_Roboto_titulo_normal" id="ultimaAtualizacaopor" style="color:#999; font-size:12px"></span>' +
            '</div>' +
            '</div>';

    var divBotoes = DOM.newElement('div');
    divBotoes.setAttribute('class', 'divabasControles');

    var gravar = DOM.newElement('button');
    gravar.setAttribute('id', 'gravar');
    gravar.setAttribute('class', 'botaosimplesfoco');
    gravar.setAttribute("style", 'float:right; display:inline-block;');
    gravar.innerHTML = 'Gravar';
    gravar.setAttribute('onclick', 'GravarClienteRapido(' + idCliente + ');');

    var fechar = DOM.newElement('button');
    fechar.setAttribute('id', 'fechar');
    fechar.setAttribute('class', 'botaosimplesfoco');
    fechar.setAttribute("style", 'float:right; margin-left:5px; display:inline-block;');
    fechar.innerHTML = 'Fechar';
    fechar.setAttribute('onclick', 'dialogoCadastroClienteRapido.Close();');

    divBotoes.appendChild(fechar);
    divBotoes.appendChild(gravar);
    div.appendChild(divBotoes);

    dialogoCadastroClienteRapido = new caixaDialogo('PromptClientes', 415, 870, '../padrao/', 150);
    dialogoCadastroClienteRapido.Show();
    dialogoCadastroClienteRapido.HideCloseIcon();

    Selector.$('fisica').checked = true;
    Mask.setCPF(Selector.$('cpf'));
    Mask.setOnlyNumbers(Selector.$('rg'));
    Mask.setCelular(Selector.$('celular'));
    Mask.setTelefone(Selector.$('telefone2'));
    //Mask.setCEP(Selector.$('cep'));
    //Mask.setOnlyNumbers(Selector.$('numero'));
    Mask.setData(Selector.$('dataNasc'));
    Selector.$('cadastro').value = Date.GetDate(false);

    if (idCliente <= 0) {
        Selector.$('cpf').focus();
    }
    else {
        var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);

        var p = 'action=MostrarClienteRapido';
        p += '&idCliente=' + idCliente;

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            //MostrarMsg('Problemas ao carregar o cliente', '');
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        if (json.tipo == 'J') {
            Selector.$('juridica').checked = true;
        }
        else {
            Selector.$('fisica').checked = true;
        }

        Selector.$('cpf').value = json.cpfCnpj;
        Selector.$('rg').value = json.rgIE;
        Selector.$('dataNasc').value = json.dataNascimento;

        if (json.sexo == 'M') {
            Selector.$('masc').checked = true;
        }
        else {
            Selector.$('femin').checked = true;
        }

        Selector.$('ativo').checked = parseInt(json.ativo);

        Selector.$('nome').value = json.cliente;
        Selector.$('apelido').value = json.apelido;
        Selector.$('cadastro').value = json.dataCadastro;
        /*Selector.$('cep').value = json.cep;
         Selector.$('endereco').value = json.endereco;
         Selector.$('numero').value = json.numero;
         Selector.$('complemento').value = json.complemento;
         Selector.$('bairro').value = json.bairro;
         Selector.$('cidade').value = json.cidade;
         Selector.$('estado').value = json.estado;*/
        Selector.$('responsavel').value = json.responsavel;
        Selector.$('telefone2').value = json.telefone;
        Selector.$('celular').value = json.celular;
        Selector.$('email2').value = json.email;
        Selector.$('site').value = json.site;
        Selector.$('obs').value = json.obs;
    }
}

function GravarClienteRapido(idCliente) {

    if (Selector.$('nome').value.trim() === '') {
        MostrarMsg("Por favor, informe a razão do cliente.", 'nome');
        return false;
    }

    if (Selector.$('apelido').value.trim() === '') {
        //MostrarMsg("Por favor, informe a um apelido do cliente.", 'apelido');
        //return false;
    }

    if (Selector.$('telefone2').value.trim() === '' && Selector.$('celular').value.trim() === '') {
        MostrarMsg("Por favor, informe o número de telefone ou celular do cliente.", 'telefone2');
        return false;
    }

    if (Selector.$('email2').value.trim() === '') {
        MostrarMsg("Por favor, informe um e-mail do cliente.", 'email2');
        return false;
    }

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    var p = 'action=GravarClienteRapido';
    //p += '&codigo=' + codigoAtual;
    p += '&idCliente=' + idCliente;
    p += '&nome=' + Selector.$('nome').value;
    p += '&apelido=' + Selector.$('apelido').value;
    if (Selector.$('ativo').checked) {
        p += '&ativo=1';
    } else {
        p += '&ativo=0';
    }
    if (Selector.$('fisica').checked === true) {
        p += '&tipo=F';
    } else {
        p += '&tipo=J';
    }

    if (Selector.$('premium').checked) {
        p += '&premium=1';
    } else {
        p += '&premium=0';
    }

    p += '&cpf=' + Selector.$('cpf').value;
    p += '&rg=' + Selector.$('rg').value;
    p += '&sexoM=' + Selector.$('masc').checked;
    p += '&dataNasc=' + Selector.$('dataNasc').value;
    p += '&cadastro=' + Selector.$('cadastro').value;
    /*p += '&cep=' + Selector.$('cep').value;
     p += '&endereco=' + Selector.$('endereco').value;
     p += '&numero=' + Selector.$('numero').value;
     p += '&complemento=' + Selector.$('complemento').value;
     p += '&bairro=' + Selector.$('bairro').value;
     p += '&cidade=' + Selector.$('cidade').value;
     p += '&estado=' + Selector.$('estado').value;*/
    p += '&responsavel=' + Selector.$('responsavel').value;
    p += '&telefone=' + Selector.$('telefone2').value;
    p += '&celular=' + Selector.$('celular').value;
    p += '&email=' + Selector.$('email2').value;
    p += '&site=' + Selector.$('site').value;
    p += '&obs=' + Selector.$('obs').value;
    ajax.Request(p);

    if (parseInt(ajax.getResponseText()) === 0) {
        MostrarMsg("Erro ao gravar o colecionador. Se o erro persistir contate o suporte técnico", '');
        return;
    } else {
        if (window.location.href.split('/')[window.location.href.split('/').length - 1] == 'principal.html') {
            MostrarMsg('Colecionador alterado com sucesso', '');
        }
        else {
            getClientesPremium(Selector.$('cliente'), "Selecione um cliente", false);
            Selector.$('cliente').value = ajax.getResponseText();
            dialogoCadastroClienteRapido.Close();
            LoadDadosCliente();
            PromptColecionadorEndereco('-2');
        }
    }
}

function VerificarSenhaPadrao() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    ajax.Request('action=VerificarSenhaPadrao');

    if (ajax.getResponseText() == '1') {
        var mensagem = new DialogoMensagens("prompt", 160, 400, 150, "4", "Alterar Senha", 'A sua senha é a padrão do sistema. Você será direcionado para alterar sua senha para uma mais segura.', "OK", "window.location='alterar-senha.html'", false, '');
        mensagem.Show();
        mensagem.HideCloseIcon();
    }
}

function getImagemProduto() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    var p = 'action=getImagemProduto';
    p += '&idProduto=' + Selector.$('o_produtoProd').value;
    ajax.Request(p);

    if (ajax.getResponseText() == '') {

        Selector.$('o_imagem').src = '../imagens/semarte.png';
        Selector.$('divIncluirImagem').style.display = 'block';
    } else {

        Selector.$('o_imagem').src = '../imagens/produtos/' + ajax.getResponseText();
        Selector.$('o_imagem').setAttribute('name', ajax.getResponseText());
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');
        Selector.$('divIncluirImagem').style.display = 'none';
    }
}

function PromptColecionadorEndereco(linhaGrid) {

    if (!isElement('div', 'divColecionadorEndereco')) {
        var div = DOM.newElement('div', 'divColecionadorEndereco');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divColecionadorEndereco');
    divCadastro.innerHTML = '';

    var divLoja = DOM.newElement('div');
    divLoja.setAttribute('class', 'divcontainer');

    var lblTipoEndereco = DOM.newElement('label');
    lblTipoEndereco.innerHTML = 'Tipo Endereço';
    lblTipoEndereco.setAttribute('class', 'fonte_Roboto_texto_normal');

    var cmbTipoEndereco = DOM.newElement('select', 'tipoEndereco');
    cmbTipoEndereco.setAttribute('class', 'combo_cinzafoco');
    cmbTipoEndereco.setAttribute("style", 'width:300px; margin-left:5px;');

    divLoja.appendChild(lblTipoEndereco);
    divLoja.appendChild(cmbTipoEndereco);

    var divEndereco = DOM.newElement('div');
    divEndereco.setAttribute('class', 'divcontainer');

    var lblCep = DOM.newElement('label');
    lblCep.innerHTML = 'CEP';
    lblCep.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtCep = DOM.newElement('input');
    txtCep.setAttribute('type', 'text');
    txtCep.setAttribute('id', 'cep');
    txtCep.setAttribute('class', 'textbox_cinzafoco');
    txtCep.setAttribute("style", 'width:80px; margin-left:5px;');
    txtCep.setAttribute("onblur", 'BuscarCEP();');

    var lblBuscaCep = DOM.newElement('label', 'lblcep');
    lblBuscaCep.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblBuscaCep.setAttribute('style', 'margin-left:5px;');

    var lblEndereco = DOM.newElement('label');
    lblEndereco.innerHTML = 'Endereço';
    lblEndereco.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblEndereco.setAttribute('style', 'margin-left:10px;');

    var txtEndereco = DOM.newElement('input');
    txtEndereco.setAttribute('type', 'text');
    txtEndereco.setAttribute('id', 'endereco');
    txtEndereco.setAttribute('class', 'textbox_cinzafoco');
    txtEndereco.setAttribute("style", 'width:260px; margin-left:5px;');

    var lblNumero = DOM.newElement('label');
    lblNumero.innerHTML = 'N°';
    lblNumero.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblNumero.setAttribute('style', 'margin-left:10px;');

    var txtNumero = DOM.newElement('input');
    txtNumero.setAttribute('type', 'text');
    txtNumero.setAttribute('id', 'numero');
    txtNumero.setAttribute('class', 'textbox_cinzafoco');
    txtNumero.setAttribute("style", 'width:75px; margin-left:5px;');

    var lblComplemento = DOM.newElement('label');
    lblComplemento.innerHTML = 'Complemento';
    lblComplemento.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblComplemento.setAttribute('style', 'margin-left:10px;');

    var txtComplemento = DOM.newElement('input');
    txtComplemento.setAttribute('type', 'text');
    txtComplemento.setAttribute('id', 'complemento');
    txtComplemento.setAttribute('class', 'textbox_cinzafoco');
    txtComplemento.setAttribute("style", 'width:110px; margin-left:5px;');

    var lblBairro = DOM.newElement('label');
    lblBairro.innerHTML = 'Bairro';
    lblBairro.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtBairro = DOM.newElement('input');
    txtBairro.setAttribute('type', 'text');
    txtBairro.setAttribute('id', 'bairro');
    txtBairro.setAttribute('class', 'textbox_cinzafoco');
    txtBairro.setAttribute("style", 'width:270px; margin-left:5px;');

    var lblCidade = DOM.newElement('label');
    lblCidade.innerHTML = 'Cidade';
    lblCidade.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCidade.setAttribute('style', 'margin-left:10px;');

    var txtCidade = DOM.newElement('input');
    txtCidade.setAttribute('type', 'text');
    txtCidade.setAttribute('id', 'cidade');
    txtCidade.setAttribute('class', 'textbox_cinzafoco');
    txtCidade.setAttribute("style", 'width:270px; margin-left:5px;');

    var lblEstado = DOM.newElement('label');
    lblEstado.innerHTML = 'Estado';
    lblEstado.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblEstado.setAttribute('style', 'margin-left:10px;');

    var txtEstado = DOM.newElement('input');
    txtEstado.setAttribute('type', 'text');
    txtEstado.setAttribute('id', 'estado');
    txtEstado.setAttribute('class', 'textbox_cinzafoco');
    txtEstado.setAttribute("style", 'width:60px; margin-left:5px;');
    txtEstado.setAttribute("maxLength", '2');

    divEndereco.appendChild(lblCep);
    divEndereco.appendChild(txtCep);
    divEndereco.appendChild(lblBuscaCep);
    divEndereco.appendChild(lblEndereco);
    divEndereco.appendChild(txtEndereco);
    divEndereco.appendChild(lblNumero);
    divEndereco.appendChild(txtNumero);
    divEndereco.appendChild(lblComplemento);
    divEndereco.appendChild(txtComplemento);
    divEndereco.appendChild(lblBairro);
    divEndereco.appendChild(txtBairro);
    divEndereco.appendChild(lblCidade);
    divEndereco.appendChild(txtCidade);
    divEndereco.appendChild(lblEstado);
    divEndereco.appendChild(txtEstado);

    var cmdGrava = DOM.newElement('button', 'btAdicionarEndereco');
    cmdGrava.setAttribute('class', 'botaosimplesfoco');
    cmdGrava.setAttribute('style', 'float:right; margin-right:9px; margin-top:8px;');
    cmdGrava.setAttribute('onclick', 'AdicionarColecionadorEndereco(' + linhaGrid + ')');
    cmdGrava.innerHTML = "Adicionar";

    divCadastro.appendChild(divLoja);
    divCadastro.innerHTML += '<br />';
    divCadastro.appendChild(divEndereco);
    divCadastro.appendChild(cmdGrava);

    dialogoColecionadorEndereco = new caixaDialogo('divColecionadorEndereco', 205, 800, '../padrao/', 130);
    dialogoColecionadorEndereco.Show();

    getTiposEnderecos(Selector.$('tipoEndereco'), 'Selecione um tipo de endereço', false);

    Selector.$('tipoEndereco').focus();
    Mask.setCEP(Selector.$('cep'));

    if (linhaGrid >= 0) {

        Select.ShowText(Selector.$('tipoEndereco'), gridEnderecos.getCellText(linhaGrid, 0));
        Selector.$('cep').value = gridEnderecos.getCellText(linhaGrid, 1);
        Selector.$('endereco').value = gridEnderecos.getCellText(linhaGrid, 2);
        Selector.$('numero').value = gridEnderecos.getCellText(linhaGrid, 3);
        Selector.$('complemento').value = gridEnderecos.getCellText(linhaGrid, 4);
        Selector.$('bairro').value = gridEnderecos.getCellText(linhaGrid, 5);
        Selector.$('cidade').value = gridEnderecos.getCellText(linhaGrid, 6);
        Selector.$('estado').value = gridEnderecos.getCellText(linhaGrid, 7);
    }
}

function getTiposEnderecos(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getTiposEnderecos';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum tipo de endereço', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idTipoEndereco', 'tipoEndereco');
        };

        Select.AddItem(cmb, 'Carregando os tipos de endereços...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum tipo de endereço', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idTipoEndereco', 'tipoEndereco');
    }
}

function AdicionarColecionadorEndereco(linhaGrid) {

    var qtdEnderecosCobranca = 0;

    var tipoEndereco = Selector.$('tipoEndereco');
    if (tipoEndereco.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, selecione o tipo de endereço.", "OK", "", false, "tipoEndereco");
        mensagem.Show();
        return;
    }

    var cep = Selector.$('cep');
    if (cep.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o cep.", "OK", "", false, "cep");
        mensagem.Show();
        return;
    }

    var endereco = Selector.$('endereco');
    if (endereco.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o endereço.", "OK", "", false, "endereco");
        mensagem.Show();
        return;
    }

    var numero = Selector.$('numero');
    if (numero.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o número.", "OK", "", false, "numero");
        mensagem.Show();
        return;
    }

    var bairro = Selector.$('bairro');
    if (bairro.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o bairro.", "OK", "", false, "bairro");
        mensagem.Show();
        return;
    }

    var cidade = Selector.$('cidade');
    if (cidade.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe a cidade.", "OK", "", false, "cidade");
        mensagem.Show();
        return;
    }

    var estado = Selector.$('estado');
    if (estado.value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, informe o estado.", "OK", "", false, "estado");
        mensagem.Show();
        return;
    }

    if (linhaGrid >= 0) {

        gridEnderecos.setCellText(linhaGrid, 0, Select.GetText(tipoEndereco));
        gridEnderecos.setCellText(linhaGrid, 1, cep.value);
        gridEnderecos.setCellText(linhaGrid, 2, endereco.value);
        gridEnderecos.setCellText(linhaGrid, 3, numero.value);
        gridEnderecos.setCellText(linhaGrid, 4, Selector.$('complemento').value);
        gridEnderecos.setCellText(linhaGrid, 5, bairro.value);
        gridEnderecos.setCellText(linhaGrid, 6, cidade.value);
        gridEnderecos.setCellText(linhaGrid, 7, estado.value);

        dialogoColecionadorEndereco.Close();
    } else if (linhaGrid == '-1') {

        for (var i = 0; i < gridEnderecos.getRowCount(); i++) {

            if (gridEnderecos.getCellText(i, 0).indexOf('Cobrança') >= 0) {
                qtdEnderecosCobranca++;
            }
        }

        if (qtdEnderecosCobranca > 0 && (tipoEndereco.selectedIndex == 1 || tipoEndereco.selectedIndex == 3)) {
            var mensagem = new DialogoMensagens("prompt", 120, 360, 150, "2", "Atenção!", "Só é possível adicionar um endereço de cobrança.", "OK", "", false, "tipoEndereco");
            mensagem.Show();
            return;
        }

        var editar = DOM.newElement('img');
        editar.setAttribute('src', '../imagens/modificar.png');
        editar.setAttribute('style', 'width:18px; height:18px; cursor:pointer;');
        editar.setAttribute('title', 'Editar Endereço');
        editar.setAttribute('onclick', 'PromptColecionadorEndereco(' + gridEnderecos.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', '../imagens/excluir.png');
        excluir.setAttribute('style', 'width:18px; height:18px; cursor:pointer');
        excluir.setAttribute('title', 'Excluir Endereço');
        excluir.setAttribute('onclick', 'ExcluirEnderecoColecionadorAux(' + gridEnderecos.getRowCount() + ')');

        gridEnderecos.addRow([
            DOM.newText(Select.GetText(tipoEndereco)),
            DOM.newText(cep.value),
            DOM.newText(endereco.value),
            DOM.newText(numero.value),
            DOM.newText(Selector.$('complemento').value),
            DOM.newText(bairro.value),
            DOM.newText(cidade.value),
            DOM.newText(estado.value),
            editar,
            excluir
        ]);

        gridEnderecos.setRowData(gridEnderecos.getRowCount() - 1, 0);
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:80px');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:70px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:50px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 4).setAttribute('style', 'text-align:left; max-width:125px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 5).setAttribute('style', 'text-align:left;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 6).setAttribute('style', 'text-align:left;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 7).setAttribute('style', 'text-align:center; width:50px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 8).setAttribute('style', 'text-align:center; width:30px;');
        gridEnderecos.getCell(gridEnderecos.getRowCount() - 1, 9).setAttribute('style', 'text-align:center; width:30px;');

        pintaLinhaGrid(gridEnderecos);

        dialogoColecionadorEndereco.Close();
    } else {

        var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
        var p = 'action=GravarEnderecoColecionador';
        p += '&idColecionador=' + Selector.$('cliente').value;
        p += '&idTipoEndereco=' + tipoEndereco.value;
        p += '&cep=' + cep.value;
        p += '&endereco=' + endereco.value;
        p += '&numero=' + numero.value;
        p += '&complemento=' + Selector.$('complemento').value;
        p += '&bairro=' + bairro.value;
        p += '&cidade=' + cidade.value;
        p += '&estado=' + estado.value;

        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            Selector.$('btAdicionarEndereco').innerHTML = 'Adicionar';

            if (ajax.getResponseText() == '-1') {
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Atenção!", "Este colecionador já possui um endereço de cobrança.", "OK", "", false, "tipoEndereco");
                mensagem.Show();
                return;
            } else if (ajax.getResponseText() == '0') {
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro!", "Ocorreu um erro ao gravar o endereço, tente novamente. Se o erro persistir entre em contato com o suporte técnico", "OK", "", false, "");
                mensagem.Show();
                return;
            } else {

                getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
                Select.Show(Selector.$('enderecos'), ajax.getResponseText());
                dialogoColecionadorEndereco.Close();
            }
        };

        Selector.$('btAdicionarEndereco').innerHTML = 'Adicionando...';
        ajax.Request(p);
    }
}

function getEnderecosColecionador(cmb, texto, assinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assinc);
    var p = 'action=getEnderecosColecionador';
    p += '&idColecionador=' + Selector.$('cliente').value;

    Select.Clear(cmb);

    if (assinc) {
        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() == '0') {
                Select.AddItem(cmb, 'Nenhum endereço cadastrado', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idClienteEndereco', 'endereco');
            var json = JSON.parse(ajax.getResponseText());

            for (var i = 0; i < json.length; i++) {

                cmb.innerHTML += '<option value=' + json[i].idClienteEndereco + ' id=' + json[i].cep.replace('-', '') + '>' + json[i].endereco + '</option>';
            }

            if (cmb.length == 2) {
                cmb.selectedIndex = 1;
            }
        };

        Select.AddItem(cmb, 'Carregando os endereços...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        Select.Clear(cmb);

        if (ajax.getResponseText() == '0') {
            Select.AddItem(cmb, 'Nenhum endereço cadastrado', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idClienteEndereco', 'endereco');
        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += '<option value=' + json[i].idClienteEndereco + ' id=' + json[i].cep.replace('-', '') + '>' + json[i].endereco + '</option>';
        }

        if (cmb.length == 2) {
            cmb.selectedIndex = 1;
        }
    }
}

function getClientesPremium(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getClientesPremium';

    Select.Clear(cmb);

     Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK())
                return;

            if (ajax.getResponseText() == '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum colecionador', 0);
                return;
            }

            Select.Clear(cmb);
            Select.AddItem(cmb, texto, 0);
            var json = JSON.parse(ajax.getResponseText());
            var count = 0;
            var texto1 = '';

            for (var i = 0; i < json.length; i++) {

                if (json[i].premium == '1') {
                    count++;
                    if (i == 0) {
                        texto1 += '<optgroup label="Colecionadores Premium">';
                    }

                    texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                }

                if (json[i].premium == '0') {                    
                    if (json[i].arquiteto == '1') {                        
                        
                        if (i == count) {
                            texto1 += '</optgroup>';
                            texto1 += '<optgroup label="Colecionadores Arquitetos">';
                        }
                        
                        count++;
                        texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                    }

                    if (json[i].arquiteto == '0') {
                        if (i == count) {
                            texto1 += '</optgroup>';
                            texto1 += '<optgroup label="Demais Colecionadores">';
                        }

                        texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                    }
                }
            }

            texto1 += "</optgroup>";
            
            
            cmb.innerHTML += texto1;
        };

        Select.AddItem(cmb, 'Carregando os colecionadores...', 0);
        ajax.Request(p);
    } 
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum colecionador', 0);
            return;
        }

        Select.Clear(cmb);
        Select.AddItem(cmb, texto, 0);
        var json = JSON.parse(ajax.getResponseText());
        var count = 0;
        var texto1 = '';

        for (var i = 0; i < json.length; i++) {

            if (json[i].premium == '1') {
                count++;
                if (i == 0) {
                    texto1 += '<optgroup label="Colecionadores Premium">';
                }

                texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
            }

            if (json[i].premium == '0') {                    
                    if (json[i].arquiteto == '1') {                        
                        
                        if (i == count) {
                            texto1 += '</optgroup>';
                            texto1 += '<optgroup label="Colecionadores Arquitetos">';
                        }
                        
                        count++;
                        texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                    }

                    if (json[i].arquiteto == '0') {
                        if (i == count) {
                            texto1 += '</optgroup>';
                            texto1 += '<optgroup label="Demais Colecionadores">';
                        }

                        texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                    }
                }
        }

        texto1 += "</optgroup>";
        cmb.innerHTML = texto1;
    }
}

function BuscarCEP() {

    if (Selector.$('cep').value === Selector.$('cep').name) {
        return;
    }

    Selector.$('cep').name = Selector.$('cep').value;

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
    var p = 'action=BuscarCEP';
    p += '&cep=' + Selector.$('cep').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('lblcep').innerHTML = "";

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText());

        Selector.$('endereco').value = json.rua;
        Selector.$('bairro').value = json.bairro;
        Selector.$('cidade').value = json.cidade;
        Selector.$('estado').value = json.estado;
        Selector.$('numero').focus();
    };

    Selector.$('lblcep').innerHTML = "Pesquisando CEP...";
    ajax.Request(p);
}

function getEstilos(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', ascinc);
    var p = 'action=getEstilos';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum estilo', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idEstilo', 'estilo');
        };

        Select.AddItem(cmb, 'Carregando os estilos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum estilo', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idEstilo', 'estilo');
    }
}

function VerificarCpfCnpjIgual(codigo, tabela, nomeCampo, pk) {

    if (cpf == Selector.$('cpf').value) {
        if (Selector.$('cpf').name == "true") {
            return;
        }
    }

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    var p = 'action=VerificarCpfCnpjIgual';
    p += '&codigo=' + codigo;
    p += '&cpf=' + Selector.$('cpf').value;
    p += '&tabela=' + tabela;
    p += '&nomeCampo=' + nomeCampo;
    p += '&pk=' + pk;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        Selector.$('cpf').name = true;
        cpf = Selector.$('cpf').value;

        if (isElement('input', 'fisica')) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 155, "2", "Atenção!", "" + (Selector.$('fisica').checked ? "CPF" : "CNPJ") + " já cadastrado!", "OK", "", false, "cpf");
        } else {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 155, "2", "Atenção!", "CPF já cadastrado!", "OK", "", false, "cpf");
        }
        mensagem.Show();
        return;
    } else {
        Selector.$('cpf').name = '';
        cpf = '';
    }
}

function VerificarFrete() {

    if (Selector.$('tipoTransporte').value == '5' || Selector.$('tipoTransporte').value == '4') {
        Selector.$('btCalcularFrete').style.display = 'inline-block';
    } else {
        Selector.$('btCalcularFrete').style.display = 'none';
        Selector.$('divValorFrete').style.display = 'none';
    }
}

function CalcularPrecoPrazoCorreios() {

    //nCdEmpresa, sDsSenha, nCdServico, sCepOrigem, sCepDestino, nVlPeso, nCdFormato, nVlComprimento, nVlAltura, nVlLargura, nVlDiametro, sCdMaoPropria, nVlValorDeclarado, sCdAvisoRecebimento

    /*
     nCdEmpresa = Codigo administrativo junto à ECT. 
     Parametro(String) não é obrigatório, mas tem que ser passado mesmo vazio
     
     sDsSenha = Senha para acesso ao serviço, associada ao codigo administrativo. ]
     Parametro(String) não obrigatório, mas tem que ser passado mesmo vazio.
     
     nCdServico = Codigo do serviço a ser utilizado. 
     Ex: 40010 - SEDEX, 40215 - SEDEX 10, 40290 - SEDEX Hoje, 41106 - PAC. 
     Paramentro(String) obrigatório, pode ser passado mais que 1 separado por virgula.
     
     sCepOrigem = CEP de origem sem hífen. Parametro(String) obrigatório.
     sCepDestino = CEP de destino sem hífen. Parametro(String) obrigatório.
     nVlPeso = Peso da encomenda, peso em quilogramas. Parametro(String) obrigatório.
     
     nCdFormato = Formato da encomenda. 
     Ex: 1 - Formato caixa/pacote, 2 - Formato rolo/prisma, 3 - Envelope. Parametro(Int) obrigatório
     
     nVlComprimento = Comprimento da encomenda em centimetros. Parametro(Decimal) obrigatório.
     nVlAltura = Altura da encomenda em centimetros, se o formato for 3 passar como 0. Parametro(Decimal) obrigatório
     nVlLargura = Largura da encomenda, em centimetros. Parametro(Decimal) obrigatório.
     nVlDiametro = Diametro da encomenda, em centimetros. Parametro(Decimal) obrigatório.
     
     sCdMaoPropria = Indica se a encomenda será entregue com o serviço adicional mão própria. 
     Valores possíveis: S ou N. Parametro(String) obrigatório.
     
     nVlValorDeclarado = Indica se a encomenda será entregue com o serviço adicional valor declarado. 
     Neste campo deve ser apresentado o valor declarado desejado, em Reais. 
     Parametro(Decimal) obrigatório, pode ser passado como 0.
     
     sCdAvisoRecebimento = Indica se a encomenda será entregue com o serviço adicional aviso de recebimento. 
     Valores possíveis: S ou N. Parametro(String) obrigatório.
     */

    if (Selector.$('enderecos').selectedIndex == 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Aviso", "Nenhum endereço de destino selecionado/cadastrado.", "OK", "", false, "enderecos");
        mensagem.Show();
        return;
    }

    if (gridObras.getRowCount() <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "2", "Aviso", "Inclua uma obra para calcular o frete.", "OK", "", false, "");
        mensagem.Show();
        return;
    }

    var arrayPesos = new Array();
    for (var i = 0; i < gridObras.getRowCount(); i++) {
        arrayPesos.push(Number.ValorE(gridObras.getCellText(i, 26)));
    }

    /*var arrayComprimento = new Array();
     for(var i = 0; i < gridObras.getRowCount(); i++){
     arrayComprimento.push(Number.ValorE(gridObras.getCellText(i, 16)));
     }*/

    var arrayAltura = new Array();
    for (var i = 0; i < gridObras.getRowCount(); i++) {
        arrayAltura.push(Number.ValorE(gridObras.getCellText(i, 15)));
    }

    var arrayLargura = new Array();
    for (var i = 0; i < gridObras.getRowCount(); i++) {
        arrayLargura.push(Number.ValorE(gridObras.getCellText(i, 16)));
    }

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', true);
    var p = 'action=CalcularPrecoPrazoCorreios';
    p += '&nCdEmpresa=' + '';
    p += '&sDsSenha=' + '';
    p += '&nCdServico=' + (Selector.$('tipoTransporte').value == '5' ? '41106' : (Selector.$('tipoTransporte').value == '4' ? '40010' : ''));
    p += '&sCepOrigem=' + Selector.$('loja').options[Selector.$('loja').selectedIndex].id;
    p += '&sCepDestino=' + Selector.$('enderecos').options[Selector.$('enderecos').selectedIndex].id;
    p += '&nVlPeso=' + arrayPesos;
    p += '&nCdFormato=' + 1;
    p += '&nVlComprimento=' + 16;
    p += '&nVlAltura=' + arrayAltura;
    p += '&nVlLargura=' + arrayLargura;
    p += '&nVlDiametro=' + 0;
    p += '&sCdMaoPropria=' + 'N';
    p += '&nVlValorDeclarado=' + 0;
    p += '&sCdAvisoRecebimento=' + 'N';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('btCalcularFrete').value = 'Calcular Frete';

        /*if(ajax.getResponseText() == '0'){
         var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Erro ao buscar as informações de frete. Tente novamente.", "OK", "", false, "");
         mensagem.Show();
         return;
         }*/

        switch (ajax.getResponseText()) {

            case '-2':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "CEP de origem inválido.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-3':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "CEP de destino inválido.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-4':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "Peso excedido", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-16':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura não pode ser maior que 105cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-17':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A altura não pode ser maior que 105cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-18':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A altura não pode ser inferior que 2cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-20':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura não pode ser inferior que 11cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-23':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "A soma resultante do comprimento + largura + altura não deve superar a 200cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-33':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Sistema temporariamente fora do ar. Favor tentar mais tarde.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-44':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura nao pode ser inferior a 11cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '-45':
                var mensagem = new DialogoMensagens("prompt", 120, 400, 150, "1", "Erro", "A largura nao pode ser maior que 60cm.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '007':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Localidade de destino não abrange o serviço informado.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '008':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Serviço indisponível para o trecho informado.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;

            case '7':
                var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Serviço indisponível, tente mais tarde.", "OK", "", false, "");
                mensagem.Show();
                return;
                break;
        }

        var json = JSON.parse(ajax.getResponseText());
        Selector.$('divValorFrete').style.display = 'inline-block';
        Selector.$('valorFrete').innerHTML = json.valorFrete;
        Selector.$('prazoEntrega').innerHTML = json.prazoEntrega;
    }

    Selector.$('btCalcularFrete').value = 'Calculando...';
    ajax.Request(p);
}

function SubtrairData(data, periodoMeses) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    var p = 'action=SubtrairData';
    p += '&data=' + data;
    p += '&periodoMeses=' + periodoMeses;
    ajax.Request(p);

    return ajax.getResponseText();
}

function setDataDeAte(de, ate) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    ajax.Request('action=getDeAte');

    var json = JSON.parse(ajax.getResponseText());
    de.value = json.de;
    ate.value = json.ate;
}

function SomarDias(data, dias) {

    data = data.split('/');
    diafuturo = (parseInt(data[0]) + parseInt(dias));

    mes = parseInt(data[1]);
    ano = parseInt(data[2]);

    while (diafuturo > numdias(mes, ano)) {

        diafuturo -= numdias(mes, ano);
        mes++;

        if (mes > 12) {
            mes = 1;
            ano++;
        }
    }

    if (diafuturo.toString().length == 1) {
        diafuturo = "0" + diafuturo.toString();
    }

    if (mes.toString().length == 1) {
        mes = "0" + mes.toString();
    }

    return diafuturo + "/" + mes + "/" + ano;
}

function numdias(mes, ano) {

    if ((mes < 8 && mes % 2 == 1) || (mes > 7 && mes % 2 == 0))
        return 31;
    if (mes != 2)
        return 30;
    if (ano % 4 == 0)
        return 29;

    return 28;
}

function CarregarGaleriasPdv(cmb, texto, assincrono, idLoja) {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=CarregarGaleriasPdv';
    p += '&idLoja=' + idLoja;

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhuma loja', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idLoja', 'loja');
            var json = JSON.parse(ajax.getResponseText());

            for (var i = 0; i < json.length; i++) {

                cmb.innerHTML += '<option value=' + json[i].idLoja + ' id="06710660">' + json[i].loja + '</option>';
            }
        };

        Select.AddItem(cmb, 'Carregando as lojas...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhuma loja', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idLoja', 'loja');
        var json = JSON.parse(ajax.getResponseText());

        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += '<option value=' + json[i].idLoja + ' id="06710660">' + json[i].loja + '</option>';
        }
    }
}

function Logar(logarNovamente) {

    if (Selector.$('login_galeria').selectedIndex <= 0) {
        Selector.$('login_aviso').innerHTML = 'Selecione uma galeria';
        return;
    }

    if (Selector.$('login_vendedor').selectedIndex <= 0) {
        Selector.$('login_aviso').innerHTML = 'Selecione um marchand';
        return;
    }

    if (Selector.$('login_senha_vendedor').value.trim() == '') {
        Selector.$('login_aviso').innerHTML = 'Digite sua senha';
        return;
    }

    var ajax = new Ajax('POST', 'php/index.php', true);
    var p = 'action=Logar';
    p += '&idGaleria=' + Selector.$('login_galeria').value;
    p += '&idMarchand=' + Selector.$('login_vendedor').value;
    p += '&senha=' + Selector.$('login_senha_vendedor').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        Selector.$('entrar').innerHTML = 'Login';

        if (ajax.getResponseText() == '-3') {
            Selector.$('login_aviso').innerHTML = 'Erro ao realizar o login, tente novamente';
            Selector.$('login_vendedor').focus();

        } else if (ajax.getResponseText() == '-4') {
            Selector.$('login_aviso').innerHTML = 'Usuário inativo.';

        } else if ((ajax.getResponseText() != '-2') && (ajax.getResponseText() > '3')) {
            Selector.$('login_aviso').innerHTML = 'Senha inválida, usuário bloqueado.';

        } else if (ajax.getResponseText() == '-2') {
            Selector.$('login_aviso').innerHTML = 'Usuário bloqueado.';

        } else if (ajax.getResponseText() == '1') {
            Selector.$('login_aviso').innerHTML = 'Senha Inválida, 3 tentativas BLOQUEIAM o usuário';

        } else if (ajax.getResponseText() == '2') {
            Selector.$('login_aviso').innerHTML = 'Senha inválida, restam 2 tentativas.';

        } else if (ajax.getResponseText() == '3') {
            Selector.$('login_aviso').innerHTML = 'Senha inválida, restam 1 tentativa.';

        } else if (ajax.getResponseText() == '-1') {

            if (logarNovamente) {
                window.parent.dialogoRelogin.Close();
                return;
            }

            if (Selector.$('login_lembrar').checked) {
                Cookies.setCookie('login_galeria', Selector.$('login_galeria').value, 30);
                Cookies.setCookie('login_vendedor', Selector.$('login_vendedor').value, 30);
            } else {
                Cookies.delCookie('login_galeria');
                Cookies.delCookie('login_vendedor');
            }

            if (Window.getParameter('url') == null || Window.getParameter('url') == '')
                window.location = 'principal.html';
            else
                window.location = Window.getParameter('url');
        }
    };

    Selector.$('entrar').innerHTML = 'Entrando...';
    ajax.Request(p);
}

function senha_keydown(ev, logarNovamente) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        Logar(logarNovamente);
    }
}

function LogarNovamente() {

    if (!isElement('div', 'promptRelogin')) {
        var divEditar = DOM.newElement('div', 'promptRelogin');
        document.body.appendChild(divEditar);
    }

    var divRelogin = Selector.$('promptRelogin');
    divRelogin.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divform.setAttribute('style', 'text-align:center');
    divRelogin.appendChild(divform);

    var logo = DOM.newElement('img');
    logo.setAttribute('src', '../imagens/loginvendedores.png');
    logo.setAttribute('style', 'height:150px; width:auto;');

    var cmbGalerias = DOM.newElement('select', 'login_galeria');
    cmbGalerias.setAttribute('style', 'width:310px;');
    cmbGalerias.setAttribute('onchange', 'CarregarMarchandsGaleria(Selector.$("login_vendedor"), "Selecione um marchand", true)');

    var cmbUsuarios = DOM.newElement('select', 'login_vendedor');
    cmbUsuarios.setAttribute('style', 'width:310px;');
    cmbUsuarios.setAttribute('onkeydown', 'senha_keydown(event, true);');
    cmbUsuarios.setAttribute('onchange', 'Selector.$("login_senha_vendedor").focus();');

    var txtSenha = DOM.newElement('password', 'login_senha_vendedor');
    txtSenha.setAttribute('placeholder', 'Informe sua senha');
    txtSenha.setAttribute('style', 'width:250px;');
    txtSenha.setAttribute('onkeydown', 'senha_keydown(event, true);');

    var btLogin = DOM.newElement('input', 'entrar');
    btLogin.setAttribute('type', 'button');
    btLogin.setAttribute('value', 'Login');
    btLogin.setAttribute('class', 'login_botao');
    btLogin.setAttribute('style', 'width:314px;');
    btLogin.setAttribute('onclick', 'Logar(true);');

    var lblSessao = DOM.newElement('label');
    lblSessao.innerHTML = 'Sessão expirada, efetue o login novamente';

    var lblAviso = DOM.newElement('label', 'login_aviso');

    var lblCancelar = DOM.newElement('label', 'lblCancelar');
    lblCancelar.innerHTML = 'Cancelar';
    lblCancelar.setAttribute('style', 'cursor:pointer; text-decoration:underline');
    lblCancelar.setAttribute('onclick', 'dialogoRelogin.Close(); window.location="index.html";');

    divform.appendChild(logo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmbGalerias);
    divform.appendChild(cmbUsuarios);
    divform.appendChild(txtSenha);
    divform.innerHTML += '<br><br>';
    divform.appendChild(btLogin);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblSessao);
    divform.innerHTML += '<br>';
    divform.appendChild(lblAviso);
    divform.innerHTML += '<br>';
    divform.appendChild(lblCancelar);

    dialogoRelogin = new caixaDialogo('promptRelogin', 490, 400, '/padrao/', 150);
    dialogoRelogin.Show();
    dialogoRelogin.HideCloseIcon();

    CarregarGalerias(Selector.$('login_galeria'), "Selecione uma galeria", false);
    Selector.$('login_galeria').value = 0;

    if (Cookies.getCookie('login_galeria') !== null) {
        Selector.$('login_galeria').value = Cookies.getCookie('login_galeria');
        CarregarMarchandsGaleria(Selector.$('login_vendedor'), 'Selecione uma marchand', false);

        if (Cookies.getCookie('login_vendedor') != null) {
            Selector.$('login_vendedor').value = Cookies.getCookie('login_vendedor');
            Selector.$('login_senha_vendedor').focus();
        } else {
            Selector.$('login_vendedor').focus();
        }
    } else {
        Selector.$('login_galeria').focus();
    }
}

function checkLogarNovamente() {

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', false);
    var p = 'action=ValidarSessao';

    ajax.Request(p);

    if (ajax.getResponseText() === "0") {
        LogarNovamente();
        return false;
    } else {
        return true;
    }
}

function getEtapasOrdensProducao(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts-pdv.php', assincrono);
    var p = 'action=getEtapasOrdensProducao';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrada nenhuma etapa", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "codigo", "nome");
        };

        Select.AddItem(cmb, "Carregando as etapas...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrada nenhuma etapa", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "codigo", "nome");
    }
}