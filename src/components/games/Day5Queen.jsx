import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DayWrapper from '../layout/DayWrapper';
import { Crown } from 'lucide-react';
import confetti from 'canvas-confetti';

const Day5Queen = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [percent, setPercent] = useState(0);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = '#DCA278'; // Clay color overlay
        ctx.fillRect(0, 0, width, height);

        // Add text "Scratch to Reveal" to the overlay
        ctx.fillStyle = '#FFF9E2';
        ctx.font = '20px Playfair Display';
        ctx.textAlign = 'center';
        ctx.fillText("Scratch to Reveal Her Majesty", width / 2, height / 2);
    };

    const handleScratch = (e) => {
        if (isRevealed) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Check progress (throttle this in production, but okay for small canvas)
        // Actually, checking every move is heavy. Let's check every 10th move or use a counter.
        if (Math.random() > 0.8) checkProgress();
    };

    const checkProgress = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparent = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) transparent++;
        }

        const p = (transparent / (pixels.length / 4)) * 100;
        setPercent(p);

        if (p > 60) { // Reveal at 60%
            setIsRevealed(true);
            confetti({
                particleCount: 200,
                spread: 100,
                colors: ['#FFD700', '#FFFFFF'] // Gold
            });
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            // Set actual canvas size to match CSS display size for logic
            canvasRef.current.width = containerRef.current.clientWidth;
            canvasRef.current.height = containerRef.current.clientHeight;
            initCanvas();
        }
    }, []);

    return (
        <DayWrapper dayNumber="5" title="The Royal Reveal">
            <div
                ref={containerRef}
                style={{ position: 'relative', width: '100%', height: '400px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
            >
                {/* Underlying Image/Content */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'url("https://images.unsplash.com/photo-1599661046289-4802436f9020?q=80&w=2930&auto=format&fit=crop")', // Amer Fortish image
                    backgroundSize: 'cover',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '20px', borderRadius: 'var(--radius-lg)', textAlign: 'center',
                        backdropFilter: 'blur(5px)'
                    }}>
                        <Crown size={48} color="gold" style={{ marginBottom: '10px' }} />
                        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-clay)' }}>My Queen</h2>
                        <p style={{ marginBottom: '15px' }}>"I promise to treat you like royalty in Jaipur."</p>
                        {isRevealed && (
                            <button
                                onClick={() => window.location.hash = '#/day/6'}
                                style={{
                                    padding: '10px 20px',
                                    background: 'var(--color-eucalyptus)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)',
                                    fontWeight: 'bold'
                                }}
                            >
                                The Final Question →
                            </button>
                        )}
                    </div>
                </div>

                {/* Scratch Overlay */}
                <motion.canvas
                    ref={canvasRef}
                    onMouseMove={handleScratch}
                    onTouchMove={handleScratch}
                    animate={isRevealed ? { opacity: 0, pointerEvents: 'none' } : { opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                        position: 'absolute', inset: 0, touchAction: 'none'
                    }}
                />
            </div>
        </DayWrapper>
    );
};

export default Day5Queen;
