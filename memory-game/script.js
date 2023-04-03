let score = 0;
const gameContainer = document.getElementById("game");
const scoreBox = document.getElementById("score-box");
const winMsg = document.getElementById("win-msg");
const startBtn = document.getElementsByClassName("start-btn")[0];

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
  "lightblue",
  "brown",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "pink",
  "lightblue",
  "brown"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

/**
 * Called when pressing the start button. Removes the "hidden" class from the cards,
 * and adds it to the start button
 */
function startGame(event, container = gameContainer) {
  for (let card of container.children) {
    card.classList.remove("hidden");
  }
  startBtn.classList.add("hidden");
}
startBtn.addEventListener("click", startGame);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let count = 0;
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.add("hidden");
    newDiv.id = "card" + count;
    
    newDiv.style.backgroundColor = "grey";

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    count++;
  }
}

//called when a card is flipped
function handleCardClick(event, container = gameContainer) {
  if(findNumberOfFlippedCards(container) >= 2) { //only 2 cards can be flipped over at any one time
    return;
  }
  updateScore(); //increase score by one
  let clickedCard = event.target;
  clickedCard.style.backgroundColor = clickedCard.classList[0]; //flip card over to show it's color
  clickedCard.classList.add("flipped");
  checkForMatch(clickedCard); //check if there is another card currently flipped over that's the same color
  setTimeout(flipCardFaceDown, 1000, clickedCard); //flip card face down after 1 second
  //check to see if all matches have been found
  if(checkForWin(container)) {
      declareWinner();
  }
}

/**
 * Flips a card face down, unless it has been "found" (it has been matched with another card)
 * @param {*} card 
 */
function flipCardFaceDown(card) {
  if(!card.classList.contains("found")) {
    card.classList.remove("flipped");
    card.style.backgroundColor = "grey";
  }
}

/**
 * In order to win, every card must be "found"
 * @param {*} container 
 * @returns boolean
 */
function checkForWin(container) {
    for(card of container.children) {
      if(!card.classList.contains("found")) {
        return false;
      }
    }
    return true;
}

/**
 * To check for match, we loop through all the cards, checking to see if there is a card with the 
 * same color as the given card, is currently flipped over, and doesn't have the same id as the 
 * given card
 * @param {*} card 
 */
function checkForMatch(card) { 
  let color = card.classList[0]; 
  for(let otherCard of gameContainer.children) {
    if(otherCard.classList.contains("flipped") && otherCard.classList.contains(color) &&
       otherCard.id != card.id) {
          card.classList.add("found");
          otherCard.classList.add("found");
          card.classList.remove("flipped");
          otherCard.classList.remove("flipped");
      }
      else { //avoided the scenario of the card matching with itself
      }
    }
}

//finds the number of temporarily "flipped" cards (not the found matches)
function findNumberOfFlippedCards(gameContainer) {
  let count = 0;
  for(let card of gameContainer.children) {
    if(card.classList.contains("flipped")) {
      count++;
    }
  }
  return count;
}

//updates the displayed score
function updateScore() {
  score++;
  scoreBox.innerText = "Score: " + score;
}

/**
 * Displays the "You win!" message, and removes the eventListeners from the cards
 * @param {*} container 
 */
function declareWinner(container = gameContainer) {
  winMsg.classList.remove("hidden");
  for(card of container.children) {
    card.removeEventListener("click", handleCardClick);
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
