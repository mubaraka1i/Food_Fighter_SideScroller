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

let boss; // This will hold the boss object
let bossActive = false; // Flag to control boss state

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new Chef object from the class and store it in 'player'
  // Same concept with playershoots
  // Commets to help bebo but anyone can check out to see what is being done
  player = new Chef(50, 0); // Start at x=50, y=0
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50); // create a new health object starting at 50 HP
  playerHitbox = new ChefHitbox(player.currentX, player.currentY, showHitboxes, 50);
  titleScrn = new TitleScreen(0); // 0 indicates display title screen 
  deathScrn = new TitleScreen(1); // 1 indicates display death screen

  boss = null; // Boss does not exist at the start

}

function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');
  background1 = new Level1Background();
  background1.preload();
}

// BOSS SPAWNING FUNCTION
function spawnBoss() {
    // Spawn boss near the end of the level in world coordinates
    let bossX = width - 200; // 200px from right edge
    let bossY = height;
    boss = new Boss(bossX, bossY);
    bossActive = true;
    
    // Clear out all other enemies when boss spawns
    enemiesArray = []; 
}

// This function will run constantly and spawn enemies over time
function spawnEnemies() {
  if (frameCount % 120 === 0) { 
    // Spawn enemies in world space (not screen space)
    let spawnX = width + 50; // Spawn near right side of level
    
    if (random() < 0.5) {
      enemiesArray.push(new GroundEnemies(spawnX));
    } else {
      enemiesArray.push(new FlyingEnemies(spawnX, random(100, height / 2)));
    }
  }
}

function draw() {
  //background(240, 248, 255);

  //titleScrn.screenDraw(title); // show title screen

  if (playInitiated) { // if they press Play
    cameraX = player.currentX() - width ; // Centering camera on the square(chef)
    background1.draw(cameraX); //Shows kitchen background based off where camera moves

    let playerX = player.currentX(); 
    let playerY = player.currentY();

    // keep the player on the left side of the screen

  
    // Draw Background (relative to camera)
    push();
    translate(-cameraX, 0);
    background1.draw(cameraX);
    pop();

    if (health.getHealth() <= 0) {
      playInitiated = false;     // Stop the game
      deathScrn.visible = true;  // Make the death screen visible
      return; // Stop drawing the rest of the game
    }

    // Check if it's time to spawn the boss
    if (!bossActive && playerX > width * 0.75) {
        spawnBoss();
    }
    
    // If there is no boss, spawn regular enemies
    if (!bossActive) {
        spawnEnemies(); // Call the spawner every frame
    }

  
    //Tell the Chef to update its position and physics
    player.update();
    playerShoots.update();

    playerHitbox.updateX(playerX);
    playerHitbox.updateY(playerY);

    // Update all enemies in the array
    for (let i = enemiesArray.length - 1; i >= 0; i--) {
      enemiesArray[i].update(playerX, playerY);
    }

    // Update the boss if he exists
    if (bossActive && boss !== null) {
        boss.update(playerX, playerY);
    }

    checkCollisions();

    // Draw all objects relative to camera
    //push();
    //translate(-cameraX, 0);

    // Chef drawn to the screen
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

    health.healthDraw(); 
  
  }else if (deathScrn.visible) {
    deathScrn.screenDraw(death);
    
  } else {
    titleScrn.screenDraw(title);
  }

}

function keyPressed() {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      player.moveLeft(true); 
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      player.moveRight(true);
      break;
    case 'w':
    case 'W':
    case 'ArrowUp':
      player.jump();
      break;
    case 'Enter':
      if (titleScrn.visible) {
      // If on the title screen, start the game
      titleScrn.screenRemove(); // Hides title screen
      playInitiated = true;
      } else if (deathScrn.visible) {
        // If on the death screen, restart the game
        restartGame();
      }
      break;
    case ' ':
      playerShoots.shoot(player);
      break;
  }
  return false;
}

function keyReleased() {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      player.moveLeft(false); 
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      player.moveRight(false); 
      break;
  }
  return false;
}

// Restarts the game
function restartGame() {
  health = new ChefHealth(50);
  player = new Chef(50, 0);
  playerShoots = new PlayerShoots();
  enemiesArray = [];
  enemiesActive = false;

  bossActive = false;
  boss = null;
  cameraX = 0;
  
  // Hide death screen and show title screen
  deathScrn.visible = false;
  titleScrn.visible = true; 
  playInitiated = false;
}