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
    rect(this.playerPosX, height - hitBoxLength - this.playerPosY, hitBoxLength, hitBoxLength);
  }

  playerHit(x, y) {
    let hitX;
    let hitY;
    if (x <= this.playerPosX + 50 && x >= this.playerPosX) {
      hitX = true;
    }
    if (y >= height - hitBoxLength - this.playerPosY && y <= height - playerPosY) {
      hitY = true;
    }
    if (hitX && hitY) {
      return true;
    } else {
      return false;
    }
  }
}