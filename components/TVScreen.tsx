
import React, { useEffect, useRef } from 'react';
import { TVState, Channel, ChannelType } from '../types';

interface TVScreenProps {
  state: TVState;
  currentChannel: Channel;
  aiProgram: any;
  veoVideo: string | null;
  isGeneratingVeo: boolean;
}

export const TVScreen: React.FC<TVScreenProps> = ({ state, currentChannel, aiProgram, veoVideo, isGeneratingVeo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (state.isPowerOn && videoRef.current) {
      if (currentChannel.type === ChannelType.VIDEO || (currentChannel.type === ChannelType.VEO && veoVideo)) {
        videoRef.current.play().catch(() => {});
      }
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [state.isPowerOn, currentChannel.type, veoVideo]);

  if (!state.isPowerOn) {
    return (
      <div className="relative w-full aspect-[4/3] bg-black rounded-xl overflow-hidden border-2 border-zinc-700 shadow-[inset_0_0_50px_rgba(0,0,0,1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[4/3] bg-zinc-900 rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl transition-all duration-300 ${state.isChanging ? 'brightness-150' : ''} scanlines`}>
      
      {/* Global Glare/Reflection Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10 opacity-60"></div>

      {/* Static / Interference Layer */}
      {(state.isChanging || currentChannel.type === ChannelType.STATIC) && (
        <div className="absolute inset-0 z-20 bg-black opacity-80 pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.5,
            animation: 'noise 0.2s infinite steps(2)'
          }}></div>
        </div>
      )}

      {/* Content Layer */}
      <div className="w-full h-full bg-black flex items-center justify-center">
        {currentChannel.type === ChannelType.VIDEO && (
          <video 
            ref={videoRef}
            src={currentChannel.src} 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {currentChannel.type === ChannelType.VEO && (
          <div className="w-full h-full relative">
            {isGeneratingVeo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-amber-500 font-retro p-4 text-center">
                 <div className="animate-spin text-4xl mb-4">🌀</div>
                 <p className="animate-pulse">Tuning to Neo-Orbit...</p>
                 <p className="text-xs text-zinc-500 mt-2 italic">Generating high-fidelity transmission...</p>
              </div>
            ) : veoVideo ? (
              <video 
                ref={videoRef}
                src={veoVideo} 
                loop 
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 p-8 text-center text-zinc-600 font-retro">
                READY FOR VEO TRANSMISSION
              </div>
            )}
          </div>
        )}

        {currentChannel.type === ChannelType.AI_GEN && (
          <div className="w-full h-full flex flex-col bg-zinc-900 relative">
            {aiProgram?.image ? (
              <img src={aiProgram.image} className="w-full h-1/2 object-cover opacity-80" alt="Broadcast" />
            ) : (
              <div className="w-full h-1/2 bg-zinc-800 animate-pulse flex items-center justify-center text-zinc-600">
                LOADING FEED...
              </div>
            )}
            <div className="p-4 flex-grow bg-zinc-950 font-retro text-amber-400 overflow-hidden">
               <h3 className="text-xl underline mb-2 uppercase">{aiProgram?.title || 'Unknown Program'}</h3>
               <p className="text-sm text-amber-600 leading-tight">{aiProgram?.summary || 'Scanning for signals...'}</p>
               <div className="mt-4 flex justify-between items-center text-[10px] text-zinc-700">
                  <span>GENRE: {aiProgram?.genre || 'N/A'}</span>
                  <span>LIVE RE-BROADCAST</span>
               </div>
            </div>
          </div>
        )}

        {currentChannel.type === ChannelType.STATIC && (
           <div className="font-retro text-zinc-700 text-3xl animate-pulse">NO SIGNAL</div>
        )}
      </div>

      <style>{`
        @keyframes noise {
          0% { transform: translate(0,0) }
          10% { transform: translate(-1%,-1%) }
          20% { transform: translate(2%,1%) }
          30% { transform: translate(-2%,3%) }
          40% { transform: translate(1%,-3%) }
          50% { transform: translate(-1%,2%) }
          60% { transform: translate(-3%,1%) }
          70% { transform: translate(2%,1%) }
          80% { transform: translate(1%,-2%) }
          90% { transform: translate(-2%,2%) }
          100% { transform: translate(1%,-3%) }
        }
      `}</style>
    </div>
  );
};
