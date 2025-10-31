class ChefHitbox {

  constructor(playerPosX, playerPosY, visible, hitBoxLength) {
    this.playerPosX = playerPosX;
    this.playerPosY = playerPosY;
    this.visible = visible;
    this.hitboxLength = hitBoxLength;
  }

  updateX(x) {
    this.playerPosX = x;
  }

  updateY(y) {
    this.playerPosY = y;
  }

  drawPlayerHitbox() {
    noFill();
    if (this.visible == true) {
      stroke('green');
    } else {
      noStroke();
    }
    rectMode(CORNER);
    //fixed this because playerPosY already accounts for the height calculation
    rect(this.playerPosX, this.playerPosY, this.hitboxLength, this.hitboxLength);
  }

  // --- UPDATED playerHit ---
  // This now checks for RECTANGLE collision, which are ground enemies
  playerHitRect(enemyX, enemyY, enemyW, enemyH) {
    // Check for no overlap (Axis-Aligned Bounding Box)
    if (this.playerPosX + this.hitboxLength < enemyX ||
        this.playerPosX > enemyX + enemyW ||
        this.playerPosY + this.hitboxLength < enemyY ||
        this.playerPosY > enemyY + enemyH) {
      return false;
    } else {
      return true; // Overlap!
    }
  }

  // --- NEW METHOD: Check collision with a CIRCLE, which is flying enemies---
  playerHitCircle(circleX, circleY, circleR) {
    // Use p5.collide library function (diameter)
    return collideRectCircle(
      this.playerPosX,
      this.playerPosY,
      this.hitboxLength,
      this.hitboxLength,
      circleX,
      circleY,
      circleR * 2 
    );
  }
}

