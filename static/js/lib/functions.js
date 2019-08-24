
marcar = ()=>{
	TextEditor.markText(
		{line:0, ch:1}, 
		{line:0, ch:5},
		{css:"background-color:red",readonly:true, collapsed:false})
}

Array.prototype.loop = function(timeout, times){
	if(!Number.isNaN(timeout) && timeout>0){
	
	}
	console.log("starting loop", this)
}

const Tinalla = {
	_loops : [],
	_rules : [{}],
	set loops(a){
		this._loops = a;
	},
	get loops(){
		return this._loops
	},
	set rules(a){
		this.rules = a
	}
}

let Main = {
	set loops(a){
		console.log("A",a)
	}
}

let Loops = {};

Object.defineProperty(Loops,this,{
	set: function(n){
		console.log("AAAAA",n)
	}
})

const AddRule = function(){

}

const Range = function(start, end, callback){
	if( Number.isInteger(start) && Number.isInteger(end) ){
		if(callback && callback.constructor == Function){
			let range = TextEditor.getRange({line:start, ch:0}, {line:end, ch:0});
			callback(range)
		}else{
			return this
		}
	}else{
		// launch error
	}
};

const Parse = function(rule, oscdir, callback, opts={}){
	let flags = 'x';
	let pat = rule;
	let defopts = {server:'localhost', port:57120, lims : [0,-1]};

	// rule could be an object with pat and rule keywords or a regular expresion or a string
	
	if(typeof rule === 'object' && rule.constructor === Object){
		pat = rule.rule;
		flags = rule.flags;
	}else if(typeof pat === 'object' && pat.constructor === RegExp){
		pat = pat.source;
		if(pat.flags != ''){
			flags = pat.flags;
		}
	}

	const regexrule = XRegExp(pat, flags)

	// options are updatable
	for(i in opts){
		defopts[i] = opts[i]
	}

	defopts.lims[1] = (defopts.lims[1]==-1 || defopts.lims[1]>TextEditor.lineCount()) ? TextEditor.lineCount() : defopts.lims[1];

	let text = TextEditor.getRange(
		{line: defopts.lims[0],ch:0},
		{line: defopts.lims[1]}
	);
	let res = [];
	XRegExp.forEach(text, regexrule, (...args)=>{
		console.log(args);
		let cutst = text.substring(0, args[0].index).split('\n')
		let cuten = text.substring(0, args[0].index + args[0][0].length).split('\n')

		let found = {}

		found.start= { line: cutst.length - 1 , ch: cutst[cutst.length-1].length };
		found.end = {line: cutst.length + (cuten.length - cutst.length) -1, ch: cuten[cuten.length - 1 ].length}
		found.res = args[0][0]
		found.raw = args[0]
		res.push(found)
	});


	let marks = [];
	const groupcolor = `rgb(200, ${parseInt(Math.random()*255)}, ${parseInt(Math.random()*255)}`;
	res.forEach(function(found){
		marks.push(
			TextEditor.markText(
				{line: found.start.line, ch: found.start.ch},
				{line: found.end.line, ch: found.end.ch },
				{
					css:`background-color: ${groupcolor},0.5);`
				}
			)
		)
	});

	clearmarks = function(){
		marks.forEach((mark)=>{
			mark.clear();
		});

	}
	setTimeout(clearmarks.bind(marks),500)

	if (callback && typeof callback == 'Function' ){
		let ret = callback(res);
	}
	return [regexrule]
};

Loop = function(timeout, sequence, callback, times){
	// timeout could be a clock, a function or an array
	// sequence it's an array
	// callback function when sending osc
	// times integer if not infinite
};



clock = function(bpm){

}
