var cpf = "";
var nomeColec = "";
var descontoMaximo = 0;
var descontoMaximoObra = 0;

var tipoArquiteto = 0;
var dataContrato = "";
var periodoDiasContrato = "";
var numeroContrato = "";
var obsContrato = "";
var devolvido = "0";
var comissaoContrato = "";

function oculta_menu(menu) {

    if (Selector.$('divmenu').style.width == "0px") {
        if (menu == 1) {
            Selector.$('divmenu').style.width = "60px";
            Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right; padding-right:60px');
        } else {
            Selector.$('divmenu').style.width = "320px";
            Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right; padding-right:320px');
        }
    } else {
        if (menu == 1) {
            Selector.$('divmenu').style.width = "60px";
            Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right; padding-right:60px');
        } else {
            Selector.$('divmenu').style.width = "0px";
            Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right;');
        }
    }

    Cookies.setCookie('lembrarmenu', Selector.$('divmenu').style.width, 30);
    ajustaWidgetsPrincipal();
}

function carregarmenu() {
    var cookie = Cookies.getCookie('lembrarmenu');
    cookie = '0px';
    if (cookie !== null || cookie !== '') {
        Selector.$('divmenu').style.width = cookie;
    }
    if (cookie == "60px") {
        Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right; padding-right:60px');
    } else if (cookie == "320px") {
        Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right; padding-right:320px');
    } else {
        Selector.$('cabecalho_botoes_principal').setAttribute('style', 'float:right;');
    }
}

function sair() {

    window.location = "index.html";
}

function checkSessao() {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=checkSessao';
    ajax.Request(p);
    
    if (ajax.getResponseText() == "0") {
        window.location = "index.html?url=" + window.location.href;
    }
}

function destroySessao() {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=destroySessao';
    ajax.Request(p);
}

function getDadosUsuario() {

    var usuario = Selector.$('nome_user');
    var email = Selector.$('email_user');
    var foto = Selector.$('foto_menu');

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    ajax.Request('action=getDadosUsuario');
    
    if( ajax.getResponseText() !== "" ){
        var json = JSON.parse(ajax.getResponseText() );
    }else{
        var json = "";
    }
    usuario.name = json.codigo;
    usuario.innerHTML = json.funcionario;
    email.innerHTML = json.email;
    email.name = json.idPerfil;

    foto.setAttribute('style', 'background-image:url(' + json.imagem + '); background-repeat:no-repeat; background-position: center; background-size:52px;');

    if (window.location.href.split('/')[window.location.href.split('/').length - 1] !== 'alterar-senha.html') {
        if (json.senhaPadrao === '1') {
            var msg = 'Este é o seu primeiro acesso ao sistema ou sua senha é a padrão, para sua segurança será necessário trocar a senha para uma senha pessoal';
            if (!isElement('div', 'prompt')) {
                var div = DOM.newElement('div', 'prompt');
                document.body.appendChild(div);
            }
            var mensagem = new DialogoMensagens("prompt", 155, 450, 150, "2", "Atenção!", msg, "TROCAR SENHA", "TrocarSenha()", false, '');
            mensagem.Show();
        }
    }

    LoadAniversariantes();
    LoadAvisos();
}

function TrocarSenha() {
    window.location = 'alterar-senha.html';
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

DialogoMensagens = function (div, altura, largura, posicaoz, tipo_prompt, titulo, mensagem, nomeBotao, funcaoBotao, mostraBotaoCancelar, campoFocus) {

    if (!isElement('div', div)) {
        document.body.appendChild(DOM.newElement('div', div));
    }

    Selector.$(div).innerHTML = "<input type='text' id='promptConfirmacao' />";
    Selector.$('promptConfirmacao').focus();
    Selector.$(div).innerHTML = "";

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

    // this.divBlock.style.top = scrollY + 'px';
    this.imgFechar = document.createElement('img');
    this.imgFechar.setAttribute('title', 'Fechar');
    this.imgFechar.setAttribute('src', '../padrao/imagens/fechar.png');
    this.imgFechar.setAttribute('style', 'float: right; display:none; cursor:pointer;');
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
    } else if (funcaoBotao === "wait") {
             nomeBotao = '';
    } else {
        this.botao.setAttribute('onclick', funcaoBotao);
    }

    this.botao.innerHTML = nomeBotao;
    this.botaoCancelar = document.createElement('a');
    this.botaoCancelar.style.marginLeft = '5px';
    this.botaoCancelar.setAttribute('class', 'botaobrancosuave_prompt');
    this.botaoCancelar.innerHTML = "Cancelar";
    this.botaoCancelar.setAttribute('id', 'btcancel');
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
        Selector.$(div).setAttribute('style', 'margin-left:' + ((largura / 2) * -1) + 'px; margin-top:' + ((altura / 2) * -1) + 'px');
        Selector.$(div).style.height = altura + "px";
        Selector.$(div).style.width = largura + "px";
        Selector.$(div).style.left = "50%";
        Selector.$(div).style.top = "50%";
        Selector.$(div).style.visibility = 'hidden';
        document.body.appendChild(Selector.$(div));
        Selector.$(div).style.position = "absolute";
        Selector.$(div).style.zIndex = posicaoz + 1;
        //Selector.$(div).style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
        //Selector.$(div).style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    } else {
        div.setAttribute('style', 'margin-left:' + ((largura / 2) * -1) + 'px; margin-top:' + ((altura / 2) * -1) + 'px');
        div.style.height = altura + "px";
        div.style.width = largura + "px";
        div.style.left = "50%";
        div.style.top = "50%";
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        div.style.position = "absolute";
        div.style.zIndex = posicaoz + 1;
        //div.style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
        //div.style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    }

    Selector.$(div).appendChild(this.imgFechar);
    Selector.$(div).appendChild(this.tituloDiv);
    Selector.$(div).appendChild(this.mensagemDiv);
    Selector.$(div).appendChild(this.botao);
    if (mostraBotaoCancelar) {
        Selector.$(div).appendChild(this.botaoCancelar);
    }

    this.Show = function () {
        caixaDialogo.imagePath = '../imagens/';
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
        //document.body.removeChild(Selector.$('divBlock'));
        
        if (typeof (div) === "string") {
            Selector.$(div).style.visibility = 'hidden';
            //document.body.removeChild(Selector.$(div));
        } else {
            div.style.visibility = 'hidden';
            //document.body.removeChild(div);
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
        //this.divFechar.style.visibility = 'hidden';
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
}

function gravar_onkeydown(ev, codigo, funcao) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        funcao(codigo);
    }
}

function buscar_onkeydown(ev, funcao) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        funcao();
    }
}

function cep_keyDown(ev) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;
    if (keyCode === 13) {
        BuscarCEP();
    }
}

function BuscarCEP() {

    if (Selector.$('cep').value === Selector.$('cep').name) {
        return;
    }

    Selector.$('cep').name = Selector.$('cep').value;

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
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

        var json = JSON.parse(ajax.getResponseText()  );

        Selector.$('endereco').value = json.rua;
        Selector.$('bairro').value = json.bairro;
        Selector.$('cidade').value = json.cidade;
        Selector.$('estado').value = json.estado;
        Selector.$('numero').focus();
    };

    Selector.$('lblcep').innerHTML = "Pesquisando CEP...";
    ajax.Request(p);
}

function getBancos(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getBancos';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhum banco", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idBanco", "banco");
        };

        Select.AddItem(cmb, "Carregando os bancos...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhum banco", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idBanco", "banco");
    }
}

function getDepartamentos(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getDepartamentos';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhum banco", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idDepartamento", "departamento");
        };

        Select.AddItem(cmb, "Carregando os departamentos...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhum departamento", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idDepartamento", "departamento");
    }
}

function getCargos(cmb, texto, assinc) {

    Select.Clear(cmb);
    var ajax = new Ajax('POST', 'php/photoarts.php', assinc);
    var p = 'action=getCargos';

    if (assinc) {
        ajax.ajax.onreadystatechange = function () {

            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() === '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhum cargo");
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idCargo", "cargo");
        };

        Select.AddItem(cmb, "Carregando os cargos...", 0);
        ajax.Request(p);

    } else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhum cargo");
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idCargo", "cargo");
    }
}

function ValidarCpf(cpf) {

    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11)
        return false;
    for (i = 0; i < cpf.length - 1; i++)
        if (cpf.charAt(i) != cpf.charAt(i + 1))
        {
            digitos_iguais = 0;
            break;
        }
    if (!digitos_iguais)
    {
        numeros = cpf.substring(0, 9);
        digitos = cpf.substring(9);
        soma = 0;
        for (i = 10; i > 1; i--)
            soma += numeros.charAt(10 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
        numeros = cpf.substring(0, 10);
        soma = 0;
        for (i = 11; i > 1; i--)
            soma += numeros.charAt(11 - i) * i;
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    }
    else
        return false;
}

function VerificarCpfCnpjIgual(codigo, tabela, nomeCampo, pk) {

    /*if (codigo > 0) {
     return;
     }*/
    if (cpf === Selector.$('cpf').value) {
        if (Selector.$('cpf').name === "true") {
            return;
        }
    }

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
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

function VerificarNomeIgual(codigo, tabela, nomeCampo, pk) {

    /*if (codigo > 0) {
     return;
     }*/
    if (nomeColec == Selector.$('nome').value) {
        if (Selector.$('nome').name == "true") {
            return;
        }
    }

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=VerificarNomeIgual';
    p += '&codigo=' + codigo;
    p += '&nome=' + Selector.$('nome').value;
    p += '&tabela=' + tabela;
    p += '&nomeCampo=' + nomeCampo;
    p += '&pk=' + pk;

    ajax.Request(p);

    if (ajax.getResponseText() === '0') {        
        if(confirm("Atenção, já existe colecionador cadastrado com este nome. Deseja continuar um novo cadastro?")){
            Selector.$('nome').name = true;
            nomeColec = '';
        }
        else{
            Selector.$('nome').name = '';            
            nomeColec = '';
            
            if(window.location.href.split('/')[window.location.href.split('/').length-1] == 'pedidos.html'){
                dialogoCadastroClienteRapido.Close();
                PromptPesquisarClientes();
                Selector.$('cliente_nome').value = Selector.$('nome').value;
                MostraResultadoClientes();
            }
            else{
                Selector.$('busca').value = Selector.$('nome').value;
                MostraColecionadores(false);
                Sair();
            }
        }
    } else {
        Selector.$('nome').name = '';
        nomeColec = '';
    }
}

function getCentrosCusto(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getCentrosCusto';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhum centro de custo", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idCentroCusto", "centroCusto");
        };

        Select.AddItem(cmb, "Carregando os centros de custo...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhum centro de custo", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idCentroCusto", "centroCusto");
    }
}

