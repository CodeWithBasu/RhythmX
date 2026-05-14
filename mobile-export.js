const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appApiDir = path.join(__dirname, 'app', 'api');
const backupApiDir = path.join(__dirname, 'app', '_api');

console.log('🚀 Starting Mobile Export Process...');

try {
  // 1. Temporarily hide API routes from Next.js (output: export doesn't support them)
  if (fs.existsSync(appApiDir)) {
    console.log('📦 Hiding API routes...');
    fs.renameSync(appApiDir, backupApiDir);
  }

  // 2. Run the build
  console.log('🏗️ Building static frontend...');
  execSync('npx next build', { stdio: 'inherit' });

  // 3. Sync with Capacitor
  console.log('📲 Syncing with Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });

  console.log('✅ Mobile build complete! Your "out" folder is ready and synced to Android/iOS projects.');

} catch (error) {
  console.error('❌ Export failed:', error.message);
} finally {
  // 4. Restore API routes
  if (fs.existsSync(backupApiDir)) {
    console.log('⏪ Restoring API routes...');
    fs.renameSync(backupApiDir, appApiDir);
  }
}
