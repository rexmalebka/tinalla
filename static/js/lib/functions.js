const socket = io('http://localhost:8000')

socket.on('connect', function(){
	console.log("connected");
	Console.print("connected")
});

socket.on('load', function(texteditor, parsereditor){
	Console.print("loading")
	console.log("loading ")
	TextEditor.setValue(texteditor)
	ParseEditor.setValue(parsereditor)
})

window.onunload = ()=>{
	socket.emit('save',
		TextEditor.getValue(),
		ParseEditor.getValue()
	)
}

socket.on('event', function(data){
	console.log("event",data)
	socket.emit('hello', 'world');
});

socket.on('disconnect', function(){
	Console.print("disconnected","error")
	console.log("disconnected");
});





const Server = function(ip='localhost', port=57120){
	return {
		Parse : function(rule, oscdir = '/tinalla', callback, opts={}){
			let defopts ={
				ip: ip,
				port: port			
			}
			
			for(i in opts){
				defopts[i] = opts[i]
			}
			
			return Parse(rule, oscdir, callback, defopts)
		},
		AddRule: function(rule, oscdir = '/tinalla', callback, opts={}){
			let defopts ={
				ip: ip,
				port: port			
			}
			
			for(i in opts){
				defopts[i] = opts[i]
			}
			
			return AddRule(rule, oscdir = '/tinalla', callback, defopts)
		},		
		send: function(oscdir, ...oscargs){
			socket.emit('osc', oscdir, {
				ip: ip,
				port: port,
				args: oscargs
			})
		}
	}
}

/**
 * @function
 * @name Loop
 * Array.prototype.Loop
 * @param {Int|Int[]} timeout - time delay, if the timeout changes while being played, the loop will change its timeout.
 * @param {Int|String} times="inf" - times that the loop should be executed (not implemented yet).
 * @return {Object} - Object of functions for loop control.
 * @property {Object} res - resulting object
 * @property {Function} res.play - play function for the loop, returns a loop object.
 * @property {Function} res.stop - stops the loop.
 */
Array.prototype.Loop = function(timeout, times){
	const cc = this;
	return Loop(timeout, cc, times)
	// this crashed my laptop :(
}


/**
 *
 * Adds Rules for posterior execution or execution when the Editor changes.
 * @param {(RegExp|String|Object)} rule - Regex Pattern, XRegExp is used here.
 * @param {RegExp | String} rule.pat - regex Pattern
 * @param {String} rule.flags - regex flags
 * @param {String} oscdir="/tinalla" - OSC Address.
 * @param {Function} callback - function that executes when the pattern matches, the function receives an array of the matches.
 * @param {Object} opts - options object.
 * @param {String} opts.ip - ip of OSC Server.
 * @param {Int} opts.port - port of OSC Server.
 * @param {Object} opts.start - starting position of text, in the Codemirror format.
 * @param {Int} opts.start.line=0 - line position number.
 * @param {Int} opts.start.ch=0 - character position number.
 * @param {Object} opts.end - ending position of text, in the Codemirror format.
 * @param {Int} opts.end.line=TextEditor.LineCount() - line position number.
 * @param {Int} opts.end.ch - character position number.
 * @param {Bool} opts.onchange=false - parse when the text editor changes.
 * @param {Bool} opts.iterable=false - calls the callback function per match, the function receives a res object instead of an array of matches.
 *
 *
 */
const AddRule = function(...params){
//const AddRule = function(rule, oscdir = '/tinalla', callback, opts={}){
	let rule = ""
	let oscdir = ""
	let callback = ()=>{}
	let opts = {}
	if(arguments.length==4){
		rule = params[0]
		oscdir = params[1]
		callback = params[2]
		opts = params[3]
	}else if(arguments.length==3 && typeof(arguments[1])=="string"){
		rule = params[0]
		oscdir = params[1]
		callback = params[2]
	}else if(arguments.length==3){
		rule = params[0]
		callback = params[1]
		opts = params[2]
	}else if(arguments.length==2){
		rule = params[0]
		callback = params[1]
	}

	Tinalla.rules[rule] = (_opts={})=>{
		for(i in _opts){
			opts[i] = _opts[i]
		}
		Parse(rule, oscdir, callback, opts)
	}

	if(opts.onchange){
		Tinalla.rules[rule].onchange = true
	}
}
/**
 *
 * Removes a rule.
 * @param {String} rule - Rule to be removed.
 */
