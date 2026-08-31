import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBUEV3JLt0qrJHhJfS3LhShjA39mIBSeCg",
  authDomain: "rhythmx-39fcd.firebaseapp.com",
  projectId: "rhythmx-39fcd",
  storageBucket: "rhythmx-39fcd.firebasestorage.app",
  messagingSenderId: "726045183628",
  appId: "1:726045183628:web:95f8180ee283263ba6f5a9",
  measurementId: "G-FDWG4J6NNC"
};

console.log("Firebase Init with Key:", firebaseConfig.apiKey.substring(0, 10) + "...");

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
