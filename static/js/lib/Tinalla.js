const cons = document.querySelector("#console");
const DOMparse = document.querySelector("#parse");
const DOMpeditor = document.querySelector("#parseeditor");
const DOMeditor = document.querySelector("#texteditor");

//teditor.style.width = "50%"
//peditor.style.width = "40%"
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
			if(prop == "hush"){
				return ()=>{
					for(i in obj){
						cancelAnimationFrame(obj[i]);
						delete obj[i];
					}
				}
			}
			return obj[prop]
		},
		set: function(obj, prop, value){
			obj[prop] = value;
		}
	}),
	rules : new Proxy({}, {

		get: function(obj, prop){
			if(prop == "hush"){
				return ()=>{
					for(i in obj){
						delete obj[i];
					}
				}
			}
			return obj[prop]
		},
		set: function(obj, prop, value){
			obj[prop] = value;
		}
	})
}

Hush = ()=>{
	Tinalla.loops.hush()
	Tinalla.rules.hush()
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
				let range = {
					line:TextEditor.getCursor().line,
					ch:0
				}
				let line = TextEditor.getRange(range, {line:range.line})


				opts.start = {line: TextEditor.getCursor().line, ch:0 }
				opts.end = {line: TextEditor.getCursor().line, ch:line.length}


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
		},
		"Shift-Ctrl-H":function(){

			DOMparse.style.display = DOMparse.style.display == "none" ? "inline-flex" : "none"
			//teditor.style.width = teditor.style.width == "50%" || teditor.style.width == "" ? "90%" : "50%"
			DOMeditor.style['flex-grow'] = DOMeditor.style['flex-grow'] == "2" ? "" : "2" 
			TextEditor.focus();
		},
		"Ctrl-Up":function(){
			let fontsize = parseFloat(window.getComputedStyle(DOMeditor.querySelector('.CodeMirror'), null)['font-size'])
			DOMeditor.querySelector('.CodeMirror').style.fontSize = (fontsize+1)+'px'
		},
		"Ctrl-Down":function(){
			let fontsize = parseFloat(window.getComputedStyle(DOMeditor.querySelector('.CodeMirror'), null)['font-size'])
			DOMeditor.querySelector('.CodeMirror').style.fontSize = (fontsize-1)+'px'
		},
		"Ctrl-Right":function(){
			let weditor = parseFloat(window.getComputedStyle(DOMeditor, null)['width'])
			let wparse = parseFloat(window.getComputedStyle(DOMparse, null)['width'])

			if(wparse / (wparse + weditor) > 0.20){
				DOMeditor.style.width = (weditor + 10)+"px"
				DOMparse.style.width = (wparse - 10)+"px"
			}
		},
		"Ctrl-Left":function(){
			let weditor = parseFloat(window.getComputedStyle(DOMeditor, null)['width'])
			let wparse = parseFloat(window.getComputedStyle(DOMparse, null)['width'])

			if(wparse / (wparse + weditor) < 0.80){
				DOMeditor.style.width = (weditor - 10)+"px"
				DOMparse.style.width = (wparse + 10)+"px"
			}
		},
	}
});

TextEditor.on('change', function(...args){
	for(rule in Tinalla.rules){
		if(Tinalla.rules[rule].onchange){
			Tinalla.rules[rule]();
		}
	}
})

