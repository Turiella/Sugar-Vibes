import React from 'react';
import { Ingredient } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

interface IngredientManagerProps {
    ingredients: Ingredient[];
    onEdit: (ingredient: Ingredient) => void;
    onDelete: (id: string) => void;
}

export const IngredientManager: React.FC<IngredientManagerProps> = ({ 
    ingredients, 
    onEdit, 
    onDelete 
}) => {
    return (
        <div className="divide-y divide-gray-100">
            {ingredients.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No hay ingredientes registrados
                </div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.id} className="p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{ingredient.name}</h3>
                                    <p className="text-xs text-gray-500">
                                        ${ingredient.pricePerUnit.toFixed(2)} / {ingredient.unit}
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(ingredient)}
                                        className="text-gray-400 hover:text-blue-600 p-1"
                                        aria-label="Editar ingrediente"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(ingredient.id)}
                                        className="text-gray-400 hover:text-red-600 p-1"
                                        aria-label="Eliminar ingrediente"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};