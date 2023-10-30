// Event listeners for keyboard
document.addEventListener("keydown", (e) => {
    const elem = document.querySelector(`#key-${e.keyCode}`);
    if (elem) {
        elem.classList.add("translate-y-1", "shadow-xl", "shadow-red-800");
    }
    keystrokes++; // Count each keydown event as a keystroke
});

document.addEventListener("keyup", (e) => {
    const elem = document.querySelector(`#key-${e.keyCode}`);
    if (elem) {
        elem.classList.remove("translate-y-1", "shadow-xl", "shadow-red-800");
    }
});

// DOM Manipulations
const showcase = document.querySelector("#text-showcase");
const input = document.querySelector("#user-input");
const timer = document.querySelector("#timer");
const button = document.querySelector("#start-button");

// Event Listeners
button.addEventListener("click", main);
input.addEventListener("input", (e) => {
    const value = e.target.value;
    const lastChar = value.slice(-1);
    if (lastChar === " ") {
        correctWords++;
        updateIndex();
    }
});

// Variables
let words = [];
let currentIndex = 0;
let keystrokes = 0;
let correctWords = 0;
let wrongWords = 0; // Initialize wrongWords count
let timerIntervalId;

// Functions
async function main() {
    await getWords();
    generateWords(0);
    startTimer(60); // Start the timer with a 60-second duration
}

async function getWords() {
    const url = "https://random-word-api.herokuapp.com/word?number=300&length=5";
    const data = await fetch(url);
    const result = await data.json();
    words = result;
}

function generateWords(startIndex) {
    showcase.innerHTML = "";
    for (let i = startIndex; i < startIndex + 34 && i < words.length; i++) {
        const spanElement = document.createElement("span");
        if (i === startIndex) {
            spanElement.classList.add("bg-gray-500", "rounded-sm");
        }
        spanElement.classList.add(`word-${i}`);
        spanElement.textContent = words[i] + " ";
        showcase.appendChild(spanElement);
    }
}

function updateIndex() {
    if (currentIndex > 0 && currentIndex % 33 === 0) {
        currentIndex++;
        generateWords(currentIndex);
        return;
    }
    document.querySelector(`.word-${currentIndex}`).classList.remove("bg-gray-500", "rounded-sm");
    currentIndex++;
    document.querySelector(`.word-${currentIndex}`).classList.add("bg-gray-500", "rounded-sm");
}

function startTimer(duration) {
    let timeLeft = duration;
    timerIntervalId = setInterval(() => {
        timer.textContent = timeLeft + "s"; // Update the timer element
        if (timeLeft <= 0) {
            clearInterval(timerIntervalId);
            timer.textContent = "Time's up!";
            input.setAttribute("disabled", "disabled"); // Disable input
            calculateWPM();
        }
        timeLeft--;
    }, 1000);
}

function calculateWPM() {
    const totalWords = correctWords + wrongWords;
    const totalKeystrokes = keystrokes;
    const accuracy = ((correctWords / totalWords) * 100).toFixed(2); // Calculate accuracy as a percentage
    const timeElapsed = 60; // 60 seconds
    const wpm = Math.round((totalWords / timeElapsed) * 60); // Calculate WPM
    alert(
        "Keystrokes: " + keystrokes +
        "\nAccuracy: " + accuracy + "%" +
        "\nCorrect Words: " + correctWords +
        "\nWrong Words: " + wrongWords +
        "\nYour WPM: " + wpm
    );
}
