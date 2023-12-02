
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'c8f1aa5ccemshe1e6d2359ab689ap1a5684jsn683ee4c6ae81',
        'X-RapidAPI-Host': 'cheapshark-game-deals.p.rapidapi.com'
    }
};
document.getElementById("submitSearchGame").addEventListener("click", () => searchGame(options));

const searchedGames = document.getElementById("gameDisplay");
//stores the store info in a const so it can be referred back to later when we are getting the game deals
//this will allow us to display which store is offering which deal
const stores = getStores();

async function getStores(){
    //gets the store info which never changes
    const url = 'https://cheapshark-game-deals.p.rapidapi.com/stores';
    
    try {
	    const response = await fetch(url, options);
	    const result = await response.text();
	    return result;
    } catch (error) {
	    console.error(error);
    }
}


async function searchGame(options){
    //Clears the page when the user searches
    searchedGames.innerHTML = '';
    //takes in user input, splits the words inpitted by spaces by spaces, and then combines words
    //with %20 betweent hem as thaqt is the format of the api url
    let searchGameText = document.getElementById("searchGame").value;
    let seperatedSearchGameText = searchGameText.split(" ");
    let combinedSearchGameText = seperatedSearchGameText.join("%20"); 
    //puts the users input in the fetch url and then sends each element of the response to populate games()
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
    } catch (error) {
	    console.error(error);
    }
}

function populateGames(obj)
{  
    //Creates a Bootstrap card and populates it with the data from searchGame()
    // The data taken here is the games name and the box art of that game
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

    col1.appendChild(coverArt);
    cardBody.appendChild(gameTitle);
    getDeals(obj,cardBody)
    col2.appendChild(cardBody);
    row.appendChild(col1);
    row.appendChild(col2);
    card.appendChild(row);
    
    searchedGames.appendChild(card);
}

async function getDeals(obj, container)
{
    //takes the name of the game from populate games, seperates the name at the spaces and combines them with
    //%20 similar to what we did in searchGame()
    let gameTitle = obj['external'];
    let seperatedGameTitle = gameTitle.split(" ");
    let combinedGameTitle = seperatedGameTitle.join("%20");
    //plugs the combined game name into the api link to get back results for that game
    let url = `https://cheapshark-game-deals.p.rapidapi.com/deals?title=${obj['external']}&output=json&sortBy=Deal%20Rating&exact=true&metacritic=0`;

    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();

        let dealList = document.createElement('ul');
        dealList.style = "list-style-type:none;";

        let rating = document.createElement('p');
        rating.className='card-text';

        let metacriticGameLink = document.createElement('a');
        let steamGameLink = document.createElement('a');

        let hasCreatedReviewData = false;

        result.forEach(element => {
            if(obj['external'] == element.title)
            {
                if(!hasCreatedReviewData){
                    if(element.metacriticLink != null){  
                        if(element.metacriticScore !=0){                  
                            rating.innerHTML= "Metacritic Rating = " + element.metacriticScore;
                        }
                        else{
                            rating.innerHTML= "No Metacritic Rating";
                        }
                        metacriticGameLink.href = "https://metacritic.com" + element.metacriticLink;
                        metacriticGameLink.textContent = `${obj['external']} Metacritic Link`;
                    }
                    else if(element.steamAppID != null){
                        rating.innerHTML= "Steam Rating = " + element.steamRatingPercent;
                    }
                    else{    
                        rating.innerHTML= "No Game Rating Data Available";
                        gameLinkLink.textContent= "No Game Link Available";
                    }

                    if(element.steamAppID!=null){
                        
                        steamGameLink.href = "https://store.steampowered.com/app/" + element.steamAppID;
                        steamGameLink.textContent = `${obj['external']} Steam Link`;
                    }

                    hasCreatedReviewData = true;
                }


            }
        })

        container.appendChild(rating);
        container.appendChild(gameLink);

    } catch (error) {
        console.error(error);
    }

    return;
}