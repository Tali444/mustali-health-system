import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);

async function tryDb() {
  console.log(`Trying to connect to database: default...`);
  try {
    const db = getFirestore(app, 'default');
    const snap = await getDocs(collection(db, 'facilities'));
    console.log(`SUCCESS: found ${snap.size} documents.`);
    snap.docs.forEach(d => {
      console.log(`Document [${d.id}]:`, JSON.stringify(d.data()));
    });
  } catch (err: any) {
    console.log(`FAILED:`, err.message || err);
  }
}

async function run() {
  await tryDb();
  process.exit(0);
}

run();
