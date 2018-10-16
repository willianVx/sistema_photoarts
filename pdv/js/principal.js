ValidarSessao();

window.onload = function(){

    CarregarDadosUsuario();
    VerificarSenhaPadrao();

	gridPedidosAndamento = new Table('gridPedidosAndamento');
    gridPedidosAndamento.table.setAttribute('cellpadding', '5');
    gridPedidosAndamento.table.setAttribute('cellspacing', '0');
    gridPedidosAndamento.table.setAttribute('class', 'tabela_jujuba_comum');

    gridPedidosAndamento.addHeader([
        DOM.newText('Data'),
        DOM.newText('Cliente'),
        DOM.newText('Loja'),
        DOM.newText('Previsão'),
        DOM.newText('Obras'),
        DOM.newText('Situação'),
        DOM.newText('Ver')
    ]);

    Selector.$('tabela').appendChild(gridPedidosAndamento.table);
    CarregarGalerias(Selector.$('lojas'), 'Todas as galerias', false);
    MostrarPedidosAndamento();
};

function MostrarPedidosAndamento(){

	var ajax = new Ajax('POST', 'php/principal.php', true);
	var p = 'action=MostrarPedidosAndamento';
    p+= '&idLoja=' + Selector.$('lojas').value;

	ajax.ajax.onreadystatechange = function(){

		if(!ajax.isStateOK()){
			return;
		}

        gridPedidosAndamento.clearRows();

		if(ajax.getResponseText() == '0'){
			return;
		}else{

			var json = JSON.parse(ajax.getResponseText());
			var obras;
			var ver;

			for(var i = 0; i < json.length; i++){

				obras = DOM.newElement('img');
				obras.setAttribute('src', './../imagens/menu.png');
				obras.setAttribute('title', 'Ver as obras do pedido');
				obras.setAttribute('onclick', 'VerObrasPedido(' + json[i].idVenda + ')');

				ver = DOM.newElement('img');
				ver.setAttribute('src', './../imagens/pesquisar.png');
				ver.setAttribute('title', 'Ver pedido');
				ver.setAttribute('onclick', 'window.location="pedidos.html?idPedido=' + json[i].idVenda + '"');

				gridPedidosAndamento.addRow([
					DOM.newText(json[i].dataVenda),
					DOM.newText(json[i].cliente),
                    DOM.newText(json[i].loja),
					DOM.newText(json[i].dataEntrega),
					obras,
					DOM.newText(json[i].situacao),
					ver
				]);

				gridPedidosAndamento.setRowData(gridPedidosAndamento.getRowCount() - 1, json[i].idVenda);
	            gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 0).setAttribute('style', 'text-align:center; width:90px;');
	            gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 1).setAttribute('style', 'text-align:left;');
                gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 2).setAttribute('style', 'text-align:left;');
	            gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 3).setAttribute('style', 'text-align:center; width:70px;');
	            gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 4).setAttribute('style', 'text-align:center; width:50px;');
	            gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 5).setAttribute('style', 'text-align:left; width:200px;');
	            gridPedidosAndamento.getCell(gridPedidosAndamento.getRowCount() - 1, 6).setAttribute('style', 'text-align:center; width:30px;');
			}

			pintaLinhaGrid(gridPedidosAndamento);
		}
	};

	ajax.Request(p);
}

