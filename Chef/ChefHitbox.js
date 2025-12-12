class ChefHitbox{
  /**
   * Creates an object of the ChefHitbox class that can handle collision with the player.
   * 
   * @param {Chef} player the player object the hitbox corresponds to
   * @param {boolean} visible tells whether the hitbox is visible during gameplay
   */
  constructor(player, visible) {
    this.player = player;
    this.visible = visible;
    
    this.defaultHeight = player.height; // 150
    this.defaultWidth = player.width;   // 150
    this.duckHeight = 74; // crouch height
    
    this.hitWidth = this.defaultWidth * 0.6; // 90
    this.hitHeight = this.defaultHeight - 18; // 132 (Standing initial)
    this.x = this.player.x + (this.defaultWidth - this.hitWidth) / 2;
    this.y = this.player.y + 18;
    this.isDucking = false;
  }

  /**
  * @returns {number} the center x coordinate of the player's hitbox
  */
  getCenterX() {
    return this.x + this.hitWidth / 2;
  }
  
  /**
   * @returns {number} the center y coordinate of the player's hitbox
   */
  getCenterY() {
    return this.y + this.hitHeight / 2;
  }

  /**
   * Updates the hitbox coordinates and width.
   */
  update() {
    // Sync Horizontal Position (centered on Chef)
    this.hitWidth = this.defaultWidth * 0.6;
    this.x = this.player.x + (this.defaultWidth - this.hitWidth) / 2;

    // Sync Vertical Position and Height
    if (this.player.isDucking) {
      this.hitHeight = this.duckHeight;
      this.y = this.player.y + (this.defaultHeight - this.duckHeight) * 0.5; // 50% up from bottom
    } else {
      // Standing State
      this.hitHeight = this.defaultHeight - 18;
      this.y = this.player.y + 18;
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
   * 
   * @returns {undefined} exit early if hitboxes are not visible
   */
  drawPlayerHitbox() {
    return;
    /*
    push();
    noFill(); 
    stroke('green');
    rect(this.x, this.y, this.hitWidth, this.hitHeight);
    pop();
    */
  }

  /**
   * Registers if the player is hit by something.
   * NOT USED CURRENTLY
   * 
   * @param {number} x the x coordinate of what is hitting the player
   * @param {number} y the x coordinate of what is hitting the player
   * @returns {boolean} true if hit, false if not
   */
  playerHit(x, y) {
    const hitX = x >= this.x && x <= this.x + this.hitWidth;
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
   * @returns {boolean} true if hit, false if not
   */
  playerHitRect(enemyX, enemyY, enemyW, enemyH) {
    return !(this.x + this.hitWidth < enemyX ||
             this.x > enemyX + enemyW ||
             this.y + this.hitHeight < enemyY ||
             this.y > enemyY + enemyH);
  }

  /**
   * Checks if a circular power-up collides with this rectangular hitbox.
   * @param {number} circleX PowerUp center X
   * @param {number} circleY PowerUp center Y
   * @param {number} circleR PowerUp radius
   * @returns {boolean} true if overlapping
   */
  playerHitCircle(circleX, circleY, circleR) {
    // Find the closest point on the hitbox to the center of the circle
    const closestX = constrain(circleX, this.x, this.x + this.hitWidth);
    const closestY = constrain(circleY, this.y, this.y + this.hitHeight);

    // Calculate the distance between the closest point and the circle's center
    const distanceX = circleX - closestX;
    const distanceY = circleY - closestY;

    // If the distance is less than the circle's radius, they are colliding
    return (distanceX * distanceX) + (distanceY * distanceY) < (circleR * circleR);
  }
}