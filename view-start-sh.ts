import fs from 'fs';
try {
  console.log(fs.readFileSync('/app/start.sh', 'utf8'));
} catch (err: any) {
  console.error(err.message);
}
