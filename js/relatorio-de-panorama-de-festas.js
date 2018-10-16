checkSessao();
checkPermissao(28, false);

window.onload = function() {

    Selector.$("legendaTela").innerHTML = "<div>Panorama de Festas</div>";
    getDadosUsuario();
    carregarmenu();

    getLocais(Selector.$('local'), "Selecione um local", true);
    Lista();
}

window.onresize = function() {
    //  Selector.$('tabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 120) + "px";
}

function Lista() {

    Selector.$('tabela').innerHTML = '';

    var ajax = new Ajax('POST', 'php/relatorio-de-panorama-de-festas.php', true);
    var p = 'action=MostrarContratos';
    p += '&local=' + Selector.$('local').value;
    p += '&dias=' + Selector.$('dias').value;
    p += '&idContrato=0';

    ajax.ajax.onreadystatechange = function(){

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var dia = "";
        var idia = 0;
        var numeroFesta = 0;
        Selector.$('contador').innerHTML = json.length + " Festa(s) localizadas";

        for(var i = 0; i < json.length; i++){

            var divContrato = DOM.newElement('div');
            divContrato.setAttribute('style', 'height:auto; padding:10px; border:1px solid lightgray; margin-top:10px;');

            divContrato.innerHTML = '<label style="color:#171717; font-size:18px; font-family: "MuseoSans-700Italic", Arial, sans-serif;">' + json[i].diaSemana + ", " + json[i].diaFesta + '</label>';
            divContrato.innerHTML += '<br><br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Hora:</span><span class="CadernoTexto">' + json[i].horaFesta + '</span>';
            divContrato.innerHTML += '<span class="CadernoTitulos" style="margin-left:100px;">Local:</span><span class="CadernoTexto">' + json[i].nomeLocal + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Aniversariante:</span><span class="CadernoTexto">' + (json[i].tituloFesta == '' ? 'NÃO INFORMADO' : json[i].tituloFesta) + '</span>';
            divContrato.innerHTML += '<span class="CadernoTitulos" style="margin-left:100px;">Idade:</span><span class="CadernoTexto">' + idadeAniversariante(json[i].dataNascimentoFesta, json[i].diaFesta) + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Pai:</span><span class="CadernoTexto">' + (json[i].nomePai == '' ? 'NÃO INFORMADO' : json[i].nomePai) + '</span>';
            divContrato.innerHTML += '<span class="CadernoTitulos" style="margin-left:100px;">Mãe:</span><span class="CadernoTexto">' + (json[i].nomeMae == '' ? 'NÃO INFORMADO' : json[i].nomeMae) + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Irmãos:</span><span class="CadernoTexto">' + json[i].irmaos + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Pacote:</span><span class="CadernoTexto">' + json[i].nomePacote + '</span>';
            divContrato.innerHTML += '<span class="CadernoTitulos" style="margin-left:100px;">Decoração:</span><span class="CadernoTexto">' + json[i].nomeDecoracao + '</span>';
            divContrato.innerHTML += '<br>';

            var pagantes = "";
            if(json[i].qtdeAdultosPagantes > '0'){

                pagantes = (json[i].qtdeAdultosPagantes == '1' ? json[i].qtdeAdultosPagantes + " adulto" : json[i].qtdeAdultosPagantes +" adultos");

                if(json[i].qtdeCriancasPagantes > '0'){

                    pagantes += " e " + (json[i].qtdeCriancasPagantes == '1' ? json[i].qtdeCriancasPagantes + " criança" : json[i].qtdeCriancasPagantes + " crianças");
                }
            }else if(json[i].qtdeCriancasPagantes > '0'){

                pagantes = (json[i].qtdeCriancasPagantes == '1' ? json[i].qtdeCriancasPagantes + " criança" : json[i].qtdeCriancasPagantes + " crianças");
            }else{
                pagantes = "";
            }

            var naopagantes = "";
            if(json[i].qtdeAdultosNaoPagantes > '0'){

                naopagantes = (json[i].qtdeAdultosNaoPagantes == '1' ? json[i].qtdeAdultosNaoPagantes + " adulto" : json[i].qtdeAdultosNaoPagantes + " adultos");

                if(json[i].qtdeCriancasNaoPagantes > '0'){

                    naopagantes += " e " + (json[i].qtdeCriancasNaoPagantes == '1' ? json[i].qtdeCriancasNaoPagantes + " criança" : json[i].qtdeCriancasNaoPagantes + " crianças");
                }
            }else if(json[i].qtdeCriancasNaoPagantes > '0'){

                naopagantes = (json[i].qtdeCriancasNaoPagantes == '1' ? json[i].qtdeCriancasNaoPagantes + " criança" : json[i].qtdeCriancasNaoPagantes + " crianças");
            }else{
                naopagantes = "";
            }
            
            divContrato.innerHTML += '<span class="CadernoTitulos">Pagantes:</span><span class="CadernoTexto">' + json[i].pagantes + "" + (pagantes != '' ? ' (' + pagantes + ')' : '') + "</span>";
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Não Pagantes:</span><span class="CadernoTexto">' + json[i].naopagantes + "" + (naopagantes != '' ? ' (' + naopagantes + ')' : '') + "</span>";
            divContrato.innerHTML += '<br>';            
            
            divContrato.innerHTML += '<span class="CadernoTitulos">Observação:</span><span class="CadernoTexto">' + json[i].obs + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Observação Interna:</span><span class="CadernoTexto">' + json[i].obsInterna + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos" id="lblOpcionais' + i + '" style="cursor:pointer;" title="Ver detalhes opcionais">Opcionais:</span><span class="CadernoTexto"></span>';
            divContrato.innerHTML += '<br>';

            var jsonOpcionais = JSON.parse(json[i].arrayOpcionais || "[ ]");
            var arrayOpcionais = '';
            
            for(var j = 0; j < jsonOpcionais.length; j++) {
                arrayOpcionais += ', ' + '<span ' + (jsonOpcionais[j].externo == '1' ? 'style="text-decoration:underline"' : '') + '>' + jsonOpcionais[j].tipoOpcional + '</span>';
            }

            if (arrayOpcionais.substring(0,2) == ', ') {
                arrayOpcionais = arrayOpcionais.replace(', ', '');
            }

            divContrato.innerHTML += '<span class="CadernoTexto" id="opcionais' + i + '" style="cursor:pointer;" title="Ver detalhes opcionais">' + arrayOpcionais + '</span>';
            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<span class="CadernoTitulos">Escolhas:</span><span class="CadernoTexto"></span>';
            divContrato.innerHTML += '<br>';            

            var vetor = json[i].listapendencia.split("<br />");
            
            for (var x = 0; x < vetor.length; x++) {
                
                divContrato.innerHTML += '<span class="CadernoTexto">' + vetor[x] + '</span><br>';
            }

            divContrato.innerHTML += '<br>';
            divContrato.innerHTML += '<input class="botaosimplesfoco" type="submit" onclick = "window.location=\'cadastro-de-contratos.html?c=' + json[i].idContrato + '\'"  value="Acessar Contrato" /> <div onclick="Imprimir(' + json[i].idContrato + ', ' + Selector.$('dias').value + ', ' + Selector.$('local').value + ');" class="botaoRedondoJujubaImprimir" title="Imprimir festa"></div>';

            Selector.$('tabela').appendChild(divContrato);
            //Selector.$('opcionais' + i).setAttribute('onclick', "PromptOpcionais('" + json[i].arrayOpcionais + "');");
            Selector.$('opcionais' + i).setAttribute('onclick', "PromptOpcionais(" + json[i].idContrato + ");");
            //Selector.$('lblOpcionais' + i).setAttribute('onclick', "PromptOpcionais('" + json[i].arrayOpcionais + "');");
            Selector.$('lblOpcionais' + i).setAttribute('onclick', "PromptOpcionais(" + json[i].idContrato + ");");
        }
    };

    ajax.Request(p);
}

