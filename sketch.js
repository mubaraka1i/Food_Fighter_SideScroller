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
let canShoot = true;
let ammo = 0; // Will be set properly in loadLevel()
let reloadingTime = 2000;
let reloadStartTime = null;
let isReloading = false;

let boss;
let bossActive = false;

let debugMode;

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
let title, death, tutorial, stats, statInfo;
let hp, hpDec, hpInc, num_G, num_R, numY;

let gamePaused = false;
let pauseMenu = null;

// For tracking stats
let gameStats = {
    shotsFired: 0,
    shotsMissed: 0,
    shotsHit: 0,
    enemiesKilled: 0,
    powerUpsUsed: 0,
    damageDone: 0,
    damageTaken: 0,
    healthHealed: 0,
    levelReached: 0
};

/**
 * Preloads all images that are used.
 */
function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');
  tutorial = loadImage('Assets/tutorialscreen.png');
  chefHat = loadImage('Assets/chef_health.png');
  stats = loadImage('Assets/statScreen.png');

  // Load HP:, hpInc, hpDec, and letters
  hp = loadImage('Assets/hp_G.png'); // "HP:"
  hpDec = loadImage('Assets/hpDecNoti.png'); // plus sign
  hpInc = loadImage('Assets/hpIncNoti.png'); // minus sign
  num_G = loadImage('Assets/num_G.png'); // green numbers
  num_R = loadImage('Assets/num_R.png'); // red numbers
  numY = loadImage('Assets/num_Y.png'); // yellow numbers

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

  // Load PowerUP status symbols
  speedStatus = loadImage('Assets/status_speed.png');
  shieldStatus = loadImage('Assets/status_shield.png');
  damageStatus = loadImage('Assets/status_damage.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = new Chef(50, 0, chefSprites);
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50, chefHat, hpDec, hpInc, hp, num_G, num_R);
  health.setPlayer(player);
  playerHitbox = new ChefHitbox(player, showHitboxes);
  titleScrn = new TitleScreen(0);
  deathScrn = new TitleScreen(1);
  tutorialScrn = new TitleScreen(2);
  statScrn = new TitleScreen(3);
  pauseMenu = new PauseMenu(); // Add this line
  boss = null;
  canShoot = true;

  debugMode = new DebugMode();

  loadLevel(1);

  document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });
}

/**
 * Loads a given level by setting level-specific variables to zero and setting variables for next level.
 * 
 * @param {number} levelNumber level to load (1-5)
 * @returns {undefined} exit if run out of levels
 */
