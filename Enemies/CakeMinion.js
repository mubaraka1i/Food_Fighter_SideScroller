class CakeMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40; // Fixed: Added size property for drawing
    this.speed = 1.8;
    this.health = 5;
    this.color = '#FFCC99'; // Cake color

    this.sprites = cakeCrumbSprites; // array of images
    this.frameIndex = 0;
    this.frameSpeed = 0.15; // how fast the animation cycles
    this.facingRight = false; // default facing left
  }

  update(playerX, playerY) {
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    let angle = atan2(playerY - this.y, playerX - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

    // Update facing direction: left if dx < 0, right if dx >= 0
    this.facingRight = dx >= 0;
    
    // Update animation
    this.frameIndex += this.frameSpeed;
    if (this.frameIndex >= this.sprites.length) {
      this.frameIndex = 0;
    }
  }

  draw() {
    let frame = floor(this.frameIndex);
    push();
    translate(this.x, this.y);

    // Flip horizontally if facing right (default left)
    if (this.facingRight) scale(-1, 1);

    imageMode(CENTER);
    image(this.sprites[frame], 0, 0, this.size, this.size);
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