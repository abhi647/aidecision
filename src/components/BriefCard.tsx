'use client'

import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react'

interface BriefCardProps {
  headline: string
  keyDrivers: string[]
  recommendations: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
  confidence?: 'high' | 'medium' | 'low'
}

export default function BriefCard({ 
  headline, 
  keyDrivers, 
  recommendations, 
  sentiment = 'neutral',
  confidence = 'high'
}: BriefCardProps) {
  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-6 h-6 text-positive" />
      case 'negative':
        return <TrendingDown className="w-6 h-6 text-negative" />
      default:
        return <AlertTriangle className="w-6 h-6 text-apricot" />
    }
  }

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'border-l-positive bg-gradient-to-br from-positive/10 to-positive/5'
      case 'negative':
        return 'border-l-negative bg-gradient-to-br from-negative/10 to-negative/5'
      default:
        return 'border-l-apricot bg-gradient-to-br from-apricot/10 to-apricot/5'
    }
  }

  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high':
        return 'bg-positive/20 text-positive'
      case 'medium':
        return 'bg-apricot/20 text-apricot'
      default:
        return 'bg-negative/20 text-negative'
    }
  }

  return (
    <div className={`brief-card slide-in ${getSentimentColor()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getSentimentIcon()}
          <h2 className="font-semibold" style={{ fontSize: 'var(--text-tab)', color: 'var(--text-secondary)' }}>
            EXECUTIVE BRIEF
          </h2>
        </div>
        <div className={`px-3 py-1 rounded-full font-medium ${getConfidenceColor()}`} style={{ fontSize: 'var(--text-general)' }}>
          {confidence.toUpperCase()} CONFIDENCE
        </div>
      </div>

      {/* Headline */}
      <div className="mb-6">
        <h1 className="kpi-value leading-tight">
          {headline}
        </h1>
      </div>

      {/* Key Drivers */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 uppercase tracking-wide" style={{ fontSize: 'var(--text-general)', color: 'var(--primary)' }}>
          Key Drivers
        </h3>
        <ul className="space-y-3">
          {keyDrivers.map((driver, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 mt-1">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-tab)' }} className="leading-relaxed">
                  {driver}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="font-semibold mb-3 uppercase tracking-wide flex items-center space-x-2" style={{ fontSize: 'var(--text-general)', color: 'var(--sentiment-positive)' }}>
          <Target className="w-4 h-4" />
          <span>Recommended Actions</span>
        </h3>
        <ul className="space-y-3">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 mt-1">
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--sentiment-positive)' }} />
              </div>
              <div>
                <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-tab)' }} className="leading-relaxed">
                  {rec}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}