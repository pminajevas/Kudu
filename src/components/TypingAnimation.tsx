"use client";

import { useState, useEffect } from 'react';

interface TypingAnimationProps {
    text: string;
    className?: string;
    speed?: number;
}

export default function TypingAnimation({ text, className = "", speed = 100 }: TypingAnimationProps) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        } else if (!isComplete) {
            setIsComplete(true);
        }
    }, [currentIndex, text, speed, isComplete]);

    return (
        <span className={className}>
            {displayText}
            {!isComplete && (
                <span className="animate-pulse text-[var(--secondary)]">|</span>
            )}
        </span>
    );
}
