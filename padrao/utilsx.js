/*
 * String
 * Number
 * Date
 * Selector
 * Screen
 * Point
 * Tab
 * MenuBar
 * Menu
 * DOM
 * DragDrop
 * Dialog
 * Ajax
 * Server
 * Select
 * Mask
 * Table
 * Window
 * Cookies
 */

/****************************************************************** // String // ******************************************************************/

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
}

String.prototype.ltrim = function() {
    return this.replace(/^\s+/, '');
}

String.prototype.rtrim = function() {
    return this.replace(/\s+$/, '');
}

String.validateEmail = function(email) {
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

/****************************************************************** // Number // ******************************************************************/

Number.isNumber = function(text) {
    if (text.trim() === '' || isNaN(Number.getFloat(text).toString()) || Number.Filter(text, '.,') === '')
        return false;

    return true;
}

Number.Show = function(number) {
    var valor;

    if (typeof(number) == 'number')
        valor = number;
    else
        valor = Number.getFloat(number);

    if (valor === 0)
        return '0,00';

    var temp = new String(valor);

    if (temp.indexOf(".") < 0) {
        temp += ".00";
    } else {
        var pos = temp.length - temp.indexOf(".");

        if (pos != 3) {
            temp += '0';
        }
    }

    temp = temp.substr(0, temp.length - 3) + ',' + temp.substr(temp.length - 2, temp.length - 1);
    return temp;
}

Number.parseFloat = function(texto) {
    if (Number.Filter(texto, '') === '')
        return 0.0;

    texto = texto.toString().replace('.', '');

    texto = texto.replace();

    var temp = Number.Filter(texto, ",.");

    var found = false;
    var numero = '';

    for (var i = temp.length - 1; i >= 0; i--)
        if ((temp[i] === '.' || temp[i] === ',') && !found) {
            found = true;
            numero = '.' + numero;
        }
        else {
            numero = temp[i] + numero;
        }

    return parseFloat(numero);
}

Number.getFloat = function(texto) {
    if (Number.Filter(texto, '') === '')
        return 0.0;

    var temp = Number.Filter(texto, ",.");

    var found = false;
    var numero = '';

    for (var i = temp.length - 1; i >= 0; i--)
        if ((temp[i] === '.' || temp[i] === ',') && !found) {
            found = true;
            numero = '.' + numero;
        }
        else {
            numero = temp[i] + numero;
        }

    return parseFloat(numero);
}

Number.FormatDinheiro = function(valor) {

    valor = valor.toFixed(2);
    
    var teste = valor.toString().split('.');

    if (teste.length === 1) {
        valor += '.00';
    }
    else {
        if (teste[1].length < 2) {
            valor += '0';
        }
    }

    valor = valor.toString().replace('.', '');

    var tmp = valor + '';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");

    if (tmp.length > 6)
        tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    return tmp;

};

Number.Filter = function(text, others) {
    var numeros = "12334567890";

    if (others)
        numeros += others;

    var temp = '';

    for (var i = 0; i < text.length; i++)
        if (numeros.indexOf(text[i]) >= 0)
            temp += text[i];

    return temp;
}

Number.Arredonda = function(valor, casas) {
    var novo = Math.round(valor * Math.pow(10, casas)) / Math.pow(10, casas);

    return novo;
}

Number.Complete = function(frase, tamanho, letra, esquerda) {

    if (frase.toString().length >= tamanho) {
        return frase;
    }

    var total = parseInt(tamanho) - parseInt(frase.toString().length);

    var resto = "";
    for (var x = 1; x <= total; x++) {
        resto += letra;
    }

    if (esquerda) {
        frase = resto + frase;
    } else {
        frase += resto;
    }

    return frase;

}

Number.FormatMoeda = function(valor) {

    if (valor == '') {
        return '0,00';
    }

    var temp = valor.replace('.', ',');

    if (temp.substr(temp.length - 3, 1) == ',') {
        temp;
    } else if (temp.substr(temp.length - 2, 1) == ',') {
        temp = temp + '0';
    } else if (temp.substr(temp.length - 1, 1) == ',') {
        temp = temp + '00';
    } else {
        temp = temp + ',00';
    }

    var Total = parseInt(temp.length);
    var TotalLen = parseInt(temp.length) / 3;
    var TotalLenX = parseInt(parseInt(temp.length) / 3);

    var Texto = temp.substr(temp.length - 3, 3);
    var Contar = 0;

    if (TotalLenX > 0) {
        var vetor = temp.split('', temp.length);

        for (var x = vetor.length - 4; x >= 0; x--) {
            if (x >= 0) {
                Contar++;
                Texto = vetor[x] + Texto;
                if (Contar == 3 && x != 0) {
                    Contar = 0;
                    Texto = '.' + Texto;
                }
            }
        }
    } else {
        return temp;
    }

    return Texto;
}

Number.FormatMoney = function(valor) {
    
    
    
    if (valor == '') {
        return '0,00';
    }

    var temp = valor.replace('.', ',');

    if (temp.substr(temp.length - 3, 1) == ',') {
        temp;
    } else if (temp.substr(temp.length - 2, 1) == ',') {
        temp = temp + '0';
    } else if (temp.substr(temp.length - 1, 1) == ',') {
        temp = temp + '00';
    } else {
        temp = temp + ',00';
    }

    var Total = parseInt(temp.length);
    var TotalLen = parseInt(temp.length) / 3;
    var TotalLenX = parseInt(parseInt(temp.length) / 3);

    var Texto = temp.substr(temp.length - 3, 3);
    var Contar = 0;

    if (TotalLenX > 0) {
        var vetor = temp.split('', temp.length);

        for (var x = vetor.length - 4; x >= 0; x--) {
            if (x >= 0) {
                Contar++;
                Texto = vetor[x] + Texto;
                if (Contar == 3 && x != 0) {
                    Contar = 0;
                    Texto = '.' + Texto;
                }
            }
        }
    } else {
        return temp;
    }

    return Texto;
}
/****************************************************************** // Date // ******************************************************************/

Date.isDate = function(data) {
    if (data.length < 10)
        return false;

    if (Number.Filter(data) === '')
        return false;

    var dia = (data.substr(0, 2));
    var mes = (data.substr(3, 2));
    var ano = (data.substr(6, 4));

    if (dia < 1 || dia > 31)
        return false;


    if (mes < 01 || mes > 12)
        return false;


    if ((mes === 2 || mes === 4 || mes === 6 || mes === 9 || mes === 11) && dia > 30)
        return false;

    var bissexto = false;

    if (ano % 4 === 0 && (ano % 400 === 0 || ano % 100 !== 0))
        bissexto = true;

    if (!bissexto && mes === 2 && dia > 28)
        return false;

    if (bissexto && mes === 2 && dia > 29)
        return false;

    return true;
}

Date.ShowDDMMYYYY = function(date) {
    if (date == '' || date == null)
        return '';

    var temp;
    temp = date.substr(8, 2) + '/' + date.substr(5, 2) + '/' + date.substr(0, 4);

    if (date.length > 10)
        temp += ' ' + date.substr(11, 2) + ':' + date.substr(14, 2) + ':' + date.substr(17, 2);

    if (Date.isDate(temp))
        return temp;
    else
        return '';
}

Date.ConvertToString = function(date, getHours) {
    return Date.FormatDDMMYYYY(date, getHours);
}

Date.AddDate = function(ItemType, DateToWorkOn, ValueToBeAdded) {
    switch (ItemType)
    {
        case 'd':
            DateToWorkOn.setDate(DateToWorkOn.getDate() + ValueToBeAdded);
            break;

        case 'm':
            var dia = DateToWorkOn.getDate();
            var mes = DateToWorkOn.getMonth() + 1;
            var ano = DateToWorkOn.getFullYear();
            var hora = DateToWorkOn.getHours();
            var minutos = DateToWorkOn.getMinutes();
            var segundos = DateToWorkOn.getSeconds();

            for (var i = 0; i < ValueToBeAdded; i++)
            {
                mes++;

                if (mes > 12)
                {
                    mes = 1;
                    ano++;
                }
            }

            var sDia = '';
            var sMes = '';

            if (dia < 10)
                sDia = '0' + dia;
            else
                sDia = dia.toString();

            if (mes < 10)
                sMes = '0' + mes;
            else
                sMes = mes.toString();

            var temp = Date.ConvertToDate(Date.AjustaData(sDia + '/' + sMes + '/' + ano));
            DateToWorkOn = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate(), hora, minutos, segundos);

            break;

        case 'y':
            DateToWorkOn.setYear(DateToWorkOn.getFullYear() + ValueToBeAdded);
            break;

        case 'h':
            DateToWorkOn.setHours(DateToWorkOn.getHours() + ValueToBeAdded);
            break;

        case 'n':
            DateToWorkOn.setMinutes(DateToWorkOn.getMinutes() + ValueToBeAdded);
            break;

        case 's':
            DateToWorkOn.setSeconds(DateToWorkOn.getSeconds() + ValueToBeAdded);
            break;
    }

    return DateToWorkOn;
}

