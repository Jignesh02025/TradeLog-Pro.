import React from 'react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  color: 'blue' | 'green' | 'red' | 'purple'
  icon: React.ReactNode
  delay?: number
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color, icon, delay = 0 }) => {
  const iconBg = {
    blue:   'rgba(59,130,246,0.15)',
    green:  'rgba(16,185,129,0.15)',
    red:    'rgba(239,68,68,0.15)',
    purple: 'rgba(139,92,246,0.15)',
  }[color]

  const iconColor = {
    blue:   '#60a5fa',
    green:  '#34d399',
    red:    '#f87171',
    purple: '#a78bfa',
  }[color]

  return (
    <div
      className={`stat-card ${color} fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10
          }}>
            {title}
          </div>
          <div style={{
            fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            animation: 'countUp 0.5s ease both',
            animationDelay: `${delay + 100}ms`,
          }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div className="stat-icon" style={{
          width: 46, height: 46, borderRadius: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: iconBg,
          color: iconColor,
          boxShadow: `0 4px 14px ${iconBg}`,
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
