class ChefHealth {

  constructor(health, img) {
    this.health = health;
    this.healthImg = img;
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

    const numHats = floor (this.health / 10); // how many hats to show
    const hatSize = 100; // size of each hat image
    const padding = 10;    // space between hats
    
    for (let i = 0; i < numHats; i++) { // display the hats
      image(this.healthImg, 15 + i * (hatSize + padding), 40, hatSize, hatSize);
    }
  }

  healthInc(healing) {
    this.health += healing;
  }

  healthDec(damage) {
    this.health -= damage;
  }
}