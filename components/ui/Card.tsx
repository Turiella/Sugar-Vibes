import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-white shadow-lg rounded-xl p-6 border border-gray-200 ${className}`}>
        {children}
    </div>
);
