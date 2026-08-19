import React, { memo } from 'react';
import { motion } from 'motion/react';
import { MovingCitySkyline } from './MovingCitySkyline';

export const AnimatedBackground: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Subtle Moving Municipal Data Grid Lines */}
      <div className="absolute inset-0 civic-animated-grid opacity-25" />

      {/* 2. Soft Glowing Municipal Grid Data Conduit (Horizontal Pulse) */}
      <div className="hidden sm:block absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/15 to-transparent">
        <motion.div
          className="w-24 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent will-change-transform"
          animate={{ x: ['-100px', 'calc(100vw + 100px)'] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="hidden sm:block absolute top-[65%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent">
        <motion.div
          className="w-32 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent will-change-transform"
          animate={{ x: ['calc(100vw + 100px)', '-100px'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
      </div>

      {/* 3. Ambient Saffron, Blue & Emerald Soft Aura Glows */}
      {/* Saffron Aura Top-Left */}
      <div className="absolute -top-28 -left-28 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-br from-orange-300/25 via-amber-200/15 to-transparent blur-3xl opacity-70" />

      {/* Ashoka Chakra Blue Center-Right Aura */}
      <div className="absolute top-1/3 -right-28 w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-bl from-blue-300/15 via-indigo-200/10 to-transparent blur-3xl opacity-60" />

      {/* India Green Bottom-Left Aura */}
      <div className="absolute -bottom-28 left-1/4 w-80 h-80 sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-emerald-300/25 via-teal-200/15 to-transparent blur-3xl opacity-70" />

      {/* 4. Glowing Municipal Grid Intersection Points (Lightweight) */}
      <div className="hidden sm:block absolute inset-0">
        {[
          { top: '18%', left: '12%', color: 'bg-orange-500' },
          { top: '28%', left: '88%', color: 'bg-emerald-500' },
          { top: '55%', left: '92%', color: 'bg-blue-500' },
          { top: '75%', left: '8%', color: 'bg-amber-500' },
        ].map((node, i) => (
          <div
            key={i}
            style={{ top: node.top, left: node.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <div className={`w-1.5 h-1.5 rounded-full ${node.color} opacity-75`} />
          </div>
        ))}
      </div>

      {/* 5. Drifting Architectural Building Silhouettes & Parallax Skyline */}
      <MovingCitySkyline />
    </div>
  );
});