Date.ConvertToDate = function(stringData) {
    var dia = parseFloat(stringData.substr(0, 2));
    var mes = parseFloat(stringData.substr(3, 2));
    var ano = parseFloat(stringData.substr(6, 4));

    if (stringData.length > 10) {
        var horas = parseInt(stringData.substr(11, 2));
        var minutos = parseInt(stringData.substr(14, 2));
        var segundos = parseInt(stringData.substr(17, 2));

        return new Date(ano, mes - 1, dia, horas, minutos, segundos);
    }
    else
        return new Date(ano, mes - 1, dia);
}

Date.GetDate = function(getHours) {
    return Date.FormatDDMMYYYY(new Date(), getHours);
}

Date.GetDatePlus = function( Days, getHours) {
    return Date.FormatDDMMYYYY(new Date()+Days, getHours);
}

Date.FormatDDMMYYYY = function(data, getHours) {
    var dia = data.getDate();

    if (dia < 10)
        dia = '0' + dia;

    var mes = data.getMonth() + 1;

    if (mes < 10)
        mes = '0' + mes;

    var temp = dia + '/' + mes + '/' + data.getFullYear();

    if (getHours) {
        var hora = data.getHours();

        if (hora < 10)
            hora = '0' + hora;

        var minutos = data.getMinutes();

        if (minutos < 10)
            minutos = '0' + minutos;

        var segundos = data.getSeconds();

        if (segundos < 10)
            segundos = '0' + segundos;

        temp += ' ' + hora + ':' + minutos + ':' + segundos;
    }

    return temp;
}

Date.AjustaData = function(data) {
    if (Date.isDate(data))
        return data;

    if (data.length != 8 && data.length != 10)
        return data;

    var temp = data;

    var dia = temp.substr(0, 2);
    var mes = temp.substr(3, 2);
    var ano = '';

    if (temp.length == 8)
    {
        ano = temp.substr(6, 2);

        if (parseInt(ano) > 29)
            ano = '19' + ano;
        else
            ano = '20' + ano;

        temp = dia + '/' + mes + '/' + ano;
    }
    else
        ano = data.substr(6, 4);

    if (!Date.isDate(temp))
    {
        if (parseInt(dia) > 28)
            temp = --dia + '/' + mes + '/' + ano;

        if (!Date.isDate(temp))
            temp = --dia + '/' + mes + '/' + ano;

        if (!Date.isDate(temp))
            temp = --dia + '/' + mes + '/' + ano;
    }

    if (Date.isDate(temp))
        return temp;
    else
        return data;
}

Date.setDeAte = function(de, ate, url) {

    var ajax = new Ajax('POST', url, false);

    ajax.Request('action=getDeAte');

    var json = JSON.parse(ajax.getResponseText());

    de.value = json.de;
    ate.value = json.ate;
}

/****************************************************************** // Selector // ******************************************************************/

var Selector = {
    $: function(id) {
        return document.getElementById(id);
    }
}

/****************************************************************** // Screen // ******************************************************************/

var Screen = {
    getWindowWidth: function() {
        if (document.documentElement && (document.documentElement.clientWidth > 0))
            return document.documentElement.clientWidth;
        else if (window.innerWidth)
            return window.innerWidth;
        else
            return document.body.clientWidth;
    },
    getWindowHeight: function() {
        if (window.innerHeight)
            return window.innerHeight;
        else if (document.documentElement && (document.documentElement.clientHeight > 0))
            return document.documentElement.clientHeight;
        else
            return document.body.clientHeight;
    },
    getPosition: function(target)
    {
        var left = 0;
        var top = 0;

        while (target.offsetParent) {
            left += target.offsetLeft;
            top += target.offsetTop;
            target = target.offsetParent;
        }

        left += target.offsetLeft;
        top += target.offsetTop;

        return new Point(left, top);
    },
    getMouseCoords: function(ev)
    {
        if (ev.pageX || ev.pageY)
            return new Point(ev.pageX, ev.pageY);
        else
            return new Point(
                    ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    ev.clientY + document.body.scrollTop - document.body.clientTop);
    },
    getMouseOffset: function(target, ev) {
        ev = ev || window.event;

        var docPos = Screen.getPosition(target);
        var mousePos = Screen.getMouseCoords(ev);
        return new Point(mousePos.x - docPos.x, mousePos.y - docPos.y);
    }
}

/****************************************************************** // Point // ******************************************************************/

Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.getPoint = function() {
        return this;
    }
}

/****************************************************************** // Tab // ******************************************************************/

