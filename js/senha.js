checkSessao();

window.onload = function () {
    Selector.$("legendaTela").innerHTML = "<div>Alteração de Senha</div>";
    carregarmenu();
    getDadosUsuario();
    Selector.$('senhatual').focus();
};

function Alterar() {

    if (Selector.$('cmdalterar').value == "Aguarde")
        return;


    if (!Verifica())
        return;

    var ajax = new Ajax('POST', 'php/senha.php', true);
    var p = 'action=Alterar';
    p += '&senha=' + Selector.$('senhatual').value;
    p += '&novasenha=' + Selector.$('senha').value;

    ajax.ajax.onreadystatechange = function () {

        if (!ajax.isStateOK())
            return;

        Selector.$('cmdalterar').value = "Alterar senha";

        if (ajax.getResponseText() == '-2') {
            window.location = 'index.html';
            return;
        } else if (ajax.getResponseText() == '-1') {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Senha incorreta", "OK", "", false, "");
            mensagem.Show();
            return;
        } else if (ajax.getResponseText() == 0) {
            var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor informar uma senha diferente da atual", "OK", "", false, "senhatual");
            mensagem.Show();
            return;
        } else {
            window.location = 'principal.html';
        }

    };

    Selector.$('cmdalterar').value = "Aguarde";
    ajax.Request(p);
}

function Verifica() {

    if (Selector.$('senhatual').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor informar sua senha atual.", "OK", "", false, "senhatual");
        mensagem.Show();
        return false;
    }

    if (Selector.$('senha').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor informar sua nova senha.", "OK", "", false, "senha");
        mensagem.Show();
        return false;
    }

    if (Selector.$('senha').value.length < 4) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "As senhas devem ter no mínimo 4 caracteres", "OK", "", false, "senha");
        mensagem.Show();
        return false;
    }

    if (Selector.$('senha2').value.trim() == "") {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Favor confirmar sua nova senha", "OK", "", false, "senha2");
        mensagem.Show();
        return false;
    }

    if (Selector.$('senha').value.trim() != Selector.$('senha2').value.trim()) {
        var mensagem = new DialogoMensagens("prompt", 120, 350, 150, "2", "Atenção!", "Confirmação de senha inválida.", "OK", "", false, "senha2");
        mensagem.Show();
        return false;
    }

    if (Selector.$('senhatual').value.trim() == Selector.$('senha').value.trim()) {
        var mensagem = new DialogoMensagens("prompt", 140, 350, 150, "2", "Atenção!", "A senha atual e nova senha são iguais, favor digitar senhas diferentes", "OK", "", false, "senha");
        mensagem.Show();
        return false;
    }

    return true;
}