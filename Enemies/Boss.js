class Boss {
  constructor(x, y) {
    this.startX = x + 300; 
    this.targetX = x; 
    this.x = this.startX;
    this.y = y - 150;
    this.health = 25;
    this.width = 100;
    this.height = 150;
    this.projectiles = [];
    this.shootCooldown = 0;
    this.shootInterval = 60;
    this.slideSpeed = 8;
    this.slidingIn = true;
  }

  update(playerX, playerY) {
    // Handle slide-in animation
    if (this.slidingIn) {
      this.x -= this.slideSpeed;
      
      // Stop sliding when reaching target position
      if (this.x <= this.targetX) {
        this.x = this.targetX;
        this.slidingIn = false;
      }
    } else {
      // Only update projectiles and shoot when done sliding
      // Update existing projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        this.projectiles[i].update();
        
        // Remove projectiles that go off screen
        if (this.projectiles[i].x < 0 || this.projectiles[i].x > width || 
            this.projectiles[i].y < 0 || this.projectiles[i].y > height) {
          this.projectiles.splice(i, 1);
        }
      }
      
      // Handle shooting cooldown
      if (this.shootCooldown > 0) {
        this.shootCooldown--;
      } else {
        this.shootAtPlayer(playerX, playerY);
        this.shootCooldown = this.shootInterval;
      }
    }
  }

  shootAtPlayer(playerX, playerY) {
    // Calculate direction towards player (in world coordinates)
    let dx = playerX - (this.x + this.width / 2);
    let dy = playerY - (this.y + this.height / 2);
    
    // Normalize the direction vector
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx /= distance;
      dy /= distance;
    }
    
    // Create projectile from boss position
    this.projectiles.push(new BossProjectile(
      this.x + this.width / 2,
      this.y + this.height / 2,
      dx,
      dy
    ));
  }

  draw() {
    // Draw boss body (red rectangle)
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
    
    // Draw boss details (white chef hat)
    fill(255);
    rect(this.x + 20, this.y - 30, this.width - 40, 30);
    
    // Draw boss face (white eyes)
    fill(255);
    ellipse(this.x + 30, this.y + 50, 20, 20);
    ellipse(this.x + 70, this.y + 50, 20, 20);
    
    // Draw pupils
    fill(0);
    ellipse(this.x + 30, this.y + 50, 10, 10);
    ellipse(this.x + 70, this.y + 50, 10, 10);
    
    // Only draw health bar and projectiles when not sliding in
    if (!this.slidingIn) {
      // Draw health bar background (white)
      fill(255);
      rect(this.x, this.y - 50, this.width, 10);
      
      // Draw health bar (green)
      fill(0, 255, 0);
      rect(this.x, this.y - 50, this.width * (this.health / 25), 10);
      
      // Draw projectiles
      for (let projectile of this.projectiles) {
        projectile.draw();
      }
    }
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height
    };
  }

  getProjectiles() {
    return this.projectiles;
  }

  takeDamage(damage) {
    // Only take damage when not sliding in
    if (!this.slidingIn) {
      this.health -= damage;
    }
  }

  getHealth() {
    return this.health;
  }

  isSlidingIn() {
    return this.slidingIn;
  }
}