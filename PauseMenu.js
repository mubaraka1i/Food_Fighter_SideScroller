class PauseMenu {
  constructor() {
    this.visible = false;
    this.options = ['Continue', 'Restart Level', 'Restart Game', 'Quit to Menu'];
    this.selectedOption = 0;
    this.optionHeight = 60;
    this.menuWidth = 400;
    this.menuHeight = 350;
  }
  
  draw() {
    if (!this.visible) return;
    
    // Semi-transparent overlay
    push();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);
    
    // Menu background
    fill(50, 50, 100, 220);
    stroke(100, 100, 200);
    strokeWeight(3);
    rectMode(CENTER);
    rect(width/2, height/2, this.menuWidth, this.menuHeight, 20);
    
    // Title
    fill(255);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("GAME PAUSED", width/2, height/2 - 120);
    
    // Draw options
    textSize(28);
    for (let i = 0; i < this.options.length; i++) {
      let y = height/2 - 40 + i * this.optionHeight;
      
      // Highlight selected option
      if (i === this.selectedOption) {
        fill(100, 100, 255, 150);
        rect(width/2, y, this.menuWidth - 40, 40, 10);
      }
      
      // Draw option text
      fill(i === this.selectedOption ? 255 : 200);
      text(this.options[i], width/2, y);
    }
    
    // Instructions
    fill(200);
    textSize(16);
    //text("Use UP/DOWN arrows to select, ENTER to confirm", width/2, height/2 + 140);
    
    pop();
  }
  
  show() {
    this.visible = true;
    this.selectedOption = 0;
  }
  
  hide() {
    this.visible = false;
  }
  
  moveSelection(direction) {
    this.selectedOption += direction;
    if (this.selectedOption < 0) {
      this.selectedOption = this.options.length - 1;
    } else if (this.selectedOption >= this.options.length) {
      this.selectedOption = 0;
    }
  }
  
  selectOption() {
    switch(this.selectedOption) {
      case 0: // Continue
        gamePaused = false;
        this.hide();
        break;
      case 1: // Restart Level
        gamePaused = false;
        this.hide();
        restartGame();
        break;
      case 2: // Restart Game
        gamePaused = false;
        this.hide();
        completeGameReset();
        titleScrn.screenRemove();
        playInitiated = true;
        break;
      case 3: // Quit to Menu
        gamePaused = false;
        this.hide();
        playInitiated = false;
        titleScrn.visible = true;
        break;
    }
  }
}