function getNaturezas(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getNaturezas';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhuma natureza", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idNatureza", "natureza");
        };

        Select.AddItem(cmb, "Carregando as naturezas...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhuma natureza", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idNatureza", "natureza");
    }
}

function getClientes(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
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

function getClientesPremium(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
    var p = 'action=getClientesPremium';

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
            var json = JSON.parse(ajax.getResponseText()  );
            var count = 0;
            var count2 = 0;
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
                            count2 = count;
                            texto1 += '</optgroup>';
                            texto1 += '<optgroup label="Colecionadores Arquitetos">';
                        }
                        count2 = count2 + 1;
                        //count++;
                        texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                    }

                    if (json[i].arquiteto == '0') {
                        if (i == count2) {
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
        var json = JSON.parse(ajax.getResponseText() );
        var count = 0;
        var count2 = 0;
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
                            count2 = count;
                            texto1 += '</optgroup>';
                            texto1 += '<optgroup label="Colecionadores Arquitetos">';
                        }
                        
                        count2 = count2 + 1;
                        texto1 += '<option value=' + json[i].codigo + '>' + json[i].nome + '</option>';
                    }

                    if (json[i].arquiteto == '0') {
                        if (i == count2) {
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

function getTiposTransportes(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
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

function getDiasRepasse(cmb) {

    Select.Clear(cmb);

    Select.AddItem(cmb, "Selecione o dia de repasse", 0);
    for (var i = 1; i < 32; i++) {
        Select.AddItem(cmb, i, i);
    }
}

function getEstilos(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
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

function getMarchandsGerentes(cmb, texto, ascinc, gerentes, idLoja) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
    var p = 'action=getMarchandsGerentes';
    p += '&gerentes=' + gerentes;
    p += '&idLoja=' + idLoja;

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
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

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum marchand', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVendedor', 'vendedor');
    }
}

function getMarchands(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
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

            var json = JSON.parse(ajax.getResponseText()  );
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

        var json = JSON.parse(ajax.getResponseText()  );
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

function getVendedores(cmb, texto, ascinc, condicao, loja) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
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

function getArquitetos(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
    var p = 'action=getArquitetos';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum arquiteto', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando os arquitetos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum arquiteto', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

/****************************************************************** // SelectVendedores // ******************************************************************/

var SelectVendedores = {
    FillWithJSON: function (obj, txt, idField, nameField, typeField, condicao)
    {
        if (txt == '')
            return;

        var objJSON = JSON.parse(txt);
        var objItem = null;
        var titulo1 = true;
        var titulo2 = true;

        for (var i in objJSON)
        {
            if (titulo1 && objJSON[i][typeField] === condicao) {
                var titulo = (SelectVendedores.AddTitle(obj, objJSON[i][typeField]));
                titulo1 = false;

            }

            if (titulo2 && objJSON[i][typeField] !== condicao) {
                var titulo = (SelectVendedores.AddTitle(obj, objJSON[i][typeField]));
                titulo2 = false;
            }

            SelectVendedores.AddItem(titulo, objJSON[i][nameField], objJSON[i][idField], objJSON[i][typeField]);
            //objItem = document.createElement('option');
            //objItem.setAttribute('value', objJSON[i][idField]);
            //objItem.appendChild(document.createTextNode(objJSON[i][nameField]));
            //obj.appendChild(objItem);




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
    Show: function (obj, id)
    {


        for (var i = 0; i < obj.length; i++) {
            if (parseInt(id) === parseInt(obj.options[i].value))
            {
                obj.selectedIndex = i;
                return;
            }
        }
    },
    ShowText: function (obj, Text)
    {
        for (var i = 0; i < obj.length; i++) {
            if (Text == obj.options[i].text)
            {
                obj.selectedIndex = i;
                return;
            }
        }
    },
    GetText: function (obj)
    {
        return obj.options[obj.selectedIndex].text;
    },
    SetText: function (obj, text)
    {
        return obj.options[obj.selectedIndex].text = text;
    },
    GetOption: function (obj)
    {
        return obj.options[obj.selectedIndex];
    }

}

/*********************************************************************************************************************************************************/

function getFornecedores(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getFornecedores';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum fornecedor', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idFornecedor', 'fornecedor');
        };

        Select.AddItem(cmb, 'Carregando os fornecedores...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum fornecedor', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idFornecedor', 'fornecedor');
    }
}

function mostracaixaconfiguracoes() {

    var div;
    if (!isElement('div', 'divConfiguacoes')) {
        div = DOM.newElement('div', 'divConfiguacoes');
        div.setAttribute("class", "divConfiguacoes efeito_delay");
        document.body.appendChild(div);
    } else {
        div = Selector.$('divConfiguacoes');
    }

    Selector.$('divConfiguacoes').setAttribute("class", "divConfiguacoes efeito_delay");

    if (Selector.$('divConfiguacoes').style.height == "100px") {
        Selector.$('divConfiguacoes').style.height = "0px";
    } else {
        Selector.$('divConfiguacoes').style.height = "100px";
    }
}

function suporteTecnico() {

    var div;
    if (!isElement('div', 'promptSuporte')) {
        div = DOM.newElement('div', 'promptSuporte');
        document.body.appendChild(div);
    } else {
        div = Selector.$('promptSuporte');
    }

    div.innerHTML = "<img src='imagens/crio.png'/><br><h2>Nosso horário de antendimento é:<br />" +
            "<strong>Segunda</strong> à <strong>Sexta-feira</strong> das <strong>8h</strong> às <strong>18h</strong><br /></h2>" +
            "<h2><strong>Vendas e Suporte Técnico</strong></h2>" +
            "<h2><strong>Software </strong>Segunda à Sexta-feira das 8h às 18h<br />" +
            "<strong>Sites </strong> Segunda a Sexta-feira das 8h as 18h<br />" +
            "<strong>Hardware </strong> Segunda à Sexta-feira das 8h às 18h</h2><h2><strong>Telefone</strong> 11 4509-1880<br><strong>Email</strong> contato@criodigital.com.br</h2>" +
            "<h2><strong>acesse nosso site </strong> <a href='http://www.criodigital.com.br' target='_Black' style='color:#2907BF'> www.criodigital.com.br</a> </h2>";

    dialogo = new caixaDialogo('promptSuporte', 320, 600, 'padrao/', 111);
    dialogo.Show();
}

function getFuncionarios(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getFuncionarios';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum funcionário', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idFuncionario', 'funcionario');
        };

        Select.AddItem(cmb, 'Carregando os funcionários...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum funcionário', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idFuncionario', 'funcionario');
    }
}

function getFormasPagamentos(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

function getContasBancarias(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getContasBancarias';

    Select.Clear(cmb);

    if (assincrono) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrada nenhuma conta bancária', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idConta', 'conta');
        };

        Select.AddItem(cmb, 'Carregando as contas bancárias...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrada nenhuma conta bancária', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idConta', 'conta');
    }
}

function MostrarMsg(msg, campo) {
    var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", msg, "OK", "", false, campo);
    mensagem.Show();
}

function LoadTipo(origem, assincrono, nomeCampo, texto) {

    switch (origem) {

        case '1':
            getArtistas(Selector.$(nomeCampo), texto, assincrono);
            break;

        case '2':
            getFornecedores(Selector.$(nomeCampo), texto, assincrono);
            break;

        case '3':
            getFuncionarios(Selector.$(nomeCampo), texto, assincrono);
            break;

        case '4':
            getMarchands(Selector.$(nomeCampo), texto, assincrono);
            break;

        case '5':
            getArquitetos(Selector.$(nomeCampo), texto, assincrono);
            break;
    }
}

function setDataDeAte(de, ate) {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    ajax.Request('action=getDeAte');

    var json = JSON.parse(ajax.getResponseText());
    de.value = json.de;
    ate.value = json.ate;
}

function setDataSemanaDeAte(de, ate) {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    ajax.Request('action=getSemanaDeAte');

    var json = JSON.parse(ajax.getResponseText());
    de.value = json.de;
    ate.value = json.ate;
}

function getTamanhos(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

function getArtistas(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

function getProdutos(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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
            var json = JSON.parse(ajax.getResponseText()  );
            var texto1 = '';

            for (var i = 0; i < json.length; i++) {

                texto1 += '<option value=' + json[i].codigo + ' id="' + json[i].imagem + '">' + json[i].nome + '</option>';
            }

            cmb.innerHTML += texto1;
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
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
        var json = JSON.parse(ajax.getResponseText() );
        var texto1 = '';

        for (var i = 0; i < json.length; i++) {

            texto1 += '<option value=' + json[i].codigo + ' id="' + json[i].imagem + '">' + json[i].nome + '</option>';
        }

        cmb.innerHTML += texto1;
        //Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function getGruposMolduras(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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
            var json = JSON.parse(ajax.getResponseText()  );
            var texto1 = '';

            for (var i = 0; i < json.length; i++) {

                texto1 += '<option value=' + json[i].codigo + ' id="' + json[i].imagem + '">' + json[i].nome + '</option>';
            }

            cmb.innerHTML += texto1;
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
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
        var json = JSON.parse(ajax.getResponseText() );
        var texto1 = '';

        for (var i = 0; i < json.length; i++) {

            texto1 += '<option value=' + json[i].codigo + ' id="' + json[i].imagem + '">' + json[i].nome + '</option>';
        }

        cmb.innerHTML += texto1;
        //Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}

function getAcabamentos(cmb, texto, assincrono, tipo) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

            //Select.AddItem(cmb, texto, 0);
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');

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

        //Select.AddItem(cmb, texto, 0);
        //Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        var json = JSON.parse(ajax.getResponseText() );
        Select.AddItem(cmb, texto, 0);
        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += "<option value='" + json[i].codigo + "' id=" + json[i].bloquearVendaUltrapassou1M + ">" + json[i].nome + "</option>";
        }
    }
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
    rdCpf.setAttribute('onclick', 'SelecionaTipoFisicaJuridia()');
    divPesquisa_cliente.appendChild(rdCpf);

    var lblCpf = DOM.newElement('label');
    lblCpf.setAttribute('style', 'cursor:pointer;');
    lblCpf.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCpf.setAttribute('for', 'cliente_cpf');
    lblCpf.innerHTML = 'CPF';
    lblCpf.setAttribute('onclick', 'SelecionaTipoFisicaJuridia()');
    divPesquisa_cliente.appendChild(lblCpf);

    var rdCnpj = DOM.newElement('radio', 'cliente_cnpj');
    rdCnpj.setAttribute('id', 'cliente_cnpj');
    rdCnpj.setAttribute('style', 'margin-left: 10px; cursor:pointer;');
    rdCnpj.setAttribute('name', 'cliente_tipo');
    rdCnpj.setAttribute('onclick', 'SelecionaTipoFisicaJuridia()');
    divPesquisa_cliente.appendChild(rdCnpj);

    var lblCnpj = DOM.newElement('label');
    lblCnpj.setAttribute('style', 'cursor:pointer;');
    lblCnpj.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblCnpj.setAttribute('for', 'cliente_cnpj');
    lblCnpj.innerHTML = 'CNPJ';
    lblCnpj.setAttribute('onclick', 'SelecionaTipoFisicaJuridia()');
    divPesquisa_cliente.appendChild(lblCnpj);

    var lblTelefone = DOM.newElement('label');
    lblTelefone.setAttribute('style', 'margin-left: 93px;');
    lblTelefone.setAttribute('class', 'fonte_Roboto_texto_normal');
    lblTelefone.innerHTML = 'Telefone';
    divPesquisa_cliente.appendChild(lblTelefone);

    var lblCelular = DOM.newElement('label');
    lblCelular.setAttribute('style', 'margin-left: 95px;');
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

    dialogoPesquisaClientes = new caixaDialogo('divPesquisa_cliente', 500, 650, 'padrao/', 130);
    dialogoPesquisaClientes.Show();

    Mask.setTelefone(Selector.$('cliente_in_telefone'));
    Mask.setCelular(Selector.$('cliente_in_celular'));
    Selector.$('cliente_cpf').checked = true;
    Selector.$('cliente_ativo').checked = true;
    SelecionaTipoFisicaJuridia();

    gridClientes = new Table('gridClientes');
    gridClientes.table.setAttribute('cellpadding', '2');
    gridClientes.table.setAttribute('cellspacing', '3');
    gridClientes.table.setAttribute('class', 'tabela_cinza_foco');

    gridClientes.addHeader([
        DOM.newText('Nome / Razão'),
        DOM.newText('Apelido / Fantasia'),
        DOM.newText('CPF / CNPJ'),
        DOM.newText('Telefone'),
        DOM.newText('Celular')
    ]);

    Selector.$('tbPesquisa').appendChild(gridClientes.table);
}

function MostraResultadoClientes() {

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = "action=MostraResultadoClientes";
    p += "&nome=" + Selector.$('cliente_nome').value;
    p += '&ativo=' + Selector.$('cliente_ativo').checked;
    p += "&tipoPessoa=" + (Selector.$('cliente_cpf').checked ? "F" : "J");
    p += "&cpfCnpj=" + Selector.$('cliente_in_tipo').value;
    p += "&telefone=" + Selector.$('cliente_in_telefone').value;
    p += "&celular=" + Selector.$('cliente_in_celular').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        gridClientes.clearRows();

        if (ajax.getResponseText() === '0') {
            return;
        }

        var json = JSON.parse(ajax.getResponseText()  );

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
        }
    };

    ajax.Request(p);
}

