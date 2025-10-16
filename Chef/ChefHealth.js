let health;

function setup() {
  createCanvas(400, 400);
  health = 50;
}

function draw() {
  background(220);
  text("HP: " + health, 15, 20);
}

function healthInc(healing) {
  health += healing;
}

function healthDec(damage) {
  health -= damage;
}