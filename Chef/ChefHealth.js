class ChefHealth {
  /**
   * Constructs a ChefHealth object that keeps track of health, draws HP, and changes health.
   * 
   * @param {number} health amount of health points a player has from 0-50
   * @param {Object} img an image object that holds the chef hat in the HP bar
   */
  constructor(health, img) {
    this.health = health;
    this.healthImg = img;
  }

  /**
   * @returns {number} current health points of the player
   */
  getHealth() {
    return this.health;
  }


   /**
   * Increases the player's health.
   * 
   * @param {number} healing: amount to increase health by.
   */
  healthInc(healing) {
    this.health += healing;
  }

  /**
   * Decreases the player's health.
   * 
   * @param {number} damage: amount to decrease health by.
   */
  healthDec(damage) {
    this.health -= damage;
  }

  /**
   * Draws the chef hats on the screen based on how much health is left. (1 for each 10 HP)
   */
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
}