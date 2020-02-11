const {spawn} = require('child_process')



function cleanlogs(log){
	return (log.toString()).split(">")[log.toString().includes(">") ? 1 : 0 ]
}



const Tidal = {
	child: function(){
		// check if tidal it's running
		this.ghci = spawn('ghci')
		this.ghci.stdin.setEncoding('utf-8')
		this.ghci.stdin.write(":script plugins\/tidalcycles\/BootTidal.hs\n")

		this.ghci.stderr.on('data', function(data){
			console.log(`error: ${data}`)
			this.emit(data)
		})
		
		this.ghci.stdout.on('data', function(data){
			console.log(`stdout: "${cleanlogs(data)}"`)
			this.emit(`stdout: "${cleanlogs(data)}"`)
		})

		this.ghci.on("close", function(data){
			console.log("error :(")
		})

		this.write = function(text){
			this.ghci.stdin.write(text+"\n")
		}
	},
	emit: (data)=>{data}
}


function TidalCycles(instruction){
	Tidal.emit = this.emit
	Tidal.write(instruction)
}


Tidal.child()

module.exports = {
	address: 'TidalCycles',
	callback: TidalCycles
}
