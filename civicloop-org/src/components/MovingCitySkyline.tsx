import React, { memo } from 'react';
import { motion } from 'motion/react';
import { useCivic } from '../context/CivicContext';

export const MovingCitySkyline: React.FC = memo(() => {
  const { selectedCity } = useCivic();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-44 md:h-64 pointer-events-none z-0 overflow-hidden select-none">
      {/* Top fade gradient to blend skyline smoothly into the light background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-20" />

      {/* Atmospheric Horizon Glow (Soft Saffron and Emerald Tints) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-500/8 via-emerald-500/4 to-transparent z-0" />

      {/* LAYER 1: Deep Background Silhouette - Visible on desktop, simplified on mobile to save GPU cycles */}
      <motion.div
        className="hidden md:flex absolute bottom-6 left-0 w-[200%] opacity-20 z-5 will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="w-1/2 flex items-end justify-around space-x-6 px-6">
            
            {/* Sustainable Wind Turbine */}
            <div className="w-8 h-44 flex flex-col items-center justify-end relative">
              <div className="w-1 h-32 bg-slate-350 rounded-t-sm" />
              <div className="absolute top-8 w-10 h-10 flex items-center justify-center">
                <div className="w-1 h-10 bg-slate-400 rounded-full absolute" />
                <div className="w-1 h-10 bg-slate-400 rounded-full absolute rotate-60" />
                <div className="w-1 h-10 bg-slate-400 rounded-full absolute rotate-120" />
                <div className="w-2 h-2 rounded-full bg-slate-500 z-10" />
              </div>
            </div>

            {/* Heritage Temple Spire Silhouette */}
            <div className="w-14 h-48 flex flex-col items-center justify-end relative">
              <div className="w-1.5 h-6 bg-amber-500/70 -top-6 absolute rounded-t-full" />
              <div className="w-6 h-10 bg-slate-300 [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />
              <div className="w-10 h-18 bg-slate-300 [clip-path:polygon(30%_0%,70%_0%,100%_100%,0%_100%)] flex items-center justify-center" />
              <div className="w-14 h-18 bg-slate-300 rounded-t-sm" />
            </div>

            {/* Spire High-Rise with beacon */}
            <div className="w-12 h-40 bg-slate-300 rounded-t-sm flex flex-col items-center relative">
              <div className="w-1 h-8 bg-orange-500 -top-8 absolute" />
              <div className="grid grid-cols-2 gap-1 p-2 w-full mt-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-[1px] ${i % 3 === 0 ? 'bg-amber-400' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            {/* Smart Green City Center */}
            <div className="w-18 h-36 bg-slate-300 rounded-t-lg relative flex flex-col justify-between p-2">
              <div className="w-14 h-3 bg-blue-400/70 -top-3 left-2 absolute rounded-xs" />
              <div className="grid grid-cols-3 gap-1 mt-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-[1px] ${i % 2 === 0 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            {/* Civic Dome (Municipal Corporation Motif) */}
            <div className="w-24 h-28 bg-slate-300 rounded-t-full relative flex flex-col items-center justify-end">
              <div className="w-5 h-6 bg-amber-500/70 -top-6 absolute rounded-t-full" />
              <div className="flex space-x-1 pb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-8 bg-slate-200 rounded-t-sm" />
                ))}
              </div>
            </div>

            {/* 5G Smart Grid Tower Infrastructure */}
            <div className="w-8 h-48 flex flex-col items-center justify-end relative">
              <div className="w-1 h-full bg-gradient-to-t from-slate-400 to-orange-400" />
              <div className="w-5 h-0.5 bg-orange-400 absolute top-8" />
              <div className="w-4 h-0.5 bg-emerald-400 absolute top-16" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* LAYER 2: Midground Modern Moving Buildings & Municipal Hubs */}
      <motion.div
        className="absolute bottom-2 left-0 flex w-[200%] opacity-30 md:opacity-35 z-10 will-change-transform"
        animate={{ x: ['-50%', '0%'] }}
        transition={{
          duration: 65,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="w-1/2 flex items-end justify-around space-x-4 md:space-x-6 px-4 md:px-6">
            
            {/* Municipal Command Hub */}
            <div className="w-20 md:w-24 h-36 md:h-44 bg-slate-200 border-t-2 border-orange-500 rounded-t-xl relative p-2 shadow-xs">
              <div className="text-[7px] text-orange-700 font-mono text-center font-bold mb-1 truncate">
                CIVIC {selectedCity.name.toUpperCase()}
              </div>
              <div className="grid grid-cols-3 gap-1 md:gap-1.5">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-xs ${
                      (i + copyIdx) % 3 === 0 ? 'bg-amber-400' : 'bg-white'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Eco Tower */}
            <div className="w-20 md:w-24 h-44 md:h-52 bg-slate-200 border-t-2 border-emerald-500 rounded-t-2xl relative p-2 flex flex-col justify-between">
              <div className="w-full flex justify-between items-center mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[6px] text-emerald-800 font-mono font-bold">SMART WARD</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {[...Array(15)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-[2px] ${
                      (i + copyIdx) % 3 === 1 ? 'bg-emerald-500' : 'bg-white'
                    }`} 
                  />
                ))}
              </div>
            </div>

            {/* Modern Metro Station Hub */}
            <div className="w-24 md:w-32 h-28 md:h-32 bg-slate-200 border-t-2 border-cyan-500 rounded-t-lg relative p-2 flex flex-col justify-end">
              <div className="w-10 h-4 bg-blue-100 border border-blue-400 rounded-t-full -top-4 absolute left-7 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-ping" />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-xs ${i % 3 === 0 ? 'bg-orange-400' : 'bg-white'}`} />
                ))}
              </div>
            </div>

            {/* Vertical Garden Tower */}
            <div className="w-16 md:w-20 h-36 md:h-44 bg-slate-200 border-t-2 border-emerald-600 rounded-t-lg relative p-2">
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-2.5 rounded bg-emerald-100 border border-emerald-400/50 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* LAYER 3: Rapid Metro Express Train Moving Left to Right */}
      <div className="absolute bottom-5 left-0 right-0 h-3.5 border-t border-slate-300/80 z-15 flex items-center">
        <motion.div
          className="flex items-center space-x-1 z-20 will-change-transform"
          animate={{ x: ['-200px', 'calc(100vw + 200px)'] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 5,
          }}
        >
          {/* Engine Car */}
          <div className="w-14 h-3.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-l-full rounded-r-xs flex items-center px-1.5 justify-between shadow-2xs">
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            <div className="flex space-x-0.5">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-[1px]" />
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-[1px]" />
            </div>
          </div>
          {/* Passenger Coach */}
          <div className="w-12 h-3.5 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-xs flex items-center px-1 justify-around shadow-2xs">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-[1px]" />
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-[1px]" />
          </div>
          {/* Rear Coach */}
          <div className="w-14 h-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-r-full rounded-l-xs flex items-center px-1.5 justify-between shadow-2xs">
            <div className="flex space-x-0.5">
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-[1px]" />
              <div className="w-1.5 h-1.5 bg-slate-900 rounded-[1px]" />
            </div>
            <div className="w-1 h-1 rounded-full bg-rose-500" />
          </div>
        </motion.div>
      </div>

      {/* LAYER 4: Municipal Ground Squad Moving Right to Left */}
      <div className="absolute bottom-0 left-0 right-0 h-3 border-t border-slate-200/80 z-15 flex items-center">
        <motion.div
          className="flex items-center space-x-2 z-20 will-change-transform"
          animate={{ x: ['calc(100vw + 100px)', '-150px'] }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 8,
          }}
        >
          {/* Municipal EV Van */}
          <div className="w-9 h-3 bg-emerald-600 rounded-xs flex items-center justify-between px-1 shadow-2xs">
            <div className="w-0.5 h-0.5 bg-amber-300 rounded-full" />
            <div className="text-[5px] text-white font-mono font-bold">CIVIC</div>
            <div className="w-0.5 h-0.5 bg-rose-500 rounded-full" />
          </div>

          {/* PWD Repair Vehicle */}
          <div className="w-10 h-3 bg-orange-600 rounded-xs flex items-center justify-between px-1 shadow-2xs">
            <div className="text-[5px] text-white font-mono font-bold">PWD</div>
            <div className="w-0.5 h-0.5 bg-amber-300 rounded-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
});
