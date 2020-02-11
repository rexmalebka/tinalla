const TidalCycles = function(){

	if(TextEditor.getOption("mode") != "haskell"){
		socket.on("plugin-TidalCycles", function(args){
			Console.print(args)
		})

		let script = document.createElement("script")
		script.id = "tidalcycles"
		script.src = "js/mode/haskell/haskell.js"
		document.head.appendChild(script)
		script.onload = ()=>{
			TextEditor.setOption("mode", "haskell")
		}

	}
	if(arguments.length==1){
		Plugin('TidalCycles', arguments[0])
	}
	return {
		kill: function(){
			document.querySelector("#tidalcycles").remove()
			TextEditor.setOption("mode", "textfile")
		}
	}
}