function VerObrasPedido(idVenda){

	if (!isElement('div', 'divPromptObrasPedido')) {
        var div = DOM.newElement('div', 'divPromptObrasPedido');
        document.body.appendChild(div);
    }

    var divPromptObrasPedido = Selector.$('divPromptObrasPedido');
    divPromptObrasPedido.innerHTML = '';

    var divform = DOM.newElement('div');
    divform.setAttribute('class', 'divformulario');
    divPromptObrasPedido.appendChild(divform);

    var divObrasPedido = DOM.newElement('div', 'divObrasPedido');
    divObrasPedido.setAttribute('style', 'width:100%; height:400px; border: 1px solid lightgray; overflow:auto;');

    gridObrasPedido = new Table('gridObrasPedido');
    gridObrasPedido.table.setAttribute('cellpadding', '3');
    gridObrasPedido.table.setAttribute('cellspacing', '0');
    gridObrasPedido.table.setAttribute('class', 'tabela_jujuba_comum');

    gridObrasPedido.addHeader([
        DOM.newText(''),
        DOM.newText('Tipo'),
        DOM.newText('Artista'),
        DOM.newText('Obra'),
        DOM.newText('Acabamento'),
        DOM.newText('Tamanho'),
        DOM.newText('Valor'),
        DOM.newText('Qtde.'),
        DOM.newText('Valor Total')
    ]);

    divform.appendChild(divObrasPedido);

    dialogoObrasPedido = new caixaDialogo('divPromptObrasPedido', 455, 1000, '../padrao/', 141);
    dialogoObrasPedido.Show();

    Selector.$('divObrasPedido').appendChild(gridObrasPedido.table);

    var ajax = new Ajax('POST', 'php/principal.php', true);
    var p = 'action=MostrarObrasPedido';
    p+= '&idVenda=' + idVenda;

    ajax.ajax.onreadystatechange = function(){

        if(!ajax.isStateOK()){
            return;
        }

        if(ajax.getResponseText() == '0'){
            return;
        }else{

            var json = JSON.parse(ajax.getResponseText());
            var imagem;

            for(var i = 0; i < json.length; i++){

            	imagem = DOM.newElement('img');
            	imagem.setAttribute('src', json[i].imagemObraMini);
            	imagem.setAttribute('onclick', 'window.open("' + json[i].imagemObra + '")');
            	imagem.setAttribute('alt', 'Obra: ' + json[i].nomeObra);

                gridObrasPedido.addRow([
                    imagem,
                    DOM.newText(json[i].tipoProduto),
                    DOM.newText(json[i].artista),
                    DOM.newText(json[i].nomeObra),
                    DOM.newText(json[i].nomeAcabamento),
                    DOM.newText(json[i].tamanho),
                    DOM.newText(json[i].valor),
                    DOM.newText(json[i].qtd),
                    DOM.newText(json[i].valorTotal)
                ]);

                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:center; width:100px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left; width:100px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:left;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left; width:width:150px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:left; width:150px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:right; width:100px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:70px;');
                gridObrasPedido.getCell(gridObrasPedido.getRowCount() - 1, 8).setAttribute('style', 'border:none; text-align:right; width:100px;');
            }

            pintaLinhaGrid(gridObrasPedido);
        }
    };

    ajax.Request(p);
}

