import React, { useMemo } from 'react';
import { Recipe, RecipeItem, Ingredient, UnitLabels } from '../types';
import { calculateRecipeTotalCost, calculateRecipeItemCost } from '../services/costCalculator';
import { formatCurrency } from '../utils/formatters';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Plus, Trash2, Edit, Book, ShoppingCart } from 'lucide-react';

interface RecipeDetailViewProps {
    recipe: Recipe;
    ingredientsMap: Map<string, Ingredient>;
    recipesMap: Map<string, Recipe>;
    onUpdateDetails: (field: keyof Recipe, value: string | number) => void;
    onAddItem: () => void;
    onEditItem: (item: RecipeItem) => void;
    onDeleteItem: (id: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, ingredientsMap, recipesMap, onUpdateDetails, onAddItem, onEditItem, onDeleteItem }) => {
    
    const recipeCost = useMemo(() => {
        return calculateRecipeTotalCost(recipe, ingredientsMap, recipesMap);
    }, [recipe, ingredientsMap, recipesMap]);
    
    return (
        <div className="space-y-6">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                     <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-amber-800 truncate">{recipe.name}</h2>
                        <p className="text-gray-500">{recipe.servings} porciones</p>
                    </div>
                    <Input label="Costo de Mano de Obra (ARS)" type="number" value={recipe.laborCost} onChange={e => onUpdateDetails('laborCost', e.target.value)} />
                    <Input label="Gastos Generales (%)" type="number" value={recipe.overheadPercentage} onChange={e => onUpdateDetails('overheadPercentage', e.target.value)} />
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-bold mb-4">Resumen de Costos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Costo Ingredientes</p>
                        <p className="text-xl font-bold text-gray-800">{formatCurrency(recipeCost?.ingredientsCost ?? 0)}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Costo Total</p>
                        <p className="text-xl font-bold text-gray-800">{formatCurrency(recipeCost?.totalCost ?? 0)}</p>
                    </div>
                    <div className="bg-amber-100 p-4 rounded-lg">
                        <p className="text-sm text-amber-700">Costo por Porción</p>
                        <p className="text-xl font-bold text-amber-900">{formatCurrency(recipeCost?.costPerServing ?? 0)}</p>
                    </div>
                     <div className="bg-green-100 p-4 rounded-lg">
                        <p className="text-sm text-green-700">Precio Venta Sugerido</p>
                        <p className="text-xl font-bold text-green-900">{formatCurrency((recipeCost?.costPerServing ?? 0) * 3)}</p>
                    </div>
                </div>
            </Card>
            
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Elementos de la Receta</h3>
                    <button onClick={onAddItem} className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 transition-colors shadow-sm">
                        <Plus size={18} /> Agregar
                    </button>
                </div>
                <div className="space-y-3">
                    {recipe.items.map(item => {
                        const { name, typeIcon, cost } = (() => {
                            if (item.type === 'ingredient') {
                                const ingredient = ingredientsMap.get(item.ingredientId);
                                return { 
                                    name: ingredient?.name || 'Ingrediente no encontrado',
                                    typeIcon: <ShoppingCart size={18} className="text-blue-500"/>,
                                    cost: calculateRecipeItemCost(item, ingredientsMap, recipesMap)
                                };
                            }
                            const subRecipe = recipesMap.get(item.recipeId);
                            return { 
                                name: subRecipe?.name || 'Receta no encontrada',
                                typeIcon: <Book size={18} className="text-purple-500"/>,
                                cost: calculateRecipeItemCost(item, ingredientsMap, recipesMap)
                             };
                        })();

                        return (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border">
                                <div className="flex items-center gap-4">
                                    {typeIcon}
                                    <div>
                                        <p className="font-semibold">{name}</p>
                                        <p className="text-sm text-gray-500">{item.quantity} {UnitLabels[item.unit]}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-mono text-gray-700 w-24 text-right">{formatCurrency(cost)}</p>
                                    <button onClick={() => onEditItem(item)} className="text-gray-500 hover:text-amber-600"><Edit size={16} /></button>
                                    <button onClick={() => onDeleteItem(item.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};
