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
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import { Review } from '../types';

// Get all reviews for a movie
export const getMovieReviews = async (movieId: string, sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc', limitCount: number = 20): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef, 
      where('movieId', '==', movieId),
      where('isApproved', '==', true),
      orderBy(sortBy, sortOrder),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        movieId: data.movieId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        title: data.title || '',
        content: data.content,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        isApproved: data.isApproved,
        likes: data.likes || 0,
        userPhotoURL: data.userPhotoURL || ''
      };
    });
  } catch (error) {
    console.error('Error getting movie reviews:', error);
    throw error;
  }
};

// Get all reviews by a user
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        movieId: data.movieId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        title: data.title || '',
        content: data.content,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        isApproved: data.isApproved || true,
        likes: data.likes || 0,
        userPhotoURL: data.userPhotoURL || ''
      };
    });
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw error;
  }
};

// Create a new review
export const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<string> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const newReview = {
      ...reviewData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isApproved: false,
      likes: 0
    };
    
    const docRef = await addDoc(reviewsRef, newReview);
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId: string, reviewData: Partial<Review>): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    
    const updateData: any = {
      updatedAt: serverTimestamp()
    };
    
    if (reviewData.rating !== undefined) updateData.rating = reviewData.rating;
    if (reviewData.title !== undefined) updateData.title = reviewData.title;
    if (reviewData.content !== undefined) updateData.content = reviewData.content;
    
    await updateDoc(reviewRef, updateData);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
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