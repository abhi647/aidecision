'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Zap } from 'lucide-react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        // Force a hard refresh to re-evaluate the middleware and load the dashboard
        window.location.href = '/'
      } else {
        setError('Incorrect password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--true-turquoise)] opacity-20 blur-[120px]" />
        <div className="absolute top-[60%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--peacock)] opacity-20 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo/Brand Area */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--peacock)] to-[var(--true-turquoise)] text-white shadow-xl mb-6">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--inky-blue)] tracking-tight mb-2">
            Boardroom
          </h1>
          <p className="text-[var(--text-secondary)] font-medium tracking-wide uppercase text-sm">
            Copilot Pro
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[var(--inky-blue)] mb-2">Welcome Back</h2>
            <p className="text-[var(--text-secondary)]">Please enter the master password to access your strategic analytics.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--inky-blue)] mb-2">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--plex-blue)] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 font-medium animate-pulse">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--peacock)] to-[var(--true-turquoise)] text-white font-medium hover:shadow-lg hover:from-[var(--inky-blue)] hover:to-[var(--peacock)] transition-all duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-sm text-gray-500 font-medium tracking-wide">
          Confidential & Proprietary • Target Foods
        </p>

      </div>
    </div>
  )
}
