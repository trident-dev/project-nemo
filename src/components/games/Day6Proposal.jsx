import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DayWrapper from '../layout/DayWrapper';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

const Day6Proposal = () => {
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [accepted, setAccepted] = useState(false);

    const moveButton = () => {
        // Move to random position within a reasonable range (e.g., +/- 100px)
        // Actually, better to stay within container bounds.
        // Simple random offset approach:
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        setNoBtnPos({ x, y });
    };

    const handleAccept = () => {
        setAccepted(true);
        // Huge confetti
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <DayWrapper dayNumber="6" title="The Question">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>

                {!accepted ? (
                    <>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ marginBottom: '40px' }}
                        >
                            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-clay)', marginBottom: '20px' }}>
                                Will you be my Valentine?
                            </h2>
                            <p style={{ fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto' }}>
                                From strangers to inseparable. Will you be mine, today and always?
                            </p>
                        </motion.div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', position: 'relative', height: '100px' }}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAccept}
                                style={{
                                    padding: '16px 48px',
                                    background: 'var(--color-eucalyptus)',
                                    color: 'var(--color-ivory)',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    boxShadow: 'var(--shadow-soft)',
                                    zIndex: 2
                                }}
                            >
                                YES!
                            </motion.button>

                            <motion.button
                                onHoverStart={moveButton}
                                onTouchStart={moveButton} // For mobile
                                animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                style={{
                                    padding: '16px 48px',
                                    background: 'var(--color-clay)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    boxShadow: 'var(--shadow-soft)',
                                    position: 'relative' // To allow transform
                                }}
                            >
                                No
                            </motion.button>
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ padding: '40px', background: 'rgba(255,255,255,0.9)', borderRadius: 'var(--radius-lg)' }}
                    >
                        <Heart size={80} fill="#DCA278" color="#DCA278" style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', color: 'var(--color-clay)' }}>
                            I Knew It! ❤️
                        </h2>
                        <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>
                            See you in Jaipur, my Queen.
                        </p>
                        <p style={{ fontSize: '1rem', color: '#666' }}>
                            (Get ready for a LOT of chilli garlic noodles)
                        </p>
                    </motion.div>
                )}
            </div>
        </DayWrapper>
    );
};

export default Day6Proposal;
