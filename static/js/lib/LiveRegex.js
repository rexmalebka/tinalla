const cons = document.querySelector(".console");

const TextEditor = CodeMirror(document.querySelector("#texteditor"), {
	theme:"midnight", 
	lineNumbers: true,
	lineWrapping: true,
	lineWrapping : true,
	styleActiveLine: true,
	styleActiveSelected: true,
	scrollbarStyle:null,
	mode:'textfile',
	extraKeys: {
		"Shift-Ctrl-Enter":function(){
			const text = editor.getValue();
			//autosave()
			try{
				let evaluated = eval(text);
				cons.textContent = `${text} → ${typeof evaluated}`;
			}catch(error){
				cons.textContent = error;
			}
		},
		"Ctrl-Enter":function(f){
			const text = editor.getLine(editor.getCursor().line);
			//autosave()
			try{
				let evaluated = eval(text);
				cons.textContent = `${text} → ${typeof evaluated}`;
			}catch(error){
				cons.textContent = error;
			}	
		}
	}
});


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
			const text = editor.getValue();
			//autosave()
			try{
				let evaluated = eval(text);
				cons.textContent = `${text} → ${typeof evaluated}`;
			}catch(error){
				cons.textContent = error;
			}
		},
		"Ctrl-Enter":function(f){
			const text = editor.getLine(editor.getCursor().line);
			//autosave()
			try{
				let evaluated = eval(text);
				cons.textContent = `${text} → ${typeof evaluated}`;
			}catch(error){
				cons.textContent = error;
			}	
		}
	}
});