const RemoveRule = function(rule){
	if(Tinalla.rules[rule]){
		delete Tinalla.rules[rule]
	}
}


/**
 *
 * function for working with text in ranges.
 * @param {Int | Object} start - start of range.
 * @param {Int} start.line=0 - line position number.
 * @param {Int} start.ch=0 - character position number.
 * @param {Int} end - ending line number of range.
 * @param {Int} end.line=TextEditor.LineCount() - line position number.
 * @param {Int} end.ch - character position number.
 * @param {Function} callback - function that executes when the pattern matches, the function receives an array of the matches.
 * @return {Object} Object of functions.
 * @property {Object} res - res result.
 * @property {Function} res.Parse - Parse function into text range.
 * @property {Function} res.AddRule - AddRule function into text range.
 */
const Range = function(start, end, callback){
	
	if( Number.isInteger(start)){
		start = {line:start, ch:0}
	}

	if( Number.isInteger(end)){
		end = {line:end, ch:0}
	}else if(end == undefined){
		ch = TextEditor.getRange(start,{line:start.line}).length
		end = {line: start.line, ch: ch}
	}
	
	if(callback && callback.constructor == Function){
		callback(range)
	}else{
		return {
			text: function(){
				return TextEditor.getRange(start,end)
			},
			Parse : function(...params){
				
				let opts = {start: start, end: end};
				_opts = {};
				for(i in _opts){
					opts[i] = _opts[i]
				}
				Parse(...params, opts)
			},
			AddRule : function(rule, oscdir = '/tinalla', callback, _opts={}){
				let opts = {start: start, end: end};
				
				Tinalla.rules[rule] = (_opts={})=>{
					for(i in _opts){
						opts[i] = _opts[i]
					}
					Parse(rule, oscdir, callback, opts)
				}
			},
		}
	}
};

/**
 *
 * Parses Regex patterns, if matches sends OSC messages.
 * @param {(RegExp|String|Object)} rule - Regex Pattern, XRegExp is used here.
 * @param {RegExp | String} rule.pat - regex Pattern
 * @param {String} rule.flags - regex flags
 * @param {String} oscdir="/tinalla" - OSC Address.
 * @param {Function} callback - function that executes when the pattern matches, the function receives an array of the matches.
 * @param {Object} opts - options object.
 * @param {String} opts.ip - ip of OSC Server.
 * @param {Int} opts.port - port of OSC Server.
 * @param {Object} opts.start - starting position of text, in the Codemirror format.
 * @param {Int} opts.start.line=0 - line position number.
 * @param {Int} opts.start.ch=0 - character position number.
 * @param {Object} opts.end - ending position of text, in the Codemirror format.
 * @param {Int} opts.end.line=TextEditor.LineCount() - line position number.
 * @param {Int} opts.end.ch - character position number.
 * @param {Bool} opts.onchange=false - parse when the text editor changes.
 * @param {Bool} opts.iterable=false - calls the callback function per match, the function receives a res object instead of an array of matches.
 * @return {Object[]} Array of matches
 * @property {Object} res - match result.
 * @property {Object} res.start - starting position of match, in the Codemirror format.
 * @property {Int} res.start.line - line position number.
 * @property {Int} res.start.ch - character position number.
 * @property {Int} res.end.line - line position number.
 * @property {Int} res.end.ch - character position number.
 * @property {String} res.res - string match result.
 * @property {Array} res.raw - resulting array in the XRegExp format.
 */
