class Chef {
  /**
   * Constructs the player object for use throughout the entire game.
   *
   * @param {number} startX: the starting x coordinate of the player's top left corner
   * @param {number} startY: unknown
   * @param {Image} sprites: sprites to use for the player drawing
   */
  constructor(startX, startY, sprites) {
    this.x = startX;
    this.y = startY;
    this.sprites = sprites;

    this.width = 150;
    this.height = 150;
    this.speed = 5; // amount to change x by when moving left / right
    this.velocityY = 0; // amount to change y by when jumping / falling
    this.jumpStrength = 16; // amount the player can jump in pixels
    this.groundTolerance = 5; // tolerance for ground detection
    this.damageMultiplier = 1; // damage done to enemies when projectiles connect
    this.shieldTimer = 0; // time the current shield has been active
    this.shieldDuration = 5000; // 5 seconds

    this.facingDirection = 'right';
    this.isOnGround = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isDucking = false;
    this.jumpPressed = false;
    this.isTakingDamage = false;
    this.shieldActive = false;
    this.damageBoostActive = false;

    this.isShooting = false;
    this.shootFrameTimer = 0;
    this.shootFrameDuration = 15; // frames to show shooting animation

    // To prevent retriggering
    keys['w'] = false;
    keys['arrowup'] = false;
  }

  /**
   * Updates the player's input keys into the hitbox and player model.
   */
  updateInput() {
    // Horizontal movement using JavaScript keys
    this.isMovingLeft = keys['a'] || keys['arrowleft'];
    this.isMovingRight = keys['d'] || keys['arrowright'];

    // Ducking
    if (keys['s'] || keys['arrowdown']) {
      playerHitbox.duck();
    } else {
      playerHitbox.cancelDuck();
    }

    // Jumping (Single press)
    if ((keys['w'] || keys['arrowup']) && this.isOnGround && !this.isTakingDamage) {
      this.jump();
      // Clear the jump keys to prevent retriggering
      keys['w'] = false;
      keys['arrowup'] = false;
    }
  }

  /**
   * Updates the collision responses for player's position.
   * @param {LevelLayout} currentLayout: the layout of the current level
   */
  update(currentLayout) {
    // Update shield timer first
    this.updateShield();

    // Store old position for collision response
    let oldX = this.x;
    let oldY = this.y;

    this.updateShield();

    if (this.isMovingLeft) {
      this.facingDirection = 'left';
      this.x -= this.speed;
    }
    if (this.isMovingRight) {
      this.facingDirection = 'right';
      this.x += this.speed;
    }

    
    // Prevent chef from going past the right boundary of the level
    if (this.x + this.width > levelWidth) {
      this.x = levelWidth - this.width;
    }

    // Also prevent going past left boundary
    if (this.x < 0) {
      this.x = 0;
    }

    // Apply gravity only if not on ground
    this.velocityY += 1; // Simple gravity - just move downward
    

    // Update vertical position
    this.y += this.velocityY;

    let obstacleTracker = (currentLayout && currentLayout.getObstacles()) ? currentLayout.getObstacles() : null;

    if (obstaclesInitialized && obstacleTracker) {
      this.handleObstacleCollision(oldX, oldY, obstacleTracker);
    }

    let groundLevel = height - this.height;
    let onObs = obstaclesInitialized && obstacleTracker ? this.isOnObstacle(obstacleTracker) : false;

    if (this.y >= groundLevel - this.groundTolerance && !onObs) {
      this.y = groundLevel;
      this.velocityY = 0;
      this.isOnGround = true;
      this.isTakingDamage = false; // Reset damage flag when landing
    } else if (onObs) {
      this.isOnGround = true; // Make sure we're marked as on ground when on obstacle
      this.isTakingDamage = false; // Reset damage flag when landing on obstacle
    } else {
      this.isOnGround = false;
    }

    // Handle shooting animation
    if (this.isShooting) {
      this.shootFrameTimer--;
      if (this.shootFrameTimer <= 0) {
        this.isShooting = false;
      }
    }
  }

