import { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Ingredient, Recipe, Unit } from '../types';

export interface VoiceStatus {
    type: 'idle' | 'listening' | 'processing' | 'error';
    message: string;
}

interface UseVoiceCommandsProps {
    openIngredientModal: (ingredient: Ingredient | null) => void;
    openRecipeModal: (recipe: Recipe | null) => void;
}

export const useVoiceCommands = ({ openIngredientModal, openRecipeModal }: UseVoiceCommandsProps) => {
    const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({ type: 'idle', message: '' });
    const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);
    
    const processVoiceCommand = async (transcript: string, type: 'ingredient' | 'recipe') => {
        setVoiceStatus({ type: 'processing', message: 'Procesando comando...' });
        try {
            const ingredientSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Nombre del ingrediente" },
                    purchasePrice: { type: Type.NUMBER, description: "Costo de compra del ingrediente en pesos argentinos" },
                    purchaseQuantity: { type: Type.NUMBER, description: "Cantidad de la compra" },
                    purchaseUnit: { type: Type.STRING, description: `Unidad de medida de la compra. Debe ser uno de: ${Object.values(Unit).join(', ')}` },
                },
                required: ["name", "purchasePrice", "purchaseQuantity", "purchaseUnit"]
            };

            const recipeSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Nombre de la receta" },
                    servings: { type: Type.NUMBER, description: "Número de porciones que rinde la receta" },
                },
                required: ["name", "servings"]
            };

            const schema = type === 'ingredient' ? ingredientSchema : recipeSchema;
            const prompt = `Extrae la información de un comando de voz para una app de repostería. El usuario dijo: "${transcript}". Responde únicamente con el JSON estructurado según el schema proporcionado. La moneda es pesos argentinos. Las unidades deben ser normalizadas (ej. 'kilo' o 'kg' a 'kg', 'gramos' a 'g', 'litro' a 'l').`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                }
            });

            const data = JSON.parse(response.text);

            if (type === 'ingredient') {
                const newIngredient: Ingredient = {
                    id: '', // será asignado al guardar
                    name: data.name,
                    purchasePrice: data.purchasePrice,
                    purchaseQuantity: data.purchaseQuantity,
                    purchaseUnit: data.purchaseUnit in Unit ? data.purchaseUnit as Unit : Unit.G, // Fallback
                };
                openIngredientModal(newIngredient);
            } else { // type === 'recipe'
                const newRecipe: Recipe = {
                    id: '', // será asignado al guardar
                    name: data.name,
                    servings: data.servings,
                    items: [],
                    laborCost: 0,
                    overheadPercentage: 15,
                };
                openRecipeModal(newRecipe);
            }
            setVoiceStatus({ type: 'idle', message: '' });

        } catch (error) {
            console.error('Error procesando el comando de voz:', error);
            setVoiceStatus({ type: 'error', message: 'No pude entender el comando. Intenta de nuevo.' });
            setTimeout(() => setVoiceStatus({ type: 'idle', message: '' }), 3000);
        }
    };

    const handleListen = (type: 'ingredient' | 'recipe') => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceStatus({ type: 'error', message: 'Reconocimiento de voz no soportado en este navegador.' });
            setTimeout(() => setVoiceStatus({ type: 'idle', message: '' }), 3000);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'es-AR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setVoiceStatus({ type: 'listening', message: 'Escuchando...' });
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            processVoiceCommand(transcript, type);
        };

        recognition.onspeechend = () => {
            recognition.stop();
        };
        
        recognition.onend = () => {
            // Check if still in listening state to avoid overriding processing/error states
            setVoiceStatus(currentStatus => currentStatus.type === 'listening' ? { type: 'idle', message: '' } : currentStatus);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setVoiceStatus({ type: 'error', message: `Error: ${event.error}. Intenta de nuevo.` });
            setTimeout(() => setVoiceStatus({ type: 'idle', message: '' }), 3000);
        };

        recognition.start();
    };
    
    return { voiceStatus, handleListen };
};
