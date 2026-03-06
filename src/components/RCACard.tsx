'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingDown, TrendingUp, Activity, ChevronDown, ChevronRight, Minus } from 'lucide-react'
import {
  ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ReferenceLine, LabelList
} from 'recharts'

export interface RCANode {
  metric: string
  value: string
  variance: string
  sentiment: 'positive' | 'negative' | 'neutral'
  impactPct?: number       // % of total variance (e.g. -68.4 means "caused 68% of the drop")
  impactAbs?: number       // absolute number for sorting/waterfall
  description?: string     // optional one-line explanation
  drivers?: RCANode[]
}

interface RCACardProps {
  title: string
  rootNode: RCANode
  conclusion: string
}

// Custom Waterfall tooltip
const WaterfallTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="text-sm rounded-xl shadow-lg px-4 py-3 border"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
      <p className="font-semibold mb-1">{d.name}</p>
      <p style={{ color: d.color }}>{d.displayValue}</p>
      {d.pct !== undefined && (
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          {d.pct > 0 ? '+' : ''}{d.pct.toFixed(1)}% of variance
        </p>
      )}
    </div>
  );
};

// Build waterfall data from root node drivers
function buildWaterfallData(rootNode: RCANode) {
  const drivers = rootNode.drivers ?? [];
  const data: any[] = [];
  let running = 0;

  // Start bar (baseline = previous period)
  data.push({
    name: 'Prior Period',
    start: 0,
    bar: 100,
    color: '#94a3b8',
    displayValue: rootNode.value,
    isBase: true,
    pct: undefined,
  });

  drivers.forEach((d) => {
    const abs = d.impactAbs ?? 0;
    const pct = d.impactPct ?? 0;
    const color = d.sentiment === 'positive' ? 'var(--chart-1)' : d.sentiment === 'negative' ? '#ef4444' : '#94a3b8';
    data.push({
      name: d.metric,
      start: running,
      bar: abs,
      color,
      displayValue: d.variance,
      sentiment: d.sentiment,
      pct,
    });
    running += abs;
  });

  // End bar (current period)
  data.push({
    name: 'Current Period',
    start: 0,
    bar: 100 + running,
    color: rootNode.sentiment === 'positive' ? 'var(--chart-1)' : '#ef4444',
    displayValue: rootNode.variance,
    isEnd: true,
    pct: undefined,
  });

  return data;
}

