'use client'

import { TrendingUp, PieChart, MapPin, Target, Zap, BarChart3, Search } from 'lucide-react'

const defaultPrompts = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "How is Target Crunch performing overall?",
    description: "Analyze Target Foods brand performance",
    query: "Show me overall Target Crunch brand performance including market share and growth"
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Show me regional sales breakdown",
    description: "Regional performance analysis for Target Crunch",
    query: "Break down sales performance by region"
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Diagnose South region sales decline",
    description: "Root-cause tree for regional underperformance",
    query: "Diagnose the root cause for sales decline in South region"
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Diagnose channel margin dip",
    description: "RCA for margin compression by channel",
    query: "Diagnose the root cause for margin dip in General Trade channel"
  },
  {
    icon: <PieChart className="w-5 h-5" />,
    title: "Which SKUs are driving revenue?",
    description: "Top performing products analysis",
    query: "Which SKUs are driving the most revenue and profit?"
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    title: "Channel performance comparison",
    description: "Wholesaler vs Retail performance",
    query: "Compare channel performance for wholesalers and retailers"
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Outlet productivity by region",
    description: "Store-level efficiency analysis",
    query: "Analyze outlet productivity and recommend improvements"
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Seasonal sales patterns for Target Crunch",
    description: "Time-based trends and seasonality",
    query: "Show seasonal sales patterns and trends"
  }
]

interface SmartPromptsProps {
  onPromptSelect: (prompt: string) => void
}

export default function SmartPrompts({ onPromptSelect }: SmartPromptsProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>💡 What would you like to explore with Target Foods data?</h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Choose a starting point or ask your own question about Target Crunch brand performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultPrompts.map((prompt, index) => {
          return (
            <button
              key={index}
              onClick={() => onPromptSelect(prompt.query)}
              className="group card hover:scale-105 transition-all duration-300 text-left p-6 relative overflow-hidden"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-start space-x-4 relative z-10">
                <div 
                  className="p-3 rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: 'var(--filter-active)',
                    borderColor: 'var(--primary)'
                  }}
                >
                  {prompt.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {prompt.title}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{prompt.description}</p>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                style={{ 
                  background: 'linear-gradient(135deg, var(--filter-active) 0%, transparent 100%)'
                }}
              ></div>
            </button>
          )
        })}
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>⚡ Quick Actions</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            'Target Crunch vs competition analysis',
            'Monthly sales trends', 
            'Top performing outlets',
            'Price sensitivity analysis',
            'SKU profitability ranking',
            'Regional expansion opportunities',
            'Diagnose root cause of South region decline',
            'Why did channel margins drop in Q2?',
            'Build RCA for outlet churn'
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => onPromptSelect(action)}
              className="skill-chip"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
