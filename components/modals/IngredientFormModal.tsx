import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { FormField } from '../ui/FormField';
import { PrimaryButton } from '../ui/PrimaryButton';
import { SecondaryButton } from '../ui/SecondaryButton';
import { Ingredient, Unit, UnitLabels } from '../../types';

interface IngredientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ingredient: Omit<Ingredient, 'id'> & { id?: string }) => void;
    ingredient: Ingredient | null;
    isSubmitting: boolean;
}

export const IngredientFormModal: React.FC<IngredientFormModalProps> = ({ isOpen, onClose, onSave, ingredient, isSubmitting }) => {
    const [name, setName] = useState('');
    const [pricePerUnit, setPricePerUnit] = useState('');
    const [unit, setUnit] = useState<Unit>(Unit.KG);
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (ingredient) {
                setName(ingredient.name);
                setPricePerUnit(String(ingredient.pricePerUnit || ''));
                setUnit(ingredient.unit);
                setCategory(ingredient.category || '');
            } else {
                setName('');
                setPricePerUnit('');
                setUnit(Unit.KG);
                setCategory('');
            }
        }
    }, [ingredient, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: ingredient?.id,
            name,
            pricePerUnit: parseFloat(pricePerUnit) || 0,
            unit,
            ...(category && { category }),
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ingredient?.id ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                    <FormField label="Nombre del Ingrediente">
                        <Input 
                            id="ing-name" 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            placeholder="Ej: Harina 0000" 
                            className="w-full"
                        />
                    </FormField>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField label="Precio por Unidad">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <Input
                                    id="ing-price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={pricePerUnit}
                                    onChange={e => setPricePerUnit(e.target.value)}
                                    required
                                    placeholder="0.00"
                                    className="pl-8 w-full"
                                />
                            </div>
                        </FormField>
                        
                        <FormField label="Unidad">
                            <div className="relative">
                                <Select
                                    id="ing-unit"
                                    value={unit}
                                    onChange={e => setUnit(e.target.value as Unit)}
                                    className="w-full"
                                >
                                    {Object.entries(UnitLabels).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                        </FormField>
                    </div>
                    
                    <FormField label="Categoría (opcional)">
                        <Input
                            id="ing-category"
                            type="text"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            placeholder="Ej: Harinas, Lácteos, etc."
                            className="w-full"
                        />
                    </FormField>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        {ingredient?.id ? 'Actualiza los datos del ingrediente' : 'Completa los campos requeridos'}
                    </div>
                    <div className="flex gap-3">
                        <SecondaryButton 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2"
                        >
                            Cancelar
                        </SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            disabled={isSubmitting}
                            className="px-6 py-2"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
