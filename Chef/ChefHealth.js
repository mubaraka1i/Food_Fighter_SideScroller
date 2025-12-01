class ChefHealth {
  /**
   * Constructs a ChefHealth object that keeps track of health, draws HP, and changes health.
   * 
   * @param {number} health amount of health points a player has from 0-50
   * @param {Object} img an image object that holds the chef hat in the HP bar
   * @param {p5.Image} dec - Damage icon.
   * @param {p5.Image} inc - Heal icon.
   * @param {p5.Image} bar - Health bar image.
   * @param {p5.Image} numG - Green digit sprite sheet.
   * @param {p5.Image} numR - Red digit sprite sheet.
   */
  constructor(health, img, dec, inc, bar, numG, numR) {
    this.health = health;
    this.healthImg = img;
    this.healthDecImg = dec;
    this.healthIncImg = inc;
    this.hpBar = bar;
    this.numbersG = numG;
    this.numbersR = numR;

    this.notificationType = null;
    this.notificationValue = 0;
    this.notificationTimer = 0;
    this.notificationX = 0;
    this.notificationY = 0;
  }

  setPlayer(playerObj) {
  this.player = playerObj;
}

  /**
   * Draws a single digit from a horizontal 0–9 spritesheet.
   */
  drawNumber(spritesheet, digit, x, y, size) {
    const frameWidth = spritesheet.width / 10;

    image(
      spritesheet,
      x, y,
      size, size,
      digit * frameWidth, 0,
      frameWidth, spritesheet.height
    );
  }

  /**
   * Draws a multi-digit number using a spritesheet.
   */
  drawMultiDigit(spritesheet, value, x, y, size) {
    const str = value.toString();
    for (let i = 0; i < str.length; i++) {
      this.drawNumber(spritesheet, int(str[i]), x + i * size, y, size);
    }
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
    this.triggerNotification("heal", healing);
  }

  /**
   * Decreases the player's health.
   * 
   * @param {number} damage: amount to decrease health by.
   */
  healthDec(damage) {
    this.health -= 0; // 0 for testing
    this.triggerNotification("damage", damage);
  }

  // Triggers a notification at the player's current position (fixed)
  triggerNotification(type, value) {
    if (!this.player) return;

    this.notificationType = type;
    this.notificationValue = value;
    this.notificationTimer = 60;

    // Store fixed position
    this.notificationX = 500;
    this.notificationY = 700;
  }
  
  /**
   * Draws the floating heal/damage popup.
   */
  drawPopup() {
    if (this.notificationTimer <= 0) return;

    this.notificationTimer--;
    const offsetY = (60 - this.notificationTimer) * 0.5;
    const x = this.notificationX;
    const y = this.notificationY + offsetY;

    if (this.notificationType === "damage") {
      image(this.healthDecImg, x - 30, y, 25, 25);
      this.drawMultiDigit(this.numbersR, this.notificationValue, x, y, 35);
    } else if (this.notificationType === "heal") {
      image(this.healthIncImg, x - 30, y, 25, 25);
      this.drawMultiDigit(this.numbersG, this.notificationValue, x, y, 35);
    }
  }

  /**
   * Draws the chef hats on the screen based on how much health is left. (1 for each 10 HP)
   */
  healthDraw() {
    fill(0);
    noStroke(); 
    image(this.hpBar, 10, 10, 50, 50);
    this.drawMultiDigit(this.numbersG, this.health, 65, 13, 40); // 20px number size

    const numHats = floor (this.health / 10); // how many hats to show
    const hatSize = 100; // size of each hat image
    const padding = 10;    // space between hats
    
    for (let i = 0; i < numHats; i++) { // display the hats
      image(this.healthImg, i * (hatSize + padding), 50, hatSize, hatSize);
    }

    this.drawPopup();
  }
}