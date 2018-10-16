ValidarSessao();

window.onload = function(){

	CarregarDadosUsuario();
	CarregarGalerias(Selector.$('galerias'), "Selecione uma galeria", false);
	Select.Show(Selector.$('galerias'), Selector.$('nomeGaleria').name);

	gridEstoque = new Table('gridEstoque');
    gridEstoque.table.setAttribute('cellpadding', '5');
    gridEstoque.table.setAttribute('cellspacing', '0');
    gridEstoque.table.setAttribute('class', 'tabela_cinza_foco');

    gridEstoque.addHeader([
        DOM.newText('Galeria'),
        DOM.newText('Artista'),
        DOM.newText('Obra/Produto'),
        DOM.newText('Tamanho'),
        DOM.newText('Acabamento'),
        DOM.newText('Valor'),
        DOM.newText('Qtde'),
        DOM.newText('Imagem')
    ]);

    Selector.$('tabela').appendChild(gridEstoque.table);
    Pesquisar();
}

function Pesquisar(){	
	
	var ajax = new Ajax('POST', 'php/consultar-estoque.php', true);
	var p = 'action=Pesquisar';
	p+= '&galeria=' + Selector.$('galerias').value;
	p+= '&busca=' + Selector.$('busca').value;

	ajax.ajax.onreadystatechange = function(){

		if(!ajax.isStateOK()){
			return;
		}
		
		gridEstoque.clearRows();
		
		if(ajax.getResponseText() == '0'){
			return;
		}

		var json = JSON.parse(ajax.getResponseText());
		var imagem;				

		for(var i = 0; i < json.length; i++){

			if(json[i].tipoProduto == 'Produtos'){
				imagem = DOM.newElement('label');
			}else{
				imagem = DOM.newElement('img');
				imagem.setAttribute('src', './../imagens/obras/mini_' + json[i].imagem);
				imagem.setAttribute('style', 'width:60px; height:auto; cursor:pointer');
				imagem.setAttribute('onclick', 'AbrirImagem("' + json[i].imagem + '")');
			}

			gridEstoque.addRow([
				DOM.newText(json[i].loja),
				DOM.newText(json[i].artista),
				DOM.newText(json[i].obraProduto),
				DOM.newText(json[i].tamanho),
				DOM.newText(json[i].acabamento),
				DOM.newText(json[i].valor),
				DOM.newText(json[i].qtd),
				imagem,
			]);

			gridEstoque.setRowData(gridEstoque.getRowCount() - 1, json[i].idEstoqueProduto);
			gridEstoque.getCell(gridEstoque.getRowCount() - 1, 0).setAttribute('style', 'border:none; text-align:left;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 1).setAttribute('style', 'border:none; text-align:left;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 2).setAttribute('style', 'border:none; text-align:left;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 3).setAttribute('style', 'border:none; text-align:center;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 4).setAttribute('style', 'border:none; text-align:left;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 5).setAttribute('style', 'border:none; text-align:right;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 6).setAttribute('style', 'border:none; text-align:center; width:100px;');
            gridEstoque.getCell(gridEstoque.getRowCount() - 1, 7).setAttribute('style', 'border:none; text-align:center; width:60px;');
		}

		pintaLinhaGrid(gridEstoque);
	};

	ajax.Request(p);
}

function AbrirImagem(imagem){

	if (!isElement('div', 'divImagem')) {
        var div = DOM.newElement('div', 'divImagem');
        document.body.appendChild(div);
    }

    var divImagem = Selector.$('divImagem');
    divImagem.innerHTML = '';	

    var img = DOM.newElement('img', 'imagemDialogo');
    img.setAttribute('src', './../imagens/obras/' + imagem);
    img.setAttribute('style', 'height:100%');

    divImagem.appendChild(img);
	
    dialogoImagem = new caixaDialogo('divImagem', 600, 1250, '../padrao/', 141);
    dialogoImagem.Show();    
	
	divImagem.style.textAlign = 'center';
	//divImagem.style.clientWidth = Selector.$('imagemDialogo').clientWidth;
}