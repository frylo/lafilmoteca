import { useState } from 'react';
import { createCollection, updateCollection } from '../../lib/collections';
import { Collection } from '../../types/collections';

interface CollectionFormProps {
  userId: string;
  collection?: Collection;
  onSuccess: () => void;
  onCancel: () => void;
}

const CollectionForm = ({ userId, collection, onSuccess, onCancel }: CollectionFormProps) => {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [isPublic, setIsPublic] = useState(collection?.isPublic || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!collection;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('El nombre de la colección es obligatorio');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing && collection) {
        await updateCollection(collection.id, {
          name,
          description,
          isPublic
        });
      } else {
        await createCollection(userId, {
          name,
          description,
          isPublic
        });
      }
      
      onSuccess();
    } catch (err) {
      console.error('Error saving collection:', err);
      setError('Error al guardar la colección. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-filmoteca-dark p-6 rounded-lg shadow-md border border-filmoteca-gray border-opacity-30">
      <h2 className="text-xl font-semibold mb-6 text-filmoteca-white">
        {isEditing ? 'Editar Colección' : 'Nueva Colección'}
      </h2>
      
      {error && (
        <div className="bg-red-900 bg-opacity-30 border border-red-800 text-filmoteca-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-filmoteca-light">
            Nombre *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-filmoteca-light">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input min-h-[100px]"
            rows={4}
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="form-checkbox"
              disabled={loading}
            />
            <span className="ml-2 text-filmoteca-light">
              Hacer esta colección pública
            </span>
          </label>
          <p className="text-xs text-filmoteca-gray mt-1">
            Las colecciones públicas pueden ser vistas por otros usuarios.
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;