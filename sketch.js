// sketch.js
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
let levelMusic = [];
let menuMusic;
let currentMusic = null;
let audioStarted = false;
let pauseMusic;
let justFinishedLore = false;

let musicMuted = false;
let soundEffectsMuted = false;
let volumeSlider;
let soundEffectsSlider;

let currentVolume = 0.5;
let currentSoundEffectsVolume = 0.7;

let boss;
let bossActive = false;

let debugMode;

// Enemy spawn variables
let enemySpawnRate; // Frames between enemy spawns
let enemySpawnTimer = 0;

let flyingEnemySprites = {
  left: [],
  right: []
};

let currentLevel = 1;
let levelWidth;
let bossSpawnPosition;
let currentBackground;
let currentLayout;
let obstacleImages = []; // Will store images for each level

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
  
};

// Timer variables for power-ups
let speedBoostEndTime = 0;
let shieldEndTime = 0;
let damageBoostEndTime = 0;

// Lore screen
let showLore = true;  // Start with lore enabled
let lorePage = 0;     // Which comic panel we're on
let loreImages = [];  // Comic strip images
let loreFinished = false;
let loreStarted = false; // Track if lore has started

let soundGameComplete;
let soundHeal;
let soundDamageBoost;
let soundDamageTaken;
let soundChefJump;
let soundChefShoot;
let soundShield;
let soundSpeedBoost;

// Track active power-up sounds to prevent stacking
let activePowerUpSounds = {
  speed: false,
  damage: false,
  shield: false
}

/**
 * Preloads all images that are used.
 */
function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');  // Game over screen
  victory = loadImage('Assets/endingscreen.png');  // Victory screen
  tutorial = loadImage('Assets/tutorialscreen.png');
  chefHat = loadImage('Assets/chef_health.png');
  stats = loadImage('Assets/statScreen.png');

  // Load sound effects
  soundGameComplete = loadSound('Assets/GameComplete.mp3');
  soundHeal = loadSound('Assets/Heal.wav');
  soundDamageBoost = loadSound('Assets/DamageBoost.mp3');
  soundDamageTaken = loadSound('Assets/DamageTaken.mp3');
  soundChefJump = loadSound('Assets/ChefJump.mp3');
  soundChefShoot = loadSound('Assets/ChefShoot.mp3');
  soundShield = loadSound('Assets/Shield.mp3');
  soundSpeedBoost = loadSound('Assets/SpeedBoost.mp3');

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

  // Load Obstacle Images
  obstacleImages[1] = loadImage("assets/candleObstacle.png");
  obstacleImages[2] = loadImage("assets/bakingpanObstacle.png");
  obstacleImages[3] = loadImage("assets/papertrayObstacle.png");
  obstacleImages[4] = loadImage("assets/strawObstacle.png");
  obstacleImages[5] = loadImage("assets/plateObstacle.png");

  // Load level theme music
  levelMusic[1] = loadSound('Assets/Level1Music.mp3');
  levelMusic[2] = loadSound('Assets/Level2Music.mp3');
  levelMusic[3] = loadSound('Assets/Level3Music.mp3');
  levelMusic[4] = loadSound('Assets/Level4Music.mp3');
  levelMusic[5] = loadSound('Assets/Level5Music.mp3');

  menuMusic = loadSound('Assets/MenuMusic.mp3');
  pauseMusic = loadSound('Assets/PauseMusic.mp3');

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

  // Load Flying Enemies
  flyingEnemySprites.left = [
    loadImage("Assets/eggLeft1.png"),
    loadImage("Assets/eggLeft2.png"),
    loadImage("Assets/eggLeft3.png")
  ];

  flyingEnemySprites.right = [
    loadImage("Assets/eggRight1.png"),
    loadImage("Assets/eggRight2.png"),
    loadImage("Assets/eggRight1.png")
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

  // LORE IMAGES (comic strip)
  loreImages = [
    loadImage('Assets/lorescreen1.png'),
    loadImage('Assets/lorescreen2.png'),
    loadImage('Assets/lorescreen3.png'),
    loadImage('Assets/lorescreen4.png'),
    loadImage('Assets/lorescreen5.png')
  ];
}

