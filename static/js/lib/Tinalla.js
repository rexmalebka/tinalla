const cons = document.querySelector("#console");

/**
 * Tinalla main mother object.
 * @typedef Tinalla
 * @property {Proxy} Tinalla.loops - contains a reference of each loop created.
 * @property {Proxy} Tinalla.rules - contains a reference of each regex rule created.
 * 
 */
const Tinalla = {
	loops : new Proxy({},{
		get: function(obj, prop){
			return obj[prop]
		},
		set: function(obj, prop, value){
			obj[prop] = value;
		}
	}),
	rules : new Proxy({}, {

		get: function(obj, prop){
			return obj[prop]
		},
		set: function(obj, prop, value){
			console.log("adsfasdf", prop, value)
			obj[prop] = value;
		}
	})
}

const TextEditor = CodeMirror(document.querySelector("#texteditor"), {
	theme:"midnight", 
	lineNumbers: true,
	lineWrapping: true,
	styleActiveLine: true,
	styleActiveSelected: true,
	scrollbarStyle:null,
	mode:'textfile',
	extraKeys: {
		"Shift-Ctrl-Enter":function(){
			try{
				for(i in Tinalla.rules){
					Tinalla.rules[i]();
				}

			}catch(error){
				cons.textContent = error;
			}
		},
		"Ctrl-Enter":function(f){
			let opts = {}

			if(TextEditor.getSelection() == ""){
				opts.start = {line: TextEditor.getCursor().line, ch:0 }
				opts.end = {line: TextEditor.getCursor().line+1}

			}else{
				opts.start = TextEditor.listSelections()[0].head
				opts.end = TextEditor.listSelections()[0].anchor
			}
			
			try{
				for(i in Tinalla.rules){
					Tinalla.rules[i](opts);
				}
			}catch(error){
				cons.textContent = error;
			}
		},
		"Tab":function(){
			ParseEditor.focus();
			ParseEditor.setCursor(0,0)
		}
	}
});

TextEditor.on('change', function(...args){

	for(rule in Tinalla.rules){
		if(Tinalla.rules[rule].onchange){
			Tinalla.rules[rule]();
		}
	}
})

const ParseEditor = CodeMirror(document.querySelector("#parseeditor"), {
	theme:"midnight", 
	lineNumbers: true,
	lineWrapping: true,
	lineWrapping : true,
	styleActiveLine: true,
	styleActiveSelected: true,
	scrollbarStyle:null,
	mode:'javascript',
	extraKeys: {
		"Shift-Ctrl-Enter":function(){
			const text = ParseEditor.getValue();
			//autosave()
			try{
				let evaluated = eval(text);
				cons.textContent = `${text} → ${typeof evaluated}`;
			}catch(error){
				cons.textContent = error;
			}
		},
		"Ctrl-Enter":function(f){
			const text = ParseEditor.getLine(ParseEditor.getCursor().line);
			//autosave()
			try{
				let evaluated = eval(text);
				cons.textContent = `${text} → ${typeof evaluated}`;
			}catch(error){
				cons.textContent = error;
			}	
		},
		"Tab":function(f){
			TextEditor.focus();
			TextEditor.setCursor(0,0)
		}
	}
});



