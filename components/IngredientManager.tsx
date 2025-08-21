import React from 'react';
import { Ingredient } from '../types';
import { calculateIngredientUnitCost } from '../services/costCalculator';
import { formatCurrency } from '../utils/formatters';
import { Card } from './ui/Card';
import { PrimaryButton } from './ui/PrimaryButton';
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
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ingredientes</h2>
            <div className="flex items-center gap-2">
                <button
                    onClick={onListen}
                    aria-label="Añadir ingrediente por voz"
                    className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                    <Mic size={20} />
                </button>
                <PrimaryButton onClick={onAdd} className="flex items-center gap-2 !py-2 !px-3">
                    <Plus size={18} />
                    <span className="hidden sm:inline">Nuevo</span>
                </PrimaryButton>
            </div>
        </div>
        <div className="space-y-3 pr-2 -mr-2 max-h-[400px] overflow-y-auto">
            {ingredients.map(ing => {
                const { cost, unit } = calculateIngredientUnitCost(ing);
                return (
                    <div key={ing.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                            <p className="font-semibold text-gray-800">{ing.name}</p>
                            <p className="text-sm text-gray-600">{formatCurrency(cost)} / {unit}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => onEdit(ing)} className="text-gray-400 hover:text-emerald-600 transition-colors"><Edit size={18} /></button>
                            <button onClick={() => onDelete(ing.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                        </div>
                    </div>
                );
            })}
        </div>
    </Card>
);
