
import React, { useState } from 'react';
import { analyzeDream, generateDreamImage } from '../services/geminiService';
import { DreamEntry } from '../types';
import { Sparkles, Moon, Loader2 } from 'lucide-react';

interface DreamInputProps {
  onAddEntry: (entry: DreamEntry) => void;
}

export const DreamInput: React.FC<DreamInputProps> = ({ onAddEntry }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDream(content);
      const imageUrl = await generateDreamImage(analysis.imagePrompt);

      const newEntry: DreamEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        content,
        analysis,
        imageUrl
      };

      onAddEntry(newEntry);
      setContent('');
    } catch (error) {
      console.error("Error processing dream:", error);
      alert("The subconscious is clouded right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="glass rounded-[2rem] p-8 mb-12 border-t border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400">
          <Moon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-serif font-bold text-slate-100 tracking-tight">Record Your Dream</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Close your eyes. What was the first thing you saw? How did the air feel?"
            className="w-full h-40 bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/30 resize-none transition-all duration-300 font-light leading-relaxed"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                <span className="text-sm font-medium text-violet-400 animate-pulse uppercase tracking-[0.2em]">Architecting...</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            {content.length} characters written
          </p>
          <button
            type="submit"
            disabled={isAnalyzing || !content.trim()}
            className={`
              relative flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold transition-all overflow-hidden
              ${isAnalyzing 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95'
              }
            `}
          >
            <Sparkles className={`w-5 h-5 ${isAnalyzing ? 'animate-pulse' : ''}`} />
            {isAnalyzing ? 'Mapping Subconscious...' : 'Visualize Dream'}
          </button>
        </div>
      </form>
    </section>
  );
};
