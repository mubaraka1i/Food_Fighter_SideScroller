class Boss {
  /**
   * Creates an object of the Boss class.
   * 
   * @param {number} x top left corner x coordinate of boss
   * @param {number} y top left corner y coordinate of boss
   * @param {String} type tells which boss it is
   * @param {Array} idleFrames list of images to animate boss
   */
  constructor(x, y, type, idleFrames = []) {
    this.type = type;
    this.width = 170;
    this.height = 170;

    // Idle animation frames
    this.idleFrames = idleFrames;   // array of 3 images
    this.idleFrameIndex = 0;
    this.idleFrameTimer = 0;
    this.idleFrameDuration = 12; // change to 6, 8, 15 for faster/slower
    
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

  /**
   * @returns {Set} hitbox of the boss {x, y, w, h}
   */
  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height
    };
  }

  /**
   * @returns {Array} list of bossProjectile objects
   */
  getProjectiles() {
    return this.projectiles;
  }

  /**
   * @returns {number} amount of health points left for a boss
   */
  getHealth() {
    return this.health;
  }

  /**
   * @returns {boolean} true if sliding in, false if not
   */
  isSlidingIn() {
    return this.slidingIn;
  }

  /**
   * Decreases the boss's health when called.
   * 
   * @param {number} damage amount to decrease the health by
   */
  takeDamage(damage) {
    if (!this.slidingIn) {
      this.health -= damage;
    }
  }

  /**
   * Updates the minion spawning and projectile shooting.
   * 
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
        // Update Idle animation
        this.idleFrameTimer++;
        if (this.idleFrameTimer >= this.idleFrameDuration) {
            this.idleFrameTimer = 0;
            this.idleFrameIndex++;
            if (this.idleFrameIndex >= this.idleFrames.length) {
                this.idleFrameIndex = 0;
            }
        }
        
        
        // Update existing projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            
            // Remove projectiles that go off screen/into new level OR should be removed
            let proj = this.projectiles[i];
            let shouldRemove = false;
            
            // Check if projectile has a custom removal condition
            if (proj.shouldRemove && proj.shouldRemove()) {
                shouldRemove = true;
            }
            // Check if projectile is out of bounds
            else if (proj.x < cameraX || proj.x > cameraX + width || 
                proj.y < 0 || proj.y > height) {
                shouldRemove = true;
            }
            
            if (shouldRemove) {
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
   * 
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
    if (this.slidingIn) {
      // Draw sliding animation with the first idle frame
      if (this.idleFrames.length > 0) {
        imageMode(CORNER);
        image(this.idleFrames[0], this.x, this.y, this.width, this.height);
      } else {
        // Fallback: draw simple rectangle
        fill(255, 0, 0);
        rect(this.x, this.y, this.width, this.height);
      }
    } else if (this.idleFrames.length > 0) {
      // Idle animation with sprites
      imageMode(CORNER);
      image(this.idleFrames[this.idleFrameIndex], this.x, this.y, this.width, this.height);
    } else {
      // Fallback: draw simple rectangle
      fill(255, 0, 0);
      rect(this.x, this.y, this.width, this.height);
    }
    
    // Draw health bar and projectiles (only when not sliding in)
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