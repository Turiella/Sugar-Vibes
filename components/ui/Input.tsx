import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string; // Make label optional
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
    const inputElement = (
        <input
            id={id}
            {...props}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        />
    );

    if (label) {
        return (
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                {inputElement}
            </div>
        );
    }

    return inputElement;
};
