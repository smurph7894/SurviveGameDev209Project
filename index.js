const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

const rows = 2;
const cols = 8;
const trackRight = 0;
const trackLeft = 1;
const trackUp = 1;
const trackDown = 0;
const spriteWidth = 650;
const spriteHeight = 262; 
const adventurerWidth = spriteWidth / cols; 
const adventurerHeight = spriteHeight / rows; 
let curXFrame = 0; 
let frameCount = 8; 
let srcX = 0; 
let srcY = 0;
let left = false;
let right = false;
let up = false;
let down = false;
let counter = 0;

// ************ Game Images ************************************************************************************ //
// Background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Adventurer image
let adventurerReady = false;
const adventurerImage = new Image();
adventurerImage.onload = function () {
    adventurerReady = true;
};
adventurerImage.src = "images/adventurerSpriteSheet.png";

// Scorpion image
let scorpionReady = false;
const scorpionImage = new Image();
scorpionImage.onload = function () {
    scorpionReady = true;
};
scorpionImage.src = "images/scorpion.png";

// Gem image
let gemReady = false;
const gemImage = new Image();
gemImage.onload = function () {
    gemReady = true;
};
gemImage.src = "images/gem.png";

// Border images
let tbBorder = false;
const tbBorderImage = new Image();
tbBorderImage.onload = function () {
    tbBorderReady = true
};
tbBorderImage.src = "images/tbborder.png";
let sBorder = false;
const sBorderImage = new Image();
sBorderImage.onload = function () {
    sBorderReady = true;
};
sBorderImage.src = "images/sborder.png";

// ************ Game Sounds ************************************************************************************ //
let soundEfx = document.getElementById("soundEfx");

const soundGameOver = "sounds/verloren-89595.mp3"
const soundHit ="sounds/hit-swing-sword-small-2-95566.mp3"
const soundGemCollected = "sounds/mixkit-quick-positive-video-game-notification-interface-265.wav"
const soundNxtLvl = "sounds/mixkit-game-flute-bonus-2313.wav"

const playEndAudio = (soundFile) => {
    return new Promise(res=>{
        soundEfx.src = soundFile;
        soundEfx.play();
        soundEfx.onended = res
    });
};

async function run() {
    await playEndAudio(soundHit)
    await playEndAudio(soundGameOver)
};
// ************ Character Placement ************************************************************************************ //
let gameBoard = [
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
]; // 9x9
let liveGameBoard = JSON.parse(JSON.stringify(gameBoard));


const placeCharacter = (character) => {
    // Create an array of all positions
    let positions = [];
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            positions.push({x: i, y: j});
        }
    }
    // Shuffle the positions array
    for(let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    // Iterate over the shuffled positions until an available one is found
    for(let i = 0; i < positions.length; i++) {
        let possPo = positions[i];
        if(liveGameBoard[possPo.x][possPo.y] === 'x') {
            liveGameBoard[possPo.x][possPo.y] = 'o';
            character.x = (possPo.x * 100) + 50;
            character.y = (possPo.y * 100) + 50;
            return (possPo.x, possPo.y);
        }
    }
    gameOver = true;
    alert(`YOU WON!!! Level Reach: ${level} and Gems Collected: ${gemsCollected}`);
};
// ************ Create Game objects ************************************************************************************ //
let scorpionObjects = [];
let scorpionPositions = [];
let gemObjects = [];
let gemPositions = [];

let adventurer = {
    speed: 200, 
    x: 0, 
    y: 0 
};

const scorpionCounter = () => {
    scorpionObjects = [];
    scorpionPositions = [];
    for(let i=0; i<level; i++){
        let scorpion = {
            speed: 100,
            x: 0,
            y: 0
        };
        scorpionObjects.push(scorpion);

        let scorpPo = placeCharacter(scorpion);
        let scorpionPosition = [scorpPo.x, scorpPo.y];
        scorpionPositions.push(scorpionPosition);
    };
};

const gemCounter = (gemsNxtLvl) => {
    gemObjects = [];
    gemPositions = [];
    for(let i=0; i<gemsNxtLvl; i++){
        let gem = {
            collected: false,
            x: 0,
            y: 0
        };
        gemObjects.push(gem);

        let gemPo = placeCharacter(gem);  
        let gemPosition = [gemPo.x, gemPo.y];
        gemPositions.push(gemPosition);
    };
}; 
// ************ Random Variables ************************************************************************************ //
let gemsCollected = 0;
let level = 0;
let firstTime = true;
let gemsToNextLevel = 0;
let gemsPerLevel = 4;
let gameOver = false;
const gemPoint = 1;

// ************ Level Controlls ************************************************************************************ //
const levelUp = () => {
    if(firstTime) {
        level++
        firstTime = false;
        scorpionCounter();
        gemCounter(gemsPerLevel);
        gemsToNextLevel = gemsToNextLevel + 4;   
    } else if(!firstTime) {
        liveGameBoard = JSON.parse(JSON.stringify(gameBoard)); //resetting gameboard to blank
        level++;
        gemsPerLevel = gemsPerLevel + 2;
        gemsToNextLevel = gemsToNextLevel + gemsPerLevel;
        scorpionCounter();
        gemCounter(gemsPerLevel);
    }
};
// ************ Handle keyboard controls ************************************************************************************ //
let keysDown = {}; 
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false)

