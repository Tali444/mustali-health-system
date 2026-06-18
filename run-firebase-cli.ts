import { spawn } from 'child_process';

async function getAccessToken() {
  const url = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
  const res = await fetch(url, { headers: { 'Metadata-Flavor': 'Google' } });
  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.statusText}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function runCommand(cmd: string, args: string[]) {
  console.log(`Running: ${cmd} ${args.join(' ')}`);
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function run() {
  try {
    const token = await getAccessToken();
    console.log("Acquired token.");
    
    // Test listing databases
    await runCommand('npx', [
      'firebase',
      'firestore:databases:list',
      '--token',
      `"${token}"`,
      '--project',
      'ai-studio-applet-webapp-c9a0b'
    ]);
  } catch (err: any) {
    console.error("CLI Execution failed:", err.message);
  }
  process.exit(0);
}

run();
