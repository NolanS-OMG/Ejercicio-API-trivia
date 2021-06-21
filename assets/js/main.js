// Páginas
let initPage = document.getElementById("initial");
let formPage = document.getElementById("form");
formPage.style.display = "none";
let questionsPage = document.getElementById("questions");
questionsPage.style.display = "none";
let scorePage = document.getElementById("score");
scorePage.style.display = "none";

// Botón para confirmar usuario
let playerNameButton = document.getElementById("submitPlayerName");

// Todo el form que contiene la selección del tipo de preguntas
let questionsForm = document.getElementById("questionChooser");
let questionsAmount = document.getElementById("amount");
let questionsCategory = document.getElementById("category");
let questionsDifficulty = document.getElementById("difficulty");
let questionsType = document.getElementById("type");

// Botones para las respuestas
let answer1 = document.getElementById("answer1");
let answer2 = document.getElementById("answer2");
let answer3 = document.getElementById("answer3");
let answer4 = document.getElementById("answer4");

// Elementos HTML del final
let tableDiv = document.getElementById("scoresContainer");
let restartButton = document.getElementById("restart");

// Variables de control
let players = JSON.parse(localStorage.getItem("playerStorageArray"));
let playerIndex = -1;
let questions;
let questionIndex = -1;
let currentScore = 0;
let currentCorrectAnswer = 0;

const createInfoBox = phrase => {
  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "corner-message-container");

  let iSquare = document.createElement("div");
  iSquare.setAttribute("class", "corner-message-i");

  let iText = document.createElement("h4");
  iText.innerText = "i";

  let phraseDiv = document.createElement("div");
  phraseDiv.setAttribute("class", "corner-message-text-container");

  let phrasePar = document.createElement("p");
  phrasePar.innerText = phrase;

  phraseDiv.appendChild(phrasePar);
  iSquare.appendChild(iText);

  infoDiv.appendChild(iSquare);
  infoDiv.appendChild(phraseDiv);

  return infoDiv;
}

const submitPlayerName = () => {
  let playerName = document.getElementById("playerName").value;

  let infoPhrase = ""

  if (players === null) {
    players = [{name:playerName.toLowerCase(), highScore:0}];
    playerIndex = 0;
    infoPhrase = "Se agregó un usuario nuevo"
  } else {
    players.forEach((player, index) => {
      if (playerName.toLowerCase() === player.name) {
        playerIndex = index;
        infoPhrase = "Bienvenido de nuevo " + playerName
      }
    });
    if (playerIndex === -1) {
      userIndex = players.length;
      players.push({name: playerName.toLowerCase(), highScore: 0});
      infoPhrase = "Se agregó un usuario nuevo"
    }
  }

  localStorage.setItem("playerStorageArray", JSON.stringify(players));

  initPage.style.display = "none";

  formPage.style.display = "block";

  formPage.appendChild(createInfoBox(infoPhrase));
}

let getAPIData = e => {
  e.preventDefault();
  let url = `https://opentdb.com/api.php?amount=${questionsAmount.value}&category=${questionsCategory.value}`;
  if ((questionsDifficulty.value !== 0) && (questionsType.value !== "boolean")) {
    url += `&difficulty=${questionsDifficulty.value}&type=${questionsType.value}`
  } else if (questionsDifficulty.value !== 0) {
    url += `&difficulty=0&type=${questionsType.value}`
  } else if ((questionsDifficulty.value === 0) && (questionsType.value !== 0)) {
    url += `&difficulty=${questionsDifficulty.value}&type=${questionsType.value}`
  }
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      questions = data.results;
      beforeStartGame();
    });
};

const beforeStartGame = () => {
  questionIndex = questionIndex + 1;

  if (questionIndex === questions.length) {
    questionsPage.style.display = "none";
    scorePage.style.display = "block";
    scores();
  } else {
    formPage.style.display = "none";
    questionsPage.style.display = "block";
    startGame();
  }
}

