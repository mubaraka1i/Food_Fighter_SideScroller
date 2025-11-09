class CookieCrumbMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.speed = 2;
    this.health = 2;
    this.color = '#A0522D'; // Sienna brown
  }

  update(playerX, playerY) {
    // Move toward player
    let angle = atan2(playerY - this.y, playerX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    
    // Draw crumb texture
    fill(139, 69, 19); // Darker brown
    for (let i = 0; i < 3; i++) {
      let dotX = this.x + random(-8, 8);
      let dotY = this.y + random(-8, 8);
      ellipse(dotX, dotY, 4, 4);
    }
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2
    };
  }

  takeDamage(damage) {
    this.health -= damage;
  }
}