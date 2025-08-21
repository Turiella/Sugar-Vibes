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
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Nombre del Ingrediente">
                    <Input id="ing-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Harina 0000" />
                </FormField>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Precio (ARS)">
                        <Input id="ing-price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required placeholder="Ej: 1500.50" />
                    </FormField>
                    <FormField label="Cantidad">
                        <Input id="ing-quantity" type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} required placeholder="Ej: 1" />
                    </FormField>
                    <FormField label="Unidad">
                        <Select id="ing-unit" value={unit} onChange={e => setUnit(e.target.value as Unit)}>
                            {Object.entries(UnitLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </Select>
                    </FormField>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <SecondaryButton type="button" onClick={onClose}>Cancelar</SecondaryButton>
                    <PrimaryButton type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};
