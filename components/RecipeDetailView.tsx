import React from 'react';
import { Recipe, Ingredient } from '../types';
import { Clock, Users, List, Percent, DollarSign } from 'lucide-react';

interface RecipeDetailViewProps {
    recipe: Recipe;
    ingredients: Ingredient[];
    calculateCost: (recipe: Recipe) => number;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ 
    recipe, 
    ingredients,
    calculateCost 
}) => {
    const getIngredientName = (id: string) => {
        return ingredients.find(i => i.id === id)?.name || 'Desconocido';
    };

    const getIngredientUnit = (id: string) => {
        return ingredients.find(i => i.id === id)?.unit || 'unidad';
    };

    const getIngredientCost = (ingredientId: string, quantity: number) => {
        const ingredient = ingredients.find(i => i.id === ingredientId);
        return ingredient ? (ingredient.pricePerUnit * quantity) : 0;
    };

    const totalCost = calculateCost(recipe);
    const costPerServing = recipe.portions > 0 ? totalCost / recipe.portions : 0;

    return (
        <div>
            {/* Encabezado */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{recipe.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                                {recipe.preparationTime} minutos
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                                {recipe.portions} porciones
                            </div>
                            <div className="flex items-center text-sm font-medium text-green-700">
                                <DollarSign className="h-4 w-4 mr-1.5" />
                                Costo total: ${totalCost.toFixed(2)}
                            </div>
                            <div className="flex items-center text-sm font-medium text-blue-700">
                                <DollarSign className="h-4 w-4 mr-1.5" />
                                Por porción: ${costPerServing.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredientes */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <List className="h-5 w-5 mr-2 text-blue-500" />
                    Ingredientes
                </h3>
                <ul className="space-y-3">
                    {recipe.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <div className="flex-1">
                                <span className="text-gray-900">{getIngredientName(item.ingredientId)}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-900">
                                    {item.quantity} {getIngredientUnit(item.ingredientId)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    ${getIngredientCost(item.ingredientId, item.quantity).toFixed(2)}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Instrucciones */}
            {recipe.instructions && (
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-600 rounded-full p-1.5 mr-2">
                            <Percent className="h-4 w-4" />
                        </span>
                        Instrucciones
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                        {recipe.instructions.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-3">{paragraph}</p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};