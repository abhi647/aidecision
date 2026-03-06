'use client'

import { useState } from 'react'
import { 
  LayoutDashboard, 
  History, 
  Bookmark, 
  Settings, 
  Sparkles,
  Menu,
  X,
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  Zap,
  MessageSquare,
  Trash2,
  Clock
} from 'lucide-react'
import { StoredSession, formatSessionDate, deleteSession } from '@/lib/session-history'

interface SidebarProps {
  onNewAnalysis: () => void
  onNavigate: (section: string) => void
  onLoadSession: (session: StoredSession) => void
  currentSection?: string
  sessions?: StoredSession[]
}

export default function Sidebar({ 
  onNewAnalysis, 
  onNavigate, 
  onLoadSession,
  currentSection = 'dashboard',
  sessions = []
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [sessionList, setSessionList] = useState<StoredSession[]>(sessions)

  const strategicItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'analysis-history', label: 'Analysis History', icon: History, badge: sessionList.length || undefined },
    { id: 'saved-insights', label: 'Strategic Roadmap', icon: Bookmark },
  ]

  const operationalItems = [
    { id: 'margins', label: 'Margin Diagnosis', icon: TrendingUp },
    { id: 'brands', label: 'Brand Portfolio', icon: PieChart },
    { id: 'channels', label: 'Channel Strategy', icon: BarChart3 },
    { id: 'outlets', label: 'Outlet Productivity', icon: Target },
  ]

  const adminItems = [
    { id: 'settings', label: 'Control Center', icon: Settings },
  ]

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteSession(sessionId)
    setSessionList(prev => prev.filter(s => s.id !== sessionId))
  }

  // Keep sessionList in sync when sessions prop changes
  if (sessions.length !== sessionList.length && sessions.length > 0) {
    setSessionList(sessions)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl backdrop-blur-md border shadow-lg"
        style={{ backgroundColor: 'rgba(255,255,255,0.8)', borderColor: 'var(--border)' }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 h-screen
        transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div 
          className="h-full flex flex-col backdrop-blur-xl border-r shadow-2xl"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.75)', 
            borderColor: 'var(--border)',
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(240,244,248,0.4))'
          }}
        >
          {/* Header */}
          <div className="h-24 px-6 border-b flex items-center shrink-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-[#003B5C] to-[#00A99D] rounded-xl shadow-lg shadow-[#00A99D]/20 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-extrabold tracking-tight leading-none" style={{ color: '#003B5C' }}>
                  Boardroom
                </h1>
                <p className="text-xs font-bold tracking-[0.1em] uppercase mt-0.5" style={{ color: '#00A99D' }}>
                  Copilot Pro
                </p>
              </div>
            </div>
          </div>
          
          {/* New Analysis Button */}
          <div className="p-6">
            <button 
              onClick={() => {
                onNewAnalysis()
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-semibold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                background: 'linear-gradient(135deg, #003B5C 0%, #002D46 100%)',
                boxShadow: '0 10px 20px -5px rgba(0, 59, 92, 0.4)'
              }}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Initiate Analysis</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-6 overflow-y-auto no-scrollbar">
            {/* Strategic Group */}
            <div>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 opacity-50" style={{ color: 'var(--text-secondary)' }}>
                Strategic Insights
              </h3>
              <div className="space-y-1">
                {strategicItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = currentSection === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id)
                        setIsOpen(false)
                      }}
                      className={`
                        flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-left transition-all duration-300 group
                        ${isActive 
                          ? 'bg-white shadow-md shadow-gray-200/50' 
                          : 'hover:bg-white/50 text-[var(--text-secondary)]'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#003B5C] text-white' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-semibold ${isActive ? 'text-[#003B5C]' : 'text-gray-600'}`}>
                          {item.label}
                        </span>
                      </div>
                      {'badge' in item && item.badge ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                          style={{ backgroundColor: '#00A99D', color: 'white' }}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Operational Group */}
            <div>
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 opacity-50" style={{ color: 'var(--text-secondary)' }}>
                Operational Control
              </h3>
              <div className="space-y-1">
                {operationalItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = currentSection === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id)
                        setIsOpen(false)
                      }}
                      className={`
                        flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-left transition-all duration-300 group
                        ${isActive 
                          ? 'bg-white shadow-md shadow-gray-200/50' 
                          : 'hover:bg-white/50 text-[var(--text-secondary)]'
                        }
                      `}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#00A99D] text-white' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-semibold ${isActive ? 'text-[#003B5C]' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Admin/Settings */}
            <div>
              <div className="space-y-1">
                {adminItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = currentSection === item.id
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id)
                        setIsOpen(false)
                      }}
                      className={`
                        flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-left transition-all duration-300 group
                        ${isActive 
                          ? 'bg-white shadow-md shadow-gray-200/50' 
                          : 'hover:bg-white/50 text-[var(--text-secondary)]'
                        }
                      `}
                    >
                      <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-gray-800 text-white' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-semibold ${isActive ? 'text-[#003B5C]' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Footer - Data Pulse Indicator */}
          <div className="p-6 mt-auto">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">
                    Data Pulse
                  </p>
                  <p className="text-xs font-bold text-[#003B5C] mt-1">
                    Live: Bizom Sales 2025
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full w-full opacity-50" />
              </div>
            </div>
            <p className="text-[10px] text-center mt-4 font-medium opacity-40 uppercase tracking-widest text-gray-500">
              Boardroom Copilot v1.5.0
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

// Separate component for the full Analysis History page view
export function AnalysisHistoryView({ 
  sessions, 
  onLoadSession,
  onNavigate,
  onDeleteSession
}: { 
  sessions: StoredSession[]
  onLoadSession: (s: StoredSession) => void
  onNavigate: (section: string) => void
  onDeleteSession: (id: string) => void
}) {
  if (sessions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--filter-active)' }}>
          <History className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>No history yet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your analysis sessions will appear here after you ask your first question.</p>
        <button className="btn-primary mx-auto" onClick={() => onNavigate('dashboard')}>
          <Zap className="w-4 h-4" /> Start analysing
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Analysis History</h2>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{sessions.length} sessions saved</span>
      </div>

      {sessions.map(session => (
        <div
          key={session.id}
          className="rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md group"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-bg, white)' }}
          onClick={() => { onLoadSession(session); onNavigate('dashboard') }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--peacock) 0%, var(--true-turquoise) 100%)' }}>
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {session.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Clock className="w-3 h-3" />
                    {formatSessionDate(session.createdAt)}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {session.messageCount} messages
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id) }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50"
              title="Delete session"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
