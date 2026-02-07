
import React, { useState, useEffect } from 'react';
import { DreamEntry, ViewState } from './types';
import { DreamInput } from './components/DreamInput';
import { DreamCard } from './components/DreamCard';
import { DreamAtlas } from './components/DreamAtlas';
import { MoodStats } from './components/MoodStats';
import { Moon, Book, Network, BarChart3, Star, Github } from 'lucide-react';

const STORAGE_KEY = 'oneiro_dream_journal';

const App: React.FC = () => {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [view, setView] = useState<ViewState>('journal');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load dreams", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const handleAddEntry = (entry: DreamEntry) => {
    setEntries([entry, ...entries]);
  };

  const handleViewChange = (newView: ViewState) => {
    if (newView === view) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 pb-24 relative z-10">
      <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
        <div className="flex items-center gap-6 group cursor-default">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl relative rotate-3 group-hover:rotate-6 transition-transform">
              <Moon className="w-9 h-9 text-violet-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-white glow-text">Oneiro</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Architect of the Subconscious</p>
          </div>
        </div>

        <nav className="flex bg-slate-900/40 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/5 shadow-2xl">
          {[
            { id: 'journal', icon: Book, label: 'Journal', color: 'violet' },
            { id: 'atlas', icon: Network, label: 'Atlas', color: 'cyan' },
            { id: 'stats', icon: BarChart3, label: 'Insights', color: 'amber' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id as ViewState)}
              className={`
                flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-300
                ${view === item.id 
                  ? `bg-${item.color}-600/90 text-white shadow-xl shadow-${item.color}-900/20` 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        {view === 'journal' && (
          <div className="max-w-3xl mx-auto">
            <DreamInput onAddEntry={handleAddEntry} />
            <div className="space-y-4">
              {entries.length > 0 ? (
                entries.map(entry => <DreamCard key={entry.id} entry={entry} />)
              ) : (
                <div className="text-center py-32 opacity-20">
                  <Star className="w-16 h-16 mx-auto mb-6 animate-pulse" />
                  <p className="text-2xl font-serif italic tracking-wide">Your dreamscape awaits its first entry...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'atlas' && (
          <div className="max-w-5xl mx-auto">
            {entries.length > 0 ? (
              <DreamAtlas entries={entries} />
            ) : (
              <div className="text-center py-32 opacity-20">
                <Network className="w-16 h-16 mx-auto mb-6" />
                <p className="text-2xl font-serif italic tracking-wide">The Constellation is currently dark.</p>
              </div>
            )}
          </div>
        )}

        {view === 'stats' && (
          <div className="max-w-5xl mx-auto">
             {entries.length > 0 ? (
              <MoodStats entries={entries} />
            ) : (
              <div className="text-center py-32 opacity-20">
                <BarChart3 className="w-16 h-16 mx-auto mb-6" />
                <p className="text-2xl font-serif italic tracking-wide">Insufficient data for psychological mapping.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-50">
        <div className="max-w-6xl mx-auto flex justify-end">
          <div className="pointer-events-auto">
            <a
              href="https://github.com/mijnap1/ai-dream-architect"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub repository"
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all cursor-pointer shadow-2xl"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