  /**
   * Displays the chef sprite animation.
   */
  draw() {
    let img;
    // 1. DUCK > JUMP > FALL take priority over shooting
    if (playerHitbox.isDucking) {
      img = this.sprites.duck;
    }

    // 2. Jump/Fall
    else if (!this.isOnGround) {
      img = this.velocityY < 0 ? this.sprites.jump : this.sprites.fall;
    }

    // 3. SHOOTING ANIMATION
    else if (this.isShooting) {
      // Use shooting sprites when shooting
      if (this.isMovingLeft || this.isMovingRight) {
        // Walking while shooting - cycle through walk-shoot frames
        const frameIndex = floor(frameCount / 6) % this.sprites.shoot.length;
        img = this.sprites.shoot[frameIndex];
      } else {
        // Standing while shooting - use the middle frame (index 1)
        img = this.sprites.shoot[1];
      }
    }

    // 5. Normal walking
    else if (this.isMovingLeft || this.isMovingRight) {
      const frameIndex = floor(frameCount / 6) % this.sprites.walk.length;
      img = this.sprites.walk[frameIndex];
    }

    // 6. Normal idle
    else {
      img = this.sprites.stand;
    }

    push();
    translate(this.x, this.y);
    if (this.facingDirection === 'left') scale(-1,1);
    imageMode(CORNER);
    image(img, this.facingDirection === 'left' ? -this.width : 0, 0, this.width, this.height);
    pop();
  }

  moveLeft(isPressed) {
    this.isMovingLeft = isPressed;
  }

  moveRight(isPressed) {
    this.isMovingRight = isPressed;
  }

  currentX(){
    return this.x;
  }

  currentY(){
    return this.y;
  }

  /**
   * Changes the velocityY of the chef negatively to jump up.
   */
  jump() {
    if (this.isOnGround && !this.isTakingDamage) {
      this.velocityY = -this.jumpStrength;
      this.isOnGround = false;
    }
  }

  /**
   * Ensures that a jump is cancelled if damage is taken.
   * @returns: early exit if shield is active
   */
  takeDamage() {

    if (this.shieldActive) {
      return; // Exit early, no damage taken
    }

    this.isTakingDamage = true;
    
    // If player is moving jumping, cancel the jump
    if (this.velocityY < 0) {
      this.velocityY = 0; // Stop upward movement and start falling immediately
    }
    
    // Add a small downward force to ensure falling
    this.velocityY += 2;
  }

  /**
   * Updates the player's y coordinate when ducking.
   */
  duck() {
    if (this.isOnGround && !this.isDucking) {
      this.isDucking = true;
      if (!this.originalHeight) {
        this.originalHeight = this.height;
      }
      const duckHeight = 74;
      const heightDifference = this.height - duckHeight;
      this.y += heightDifference; // move chef down to stay on the ground
      this.height = duckHeight;
    }
  }
  
  /**
   * Moves the player's y coordinate when ducking is done.
   */
  cancelDuck() {
    if (this.isDucking) {
      this.isDucking = false;
      if (this.originalHeight) {
        const heightDifference = this.originalHeight - this.height;
        this.y -= heightDifference; // move back up
        this.height = this.originalHeight;
      } else {
        // Fallback if originalHeight wasn't set
        this.height = 150; // Default height
        this.y = height - this.height; // Reset to ground level
      }
    }
  }

  /**
   * Activates the shield and starts the shield timer.
   */
  activateShield() {
    this.shieldActive = true;
    this.shieldTimer = millis() + this.shieldDuration;
  }

  /**
   * Updates the shield's timer and deactives it if necessary.
   */
  updateShield() {
    if (this.shieldActive && millis() > this.shieldTimer) {
      this.shieldActive = false; // turn off when expired
    }
  }

  /**
  * Begins the shooting animation.
  */
  startShooting() {
    this.isShooting = true;
    this.shootFrameTimer = this.shootFrameDuration;
  }