Tab = function() {
    this.divTab = DOM.newElement('div', 'divTab');
    this.divTab.style.padding = '2px';
    this.divTab.style.border = 'solid black 1px';

    this.divTabs = DOM.newElement('div', 'divTabs');
    this.divTabs.style.height = '20px';
    this.divTabs.style.padding = '7px 0 7px 0';

    this.divBody = DOM.newElement('div', 'divBody');

    this.divTab.appendChild(this.divTabs);
    this.divTab.appendChild(this.divBody);

    this.activeTab = -1;

    this.addTab = function(text, divBody) {
        divBody.style.display = 'none';

        var a = DOM.newElement('a');
        a.setAttribute('href', '#');
        a.style.padding = '5px 20px 5px 20px';
        a.style.marginRight = '5px';
        a.style.textDecoration = 'none';
        a.Tab = this;
        a.tabIndex = this.getTabCount();
        a.onclick = function() {
            this.Tab.setActiveTab(this.tabIndex);
        }
        a.appendChild(DOM.newText(text));

        this.divTabs.appendChild(a);
        this.divBody.appendChild(divBody);

        if (this.getTabCount() == 1)
            this.setActiveTab(0);
    }

    this.getTabCount = function() {
        return this.divTabs.childNodes.length;
    }

    this.setActiveTab = function(tab) {
        if (tab > this.getTabCount() - 1)
            return;

        for (var i = 0; i < this.getTabCount(); i++)
        {
            this.divTabs.childNodes[i].style.backgroundColor = '#fff';
            this.divBody.childNodes[i].style.display = 'none';
        }

        this.activeTab = tab;
        this.divTabs.childNodes[this.activeTab].style.backgroundColor = '#bff';
        this.divBody.childNodes[this.activeTab].style.display = 'block';
    }

    this.setPosition = function(x, y) {
        this.divTab.style.position = 'absolute';
        this.divTab.style.left = x + 'px';
        this.divTab.style.top = y + 'px';
    }

    this.getActiveTab = function() {
        return this.activeTab;
    }

    this.getTabPanelStyle = function() {
        return this.divTab.style;
    }

    this.getTabStyle = function(index) {
        return this.divTabs.childNodes[index].style;
    }

    this.setTabPanelClass = function(className) {
        //this.divTab.class = className;
        this.divTab.className = className;
    }

    this.setTabClass = function(index, className) {
        //this.divTabs.childNodes[index].class = className;
        this.divTabs.childNodes[index].className = className;
    }
}

/****************************************************************** // MenuBar // ******************************************************************/

MenuBar = function(id) {
    this.menuItems = document.createElement('ul');
    this.menuItems.className = 'cssMenu cssMenum';

    this.addMenu = function(menu) {
        menu.menuItem.style.styleFloat = 'left';
        this.menuItems.appendChild(menu.menuItem);
    }
}

/****************************************************************** // Menu // ******************************************************************/

Menu = function(id, text, action) {
    this.aMenuItem = document.createElement('a');
    this.aMenuItem.setAttribute('href', '#');
    this.aMenuItem.className = 'cssMenui';
    this.aMenuItem.appendChild(document.createTextNode(text));

    this.menuItem = document.createElement('li');
    this.menuItem.setAttribute('id', id);
    this.menuItem.appendChild(this.aMenuItem);
    this.menuItem.className = 'cssMenui';

    this.subMenuItem = null;

    if (action)
        this.menuItem.onclick = action;

    this.addSubMenu = function(menu) {
        if (this.subMenuItem == null) {
            var span = document.createElement('span');
            span.appendChild(this.aMenuItem.childNodes[0]);
            this.aMenuItem.appendChild(span);

            this.subMenuItem = document.createElement('ul');
            this.subMenuItem.className = 'cssMenum';
            this.menuItem.appendChild(this.subMenuItem);
        }

        this.subMenuItem.appendChild(menu.menuItem);
    }
}

Menu.setURL = function(url) {
    window.location = url;
}

/****************************************************************** // DOM (Documento Object Model) // ******************************************************************/

var DOM = {
    newText: function(text) {
        return document.createTextNode(text);
    },
    newElement: function(type, id) {
        var obj = null;

        if (type == 'text' || type == 'password' || type == 'radio' ||
                type == 'checkbox' || type == 'file' || type == 'form.button' ||
                type == 'image' || type == 'submit') {

            obj = document.createElement('input');
            obj.setAttribute('type', type.replace('form.', ''));
        }
        else
            obj = document.createElement(type);

        if (id)
            obj.setAttribute('id', id);

        return obj;
    }
}

/****************************************************************** // DragDrop // ******************************************************************/

var DragDrop = {
    obj: null,
    tempOnMouseMove: null,
    tempOnMouseUp: null,
    init: function(obj, ev) {
        var mousePos = Screen.getMouseCoords(window.event || ev);

        DragDrop.obj = obj;
        DragDrop.obj.lastMouseX = mousePos.x;
        DragDrop.obj.lastMouseY = mousePos.y;

        DragDrop.tempOnMouseMove = document.onmousemove;
        DragDrop.tempOnMouseUp = document.onmouseup;
        document.onmouseup = DragDrop.document_OnMouseUp;
        document.onmousemove = DragDrop.document_OnMouseMove;
    },
    document_OnMouseUp: function() {
        DragDrop.obj = null;
        document.onmousemove = DragDrop.tempOnMouseMove;
        document.onmouseup = DragDrop.tempOnMouseUp;

        DragDrop.tempOnMouseMove = null;
        DragDrop.tempOnMouseUp = null;
    },
    document_OnMouseMove: function(ev)
    {
        if (DragDrop.obj != null)
        {

            var objPos = Screen.getPosition(DragDrop.obj);
            var x = objPos.x;
            var y = objPos.y;

            var mousePos = Screen.getMouseCoords(ev || window.event);

            DragDrop.obj.style.left = (x + mousePos.x - DragDrop.obj.lastMouseX) + 'px';
            DragDrop.obj.style.top = (y + mousePos.y - DragDrop.obj.lastMouseY) + 'px';

            DragDrop.obj.lastMouseX = mousePos.x;
            DragDrop.obj.lastMouseY = mousePos.y;
        }
    }
}

/****************************************************************** // Dialog // ******************************************************************/