function MostraResultadoPesquisaClientes(codigo) {

    dialogoPesquisaClientes.Close();
    Select.Show(Selector.$('cliente'), codigo);
    //Selector.$('cliente').onclick();

    LoadDadosCliente();
    getEnderecosColecionador(Selector.$('enderecos'), 'Selecione um endereço', false);
    if (Selector.$('enderecos').length == 2) {
        Selector.$('tipoTransporte').focus();
    }
}

function PromptCadastrarClienteRapido() {

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
            '<input type="text" style="max-width:200px" id="cpf" class="textbox_cinzafoco" onblur="VerificarCpfCnpjIgual(codigoAtual, ' + "'clientes'" + ', ' + "'cpfCnpj'" + ', ' + "'idCliente'" + ');"/></div>' +
            '<div class="divcontainer" style="max-width: 150px; margin-left:10px;">' +
            '<label  id="rotulorg">RG</label>' +
            '<input type="text" style="max-width:150px" id="rg" class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style="max-width: 120px; margin-left:10px;">' +
            '<label id="rotulodatanasc">Data de Nascimento</label>' +
            '<input type="text" style="width:100%" id="dataNasc" class="textbox_cinzafoco" />' +
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
            '<div class="divcontainer" style="max-width: 300px;"><label  id="rotulonome">Nome</label> <label style="color:red;">*</label>' +
            '<input onblur="VerificarNomeIgual(codigoAtual, ' + "'clientes'" + ', ' + "'cliente'" + ', ' + "'idCliente'" + ');" placeHolder="Ex.: João da Silva" type="text" id="nome" style="width:100%"  class="textbox_cinzafoco" /></div>' +
            '<div class="divcontainer" style="max-width: 225px; margin-left:10px;">' +
            '<label  id="rotuloapelido">Apelido</label><label style="color:red;"></label>' +
            '<input placeHolder="Ex.: João" type="text" id="apelido" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div>' +
            '<div class="divcontainer" style="max-width:120px; margin-left:10px;">' +
            '<label>Data Cadastro</label> <label style="color:red;">*</label>' +
            '<input type="text"  id="cadastro" style="width:100%"  class="textbox_cinzafoco" />' +
            '</div><div class="divcontainer" style="max-width:100px; margin-left:10px;">' +
                            '<input id="arquiteto" type="checkbox" onclick="p_arquiteto_click()"> ' +
                            '<label for="arquiteto">Arquiteto</label>' + 
                            '<input disabled="disabled" placeholder="Ex.: 15,00" id="arquitetoComissao" type="text" class="textbox_cinzafoco" style="width: 80%; text-align: right;" maxlength="15">' +
                            '<label>%</label>' +
                        '</div>' + 
            '<br />' +
            //'<div class="divcontainer" style="max-width: 98px;">' +
            //'<label>CEP <span id="lblcep"></span></label>' +
            //'<input placeHolder="Ex.: 01010-000" id="cep" type="text" style="width:100%"  class="textbox_cinzafoco" onblur="BuscarCEP();" />' +
            //'</div>' +
            //'<div class="divcontainer" style="max-width: 300px; margin-left:10px;">' +
            //'<label>Endereço </label>' +
            //'<input id="endereco" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            //'</div>' +
            //'<div class="divcontainer" style="max-width: 100px; margin-left:10px;">' +
            //'<label>Número </label>' +
            //'<input id="numero" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            //'</div>' +
            //'<div class="divcontainer" style="max-width: 260px; margin-left:10px;">' +
            //'<label>Complemento </label>' +
            //'<input id="complemento" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            //'</div>' +
            //'<br />' +
            //'<div class="divcontainer" style="max-width: 335px;">' +
            //'<label>Bairro </label>' +
            //'<input id="bairro" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            //'</div>' +
            //'<div class="divcontainer" style="max-width: 335px; margin-left:10px;">' +
            //'<label>Cidade </label>' +
            //'<input id="cidade" type="text" style="width:100%"  class="textbox_cinzafoco" />' +
            //'</div>' +
            //'<div class="divcontainer" style="max-width: 90px; margin-left:10px;">' +
            //'<label>Estado </label>' +
            //'<input value="SP" id="estado" type="text" style="width:100%"  maxlength="2" class="textbox_cinzafoco" />' +
            //'</div><br />' +
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
    gravar.setAttribute('onclick', 'GravarClienteRapido();');

    var fechar = DOM.newElement('button');
    fechar.setAttribute('id', 'fechar');
    fechar.setAttribute('class', 'botaosimplesfoco');
    fechar.setAttribute("style", 'float:right; margin-left:5px; display:inline-block;');
    fechar.innerHTML = 'Fechar';
    fechar.setAttribute('onclick', 'dialogoCadastroClienteRapido.Close();');

    divBotoes.appendChild(fechar);
    divBotoes.appendChild(gravar);
    div.appendChild(divBotoes);

    dialogoCadastroClienteRapido = new caixaDialogo('PromptClientes', 415, 870, 'padrao/', 150);
    dialogoCadastroClienteRapido.Show();
    dialogoCadastroClienteRapido.HideCloseIcon();

    Selector.$('fisica').checked = true;
    Mask.setCPF(Selector.$('cpf'));
    Mask.setOnlyNumbers(Selector.$('rg'));
    Mask.setCelular(Selector.$('celular'));
    Mask.setTelefone(Selector.$('telefone2'));
    Mask.setMoeda(Selector.$("arquitetoComissao"));
    //Mask.setCEP(Selector.$('cep'));
    //Mask.setOnlyNumbers(Selector.$('numero'));
    Mask.setData(Selector.$('dataNasc'));
    Selector.$('cadastro').value = Date.GetDate(false);
}

function p_arquiteto_click(){
    if(Selector.$('arquiteto').checked){ 
        Selector.$('arquitetoComissao').disabled=false;
        Selector.$('arquitetoComissao').focus();
    } 
    else{
        Selector.$('arquitetoComissao').disabled='disabled';
    }
}

