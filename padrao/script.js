var Script = {
	pathFolder: '',
	
	LoadAll: function () {
		for (var i = 0; i < Script.scripts.length - 1; i++)
			Script.Load(Script.scripts[i]);
	},
	
	Load: function (pathFile) {
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', Script.pathFolder + pathFile);
		
		if (script.readyState) {
			script.onreadystatechange = function() {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					Script.scriptsOk++;
					alert(Script.scriptsOk);
					alert(Script.isLoad);
					
					if (Script.scriptsOk == Script.scripts.length)
						Script.isLoad = true;
				}
			}
		} else {
			script.onload = function() {
    	        Script.scriptsOk++;
					
				if (Script.scriptsOk == Script.scripts.length)
					Script.isLoad = true;
	        }
		}
		
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	
	scripts: [
			'ajax.js', 'json2.js', 'mask.js', 'menu.js', 'combobox.js', 'selector.js', 'table.js', 'drag.js', 
			'dialog.js', 'screen.js', 'date.js', 'number.js', 'string.js'
			],
	
	scriptsOk: 0,
	isLoad: false
}
