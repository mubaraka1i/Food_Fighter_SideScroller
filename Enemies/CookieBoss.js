class CookieBoss extends Boss {
  constructor(x, y) {
    super(x, y, 'cookie', cookieBoss.idle);
    this.health = 12;
    this.maxHealth = 12;
    this.width = 120;
    this.height = 120;
    this.shootInterval = 120;
    this.minionSpawnInterval = 180;
    this.maxMinions = 3;
    
    // Cookie boss specific
    this.cookieColor = '#D2B48C';
    this.chipColor = '#5D4037';
  }

  shootAtPlayer(playerX, playerY) {
    let bossCenterX = this.x + this.width / 2;
    let bossCenterY = this.y + this.height / 2;
    
    // Shoot 3 chocolate chips in a spread pattern
    for (let i = 0; i < 3; i++) {
      let angle = atan2(playerY - bossCenterY, playerX - bossCenterX);
      angle += random(-0.3, 0.3); // Reduced spread for better accuracy
      
      let dx = cos(angle) * 0.1; // Use the same 0.1 multiplier
      let dy = sin(angle) * 0.1;
      
      this.projectiles.push(new ChocolateChipProjectile(
        bossCenterX,
        bossCenterY,
        dx,
        dy
      ));
    }
  }

  spawnMinions() {
    if (enemiesArray.length < this.maxMinions) {
      let spawnX = this.x + random(-50, 50);
      let spawnY = this.y + this.height;
      enemiesArray.push(new CookieCrumbMinion(spawnX, spawnY));
    }
  }

  draw() {
    // Draw cookie body
    fill(this.cookieColor);
    ellipse(this.x + this.width/2, this.y + this.height/2, this.width, this.height);
    
    // Draw chocolate chips
    fill(this.chipColor);
    ellipse(this.x + 30, this.y + 30, 15, 15);
    ellipse(this.x + 90, this.y + 40, 15, 15);
    ellipse(this.x + 50, this.y + 80, 15, 15);
    ellipse(this.x + 80, this.y + 90, 15, 15);
    
    // Draw eyes
    fill(0);
    ellipse(this.x + 40, this.y + 50, 10, 15);
    ellipse(this.x + 80, this.y + 50, 10, 15);
    
    // Draw angry eyebrows
    stroke(0);
    strokeWeight(3);
    line(this.x + 35, this.y + 35, this.x + 45, this.y + 40);
    line(this.x + 75, this.y + 35, this.x + 85, this.y + 40);
    noStroke();
    
    if (!this.slidingIn) {
      this.drawHealthBar();
      
      for (let projectile of this.projectiles) {
        projectile.draw();
        projectile.drawHitbox();
      }
    }
  }
}