// Types for movie collections

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt?: Date;
  coverImage?: string;
  movieCount: number;
}

export interface CollectionMovie {
  id: string;
  collectionId: string;
  movieId: string;
  addedAt: Date;
}