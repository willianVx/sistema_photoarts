checkSessao();

window.onload = function () {
    
    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Eventos</div>";
    carregarmenu();
    getDadosUsuario();

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Evento'),
        DOM.newText('Qtd Propostas'),
        DOM.newText('Qtd OS'),
        DOM.newText('Ativo'),
        DOM.newText('Editar'),
        DOM.newText('Excluir')
    ]);
    Selector.$('busca').focus();
    Selector.$('divTabela').appendChild(grid.table);
    Mostra();
};

function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-eventos.php', true);
    var p = 'action=Mostra';
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() === '0') {
            Selector.$('divTabela').style.display = "none";
            Selector.$('msgEventos').style.display = "block";
            return;
        }
        
        Selector.$('divTabela').style.display = "block";
        Selector.$('msgEventos').style.display = "none";
        
        var json = JSON.parse(ajax.getResponseText()  );
        var editar;
        var excluir;

        var cor = false;

        for (var i = 0; i < json.length; i++) {

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro(' + json[i].codigo + ' , "' + json[i].nome + '" , ' + json[i].ativo + ');');
            
            excluir = DOM.newElement('img');
            excluir.setAttribute('src', 'imagens/lixo.png');
            excluir.setAttribute('title', 'Excluir');
            excluir.setAttribute('class', 'efeito-opacidade-75-04');
            excluir.setAttribute('onclick', 'ExcluirEvento(' + json[i].codigo + ', ' + i + ');');
            
            grid.addRow([
                DOM.newText(json[i].nome),
                DOM.newText(json[i].qtdPropostas),
                DOM.newText(json[i].qtdOS),
                DOM.newText((json[i].ativo == 1 ? "SIM" : "NÃO")),
                editar,
                excluir
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].codigo);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:90px' + (json[i].ativo == 0 ? ';color:#9B0000' : ''));
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:90px');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:90px');

            if (cor) {
                cor = false;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");

            } else {
                cor = true;
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
            }
        }
    };

    ajax.Request(p);
}

function promptCadastro(codigo, nome, ativo) {

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.innerHTML = '';
    
    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divCadastro.appendChild(divform);
    
    var lblast = DOM.newElement('label');
    lblast.innerHTML = "* ";
    lblast.setAttribute("style", "float:right; color:red;");

    var lblcampo = DOM.newElement('label');
    lblcampo.innerHTML = "Campos obrigatórios";
    lblcampo.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblcampo.setAttribute("style", "float:right;");
    
    var lblast2 = DOM.newElement('label');
    lblast2.innerHTML = "*";
    lblast2.setAttribute("style", "color:red;");
    
    var lblnome = DOM.newElement('label');
    lblnome.innerHTML = 'Nome do evento ';
    lblnome.setAttribute('class', 'fonte_Roboto_texto_normal');

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome');
    txtnome.setAttribute('class', 'textbox_cinzafoco textbox_cinzafocoefeito');
    txtnome.setAttribute("onkeydown", "gravar_onkeydown(event, " + codigo + ", Gravar);");
    txtnome.setAttribute("style", 'width:337px');

    //====== ATIVO ==============//

    var boxativo = DOM.newElement('checkbox');
    boxativo.setAttribute('id', 'ativo');
    //box.setAttribute('class', 'textbox_cinza');
    boxativo.setAttribute("style", 'margin-right:5px;');

    var labelativo = DOM.newElement('label');
    labelativo.innerHTML = 'Ativo';
    labelativo.setAttribute('class', 'fonte_Roboto_texto_normal');
    labelativo.setAttribute("style", 'margin-right:5px;');
    labelativo.setAttribute("for", 'ativo');

    //============ BOTÕES ==============//

    var cmdTexto1 = DOM.newElement('button', 'gravar');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'Gravar(' + codigo + ')');
    cmdTexto1.innerHTML = 'Gravar';

    /*   cmdTexto = DOM.newElement('div', 'cancelar');
     cmdTexto.setAttribute('class', 'botaosimplesfoco');
     //cmdTexto.setAttribute('style', ' display:inline-block; margin-left:15px; float:right;');
     cmdTexto.setAttribute('onclick', 'dialogoCadastro.Close();');
     cmdTexto.innerHTML = 'Cancelar';*/

    //======== Tabela =========//
    divform.appendChild(lblcampo);
    divform.appendChild(lblast);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblnome);
    divform.appendChild(lblast2);
    divform.innerHTML += '<br>';
    divform.appendChild(txtnome);
    divform.innerHTML += '<br><br><br>';
    divform.appendChild(boxativo);
    divform.appendChild(labelativo);
    //divCadastro.appendChild(cmdTexto);
    divform.appendChild(cmdTexto1);
    divform.innerHTML += '<br>';
    
    Selector.$('ativo').checked = true;
    
    if (codigo > 0) {
        
        Selector.$('nome').value = nome;

        if (ativo != 1)
            Selector.$('ativo').checked = false;
    }
    
    dialogoCadastro = new caixaDialogo('divCadastro', 200, 420, 'padrao/', 130);
    
    dialogoCadastro.Show();
    Selector.$('nome').focus();
}

function Gravar(codigo) {

    var nome = Selector.$('nome').value;

    var ativo = 0;
    Selector.$('ativo').checked ? ativo = 1 : '';

    if (nome.trim() === '') {
        Selector.$('ativo').focus();
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o campo nome.", "OK", "", false, "nome");
        mensagem.Show();
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-eventos.php', true);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&nome=' + nome;
    p += '&ativo=' + ativo;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;
        
        Selector.$('gravar').disabled = false;
        Selector.$('gravar').innerHTML = "Gravar";
        
        if (ajax.getResponseText() == '2') {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Este evento já está cadastrado.", "OK", "", false, "nome");
            mensagem.Show();
            return;
        }

        if (ajax.getResponseText() == 0) {
            Selector.$('ativo').focus();
            var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao gravar o evento. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
            mensagem.Show();
            return;
        } else {
            dialogoCadastro.Close();
            Selector.$('busca').value = '';
            Mostra();
            return;
        }
    };
    
    Selector.$('gravar').disabled = true;
    Selector.$('gravar').innerHTML = "Gravando";

    ajax.Request(p);
}

function ExcluirEvento(codigo, linha) {
        
    if(grid.getCellText(linha, 1) != '0' || grid.getCellText(linha, 2) != '0'){
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Aviso!", "Exclusão não pode ser efetuada. Evento com propostas ou ordens de serviços.", "OK", "", false, "");
        mensagem.Show();
        return;
    }
    
    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este evento?", "SIM", "ExcluirEvento_Aux(" + codigo +")", true, "");
    mensagemExcluir.Show();
}

function ExcluirEvento_Aux(codigo) {
    
    var ajax = new Ajax("POST", "php/cadastro-eventos.php", false);
    var p = "action=ExcluirEvento";
    p += "&codigo=" + codigo;
    
    ajax.Request(p);
    
    if(ajax.getResponseText() == '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Erro ao excluir. Se o erro persistir contate o suporte técnico.", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {
        mensagemExcluir.Close();
        Mostra();
        return;
    }
}