const Parse = function(...params){
	//const Parse = function(rule, oscdir = '/tinalla', callback, opts={}){
	//
	let rule = ""
	let oscdir = ""
	let callback = ()=>{}
	let opts = {}
	if(arguments.length==4){
		rule = params[0]
		oscdir = params[1]
		callback = params[2]
		opts = params[3]
	}else if(arguments.length==3 && typeof(arguments[1])=="string"){
		rule = params[0]
		oscdir = params[1]
		callback = params[2]
	}else if(arguments.length==3){
		rule = params[0]
		callback = params[1]
		opts = params[2]
	}else if(arguments.length==2){
		rule = params[0]
		callback = params[1]
	}
	/*
	if (oscdir && typeof oscdir == 'function' ){
		oscdir = ''
		
		if(typeof callback === 'object' && callback.constructor === Object){
			opts = arguments[2]
		}

		callback = arguments[1]

	}
	*/

	let flags = 'x';
	let pat = rule;
	let defopts = {
		ip:'localhost', 
		port:57120, 
		start : {line:0, ch:0}, 
		end:{ line:TextEditor.lineCount()},
		onchange: false,
		iterable: false
	};
	
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
	oscdir = oscdir.startsWith('/') ? oscdir : '/'+oscdir 

	// options are updatable
	for(i in opts){
		defopts[i] = opts[i]
	}

	
	function _parse(){
		let res = [];
		let text = TextEditor.getRange(
			defopts.start,
			defopts.end
		);

		XRegExp.forEach(text, regexrule, (...args)=>{
			
			let cutst = text.substring(0, args[0].index).split('\n')
			let cuten = text.substring(0, args[0].index + args[0][0].length).split('\n')

			let found = {}

			found.start= { line: cutst.length - 1 , ch: cutst[cutst.length-1].length };
			found.end = {line: cutst.length + (cuten.length - cutst.length) -1, ch: cuten[cuten.length - 1 ].length}
			found.res = args[0][0]
			found.raw = args
			res.push(found)
		});

		let marks = [];
		const groupcolor = `rgb(200, ${parseInt(Math.random()*255)}, ${parseInt(Math.random()*255)}`;	
		
		res.forEach(function(found){
			flashtext(
				{line: found.start.line + defopts.start.line, ch: found.start.ch + defopts.start.ch},
				{line: found.end.line + defopts.start.line, ch: found.end.ch + defopts.start.ch},
				groupcolor
			)
		});
			return res
	}
	let res = [];
	let ret = [];
	
	if (callback && typeof callback == 'function' ){
		res = _parse();
		let _callback = function(){
			if(arguments.length==2){
				try{
					callback(arguments[0], arguments[1])
				}catch(error){
					Console.print(error,"error")
				}
			
			}else if(arguments.length==1){
				try{
					callback(arguments[0])
				}catch(error){
					Console.print(error,"error")
				}

			}		
		}

		res = res.map((r)=>{
			r.start = {
				line: r.start.line + defopts.start.line,
				ch: r.start.ch + defopts.start.ch
			}
			r.end = {
				line: r.end.line + defopts.start.line,
				ch: r.end.ch + defopts.start.ch
			}
			return r
		})
		if(defopts.iterable){

			res.forEach(function(found, n){
				
				if(callback.length == 1){
					ret = _callback(found);
				}else if(callback.length == 2){
					ret = _callback(found, n);
				}			
				if(ret){
					socket.emit('osc', oscdir, {
						ip: defopts.ip,
						port: defopts.port,
						args: ret
					})
				}
			})

		}else{
			if(res.length>0){
				ret = _callback(res);
				if(ret){
					socket.emit('osc', oscdir, {
						ip: defopts.ip,
						port: defopts.port,
						args: ret
					})
				}
			}
		}		

	}else{
		res = _parse();
		res.forEach((i)=>{
			let oscmsg ;
			if(i.raw[3].xregexp.captureNames == null){
				oscmsg = i.raw[0];
			}else{
				oscmsg = i.raw[0].splice(1)
			}
			socket.emit('osc', oscdir, {
				ip: defopts.ip,
				port: defopts.port,
				args: oscmsg
			})
		})
	}
	return res
};


