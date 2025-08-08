import React from 'react';
import { Ingredient } from '../types';
import { calculateIngredientUnitCost } from '../services/costCalculator';
import { formatCurrency } from '../utils/formatters';
import { Card } from './ui/Card';
import { Mic, Plus, Edit, Trash2 } from 'lucide-react';

interface IngredientManagerProps {
    ingredients: Ingredient[];
    onAdd: () => void;
    onEdit: (ing: Ingredient) => void;
    onDelete: (id: string) => void;
    onListen: () => void;
}

export const IngredientManager: React.FC<IngredientManagerProps> = ({ ingredients, onAdd, onEdit, onDelete, onListen }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Ingredientes</h2>
            <div className="flex items-center gap-2">
                 <button onClick={onListen} aria-label="Añadir ingrediente por voz" className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors shadow-sm">
                    <Mic size={18} />
                </button>
                <button onClick={onAdd} className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 transition-colors shadow-sm">
                    <Plus size={18} /> <span className="hidden sm:inline">Nuevo</span>
                </button>
            </div>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {ingredients.map(ing => {
                const { cost, unit } = calculateIngredientUnitCost(ing);
                return (
                    <div key={ing.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
                        <div>
                            <p className="font-semibold">{ing.name}</p>
                            <p className="text-xs text-gray-500">{formatCurrency(cost)} / {unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onEdit(ing)} className="text-gray-500 hover:text-amber-600"><Edit size={16} /></button>
                            <button onClick={() => onDelete(ing.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
);