function SomarMes(data, meses) {

    data = data.split('/');
    if (data[1].substr(0, 1) === '0') {
        data[1] = data[1].replace('0', '');
    }

    dia = parseInt(data[0]);
    mes = parseInt(data[1]);
    ano = parseInt(data[2]);
    mes = mes + meses;
    while (mes > 12) {
        mes = mes - 12;
        ano++;
    }

    if (mes.toString().length === 1) {
        mes = "0" + mes.toString();
    }

    if (dia.toString().length === 1) {
        dia = "0" + dia.toString();
    }

    while (VerificaData(dia.toString() + "/" + mes.toString() + "/" + ano) === false) {
        dia--;
    }

    return dia + "/" + mes + "/" + ano;
}

function VerificaData(digData) {
    var bissexto = 0;
    var data = digData;
    var tam = data.length;
    if (tam === 10)
    {
        var dia = data.substr(0, 2);
        var mes = data.substr(3, 2);
        var ano = data.substr(6, 4);
        if ((ano > 1900) || (ano < 2100))
        {
            switch (mes)
            {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    if (dia <= 31)
                    {
                        return true;
                    }
                    break

                case '04':
                case '06':
                case '09':
                case '11':
                    if (dia <= 30)
                    {
                        return true;
                    }
                    break
                case '02':
                    /* Validando ano Bissexto / fevereiro / dia */
                    if ((ano % 4 == 0) || (ano % 100 == 0) || (ano % 400 == 0))
                    {
                        bissexto = 1;
                    }
                    if ((bissexto == 1) && (dia <= 29))
                    {
                        return true;
                    }
                    if ((bissexto != 1) && (dia <= 28))
                    {
                        return true;
                    }
                    break
            }
        }
    }

    return false;
}

function GravarClienteRapido() {

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
    
    if(cpf != ''){
        var mensagem = new DialogoMensagens("prompt1", 150, 420, 150, "2", "Atenção!", "Já existe um colecionador com este CPF/CNPJ: " + cpf + ". Favor verificar.", "OK", "", false, "cpf");
        mensagem.Show();
        return false;
    }
    
    if(nomeColec != ''){
        if(!confirm("Já existe um colecionador com este nome. Deseja continuar?")){        
            return false;
        }
    }

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=GravarClienteRapido';
    p += '&codigo=' + codigoAtual;
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
    //p += '&cep=' + Selector.$('cep').value;
    //p += '&endereco=' + Selector.$('endereco').value;
    //p += '&numero=' + Selector.$('numero').value;
    //p += '&complemento=' + Selector.$('complemento').value;
    //p += '&bairro=' + Selector.$('bairro').value;
    //p += '&cidade=' + Selector.$('cidade').value;
    //p += '&estado=' + Selector.$('estado').value;
    p += '&responsavel=' + Selector.$('responsavel').value;
    p += '&telefone=' + Selector.$('telefone2').value;
    p += '&celular=' + Selector.$('celular').value;
    p += '&email=' + Selector.$('email2').value;
    p += '&site=' + Selector.$('site').value;
    p += '&obs=' + Selector.$('obs').value;
    
    if (Selector.$('arquiteto').checked) {
        p += '&arquiteto=1';        
        p += '&arquitetoComissao=' + Selector.$('arquitetoComissao').value;
    } else {
        p += '&arquiteto=0';        
        p += '&arquitetoComissao=0';
    }
    ajax.Request(p);

    if (parseInt(ajax.getResponseText()) === 0) {
        MostrarMsg("Erro ao gravar o colecionador. Se o erro persistir contate o suporte técnico", '');
        return;
    } else {

        getClientesPremium(Selector.$('cliente'), "Selecione um cliente", false);
        Selector.$('cliente').value = ajax.getResponseText();
        dialogoCadastroClienteRapido.Close();
        LoadDadosCliente();
        PromptColecionadorEndereco('-2');
    }
}

function ajustaWidgetsPrincipal() {

    if (isElement('div', 'linha2quadro1')) {
        var tamanhoMaximo = 0;
        var tamanhoMaximo4 = 0;
        var tamanhoMaximo5 = 0;
        for (var i = 1; i <= 6; i++) {
            if (i <= 4) {
                Selector.$('linha2quadro' + i).style.height = "auto";
                Selector.$('linha4quadro' + i).style.height = "auto";
            }
            Selector.$('linha5quadro' + i).style.height = "146";
        }
        for (var i = 1; i <= 6; i++) {

            if (i <= 4) {
                if (Selector.$('linha2quadro' + i).clientHeight > tamanhoMaximo)
                    tamanhoMaximo = Selector.$('linha2quadro' + i).clientHeight;

                if (Selector.$('linha4quadro' + i).clientHeight > tamanhoMaximo4)
                    tamanhoMaximo4 = Selector.$('linha4quadro' + i).clientHeight;
            }

            if (Selector.$('linha5quadro' + i).clientHeight > tamanhoMaximo5)
                tamanhoMaximo5 = Selector.$('linha5quadro' + i).clientHeight;


        }

        for (var i = 1; i <= 6; i++) {
            if (i <= 4) {
                Selector.$('linha2quadro' + i).style.height = tamanhoMaximo + "px";
                Selector.$('linha4quadro' + i).style.height = tamanhoMaximo4 + "px";
            }
            Selector.$('linha5quadro' + i).style.height = tamanhoMaximo5 + "px";
        }
    }

}

function pintaLinhaGrid(grid) {

    var cor = false;

    for (var i = 0; i <= grid.getRowCount() - 1; i++) {
        cor = !cor;
        grid.getRow(i).setAttribute('class', 'pintaFundo' + (cor ? 1 : 2));
    }

}

function getStatusOrcamento(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

function getStatusPedido(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getStatusPedido2';

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
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVStatus', 'status');
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
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idVStatus', 'status');
    }
}

function CheckPermissao(chave, mensagem, texto, redirecionar) {

    /*var ajax = new Ajax('POST', 'php/photoarts.php', false);
     var p = 'action=checkPermissoes&codigo=' + codigo;
     ajax.Request(p);
     
     if (ajax.getResponseText() == "0") {
     
     if (aviso)
     alert("Você não tem permissão para acessar essa área!");
     
     window.location = "principal.html";
     }*/
    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    ajax.Request('action=CheckPermissao&chave=' + chave);

    if (parseInt(ajax.getResponseText()) == 0) {

        if (mensagem) {
            if (texto == "" || texto == null)
                alert("Você não possui permissão para acessar esta área.");
            else
                alert(texto);
        }

        if (redirecionar)
            window.location = 'principal.html';

        return false;
    } else {
        return true;
    }
}

function getComissaoMarchand() {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
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

function getLojas(cmb, texto, assincrono) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getLojas';

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
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idLoja', 'loja');
            var json = JSON.parse(ajax.getResponseText() );

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
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idLoja', 'loja');
        var json = JSON.parse(ajax.getResponseText() );
        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += '<option value=' + json[i].idLoja + ' id="06710660">' + json[i].loja + '</option>';
        }       
    }

}

function getComboMateriais(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getComboMateriais';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhum material", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "codigo", "nome");
        };

        Select.AddItem(cmb, "Carregando os materiais...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhum material", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "codigo", "nome");
    }
}

function getComboProdutos(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getComboProdutos';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhum produto", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "codigo", "nome");
        };

        Select.AddItem(cmb, "Carregando os bancos...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhum produto", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "codigo", "nome");
    }
}

function getNumerosOrdensCompras(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getNumerosOrdensCompras';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhuma ordem de compra", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idOrdemCompra", "numero");
        };

        Select.AddItem(cmb, "Carregando as ordens de compras...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhuma ordem de compra", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idOrdemCompra", "numero");
    }
}

function getNumerosOrdensProducao(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
    var p = 'action=getNumerosOrdensProducao';

    if (assincrono) {

        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == '0') {
                Select.Clear(cmb);
                Select.AddItem(cmb, "Não foi encontrado nenhuma ordem de produção", 0);
                return;
            }

            Select.Clear(cmb);

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), "idOrdemProducao", "numero");
        };

        Select.AddItem(cmb, "Carregando as ordens de produção...", 0);
        ajax.Request(p);
    } else {

        ajax.Request(p);

        if (ajax.getResponseText() == '0') {
            Select.Clear(cmb);
            Select.AddItem(cmb, "Não foi encontrado nenhuma ordem de produção", 0);
            return;
        }

        Select.Clear(cmb);

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), "idOrdemProducao", "numero");
    }
}

