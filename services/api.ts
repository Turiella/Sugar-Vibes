import { db } from '../firebaseConfig';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Ingredient, Recipe } from '../types';

/**
 * A robust way to remove any non-serializable properties (like functions or undefined)
 * and break any cyclical references before sending an object to Firestore.
 * @param obj The object to clean.
 * @returns A clean, serializable object.
 */
const deepClean = <T>(obj: T): T => {
    // This technique also removes properties with `undefined` values, which is good practice for Firestore.
    return JSON.parse(JSON.stringify(obj));
};


export const saveIngredientToDB = async (ingredient: Ingredient) => {
    const ingredientRef = doc(db, "ingredients", ingredient.id);
    // Deep clean the object right before it's sent to the database.
    await setDoc(ingredientRef, deepClean(ingredient));
};

export const deleteIngredientFromDB = async (id: string) => {
    await deleteDoc(doc(db, "ingredients", id));
};

export const saveRecipeToDB = async (recipe: Recipe) => {
    const recipeRef = doc(db, "recipes", recipe.id);
    // Deep clean the object right before it's sent to the database.
    await setDoc(recipeRef, deepClean(recipe));
};

export const deleteRecipeFromDB = async (id: string) => {
    await deleteDoc(doc(db, "recipes", id));
};