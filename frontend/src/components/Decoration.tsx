import React from 'react'
import { cn } from '../lib/utils'

type DecorationType = 'tape-yellow' | 'tape-blue' | 'tape-washi' | 'pin-red' | 'pin-yellow' | 'clip'

interface DecorationProps {
  type: DecorationType
  className?: string
}

export const Decoration: React.FC<DecorationProps> = ({ type, className }) => {
  if (type === 'tape-yellow') {
    return (
      <div className={cn('absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 rounded-sm opacity-80 z-10', className)}
        style={{ background: 'rgba(252, 211, 77, 0.75)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transform: 'translateX(-50%) rotate(-3deg)' }}
      />
    )
  }
  if (type === 'tape-blue') {
    return (
      <div className={cn('absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-5 rounded-sm opacity-80 z-10', className)}
        style={{ background: 'rgba(147, 197, 253, 0.75)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transform: 'translateX(-50%) rotate(2deg)' }}
      />
    )
  }
  if (type === 'tape-washi') {
    return (
      <div className={cn('absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 opacity-85 z-10', className)}
        style={{
          background: 'repeating-linear-gradient(90deg, rgba(251,191,36,0.6) 0px, rgba(251,191,36,0.6) 4px, rgba(249,115,22,0.5) 4px, rgba(249,115,22,0.5) 8px)',
          transform: 'translateX(-50%) rotate(-1deg)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />
    )
  }
  if (type === 'pin-red') {
    return (
      <div className={cn('absolute -top-2 left-1/2 -translate-x-1/2 z-10', className)}>
        <div style={{ width: 14, height: 14, borderRadius: '50% 50% 50% 0', background: '#ef4444', transform: 'rotate(-45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.25)' }} />
      </div>
    )
  }
  if (type === 'pin-yellow') {
    return (
      <div className={cn('absolute -top-2 left-1/2 -translate-x-1/2 z-10', className)}>
        <div style={{ width: 14, height: 14, borderRadius: '50% 50% 50% 0', background: '#fbbf24', transform: 'rotate(-45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.25)' }} />
      </div>
    )
  }
  if (type === 'clip') {
    return (
      <div className={cn('absolute -top-1 left-4 z-10', className)}>
        <svg width="18" height="32" viewBox="0 0 18 32" fill="none">
          <path d="M9 2 C4 2 2 6 2 10 L2 22 C2 26 5 29 9 29 C13 29 16 26 16 22 L16 12 C16 9 14 7 11 7 C8 7 6 9 6 12 L6 22 C6 23 7 24 8 24" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
    )
  }
  return null
}
