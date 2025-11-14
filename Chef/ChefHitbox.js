class ChefHitbox{
  /**
   * Creates an object of the ChefHitbox class that can handle collision with the player.
   * @param {Chef} player: the player object the hitbox corresponds to
   * @param {boolean} visible: tells whether the hitbox is visible during gameplay
   */
  constructor(player, visible) {
    this.player = player;
    this.visible = visible;
    
    this.defaultHeight = player.height; // full standing height
    this.defaultWidth = player.width;
    
    this.hitHeight = this.defaultHeight - 18; // height to register collision
    this.hitWidth = this.defaultWidth * 0.6; // width to register collision
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

  /**
   * Updates the hitbox coordinates and width.
   */
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
  
  /**
   * Starts a crouch when called.
   */
  duck() {
    if (this.player.isOnGround) this.isDucking = true;
  }
  
  /**
   * Ends a crouch when called.
   */
  cancelDuck() {
    this.isDucking = false;
  }

  /**
   * Draws the player hitbox to the screen using top left coordinates.
   * @returns: exit early if hitboxes are not visible
   */
  drawPlayerHitbox() {
    if (!this.visible) return;
    push();
    noFill(); 
    stroke('green');
    rect(this.x, this.y, this.hitWidth, this.hitHeight);
    pop();
  }

  /**
   * Registers if the player is hit by something.
   * NOT USED CURRENTLY
   * 
   * @param {number} x the x coordinate of what is hitting the player
   * @param {number} y the x coordinate of what is hitting the player
   * @returns 
   */
  playerHit(x, y) {
    // 'x' and 'y' are the coordinates of the thing hitting the player
    const hitX = x >= this.x && x <= this.x + this.hitHeight;
    const hitY = y >= this.y && y <= this.y + this.hitHeight;

    return hitX && hitY;
  }
  
/**
 * Checks for rectangle collision with player, such as ground enemies.
 * 
 * @param {number} enemyX top left corner x coordinate of an enemy
 * @param {number} enemyY top left corner y coordinate of an enemy
 * @param {number} enemyW width of the enemy
 * @param {number} enemyH height of the enemy
 * @returns true if hit, false if not
 */
  playerHitRect(enemyX, enemyY, enemyW, enemyH) {
    // Check for no overlap (Axis-Aligned Bounding Box)
    return !(this.x + this.hitWidth < enemyX ||
             this.x > enemyX + enemyW ||
             this.y + this.hitHeight < enemyY ||
             this.y > enemyY + enemyH);
  }

  /**
   * Checks for circle collision with player, such as flying enemies.
   * 
   * @param {number} circleX center x coordinate for enemy
   * @param {number} circleY center y coordinate for enemy
   * @param {number} circleR radius for enemy
   * @returns 
   */
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

