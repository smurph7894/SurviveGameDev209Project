const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

// ************ Game Images ************************************************************************************ //
// Background image
let bgReady = false;
let bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Scorpion image
let scorpionReady = false;
let scorpionImage = new Image();
scorpionImage.onload = function () {
    scorpionReady = true;
};
scorpionImage.src = "images/monster.png";

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

// ************ Create Game objects ************************************************************************************ //
let scorpionObjects = [];
let scorpionPositions = [];
let gemObjects = [];
let gemPositions = [];

let hero = {
    speed: 256, 
    x: 0, 
    y: 0 
};

const scorpionCounter = () => {
    scorpionObjects = [];
    scorpionPositions = [];
    for(let i=0; i<=level + 1 ; i++){
        let scorpion = {
            speed: 150,
            x: 0,
            y: 0
        };
        scorpionObjects.push(scorpion);

        scorpion.x = 50 + (Math.random() * (canvas.width - 154));
        scorpion.y = 50 + (Math.random() * (canvas.height - 158));
        let scorpionPosition = [scorpion.x, scorpion.y];
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

        gem.x = 50 + (Math.random() * (canvas.width - 112));
        gem.y = 50 + (Math.random() * (canvas.height - 118));     
        let gemPosition = [gem.x, gem.y];
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
    if (38 in keysDown && hero.y > (50 + 1) ) { // holding up key
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown && hero.y < canvas.height - (50 + 101)) { // holding down key
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown && hero.x > (50 + 1)) { // holding left key
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown && hero.x < canvas.width - (50 + 40)) { // holding right key
        hero.x += hero.speed * modifier;
    }
    for(let i=0; i<scorpionObjects.length; i++){
        let scorpionChk = scorpionObjects[i];
        if (
            hero.x <= (scorpionChk.x + 42) 
            && scorpionChk.x <= (hero.x + 33)
            && hero.y <= (scorpionChk.y + 54)
            && scorpionChk.y <= (hero.y + 94)
        ) {
            gameOver = true;
            alert(`GAME OVER! Level Reached: ${level} and Gems Purse: ${gemsCollected}`);
        }
    }
    for(let i=0; i<gemObjects.length; i++){
        let gemChk = gemObjects[i];
        if (
            hero.x <= (gemChk.x + 42) 
            && gemChk.x <= (hero.x + 33)
            && hero.y <= (gemChk.y + 54)
            && gemChk.y <= (hero.y + 94)
            && !gemChk.collected
        ) {
            gemChk.collected = true;
            gemsCollected += gemPoint;
        }
    }
    if(gemsCollected === gemsToNextLevel){
        levelUp();
    }
    if(level === 10){
        gameOver = true;
        alert(`YOU WON!!! Gems Purse: ${gemsCollected}`);
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
        ctx.drawImage(tbBorderImage, 0, (1000-50));
        ctx.drawImage(sBorderImage, 0, 0);
        ctx.drawImage(sBorderImage, (1000-50), 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
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
        hero.x = (canvas.width / 2) - 49;
        hero.y = (canvas.height / 2) - 21.5;

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

