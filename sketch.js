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
let level1;
let layout1;
let chefSprites = {};
let obstaclesInitialized = false;
const keys = {}

let boss;
let bossActive = false;

// Level boundaries
let levelWidth = 3000;
let bossSpawnPosition = 2500; // Boss spawns when player reaches this X position in the world

function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');
  background1 = new Level1Background();
  background1.preload();
  chefHat = loadImage('Assets/chef_health.png');
  
  // Load Chef sprites
  chefSprites = {
    stand: loadImage('Assets/chef_stand.png'),
    walk: [
      loadImage('Assets/chef_walk1.png'),
      loadImage('Assets/chef_walk2.png'),
      loadImage('Assets/chef_walk3.png')
    ],
    duck:  loadImage('Assets/chef_duck.png'),
    jump:  loadImage('Assets/chef_jump.png'),
    fall:  loadImage('Assets/chef_fall.png')
  };

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  level1 = new LevelCreator(0, levelWidth, 5, 5, 5, bossSpawnPosition);
  layout1 = new Level1Layout();
  
  player = new Chef(50, 0, chefSprites);
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50, chefHat);
  playerHitbox = new ChefHitbox(player, showHitboxes);
  titleScrn = new TitleScreen(0);
  deathScrn = new TitleScreen(1);
  boss = null;


  document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });
  
  document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });
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

    // Draw Background 
    push();
    translate(-cameraX, 0);
    background1.draw(cameraX);
    
    player.updateInput(); // constantly update simultaneous input

    // prevents constant redraw that causes lag
    if (!obstaclesInitialized) {
        layout1.levelMaker(height, player.currentX(), width);
        obstaclesInitialized = true;
    } else {
        layout1.getObstacles().obstacleDraw("black", "gray", player.currentX(), width);
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

    player.update();
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
  enemiesArray = [];
  bossActive = false;
  boss = null;
  cameraX = 0;
  
  for (let key in keys) {
    keys[key] = false;
  }

  deathScrn.visible = false;
  titleScrn.visible = true; 
  playInitiated = false;
}