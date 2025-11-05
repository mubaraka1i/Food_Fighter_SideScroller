class ChefHitbox{

  constructor(player, visible) {
    this.player = player;
    this.visible = visible;
    
    this.defaultHeight = player.height; // full standing heigh-t
    this.defaultWidth = player.width;
    
    this.hitHeight = this.defaultHeight - 18;
    this.hitWidth = this.defaultWidth * 0.6;
    this.x = this.player.x + (this.defaultWidth - this.hitWidth) / 2;
    this.y = this.player.y;
    this.duckHeight = 74; // crouch height
    this.isDucking = false;
  }

  getCenterX() {
    return this.x + this.hitWidth / 2;
  }
  
  getCenterY() {
    return this.y + this.hitHeight / 2;
  }

  update() {
    // Always center hitbox horizontally
    this.hitWidth = this.defaultWidth * 0.6; // adjust ratio as needed
    this.x = this.player.x + (this.defaultWidth - this.hitWidth) / 2;

    if (this.isDucking) {
      this.hitHeight = this.duckHeight; // height when ducking
      this.y = this.player.y + (this.defaultHeight - this.duckHeight);
    } else {
      this.hitHeight = this.defaultHeight - 18; // height when standing
      this.y = this.player.y + 18; // keeping hitbox aligned
    }
  }
  
  duck() {
    if (this.player.isOnGround) this.isDucking = true;
  }
  
  cancelDuck() {
    this.isDucking = false;
  }

  draw() {
    if (!this.visible) return;
    push();
    noFill(); 
    stroke('green');
    rect(this.x, this.y, this.hitWidth, this.hitHeight);
    pop();
  }

  playerHit(x, y) {
    // 'x' and 'y' are the coordinates of the thing hitting the player
    const hitX = x >= this.x && x <= this.x + this.hitHeight;
    const hitY = y >= this.y && y <= this.y + this.hitHeight;

    return hitX && hitY;
  }
  
    // --- UPDATED playerHit ---
  // This now checks for RECTANGLE collision, which are ground enemies
  playerHitRect(enemyX, enemyY, enemyW, enemyH) {
    // Check for no overlap (Axis-Aligned Bounding Box)
    return !(this.x + this.hitWidth < enemyX ||
             this.x > enemyX + enemyW ||
             this.y + this.hitHeight < enemyY ||
             this.y > enemyY + enemyH);
  }

  // --- NEW METHOD: Check collision with a CIRCLE, which is flying enemies---
  playerHitCircle(circleX, circleY, circleR) {
    // Use p5.collide library function (diameter)
    return collideRectCircle(
      this.x,
      this.y,
      this.hitWidth,
      this.hitHeight,
      circleX,
      circleY,
      circleR * 2 
    );
  }
}

