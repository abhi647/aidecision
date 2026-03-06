'use client'

import { useState } from 'react'
import { Sliders, TrendingUp, Calculator, Zap } from 'lucide-react'

interface ScenarioModelingProps {
  baseRevenue: number
  onScenarioChange?: (impact: number, percentage: number) => void
}

export default function ScenarioModeling({ baseRevenue, onScenarioChange }: ScenarioModelingProps) {
  const [scenarios, setScenarios] = useState({
    price: 0,
    volume: 0,
    cost: 0,
    discount: 0
  })

  const calculateImpact = () => {
    const priceImpact = (scenarios.price / 100) * baseRevenue
    const volumeImpact = (scenarios.volume / 100) * baseRevenue
    const costImpact = -(scenarios.cost / 100) * baseRevenue * 0.3 // Assuming 30% cost impact
    const discountImpact = -(scenarios.discount / 100) * baseRevenue
    
    const totalImpact = priceImpact + volumeImpact + costImpact + discountImpact
    const percentage = (totalImpact / baseRevenue) * 100
    
    return { totalImpact, percentage }
  }

  const { totalImpact, percentage } = calculateImpact()

  const handleSliderChange = (key: keyof typeof scenarios, value: number) => {
    const newScenarios = { ...scenarios, [key]: value }
    setScenarios(newScenarios)
    
    if (onScenarioChange) {
      const impact = calculateImpact()
      onScenarioChange(impact.totalImpact, impact.percentage)
    }
  }

  const getImpactColor = (impact: number) => {
    if (impact > 0) return 'text-positive'
    if (impact < 0) return 'text-negative'
    return 'text-neutral'
  }

  return (
    <div className="card p-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--filter-active)' }}>
          <Sliders className="w-6 h-6" style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>🎯 Scenario Modeling</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Adjust variables to see live impact</p>
        </div>
      </div>

      {/* Impact Display */}
      <div 
        className="rounded-xl p-4 mb-6 border"
        style={{ 
          background: 'linear-gradient(135deg, var(--filter-active) 0%, transparent 100%)',
          borderColor: 'var(--primary)' 
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm uppercase tracking-wide font-semibold" style={{ color: 'var(--text-secondary)' }}>Projected Impact</span>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`text-2xl font-bold ${getImpactColor(totalImpact)}`}>
                ₹{Math.abs(totalImpact / 100000).toFixed(1)}L
              </span>
              <span className={`text-lg font-semibold ${getImpactColor(totalImpact)}`}>
                {totalImpact >= 0 ? '+' : ''}{percentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-right">
            {totalImpact >= 0 ? (
              <TrendingUp className="w-8 h-8" style={{ color: 'var(--sentiment-positive)' }} />
            ) : (
              <TrendingUp className="w-8 h-8 transform rotate-180" style={{ color: 'var(--sentiment-negative)' }} />
            )}
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Price Change */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium" style={{ color: 'var(--text-primary)' }}>Price Change</label>
            <span className={`font-bold ${scenarios.price >= 0 ? 'text-positive' : 'text-negative'}`}>
              {scenarios.price >= 0 ? '+' : ''}{scenarios.price}%
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="20"
            value={scenarios.price}
            onChange={(e) => handleSliderChange('price', Number(e.target.value))}
            className="scenario-slider w-full"
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>-20%</span>
            <span>0%</span>
            <span>+20%</span>
          </div>
        </div>

        {/* Volume Change */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium" style={{ color: 'var(--text-primary)' }}>Volume Change</label>
            <span className={`font-bold ${scenarios.volume >= 0 ? 'text-positive' : 'text-negative'}`}>
              {scenarios.volume >= 0 ? '+' : ''}{scenarios.volume}%
            </span>
          </div>
          <input
            type="range"
            min="-30"
            max="30"
            value={scenarios.volume}
            onChange={(e) => handleSliderChange('volume', Number(e.target.value))}
            className="scenario-slider w-full"
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>-30%</span>
            <span>0%</span>
            <span>+30%</span>
          </div>
        </div>

        {/* Cost Change */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium" style={{ color: 'var(--text-primary)' }}>Cost Change</label>
            <span className={`font-bold ${scenarios.cost <= 0 ? 'text-positive' : 'text-negative'}`}>
              {scenarios.cost >= 0 ? '+' : ''}{scenarios.cost}%
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="30"
            value={scenarios.cost}
            onChange={(e) => handleSliderChange('cost', Number(e.target.value))}
            className="scenario-slider w-full"
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>-10%</span>
            <span>0%</span>
            <span>+30%</span>
          </div>
        </div>

        {/* Discount Change */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium" style={{ color: 'var(--text-primary)' }}>Discount Change</label>
            <span className={`font-bold ${scenarios.discount <= 0 ? 'text-positive' : 'text-negative'}`}>
              {scenarios.discount >= 0 ? '+' : ''}{scenarios.discount}%
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={scenarios.discount}
            onChange={(e) => handleSliderChange('discount', Number(e.target.value))}
            className="scenario-slider w-full"
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>-50%</span>
            <span>0%</span>
            <span>+50%</span>
          </div>
        </div>
      </div>

      {/* Quick Scenario Buttons */}
      <div className="mt-6 pt-4 border-t" style={{ borderTopColor: 'var(--border)' }}>
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-4 h-4" style={{ color: 'var(--apricot)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Quick Scenarios</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'Optimistic', values: { price: 5, volume: 10, cost: -5, discount: -10 } },
            { name: 'Conservative', values: { price: 2, volume: 3, cost: 2, discount: 0 } },
            { name: 'Aggressive', values: { price: 10, volume: -5, cost: 0, discount: 15 } },
            { name: 'Reset', values: { price: 0, volume: 0, cost: 0, discount: 0 } }
          ].map((scenario, index) => (
            <button
              key={index}
              onClick={() => setScenarios(scenario.values)}
              className="skill-chip text-xs"
            >
              {scenario.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}