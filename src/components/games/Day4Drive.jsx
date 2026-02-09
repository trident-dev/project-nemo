import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import DayWrapper from '../layout/DayWrapper';
import { Car, MapPin, Coffee, Utensils } from 'lucide-react';

const Day4Drive = () => {
    const [distance, setDistance] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [driving, setDriving] = useState(false);
    const [milestone, setMilestone] = useState(null);

    const requestRef = useRef();

    // Landmarks
    const landmarks = [
        { pos: 20, label: "Late Night Office", icon: <MapPin /> },
        { pos: 50, label: "Pronots Burgers", icon: <Utensils /> },
        { pos: 80, label: "Third Wave Coffee", icon: <Coffee /> },
    ];

    const updateGame = () => {
        if (driving) {
            setSpeed(s => Math.min(s + 0.5, 2)); // Accelerate
        } else {
            setSpeed(s => Math.max(s - 0.1, 0)); // Decelerate
        }

        setDistance(d => {
            const newDist = d + speed * 0.1;
            if (newDist >= 100) return 100;
            return newDist;
        });

        requestRef.current = requestAnimationFrame(updateGame);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(updateGame);
        return () => cancelAnimationFrame(requestRef.current);
    }, [driving, speed]); // Dependency on driving to trigger accel logic inside loop?
    // Actually, 'speed' is state, so the loop closure captures old speed if not ref-based.
    // We need to use refs for speed if we want to update it inside a single RAF loop without re-triggering effect.
    // OR, simpler: just update state in RAF and let React handle re-renders (might be choppy).
    // Given the simplicity, let's use a standard interval for logic or just use the effect dependency correctly.

    // Better approach: Separate Logic Loop
    useEffect(() => {
        let lastTime = performance.now();
        let currentSpeed = 0;

        const loop = (time) => {
            if (driving) {
                currentSpeed = Math.min(currentSpeed + 0.05, 1.5);
            } else {
                currentSpeed = Math.max(currentSpeed - 0.05, 0);
            }

            setSpeed(currentSpeed); // For visuals

            setDistance(prev => {
                const next = prev + currentSpeed * 0.2;

                // Check Landmarks
                landmarks.forEach(l => {
                    if (prev < l.pos && next >= l.pos) {
                        setMilestone(l);
                        setTimeout(() => setMilestone(null), 2000);
                    }
                });

                return Math.min(next, 100);
            });

            requestRef.current = requestAnimationFrame(loop);
        };

        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [driving]); // Re-start loop if driving changes? No, loop should persist.
    // Pass 'driving' via ref to avoid effect restart.

    const drivingRef = useRef(false);
    useEffect(() => { drivingRef.current = driving }, [driving]);

    // Re-write loop to rely on ref
    useEffect(() => {
        let currentSpeed = 0;
        const loop = () => {
            if (drivingRef.current) {
                currentSpeed = Math.min(currentSpeed + 0.05, 1.5);
            } else {
                currentSpeed = Math.max(currentSpeed - 0.05, 0);
            }
            setSpeed(currentSpeed);

            setDistance(prev => {
                if (prev >= 100) return 100;
                const next = prev + currentSpeed * 0.1;
                landmarks.forEach(l => {
                    if (prev < l.pos && next >= l.pos) {
                        setMilestone(l);
                        setTimeout(() => setMilestone(null), 2000);
                    }
                });
                return next;
            });

            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestRef.current);
    }, []); // Run once

    return (
        <DayWrapper dayNumber="4" title="Kolkata Nights">
            <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', background: '#1a1a2e', borderRadius: 'var(--radius-md)', color: 'white' }}>

                {/* Sky/Stars */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    {[...Array(20)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: Math.random() * 50 + '%',
                            left: Math.random() * 100 + '%',
                            width: 2, height: 2, background: 'white', borderRadius: '50%'
                        }} />
                    ))}
                </div>

                {/* Moving Background (Buildings) */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '200%', height: '100px',
                    background: 'linear-gradient(to top, #0f0f1a 0%, transparent 100%)',
                    transform: `translateX(-${(distance * 5) % 50}%)`, // Parallax
                    display: 'flex', alignItems: 'flex-end', gap: '20px'
                }}>
                    {/* Simple blocks for buildings */}
                    {[...Array(20)].map((_, i) => (
                        <div key={i} style={{ width: 40, height: Math.random() * 60 + 20, background: '#333' }} />
                    ))}
                </div>

                {/* Road */}
                <div style={{
                    position: 'absolute', bottom: 0, width: '100%', height: '40px', background: '#333',
                    transform: 'perspective(500px) rotateX(40deg)'
                }}>
                    {/* Lines */}
                    <div style={{
                        position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px',
                        background: 'dashed white',
                        backgroundSize: '20px 2px',
                        transform: `translateX(-${(distance * 20) % 20}px)`
                    }} />
                </div>

                {/* Car */}
                <div style={{
                    position: 'absolute', bottom: '30px', left: '20%',
                    transform: `translateY(${Math.sin(Date.now() / 100) * 2}px)` // Idle bounce
                }}>
                    <Car size={48} color="var(--color-peach)" />
                </div>

                {/* Milestone Popup */}
                <AnimatePresence>
                    {milestone && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            style={{
                                position: 'absolute', top: '20px', left: 0, width: '100%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                gap: '10px', fontSize: '1.2rem', fontWeight: 'bold'
                            }}
                        >
                            {milestone.icon} {milestone.label}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {distance < 100 ? (
                        <button
                            onMouseDown={() => setDriving(true)}
                            onMouseUp={() => setDriving(false)}
                            onMouseLeave={() => setDriving(false)}
                            onTouchStart={() => setDriving(true)}
                            onTouchEnd={() => setDriving(false)}
                            style={{
                                padding: '20px',
                                borderRadius: '50%',
                                background: 'var(--color-clay)',
                                color: 'white',
                                fontWeight: 'bold',
                                boxShadow: '0 0 20px var(--color-clay)'
                            }}
                        >
                            HOLD TO DRIVE
                        </button>
                    ) : (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ background: 'white', color: 'black', padding: '10px 20px', borderRadius: '8px', textAlign: 'center' }}
                        >
                            <h3>"I miss our long drives..."</h3>
                            <button
                                onClick={() => window.location.hash = '#/day/5'}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    background: 'var(--color-eucalyptus)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: 'bold'
                                }}
                            >
                                Continue Journey →
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Progress Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: `${distance}%`, height: '4px', background: 'var(--color-peach)', transition: 'width 0.1s linear' }} />

            </div>
        </DayWrapper>
    );
};

export default Day4Drive;
