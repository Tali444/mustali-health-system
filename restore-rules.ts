import { execSync } from 'child_process';
try {
  execSync('git checkout -- firestore.rules', { stdio: 'inherit' });
  console.log("Successfully restored original firestore.rules from git.");
} catch (err: any) {
  console.error("Failed to restore firestore.rules:", err.message);
}
try {
  execSync('git checkout -- firebase.json', { stdio: 'inherit' });
  console.log("Successfully restored firebase.json (or removed if not tracked) from git.");
} catch (err: any) {
  console.error("Failed to restore firebase.json:", err.message);
  try {
    fs.unlinkSync('firebase.json');
    console.log("Deleted temporary firebase.json.");
  } catch (_) {}
}
