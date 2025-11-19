class OriginalBoss extends Boss {
  /**
   * Creates an object of the OriginalBoss class.
   * 
   * @param {number} x top left corner x coordinate of boss
   * @param {number} y top left corner y coordinate of boss
   */
  constructor(x, y) {
    super(x, y, 'original', cupcakeBoss.idle);
    this.health = 10;
    this.maxHealth = 10;
    // Uses default values from base Boss class
  }
  // Override the draw method to match the original boss appearance
}