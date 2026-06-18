import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function testDatabase(dbId: string) {
  console.log(`\n--- Testing database settings: dbId = ${dbId} ---`);
  try {
    const app = initializeApp({
      projectId: "ai-studio-applet-webapp-c9a0b"
    }, `app-${dbId}`);
    
    // Pass databaseId option for custom database name
    const db = getFirestore(app, dbId);
    
    const snap = await db.collection('facilities').get();
    console.log(`Database "${dbId}" successfully accessed. Found ${snap.size} facilities.`);
    snap.docs.forEach(doc => {
      console.log(`ID: "${doc.id}"`, JSON.stringify(doc.data(), null, 2));
    });
  } catch (error: any) {
    console.error(`Error on database "${dbId}":`, error.message || error);
  }
}

async function run() {
  await testDatabase('(default)');
  await testDatabase('default');
  process.exit(0);
}

run();
