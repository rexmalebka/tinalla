function test_loop(){
	let loop1 = Loop([500], [()=>{}])
	let loop2 = Loop(500, ()=>{})

	// loops can be created with only one argument or with an array of elements
	// check propertiess that are returned by loop
	console.assert( loop1.timeout.join() == loop2.timeout.join()  && loop1.timeout.join()==[500].join())
	console.assert( loop1.sequence.join() == loop2.sequence.join()  && loop1.sequence.join()==[()=>{}].join())
	console.assert( loop1.timeout.join() == loop2.timeout.join()  && loop1.timeout.join()==[500].join())
	
	console.assert( loop1.times == loop2.times && loop1.times == Infinity )

	let loop3 = Loop(()=>500, ()=>{}, 2)
	console.assert(loop3.times==2 && loop3.timeout.join()== [()=>500].join())

	console.assert(loop1.play && loop2.stop && loop1.play.constructor==Function && loop1.stop.constructor==Function)

	// test step function and reference function
	loop1 = Loop([500, 200], ()=>{})
	loop1.step()
	loop1.step()
	
	console.assert(loop1.current==2)
	
	loop1.stop()

	console.assert(loop1.current==0)

	Tinalla.loops["TEST"] = loop1
	console.assert(Tinalla.loops["TEST"].current == 0)
	
	loop1.step()
	loop1.step()
	console.assert(Tinalla.loops["TEST"].current == 2)

	Tinalla.loops["TEST"].step()
	Tinalla.loops["TEST"].step()
	console.assert(loop1.current == 4)

	//loop1 = Loop(500, () => { console.assert(this.timeout.join()==[500].join())}, 2)
	loop1 = Loop(500, (loop)=>{console.assert(loop.timeout[0] == 500)}, 10)

	loop1.play()
	
	loop1 = Loop(500, [(loop)=>{console.assert(loop._seqindx==0)}, (loop)=>{console.assert(loop._seqindx==1)}], 10)

	//loop1.play()
	
	loop2 = Loop(2000, [
		(loop)=>loop.sequence.push(3),
		(loop)=>console.assert(loop.sequence.length==3)
	], 1)
	
	loop2.play()

	loop1 = Loop()
	console.assert(loop1.play() == loop1)

	loop1 = Loop(500, [])
	loop1.play()

	loop2 = Loop(10, [()=>{},
		()=>console.assert(loop1.playing == false)
	], 11).play()

	loop3 = Loop(1000, [
		[ 
			()=>{ console.log("hola")},
			()=>{ console.log("hola2")}
		]
	],10)

	loop3.play()
	
}



test_loop()

