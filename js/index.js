/* global defult */

destroySessao();
window.onload = function () {

    Selector.$("login_usuario").focus();

    if (Cookies.getCookie('login_usuario') !== '' && Cookies.getCookie('login_Usuario') !== null) {
        Selector.$('login_usuario').value = Cookies.getCookie('login_Usuario');
        Selector.$('login_senha').focus();
        Selector.$('login_lembrar').checked = 'checked';
    } else {
        Selector.$('login_usuario').focus();
        return;
    }
};

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
};

function Login() {

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
                
        var r = ajax.getResponseText();
        
        r = parseInt( r );        
        
        switch ( r ){
            case 1:
                Selector.$('login_aviso').innerHTML = 'Senha Inválida, 3 tentativas BLOQUEIAM o usuário';
                break;
            case 2: 
                Selector.$('login_aviso').innerHTML = 'Senha inválida, restam 2 tentativas.';
                break;
            case 3: 
                Selector.$('login_aviso').innerHTML = 'Senha inválida, restam 1 tentativa.';
                break;
            case 4: {
                Selector.$('login_aviso').innerHTML = 'Login inválido, favor digitar o login novamente.';
                Selector.$('login_usuario').focus();
                break;
                }
            case 5: {
                Selector.$('login_aviso').innerHTML = 'Usuário inativo.';
                Selector.$('login_usuario').focus();               
                break;
                }
            case 6:
                Selector.$('login_aviso').innerHTML = 'Senha inválida, usuário bloqueado.';   
                break;
            case 7: {
                Selector.$('login_aviso').innerHTML = 'Usuário bloqueado.';
                Selector.$('login_usuario').focus();   
                break;
                }
            case 9: {
   	
                if (Selector.$('login_lembrar').checked) {
                    Cookies.setCookie('login_Usuario', Selector.$('login_usuario').value, 15);
                } else {
                    Cookies.delCookie('login_Usuario'); // deletar 
                }
                
                if(Window.getParameter('url') == null || Window.getParameter('url') == '')
                    window.location = 'principal.html';
                else
                    window.location = Window.getParameter('url');
                break;
                }
            }
    };
    
    ajax.Request(p);
};

function senha_keydown(ev) {

    ev = window.event || ev;
    var keyCode = ev.keyCode || ev.which;

    if (keyCode === 13) {
        Login();
    };
};
