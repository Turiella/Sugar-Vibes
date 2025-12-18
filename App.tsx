import './index.css';
import React, { useState, useMemo, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useFirestoreData } from './hooks/useFirestoreData';
import { IngredientManager } from './components/IngredientManager';
import { RecipeManager } from './components/RecipeManager';
import { RecipeDetailView } from './components/RecipeDetailView';
import { IngredientFormModal } from './components/modals/IngredientFormModal';
import { Ingredient, Recipe } from './types';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  ChefHat, 
  Plus, 
  Package, 
  Utensils, 
  DollarSign,
  ArrowLeft
} from 'lucide-react';

const App = () => {
    const { 
        isLoading, 
        ingredients: ingredientsMap, 
        recipes: recipesMap,
        addIngredient,
        updateIngredient,
        deleteIngredient
    } = useFirestoreData();
    
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ingredients = useMemo(() => Array.from(ingredientsMap.values()), [ingredientsMap]);
    const recipes = useMemo(() => Array.from(recipesMap.values()), [recipesMap]);
    
    // Verificar si hay datos cargados
    const hasData = useMemo(() => {
        return !isLoading && (ingredients.length > 0 || recipes.length > 0);
    }, [isLoading, ingredients.length, recipes.length]);

    const selectedRecipe = useMemo(() => {
        if (!selectedRecipeId) return null;
        return recipesMap.get(selectedRecipeId) || null;
    }, [selectedRecipeId, recipesMap]);

    // Handlers para ingredientes
    const handleAddIngredient = useCallback(() => {
        setEditingIngredient(null);
        setIsIngredientModalOpen(true);
    }, []);

    const handleEditIngredient = useCallback((ingredient: Ingredient) => {
        setEditingIngredient(ingredient);
        setIsIngredientModalOpen(true);
    }, []);

    const handleSaveIngredient = useCallback(async (ingredientData: Omit<Ingredient, 'id'> & { id?: string }) => {
        try {
            setIsSubmitting(true);
            if (editingIngredient) {
                await updateIngredient({
                    ...ingredientData,
                    id: editingIngredient.id
                } as Ingredient);
                toast.success('Ingrediente actualizado correctamente');
            } else {
                // Crear un nuevo objeto sin la propiedad id
                const newIngredient: Omit<Ingredient, 'id'> = {
                    name: ingredientData.name,
                    pricePerUnit: ingredientData.pricePerUnit,
                    unit: ingredientData.unit,
                    category: ingredientData.category
                };
                await addIngredient(newIngredient);
                toast.success('Ingrediente agregado correctamente');
            }
            setIsIngredientModalOpen(false);
        } catch (error) {
            console.error('Error al guardar el ingrediente:', error);
            toast.error('Error al guardar el ingrediente');
        } finally {
            setIsSubmitting(false);
        }
    }, [editingIngredient, addIngredient, updateIngredient]);

    const handleDeleteIngredient = useCallback(async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este ingrediente?')) {
            try {
                await deleteIngredient(id);
                toast.success('Ingrediente eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar el ingrediente:', error);
                toast.error('Error al eliminar el ingrediente');
            }
        }
    }, [deleteIngredient]);

    // Handlers para recetas
    const handleAddRecipe = () => {
    // Lógica para abrir el modal de agregar receta
    console.log('Agregar receta');
};

const handleEditRecipe = (recipe: Recipe) => {
    // Lógica para editar la receta
    console.log('Editar receta:', recipe);
};

const handleDeleteRecipe = (id: string) => {
    // Lógica para eliminar la receta
    console.log('Eliminar receta:', id);
};
    // Calcular costos
    const calculateRecipeCost = useCallback((recipe: Recipe) => {
        if (!recipe?.items) return 0;
        return recipe.items.reduce((total, item) => {
            const ingredient = ingredientsMap.get(item.ingredientId);
            return total + ((ingredient?.pricePerUnit || 0) * (item.quantity || 0));
        }, 0);
    }, [ingredientsMap]);

    const calculateCostPerServing = useCallback((recipe: Recipe) => {
        if (!recipe?.portions || recipe.portions <= 0) return 0;
        return calculateRecipeCost(recipe) / recipe.portions;
    }, [calculateRecipeCost]);

    // Mostrar estado de carga
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center space-y-4">
                    <div className="animate-pulse flex space-x-4 items-center">
                        <ChefHat className="h-12 w-12 text-blue-500 animate-bounce" />
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar estado vacío si no hay datos
    if (!hasData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                        <ChefHat className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
                    <p className="text-gray-500 mb-6">Comienza agregando tu primer ingrediente para empezar.</p>
                    <button
                        onClick={handleAddIngredient}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Ingrediente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Toaster position="top-center" />
            
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <Calculator className="h-8 w-8 text-blue-600" />
                            <h1 className="text-xl font-bold text-gray-900">Pastry Cost Pro</h1>
                        </div>
                        
                        {/* Mobile menu button */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Mobile Menu Overlay */}
                    <AnimatePresence>
                        {(mobileMenuOpen || window.innerWidth >= 1024) && (
                            <motion.div 
                                className="lg:col-span-3 space-y-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Sección de Ingredientes */}
                                <div className="bg-white rounded-xl shadow overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                                <Package className="h-5 w-5 mr-2 text-blue-500" />
                                                Ingredientes
                                            </h2>
                                            <button
                                                onClick={handleAddIngredient}
                                                className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <IngredientManager
                                        ingredients={ingredients}
                                        onEdit={handleEditIngredient}
                                        onDelete={handleDeleteIngredient}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Contenido Principal */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Sección de Recetas */}
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <Utensils className="h-5 w-5 mr-2 text-blue-500" />
                                        Recetas
                                    </h2>
                                    <button
                                        onClick={handleAddRecipe}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Nueva
                                    </button>
                                </div>
                            </div>
                            <RecipeManager
                                recipes={recipes}
                                onSelect={setSelectedRecipeId}
                                onEdit={handleEditRecipe}
                                onDelete={handleDeleteRecipe}
                                calculateCost={calculateRecipeCost}
                            />
                        </div>

                        {/* Vista de Detalle de Receta */}
                        <AnimatePresence>
                            {selectedRecipe && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-xl shadow overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() => setSelectedRecipeId(null)}
                                                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                                            >
                                                <ArrowLeft className="h-4 w-4 mr-1" />
                                                Volver
                                            </button>
                                            <div className="flex space-x-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    Costo total: ${calculateRecipeCost(selectedRecipe).toFixed(2)}
                                                </span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    <DollarSign className="h-3 w-3 mr-1" />
                                                    Por porción: ${calculateCostPerServing(selectedRecipe).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <RecipeDetailView 
                                        recipe={selectedRecipe} 
                                        ingredients={ingredients}
                                        calculateCost={calculateRecipeCost}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Pastry Cost Pro. Herramienta profesional para pastelería.
                    </p>
                </div>
            </footer>

            {/* Modal de Ingrediente */}
            <IngredientFormModal
                isOpen={isIngredientModalOpen}
                onClose={() => {
                    setIsIngredientModalOpen(false);
                    setEditingIngredient(null);
                }}
                onSave={handleSaveIngredient}
                ingredient={editingIngredient}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default App;