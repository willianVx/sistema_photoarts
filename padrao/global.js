

function $$(texto)
{
	return document.createTextNode(texto);
}

function AnexaEvento(obj, evType, fn){
	if (obj.addEventListener) {
		obj.addEventListener(evType, fn, false);
	}
	else 
		if (obj.attachEvent) {
			obj.attachEvent('on' + evType, fn);
		}
}
   
function VerificaHora(hora)
{ 
	if (hora.length < 5)
		return false;
		
	if (hora.substr(2, 1) != ':')
		return false;
		
	var hrs = (hora.substr(0, 2)); 
	var min = (hora.substr(3, 2)); 

	if ((hrs < 00 ) || (hrs > 23) || (min < 00) || ( min > 59))
		return false;
} 

function MostrarImagem(objId, src) {
	$(objId).src = src;
}