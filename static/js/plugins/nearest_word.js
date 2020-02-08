/// hamming distance implementation
let WORD_LENS = Object.keys(POS_WORDS)
WORD_LENS.push(...Object.keys(NEG_WORDS))
WORD_LENS = new Set(WORD_LENS)
WORD_LENS = Array.from(WORD_LENS)

function split(text){
	const min = Math.min(...WORD_LENS)
	let splitted = []

	while(text.length > 0 || text.length > min){
		l = WORD_LENS[Math.floor(Math.random() * WORD_LENS.length)]

		splitted.push(text.substring(0,l))
		text = text.substring(l)
	}

	while(splitted[splitted.length-1].length < min){
		splitted[splitted.length-1] += "a"
	}
	return splitted
}

function hamming(word){
	let options = POS_WORDS[word.length]
	options.push(...NEG_WORDS[word.length])

	let mindist = [word.length+1,[]]
	let dist = 0

	for(let option of options){
		dist = 0
		for(let c in word){
			if(word[c]!=option[c]){
				dist++;
			}
		}

		if(dist==mindist[0]){
			mindist[1].push(option)
		}else if(dist<mindist[0]){
			mindist[0] = dist
			mindist[1] = [option]
		}
	}

	mindist[1] = new Set(mindist[1])
	mindist[1] = Array.from(mindist[1])

	return mindist
} 



function convertwords(sentence){
	let sentencelist = split(sentence)
	console.log(sentencelist)
	sentencelist = sentencelist.map((word)=>{
		let res = hamming(word)
		return res[1][Math.floor(Math.random()*res[1].length)]
	})
	return sentencelist
}
//module.exports = split
