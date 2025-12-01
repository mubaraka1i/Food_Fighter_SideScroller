class TitleScreen {
  /**
   * Creates a title screen to be drawn to the screen if game not started.
   * 
   * @param {number} type 0, 1, or 2 - gameStart, gameOver, or tutorial
   */
  constructor(type) {
    this.type = type;
    if (this.type == 1 || this.type == 3) {
      this.visible = false;
    } else {
      this.visible = true;
    }
    this.curFrame = 0;

    // layout for stats
    this.startX = 175;
    this.startY = 100;
    this.lineHeight = 60;
    this.digitWidth = 30;
    this.digitSpacing = 5;
  }
  
  /**
   * Draws the title image to the screen.
   * @param {Image} screen image object that gets drawn on the screen
   * @returns {undefined} early exit if not visisble
   */
  screenDraw(screen) {
    if (!this.visible) return;
    
    if (this.type == 2 || this.type == 3) {
      // Just display normally (one frame) for tutorial
      image(screen, 0, 0, width, height);
    } else {
      this.curFrame = floor(frameCount / 10) % 2;
      let frameW = screen.width / 2;
      let frameH = screen.height;
      let curX = this.curFrame * frameW;
      let curY = 0;
      image(screen, 0, 0, width, height, curX, curY, frameW, frameH);
    }
  }
  
  /**
   * Sets the screen's visibility to false.
   */
  screenRemove() {
    this.visible = false;
  }

  drawNumber(spritesheet, digit, x, y, size) {
    const frameWidth = spritesheet.width / 10;
    image(
      spritesheet,
      x, y,           // position on canvas
      size, size,     // display size
      digit * frameWidth, 0,  // source x, y
      frameWidth, spritesheet.height  // source width & height
    );
  }

  formatLabel(key) {
    switch(key) {
      case "shotsFired": return "Shots Fired:";
      case "shotsMissed": return "Shots Missed:";
      case "shotsHit": return "Shots Hit:";
      case "enemiesKilled": return "Enemies Killed:";
      case "powerUpsUsed": return "Power Ups Used:";
      case "damageDone": return "Damage Done:";
      case "damageTaken": return "Damage Taken:";
      case "healthHealed": return "Health Healed:";
      default: return key;
    }
  }

  drawMultiDigit(spritesheet, value, x, y, size) {
    const str = value.toString();
    for (let i = 0; i < str.length; i++) {
      this.drawNumber(spritesheet, int(str[i]), x + i * (size + this.digitSpacing), y, size);
    }
  }
}