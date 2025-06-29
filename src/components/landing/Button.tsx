"use client";

import { useState } from 'react';

export default function Button({ text = "Get Started" }: { text?: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePosition({ x: x * 0.1, y: y * 0.1 });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
    };

    return (
        <button
            className="rounded-[30px] w-[300px] h-[100px] bg-[var(--secondary)] hover-lift hover-glow transition-all duration-300 hover:bg-[var(--primary)] focus:outline-none focus:ring-4 focus:ring-[var(--secondary)] focus:ring-opacity-50 relative overflow-hidden group cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
        >
            {/* Ripple effect on hover */}
            {isHovered && (
                <div className="absolute inset-0 bg-white opacity-20 rounded-[30px] animate-ping" />
            )}
            
            {/* Button text */}
            <span className="text-[color:var(--button-text)] text-[32px] font-semibold relative z-10 group-hover:scale-105 transition-transform duration-300">
                {text}
            </span>
            
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
        </button>
    );
}