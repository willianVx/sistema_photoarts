<!DOCTYPE html>
<?php
    include "./classes/html.class.php";
    
    ini_set("display_errors","OFF");
    error_reporting(E_ALL);

    echo html::meta()->{'http-equiv="Content-Type" content="text/html; utf-8"'}();
    echo html::link()->{'rel="stylesheet" type="text/css" href="padrao/css/componentes.css"'}();
    echo html::link()->{'rel="stylesheet" type="text/css" href="padrao/css/efeitos.css"'}();
    echo html::link()->{'rel="stylesheet" type="text/css" href="padrao/css/fontes.css"'}();
    echo html::script()->{'type="text/javascript" src="padrao/json2.js"'}();
    echo html::script()->{'type="text/javascript" src="padrao/utils.js"'}();
    echo html::script()->{'type="text/javascript" src="js/photoarts.js"'}();
    echo html::script()->{'type="text/javascript" src="js/index.js"'}();
    echo html::meta()->{'http-equiv="Content-Type" content="text/html; utf-8"'}();
    echo html::meta()->{'"viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0"'}();
    echo html::title('Login | Photoarts Gallery');
    echo html::link()->{'rel="stylesheet" type="text/css" href="css/estilos.css"'}();
    
    echo html::body()->style("background:#EEEEEE");
    
    $ToHtml=html::div()->class("container")->align("center")->append(
        html::div()->id("caixalogin")->append(
            html::img()->src("imagens/login.png"),
            html::br(),
            html::br(),
            html::input()->type('text')->id('login_usuario')->placeholder('Informe seu E-Mail ou Login'),
            html::input()->type('password')->id('login_senha')->placeholder('Informe sua senha')->onkeydown("senha_keydown(event);"),

            html::div()->align("left")->style("padding-left:20px; padding-top:10px")->append(
                html::input()->type('checkbox')->id('login_lembrar')->style("border:#999; border:solid; border-width:1px"),
                html::label()->for('Lembrar login')->nome('login_lembrar')->append(
                    html::span('Lembrar login')->class("legenda")->style("color:#BFBFBF")
                )
            ),

            html::div()->style("margin-top:10px")->append(
                html::input()->type('button')->value("Login")->id('entrar')->class("login_botao")->onclick("Login()")
            ),
            html::div()->style("margin-top:15px")->append(
                html::span()->class("legenda")->style("color:#C00; font-weight:bold;")->id("login_aviso"),
                html::br(),
                html::br(),
                html::span()->class("legenda")->html('Photoarts Gallery ©2015 - Todos os direitos reservados')
            )
       )
    );

    echo $ToHtml;
