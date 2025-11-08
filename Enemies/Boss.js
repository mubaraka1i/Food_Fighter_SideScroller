class Boss {
  constructor(x, y) {
    this.width = 100;
    this.height = 150;
    this.startX = x + 300; 
    this.targetX = x; 
    this.x = this.startX;
    this.y = height - this.height; 
    
    this.health = 10;
    this.projectiles = [];
    this.shootCooldown = 0;
    this.shootInterval = 90; 
    this.slideSpeed = 8;
    this.slidingIn = true;
  }

  update(playerHitboxX, playerHitboxY) {
    if (this.slidingIn) {
      this.x -= this.slideSpeed;
      if (this.x <= this.targetX) {
        this.x = this.targetX;
        this.slidingIn = false;
      }
    } else {
      // Update existing projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        this.projectiles[i].update();
        
        // Remove projectiles that go off screen (world coordinates)
        if (this.projectiles[i].x < -100 || this.projectiles[i].x > levelWidth + 100 || 
            this.projectiles[i].y < -100 || this.projectiles[i].y > height + 100) {
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
    }
  }

  shootAtPlayer(playerHitboxX, playerHitboxY) {
    // Calculate direction from boss to player
    let bossCenterX = this.x + this.width / 2;
    let bossCenterY = this.y + this.height / 2;
    
    let dx = playerHitboxX - bossCenterX;
    let dy = playerHitboxY - bossCenterY;
    
    // direction
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx /= distance;
      dy /= distance;
    }
    
    // Create projectile
    this.projectiles.push(new BossProjectile(
      bossCenterX,
      bossCenterY,
      dx,
      dy
    ));
  }

  draw() {
    // Draw boss body
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
    
    // Draw boss details
    fill(255);
    rect(this.x + 20, this.y - 30, this.width - 40, 30); // Chef hat
    
    fill(255);
    ellipse(this.x + 30, this.y + 50, 20, 20); // Eyes
    ellipse(this.x + 70, this.y + 50, 20, 20);
    
    fill(0);
    ellipse(this.x + 30, this.y + 50, 10, 10); // Pupils
    ellipse(this.x + 70, this.y + 50, 10, 10);
    
    if (!this.slidingIn) {
      // Health bar
      fill(255);
      rect(this.x, this.y - 50, this.width, 10);
      fill(0, 255, 0);
      rect(this.x, this.y - 50, this.width * (this.health / 10), 10);
      
      // Projectiles
      for (let projectile of this.projectiles) {
        projectile.draw();
        projectile.drawHitbox();
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