// ************ Update game objects ************************************************************************************ //
const update = function (modifier) {
    left = false;
    right = false;
    up = false;
    down = false;

    if (38 in keysDown && adventurer.y > (50 - 24) ) { 
        adventurer.y -= adventurer.speed * modifier;
        up = true;
    }
    if (40 in keysDown && adventurer.y < canvas.height - (50 + 106)) { 
        adventurer.y += adventurer.speed * modifier;
        down = true;
    }
    if (37 in keysDown && adventurer.x > (50 - 23)) { 
        adventurer.x -= adventurer.speed * modifier;
        left = true;
    }
    if (39 in keysDown && adventurer.x < canvas.width - (50 + 58)) { 
        adventurer.x += adventurer.speed * modifier;
        right = true;
    }
    for(let i=0; i<scorpionObjects.length; i++){
        let scorpionChk = scorpionObjects[i];
        if (
            //allowing for overlap, mainly on the scorpion tail and some for hairbow.
            adventurer.x <= (scorpionChk.x + 28) 
            && scorpionChk.x <= (adventurer.x + 52)
            && adventurer.y <= (scorpionChk.y + 30)
            && scorpionChk.y <= (adventurer.y + 96)
        ) {
            gameOver = true;
            run().then(
                ()=>{
                    alert(`GAME OVER! Level Reached: ${level} and Gems Purse: ${gemsCollected}`);
                }
            );
        }
    }
    for(let i=0; i<gemObjects.length; i++){
        let gemChk = gemObjects[i];
        if (
            adventurer.x <= (gemChk.x - 8) 
            && gemChk.x <= (adventurer.x + 58)
            && adventurer.y <= (gemChk.y + 4)
            && gemChk.y <= (adventurer.y + 114)
            && !gemChk.collected
        ) {
            soundEfx.src = soundGemCollected;
            soundEfx.play();
            gemChk.collected = true;
            gemsCollected += gemPoint;

        }
    }
    if(gemsCollected === gemsToNextLevel){
        soundEfx.src = soundNxtLvl;
        soundEfx.play();
        levelUp()
    }
    if(counter === 5){
        curXFrame = ++curXFrame % frameCount; 
        counter = 0;
    } else {
        counter++;
    }
    srcX = curXFrame * adventurerWidth; 
    if (left) {
        srcY = trackLeft * adventurerHeight;
    }
    if (right) {
        srcY = trackRight * adventurerHeight;
    }
    if (up) {
        srcY = trackLeft * adventurerHeight;
    }
    if (down) {
        srcY = trackRight * adventurerHeight;
    }
    if (left == false && right == false && up == false && down == false) {
        srcX = 1 * adventurerWidth;
        srcY = 1 * adventurerHeight;
    }
};
// ************ The main game loop ************************************************************************************ //
const main = function () {
    if(gameOver == false){
        let now = Date.now();
        let delta = now - then;
        update(delta / 1000);
        render();
        then = now;
        requestAnimationFrame(main);
    }
};
const render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    };
    if(tbBorderImage && sBorderImage) {
        ctx.drawImage(tbBorderImage, 0, 0);
        ctx.drawImage(tbBorderImage, 0, (1000-40));
        ctx.drawImage(sBorderImage, 0, 0);
        ctx.drawImage(sBorderImage, (1000-50), 0);
    }
    if (adventurer) {
        console.log(srcX, srcY);
        ctx.drawImage(adventurerImage, srcX, srcY, adventurerWidth, adventurerHeight, 
            adventurer.x, adventurer.y, adventurerWidth, adventurerHeight);
    }
    if (scorpionReady) {
        for(let i=0; i<scorpionObjects.length; i++) {
            let scropObj = scorpionObjects[i];
            ctx.drawImage(scorpionImage, scropObj.x, scropObj.y);
        }
    }
    if (gemReady) {
        for(let i=0; i<gemObjects.length; i++) {
            let gemObj = gemObjects[i];
            if(!gemObj.collected){
                ctx.drawImage(gemImage, gemObj.x, gemObj.y);
            }
        }
    }
    // Scoreboard
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Gem: " + gemsCollected, 50, 52);
    ctx.fillText("Level: " + level, 50, 72);
};
// ************ Reset Game ************************************************************************************ //
const reset = function () {
    if(gameOver == false){
        adventurer.x = (canvas.width / 2) - 49;
        adventurer.y = (canvas.height / 2) - 21.5;
        placeCharacter(adventurer);

        for(let i=0; i<scorpionPositions.length; i++) {
            scorpionPositions[i];
        };
        for(let i=0; i<gemPositions.length; i++) {
            gemPositions[i];
        };
    } 
};
// ************ Play the Game ************************************************************************************ //
    let then = Date.now();
    reset();
    main(); 
