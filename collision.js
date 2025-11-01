function checkCollisions() {
  const bullets = playerShoots.getBullets();
  const playerHB = playerHitbox; // Get the player's hitbox object

  // Loop through all enemies backwards
  for (let i = enemiesArray.length - 1; i >= 0; i--) {
    const enemy = enemiesArray[i];
    const enemyHB = enemy.getHitbox(); // Get enemy's hitbox

    //Check Player-Enemy Collision 
    
    // This check is for GroundEnemies which are squares
    if (enemy instanceof GroundEnemies) {
      if (playerHB.playerHitRect(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h)) {
        health.healthDec(10); // Damage player
        enemiesArray.splice(i, 1); // Remove enemy
        continue; // Skip to next enemy
      }
    }
    // This check is for FlyingEnemy which are circle
    else if (enemy instanceof FlyingEnemies) {
      if (playerHB.playerHitCircle(enemyHB.x, enemyHB.y, enemyHB.r)) {
        health.healthDec(10); // Damage player
        enemiesArray.splice(i, 1); // Remove enemy
        continue; // Skip to next enemy
      }
    }

    // Check Bullet-Enemy Collision 
    for (let j = bullets.length - 1; j >= 0; j--) {
      const bullet = bullets[j];
      
      let hit = false;
      // Check bullet (circle) vs GroundEnemy (rect)
      if (enemy instanceof GroundEnemies) {
        hit = collideRectCircle(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h, bullet.x, bullet.y, bullet.size);
      }
      // Check bullet (circle) vs FlyingEnemy (circle)
      else if (enemy instanceof FlyingEnemies) {
        // Use p5ollide's circle vs circle check
        hit = collideCircleCircle(enemyHB.x, enemyHB.y, enemyHB.r * 2, bullet.x, bullet.y, bullet.size);
      }

      if (hit) {
        enemiesArray.splice(i, 1); // Remove enemy
        bullets.splice(j, 1);      // Remove bullet
        break; // Stop checking this enemy move to next
      }
    }
  }
  
  // Check BOSS Collisions 
  if (bossActive && boss !== null) {
    const bossHB = boss.getHitbox();

    // Only check collisions if boss is done sliding in
    if (!boss.isSlidingIn()) {
      // Check Player vs Boss
      if (playerHB.playerHitRect(bossHB.x, bossHB.y, bossHB.w, bossHB.h)) {
        health.healthDec(1); // Constant damage if touching boss
      }

      // Check Player Bullets vs Boss
      for (let j = bullets.length - 1; j >= 0; j--) {
        const bullet = bullets[j];
        if (collideRectCircle(bossHB.x, bossHB.y, bossHB.w, bossHB.h, bullet.x, bullet.y, bullet.size)) {
          boss.takeDamage(1); // Damage the boss
          bullets.splice(j, 1); // Remove the bullet
          
          // Check if boss is dead
          if (boss.getHealth() <= 0) {
            bossActive = false;
            boss = null;
            // Show death screen when boss is defeated
            playInitiated = false;
            deathScrn.visible = true;
            return; // Exit early to avoid further processing
          }
        }
      }

      // Check Boss Projectiles vs. Player
      const bossProjectiles = boss.getProjectiles();
      for (let k = bossProjectiles.length - 1; k >= 0; k--) {
        const projectile = bossProjectiles[k];
        const projHB = projectile.getHitbox(); // A circle
        
        if (playerHB.playerHitCircle(projHB.x, projHB.y, projHB.r)) {
          health.healthDec(5); // Damage player
          bossProjectiles.splice(k, 1); // Remove projectile
        }
      }
    }
  }
}