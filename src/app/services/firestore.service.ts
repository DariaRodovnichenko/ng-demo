import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  async saveData(collectionName: string, data: any) {
    const ref = collection(this.firestore, collectionName);
    return await addDoc(ref, data);
  }
}
