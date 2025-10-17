let player;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new Chef object from the class and store it in 'player'
  //Commets to help bebo but anyone can check out to see what is being done
  player = new Chef(50, 0); // Start at x=50, y=0
}

function draw() {
  background(240, 248, 255);

  // Tell the Chef to update its position and physics
  player.update();
  
  healthdraw()
  // Chef drawn to the screen
  player.draw();

  playerHitbox(player.currentX(),player.currentY(),50,true);
}

function keyPressed() {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      player.moveLeft(true); // Tell the Chef to start moving left
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      player.moveRight(true); // Tell the Chef to start moving right
      break;
    case 'w':
    case 'W':
    case 'ArrowUp':
      player.jump(); // Tell the Chef to jump
      break;
  }
  return false;
}

function keyReleased() {
  switch (key) {
    case 'a':
    case 'A':
    case 'ArrowLeft':
      player.moveLeft(false); // Tell the Chef to stop moving left
      break;
    case 'd':
    case 'D':
    case 'ArrowRight':
      player.moveRight(false); // Tell the Chef to stop moving right
      break;
  }
  return false;
}