const startGame = () => {
  let currentQuestion = questions[questionIndex];
  document.getElementById("questionName").innerText = currentQuestion.question;

  document.getElementById("currentScore").innerText = currentScore;

  document.getElementById("question_index").innerText = questionIndex + 1;
  document.getElementById("num_questions").innerText = questions.length;

  if (currentQuestion.incorrect_answers.length == 1) {
    document.getElementById("answer1").innerText = "True";
    document.getElementById("answer2").innerText = "False";
    document.getElementById("answer3").style.display = "none";
    document.getElementById("answer4").style.display = "none";

    if (currentQuestion.correct_answer === "True") {
      currentCorrectAnswer = 1;
    } else {
      currentCorrectAnswer = 2;
    }
  } else {
    document.getElementById("answer1").style.display = "Block";
    document.getElementById("answer2").style.display = "Block";
    document.getElementById("answer3").style.display = "Block";
    document.getElementById("answer4").style.display = "Block";

    correct_index_answer = Math.floor(Math.random() * 4) + 1;
    currentCorrectAnswer = correct_index_answer;
    document.getElementById("answer" + correct_index_answer.toString()).innerText = currentQuestion.correct_answer;

    let j = 0;
    for (let i = 1; i <= 4; i++) {
      if (i === correct_index_answer) continue;
      document.getElementById("answer" + i.toString()).innerText = currentQuestion.incorrect_answers[j];
      j++;
    }
  }
};

const scores = () => {

  if (players[playerIndex].highScore < currentScore) {
    players[playerIndex].highScore = currentScore;
    localStorage.setItem("playerStorageArray", JSON.stringify(players));
  }

  let headTableDiv = document.createElement("div");
  headTableDiv.setAttribute("class","score-row");

  let headName = document.createElement("h4");
  headName.innerText = "NOMBRE";
  let headScore = document.createElement("h4");
  headScore.innerText = "PUNTOS";

  headTableDiv.appendChild(headName);
  headTableDiv.appendChild(headScore);

  tableDiv.appendChild(headTableDiv);

  let copyPlayers = new Array();
  players.forEach(player => {
    copyPlayers.push(player);
  });
  let topPlayers = [];
  players.forEach( () => {
    let maxScore = 0;
    let maxScoreIndex = 0;
    for (let j = 0; j < copyPlayers.length; j++) {
      if (copyPlayers[j].highScore > maxScore) {
        maxScore = copyPlayers[j].highScore;
        maxScoreIndex = j;
      }
    }
    topPlayers.push(copyPlayers[maxScoreIndex])
    copyPlayers.splice(maxScoreIndex, 1);
  })

  let k = 0;
  while ((k < 5) && (k < topPlayers.length)) {
    let rowTableDiv = document.createElement("div");
    rowTableDiv.setAttribute("class","score-row");

    let rowName = document.createElement("h4");
    rowName.innerText = topPlayers[k].name;
    let rowScore = document.createElement("h4");
    rowScore.innerText = topPlayers[k].highScore;

    rowTableDiv.appendChild(rowName);
    rowTableDiv.appendChild(rowScore);

    tableDiv.appendChild(rowTableDiv);
    k++;
  }
}

const ans1 = () => {
  if (currentCorrectAnswer === 1) {
    currentScore = currentScore + 1;
  }
  beforeStartGame();
}

const ans2 = () => {
  if (currentCorrectAnswer === 2) {
    currentScore = currentScore + 1;
  }
  beforeStartGame();
}

const ans3 = () => {
  if (currentCorrectAnswer === 3) {
    currentScore = currentScore + 1;
  }
  beforeStartGame();
}

const ans4 = () => {
  if (currentCorrectAnswer === 4) {
    currentScore = currentScore + 1;
  }
  beforeStartGame();
}

const startAgain = () => {
  scorePage.style.display = "none";
  formPage.style.display = "block";
  playerIndex = -1;
  questionIndex = -1;
  currentScore = 0;
}

playerNameButton.addEventListener("click", submitPlayerName);

questionsForm.addEventListener("submit", getAPIData);

answer1.addEventListener("click", ans1);
answer2.addEventListener("click", ans2);
answer3.addEventListener("click", ans3);
answer4.addEventListener("click", ans4);

restartButton.addEventListener("click", startAgain);