/**
 * @function
 * @name Parse
 * String.prototype.Parse 
 * @param {String} oscdir="/tinalla" - OSC Address.
 * @param {Function} callback - function that executes when the pattern matches, the function receives an array of the matches.
 * @param {Object} opts - options object.
 * @param {String} opts.ip - ip of OSC Server.
 * @param {Int} opts.port - port of OSC Server.
 * @param {Object} opts.start - starting position of text, in the Codemirror format.
 * @param {Int} opts.start.line=0 - line position number.
 * @param {Int} opts.start.ch=0 - character position number.
 * @param {Object} opts.end - ending position of text, in the Codemirror format.
 * @param {Int} opts.end.line=TextEditor.LineCount() - line position number.
 * @param {Int} opts.end.ch - character position number.
 * @param {Bool} opts.onchange=false - parse when the text editor changes.
 * @param {Bool} opts.iterable=false - calls the callback function per match, the function receives a res object instead of an array of matches.
 * @return {Object[]} Array of matches
 * @property {Object} res - match result.
 * @property {Object} res.start - starting position of match, in the Codemirror format.
 * @property {Int} res.start.line - line position number.
 * @property {Int} res.start.ch - character position number.
 * @property {Int} res.end.line - line position number.
 * @property {Int} res.end.ch - character position number.
 * @property {String} res.res - string match result.
 * @property {Array} res.raw - resulting array in the XRegExp format.
 */
String.prototype.Parse = function(oscdir = '/tinalla', callback, opts={}){
	return Parse(this, oscdir, callback, opts)
}


