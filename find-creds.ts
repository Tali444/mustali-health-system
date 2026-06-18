import fs from 'fs';
import path from 'path';

function findJsonFiles(dir: string, depth = 0) {
  if (depth > 4) return;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (f !== 'node_modules' && f !== '.next' && f !== 'dist' && f !== '.git') {
            findJsonFiles(full, depth + 1);
          }
        } else if (f.endsWith('.json')) {
          console.log(`JSON file: ${full}`);
          if (f.includes('key') || f.includes('cred') || f.includes('service-account')) {
            console.log(`POSSIBLE CREDENTIAL: ${full}`);
          }
        }
      } catch (_) {}
    }
  } catch (_) {}
}

findJsonFiles('/app');
findJsonFiles('/root');
