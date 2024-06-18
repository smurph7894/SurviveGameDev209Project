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
let gem1Ready = false;
let gem1Image = new Image();
gem1Image.onload = function () {
    gem1Ready = true;
};
gem1Image.src = "images/gem1.png";

// let gem2Ready = false;
// let gem2Image = new Image();
// gem2Image.onload = function () {
//     gem1nReady = true;
// };
// gem2Image.src = "images/gem2.png";

// let gem3Ready = false;
// let gem3Image = new Image();
// gem3Image.onload = function () {
//     gem3nReady = true;
// };
// gem3Image.src = "images/gem3.png";

// let gem4Ready = false;
// let gem4Image = new Image();
// gem4Image.onload = function () {
//     gem4Ready = true;
// };
// gem4Image.src = "images/gem4.png";
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
let hero = {
    speed: 100, //256 movement in pixels per second
    x: 0, // where on the canvas are they?
    y: 0 // where on the canvas are they?
    };
    
let scorpion1 = {
    // for this version, the monster does not move, so just and x and y
    speed: 150,
    x: 0,
    y: 0
};
let scorpion2 = {
    // for this version, the monster does not move, so just and x and y
    speed: 150,
    x: 0,
    y: 0
};
let scorpion3 = {
    speed: 150,
    x: 0,
    y: 0
};
let gem1 = {
    collected: false,
    x: 0,
    y: 0
};
// let gem2 = {
//     x: 0,
//     y: 0
// };
// let gem3 = {
//     x: 0,
//     y: 0
// };
// let gem4 = {
//     x: 0,
//     y: 0
// };

// ************ Random Variables ************************************************************************************ //
let gemsCollected = 0;
let level = 0;
let gameOver = false;
const gem1point = 1;
const gem2point = 2;
const gem3point = 3;
const gem4point = 5;
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
    // Are they touching? 
    //** slow down the speed to see if the detection point makes sense (no overlap) and then change the +32
    if (
        hero.x <= (scorpion1.x + 42) 
        && scorpion1.x <= (hero.x + 33)
        && hero.y <= (scorpion1.y + 54)
        && scorpion1.y <= (hero.y + 94)
    ) {
        gameOver = true;
        alert(`GAME OVER! Level Reached: ${level} and Gems Purse: ${gemsCollected}`);
    //TODO determine what resets game with more gems and monsters 
        // reset(); // start a new cycle
    }

    if (
        hero.x <= (gem1.x + 42) 
        && gem1.x <= (hero.x + 33)
        && hero.y <= (gem1.y + 54)
        && gem1.y <= (hero.y + 94) 
        && !gem1.collected
    ) {
        gem1.collected = true;
        gemsCollected += gem1point;
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

// Draw everything in the main render function
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
    //maybe for loop to level plus one enemy?
    if (scorpionReady) {
        ctx.drawImage(scorpionImage, scorpion1.x, scorpion1.y);
    }
    // if (scorpionReady) {
    //     ctx.drawImage(scorpionImage, scorpion2.x, scorpion2.y);
    // }
    if (gem1Ready && !gem1.collected) {
        ctx.drawImage(gem1Image, gem1.x, gem1.y);
    }
    // Score
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Gem: " + gemsCollected, 50, 52);
    ctx.fillText("Level: " + level, 50, 72);
};

// ************ Reset Game ************************************************************************************ //
// Reset the game when the player catches a monster
const reset = function () {
    if(gameOver == false){
        //**  hero.x = canvas.width / 2; 
        //** hero.y = canvas.height / 2;
        hero.x = (canvas.width / 2) - 49; //shifting by 1/2 hero's height 32px
        hero.y = (canvas.height / 2) - 21.5;
        //Place the monster somewhere on the screen randomly
        // but not in the hedges, Article in wrong, the 64 needs to be
        // hedge 32 + hedge 32 + char 32 = 96

        // ** by starting at 32px he'll never end up in the left bushes, to avoid right you subtract bush px from both sides plus char px
        scorpion1.x = 50 + (Math.random() * (canvas.width - 154)); 
        scorpion1.y = 50 + (Math.random() * (canvas.height - 158));
        // scorpion2.x = 50 + (Math.random() * (canvas.width - 154)); 
        // scorpion2.y = 50 + (Math.random() * (canvas.height - 158));

        gem1.x = 50 + (Math.random() * (canvas.width - 112)); 
        gem1.y = 50 + (Math.random() * (canvas.height - 118));
    } 
};

// Let's play this game!
let then = Date.now();
reset();
main(); // call the main game loop.