DialogBox = function(div)
{

    /************* // Bloqueio // *************/

    this.divBlock = document.createElement('div');
    this.divBlock.style.visibility = 'hidden';
    this.divBlock.style.position = 'absolute';
    this.divBlock.style.backgroundColor = '#000000';
    this.divBlock.style.left = '0px';
    this.divBlock.style.top = '0px';
    // this.divBlock.style.width = Window.getSize(false);
    // this.divBlock.style.height = Window.getSize(true);
    this.divBlock.style.width = '100%';
    this.divBlock.style.height = '100%';
    this.divBlock.style.filter = 'alpha(opacity=60)';
    this.divBlock.style.opacity = 0.2;
    this.divBlock.style.cursor = 'not-allowed';

    /************* // Titulo // *************/

    this.titleText = document.createTextNode('');

    this.divTitleText = document.createElement('div');
    this.divTitleText.setAttribute('id', 'divTitleText');
    this.divTitleText.style.paddingTop = '8px';
    this.divTitleText.style.paddingLeft = '3px';
    this.divTitleText.appendChild(this.titleText);

    this.divTitleE = document.createElement('div');
    this.divTitleE.setAttribute('id', 'divTitleE');
    this.divTitleE.style.backgroundImage = 'url(' + DialogBox.imagePath + 'dialogTL.png)';
    this.divTitleE.style.backgroundRepeat = 'no-repeat';
    this.divTitleE.style.backgroundPosition = 'left top';
    this.divTitleE.style.width = '10px';
    this.divTitleE.style.height = '30px';
    this.divTitleE.style.cssFloat = 'left';
    this.divTitleE.style.styleFloat = 'left';

    this.divTitleM = document.createElement('div');
    this.divTitleM.setAttribute('id', 'divTitleM');
    this.divTitleM.style.backgroundImage = 'url(' + DialogBox.imagePath + 'dialogTM.png)';
    this.divTitleM.style.fontSize = '10pt';
    this.divTitleM.style.fontWeight = 'bold';
    this.divTitleM.style.whiteSpace = 'nowrap';
    this.divTitleM.style.height = '30px';
    this.divTitleM.appendChild(this.divTitleText);

    this.divTitleD = document.createElement('div');
    this.divTitleD.setAttribute('id', 'divTitleD');
    this.divTitleD.style.backgroundImage = 'url(' + DialogBox.imagePath + 'dialogTR.png)';
    this.divTitleD.style.backgroundRepeat = 'no-repeat';
    this.divTitleD.style.backgroundPosition = 'right top';
    this.divTitleD.style.width = '23px';
    this.divTitleD.style.height = '30px';
    this.divTitleD.style.cssFloat = 'right';
    this.divTitleD.style.styleFloat = 'right';

    this.divClose = document.createElement('div');
    this.divClose.setAttribute('id', 'divClose');
    this.divClose.setAttribute('title', 'Fechar');
    this.divClose.style.backgroundImage = 'url(' + DialogBox.imagePath + 'window_close1.png)';
    this.divClose.style.backgroundRepeat = 'no-repeat';
    this.divClose.style.width = '12px';
    this.divClose.style.height = '11px';
    this.divClose.style.marginTop = '10px';
    this.divClose.style.cursor = 'pointer';
    this.divClose.dialogBox = this;
    this.divClose.onclick = function() {
        this.dialogBox.Close();
    };
    this.divTitleD.appendChild(this.divClose);

    this.divTitle = document.createElement('div');
    this.divTitle.setAttribute('id', 'divTitle');
    this.divTitle.style.height = '30px';
    this.divTitle.style.cursor = 'move';
    this.divTitle.style.color = '#000000';
    this.divTitle.onmousedown = function(ev) {
        DragDrop.init(this.parentNode, ev);
    }

    this.divTitle.appendChild(this.divTitleE);
    this.divTitle.appendChild(this.divTitleD);
    this.divTitle.appendChild(this.divTitleM);

    /************* // Corpo // *************/

    this.divBody = document.createElement('div');
    this.divBody.setAttribute('id', 'divBody');
    this.divBody.style.borderTop = '1px solid #000000';
    this.divBody.style.borderRight = '1px solid #000000';
    this.divBody.style.borderBottom = '1px solid #000000';
    this.divBody.style.borderLeft = '1px solid #000000';
    this.divBody.style.backgroundColor = '#Fbfbfb';
    this.divBody.style.padding = '16px';
    this.divBody.appendChild(div);

    /************* // Container // *************/

    this.divMain = document.createElement('div');
    this.divMain.setAttribute('id', 'divMain');
    this.divMain.style.visibility = 'hidden';
    this.divMain.style.position = 'absolute';
    this.divMain.style.borderBottom = '1px solid #000';
    this.divMain.appendChild(this.divTitle);
    this.divMain.appendChild(this.divBody);

    /************* // M�todos // *************/

    document.body.appendChild(this.divBlock);
    document.body.appendChild(this.divMain);

    this.Show = function()
    {
        this.divBlock.style.visibility = 'visible';
        this.divMain.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        scroll(0, 0);
        //dialog.setPosition(-1,100);
    }

    this.setzIndexBlock = function(index)
    {
        this.divBlock.style.zIndex = index;
        this.divMain.style.zIndex = index + 1;
    }

    this.setOpacityBlock = function(transparencia)
    {
        this.divBlock.style.filter = 'alpha(opacity=' + transparencia + ')';
        this.divBlock.style.opacity = (transparencia / 100);
    }

    this.setColorBlock = function(cor)
    {
        this.divBlock.style.backgroundColor = cor;
    }

    this.Close = function()
    {
        this.divBlock.style.visibility = 'hidden';
        this.divMain.style.visibility = 'hidden';
        this.divClose.style.visibility = 'hidden';
        document.body.style.overflow = 'visible';
    }

    this.setPosition = function(x, y)
    {
        if (x == -1)
            x = Math.round((Screen.getWindowWidth() - this.divMain.offsetWidth) / 2);
        if (y == -1)
            y = Math.round((Screen.getWindowHeight() - this.divMain.offsetHeight) / 2) + document.body.scrollTop;

        this.divMain.style.left = x + 'px';
        this.divMain.style.top = y + 'px';
    }

    this.setSize = function(width, height)
    {
        this.divMain.style.width = width + 'px';
        this.divMain.style.height = height + 'px';
    }

    this.setTitle = function(text)
    {
        this.titleText.data = text;
    }

    this.HideCloseIcon = function() {
        this.divClose.style.visibility = 'hidden';
    }

    this.ShowCloseIcon = function() {
        this.divClose.style.visibility = 'visible';
    }

    DialogBox.imagePath = './imagens/';
}


/****************************************************************** // Server // ******************************************************************/

var Server = {
    CheckSession: function(url) {
        var ajax = new Ajax('POST', url, false);
        ajax.Request('action=CheckSession');

        if (ajax.getResponseText() == -1) {
            return false;
        }
        else if (ajax.getResponseText() == '') {
            return false;
        }
        else if (ajax.getResponseText() == 'erro') {
            return false;
        }
        else {
            return true;
        }
    },
    CheckSessionA: function(url) {
        var ajax = new Ajax('POST', url, true);

        ajax.onreadystatechange = function() {
            if (!ajax.isStateOK()) {
                return;
            }

            if (ajax.getResponseText() == -1) {
                return false;
            }
            else if (ajax.getResponseText() == '') {
                return false;
            }
            else if (ajax.getResponseText() == 'erro') {
                return false;
            }
            else {
                return true;
            }
        }

        ajax.Request('action=CheckSession');
    },
    DestroySession: function(url) {
        var ajax = new Ajax('POST', url, false);
        ajax.Request('action=DestroySession');
    }
}

/****************************************************************** // Ajax // ******************************************************************/

var Ajax = function(method, url, asynchronous) {
    this.method = method;
    this.url = url;
    this.asynchronous = asynchronous;
    this.funcao = '';

    this.setURL = function(url) {
        this.url = url;
    }

    this.OnReadyStateChange = function(callback) {
        this.ajax.onreadystatechange = callback;
    }

    this.CreateObject = function() {
        var xmlHttp = null;

        try {
            xmlHttp = new XMLHttpRequest();
        }
        catch (e)
        {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e)
            {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                    xmlHttp = null;
                }
            }
        }

        return xmlHttp;
    }

    this.ajax = this.CreateObject();

    this.isStateOK = function() {
        if (this.ajax.readyState == 4 && this.ajax.status == 200)
            return true;
        else
            return false;
    }

    this.Request = function(params) {
        switch (this.method.toUpperCase())
        {
            case 'POST':
                this.ajax.open(this.method, this.url, this.asynchronous);
                this.ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                this.ajax.send(params);
                break;

            case 'GET':
                this.ajax.open(this.method, this.url + '?' + params, this.asynchronous);
                this.ajax.send(null);
                break;
        }
    }

    this.getResponseText = function() {
        return this.ajax.responseText;
    }

    this.getResponseXML = function() {
        return this.ajax.responseXML;
    }

    this.Finalize = function() {
        this.ajax = null;
    }

    this.returnOK = function() {
        if (this.ajax.readyState == 4 && this.ajax.status == 200)
            return true;
        else
            return false;
    }
}

