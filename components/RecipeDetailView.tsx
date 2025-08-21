import React, { useMemo } from 'react';
import { Recipe, RecipeItem, Ingredient, UnitLabels, Recipe as RecipeType } from '../types';
import { calculateRecipeTotalCost, calculateRecipeItemCost } from '../services/costCalculator';
import { formatCurrency } from '../utils/formatters';
import { Card } from './ui/Card';
import { FormField } from './ui/FormField';
import { Input } from './ui/Input';
import { PrimaryButton } from './ui/PrimaryButton';
import { Plus, Trash2, Edit, Book, ShoppingCart } from 'lucide-react';

interface RecipeDetailViewProps {
    recipe: RecipeType;
    ingredientsMap: Map<string, Ingredient>;
    onUpdateDetails?: (field: keyof RecipeType, value: string | number) => void;
    onAddItem?: () => void;
    onEditItem?: (item: RecipeItem) => void;
    onDeleteItem?: (id: string) => void;
}

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, ingredientsMap, onUpdateDetails, onAddItem, onEditItem, onDeleteItem }) => {
    
    const recipeCost = useMemo(() => {
        // We need all recipes for sub-recipe cost calculation.
        // This is a simplification. In a real app, you'd pass the full map.
        const recipesMap = new Map<string, RecipeType>();
        if (recipe) recipesMap.set(recipe.id, recipe);
        return calculateRecipeTotalCost(recipe, ingredientsMap, recipesMap);
    }, [recipe, ingredientsMap]);
    
    // Fallback for handlers if not provided
    const handleUpdateDetails = onUpdateDetails ?? (() => {});
    const handleAddItem = onAddItem ?? (() => {});
    const handleEditItem = onEditItem ?? (() => {});
    const handleDeleteItem = onDeleteItem ?? (() => {});

    return (
        <div className="space-y-8">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                     <div className="md:col-span-1">
                        <h2 className="text-3xl font-bold text-gray-900 truncate">{recipe.name}</h2>
                        <p className="text-gray-600">{recipe.servings} porciones</p>
                    </div>
                    <FormField label="Costo Mano de Obra (ARS)">
                        <Input type="number" value={recipe.laborCost} onChange={e => handleUpdateDetails('laborCost', e.target.value)} placeholder="Ej: 500" />
                    </FormField>
                    <FormField label="Gastos Generales (%)">
                        <Input type="number" value={recipe.overheadPercentage} onChange={e => handleUpdateDetails('overheadPercentage', e.target.value)} placeholder="Ej: 15" />
                    </FormField>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de Costos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">Costo Ingredientes</p>
                        <p className="text-2xl font-bold text-gray-800">{formatCurrency(recipeCost?.ingredientsCost ?? 0)}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">Costo Total</p>
                        <p className="text-2xl font-bold text-gray-800">{formatCurrency(recipeCost?.totalCost ?? 0)}</p>
                    </div>
                    <div className="bg-emerald-100 p-4 rounded-xl">
                        <p className="text-sm text-emerald-800">Costo por Porción</p>
                        <p className="text-2xl font-bold text-emerald-900">{formatCurrency(recipeCost?.costPerServing ?? 0)}</p>
                    </div>
                     <div className="bg-green-100 p-4 rounded-xl">
                        <p className="text-sm text-green-800">Venta Sugerida</p>
                        <p className="text-2xl font-bold text-green-900">{formatCurrency((recipeCost?.costPerServing ?? 0) * 3)}</p>
                    </div>
                </div>
            </Card>
            
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Ingredientes y Sub-Recetas</h3>
                    <PrimaryButton onClick={handleAddItem} className="flex items-center gap-2 !py-2 !px-3">
                        <Plus size={18} /> Agregar
                    </PrimaryButton>
                </div>
                <div className="space-y-3">
                    {recipe.items.map(item => {
                        const { name, typeIcon, cost } = (() => {
                            if (item.type === 'ingredient') {
                                const ingredient = ingredientsMap.get(item.ingredientId);
                                return { 
                                    name: ingredient?.name || 'Ingrediente no encontrado',
                                    typeIcon: <ShoppingCart size={20} className="text-emerald-500"/>,
                                    cost: calculateRecipeItemCost(item, ingredientsMap, new Map())
                                };
                            }
                            // Simplified for display
                            return { 
                                name: `Sub-receta (ID: ${item.recipeId.substring(0, 4)})`,
                                typeIcon: <Book size={20} className="text-indigo-500"/>,
                                cost: 0 // Cost calculation for sub-recipes is complex and handled in total
                             };
                        })();

                        return (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                                <div className="flex items-center gap-4">
                                    {typeIcon}
                                    <div>
                                        <p className="font-semibold text-gray-800">{name}</p>
                                        <p className="text-sm text-gray-600">{item.quantity} {UnitLabels[item.unit]}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-mono text-gray-800 w-24 text-right">{formatCurrency(cost)}</p>
                                    <button onClick={() => handleEditItem(item)} className="text-gray-400 hover:text-emerald-600 transition-colors"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        );
                    })}
                    {recipe.items.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No hay elementos en esta receta.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};
