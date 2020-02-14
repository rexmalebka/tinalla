class Markov{
	constructor(name){
		console.log(`loading "./markov/${name}"`)
		this.metrics = JSON.parse(require(`./markov/${name}`))
		this.words = Object.keys(this.metrics)
		this.kernel = this.words[Math.ceil(Math.random() * (this.words.length - 1))]
		this.current = this.kernel
	}
	next(){
		while(!this.words.includes(this.current)){
			this.current = this.words[Math.ceil(Math.random() * (this.words.length - 1))]
		}
		let next = ""
		let seq = Object.entries(this.metrics[this.current])
		seq = seq.sort((a,b )=> b[1] -a[1])
		if(seq.length>3){
			next = seq[Math.ceil(Math.random() * 2)][0]
		}else{
			next = seq[0][0]
		}

		this.current = next.split(" ")
		this.current = this.current[this.current.length - 1]
		return next
	}
	random(){
		this.current = this.words[Math.ceil(Math.random() * (this.words.length - 1))]
		return this.current
	}
}
const metrics={

}



function markov(...args){
	let name = args[0]
	let action = args[1]
	let params = args.slice(2)

	if(name == ""){
		return ""
	}
	const emit = this.emit

	if(!metrics[name]){
		metrics[name] = new Markov(name)
	}
	switch (action){

		case "kernel":
			if(params.length==1){
				metrics[name].kernel = params[0]
				metrics[name].current = params[0]
			}
			console.log(metrics[name].kernel)
			emit(metrics[name].kernel)
			break;
		case "next":
			let next = metrics[name].next()
			emit(next)
			break;
		case "current":
			emit(metrics[name].current)
			break;

		case "random":
			let curr = metrics[name].random()
			emit(curr)
			break;
	}

}


module.exports = {
	address: 'markov',
	callback: markov
}
