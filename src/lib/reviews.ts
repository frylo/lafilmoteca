// Review services for Firebase
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  limit,
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types/review';

// Get all reviews for a movie
export const getMovieReviews = async (movieId: string, limitCount: number = 20): Promise<Review[]> => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(
    reviewsRef,
    where('movieId', '==', movieId),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Review));
};

// Get all reviews by a user
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Review));
};

// Create a new review
export const createReview = async (review: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  const reviewsRef = collection(db, 'reviews');
  const docRef = await addDoc(reviewsRef, {
    ...review,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

// Update a review
export const updateReview = async (reviewId: string, review: Partial<Review>): Promise<void> => {
  const reviewsRef = collection(db, 'reviews');
  await updateDoc(doc(reviewsRef, reviewId), review);
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  const reviewsRef = collection(db, 'reviews');
  await deleteDoc(doc(reviewsRef, reviewId));
};

// Like a review
export const likeReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      likes: increment(1)
    });
  } catch (error) {
    console.error('Error liking review:', error);
    throw error;
  }
};

// Unlike a review
export const unlikeReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      likes: increment(-1)
    });
  } catch (error) {
    console.error('Error unliking review:', error);
    throw error;
  }
};

// Approve or reject a review (admin only)
export const moderateReview = async (reviewId: string, isApproved: boolean): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      isApproved,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error moderating review:', error);
    throw error;
  }
};