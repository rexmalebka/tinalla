const TidalCycles = function(){

	if(TextEditor.getOption("mode") != "haskell"){
		let script = document.createElement("script")
		script.id = "tidalcycles"
		script.src = "js/mode/haskell/haskell.js"
		document.head.appendChild(script)
		script.onload = ()=>{
			TextEditor.setOption("mode", "haskell")
		}

	}
	return {
		kill: function(){
			document.querySelector("#tidalcycles").remove()
			TextEditor.setOption("mode", "textfile")
		}
	}
}
