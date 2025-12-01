class PlayerShoots {
  /**
   * Creates an object of PlayerShoots class that stores the list of bullets.
   */
  constructor() {
    this.bullets = [];
  }

  /**
   * @returns {Array} list of bullets sets {x, y, speedX, speedY, size, direction}
   */
  getBullets() {
    return this.bullets;
  }

  /**
   * Updates the position and reload of the bullets in the bullet list.
   */
  update() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      // Move bullet using both X and Y speeds
      this.bullets[i].x += this.bullets[i].speedX;
      this.bullets[i].y += this.bullets[i].speedY;
      
      // Remove bullets that go off the level 
      if (this.bullets[i].x > levelWidth || this.bullets[i].x < 0 || 
          this.bullets[i].y > height || this.bullets[i].y < 0) {
        this.bullets.splice(i, 1);
        gameStats.shotsMissed++;
        continue;
      }
    }
  }

  /**
   * Draws the bullets in the bullet list to the screen.
   */
  draw() {
    for (let bullet of this.bullets) {
      fill(255, 215, 0); // Gold color
      circle(bullet.x, bullet.y, bullet.size);
    }
  }

  /**
   * Adds a bullet to the bullet list when shot from the player.
   * 
   * @param {Chef} player player object to get shootInfo from
   */
  shoot(player, ammo) {
    const shootInfo = player.getShootInfo();

    this.bullets.push({
      x: shootInfo.x,
      y: shootInfo.y,
      speedX: shootInfo.speedX,
      speedY: shootInfo.speedY,
      size: 15,
      direction: shootInfo.direction
    });

    player.startShooting(ammo);
  }

  /**
   * Clears all bullets from the screen
   */
  clearBullets() {
    this.bullets = [];
  }
}