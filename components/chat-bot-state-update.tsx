'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const loadingStates = [
    'Initializing conversation',
    'Thinking about your request',
    'Creating context',
    'Analyzing context',
    'Updating information',
    'Summarizing thoughts',
    'Preparing response',
];

export function ChatBotStateUpdate() {
    const [currentState, setCurrentState] = useState(loadingStates[0]);
    const [dots, setDots] = useState('');

    useEffect(() => {
        // Rotate through loading states
        const stateInterval = setInterval(() => {
            setCurrentState((prev) => {
                const currentIndex = loadingStates.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingStates.length;
                return loadingStates[nextIndex];
            });
        }, 3000);

        // Animate dots
        const dotsInterval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);

        return () => {
            clearInterval(stateInterval);
            clearInterval(dotsInterval);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 md:text-sm text-xs text-gray-500"
        >
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span>
                {currentState}
                {dots}
            </span>
        </motion.div>
    );
}
