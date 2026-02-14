
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RetroTV } from './components/RetroTV';
import { Channel, ChannelType, TVState } from './types';
import { GeminiService } from './services/geminiService';

const CHANNELS: Channel[] = [
  { id: '1', name: 'Classic TV', type: ChannelType.VIDEO, src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: '2', name: 'Nature Wild', type: ChannelType.VIDEO, src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: '3', name: 'Static', type: ChannelType.STATIC },
  { id: '4', name: 'AI Broadcast', type: ChannelType.AI_GEN },
  { id: '5', name: 'Veo Cinema', type: ChannelType.VEO },
];

const App: React.FC = () => {
  const [tvState, setTvState] = useState<TVState>({
    isPowerOn: false,
    currentChannelIndex: 0,
    volume: 50,
    isChanging: false,
    brightness: 80,
  });

  const [aiProgram, setAiProgram] = useState<{ title: string; summary: string; image: string | null } | null>(null);
  const [veoVideo, setVeoVideo] = useState<string | null>(null);
  const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);
  const [veoPrompt, setVeoPrompt] = useState("");

  const togglePower = () => {
    setTvState(prev => ({ ...prev, isPowerOn: !prev.isPowerOn }));
  };

  const changeChannel = () => {
    if (!tvState.isPowerOn) return;
    
    setTvState(prev => ({ ...prev, isChanging: true }));
    
    setTimeout(() => {
      setTvState(prev => ({
        ...prev,
        currentChannelIndex: (prev.currentChannelIndex + 1) % CHANNELS.length,
        isChanging: false
      }));
    }, 500);
  };

  const setVolume = (v: number) => setTvState(prev => ({ ...prev, volume: v }));

  // Load AI program if on AI channel
  useEffect(() => {
    const currentChannel = CHANNELS[tvState.currentChannelIndex];
    if (tvState.isPowerOn && currentChannel.type === ChannelType.AI_GEN && !aiProgram) {
      const loadAI = async () => {
        const prog = await GeminiService.generateAIProgram();
        const img = await GeminiService.generateImageForProgram(prog.title);
        setAiProgram({ ...prog, image: img });
      };
      loadAI();
    }
  }, [tvState.currentChannelIndex, tvState.isPowerOn, aiProgram]);

  const handleVeoGenerate = async () => {
    // Check for API key permission if Veo is selected
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success and proceed (as per instructions)
    }

    setIsGeneratingVeo(true);
    try {
      const url = await GeminiService.generateVeoVideo(veoPrompt || "A retro futuristic city");
      setVeoVideo(url);
    } catch (err) {
      console.error(err);
      alert("Veo generation requires a valid paid API key selected in the dialog.");
    } finally {
      setIsGeneratingVeo(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-950">
      <div className="max-w-4xl w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-retro text-amber-600 mb-2">GEMINI RETRO VISION</h1>
          <p className="text-zinc-500 italic">Experience the analog future.</p>
        </header>

        <RetroTV 
          state={tvState} 
          channels={CHANNELS}
          onPower={togglePower}
          onChannelChange={changeChannel}
          onVolumeChange={setVolume}
          aiProgram={aiProgram}
          veoVideo={veoVideo}
          isGeneratingVeo={isGeneratingVeo}
        />

        {/* Console / Interaction Area */}
        <div className="mt-12 bg-zinc-900 border-2 border-zinc-800 p-6 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-retro text-amber-500 mb-4 uppercase">Channel Guide</h2>
              <div className="space-y-2">
                {CHANNELS.map((ch, idx) => (
                  <div 
                    key={ch.id} 
                    className={`p-2 rounded border ${tvState.currentChannelIndex === idx ? 'bg-amber-900/20 border-amber-500/50 text-amber-200' : 'bg-zinc-800 border-transparent text-zinc-400'}`}
                  >
                    <span className="font-mono text-xs mr-2">CH {idx + 1}</span>
                    <span className="font-bold">{ch.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-retro text-amber-500 mb-4 uppercase">AI Broadcaster</h2>
              {CHANNELS[tvState.currentChannelIndex].type === ChannelType.VEO ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400">Request a custom transmission via Veo (Requires Billing API Key):</p>
                  <input 
                    type="text" 
                    value={veoPrompt}
                    onChange={(e) => setVeoPrompt(e.target.value)}
                    placeholder="e.g., Cyberpunk space station"
                    className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-zinc-200 focus:border-amber-500 outline-none"
                  />
                  <button 
                    onClick={handleVeoGenerate}
                    disabled={isGeneratingVeo || !tvState.isPowerOn}
                    className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold py-2 rounded transition-colors shadow-lg shadow-amber-900/20"
                  >
                    {isGeneratingVeo ? 'Generating Stream...' : 'Broadcast with Veo'}
                  </button>
                  <p className="text-[10px] text-zinc-500 text-center">
                    Check billing: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">ai.google.dev/gemini-api/docs/billing</a>
                  </p>
                </div>
              ) : (
                <div className="bg-zinc-800 p-4 rounded border border-zinc-700 italic text-zinc-400">
                   {aiProgram ? `Currently playing: ${aiProgram.title}` : "Tune to the AI channel to see generated content."}
                </div>
              )}
            </section>
          </div>
        </div>

        <footer className="mt-12 text-center text-zinc-600 text-sm">
          Built with React & Gemini SDK • Retro Aesthetics Engine v2.0
        </footer>
      </div>
    </div>
  );
};

export default App;
