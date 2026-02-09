import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-clay)' }}>
          Hey Nemo,
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', maxWidth: '300px' }}>
          Welcome to your dedicated space. A little journey, just for us.
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/day/1')}
        style={{
          background: 'var(--color-clay)',
          color: 'var(--color-ivory)',
          padding: '12px 32px',
          borderRadius: 'var(--radius-lg)',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        Start the Journey <Heart size={20} fill="var(--color-ivory)" />
      </motion.button>
    </div>
  );
};

export default Home;
