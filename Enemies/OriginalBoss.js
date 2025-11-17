class OriginalBoss extends Boss {
  constructor(x, y) {
    super(x, y, 'original', cupcakeBoss.idle);
    this.health = 10;
    this.maxHealth = 10;
    // Uses default values from base Boss class
  }
  // Override the draw method to match the original boss appearance
}