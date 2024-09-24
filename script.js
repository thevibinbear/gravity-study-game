let terms = [];
let fallingElement = document.getElementById("falling-term");
let answerInput = document.getElementById("answer-input");
let scoreDisplay = document.getElementById("score");
let gameOverDisplay = document.getElementById("game-over");
let finalScoreDisplay = document.getElementById("final-score");
let fileInput = document.getElementById("file-input");
let startGameButton = document.getElementById("start-game-btn");
let pauseGameButton = document.getElementById("pause-game-btn");

let currentTermIndex = 0;
let score = 0;
let speed = 1;
let falling = false;
let gameInterval;
let isPaused = false;

function startGame() {
    fallingElement.style.display = 'block';
    if (terms.length === 0) {
        alert("Please upload a valid file with terms and definitions!");
        return;
    }

    score = 0;
    speed = 1;
    scoreDisplay.innerText = `Score: ${score}`;
    answerInput.disabled = false;
    answerInput.value = "";
    gameOverDisplay.style.display = "none";
    startGameButton.innerText = "Restart";
    pauseGameButton.disabled = false;
    isPaused = false;
    nextTerm();
}

function nextTerm() {
    if (falling) return;
    falling = true;

    currentTermIndex = Math.floor(Math.random() * terms.length);
    fallingElement.innerText = terms[currentTermIndex].term;
    fallingElement.style.top = "0px";

    gameInterval = setInterval(() => {
        if (isPaused) return;

        let top = parseInt(fallingElement.style.top) || 0;
        top += speed;
        fallingElement.style.top = top + "px";

        if (top >= 260) {
            gameOver();
        }
    }, 50);
}

function checkAnswer() {
    let userAnswer = answerInput.value.toLowerCase().trim();
    let correctAnswer = terms[currentTermIndex].definition.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
        score += 10;
        speed += 0.2;
        scoreDisplay.innerText = `Score: ${score}`;
        answerInput.value = "";
        falling = false;
        clearInterval(gameInterval);
        nextTerm();
    }
}

function gameOver() {
    falling = false;
    clearInterval(gameInterval);
    gameOverDisplay.style.display = "block";
    finalScoreDisplay.innerText = score;
    answerInput.disabled = true;
    pauseGameButton.disabled = true;
}

function parseTerms(content) {
    const lines = content.split('\n');
    terms = [];

    lines.forEach(line => {
        const [term, definition] = line.split(':');
        if (term && definition) {
            terms.push({ term: term.trim(), definition: definition.trim() });
        }
    });

    if (terms.length > 0) {
        startGameButton.disabled = false;
    } else {
        alert("Invalid file format. Please make sure it's in the 'term:definition' format.");
    }
}

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            parseTerms(content);
        };
        reader.readAsText(file);
    }
});

answerInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

startGameButton.addEventListener("click", startGame);

pauseGameButton.addEventListener("click", function() {
    isPaused = !isPaused;
    pauseGameButton.innerText = isPaused ? "Resume" : "Pause";
});

startGameButton.disabled = true;
pauseGameButton.disabled = true;