TextEditor.on('cursorActivity',function(...args){
	if(TextEditor.getSelection() == ""){
		let pos = TextEditor.getCursor()
		document.querySelector("#cursorposition").textContent = `line: ${pos.line}, ch: ${pos.ch}`

	}else{
		let start = TextEditor.listSelections()[0].anchor
		let end = TextEditor.listSelections()[0].head
		
		document.querySelector("#cursorposition").textContent = `line: ${start.line}, ch: ${start.ch} -> line: ${end.line}, ch: ${end.ch}`
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
				//cons.textContent = `${text} → ${typeof evaluated}`;
				Console.print(evaluated, "notice")
			}catch(error){
				//cons.textContent = error;
				Console.print(error, "error")
			}
		},
		"Ctrl-Enter":function(f){
			let text = "";
			if(ParseEditor.getSelection()==""){
				text = ParseEditor.getLine(ParseEditor.getCursor().line);
			}else{
				text = ParseEditor.getSelection();
			}
			//autosave()
			try{
				let evaluated = eval(text);
				//cons.textContent = `${text} → ${typeof evaluated}`;
				Console.print(evaluated, "notice")
			}catch(error){
				//cons.textContent = error;
				Console.print(error, "error")
			}	
		},
		"Tab":function(f){
			TextEditor.focus();
			TextEditor.setCursor(0,0)
		},
		"Shift-Ctrl-H":function(){

			DOMparse.style.display = "none"
			//teditor.style.width = "95%"
			DOMeditor.style['flex-grow'] = DOMeditor.style['flex-grow'] == "2" ? "" : "2" 
			TextEditor.focus();
		},
		"Alt-Repag":function(f){
			/*
			const EditorWidth = document.querySelector("#texteditor").getBoundingClientRect().width;
			const ParseWidth = document.querySelector("#parse").getBoundingClientRect().width;

			const total = EditorWidth + ParseWidth;


			if(EditorWidth > 150){
				// calculate percentage
				document.querySelector("#texteditor").style.width = (EditorWidth - 30) + "px";
				document.querySelector("#parse").style.width = (Total - EditorWidth + 20) + "px";
			}
			*/
		},
		"Ctrl-Up":function(){
			let fontsize = parseFloat(window.getComputedStyle(DOMpeditor.querySelector('.CodeMirror'), null)['font-size'])
			DOMpeditor.querySelector('.CodeMirror').style.fontSize = (fontsize+1)+'px'
		},
		"Ctrl-Down":function(){
			let fontsize = parseFloat(window.getComputedStyle(DOMpeditor.querySelector('.CodeMirror'), null)['font-size'])
			DOMpeditor.querySelector('.CodeMirror').style.fontSize = (fontsize-1)+'px'
		},
		"Ctrl-Right":function(){
			let weditor = parseFloat(window.getComputedStyle(DOMeditor, null)['width'])
			let wparse = parseFloat(window.getComputedStyle(DOMparse, null)['width'])

			if(wparse / (wparse + weditor) > 0.20){
				DOMeditor.style.width = (weditor + 10)+"px"
				DOMparse.style.width = (wparse - 10)+"px"
			}
		},
		"Ctrl-Left":function(){
			let weditor = parseFloat(window.getComputedStyle(DOMeditor, null)['width'])
			let wparse = parseFloat(window.getComputedStyle(DOMparse, null)['width'])

			if(wparse / (wparse + weditor) < 0.80){
				DOMeditor.style.width = (weditor - 10)+"px"
				DOMparse.style.width = (wparse + 10)+"px"
			}
		},
	}
});


document.querySelectorAll(".save").forEach((node)=>{
	node.onclick  = function(ev){
		const now = new Date();
		let name = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}:${now.getMinutes()}`;
		let text = "";
		if(ev.target.parentElement.parentElement.parentElement.id == "texteditor"){
			text = TextEditor.getValue();
			name = name + "-text.txt";
		}else{
			text = ParseEditor.getValue();
			name = name + "-code.js";
		}

		const blob = new Blob([text], {type: (name.endsWith("js")? "application/javascript" : "text/plain")})

		let a = document.createElement("a");
		a.download = name;
		a.href = (window.webkitURL || window.URL).createObjectURL(blob);
		a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':');
		a.click();
	}
});


document.querySelectorAll(".clear").forEach( (node)=>{
	node.onclick  = function(ev){
		if(ev.target.parentElement.parentElement.parentElement.id == "texteditor"){
			TextEditor.setValue("");
		}else{
			ParseEditor.setValue("");
		}
	}
});

document.querySelectorAll(".load").forEach( (node)=>{
	node.onclick  = function(ev){
		let inpt = document.createElement("input")
		inpt.type = "file";

		inpt.onchange = function(e){
			const file = e.target.files[0];

			let reader = new FileReader();
			reader.onload = function(reader){
				content = reader.target.result;
				if(ev.target.parentElement.parentElement.parentElement.id == "texteditor"){
					TextEditor.setValue(content);
				}else{
					ParseEditor.setValue(content);
				}
			}

			reader.readAsText(file);
		}

		inpt.click()
	}
});




const Console = {
	print : function(log, type){
		let container = document.createElement("div");
		if(type == "error"){
			let error = document.createElement("code")
			error.classList.add("errorlog")
			container.textContent = "[E] ";
			error.textContent = log;
			container.appendChild(error)
			cons.querySelector("#log").appendChild(container);
		}else{
			let notice = document.createElement("code")
			notice.textContent = ">> "+log;
			container.appendChild(notice)
			cons.querySelector("#log").appendChild(container);
		}
		cons.querySelector("#log").scrollTo(0, cons.querySelector("#log").scrollHeight)
	}
}



