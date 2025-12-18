export enum Unit {
    G = 'g',
    KG = 'kg',
    ML = 'ml',
    L = 'l',
    UNIT = 'unit',
}

export const UnitLabels: Record<Unit, string> = {
    [Unit.G]: 'g',
    [Unit.KG]: 'kg',
    [Unit.ML]: 'ml',
    [Unit.L]: 'l',
    [Unit.UNIT]: 'unidad',
};

export interface Ingredient {
    id: string;
    name: string;
    pricePerUnit: number;  // Cambiado de purchasePrice
    unit: Unit;           // Cambiado de purchaseUnit
    category?: string;     // Agregado
}

export interface RecipeItem {
    ingredientId: string;
    quantity: number;
}

export interface Recipe {
    id: string;
    name: string;
    items: RecipeItem[];
    instructions?: string;
    preparationTime: number; // en minutos
    portions: number;       // Cambiado de servings
    category?: string;      // Agregado
    createdAt?: Date;       // Agregado
    updatedAt?: Date;       // Agregado
}

// Para el formulario de ingredientes
export interface IngredientFormData {
    name: string;
    pricePerUnit: number;
    unit: Unit;
    category?: string;
}

// Para el formulario de recetas
export interface RecipeFormData {
    name: string;
    preparationTime: number;
    portions: number;
    instructions?: string;
    items: Array<{
        ingredientId: string;
        quantity: number;
    }>;
    category?: string;
}