  /**
   * Gets the shoot info of a bullet.
   * @returns: {number} centerX, {number} centerY, {String} facingDirection, {number} speed}
   */
  getShootInfo() {
    let shootY = playerHitbox.getCenterY(); // Get the hitbox's true center Y
    
    // Determine X based on facing direction and hitbox
    let shootX;
    if (this.facingDirection === 'right') {
      shootX = playerHitbox.x + playerHitbox.hitWidth; // Right edge of hitbox
    } else {
      shootX = playerHitbox.x; // Left edge of hitbox
    }
    return {
      x: shootX,
      y: shootY,
      direction: this.facingDirection,
      speed: this.facingDirection === 'right' ? 10 : -10
    };
  }

  /**
   * Handles the obstacle player collision.
   * NEEDS TO BE FIXED
   * @param {number} oldX: player X when update(currentLayout) was called
   * @param {number} oldY: playerY when update(currentLayout) was called
   * @param {[ObstacleCreator]} obstacleTracker: currentLayout.getObstacles()
   * @returns: exit early if obstacleTracker does not exist or is empty
   */
  handleObstacleCollision(oldX, oldY, obstacleTracker, ) {
  if (!obstacleTracker) return;

  const obstacles = obstacleTracker.getObstacles();
  
  const hitboxWidth = this.width * 0.6;
  const hitboxOffset = (this.width - hitboxWidth) / 2;
  const hitboxX = this.x + hitboxOffset;
  const hitboxY = this.y + 18;
  const hitboxHeight = this.height - 18;
  
  const oldHitboxX = oldX + hitboxOffset;
  const oldHitboxY = oldY + 18;
  
  for (let obstacle of obstacles) {
    let obsX = obstacle.topLeft[0];
    let obsY = obstacle.topLeft[1];
    let obsW = obstacle.width;
    let obsH = obstacle.height;
    
    // Check if hitbox is colliding with this obstacle
    if (hitboxX < obsX + obsW &&
        hitboxX + hitboxWidth > obsX &&
        hitboxY < obsY + obsH &&
        hitboxY + hitboxHeight > obsY) {
      
      
      // Check if landing on top of obstacle (falling onto it)
      if (oldHitboxY + hitboxHeight <= obsY + this.groundTolerance && this.velocityY > 0) {
        this.y = obsY - this.height;
        this.velocityY = 0;
        this.isOnGround = true;
        this.isTakingDamage = false;
      }
      // Check if hitting bottom of obstacle (jumping into it)
      else if (oldHitboxY >= obsY + obsH && this.velocityY < 0) {
        this.y = obsY + obsH - 18;
        this.velocityY = 0;
      }
      // Check horizontal collisions (left/right)
      else if (oldHitboxX + hitboxWidth <= obsX) { // Coming from left
        this.x = obsX - hitboxWidth - hitboxOffset;
        this.velocityX = 0;

      }
      else if (oldHitboxX >= obsX + obsW) { // Coming from right
        this.x = obsX + obsW - hitboxOffset;
        this.velocityX = 0;

      }
    }
  }
}


  /**
   * 
   * @param {[ObstacleCreator]} obstacleTracker: currentLayout.getObstacles()
   * @returns true if any obstacles in obstacleTracker collide with player, else return false
   */
  isOnObstacle(obstacleTracker) {
    if (!obstacleTracker) return false;
    
    const obstacles = obstacleTracker.getObstacles();
    for (let obstacle of obstacles) {
      let obsX = obstacle.topLeft[0];
      let obsY = obstacle.topLeft[1];
      let obsW = obstacle.width;
      let obsH = obstacle.height;
      
      // Check if player is standing on this obstacle
      let playerBottom = this.y + this.height;
      let obstacleTop = obsY;
      
      // Check if player's bottom is very close to obstacle's top
      // and player is moving downward or stationary
      // and player is horizontally aligned with the obstacle
      if (playerBottom >= obstacleTop - this.groundTolerance && 
          playerBottom <= obstacleTop + this.groundTolerance &&
          this.velocityY >= 0 &&
          this.x + this.width > obsX &&
          this.x < obsX + obsW) {
        return true;
      }
    }
    return false;
  }
}