function idadeAniversariante(dataNascimento, dataFesta) {

    if (!Date.isDate(dataNascimento) || !Date.isDate(dataFesta)) {
        return '';
    }

    if (dataNascimento.length == 10 && dataFesta.length == 10) {

        var anos = parseInt(dataFesta.substr(6, 4)) - parseInt(dataNascimento.substr(6, 4));
        var diaNascimento = dataNascimento.substr(0, 2);
        var mesNascimento = dataNascimento.substr(3, 2);
        var diaFesta = dataFesta.substr(0, 2);
        var mesFesta = dataFesta.substr(3, 2);

        if (mesNascimento > mesFesta) {
            return anos + " anos a completar";
        } else {
            if (diaNascimento > diaFesta && mesNascimento == mesFesta) {
                return anos + " anos a completar";
            } else {
                return anos + " anos completos ";
            }
        }

        if (anos <= 0) {
            return '';
        }
    } else {
        return '';
    }
}

function ajustalinhas() {

    grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'border-right:1px solid #FE0000; text-align:center; width:80px;');
    grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
    grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'border-left:1px solid #FE0000; text-align:center; width:50px;');
}

function PromptOpcionais(idContrato) {

    /*if (array == 0)
        return;*/

    if (!isElement('div', 'divOpcionais2')) {
        var div = DOM.newElement('div', 'divOpcionais2');
        document.body.appendChild(div);
    }

    var divOpcionais = Selector.$('divOpcionais2');
    divOpcionais.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divOpcionais.appendChild(divform);

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = "Opcionais";
    lblTitulo.setAttribute("style", "text-align:center");

    var divListaOpcionais = DOM.newElement('div', 'divListaOpcionais');
    divListaOpcionais.setAttribute('style', 'height:380px; overflow:auto');

    gridListaOpcionais = new Table('gridListaOpcionais');
    gridListaOpcionais.table.setAttribute('cellpadding', '3');
    gridListaOpcionais.table.setAttribute('cellspacing', '0');
    gridListaOpcionais.table.setAttribute('class', 'tabela_jujuba_comum');

    gridListaOpcionais.addHeader([
        DOM.newText('Tipo'),
        DOM.newText('Descrição'),
        DOM.newText('Valor'),
        DOM.newText('Qtde.'),
        DOM.newText('Total')
    ]);

    //======== Tabela =========//
    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divListaOpcionais);

    dialogoOpcionais = new caixaDialogo('divOpcionais2', 500, 650, 'padrao/', 140);
    dialogoOpcionais.Show();

    Selector.$('divListaOpcionais').appendChild(gridListaOpcionais.table);

    gridListaOpcionais.clearRows();

    /*if (array == '0')
        return;*/

    var ajax = new Ajax('POST', 'php/relatorio-de-panorama-de-festas.php', false);
    var p = 'action=MostrarOpcionais';
    p+= '&idContrato=' + idContrato;
    ajax.Request(p);

    if(ajax.getResponseText() == '0'){
        return;
    }

    var json = JSON.parse(ajax.getResponseText() || "[ ]");

    for (var i = 0; i < json.length; i++) {

        if(json[i].tipoOpcional.indexOf('OK') > 0){
            json[i].tipoOpcional = json[i].tipoOpcional.replace('OK', '<span id=div-' + json[i].idContratoComp + '><span id=' + json[i].idContratoComp + ' title="Clique para marcar o opcional como Pendente" style="text-decoration:underline; cursor:pointer;" onclick="PromptObsOpcionalOk(' + idContrato + ', ' + json[i].idContratoComp + ', 0, \'' + json[i].obsOk + '\');">OK</span></span>');
        }else{
            json[i].tipoOpcional = json[i].tipoOpcional.replace('Pendente', '<span id=div-' + json[i].idContratoComp + '><span id=' + json[i].idContratoComp + ' title="Clique para marcar o opcional como OK" style="text-decoration:underline; cursor:pointer;" onclick="PromptObsOpcionalOk(' + idContrato + ', ' + json[i].idContratoComp + ', 1, \'' + json[i].obsOk + '\');">Pendente</span></span>');
        }

        var opcionais = DOM.newElement('span');
        opcionais.innerHTML = json[i].tipoOpcional;

        gridListaOpcionais.addRow([
            DOM.newText(json[i].tipo),
            //DOM.newText(json[i].tipoOpcional),
            opcionais,
            DOM.newText(json[i].valor),
            DOM.newText(json[i].qtd),
            DOM.newText(json[i].valorTotal)
        ]);

        gridListaOpcionais.getCell(i, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
        gridListaOpcionais.getCell(i, 1).setAttribute('style', 'border:none; text-align:left; width:300px');
        gridListaOpcionais.getCell(i, 2).setAttribute('style', 'border:none; text-align:right; width:120px;');
        gridListaOpcionais.getCell(i, 3).setAttribute('style', 'border:none; text-align:center; width:70px;');
        gridListaOpcionais.getCell(i, 4).setAttribute('style', 'border:none; text-align:right; width:120px;');
    }

    pintaLinhaGrid(gridListaOpcionais);
}

