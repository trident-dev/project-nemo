import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DayWrapper from '../layout/DayWrapper';
import confetti from 'canvas-confetti';

const Day1Sup = () => {
    const [gameState, setGameState] = useState('INTRO'); // INTRO, WAITING, READY, SUCCESS, FAIL
    const [message, setMessage] = useState("We started as strangers...");
    const [reactionTime, setReactionTime] = useState(0);
    const startTimeRef = useRef(null);
    const timeoutRef = useRef(null);

    const startGame = () => {
        setGameState('WAITING');
        setMessage("She's walking by... act cool...");

        // Random delay between 2 and 5 seconds
        const delay = Math.random() * 3000 + 2000;

        timeoutRef.current = setTimeout(() => {
            setGameState('READY');
            setMessage("SUP?? NOW!");
            startTimeRef.current = Date.now();
        }, delay);
    };

    const handleAction = () => {
        if (gameState === 'WAITING') {
            clearTimeout(timeoutRef.current);
            setGameState('FAIL');
            setMessage("Too eager! She got creeped out.");
        } else if (gameState === 'READY') {
            const time = Date.now() - startTimeRef.current;
            setReactionTime(time);
            if (time < 800) { // Generous window
                setGameState('SUCCESS');
                setMessage("Perfect Nod. Smooth.");
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#CDD4B1', '#FEECD0', '#DCA278']
                });
            } else {
                setGameState('FAIL');
                setMessage("Too slow! She barely noticed.");
            }
        }
    };

    const resetGame = () => {
        setGameState('INTRO');
        setMessage("We started as strangers...");
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
        <DayWrapper dayNumber="1" title="The 'Sup?' Incident">
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={gameState}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ marginBottom: '40px', fontSize: '1.2rem', minHeight: '60px' }}
                    >
                        {message}
                    </motion.div>
                </AnimatePresence>

                {gameState === 'INTRO' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startGame}
                        style={{
                            padding: '16px 32px',
                            background: 'var(--color-clay)',
                            color: 'var(--color-ivory)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            boxShadow: 'var(--shadow-soft)'
                        }}
                    >
                        Recreate the Moment
                    </motion.button>
                )}

                {(gameState === 'WAITING' || gameState === 'READY') && (
                    <motion.button
                        onMouseDown={handleAction}
                        onTouchStart={handleAction}
                        whileTap={{ scale: 0.95 }}
                        animate={gameState === 'READY' ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: gameState === 'READY' ? 'var(--color-clay)' : '#ddd',
                            color: 'var(--color-ivory)',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            border: '4px solid var(--color-ivory)',
                            boxShadow: 'var(--shadow-card)',
                            cursor: 'pointer'
                        }}
                    >
                        {gameState === 'READY' ? "SUP!" : "..."}
                    </motion.button>
                )}

                {gameState === 'FAIL' && (
                    <div>
                        <p style={{ marginBottom: '20px' }}>Oof. Try again.</p>
                        <button onClick={resetGame} style={{ textDecoration: 'underline', color: 'var(--color-clay)' }}>Retry</button>
                    </div>
                )}

                {gameState === 'SUCCESS' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius-md)' }}
                    >
                        <p style={{ fontStyle: 'italic', marginBottom: '15px', lineHeight: '1.6' }}>
                            "I still remember that simple eyebrow raise... just a 'Sup?' <br />
                            But in that moment, my life changed forever. Who knew that this girl would become the center of my universe?
                            <br /><br />
                            You are my favorite person, my Nemo, my home."
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                            - Krish
                        </p>
                        <p style={{ fontWeight: 'bold', color: 'var(--color-clay)', marginBottom: '10px' }}>
                            Come back tomorrow for another surprise. 🌹
                        </p>
                        <button
                            disabled
                            style={{
                                padding: '12px 24px',
                                background: '#ccc',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: 'bold',
                                cursor: 'default'
                            }}
                        >
                            See you tomorrow!
                        </button>
                    </motion.div>
                )}

            </div>
        </DayWrapper>
    );
};

export default Day1Sup;
