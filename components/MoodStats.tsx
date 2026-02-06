
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { DreamEntry } from '../types';

interface MoodStatsProps {
  entries: DreamEntry[];
}

export const MoodStats: React.FC<MoodStatsProps> = ({ entries }) => {
  const moodData = entries.reduce((acc: any, entry) => {
    if (entry.analysis) {
      const mood = entry.analysis.mood;
      acc[mood] = (acc[mood] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.keys(moodData).map(key => ({
    name: key.toUpperCase(),
    value: moodData[key]
  }));

  const COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#6366f1'];

  const lucidityData = entries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    score: e.analysis?.lucidityScore || 0
  })).reverse();

  const totalDreams = entries.length;
  const avgLucidity = entries.length
    ? (entries.reduce((sum, e) => sum + (e.analysis?.lucidityScore || 0), 0) / entries.length)
    : 0;
  const topMood = chartData.slice().sort((a, b) => b.value - a.value)[0]?.name || '—';

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Total Dreams</p>
          <p className="text-3xl font-serif text-white mt-3">{totalDreams}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Dominant Mood</p>
          <p className="text-2xl font-serif text-cyan-200 mt-3">{topMood}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Average Lucidity</p>
          <p className="text-3xl font-serif text-violet-200 mt-3">{avgLucidity.toFixed(1)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Mood Frequency</h3>
              <p className="text-[11px] text-slate-500">How your dreams feel at a glance</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Lucidity Trends</h3>
              <p className="text-[11px] text-slate-500">Tracking clarity over time</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lucidityData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 10]} />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.3 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
