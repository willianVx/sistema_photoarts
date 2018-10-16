DestruirSessao();

window.onload = function () {

    CarregarGalerias(Selector.$('login_galeria'), "Selecione uma galeria", false);

    if(Cookies.getCookie('login_galeria') != null){

    	Selector.$('login_galeria').value = Cookies.getCookie('login_galeria');
    	CarregarMarchandsGaleria(Selector.$('login_vendedor'), 'Selecione uma marchand', false);
    	Selector.$('login_lembrar').checked = 'checked';

    	if(Cookies.getCookie('login_vendedor') != '' && Cookies.getCookie('login_vendedor') != null){    		
	    	Selector.$('login_vendedor').value = Cookies.getCookie('login_vendedor');
	    	Selector.$('login_senha_vendedor').focus();
    	}else{

    		Selector.$('login_vendedor').focus();
    	}
    }else{
    	Selector.$('login_galeria').focus();
    }
};