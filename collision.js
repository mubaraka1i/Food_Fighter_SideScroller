function checkCollisions() {
  const bullets = playerShoots.getBullets();
  const playerHB = playerHitbox; // Get the player's hitbox object

  // Loop through all enemies backwards (safe for removal)
  for (let i = enemiesArray.length - 1; i >= 0; i--) {
    const enemy = enemiesArray[i];
    const enemyHB = enemy.getHitbox(); // Get enemy's hitbox

    // --- 1. Check Player-Enemy Collision ---
    
    // This check is for rectangle-vs-rectangle (GroundEnemy)
    if (enemy instanceof GroundEnemies) {
      if (playerHB.playerHitRect(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h)) {
        health.healthDec(10); // Damage player
        enemiesArray.splice(i, 1); // Remove enemy
        continue; // Skip to next enemy
      }
    }
    // This check is for circle-vs-rectangle (FlyingEnemy)
    else if (enemy instanceof FlyingEnemies) {
      if (playerHB.playerHitCircle(enemyHB.x, enemyHB.y, enemyHB.r)) {
        health.healthDec(10); // Damage player
        enemiesArray.splice(i, 1); // Remove enemy
        continue; // Skip to next enemy
      }
    }

    // --- 2. Check Bullet-Enemy Collision ---
    for (let j = bullets.length - 1; j >= 0; j--) {
      const bullet = bullets[j];
      
      let hit = false;
      // Check bullet (circle) vs GroundEnemy (rect)
      if (enemy instanceof GroundEnemies) {
        hit = collideRectCircle(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h, bullet.x, bullet.y, bullet.size);
      }
      // Check bullet (circle) vs FlyingEnemy (circle)
      else if (enemy instanceof FlyingEnemies) {
        // Use p5.collide's circle vs circle check
        hit = collideCircleCircle(enemyHB.x, enemyHB.y, enemyHB.r * 2, bullet.x, bullet.y, bullet.size);
      }

      if (hit) {
        enemiesArray.splice(i, 1); // Remove enemy
        bullets.splice(j, 1);      // Remove bullet
        break; // Stop checking this enemy, move to next
      }
    }
  }
}

