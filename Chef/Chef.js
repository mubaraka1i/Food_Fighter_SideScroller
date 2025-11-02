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
  }

  update() {
    if (this.isMovingLeft) {
      this.facingDirection = 'left';
      this.x -= this.speed;
    }
    if (this.isMovingRight) {
      this.facingDirection = 'right';
      this.x += this.speed;
    }

    // Simple gravity - just move downward
    this.velocityY += 1; // Gravity pulls down 

    // Update vertical position
    this.y += this.velocityY;

    // Ground collision 
    let groundLevel = height - this.height;
    if (this.y > groundLevel) {
      this.y = groundLevel;
      this.velocityY = 0;
      this.isOnGround = true;
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
}