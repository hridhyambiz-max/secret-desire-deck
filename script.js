let cards = [];
let currentPlayer = 1;
let scores = { p1: 0, p2: 0 };
let selectedCardIndex = null;

let stats = {
  completed:0,
  skipped:0,
  secretCompleted:0,
  systemCompleted:0
};

let names = {
  p1:"Player 1",
  p2:"Player 2",
  couple:""
};

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

function saveNames(){
  const p1 = document.getElementById("player1Name").value.trim();
  const p2 = document.getElementById("player2Name").value.trim();
  const couple = document.getElementById("coupleName").value.trim();

  if(!p1 || !p2){
    alert("Dono players ka name likho.");
    return;
  }

  names.p1 = p1;
  names.p2 = p2;
  names.couple = couple || `${p1} ❤️ ${p2}`;

  localStorage.setItem("names", JSON.stringify(names));

  document.getElementById("p1Title").innerText = `${names.p1}'s Secret Wishes`;
  document.getElementById("p2Title").innerText = `${names.p2}'s Secret Wishes`;

  showScreen("player1");
}

function savePlayer1(){
  const value = document.getElementById("p1").value.trim();

  if(!value){
    alert(`${names.p1}, at least one wish likho.`);
    return;
  }

  localStorage.setItem("p1", value);
  document.getElementById("p1").value = "";
  showScreen("player2");
}

function savePlayer2(){
  const value = document.getElementById("p2").value.trim();

  if(!value){
    alert(`${names.p2}, at least one wish likho.`);
    return;
  }

  localStorage.setItem("p2", value);
  createDeck();
  showScreen("game");
}

function createDeck(){
  const p1 = localStorage.getItem("p1").split("\n").filter(x=>x.trim());
  const p2 = localStorage.getItem("p2").split("\n").filter(x=>x.trim());

  const secretCards = [...p1, ...p2].map(text=>({
    text:text.trim(),
    type:"secret",
    used:false
  }));

  const systemCards = builtInCards.map(text=>({
    text:text,
    type:"system",
    used:false
  }));

  cards = shuffle([...secretCards, ...systemCards]).slice(0,18);

  renderDeck();
  updateAll();
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

  const card = cards[selectedCardIndex];
  card.used = true;

  if(currentPlayer === 1){
    scores.p1 += 10;
  }else{
    scores.p2 += 10;
  }

  stats.completed++;

  if(card.type === "secret"){
    stats.secretCompleted++;
  }else{
    stats.systemCompleted++;
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

  stats.skipped++;
  nextTurn();
}

function nextTurn(){
  selectedCardIndex = null;

  if(cards.every(card=>card.used)){
    showFinal();
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;

  updateAll();
  renderDeck();
  showScreen("game");
}

function updateAll(){
  document.getElementById("turnName").innerText =
    currentPlayer === 1 ? names.p1 : names.p2;

  document.getElementById("score1").innerText =
    `${names.p1}: ${scores.p1}`;

  document.getElementById("score2").innerText =
    `${names.p2}: ${scores.p2}`;

  const used = cards.filter(card=>card.used).length;
  const total = cards.length;
  const left = total - used;
  const percent = total ? (used / total) * 100 : 0;

  document.getElementById("progressText").innerText =
    `${used} / ${total} Completed`;

  document.getElementById("leftText").innerText =
    `${left} Left`;

  document.getElementById("progressBar").style.width =
    `${percent}%`;
}

function showFinal(){
  let winner = "";

  if(scores.p1 > scores.p2){
    winner = `${names.p1} wins tonight 💜`;
  }else if(scores.p2 > scores.p1){
    winner = `${names.p2} wins tonight 💜`;
  }else{
    winner = "Perfect tie. You both matched the energy 💜";
  }

  document.getElementById("coupleFinal").innerText =
    names.couple;

  document.getElementById("finalStats").innerHTML = `
    <b>${winner}</b><br><br>
    ${names.p1}: ${scores.p1} points<br>
    ${names.p2}: ${scores.p2} points<br><br>
    Completed: ${stats.completed}<br>
    Skipped: ${stats.skipped}<br>
    Secret Wishes Completed: ${stats.secretCompleted}<br>
    System Tasks Completed: ${stats.systemCompleted}
  `;

  showScreen("final");
}

function restartGame(){
  cards = [];
  currentPlayer = 1;
  scores = { p1:0, p2:0 };
  selectedCardIndex = null;

  stats = {
    completed:0,
    skipped:0,
    secretCompleted:0,
    systemCompleted:0
  };

  localStorage.clear();

  document.getElementById("player1Name").value = "";
  document.getElementById("player2Name").value = "";
  document.getElementById("coupleName").value = "";
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