/****************************************************************** // Select // ******************************************************************/

var Select = {
    FillWithJSON: function(obj, txt, idField, nameField)
    {
        if (txt == '')
            return;

        var objJSON = JSON.parse(txt);
        var objItem = null;

        for (var i in objJSON)
        {
            Select.AddItem(obj, objJSON[i][nameField], objJSON[i][idField]);
            //objItem = document.createElement('option');
            //objItem.setAttribute('value', objJSON[i][idField]);
            //objItem.appendChild(document.createTextNode(objJSON[i][nameField]));
            //obj.appendChild(objItem);
        }
    },
    AddItem: function(obj, text, value) {
        var objItem = null;
        objItem = document.createElement('option');
        objItem.setAttribute('value', value);
        objItem.appendChild(document.createTextNode(text));
        obj.appendChild(objItem);
    },
    Clear: function(obj) {
        if (obj.childNodes.length > 0) {
            for (var i = obj.childNodes.length - 1; i >= 0; i--) {
                obj.removeChild(obj.childNodes[i]);
            }
        }
    },
    Show: function(obj, id)
    {
        for (var i = 0; i < obj.length; i++)
            if (id == obj.options[i].value)
            {
                obj.selectedIndex = i;
                return;
            }
    },
    ShowText: function(obj, Text)
    {
        for (var i = 0; i < obj.length; i++)
            if (Text == obj.options[i].text)
            {
                obj.selectedIndex = i;
                return;
            }
    },
    GetText: function(obj)
    {
        return obj.options[obj.selectedIndex].text;
    },
    SetText: function(obj, text)
    {
        return obj.options[obj.selectedIndex].text = text;
    }
}

/****************************************************************** // Mask // ******************************************************************/

var Mask = {
    setNull: function(obj) {
        //obj.maxLength = 60;
        obj.onkeypress = function(ev) {

        }
    },
    setCelular: function(obj) {
        obj.maxLength = 15;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;


            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = obj.value;

            if (temp.length == 0)
            {
                temp += '(';
                obj.value = temp;
                return true;
            }

            if (temp.length == 3)
            {
                temp += ') ';
                obj.value = temp;
                return true;
            }

            if (temp.length == 4)
            {
                temp += ' ';
                obj.value = temp;
                return true;
            }

            if (temp.length >= 4) {
                if (temp.substring(0, 4) == '(11)' || temp.substring(0, 4) == '(12)' || temp.substring(0, 4) == '(13)'
                        || temp.substring(0, 4) == '(14)' || temp.substring(0, 4) == '(15)' || temp.substring(0, 4) == '(16)'
                        || temp.substring(0, 4) == '(17)' || temp.substring(0, 4) == '(18)' || temp.substring(0, 4) == '(19)'
                        || temp.substring(0, 4) == '(21)' || temp.substring(0, 4) == '(22)' || temp.substring(0, 4) == '(24)'
                        || temp.substring(0, 4) == '(27)' || temp.substring(0, 4) == '(28)') {
                    if (temp.length == 10)
                    {
                        obj.maxLength = 15;
                        temp += '-';
                        obj.value = temp;
                        return true;
                    }
                }
                else {
                    if (temp.length == 9)
                    {
                        obj.maxLength = 14;
                        temp += '-';
                        obj.value = temp;
                        return true;
                    }
                }
            }
        }
    },
    setTelefone: function(obj) {
        obj.maxLength = 14;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = obj.value;

            if (temp.length == 0)
            {
                temp += '(';
                obj.value = temp;
                return true;
            }

            if (temp.length == 3)
            {
                temp += ') ';
                obj.value = temp;
                return true;
            }

            if (temp.length == 4)
            {
                temp += ' ';
                obj.value = temp;
                return true;
            }

            if (temp.length == 9)
            {
                temp += '-';
                obj.value = temp;
                return true;
            }
        }
    },
    setCEP: function(obj) {
        obj.maxLength = 9;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = obj.value;

            if (temp.length == 5) {
                temp += '-';
                obj.value = temp;
                return;
            }
        }
    },
    setCNPJ: function(obj) {
        obj.maxLength = 18;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = obj.value;

            if (temp.length == 2)
            {
                temp += '.';
                obj.value = temp;
                return;
            }

            if (temp.length == 6)
            {
                temp += '.';
                obj.value = temp;
                return;
            }

            if (temp.length == 10)
            {
                temp += '/';
                obj.value = temp;
                return;
            }

            if (temp.length == 15)
            {
                temp += '-';
                obj.value = temp;
                return;
            }
        }
    },
    setCPF: function(obj) {
        obj.maxLength = 14;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = obj.value;

            if (temp.length == 3)
            {
                temp += '.';
                obj.value = temp;
                return;
            }

            if (temp.length == 7)
            {
                temp += '.';
                obj.value = temp;
                return;
            }

            if (temp.length == 11)
            {
                temp += '-';
                obj.value = temp;
                return;
            }
        }
    },
    setRG: function(obj) {
        obj.maxLength = 12;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = obj.value;

            if (temp.length === 2)
            {
                temp += '.';
                obj.value = temp;
                return;
            }

            if (temp.length === 6)
            {
                temp += '.';
                obj.value = temp;
                return;
            }

            if (temp.length === 10)
            {
                temp += '-';
                obj.value = temp;
                return;
            }
        }
    },
    setMesAno: function(obj) {
        obj.maxLength = 7;

        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var mydata = obj.value;

            if (mydata.length == 2)
            {
                mydata += '/';
                obj.value = mydata;
                return;
            }
        }
    },
    setData: function(obj) {
        var temHora = false;

        if (arguments.length == 2)
            temHora = arguments[1];

        if (temHora)
            obj.maxLength = 16;
        else
            obj.maxLength = 10;

        obj.onblur = function() {
            this.value = Date.AjustaData(this.value);
        }

        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var mydata = obj.value;

            if (mydata.length == 2)
            {
                mydata += '/';
                obj.value = mydata;
                return;
            }

            if (mydata.length == 5)
            {
                mydata += '/';
                obj.value = mydata;
                return;
            }

            if (temHora)
            {
                if (mydata.length == 10)
                {
                    mydata += ' ';
                    obj.value = mydata;
                    return;
                }
                if (mydata.length == 13)
                {
                    mydata += ':';
                    obj.value = mydata;
                    return;
                }
            }

        }
    },
    setHora: function(obj, withSeconds) {
        if (withSeconds)
            obj.maxLength = 8;
        else
            obj.maxLength = 5;

        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;
                       
            var temp = obj.value;           
            
            if (temp.length == 2) {                
                temp = temp + ':';                
                obj.value = temp;
                return;
            }

            if (withSeconds) {
                if (temp.length == 5) {
                    temp = temp + ':';
                    obj.value = temp;
                    return;
                }
            }
        };
    },
    setOnlyNumbers: function(obj) {
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode === 9 || keyCode === 46 || keyCode === 8)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

        }
    },
    setCurrency: function(obj) {
        obj.style.textAlign = 'right';
        obj.maxLength = 15;
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            // permite a propaga��o do BACKSPACE mesmo
            // quando alcan�ado o tamanho m�ximo do texto
            if (keyCode !== 8)
                if (obj.value.length >= obj.maxLength)
                    return false;

            // libera as teclas BACKSPACE e TAB
            if (keyCode === 8 || keyCode === 9)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = Number.Filter(obj.value) + String.fromCharCode(keyCode);

            switch (temp.length) {
                /*case 0:
                 obj.value = ',  ';
                 break;
                 
                 case 1:
                 obj.value = ', ' + temp;
                 break;
                 
                 case 2:
                 obj.value = ',' + temp;
                 break;*/

                default:
                    temp = temp.substr(0, temp.length - 2) + ',' + temp.substr(temp.length - 2, temp.length - 1);
                    alert(temp);
                    obj.value = Number.FormatMoeda(temp);
                    break;
            }

        }
    },
    setMoeda: function(obj) {
        obj.style.textAlign = 'right';
        obj.maxLength = 15;
        obj.value = ',  ';
        obj.onkeypress = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            // permite a propaga��o do BACKSPACE mesmo
            // quando alcan�ado o tamanho m�ximo do texto
            if (keyCode !== 8)
                if (obj.value.length >= obj.maxLength)
                    return false;

            // libera as teclas BACKSPACE e TAB
            if (keyCode === 8 || keyCode === 9)
                return true;

            if (!Number.isNumber(String.fromCharCode(keyCode)))
                return false;

            var temp = Number.Filter(obj.value) + String.fromCharCode(keyCode);

            switch (temp.length)
            {
                case 0:
                    obj.value = ',  ';
                    break;

                case 1:
                    obj.value = ', ' + temp;
                    break;

                case 2:
                    obj.value = ',' + temp;
                    break;

                default:
                    temp = temp.substr(0, temp.length - 2) + ',' + temp.substr(temp.length - 2, temp.length - 1);
                    obj.value = temp;
                    break;
            }

            return false;
        }

        obj.onfocus = function() {
            if (Number.getFloat(this.value) === 0.0)
                this.value = ',  ';
        }

        obj.onkeydown = function(ev) {
            ev = window.event || ev;
            var keyCode = ev.keyCode || ev.which;

            if (keyCode != 8)
                return true;

            this.value = this.value.substr(0, this.value.length - 1);
            var temp = Number.Filter(this.value);

            switch (temp.length)
            {
                case 0:
                    this.value = ',  ';
                    break;

                case 1:
                    this.value = ', ' + temp;
                    break;

                case 2:
                    this.value = ',' + temp;
                    break;

                default:
                    temp = temp.substr(0, temp.length - 2) + ',' + temp.substr(temp.length - 2, 2);
                    this.value = temp;
                    break;
            }

            return false;
        }
    }
}

