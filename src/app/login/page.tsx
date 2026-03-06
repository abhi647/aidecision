'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight, Zap, Target, Activity, Maximize2 } from 'lucide-react'

// Custom SVG Logo based on the user's uploaded atom/knot design
const BrandLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 20C30 20 15 35 15 50C15 65 30 80 50 80C70 80 85 65 85 50C85 35 70 20 50 20Z" stroke="currentColor" strokeWidth="8" strokeOpacity="0.2"/>
    <path d="M25 25L75 75M25 75L75 25" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 50C15 30 35 15 50 15C65 15 85 30 85 50C85 70 65 85 50 85C35 85 15 70 15 50Z" stroke="currentColor" strokeWidth="6" strokeDasharray="10 10" strokeOpacity="0.5"/>
    <circle cx="50" cy="50" r="10" fill="currentColor" />
  </svg>
)

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* Left Panel: Branding & USPs */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[var(--inky-blue)] to-[var(--peacock)] text-white relative overflow-hidden">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white opacity-5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--true-turquoise)] opacity-20 blur-[100px]" />

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-16">
             <div className="text-[var(--true-turquoise)]">
               <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                 {/* Accurately recreating the teal crossed elliptical rings logo */}
                 <path d="M46.7 153.3C18.6 125.2 18.6 79.6 46.7 51.5L153.3 158.1C125.2 186.2 79.6 186.2 46.7 153.3Z" fill="currentColor" opacity="0.9"/>
                 <path d="M153.3 46.7C181.4 74.8 181.4 120.4 153.3 148.5L46.7 41.9C74.8 13.8 120.4 13.8 153.3 46.7Z" fill="currentColor" opacity="0.9"/>
                 <path d="M100 65C119.33 65 135 80.67 135 100C135 119.33 119.33 135 100 135C80.67 135 65 119.33 65 100C65 80.67 80.67 65 100 65Z" fill="currentColor"/>
               </svg>
             </div>
             <div>
               <h1 className="text-3xl font-bold tracking-tight">Boardroom</h1>
               <p className="text-[var(--true-turquoise)] font-medium tracking-wide uppercase text-xs">Copilot Pro</p>
             </div>
          </div>

          <h2 className="text-4xl font-semibold mb-6 leading-tight">
            Decision Intelligence<br />for FMCG Leaders.
          </h2>
          <p className="text-lg text-white/80 mb-16 max-w-md">
            Unlock the power of your supply chain and sales data with an AI agent built for the enterprise boardroom.
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Activity className="w-6 h-6 text-[var(--true-turquoise)]" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Real-Time BI Integration</h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Seamlessly connects with Bizom and SAP to read live operational data, bridging the gap between reporting and action.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Target className="w-6 h-6 text-[var(--true-turquoise)]" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Automated Root Cause Analysis</h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Instantly decode margin compression and revenue dips using pre-built Price-Volume-Mix (PVM) mathematical models.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Maximize2 className="w-6 h-6 text-[var(--true-turquoise)]" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Advanced Scenario Modeling</h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  Run complex operations research algorithms to optimize trade spend and distribution planning in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/50 font-medium">
          Confidential & Proprietary • Target Foods
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo display */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center justify-center text-[var(--peacock)] mb-4">
               <svg width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M46.7 153.3C18.6 125.2 18.6 79.6 46.7 51.5L153.3 158.1C125.2 186.2 79.6 186.2 46.7 153.3Z" fill="currentColor" opacity="0.9"/>
                 <path d="M153.3 46.7C181.4 74.8 181.4 120.4 153.3 148.5L46.7 41.9C74.8 13.8 120.4 13.8 153.3 46.7Z" fill="currentColor" opacity="0.9"/>
                 <path d="M100 65C119.33 65 135 80.67 135 100C135 119.33 119.33 135 100 135C80.67 135 65 119.33 65 100C65 80.67 80.67 65 100 65Z" fill="currentColor"/>
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-[var(--inky-blue)] tracking-tight">Boardroom</h1>
            <p className="text-[var(--text-secondary)] font-medium tracking-wide uppercase text-xs">Copilot Pro</p>
          </div>

          {/* Login Card */}
          <div className="backdrop-blur-xl bg-white/80 border border-white/60 shadow-2xl rounded-3xl p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--inky-blue)] mb-2">Welcome Back</h2>
              <p className="text-[var(--text-secondary)] text-sm">Please enter the master password to securely access your strategic analytics workspace.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--inky-blue)] mb-2">
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
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--plex-blue)] focus:border-transparent transition-all shadow-inner"
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
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[var(--peacock)] to-[var(--true-turquoise)] text-white font-medium hover:shadow-lg hover:from-[var(--inky-blue)] hover:to-[var(--peacock)] transition-all duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
                {!isLoading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
          
          <p className="lg:hidden text-center mt-8 text-xs text-gray-400 font-medium tracking-wide">
            Confidential & Proprietary • Target Foods
          </p>

        </div>
      </div>
    </div>
  )
}
