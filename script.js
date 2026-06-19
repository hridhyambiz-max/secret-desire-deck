let cards = [];

function showScreen(id){

document
.querySelectorAll(".screen")
.forEach(screen=>screen.classList.remove("active"));

document
.getElementById(id)
.classList.add("active");

}

function savePlayer1(){

localStorage.setItem(
"p1",
document.getElementById("p1").value
);

showScreen("player2");

}

function savePlayer2(){

localStorage.setItem(
"p2",
document.getElementById("p2").value
);

createDeck();

showScreen("game");

}

function createDeck(){

let p1 =
localStorage.getItem("p1")
.split("\n");

let p2 =
localStorage.getItem("p2")
.split("\n");

cards = [...p1,...p2];

const deck =
document.getElementById("deck");

deck.innerHTML="";

cards.forEach(text=>{

const card =
document.createElement("div");

card.className="card";

card.innerHTML="🎴";

card.onclick=()=>{

card.innerHTML=
"<small>"+text+"</small>";

};

deck.appendChild(card);

});

}
