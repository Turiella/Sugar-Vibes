
import { Ingredient, Recipe, Unit } from './types';

export const initialIngredients: Ingredient[] = [
    { id: 'ing1', name: 'Harina de Trigo', purchasePrice: 2500, purchaseQuantity: 1, purchaseUnit: Unit.KG },
    { id: 'ing2', name: 'Azúcar', purchasePrice: 3000, purchaseQuantity: 1, purchaseUnit: Unit.KG },
    { id: 'ing3', name: 'Huevo', purchasePrice: 2000, purchaseQuantity: 12, purchaseUnit: Unit.UNIT },
    { id: 'ing4', name: 'Mantequilla sin sal', purchasePrice: 4000, purchaseQuantity: 500, purchaseUnit: Unit.G },
    { id: 'ing5', name: 'Leche Entera', purchasePrice: 1200, purchaseQuantity: 1, purchaseUnit: Unit.L },
    { id: 'ing6', name: 'Chocolate 70%', purchasePrice: 5500, purchaseQuantity: 200, purchaseUnit: Unit.G },
];

export const initialRecipes: Recipe[] = [
    {
        id: 'rec1',
        name: 'Crema Pastelera Base',
        servings: 4,
        items: [
            { id: 'item1', type: 'ingredient', ingredientId: 'ing5', quantity: 500, unit: Unit.ML },
            { id: 'item2', type: 'ingredient', ingredientId: 'ing3', quantity: 4, unit: Unit.UNIT },
            { id: 'item3', type: 'ingredient', ingredientId: 'ing2', quantity: 100, unit: Unit.G },
        ],
        laborCost: 5000,
        overheadPercentage: 10,
    },
    {
        id: 'rec2',
        name: 'Torta de Chocolate Intenso',
        servings: 12,
        items: [
            { id: 'item4', type: 'ingredient', ingredientId: 'ing1', quantity: 250, unit: Unit.G },
            { id: 'item5', type: 'ingredient', ingredientId: 'ing2', quantity: 300, unit: Unit.G },
            { id: 'item6', type: 'ingredient', ingredientId: 'ing6', quantity: 200, unit: Unit.G },
            { id: 'item7', type: 'ingredient', ingredientId: 'ing4', quantity: 150, unit: Unit.G },
            { id: 'item8', type: 'recipe', recipeId: 'rec1', quantity: 1, unit: Unit.UNIT },
        ],
        laborCost: 15000,
        overheadPercentage: 20,
    },
];