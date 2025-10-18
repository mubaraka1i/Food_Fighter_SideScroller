class Chef {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.width = 50;
    this.height = 50;
    this.speed = 5;
    this.velocityY = 0;
    this.jumpStrength = 16; // Upward force
    this.isOnGround = true;

    // Internal state for movement
    this.isMovingLeft = false;
    this.isMovingRight = false;
  }

  // This method handles all the physics and logic updates
  update() {
    if (this.isMovingLeft) {
      this.facingDirection = 'left';
    }
    if (this.isMovingRight) {
      this.facingDirection = 'right';
    }

    if (this.isMovingLeft) {
      this.x -= this.speed;
    }
    if (this.isMovingRight) {
      this.x += this.speed;
    }

    // Gravity
    if (!this.isOnGround) {
      this.velocityY += -0.7; // Gravity pulls down
    }

    // Update vertical position
    this.y += this.velocityY;

    // Ground collision
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
      this.isOnGround = true;
    }

    // Screen boundaries, are temporary until play moves infinitly
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > width) {
      this.x = width - this.width;
    }
  }

  // This method handles just drawing the chef
  draw() {
    //Chef body
    fill(230, 48, 38);
    rect(this.x, height - this.height - this.y, this.width, this.height);

    // Chef eyes
    fill(0);
    if (this.facingDirection === 'right') {
      circle(this.x + this.width - 10, height - this.height - this.y + 15, 8);
    } else {
      circle(this.x + 10, height - this.height - this.y + 15, 8);
    }
  }

  // --- METHODS TO BE CALLED BY SKETCH.JS ---

  // Called from keyPressed()
  jump() {
    if (this.isOnGround) {
      this.velocityY = this.jumpStrength;
      this.isOnGround = false;
    }
  }

  // Called from keyPressed() and keyReleased()
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
      y: height - this.height - this.y + this.height / 2,
      direction: this.facingDirection,
      speed: this.facingDirection === 'right' ? 10 : -10
    };
  }
}