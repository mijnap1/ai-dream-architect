
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DreamEntry } from '../types';

interface DreamAtlasProps {
  entries: DreamEntry[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  type: 'theme' | 'symbol' | 'dream';
  value: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

export const DreamAtlas: React.FC<DreamAtlasProps> = ({ entries }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const themeCounts = new Map<string, number>();
  const symbolCounts = new Map<string, number>();
  let analyzableDreams = 0;

  entries.forEach((entry) => {
    if (!entry.analysis) return;
    analyzableDreams += 1;
    entry.analysis.themes.forEach((theme) => {
      themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
    });
    entry.analysis.symbols.forEach((symbol) => {
      symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1);
    });
  });

  const topThemes = Array.from(themeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const topSymbols = Array.from(symbolCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const maxThemeCount = topThemes[0]?.[1] || 1;
  const maxSymbolCount = topSymbols[0]?.[1] || 1;

  useEffect(() => {
    if (!svgRef.current || entries.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 520;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Prepare data
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeSet = new Set<string>();

    entries.forEach((entry) => {
      if (!entry.analysis) return;
      
      const dreamNodeId = `dream-${entry.id}`;
      nodes.push({ id: dreamNodeId, type: 'dream', value: 10 });

      entry.analysis.themes.forEach(theme => {
        if (!nodeSet.has(theme)) {
          nodes.push({ id: theme, type: 'theme', value: 16 });
          nodeSet.add(theme);
        }
        links.push({ source: dreamNodeId, target: theme });
      });

      entry.analysis.symbols.forEach(symbol => {
        if (!nodeSet.has(symbol)) {
          nodes.push({ id: symbol, type: 'symbol', value: 8 });
          nodeSet.add(symbol);
        }
        links.push({ source: dreamNodeId, target: symbol });
      });
    });

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const link = svg.append("g")
      .attr("stroke", "#1e293b")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-grab active:cursor-grabbing")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", d => d.value)
      .attr("fill", d => {
        if (d.type === 'dream') return "#8b5cf6";
        if (d.type === 'theme') return "#06b6d4";
        return "#64748b";
      })
      .attr("filter", "url(#glow)");

    node.append("text")
      .attr("dy", 28)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "9px")
      .attr("font-weight", "bold")
      .attr("text-transform", "uppercase")
      .attr("letter-spacing", "0.1em")
      .text(d => d.type !== 'dream' ? d.id : "");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [entries]);

  return (
    <div className="glass rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden border border-white/5">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white mb-2">The Memory Atlas</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Trace themes and symbols across your dreamscape</p>
        </div>
        <div className="flex flex-wrap gap-3 text-[9px] uppercase tracking-widest font-black">
          <div className="glass px-4 py-2 rounded-full text-slate-300">
            Total Dreams <span className="text-white ml-2">{entries.length}</span>
          </div>
          <div className="glass px-4 py-2 rounded-full text-slate-300">
            Themes <span className="text-cyan-300 ml-2">{themeCounts.size}</span>
          </div>
          <div className="glass px-4 py-2 rounded-full text-slate-300">
            Symbols <span className="text-violet-300 ml-2">{symbolCounts.size}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="bg-slate-950/20 rounded-3xl border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex gap-5 text-[9px] uppercase tracking-widest font-black text-slate-400">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" /> Dream</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" /> Theme</div>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-[0_0_10px_rgba(100,116,139,0.5)]" /> Symbol</div>
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-500">Drag to Explore</span>
          </div>
          <div className="relative">
            <svg ref={svgRef} className="w-full h-[520px]" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full text-[9px] text-slate-500 uppercase font-black tracking-widest">
              Pull nodes to reveal new paths
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Top Themes</h3>
              <span className="text-[10px] text-slate-500">{topThemes.length} shown</span>
            </div>
            <div className="space-y-3">
              {topThemes.map(([theme, count]) => (
                <div key={theme} className="flex items-center gap-3">
                  <div className="text-[11px] text-slate-200 w-24 truncate">{theme}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-900/70 overflow-hidden">
                    <div
                      className="h-full bg-cyan-500/80"
                      style={{ width: `${(count / maxThemeCount) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 w-6 text-right">{count}</div>
                </div>
              ))}
              {topThemes.length === 0 && (
                <p className="text-[11px] text-slate-500">No themes logged yet.</p>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Top Symbols</h3>
              <span className="text-[10px] text-slate-500">{topSymbols.length} shown</span>
            </div>
            <div className="space-y-3">
              {topSymbols.map(([symbol, count]) => (
                <div key={symbol} className="flex items-center gap-3">
                  <div className="text-[11px] text-slate-200 w-24 truncate">{symbol}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-900/70 overflow-hidden">
                    <div
                      className="h-full bg-violet-500/80"
                      style={{ width: `${(count / maxSymbolCount) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 w-6 text-right">{count}</div>
                </div>
              ))}
              {topSymbols.length === 0 && (
                <p className="text-[11px] text-slate-500">No symbols logged yet.</p>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recent Dreams</h3>
              <span className="text-[10px] text-slate-500">{analyzableDreams} analyzed</span>
            </div>
            <div className="space-y-3">
              {entries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-200 truncate">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                    {entry.analysis?.mood || 'unknown'}
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-[11px] text-slate-500">Add a dream to begin mapping.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
