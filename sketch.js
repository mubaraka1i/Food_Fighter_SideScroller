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
let cupcakeBoss = {};
let cookieBoss = {};
let nachoBoss = {};
let sodaBoss = {};
let cakeBoss = {};
let cupcakeCandleSprites = {};
let cookieCrumbSprites = {};
let nachoCrumbSprites = {};
let sodaBubbleSprites = {};
let cakeCrumbSprites = {};
let chefSprites = {};
let obstaclesInitialized = false;
let powerList;
let levelCreate;
const keys = {};
let showControls = false; // true = tutorial page visible

let boss;
let bossActive = false;

// Enemy spawn variables
let enemySpawnRate; // Frames between enemy spawns
let enemySpawnTimer = 0;

let currentLevel = 1;
let levelWidth;
let bossSpawnPosition;
let currentBackground;
let currentLayout;

let speedBoost, healthBoost, shieldBoost, damageBoost, shieldDome;
let level1BackgroundImg, level2BackgroundImg, level3BackgroundImg, level4BackgroundImg, level5BackgroundImg;
let chefHat;
let title, death, tutorial;

function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');
  tutorial = loadImage('Assets/tutorialscreen.png');
  chefHat = loadImage('Assets/chef_health.png');

  // Load background images
  level1BackgroundImg = loadImage('Assets/Kitchen1.png');
  level2BackgroundImg = loadImage('Assets/Kitchen2.png');
  level3BackgroundImg = loadImage('Assets/Kitchen3.png');
  level4BackgroundImg = loadImage('Assets/Kitchen4.png');
  level5BackgroundImg = loadImage('Assets/Kitchen5.png');

  // Load Chef sprites
  chefSprites = {
    stand: loadImage('Assets/chef_walk2.png'),
    walk: [
      loadImage('Assets/chef_walk1.png'),
      loadImage('Assets/chef_walk2.png'),
      loadImage('Assets/chef_walk3.png')
    ],
    duck: loadImage('Assets/chef_duck.png'),
    jump: loadImage('Assets/chef_jump.png'),
    fall: loadImage('Assets/chef_fall.png'),
    shoot: [
      loadImage('Assets/chef_shoot_walk1.png'),
      loadImage('Assets/chef_shoot_stand.png'),
      loadImage('Assets/chef_shoot_walk2.png')
    ]
  };
  
  // Load Boss sprites
  cupcakeBoss = { // Level 1 Boss
    idle: [
      loadImage('Assets/cupcake_boss1.png'),
      loadImage('Assets/cupcake_boss2.png'),
      loadImage('Assets/cupcake_boss3.png')
    ]
  };
  cookieBoss = { // Level 2 Boss
    idle: [
      loadImage('Assets/cookie_boss1.png'),
      loadImage('Assets/cookie_boss2.png'),
      loadImage('Assets/cookie_boss3.png')
    ]
  };
  nachoBoss = { // Level 3 Boss
    idle: [
      loadImage('Assets/nacho_boss1.png'),
      loadImage('Assets/nacho_boss2.png'),
      loadImage('Assets/nacho_boss3.png')
    ]
  };
  sodaBoss = { // Level 4 Boss
    idle: [
      loadImage('Assets/soda_boss1.png'),
      loadImage('Assets/soda_boss2.png'),
      loadImage('Assets/soda_boss3.png')
    ]
  };
  cakeBoss = { // Level 5 Boss
    idle: [
      loadImage('Assets/cake_boss1.png'),
      loadImage('Assets/cake_boss2.png'),
      loadImage('Assets/cake_boss3.png')
    ]
  };
  
  // Load Level Minions
  
  cupcakeCandleSprites = [ // Level 1 Minions
    loadImage('Assets/cupcake_minion1.png'),
    loadImage('Assets/cupcake_minion2.png'),
    loadImage('Assets/cupcake_minion3.png')
  ];
  
  cookieCrumbSprites = [ // Level 2 Minions
    loadImage('Assets/cookie_minion1.png'),
    loadImage('Assets/cookie_minion2.png'),
    loadImage('Assets/cookie_minion3.png'),
    loadImage('Assets/cookie_minion4.png')
  ];
  
  nachoCrumbSprites = [ // Level 3 Minions
    loadImage('Assets/nacho_minion1.png'),
    loadImage('Assets/nacho_minion2.png'),
    loadImage('Assets/nacho_minion3.png')
  ];
  
  sodaBubbleSprites = [ // Level 4 Minions
    loadImage('Assets/soda_minion1.png'),
    loadImage('Assets/soda_minion2.png'),
    loadImage('Assets/soda_minion3.png'),
    loadImage('Assets/soda_minion4.png')
  ];
  
  cakeCrumbSprites = [ // Level 5 Minions
    loadImage('Assets/cake_minion1.png'),
    loadImage('Assets/cake_minion2.png'),
    loadImage('Assets/cake_minion3.png'),
    loadImage('Assets/cake_minion4.png')
  ];

  // Load Power-Up Icons
  speedBoost = loadImage('Assets/power_speed.png');
  healthBoost = loadImage('Assets/power_health.png');
  shieldBoost = loadImage('Assets/power_shield.png');
  damageBoost = loadImage('Assets/power_damage.png');
  shieldDome = loadImage('Assets/shield_dome.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = new Chef(50, 0, chefSprites);
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50, chefHat);
  playerHitbox = new ChefHitbox(player, showHitboxes);
  titleScrn = new TitleScreen(0);
  deathScrn = new TitleScreen(1);
  tutorialScrn = new TitleScreen(2);
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
    if (levelNumber > 5) { // Change this number when we implement level 4 and 5
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
  enemySpawnTimer = 0;

  switch(levelNumber) {
    case 1:
      levelWidth = 3000;
      bossSpawnPosition = 2500;
      enemySpawnRate = 120; // 2 seconds at 60fps
      currentBackground = new Level1Background(level1BackgroundImg, levelWidth);
      currentLayout = new Level1Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 10, 10, 10, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList; // Use the powerList from levelCreate
      break;
    case 2:
      levelWidth = 7000; 
      bossSpawnPosition = 6500;
      enemySpawnRate = 90; // 1.5 seconds at 60fps
      currentBackground = new Level2Background(level2BackgroundImg, levelWidth);
      currentLayout = new Level2Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 15, 15, 15, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    case 3:
      levelWidth = 7000;
      bossSpawnPosition = 6500;
      enemySpawnRate = 60; // 1 seconds at 60fps
      currentBackground = new Level3Background(level3BackgroundImg, levelWidth);
      currentLayout = new Level3Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 20, 20, 20, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    case 4:
      levelWidth = 8000; // Soda level
      bossSpawnPosition = 7500;
      enemySpawnRate = 45; // 0.75 seconds at 60fps
      currentBackground = new Level4Background(level4BackgroundImg, levelWidth);
      currentLayout = new Level4Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 25, 25, 25, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    // --- NEW: Case 5 ---
    case 5:
      levelWidth = 8000; // Cake level
      bossSpawnPosition = 7500;
      enemySpawnRate = 30; // 0.5 seconds at 60fps
      currentBackground = new Level5Background(level5BackgroundImg, levelWidth);
      currentLayout = new Level5Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 30, 30, 30, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    default:
      // If we run out of levels, go back to title
      playInitiated = false;
      titleScrn.visible = true;
      deathScrn.visible = false;
      currentLevel = 1; // Reset to level 1
      return;
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
    case 4:
      boss = new SodaBoss(bossX, bossY);
      break;
    case 5:
      boss = new CakeBoss(bossX, bossY);
      break;
  }
  
  bossActive = true;
  // Clear out all other enemies when boss spawns
  enemiesArray = []
}

