import React, { useState, useMemo } from 'react';
import { useFirestoreData } from './hooks/useFirestoreData';
import { IngredientManager } from './components/IngredientManager';
import { RecipeManager } from './components/RecipeManager';
import { RecipeDetailView } from './components/RecipeDetailView';
import { Ingredient, Recipe } from './types';

const App = () => {
    const { isLoading, ingredients: ingredientsMap, recipes: recipesMap } = useFirestoreData();
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    const ingredients = useMemo(() => Array.from(ingredientsMap.values()), [ingredientsMap]);
    const recipes = useMemo(() => Array.from(recipesMap.values()), [recipesMap]);

    const selectedRecipe = useMemo(() => {
        if (!selectedRecipeId) return null;
        return recipesMap.get(selectedRecipeId) || null;
    }, [selectedRecipeId, recipesMap]);

    // Placeholder handlers
    const handleAddIngredient = () => console.log('Add ingredient');
    const handleEditIngredient = (ing: Ingredient) => console.log('Edit ingredient', ing);
    const handleDeleteIngredient = (id: string) => console.log('Delete ingredient', id);
    const handleListenIngredients = () => console.log('Listen ingredients');

    const handleAddRecipe = () => console.log('Add recipe');
    const handleEditRecipe = (rec: Recipe) => console.log('Edit recipe', rec);
    const handleDeleteRecipe = (id: string) => console.log('Delete recipe', id);
    const handleListenRecipes = () => console.log('Listen recipes');

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
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
