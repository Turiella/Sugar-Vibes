import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const SecondaryButton: React.FC<ButtonProps> = ({ children, ...props }) => (
    <button
        {...props}
        className="w-full bg-gray-200 text-gray-800 rounded-lg py-2 px-4 font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all disabled:opacity-50"
    >
        {children}
    </button>
);
