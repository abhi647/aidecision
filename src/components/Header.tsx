'use client'

import { useState } from 'react'
import { Search, Sparkles, Library, Presentation, Download, Menu } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="glass-panel border-b border-plex-blue/30 backdrop-blur-sci-fi sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-plex-blue to-true-turquoise rounded-lg flex items-center justify-center shadow-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-apricot rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Boardroom Copilot</h1>
              <p className="text-xs text-sky">FMCG Analytics Intelligence</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <button className="btn-primary flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
            
            <button className="btn-secondary flex items-center space-x-2">
              <Library className="w-4 h-4" />
              <span>Library</span>
            </button>
            
            <button className="btn-secondary flex items-center space-x-2">
              <Presentation className="w-4 h-4" />
              <span>Present</span>
            </button>
            
            <button className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-plex-blue/30">
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-primary flex items-center justify-center space-x-2 w-full">
                <Search className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
              
              <button className="btn-secondary flex items-center justify-center space-x-2 w-full">
                <Library className="w-4 h-4" />
                <span>Library</span>
              </button>
              
              <button className="btn-secondary flex items-center justify-center space-x-2 w-full">
                <Presentation className="w-4 h-4" />
                <span>Present</span>
              </button>
              
              <button className="btn-secondary flex items-center justify-center space-x-2 w-full">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}