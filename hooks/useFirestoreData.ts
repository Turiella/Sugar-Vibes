import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ingredient, Recipe } from '../types';
import { initialIngredients, initialRecipes } from '../data';

export const useFirestoreData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [ingredients, setIngredients] = useState<Map<string, Ingredient>>(new Map());
    const [recipes, setRecipes] = useState<Map<string, Recipe>>(new Map());
    const isInitialized = useRef(false);

    useEffect(() => {
        // This effect should only run once.
        if (isInitialized.current) return;
        isInitialized.current = true;

        const ingredientsCol = collection(db, 'ingredients');
        const recipesCol = collection(db, 'recipes');
        let unsubIngredients: () => void;
        let unsubRecipes: () => void;

        const initialize = async () => {
            try {
                // Check if data exists in the database
                const [ingredientsSnapshot, recipesSnapshot] = await Promise.all([
                    getDocs(ingredientsCol),
                    getDocs(recipesCol),
                ]);

                // If the database is empty, populate it with initial data.
                if (ingredientsSnapshot.empty && recipesSnapshot.empty) {
                    console.log("Database appears empty. Populating with initial data...");
                    const batch = writeBatch(db);
                    initialIngredients.forEach(ing => {
                        const ingRef = doc(db, 'ingredients', ing.id);
                        batch.set(ingRef, ing);
                    });
                    initialRecipes.forEach(rec => {
                        const recRef = doc(db, 'recipes', rec.id);
                        batch.set(recRef, rec);
                    });
                    await batch.commit();
                    console.log("Initial data populated successfully.");
                }

                // Set up real-time listeners for both collections.
                unsubIngredients = onSnapshot(ingredientsCol, (snapshot) => {
                    const newIngredients = new Map<string, Ingredient>();
                    snapshot.docs.forEach(doc => newIngredients.set(doc.id, doc.data() as Ingredient));
                    setIngredients(newIngredients);
                    // Stop loading after the first successful data retrieval.
                    if (isLoading) {
                       setIsLoading(false);
                    }
                }, (error) => {
                    console.error("Error listening to ingredients:", error);
                    alert("Error al cargar ingredientes.");
                    setIsLoading(false);
                });

                unsubRecipes = onSnapshot(recipesCol, (snapshot) => {
                    const newRecipes = new Map<string, Recipe>();
                    snapshot.docs.forEach(doc => newRecipes.set(doc.id, doc.data() as Recipe));
                    setRecipes(newRecipes);
                }, (error) => {
                    console.error("Error listening to recipes:", error);
                    alert("Error al cargar recetas.");
                    setIsLoading(false);
                });

            } catch (error) {
                console.error("Failed to initialize Firestore data:", error);
                setIsLoading(false);
                alert("No se pudo conectar a la base de datos.");
            }
        };

        initialize();

        // Cleanup listeners on component unmount.
        return () => {
            if (unsubIngredients) unsubIngredients();
            if (unsubRecipes) unsubRecipes();
        };
    }, []); // Empty dependency array ensures this runs only once.

    return { isLoading, ingredients, recipes };
};