var ctx;
var canvas;
var gameLoop;
var letterLoop;

var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var fontSize = 30;
var letterObjects = [];

window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameLoop = setInterval(step, 1000 / 60);
    letterLoop = setInterval(randomizeLetters, 1000);

    ctx.fontSize = fontSize + "px Consolas";
    let letterWidth = ctx.measureText("A").width;


    letterObjects = [];
    for (let i = 0; i < canvas.height / fontSize + 1; i++) {
        for (let j = 0; j < canvas.width / letterWidth + 1; j++) {
            letterObjects.push(new Letter(j*letterWidth, 1 + i * fontSize - fontSize / 5));
        }
    }
}

function step() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw();
}

function draw() {
    ctx.fillStyle = "dimgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < letterObjects.length; i++) {
        letterObjects[i].draw();
    }
}

function randomizeLetters() {
    ctx.fontSize = fontSize + "px Consolas";
    let letterWidth = ctx.measureText("A").width;

    letterObjects = [];
    for (let i = 0; i < canvas.height / fontSize + 1; i++) {
        for (let j = 0; j < canvas.width / letterWidth + 1; j++) {
            letterObjects.push(new Letter(j * letterWidth, 1 + i * fontSize - fontSize / 5));
        }
    }
    addWords();
}

function Letter(x, y) {
    this.x = x;
    this.y = y;
    this.letter = letters[Math.floor(Math.random() * letters.length)];

    this.draw = function () {
        ctx.font = fontSize + "px Consolas";
        ctx.fillStyle = "slategray";
        ctx.fillText(this.letter, this.x, this.y+fontSize);
    };
}

function addWords() {
    let numberOfWords = letterObjects.length / 1000;
    for (let i = 0; i < numberOfWords; i++) {
        let possibleWords = ["HANNWE", "JAVASCRIPT", "IRIDESCENT"];
        let word = possibleWords[Math.floor(Math.random() * possibleWords.length)];
        let startLetter = Math.floor(Math.random() * (letterObjects.length - word.length));
        for (let i = 0; i < word.length; i++) {
            letterObjects[startLetter + i].letter = word.charAt(i);
        }
    }
}