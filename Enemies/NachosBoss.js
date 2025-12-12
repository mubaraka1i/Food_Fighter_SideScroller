class NachosBoss extends Boss {
  /**
   * Creates an object of the NachosBoss class for level three.
   * 
   * @param {number} x top left corner x coordinate of boss
   * @param {number} y top left corner y coordinate of boss 
   */
  constructor(x, y) {
    super(x, y, 'nachos', nachoBoss.idle);
    this.health = 15;
    this.maxHealth = 15;
    this.width = 190;
    this.height = 170;
    this.shootInterval = 100;
    this.minionSpawnInterval = 200;
    this.maxMinions = 4;

    this.nachoColor = '#FFD700';
    this.cheeseColor = '#FFA500';
  }

  /**
   * Shoots a projectile towards the player's position.
   * 
   * @param {number} playerX x coordinate to shoot towards
   * @param {number} playerY y coordiante to shoot towards
   */
  shootAtPlayer(playerX, playerY) {
    let bossCenterX = this.x + this.width / 2;
    let bossCenterY = this.y + this.height / 2;
    // Randomized the Bosses projectile Y axis
    let randomHeightY = random(-100, 140);

    let constrainY = constrain(
      bossCenterY + randomHeightY,
      150,
      height - 100
    );

    let dx = playerX - bossCenterX;
    let dy = playerY - constrainY;

    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx = dx / distance * 0.1;
      dy = dy / distance * 0.1;
    }

    this.projectiles.push(new CheeseProjectile(
      bossCenterX,
      constrainY,
      dx,
      dy
    ));
  }

  /**
   * Spawns a minion if possible for the boss.
   */
  spawnMinions() {
    if (enemiesArray.length < this.maxMinions) {
      let spawnX = this.x + random(-100, 100);
      let spawnY = this.y + this.height;
      enemiesArray.push(new NachoCrumbleMinion(spawnX, spawnY));
    }
  }

  /**
   * Draws the boss to the screen.
   */
  draw() {
    // Draw nacho pile base
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