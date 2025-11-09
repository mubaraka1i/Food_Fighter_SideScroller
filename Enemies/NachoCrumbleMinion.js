class NachoCrumbleMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40; 
    this.height = 25; 
    this.speed = 1.5;
    this.health = 3;
    this.color = '#FFD700'; // Golden yellow
    this.jumpCooldown = 0;
    this.isJumping = false;
    this.jumpPower = 0;
    this.gravity = 0.5;
  }

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
  }

  draw() {
    fill(this.color);
    // Draw triangle nacho shape
    triangle(
      this.x, this.y + this.height,
      this.x + this.width, this.y + this.height,
      this.x + this.width / 2, this.y
    );
    
    // Draw cheese spots
    fill('#FFA500');
    ellipse(this.x + this.width/2, this.y + this.height/2, 10, 10);
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height
    };
  }

  takeDamage(damage) {
    this.health -= damage;
  }
}