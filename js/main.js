/*****************/
/* Balloons Game */
/*****************/

'use strict';

// Global Vars //
const BALLOONS_LENGTH    = 5;
const LIMIT_SPEED        = 20;
const BALLOON_OFFSET     = window.innerWidth / 4;
const SPEED_ACCELERATION = 10;
var gScore         = 0;
var gBalloons      = []
var gGameInterval  = undefined;
var gIsGameStarted = false;

function onInit() {
    const elContainer = document.querySelector('.balloons');

    for (let i = 0; i < BALLOONS_LENGTH; i++) {
        // MODEL //
        let balloon = createModelBalloon();
        gBalloons.push(balloon);
        
        // DOM //
        let elBalloon = createDOMBalloon(i);

        // Append to Container //
        elContainer.appendChild(elBalloon);
    }
}

function createDOMBalloon(idx) {
    let elBalloon = document.createElement('div');
    elBalloon.classList.add('balloon');
    elBalloon.style.backgroundColor = getRandomColor();
    elBalloon.style.left    = (((idx + 1) * 100) + BALLOON_OFFSET) + 'px';
    elBalloon.style.bottom  = '0px';
    elBalloon.innerText     = '😊';
    elBalloon.dataset.index = idx;
    elBalloon.setAttribute('onclick', 'onBalloonClicked(this)');
    elBalloon.setAttribute('onmouseover', `onSpeedUp(${idx})`);
    return elBalloon;
}

function createModelBalloon() {
    return {
        bottom: 0,
        speed: getRandomSpeed(),
        isPopped: false
    };
}

function onBalloonClicked(elBalloon) {
    // DOM //
    playSound();

    updateScore();
    
    elBalloon.style.opacity = 0;

    // After the fade is complete ---> Hide it //
    setTimeout(() => { 
        elBalloon.style.display = 'none';
        checkWinCondition();
    }, 200);

    // MODEL //
    const idx = +elBalloon.dataset.index;
    gBalloons[idx].bottom   = 0;
    gBalloons[idx].isPopped = true;
}

function playSound() {
    const popSound = document.getElementById('pop-sound');
    popSound.currentTime = 0; // Rewind if already playing //
    popSound.play();
}

function updateScore() {
    gScore++;
    const elScore     = document.getElementById('score');
    elScore.innerText = 'Score : ' + gScore;
}

function onPlayGame() {
    gIsGameStarted      = true;

    const elStartBtn    = document.getElementById('start-btn');
    elStartBtn.disabled = true;

    const elBalloons = document.querySelectorAll('.balloon');
    const elTitle    = document.querySelector('.game-title');
    elTitle.style.opacity = 0;

    gGameInterval = setInterval(() => {
        for (let i = 0; i < elBalloons.length; i++) {
            // MODEL //
            if (gBalloons[i].isPopped) continue;
            gBalloons[i].bottom += gBalloons[i].speed;

            // DOM //
            const currBalloon = elBalloons[i];
            currBalloon.style.bottom = gBalloons[i].bottom + 'px';

            // Edge Case //
            checkBalloonOutOfBounds(i);
        }
    }, 500);
}

function checkBalloonOutOfBounds(idx) {
    const pageHeight = document.documentElement.scrollHeight;
    if (gBalloons[idx].bottom > pageHeight) {
        const elLoseMsg = document.getElementById('lose-msg');
        elLoseMsg.style.display = 'block';
        clearInterval(gGameInterval);
    }
}

function onSpeedUp(idx) {
    if (!gIsGameStarted) return;
    let currBalloon    = gBalloons[idx];
    currBalloon.speed += SPEED_ACCELERATION;
}

function onRestartGame() {
    gIsGameStarted = false;

	// Stop the current animation //
    clearInterval(gGameInterval);

    // MODEL //
    gBalloons = [];
    gScore    = 0;

    // DOM //
    resetVariables();

	// Rebuild Balloons //
    onInit();
}

function resetVariables() {
    const elContainer = document.querySelector('.balloons');
    elContainer.innerHTML = '';

    const elWinMsg = document.getElementById('win-msg');
    elWinMsg.style.display = 'none';

    const elLoseMsg = document.getElementById('lose-msg');
    elLoseMsg.style.display = 'none';

    const elScore = document.getElementById('score');
    elScore.innerText = 'Score : 0';

    const elGameTitle = document.querySelector('.game-title');
    elGameTitle.style.opacity = 1;
    
    const elStartBtn = document.getElementById('start-btn');
    elStartBtn.disabled = false;
}

function checkWinCondition() {
    const elBalloons = document.querySelectorAll('.balloon');
    let allPopped    = true;

    for (let i = 0; i < elBalloons.length; i++) {
        if (elBalloons[i].style.display !== 'none') {
            allPopped = false;
            return;
        }
    }

    if (allPopped) {
        const elWinMsg = document.getElementById('win-msg');
        elWinMsg.style.display = 'block';
        clearInterval(gGameInterval);
    }
}

function getRandomSpeed() {
    return Math.floor(Math.random() * LIMIT_SPEED) + 1;
}

function getRandomColor() {
    let color     = '#'
    const LIMIT   = 16;
    const letters = '0123456789ABCDEF'

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * LIMIT)]
    }

    return color
}