import React from 'react';
import { Recipe } from '../types';
import { Card } from './ui/Card';
import { PrimaryButton } from './ui/PrimaryButton';
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
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recetas</h2>
            <div className="flex items-center gap-2">
                 <button
                    onClick={onListen}
                    aria-label="Añadir receta por voz"
                    className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                    <Mic size={20} />
                </button>
                <PrimaryButton onClick={onAdd} className="flex items-center gap-2 !py-2 !px-3">
                    <Plus size={18} />
                    <span className="hidden sm:inline">Nueva</span>
                </PrimaryButton>
            </div>
        </div>
        <div className="space-y-3 pr-2 -mr-2 max-h-[400px] overflow-y-auto">
            {recipes.map(rec => (
                <div
                    key={rec.id}
                    onClick={() => onSelectRecipe(rec.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${selectedRecipeId === rec.id ? 'bg-emerald-100 ring-2 ring-emerald-500' : 'hover:bg-gray-100'}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                           <p className="font-bold text-gray-800">{rec.name}</p>
                           <p className="text-sm text-gray-600">{rec.servings} porciones</p>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(rec); }} className="text-gray-400 hover:text-emerald-600 transition-colors"><Edit size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(rec.id); }} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);
