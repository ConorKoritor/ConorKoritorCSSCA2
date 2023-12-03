
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
let stores = null;
//get stores saves the json array to the stores variable so we can access it later
getStores();

async function getStores(){
    //gets the store info which never changes
    const url = 'https://cheapshark-game-deals.p.rapidapi.com/stores';
    
    try {
	    const response = await fetch(url, options);
	    stores = await response.json();
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
    
        result.forEach(game => {
            populateGames(game);
        });
    } catch (error) {
	    console.error(error);
    }
}

function populateGames(game)
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
    coverArt.src = game['thumb'];
    coverArt.className = "img-fluid rounded-start";

    let col2 = document.createElement('div');
    col2.className = 'col-md-8';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let gameTitle = document.createElement('h5');
    gameTitle.className = 'card-title';
    gameTitle.innerHTML = game['external'];

    col1.appendChild(coverArt);
    cardBody.appendChild(gameTitle);
    //sends the card body and the game to deals to search for and populate the deals that the game may have
    getDeals(game,cardBody)
    col2.appendChild(cardBody);
    row.appendChild(col1);
    row.appendChild(col2);
    card.appendChild(row);
    
    searchedGames.appendChild(card);
}

async function getDeals(game, cardBody)
{
    //this function is called for  every game that was found in the search and is called from populate games()
    //takes the name of the game from populate games, seperates the name at the spaces and combines them with
    //%20 similar to what we did in searchGame()
    let gameTitle = game['external'];
    let seperatedGameTitle = gameTitle.split(" ");
    let combinedGameTitle = seperatedGameTitle.join("%20");
    //plugs the combined game name into the api link to get back results for that game
    let url = `https://cheapshark-game-deals.p.rapidapi.com/deals?title=${combinedGameTitle}&output=json&sortBy=Deal%20Rating&exact=true&metacritic=0`;

    try {
        let response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let result = await response.json();

        //This api endpoint might return 5 results per game as they would be considered seperate deals
        //this variable is so that it only create/append 1 review per game 
        let hasCreatedReviewData = false;

        //Create the deal label and the deal list poutside of the for each loop.
        //this means that the ul container for each deal li is not made more than once and the 
        //p that labels the deal list is not created more than once
        let dealLabel = document.createElement('p');
        dealLabel.className = 'card-text';
        dealLabel.innerHTML = "Deals";

        let dealList = document.createElement('ul');
        dealList.id = "dealList"
        dealList.style = "list-style-type:none;";    

        result.forEach(deal => {
            
            //populateRatingsAndRetail creates elements for Game Deals and the retail price of the game
            //first we check if it has run once already. If it has then it doesn't need to run
            //again for each deal as we only want this info displayed once
            if(!hasCreatedReviewData){
                populateRatingsAndRetail(game, deal, cardBody, hasCreatedReviewData);
                hasCreatedReviewData = true;
            }
            populateDeals(deal, dealList);

            //checks if the deal List is empty which means there are no sales available for that game
            //displays that there are no deals available
            if(isEmpty("dealList")){
                let deal = document.createElement('li');
                deal.innerHTML = "No Deals Available";
                dealList.appendChild(deal);
            }
            
        })

        //add all of the elements of data from the getDeals endpoint and adds them to the container that will
        //be added to the card div
        
        cardBody.appendChild(dealLabel);
        cardBody.appendChild(dealList);

    } catch (error) {
        console.error(error);
    }
    

    return;
}

function populateRatingsAndRetail(gameObj, dealObj, container, hasCreatedReviewData){
    //Create containers for each of the data points.
    // the retail price of the game,
    //the steam rating and the metacritic rating
    //and the link to both steam and metacritic
    let metacriticRating = document.createElement('p');
    metacriticRating.className='card-text';

    let steamRating = document.createElement('p');
    steamRating.className='card-text';

    let metacriticGameLink = document.createElement('a');
    let steamGameLink = document.createElement('a');   

    let retailPrice = document.createElement('p');
    retailPrice.className='card-text';


    //checks if the title of the game is the same as the obj that was passed in from populate games
    if(gameObj['internalName'] == dealObj.internalName)
    {
            retailPrice.innerHTML = "Retail Price: $" + dealObj.normalPrice;

            //checks if there is metacritic data to pull from the api
            if(dealObj.metacriticLink != null){  
                if(dealObj.metacriticScore !=0){                  
                    metacriticRating.innerHTML= "Metacritic Rating = " + dealObj.metacriticScore;
                }
                else{
                    metacriticRating.innerHTML= "No Metacritic Rating";
                }
                metacriticGameLink.href = "https://metacritic.com" + dealObj.metacriticLink;
                metacriticGameLink.textContent = `${gameObj['external']} Metacritic Link`;
            }
            //if there isnt we display that there isnt
            else{    
                metacriticRating.innerHTML= "No Metacritic Rating Data Available";
                metacriticGameLink.textContent= "No Metacritic Link Available";
            }

            //same as metacritic we check if there is steam data
            if(dealObj.steamAppID!=null){
                steamRating.innerHTML= "Steam Rating = " + dealObj.steamRatingPercent;
                steamGameLink.href = "https://store.steampowered.com/app/" + dealObj.steamAppID;
                steamGameLink.textContent = `${gameObj['external']} Steam Link`;
            }
            else{    
                steamRating.innerHTML= "No Steam Rating Data Available";
                steamGameLink.textContent= "No Steam Link Available";
            }

            hasCreatedReviewData = true;
        }
        container.appendChild(retailPrice);
        container.appendChild(metacriticGameLink);
        container.appendChild(metacriticRating);
        container.appendChild(steamGameLink);
        container.appendChild(steamRating);

    }


function populateDeals(dealObj, dealList){


    //Loops through the stores array to check if the store matches the store the deal is coming from
    //and then sets the stores value to that name
    let store = "";

    stores.forEach(stores => {
        if(stores.storeID == dealObj.storeID){
            store = stores.storeName;
        }
    });

    //if the game is on sale display that sale price along with the store it comes from
    let deal = document.createElement('li');
    if(dealObj.isOnSale == "1"){
        deal.innerHTML = "$" + dealObj.salePrice + "at " + store;
        dealList.appendChild(deal);
    }

}

function isEmpty(id) {
    //this function is to check if the ul dealList is empty so that I can print out there are no deals available
    return document.getElementById(id).innerHTML.trim() == ""
  }