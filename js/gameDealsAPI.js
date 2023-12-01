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

    let card = document.createElement('div');
    card.className= 'card mb-3';
    card.style = 'max-width: 540px;';

    let row = document.createElement('div');
    row.className='row g-0';

    let col1 = document.createElement('div');
    col1.className = 'col-md-4';

    let coverArt = document.createElement('img');
    coverArt.src = obj['thumb'];
    coverArt.className = "img-fluid rounded-start";

    let col2 = document.createElement('div');
    col2.className = 'col-md-8';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let gameTitle = document.createElement('h5');
    gameTitle.className = 'card-title';
    gameTitle.innerHTML = obj['external'];

    let cheapestPrice = document.createElement('p');
    cheapestPrice.className='card-text';
    cheapestPrice.innerHTML = obj['cheapest'];

    col1.appendChild(coverArt);
    cardBody.appendChild(gameTitle);
    cardBody.appendChild(cheapestPrice);
    col2.appendChild(cardBody);
    row.appendChild(col1);
    row.appendChild(col2);
    card.appendChild(row);
    searchedGames.appendChild(card);
}