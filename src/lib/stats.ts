import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { DetailedStats } from '../types';

/**
 * Obtiene estadísticas detalladas para el panel de administración
 * @param timeRange - Rango de tiempo para las estadísticas ('week', 'month', 'year')
 */
export const getDetailedStats = async (timeRange: string = 'month'): Promise<DetailedStats> => {
  try {
    // Calcular fecha de inicio según el rango seleccionado
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1); // Por defecto, último mes
    }
    
    const startTimestamp = Timestamp.fromDate(startDate);
    
    // Consultar usuarios nuevos en el rango de tiempo
    const usersRef = collection(db, 'users');
    const newUsersQuery = query(
      usersRef,
      where('createdAt', '>=', startTimestamp)
    );
    const newUsersSnapshot = await getDocs(newUsersQuery);
    const newUsers = newUsersSnapshot.size;
    
    // Consultar reseñas nuevas en el rango de tiempo
    const reviewsRef = collection(db, 'reviews');
    const newReviewsQuery = query(
      reviewsRef,
      where('createdAt', '>=', startTimestamp)
    );
    const newReviewsSnapshot = await getDocs(newReviewsQuery);
    const newReviews = newReviewsSnapshot.size;
    
    // Consultar películas más valoradas
    const topMoviesQuery = query(
      reviewsRef,
      where('isApproved', '==', true),
      orderBy('rating', 'desc'),
      limit(5)
    );
    const topMoviesSnapshot = await getDocs(topMoviesQuery);
    const topRatedMovies = topMoviesSnapshot.docs.map(doc => ({
      id: doc.data().movieId,
      title: doc.data().movieTitle,
      rating: doc.data().rating
    }));
    
    // Consultar usuarios más activos (con más reseñas)
    const activeUsersQuery = query(
      reviewsRef,
      where('createdAt', '>=', startTimestamp),
      orderBy('createdAt', 'desc')
    );
    const activeUsersSnapshot = await getDocs(activeUsersQuery);
    
    // Agrupar por usuario y contar reseñas
    const userReviewCount: Record<string, { userId: string, userName: string, count: number }> = {};
    activeUsersSnapshot.docs.forEach(doc => {
      const userId = doc.data().userId;
      const userName = doc.data().userName;
      
      if (!userReviewCount[userId]) {
        userReviewCount[userId] = { userId, userName, count: 0 };
      }
      
      userReviewCount[userId].count += 1;
    });
    
    // Convertir a array y ordenar por cantidad de reseñas
    const mostActiveUsers = Object.values(userReviewCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calcular distribución de valoraciones
    const ratingsDistribution = [0, 0, 0, 0, 0]; // Para valoraciones de 1 a 5 estrellas
    
    const allReviewsQuery = query(
      reviewsRef,
      where('isApproved', '==', true),
      where('createdAt', '>=', startTimestamp)
    );
    const allReviewsSnapshot = await getDocs(allReviewsQuery);
    
    allReviewsSnapshot.docs.forEach(doc => {
      const rating = doc.data().rating;
      if (rating >= 1 && rating <= 5) {
        ratingsDistribution[rating - 1] += 1;
      }
    });
    
    return {
      newUsers,
      newReviews,
      topRatedMovies,
      mostActiveUsers,
      ratingsDistribution
    };
  } catch (error) {
    console.error('Error al obtener estadísticas detalladas:', error);
    throw new Error('No se pudieron cargar las estadísticas detalladas');
  }
};

/**
 * Obtiene estadísticas de crecimiento para mostrar tendencias
 */
export const getGrowthStats = async () => {
  try {
    // Calcular fechas para los últimos 6 meses
    const now = new Date();
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(now.getMonth() - i);
      
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      
      const startTimestamp = Timestamp.fromDate(monthStart);
      const endTimestamp = Timestamp.fromDate(monthEnd);
      
      // Consultar usuarios nuevos del mes
      const usersRef = collection(db, 'users');
      const newUsersQuery = query(
        usersRef,
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp)
      );
      const newUsersSnapshot = await getDocs(newUsersQuery);
      
      // Consultar reseñas nuevas del mes
      const reviewsRef = collection(db, 'reviews');
      const newReviewsQuery = query(
        reviewsRef,
        where('createdAt', '>=', startTimestamp),
        where('createdAt', '<=', endTimestamp)
      );
      const newReviewsSnapshot = await getDocs(newReviewsQuery);
      
      monthlyData.push({
        month: monthDate.toLocaleString('es-ES', { month: 'short' }),
        users: newUsersSnapshot.size,
        reviews: newReviewsSnapshot.size
      });
    }
    
    return monthlyData;
  } catch (error) {
    console.error('Error al obtener estadísticas de crecimiento:', error);
    throw new Error('No se pudieron cargar las estadísticas de crecimiento');
  }
};