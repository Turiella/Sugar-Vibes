import React, { useState, useMemo } from 'react';
import { useFirestoreData } from './hooks/useFirestoreData';
import { IngredientManager } from './components/IngredientManager';
import { RecipeManager } from './components/RecipeManager';
import { RecipeDetailView } from './components/RecipeDetailView';
import { IngredientFormModal } from './components/modals/IngredientFormModal';
import { RecipeFormModal } from './components/modals/RecipeFormModal';
import { Ingredient, Recipe } from './types';
import { doc, deleteDoc, setDoc, collection } from 'firebase/firestore';
import { db } from './firebaseConfig';

const App = () => {
    const { isLoading, ingredients: ingredientsMap, recipes: recipesMap } = useFirestoreData();
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    const ingredients = useMemo(() => Array.from(ingredientsMap.values()), [ingredientsMap]);
    const recipes = useMemo(() => Array.from(recipesMap.values()), [recipesMap]);

    const selectedRecipe = useMemo(() => {
        if (!selectedRecipeId) return null;
        return recipesMap.get(selectedRecipeId) || null;
    }, [selectedRecipeId, recipesMap]);

    // States for modals
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [showRecipeModal, setShowRecipeModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

    // Handlers for ingredients
    const handleAddIngredient = () => {
        setEditingIngredient(null);
        setShowIngredientModal(true);
    };

    const handleEditIngredient = (ing: Ingredient) => {
        setEditingIngredient(ing);
        setShowIngredientModal(true);
    };

    const handleSaveIngredient = async (ingredient: Omit<Ingredient, 'id'>) => {
        try {
            const ingredientRef = editingIngredient 
                ? doc(db, 'ingredients', editingIngredient.id)
                : doc(collection(db, 'ingredients'));
            
            await setDoc(ingredientRef, {
                ...ingredient,
                id: ingredientRef.id,
                updatedAt: new Date().toISOString(),
                createdAt: editingIngredient ? editingIngredient.createdAt : new Date().toISOString()
            }, { merge: true });

            setShowIngredientModal(false);
            setEditingIngredient(null);
        } catch (error) {
            console.error('Error saving ingredient:', error);
            alert('Error al guardar el ingrediente');
        }
    };

    const handleDeleteIngredient = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) return;
        
        try {
            await deleteDoc(doc(db, 'ingredients', id));
            console.log('Ingredient deleted successfully');
        } catch (error) {
            console.error('Error deleting ingredient:', error);
            alert('Error al eliminar el ingrediente');
        }
    };

    const handleListenIngredients = () => {
        // Implementar lógica de escucha si es necesario
        console.log('Listen ingredients');
    };

    // Handlers for recipes
    const handleAddRecipe = () => {
        setEditingRecipe(null);
        setShowRecipeModal(true);
    };

    const handleEditRecipe = (rec: Recipe) => {
        setEditingRecipe(rec);
        setShowRecipeModal(true);
    };

    const handleSaveRecipe = async (recipe: Omit<Recipe, 'id'>) => {
        try {
            const recipeRef = editingRecipe
                ? doc(db, 'recipes', editingRecipe.id)
                : doc(collection(db, 'recipes'));
            
            await setDoc(recipeRef, {
                ...recipe,
                id: recipeRef.id,
                updatedAt: new Date().toISOString(),
                createdAt: editingRecipe ? editingRecipe.createdAt : new Date().toISOString()
            }, { merge: true });

            setShowRecipeModal(false);
            setEditingRecipe(null);
        } catch (error) {
            console.error('Error saving recipe:', error);
            alert('Error al guardar la receta');
        }
    };

    const handleDeleteRecipe = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) return;
        
        try {
            await deleteDoc(doc(db, 'recipes', id));
            console.log('Recipe deleted successfully');
            setSelectedRecipeId(null);
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Error al eliminar la receta');
        }
    };

    const handleUpdateRecipeDetails = async (field: keyof Recipe, value: string | number) => {
        if (!selectedRecipe) return;
        
        try {
            const updatedRecipe = {
                ...selectedRecipe,
                [field]: field === 'laborCost' || field === 'overheadPercentage' 
                    ? parseFloat(value as string) 
                    : value
            };

            await setDoc(doc(db, 'recipes', selectedRecipe.id), updatedRecipe, { merge: true });
        } catch (error) {
            console.error('Error updating recipe details:', error);
            alert('Error al actualizar los detalles de la receta');
        }
    };

    const handleListenRecipes = () => {
        // Implementar lógica de escucha si es necesario
        console.log('Listen recipes');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Pastry Cost Calculator</h1>
                    </div>
                </div>
            </header>

            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-1 flex flex-col gap-8">
                            <IngredientManager
                                ingredients={ingredients}
                                onAdd={handleAddIngredient}
                                onEdit={handleEditIngredient}
                                onDelete={handleDeleteIngredient}
                                onListen={handleListenIngredients}
                            />
                        </div>
                        <div className="lg:col-span-2 flex flex-col gap-8">
                           <RecipeManager
                                recipes={recipes}
                                selectedRecipeId={selectedRecipeId}
                                onSelectRecipe={setSelectedRecipeId}
                                onAdd={handleAddRecipe}
                                onEdit={handleEditRecipe}
                                onDelete={handleDeleteRecipe}
                                onListen={handleListenRecipes}
                            />
                            {selectedRecipe && (
                                <RecipeDetailView
                                    recipe={selectedRecipe}
                                    ingredientsMap={ingredientsMap}
                                    onUpdateDetails={handleUpdateRecipeDetails}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <IngredientFormModal
                isOpen={showIngredientModal}
                onClose={() => {
                    setShowIngredientModal(false);
                    setEditingIngredient(null);
                }}
                onSave={handleSaveIngredient}
                initialData={editingIngredient}
            />

            <RecipeFormModal
                isOpen={showRecipeModal}
                onClose={() => {
                    setShowRecipeModal(false);
                    setEditingRecipe(null);
                }}
                onSave={handleSaveRecipe}
                recipe={editingRecipe}
                ingredients={ingredients}
                recipes={recipes}
                isSubmitting={false}
            />
        </div>
    );
};

export default App;
