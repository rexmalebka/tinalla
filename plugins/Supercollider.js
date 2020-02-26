const {spawn} = require('child_process')

function cleanlogs(logs){
	return logs
}

const SC = {
	child: function(){
		this.SC = spawn('sclang')
		this.SC.stdin.setEncoding('utf-8')

                this.SC.stderr.on('data', (data)=>{
			console.log(`error: ${data}`)
			this.emit(data)
		})
		this.SC.stdout.on('data', (data)=>{
			console.log(`stdout: "${cleanlogs(data)}"`)
			this.emit(data)
		})
		
		this.SC.on("close", (data)=>{
			console.log("error :(")
		})
 
                this.write = function(text){
                        this.SC.stdin.write(text+"\n")
                }
		

	},
	emit: (data)=>{data}
}


function Supercollider(code){
	SC.emit = this.emit
	SC.write(code)
}

SC.child()

module.exports = {
	address: 'Supercollider',
	callback: Supercollider
}

