import React from 'react'

interface StatCardProps {
  title: string
  value: string
  subtitle?: string
  color: 'blue' | 'green' | 'red' | 'purple'
  icon: React.ReactNode
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, color, icon }) => {
  return (
    <div className={`stat-card ${color} fade-in`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: color === 'blue'   ? 'rgba(59,130,246,0.15)' :
                      color === 'green'  ? 'rgba(16,185,129,0.15)' :
                      color === 'red'    ? 'rgba(239,68,68,0.15)'  :
                                          'rgba(139,92,246,0.15)',
          color: color === 'blue'   ? '#60a5fa' :
                 color === 'green'  ? '#34d399' :
                 color === 'red'    ? '#f87171' :
                                     '#a78bfa',
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatCard
