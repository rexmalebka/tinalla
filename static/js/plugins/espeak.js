function espeak(){
	let amp = 100, 
		pitch = 50,
		speed = 170,
		gap =10,
		voice = "english",
		text = "";
	
	if(arguments.length == 6){
		amp = arguments[0]
		pitch = arguments[1]
		speed = arguments[2]
		gap = arguments[3]
		voice = arguments[4]
		text = arguments[5]
	}else if(arguments.length == 1 && (typeof arguments[0]=="string")){
		text = arguments[0]
	}else if(arguments.length == 2 && (typeof arguments[0]=="string") && (typeof arguments[1]=="string")){
		text = arguments[0]
		voice = arguments[1]
	
	}

	Plugin('espeak', amp,pitch,speed,gap,voice,text)
}