function getEtapasOrdensProducao(cmb, texto, assincrono) {

    Select.Clear(cmb);

    var ajax = new Ajax('POST', 'php/photoarts.php', assincrono);
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

function getImagemProduto() {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=getImagemProduto';
    p += '&idProduto=' + Selector.$('o_produtoProd').value;
    ajax.Request(p);
    
    if (ajax.getResponseText() === '       ') {

        Selector.$('o_imagem').src = 'imagens/semarte.png';
        Selector.$('lblIncluirImagem').style.display = 'block';
    } else {

        Selector.$('o_imagem').src = 'imagens/produtos/' + ajax.getResponseText();
        Selector.$('o_imagem').setAttribute('name', ajax.getResponseText());
        Selector.$('o_imagem').setAttribute('style', 'width:auto; max-width: 170px; height:auto; max-height:100px');
        Selector.$('lblIncluirImagem').style.display = 'none';
    }
}

function getUnidadesMedidas(cmb, texto, ascinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
    var p = 'action=getUnidadesMedidas';

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '-1') {
                Select.AddItem(cmb, 'Não foi encontrado nenhuma unidade', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
        };

        Select.AddItem(cmb, 'Carregando os estilos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '-1') {
            Select.AddItem(cmb, 'Não foi encontrado nenhuma unidade', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'codigo', 'nome');
    }
}


//function MostraImagemTamanhoReal(src, altura, largura, funcaobotao) {
function MostraImagemTamanhoReal2(src) {

    if (src == "nenhuma")
        return;

    var altura = window.innerHeight - 130;
    var largura = window.innerWidth - 135;//document.body.offsetWidth - 350;

    var aux = (src.indexOf('mini_') >= 0 ? src.replace('mini_', '') : src);

    var funcaobotao = "BaixarImagemReal('" + aux + "')";

    var div = criaDiv('promptfoto');
    div.innerHTML = "";
    dialogoFotoAvulsa = new caixaDialogoResponsiva('promptfoto', altura + 30 + (funcaobotao == "" ? 0 : 40), largura, '../padrao/', 100);
    dialogoFotoAvulsa.Show();
    promptfotoimg = new Image();
    promptfotoimg.setAttribute('id', 'promptfotoidImg');
    promptfotoimg.src = aux;
    promptfotoimg.style.display = "none";

     var divcontainerimgtemp = DOM.newElement("div");
     divcontainerimgtemp.setAttribute('style','text-align:center;width:100%');
    Selector.$('promptfoto').appendChild(divcontainerimgtemp);
     divcontainerimgtemp.appendChild(promptfotoimg);

    if (funcaobotao !== "") {
        var botao = DOM.newElement('submit');
        botao.setAttribute('class', 'botaoazulsuave_prompt');
        botao.setAttribute('style', 'float:right');
        botao.setAttribute('onclick', funcaobotao);
        botao.value = "Baixar";
        Selector.$('promptfoto').appendChild(botao);
    }
    setTimeout("visualizaImagemAux(" + altura + "," + largura + ")", 500);
}

function visualizaImagemAux(altura, largura) {
    if (Selector.$('promptfotoidImg').complete) {
        promptfotoimg.style.display = "";
        if (Selector.$('promptfotoidImg').clientHeight > Selector.$('promptfotoidImg').clientWidth){
            alert("Aqqq");
            Selector.$('promptfotoidImg').setAttribute('style', 'height:' + (altura - 40) + 'px; width:100%');}
        else{
                
            (Selector.$('promptfotoidImg').clientHeight + " > " + altura);
            if(Selector.$('promptfotoidImg').clientHeight > altura){
                
                Selector.$('promptfotoidImg').setAttribute('style', 'height:' + altura + 'px; width:auto');
            }else{
            
                Selector.$('promptfotoidImg').setAttribute('style', 'height:auto; width:' + (largura - 40) + 'px');
                 if(Selector.$('promptfotoidImg').clientHeight > altura){
                    Selector.$('promptfotoidImg').setAttribute('style', 'height:auto; width: auto');
                  //  dialogoFotoAvulsa.Realinhar(Selector.$('promptfotoidImg').clientHeight , Selector.$('promptfotoidImg').clientWidth);
                 }
            }
        }

    } else
        setTimeout("visualizaImagemAux(" + altura + "," + largura + ")", 500);
}

function MostraImagemTamanhoReal(src) {

    if (src == "nenhuma")
        return;

    if (!isElement('div', 'divImagemReal')) {
        
        var div = DOM.newElement('div', 'divImagemReal');
        div.setAttribute("style", "width:100px; height:100px;");
        document.body.appendChild(div);
    }

    var divImagem = Selector.$('divImagemReal');
    divImagem.innerHTML = '';

    var aux = (src.indexOf('mini_') >= 0 ? src.replace('mini_', '') : src);

    //IMAGEM
    var img = DOM.newElement('div', 'imagemReal');
    //img.setAttribute('src', aux);
    //img.setAttribute('style', 'max-width:100%; max-height:100%; ');
    img.setAttribute('style', 'display:inline-block; background-image: url("' + aux + '"); padding-bottom:5px; margin-bottom:5px; width:500px; height:500px; position:relative; background-repeat:no-repeat; background-size:500px 500px; background-position:center center;');
    //img.setAttribute('src','imagens/obras/aguas_no_pantanal_ag3_1995_2.jpg');
    divImagem.appendChild(img);

    divImagem.innerHTML += "<br/><br/>";

    //CANCELAR
    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');

    var elemento = DOM.newElement('button', 'botCancelarImagemReal');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'cursor:pointer; vertical-align:middle');
    elemento.setAttribute('onclick', 'dialogoImagemTamanhoReal.Close();');
    elemento.innerHTML = 'Cancelar';
    divImagem.appendChild(elemento);

    divImagem.appendChild(divElem);

    //BOTÃO SALVAR
    var elemento = DOM.newElement('button', 'botIncluirImagemReal');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', "BaixarImagemReal('" + aux + "');");
    elemento.innerHTML = "Baixar";

    divImagem.appendChild(elemento);

    var elemento = DOM.newElement('button');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', "window.open('" + aux + "');");
    elemento.innerHTML = "Ver original";

    divImagem.appendChild(elemento);

    dialogoImagemTamanhoReal = new caixaDialogo('divImagemReal', 550, 517, '../padrao/', 140);
    dialogoImagemTamanhoReal.Show();

    dialogoImagemTamanhoReal.HideCloseIcon();

    Selector.$('imagemReal').style.backgroundSize = "475px 450px";
    Selector.$('imagemReal').style.width = 475 + "px";
    Selector.$('imagemReal').style.height = 450 + "px";

    //Selector.$('divImagemReal').style.width = Selector.$('imagemReal').clientWidth + 10 + "px";
    //Selector.$('divImagemReal').style.height = Selector.$('imagemReal').clientHeight + Selector.$('botIncluirImagemReal').clientHeight + 50 + "px";
    
    /*Selector.$('divImagemReal').style.textAlign = 'center';
    Selector.$('divImagemReal').style.marginLeft = (((Selector.$('imagemReal').clientWidth + 10) / 2) * -1) + 'px'; 
    Selector.$('divImagemReal').style.marginRight = (((Selector.$('imagemReal').clientHeight + Selector.$('botIncluirImagemReal').clientHeight + 50) / 2) * -1) + 'px';
    Selector.$('divImagemReal').style.width = Selector.$('imagemReal').clientWidth + 10 + "px";
    Selector.$('divImagemReal').style.height = Selector.$('imagemReal').clientHeight + Selector.$('botIncluirImagemReal').clientHeight + 50 + "px";*/
}

function BaixarImagemReal(src) {

    window.location = "./php/baixar.php?arquivo=../" + src;
}

function abrecaixaemail() {

    LoadAvisos(true);
}

