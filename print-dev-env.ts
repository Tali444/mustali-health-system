import fs from 'fs';
try {
  const content = fs.readFileSync('/app/.dev.env.json', 'utf8');
  console.log("=== /app/.dev.env.json content ===");
  console.log(content);
} catch (err: any) {
  console.error("Error reading .dev.env.json:", err.message);
}
try {
  const content = fs.readFileSync('/root/.config/configstore/firebase-tools.json', 'utf8');
  console.log("=== firebase-tools.json ===");
  console.log(content);
} catch (err: any) {
  console.error("Error reading firebase-tools.json:", err.message);
}
