var ctx;
var canvas;
var gameLoop;
var letterLoop;

var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var letterHeight = 30;
var letterWidth = 1;
var letterObjects = [];
var changeTimer = 0;

var backgroundColor = "#696969";
var textColor = "#708090";

var words = ["HELLO", "JAVASCRIPT", "ORANGES", "IRIDESCENT", "ERROR", "HANNWE"];

window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.font = letterHeight + "px Consolas";
    letterWidth = ctx.measureText("A").width;

    letterObjects = [];
    for (let i = 0; i < canvas.height / letterHeight + 1; i++) {
        for (let j = 0; j < canvas.width / letterWidth + 1; j++) {
            letterObjects.push(new Letter(j * letterWidth, 1 + i * letterHeight - letterHeight / 5, i));
        }
    }

    canvas.width = Math.ceil(canvas.width / letterWidth) * letterWidth;
    canvas.height = Math.ceil(canvas.height / letterHeight) * letterHeight;

    gameLoop = setInterval(step, 1000 / 60);
}

function step() {
    if (changeTimer <= 0) {
        changeTimer = 0;
        for (let i = 0; i < letterObjects.length / 200; i++) {
            let letterToChange = letterObjects[Math.floor(Math.random() * letterObjects.length)];
            if (letterToChange.changeImunity > 0) {
                continue;
            }
            letterToChange.letter = letters[Math.floor(Math.random() * letters.length)]
            letterToChange.time = 1;
        }
    }
    changeTimer--;

    if (Math.random() < 0.0025) {
        addWord();
        console.log("Word added!");
    }

    for (let i = 0; i < letterObjects.length; i++) {
        letterObjects[i].step();
    }

    draw();
}

function draw() {
    ctx.fillStyle = "dimgray";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < letterObjects.length; i++) {
        letterObjects[i].draw();
    }
}
function Letter(x, y, row) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.letter = letters[Math.floor(Math.random() * letters.length)];
    this.time = 0;
    this.changeImunity = 0;

    this.step = function () {
        if (this.time > 0.15) {
            this.time -= 0.005;
        } else {
            this.time = 0.15;
        }
        if (this.changeImunity > 0) {
            this.changeImunity--;
        }

        if (this.row % 2 === 0) {
            this.x += 0.1;
        } else {
            this.x -= 0.1;
        }

        if (this.x > canvas.width) {
            this.x = -letterWidth;
        }
        if (this.x < -letterWidth) {
            this.x = canvas.width;
        }
    }

    this.draw = function () {
        ctx.font = letterHeight + "px Consolas";
        ctx.fillStyle = lerpColor(backgroundColor, textColor, this.time);
        ctx.fillText(this.letter, this.x, this.y + letterHeight);
    };
}

function lerpColor(startColor, endColor, t) { // Remember to thank our good friend, AI, for this function
    // Clamp t to [0,1]
    t = Math.min(Math.max(t, 0), 1);

    // Helper: expand “#RGB” to “#RRGGBB”
    function normalize(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(ch => ch + ch).join('');
        }
        return hex;
    }

    // Helper: parse “RRGGBB” → [r,g,b]
    function hexToRgb(hex) {
        hex = normalize(hex);
        const intVal = parseInt(hex, 16);
        return [
            (intVal >> 16) & 0xFF,
            (intVal >> 8) & 0xFF,
            intVal & 0xFF
        ];
    }

    // Helper: [r,g,b] → “#RRGGBB”
    function rgbToHex([r, g, b]) {
        const pad = v => v.toString(16).padStart(2, '0');
        return `#${pad(r)}${pad(g)}${pad(b)}`;
    }

    const c1 = hexToRgb(startColor);
    const c2 = hexToRgb(endColor);

    // Interpolate each channel
    const result = c1.map((v1, i) =>
        Math.round(v1 + (c2[i] - v1) * t)
    );

    return rgbToHex(result);
}

async function addWord() {
    let word = words[Math.floor(Math.random() * words.length)];
    let startLetterIndex = Math.floor(Math.random() * letterObjects.length);
    if (letterObjects[startLetterIndex + word.length] != undefined && letterObjects[startLetterIndex].y == letterObjects[startLetterIndex + word.length].y) {
        for (let i = 0; i < word.length; i++) {
            letterObjects[startLetterIndex + i].letter = word[i];
            letterObjects[startLetterIndex + i].time = 1;
            letterObjects[startLetterIndex + i].changeImunity = 60 * 3;
            await sleep(Math.random() * 50 + 50);
        }
    }
    else {
        addWord();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}