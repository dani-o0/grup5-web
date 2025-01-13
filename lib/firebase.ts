import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCuvNobsre3xVdqyaqkf2LQSBGrjJzl4Rk",
  authDomain: "poop-app-ba87c.firebaseapp.com",
  projectId: "poop-app-ba87c",
  storageBucket: "poop-app-ba87c.appspot.com",
  messagingSenderId: "758414816441",
  appId: "1:758414816441:web:050e54e53ef91d2c401768",
  measurementId: "G-9ZFS19W581"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

export { db };

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

