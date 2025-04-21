import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Review } from '../../types';
import { createReview, updateReview } from '../../lib/reviews';
import StarRating from './StarRating';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewFormProps {
  movieId: string;
  movieTitle: string;
  existingReview?: Review;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ReviewFormData {
  title: string;
  content: string;
}

const ReviewForm = ({ movieId, movieTitle, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReviewFormData>({
    defaultValues: {
      title: existingReview?.title || '',
      content: existingReview?.content || ''
    }
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!currentUser) {
      setError('Debes iniciar sesión para publicar una reseña');
      return;
    }

    if (rating === 0) {
      setError('Por favor, selecciona una valoración');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (existingReview) {
        // Update existing review
        await updateReview(existingReview.id, {
          rating,
          title: data.title,
          content: data.content
        });
      } else {
        // Create new review
        await createReview({
          movieId,
          userId: currentUser.uid,
          userName: currentUser.displayName || 'Usuario',
          userPhotoURL: currentUser.photoURL || '',
          rating,
          title: data.title,
          content: data.content,
          isApproved: true
        });
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Ha ocurrido un error al guardar la reseña. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
      <h3 className="text-xl font-semibold mb-4">
        {existingReview ? 'Editar reseña' : `Escribir reseña para ${movieTitle}`}
      </h3>

      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tu valoración</label>
          <StarRating initialRating={rating} onChange={setRating} size="lg" />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Título de tu reseña
          </label>
          <input
            id="title"
            type="text"
            className="w-full bg-filmoteca-gray bg-opacity-20 border border-filmoteca-gray border-opacity-30 rounded-md p-2 text-filmoteca-white focus:outline-none focus:ring-2 focus:ring-filmoteca-olive"
            placeholder="Resumen de tu opinión"
            {...register('title', { required: 'El título es obligatorio', maxLength: { value: 100, message: 'El título no puede tener más de 100 caracteres' } })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Tu reseña
          </label>
          <textarea
            id="content"
            rows={5}
            className="w-full bg-filmoteca-gray bg-opacity-20 border border-filmoteca-gray border-opacity-30 rounded-md p-2 text-filmoteca-white focus:outline-none focus:ring-2 focus:ring-filmoteca-olive"
            placeholder="Comparte tu opinión sobre la película..."
            {...register('content', { required: 'El contenido es obligatorio', minLength: { value: 10, message: 'La reseña debe tener al menos 10 caracteres' } })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-filmoteca-gray text-filmoteca-white rounded-md hover:bg-filmoteca-gray hover:bg-opacity-20 transition-colors duration-200"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-filmoteca-olive text-filmoteca-dark rounded-md hover:bg-opacity-90 transition-colors duration-200 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-filmoteca-dark rounded-full"></span>
                Guardando...
              </>
            ) : (
              existingReview ? 'Actualizar reseña' : 'Publicar reseña'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;