let score = 0;
let numCards = 10;
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
  "red",
  "blue",
  "green",
  "orange",
  "purple"
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

function handleCardClick(event, container = gameContainer) {
  if(findNumberOfFlippedCards(container) >= 2) {
    return;
  }
  updateScore();
  let clickedCard = event.target;
  clickedCard.style.backgroundColor = clickedCard.classList[0];
  clickedCard.classList.add("flipped");
  checkForMatch(clickedCard);
  setTimeout(flipCardFaceDown, 1000, clickedCard);
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

function checkForWin(container) {
    for(card of container.children) {
      if(!card.classList.contains("found")) {
        return false;
      }
    }
    return true;
}

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

function findNumberOfFlippedCards(gameContainer) {
  let count = 0;
  for(let card of gameContainer.children) {
    if(card.classList.contains("flipped")) {
      count++;
    }
  }
  console.log("Count: " + count);
  return count;
}

function updateScore() {
  score++;
  scoreBox.innerText = "Score: " + score;
}

function declareWinner(container = gameContainer) {
  winMsg.classList.remove("hidden");
  for(card of container.children) {
    card.removeEventListener("click", handleCardClick);
  }
}



// when the DOM loads
createDivsForColors(shuffledColors);