function PromptObsOpcionalOk(idContrato, idContratoComp, ok, obs){

    if (!isElement('div', 'divPromptObsOpcionalOk')) {
        var div = DOM.newElement('div', 'divPromptObsOpcionalOk');
        document.body.appendChild(div);
    }

    var divPromptObsOpcionalOk = Selector.$('divPromptObsOpcionalOk');
    divPromptObsOpcionalOk.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptObsOpcionalOk.appendChild(divform);

    var lblObs = DOM.newElement('label');
    lblObs.innerHTML = "Obs";

    var txtObsOk = DOM.newElement('textarea', 'obsOk');
    txtObsOk.setAttribute('class', 'textbox_cinzafoco');
    txtObsOk.setAttribute('style', 'width:100%; height:100px;');

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right; margin-right:10px;');
    cmdTexto1.setAttribute('onclick', 'SetarOpcionalOk(' + idContrato + ', ' + idContratoComp + ', ' + ok + ', \'' + obs + '\')');
    cmdTexto1.innerHTML = (ok == '0' ? 'Pendente' : 'OK');

    var cmdTexto = DOM.newElement('label', 'cancelar');
    cmdTexto.setAttribute('class', 'botao_cancelar');
    cmdTexto.setAttribute('style', 'float:right; margin-left:5px; display:inline-block; vertical-align:middle; margin-top:5px;');
    cmdTexto.setAttribute('onclick', 'dialogoObsOk.Close();');
    cmdTexto.innerHTML = 'Cancelar';

    divform.appendChild(lblObs);
    divform.innerHTML += '<br>';
    divform.appendChild(txtObsOk);
    divform.innerHTML += '<br><br>';
    divform.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);

    dialogoObsOk = new caixaDialogo('divPromptObsOpcionalOk', 230, 450, 'padrao/', 140);
    dialogoObsOk.Show();

    Selector.$('obsOk').value = obs;
}

