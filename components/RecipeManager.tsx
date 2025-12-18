import React from 'react';
import { Recipe } from '../types';
import { motion } from 'framer-motion';
import { Clock, Users, DollarSign, Edit2, Trash2 } from 'lucide-react';

interface RecipeManagerProps {
    recipes: Recipe[];
    onSelect: (id: string) => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
    calculateCost: (recipe: Recipe) => number;
}

export const RecipeManager: React.FC<RecipeManagerProps> = ({ 
    recipes, 
    onSelect,
    onEdit,
    onDelete,
    calculateCost
}) => {
    return (
        <div className="divide-y divide-gray-100">
            {recipes.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    <p>No hay recetas registradas</p>
                    <p className="text-sm mt-1">Crea tu primera receta para comenzar</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {recipes.map((recipe) => (
                        <motion.li 
                            key={recipe.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => onSelect(recipe.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{recipe.name}</h3>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center text-xs text-gray-500">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {recipe.preparationTime} min
                                        </span>
                                        <span className="inline-flex items-center text-xs text-gray-500">
                                            <Users className="h-3 w-3 mr-1" />
                                            {recipe.portions} porciones
                                        </span>
                                        <span className="inline-flex items-center text-xs font-medium text-green-700">
                                            <DollarSign className="h-3 w-3 mr-1" />
                                            {calculateCost(recipe).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(recipe);
                                        }}
                                        className="text-gray-400 hover:text-blue-600 p-1"
                                        aria-label="Editar receta"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(recipe.id);
                                        }}
                                        className="text-gray-400 hover:text-red-600 p-1"
                                        aria-label="Eliminar receta"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    );
};