import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Boardroom Copilot | FMCG Analytics',
  description: 'Chat-first McKinsey-style analytics for FMCG executives',
  keywords: ['FMCG', 'analytics', 'business intelligence', 'McKinsey', 'executive dashboard'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}