function playSound(sound, volume = 0.7) {
  if (sound && audioStarted && !soundEffectsMuted) {
    // Check if the sound is already playing
    if (!sound.isPlaying()) {
      // Use currentSoundEffectsVolume
      sound.setVolume(volume * currentSoundEffectsVolume);
      sound.play();
    }
  }
}

function startAudioOnFirstInteraction() {
  if (audioStarted) return;
  audioStarted = true;

  userStartAudio().then(() => {
    // Start menu music if on title or lore screen
    if ((titleScrn && titleScrn.visible) || (showLore && !loreFinished)) {
      playMenuMusic();
      console.log("Menu music started from user interaction");
    }
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create volume controls (position them in a corner) - initially hidden
  let controlsText = createP('Controls: M = Toggle Music, P = Toggle Sound Effects');
  controlsText.position(10, 200).style('color', 'black').style('font-size', '14px');
  controlsText.hide(); // Hide initially
  
  // Create volume slider
  let musicLabel = createP('Music Volume:');
  musicLabel.position(10, 240).style('color', 'black').style('font-size', '14px');
  musicLabel.hide(); // Hide initially
  
  volumeSlider = createSlider(0, 1, currentVolume, 0.1).position(10, 270).size(150); // Use currentVolume
  volumeSlider.hide(); // Hide initially
  
  // Create sound effects slider
  let soundLabel = createP('Sound Effects:');
  soundLabel.position(10, 300).style('color', 'black').style('font-size', '14px');
  soundLabel.hide(); // Hide initially
  
  soundEffectsSlider = createSlider(0, 1, currentSoundEffectsVolume, 0.1).position(10, 330).size(150); // Use currentSoundEffectsVolume
  soundEffectsSlider.hide(); // Hide initially

  // Store references to show/hide later
  window.volumeControls = {
    controlsText: controlsText,
    musicLabel: musicLabel,
    volumeSlider: volumeSlider,
    soundLabel: soundLabel,
    soundEffectsSlider: soundEffectsSlider
  };

  volumeSlider.input(updateVolume);
  soundEffectsSlider.input(updateVolume);

  window.addEventListener("mousemove", startAudioOnFirstInteraction);
  window.addEventListener("mousedown", startAudioOnFirstInteraction);
  window.addEventListener("keydown", startAudioOnFirstInteraction);
  window.addEventListener("touchstart", startAudioOnFirstInteraction);

  player = new Chef(50, 0, chefSprites);
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50, chefHat, hpDec, hpInc, hp, num_G, num_R);
  health.setPlayer(player);
  playerHitbox = new ChefHitbox(player, showHitboxes);
  
  // Initialize screens with correct types
  titleScrn = new TitleScreen(0);      // Type 0: Title screen (animated)
  deathScrn = new TitleScreen(1);      // Type 1: Death/Game Over screen (NOT animated)
  tutorialScrn = new TitleScreen(2);   // Type 2: Tutorial screen
  statScrn = new TitleScreen(3);       // Type 3: Stats screen
  victoryScrn = new TitleScreen(4);    // Type 4: Victory screen (animated)
  
  // Initially only show lore (handled by showLore flag)
  titleScrn.visible = false;    // Don't show title until lore is done
  deathScrn.visible = false;    // Don't show death screen
  victoryScrn.visible = false;  // Don't show victory screen
  
  pauseMenu = new PauseMenu();
  boss = null;
  canShoot = true;

  debugMode = new DebugMode();

  // Initialize loreStarted to true
  loreStarted = true;

  document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // --- LORE SCREEN CONTROLS ---
    if (showLore && !loreFinished) {
      if (e.key === " " || e.key === "Enter") {
        lorePage++;

        if (lorePage >= loreImages.length) {
          // Finished the comic
          loreFinished = true;
          showLore = false;
          
          // Show title screen now
          titleScrn.visible = true;
          
          // Set flag to prevent immediate game start
          justFinishedLore = true;
          
          // Stop any level music and start menu music
          if (currentMusic && currentMusic.isPlaying()) {
            currentMusic.stop();
          }
          playMenuMusic();
        }
      }
    }
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
  if (levelNumber > 5) {
    // Game completed - show victory flow
    finishGame();
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

  switch (levelNumber) {
    case 1:
      levelWidth = 3000;
      bossSpawnPosition = 2500;
      enemySpawnRate = 120;
      currentBackground = new Level1Background(level1BackgroundImg, levelWidth);
      currentLayout = new Level1Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 10, 10, 10, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    case 2:
      levelWidth = 7000;
      bossSpawnPosition = 6500;
      enemySpawnRate = 90;
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
      enemySpawnRate = 60;
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
      levelWidth = 8000;
      bossSpawnPosition = 7500;
      enemySpawnRate = 45;
      currentBackground = new Level4Background(level4BackgroundImg, levelWidth);
      currentLayout = new Level4Layout();
      if (currentLayout && currentLayout.levelMaker) {
        currentLayout.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
      }
      levelCreate = new LevelCreator(0, levelWidth, 25, 25, 25, bossSpawnPosition, currentLayout, height);
      powerList = levelCreate.powerList;
      break;
    case 5:
      levelWidth = 8000;
      bossSpawnPosition = 7500;
      enemySpawnRate = 30;
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
      finishGame();
      return;
  }
}

/**
 * Function to be called from collisions to know what level its on.
 */
function goToNextLevel() {
  // Check if this is the final level
  if (currentLevel >= 5) {
    finishGame();
    return;
  }
  
  // Stop current level music before loading next level
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
  }
  
  loadLevel(currentLevel + 1);
  
  // Start new level music (currentLevel is now the new level after loadLevel)
  playLevelMusic(currentLevel);
}

/**
 * Spawns the boss when called using the currentLevel number.
 */
function spawnBoss() {
  // Check debug mode
  if (debugMode.active && !debugMode.canSpawnBoss) {
    return;
  }

  let bossX = levelWidth - 200;
  let bossY = height - 175;

  // Create the appropriate boss for the current level
  switch (currentLevel) {
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
  enemiesArray = [];
}

/**
 * Spawns any power ups if levelCreate and powerList exist and powerlist length is not 0.
 * 
 * @returns {undefined} exit early if qualifications are not met
 */
function spawnPowerUps() {
  if (!levelCreate || !levelCreate.powerList || levelCreate.powerList.length === 0) return;
  levelCreate.drawAllPowerUps();
}

/**
 * Adds an enemy to the enemies array depending on the currentLevel number if enemySpawnTimer is at least enemySpawnRate.
 */
function spawnEnemies() {
  if (debugMode.active && !debugMode.canSpawnFlying && !debugMode.canSpawnGround) {
    return;
  }

  if (!bossActive) {
    enemySpawnTimer++;

    if (enemySpawnTimer >= enemySpawnRate) {
      let spawnX = cameraX + width + 50;

      if (random() < 0.5) {
        if (debugMode.active && !debugMode.canSpawnGround) {
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
        enemiesArray.push(new GroundEnemies(spawnX, height - 90, spritesArray));
      } else {
        if (debugMode.active && !debugMode.canSpawnFlying) {
          enemySpawnTimer = 0;
          return;
        }

        enemiesArray.push(new FlyingEnemies(spawnX, random(100, height / 2)));
      }

      enemySpawnTimer = 0;
    }
  }
}

function playLevelMusic(level) {
  if (musicMuted) return; // Don't play if music is muted
  
  // Stop any currently playing music
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
  }

  currentMusic = levelMusic[level];
  if (currentMusic) {
    const volumeLevel = currentVolume; // Use currentVolume instead of slider.value()
    currentMusic.setVolume(volumeLevel);
    currentMusic.setLoop(true);
    
    // Special handling for Level 2 music
    if (level === 2) {
      currentMusic.play(0, 1, 1, 18);
    } else {
      currentMusic.play();
    }
  }
}


function playMenuMusic() {
  if (musicMuted) return; // Don't play if music is muted
  
  // Only start menu music if it's not already playing
  if (currentMusic !== menuMusic || !currentMusic.isPlaying()) {
    // Stop any currently playing music
    if (currentMusic && currentMusic.isPlaying()) {
      currentMusic.stop();
    }

    currentMusic = menuMusic;
    
    if (currentMusic) {
      const volumeLevel = currentVolume * 0.5; // Use currentVolume
      currentMusic.setVolume(volumeLevel);
      currentMusic.setLoop(true);
      currentMusic.play();
    }
  }
}

function playPauseMenuMusic() {
  if (musicMuted) return; // Don't play if music is muted
  
  // Pause the level music
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.pause();
  }

  // Start pause menu music
  if (!pauseMusic.isPlaying()) {
    const volumeLevel = currentVolume * 0.5; // Use currentVolume
    pauseMusic.setVolume(volumeLevel);
    pauseMusic.setLoop(true);
    pauseMusic.play();
  }
}

function resumeLevelMusic() {
  // Stop pause menu music
  if (pauseMusic.isPlaying()) {
    pauseMusic.stop();
  }

  // Resume the level music exactly where it paused
  if (currentMusic && !currentMusic.isPlaying()) {
    // Apply the current volume before resuming
    currentMusic.setVolume(currentVolume);
    currentMusic.play();
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
  ammo = Math.round(12 - currentLevel);
}

function ammoReload() {
  if (isReloading && reloadStartTime) {
    let timeSinceReload = millis() - reloadStartTime;

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
 * Draws a red vignette effect when health is low
 */
function drawLowHealthVignette() {
  if (health && health.getHealth) {
    const currentHealth = health.getHealth();
    const maxHealth = 50;

    if (currentHealth <= 25) {  // Changed from 30 to 25
      push();
      noStroke();

      const intensity = map(currentHealth, 0, 25, 120, 30, true);  // Changed from 30 to 25

      let alpha = intensity;
      if (currentHealth <= 10 && !gamePaused) {
        const pulse = sin(millis() * 0.02) * 40;
        alpha = constrain(intensity + pulse, 30, 160);
      }

      fill(255, 0, 0, alpha);

      const vignetteSize = 200;

      rect(0, 0, width, vignetteSize);
      rect(0, height - vignetteSize, width, vignetteSize);
      rect(0, 0, vignetteSize, height);
      rect(width - vignetteSize, 0, vignetteSize, height);

      for (let i = 0; i < 3; i++) {
        const cornerSize = vignetteSize * (1 + i * 0.5);
        fill(255, 0, 0, alpha * (0.7 - i * 0.2));
        triangle(0, 0, cornerSize, 0, 0, cornerSize);
      }

      for (let i = 0; i < 3; i++) {
        const cornerSize = vignetteSize * (1 + i * 0.5);
        fill(255, 0, 0, alpha * (0.7 - i * 0.2));
        triangle(width, 0, width - cornerSize, 0, width, cornerSize);
      }

      for (let i = 0; i < 3; i++) {
        const cornerSize = vignetteSize * (1 + i * 0.5);
        fill(255, 0, 0, alpha * (0.7 - i * 0.2));
        triangle(0, height, 0, height - cornerSize, cornerSize, height);
      }

      for (let i = 0; i < 3; i++) {
        const cornerSize = vignetteSize * (1 + i * 0.5);
        fill(255, 0, 0, alpha * (0.7 - i * 0.2));
        triangle(width, height, width, height - cornerSize, width - cornerSize, height);
      }

      if (currentHealth <= 10 && !gamePaused) {
        const shakeAmount = sin(millis() * 0.03) * 2;
        translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
      }

      pop();
    }
  }
}

/**
 * Draws timer countdowns under power-up status icons
 */
function drawPowerUpTimers() {
  let xPos = 50;
  let yPos = height - 100;
  let iconSize = 40;
  let spacing = 50;
  let timerYOffset = 25;

  if (player && player.speed > 5 && speedBoostEndTime > 0) {
    const timeLeft = max(0, (speedBoostEndTime - millis()) / 1000);
    if (timeLeft > 0) {
      push();
      fill(255);
      textSize(12);
      textAlign(CENTER);
      text(nf(timeLeft, 0, 1) + "s", xPos + iconSize / 2, yPos + iconSize + timerYOffset);
      pop();
    }
    xPos += spacing;
  }

  if (player && player.shieldActive && shieldEndTime > 0) {
    const timeLeft = max(0, (shieldEndTime - millis()) / 1000);
    if (timeLeft > 0) {
      push();
      fill(255);
      textSize(12);
      textAlign(CENTER);
      text(nf(timeLeft, 0, 1) + "s", xPos + iconSize / 2, yPos + iconSize + timerYOffset);
      pop();
    }
    xPos += spacing;
  }

  if (player && player.damageBoostActive && damageBoostEndTime > 0) {
    const timeLeft = max(0, (damageBoostEndTime - millis()) / 1000);
    if (timeLeft > 0) {
      push();
      fill(255);
      textSize(12);
      textAlign(CENTER);
      text(nf(timeLeft, 0, 1) + "s", xPos + iconSize / 2, yPos + iconSize + timerYOffset);
      pop();
    }
    xPos += spacing;
  }
}

/**
 * Constantly called to update drawings, positions, status of objects, and collisions.
 * @returns {undefined} exit if health is 0
 */
function draw() {
  // --- LORE SCREEN HANDLING ---
  if (showLore && !loreFinished) {
    image(loreImages[lorePage], 0, 0, width, height);

    // "Press space to continue"
    fill(0);
    textAlign(CENTER);
    textFont("Courier New");
    textStyle(BOLD);
    textSize(28);
    text("Press SPACE to continue", width/2, height - 20);

    return;
  }
  
  if (playInitiated) {
    if (!gamePaused) {
      // --- NORMAL GAME LOGIC (when not paused) ---
      

      cameraX = player.currentX() - width / 2;
      cameraX = constrain(cameraX, 0, levelWidth - width);

      background(240, 248, 255);

      // Draw current level background
      push();
      translate(-cameraX, 0);
      if (currentBackground) currentBackground.draw(cameraX);

      // Handle shooting controls
      if (ammo > 0 && canShoot && !isReloading) {
        handleControls();
      } else {
        ammoReload();
      }

      player.updateInput();

      if (obstaclesInitialized) {
        currentLayout.drawObstacles(player.currentX(), width);
      }

      player.draw();
      playerShoots.draw();
      playerHitbox.drawPlayerHitbox();

      spawnPowerUps();

      if (player.shieldActive) {
        imageMode(CENTER);
        image(shieldDome, player.x + player.width / 2, player.y + player.height / 2, player.width, player.height);
      }

      for (let enemy of enemiesArray) {
        enemy.draw();
      }

      if (boss !== null) {
        boss.draw();
      }
      pop();

      push();
      textSize(16);
      textAlign(LEFT, CENTER);

      if (!isReloading && ammo > 0) {
        text("Ammo: " + ammo, 50, height - 25);
      } else if (isReloading) {
        let progress = (millis() - reloadStartTime) / reloadingTime;
        let progressBarWidth = 100;
        let progressX = 50;
        let progressY = height - 35;

        fill(100);
        rect(progressX, progressY, progressBarWidth, 10);
        fill(0, 255, 0);
        rect(progressX, progressY, progressBarWidth * progress, 10);

        text("Reloading...", 50, height - 55);
      } else {
        text("Ammo: " + ammo, 50, height - 45);
      }

      fill(0);
      textSize(16);
      text("Press ESC to pause", width - 200, 60);
      pop();

      push();
      textSize(16);
      textAlign(RIGHT, TOP);
     
      pop();

      debugMode.draw();

      levelCreate.drawActiveStatus();

      drawPowerUpTimers();

      health.healthDraw();

      drawLowHealthVignette();

      let playerHitboxX = playerHitbox.getCenterX();
      let playerHitboxY = playerHitbox.getCenterY();

      // CHECK FOR DEATH - show death screen for all levels including level 5
      if (health.getHealth() <= 0) {
        playInitiated = false;
        deathScrn.visible = true;
        // Stop level music
        if (currentMusic && currentMusic.isPlaying()) {
          currentMusic.stop();
        }
        // Play menu music on death screen
        playMenuMusic();
        return;
      }

      if (!bossActive && player.currentX() >= bossSpawnPosition) {
        spawnBoss();
      }

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
    } else {
      // --- GAME IS PAUSED ---
      cameraX = player.currentX() - width / 2;
      cameraX = constrain(cameraX, 0, levelWidth - width);

      background(240, 248, 255);

      push();
      translate(-cameraX, 0);
      if (currentBackground) currentBackground.draw(cameraX);

      if (obstaclesInitialized) {
        currentLayout.drawObstacles(player.currentX(), width);
      }

      player.draw();
      playerShoots.draw();
      playerHitbox.drawPlayerHitbox();

      spawnPowerUps();

      if (player.shieldActive) {
        imageMode(CENTER);
        image(shieldDome, player.x + player.width / 2, player.y + player.height / 2, player.width, player.height);
      }

      for (let enemy of enemiesArray) {
        enemy.draw();
      }

      if (boss !== null) {
        boss.draw();
      }
      pop();

      push();
      textSize(16);
      textAlign(LEFT, CENTER);
      text("Ammo: " + ammo, 50, height - 45);
      textAlign(RIGHT, TOP);
      
      pop();

      health.healthDraw();
      levelCreate.drawActiveStatus();
      drawPowerUpTimers();
      drawLowHealthVignette();
    }

    if (pauseMenu && pauseMenu.visible) {
      pauseMenu.draw();
    }

  } else if (deathScrn.visible) {
    // Game Over screen
    deathScrn.screenDraw(death);  // Use death (game over) image
  } else if (victoryScrn.visible) {
    // Victory screen
    victoryScrn.screenDraw(victory);  // Use victory image
    fill(0);
    textAlign(CENTER);
    textSize(28);
    text("Press ENTER to view stats", width / 2, height - 50);
  } else if (tutorialScrn.visible) {
    // Tutorial screen
    tutorialScrn.screenDraw(tutorial);
  } else if (statScrn.visible) {
    statScrn.screenDraw(stats);
    drawStats(gameStats);
  } else {
    // Title screen (only shows after lore is finished)
    titleScrn.screenDraw(title);
  }
}

function mousePressed() {
  // Ensure audio starts on first click (existing requirement)
  startAudioOnFirstInteraction();

  // Handle Title Screen Play Button Click
  // Check if: 
  // 1. Title screen is visible
  // 2. We aren't looking at controls/tutorial
  // 3. We aren't looking at Lore
  // 4. Lore has actually finished
  if (titleScrn.visible && !showControls && !showLore && loreFinished) {
    
    // Check if the click hit the specific arrow coordinates defined in TitleScreen
    if (titleScrn.isPlayButtonClicked(mouseX, mouseY)) {
      
      // --- START GAME LOGIC (Copied from your keyPressed 'Enter' logic) ---
      completeGameReset();
      titleScrn.screenRemove();
      playInitiated = true;
      
      // Stop menu music and start level 1 music
      if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
      }
      // Stop victory sound if still playing
      if (soundGameComplete && soundGameComplete.isPlaying()) {
        soundGameComplete.stop();
      }
      playLevelMusic(1);
    }
  }
  
  // You can also add click handling for Lore navigation here if you want:
  if (showLore && !loreFinished) {
     lorePage++;
     if (lorePage >= loreImages.length) {
          loreFinished = true;
          showLore = false;
          titleScrn.visible = true;
          justFinishedLore = true;
          if (currentMusic && currentMusic.isPlaying()) {
            currentMusic.stop();
          }
          playMenuMusic();
     }
  }
}

/**
 * Called if a keyboard button is pressed by the player.
 * 
 * @returns {boolean} false to prevent default browser behavior
 */
function keyPressed() {
  // --- LORE SCREEN HANDLING ---
  // Prevent any key handling during lore screen
  if (showLore && !loreFinished) {
    if (key === " " || key === "Enter") {
      lorePage++;
      
      if (lorePage >= loreImages.length) {
        // Finished the comic
        loreFinished = true;
        showLore = false;
        
        // Show title screen now
        titleScrn.visible = true;
        
        // Set flag to prevent immediate game start
        justFinishedLore = true;
        
        // Stop any current music and start menu music
        if (currentMusic && currentMusic.isPlaying()) {
          currentMusic.stop();
        }
        playMenuMusic();
      }
    }
    return false; // Prevent all other key handling during lore screen
  }

  // Debug mode sequence checking
  debugMode.checkSequence(key);

  // Handle debug mode commands
  debugMode.handleKey(key);

  // Mute/Unmute controls
  if (key === 'm' || key === 'M') {
    musicMuted = !musicMuted;
    if (musicMuted) {
      // If muting, stop all music
      if (currentMusic && currentMusic.isPlaying()) {
        currentMusic.stop();
      }
      if (pauseMusic && pauseMusic.isPlaying()) {
        pauseMusic.stop();
      }
    } else {
      // If unmuting, restart appropriate music
      if (playInitiated && !gamePaused) {
        // Resume level music
        playLevelMusic(currentLevel);
      } else if (gamePaused) {
        // Resume pause music
        playPauseMenuMusic();
      } else if (titleScrn.visible || victoryScrn.visible || deathScrn.visible) {
        // Resume menu music
        playMenuMusic();
      }
    }
    return false;
  }
  
  if (key === 'p' || key === 'P') {
    soundEffectsMuted = !soundEffectsMuted;
    return false;
  }

  // Toggle tutorial on title screen OR go back from tutorial to title
  if (key === '1' && !debugMode.active) {
    if (titleScrn.visible && !showLore) {
      // From title screen to tutorial
      showControls = true;
      tutorialScrn.visible = true;
      titleScrn.visible = false;
    } else if (tutorialScrn.visible) {
      // From tutorial screen back to title
      showControls = false;
      tutorialScrn.visible = false;
      titleScrn.visible = true;
    }
    return false; // Prevent further key handling
  }

  // Pause menu controls
  if (playInitiated && pauseMenu && pauseMenu.visible) {
    switch (key) {
      case 'Escape':
        gamePaused = false;
        pauseMenu.hide();
        resumeLevelMusic();
        break;
      case 'ArrowUp':
        pauseMenu.moveSelection(-1);
        break;
      case 'ArrowDown':
        pauseMenu.moveSelection(1);
        break;
      case 'Enter':
        pauseMenu.selectOption();
        if (pauseMusic.isPlaying()) pauseMusic.stop();
        if (!gamePaused && playInitiated) {
          resumeLevelMusic();
        }
        if (!playInitiated) {
          if (currentMusic && currentMusic.isPlaying()) currentMusic.stop();
          currentMusic = null;
          playMenuMusic();
          gamePaused = false;
        }
        break;
    }
    return false;
  }

  // Pause the game
  if (playInitiated && key === 'Escape' && !gamePaused) {
    gamePaused = true;
    if (pauseMenu) {
      pauseMenu.show(); // This will show volume controls
    }
    playPauseMenuMusic();
    return false;
  }

  // Single-trigger keys (only when not paused)
  if (!gamePaused) {
    if (key === 'Enter') {
      // Check if we just finished lore - reset the flag immediately
      if (justFinishedLore) {
        justFinishedLore = false; // Reset the flag immediately
        return false; // Don't start game on this press
      }
      
      // Check if we're on victory screen
      if (victoryScrn.visible) {
        // From victory screen to stats
        victoryScrn.visible = false;
        statScrn.visible = true;
        // Victory sound continues playing through stats screen
      }
      // Check if we're on title screen (after lore is finished)
      else if (titleScrn.visible && !showControls && !showLore && loreFinished) {
        // Start game from title screen
        completeGameReset();
        titleScrn.screenRemove();
        playInitiated = true;
        // Stop menu music and start level 1 music
        if (currentMusic && currentMusic.isPlaying()) {
          currentMusic.stop();
        }
        // Stop victory sound if still playing
        if (soundGameComplete && soundGameComplete.isPlaying()) {
          soundGameComplete.stop();
        }
        playLevelMusic(1);
      } else if (deathScrn.visible) {
        // Restart from death screen
        restartGame();
        playLevelMusic(currentLevel);
      } else if (statScrn.visible) {
        // From stats screen, go back to title
        statScrn.visible = false;
        titleScrn.visible = true;
        // Stop victory sound when going back to title
        if (soundGameComplete && soundGameComplete.isPlaying()) {
          soundGameComplete.stop();
        }
        playMenuMusic();
      }
    }
  }
  return false;
}

function updateVolume() {
  currentVolume = volumeSlider.value();
  currentSoundEffectsVolume = soundEffectsSlider.value();
  
  // Update any currently playing music
  if (currentMusic && currentMusic.isPlaying()) {
    // Adjust volume based on what type of music is playing
    if (currentMusic === menuMusic || currentMusic === pauseMusic) {
      currentMusic.setVolume(currentVolume * 0.5);
    } else {
      currentMusic.setVolume(currentVolume);
    }
  }
  
  // Update pause music if playing
  if (pauseMusic && pauseMusic.isPlaying()) {
    pauseMusic.setVolume(currentVolume * 0.5);
  }
}

function updateSoundEffects() {
  // This updates the volume for future sound effects
  // Existing sounds will continue at their current volume
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
    
  };

  // Reset power-up sound states
  activePowerUpSounds = {
    speed: false,
    damage: false,
    shield: false
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

  // Reset ammo and reload state
  canShoot = true;
  isReloading = false;
  reloadStartTime = null;

  // Reset power-up timers
  speedBoostEndTime = 0;
  shieldEndTime = 0;
  damageBoostEndTime = 0;

  // Reset screens
  playInitiated = false;
  titleScrn.visible = true;
  deathScrn.visible = false;
  statScrn.visible = false;
  victoryScrn.visible = false; // Reset victory screen
  tutorialScrn.visible = false; // Reset tutorial screen
  showControls = false; // Reset tutorial flag

  // Clear any keys that might be stuck
  for (let key in keys) {
    keys[key] = false;
  }

  // Load level 1
  loadLevel(1);
}

/**
 * Called when player completes the game (beats level 5 boss)
 */
function finishGame() {
  playInitiated = false;
  victoryScrn.visible = true;  // Show victory screen
  deathScrn.visible = false;
  titleScrn.visible = false;
  statScrn.visible = false;
  
  // Stop any level music and menu music
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
    currentMusic = null;
  }
  
  // Stop pause music if playing
  if (pauseMusic && pauseMusic.isPlaying()) {
    pauseMusic.stop();
  }
  
  // Play game complete sound (play once)
  if (soundGameComplete && !soundGameComplete.isPlaying()) {
    playSound(soundGameComplete, 0.7);
  }
}


/**
 * Restarts the current level.
 */
function restartGame() {
  

  // Reset power-up sound states
  activePowerUpSounds = {
    speed: false,
    damage: false,
    shield: false
  };

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

  // Reset power-up timers
  speedBoostEndTime = 0;
  shieldEndTime = 0;
  damageBoostEndTime = 0;

  // Reset screens
  deathScrn.visible = false;
  statScrn.visible = false;
  victoryScrn.visible = false; // Reset victory screen
  tutorialScrn.visible = false; // Reset tutorial screen
  showControls = false; // Reset tutorial flag

  for (let key in keys) {
    keys[key] = false;
  }

  playInitiated = true;
  
  // Play current level music
  playLevelMusic(currentLevel);
}