function AdicionarObra(codigo) {

    if (!isElement('div', 'divCadastro')) {
        var div = DOM.newElement('div', 'divCadastro');
        document.body.appendChild(div);
    }

    var divCadastro = Selector.$('divCadastro');
    divCadastro.setAttribute('style', 'text-align:left;');
    divCadastro.setAttribute('align', 'left');
    divCadastro.innerHTML = '';

    //OPTIONS PHOTOARTS OU INSTAARTS
    //PHOTOARTS
    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optPhoto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObrasPrincipal()');
    elemento.setAttribute('style', 'margin-left:155px');
    elemento.setAttribute('checked', 'checked');

    var label = DOM.newElement('label');
    label.innerHTML = 'PhotoArts';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optPhoto');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    //INSTAARTS
    elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optInsta');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObrasPrincipal()');
    elemento.setAttribute('style', 'margin-left:20px');

    label = DOM.newElement('label');
    label.innerHTML = 'InstaArts';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optInsta');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    //PRODUTOS
    var elemento = DOM.newElement('radio');
    elemento.setAttribute('id', 'o_optProduto');
    elemento.setAttribute('name', 'l');
    elemento.setAttribute('onclick', 'AlternaTipoObrasPrincipal()');
    elemento.setAttribute('style', 'margin-left:20px');

    var label = DOM.newElement('label');
    label.innerHTML = 'Produtos';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:3px');
    label.setAttribute('for', 'o_optProduto');

    divCadastro.appendChild(elemento);
    divCadastro.appendChild(label);

    divCadastro.innerHTML += '<br />';

    //DIV PHOTOARTS
    var divP = DOM.newElement('div', 'o_divPhotoarts');
    divP.setAttribute('style', 'margin-top:10px; text-align:left;');

    //ARTISTA
    label = DOM.newElement('label');
    label.innerHTML = 'Artista ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    //label.setAttribute('style', 'margin-left:40px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_artista');
    elemento.setAttribute('class', 'combo_cinzafoco');
    elemento.setAttribute("style", 'width:235px; margin-left:4px;');
    elemento.setAttribute('onclick', 'getObrasArtista(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //OBRA
    label = DOM.newElement('label');
    label.innerHTML = 'Obra ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:235px; margin-left:4px');
    elemento.setAttribute('onclick', 'getTamanhosObras(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanho');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:218px; margin-left:4px');
    elemento.setAttribute('onclick', 'getDadosTamanho("p")');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Acabamento ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_acabamento');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:190px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //GRUPO MOLDURA    
    label = DOM.newElement('label');
    label.innerHTML = 'Grupo ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_grupoMoldura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:238px; margin-left:4px');
    elemento.setAttribute('onclick', 'getMolduras(true)');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //MOLDURA
    label = DOM.newElement('label');
    label.innerHTML = 'Moldura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_moldura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:216px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divP.innerHTML += '<br />';

    //DADOS DO TAMANHO, TIRAGEM, ESTRELAS, ETC
    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    //label.setAttribute('style', 'margin-left:40px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_altura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_largura');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //TIRAGEM
    label = DOM.newElement('label');
    label.innerHTML = 'Tiragem ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_tiragem');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:45px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //QTDE VENDIDOS
    label = DOM.newElement('label');
    label.innerHTML = 'Qtd. Vendidos ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_qtdeVendidos');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:45px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    //ESTRELAS
    label = DOM.newElement('label');
    label.innerHTML = 'Estrelas ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_estrelas');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:42px; margin-left:4px; background-color:#F5F5F5');

    divP.appendChild(label);
    divP.appendChild(elemento);

    divCadastro.appendChild(divP);

    //INSTAARTS
    var divI = DOM.newElement('div', 'o_divInstaarts');
    divI.setAttribute('style', 'margin-top:10px; text-align:left;');

    //TAMANHO    
    label = DOM.newElement('label');
    label.innerHTML = 'Tamanho ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_tamanhoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:218px; margin-left:4px');
    elemento.setAttribute('onclick', 'getDadosTamanho("i")');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Acabamento ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_acabamentoI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:190px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //MOLDURA GRUPO    
    label = DOM.newElement('label');
    label.innerHTML = 'Grupo ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_grupoMolduraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:238px; margin-left:4px');
    elemento.setAttribute('onclick', 'getMolduras(true)');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //ACABAMENTO
    label = DOM.newElement('label');
    label.innerHTML = 'Moldura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_molduraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:216px; margin-left:4px');
    elemento.setAttribute('onchange', 'getDetalhesAcabamento()');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divI.innerHTML += '<br />';

    //ALTURA
    label = DOM.newElement('label');
    label.innerHTML = 'Altura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    //label.setAttribute('style', 'margin-left:40px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_alturaI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
    elemento.setAttribute('onblur', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    //LARGURA
    label = DOM.newElement('label');
    label.innerHTML = 'Largura ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_larguraI');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
    elemento.setAttribute('onblur', 'getDetalhesAcabamento();');

    divI.appendChild(label);
    divI.appendChild(elemento);

    divCadastro.appendChild(divI);//FIM divI

    //PRODUTOS
    var divProd = DOM.newElement('div', 'o_divProdutos');
    divProd.setAttribute('style', 'margin-top:10px; text-align:left;');

    //PRODUTO    
    label = DOM.newElement('label');
    label.innerHTML = 'Produto ';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px');

    elemento = DOM.newElement('select');
    elemento.setAttribute('id', 'o_produtoProd');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:508px; margin-left:4px');
    elemento.setAttribute('onclick', 'getDadosProduto()');

    divProd.appendChild(label);
    divProd.appendChild(elemento);

    /*ACABAMENTO
     label = DOM.newElement('label');
     label.innerHTML = 'Acabamento ';
     label.setAttribute('class', 'fonte_Roboto_texto_normal');
     label.setAttribute('style', 'margin-left:8px');
     
     elemento = DOM.newElement('select');
     elemento.setAttribute('id', 'o_acabamentoI');
     elemento.setAttribute('class', 'textbox_cinzafoco');
     elemento.setAttribute("style", 'width:190px; margin-left:4px');
     elemento.setAttribute('onchange', 'getDetalhesAcabamento()');
     
     divI.appendChild(label);
     divI.appendChild(elemento);
     
     divI.innerHTML += '<br />';
     
     //ALTURA
     label = DOM.newElement('label');
     label.innerHTML = 'Altura ';
     label.setAttribute('class', 'fonte_Roboto_texto_normal');
     //label.setAttribute('style', 'margin-left:40px');
     
     elemento = DOM.newElement('text');
     elemento.setAttribute('id', 'o_alturaI');
     elemento.setAttribute('class', 'textbox_cinzafoco');
     elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
     elemento.setAttribute('onblur', 'getDetalhesAcabamento();');
     
     divI.appendChild(label);
     divI.appendChild(elemento);
     
     //LARGURA
     label = DOM.newElement('label');
     label.innerHTML = 'Largura ';
     label.setAttribute('class', 'fonte_Roboto_texto_normal');
     label.setAttribute('style', 'margin-left:6px');
     
     elemento = DOM.newElement('text');
     elemento.setAttribute('id', 'o_larguraI');
     elemento.setAttribute('class', 'textbox_cinzafoco');
     elemento.setAttribute("style", 'width:60px; margin-left:4px; background-color:#F5F5F5');
     elemento.setAttribute('onblur', 'getDetalhesAcabamento();');
     
     divI.appendChild(label);
     divI.appendChild(elemento);*/

    divCadastro.appendChild(divProd);
    //FIM divProd

    //QTDE, VALOR, DESCONTO E TOTAL
    var divTotal = DOM.newElement('div');
    divTotal.setAttribute('style', 'margin-top:8px');

    //VALOR
    label = DOM.newElement('label', 'o_lblValor');
    label.innerHTML = 'Valor';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valor');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('readonly', 'readonly');
    elemento.setAttribute("style", 'width:75px; margin-left:6px; background-color:#F5F5F5; text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //QTDE
    label = DOM.newElement('label');
    label.innerHTML = 'Qtde';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_qtde');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 1');
    elemento.setAttribute('value', '1');
    elemento.setAttribute('onblur', 'TotalizaObras(true, false, false, false)');
    elemento.setAttribute("style", 'width:35px; margin-left:4px;text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //PERCENTUAL DE DESCONTO
    label = DOM.newElement('label');
    label.innerHTML = 'Desconto';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_percDesconto');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 5,00');
    elemento.setAttribute("style", 'width:55px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, true, false, false)');

    var span = DOM.newElement('label');
    span.setAttribute('class', 'fonte_Roboto_texto_normal');
    span.innerHTML = ' % ou ';

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);
    divTotal.appendChild(span);

    //VALOR DESCONTO
    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorDesconto');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 200,00');
    elemento.setAttribute("style", 'width:73px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, false, true, false)');

    divTotal.appendChild(elemento);

    //ACRESCIMO
    label = DOM.newElement('label');
    label.innerHTML = 'Acréscimo';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:6px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorAcrescimo');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('placeHolder', 'Ex.: 5,00');
    elemento.setAttribute("style", 'width:73px; margin-left:4px; text-align:center;');
    elemento.setAttribute('onblur', 'TotalizaObras(false, false, false, true)');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    divTotal.innerHTML += '<br />';

    //VALOR TOTAL
    label = DOM.newElement('label', 'o_lblValorTotal');
    label.innerHTML = 'Valor Total';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px;');

    elemento = DOM.newElement('text');
    elemento.setAttribute('id', 'o_valorTotal');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute('readonly', 'readonly');
    elemento.setAttribute("style", 'width:100px; margin-left:4px; font-size:16px; font-weight:bold; background-color:#F5F5F5; text-align:center;');

    divTotal.appendChild(label);
    divTotal.appendChild(elemento);

    //PESO APROXIMADO
    label = DOM.newElement('label', 'o_lblPeso');
    label.innerHTML = '';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:8px; color:#0A4ADF; font-weight:bold');
    divTotal.appendChild(label);

    divCadastro.appendChild(divTotal);

    //OBS
    /*label = DOM.newElement('label');
    label.innerHTML = 'Observações';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'margin-left:0px;');

    elemento = DOM.newElement('textarea');
    elemento.setAttribute('id', 'o_obs');
    elemento.setAttribute('placeHolder', 'Informe detalhes referente a venda da obra');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:560px; height:40px;');

    divCadastro.appendChild(label);
    divCadastro.appendChild(elemento);*/

    //IMAGEM OBRA
    var divImg = DOM.newElement('div');
    divImg.setAttribute('style', 'text-align:center;');

    elemento = DOM.newElement('img');
    elemento.setAttribute('id', 'o_imagem');
    elemento.setAttribute('src', '../imagens/semarte.png');
    elemento.setAttribute('class', 'textbox_cinzafoco');
    elemento.setAttribute("style", 'width:auto; max-width:170px; height:auto; max-height:100px;');
    elemento.setAttribute("name", '');

    divImg.appendChild(elemento);

    divCadastro.appendChild(divImg);

    divI.innerHTML += '<br />';

    var divIncluirImagem = DOM.newElement('div', 'divIncluirImagem');
    divIncluirImagem.setAttribute('style', 'text-align:center; width:100px; margin:0 auto; display:none;');

    label = DOM.newElement('label', 'lblIncluirImagem');
    label.innerHTML = 'Incluir Imagem';
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; text-decoration:underline; text-align:center;');
    label.setAttribute('onclick', 'AnexarImagem()');

    divIncluirImagem.appendChild(label);
    divCadastro.appendChild(divIncluirImagem);

    var divElem = DOM.newElement('div');
    divElem.setAttribute('style', 'vertical-align: middle; float:right; padding-top:7px');

    label = DOM.newElement('label', 'e_lblCancelar');
    label.setAttribute('class', 'fonte_Roboto_texto_normal');
    label.setAttribute('style', 'cursor:pointer; vertical-align:middle');
    label.setAttribute('onclick', 'Selector.$("divCadastro").setAttribute("class", "divbranca"); dialogoCadastro.Close();');
    label.innerHTML = 'Cancelar';
    divElem.appendChild(label);

    divCadastro.appendChild(divElem);

    //BOTÃO SALVAR
    elemento = DOM.newElement('button', 'o_botIncluir');
    elemento.setAttribute('class', 'botaosimplesfoco');
    elemento.setAttribute('style', 'margin-right: 5px; float:right;');
    elemento.setAttribute('onclick', 'IncluirObra(' + codigo + ')');
    elemento.innerHTML = "Incluir";

    divCadastro.appendChild(elemento);

    dialogoCadastro = new caixaDialogo('divCadastro', 470, 620, '../padrao/', 130);
    dialogoCadastro.Show();
    dialogoCadastro.HideCloseIcon();

    Selector.$('divCadastro').setAttribute('class', 'divbranca');
    Selector.$('divCadastro').style.overflow = 'hidden';

    Mask.setMoeda(Selector.$('o_percDesconto'));
    Mask.setMoeda(Selector.$('o_valorDesconto'));
    Mask.setMoeda(Selector.$('o_valorAcrescimo'));

    getArtistas(Selector.$('o_artista'), 'Selecione um artista', true);
    Select.AddItem(Selector.$('o_obra'), 'Selecione um artista para carregar', 0);
    Select.AddItem(Selector.$('o_tamanho'), 'Selecione uma obra para carregar', 0);
    getAcabamentos(Selector.$('o_acabamento'), 'Selecione um acabamento', true, 'p');

    getTamanhos(Selector.$('o_tamanhoI'), 'Selecione um tamanho', true);
    getAcabamentos(Selector.$('o_acabamentoI'), 'Selecione um acabamento', true, 'i');

    getGruposMolduras(Selector.$('o_grupoMoldura'), 'Selecione um grupo', true);
    Select.AddItem(Selector.$('o_moldura'), 'Selecione um grupo', 0);
    Selector.$('o_grupoMoldura').name = '0';

    getGruposMolduras(Selector.$('o_grupoMolduraI'), 'Selecione um grupo', true);
    Select.AddItem(Selector.$('o_molduraI'), 'Selecione um grupo', 0);
    Selector.$('o_grupoMolduraI').name = '0';

    getProdutos(Selector.$('o_produtoProd'), 'Selecione um produto', true);

    AlternaTipoObrasPrincipal();

    Selector.$('o_artista').focus();
}

