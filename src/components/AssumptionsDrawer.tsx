'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Database, Calendar, MapPin, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

interface AssumptionsDrawerProps {
  dataSources: string[]
  dateRange: {
    start: string
    end: string
  }
  recordCount: number
  coverage: {
    outlets: number
    skus: number
    regions: number
  }
  methodology: string[]
  confidence: 'high' | 'medium' | 'low'
  limitations: string[]
}

export default function AssumptionsDrawer({
  dataSources,
  dateRange,
  recordCount,
  coverage,
  methodology,
  confidence,
  limitations
}: AssumptionsDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getConfidenceIcon = () => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="w-5 h-5" style={{ color: 'var(--sentiment-positive)' }} />
      case 'medium':
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--apricot)' }} />
      default:
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--sentiment-negative)' }} />
    }
  }

  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high': return 'sentiment-positive'
      case 'medium': return 'text-[var(--apricot)]'
      default: return 'sentiment-negative'
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 flex items-center justify-between transition-all duration-300"
        style={{ 
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)'
        }}
      >
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5" />
          <span className="font-medium">📋 Analysis Assumptions & Data Context</span>
          <div 
            className={`px-2 py-1 rounded-full font-semibold border ${getConfidenceColor()}`}
            style={{ fontSize: 'var(--text-general)' }}
          >
            {confidence.toUpperCase()} CONFIDENCE
          </div>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>

      {/* Drawer Content */}
      {isOpen && (
        <div 
          className="border-t p-6 slide-in"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Data Sources */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>Data Sources</h4>
              </div>
              <div className="space-y-2">
                {dataSources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}></div>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{source}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3" style={{ borderTopColor: 'var(--border)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Period</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{dateRange.start} - {dateRange.end}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{recordCount.toLocaleString()} transactions analyzed</p>
              </div>
            </div>

            {/* Coverage & Methodology */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>Coverage</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{coverage.outlets.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Outlets</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{coverage.skus.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>SKUs</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{coverage.regions}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Regions</div>
                </div>
              </div>

              <div className="pt-3 border-t" style={{ borderTopColor: 'var(--border)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Methodology</span>
                </div>
                <ul className="space-y-1">
                  {methodology.map((method, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--primary)' }}>•</span>
                      <span>{method}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Confidence & Limitations */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-3">
                {getConfidenceIcon()}
                <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>Quality Assessment</h4>
              </div>
              
              <div className={`p-4 rounded-lg border ${getConfidenceColor()}`} style={{ backgroundColor: 'var(--filter-active)' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Analysis Confidence: {confidence.toUpperCase()}</span>
                </div>
                <p className="text-sm opacity-90" style={{ color: 'var(--foreground)' }}>
                  {confidence === 'high' && "Data is comprehensive and reliable for strategic decision-making."}
                  {confidence === 'medium' && "Data is adequate but consider supplementing with additional sources."}
                  {confidence === 'low' && "Use findings as directional guidance; validate before major decisions."}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Key Limitations</h5>
                <ul className="space-y-1">
                  {limitations.map((limitation, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2" style={{ color: 'var(--text-secondary)' }}>
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--apricot)' }} />
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-4 border-t" style={{ borderTopColor: 'var(--border)' }}>
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Currency: INR</span>
              <span>Outliers: &gt;3σ flagged</span>
              <span>Seasonality: Adjusted</span>
              <span>Missing Data: &lt;2%</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}