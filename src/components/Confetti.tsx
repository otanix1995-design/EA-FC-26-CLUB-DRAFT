import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const ConfettiTrigger: React.FC = () => {
  useEffect(() => {
    // Initial burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00FF85', '#FFD700', '#FFFFFF', '#00E5FF'],
    });

    // Secondary delayed burst
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00FF85', '#FFD700'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00FF85', '#FFD700'],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return null;
};
