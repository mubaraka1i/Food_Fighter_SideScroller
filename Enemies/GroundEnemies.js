function spawnGroundEnemies() {
  enemiesArray = [];
  for (let i = 0; i < 5; i++) {
    enemiesArray.push({
      x: width + (i * 90),                   
      y: height,
      r: 20,                               
      speed: 3                             
    });
  }
}

function updateGroundEnemies() {
  for (let enemy of enemiesArray) {
    enemy.x -= enemy.speed;

  
    fill(10, 160, 40);
    noStroke();
    rect(enemy.x, enemy.y, enemy.r * 2);

    
    enemyHitbox(enemy.x, enemy.y, enemy.r, showHitboxes);
  }
}




function enemyHitbox(x, y, r, visible) {
  let rectWidth = (r * 2) + 2;   
  let rectHeight = (r * 2) + 2;  

  if (visible) {
    noStroke();           
    noFill();         
  
  }

  rectMode(CENTER);
  rect(x, y, rectWidth, rectHeight);
  rectMode(CORNER);
}