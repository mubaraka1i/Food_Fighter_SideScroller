class SodaMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 32;
    this.speed = 2.2;
    this.health = 3;
    this.color = '#4DA6FF'; // Bright soda blue
  }

  update(playerX, playerY) {
    let angle = atan2(playerY - this.y, playerX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  draw() {
    // Base soda body
    fill(this.color);
    ellipse(this.x, this.y, this.size);

    // Fizzy bubbles around it
    stroke(255);
    fill(255, 255, 255, 130);
    for (let i = 0; i < 5; i++) {
      let bx = this.x + random(-12, 12);
      let by = this.y + random(-12, 12);
      ellipse(bx, by, random(3, 6));
    }
    noStroke();
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2
    };
  }

  takeDamage(dmg) {
    this.health -= dmg;
  }
}