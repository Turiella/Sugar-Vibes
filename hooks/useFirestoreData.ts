import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    collection, 
    onSnapshot, 
    query, 
    orderBy, 
    addDoc, 
    updateDoc, 
    doc, 
    deleteDoc, 
    DocumentData,
    getDocs,
    writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ingredient, Recipe } from '../types';

export const useFirestoreData = () => {
    const [ingredients, setIngredients] = useState<Map<string, Ingredient>>(new Map());
    const [recipes, setRecipes] = useState<Map<string, Recipe>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const isInitialized = useRef(false);

    // Función para agregar un ingrediente
    const addIngredient = useCallback(async (ingredient: Omit<Ingredient, 'id'>): Promise<Ingredient> => {
        try {
            const docRef = await addDoc(collection(db, 'ingredients'), ingredient);
            return { ...ingredient, id: docRef.id } as Ingredient;
        } catch (error) {
            console.error('Error al agregar el ingrediente:', error);
            throw error;
        }
    }, []);

    // Función para actualizar un ingrediente
    const updateIngredient = useCallback(async (ingredient: Ingredient): Promise<void> => {
        try {
            const { id, ...ingredientData } = ingredient;
            await updateDoc(doc(db, 'ingredients', id), ingredientData as DocumentData);
        } catch (error) {
            console.error('Error al actualizar el ingrediente:', error);
            throw error;
        }
    }, []);

    // Función para eliminar un ingrediente
    const deleteIngredient = useCallback(async (id: string): Promise<void> => {
        try {
            await deleteDoc(doc(db, 'ingredients', id));
        } catch (error) {
            console.error('Error al eliminar el ingrediente:', error);
            throw error;
        }
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        const ingredientsCol = collection(db, 'ingredients');
        const recipesCol = collection(db, 'recipes');

        const loadData = async () => {
            try {
                const [ingredientsSnapshot, recipesSnapshot] = await Promise.all([
                    getDocs(ingredientsCol),
                    getDocs(recipesCol)
                ]);

                // Configurar listeners en tiempo real
                const unsubscribeIngredients = onSnapshot(
                    query(ingredientsCol, orderBy('name')), 
                    (snapshot) => {
                        const ingredientsMap = new Map<string, Ingredient>();
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.name && data.pricePerUnit && data.unit) {
                                ingredientsMap.set(doc.id, { 
                                    id: doc.id, 
                                    ...data 
                                } as Ingredient);
                            }
                        });
                        setIngredients(ingredientsMap);
                        setIsLoading(false);
                    },
                    (error) => {
                        console.error('Error al cargar ingredientes:', error);
                        setIsLoading(false);
                    }
                );

                const unsubscribeRecipes = onSnapshot(
                    query(recipesCol, orderBy('name')),
                    (snapshot) => {
                        const recipesMap = new Map<string, Recipe>();
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            if (data.name && data.items) {
                                recipesMap.set(doc.id, {
                                    id: doc.id,
                                    ...data
                                } as Recipe);
                            }
                        });
                        setRecipes(recipesMap);
                    },
                    (error) => {
                        console.error('Error al cargar recetas:', error);
                    }
                );

                return () => {
                    unsubscribeIngredients();
                    unsubscribeRecipes();
                };
            } catch (error) {
                console.error('Error al cargar datos iniciales:', error);
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        isLoading,
        ingredients,
        recipes,
        addIngredient,
        updateIngredient,
        deleteIngredient
    };
};