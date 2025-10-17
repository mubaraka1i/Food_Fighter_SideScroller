let playerPosX;
let playerPosY;
let visible;
let hitboxLength;

function setup() {
  createCanvas(400, 400);
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
  rect(x - 25, y - 25, length, length);
}