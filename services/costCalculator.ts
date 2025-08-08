
import { Ingredient, Recipe, RecipeItem, Unit } from '../types';

// Define el factor de conversión directo a una unidad base más pequeña.
const CONVERSIONS = {
    [Unit.KG]: { to: Unit.G, factor: 1000 },
    [Unit.L]: { to: Unit.ML, factor: 1000 },
};

/**
 * Calcula el costo de un ingrediente por su unidad base (g, ml, o unit).
 * Esto simplifica todos los cálculos posteriores al trabajar con una unidad consistente.
 * @param ingredient El ingrediente para el cual calcular el costo.
 * @returns Un objeto que contiene el costo por unidad base y la unidad base misma.
 */
export const calculateIngredientUnitCost = (ingredient: Ingredient): { cost: number; unit: Unit } => {
    const conversion = CONVERSIONS[ingredient.purchaseUnit as keyof typeof CONVERSIONS];
    if (conversion) {
        const baseQuantity = ingredient.purchaseQuantity * conversion.factor;
        // Prevenir división por cero si la cantidad base es 0.
        if (baseQuantity === 0) return { cost: 0, unit: conversion.to };
        return { cost: ingredient.purchasePrice / baseQuantity, unit: conversion.to };
    }
    // Prevenir división por cero si la cantidad de compra es 0.
    if (ingredient.purchaseQuantity === 0) return { cost: 0, unit: ingredient.purchaseUnit };
    return { cost: ingredient.purchasePrice / ingredient.purchaseQuantity, unit: ingredient.purchaseUnit };
};

// Define los factores de conversión entre unidades compatibles.
// El tipo se actualiza a Partial<> para manejar correctamente unidades sin conversiones posibles (como UNIT).
const conversionFactors: Record<Unit, Partial<Record<Unit, number>>> = {
    [Unit.G]: { [Unit.KG]: 0.001 },
    [Unit.KG]: { [Unit.G]: 1000 },
    [Unit.ML]: { [Unit.L]: 0.001 },
    [Unit.L]: { [Unit.ML]: 1000 },
    [Unit.UNIT]: {},
};

/**
 * Convierte una cantidad de una unidad a otra unidad compatible.
 * @returns La cantidad convertida, o 0 si no se encuentra un factor de conversión.
 */
const getConvertedQuantity = (quantity: number, fromUnit: Unit, toUnit: Unit): number => {
    if (fromUnit === toUnit) return quantity;
    
    const factor = conversionFactors[fromUnit]?.[toUnit];

    if (factor === undefined) {
        console.error(`No se pudo encontrar un factor de conversión de ${fromUnit} a ${toUnit}.`);
        return 0; // Devolver 0 para evitar calcular el costo con una cantidad incorrecta.
    }
    
    return quantity * factor;
};

/**
 * Calcula el costo de un solo elemento en una receta, ya sea un ingrediente o una sub-receta.
 * @param visitedRecipes Un conjunto de IDs de recetas ya visitadas en la ruta de cálculo actual para detectar ciclos.
 */
export const calculateRecipeItemCost = (
    item: RecipeItem,
    ingredients: Map<string, Ingredient>,
    recipes: Map<string, Recipe>,
    visitedRecipes: Set<string> = new Set()
): number => {
    if (item.type === 'ingredient') {
        const ingredient = ingredients.get(item.ingredientId);
        if (!ingredient) return 0;

        const { cost: unitCost, unit: baseUnit } = calculateIngredientUnitCost(ingredient);
        
        const isItemUnitMass = item.unit === Unit.G || item.unit === Unit.KG;
        const isBaseUnitMass = baseUnit === Unit.G;
        const isItemUnitVolume = item.unit === Unit.L || item.unit === Unit.ML;
        const isBaseUnitVolume = baseUnit === Unit.ML;

        const areUnitsCompatible =
            (isItemUnitMass && isBaseUnitMass) ||
            (isItemUnitVolume && isBaseUnitVolume) ||
            (item.unit === Unit.UNIT && baseUnit === Unit.UNIT);

        if (!areUnitsCompatible) {
             console.warn(`Unidades incompatibles para el ingrediente '${ingredient.name}'. La receta requiere '${item.unit}', pero la unidad base del ingrediente es '${baseUnit}'. El costo se calculará como 0.`);
             return 0;
        }

        const quantityInBaseUnit = getConvertedQuantity(item.quantity, item.unit, baseUnit);
        return quantityInBaseUnit * unitCost;

    } else if (item.type === 'recipe') {
        // La detección de dependencias circulares se produce aquí.
        // `visitedRecipes` contiene todos los ancestros en la cadena de cálculo.
        if (visitedRecipes.has(item.recipeId)) {
            console.error(`Se detectó una dependencia circular de recetas: Se intentó añadir '${recipes.get(item.recipeId)?.name || item.recipeId}' de nuevo en la misma cadena de cálculo.`);
            return 0; // Detener el cálculo para evitar un bucle infinito.
        }
        
        const subRecipe = recipes.get(item.recipeId);
        if (!subRecipe) return 0;

        // Se pasa la ruta de cálculo actual a la llamada recursiva.
        // `calculateRecipeTotalCost` añadirá el ID de la sub-receta a una copia de esta ruta.
        const { totalCost: subRecipeTotalCost } = calculateRecipeTotalCost(subRecipe, ingredients, recipes, visitedRecipes);

        if (subRecipe.servings === 0) {
            console.warn(`La sub-receta '${subRecipe.name}' tiene 0 porciones, su costo por porción no se puede calcular y será 0.`);
            return 0; // Evitar división por cero.
        }

        if (item.unit !== Unit.UNIT) {
            console.warn(`La sub-receta '${subRecipe.name}' se está añadiendo con la unidad '${item.unit}'. Solo 'unidad' es una unidad válida para sub-recetas. Se asumirá que la cantidad se refiere a porciones.`);
        }
        
        const costPerServing = subRecipeTotalCost / subRecipe.servings;
        return item.quantity * costPerServing;
    }
    return 0;
};

/**
 * Calcula el desglose del costo total para una receta completa, incluyendo ingredientes, sub-recetas, mano de obra y gastos generales.
 * @param visitedRecipes Un conjunto de IDs de recetas ya visitadas en la ruta de cálculo actual para detectar ciclos.
 */
export const calculateRecipeTotalCost = (
    recipe: Recipe,
    ingredients: Map<string, Ingredient>,
    recipes: Map<string, Recipe>,
    visitedRecipes: Set<string> = new Set()
): { ingredientsCost: number; totalCost: number; costPerServing: number } => {
    
    // Se crea un nuevo Set para esta ruta de cálculo para evitar problemas de mutación en llamadas recursivas hermanas.
    // Esto es clave para una correcta detección de dependencias circulares en árboles complejos.
    const pathVisited = new Set(visitedRecipes);
    pathVisited.add(recipe.id);

    const ingredientsCost = recipe.items.reduce((sum, item) => {
        // Se pasa la ruta actualizada al cálculo del costo del elemento.
        return sum + calculateRecipeItemCost(item, ingredients, recipes, pathVisited);
    }, 0);

    const subTotal = ingredientsCost + recipe.laborCost;
    const totalCost = subTotal * (1 + recipe.overheadPercentage / 100);
    const costPerServing = recipe.servings > 0 ? totalCost / recipe.servings : 0;

    return { ingredientsCost, totalCost, costPerServing };
};
