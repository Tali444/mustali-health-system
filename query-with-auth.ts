import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, 'default');

async function run() {
  console.log("Signing in anonymously...");
  try {
    const cred = await signInAnonymously(auth);
    console.log("Signed in as anonymously, uid:", cred.user.uid);
    const snap = await getDocs(collection(db, 'facilities'));
    console.log(`SUCCESS: found ${snap.size} documents.`);
    snap.docs.forEach(doc => {
      console.log(`Doc [${doc.id}]:`, JSON.stringify(doc.data(), null, 2));
    });
  } catch (error: any) {
    console.error("Failed:", error.message || error);
  }
  process.exit(0);
}

run();
