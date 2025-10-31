let player;
let playerShoots;
let health;
let showHitboxes = true;
let playerHitbox;
let enemiesArray = [];
let enemiesActive = false;
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

function draw() {
  background(240, 248, 255);

  titleScrn.screenDraw(title); // show title screen

  if (playInitiated) { // if they press Play

    if (health.getHealth() <= 0) {
      playInitiated = false;     // Stop the game
      deathScrn.visible = true;  // Make the death screen visible
      return; // Stop drawing the rest of the game
    }

  // Tell the Chef to update its position and physics
    player.update();

    playerShoots.update();

    if (enemiesActive) {
      updateEnemies();
    }
    checkCollisions();

  
    health.healthDraw() // draws health on the screen

    // Chef drawn to the screen
    player.draw();
    playerShoots.draw();

    let playerX = player.currentX(); 
    let playerY = player.currentY();

    playerHitbox.updateX(playerX);
    playerHitbox.updateY(playerY);
    playerHitbox.drawPlayerHitbox();
  
    //bebo draw function moved to sketch
    if (!enemiesActive && playerX >= width / 3) {
      spawnEnemies();
      //spawnGroundEnemies();
      enemiesActive = true;
    }
  
  } else if (deathScrn.visible) {
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