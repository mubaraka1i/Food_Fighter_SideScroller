class OriginalBoss extends Boss {
  constructor(x, y) {
    super(x, y, 'original');
    this.health = 10;
    this.maxHealth = 10;
    // Uses default values from base Boss class
  }

  // Override the draw method to match the original boss appearance
  draw() {
    // Draw boss body (exactly like the original)
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
    
    // Draw boss details (exactly like the original)
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
      rect(this.x, this.y - 50, this.width * (this.health / this.maxHealth), 10);
      
      // Projectiles 
      for (let projectile of this.projectiles) {
        projectile.draw();
      }
    }
  }
}