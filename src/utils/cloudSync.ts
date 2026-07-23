import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isConfigured } from '../lib/firebase';

export interface CloudERPData {
  students: any[];
  teachers: any[];
  homework: any[];
  classwork: any[];
  timetable: any[];
  calendarEvents: any[];
  notifications: any[];
  busRoutes: any[];
  attendance: any[];
}

const FALLBACK_REST_URL = 'https://school-erp-system-default-rtdb.firebaseio.com/sync/krk_global_school_data.json';

/**
 * Pushes school data to the cloud.
 * Prioritizes user's Firestore database (if configured in Firebase Console) so they can view it in their console.
 * Falls back to a default real-time sync database path.
 */
export async function pushToCloud(data: CloudERPData): Promise<boolean> {
  try {
    // 1. Try User's Firestore Console (if configured)
    if (isConfigured && db) {
      const docRef = doc(db, 'school', 'krk_global_data');
      await setDoc(docRef, data);
      return true;
    }

    // 2. Fallback to global REST database path
    const response = await fetch(FALLBACK_REST_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error('[CloudSync Error] Failed to push data:', error);
    return false;
  }
}

/**
 * Pulls school data from the cloud.
 * Prioritizes user's Firestore database (if configured in Firebase Console).
 * Falls back to a default real-time sync database path.
 */
export async function pullFromCloud(): Promise<CloudERPData | null> {
  try {
    // 1. Try User's Firestore Console (if configured)
    if (isConfigured && db) {
      const docRef = doc(db, 'school', 'krk_global_data');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as CloudERPData;
      }
    }

    // 2. Fallback to global REST database path
    const response = await fetch(FALLBACK_REST_URL);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CloudSync Error] Failed to pull data:', error);
    return null;
  }
}