function LoadAvisos(fechar) {

    if (!isElement('div', 'divEmailSuspenso')) {

        var divEmailSuspenso = DOM.newElement('div', 'divEmailSuspenso');
        divEmailSuspenso.setAttribute("class", "divEmailSuspenso efeito_delay");
        divEmailSuspenso.setAttribute("style", "display:none");
        document.body.appendChild(divEmailSuspenso);

        var combo = DOM.newElement('select', 'cmb_aviso');
        combo.setAttribute("class", "combo_cinzafoco");
        combo.setAttribute("style", "width:100%;");
        combo.setAttribute("onchange", "LoadAvisos(false)");

        getPeriodoAvisos(combo, 'Selecione um período', false);
        Selector.$('divEmailSuspenso').appendChild(combo);

        var tabelaAviso = DOM.newElement('div', 'tabelaAviso2');
        Selector.$('divEmailSuspenso').appendChild(tabelaAviso);

    } else {

        if (fechar) {
            if (Selector.$('divEmailSuspenso').style.display == "none") {
                Selector.$('divEmailSuspenso').style.display = "block";
            } else {
                Selector.$('divEmailSuspenso').style.display = "none";
                return;
            }
        }
    }

    var div = Selector.$('tabelaAviso2');
    var cmb = Selector.$('cmb_aviso');

    if (cmb.selectedIndex <= 0) {
        div.innerHTML = '<div id="alertaAvisosWidget">Selecione um período para carregar as informações</div>';
        return;
    }

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = 'action=LoadAvisos';
    p += '&idPeriodo=' + cmb.value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            div.innerHTML = '<div id="alertaAvisosWidget">Nenhum aviso para o período!</div>';
            return;
        }

        try {

            var jsonA = JSON.parse(ajax.getResponseText()  );
            div.setAttribute('align', 'left');
            div.setAttribute('style', 'padding:0px; overflow:auto; max-height:80%;');

            div.innerHTML = '';

            gridAv = new Table('gridAv');
            gridAv.table.setAttribute('class', 'tabela_jujuba_comum_branca');
            gridAv.table.setAttribute('style', 'margin-top:5px;');
            gridAv.table.setAttribute('cellpadding', '5');

            gridAv.addHeader([
                DOM.newText('Data'),
                DOM.newText('Aviso'),
                DOM.newText('OK?'),
                DOM.newText('Ver')
            ]);

            div.appendChild(gridAv.table);

            var ok = null;
            var totalok = 0;

            for (var i = 0; i < jsonA.length; i++) {

                if (jsonA[i].ok == 0) {
                    totalok++;
                }

                if (jsonA[i].link !== "") {

                    var ver = DOM.newElement('img');
                    ver.setAttribute('src', 'imagens/pesquisar.png');
                    ver.setAttribute('class', 'efeito-opacidade-75-03');
                    ver.setAttribute('onclick', 'window.location="' + jsonA[i].link + '"');
                } else {

                    var ver = DOM.newElement('label');
                }

                ok = DOM.newElement('img');
                (jsonA[i].ok == '1' ? ok.setAttribute('src', 'imagens/mensagemaberta.png') : ok.setAttribute('src', 'imagens/mensagem.png'));
                (jsonA[i].ok == '1' ? ok.setAttribute('title', 'Desmarcar aviso') : ok.setAttribute('title', 'Marcar aviso'));
                ok.setAttribute('onclick', 'MarcarAviso(' + i + ' , ' + jsonA[i].ok + ')');

                jsonA[i].dataAviso = jsonA[i].dataAviso.toString().substring(0, 5);

                var DataDeAviso = DOM.newElement('div');
                DataDeAviso.innerHTML = jsonA[i].dataAviso + '<br />';
                DataDeAviso.innerHTML += jsonA[i].horaAviso;

                gridAv.addRow([
                    DataDeAviso,
                    DOM.newText(jsonA[i].aviso),
                    ok,
                    ver
                ]);

                gridAv.setRowData(gridAv.getRowCount() - 1, jsonA[i].codigo);
                gridAv.getCell(gridAv.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:120px');
                gridAv.getCell(gridAv.getRowCount() - 1, 1).setAttribute('style', 'border:none; width:100%;  text-align:left;"');
                gridAv.getCell(gridAv.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:center; width:30px');
                gridAv.getCell(gridAv.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center; width:30px');

                if (jsonA[i].ok == 1) {
                    gridAv.getCell(gridAv.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-decoration:line-through; color:#9B9B9B');
                    gridAv.getCell(gridAv.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; text-decoration:line-through; color:#9B9B9B');
                }

                gridAv.getCell(gridAv.getRowCount() - 1, 0).setAttribute('onclick', 'PromptAviso(' + i + ');');
                gridAv.getCell(gridAv.getRowCount() - 1, 1).setAttribute('onclick', 'PromptAviso(' + i + ');');
            }

            if (!isElement('div', 'cabecalho_botao_menu_topo_email_divTotal')) {
                var cabecalho_botao_menu_topo_email_divTotal = DOM.newElement('div', 'cabecalho_botao_menu_topo_email_divTotal');
                Selector.$('cabecalho_botoes_principal').childNodes[5].appendChild(cabecalho_botao_menu_topo_email_divTotal);
            }

            if (totalok > 0) {
                Selector.$('cabecalho_botao_menu_topo_email_divTotal').style.display = "inline-block";
                Selector.$('cabecalho_botao_menu_topo_email_divTotal').innerHTML = totalok;
            } else {
                Selector.$('cabecalho_botao_menu_topo_email_divTotal').style.display = "none";
            }

        } catch (e) {
            div.innerHTML = '<div id="alertaAvisosWidget">Erro ao carregar as informações</div>';
        }
    };

    div.innerHTML = '<div id="alertaAvisosWidget">Aguarde, carregando informações</div>';
    ajax.Request(p);
}

function abrecaixaaniversariantes() {

    LoadAniversariantes(true);
}

function LoadAniversariantes(fechar) {

    if (!isElement('div', 'divAniversariantesSuspenso')) {

        var divAniversariantesSuspenso = DOM.newElement('div', 'divAniversariantesSuspenso');
        divAniversariantesSuspenso.setAttribute("class", "divEmailSuspenso efeito_delay");
        divAniversariantesSuspenso.setAttribute("style", "display:none");
        document.body.appendChild(divAniversariantesSuspenso);

        var tabelaAniversariantes = DOM.newElement('div', 'tabelaAniversariantes');
        Selector.$('divAniversariantesSuspenso').appendChild(tabelaAniversariantes);

    } else {

        if (fechar) {
            if (Selector.$('divAniversariantesSuspenso').style.display == "none") {
                Selector.$('divAniversariantesSuspenso').style.display = "block";
            } else {
                Selector.$('divAniversariantesSuspenso').style.display = "none";
                return;
            }
        }
    }

    var div = Selector.$('tabelaAniversariantes');

    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = 'action=LoadAniversariantes';

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '0') {
            div.innerHTML = '<div id="alertaAvisosWidget">Nenhum aniversariante na semana</div>';
            return;
        }

        try {

            var jsonA = JSON.parse(ajax.getResponseText()  );
            div.setAttribute('align', 'left');
            div.setAttribute('style', 'padding:0px; overflow:auto; max-height:80%;');

            div.innerHTML = '';

            gridAniver = new Table('gridAniver');
            gridAniver.table.setAttribute('class', 'tabela_jujuba_comum_branca');
            gridAniver.table.setAttribute('style', 'margin-top:5px;');
            gridAniver.table.setAttribute('cellpadding', '5');

            gridAniver.addHeader([
                DOM.newText('Nome'),
                DOM.newText('Ver')
            ]);

            div.appendChild(gridAniver.table);

            for (var i = 0; i < jsonA.length; i++) {

                var ver = DOM.newElement('img');
                ver.setAttribute('src', 'imagens/pesquisar.png');
                ver.setAttribute('class', 'efeito-opacidade-75-03');
                ver.setAttribute('onclick', 'window.location="relatorio-de-aniversariantes.html"');

                gridAniver.addRow([
                    DOM.newText(jsonA[i].nome),
                    ver
                ]);

                gridAniver.getCell(gridAniver.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:left');
                gridAniver.getCell(gridAniver.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:center; width:30px');
            }

            if (!isElement('div', 'cabecalho_botao_menu_topo_email_divTotalAniver')) {
                var cabecalho_botao_menu_topo_email_divTotalAniver = DOM.newElement('div', 'cabecalho_botao_menu_topo_email_divTotalAniver');
                Selector.$('cabecalho_botoes_principal').childNodes[7].appendChild(cabecalho_botao_menu_topo_email_divTotalAniver);
            }

            if (jsonA.length > 0) {
                Selector.$('cabecalho_botao_menu_topo_email_divTotalAniver').style.display = "inline-block";
                Selector.$('cabecalho_botao_menu_topo_email_divTotalAniver').innerHTML = jsonA.length;
            } else {
                Selector.$('cabecalho_botao_menu_topo_email_divTotalAniver').style.display = "none";
            }

        } catch (e) {
            div.innerHTML = '<div id="alertaAvisosWidget">Erro ao carregar as informações</div>';
        }
    };

    div.innerHTML = '<div id="alertaAvisosWidget">Aguarde, carregando informações</div>';
    ajax.Request(p);
}

function MarcarAviso(linha, ok) {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=MarcarAviso';
    p += '&ok=' + (ok == "1" ? "0" : "1");
    p += '&codigo=' + gridAv.getRowData(linha);
    ajax.Request(p);

    if (ajax.getResponseText() == "1") {
        LoadAvisos(false);
    }
}

function getPeriodoAvisos(cmb, texto, ascinc) {
    Select.AddItem(cmb, texto, 0);
    Select.AddItem(cmb, 'Avisos de hoje', 0);
    Select.AddItem(cmb, 'Avisos de amanhã', 1);
    Select.AddItem(cmb, 'Avisos dos próximos 3 dias', 3);
    Select.AddItem(cmb, 'Avisos dos próximos 5 dias', 5);
    Select.AddItem(cmb, 'Avisos dos próximos 7 dias', 7);
    Select.AddItem(cmb, 'Avisos dos próximos 15 dias', 15);
    cmb.selectedIndex = 1;
    return;
}

function getPeriodos(cmb, texto, ascinc) {
    Select.AddItem(cmb, texto, 0);
    Select.AddItem(cmb, 'Pedidos de hoje', 0);
    Select.AddItem(cmb, 'Pedidos de ontem', -1);
    Select.AddItem(cmb, 'Pedidos dos últimos 7 dias', -7);
    Select.AddItem(cmb, 'Pedidos dos últimos 15 dias', -15);
    Select.AddItem(cmb, 'Pedidos dos últimos 30 dias', -30);
    Select.AddItem(cmb, 'Pedidos dos últimos 60 dias', -60);
    cmb.selectedIndex = 3;
    return;
}

function PromptAviso(linha) {

    if (!isElement('div', 'promptAviso')) {
        var div = DOM.newElement('div', 'promptAviso');
        document.body.appendChild(div);
    }

    var div = Selector.$("promptAviso");
    div.innerHTML = "";

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    div.appendChild(divform);

    var txtAviso = DOM.newElement('textarea');
    txtAviso.setAttribute('id', 'txtAviso');
    txtAviso.setAttribute('class', 'textbox_cinzafoco');
    txtAviso.setAttribute('style', 'width:100%; height:165px;');

    divform.appendChild(txtAviso);

    dialogoAviso = new caixaDialogo('promptAviso', 230, 550, 'padrao/', 135);
    dialogoAviso.Show();

    Selector.$('txtAviso').value = gridAv.getCellText(linha, 1);
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

    dialogoColecionadorEndereco = new caixaDialogo('divColecionadorEndereco', 205, 800, 'padrao/', 130);
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

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
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
        editar.setAttribute('src', 'imagens/modificar.png');
        editar.setAttribute('style', 'width:18px; height:18px; cursor:pointer;');
        editar.setAttribute('title', 'Editar Endereço');
        editar.setAttribute('onclick', 'PromptColecionadorEndereco(' + gridEnderecos.getRowCount() + ')');

        var excluir = DOM.newElement('img');
        excluir.setAttribute('src', 'imagens/excluir.png');
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

        var ajax = new Ajax('POST', 'php/photoarts.php', true);
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

function ExcluirEnderecoColecionadorAux(linhaGrid) {

    mensagemExcluir = new DialogoMensagens("prompt", 120, 350, 150, "4", "Alerta!", "Deseja realmente excluir este endereço?", "SIM", "ExcluirEnderecoColecionador(" + linhaGrid + ")", true, "");
    mensagemExcluir.Show();
}

function ExcluirEnderecoColecionador(linhaGrid) {

    mensagemExcluir.Close();

    if (linhaGrid >= 0) {
        gridEnderecos.deleteRow(linhaGrid);
    }

    if (gridEnderecos.getRowData(linhaGrid) > 0) {

        var ajax = new Ajax('POST', 'php/photoarts.php', false);
        var p = 'action=ExcluirEnderecoColecionador';
        p += '&idClienteEndereco=' + gridEnderecos.getRowData(linhaGrid);
        ajax.Request(p);
    }
}

function getEnderecosColecionador(cmb, texto, assinc) {

    var ajax = new Ajax('POST', 'php/photoarts.php', assinc);
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
            var json = JSON.parse(ajax.getResponseText() );

            for (var i = 0; i < json.length; i++) {

                cmb.innerHTML += '<option value=' + json[i].idClienteEndereco + ' id=' + json[i].cep.replace('-', '') + '>' + json[i].endereco + '</option>';
            }

            //Select.AddItem(cmb, texto, 0);
            //Select.FillWithJSON(cmb, ajax.getResponseText(), 'idClienteEndereco', 'endereco');
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
        var json = JSON.parse(ajax.getResponseText()  );
        for (var i = 0; i < json.length; i++) {

            cmb.innerHTML += '<option value=' + json[i].idClienteEndereco + ' id=' + json[i].cep.replace('-', '') + '>' + json[i].endereco + '</option>';
        }

        if (cmb.length == 2) {
            cmb.selectedIndex = 1;
        }
    }
}

function VerificarAdmin() {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=VerificarAdmin';
    ajax.Request(p);

    if (ajax.getResponseText() === '1') {
        return true;
    } else {
        return false;
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

function CalcularPrecoPrazoCorreios(pagina) {

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
        //arrayPesos.push(Number.ValorE(gridObras.getCellText(i, 26)));
        arrayPesos.push(Number.ValorE(gridObras.getCellText(i, (pagina == 'pedidos' ? 28 : 29))));
    }
    
    //Alterado para 26 - 28

    /*var arrayComprimento = new Array();
     for(var i = 0; i < gridObras.getRowCount(); i++){
     
     if(Number.ValorE(gridObras.getCellText(i, 15)) >= 2 && Number.ValorE(gridObras.getCellText(i, 15)) <= 40 && Number.ValorE(gridObras.getCellText(i, 16)) >= 11 && Number.ValorE(gridObras.getCellText(i, 16)) <= 55){
     arrayComprimento.push(15);
     }else if(Number.ValorE(gridObras.getCellText(i, 15)) >= 2 && Number.ValorE(gridObras.getCellText(i, 15)) <= 40 && Number.ValorE(gridObras.getCellText(i, 16)) >= 11 && Number.ValorE(gridObras.getCellText(i, 16)) <= 55){
     arrayComprimento.push(10);
     }else if(Number.ValorE(gridObras.getCellText(i, 15)) <= 50 && Number.ValorE(gridObras.getCellText(i, 16)) <= 70){
     
     }
     }*/

    var arrayAltura = new Array();
    for (var i = 0; i < gridObras.getRowCount(); i++) {
        //arrayAltura.push(Number.ValorE(gridObras.getCellText(i, 15)));
        arrayAltura.push(Number.ValorE(gridObras.getCellText(i, (pagina == 'pedidos' ? 17 : 18))));
    }

    var arrayLargura = new Array();
    for (var i = 0; i < gridObras.getRowCount(); i++) {
        //arrayLargura.push(Number.ValorE(gridObras.getCellText(i, 16)));
        arrayLargura.push(Number.ValorE(gridObras.getCellText(i, (pagina == 'pedidos' ? 18 : 19))));
    }
    
    var ajax = new Ajax('POST', 'php/photoarts.php', true);
    var p = 'action=CalcularPrecoPrazoCorreios';
    p += '&nCdEmpresa=' + '';
    p += '&sDsSenha=' + '';
    p += '&nCdServico=' + (Selector.$('tipoTransporte').value == '5' ? '41106' : (Selector.$('tipoTransporte').value == '4' ? '40010' : ''));
    p += '&sCepOrigem=' + '06710660';
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

        if(ajax.getResponseText() == '0'){
            var mensagem = new DialogoMensagens("prompt", 140, 400, 150, "1", "Erro", "Erro ao buscar as informações de frete. Tente novamente.", "OK", "", false, "");
            mensagem.Show();
            return;
        }
        
        var json = JSON.parse( ajax.getResponseText() );
        Selector.$('divValorFrete').style.display = 'inline-block';
        Selector.$('valorFrete').innerHTML = json.valorFrete;
        Selector.$('prazoEntrega').innerHTML = json.prazoEntrega;
    }

    Selector.$('btCalcularFrete').value = 'Calculando...';
    ajax.Request(p);
}

function SubtrairData(data, periodoMeses) {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=SubtrairData';
    p += '&data=' + data;
    p += '&periodoMeses=' + periodoMeses;
    ajax.Request(p);

    return ajax.getResponseText();
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

function verifica() {

    if (Selector.$('login_usuario').value.trim() === "") {
        Selector.$('login_aviso').innerHTML = 'Informe o seu login.';
        Selector.$('login_usuario').focus();
        return false;
    }

    if (Selector.$('login_senha').value.trim() === "") {
        Selector.$('login_aviso').innerHTML = 'Insira a senha.';
        Selector.$('login_senha').focus();
        return false;
    }

    return true;
}

function Login(logarNovamente) {

    if (!verifica())
        return;

    var ajax = new Ajax('POST', 'php/index.php', true);
    var p = 'action=Entrar';
    p += '&login=' + Selector.$('login_usuario').value;
    p += '&senha=' + Selector.$('login_senha').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK()) {
            return;
        }

        if (ajax.getResponseText() == '-3') {
            Selector.$('login_aviso').innerHTML = 'Login inválido, favor digitar o login novamente.';
            Selector.$('login_usuario').focus();

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
                Cookies.setCookie('login_Usuario', Selector.$('login_usuario').value, 15);
            } else {
                Cookies.delCookie('login_Usuario'); // deletar 
            }

            if (Window.getParameter('url') == null || Window.getParameter('url') == '')
                window.location = 'principal.html';
            else
                window.location = Window.getParameter('url');

        }
    };

    ajax.Request(p);
}

function senha_keydown(ev, logarNovamente) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        Login(logarNovamente);
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
    logo.setAttribute('src', 'imagens/login.png');
    logo.setAttribute('style', 'height:150px; width:auto;');

    var txtUsuario = DOM.newElement('text', 'login_usuario');
    txtUsuario.setAttribute('placeholder', 'Informe seu E-mail ou Login');
    txtUsuario.setAttribute('style', 'width:250px;');

    var txtSenha = DOM.newElement('password', 'login_senha');
    txtSenha.setAttribute('placeholder', 'Informe sua senha');
    txtSenha.setAttribute('style', 'width:250px;');
    txtSenha.setAttribute('onkeydown', 'senha_keydown(event, true);');

    var btLogin = DOM.newElement('input', 'entrar');
    btLogin.setAttribute('type', 'button');
    btLogin.setAttribute('value', 'Login');
    btLogin.setAttribute('class', 'login_botao');
    btLogin.setAttribute('style', 'width:314px;');
    btLogin.setAttribute('onclick', 'Login(true);');

    var lblSessao = DOM.newElement('label');
    lblSessao.innerHTML = 'Sessão expirada, efetue o login novamente';

    var lblAviso = DOM.newElement('label', 'login_aviso');

    var lblCancelar = DOM.newElement('label', 'lblCancelar');
    lblCancelar.innerHTML = 'Cancelar';
    lblCancelar.setAttribute('style', 'cursor:pointer; text-decoration:underline');
    lblCancelar.setAttribute('onclick', 'dialogoRelogin.Close(); window.location="index.html";');

    divform.appendChild(logo);
    divform.innerHTML += '<br><br>';
    divform.appendChild(txtUsuario);
    divform.appendChild(txtSenha);
    divform.innerHTML += '<br><br>';
    divform.appendChild(btLogin);
    divform.innerHTML += '<br><br>';
    divform.appendChild(lblSessao);
    divform.innerHTML += '<br>';
    divform.appendChild(lblAviso);
    divform.innerHTML += '<br>';
    divform.appendChild(lblCancelar);

    dialogoRelogin = new caixaDialogo('promptRelogin', 450, 400, '/padrao/', 150);
    dialogoRelogin.Show();
    dialogoRelogin.HideCloseIcon();

    if (Cookies.getCookie('login_Usuario') !== null) {
        Selector.$('login_usuario').value = Cookies.getCookie('login_Usuario');
        Selector.$('login_senha').focus();
    } else {
        Selector.$('login_usuario').focus();
    }
}