function SetarOpcionalOk(idContrato, idContratoComp, ok, obs){

    var ultimaObs = Selector.$('obsOk').value;

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', false);
    var p = 'action=SetarOpcionalOk';
    p+= '&idContrato=' + idContrato;
    p+= '&idContratoComp=' + idContratoComp;
    p+= '&ok=' + ok;
    p+= '&obs=' + Selector.$('obsOk').value;
    ajax.Request(p);

    if(ajax.getResponseText() == '0'){
        return;
    }

    dialogoObsOk.Close();
    Selector.$('div-' + idContratoComp).removeChild(Selector.$(idContratoComp));
    Selector.$('div-' + idContratoComp).innerHTML = (ok == '1' ? '<span id=' + idContratoComp + ' title="Clique para marcar o opcional como Pendente" style="text-decoration:underline; cursor:pointer;" onclick="PromptObsOpcionalOk(' + idContrato + ', ' + idContratoComp + ', 0, \'' + ultimaObs + '\');">OK</span>' : '<span id=' + idContratoComp + ' title="Clique para marcar o opcional como OK" style="text-decoration:underline; cursor:pointer;" onclick="PromptObsOpcionalOk(' + idContrato + ', ' + idContratoComp + ', 1, \'' + ultimaObs + '\');">Pendente</span>');
}

