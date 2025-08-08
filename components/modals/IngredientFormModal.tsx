import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Ingredient, Unit, UnitLabels } from '../../types';

interface IngredientFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ingredient: Ingredient) => void;
    ingredient: Ingredient | null;
    isSubmitting: boolean;
}

export const IngredientFormModal: React.FC<IngredientFormModalProps> = ({ isOpen, onClose, onSave, ingredient, isSubmitting }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState<Unit>(Unit.KG);

    useEffect(() => {
        if (isOpen) {
            if (ingredient) {
                setName(ingredient.name);
                setPrice(String(ingredient.purchasePrice || ''));
                setQuantity(String(ingredient.purchaseQuantity || ''));
                setUnit(ingredient.purchaseUnit);
            } else {
                setName('');
                setPrice('');
                setQuantity('');
                setUnit(Unit.KG);
            }
        }
    }, [ingredient, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: ingredient?.id || `ing_${Date.now()}`,
            name,
            purchasePrice: parseFloat(price) || 0,
            purchaseQuantity: parseFloat(quantity) || 0,
            purchaseUnit: unit,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ingredient?.id ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nombre del Ingrediente" id="ing-name" type="text" value={name} onChange={e => setName(e.target.value)} required />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input label="Precio de Compra (ARS)" id="ing-price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                    <Input label="Cantidad Comprada" id="ing-quantity" type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required />
                    <Select label="Unidad de Compra" id="ing-unit" value={unit} onChange={e => setUnit(e.target.value as Unit)}>
                        {Object.entries(UnitLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </Select>
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
