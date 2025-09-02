import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Innovari - Engineering & Project Management',
  description: 'Advanced engineering, procurement, and construction project management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