function checkLogarNovamente() {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=checkSessao';

    ajax.Request(p);

    if (ajax.getResponseText() === "0") {
        LogarNovamente();
        return false;
    } else {
        return true;
    }
}

function getTiposProdutos(cmb, texto, ascinc, mostraProduto) {

    var ajax = new Ajax('POST', 'php/photoarts.php', ascinc);
    var p = 'action=getTiposProdutos';
    p += '&mostraProduto=' + mostraProduto;

    Select.Clear(cmb);

    if (ascinc) {
        ajax.ajax.onreadystatechange = function () {
            if (!ajax.isStateOK())
                return;

            Select.Clear(cmb);

            if (ajax.getResponseText() === '0') {
                Select.AddItem(cmb, 'Não foi encontrado nenhum tipo de produto', 0);
                return;
            }

            Select.AddItem(cmb, texto, 0);
            Select.FillWithJSON(cmb, ajax.getResponseText(), 'idTipoProduto', 'produto');
        };

        Select.AddItem(cmb, 'Carregando os tipos de produtos...', 0);
        ajax.Request(p);
    }
    else {
        ajax.Request(p);

        if (ajax.getResponseText() === '0') {
            Select.AddItem(cmb, 'Não foi encontrado nenhum tipo de produto', 0);
            return;
        }

        Select.AddItem(cmb, texto, 0);
        Select.FillWithJSON(cmb, ajax.getResponseText(), 'idTipoProduto', 'produto');
    }
}

function criaDiv(id) {

    perdeFoco();

    var achou = false;

    var as = document.getElementsByTagName('div');
    for (var i = 0; i < as.length; i++) {
        if (as[i].id === id) {
            achou = true;
            break;
        }
    }

    if (!achou)
        document.body.appendChild(DOM.newElement('div', id));

    return Selector.$(id);
}

function perdeFoco() {

    if (!isElement('div', 'divLixo')) {
        document.body.appendChild(DOM.newElement('div', 'divLixo'));
    }

    var divLixo = Selector.$('divLixo');
    divLixo.innerHTML = '<input id="lixo_foco" type="text" />';
    Selector.$('lixo_foco').focus();
    Selector.$('divLixo').innerHTML = "";
}

function checkMarchand(id) {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=checkMarchand';
    ajax.Request(p);

    if (ajax.getResponseText() != "0") {
        Selector.$(id).value = ajax.getResponseText(); 
    }
}

function checkLoja(id) {

    var ajax = new Ajax('POST', 'php/photoarts.php', false);
    var p = 'action=checkLoja';
   
    ajax.Request(p);
    if (ajax.getResponseText() != "0") {
        Selector.$(id).value = ajax.getResponseText();
        CarregaMarchands(false);
    }
}

