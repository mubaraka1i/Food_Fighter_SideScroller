class ChefHealth {

  constructor(health) {
    this.health = health;
  }

  getHealth() {
    return this.health;
  }
  healthDraw() {
    fill(0);
    noStroke(); 
    textSize(16); 
    textAlign(LEFT, TOP);
    text("HP: " + this.health, 15, 20);
  }

  healthInc(healing) {
    this.health += healing;
  }

  healthDec(damage) {
    this.health -= damage;
  }
}