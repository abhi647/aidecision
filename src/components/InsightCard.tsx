'use client'

import { BarChart3, Lightbulb, ExternalLink } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, ReferenceLine, LabelList, Legend } from 'recharts'

interface InsightCardProps {
  title: string
  takeaway: string
  chartType: 'bar' | 'pie' | 'line' | 'area' | 'scatter' | 'heatmap' | 'radar' | 'donut' | 'histogram' | 'bubble' | 'waterfall' | 'multi' | 'combo'
  data: any[]
  confidence?: 'high' | 'medium' | 'low'
  sentiment?: 'positive' | 'negative' | 'neutral'
  onDrillDown?: (dataPoint: any) => void
  onDiagnose?: () => void
}

export default function InsightCard({ 
  title, 
  takeaway, 
  chartType, 
  data,
  confidence = 'high',
  sentiment = 'neutral',
  onDrillDown,
  onDiagnose
}: InsightCardProps) {
  
  const colors = [
    'var(--chart-1)',  // Emerald Green
    'var(--chart-2)',  // Coral Red
    'var(--chart-3)',  // Purple
    'var(--chart-4)',  // Amber
    'var(--chart-5)',  // Rose
    'var(--chart-6)',  // Cyan
    'var(--chart-7)',  // Violet
    'var(--chart-8)',  // Lime
    'var(--chart-9)',  // Orange
    'var(--chart-10)', // Teal
    'var(--chart-11)', // Pink
    'var(--chart-12)'  // Indigo
  ]

  const renderChart = () => {
    const tooltipStyle = { 
      backgroundColor: 'var(--card)', 
      border: '1px solid var(--border)',
      borderRadius: '8px',
      color: 'var(--foreground)',
      boxShadow: 'var(--shadow-md)'
    };

    const axisProps = {
      tick: { fill: 'var(--text-secondary)', fontSize: 12 },
      axisLine: { stroke: 'var(--border)' },
      tickLine: { stroke: 'var(--border)' }
    };

    switch (chartType) {
      case 'bar':
        // Color each bar individually: negative values get red, positive get the primary color
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => typeof v === 'number' && Math.abs(v) > 999 ? `${(v/1000).toFixed(0)}K` : v} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: any) => [typeof v === 'number' && Math.abs(v) > 999 ? `${v.toLocaleString()}` : v, n]} />
              <ReferenceLine y={0} stroke="var(--border)" />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                onClick={(data) => onDrillDown && onDrillDown(data)}
                style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
              >
                {data.map((entry: any, index: number) => (
                  <Cell
                    key={index}
                    fill={entry.value < 0 ? '#ef4444' : entry.positive === false ? '#ef4444' : colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    onClick={() => onDrillDown && onDrillDown(entry)}
                    style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                    className={onDrillDown ? 'hover:opacity-80 transition-opacity outline-none' : ''}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 6 }}
                activeDot={{ onClick: (_: any, payload: any) => onDrillDown && payload?.payload && onDrillDown(payload.payload), cursor: onDrillDown ? 'pointer' : 'default' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={0.3}
                strokeWidth={3}
                activeDot={{ onClick: (_: any, payload: any) => onDrillDown && payload?.payload && onDrillDown(payload.payload), cursor: onDrillDown ? 'pointer' : 'default' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" {...axisProps} />
              <YAxis dataKey="y" {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Scatter 
                dataKey="value" 
                fill={colors[0]}
                onClick={(data) => onDrillDown && onDrillDown(data)}
                style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                className={onDrillDown ? 'hover:opacity-80 transition-opacity' : ''}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <PolarRadiusAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
              <Radar 
                name="Value" 
                dataKey="value" 
                stroke={colors[0]} 
                fill={colors[0]} 
                fillOpacity={0.3}
                strokeWidth={3}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        )

      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
              <XAxis dataKey="range" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar 
                dataKey="frequency" 
                fill={colors[2]}
                radius={[2, 2, 0, 0]}
                onClick={(data) => onDrillDown && onDrillDown(data)}
                style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                className={onDrillDown ? 'hover:opacity-80 transition-opacity' : ''}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'bubble':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" {...axisProps} />
              <YAxis dataKey="y" {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Scatter 
                dataKey="z" 
                fill={colors[3]} 
                onClick={(data) => onDrillDown && onDrillDown(data)}
                style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                className={onDrillDown ? 'hover:opacity-80 transition-opacity' : ''}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )

      // Waterfall / bridge chart
      case 'waterfall': {
        // Expects data: [{name, value, isBase?, isEnd?}] OR raw numbers
        let running = 0;
        const wfData = data.map((d: any) => {
          if (d.isBase || d.isEnd) {
            return { ...d, start: 0, bar: d.value ?? d.total ?? 0, color: d.isEnd ? (d.value > 0 ? 'var(--chart-1)' : '#ef4444') : '#94a3b8' };
          }
          const start = running;
          running += (d.value ?? 0);
          return { ...d, start, bar: d.value ?? 0, color: (d.value ?? 0) >= 0 ? 'var(--chart-1)' : '#ef4444' };
        });
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={wfData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v: any) => typeof v === 'number' && Math.abs(v) > 999 ? `${(v/1000).toFixed(0)}K` : v} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: string) => n === 'bar' ? [typeof v === 'number' ? v.toLocaleString() : v, 'Impact'] : [v, n]} />
              <ReferenceLine y={0} stroke="var(--text-secondary)" strokeWidth={1} />
              <Bar dataKey="start" stackId="wf" fill="transparent" />
              <Bar dataKey="bar" stackId="wf" radius={[4, 4, 0, 0]}>
                {wfData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                <LabelList dataKey="bar" position="top" style={{ fontSize: 11, fontWeight: 600, fill: 'var(--text-primary)' }} formatter={(v: any) => typeof v === 'number' && Math.abs(v) > 999 ? `${v > 0 ? '+' : ''}${(v/1000).toFixed(1)}K` : v} />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        );
      }

      // Multi-series grouped bar
      case 'multi': {
        const seriesKeys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name') : [];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v: any) => typeof v === 'number' && Math.abs(v) > 999 ? `${(v/1000).toFixed(0)}K` : v} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              {seriesKeys.map((key, i) => (
                <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      }

      // Combo: bars for volume, line for price/margin
      case 'combo':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" {...axisProps} />
              <YAxis yAxisId="left" {...axisProps} tickFormatter={(v: any) => typeof v === 'number' && Math.abs(v) > 999 ? `${(v/1000).toFixed(0)}K` : v} />
              <YAxis yAxisId="right" orientation="right" {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              <Bar yAxisId="left" dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} name="Volume" />
              <Line yAxisId="right" type="monotone" dataKey="trend" stroke={colors[1]} strokeWidth={2.5} dot={{ r: 4 }} name="Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'heatmap':
        return (
          <div className="h-64 p-4">
            <div className="text-sm mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
              📊 Heatmap Visualization
            </div>
            <div className="grid grid-cols-7 gap-1 h-48">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="rounded-sm flex items-center justify-center text-xs font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: colors[Math.floor(item.value / 20) % colors.length],
                    color: 'white',
                    opacity: 0.7 + (item.value / 100) * 0.3
                  }}
                  title={`${item.name}: ${item.value}`}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-64 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 opacity-50" style={{ color: 'var(--text-tertiary)' }} />
            <div className="ml-3 text-center">
              <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Chart Unavailable</div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Type: {chartType}</div>
            </div>
          </div>
        )
    }
  }

  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high': return 'text-positive'
      case 'medium': return 'text-apricot'
      default: return 'text-negative'
    }
  }

  return (
    <div className="insight-card chart-container visible slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold transition-colors" style={{ fontSize: 'var(--text-tab)', color: 'var(--text-secondary)' }}>
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${getConfidenceColor()}`} style={{ fontSize: 'var(--text-general)' }}>
            {confidence.toUpperCase()}
          </span>
          <ExternalLink className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4" style={{ height: '300px' }}>
        {renderChart()}
      </div>

      {/* Takeaway */}
      <div className="flex flex-col space-y-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--filter-active)' }}>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 mt-1">
            <Lightbulb className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--primary)' }} />
          </div>
          <div className="flex-1">
            <span className="font-semibold uppercase tracking-wide" style={{ fontSize: 'var(--text-general)', color: 'var(--primary)' }}>
              Takeaway
            </span>
            <p className="mt-1 leading-relaxed" style={{ fontSize: 'var(--text-tab)', color: 'var(--foreground)' }}>
              {takeaway}
            </p>
          </div>
        </div>

        {/* RCA Trigger Button */}
        {sentiment === 'negative' && onDiagnose && (
          <div className="pt-2 flex justify-end">
            <button 
              onClick={onDiagnose}
              className="flex items-center space-x-2 text-sm font-medium px-3 py-1.5 rounded-md transition-colors bg-white hover:bg-red-50 text-negative border border-red-200 shadow-sm"
            >
              <span>🔍 Diagnose Root Cause</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}