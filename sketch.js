let player;
let playerShoots;
let health;
let showHitboxes = true;
let playerHitbox;
let enemiesArray = [];
let enemiesActive = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new Chef object from the class and store it in 'player'
  // Same concept with playershoots
  // Commets to help bebo but anyone can check out to see what is being done
  player = new Chef(50, 0); // Start at x=50, y=0
  playerShoots = new PlayerShoots();
  health = new ChefHealth(50); // create a new health object starting at 50 HP
  playerHitbox = new ChefHitbox(player.currentX, player.currentY, showHitboxes, 50);
}

function draw() {
  background(240, 248, 255);

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
    enemiesActive = true;
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