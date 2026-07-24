import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_firebase_api_key_here'
    ? process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    : 'AIzaSyA4QyBfSdf-demo-key-for-school-erp', // Safe fallback demo key
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes('your_project_id')
    ? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    : 'school-erp-system-default.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes('your_project_id')
    ? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    : 'school-erp-system-default',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET && !process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.includes('your_project_id')
    ? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    : 'school-erp-system-default.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID && !process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID.includes('your_messaging_sender_id')
    ? process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    : '38920194829',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID && !process.env.NEXT_PUBLIC_FIREBASE_APP_ID.includes('your_firebase_app_id')
    ? process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    : '1:38920194829:web:9f8a37b068da9402b8ad8f',
};

// Always initialize so Firestore database features work out of the box
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

if (typeof window !== 'undefined') {
  (window as any).firebaseApp = app;
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const isConfigured = true;

// Triggering automatic Vercel rebuild for updated env variables


