const socket = io('http://localhost:8000')
socket.on('connect', function(){
	console.log("connected");
});

socket.on('event', function(data){
	console.log("event",data)
	socket.emit('hello', 'world');
});

socket.on('disconnect', function(){
	console.log("disconnected");
});


Array.prototype.Loop = function(timeout, times, callback){
	// return Loop(timeout, this, times, callback)
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
 * @param {Int} opts.end.line=TextEditor.LineCount() - line position number.
 * @param {Int} opts.end.ch - character position number.
 * @param {Bool} opts.onchange=false - parse when the text editor changes.
 * @param {Bool} opts.iterable=false - calls the callback function per match, the function receives a res object instead of an array of matches.
 *
 *
 */
const AddRule = function(rule, oscdir = '/tinalla', callback, opts={}){
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
	if( Number.isInteger(start) && Number.isInteger(end) ){
		start = {line:start, ch:0};
		end = {line:end};
	}
	
	if(callback && callback.constructor == Function){
		callback(range)
	}else{
		return {
			Parse : function(rule, oscdir = '/tinalla', callback, _opts={}){
				let opts = {start: start, end: end};
				for(i in _opts){
					opts[i] = _opts[i]
				}
				Parse(rule, oscdir = '/tinalla', callback, opts)
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
const Parse = function(rule, oscdir = '/tinalla', callback, opts={}){

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
	let res;
	if (callback && typeof callback == 'function' ){
		res = _parse();
		let ret;
		if(defopts.iterable){

			res.forEach(function(found, n){
				console.log("RES it", found, n )
				
				if(callback.length == 1){
					ret = callback(found);
				}else if(callback.length == 2){
					ret = callback(found, n);
				}

				if(Array.isArray(ret)){
					socket.emit('osc', oscdir, ...ret)
				}else if(ret){
					socket.emit('osc', oscdir, ret)			
				}
			
			})

		}else{
			ret = callback(res);
			
			if(Array.isArray(ret)){
				socket.emit('osc', oscdir, ...ret)
			}else if(ret){
				socket.emit('osc', oscdir, ret)			
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
			socket.emit('osc', oscdir, oscmsg)
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

RegExp.prototype.parse = function(oscdir = '/tinalla', callback, opts={}){
	return Parse(this, oscdir, callback, opts)
}
/**
 * Loop function implementation, the loops are being declared with the exact sequence. 
 * @param {Int} timeout - time delay, if the timeout changes while being played, the loop will change it's timeout.
 * @param {Function[]} sequence - Array of functions to be executed, the exact sequence will define the loop, if the sequence changes, this will create another different loop.
 * @param {Int|String} times="inf" - times that the loop should be executed (not implemented yet).
 * @return {Object} - Object of functions for loop control.
 * @property {Object} res - resulting object
 * @property {Function} res.play - play function for the loop.
 * @property {Function} res.stop - stops the loop.
 */
Loop = function(timeout, sequence, times="inf"){
	const hash = sequence.map((seq)=>seq.toString().hashCode()).reduce((a,b)=> a+b)
	return {
		play : function(){
			let a = new Date();
			const ff = function(){
				if((new Date() - a) < timeout ){
					Tinalla.loops[hash].id = requestAnimationFrame(ff)
				}else{
					sequence[0]()
					sequence.push(sequence.shift())
					a = new Date();
					Tinalla.loops[hash].id = requestAnimationFrame(ff)
				}
			}


			if(!Tinalla.loops.hasOwnProperty(hash)){
				
				Tinalla.loops[hash] = {id:0, timeout: timeout, callback: null}
				Tinalla.loops[hash].id = requestAnimationFrame(ff);
			}else{
				if(timeout != Tinalla.loops[hash].timeout){
					this.stop()	
					Tinalla.loops[hash] = {id:0, timeout: timeout, callback: null}
					Tinalla.loops[hash].id = requestAnimationFrame(ff);
				}
			}
		},
		stop : function(){
			if(Tinalla.loops.hasOwnProperty(hash)){
				cancelAnimationFrame(Tinalla.loops[hash].id)
				delete Tinalla.loops[hash];
			}
		}
	}
};

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

clock = function(bpm){

}