function PromptContratoArquiteto() {

    if(!isElement("div", "divPromptContratoArquiteto")) {
        var div = DOM.newElement("div", "divPromptContratoArquiteto");
        document.body.appendChild(div);
    }

    var divPromptContratoArquiteto = Selector.$('divPromptContratoArquiteto');
    divPromptContratoArquiteto.innerHTML = "";

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptContratoArquiteto.appendChild(divform);

    var lblAsterisco = DOM.newElement('label');
    lblAsterisco.innerHTML = "* ";
    lblAsterisco.setAttribute("style", "float:right; color:red;");

    var lblCamposObrigatorios = DOM.newElement('span');
    lblCamposObrigatorios.innerHTML = " Campos obrigatórios";
    lblCamposObrigatorios.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblCamposObrigatorios.setAttribute("style", "float:right; font-size:9px;");

    divform.appendChild(lblCamposObrigatorios);
    divform.appendChild(lblAsterisco);

    divform.innerHTML += '<br>';

    var divData = DOM.newElement('div');
    divData.setAttribute('class', 'divcontainer');
    divData.setAttribute('style', 'max-width:100px;');

    var lblData = DOM.newElement('label');
    lblData.innerHTML = "Data Contrato <span style='color:red'>*</span>";
    lblData.setAttribute("style", "text-align:center");

    var txtData = DOM.newElement('text', 'dataContrato');
    txtData.setAttribute('class', 'textbox_cinzafoco');
    txtData.setAttribute('style', 'width:100%;');

    divData.appendChild(lblData);
    divData.appendChild(txtData);
    
    divform.appendChild(divData);

    var divPeriodo = DOM.newElement('div');
    divPeriodo.setAttribute('class', 'divcontainer');
    divPeriodo.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblPeriodo = DOM.newElement('label');
    lblPeriodo.innerHTML = "Período dias <span style='color:red'>*</span>";
    lblPeriodo.setAttribute("style", "text-align:center");

    var txtPeriodo = DOM.newElement('text', 'periodoDiasContrato');
    txtPeriodo.setAttribute('class', 'textbox_cinzafoco');
    txtPeriodo.setAttribute('style', 'width:100%;;');

    divPeriodo.appendChild(lblPeriodo);
    divPeriodo.appendChild(txtPeriodo);

    divform.appendChild(divPeriodo);

    var divNumeroContrato = DOM.newElement('div');
    divNumeroContrato.setAttribute('class', 'divcontainer');
    divNumeroContrato.setAttribute('style', 'max-width:100px; margin-left:10px;');

    var lblNumeroContrato = DOM.newElement('label');
    lblNumeroContrato.innerHTML = "Número <span style='color:red'>*</span>";
    lblNumeroContrato.setAttribute("style", "text-align:center");

    var txtNumeroContrato = DOM.newElement('text', 'numeroContrato');
    txtNumeroContrato.setAttribute('class', 'textbox_cinzafoco');
    txtNumeroContrato.setAttribute('style', 'width:100%;');

    divNumeroContrato.appendChild(lblNumeroContrato);
    divNumeroContrato.appendChild(txtNumeroContrato);

    divform.appendChild(divNumeroContrato);

    divform.innerHTML += '<br>';

    var chkDevolvido = DOM.newElement('checkbox', 'devolvido');

    var lblDevolvido = DOM.newElement('label');
    lblDevolvido.setAttribute("for", "devolvido");
    lblDevolvido.innerHTML = "Devolvido";
    lblDevolvido.setAttribute("style", "text-align:center");

    divform.appendChild(chkDevolvido);
    divform.appendChild(lblDevolvido);

    var divComissao = DOM.newElement('div');
    divComissao.setAttribute('class', 'divcontainer');
    divComissao.setAttribute('style', 'max-width:120px; margin-left:10px;');

    var lblComissao = DOM.newElement('label');
    lblComissao.innerHTML = "Taxa Comissão <span style='color:red'>*</span>";
    lblComissao.setAttribute("style", "text-align:center");

    var txtComissao = DOM.newElement('text', 'comissaoContrato');
    txtComissao.setAttribute('class', 'textbox_cinzafoco');
    txtComissao.setAttribute('style', 'width:85%; text-align:right; margin-right:5px;');

    var lblTaxa = DOM.newElement('label');
    lblTaxa.innerHTML = "%";

    divComissao.appendChild(lblComissao);
    divComissao.appendChild(txtComissao);
    divComissao.appendChild(lblTaxa);

    divform.appendChild(divComissao);

    divform.innerHTML += '<br>';

    var lblObs = DOM.newElement('label');
    lblObs.innerHTML = "Observação";

    divform.appendChild(lblObs);

    divform.innerHTML += '<br>';

    var txtObs = DOM.newElement('textarea', 'obsContrato');
    txtObs.setAttribute('class', 'textbox_cinzafoco');
    txtObs.setAttribute('style', 'max-width:100%; height:60px;');

    divform.appendChild(txtObs);

    var cmdTexto1 = DOM.newElement('button', 'btGravarContratoArquiteto');
    cmdTexto1.setAttribute('class', 'botaosimplesfoco');
    cmdTexto1.setAttribute('style', 'float:right;');
    cmdTexto1.setAttribute('onclick', 'GravarContratoArquiteto()');
    cmdTexto1.innerHTML = "Gravar";

    divform.appendChild(cmdTexto1);    

    dialogoContratoArquiteto = new caixaDialogo('divPromptContratoArquiteto', 290, 550, '../padrao/', 140);
    dialogoContratoArquiteto.Show();

    Mask.setData(Selector.$('dataContrato'));
    Mask.setOnlyNumbers(Selector.$('periodoDiasContrato'));
    Mask.setOnlyNumbers(Selector.$('numeroContrato'));
    Mask.setMoeda(Selector.$('comissaoContrato'));

    Selector.$('dataContrato').value = dataContrato;
    Selector.$('periodoDiasContrato').value = periodoDiasContrato;
    Selector.$('numeroContrato').value = numeroContrato;
    Selector.$('comissaoContrato').value = comissaoContrato;
    Selector.$('obsContrato').value = obsContrato;
    Selector.$('devolvido').checked = (devolvido == 1 ? true : false);
}

function GravarContratoArquiteto() {

    if(!Date.isDate(Selector.$('dataContrato').value)){
        MostrarMsg("Por favor, digite uma data válida.", 'dataContrato');
        SelecionaAbas(0);
        return;
    }

    if(parseInt(Selector.$('periodoDiasContrato').value) <= "0"){
        MostrarMsg("Por favor, digite um periodo maior que 0.", 'periodoDiasContrato');
        SelecionaAbas(0);
        return;
    }

    if(parseInt(Selector.$('numeroContrato').value) <= "0"){
        MostrarMsg("Por favor, digite um número maior que 0.", 'numeroContrato');
        SelecionaAbas(0);
        return;
    }

    if(Number.parseFloat(Selector.$('comissaoContrato').value) <= 0){
        MostrarMsg("Por favor, digite uma comissão mairo que 0.", 'comissaoContrato');
        SelecionaAbas(0);
        return;
    }

    dataContrato = Selector.$('dataContrato').value;
    periodoDiasContrato = Selector.$('periodoDiasContrato').value;
    numeroContrato = Selector.$('numeroContrato').value;
    devolvido = (Selector.$('devolvido').checked == true ? "1" : "0");
    comissaoContrato = Selector.$('comissaoContrato').value;
    obsContrato = Selector.$('obsContrato').value;

    dialogoContratoArquiteto.Close();
}


function Prompts(div, Funcao) {

    div.innerHTML = "";
    div.setAttribute('style', 'height:230px; display:block');

    var lblnome = DOM.newElement('label');
    lblnome.setAttribute('class', 'fonte_Roboto_titulo_normal');
    lblnome.appendChild(DOM.newText('Nome'));

    var txtnome = DOM.newElement('text');
    txtnome.setAttribute('id', 'nome2');
    txtnome.setAttribute('class', 'textbox_cinzafoco');
    txtnome.setAttribute('style', 'width:350px; margin-left:5px;');
    txtnome.setAttribute('onkeydown', 'pesquisa_KeyDown();');

    var botPesquisar = DOM.newElement('submit');
    botPesquisar.setAttribute('id', 'botEnviar');
    botPesquisar.setAttribute('class', 'botaosimplesfoco');
    botPesquisar.setAttribute('style', 'float:right;');
    botPesquisar.value = 'Pesquisar';
    botPesquisar.setAttribute('onclick', Funcao.concat(';'));

    var botCancelar = DOM.newElement('submit');
    botCancelar.setAttribute('id', 'botCancelar');
    botCancelar.setAttribute('class', 'botaosimplesfoco');
    botCancelar.setAttribute('style', 'float:right; margin-left:10px;');
    botCancelar.value = 'Cancelar';
    botCancelar.setAttribute('onclick', 'dialogo.Close();');

    div.appendChild(lblnome);
    div.appendChild(DOM.newText(' '));
    div.appendChild(txtnome);

    div.appendChild(DOM.newText(' '));
    div.appendChild(botCancelar);
    div.appendChild(botPesquisar);
    div.innerHTML += '<br /><br />';

    var divopcoes = DOM.newElement('div', 'divFooterR');
    divopcoes.setAttribute('id', 'divopcoes');
    divopcoes.setAttribute('style', 'height:200px; overflow:auto;');

    Selector.$('prompt').appendChild(divopcoes);

    gridPesquisa = new Table('gridPesquisa');
    gridPesquisa.table.setAttribute('class', 'tabela_cinza_foco');
    gridPesquisa.table.setAttribute('cellpadding', '5');
    gridPesquisa.table.setAttribute('cellspacing', '0');

    gridPesquisa.addHeader([
        DOM.newText('Nome'),
        DOM.newText('CPF'),
        DOM.newText('Ativo')
    ]);

    divopcoes.appendChild(gridPesquisa.table);

    dialogo = new caixaDialogo('prompt', 290, 730, 'padrao/', 111);
    dialogo.Show();

    Selector.$('nome2').focus();
}