import React from 'react';

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        {children}
    </div>
);
