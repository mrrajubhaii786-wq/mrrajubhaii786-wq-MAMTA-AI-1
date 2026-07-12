// src/brain/CloudSync.ts

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function saveCloud(userId: string, project: any): Promise<void> {
  try {
    const projectRef = doc(db, "projects", userId);
    await setDoc(
      projectRef,
      {
        project,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
    console.log(`☁️ [CloudSync] Project successfully synced to cloud for user: ${userId}`);
  } catch (err) {
    console.error("❌ [CloudSync] Error saving to cloud Firestore:", err);
  }
}

export async function loadCloud(userId: string): Promise<any> {
  try {
    const projectRef = doc(db, "projects", userId);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error("❌ [CloudSync] Error loading from cloud Firestore:", err);
    return null;
  }
}
