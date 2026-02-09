import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Background = () => {
    // Generate random hearts
    const hearts = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 10,
    }));

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'linear-gradient(135deg, var(--color-ivory) 0%, var(--color-peach) 100%)'
            }}
        >
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    style={{
                        position: 'absolute',
                        left: `${heart.x}%`,
                        top: `${heart.y}%`,
                        color: 'rgba(220, 162, 120, 0.2)', // Light Clay
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, 0],
                        opacity: [0.2, 0.5, 0.2],
                        rotate: [0, 45, -45, 0],
                    }}
                    transition={{
                        duration: heart.duration,
                        repeat: Infinity,
                        delay: heart.delay,
                        ease: "linear"
                    }}
                >
                    <Heart size={heart.size} fill="currentColor" />
                </motion.div>
            ))}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '200px',
                background: 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)'
            }} />
        </div>
    );
};

export default Background;
