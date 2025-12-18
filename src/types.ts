
export enum Unit {
    G = 'g',
    KG = 'kg',
    ML = 'ml',
    L = 'l',
    UNIT = 'unit',
}

export const UnitLabels: Record<Unit, string> = {
    [Unit.G]: 'Gramos (g)',
    [Unit.KG]: 'Kilogramos (kg)',
    [Unit.ML]: 'Mililitros (ml)',
    [Unit.L]: 'Litros (l)',
    [Unit.UNIT]: 'Unidades',
};

export interface Ingredient {
    id: string;
    name: string;
    purchasePrice: number;
    purchaseQuantity: number;
    purchaseUnit: Unit;
}

export interface RecipeItemBase {
    id: string;
    quantity: number;
    unit: Unit;
}

export interface IngredientItem extends RecipeItemBase {
    type: 'ingredient';
    ingredientId: string;
}

export interface SubRecipeItem extends RecipeItemBase {
    type: 'recipe';
    recipeId: string;
}

export type RecipeItem = IngredientItem | SubRecipeItem;

export interface Recipe {
    id: string;
    name: string;
    servings: number;
    items: RecipeItem[];
    laborCost: number;
    overheadPercentage: number;
}