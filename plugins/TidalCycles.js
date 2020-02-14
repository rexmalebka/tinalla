error
const {spawn} = require('child_process')



function cleanlogs(log){
	return logs.split(">")[1]
}



const Tidal = {
	child: function(){
		// check if tidal it's running
		this.ghci = spawn('ghci')
		this.ghci.stdin.setEncoding('utf-8')

		this.ghci.stderr.on('data', (data)=>{
			console.log(`error: ${data}`)
		})
		
		this.ghci.stdout.on('data', (data)=>{
			console.log(`stdout: "${cleanlogs(data)}"`)
		})

		this.ghci.on("close", (data)=>{
			console.log("error :(")
		})

		this.write = function(text){
			this.ghci.stdin.write(text+"\n")
		}
	}
}


function TidalCycles(){
	return Tidal
}


Tidal.child()
module.exports = {
	address: 'TidalCycles',
	callback: TidalCycles
}
