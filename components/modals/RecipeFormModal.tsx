import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { FormField } from '../ui/FormField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
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
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Nombre de la Receta">
                    <Input id="rec-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Torta de Chocolate" />
                </FormField>
                <FormField label="Número de Porciones">
                    <Input id="rec-servings" type="number" value={servings} onChange={e => setServings(e.target.value)} required placeholder="Ej: 8" />
                </FormField>
                <div className="flex justify-end gap-3 pt-4">
                    <SecondaryButton type="button" onClick={onClose}>Cancelar</SecondaryButton>
                    <PrimaryButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};
