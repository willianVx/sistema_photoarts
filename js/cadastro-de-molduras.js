checkSessao();
CheckPermissao(146, false, '', true);
codigoMoldura = 0;

window.onload = function () {

    Selector.$("legendaTela").innerHTML = "<div>Cadastro de Molduras</div>";
    carregarmenu();
    getDadosUsuario();

    getGruposMolduras(Selector.$('grupo'), 'Selecione um grupo...', true);

    grid = new Table('grid');
    grid.table.setAttribute('cellpadding', '5');
    grid.table.setAttribute('cellspacing', '0');
    grid.table.setAttribute('class', 'tabela_cinza_foco');

    grid.addHeader([
        DOM.newText('Grupo'),
        DOM.newText('Moldura'),
        DOM.newText('Valor'),
        DOM.newText('Photoarts'),
        DOM.newText('Instaarts'),
        DOM.newText('Ativo'),
        DOM.newText('Editar')
    ]);

    Selector.$('grupo').focus();
    Selector.$('divTabela').appendChild(grid.table);
    grupo_click();
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 160) + "px";
};

window.onresize = function () {
    Selector.$('divTabela').style.height = (document.documentElement.clientHeight - Selector.$('divtitulotopo').clientHeight - 140) + "px";
};

function grupo_click() {
    var cmb = Selector.$('grupo');

    if (cmb.value != cmb.name) {
        cmb.name = cmb.value;
        Mostra();
    }
}