/****************************************************************** // Table // ******************************************************************/

Table = function(id) {
    this.table = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');
    this.tfoot = document.createElement('tfoot');

    this.table.setAttribute('id', id);

    this.table.appendChild(this.thead);
    this.table.appendChild(this.tbody);
    this.table.appendChild(this.tfoot);

    this.rowData = new Array();

    // adiciona cabe�alho
    this.addHeader = function(thArray) {
        var tr = document.createElement('tr');

        for (var i = 0; i < thArray.length; i++) {
            var th = document.createElement('th');
            th.appendChild(thArray[i]);
            tr.appendChild(th);
        }

        this.thead.appendChild(tr);
    }

    // adiciona linha
    this.addRow = function(tdArray) {
        var tr = document.createElement('tr');

        for (var i = 0; i < tdArray.length; i++) {
            var td = document.createElement('td');
            td.appendChild(tdArray[i]);
            tr.appendChild(td);
        }

        this.tbody.appendChild(tr);
        this.rowData.push(0);
    }

    // adiciona rodap�
    this.addFooter = function(tdArray) {
        var tr = document.createElement('tr');

        for (var i = 0; i < tdArray.length; i++) {
            var td = document.createElement('td');
            td.appendChild(tdArray[i]);
            tr.appendChild(td);
        }

        this.tfoot.appendChild(tr);
    }

    // obt�m linhas da tabela
    this.getRow = function(rowNumber) {
        return this.tbody.childNodes[rowNumber];
    }

    // obt�m quantidade de linhas da tabela
    this.getRowCount = function() {
        return this.tbody.childNodes.length;
    }
    // obt�m numero de colunas de uma linha
    this.getColCount = function(rowNumber) {
        return this.tbody.childNodes[rowNumber].childNodes.length;
    }

    // obt�m uma c�clula da tabela
    this.getCell = function(rowNumber, colNumber) {
        return this.getRow(rowNumber).childNodes[colNumber];
    }

    //OBTEM A CELULA DO CABEÇALHO, PODE-SE OCULTAR A CELULA E ETC.
    this.getHeadCell = function(colNumber) {
        return this.thead.childNodes[0].childNodes[colNumber];
    }

    this.getHeadText = function(colNumber) {
        return this.thead.childNodes[0].childNodes[colNumber].childNodes[0].data;
    }

    // obt�m o valor (texto) de uma c�lula da tabela
    this.getCellText = function(rowNumber, colNumber) {
        return this.getCell(rowNumber, colNumber).childNodes[0].data;
    }

    // obt�m o objeto dentro de uma c�lula
    this.getCellObject = function(rowNumber, colNumber) {
        return this.getCell(rowNumber, colNumber).childNodes[0];
    }

    // obt�m o valor da linha
    this.getRowData = function(rowNumber) {
        return this.rowData[rowNumber];
    }

    // define o valor da linha
    this.setRowData = function(rowNumber, value) {
        return this.rowData[rowNumber] = value;
    }

    // exclui uma linha
    this.deleteRow = function(rowNumber) {
        //alert(rowNumber);
        this.tbody.removeChild(this.getRow(rowNumber));
        this.rowData.splice(rowNumber, 1);
    }

    // define o texto de uma c�lula
    this.setCellText = function(rowNumber, colNumber, value) {
        this.getCell(rowNumber, colNumber).childNodes[0].data = value;
    }

    this.setHeadText = function(colNumber, value) {
        this.thead.childNodes[0].childNodes[colNumber].childNodes[0].data = value;
    }

    this.setHeadValue = function(colNumber, value) {
        this.thead.childNodes[0].childNodes[colNumber].childNodes[0].rowData = value;
    }

    this.setCellObject = function(rowNumber, colNumber, value) {
        if (this.getCell(rowNumber, colNumber).childNodes.length > 0)
            this.getCell(rowNumber, colNumber).removeChild(this.getCellObject(rowNumber, colNumber));

        this.getCell(rowNumber, colNumber).appendChild(value);
    }
    
    // oculta coluna
    this.hiddenCol = function(col) {
        this.getHeadCell(col).style.display = 'none';
        
        for (var i = 0;  i < this.getRowCount(); i++)
            this.getCell(i, col).style.display = 'none';
        
    }
    
    // mostra coluna
    this.visibleCol = function(col) {        
        this.getHeadCell(col).style.display = '';
        
        for (var i = 0;  i < this.getRowCount(); i++)
            this.getCell(i, col).style.display = '';
        
    }

    // limpa a tabela
    this.clearRows = function() {
        for (var i = this.getRowCount() - 1; i >= 0; i--)
            this.deleteRow(i);
    }

    // obt�m o n�mero de c�lulas selecionadas (checkbox)
    this.getSelCount = function(col) {
        var count = 0;

        for (var i = 0; i < this.getRowCount(); i++) {
            if (this.getCellObject(i, col).checked)
                count++;
        }

        return count;
    }

    // obt�m o n�mero das linhas selecionadas
    this.getSelectedRows = function(col) {
        var count = Array();

        for (var i = 0; i < this.getRowCount(); i++) {
            if (this.getCellObject(i, col).checked)
                count.push(i);
        }

        return count;
    }

    // obt�m o n�mero das linhas selecionadas
    this.getRowDataSelectedRows = function(col) {
        var count = Array();

        for (var i = 0; i < this.getRowCount(); i++) {
            if (this.getCellObject(i, col).checked)
                count.push(this.getRowData(i));
        }

        return count;
    }

    this.addColGroup = function(span, styles) {
        var colgroup = document.createElement('colgroup');
        colgroup.span = span;

        //	if (styles <> '') {
        //	colgroup.style.visibility = ;
        //}

        this.thead.appendChild(colgroup);
    }

    //soma o valor da tabela de determinada coluna
    this.SumCol = function(col) {
        var valorTotal = 0;

        for (var i = 0; i < this.getRowCount(); i++) {            
            valorTotal += Number.getFloat(this.getCellText(i, col).toString().replace('.', ''));            
        }

        return valorTotal.toFixed(2);
    }
    
     this.SumColnoFixed = function(col) {
        var valorTotal = 0;

        for (var i = 0; i < this.getRowCount(); i++) {
            valorTotal += Number.getFloat(this.getCellText(i, col).toString().replace('.', ''));
        }

        return valorTotal;
    }

    //soma o valor da tabela de determinada coluna que esteja selecionada (checked)
    this.SumColChecked = function(col) {
        var valorTotal = 0;

        for (var i = 0; i < this.getRowCount(); i++) {
            if (this.getCellObject(i, 0).checked) {
                valorTotal += Number.getFloat(this.getCellText(i, col).toString().replace('.', ''));
            }

        }

        return valorTotal.toFixed(2);
    }

    this.setRowForegroundColor = function(row, color) {
        this.getRow(row).style.color = color;
    }

    this.setRowBackgroundColor = function(row, color) {
        if (row < 0)
            return;

        for (var col = 0; col < this.getRow(row).childNodes.length; col++)
        {
            this.getCell(row, col).style.backgroundColor = color;
        }
    }
}

