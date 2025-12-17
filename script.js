const morseAlphabet = {
    "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", 
    "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", 
    "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", 
    "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", 
    "Y": "-.--", "Z": "--..", "1": ".----", "2": "..---", "3": "...--", 
    "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", 
    "9": "----.", "0": "-----", " ": "/"
};

const textAlphabet = Object.fromEntries(Object.entries(morseAlphabet).map(([k, v]) => [v, k]));

const textInput = document.getElementById('textInput');
const morseInput = document.getElementById('morseInput');
const swapBtn = document.getElementById('swapBtn');
const playBtn = document.getElementById('playBtn');
const referenceGrid = document.getElementById('referenceGrid');

let isTextToMorse = true;

Object.entries(morseAlphabet).forEach(([char, code]) => {
    if(char !== " ") {
        const div = document.createElement('div');
        div.innerHTML = `<span style="color:#0f0">${char}</span> ${code}`;
        referenceGrid.appendChild(div);
    }
});

function handleTranslation() {
    if (isTextToMorse) {
        const input = textInput.value.toUpperCase();
        morseInput.value = input.split("").map(char => morseAlphabet[char] || char).join(" ");
    } else {
        const input = textInput.value.trim().split(/\s+/); 
        morseInput.value = input.map(code => textAlphabet[code] || "").join("");
    }
}

textInput.addEventListener('input', handleTranslation);

swapBtn.addEventListener('click', () => {
    isTextToMorse = !isTextToMorse;
    const labelTop = document.getElementById('labelTop');
    const labelBottom = document.getElementById('labelBottom');
    
    if (isTextToMorse) {
        labelTop.innerText = "Text Input";
        labelBottom.innerText = "Morse Output";
        textInput.placeholder = "Type text here...";
        playBtn.style.display = "block";
    } else {
        labelTop.innerText = "Morse Input";
        labelBottom.innerText = "Text Output";
        textInput.placeholder = "Type Morse (Ex: .... .)";
        playBtn.style.display = "none";
    }
    textInput.value = ""; morseInput.value = "";
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playMorseSound(code) {
    let offset = 0;
    const dot = 0.1;
    code.split("").forEach(char => {
        if (char === "." || char === "-") {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const dur = char === "." ? dot : dot * 3;
            osc.frequency.value = 600;
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + offset);
            osc.stop(audioCtx.currentTime + offset + dur);
            offset += dur + dot;
        } else { offset += dot * 2; }
    });
}

playBtn.addEventListener('click', () => {
    if (isTextToMorse && morseInput.value.length > 0) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        playMorseSound(morseInput.value);
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    textInput.value = ""; morseInput.value = "";
});