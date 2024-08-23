import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const { pathname: serviceAccountKeyPath } = new URL('./serviceAccountKey.json', import.meta.url);
initializeApp({
  credential: cert(serviceAccountKeyPath.replace('/C:','C:')),
});

class Collection {
  constructor(collection) {
    const db = getFirestore();
    this.collection = db.collection(collection);
  }

  async getItem(path) {
    const snapshot = await this.collection.doc(path).get();
    return snapshot.data();
  }

  async getItems() {
    const snapshot = await this.collection.get();
    // return snapshot.docs.map(doc=>{
    //   const data = doc.data();
    //   data.id = doc.id;
    //   return data;
    // });
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  }

  async addItem(value) {
    const docRef = await this.collection.add(value);
    return docRef.id;
  }

  async updateItem(key, value) {
    return await this.collection.doc(key).set(value);
  }

  async removeItem(key) {
    return await this.collection.doc(key).delete();
  }

  async getCount() {
    return (await this.collection.count().get()).data().count;
  }
}

export default Collection;