function getMolduras(ascinc) {
    var cmb = (Selector.$('o_optPhoto').checked ? Selector.$('o_grupoMoldura') : Selector.$('o_grupoMolduraI'));
    var cmbMoldura = (Selector.$('o_optPhoto').checked ? Selector.$('o_moldura') : Selector.$('o_molduraI'));

    if (cmb.selectedIndex <= 0) {
        Select.Clear(cmbMoldura);
        Select.AddItem(cmbMoldura, 'Selecione um grupo', 0);
    }

    if (cmb.value != cmb.name) {
        cmb.name = cmb.value;

        getMoldurasObras(cmbMoldura, 'Selecione uma moldura...', ascinc, cmb.value, Selector.$('o_optPhoto').checked);
        getDetalhesAcabamento();
    }
}

function AlternaTipoObrasPrincipal() {

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

    if (Selector.$('o_optPhoto').checked) {
        Selector.$('o_divPhotoarts').style.display = 'block';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'none';

        //Selector.$('divCadastro').style.height = "430px";
        dialogoCadastro.Realinhar(470, 620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (430 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_artista').focus();
        getTamanhosObras(true);
        Selector.$('o_imagem').style.display = 'block';
        Selector.$('o_imagem').style.margin = '0px auto';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else if (Selector.$('o_optInsta').checked) {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'block';
        Selector.$('o_divProdutos').style.display = 'none';

        //Selector.$('divCadastro').style.height = "270px";
        dialogoCadastro.Realinhar(310, 620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (270 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_tamanhoI').focus();
        Selector.$('o_imagem').src = './../imagens/semarte.png';
        Selector.$('o_imagem').style.display = 'none';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
    else {
        Selector.$('o_divPhotoarts').style.display = 'none';
        Selector.$('o_divInstaarts').style.display = 'none';
        Selector.$('o_divProdutos').style.display = 'block';

        //Selector.$('divCadastro').style.height = "240px";
        dialogoCadastro.Realinhar(240, 620);

        /*Selector.$('divCadastro').style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (240 / 2)) - 0) + 'px';
        Selector.$('divCadastro').style.left = ((document.documentElement.clientWidth / 2) - (620 / 2)) + "px";*/

        Selector.$('o_produtoProd').focus();
        Selector.$('o_imagem').src = './../imagens/semarte.png';
        Selector.$('o_imagem').style.display = 'none';
        Selector.$('divIncluirImagem').style.display = 'none';
    }
}