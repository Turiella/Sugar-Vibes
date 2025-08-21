import React from 'react';

interface ModalContainerProps {
    children: React.ReactNode;
    onClose: () => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({ children, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-xl shadow-xl w-full max-w-md m-4"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);
