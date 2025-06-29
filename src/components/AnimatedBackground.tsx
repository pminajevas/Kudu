"use client";

import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

export default function AnimatedBackground() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        // Create initial particles
        const initialParticles: Particle[] = [];
        for (let i = 0; i < 20; i++) {
            initialParticles.push({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1,
            });
        }
        setParticles(initialParticles);

        // Animate particles
        const animateParticles = () => {
            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    let newX = particle.x + particle.speedX;
                    let newY = particle.y + particle.speedY;
                    
                    // Wrap around screen edges
                    if (newX > window.innerWidth) newX = 0;
                    if (newX < 0) newX = window.innerWidth;
                    if (newY > window.innerHeight) newY = 0;
                    if (newY < 0) newY = window.innerHeight;
                    
                    return {
                        ...particle,
                        x: newX,
                        y: newY,
                    };
                })
            );
        };

        const interval = setInterval(animateParticles, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-[var(--primary)] float"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                        animationDelay: `${particle.id * 0.5}s`,
                    }}
                />
            ))}
        </div>
    );
}
