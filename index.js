const express = require('express');
const app = express();
const osc = require('osc')
const config = require('./config.js');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs')

const net = require('net')

const OSCServer = new osc.UDPPort({
	localAddress: config.OSCLocalAddr,
	localPort: config.OSCLocalPort,
	remoteAddress: config.SCAddr,
	remotePort: config.SCPort,
	metadata : false
});
OSCServer.open();

console.log("reaading plugins dir.")


	let plugins = {}

	fs.readdirSync('./'+config.PluginsDir).forEach((file)=>{
		if (file.endsWith('.js')){
			try{
				let plugin = require(config.PluginsDir+'/'+file)
				if (Object.keys(plugin).includes("address") &&  Object.keys(plugin).includes('callback')){
					plugins[plugin.address] = plugin.callback
				}
			}catch(error){
				console.log("error loading "+file+" \n "+error)
			}
		}
	})

	console.log(`plugins loaded: "${Object.keys(plugins).join(", ")}"`)



OSCServer.on('ready', function(){
	console.log('OSC started.');

	io.on('connection', function(socket){
		console.log('Connected.');

		const autosaved = fs.readFile("autosaved.json",'utf8', (error, data)=>{
			if(error){
				socket.emit('load','','')
			}else{
				const dataparsed = JSON.parse(data)
				//socket.emit('load',dataparsed.texteditor, dataparsed.parsereditor)
			}
		})

		socket.on('plugin', function(plugin, ...args){

			if(Object.keys(plugins).includes(plugin) ){

				let syncFunc= new Promise((resolve, reject)=>{
					try{
						let result = plugins[plugin].bind(
							{
								socket: socket,
								io: io,
								emit: function(...params){
									socket.emit(`plugin-${plugin}`, ...params)								}
							}
						)(...args)
						resolve(`plugin ${plugin}: ${result}`);
					}catch(error){
						error.message = `error on plugin ${plugin}: ${error.message}`
						reject(error)
					}
				}).then((log)=>{
					console.log(log)
				}).catch((error)=>{
					console.log("Error in plugin", error)
				})

			}
		})

		socket.on('save',function(text, parser){
			fs.writeFile("autosaved.json",
				JSON.stringify(
					{
						texteditor: text, 
						parsereditor: parser
					}),(err)=>{
						if(err) console.log(err,"error saving 'autosaved.json'")
					})
		})
		
		socket.on('osc',function(...args){
			let opts = {
				ip: config.SCAddr, 
				port: config.SCPort
			};

			const address = args[0].startsWith('/')? args[0] :'/'+args[0] ;

			if(args.length == 2 && typeof args[1] == 'object' && !Array.isArray(args[1])){
				for(i in args[1]){
					opts[i] = args[1][i];			
				}
				args = Array.isArray(args[1].args) ? args[1].args : [args[1].args];
			}else{
				args = args.splice(1)
			}

			let oscargs = args.map((arg)=>{
				if(Number.isInteger(arg)){
					return {type: 'i', value: arg}
				}else if(typeof arg == "number"){
					return {type: 'f', value: arg}
				}else if(typeof arg == "string"){
					return {type: 's', value: arg}
				}else{
					return {type: 's', value: JSON.stringify(arg)}				
				}
			});
			console.log(`sending: ${opts.ip}:${opts.port} -> ${address}, ${args}`)

				OSCServer.send({
					address: address,
					args: oscargs
				}, opts.ip, opts.port);
		})
	});

})

server.listen(8000);

app.use(express.static(__dirname+'/static'));
app.use(express.static(__dirname+'/views'));

let webserver = app.listen(3000, function () {
  console.log("webserver started, listening on port 3000");
});