/****************************************************************** // Window // ******************************************************************/

var Window = {
    getParameters: function() {
        var p = window.location.search;

        if (p == '')
            return null;

        var array = p.substr(1).split('&');

        for (var i = 0; i < array.length; i++) {
            array[i] = array[i].split('=');
        }

        return array;
    },
    getParameter: function(name) {
        var p = window.location.search;

        if (p == '')
            return null;

        var array = p.substr(1).split('&');

        for (var i = 0; i < array.length; i++) {
            var arrayItem = array[i].split('=');

            if (arrayItem[0] == name)
                return arrayItem[1];
        }

        return null;
    },
    getSize: function(height) {
        var ie = /msie/i.test(navigator.userAgent);
        var ieBox = ie && (document.compatMode == null || document.compatMode == "BackCompat");
        var aux;

        var canvasEl = ieBox ? document.body : document.documentElement;

        if (height)
            aux = window.innerHeight || canvasEl.clientHeight;
        else
            aux = window.innerWidth || canvasEl.clientWidth;

        return aux;
    }
}

var Cookies = {
    setCookie: function(name, value, dias) {
        var dtmData = new Date();
        var strExpires;

        if (dias) {
            dtmData.setTime(dtmData.getTime() + (dias * 24 * 60 * 60 * 1000));
            strExpires = "; expires=" + dtmData.toGMTString();
        }
        else {
            strExpires = "";
        }

        document.cookie = name + "=" + value + strExpires + "; path=/";
    },
    getCookie: function(name) {
        var strNomeIgual = name + "=";
        var arrCookies = document.cookie.split(';');

        for (var i = 0; i < arrCookies.length; i++) {
            var strValorCookie = arrCookies[i];
            while (strValorCookie.charAt(0) == ' ') {
                strValorCookie = strValorCookie.substring(1, strValorCookie.length);
            }
            if (strValorCookie.indexOf(strNomeIgual) == 0) {
                return strValorCookie.substring(strNomeIgual.length, strValorCookie.length);
            }
        }
        return null;
    },
    delCookie: function(name) {
        this.setCookie(name, '', -1);
    }
}

var newAjax1 = {
    createObject: function() {
        var xmlHttp;

        try {
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                    return null;
                }
            }
        }
        return xmlHttp;
    }
}

function DialogUpload(div, nomeImg, path, funcao, tema) {
    div.innerHTML = '';
    DialogBox.imagePath = '/padrao/';

    //---------- FILE ----------//

    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "temp");
    iframe.setAttribute("name", "temp");
    iframe.setAttribute("width", "340");
    iframe.setAttribute("height", "405");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "frameborder: none;");

    div.appendChild(iframe);

    iframe.src = DialogBox.imagePath + 'upload.php?nome=' + nomeImg + "&path=" + path + "&funcao=" + funcao + "&tema=" + tema;

    var div1 = DOM.newElement('div', 'divFooterR');
    document.body.appendChild(div1);
    var div2 = DOM.newElement('div', 'divFooterL');
    document.body.appendChild(div2);

    dialog = new DialogBox(div);
    dialog.setTitle('Upload Imagens (Jpg, Jpeg, Gif, Png, Bmp)');
    dialog.setPosition(-1, -1);
    dialog.setSize(358, 0);

    dialog.ShowCloseIcon();
    div.style.zIndex = 100;
    dialog.Show();
}

function DialogUploadRaiz(div, nomeImg, path, funcao, tema) {

    div.innerHTML = '';
    DialogBox.imagePath = 'padrao/';

    //---------- FILE ----------//

    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "temp");
    iframe.setAttribute("name", "temp");
    iframe.setAttribute("width", "340");
    iframe.setAttribute("height", "405");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "frameborder: none;");

    div.appendChild(iframe);

    iframe.src = DialogBox.imagePath + 'upload.php?nome=' + nomeImg + "&path=" + path + "&funcao=" + funcao + "&tema=" + tema;

    var div1 = DOM.newElement('div', 'divFooterR');
    document.body.appendChild(div1);
    var div2 = DOM.newElement('div', 'divFooterL');
    document.body.appendChild(div2);

    dialog = new DialogBox(div);
    dialog.setTitle('Upload Imagens (Jpg, Jpeg, Gif, Png, Bmp)');
    dialog.setPosition(-1, -1);
    dialog.setSize(358, 0);

    dialog.ShowCloseIcon();
    div.style.zIndex = 100;
    dialog.Show();
}

