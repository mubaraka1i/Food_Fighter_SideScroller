class TitleScreen {
  /**
   * Creates a title screen to be drawn to the screen if game not started.
   * * @param {number} type 0, 1, 2, 3, or 4 - title, gameOver, tutorial, stats, or victory
   */
  constructor(type) {
    this.type = type;
    if (this.type == 1 || this.type == 3) {
      // Death screen and stats screen start hidden
      this.visible = false;
    } else if (this.type == 0) {
      // Title screen starts hidden (will be shown after lore)
      this.visible = false;
    } else {
      // Victory screen (type 4) and tutorial (type 2) start hidden
      this.visible = false;
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
      // Just display normally (one frame) for tutorial and stats
      image(screen, 0, 0, width, height);
    } else if (this.type == 4) {
      // Victory screen with animation
      this.curFrame = floor(frameCount / 10) % 3;
      let frameW = screen.width / 3;
      let frameH = screen.height;
      let curX = this.curFrame * frameW;
      let curY = 0;
      image(screen, 0, 0, width, height, curX, curY, frameW, frameH);
    } else {
      // Type 0 (title) and type 1 (game over) with animation
      this.curFrame = floor(frameCount / 10) % 2;
      let frameW = screen.width / 2;
      let frameH = screen.height;
      let curX = this.curFrame * frameW;
      let curY = 0;
      image(screen, 0, 0, width, height, curX, curY, frameW, frameH);
    }

    // Visual Debug Box 
    /*
    if (this.type === 0) { 
      push();
      noFill();
      stroke(255, 0, 0);
      strokeWeight(3);
      
      let boxX = width * 0.69; 
      let boxY = height * 0.71;
      let boxW = width * 0.079;
      let boxH = height * 0.14;
      
      rect(boxX, boxY, boxW, boxH);
      pop();
    }
      */
  }

  /**
   * Checks if a mouse click x,y is inside the "Play" arrow area.
   * @param {number} mx Mouse X position
   * @param {number} my Mouse Y position
   * @returns {boolean} true if clicked inside the arrow
   */
  isPlayButtonClicked(mx, my) {
    // Left Bound is the same as boxX
    let leftBound = width * 0.69; 
    
    // Right Bound is boxX + boxW (0.69 + 0.079 = 0.769)
    let rightBound = width * (0.69 + 0.079); 
    
    // Top Bound is the same as boxY
    let topBound = height * 0.71;
    
    // Bottom Bound is boxY + boxH (0.71 + 0.14 = 0.85)
    let bottomBound = height * (0.71 + 0.14); 

    if (mx > leftBound && mx < rightBound && my > topBound && my < bottomBound) {
      return true;
    }
    return false;
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