String.prototype.hashCode = function() {
	// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
	var hash = 0, i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr   = this.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

/**
 * @function
 * @name Parse
 * RegExp.prototype.Parse 
 * @param {String} oscdir="/tinalla" - OSC Address.
 * @param {Function} callback - function that executes when the pattern matches, the function receives an array of the matches.
 * @param {Object} opts - options object.
 * @param {String} opts.ip - ip of OSC Server.
 * @param {Int} opts.port - port of OSC Server.
 * @param {Object} opts.start - starting position of text, in the Codemirror format.
 * @param {Int} opts.start.line=0 - line position number.
 * @param {Int} opts.start.ch=0 - character position number.
 * @param {Object} opts.end - ending position of text, in the Codemirror format.
 * @param {Int} opts.end.line=TextEditor.LineCount() - line position number.
 * @param {Int} opts.end.ch - character position number.
 * @param {Bool} opts.onchange=false - parse when the text editor changes.
 * @param {Bool} opts.iterable=false - calls the callback function per match, the function receives a res object instead of an array of matches.
 * @return {Object[]} Array of matches
 * @property {Object} res - match result.
 * @property {Object} res.start - starting position of match, in the Codemirror format.
 * @property {Int} res.start.line - line position number.
 * @property {Int} res.start.ch - character position number.
 * @property {Int} res.end.line - line position number.
 * @property {Int} res.end.ch - character position number.
 * @property {String} res.res - string match result.
 * @property {Array} res.raw - resulting array in the XRegExp format.
 */
RegExp.prototype.parse = function(oscdir = '/tinalla', callback, opts={}){
	return Parse(this, oscdir, callback, opts)
}

/**
 * Loop function implementation, the loops are being declared with the exact sequence. 
 * @param {Int|Int[]} timeout - time delay, if the timeout changes while being played, the loop will change its timeout.
 * @param {Function[]} sequence - Array of functions to be executed, the exact sequence will define the loop, if the sequence changes, this will create another different loop.
 * @param {Int|String} times="inf" - times that the loop should be executed (not implemented yet).
 * @return {Object} - Object of functions for loop control.
 * @property {Object} res - resulting object
 * @property {Function} res.play - play function for the loop, returns a loop object.
 * @property {Function} res.stop - stops the loop.
 */
const Loop = function(timeout=[], sequence=[], times='inf'){

	timeout = Array.isArray(timeout) ? timeout : [timeout];
	sequence = Array.isArray(sequence) ? sequence : [sequence];

	if(timeout.length==0 || sequence.length==0) return null
	if(timeout.length>0 && sequence.length>0){
		const hash = sequence.map((seq)=>seq.toString().hashCode()).reduce((a,b)=> a+b);
		if(Tinalla.loops.hasOwnProperty(hash)){
			Tinalla.loops[hash].timeout = timeout;
			Tinalla.loops[hash].times = times;
			return Tinalla.loops[hash]
		}
		return {
			_generator: function*(){
				while(Tinalla.loops[hash].playing){
					let t1 = new Date();
					const rloop = function(){
						if(!Tinalla.loops.hasOwnProperty(hash))	return false

						if(Tinalla.loops[hash].timeout[(Tinalla.loops[hash].count % Tinalla.loops[hash].timeout.length)].constructor == Function){

						Tinalla.loops[hash].timeout[(Tinalla.loops[hash].count % Tinalla.loops[hash].timeout.length)] = Tinalla.loops[hash].timeout[(Tinalla.loops[hash].count % Tinalla.loops[hash].timeout.length)]();

						}

						if((new Date() - t1) < Tinalla.loops[hash].timeout[(Tinalla.loops[hash].count % Tinalla.loops[hash].timeout.length)] ){
							cancelAnimationFrame(Tinalla.loops[hash].idx)
							Tinalla.loops[hash].idx = requestAnimationFrame(rloop)
						}else{
							// avoid waiting for function to end with promises
							let exf = new Promise(function(resolve, reject){
								Tinalla.loops[hash].sequence[Tinalla.loops[hash].count % Tinalla.loops[hash].sequence.length]()
								resolve();
							});
							Tinalla.loops[hash].step();
						}
					};
					Tinalla.loops[hash].count++;

						yield requestAnimationFrame(rloop)
				}
			},
			play: function(){
				if(!Tinalla.loops.hasOwnProperty(hash)){
					Tinalla.loops[hash] = {
						hash: hash,
						timeout: timeout,
						sequence: sequence,
						times:times,
						playing: false,
						idx: 0,
						_count:0,
						get count(){

							return this._count;
						},
						set count(value){
							if(Tinalla.loops[hash].times != 'inf'){
								if(Tinalla.loops[hash].count == Tinalla.loops[hash].times*Tinalla.loops[hash].sequence.length){
									Tinalla.loops[hash].stop()
									return true
								}
							}
							this._count = value
							return false
						},
						current:0,
						gen: this._generator(),
						step: function(){
							if(Tinalla.loops[hash].count >=0){
								this.idx = this.gen.next()
								return this
							}
						},
						stop: function(){
							Tinalla.loops[hash].playing = false;
							cancelAnimationFrame(Tinalla.loops[hash].idx)
							delete Tinalla.loops[hash]
							return this
						},
					};
					Tinalla.loops[hash].playing = true;
				}else if(!Tinalla.loops[hash].playing){
					Tinalla.loops[hash].playing = true
				}
				return Tinalla.loops[hash].step()
			},
			stop: function(){
				Tinalla.loops[hash].stop()
			}
		}
	}
}

const Write = function(content, start, end){
	if(!start && !end){
		start = {line:0, ch:0}
		end = {line: TextEditor.lineCount(), ch:0}
	}

	if( Number.isInteger(start)){
		start = {line:start, ch:0}
	}

	if( Number.isInteger(end)){
		end = {line:end, ch:0}
	}else if(end == undefined){
		ch = TextEditor.getRange(start,{line:start.line}).length
		end = {line: start.line, ch: ch}
	}
	
	if(content.constructor == RegExp){
		//generates text
		let gentext = new RandExp(content);
		content = gentext.gen();
	}
	TextEditor.replaceRange(content, start, end)
}

/*const Markov = function(structure={}, corpus=null){
	let keys = Object.keys(structure);
	if(corpus==null){
		corpus = keys[Math.floor(Math.random()*keys.length)]
	}
	/*
	return {
		ref: corpus,
		next: function(){
			
			return structure[ref]
		}
	}
	return {}
}

	*/

function flashtext(from, to, bgcolor){
	// from and to look like this: {line: 0, ch: 2}, {line:1, ch:0}
	// Editor is the Codemirror objecto
	const mark = TextEditor.markText(from, to, {
		className: 'blink', // this does the magic,
		css: 'background-color: '+bgcolor // css color
	}); 
	
	const deletemark = function(){
		mark.clear();
	}.bind(mark)

	setTimeout(deletemark, 250) //after certain time clear the mark
}



const Plugin = function(name,...params){
	
	socket.emit('plugin',
		name,
		...params
	)
	return {
		receive: function(callback){
			socket.once(`plugin-${name}`, function(...args){
				callback(...args)
			})
		}
	}
}
