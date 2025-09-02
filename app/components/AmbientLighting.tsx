'use client'

import React, { useEffect, useRef, useState } from 'react'

interface AmbientLightingProps {
  intensity?: number
  color?: string
  className?: string
}

const AmbientLighting: React.FC<AmbientLightingProps> = ({
  intensity = 0.1,
  color = 'rgba(59, 130, 246, 0.1)',
  className = ''
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (containerRef.current && event.touches[0]) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((event.touches[0].clientX - rect.left) / rect.width) * 100
        const y = ((event.touches[0].clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`ambient-light ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: `radial-gradient(
          circle at ${mousePosition.x}% ${mousePosition.y}%,
          ${color} 0%,
          rgba(147, 51, 234, 0.05) 30%,
          transparent 70%
        )`,
        transition: 'all 0.3s ease'
      }}
    />
  )
}

export default AmbientLighting