function Mostra() {

    grid.clearRows();

    var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', true);
    var p = 'action=Mostra';
    p += '&idGrupo=' + Selector.$('grupo').value;
    p += '&nome=' + Selector.$('busca').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Nenhuma moldura encontrada", "OK", "", false, "busca");
            mensagem.Show();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );
        var editar;

        var grupo = '';
        var codigo = 0;
        var cor = false;

        for (var i = 0; i < json.length; i++) {
            if (grupo != json[i].idMolduraGrupo) {
                editar = DOM.newElement('img');
                editar.setAttribute('src', 'imagens/modificar.png');
                editar.setAttribute('title', 'Editar');
                editar.setAttribute('class', 'efeito-opacidade-75-04');
                editar.setAttribute('onclick', 'promptCadastroG' + '(' + json[i].idMolduraGrupo + ');');

                grid.addRow([
                    DOM.newText(json[i].molduraGrupo),
                    DOM.newText(''),
                    DOM.newText(json[i].valor),
                    DOM.newText(''),
                    DOM.newText(''),
                    DOM.newText(json[i].ativoG),
                    editar
                ]);

                codigo = json[i].idMolduraGrupo;
                grupo = codigo;

                grid.setRowData(grid.getRowCount() - 1, codigo);
                grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left; width:200px; font-weight:bold');
                grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
                grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right; width:100px;');
                grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:80px;');
                grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:80px;');
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px;');
                grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px;');

                if (json[i].ativoG == 'SIM') {
                    grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px; color:green;');
                } else {
                    grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px; color:red;');
                }

                if (cor) {
                    grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
                    cor = false;

                } else {
                    grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
                    cor = true;
                }

            }

            editar = DOM.newElement('img');
            editar.setAttribute('src', 'imagens/modificar.png');
            editar.setAttribute('title', 'Editar');
            editar.setAttribute('class', 'efeito-opacidade-75-04');
            editar.setAttribute('onclick', 'promptCadastro' + '(' + json[i].idMoldura + ');');

            grid.addRow([
                DOM.newText(''),
                DOM.newText(json[i].moldura),
                DOM.newText(''),
                DOM.newText(json[i].photoarts),
                DOM.newText(json[i].instaarts),
                DOM.newText(json[i].ativo),
                editar
            ]);

            grid.setRowData(grid.getRowCount() - 1, json[i].idMoldura);
            grid.getCell(grid.getRowCount() - 1, 0).setAttribute('style', 'text-align:left; width:200px;');
            grid.getCell(grid.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
            grid.getCell(grid.getRowCount() - 1, 2).setAttribute('style', 'text-align:right; width:100px;');
            grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:80px;');
            grid.getCell(grid.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:80px;');
            grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px;');
            grid.getCell(grid.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px;');


            if (json[i].photoarts == 'SIM') {
                grid.getCell(grid.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:30px; color:green;');
            }

            if (json[i].ativo == 'SIM') {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px; color:green;');
            } else {
                grid.getCell(grid.getRowCount() - 1, 5).setAttribute('style', 'text-align:center; width:30px; color:red;');
            }

            if (cor) {
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#F5F5F5");
                cor = false;

            } else {
                grid.setRowBackgroundColor(grid.getRowCount() - 1, "#FFF");
                cor = true;
            }
        }
    };

    ajax.Request(p);
}

function promptCadastro(codigo) {

    
        if(!CheckPermissao(147, true, 'Você não possui permissão para cadastrar/editar uma moldura', false)){
            return;
        }
    

    var cmb = Selector.$('grupo');
    if (codigo < 0 && cmb.selectedIndex <= 0) {
        var mensagem = new DialogoMensagens("prompt", 130, 360, 150, "2", "Atenção!", "Por favor, selecione um grupo para adicionar uma moldura", "OK", "", false, "grupo");
        mensagem.Show();
        return;
    }

    var div;

    if (!isElement('div', 'divCadastro')) {
        div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }
    else {
        div = Selector.$('divCadastro');
    }

    div.innerHTML = '';
    div.innerHTML += ' <div class="divcontainer" style="max-width:100%">' +
            '<label class="fonte_Roboto_texto_normal">Grupo Moldura</label> <input readonly="readonly" id="c_grupo" type="text" style="width:100%; background-color:#F5F5F5"  class="textbox_cinzafoco" /></div>';

    div.innerHTML += '<div style="float:right; width:240px;"> <div class="divcontainer" style="max-width:50%">' +
            '<label class="fonte_Roboto_texto_normal">Moldura</label> <input placeHolder="Informe o nome da moldura" id="c_moldura" type="text" style="width:240px;"  class="textbox_cinzafoco" /></div>'+
            ' <div class="divcontainer" style="max-width:90%; padding-top:5px; float:none;">' +
            '<input id="c_photoarts" type="checkbox" /><label class="fonte_Roboto_texto_normal" for="c_photoarts">Photoarts</label>' +
            '<input style="margin-left:12px" id="c_instaarts" type="checkbox" /><label class="fonte_Roboto_texto_normal" for="c_instaarts">Instaarts</label> '+
            '<input id="c_ativo" type="checkbox" /><label class="fonte_Roboto_texto_normal" for="c_ativo">Ativo</label> </div></div> ';

    div.innerHTML += '<div style="float:left; width:180px;"><div id="divImagem" style="  margin-top:10px; width:180px; height:auto; border:1px solid lightgray; text-align:center;">'+
    '<div style=""><img id="imagem" src="imagens/login.png" width="175" height="125" name=""></div></div>'+
    '<div style="margin-top:10px;  margin-bottom:20px;"><button id="adicionarImagem" class="botaosimplesfoco"  onclick="IncluirImagem();">Incluir Imagem</button></div></div><br>';
  
    div.innerHTML += '<div style="width:100%; clear: both; margin-top:50px; text-align:right"><div id="c_gravar" class="botaosimplesfoco fonte_Roboto_texto_normal" onclick="Gravar(' + codigo + ')"> Salvar </div> <a style="cursor:pointer" class="fonte_Roboto_texto_normal" onclick="dialogoCadastro.Close()">Cancelar</a></div>';

    dialogoCadastro = new caixaDialogo('divCadastro', 330, 470, '../padrao/', 140);
    dialogoCadastro.Show();

    if (codigo > 0) {
        codigoMoldura = codigo;
        var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', false);
        var p = 'action=MostrarMoldura';
        p += '&codigo=' + codigo;

        ajax.Request(p);

        if (ajax.getResponseText() == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        Selector.$('c_grupo').value = json.molduraGrupo;
        Selector.$('c_grupo').name = json.idMolduraGrupo;

        Selector.$('c_moldura').value = json.moldura;

        Selector.$('c_ativo').checked = (json.ativo == 'SIM' ? 'checked' : false);
        Selector.$('c_photoarts').checked = (json.photoarts == 'SIM' ? 'checked' : false);
        Selector.$('c_instaarts').checked = (json.instaarts == 'SIM' ? 'checked' : false);

        if (json.imagem === '') {
        Selector.$('imagem').setAttribute('src', 'imagens/login.png');
        Selector.$('imagem').setAttribute('style', 'width:175px; height:125px;');
    } else {
        Selector.$('imagem').src = json.imagemMini;
        Selector.$('imagem').setAttribute('style', 'width:auto; height:auto');
    }

    Selector.$('imagem').name = json.imagem;


    if (json.imagem !== '') {
        Selector.$('adicionarImagem').innerHTML = 'Excluir Imagem';
        Selector.$('adicionarImagem').setAttribute('onclick', 'ExcluirImagemObra(' + json.idMoldura + ')');
    }

     //   Selector.$('gravar').setAttribute('onclick', 'Gravar(' + json.idMoldura + ')');
    }
    else {
        Selector.$('c_grupo').value = Select.GetText(Selector.$('grupo'));
        Selector.$('c_grupo').name = Selector.$('grupo').value;

        Selector.$('c_ativo').checked = 'checked';
        Selector.$('c_moldura').focus();
    }
}

function ExcluirImagemObra(codigo) {

    var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', false);
    var p = 'action=ExcluirImagemObra';
    p += '&idMoldura=' + codigo;
    p += '&imagem=' + Selector.$('imagem').name;
    ajax.Request(p);

    if (ajax.getResponseText() === '0') {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro", "Erro ao excluir a imagem. Se o erro persistir contate o suporte técnico", "OK", "", false, "");
        mensagem.Show();
        return;
    } else {

        Selector.$('imagem').src = 'imagens/login.png';
        Selector.$('imagem').setAttribute('style', 'width:175px; height:125px;');
        Selector.$('imagem').name = "";

        Selector.$('adicionarImagem').innerHTML = "Incluir Imagem";
        Selector.$('adicionarImagem').setAttribute('onclick', 'IncluirImagem();');
    }
}



function IncluirImagem() {

    var aleatorio = Math.random();
    var aux = aleatorio.toString().split(".");
    aleatorio = aux[1].substr(0, 4);

    var nome = Selector.$('c_moldura').value.replace(' ', '_') + aleatorio;//Number.Complete(parseInt(codigoAtual), 6, "0", true);
    var path = '../imagens/molduras/';
    var funcao = 'SalvarImagemObra';

    DialogUploadNovo('prompt', nome, path, funcao, 'tema02', 'padrao/', 'jpeg,jpg');
}

function SalvarImagemObra(path) {

    var vetor = path.split("/");
    dialog.Close();

    Selector.$('imagem').name = vetor[vetor.length - 1];

    GerarMiniaturaObra(path);

    if (codigoMoldura > 0) {

        var ajax = new Ajax('POST', 'php/cadastro-de-artistas.php', false);
        var p = 'action=AtualizarImagemObra';
        p += '&idMoldura=' + codigoMoldura;
        p += '&imagem=' + Selector.$('imagem').name;
        ajax.Request(p);
    }
}

function GerarMiniaturaObra(path) {

    /*if (codigoMoldura <= 0)
        return;*/

    var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', false);
    var p = 'action=GerarMiniaturaObra';
    p += '&imagem=' + Selector.$('imagem').name;
    p += '&idMoldura=' + codigoMoldura;


    ajax.Request(p);

    var json = JSON.parse(ajax.getResponseText() );

    if (ajax.getResponseText() !== "0") {
        Selector.$('imagem').src = json.foto;
        Selector.$('imagem').setAttribute('style', 'width:auto; height:auto;');
    } else {
        var vetor = path.split("../");
        Selector.$('imagem').src = vetor[1];
        Selector.$('imagem').setAttribute('style', 'width:175px; height:125px;');
    }

    Selector.$('adicionarImagem').innerHTML = "Excluir Imagem";
    Selector.$('adicionarImagem').setAttribute('onclick', 'ExcluirImagemObra(0);');
}
function promptCadastroG(codigo) {

    var div;

    if (!isElement('div', 'divCadastro')) {
        div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }
    else {
        div = Selector.$('divCadastro');
    }

    div.innerHTML = '';

    div.innerHTML += ' <div class="divcontainer" style="max-width:100%">' +
            '<label class="fonte_Roboto_texto_normal">Grupo Moldura</label> <input placeHolder="Ex.: Tipo 12" id="c_grupo" type="text" style="width:100%; "  class="textbox_cinzafoco" /></div>';

    div.innerHTML += ' <div class="divcontainer" style="max-width:70%">' +
            '<label class="fonte_Roboto_texto_normal">Valor (R$)</label> <input placeHolder="120,00" id="c_valor" type="text" style="width:100%;"  class="textbox_cinzafoco" /></div>';

    div.innerHTML += ' <div class="divcontainer" style="max-width:25%; padding-top:5px">' +
            '<input id="c_ativo" type="checkbox" /><label class="fonte_Roboto_texto_normal" for="c_ativo">Ativo</label></div></ br> ';

    div.innerHTML += '<div style="width:100%; margin-top:10px; text-align:right"><div id="c_gravar" class="botaosimplesfoco fonte_Roboto_texto_normal" onclick="GravarGrupo(' + codigo + ')"> Salvar </div> <a style="cursor:pointer" class="fonte_Roboto_texto_normal" onclick="dialogoCadastro.Close()">Cancelar</a></div>';

    dialogoCadastro = new caixaDialogo('divCadastro', 190, 270, '../padrao/', 140);
    dialogoCadastro.Show();

    Mask.setMoeda(Selector.$('c_valor'));

    if (codigo > 0) {
        var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', false);
        var p = 'action=MostrarGrupoMoldura';
        p += '&codigo=' + codigo;
        codigoMoldura = codigo;

        ajax.Request(p);

        if (ajax.getResponseText() == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "1", "Erro!", "Problemas de comunicação com o banco, se o erro persistir contate o suporte.", "OK", "", false, "");
            mensagem.Show();
            return;
        }

        var json = JSON.parse(ajax.getResponseText() );

        Selector.$('c_grupo').value = json.molduraGrupo;
        Selector.$('c_grupo').name = json.idMolduraGrupo;

        Selector.$('c_valor').value = json.valor;

        Selector.$('c_ativo').checked = (json.ativo == 'SIM' ? 'checked' : false);

        Selector.$('c_gravar').setAttribute('onclick', 'GravarGrupo(' + json.idMolduraGrupo + ')');
    }
    else {

        Selector.$('c_ativo').checked = 'checked';
        Selector.$('c_grupo').focus();
    }
}

function Verifica() {

    if (Selector.$('c_moldura').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o nome da moldura.", "OK", "", false, "c_moldura");
        mensagem.Show();
        return false;
    }

    return true;
}

function Gravar(codigo) {

    if(!CheckPermissao(147, true, 'Você não possui permissão para editar uma moldura', false)){
        return;
    }

    if (!Verifica()) {
        return;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', false);
    var p = 'action=Gravar';
    p += '&codigo=' + codigo;
    p += '&idMolduraGrupo=' + Selector.$('c_grupo').name;
    p += '&moldura=' + Selector.$('c_moldura').value;
    p += '&ativo=' + (Selector.$('c_ativo').checked == true ? 1 : 0);
    p += '&photoarts=' + (Selector.$('c_photoarts').checked == true ? 1 : 0);
    p += '&instaarts=' + (Selector.$('c_instaarts').checked == true ? 1 : 0);
    p += '&imagem=' + Selector.$('imagem').name;

    ajax.Request(p);

    resTxt = parseInt( ajax.getResponseText() );

    if (resTxt === 2) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Moldura já cadastrada.", "OK", "", false, "c_moldura");
        mensagem.Show();
        return;
    }

    if (resTxt === 1) {
        dialogoCadastro.Close();
        Mostra();
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Problemas ao gravar a moldura, se o erro persistir contate o suporte.", "OK", "", false, "c_moldura");
        mensagem.Show();
        return;
    }
}

function GravarGrupo(codigo) {

    if (Selector.$('c_grupo').value.trim() == '') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o nome do grupo.", "OK", "", false, "c_grupo");
        mensagem.Show();
        return false;
    }

    if (Number.parseFloat(Selector.$('c_valor').value) <= 0) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Por favor, preencha o valor do grupo.", "OK", "", false, "c_valor");
        mensagem.Show();
        return false;
    }

    var ajax = new Ajax('POST', 'php/cadastro-de-molduras.php', false);
    var p = 'action=GravarGrupo';
    p += '&codigo=' + codigo;
    p += '&grupo=' + Selector.$('c_grupo').value;
    p += '&ativo=' + (Selector.$('c_ativo').checked == true ? 1 : 0);
    p += '&valor=' + Selector.$('c_valor').value;

    ajax.Request(p);

    if (ajax.getResponseText() == '2') {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Grupo já cadastrado.", "OK", "", false, "c_grupo");
        mensagem.Show();
        return;
    }

    if (ajax.getResponseText() == '1') {
        dialogoCadastro.Close();

        if (codigo < 0) {
            getGruposMolduras(Selector.$('grupo'), 'Selecione um grupo...', false);
            Select.ShowText(Selector.$('grupo'), Selector.$('c_grupo').value);

            grid.clearRows();
            Selector.$('busca').focus();
        }
        else {
            Mostra();
        }
    } else {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "1", "Erro!", "Problemas ao gravar o grupo, se o erro persistir contate o suporte.", "OK", "", false, "c_moldura");
        mensagem.Show();
        return;
    }
}