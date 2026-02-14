
import React from 'react';
import { TVState } from '../types';

interface TVControlsProps {
  state: TVState;
  onPower: () => void;
  onChannelChange: () => void;
  onVolumeChange: (v: number) => void;
}

export const TVControls: React.FC<TVControlsProps> = ({ state, onPower, onChannelChange, onVolumeChange }) => {
  return (
    <div className="flex flex-col items-center gap-12 w-full">
      {/* Channel Knob */}
      <div className="flex flex-col items-center gap-2">
        <div 
          onClick={onChannelChange}
          className={`relative w-24 h-24 rounded-full bg-[#333] border-4 border-[#111] shadow-[4px_4px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center justify-center`}
          style={{ transform: `rotate(${state.currentChannelIndex * (360 / 5)}deg)` }}
        >
          {/* Knob Indicator */}
          <div className="absolute top-1 w-2 h-6 bg-zinc-300 rounded-sm"></div>
          {/* Grips */}
          <div className="w-16 h-16 rounded-full border border-zinc-600/30 border-dashed"></div>
        </div>
        <span className="text-zinc-300 font-retro text-sm uppercase tracking-widest font-bold">Channel</span>
      </div>

      {/* Volume Knob */}
      <div className="flex flex-col items-center gap-2">
        <div 
          className="relative w-16 h-16 rounded-full bg-[#333] border-4 border-[#111] shadow-[2px_2px_8px_rgba(0,0,0,0.5)] cursor-pointer transition-transform"
          style={{ transform: `rotate(${state.volume * 2}deg)` }}
          onClick={() => onVolumeChange((state.volume + 10) % 100)}
        >
          <div className="absolute top-1 w-1.5 h-4 bg-zinc-500 rounded-sm"></div>
        </div>
        <span className="text-zinc-300 font-retro text-sm uppercase tracking-widest font-bold">Volume</span>
      </div>

      {/* Power Button */}
      <div className="flex flex-col items-center gap-3">
        <button 
          onClick={onPower}
          className={`w-20 h-10 rounded-md border-2 border-[#111] shadow-lg transition-all active:translate-y-1 flex items-center justify-center gap-2 px-2 ${state.isPowerOn ? 'bg-zinc-800' : 'bg-[#222]'}`}
        >
          <div className={`w-3 h-3 rounded-full shadow-inner transition-colors duration-300 ${state.isPowerOn ? 'bg-green-500 shadow-green-500/50' : 'bg-red-900 shadow-transparent'}`}></div>
          <span className="text-[10px] text-zinc-500 font-bold tracking-tighter">POWER</span>
        </button>
      </div>
    </div>
  );
};