// Collapsible RCA tree node
function RCATreeNode({ node, depth = 0, totalVariance }: { node: RCANode; depth?: number; totalVariance?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isRoot = depth === 0;
  const hasChildren = (node.drivers?.length ?? 0) > 0;

  const sentimentBg = node.sentiment === 'negative'
    ? 'bg-red-50 border-red-200'
    : node.sentiment === 'positive'
    ? 'bg-emerald-50 border-emerald-200'
    : 'bg-slate-50 border-slate-200';

  const sentimentText = node.sentiment === 'negative'
    ? 'text-red-600'
    : node.sentiment === 'positive'
    ? 'text-emerald-600'
    : 'text-slate-500';

  const Icon = node.sentiment === 'negative' ? TrendingDown
    : node.sentiment === 'positive' ? TrendingUp : Minus;

  // Impact bar width (clamp to 0-100)
  const impactWidth = node.impactPct !== undefined
    ? Math.min(100, Math.abs(node.impactPct))
    : undefined;

  return (
    <div className={`relative ${!isRoot ? 'ml-6 mt-3' : ''}`}>
      {/* Connector lines */}
      {!isRoot && <div className="absolute -left-5 top-5 w-5 h-px bg-slate-300" />}
      {!isRoot && <div className="absolute -left-5 -top-3 w-px h-8 bg-slate-300" />}

      {/* Node */}
      <div
        className={`relative z-10 p-3 rounded-xl border ${sentimentBg} transition-all`}
        style={{ minWidth: '220px', maxWidth: '320px' }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            {hasChildren && (
              <button onClick={() => setExpanded(e => !e)} className="p-0.5 hover:bg-white rounded">
                {expanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            )}
            <span className={`font-semibold text-sm ${isRoot ? 'text-slate-800' : 'text-slate-700'}`}>{node.metric}</span>
          </div>
          <Icon className={`w-4 h-4 flex-shrink-0 ${sentimentText}`} />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-base font-bold text-slate-900">{node.value}</span>
          <span className={`text-sm font-semibold ${sentimentText}`}>{node.variance}</span>
        </div>

        {/* Impact contribution bar */}
        {impactWidth !== undefined && (
          <div className="mb-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs text-slate-500">Impact contribution</span>
              <span className={`text-xs font-semibold ${sentimentText}`}>
                {node.impactPct! > 0 ? '+' : ''}{node.impactPct?.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${impactWidth}%`,
                  backgroundColor: node.sentiment === 'negative' ? '#ef4444' : node.sentiment === 'positive' ? '#10b981' : '#94a3b8'
                }}
              />
            </div>
          </div>
        )}

        {node.description && (
          <p className="text-xs text-slate-500 leading-relaxed">{node.description}</p>
        )}
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="relative">
          <div className="absolute left-1 top-0 bottom-0 w-px bg-slate-200" />
          <div className="flex flex-col">
            {node.drivers!.map((d, i) => (
              <RCATreeNode key={i} node={d} depth={depth + 1} totalVariance={totalVariance} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RCACard({ title, rootNode, conclusion }: RCACardProps) {
  const [activeTab, setActiveTab] = useState<'tree' | 'waterfall'>('waterfall');
  const waterfallData = buildWaterfallData(rootNode);

  return (
    <div className="insight-card visible slide-in overflow-hidden" style={{ borderColor: 'var(--negative)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b" style={{ backgroundColor: 'rgba(173, 59, 35, 0.05)', borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-negative" />
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              PVM Diagnosis
            </h3>
            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {title} · Price × Volume × Mix Breakdown
            </p>
          </div>
        </div>
        {/* View Tabs */}
        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {(['waterfall', 'tree'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 text-xs font-medium capitalize transition-all"
              style={{
                backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              }}>
              {tab === 'waterfall' ? '📊 Waterfall' : '🌳 Tree'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 divide-x" style={{ borderBottomWidth: 1, borderColor: 'var(--border)' }}>
        {(rootNode.drivers ?? []).slice(0, 3).map((d, i) => (
          <div key={i} className="p-4 text-center">
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-tertiary)' }}>{d.metric}</p>
            <p className={`text-lg font-bold ${d.sentiment === 'negative' ? 'text-red-600' : d.sentiment === 'positive' ? 'text-emerald-600' : 'text-slate-700'}`}>
              {d.variance}
            </p>
            {d.impactPct !== undefined && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {Math.abs(d.impactPct).toFixed(0)}% of gap
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Waterfall Chart */}
      {activeTab === 'waterfall' && (
        <div className="p-5">
          <p className="text-xs uppercase tracking-wide font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
            Revenue Variance Bridge — H2 vs H1
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={waterfallData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<WaterfallTooltip />} />
              <ReferenceLine y={0} stroke="var(--border)" />
              {/* Invisible start bar (for stacking) */}
              <Bar dataKey="start" stackId="a" fill="transparent" />
              {/* Visible variance bar */}
              <Bar dataKey="bar" stackId="a" radius={[4, 4, 0, 0]}>
                {waterfallData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList dataKey="displayValue" position="top" style={{ fontSize: 11, fontWeight: 600, fill: 'var(--text-primary)' }} />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>

          {/* Driver impact legend */}
          {(rootNode.drivers ?? []).length > 0 && (
            <div className="mt-5 space-y-2">
              <p className="text-xs uppercase tracking-wide font-medium" style={{ color: 'var(--text-secondary)' }}>
                Sub-Driver Breakdown
              </p>
              {(rootNode.drivers ?? []).map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    backgroundColor: d.sentiment === 'negative' ? '#ef4444' : d.sentiment === 'positive' ? '#10b981' : '#94a3b8'
                  }} />
                  <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{d.metric}</span>
                  <span className={`text-sm font-semibold tabular-nums ${d.sentiment === 'negative' ? 'text-red-600' : d.sentiment === 'positive' ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {d.variance}
                  </span>
                  {d.impactPct !== undefined && (
                    <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full" style={{
                        width: `${Math.min(100, Math.abs(d.impactPct))}%`,
                        backgroundColor: d.sentiment === 'negative' ? '#ef4444' : '#10b981'
                      }} />
                    </div>
                  )}
                  {d.impactPct !== undefined && (
                    <span className="text-xs w-10 text-right tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                      {Math.abs(d.impactPct).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tree View */}
      {activeTab === 'tree' && (
        <div className="p-6 overflow-x-auto" style={{ backgroundColor: 'var(--filter-pane-bg)' }}>
          <RCATreeNode node={rootNode} depth={0} />
        </div>
      )}

      {/* Conclusion */}
      <div className="p-5 border-t" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-negative" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-negative mb-1">Diagnostic Conclusion</p>
            <p className="leading-relaxed text-sm" style={{ color: 'var(--text-primary)' }}>{conclusion}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
