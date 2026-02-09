import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import DayWrapper from '../layout/DayWrapper';
import { Shield, CloudRain, Sun } from 'lucide-react';

const Day2Shield = () => {
    const [gameState, setGameState] = useState('INTRO'); // INTRO, PLAYING, WON, LOST
    const [shieldAngle, setShieldAngle] = useState(0);
    const [health, setHealth] = useState(100);
    const [timeLeft, setTimeLeft] = useState(15);

    const containerRef = useRef(null);
    const requestRef = useRef();
    const enemiesRef = useRef([]);
    const lastSpawnTime = useRef(0);

    // Constants
    const CENTER = { x: 0, y: 0 }; // Will be updated on mount
    const RADIUS = 100; // Distance of shield from center
    const SHIELD_SIZE = 60; // Approximate arc length in degrees? No, pixel size.

    // Handle Shield Movement
    const handleMove = (e) => {
        if (gameState !== 'PLAYING' || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // Calculate angle in degrees
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        setShieldAngle(angle);
    };

    // Game Loop
    const updateGame = (time) => {
        if (gameState !== 'PLAYING') return;

        // Spawn Enemies
        if (time - lastSpawnTime.current > 800) { // Spawn every 800ms
            const angle = Math.random() * 360;
            const distance = 250; // Spawn distance
            const speed = 1.5;

            enemiesRef.current.push({
                id: Date.now(),
                x: Math.cos(angle * (Math.PI / 180)) * distance,
                y: Math.sin(angle * (Math.PI / 180)) * distance,
                angle: angle,
                active: true
            });
            lastSpawnTime.current = time;
        }

        // Update Enemies
        enemiesRef.current.forEach(enemy => {
            if (!enemy.active) return;

            // Move towards center (0,0) - strictly purely logic coordinates relative to center
            const moveAngle = Math.atan2(-enemy.y, -enemy.x);
            enemy.x += Math.cos(moveAngle) * 1.5; // Speed
            enemy.y += Math.sin(moveAngle) * 1.5;

            // Distance to center
            const dist = Math.sqrt(enemy.x * enemy.x + enemy.y * enemy.y);

            // Collision with Shield
            // Simplified: Check if enemy distance is approx RADIUS and angle matches shieldAngle
            if (dist < RADIUS + 20 && dist > RADIUS - 20) {
                // Normalize angles to 0-360
                let enemyAngleDeg = (Math.atan2(enemy.y, enemy.x) * 180 / Math.PI);
                let shieldAngleDeg = shieldAngle;

                // Normalize logic
                const diff = Math.abs((enemyAngleDeg - shieldAngleDeg + 180 + 360) % 360 - 180);

                if (diff < 45) { // Shield covers ~90 degrees
                    enemy.active = false;
                    // feedback?
                }
            }

            // Collision with Core
            if (dist < 30) {
                enemy.active = false;
                setHealth(h => Math.max(0, h - 20));
            }
        });

        // Cleanup logic handled just by rendering active ones

        requestRef.current = requestAnimationFrame((t) => updateGame(t));
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            lastSpawnTime.current = performance.now();
            requestRef.current = requestAnimationFrame((t) => updateGame(t));

            const timer = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        setGameState('WON');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);

            return () => {
                cancelAnimationFrame(requestRef.current);
                clearInterval(timer);
            };
        }
    }, [gameState]);

    useEffect(() => {
        if (health <= 0) setGameState('LOST');
    }, [health]);

    const startGame = () => {
        setHealth(100);
        setTimeLeft(15);
        enemiesRef.current = [];
        setGameState('PLAYING');
    };

    return (
        <DayWrapper dayNumber="2" title="The Safe Embrace">
            <div
                ref={containerRef}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                style={{
                    width: '100%',
                    height: '400px',
                    position: 'relative',
                    overflow: 'hidden',
                    touchAction: 'none',
                    cursor: 'crosshair',
                    background: 'radial-gradient(circle, var(--color-ivory) 0%, #f0f0f0 100%)',
                    borderRadius: 'var(--radius-md)'
                }}
            >
                {gameState === 'INTRO' && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
                        <p style={{ marginBottom: '1rem' }}>Protect Baby Nemo from the gloomy clouds.</p>
                        <button
                            onClick={startGame}
                            style={{
                                padding: '12px 24px',
                                background: 'var(--color-clay)',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 'bold'
                            }}
                        >
                            Start Protection
                        </button>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <div style={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }}>
                        Time: {timeLeft}s | Health: {health}%
                    </div>
                )}

                {/* Center (Baby Nemo) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '40px'
                }}>
                    👶
                </div>

                {/* Shield */}
                {(gameState === 'PLAYING' || gameState === 'INTRO') && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 0, height: 0
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: -60, left: -10, // Offset to center on orbit
                            transform: `rotate(${shieldAngle}deg) translateX(${RADIUS}px) rotate(90deg)`, // Align perpendicular
                            transformOrigin: `${-RADIUS}px 0px` // Actually, easier to rotate parent
                        }}>
                            {/* 
                  Wait, transform approach:
                  Rotate the container wrapper to shieldAngle.
                  Translate out by RADIUS.
                */}
                        </div>

                        {/* Simpler Shield Visual */}
                        <motion.div
                            animate={{ rotate: shieldAngle }}
                            transition={{ duration: 0 }} // Instant update
                            style={{
                                position: 'absolute',
                                top: -RADIUS, left: -30,
                                width: 60, height: RADIUS * 2,
                                transformOrigin: '50% 50%',
                                pointerEvents: 'none'
                            }}
                        >
                            {/* The Arc */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0, left: 0,
                                width: '100%', height: '20px',
                                background: 'var(--color-eucalyptus)',
                                borderRadius: '10px',
                                transform: 'translateY(50%)' // Center on the radius line
                            }} />
                        </motion.div>
                    </div>
                )}

                {/* Enemies */}
                {gameState === 'PLAYING' && enemiesRef.current.map(enemy => (
                    enemy.active && (
                        <div key={enemy.id} style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: `translate(${enemy.x}px, ${enemy.y}px)`,
                            fontSize: '20px'
                        }}>
                            🌧️
                        </div>
                    )
                ))}

                {gameState === 'WON' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                        <Sun size={64} style={{ color: 'orange', marginBottom: '20px' }} />
                        <h3>"Safe in my embrace."</h3>
                        <p style={{ marginBottom: '20px' }}>Your inner child will always be protected here.</p>
                        <button
                            onClick={() => window.location.hash = '#/day/3'}
                            style={{
                                padding: '12px 24px',
                                background: 'var(--color-eucalyptus)',
                                color: 'var(--color-ivory)',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 'bold'
                            }}
                        >
                            Continue Journey →
                        </button>
                    </div>
                )}
                {gameState === 'LOST' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h3>Oh no!</h3>
                        <button onClick={startGame} style={{ marginTop: '20px', padding: '10px 20px', background: 'white', color: 'black', borderRadius: '8px' }}>Try Again</button>
                    </div>
                )}

            </div>
        </DayWrapper>
    );
};

export default Day2Shield;
