class Chef {
  constructor(startX, startY, sprites) {
    this.x = startX;
    this.y = startY; 
    this.width = 150;
    this.height = 150;
    this.speed = 5;
    this.velocityY = 0;
    this.jumpStrength = 16;
    this.isOnGround = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.facingDirection = 'right';
    this.groundTolerance = 5; // tolerance for ground detection
    this.isDucking = false;
    this.sprites = sprites;
    this.jumpPressed = false;
    this.isTakingDamage = false;
    this.shieldActive = false;
    this.damageBoostActive = false;
    this.damageMultiplier = 2;
    this.shieldTimer = 0;
    this.shieldDuration = 5000;
    // To prevent retriggering
    keys['w'] = false;
    keys['arrowup'] = false;
  }

  // NEW: Calling this in draw() every frame to avoid key conflicts
  // DOESNT FIX IT YET ;-;
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

  update(currentLayout) {
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
  }

  draw() { // Display chef sprite animation
    let img;
    if (playerHitbox.isDucking) img = this.sprites.duck;
    else if (!this.isOnGround) img = this.velocityY < 0 ? this.sprites.jump : this.sprites.fall;
    else if (this.isMovingLeft || this.isMovingRight) {
      const frameIndex = floor(frameCount / 6) % this.sprites.walk.length;
      img = this.sprites.walk[frameIndex];
    } else img = this.sprites.stand;

    push();
    translate(this.x, this.y);
    if (this.facingDirection === 'left') scale(-1,1);
    imageMode(CORNER);
    image(img, this.facingDirection === 'left' ? -this.width : 0, 0, this.width, this.height);
    pop();
  }

  jump() {
    if (this.isOnGround && !this.isTakingDamage) {
      this.velocityY = -this.jumpStrength; // Negative Y to jump up
      this.isOnGround = false;
    }
  }

  // Cancel jump when taking damage
  takeDamage() {
    this.isTakingDamage = true;
    
    // If player is moving jumping, cancel the jump
    if (this.velocityY < 0) {
      this.velocityY = 0; // Stop upward movement and start falling immediately
    }
    
    // Add a small downward force to ensure falling
    this.velocityY += 2;
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

  activateShield() {
    this.shieldActive = true;
    this.shieldTimer = millis() + this.shieldDuration;
  }

  updateShield() {
    if (this.shieldActive && millis() > this.shieldTimer) {
      this.shieldActive = false; // turn off when expired
    }
  }

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

  //chef obstacle interaction

  handleObstacleCollision(oldX, oldY, obstacleTracker) {
    if (!obstacleTracker) return;

    const obstacles = obstacleTracker.getObstacles();
    
    for (let obstacle of obstacles) {
      let obsX = obstacle.topLeft[0];
      let obsY = obstacle.topLeft[1];
      let obsW = obstacle.width;
      let obsH = obstacle.height;
      
      // Check if player is colliding with this obstacle
      if (this.x < obsX + obsW &&
          this.x + this.width > obsX &&
          this.y < obsY + obsH &&
          this.y + this.height > obsY) {
        
        
        // Check if landing on top of obstacle (falling onto it)
        if (oldY + this.height <= obsY + this.groundTolerance && this.velocityY > 0) {
          this.y = obsY - this.height;
          this.velocityY = 0;
          this.isOnGround = true;
          this.isTakingDamage = false;
        }
        // Check if hitting bottom of obstacle (jumping into it)
        else if (oldY >= obsY + obsH && this.velocityY < 0) {
          this.y = obsY + obsH;
          this.velocityY = 0;
        }
        // Check horizontal collisions (left/right)
        else if (oldX + this.width <= obsX) { // Coming from left
          this.x = obsX - this.width;
        }
        else if (oldX >= obsX + obsW) { // Coming from right
          this.x = obsX + obsW;
        }
      }
    }
  }

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