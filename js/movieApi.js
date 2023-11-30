(function(){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c8f1aa5ccemshe1e6d2359ab689ap1a5684jsn683ee4c6ae81',
            'X-RapidAPI-Host': 'cheapshark-game-deals.p.rapidapi.com'
        }
    };
    document.getElementById("submitSearchGame").addEventListener("click", () => searchGame(options));
    
}());

async function searchGame(options){
    let searchGameText = document.getElementById("searchGame").value;
    let seperatedSearchGameText = searchGameText.split(" ");
    let combinedSearchGameText = seperatedSearchGameText.join("%20"); 
    let url = `https://cheapshark-game-deals.p.rapidapi.com/games?title=${combinedSearchGameText}&exact=0&limit=60`;
    try {
	let response = await fetch(url, options);
	
	if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let result = await response.json();
    
    result.forEach(element => {
        populateGames(element);
    });
    console.log(result);
    } catch (error) {
	console.error(error);
    }
}

function populateGames(obj)
{  
    const searchedGames = document.getElementById("gameDisplay");

    let myDiv = document.createElement('div');
    let gameTitle = document.createElement('h1');
    let cheapestPrice = document.createElement('h3');

    gameTitle.innerHTML = obj['external'];
    cheapestPrice.innerHTML = obj['cheapest'];

    myDiv.appendChild(gameTitle);
    myDiv.appendChild(cheapestPrice);
    searchedGames.appendChild(myDiv);
}