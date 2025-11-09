let player;
let playerShoots;
let health;
let showHitboxes = true;
let playerHitbox;
let enemiesArray = [];
let playInitiated = false;
let gameScale;
let background1;
let cameraX = 0;
let chefSprites = {};
let obstaclesInitialized = false;
const keys = {}

let boss;
let bossActive = false;

let currentLevel = 1;
let levelWidth;
let bossSpawnPosition;
let currentBackground;
let currentLayout;

let level1BackgroundImg, level2BackgroundImg, level3BackgroundImg;
let chefHat;
let title, death;

function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');
  chefHat = loadImage('Assets/chef_health.png');

  // Load background images
  level1BackgroundImg = loadImage('Assets/Kitchen1.png');
  level2BackgroundImg = loadImage('Assets/Kitchen2.png');
  level3BackgroundImg = loadImage('Assets/Kitchen3.png');

  // Load Chef sprites
  chefSprites = {
    stand: loadImage('Assets/chef_stand.png'),
    walk: [
      loadImage('Assets/chef_walk1.png'),
      loadImage('Assets/chef_walk2.png'),
      loadImage('Assets/chef_walk3.png')
    ],
    duck: loadImage('Assets/chef_duck.png'),
    jump: loadImage('Assets/chef_jump.png'),
    fall: loadImage('Assets/chef_fall.png')
  };

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = new Chef(50, 0, chefSprites);
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50, chefHat);
  playerHitbox = new ChefHitbox(player, showHitboxes);
  titleScrn = new TitleScreen(0);
  deathScrn = new TitleScreen(1);
  boss = null;

  loadLevel(1);

  document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}

//LEVEL MANAGER FUNCTION
function loadLevel(levelNumber) {
  currentLevel = levelNumber;
  obstaclesInitialized = false;
  enemiesArray = [];
  boss = null;
  bossActive = false;
  cameraX = 0;
  player.x = 50;
  player.y = 0;
  player.velocityY = 0;

  switch(levelNumber) {
    case 1:
      levelWidth = 3000;
      bossSpawnPosition = 2500;
      currentBackground = new Level1Background(level1BackgroundImg, levelWidth);
      currentLayout = new Level1Layout();
      break;
    case 2:
      levelWidth = 7000; // From your Level2Background file
      bossSpawnPosition = 6500; // Example spawn position for level 2
      currentBackground = new Level2Background(level2BackgroundImg, levelWidth);
      currentLayout = new Level2Layout(); // We will create this file
      break;
    case 3:
      // Placeholder for when you implement Level 3
      levelWidth = 7000;
      bossSpawnPosition = 6500;
      currentBackground = new Level3Background(level3BackgroundImg, levelWidth);
      currentLayout = new Level3Layout();
      // currentBackground = new Level3Background(level3BackgroundImg, levelWidth);
      // currentLayout = new Level3Layout();
      // For now, just restart level 1. Bebo you can delete loadlevel and implement like mine
      break;
    // Add cases for levels 4 and 5 here
    default:
      // If we run out of levels, go back to title
      playInitiated = false;
      titleScrn.visible = true;
      deathScrn.visible = false;
      break;
  }

  // Spawn the obstacles for the newly loaded level
  if (currentLayout && currentLayout.levelMaker) {
    currentLayout.levelMaker(height, player.currentX(), width);
    obstaclesInitialized = true;
  }
}

// Function to be called from collisions to know what level its on
function goToNextLevel() {
  loadLevel(currentLevel + 1);
}

// BOSS SPAWNING FUNCTION
function spawnBoss() {
  // Spawn boss at fixed position in WORLD coordinates
  let bossX = levelWidth - 200; // 200px from the end of the level
  let bossY = height - 150; // On the ground
  boss = new Boss(bossX, bossY);
  bossActive = true;

  // Clear out all other enemies when boss spawns
  enemiesArray = [];
}

// ENEMY SPAWNING FUNCTION
function spawnEnemies() {
  if (frameCount % 120 === 0 && !bossActive) {
    // Spawn enemies in world space
    let spawnX = cameraX + width + 50;

    if (random() < 0.5) {
      enemiesArray.push(new GroundEnemies(spawnX));
    } else {
      enemiesArray.push(new FlyingEnemies(spawnX, random(100, height / 2)));
    }
  }
}

// Handle shooting and menu controls
function handleControls() {
  // Shooting
  if (keys[' ']) {
    playerShoots.shoot(player);
    keys[' '] = false; // Prevent continuous shooting
  }
}

function draw() {
  if (playInitiated) {
    cameraX = player.currentX() - width / 2;
    cameraX = constrain(cameraX, 0, levelWidth - width);

    background(240, 248, 255);

    // Draw current level background
    push();
    translate(-cameraX, 0);
    if(currentBackground) currentBackground.draw(cameraX);

    player.updateInput(); // constantly update simultaneous input

    // prevents constant redraw that causes lag
    if (obstaclesInitialized) {
      currentLayout.drawObstacles(player.currentX(), width);
    }

    // Draw all game objects in world coordinates
    player.draw();
    playerShoots.draw();
    playerHitbox.drawPlayerHitbox();

   

    // Draw all enemies
    for (let enemy of enemiesArray) {
      enemy.draw();
    }

    // Draw the boss if he exists
    if (bossActive && boss !== null) {
      boss.draw();
    }
    pop();

    health.healthDraw(); // outside of push-pop so health is fixed to screen

    let playerHitboxX = playerHitbox.getCenterX();
    let playerHitboxY = playerHitbox.getCenterY();

    if (health.getHealth() <= 0) {
      playInitiated = false;
      deathScrn.visible = true;
      return;
    }

    if (!bossActive && player.currentX() >= bossSpawnPosition) {
      spawnBoss();
    }

    // Only spawn enemies if no boss is active
    if (!bossActive) {
      spawnEnemies();
    }

    handleControls();

    player.update(currentLayout);
    playerHitbox.update();
    playerShoots.update();

    for (let i = enemiesArray.length - 1; i >= 0; i--) {
      enemiesArray[i].update(playerHitboxX, playerHitboxY);
    }

    if (bossActive && boss !== null) {
      boss.update(playerHitboxX, playerHitboxY);
    }

    checkCollisions();

  } else if (deathScrn.visible) {
    deathScrn.screenDraw(death);
  } else {
    titleScrn.screenDraw(title);
  }
}

function keyPressed() {
  // Single-trigger keys
  if (key === 'Enter') {
    if (titleScrn.visible) {
      titleScrn.screenRemove();
      playInitiated = true;
    } else if (deathScrn.visible) {
      restartGame();
    }
  }
  return false; // prevent default browser behavior
}

// Restarts the game
function restartGame() {
  health = new ChefHealth(50, chefHat);
  player = new Chef(50, 0, chefSprites);
  playerHitbox = new ChefHitbox(player, showHitboxes);
  playerShoots = new PlayerShoots(); 

  // Right now i have it going back to level one but we can discuss if
  // We want that or continue on the same level
  loadLevel(currentLevel);

  for (let key in keys) {
    keys[key] = false;
  }

  deathScrn.visible = false;
  titleScrn.visible = true;
  playInitiated = false;
}