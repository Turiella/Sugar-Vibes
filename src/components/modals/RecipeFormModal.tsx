import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { FormField } from '../ui/FormField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { Recipe, Ingredient, RecipeItem, IngredientItem, SubRecipeItem, Unit, UnitLabels } from '../../types';
import { v4 as uuidv4 } from 'uuid';

interface RecipeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (recipe: Omit<Recipe, 'id'>) => void;
    recipe: Recipe | null;
    ingredients: Ingredient[];
    recipes: Recipe[]; // Para seleccionar sub-recetas
    isSubmitting: boolean;
}

type ItemType = 'ingredient' | 'recipe';

export const RecipeFormModal: React.FC<RecipeFormModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    recipe, 
    ingredients,
    recipes,
    isSubmitting 
}) => {
    const [name, setName] = useState('');
    const [servings, setServings] = useState('');
    const [items, setItems] = useState<RecipeItem[]>([]);
    const [itemType, setItemType] = useState<ItemType>('ingredient');
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<Unit>(Unit.G);

    useEffect(() => {
        if (isOpen) {
            if (recipe) {
                setName(recipe.name);
                setServings(String(recipe.servings || ''));
                setItems([...recipe.items]);
            } else {
                setName('');
                setServings('');
                setItems([]);
            }
            setSelectedItem('');
            setQuantity('');
            setUnit(Unit.G);
            setItemType('ingredient');
        }
    }, [recipe, isOpen]);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !quantity || parseFloat(quantity) <= 0) return;

        let newItem: RecipeItem;

        if (itemType === 'ingredient') {
            const ingredient = ingredients.find(ing => ing.id === selectedItem);
            if (!ingredient) return;

            newItem = {
                id: uuidv4(),
                type: 'ingredient',
                ingredientId: selectedItem,
                quantity: parseFloat(quantity),
                unit: unit
            } as IngredientItem;
        } else {
            newItem = {
                id: uuidv4(),
                type: 'recipe',
                recipeId: selectedItem,
                quantity: parseFloat(quantity),
                unit: unit
            } as SubRecipeItem;
        }

        setItems([...items, newItem]);
        setSelectedItem('');
        setQuantity('');
        setUnit(Unit.G);
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert('Debes agregar al menos un ingrediente o sub-receta a la receta');
            return;
        }
        
        onSave({
            name,
            servings: parseInt(servings) || 1,
            items,
            laborCost: recipe?.laborCost || 0,
            overheadPercentage: recipe?.overheadPercentage || 15,
        });
    };

    const getItemName = (item: RecipeItem) => {
        if (item.type === 'ingredient') {
            const ingredient = ingredients.find(i => i.id === item.ingredientId);
            return ingredient?.name || 'Ingrediente no encontrado';
        } else {
            const subRecipe = recipes?.find(r => r.id === item.recipeId);
            return subRecipe ? `Sub-receta: ${subRecipe.name}` : 'Sub-receta no encontrada';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={recipe?.id ? 'Editar Receta' : 'Nueva Receta'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Nombre de la Receta">
                    <Input id="rec-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Torta de Chocolate" />
                </FormField>
                <FormField label="Número de Porciones">
                    <Input 
                        id="rec-servings" 
                        type="number" 
                        min="1"
                        value={servings} 
                        onChange={e => setServings(e.target.value)} 
                        required 
                        placeholder="Ej: 8" 
                    />
                </FormField>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Ingredientes y Sub-recetas</h3>
                        <div className="flex rounded-md shadow-sm">
                            <button
                                type="button"
                                onClick={() => setItemType('ingredient')}
                                className={`px-4 py-2 text-sm font-medium rounded-l-md ${itemType === 'ingredient' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                            >
                                Ingrediente
                            </button>
                            <button
                                type="button"
                                onClick={() => setItemType('recipe')}
                                className={`px-4 py-2 text-sm font-medium rounded-r-md ${itemType === 'recipe' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                            >
                                Sub-receta
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <select
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={selectedItem}
                                onChange={(e) => setSelectedItem(e.target.value)}
                            >
                                <option value="">
                                    {itemType === 'ingredient' ? 'Seleccionar ingrediente' : 'Seleccionar sub-receta'}
                                </option>
                                {itemType === 'ingredient' ? (
                                    ingredients.map((ing) => (
                                        <option key={ing.id} value={ing.id}>
                                            {ing.name}
                                        </option>
                                    ))
                                ) : (
                                    (recipes || [])
                                        .filter(r => !recipe || r.id !== recipe.id) // Evitar referencias circulares
                                        .map((rec) => (
                                            <option key={rec.id} value={rec.id}>
                                                {rec.name}
                                            </option>
                                        ))
                                )}
                            </select>
                        </div>
                        <div className="w-32">
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Cantidad"
                            />
                        </div>
                        <div className="w-32">
                            <select
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value as Unit)}
                            >
                                {Object.entries(UnitLabels).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            disabled={!selectedItem || !quantity || parseFloat(quantity) <= 0}
                        >
                            Agregar
                        </button>
                    </div>

                    {items.length > 0 && (
                        <div className="mt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-500 mt-2">
                                {itemType === 'ingredient' ? 'Ingredientes' : 'Elementos'} agregados:
                            </h4>
                            <ul className="mt-2 space-y-2">
                                {items.map((item) => (
                                    <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                        <span>
                                            {getItemName(item)} - {item.quantity} {UnitLabels[item.unit]}
                                            {item.type === 'recipe' && ' (sub-receta)'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
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
