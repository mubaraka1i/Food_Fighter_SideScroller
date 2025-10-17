let playerPosX;
let playerPosY;
let hitboxDia;
let seaLevel;
let visible;

function setup() {
  createCanvas(400, 400);
  seaLevel = 0;
  playerPosX = 25;
  playerPosY = height - 50 - seaLevel;
  hitboxLength = 25;
  visible = false;
}

function draw() {
  background(220);
  playerHitbox(playerPosX, playerPosY, hitboxLength, visible);
}

function playerHitbox(x, y, length, visible) {
  noFill();
  if (visible == true) {
    stroke('black');
  } else {
    noStroke();
  }
  rect(x, y, length, length);
}