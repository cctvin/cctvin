
import React from 'react';
import { TVState, Channel, ChannelType } from '../types';
import { TVScreen } from './TVScreen';
import { TVControls } from './TVControls';

interface RetroTVProps {
  state: TVState;
  channels: Channel[];
  onPower: () => void;
  onChannelChange: () => void;
  onVolumeChange: (v: number) => void;
  aiProgram: any;
  veoVideo: string | null;
  isGeneratingVeo: boolean;
}

export const RetroTV: React.FC<RetroTVProps> = ({ 
  state, 
  channels, 
  onPower, 
  onChannelChange, 
  onVolumeChange,
  aiProgram,
  veoVideo,
  isGeneratingVeo
}) => {
  return (
    <div className="relative mx-auto w-full max-w-[700px] aspect-[4/3] perspective-1000">
      {/* Antennas */}
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 flex gap-40 pointer-events-none">
        <div className="w-1.5 h-32 bg-zinc-600 rotate-[-15deg] origin-bottom rounded-full shadow-lg"></div>
        <div className="w-1.5 h-40 bg-zinc-500 rotate-[15deg] origin-bottom rounded-full shadow-lg"></div>
      </div>

      {/* Main Wood Body */}
      <div className="relative w-full h-full bg-[#7d5a3b] rounded-[40px] border-[8px] border-[#4a3121] shadow-2xl p-6 overflow-hidden">
        {/* Wood Texture Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)' }}></div>
        
        {/* Inner Dark Bezel */}
        <div className="w-full h-full bg-[#332211] rounded-[24px] border-[4px] border-[#2a1a0e] shadow-inner flex p-4 gap-6">
          
          {/* Screen Section */}
          <div className="flex-grow flex flex-col">
            <TVScreen 
              state={state} 
              currentChannel={channels[state.currentChannelIndex]} 
              aiProgram={aiProgram}
              veoVideo={veoVideo}
              isGeneratingVeo={isGeneratingVeo}
            />
            
            {/* Speaker Grille */}
            <div className="mt-6 flex flex-col gap-2 opacity-50">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 bg-[#2a1a0e] rounded-full w-full"></div>
              ))}
            </div>
          </div>

          {/* Control Panel Section */}
          <div className="w-40 bg-[#5c4029] rounded-xl flex flex-col items-center py-8 gap-10 shadow-lg border border-[#3d2a1b]">
            <TVControls 
              state={state} 
              onPower={onPower} 
              onChannelChange={onChannelChange} 
              onVolumeChange={onVolumeChange}
            />
          </div>
        </div>
      </div>

      {/* Stand/Feet */}
      <div className="absolute -bottom-4 left-10 w-8 h-6 bg-[#2a1a0e] rounded-b-xl"></div>
      <div className="absolute -bottom-4 right-10 w-8 h-6 bg-[#2a1a0e] rounded-b-xl"></div>
    </div>
  );
};
