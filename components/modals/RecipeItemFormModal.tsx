import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
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
                // Reset to default for new item
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
            onSave({ ...commonData, type: 'recipe', recipeId: selectedId, unit: Unit.UNIT }); // Sub-recipes are always by unit
        }
    };
    
    const options = type === 'ingredient' ? ingredients : recipes;
    const availableUnits = type === 'recipe' ? { [Unit.UNIT]: UnitLabels[Unit.UNIT] } : UnitLabels;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item ? 'Editar Elemento' : 'Añadir Elemento a la Receta'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Select label="Tipo de Elemento" value={type} onChange={e => {
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
                     <Select label="Nombre del Elemento" value={selectedId} onChange={e => setSelectedId(e.target.value)} disabled={options.length === 0}>
                        {options.length === 0 && <option>No hay opciones disponibles</option>}
                        {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <Input label="Cantidad" type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required/>
                    <Select label="Unidad de Medida" value={unit} onChange={e => setUnit(e.target.value as Unit)} disabled={type === 'recipe'}>
                         {Object.entries(availableUnits).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </Select>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isSubmitting || options.length === 0}>
                         {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
