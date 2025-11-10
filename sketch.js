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
let powerList;
let levelCreate;
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
    if (levelNumber > 3) { // Change this number when we implement level 4 and 5
      playInitiated = false;
      titleScrn.visible = true;
      deathScrn.visible = false;
      
      // Reset to level 1 for the next playthrough
      currentLevel = 1;
      
      // Clear all game state
      enemiesArray = [];
      boss = null;
      bossActive = false;
      cameraX = 0;
      
      return;

  }

  currentLevel = levelNumber;
  obstaclesInitialized = false;
  enemiesArray = [];
  powerList = [];
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
      levelCreate = new LevelCreator(0, levelWidth, 10, 10, 10, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList; // Use the powerList from levelCreate
      break;
    case 2:
      levelWidth = 7000; 
      bossSpawnPosition = 6500; 
      currentBackground = new Level2Background(level2BackgroundImg, levelWidth);
      currentLayout = new Level2Layout();
      levelCreate = new LevelCreator(0, levelWidth, 15, 15, 15, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    case 3:
      levelWidth = 7000;
      bossSpawnPosition = 6500;
      currentBackground = new Level3Background(level3BackgroundImg, levelWidth);
      currentLayout = new Level3Layout();
      levelCreate = new LevelCreator(0, levelWidth, 20, 20, 20, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    // Add cases for levels 4 and 5 here
    default:
      // If we run out of levels, go back to title
      playInitiated = false;
      titleScrn.visible = true;
      deathScrn.visible = false;
      currentLevel = 1; // Reset to level 1
      return;
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
  let bossX = levelWidth - 200; // 200px from the end of the level
  let bossY = height - 150; // On the ground
  
  // Create the appropriate boss for the current level
  switch(currentLevel) {
    case 1:
      boss = new OriginalBoss(bossX, bossY);
      break;
    case 2:
      boss = new CookieBoss(bossX, bossY);
      break;
    case 3:
      boss = new NachosBoss(bossX, bossY);
      break;
  }
  
  bossActive = true;
  // Clear out all other enemies when boss spawns
  enemiesArray = []
}

function spawnPowerUps() {
  if (!powerList || powerList.length === 0) return;
  
  for (let powerUp of powerList) {
      // Get the actual powerup position from the level layout
      let powerX = powerUp.getPowerX();
      let powerY = currentLayout.getRefHeight ? currentLayout.getRefHeight(powerX, height) : height - 50;
      
      // Update powerup position
      powerUp.changePowerY(powerY);
      
      // Draw the powerup
      levelCreate.drawPowerUp(powerX, powerY, 25, powerUp.getEffect());
  }
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

    spawnPowerUps();

    // Draw all enemies
    for (let enemy of enemiesArray) {
      enemy.draw();
    }

    // Draw the boss if he exists
    if (boss !== null) {
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
    levelCreate.powerUpReached(playerHitbox);

    for (let i = enemiesArray.length - 1; i >= 0; i--) {
      enemiesArray[i].update(playerHitboxX, playerHitboxY);
    }

    if (boss !== null) {
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
      // Reset the game completely before starting
      completeGameReset();
      titleScrn.screenRemove();
      playInitiated = true;
    } else if (deathScrn.visible) {
      restartGame();
    }
  }
  return false; // prevent default browser behavior
}

// Completely reset the game for a fresh start
function completeGameReset() {
  // Reset to level 1
  currentLevel = 1;
  
  // Clear all game objects
  enemiesArray = [];
  boss = null;
  bossActive = false;
  cameraX = 0;
  
  // Reset player
  if (player) {
    player.x = 50;
    player.y = 0;
    player.velocityY = 0;
    player.isTakingDamage = false;
    player.isOnGround = false;
    player.isDucking = false;
  }
  
  // Reset player shoots
  if (playerShoots) {
    playerShoots.bullets = [];
  }
  
  // Reset health
  if (health) {
    health.health = 50;
  }
  
  // Reset screens
  playInitiated = false;
  titleScrn.visible = true;
  deathScrn.visible = false;
  
  // Clear any keys that might be stuck
  for (let key in keys) {
    keys[key] = false;
  }
  
  // Load level 1 to reset obstacles and layout
  loadLevel(1);
}

// Restarts the game
function restartGame() {
  if (health) {
    health.health = 50;
  }
  
  if (player) {
    player.x = 50;
    player.y = 0;
    player.velocityY = 0;
    player.isTakingDamage = false;
    player.isOnGround = false;
    player.isDucking = false;
  }
  
  if (playerShoots) {
    playerShoots.bullets = [];
  }
  
  if (playerHitbox) {
    playerHitbox.update();
  }
  
  // Clear enemies and boss
  enemiesArray = [];
  boss = null;
  bossActive = false;
  cameraX = 0;
  
  if (currentLayout && currentLayout.levelMaker) {
    currentLayout.levelMaker(height, player.currentX(), width);
    obstaclesInitialized = true;
  }

  for (let key in keys) {
    keys[key] = false;
  }

  deathScrn.visible = false;
  playInitiated = true;
}