import type { MysteryCase } from '@/core/enterprise/entities/mystery-case.entity';
import type { Evidence } from '@/core/enterprise/entities/evidence.entity';
import type { ICaseRepository } from '@/core/application/ports/out/case.repository';
import type { CreateCaseInputDTO } from '@/core/application/use-cases/case/create-case.use-case';
import { db } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // For generating evidence IDs

// Helper to convert Firestore Timestamps to ISO strings
const convertTimestamps = (data: any): any => {
  if (data?.createdAt instanceof Timestamp) {
    data.createdAt = data.createdAt.toDate().toISOString();
  }
  if (data?.updatedAt instanceof Timestamp) {
    data.updatedAt = data.updatedAt.toDate().toISOString();
  }
  // Add other timestamp fields if necessary
  return data;
};


export class FirebaseCaseRepository implements ICaseRepository {
  private casesCollection = collection(db, 'cases');

  private mapDocToMysteryCase(docSnap: any): MysteryCase {
    const data = docSnap.data();
    const mysteryCase = {
      ...convertTimestamps(data),
      id: docSnap.id,
    } as MysteryCase;

    // Ensure evidence has IDs, if not already present (e.g. from older data)
    if (mysteryCase.evidence && Array.isArray(mysteryCase.evidence)) {
      mysteryCase.evidence = mysteryCase.evidence.map(e => ({ ...e, id: e.id || uuidv4() }));
    }
    return mysteryCase;
  }

  async findById(id: string): Promise<MysteryCase | undefined> {
    try {
      const docRef = doc(this.casesCollection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return this.mapDocToMysteryCase(docSnap);
      }
      return undefined;
    } catch (error) {
      console.error(`Error fetching case with ID ${id} from Firestore:`, error);
      throw error; // Re-throw for use case to handle or log
    }
  }

  async findAll(): Promise<MysteryCase[]> {
    try {
      const q = query(this.casesCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => this.mapDocToMysteryCase(docSnap));
    } catch (error) {
      console.error('Error fetching all cases from Firestore:', error);
      throw error;
    }
  }

  async findAllPublished(): Promise<MysteryCase[]> {
    try {
      const q = query(
        this.casesCollection,
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => this.mapDocToMysteryCase(docSnap));
    } catch (error) {
      console.error('Error fetching published cases from Firestore:', error);
      throw error;
    }
  }

  async save(caseData: CreateCaseInputDTO & { authorId: string }): Promise<MysteryCase> {
    try {
      const evidenceWithIds: Evidence[] = caseData.evidence.map(ev => ({
        ...ev,
        id: uuidv4(), // Generate unique ID for each piece of evidence
      }));

      const newCaseData = {
        ...caseData,
        evidence: evidenceWithIds,
        createdAt: serverTimestamp(), // Use Firestore server timestamp
        // updatedAt: serverTimestamp(), // if you add an updatedAt field
      };

      const docRef = await addDoc(this.casesCollection, newCaseData);
      
      // Fetch the newly created document to get server-generated fields like createdAt
      const newDocSnap = await getDoc(docRef);
      if (!newDocSnap.exists()) {
          throw new Error("Failed to retrieve saved case from Firestore immediately after creation.");
      }
      return this.mapDocToMysteryCase(newDocSnap);

    } catch (error) {
      console.error('Error saving case to Firestore:', error);
      throw error;
    }
  }

  // Example of an update method if needed in the future
  async update(id: string, caseData: Partial<MysteryCase>): Promise<MysteryCase | undefined> {
    try {
      const docRef = doc(this.casesCollection, id);
      const updateData = { ...caseData, updatedAt: serverTimestamp() };
      delete updateData.id; // Don't try to update the ID field itself
      
      await updateDoc(docRef, updateData);
      
      const updatedDocSnap = await getDoc(docRef);
       if (!updatedDocSnap.exists()) {
          throw new Error("Failed to retrieve updated case from Firestore.");
      }
      return this.mapDocToMysteryCase(updatedDocSnap);
    } catch (error)
    {
      console.error(`Error updating case with ID ${id} in Firestore:`, error);
      throw error;
    }
  }
}
