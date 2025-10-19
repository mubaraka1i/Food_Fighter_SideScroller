function checkCollisions() {
  // Get the bullets array from the playerShoots object
  const bullets = playerShoots.getBullets();

  //check if bullet hit enemy
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemiesArray.length - 1; j >= 0; j--) {
      
      const bullet = bullets[i];
      const enemy = enemiesArray[j];

      // between the bullet's center and the enemy's center.
      const distance = dist(bullet.x, bullet.y, enemy.x, enemy.y);

      if (distance < (bullet.size / 2) + enemy.r) {
        
        // Collision detection
        enemiesArray.splice(j, 1); // delete the enemy
        bullets.splice(i, 1);      // delete the bullet
        
        break;
      }
    }
  }

  //check if enemy hit chef
  for (let i = enemiesArray.length - 1; i >= 0; i--) {
    const enemy = enemiesArray[i];
    
    // Use the playerHitbox's collision detection method
    if (playerHitbox.playerHit(enemy.x, enemy.y)) {
      // Player hits enemy - lose health and remove enemy
      health.healthDec(10);
      enemiesArray.splice(i, 1);
    }
  }
}