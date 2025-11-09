class NachosBoss extends Boss {
  constructor(x, y) {
    super(x, y, 'nachos');
    this.health = 15;
    this.maxHealth = 15;
    this.width = 140;
    this.height = 100;
    this.shootInterval = 100;
    this.minionSpawnInterval = 200;
    this.maxMinions = 4;
    
    this.nachoColor = '#FFD700';
    this.cheeseColor = '#FFA500';
  }

  shootAtPlayer(playerX, playerY) {
    let bossCenterX = this.x + this.width / 2;
    let bossCenterY = this.y + this.height / 2;
    
    let dx = playerX - bossCenterX;
    let dy = playerY - bossCenterY;
    
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      dx = dx / distance * 0.1;
      dy = dy / distance * 0.1;
    }
    
    this.projectiles.push(new CheeseProjectile(
      bossCenterX,
      bossCenterY,
      dx,
      dy
    ));
  }

  spawnMinions() {
    if (enemiesArray.length < this.maxMinions) {
      let spawnX = this.x + random(-100, 100);
      let spawnY = this.y + this.height;
      enemiesArray.push(new NachoCrumbleMinion(spawnX, spawnY));
    }
  }

  draw() {
    // Draw nacho pile base
    fill(this.nachoColor);
    beginShape();
    vertex(this.x, this.y + this.height);
    vertex(this.x + this.width, this.y + this.height);
    vertex(this.x + this.width - 20, this.y);
    vertex(this.x + 20, this.y);
    endShape(CLOSE);
    
    // Draw cheese dripping
    fill(this.cheeseColor);
    for (let i = 0; i < 5; i++) {
      let dripX = this.x + 20 + i * 25;
      beginShape();
      vertex(dripX, this.y);
      vertex(dripX + 10, this.y);
      vertex(dripX + 5, this.y + 30);
      endShape(CLOSE);
    }
    
    // Draw eyes
    fill(0);
    ellipse(this.x + 40, this.y + 30, 12, 15);
    ellipse(this.x + 100, this.y + 30, 12, 15);
    
    // Draw menacing mouth
    fill(139, 0, 0);
    arc(this.x + 70, this.y + 50, 40, 30, 0, PI);
    
    if (!this.slidingIn) {
      this.drawHealthBar();
      
      for (let projectile of this.projectiles) {
        projectile.draw();
      }
    }
  }
}