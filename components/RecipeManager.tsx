import React from 'react';
import { Recipe } from '../types';
import { Card } from './ui/Card';
import { Mic, Plus, Edit, Trash2 } from 'lucide-react';

interface RecipeManagerProps {
    recipes: Recipe[];
    selectedRecipeId: string | null;
    onSelectRecipe: (id: string) => void;
    onAdd: () => void;
    onEdit: (rec: Recipe) => void;
    onDelete: (id: string) => void;
    onListen: () => void;
}

export const RecipeManager: React.FC<RecipeManagerProps> = ({ recipes, selectedRecipeId, onSelectRecipe, onAdd, onEdit, onDelete, onListen }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recetas</h2>
            <div className="flex items-center gap-2">
                <button onClick={onListen} aria-label="Añadir receta por voz" className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors shadow-sm">
                    <Mic size={18} />
                </button>
                <button onClick={onAdd} className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 transition-colors shadow-sm">
                    <Plus size={18} /> <span className="hidden sm:inline">Nueva</span>
                </button>
            </div>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {recipes.map(rec => (
                <div
                    key={rec.id}
                    onClick={() => onSelectRecipe(rec.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${selectedRecipeId === rec.id ? 'bg-amber-100 ring-2 ring-amber-500' : 'hover:bg-amber-50'}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                           <p className="font-bold">{rec.name}</p>
                           <p className="text-xs text-gray-500">{rec.servings} porciones</p>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(rec); }} className="text-gray-500 hover:text-amber-600"><Edit size={16} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(rec.id); }} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);
