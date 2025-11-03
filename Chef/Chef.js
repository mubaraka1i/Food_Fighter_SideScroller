class Chef {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY; 
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.velocityY = 0;
    this.jumpStrength = 16;
    this.isOnGround = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.facingDirection = 'right';
    this.groundTolerance = 5; // tolerance for ground detection
  }

  update() {
    // Store old position for collision response
    let oldX = this.x;
    let oldY = this.y;

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

    // Check collision with obstacles after movement
    this.handleObstacleCollision(oldX, oldY);

    // Improved ground collision with tolerance
    let groundLevel = height - this.height;
    if (this.y >= groundLevel - this.groundTolerance && !this.isOnObstacle()) {
      this.y = groundLevel;
      this.velocityY = 0;
      this.isOnGround = true;
    } else if (this.isOnObstacle()) {
      this.isOnGround = true; // Make sure we're marked as on ground when on obstacle
    } else {
      this.isOnGround = false;
    }
  }

  draw() {
    // Chef body 
    fill(230, 48, 38);
    rect(this.x, this.y, this.width, this.height);

    // Chef eyes
    fill(0);
    if (this.facingDirection === 'right') {
      circle(this.x + this.width - 10, this.y + 15, 8);
    } else {
      circle(this.x + 10, this.y + 15, 8);
    }
  }

  jump() {
    if (this.isOnGround) {
      this.velocityY = -this.jumpStrength; // Negative Y to jump up
      this.isOnGround = false;
    }
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

  getShootInfo() {
    return {
      x: this.facingDirection === 'right' ? this.x + this.width : this.x,
      y: this.y + this.height / 2,
      direction: this.facingDirection,
      speed: this.facingDirection === 'right' ? 10 : -10
    };
  }

  //chef obstacle interaction

  handleObstacleCollision(oldX, oldY) {
    if (!layout1 || !layout1.getObstacles()) return;
    
    const obstacles = layout1.getObstacles().getObstacles();
    this.isOnGround = false; // Reset ground state
    
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

  isOnObstacle() {
    if (!layout1 || !layout1.getObstacles()) return false;
    
    const obstacles = layout1.getObstacles().getObstacles();
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