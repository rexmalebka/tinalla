const axios = require('axios')
const cheerio = require('cheerio')

// Add a connect listener

const test = function(x){
	this.value = x
}

function lyrics(query){
	const socket = this.socket
	const emit = this.emit

	const pageurl = `https:\/\/search.azlyrics.com/search.php?q=${query}`
	
	return axios.get(pageurl)
		.then( (response)=>{
			const html = response.data
			const page = cheerio.load(html)
			let result = page('.visitedlyr a')[0].attribs['href']

			return axios.get(result)
				.then((response)=>{
					const html = response.data
					const page = cheerio.load(html)

					let lyrics = page('.ringtone')[0].next

					let text = ''
					while(true){
						
						if(lyrics.name == 'b' ){
							// add title
							text += lyrics.children[0].data
						}


						lyrics = lyrics.next
						if (lyrics.type == 'tag' && lyrics.name=='div'){
							break
						}
					}
					
					lyrics = text + lyrics.childNodes
						.filter((tag)=> tag.type=='text').map((tag)=>tag.data).join()
					test.value=lyrics
					emit(lyrics)

				})
				.catch((error)=>{
					console.log("Error consulting", error)
				})

		}).catch((error)=>{
			console.log("Error consulting ", error)
		})
	
}


module.exports = {
	address:'lyrics',
	callback: lyrics,
	test:test
}
