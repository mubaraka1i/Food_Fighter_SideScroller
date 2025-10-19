class ChefHealth {

  constructor(health) {
    this.health = health;
  }

  getHealth() {
    return this.health;
  }
  healthDraw() {
    text("HP: " + this.health, 15, 20);
  }

  healthInc(healing) {
    this.health += healing;
  }

  healthDec(damage) {
    this.health -= damage;
  }
}