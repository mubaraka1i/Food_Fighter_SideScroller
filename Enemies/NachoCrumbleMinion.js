class NachoCrumbleMinion {
  /**
   * Creates an object of the minion class for the cheese boss in level three.
   * 
   * @param {number} x center x coordinate of the minion
   * @param {number} y center y coordinate of the minion
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40; 
    this.height = 25;
    this.size = 40;
    this.speed = 1.5;
    this.health = 3;
    this.color = '#FFD700'; // Golden yellow
    this.jumpCooldown = 0;
    this.isJumping = false;
    this.jumpPower = 0;
    this.gravity = 0.5;

    this.sprites = nachoCrumbSprites; // array of images
    this.frameIndex = 0;
    this.frameSpeed = 0.15; // how fast the animation cycles
    this.facingRight = false; // default facing left
  }

  /**
   * @returns {Set} minion hitbox coordinates numbers {x, y, w, h}
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
   * Reduces the minion's health points by a set amount.
   * 
   * @param {number} damage amount to reduce health by
   */
  takeDamage(damage) {
    this.health -= damage;
  }

  /**
   * Moves the minion towards the player's location.
   * 
   * @param {number} playerX x coordinate to move towards
   * @param {number} playerY y coordinate to move towards
   */
  update(playerX, playerY) {
    // Move toward player horizontally
    if (this.x < playerX) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
    
    // Handle jumping with proper physics
    if (this.jumpCooldown <= 0 && random() < 0.01 && !this.isJumping) {
      this.isJumping = true;
      this.jumpPower = -12; // Jump force
      this.jumpCooldown = 120; // 2 second cooldown
    }
    
    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }
    
    // Apply jumping physics
    if (this.isJumping) {
      this.y += this.jumpPower;
      this.jumpPower += this.gravity;
      
      // Land on ground
      if (this.y >= height - this.height) {
        this.y = height - this.height;
        this.isJumping = false;
        this.jumpPower = 0;
      }
    } else {
      // Stay on ground when not jumping
      this.y = height - this.height;
    }

    let dx = playerX - this.x;
    let dy = playerY - this.y;
    
    // Update facing direction: left if dx < 0, right if dx >= 0
    this.facingRight = dx >= 0;
    
    // Update animation
    this.frameIndex += this.frameSpeed;
    if (this.frameIndex >= this.sprites.length) {
      this.frameIndex = 0;
    }
  }

  /**
   * Draws the minion to the screen.
   */
  draw() {
    let frame = floor(this.frameIndex);
    push();
    translate(this.x, this.y);

    // Flip horizontally if facing right (default left)
    if (this.facingRight) scale(-1, 1);

    imageMode(CENTER);
    image(this.sprites[frame], this.size/2, this.size/2, this.size, this.size);
    pop();
  }
}