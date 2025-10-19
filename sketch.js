let player;
let playerShoots;
let enemiesArray = [];
let enemiesActive = false;
let showHitboxes = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new Chef object from the class and store it in 'player'
  // Same concept with playershoots
  // Commets to help bebo but anyone can check out to see what is being done
  player = new Chef(50, 0); // Start at x=50, y=0
  playerShoots = new PlayerShoots();
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


  //healthdraw()

  // Chef drawn to the screen
  player.draw();
  playerShoots.draw();

  let playerX = player.currentX(); 
  let playerY = player.currentY();


  //playerHitbox(playerX, playerY, 50, true);
  
  
  //bebo draw function moved to sketch
  if (!enemiesActive && playerX >= width / 3) {
    spawnEnemies();
    enemiesActive = true;
  }

  if (enemiesActive) {
    updateEnemies();
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