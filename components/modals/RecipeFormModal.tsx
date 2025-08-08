import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Recipe } from '../../types';

interface RecipeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: Recipe) => void;
    recipe: Recipe | null;
    isSubmitting: boolean;
}

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({ isOpen, onClose, onSave, recipe, isSubmitting }) => {
    const [name, setName] = useState('');
    const [servings, setServings] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (recipe) {
                setName(recipe.name);
                setServings(String(recipe.servings || ''));
            } else {
                setName('');
                setServings('');
            }
        }
    }, [recipe, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: recipe?.id || `rec_${Date.now()}`,
            name,
            servings: parseInt(servings) || 1,
            items: recipe?.items || [],
            laborCost: recipe?.laborCost || 0,
            overheadPercentage: recipe?.overheadPercentage || 15, // Default value
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={recipe?.id ? 'Editar Receta' : 'Nueva Receta'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nombre de la Receta" id="rec-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                <Input label="Número de Porciones" id="rec-servings" type="number" value={servings} onChange={e => setServings(e.target.value)} required />
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
