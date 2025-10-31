let player;
let playerShoots;
let health;
let showHitboxes = true;
let playerHitbox;
let enemiesArray = [];
let playInitiated = false;
let gameScale;

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
}

function preload() {
  title = loadImage('Assets/titlescreen.png');
  death = loadImage('Assets/gameoverscreen.png');
}

// This function will run constantly and spawn enemies over time
function spawnEnemies() {
  // Spawn a new enemy every 2 seconds (120 frames at 60fps)
  if (frameCount % 120 === 0) { 
    
    // Randomly spawn a ground or flying enemy
    if (random() < 0.5) {
      // Spawn ground enemy off-screen right
      enemiesArray.push(new GroundEnemies(width + 50));
    } else {
      // Spawn flying enemy off-screen right, at a random height
      enemiesArray.push(new FlyingEnemies(width + 50, random(100, height / 2)));
    }
  }
}

function draw() {
  background(240, 248, 255);

  titleScrn.screenDraw(title); // show title screen

  if (playInitiated) { // if they press Play

    if (health.getHealth() <= 0) {
      playInitiated = false;     // Stop the game
      deathScrn.visible = true;  // Make the death screen visible
      return; // Stop drawing the rest of the game
    }
  
    spawnEnemies(); // Call the spawner every frame

    //Tell the Chef to update its position and physics
    player.update();
    playerShoots.update();

    let playerX = player.currentX(); 
    let playerY = player.currentY();
    playerHitbox.updateX(playerX);
    playerHitbox.updateY(playerY);

    // Update all enemies in the array
    for (let i = enemiesArray.length - 1; i >= 0; i--) {
      enemiesArray[i].update(playerX, playerY);
    }

    checkCollisions();

    health.healthDraw() // draws health on the screen
    // Chef drawn to the screen
    player.draw();
    playerShoots.draw();
    playerHitbox.drawPlayerHitbox();

    // Draw all enemies
    for (let enemy of enemiesArray) {
      enemy.draw();
    }
  
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
  
  // Hide death screen and show title screen
  deathScrn.visible = false;
  titleScrn.visible = true; 
}