'use client';

import { useEffect } from 'react';
import Header from './components/Header';
import MainDashboard from './components/MainDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { useTheme } from './lib/store';

export default function Home() {
  const theme = useTheme();

  // Initialize theme on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen transition-colors duration-300">
        <Header />
        
        <main className="pt-16">
          <MainDashboard />
        </main>
      </div>
    </ErrorBoundary>
  );
}
