class Boss {
  /**
   * @param {number} x top left corner x coordinate of boss
   * @param {number} y top left corner y coordinate of boss
   * @param {String} type tells which boss it is
   */
  constructor(x, y, type) {
    this.type = type;
    this.width = 100;
    this.height = 150;
    
    // SLIDING ANIMATION :
    this.targetX = x;          
    this.startX = x + 300;      
    this.x = this.startX;       
    this.y = y;
    
    this.slideSpeed = 8;
    this.slidingIn = true;
    this.projectiles = [];
    this.shootCooldown = 0;
    
    // Default values that can be overridden by child classes
    this.health = 10;
    this.maxHealth = 10;
    this.shootInterval = 90;
    this.minionSpawnCooldown = 0;
    this.minionSpawnInterval = 180;
    this.maxMinions = 3;
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height
    };
  }

  getProjectiles() {
    return this.projectiles;
  }

  getHealth() {
    return this.health;
  }

  isSlidingIn() {
    return this.slidingIn;
  }

  /**
   * Decreases the boss's health when called.
   * @param {number} damage amount to decrease the health by
   */
  takeDamage(damage) {
    if (!this.slidingIn) {
      this.health -= damage;
    }
  }

  /**
   * Updates the minion spawning and projectile shooting.
   * @param {number} playerHitboxX x value to shoot projectiles at
   * @param {number} playerHitboxY y value to shoot projectiles at
   */
  update(playerHitboxX, playerHitboxY) {
    if (this.slidingIn) {
      this.x -= this.slideSpeed;
      if (this.x <= this.targetX) {
        this.x = this.targetX;
        this.slidingIn = false;
      }
    } else {
      // Update existing projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        this.projectiles[i].update();
        
        // Remove projectiles that go off screen/into new level
        let proj = this.projectiles[i];
        if (proj.x < cameraX || proj.x > cameraX + width || 
          proj.y < 0 || proj.y > height) {
          this.projectiles.splice(i, 1);
        }
      }
      
      // Handle shooting - to be overridden by child classes
      if (this.shootCooldown > 0) {
        this.shootCooldown--;
      } else {
        this.shootAtPlayer(playerHitboxX, playerHitboxY);
        this.shootCooldown = this.shootInterval;
      }
      
      // Handle minion spawning - to be overridden by child classes
      if (this.minionSpawnCooldown > 0) {
        this.minionSpawnCooldown--;
      } else {
        this.spawnMinions();
        this.minionSpawnCooldown = this.minionSpawnInterval;
      }
    }
  }

  /**
   * To be overriden by child class. Default shooting behavior.
   * @param {number} playerHitboxX x value to shoot at
   * @param {number} playerHitboxY y value to shoot at
   */
  shootAtPlayer(playerHitboxX, playerHitboxY) {
    let bossCenterX = this.x + this.width / 2;
    let bossCenterY = this.y + this.height / 2;
    
    let dx = playerHitboxX - bossCenterX;
    let dy = playerHitboxY - bossCenterY;
    
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx = dx / distance * 0.1; 
      dy = dy / distance * 0.1;
    }
    
    this.projectiles.push(new BossProjectile(
      bossCenterX,
      bossCenterY,
      dx,
      dy
    ));
  }

  /**
   * NOT YET IMPLEMENTED.
   */
  spawnMinions() {
    // Default minion spawning - can be overridden
    // Child classes can add their own minions to enemiesArray
  }

  /**
   * Default boss drawing method. Can be overriden by child classes.
   */
  draw() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
    
    // Default boss details
    fill(255);
    rect(this.x + 20, this.y - 30, this.width - 40, 30); // Chef hat
    
    fill(255);
    ellipse(this.x + 30, this.y + 50, 20, 20); // Eyes
    ellipse(this.x + 70, this.y + 50, 20, 20);
    
    fill(0);
    ellipse(this.x + 30, this.y + 50, 10, 10); // Pupils
    ellipse(this.x + 70, this.y + 50, 10, 10);
    
    if (!this.slidingIn) {
      this.drawHealthBar();
      
      // Projectiles
      for (let projectile of this.projectiles) {
        projectile.draw();
        projectile.drawHitbox();
      }
    }
  }

  /**
   * Draws the boss's health bar right above it.
   */
  drawHealthBar() {
    fill(255);
    rect(this.x, this.y - 50, this.width, 10);
    fill(0, 255, 0);
    let healthWidth = this.width * (this.health / this.maxHealth);
    rect(this.x, this.y - 50, healthWidth, 10);
  }
}