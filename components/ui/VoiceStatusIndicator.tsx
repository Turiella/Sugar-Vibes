import React from 'react';
import { Mic, LoaderCircle } from 'lucide-react';
import { VoiceStatus } from '../../hooks/useVoiceCommands';

export const VoiceStatusIndicator: React.FC<{ status: VoiceStatus }> = ({ status }) => {
    if (status.type === 'idle') return null;

    const baseClasses = 'fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold flex items-center gap-3 z-50';
    const colorClasses = {
        listening: 'bg-blue-500',
        processing: 'bg-amber-500',
        error: 'bg-red-500',
    };

    return (
        <div className={`${baseClasses} ${colorClasses[status.type]}`}>
            {status.type === 'listening' && <Mic size={20} className="animate-pulse" />}
            {status.type === 'processing' && <LoaderCircle size={20} className="animate-spin" />}
            <span>{status.message}</span>
        </div>
    );
};
