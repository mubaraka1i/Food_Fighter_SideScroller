class CookieBoss extends Boss {
  /**
  * Creates an object of the Boss class.
  * 
  * @param {number} x top left corner x coordinate of boss
  * @param {number} y top left corner y coordinate of boss
  */
  constructor(x, y) {
    super(x, y, 'cookie', cookieBoss.idle);
    this.health = 12;
    this.maxHealth = 12;
    this.width = 170;
    this.height = 170;
    this.shootInterval = 120;
    this.minionSpawnInterval = 180;
    this.maxMinions = 3;

    // Cookie boss specific
    this.cookieColor = '#D2B48C';
    this.chipColor = '#5D4037';
  }

  /**
   * Shoots a projectile towards the player's coordinates.
   * 
   * @param {number} playerX x value to shoot at
   * @param {number} playerY y value to shoot at
   */
  shootAtPlayer(playerX, playerY) {
    let bossCenterX = this.x + this.width / 2;
    let bossCenterY = this.y + this.height / 2;

    // Shoot 3 chocolate chips in a spread pattern
    for (let i = 0; i < 3; i++) {

      // Randomized the Bosses projectile Y axis
      let randomHeightY = random(-100, 140);

      let constrainY = constrain(
        bossCenterY + randomHeightY,
        150,
        height - 100
      );

      let angle = atan2(playerY - constrainY, playerX - bossCenterX);
      angle += random(-0.3, 0.3); // Reduced spread for better accuracy

      let dx = cos(angle) * 0.1; // Use the same 0.1 multiplier
      let dy = sin(angle) * 0.1;



      this.projectiles.push(new ChocolateChipProjectile(
        bossCenterX,
        constrainY,
        dx,
        dy
      ));
    }
  }

  /**
   * Spawns minions that come out of the boss.
   */
  spawnMinions() {
    if (enemiesArray.length < this.maxMinions) {
      let spawnX = this.x + random(-50, 50);
      let spawnY = this.y + this.height;
      enemiesArray.push(new CookieCrumbMinion(spawnX, spawnY));
    }
  }

  /**
   * Draws the boss to the screen.
   */
  draw() {
    // Draw cookie body
    super.draw();

    if (!this.slidingIn) {
      this.drawHealthBar();

      for (let projectile of this.projectiles) {
        projectile.draw();
        //projectile.drawHitbox();
      }
    }
  }
}