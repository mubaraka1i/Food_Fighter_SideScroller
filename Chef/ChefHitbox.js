class ChefHitbox{

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

  playerHit(x, y) {
    // 'x' and 'y' are the coordinates of the thing hitting the player
    const hitX = x >= this.playerPosX && x <= this.playerPosX + this.hitboxLength;
    const hitY = y >= this.playerPosY && y <= this.playerPosY + this.hitboxLength;

    return hitX && hitY;
  }
}