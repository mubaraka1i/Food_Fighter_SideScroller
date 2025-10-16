let playerPosX;
let playerPosY;
let hitboxDia;
let seaLevel;
let visible;

function setup() {
  createCanvas(400, 400);
  seaLevel = 0;
  playerPosX = 20;
  playerPosY = height - 20 - seaLevel;
  hitboxDia = 25;
  visible = false;
}

function draw() {
  background(220);
  playerHitbox(playerPosX, playerPosY, hitboxDia, visible);
}

function playerHitbox(x, y, diameter, visible) {
  noFill();
  if (visible == true) {
    stroke('black');
  } else {
    noStroke();
  }
  circle(x, y, diameter);
}