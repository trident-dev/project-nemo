import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DayWrapper = ({ title, children, dayNumber }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            style={{ padding: '20px', paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
            <nav style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <button onClick={() => navigate('/')} style={{ color: 'var(--color-clay)' }}>
                    <Home size={24} />
                </button>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 'bold', color: 'var(--color-clay)' }}>
                    Feb {8 + parseInt(dayNumber)}
                </span>
            </nav>

            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '2rem' }}>{title}</h2>
                {children}
            </div>
        </motion.div>
    );
};

export default DayWrapper;
