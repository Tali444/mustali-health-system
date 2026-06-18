import fs from 'fs';
import path from 'path';

function findFile(dir: string, name: string, depth = 0) {
  if (depth > 4) return;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (f !== 'node_modules' && f !== '.next' && f !== 'dist' && f !== '.git') {
            findFile(full, name, depth + 1);
          }
        } else if (f === name) {
          console.log(`Found ${name} at: ${full}`);
        }
      } catch (_) {}
    }
  } catch (_) {}
}

findFile('/app', 'firestore.rules');
findFile('/root', 'firestore.rules');
