"use client";

import { useState, ReactNode } from 'react';

interface InteractiveCardProps {
    children: ReactNode;
    className?: string;
}

export default function InteractiveCard({ children, className = "" }: InteractiveCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    return (
        <div
            className={`relative overflow-hidden cursor-magic ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Glowing cursor effect */}
            {isHovered && (
                <div
                    className="absolute pointer-events-none transition-opacity duration-300"
                    style={{
                        left: mousePosition.x - 50,
                        top: mousePosition.y - 50,
                        width: 100,
                        height: 100,
                        background: 'radial-gradient(circle, rgba(44, 62, 80, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        opacity: isHovered ? 1 : 0,
                    }}
                />
            )}
            
            {/* Shimmer effect */}
            {isHovered && (
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
                        transform: `translateX(${mousePosition.x / 10 - 50}px) translateY(${mousePosition.y / 10 - 50}px)`,
                        transition: 'transform 0.1s ease',
                    }}
                />
            )}
            
            {children}
        </div>
    );
}
