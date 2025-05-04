// Collection services for Firebase
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Collection } from '../types/collections';

// Get all collections for a user
export const getUserCollections = async (userId: string): Promise<Collection[]> => {
  try {
    const collectionsRef = collection(db, 'collections');
    const q = query(collectionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        description: data.description || '',
        isPublic: data.isPublic,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        coverImage: data.coverImage,
        movieCount: data.movieCount || 0
      };
    });
  } catch (error) {
    console.error('Error getting user collections:', error);
    throw error;
  }
};

// Create a new collection
export const createCollection = async (userId: string, collectionData: Partial<Collection>): Promise<string> => {
  try {
    const collectionsRef = collection(db, 'collections');
    const newCollection = {
      userId,
      name: collectionData.name,
      description: collectionData.description || '',
      isPublic: collectionData.isPublic || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      coverImage: collectionData.coverImage || '',
      movieCount: 0
    };
    
    const docRef = await addDoc(collectionsRef, newCollection);
    return docRef.id;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

// Update a collection
export const updateCollection = async (collectionId: string, collectionData: Partial<Collection>): Promise<void> => {
  try {
    const collectionRef = doc(db, 'collections', collectionId);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updatedAt: serverTimestamp()
    };
    
    if (collectionData.name !== undefined) updateData.name = collectionData.name;
    if (collectionData.description !== undefined) updateData.description = collectionData.description;
    if (collectionData.isPublic !== undefined) updateData.isPublic = collectionData.isPublic;
    if (collectionData.coverImage !== undefined) updateData.coverImage = collectionData.coverImage;
    
    await updateDoc(collectionRef, updateData);
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

// Delete a collection
export const deleteCollection = async (collectionId: string): Promise<void> => {
  try {
    // First, delete all movies in the collection
    const collectionMoviesRef = collection(db, 'collectionMovies');
    const q = query(collectionMoviesRef, where('collectionId', '==', collectionId));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Then delete the collection itself
    const collectionRef = doc(db, 'collections', collectionId);
    await deleteDoc(collectionRef);
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};

// Add a movie to a collection
export const addMovieToCollection = async (collectionId: string, movieId: string): Promise<void> => {
  try {
    // Check if movie already exists in collection
    const collectionMoviesRef = collection(db, 'collectionMovies');
    const q = query(
      collectionMoviesRef, 
      where('collectionId', '==', collectionId),
      where('movieId', '==', movieId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // Add movie to collection
      await addDoc(collectionMoviesRef, {
        collectionId,
        movieId,
        addedAt: serverTimestamp()
      });
      
      // Update movie count in collection
      const collectionRef = doc(db, 'collections', collectionId);
      await updateDoc(collectionRef, {
        movieCount: increment(1),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error adding movie to collection:', error);
    throw error;
  }
};

// Remove a movie from a collection
export const removeMovieFromCollection = async (collectionId: string, movieId: string): Promise<void> => {
  try {
    // Find the collection movie document
    const collectionMoviesRef = collection(db, 'collectionMovies');
    const q = query(
      collectionMoviesRef, 
      where('collectionId', '==', collectionId),
      where('movieId', '==', movieId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Delete the collection movie document
      await deleteDoc(querySnapshot.docs[0].ref);
      
      // Update movie count in collection
      const collectionRef = doc(db, 'collections', collectionId);
      await updateDoc(collectionRef, {
        movieCount: increment(-1),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error removing movie from collection:', error);
    throw error;
  }
};

// Get all movies in a collection
export const getCollectionMovies = async (collectionId: string): Promise<string[]> => {
  try {
    const collectionMoviesRef = collection(db, 'collectionMovies');
    const q = query(collectionMoviesRef, where('collectionId', '==', collectionId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data().movieId);
  } catch (error) {
    console.error('Error getting collection movies:', error);
    throw error;
  }
};

// Check if a movie is in a collection
export const isMovieInCollection = async (collectionId: string, movieId: string): Promise<boolean> => {
  try {
    const collectionMoviesRef = collection(db, 'collectionMovies');
    const q = query(
      collectionMoviesRef, 
      where('collectionId', '==', collectionId),
      where('movieId', '==', movieId)
    );
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if movie is in collection:', error);
    throw error;
  }
};