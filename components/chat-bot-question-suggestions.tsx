'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const questionSuggestions = [
    'AI Assistant',
    'Conference schedule',
    'Conference speakers',
    'Conference tracks',
    'Conference events',
    'Conference sponsors',
    'Conference location',
    'Conference contact',
    'Conference website',
];

export function ChatBotQuestionSuggestions() {
    const [currentQuestion, setCurrentQuestion] = useState(questionSuggestions[0]);
    // const [dots, setDots] = useState('');

    useEffect(() => {
        // Rotate through question suggestions
        const questionInterval = setInterval(() => {
            setCurrentQuestion((prev) => {
                const currentIndex = questionSuggestions.indexOf(prev);
                const nextIndex = (currentIndex + 1) % questionSuggestions.length;
                return questionSuggestions[nextIndex];
            });
        }, 4000);

        // Animate dots
        // const dotsInterval = setInterval(() => {
        //     setDots((prev) => (prev.length >= 3 ? '' : prev + '👋🏾'));
        // }, 500);

        return () => {
            clearInterval(questionInterval);
            // clearInterval(dotsInterval);
        };
    }, []);

    return (
        <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center space-x-2 md:text-sm text-xs text-gray-500"
                >
                    {/* <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" /> */}
                    <span className="text-xs">
                        {currentQuestion}
                        <span className="inline-block px-1 animate-wave transition-all duration-1000">{`🥂`}</span>
                    </span>
                </motion.div>
            </AnimatePresence>
            <style jsx>{`
                @keyframes wave {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(-20deg); }
                    50% { transform: rotate(0deg); }
                    75% { transform: rotate(20deg); }
                    100% { transform: rotate(0deg); }
                }
                .animate-wave {
                    animation: wave 1s infinite;
                    transform-origin: 70% 70%;
                    display: inline-block;
                }
            `}</style>
        </div>
    );
} 