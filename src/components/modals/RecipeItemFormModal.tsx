import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { FormField } from '../ui/FormField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { RecipeItem, Ingredient, Recipe, Unit, UnitLabels } from '../../types';

interface RecipeItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: RecipeItem) => void;
    item: RecipeItem | null;
    ingredients: Ingredient[];
    recipes: Recipe[];
    isSubmitting: boolean;
}

export const RecipeItemFormModal: React.FC<RecipeItemFormModalProps> = ({ isOpen, onClose, onSave, item, ingredients, recipes, isSubmitting }) => {
    const [type, setType] = useState<'ingredient' | 'recipe'>('ingredient');
    const [selectedId, setSelectedId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<Unit>(Unit.G);

    useEffect(() => {
        if (isOpen) {
            if (item) {
                setType(item.type);
                setSelectedId(item.type === 'ingredient' ? item.ingredientId : item.recipeId);
                setQuantity(String(item.quantity));
                setUnit(item.unit);
            } else {
                const defaultType = 'ingredient';
                setType(defaultType);
                setQuantity('');
                setUnit(Unit.G);
                if (ingredients.length > 0) {
                    setSelectedId(ingredients[0].id);
                } else {
                    setSelectedId('');
                }
            }
        }
    }, [item, isOpen, ingredients, recipes]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const commonData = {
            id: item?.id || `item_${Date.now()}`,
            quantity: parseFloat(quantity) || 0,
            unit,
        };
        if (type === 'ingredient') {
            onSave({ ...commonData, type: 'ingredient', ingredientId: selectedId });
        } else {
            onSave({ ...commonData, type: 'recipe', recipeId: selectedId, unit: Unit.UNIT });
        }
    };
    
    const options = type === 'ingredient' ? ingredients : recipes;
    const availableUnits = type === 'recipe' ? { [Unit.UNIT]: UnitLabels[Unit.UNIT] } : UnitLabels;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Editar Elemento' : 'Añadir Elemento'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Tipo">
                        <Select value={type} onChange={e => {
                            const newType = e.target.value as 'ingredient' | 'recipe';
                            setType(newType);
                            if (newType === 'ingredient') {
                                setSelectedId(ingredients.length > 0 ? ingredients[0].id : '');
                                setUnit(Unit.G);
                            } else {
                                setSelectedId(recipes.length > 0 ? recipes[0].id : '');
                                setUnit(Unit.UNIT);
                            }
                        }}>
                            <option value="ingredient">Ingrediente</option>
                            <option value="recipe">Sub-Receta</option>
                        </Select>
                    </FormField>
                    <FormField label="Nombre">
                        <Select value={selectedId} onChange={e => setSelectedId(e.target.value)} disabled={options.length === 0}>
                            {options.length === 0 && <option>No hay opciones</option>}
                            {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </Select>
                    </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Cantidad">
                        <Input type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="Ej: 100" />
                    </FormField>
                    <FormField label="Unidad">
                        <Select value={unit} onChange={e => setUnit(e.target.value as Unit)} disabled={type === 'recipe'}>
                            {Object.entries(availableUnits).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </FormField>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <SecondaryButton type="button" onClick={onClose}>Cancelar</SecondaryButton>
                    <PrimaryButton type="submit" disabled={isSubmitting || options.length === 0}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};
