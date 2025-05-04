import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Review } from '../../types';
import { createReview, updateReview } from '../../lib/reviews';
import StarRating from './StarRating';
import { useAuth } from '../../contexts/AuthContext';

interface ReviewFormProps {
  movieId: string;
  existingReview?: Review;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ReviewFormData {
  title: string;
  content: string;
}

const ReviewForm = ({ movieId, existingReview, onSuccess, onCancel }: ReviewFormProps) => {
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
          isApproved: false
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
      <h3 className="text-xl font-semibold mb-4 text-filmoteca-white">
        {existingReview ? 'Editar reseña' : 'Escribir reseña'}
      </h3>

      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-filmoteca-light">
            Valoración
          </label>
          <StarRating
            initialRating={rating}
            onChange={setRating}
            size="lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2 text-filmoteca-light">
            Título
          </label>
          <input
            type="text"
            id="title"
            className="form-input"
            placeholder="Título de tu reseña..."
            {...register('title', { required: 'El título es obligatorio' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-2 text-filmoteca-light">
            Tu reseña
          </label>
          <textarea
            id="content"
            rows={5}
            className="form-input"
            placeholder="Comparte tu opinión sobre la película..."
            {...register('content', { required: 'El contenido es obligatorio', minLength: { value: 10, message: 'La reseña debe tener al menos 10 caracteres' } })}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        {!existingReview && (
          <div className="mb-4 bg-filmoteca-olive bg-opacity-20 border border-filmoteca-olive border-opacity-30 p-3 rounded text-filmoteca-light text-sm">
            <p>Tu reseña será revisada por un moderador antes de ser publicada.</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center"
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