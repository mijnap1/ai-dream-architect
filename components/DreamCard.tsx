
import React from 'react';
import { DreamEntry } from '../types';
import { Calendar, Brain, Hash, Sliders, ChevronRight } from 'lucide-react';

interface DreamCardProps {
  entry: DreamEntry;
}

export const DreamCard: React.FC<DreamCardProps> = ({ entry }) => {
  const { analysis, imageUrl, content, date } = entry;

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      peaceful: 'text-teal-400 border-teal-500/30 bg-teal-500/5',
      tense: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
      surreal: 'text-violet-400 border-violet-500/30 bg-violet-500/5',
      joyful: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
      fearful: 'text-red-400 border-red-500/30 bg-red-500/5',
      mysterious: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
    };
    return colors[mood] || 'text-slate-400 border-slate-500/30 bg-slate-500/5';
  };

  return (
    <article className="glass-card rounded-[2.5rem] overflow-hidden mb-8 flex flex-col lg:flex-row group">
      {imageUrl && (
        <div className="lg:w-[40%] h-72 lg:h-auto relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt="AI Dream Visualization" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6 right-6">
             <div className="flex gap-2">
                {analysis?.themes.slice(0, 2).map((theme, i) => (
                  <span key={i} className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white/80 uppercase tracking-widest font-bold">
                    {theme}
                  </span>
                ))}
             </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5 text-slate-500 text-xs font-bold tracking-widest uppercase">
              <Calendar className="w-4 h-4 text-violet-500" />
              {new Date(date).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}
            </div>
            {analysis && (
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-widest uppercase ${getMoodColor(analysis.mood)}`}>
                {analysis.mood}
              </span>
            )}
          </div>

          <p className="text-slate-100 text-xl font-serif leading-relaxed mb-8 italic opacity-90 group-hover:opacity-100 transition-opacity">
            "{content}"
          </p>

          {analysis && (
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <Brain className="w-5 h-5 text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black text-violet-300 uppercase tracking-[0.2em] mb-2">Architect's Note</h4>
                  <p className="text-slate-400 text-sm leading-relaxed italic">{analysis.interpretation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-3">
                    <Hash className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-black tracking-widest">Symbolic Fragments</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.symbols.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[10px] text-slate-300 hover:bg-violet-900/20 hover:border-violet-500/30 transition-colors cursor-default">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-500 mb-3">
                    <Sliders className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-black tracking-widest">Lucidity Index</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-violet-600 to-cyan-400 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        style={{ width: `${analysis.lucidityScore * 10}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 w-4">{analysis.lucidityScore}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
           <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest group/btn">
             Explore Details <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </article>
  );
};
