function checkCollisions() {
  const bullets = playerShoots.getBullets();
  const playerHB = playerHitbox;

  // Loop through all enemies backwards
  for (let i = enemiesArray.length - 1; i >= 0; i--) {
    const enemy = enemiesArray[i];
    const enemyHB = enemy.getHitbox();

    // Check Player-Enemy Collision 
    if (enemy instanceof GroundEnemies) {
      if (playerHB.playerHitRect(enemyHB.x, enemyHB.y, enemyHB.w, enemyHB.h)) {
        health.healthDec(10);
        enemiesArray.splice(i, 1);
        continue;
      }
    } else if (enemy instanceof FlyingEnemies) {
      if (playerHB.playerHitCircle(enemyHB.x, enemyHB.y, enemyHB.r)) {
        health.healthDec(10);
        enemiesArray.splice(i, 1);
        continue;
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
        hit = collideCircleCircle(enemyHB.x, enemyHB.y, enemyHB.r * 2, bullet.x, bullet.y, bullet.size);
      }

      if (hit) {
        enemiesArray.splice(i, 1);
        bullets.splice(j, 1);
        break;
      }
    }
  }
  
  // Check BOSS Collisions 
  if (bossActive && boss !== null) {
    const bossHB = boss.getHitbox();

    if (!boss.isSlidingIn()) {
      // Check Player vs Boss
      if (playerHB.playerHitRect(bossHB.x, bossHB.y, bossHB.w, bossHB.h)) {
        health.healthDec(1);
      }

      // Check Player Bullets vs Boss
      for (let j = bullets.length - 1; j >= 0; j--) {
        const bullet = bullets[j];
        if (collideRectCircle(bossHB.x, bossHB.y, bossHB.w, bossHB.h, bullet.x, bullet.y, bullet.size)) {
          boss.takeDamage(1);
          bullets.splice(j, 1);
          
          if (boss.getHealth() <= 0) {
            bossActive = false;
            boss = null;
            playInitiated = false;
            deathScrn.visible = true;
            return;
          }
        }
      }

      // Check Boss Projectiles vs Player
      const bossProjectiles = boss.getProjectiles();
      for (let k = bossProjectiles.length - 1; k >= 0; k--) {
        const projectile = bossProjectiles[k];
        const projHB = projectile.getHitbox();
        
        // Make sure it is using world coordinates for both player and projectile
        if (playerHB.playerHitCircle(projHB.x, projHB.y, projHB.r)) {
          health.healthDec(1);
          bossProjectiles.splice(k, 1);
        }
      }
    }
  }
}