function PromptPacoteComp(codigoPacote, nomePacote, idContrato) {

    if (codigoPacote <= 0) {
        return;
    }

    if (!isElement('div', 'divPacoteComposicao')) {
        var div = DOM.newElement('div', 'divPacoteComposicao');
        document.body.appendChild(div);
    }

    var divPacoteComposicao = Selector.$('divPacoteComposicao');
    divPacoteComposicao.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPacoteComposicao.appendChild(divform);

    var lblTitulo = DOM.newElement('h2');
    lblTitulo.innerHTML = "Composição do Pacote: " + nomePacote;
    lblTitulo.setAttribute("style", "text-align:center");

    var divComposicao = DOM.newElement('div', 'divComposicao');
    divComposicao.setAttribute('style', 'height:380px; overflow:auto');

    gridPacoteComposicao = new Table('gridPacoteComposicao');
    gridPacoteComposicao.table.setAttribute('cellpadding', '3');
    gridPacoteComposicao.table.setAttribute('cellspacing', '0');
    gridPacoteComposicao.table.setAttribute('class', 'tabela_jujuba_comum');

    gridPacoteComposicao.addHeader([
        DOM.newText('Grupo'),
        DOM.newText('Ítem')
    ]);

    //======== Tabela =========//
    divform.appendChild(lblTitulo);
    divform.innerHTML += '<br>';
    divform.appendChild(divComposicao);

    dialogoPacoteComposicao = new caixaDialogo('divPacoteComposicao', 500, 700, 'padrao/', 140);
    dialogoPacoteComposicao.Show();

    Selector.$('divComposicao').appendChild(gridPacoteComposicao.table);
    MostraPacoteComposicao(codigoPacote, idContrato);
}

function MostraPacoteComposicao(idPacote, codigoAtual) {

    var ajax = new Ajax('POST', 'php/cadastro-de-contratos.php', true);
    var p = 'action=MostraPacoteComposicao';
    p += '&idPacote=' + idPacote;
    p += '&idContrato=' + codigoAtual;

    ajax.ajax.onreadystatechange = function() {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var nomeGrupo = "";

        for (var i = 0; i < json.length; i++) {

            if (nomeGrupo != json[i].nomeGrupo) {
                nomeGrupo = json[i].nomeGrupo;

                gridPacoteComposicao.addRow([
                    DOM.newText(json[i].nomeGrupo),
                    DOM.newText('')
                ]);
            }

            gridPacoteComposicao.addRow([
                DOM.newText(''),
                DOM.newText(json[i].nomeItem)
            ]);

            gridPacoteComposicao.getCell(gridPacoteComposicao.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:300px');
            gridPacoteComposicao.getCell(gridPacoteComposicao.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left;');
        }

        pintaLinhaGrid(gridPacoteComposicao);
    };

    ajax.Request(p);
}

function dia_Click() {

    if (Selector.$('dias').name !== Selector.$('dias').value) {
        Selector.$('dias').name = Selector.$('dias').value;
        Lista();
    }
}

function local_Click() {
    if (Selector.$('local').name !== Selector.$('local').value) {
        Selector.$('local').name = Selector.$('local').value;
        Lista();
    }
}

function Imprimir(idContrato, dia, local) {
    
    if(Selector.$('tabela').innerHTML == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Nenhuma festa encontrada.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    
    window.open("impressao-relatorio-panorama-de-festas.html?codigo=" + idContrato + "&dia=" + dia + "&local=" + local);
}