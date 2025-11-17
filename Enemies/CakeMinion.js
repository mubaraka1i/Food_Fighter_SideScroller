class CakeMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40; // Fixed: Added size property for drawing
    this.speed = 1.8;
    this.health = 4;
    this.color = '#FFCC99'; // Cake color
  }

  update(playerX, playerY) {
    let angle = atan2(playerY - this.y, playerX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  draw() {
    push();

    // CUPCAKE BASE (wrapper)
    fill('#D29B6E'); 
    rectMode(CENTER);
    rect(this.x, this.y + 8, this.size * 0.9, this.size * 0.6, 4);

    // Wrapper
    stroke(120, 80, 50);
    strokeWeight(1);
    for (let i = -3; i <= 3; i++) {
      let rx = this.x + i * (this.size * 0.12);
      line(rx, this.y + 5, rx, this.y + 12);
    }
    noStroke();

    // FROSTING 
    fill('#fecbe4ff'); 
    ellipse(this.x, this.y - 5, this.size * 0.9, this.size * 0.65);
    ellipse(this.x, this.y - 12, this.size * 0.7, this.size * 0.5);
    ellipse(this.x, this.y - 18, this.size * 0.4, this.size * 0.35);

    // SPRINKLES 
    fill('#FF66B2'); ellipse(this.x + random(-8, 8), this.y - 10, 3, 3);
    fill('#66CC66'); ellipse(this.x + random(-8, 8), this.y - 5, 3, 3);
    fill('#FFDB4D'); ellipse(this.x + random(-8, 8), this.y - 14, 3, 3);

    pop();
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size * 0.45 // Approximate circular hitbox
    };
  }

  takeDamage(dmg) {
    this.health -= dmg;
  }
}