const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

/*Game Premise: Try to survive as long as possible collecting as many gems and gaining levels as possible 
(no mention in requirements that a level must be achieved or a specific objective reached to win).
- Gameover if a scorpion catches you.
- 
*/

// ************ Game Images ************************************************************************************ //
// Background image
let bgReady = false;
let bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Adventurer image
let adventurerReady = false;
let adventurerImage = new Image();
adventurerImage.onload = function () {
    adventurerReady = true;
};
adventurerImage.src = "images/adventurer.png";

// Scorpion image
let scorpionReady = false;
let scorpionImage = new Image();
scorpionImage.onload = function () {
    scorpionReady = true;
};
scorpionImage.src = "images/scorpion.png";

// Gem image
let gemReady = false;
let gemImage = new Image();
gemImage.onload = function () {
    gemReady = true;
};
gemImage.src = "images/gem.png";

// Border images
let tbBorder = false;
let tbBorderImage = new Image();
tbBorderImage.onload = function () {
    tbBorderReady = true
}
tbBorderImage.src = "images/tbborder.png";
let sBorder = false;
let sBorderImage = new Image();
sBorderImage.onload = function () {
    sBorderReady = true;
};
sBorderImage.src = "images/sborder.png";

// ************ Play the Game ************************************************************************************ //
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

const placeCharcter = (character) => {
    let X=0;
    let Y=0;
    let success = false;

    while(!success) {
        X = Math.floor(Math.random() * 9);
        Y = Math.floor(Math.random() * 9);

        if(gameBoard[X][Y] ==='x'){
            success = true;
        }
    }
    gameBoard[X][Y] = 'o';
    character.x = (X*100) + 52;
    character.y = (Y*100) + 52;
    return (X, Y);
}

// ************ Create Game objects ************************************************************************************ //
let scorpionObjects = [];
let scorpionPositions = [];
let gemObjects = [];
let gemPositions = [];

let adventurer = {
    speed: 256, 
    x: 0, 
    y: 0 
};

const scorpionCounter = () => {
    scorpionObjects = [];
    scorpionPositions = [];
    for(let i=0; i<=level + 1 ; i++){
        let scorpion = {
            speed: 100,
            x: 0,
            y: 0
        };
        scorpionObjects.push(scorpion);

        let scorpPo = placeCharcter(scorpion);
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

        let gemPo = placeCharcter(gem);  
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
        firstTime = false;
        scorpionCounter();
        gemCounter(gemsPerLevel);
        gemsToNextLevel = gemsToNextLevel + 4;   
    } else if(!firstTime) {
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
var update = function (modifier) {
    if (38 in keysDown && adventurer.y > (50 + 1) ) { // holding up key
        adventurer.y -= adventurer.speed * modifier;
    }
    if (40 in keysDown && adventurer.y < canvas.height - (50 + 101)) { // holding down key
        adventurer.y += adventurer.speed * modifier;
    }
    if (37 in keysDown && adventurer.x > (50 + 1)) { // holding left key
        adventurer.x -= adventurer.speed * modifier;
    }
    if (39 in keysDown && adventurer.x < canvas.width - (50 + 40)) { // holding right key
        adventurer.x += adventurer.speed * modifier;
    }
    for(let i=0; i<scorpionObjects.length; i++){
        let scorpionChk = scorpionObjects[i];
        if (
            //allowing for overlap, mainly on the scorpion tail
            adventurer.x <= (scorpionChk.x + 42) 
            && scorpionChk.x <= (adventurer.x + 30)
            && adventurer.y <= (scorpionChk.y + 49)
            && scorpionChk.y <= (adventurer.y + 72)
        ) {
            //sound effect for death
            //soundEfx.play();
            gameOver = true;
            alert(`GAME OVER! Level Reached: ${level} and Gems Purse: ${gemsCollected}`);
        }
    }
    for(let i=0; i<gemObjects.length; i++){
        let gemChk = gemObjects[i];
        if (
            //allowing for some overlap for hairbow, lower foot, and hand. 
            //Player's position at 256 ends up over gem as they collect.
            adventurer.x <= (gemChk.x + 15) 
            && gemChk.x <= (adventurer.x + 33)
            && adventurer.y <= (gemChk.y + 28)
            && gemChk.y <= (adventurer.y + 88)
            && !gemChk.collected
        ) {
            gemChk.collected = true;
            gemsCollected += gemPoint;
        }
    }
    if(gemsCollected === gemsToNextLevel){
        levelUp();
    }
    // if(level === 10){
    //     gameOver = true;
    //     alert(`YOU WON!!! Gems Purse: ${gemsCollected}`);
    // }
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
        ctx.drawImage(tbBorderImage, 0, (1000-50));
        ctx.drawImage(sBorderImage, 0, 0);
        ctx.drawImage(sBorderImage, (1000-50), 0);
    }
    if (adventurer) {
        ctx.drawImage(adventurerImage, adventurer.x, adventurer.y);
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
        placeCharcter(adventurer);

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
