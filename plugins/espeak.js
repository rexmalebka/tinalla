const {spawn} = require('child_process')

function espeak(amp=100, pitch=50, speed=170, gap=10, voice="english", text="" ){


	const espeak = spawn('espeak', ['-a', amp, '-p', pitch, '-s', speed, '-g', gap, '-v', voice, text])


	
	espeak.stderr.on('data', (data) => {
	  console.error(`stderr: ${data}`);
	});

	return "done"
}


module.exports = {
	address: 'espeak',
	callback: espeak 
}
