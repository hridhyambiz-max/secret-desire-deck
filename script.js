let cards = [];
let currentPlayer = 1;
let scores = { p1: 0, p2: 0 };
let selectedCardIndex = null;

const builtInCards = [
  "Give your partner a genuine compliment.",
  "Hold hands for 2 minutes.",
  "Share one memory you love.",
  "Dance together for 30 seconds.",
  "Look into each other's eyes for 20 seconds.",
  "Say one thing you never say enough.",
  "Give your partner a warm hug.",
  "Let your partner choose one small wish.",
  "Tell your partner what you appreciate most.",
  "Plan your next date idea together.",
  "Play one romantic song.",
  "Take a cute couple selfie.",
  "Give your partner a surprise note.",
  "Recreate your first chat line.",
  "Ask one honest question."
];

function showScreen(id){
  document.querySelectorAll(".screen").forEach(screen=>{
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function savePlayer1(){
  const value = document.getElementById("p1").value.trim();

  if(!value){
    alert("Player 1, at least one wish likho.");
    return;
  }

  localStorage.setItem("p1", value);
  document.getElementById("p1").value = "";
  showScreen("player2");
}

function savePlayer2(){
  const value = document.getElementById("p2").value.trim();

  if(!value){
    alert("Player 2, at least one wish likho.");
    return;
  }

  localStorage.setItem("p2", value);
  createDeck();
  showScreen("game");
}

function createDeck(){
  const p1 = localStorage.getItem("p1").split("\n").filter(x=>x.trim());
  const p2 = localStorage.getItem("p2").split("\n").filter(x=>x.trim());

  const secretCards = [...p1, ...p2].map(text=>{
    return {
      text:text.trim(),
      type:"secret",
      used:false
    };
  });

  const systemCards = builtInCards.map(text=>{
    return {
      text:text,
      type:"system",
      used:false
    };
  });

  cards = shuffle([...secretCards, ...systemCards]).slice(0,18);

  renderDeck();
  updateScores();
  updateTurn();
}

function renderDeck(){
  const deck = document.getElementById("deck");
  deck.innerHTML = "";

  cards.forEach((card,index)=>{
    const div = document.createElement("div");
    div.className = "card";

    if(card.used){
      div.classList.add("used");
      div.innerHTML = "✓";
    }else{
      div.innerHTML = "🎴";
      div.onclick = ()=>openCard(index);
    }

    deck.appendChild(div);
  });
}

function openCard(index){
  selectedCardIndex = index;

  const card = cards[index];

  document.getElementById("cardTitle").innerText =
    card.type === "secret" ? "💜 Secret Wish" : "🎴 Couple Task";

  document.getElementById("cardText").innerText = card.text;

  showScreen("result");
}

function completeTask(){
  if(selectedCardIndex === null) return;

  cards[selectedCardIndex].used = true;

  if(currentPlayer === 1){
    scores.p1 += 10;
  }else{
    scores.p2 += 10;
  }

  nextTurn();
}

function skipTask(){
  if(selectedCardIndex === null) return;

  cards[selectedCardIndex].used = true;

  if(currentPlayer === 1){
    scores.p1 -= 5;
  }else{
    scores.p2 -= 5;
  }

  nextTurn();
}

function nextTurn(){
  selectedCardIndex = null;

  if(cards.every(card=>card.used)){
    showFinal();
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;

  updateScores();
  updateTurn();
  renderDeck();
  showScreen("game");
}

function updateTurn(){
  document.getElementById("turnName").innerText =
    currentPlayer === 1 ? "Player 1" : "Player 2";
}

function updateScores(){
  document.getElementById("p1Score").innerText = scores.p1;
  document.getElementById("p2Score").innerText = scores.p2;
}

function showFinal(){
  let text = "";

  if(scores.p1 > scores.p2){
    text = "Player 1 wins with " + scores.p1 + " points 💜";
  }else if(scores.p2 > scores.p1){
    text = "Player 2 wins with " + scores.p2 + " points 💜";
  }else{
    text = "It's a tie. Perfect balance 💜";
  }

  document.getElementById("winnerText").innerText = text;
  showScreen("final");
}

function restartGame(){
  cards = [];
  currentPlayer = 1;
  scores = { p1:0, p2:0 };
  selectedCardIndex = null;
  localStorage.clear();

  document.getElementById("p1").value = "";
  document.getElementById("p2").value = "";

  showScreen("welcome");
}

function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
