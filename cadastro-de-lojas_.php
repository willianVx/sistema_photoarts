<!DOCTYPE html>
<?PHP
    include "./classes/html.class.php";
    
    ini_set("display_errors","OFF");
    error_reporting(E_ALL);

    $header = html::head();

    html::meta()->{'http-equiv="Content-Type" content="text/html; utf-8"'}()->appendTo($header);
    html::link()->{'rel="stylesheet" type="text/css" href="padrao/css/componentes.css"'}()->appendTo($header);
    html::link()->{'rel="stylesheet" type="text/css" href="padrao/css/efeitos.css"'}()->appendTo($header);
    html::link()->{'rel="stylesheet" type="text/css" href="padrao/css/fontes.css"'}()->appendTo($header);
    html::link()->{'rel="stylesheet" type="text/css" href="css/menu.css"'}()->appendTo($header);
    html::link()->{'rel="stylesheet" type="text/css" href="css/estilos.css"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="padrao/json2.js"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="padrao/utils.js"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="js/jquery-latest.min.js"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="js/menu.js"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="js/Chart.min.js"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="js/photoarts.js"'}()->appendTo($header);
    html::script()->{'type="text/javascript" src="js/cadastro-de-lojas.js"'}()->appendTo($header);
    html::meta()->{'http-equiv="Content-Type" content="text/html; utf-8"'}()->appendTo($header);
    html::meta()->{'"viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=0"'}()->appendTo($header);
    html::title('Cadastro de Lojas | Photo Arts')->appendTo($header);

    echo $header;
    echo html::body()->style("height:100%;");

    /*
    $menu = [   "Home"     => [ "Nivel" => "1", "Titulo" => "Home", "Href" => "principal.html", "Img" => "imagens/home.png", "Texto" => "Home" ],
                "Cadastro" => [ "Nivel" => "1", "Titulo" => "Cadastro", "Href" => "#", "Img" => "imagens/cadastro.png", "Texto" => "Cadastro" ],
            ];

    foreach( $menu as $ops)

            html::li(
                html::a()->href($ops["Href"])->title($ops["Titulo"])->append( html::img()->src($ops["Img"]),html::span($ops["Texto"]))
            )->appendTo($toHtml);
    
    */      

    $ToHtml=html::div()->id("pagina")->append(
        html::div()->id("divmenu")->append(
            html::div()->id("cabecalho_usuario")->append(
                html::div()->id("foto_menu"),
                html::div()->id("nome_menu")->append(
                    html::span('Usuário não logado')->id('nome_user'),
                    html::span()->id('email_user')->append(
                        html::a('Clique aqui')->href('index.html')
                    )
                ),
                html::div()->id("menu_esquerda_ocultar")->onclick("oculta_menu(1)")->append(
                    html::img()->src("imagens/3pontos.png")
                )
            ),
            html::div()->id("menu")->append(
                html::div()->id("cssmenu")->append(
                    html::ul()->append(
                        html::li(
                            html::a()->href('principal.html')->title('Home')->append( html::img()->src("imagens/home.png"),html::span('Home'))
                        ),
                        html::li(
                            html::a()->href('#')->title('Cadastros')->append( html::img()->src("imagens/cadastro.png"),html::span('Cadastros')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('cadastro-de-artistas.html')->title('Cadastro de Artistas')->append(html::img()->src("imagens/clientes.png"),html::span('Artistas'))
                                ),
                                html::li(
                                    html::a()->href('cadastro-de-colecionadores.html')->title("Cadastro de Colecionadores")->append(html::img()->src("imagens/artistas.png"),html::span('Colecionadores'))
                                ),
                                html::li(
                                    html::a()->href('cadastro-de-fornecedores.html')->title("Cadastro de Fornecedores")->append(html::img()->src("imagens/fornecedores.png"),html::span('Fornecedores')) 
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-funcionarios.html')->title("Cadastro de Funcionários")->append(html::img()->src("imagens/funcionarios.png"),html::span('Funcionários'))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-lojas.html')->title("Cadastro de Lojas")->append(html::img()->src("imagens/locais.png"),html::span('Lojas'))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-marchands.html')->title("Cadastro de Marchands")->append(html::img()->src("imagens/vendedores.png"),html::span('Marchands'))
                                )->class('last')
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Compras")->append(html::img()->src("imagens/menucompras.png"),html::span('Compras')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('ordem-de-compras.html')->title("Ordem de Compras")->append(html::img()->src("imagens/menuordemcompra.png"),html::span('Ordem de Compras'))
                                ),
                                html::li(
                                    html::a()->href('ordem-de-compras.html?situacao=todas')->title("Cadastro de Artistas")->append(html::img()->src("imagens/menurelordemcompras.png"),html::span('Relatório de Ordem de Compras'))                                    
                                )
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Estoque")->append(html::img()->src("imagens/menuestoque.png"),html::span('Estoque')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('estoque-de-materiais.html')->title("Estoque de Materiais")->append(html::img()->src("imagens/menuordemcompra.png"),html::span('Estoque de Materiais'))
                                ),
                                html::li(
                                    html::a()->href('estoque-de-produtos.html')->title("Cadastro de Artistas")->append(html::img()->src("imagens/menurelordemcompras.png"),html::span('Estoque de Produtos'))
                                )
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Vendas")->append(html::img()->src("imagens/venda.png"),html::span('Vendas')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('#')->title("Cadastro")->append(html::img()->src("imagens/cadastro.png"),html::span('Cadastros'))
                                )->append(
                                    html::ul()->append(
                                        html::li(
                                            html::a()->href('propostas.html')->title("Cadastro de Orçamentos")->append(html::img()->src("imagens/proposta.png"),html::span('Orçamentos'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('pedidos.html')->title("Cadastro de Pedidos")->append(html::img()->src("imagens/os.png"),html::span('Pedidos'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('cadastro-de-vales-presentes-trocas.html')->title("Cadastro de Vales Presentes")->append(html::img()->src("imagens/presente.png"),html::span('Vales Presentes'))
                                        )->style("margin-left:35px;")                                          
                                    )
                                ),
                                html::li(
                                    html::a()->href('#')->title("Relatórios")->append(html::img()->src("imagens/relatorio.png"),html::span('Relatórios')))->append(
                                    html::ul()->append(
                                        html::li(
                                            html::a()->href('relatorio-de-encomendas.html')->title("Relatório de Encomendas")->append(html::img()->src("imagens/materiais.png"),html::span('Encomendas'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('relatorio-de-propostas.html')->title("Relatório de Orçamentos")->append(html::img()->src("imagens/proposta.png"),html::span('Orçamentos'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('relatorio-de-pedidos.html')->title("Relatório de Pedidos")->append(html::img()->src("imagens/os.png"),html::span('Pedidos'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('relatorio-de-panorama-de-vendas.html')->title("Relatório de Panorama de vendas")->append(html::img()->src("imagens/panoramavenda.png"),html::span('Panorama de Vendas'))
                                        )->style("margin-left:35px;")                                           
                                    )
                                )
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Financeiro")->append(html::img()->src("imagens/financeiro.png"),html::span('Financeiro')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('#')->title("Contas a Pagar")->append(html::img()->src("imagens/porco.png"),html::span('Contas à Pagar')))->append(
                                    html::ul()->append(
                                        html::li(
                                            html::a()->href('cadastro-de-contas-a-pagar.html')->title("Cadastro de Contas")->append(html::img()->src("imagens/cadastro.png"),html::span('Cadastro de Contas'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('relatorio-de-contas-a-pagar.html')->title("Relatório de Contas")->append(html::img()->src("imagens/relatorio.png"),html::span('Relatório de Contas'))
                                        )->style("margin-left:35px;")                                       
                                    )
                                ),
                                html::li(
                                    html::a()->href('#')->title("Contas à Receber")->append(html::img()->src("imagens/areceber.png"),html::span('Contas à Receber')))->append(
                                    html::ul()->append(
                                        html::li(
                                            html::a()->href('receitas-avulsas.html')->title("Receitas Avulsas")->append(html::img()->src("imagens/avulsos.png"),html::span('Receitas Avulsas'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('relatorio-de-antecipacoes.html')->title("Relatório de Antecipações")->append(html::img()->src("imagens/relatorio.png"),html::span('Relatório de Antecipações'))
                                        )->style("margin-left:35px;"),
                                        html::li(
                                            html::a()->href('relatorio-de-contas-a-receber.html')->title("Relatório de Contas")->append(html::img()->src("magens/relatorio.png"),html::span('Relatório de Contas'))
                                        )->style("margin-left:35px;")                                          
                                    )
                                ),
                                html::li(
                                    html::a()->href('fluxo-de-caixa.html')->title("Fluxo de Caixa")->append(html::img()->src("imagens/fluxocaixa.png"),html::span('Fluxo de Caixa'))
                                ),
                                html::li(
                                    html::a()->href('repasses-de-artistas.html')->title("Repasses de Artistas")->append(html::img()->src("imagens/artistas.png"),html::span('Repasses de Artistas'))
                                ),
                                html::li(
                                    html::a()->href('repasses-de-marchands.html')->title("Repasses de Marchands")->append( html::img()->src("imagens/vendedores.png"),html::span('Repasses de Marchands'))
                                ),
                                html::li(
                                    html::a()->href('repasses-de-marchands-gerentes.html')->title("Repasses de Marchands Gerentes")->append(html::img()->src("imagens/vendedores.png"),html::span('Repasses de Marchands Ger.'))
                                ),
                                html::li(
                                    html::a()->href('repasses-de-arquitetos.html')->title("Repasses de Arquitetos")->append(html::img()->src("imagens/molduras.png"),html::span('Repasses de Arquitetos'))
                                )  
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Produção")->append(html::img()->src("imagens/menuproducao.png"),html::span('Produção')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('ordem-de-producao.html')->title("Ordem de Produção")->append(html::img()->src("imagens/producao.png"),html::span('Ordem de Produção'))
                                ),
                                html::li(
                                    html::a()->href('acompanhar-ops.html')->title("Acompanhar OP's")->append(html::img()->src("imagens/acompanharops.png"),html::span("Acompanhar OP's"))
                                ),
                                html::li(
                                    html::a()->href('ordem-de-producao.html?relatorio=true')->title("Relatório de OP's")->append(html::img()->src("imagens/relops.png"),html::span("Relatório de OP's"))
                                )->class('last')
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Relatórios Gerais")->append(html::img()->src("imagens/menurelordemcompras.png"),html::span('Relatórios'))
                        )->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('relatorio-de-aniversariantes.html')->title("Relatório de Aniversáriantes")->append(html::img()->src("imagens/festas.png"),html::span('Aniversáriantes'))
                                ),
                                html::li(
                                    html::a()->href('relatorio-de-rt.html')->title("Relatório de RT's")->append(html::img()->src("imagens/acabamento.png"),html::span("RT's"))
                                )->class('last')
                            )
                        ),
                        html::li(
                            html::a()->href('#')->title("Configuração")->append(html::img()->src("imagens/engrenagem.png"),html::span('Configurações')))->class('has-sub')->append(
                            html::ul()->append(
                                html::li(
                                    html::a()->href('cadastro-de-acabamentos.html')->title("Cadastro de Acabamentos")->append(html::img()->src("imagens/festas.png"),html::span('Acabamentos'))
                                ),
                                html::li(
                                    html::a()->href('cadastro-de-cargos.html')->title("Cadastro de Cargos")->append(html::img()->src("imagens/cargos.png"),html::span("Cargos"))
                                ),
                                html::li(
                                    html::a()->href('cadastro-de-contas.html')->title("Cadastro de Contas")->append(html::img()->src("imagens/financeiros.png"),html::span("Contas"))
                                ),
                                html::li(
                                    html::a()->href('cadastro-de-centro-de-custos.html')->title("Cadastro de Centro de Custos")->append(html::img()->src("imagens/centrocusto.png"),html::span("Centro de Custos"))
                                ),
                                html::li(
                                    html::a()->href('cadastro-de-departamentos.html')->title("Cadastro de Departamentos")->append(html::img()->src("imagens/deptos.png"),html::span("Departamentos"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-estilos.html')->title("Cadastro de Estilos")->append(html::img()->src("imagens/estilo.png"),html::span("Estilos"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-estrelas.html')->title("Cadastro de Estrelas")->append(html::img()->src("imagens/estrela.png"),html::span("Estrelas"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-etapas-de-producao.html')->title("Cadastro de Etapas de Produção")->append(html::img()->src("imagens/equipamento.png"),html::span("Etapas de Produção"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-feriados.html')->title("Cadastro de Feriados")->append(html::img()->src("imagens/feriados.png"),html::span("Feriados"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-formas-de-pagamentos.html')->title("Cadastro de Fomas de Pagamentos")->append(html::img()->src("imagens/pagamentos.png"),html::span("Formas de Pagamentos"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-tamanhos.html')->title("Cadastro de Tamanhos")->append(html::img()->src("imagens/logistica.png"),html::span("Tamanhos"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-produtos.html')->title("Cadastro de Produtos")->append(html::img()->src("imagens/logistica.png"),html::span("Produtos à venda"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-materiais.html')->title("Cadastro de Materiais")->append(html::img()->src("imagens/materiais.png"),html::span("Materiais"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-molduras.html')->title("Cadastro de Molduras")->append(html::img()->src("imagens/molduras.png"),html::span("Molduras"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-naturezas.html')->title("Cadastro de Naturezas")->append(html::img()->src("imagens/naturezas.png"),html::span("Naturezas"))
                                )->class('last'),

                                html::li(
                                    html::a()->href('cadastro-de-status-de-vendas.html')->title("Cadastro de Status de Vendas")->append(html::img()->src("imagens/statusvenda.png"),html::span("Status de Vendas"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-tipos-de-contatos.html')->title("Cadastro de Tipos de Contatos")->append(html::img()->src("imagens/contatos.png"),html::span("Tipos de Contatos"))
                                )->class('last'),
                                html::li(
                                    html::a()->href('cadastro-de-tipos-de-transportes.html')->title("Cadastro de Tipos de Transporte")->append(html::img()->src("imagens/transporte.png"),html::span("Tipos de Transportes"))
                                )->class('last')
                            )
                        ),
                        html::li(
                            html::a()->href('index.html')->title("Sair")->append(html::img()->src("imagens/sair2.png"),html::span('Sair'))
                        )->class('last')
                    )                                                                    
                )
            ),
            
            html::tag()->text('<!--menu-->'),

            html::div()->align("center")->style("padding-bottom:30px; width:320px; overflow:hidden; bottom:0px; margin-top:30px; ")->append(
                html::img()->src("imagens/focomenu.png")
            )
        ),    
        html::tag()->text('<!--divmenu-->'),

        html::div()->id("divprincipal")->style("height:auto")->append(
            html::div()->id("cabecalho")->append(
                html::div()->id("cabecalho_botao_menu")->onclick("oculta_menu(2)")->append(
                    html::img()->src("imagens/menu.png")
                ),
                html::div()->id("legendaTela"),
                html::div()->id("cabecalho_botoes_principal")->style("float:right")->append(
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("window.location = 'index.html'")->append(
                        html::img()->src("imagens/sair.png") ),
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("mostracaixaconfiguracoes()")->append(
                        html::img()->src("imagens/config.png") ),
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("abrecaixaemail()")->title('Lembretes')->append(
                        html::img()->src("imagens/email.png") ),
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("abrecaixaaniversariantes()")->title('Aniversariantes')->append(
                        html::img()->src("imagens/bolo.png") ),
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("window.location='cadastro-de-colecionadores.html'")->title('Cadastro de Colecionadores')->append(
                        html::img()->src("imagens/clientes.png") ),
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("window.location='propostas.html'")->title('Orçamentos')->append(
                        html::img()->src("imagens/proposta.png") ),
                    html::div()->id("cabecalho_botao_menu_topo")->onclick("window.location='pedidos.html'")->title('Pedidos')->append(
                        html::img()->src("imagens/os.png") )
                )
            ),
 
            html::tag()->text('<!--cabecalho-->'),
            html::div()->style("height:65px;"),
            html::div()->align("center")->style("padding-left:5px;	margin-right:5px;")->append(
                html::div()->class("quadrosimples efeito_delay")->style(" clear:both; min-width:600px; width:95%; max-width:1000px; min-height:238px; display:block;")->align("left")->append(
                    html::div()->class("quadrosimplestitulo")->append(
                        html::div()->class("botaotituloultimo")->onclick("window.location = 'principal.html'")->append(
                            html::img()->src("imagens/sair3.png") ),
                        html::div()->class("botaotituloultimo")->onclick("promptCadastro();")->append(
                            html::img()->src("imagens/novo.png") ),
                        html::input()->type('text')->id('busca')->style("width:220px; float:left; margin-top:-2px; margin-right:10px; margin-left:5px;")->class("textbox_cinzafoco textbox_cinzafocoefeito")->placeholder("Pesquise por nome")->onclick("Mostra();"),
                        html::div()->class("botaotitulosimples")->onclick("Mostra();")->append(
                            html::img()->src("imagens/pesquisar.png") )
                    ),
                    html::div()->class("divformulario")->id('divTabela')->style("min-height:400px; overflow: auto;"),
                    html::div()->class("divformulario")->align("center")->append(
                        html::label()->id('mensagemEquipamentos')->style("display:none;")
                    )
                )
            )
        ),
        html::tag()->text('<!--divprincipal-->')
            
    );

    
echo $ToHtml;

echo html::tag()->text('<!--pagina-->');

echo html::div()->id("prompt");

$ToHtml=html::div()->id("divConfiguacoes")->class('divConfiguacoes efeito_delay')->style("height:0px;")->onclick("mostracaixaconfiguracoes();")->append(
    html::div()->class('divconfitens efeito-opacidade-75-03')->onclick("window.location = 'alterar-senha.html'")->append(
        html::img()->src("imagens/chave.png"), html::br(), html::tag()->text("ALTERAR")),
    html::div()->class('divconfitens efeito-opacidade-75-03')->onclick("suporteTecnico();")->append(
        html::img()->src("imagens/suporte.png"), html::br(), html::tag()->text("SUPORTE TÉCNICO"))    
);
echo $ToHtml;
