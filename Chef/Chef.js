class Chef {
  /**
   * Constructs the player object for use throughout the entire game.
   *
   * @param {number} startX the starting x coordinate of the player's top left corner
   * @param {number} startY unknown
   * @param {Object} sprites Image object, sprites to use for the player drawing
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
      this.duck(); // <--- ADD THIS: Tell the Chef to duck
      playerHitbox.duck(); // Keep this for the visual green box
    } else {
      this.cancelDuck(); // <--- ADD THIS: Tell the Chef to stand up
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
   * @param {Object} currentLayout: LevelLayout object, the layout of the current level
   */
  update(currentLayout) {
    // Update shield timer first
    this.updateShield();

    let obstacleTracker = (currentLayout && currentLayout.getObstacles()) ? currentLayout.getObstacles() : null;

    // --- STEP 1: HANDLE X AXIS MOVEMENT ---
    if (this.isMovingLeft) {
      this.facingDirection = 'left';
      this.x -= this.speed;
    }
    if (this.isMovingRight) {
      this.facingDirection = 'right';
      this.x += this.speed;
    }

    // Check X Collision immediately after moving X
    if (obstaclesInitialized && obstacleTracker) {
      this.handleObstacleCollision(obstacleTracker);
    }

    // --- STEP 2: HANDLE Y AXIS MOVEMENT ---
    
    // Apply gravity only if not on ground
    if (!this.isOnGround) {
      this.velocityY += 1; // Simple gravity
    }
    
    // Update vertical position
    this.y += this.velocityY;

    // Check Y Collision immediately after moving Y
    if (obstaclesInitialized && obstacleTracker) {
      this.handleObstacleCollision(obstacleTracker);
    }

    // --- STEP 3: GROUND DETECTION ---
    
    // Update ground detection after collision handling
    let groundLevel = height - this.height;
    // We pass obstacleTracker here to check if we are standing on one
    let onObs = obstaclesInitialized && obstacleTracker ? this.isOnObstacle(obstacleTracker) : false;

    if (this.y >= groundLevel - this.groundTolerance && !onObs) {
      this.y = groundLevel;
      this.velocityY = 0;
      this.isOnGround = true;
      this.isTakingDamage = false;
    } else if (onObs) {
      this.isOnGround = true;
      this.isTakingDamage = false;
    } else {
      this.isOnGround = false;
    }

    // Prevent chef from going past level boundaries
    if (this.x + this.width > levelWidth) {
      this.x = levelWidth - this.width;
    }
    if (this.x < 0) {
      this.x = 0;
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

  /**
   * Sets isMovingLeft to isPressed
   * @param {boolean} isPressed true if should be moving left, false if not
   */
  moveLeft(isPressed) {
    this.isMovingLeft = isPressed;
  }

  /**
   * Sets isMovingRight to isPressed
   * @param {boolean} isPressed true if should be moving right, false if not
   */
  moveRight(isPressed) {
    this.isMovingRight = isPressed;
  }

  /**
   * @returns {number} player x position
   */
  currentX(){
    return this.x;
  }

  /**
   * @returns {number} player y position
   */
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
   * 
   * @returns {undefined} early exit if shield is active
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
  startShooting(ammo) {
    if (ammo >= 1) {
      this.isShooting = true;
      this.shootFrameTimer = this.shootFrameDuration;
    }
  }

  /**
   * Gets the shoot info of a bullet with mouse aiming or direction-based fallback.
   * 
   * @returns {Object} {x, y, speedX, speedY, direction}
   */
  getShootInfo() {
    let shootY = playerHitbox.getCenterY();
    
    // Determine X based on facing direction and hitbox
    let shootX;
    if (this.facingDirection === 'right') {
      shootX = playerHitbox.x + playerHitbox.hitWidth; // Right edge of hitbox
    } else {
      shootX = playerHitbox.x; // Left edge of hitbox
    }

    // Calculate mouse position relative to the player (accounting for camera)
    const mouseWorldX = mouseX + cameraX;
    const mouseWorldY = mouseY;

    // Calculate direction vector from player to mouse
    let dirX = mouseWorldX - shootX;
    let dirY = mouseWorldY - shootY;

    // Check if mouse is on the opposite side of where player is facing
    const isMouseOppositeDirection = 
      (this.facingDirection === 'right' && mouseWorldX < shootX) ||
      (this.facingDirection === 'left' && mouseWorldX > shootX);

    // If mouse is on opposite side or very close to player, shoot straight
    if (isMouseOppositeDirection || (abs(dirX) < 50 && abs(dirY) < 50)) {
      // Shoot straight in the direction the player is facing
      dirX = this.facingDirection === 'right' ? 1 : -1;
      dirY = 0;
    }

    // Normalize the direction vector and set speed
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    const speed = 10;
    
    let speedX, speedY;
    if (length > 0) {
      speedX = (dirX / length) * speed;
      speedY = (dirY / length) * speed;
    } else {
      // Fallback: shoot straight right
      speedX = speed;
      speedY = 0;
    }

    return {
      x: shootX,
      y: shootY,
      speedX: speedX,
      speedY: speedY,
      direction: this.facingDirection
    };
  }

  /**
   * Handles the obstacle player collision.
   * Uses a "forgiving" hitbox calculation for ducking to allow passing under tight gaps.
   * @param {Array} obstacleTracker list of ObstacleCreator objects
   */
  handleObstacleCollision(obstacleTracker) {
    if (!obstacleTracker) return;

    const obstacles = obstacleTracker.getObstacles();

    const hitWidth = this.width * 0.6;
    let hitHeight, hitY;

    if (this.isDucking) {
      hitHeight = 35; 
      
      // Align the small hitbox to the FEET of the player
      // Formula: (Top of Sprite + Sprite Height) - Hitbox Height
      hitY = (this.y + this.height) - hitHeight;
    } else {
      // Standard standing hitbox
      hitHeight = this.height - 18;
      hitY = this.y + 18;
    }
    
    const hitX = this.x + (this.width - hitWidth) / 2;

    for (let obstacle of obstacles) {
      let obsX = obstacle.topLeft[0];
      let obsY = obstacle.topLeft[1];
      let obsW = obstacle.width;
      let obsH = obstacle.height;

      // Check if current hitbox is colliding with this obstacle
      if (hitX < obsX + obsW &&
          hitX + hitWidth > obsX &&
          hitY < obsY + obsH &&
          hitY + hitHeight > obsY) {

        // Calculate overlap in all directions
        const overlapLeft = (hitX + hitWidth) - obsX;
        const overlapRight = (obsX + obsW) - hitX;
        const overlapTop = (hitY + hitHeight) - obsY;
        const overlapBottom = (obsY + obsH) - hitY;

        // Find the smallest overlap to determine push direction
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop && this.velocityY >= 0) {
          // Landing on top: Place player so their FEET are on top of the obstacle
          this.y = obsY - this.height;
          this.velocityY = 0;
          this.isOnGround = true;
          this.isTakingDamage = false;
        } 
        else if (minOverlap === overlapBottom && this.velocityY < 0) {
          // Hitting head on bottom of obstacle
          // Push player down based on where the hitbox hit
          const offset = hitY - this.y; // distance from sprite top to hitbox top
          this.y = obsY + obsH - offset;
          this.velocityY = 0;
        } 
        else if (minOverlap === overlapLeft) {
          this.x = obsX - hitWidth - (this.width - hitWidth) / 2;
        } 
        else if (minOverlap === overlapRight) {
          this.x = obsX + obsW - (this.width - hitWidth) / 2;
        }
      }
    }
  }

  /**
   * Checks if any obstacles in the level collide with the player.
   * 
   * @param {Array} obstacleTracker list of ObstacleCreator objects, currentLayout.getObstacles()
   * @returns {boolean} true if any obstacles in obstacleTracker collide with player, else return false
   */
  isOnObstacle(obstacleTracker) {
    if (!obstacleTracker) return false;
    
    const obstacles = obstacleTracker.getObstacles();
    for (let obstacle of obstacles) {
      let obsX = obstacle.topLeft[0];
      let obsY = obstacle.topLeft[1];
      let obsW = obstacle.width;
      let obsH = obstacle.height;
      
      // Use hitbox for collision detection
      const hitboxBottom = playerHitbox.y + playerHitbox.hitHeight;
      const obstacleTop = obsY;
      
      // Check if player's hitbox bottom is very close to obstacle's top
      // and player is moving downward or stationary
      // and player is horizontally aligned with the obstacle
      if (hitboxBottom >= obstacleTop - this.groundTolerance && 
          hitboxBottom <= obstacleTop + this.groundTolerance &&
          this.velocityY >= 0 &&
          playerHitbox.x + playerHitbox.hitWidth > obsX &&
          playerHitbox.x < obsX + obsW) {
        return true;
      }
    }
    return false;
  }

  /**
   * Resets the chef to default standing state
   */
  reset() {
    this.isDucking = false;
    this.height = 150; // Reset to default height
    this.originalHeight = null; // Clear the stored original height
    this.isTakingDamage = false;
    this.isOnGround = false;
    this.velocityY = 0;
    this.isShooting = false;
    this.shieldActive = false;
    this.damageBoostActive = false;
    this.damageMultiplier = 1;
  }
}