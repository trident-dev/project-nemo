import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DayWrapper from '../layout/DayWrapper';
import confetti from 'canvas-confetti';

const ITEMS = [
    { id: 'sushi', emoji: '🍣', score: 10, type: 'good' },
    { id: 'noodles', emoji: '🍜', score: 15, type: 'good' }, // Favorites
    { id: 'flower', emoji: '🌸', score: 10, type: 'good' },
    { id: 'broccoli', emoji: '🥦', score: -10, type: 'bad' },
    { id: 'onion', emoji: '🧅', score: -5, type: 'bad' },
];

const Day3Food = () => {
    const [gameState, setGameState] = useState('INTRO'); // INTRO, PLAYING, WON
    const [score, setScore] = useState(0);
    const [playerX, setPlayerX] = useState(50); // Percentage
    const containerRef = useRef(null);
    const requestRef = useRef();
    const fallingItemsRef = useRef([]);
    const lastSpawnTime = useRef(0);

    // Handle Player Movement
    const handleMove = (e) => {
        if (gameState !== 'PLAYING' || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const padding = 20; // prevent going off edge

        // Calculate raw X position within container
        let x = clientX - rect.left;

        // Clamp
        x = Math.max(padding, Math.min(rect.width - padding, x));

        // Convert to percentage for responsiveness
        setPlayerX((x / rect.width) * 100);
    };

    const updateGame = (time) => {
        if (gameState !== 'PLAYING') return;

        // Spawn
        if (time - lastSpawnTime.current > 600) {
            const type = ITEMS[Math.floor(Math.random() * ITEMS.length)];
            fallingItemsRef.current.push({
                uid: Date.now() + Math.random(),
                ...type,
                x: Math.random() * 90 + 5, // 5% to 95%
                y: -10,
                speed: Math.random() * 0.5 + 0.5
            });
            lastSpawnTime.current = time;
        }

        // Update Items
        fallingItemsRef.current.forEach(item => {
            if (!item.active) return;

            item.y += item.speed;

            // Collision Detection
            // Player is at bottom (approx 90% top), width approx 10%
            // Simple box collision
            if (item.y > 85 && item.y < 95) {
                if (Math.abs(item.x - playerX) < 10) {
                    item.active = false;
                    // React state update in loop is bad, but for score it's okay if throttled or using ref
                    // We'll update state directly here as it triggers re-render, might be laggy?
                    // Better to use ref for score and sync occasionally? 
                    // For this simple game, state update is fine.
                    setScore(s => {
                        const newScore = s + item.score;
                        if (newScore >= 100) return 100;
                        return Math.max(0, newScore);
                    });
                }
            }

            // Remove if off screen
            if (item.y > 100) item.active = false;
        });

        // Cleanup
        fallingItemsRef.current = fallingItemsRef.current.filter(i => i.active !== false);

        if (score < 100) {
            requestRef.current = requestAnimationFrame((t) => updateGame(t));
        } else {
            setGameState('WON');
            confetti({
                particleCount: 150,
                spread: 70,
                colors: ['#FF69B4', '#FEECD0', '#ffffff'] // Pinks and whites
            });
        }
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            lastSpawnTime.current = performance.now();
            requestRef.current = requestAnimationFrame((t) => updateGame(t));
            return () => cancelAnimationFrame(requestRef.current);
        }
    }, [gameState, score]); // dependency on score is tricky if we don't check it inside loop properly. 
    // Actually, checking score inside setState in the loop works to Trigger 'WON' via effect.

    useEffect(() => {
        if (score >= 100 && gameState === 'PLAYING') {
            setGameState('WON');
        }
    }, [score, gameState]);

    const startGame = () => {
        setScore(0);
        fallingItemsRef.current = [];
        setGameState('PLAYING');
    };

    return (
        <DayWrapper dayNumber="3" title="Foodie Adventures">
            <div
                ref={containerRef}
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                style={{
                    width: '100%',
                    height: '400px',
                    background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    touchAction: 'none',
                    cursor: 'ew-resize'
                }}
            >
                {gameState === 'INTRO' && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10 }}>
                        <p style={{ marginBottom: '1rem' }}>Catch her favorites! Dodge the broccoli.</p>
                        <button onClick={startGame} style={{
                            padding: '12px 24px',
                            background: 'var(--color-clay)',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 'bold'
                        }}>
                            Start Catching
                        </button>
                    </div>
                )}

                {gameState === 'PLAYING' && (
                    <>
                        <div style={{ position: 'absolute', top: 10, right: 10, fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Score: {score}/100
                        </div>

                        {/* Player */}
                        <div style={{
                            position: 'absolute',
                            bottom: '5%',
                            left: `${playerX}%`,
                            transform: 'translateX(-50%)',
                            fontSize: '40px',
                            transition: 'left 0.1s linear'
                        }}>
                            🍽️
                        </div>

                        {/* Items */}
                        {fallingItemsRef.current.map(item => (
                            <div key={item.uid} style={{
                                position: 'absolute',
                                top: `${item.y}%`,
                                left: `${item.x}%`,
                                fontSize: '24px',
                                pointerEvents: 'none'
                            }}>
                                {item.emoji}
                            </div>
                        ))}
                    </>
                )}

                {gameState === 'WON' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>Tummy Full of Love!</h3>
                        <p style={{ marginBottom: '20px' }}>"Falling in love over and over, one sushi roll at a time."</p>
                        <button
                            onClick={() => window.location.hash = '#/day/4'}
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

            </div>
        </DayWrapper>
    );
};

export default Day3Food;
