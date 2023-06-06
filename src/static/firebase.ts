import { initializeApp, type FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAda2U0zleV4Hv9q03Qf8nifqDphzTrP0",
  authDomain: "svelte-tournament-app.firebaseapp.com",
  projectId: "svelte-tournament-app",
  storageBucket: "svelte-tournament-app.appspot.com",
  messagingSenderId: "222895190748",
  appId: "1:222895190748:web:67b08905c07a9185c5ba19"
};

// Initialize Firebase
const app : FirebaseApp = initializeApp(firebaseConfig);
const db : Firestore = getFirestore(app);
export {app,db}
