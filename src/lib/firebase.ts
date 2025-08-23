// This file configures the Firebase app and exports Firebase services.
'use client';

import {initializeApp, getApp, getApps} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'recipe-remix-m7v3n',
  appId: '1:693984342037:web:e84ee374c03f10a72f9e1c',
  storageBucket: 'recipe-remix-m7v3n.firebasestorage.app',
  apiKey: 'AIzaSyAJJmmCO9sEnUV8AwmMtH8Wfd3sDx1rAEg',
  authDomain: 'recipe-remix-m7v3n.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '693984342037',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
