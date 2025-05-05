export interface Review {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isApproved: boolean;
  likes: number;
  userPhotoURL?: string;
} 