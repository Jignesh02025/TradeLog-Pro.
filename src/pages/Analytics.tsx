import React, { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'
import { format } from 'date-fns'
import type { Trade, Stats, AccountSettings } from '../types'
import { formatCurrency, convertCurrency } from '../utils/currencyUtils'

import TradingCalendar from '../components/TradingCalendar'

interface AnalyticsProps {
  trades: Trade[]
  stats: Stats
  settings: AccountSettings
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b']

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 10, padding: '10px 16px', fontSize: 13,
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.value >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
          {p.value >= 0 ? '+' : ''}{Number(p.value).toFixed(2)} {p.name === 'equity' ? '' : 'Pips'}
        </div>
      ))}
    </div>
  )
}

const Analytics: React.FC<AnalyticsProps> = ({ trades, stats, settings }) => {
  // Cumulative P&L and Pips over time
  const performanceData = useMemo(() => {
    const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date))
    let cumulativePnl = 0
    let cumulativePips = 0
    const base = settings.defaultCurrency || 'USD'
    return sorted.map(t => {
      cumulativePnl += t.profitLoss
      cumulativePips += (t.pips || 0)
      return {
        date: format(new Date(t.date), 'dd MMM'),
        pnl: parseFloat(t.profitLoss.toFixed(2)),
        pips: parseFloat((t.pips || 0).toFixed(1)),
        equity: parseFloat(cumulativePnl.toFixed(2)),
        cumulativePips: parseFloat(cumulativePips.toFixed(1)),
      }
    })
  }, [trades, settings.defaultCurrency])

  // Daily Profit/Loss
  const dailyStats = useMemo(() => {
    const days: Record<string, number> = {}
    trades.forEach(t => {
      days[t.date] = (days[t.date] || 0) + t.profitLoss
    })
    return Object.entries(days)
      .map(([date, pnl]) => ({
        date: format(new Date(date), 'dd MMM'),
        pnl: parseFloat(pnl.toFixed(2))
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [trades])

  // Win/Loss/Breakeven pie
  const winLossData = [
    { name: 'Wins',   value: stats.wins },
    { name: 'Losses', value: stats.losses },
    { name: 'Break-even', value: trades.filter(t => t.profitLoss === 0).length },
  ].filter(d => d.value > 0)

  if (trades.length === 0) {
    return (
      <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 1200 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Forex Analytics</h1>
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <div style={{ fontSize: 56 }}>📊</div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: 15 }}>
            No data yet. Log some Forex trades to see deep analytics!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Trading Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
          Deep dive into your Forex performance metrics ({settings.defaultCurrency})
        </p>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { label: 'Total Trades', val: stats.totalTrades, color: '#60a5fa' },
          { label: 'Win Rate',     val: `${stats.winRate}%`, color: '#a78bfa' },
          { label: 'Net Profit',   val: formatCurrency(stats.totalProfitLoss, settings.defaultCurrency || 'USD'), color: stats.totalProfitLoss >= 0 ? '#34d399' : '#f87171' },
          { label: 'Avg RR',       val: `1:${stats.rrAvg.toFixed(2)}`, color: 'var(--accent-purple)' },
          { label: 'Max DD',       val: `${stats.maxDrawdown}%`, color: 'var(--accent-red)' },
        ].map(p => (
          <div key={p.label} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '10px 20px', display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.label}</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: p.color }}>{p.val}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Cumulative P&L Chart */}
        <div className="glass-card" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Equity Curve (Cumulative {settings.defaultCurrency})</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="equity" name="equity" stroke="#3b82f6" strokeWidth={2.5}
                fill="url(#pnlGrad)" dot={false} activeDot={{ r: 5, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Win vs Loss Pie */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Win vs Loss Distribution</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={winLossData}
                cx="50%" cy="50%"
                innerRadius={65} outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {winLossData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13, color: '#f1f5f9' }} />
              <Legend iconType="circle" iconSize={9}
                formatter={(v: string) => <span style={{ color: '#cbd5e1', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily P&L Bar Chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Daily Profit/Loss ({settings.defaultCurrency})</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyStats} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {dailyStats.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trading Calendar */}
      <TradingCalendar trades={trades} currency={settings.defaultCurrency || 'USD'} />
    </div>
  )
}

export default Analytics
