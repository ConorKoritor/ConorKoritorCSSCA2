(function(){
    const searchGameText = document.getElementById("searchGame");
    document.getElementById("submitSearchGame").addEventListener("click", searchGame())
}());


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'c8f1aa5ccemshe1e6d2359ab689ap1a5684jsn683ee4c6ae81',
		'X-RapidAPI-Host': 'cheapshark-game-deals.p.rapidapi.com'
	}
};

async function searchGame(){
    const url = `https://cheapshark-game-deals.p.rapidapi.com/games?title=${searchGameText.value}&exact=0&limit=60`;
    try {
	const response = await fetch(url, options);
	
	if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    
    } catch (error) {
	console.error(error);
    }
}