function spawnPowerUps() {
  if (!levelCreate || !levelCreate.powerList || levelCreate.powerList.length === 0) return;
  
  // Use the new drawAllPowerUps method instead of manually drawing
  levelCreate.drawAllPowerUps();
}

// ENEMY SPAWNING FUNCTION
function spawnEnemies() {
  if (!bossActive) {
    enemySpawnTimer++;
    
    if (enemySpawnTimer >= enemySpawnRate) {
      let spawnX = cameraX + width + 50;
      
      if (random() < 0.5) {
        // Ground enemy (minion) for current level
        let spritesArray;
        switch (currentLevel) {
          case 1: spritesArray = cupcakeCandleSprites; break;
          case 2: spritesArray = cookieCrumbSprites; break;
          case 3: spritesArray = nachoCrumbSprites; break;
          case 4: spritesArray = sodaBubbleSprites; break;
          case 5: spritesArray = cakeCrumbSprites; break;
        }
        enemiesArray.push(new GroundEnemies(spawnX, spawnY=height-90, spritesArray));
      } else {
        // Flying enemy remains unchanged
        let flySpritesArray; // optional: could add flying sprites later
        enemiesArray.push(new FlyingEnemies(spawnX, random(100, height / 2)));
      }
      
      enemySpawnTimer = 0;
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
  
    if (player.shieldActive) {
      // Draw shield glow/image centered over chef
      imageMode(CENTER);
      image(shieldDome, player.x + player.width / 2, player.y + player.height / 2, player.width, player.height);
    }

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
  }else if (showControls) {
    tutorialScrn.screenDraw(tutorial);
  } else {
    titleScrn.screenDraw(title);
  }
}

function keyPressed() {
  // Toggle tutorial on title screen
  if (key === '1') {
    if (titleScrn.visible) {
      showControls = !showControls; // toggle tutorial visibility
    }
  }
  // Single-trigger keys
  if (key === 'Enter') {
    if (titleScrn.visible && !showControls) { // Only start game if tutorial is not visible
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

  // Reset collected power-ups
  if (levelCreate) {
    levelCreate.resetCollectedPowerUps();
  }
  
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