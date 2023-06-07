import { initializeApp, type FirebaseApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEzIqluyO4DeZ0yJ-XiojdwrY_f-RVihk",
  authDomain: "svelte-tournament-app-ca7fb.firebaseapp.com",
  projectId: "svelte-tournament-app-ca7fb",
  storageBucket: "svelte-tournament-app-ca7fb.appspot.com",
  messagingSenderId: "198534660442",
  appId: "1:198534660442:web:bbec092af432a538bcb363"
};


// Initialize Firebase
const app : FirebaseApp = initializeApp(firebaseConfig);
const db : Firestore = getFirestore(app);
export {app,db}
