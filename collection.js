import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const { pathname: serviceAccountKeyPath } = new URL('./serviceAccountKey.json', import.meta.url);
initializeApp({
  credential: cert(serviceAccountKeyPath.replace('/C:','C:')),
});

const db = getFirestore();

const run = async () => {
  try {
    const data = { name: 'Alice' };
    const docRef = await db.collection('customers').add(data);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

run();