function loadLevel(levelNumber) {
    if (levelNumber > 5) { // Change this number when we implement level 4 and 5
      playInitiated = false;
      statScrn.visible = true;
      titleScrn.visible = false;
      deathScrn.visible = false;
      
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
  gameStats.levelReached = 0;
  boss = null;
  bossActive = false;
  cameraX = 0;
  player.x = 50;
  player.y = 0;
  player.velocityY = 0;
  enemySpawnTimer = 0;
  health.setPlayer(player);

  // Initialize ammo (calculate based on level number)
  ammo = Math.round(12 - levelNumber);
  canShoot = true;
  isReloading = false;
  reloadStartTime = null;

  // CLEAR ALL BULLETS WHEN STARTING NEW LEVEL
  if (playerShoots) {
    playerShoots.bullets = [];
  }

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

/**
 * Function to be called from collisions to know what level its on.
 */
function goToNextLevel() {
  loadLevel(currentLevel + 1);
}

/**
 * Spawns the boss when called using the currentLevel number.
 */
function spawnBoss() {
  // Check debug mode
  if (debugMode.active && !debugMode.canSpawnBoss) {
    return; // Don't spawn boss if disabled in debug mode
  }
  
  let bossX = levelWidth - 200; // 200px from the end of the level
  let bossY = height - 175; // On the ground
  
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

/**
 * Spawns any power ups if levelCreate and powerList exist and powerlist length is not 0.
 * 
 * @returns {undefined} exit early if qualifications are not met
 */
function spawnPowerUps() {
  if (!levelCreate || !levelCreate.powerList || levelCreate.powerList.length === 0) return;
  
  // Use the new drawAllPowerUps method instead of manually drawing
  levelCreate.drawAllPowerUps();
}

/**
 * Adds an enemy to the enemies array depending on the currentLevel number if enemySpawnTimer is at least enemySpawnRate.
 */
function spawnEnemies() {
  // Check debug mode
  if (debugMode.active && !debugMode.canSpawnFlying && !debugMode.canSpawnGround) {
    return; // Don't spawn any enemies if both are disabled in debug mode
  }
  
  if (!bossActive) {
    enemySpawnTimer++;
    
    if (enemySpawnTimer >= enemySpawnRate) {
      let spawnX = cameraX + width + 50;
      
      if (random() < 0.5) {
        // Ground enemy (minion) for current level
        if (debugMode.active && !debugMode.canSpawnGround) {
          // Skip ground enemies if disabled in debug mode
          enemySpawnTimer = 0;
          return;
        }
        
        let spritesArray;
        switch (currentLevel) {
          case 1: spritesArray = cupcakeCandleSprites; break;
          case 2: spritesArray = cookieCrumbSprites; break;
          case 3: spritesArray = nachoCrumbSprites; break;
          case 4: spritesArray = sodaBubbleSprites; break;
          case 5: spritesArray = cakeCrumbSprites; break;
        }
        enemiesArray.push(new GroundEnemies(spawnX, height-90, spritesArray));
      } else {
        // Flying enemy remains unchanged
        if (debugMode.active && !debugMode.canSpawnFlying) {
          // Skip flying enemies if disabled in debug mode
          enemySpawnTimer = 0;
          return;
        }
        
        enemiesArray.push(new FlyingEnemies(spawnX, random(100, height / 2)));
      }
      
      enemySpawnTimer = 0;
    }
  }
}

/**
 * Handles shooting controls to prevent continuous shooting.
 */
function handleControls() {
  if (keys[' '] && canShoot && ammo > 0 && !isReloading) {
    playerShoots.shoot(player, ammo);
    ammo--;
    gameStats.shotsFired++;
    keys[' '] = false;
    
    // Start reload timer when ammo hits 0
    if (ammo <= 0) {
      startReloading();
    }
  }
}

/**
 * Starts the reloading process
 */
function startReloading() {
  if (!isReloading) {
    isReloading = true;
    canShoot = false;
    reloadStartTime = millis();
  }
}

/**
 * Completes the reloading process
 */
function completeReloading() {
  isReloading = false;
  canShoot = true;
  reloadStartTime = null;
  // Set ammo to the max for current level
  ammo = Math.round(12 - currentLevel);
}

function ammoReload() {
  // Only handle reloading if we're currently reloading
  if (isReloading && reloadStartTime) {
    let timeSinceReload = millis() - reloadStartTime;
    
    // Check if reload time has passed
    if (timeSinceReload >= reloadingTime) {
      completeReloading();
    }
  }
}

/**
 * Draws the player stats on the screen.
 * 
 * @param {Set} statsObj a set of player stats
 */
function drawStats(statsObj) {
    let startX = 300;
    let startY = 275;
    let lineHeight = 60;
    let digitWidth = 30;
    let i = 0;

    for (let key in statsObj) {
        let label = statScrn.formatLabel(key);
        fill(255);
        textSize(32);
        text(label, startX, startY + i * lineHeight);

        // draw numbers
        statScrn.drawMultiDigit(numY, statsObj[key], startX + 400, startY + i * lineHeight - 20, digitWidth);

        i++;
    }
}

/**
 * Constantly called to update drawings, positions, status of objects, and collisions.
 * @returns {undefined} exit if health is 0
 */
function draw() {
  if (playInitiated) {
    if (!gamePaused) {
      // --- NORMAL GAME LOGIC (when not paused) ---
      if (player.currentX() > gameStats.levelReached) {
        gameStats.levelReached = player.currentX();
      }

      cameraX = player.currentX() - width / 2;
      cameraX = constrain(cameraX, 0, levelWidth - width);

      background(240, 248, 255);

      // Draw current level background
      push();
      translate(-cameraX, 0);
      if(currentBackground) currentBackground.draw(cameraX);

      // Handle shooting controls
      if (ammo > 0 && canShoot && !isReloading) {
        handleControls();
      } else {
        ammoReload();
      }

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

      // Draw ammo display with proper text settings
      push(); // Save current drawing state
      textSize(16); // Set consistent text size
      textAlign(LEFT, CENTER);
      
      if (!isReloading && ammo > 0) {
        text("Ammo: " + ammo, 50, height - 45);
      } else if (isReloading) {
        // Show reload progress
        let progress = (millis() - reloadStartTime) / reloadingTime;
        let progressBarWidth = 100;
        let progressX = 50;
        let progressY = height - 35;
        
        // Draw reload progress bar
        fill(100);
        rect(progressX, progressY, progressBarWidth, 10);
        fill(0, 255, 0);
        rect(progressX, progressY, progressBarWidth * progress, 10);
        
        text("Reloading...", 50, height - 55);
      } else {
        text("Ammo: " + ammo, 50, height - 45);
      }
      
      // Draw pause hint
      fill(0);
      textSize(16);
      text("Press ESC to pause", width - 200, 60);
      pop(); // Restore drawing state

      // Draw level progress
      push();
      textSize(16);
      textAlign(RIGHT, TOP);
      let percentage = floor(gameStats.levelReached / bossSpawnPosition * 100);
      if (percentage > 100) {
        percentage = 100;
      }
      text("Level Reached: " + percentage + "%", width - 50, 25);
      pop();

      debugMode.draw();

      // draw powerUp statuses
      levelCreate.drawActiveStatus();

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

      playerShoots.update();
      player.update(currentLayout);
      playerHitbox.update();
      levelCreate.powerUpReached(playerHitbox);

      for (let i = enemiesArray.length - 1; i >= 0; i--) {
        enemiesArray[i].update(playerHitboxX, playerHitboxY);
      }

      if (boss !== null) {
        boss.update(playerHitboxX, playerHitboxY);
      }

      checkCollisions();
      // --- END NORMAL GAME LOGIC ---
    } else {
      // --- GAME IS PAUSED ---
      // Draw the game in its current state (frozen)
      cameraX = player.currentX() - width / 2;
      cameraX = constrain(cameraX, 0, levelWidth - width);

      background(240, 248, 255);

      // Draw current level background (frozen)
      push();
      translate(-cameraX, 0);
      if(currentBackground) currentBackground.draw(cameraX);

      // Draw obstacles (frozen)
      if (obstaclesInitialized) {
        currentLayout.drawObstacles(player.currentX(), width);
      }

      // Draw all game objects (frozen)
      player.draw();
      playerShoots.draw();
      playerHitbox.drawPlayerHitbox();

      spawnPowerUps();
    
      if (player.shieldActive) {
        imageMode(CENTER);
        image(shieldDome, player.x + player.width / 2, player.y + player.height / 2, player.width, player.height);
      }

      // Draw all enemies (frozen)
      for (let enemy of enemiesArray) {
        enemy.draw();
      }

      // Draw the boss if he exists (frozen)
      if (boss !== null) {
        boss.draw();
      }
      pop();

      // Draw UI elements
      push();
      textSize(16);
      textAlign(LEFT, CENTER);
      text("Ammo: " + ammo, 50, height - 45);
      textAlign(RIGHT, TOP);
      let percentage = floor(gameStats.levelReached / bossSpawnPosition * 100);
      if (percentage > 100) {
        percentage = 100;
      }
      text("Level Reached: " + percentage + "%", width - 50, 25);
      pop();

      health.healthDraw();
      levelCreate.drawActiveStatus();
      // --- END PAUSED GAME DRAW ---
    }
    
    // Draw pause menu on top of everything if visible
    if (pauseMenu && pauseMenu.visible) {
      pauseMenu.draw();
    }
    
  } else if (deathScrn.visible) {
    deathScrn.screenDraw(death);
  } else if (showControls) {
    tutorialScrn.screenDraw(tutorial);
  } else if (statScrn.visible) {
    statScrn.screenDraw(stats);
    drawStats(gameStats);
  } else {
    titleScrn.screenDraw(title);
  }
}

/**
 * Called if a keyboard button is pressed by the player.
 * 
 * @returns {boolean} false to prevent default browser behavior
 */
function keyPressed() {
  // Debug mode sequence checking
  debugMode.checkSequence(key);
  
  // Handle debug mode commands
  debugMode.handleKey(key);
  
  // Toggle tutorial on title screen
  if (key === '1' && !debugMode.active) { // Only handle '1' for tutorial if not in debug mode
    if (titleScrn.visible) {
      showControls = !showControls; // toggle tutorial visibility
    }
  }
  
  // Pause menu controls
  if (playInitiated && pauseMenu && pauseMenu.visible) {
    switch(key) {
      case 'Escape':
        gamePaused = false;
        pauseMenu.hide();
        break;
      case 'ArrowUp':
        pauseMenu.moveSelection(-1);
        break;
      case 'ArrowDown':
        pauseMenu.moveSelection(1);
        break;
      case 'Enter':
        pauseMenu.selectOption();
        break;
    }
    return false;
  }
  
  // Pause the game
  if (playInitiated && key === 'Escape' && !gamePaused) {
    gamePaused = true;
    if (pauseMenu) {
      pauseMenu.show();
    }
    return false;
  }
  
  // Single-trigger keys (only when not paused)
  if (!gamePaused) {
    if (key === 'Enter') {
      if (titleScrn.visible && !showControls) { // Only start game if tutorial is not visible
        // Reset the game completely before starting
        completeGameReset();
        titleScrn.screenRemove();
        playInitiated = true;
      } else if (deathScrn.visible) {
        restartGame();
      }
      // Restart game after seeing Stat Screen
      if (statScrn.visible && key === 'Enter') 
      { 
        statScrn.visible = false;
        completeGameReset(); // this will bring player back to level 1 
      }
    }
  }
  return false;
}

/**
 * Completely reset the game to level 1.
 */
function completeGameReset() {
  // Reset ALL game stats when starting a new game
  gameStats = {
    shotsFired: 0,
    shotsMissed: 0,
    shotsHit: 0,
    enemiesKilled: 0,
    powerUpsUsed: 0,
    damageDone: 0,
    damageTaken: 0,
    healthHealed: 0,
    levelReached: 0
  };

  // Reset to level 1
  currentLevel = 1;
  
  // Clear all game objects
  enemiesArray = [];
  boss = null;
  bossActive = false;
  cameraX = 0;
  
  // Reset player
  if (player) {
    player.reset();
    player.x = 50;
    player.y = 0;
    player.velocityY = 0;
  }
  
  // Reset player shoots
  if (playerShoots) {
    playerShoots.bullets = [];
  }
  
  // Reset health
  if (health) {
    health.health = 50;
  }
  
  // Reset ammo and reload state (will be set properly in loadLevel)
  canShoot = true;
  isReloading = false;
  reloadStartTime = null;
  
  // Reset screens
  playInitiated = false;
  titleScrn.visible = true;
  deathScrn.visible = false;
  statScrn.visible = false;
  
  // Clear any keys that might be stuck
  for (let key in keys) {
    keys[key] = false;
  }
  
  // Load level 1 to reset obstacles and layout (this will also set ammo)
  loadLevel(1);
}

/**
 * Restarts the current level.
 */
function restartGame() {
  // Reset only the levelReached stat when player dies
  gameStats.levelReached = 0;

  // Reset ammo and reload state
  ammo = Math.round(12 - currentLevel);
  canShoot = true;
  isReloading = false;
  reloadStartTime = null;

  if (health) {
    health.health = 50;
  }
  
  if (player) {
    player.reset();
    player.x = 50;
    player.y = 0;
    player.velocityY = 0;
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
  statScrn.visible = false;
  playInitiated = true;
}