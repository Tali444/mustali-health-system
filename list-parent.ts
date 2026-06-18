import fs from 'fs';
import path from 'path';

function listRecursive(dir: string, depth = 0) {
  if (depth > 3) return;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          console.log(`DIR: ${full}`);
          listRecursive(full, depth + 1);
        } else {
          console.log(`FILE: ${full}`);
        }
      } catch (_) {}
    }
  } catch (_) {}
}

listRecursive('/app');