function include(file_path) {
    var j = document.createElement("script");
    j.type = "text/javascript";
    j.src = file_path;
    var scripts = document.getElementsByTagName("script");
    document.getElementsByTagName('head')[0].insertBefore(j, scripts[0]);
}

function DialogUploadNovo(div, nomeImg, path, funcao, tema, imagePath , tiposdearquivos) {
 
    Selector.$(div).innerHTML = '';
    dialog = new caixaDialogo(div, 420, 440, imagePath, 1000);
    caixaDialogo.imagePath = imagePath;
    //---------- FILE ----------//
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "temp");
    iframe.setAttribute("name", "temp");
    iframe.setAttribute("width", "420");
    iframe.setAttribute("height", "420");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "frameborder: none;");
    

    Selector.$(div).appendChild(iframe);
    iframe.src = caixaDialogo.imagePath + 'upload-easy.php?nome=' + nomeImg + "&path=" + path + "&funcao=" + funcao + "&tema=" + tema + "&arquivotipo=" + tiposdearquivos;
   
    dialog.Show();
  
}

function DialogUploadProjeto(div, nomeImg, path, funcao, tema, imagePath , tiposdearquivos, pathUploadPHP) {
 
    Selector.$(div).innerHTML = '';
    dialog = new caixaDialogo(div, 420, 440, imagePath, 1000);
    caixaDialogo.imagePath = imagePath;
    //---------- FILE ----------//
    var iframe = document.createElement("iframe");
    iframe.setAttribute("id", "temp");
    iframe.setAttribute("name", "temp");
    iframe.setAttribute("width", "420");
    iframe.setAttribute("height", "420");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "frameborder: none;");
    

    Selector.$(div).appendChild(iframe);
    iframe.src = caixaDialogo.imagePath +  pathUploadPHP + '?nome=' + nomeImg + "&path=" + path + "&funcao=" + funcao + "&tema=" + tema + "&arquivotipo=" + tiposdearquivos;
   
    dialog.Show();
  
}


caixaDialogo = function(div, altura, largura, padrao, posicaoz) {

    // Bloqueio     
    this.divBlock = document.createElement('div');
    this.divBlock.setAttribute("id", "divBlock");
    this.divBlock.style.position = 'absolute';
    this.divBlock.style.backgroundColor = '#E5E5E5';
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

    if (typeof(div) == "string") {
        Selector.$(div).style.zIndex = posicaoz + 1;
    } else {
        div.style.zIndex = posicaoz + 1;
    }

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

    this.divBlock.style.top = scrollY + 'px';
    // document.body.style.overflow = 'hidden';

    this.divFechar = document.createElement('div');
    this.divFechar.setAttribute('id', 'divClose');
    this.divFechar.setAttribute('title', 'Fechar');
    this.divFechar.style.position = 'absolute';
    this.divFechar.setAttribute('class', 'efeito-opacidade-75-01');
    this.divFechar.setAttribute('style', 'height:37px; width:37px; background-repeat:no-repeat; background-image:url(' + padrao + 'imagens/fechar.png); position: absolute; visibility: hidden');
    this.divFechar.style.zIndex = posicaoz + 1;
    this.divFechar.caixaDialogo = this;

    this.divFechar.onclick = function() {
        this.caixaDialogo.Close();
    };

    if (typeof(div) == "string") {
        Selector.$(div).style.height = altura + "px";
        Selector.$(div).style.width = largura + "px";
        Selector.$(div).setAttribute('class', 'divbranca');
        Selector.$(div).style.visibility = 'hidden';
        document.body.appendChild(Selector.$(div));
        Selector.$(div).style.position = "absolute";
        Selector.$(div).style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
        Selector.$(div).style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    } else {
        div.style.height = altura + "px";
        div.style.width = largura + "px";
        div.setAttribute('class', 'divbranca');
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        div.style.position = "absolute";
        div.style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
        div.style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    }

    document.body.appendChild(this.divFechar);
    this.divFechar.style.top = ((((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) - 20) + 'px';
    this.divFechar.style.left = (((document.documentElement.clientWidth / 2) + (largura / 2)) - 5) + "px";

    this.Show = function() {
        this.divBlock.style.visibility = 'visible';
        this.divFechar.style.visibility = 'visible';
        if (typeof(div) == "string") {
            Selector.$(div).style.visibility = 'visible';
        } else {
            div.style.visibility = 'visible';
        }

        document.body.style.overflow = 'hidden';
    }

    this.Close = function() {
        this.divBlock.style.visibility = 'hidden';
        this.divFechar.style.visibility = 'hidden';
        if (typeof(div) == "string") {
            Selector.$(div).style.visibility = 'hidden';
        } else {
            div.style.visibility = 'hidden';
        }

        document.body.style.overflow = 'visible';
    }


    caixaDialogo.imagePath = './imagens/';
}


caixaDialogoOriginal = function(div, altura, largura, padrao, posicaoz) {
    
    // Bloqueio     
    this.divBlock = document.createElement('div');
    this.divBlock.setAttribute("id","divBlock");
    this.divBlock.style.position = 'absolute';
    this.divBlock.style.backgroundColor = '#E5E5E5';
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
    Selector.$(div).style.zIndex = posicaoz + 1;
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

    this.divBlock.style.top = scrollY + 'px';
    // document.body.style.overflow = 'hidden';

    this.divFechar = document.createElement('div');
    this.divFechar.setAttribute('id', 'divClose');
    this.divFechar.setAttribute('title', 'Fechar');
    this.divFechar.style.position = 'absolute';
    this.divFechar.setAttribute('class', 'efeito-opacidade-75-01');
    this.divFechar.setAttribute('style', 'height:37px; width:37px; background-repeat:no-repeat; background-image:url(' + padrao + 'imagens/fechar.png); position: absolute; visibility: hidden');
    this.divFechar.style.zIndex = posicaoz + 1;
    this.divFechar.caixaDialogo = this;

    this.divFechar.onclick = function() {
        this.caixaDialogo.Close();
    };

    Selector.$(div).style.height = altura + "px";
    Selector.$(div).style.width = largura + "px";
    Selector.$(div).setAttribute('class', 'divbranca');
    Selector.$(div).style.visibility = 'hidden';
    document.body.appendChild(Selector.$(div));
    Selector.$(div).style.position = "absolute";
    Selector.$(div).style.top = (((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) + 'px';
    Selector.$(div).style.left = ((document.documentElement.clientWidth / 2) - (largura / 2)) + "px";
    document.body.appendChild(this.divFechar);
    this.divFechar.style.top = ((((scrollY + (document.documentElement.clientHeight / 2)) - (altura / 2)) - 0) - 20) + 'px';
    this.divFechar.style.left = (((document.documentElement.clientWidth / 2) + (largura / 2)) - 5) + "px";

    this.Show = function() {
        this.divBlock.style.visibility = 'visible';
        this.divFechar.style.visibility = 'visible';
        Selector.$(div).style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }

    this.Close = function() {
        this.divBlock.style.visibility = 'hidden';
        this.divFechar.style.visibility = 'hidden';
        Selector.$(div).style.visibility = 'hidden';
        document.body.style.overflow = 'visible';
    }
    
    
     caixaDialogo.imagePath = './imagens/';
}

function myTrim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}

