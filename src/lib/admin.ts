import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { User, Review } from '../types';

/**
 * Obtiene todos los usuarios registrados en la aplicación
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as User[];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('No se pudieron cargar los usuarios');
  }
};

/**
 * Actualiza el rol de un usuario
 */
export const updateUserRole = async (userId: string, newRole: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    throw new Error('No se pudo actualizar el rol del usuario');
  }
};

/**
 * Desactiva una cuenta de usuario
 */
export const deactivateUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isActive: false });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    throw new Error('No se pudo desactivar el usuario');
  }
};

/**
 * Obtiene todas las reseñas pendientes de moderación
 */
export const getPendingReviews = async (): Promise<Review[]> => {
  try {
    const reviewsRef = collection(db, 'reviews');
    const pendingQuery = query(reviewsRef, where('isApproved', '==', null));
    const snapshot = await getDocs(pendingQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Review[];
  } catch (error) {
    console.error('Error al obtener reseñas pendientes:', error);
    throw new Error('No se pudieron cargar las reseñas pendientes');
  }
};

/**
 * Modera una reseña (aprobar o rechazar)
 */
export const moderateReview = async (reviewId: string, isApproved: boolean): Promise<void> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, { 
      isApproved,
      moderatedAt: new Date()
    });
  } catch (error) {
    console.error('Error al moderar reseña:', error);
    throw new Error('No se pudo moderar la reseña');
  }
};

/**
 * Obtiene estadísticas básicas del panel de administración
 */
export const getAdminStats = async () => {
  try {
    // Obtener conteo de usuarios
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const totalUsers = usersSnapshot.size;
    
    // Obtener conteo de reseñas
    const reviewsRef = collection(db, 'reviews');
    const reviewsSnapshot = await getDocs(reviewsRef);
    const totalReviews = reviewsSnapshot.size;
    
    // Obtener conteo de reseñas pendientes
    const pendingQuery = query(reviewsRef, where('isApproved', '==', null));
    const pendingSnapshot = await getDocs(pendingQuery);
    const pendingReviews = pendingSnapshot.size;
    
    return {
      totalUsers,
      totalReviews,
      pendingReviews
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de administración:', error);
    throw new Error('No se pudieron cargar las estadísticas');
  }
};