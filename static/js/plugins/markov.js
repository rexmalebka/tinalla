function Markov(name){
	return {
		name: name,
		get current(){
			return Plugin('markov', this.name,'current').receive
		},
		get next() {
			return Plugin('markov', this.name,'next').receive
		},		
		get kernel(){
			return Plugin('markov', this.name,'kernel').receive
		},
		set kernel(kernel){
			return Plugin('markov', this.name,'kernel', kernel).receive
		},
		get random(){
			return Plugin('markov', this.name,'random').receive
		}
	}
}
