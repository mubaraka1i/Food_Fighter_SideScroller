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

    // JUMPING MECHANICS for level 4-5 bosses
    this.isJumping = false;
    this.jumpCooldown = 0;
    this.jumpInterval = 300; // frames between possible jumps (5 seconds at 60fps)
    this.jumpChance = 0.003; // 0.3% chance per frame when cooldown is ready
    this.jumpStartX = 0;
    this.jumpTargetX = 0;
    this.jumpStartY = 0;
    this.jumpHeight = 300;
    this.jumpProgress = 0;
    this.jumpSpeed = 0.02; // Speed of jump animation (0 to 1)
    this.isInvulnerable = false; // Boss is invulnerable during jump
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
    if (!this.slidingIn && !this.isInvulnerable) {
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
    } else if (this.isJumping) {
        // Handle jumping animation
        this.updateJump();
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
        
        // Update cooldowns
        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        } else {
            // Random chance to start a jump
            if (random() < this.jumpChance) {
                this.startJump(playerHitboxX);
            }
        }
        
        // Only update normal combat if not jumping
        if (!this.isJumping) {
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
                else if (proj.x < cameraX || proj.x > cameraX + width) {
                    shouldRemove = true;
                }
                
                if (shouldRemove) {
                    this.projectiles.splice(i, 1);
                }
            }
            
            // Handle shooting
            if (this.shootCooldown > 0) {
                this.shootCooldown--;
            } else {
                this.shootAtPlayer(playerHitboxX, playerHitboxY);
                this.shootCooldown = this.shootInterval;
            }
            
            // Handle minion spawning
            if (this.minionSpawnCooldown > 0) {
                this.minionSpawnCooldown--;
            } else {
                this.spawnMinions();
                this.minionSpawnCooldown = this.minionSpawnInterval;
            }
        }
    }
  }

  /**
   * Starts a jump over the player
   * @param {number} playerX Player's X position
   */
  startJump(playerX) {
    if (this.isJumping || this.slidingIn) return;
    
    this.isJumping = true;
    this.isInvulnerable = true;
    this.jumpProgress = 0;
    
    // Calculate jump target (other side of screen, past the player)
    const jumpDistance = random(400, 600); // How far to jump
    const screenCenter = cameraX + width / 2;
    
    if (this.x < screenCenter) {
      // Boss is on left, jump to right
      this.jumpTargetX = min(this.x + jumpDistance, levelWidth - this.width);
    } else {
      // Boss is on right, jump to left
      this.jumpTargetX = max(this.x - jumpDistance, 0);
    }
    
    this.jumpStartX = this.x;
    this.jumpStartY = this.y;
    
    // Clear projectiles and stop spawning during jump
    this.projectiles = [];
  }

  /**
   * Updates the jump animation
   */
  updateJump() {
    this.jumpProgress += this.jumpSpeed;
    
    if (this.jumpProgress >= 1) {
      // Jump finished
      this.jumpProgress = 1;
      this.isJumping = false;
      this.isInvulnerable = false;
      this.x = this.jumpTargetX;
      this.y = this.jumpStartY;
      this.jumpCooldown = this.jumpInterval;
      return;
    }
    
    // Parabolic jump curve
    const t = this.jumpProgress;
    
    // Horizontal movement (linear)
    this.x = lerp(this.jumpStartX, this.jumpTargetX, t);
    
    // Vertical movement (parabolic)
    const peak = 0.5; // When the boss reaches the peak of the jump
    if (t < peak) {
      // First half of jump: going up
      const normalizedT = t / peak;
      this.y = this.jumpStartY - this.jumpHeight * (1 - (1 - normalizedT) * (1 - normalizedT));
    } else {
      // Second half of jump: coming down
      const normalizedT = (t - peak) / (1 - peak);
      this.y = this.jumpStartY - this.jumpHeight * (1 - normalizedT * normalizedT);
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


    // Randomized the Bosses projectile Y axis
      let randomHeightY = random(-100,140)

    let constrainY = constrain(bossCenterY + randomHeightY, 150, height - 100)
    
    let dx = playerHitboxX - bossCenterX;
    let dy = playerHitboxY - constrainY;
    
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx = dx / distance * 0.1; 
      dy = dy / distance * 0.1;
    }
    
    

  

    this.projectiles.push(new BossProjectile(
      bossCenterX,
      constrainY,
      dx,
      dy
    ));
  }

  /**
   * Default minion spawning - can be overriden
   */
  spawnMinions() {
    // Child classes can add their own minions to enemiesArray
  }

  /**
   * Draws the boss with jump animation
   */
  draw() {
    if (this.isJumping) {
      // Draw jumping boss - could add a special jumping frame if you have one
      if (this.idleFrames.length > 0) {
        imageMode(CORNER);
        // Use a specific frame or the first idle frame for jump
        image(this.idleFrames[0], this.x, this.y, this.width, this.height);
        
        // Draw jump trail effect
        this.drawJumpTrail();
      }
    } else if (this.slidingIn) {
      // Draw sliding animation with the first idle frame
      if (this.idleFrames.length > 0) {
        imageMode(CORNER);
        image(this.idleFrames[0], this.x, this.y, this.width, this.height);
      }
    } else if (this.idleFrames.length > 0) {
      // Idle animation with sprites
      imageMode(CORNER);
      image(this.idleFrames[this.idleFrameIndex], this.x, this.y, this.width, this.height);
    }
    
    // Draw health bar and projectiles (only when not sliding in and not invulnerable)
    if (!this.slidingIn && !this.isInvulnerable) {
      this.drawHealthBar();
      
      // Projectiles
      for (let projectile of this.projectiles) {
        projectile.draw();
        projectile.drawHitbox();
      }
    }
    
    // Draw invulnerability indicator during jump
    if (this.isInvulnerable) {
      this.drawInvulnerabilityEffect();
    }
  }

    /**
   * Draws a visual effect for jump trail
   */
  drawJumpTrail() {
    push();
    noFill();
    stroke(255, 200, 0, 100);
    strokeWeight(3);
    
    // Draw a simple arc trail behind the boss
    const trailLength = 50;
    const trailX = this.x - (this.jumpTargetX > this.jumpStartX ? trailLength : -trailLength);
    const trailY = this.y + this.height / 2;
    
    arc(trailX, trailY, 30, 30, PI, TWO_PI);
    pop();
  }

  /**
   * Draws invulnerability effect during jump
   */
  drawInvulnerabilityEffect() {
    push();
    noFill();
    stroke(255, 255, 0, 150);
    strokeWeight(4);
    rect(this.x - 5, this.y - 5, this.width + 10, this.height + 10);
    
    // Draw "INVULNERABLE" text
    fill(255, 255, 0, 200);
    noStroke();
    textAlign(CENTER);
    textSize(16);
    text("INVULNERABLE", this.x + this.width / 2, this.y - 20);
    pop();
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