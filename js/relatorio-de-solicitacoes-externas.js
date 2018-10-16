checkSessao();
//checkPermissao(30, false);

window.onresize = function() {
    Selector.$('tabela').style.height = (document.documentElement.clientHeight - 290) + "px";
}

window.onload = function() {

    Selector.$("legendaTela").innerHTML = "<div>Solicitações Externas</div>";
    getDadosUsuario();
    carregarmenu();
    getDiaDeAte();
    getClientes(Selector.$('cliente'), 'Todos', true);
    getLocais(Selector.$('local'), "Todos", true);
    Select.AddItem(Selector.$('pacote'), '<< Selecione um local', 0);

    Mask.setData(Selector.$('de'));
    Mask.setData(Selector.$('ate'));

    grid = new Table('gridCotacoes');
    grid.table.setAttribute('cellpadding', '3');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_jujuba_comum');

    grid.addHeader([
        DOM.newText('Contrato'),
        DOM.newText('Data'),
        DOM.newText('Cliente'),
        DOM.newText('Local'),
        DOM.newText('Pacote'),
        DOM.newText('Opcionais'),
        DOM.newText('Ver')
    ]);

    Selector.$('tabela').appendChild(grid.table);

    Selector.$('tabela').style.height = (document.documentElement.clientHeight - 290) + "px";
    Lista();
}

function Lista() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/relatorio-de-solicitacoes-externas.php', true);
    var p = 'action=MostrarContratos';
    p += '&de=' + Selector.$('de').value;
    p += '&ate=' + Selector.$('ate').value;
    p += '&cliente=' + Selector.$('cliente').value;
    p += '&local=' + Selector.$('local').value;
    p += '&pacote=' + Selector.$('pacote').value;

    ajax.ajax.onreadystatechange = function() {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('totais').innerHTML = "Nenhuma solicitação encontrada";
            return;
        }

        var json = JSON.parse(ajax.getResponseText() || "[ ]");
        var ver;
        var opcionais;

        for (var i = 0; i < json.length; i++) {

            ver = DOM.newElement('img');
            ver.setAttribute('src', 'imagens/pesquisar.png');
            ver.setAttribute('title', 'Ver Contrato');
            ver.setAttribute('style', 'width:20px');
            ver.setAttribute('class', 'efeito-opacidade-75-04');
            ver.setAttribute('onclick', 'window.location="cadastro-de-contratos.html?c=' + json[i].idContrato + '"');

            var jsonOpcionais = JSON.parse(json[i].arrayOpcionais || "[ ]");
            var arrayOpcionais = '';

            for(var j = 0; j < jsonOpcionais.length; j++) {
                arrayOpcionais += jsonOpcionais[j].opcional + '<br>';
            }

            if (arrayOpcionais.substring(0,2) == ', ') {
                arrayOpcionais = arrayOpcionais.replace('<br>', '');
            }

            opcionais = DOM.newElement('span');
            opcionais.innerHTML = arrayOpcionais;

            grid.addRow([
                DOM.newText(json[i].contrato),
                DOM.newText(json[i].data),
                DOM.newText(json[i].cliente),
                DOM.newText(json[i].nomeLocal),
                DOM.newText(json[i].nomePacote),
                opcionais,
                ver
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idContrato);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:70px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left; width:auto;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:left; width:auto;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:auto;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:auto;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:center; width:40px;');
        }

        pintaLinhaGrid(grid);
        
        if (grid.getRowCount() === 1)
            Selector.$('totais').innerHTML = grid.getRowCount() + " solicitação cadastrada";
        else
            Selector.$('totais').innerHTML = grid.getRowCount() + " solicitações cadastradas";
    };

    ajax.Request(p);
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