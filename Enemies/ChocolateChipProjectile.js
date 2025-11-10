class ChocolateChipProjectile {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 20;
    this.size = 12;
    this.color = '#5D4037';
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
   drawHitbox() {
    push();
    noFill();
    stroke('red');
    strokeWeight(2);
    rectMode(CENTER); 
    rect(this.x, this.y, this.size+1, this.size+1);
    pop();
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      r: this.size / 2
    };
  }
}