import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const PrimaryButton: React.FC<ButtonProps> = ({ children, ...props }) => (
    <button
        {...props}
        className="w-full bg-emerald-500 text-white rounded-lg py-2 px-4 font-bold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
    >
        {children}
    </button>
);
