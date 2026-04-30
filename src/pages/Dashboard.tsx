import React, { useMemo } from 'react'
import {
  BarChart2, TrendingUp, TrendingDown, Activity,
  Clock, ArrowUpRight, ArrowDownRight, Target, Zap, 
  ShieldAlert, Percent, Award
} from 'lucide-react'
import StatCard from '../components/StatCard'
import type { Trade, Stats, AccountSettings } from '../types'
import { format } from 'date-fns'
import { convertCurrency, formatCurrency } from '../utils/currencyUtils'

interface DashboardProps {
  trades: Trade[]
  stats: Stats
  settings: AccountSettings
  onNavigate: (page: any) => void
}

const Dashboard: React.FC<DashboardProps> = ({ trades, stats, settings, onNavigate }) => {
  const recent = trades.slice(0, 6)

  const fmtCurrency = (n: number, from: any = 'USD') => {
    const base = settings.defaultCurrency || 'USD'
    const converted = convertCurrency(n, from, base)
    return formatCurrency(converted, base)
  }

  const dailyStatsObj = useMemo(() => {
    const days: Record<string, number> = {}
    trades.forEach(t => {
      const d = format(new Date(t.date), 'yyyy-MM-dd')
      days[d] = (days[d] || 0) + t.profitLoss
    })
    return days
  }, [trades])

  const dailyPnlArr = Object.values(dailyStatsObj)
  const totalProfitDays = dailyPnlArr.filter(pnl => pnl > 0).length
  const totalLossDays = dailyPnlArr.filter(pnl => pnl < 0).length
  const worstTradingDay = dailyPnlArr.length > 0 ? Math.min(...dailyPnlArr) : 0

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1200 }}>
      {/* Header */}
      <div className="fade-in" style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
            Professional <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
            Performance analytics in {settings.defaultCurrency}
          </p>
        </div>
        <div className="fade-in stagger-3" style={{ padding: '8px 16px', background: 'rgba(59,130,246,0.1)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)', color: 'var(--accent-blue)', fontSize: 12, fontWeight: 700, transition: 'box-shadow 0.2s', cursor: 'default' }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 14px rgba(59,130,246,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          Account Currency: {settings.defaultCurrency || 'USD'}
        </div>
      </div>

      {/* Stat Cards Row 1 - High Level */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 18 }}>
        <StatCard title="Total P&L" value={fmtCurrency(stats.totalProfitLoss)} subtitle={`${stats.totalTrades} Trades`}
          color={stats.totalProfitLoss >= 0 ? 'green' : 'red'} icon={stats.totalProfitLoss >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />} delay={0} />
        <StatCard title="Win Rate" value={`${stats.winRate}%`} subtitle={`${stats.wins}W / ${stats.losses}L`}
          color="blue" icon={<Percent size={20} />} delay={60} />
        <StatCard title="Average RR" value={`1 : ${stats.rrAvg.toFixed(2)}`} subtitle="Risk/Reward average"
          color="purple" icon={<Target size={20} />} delay={120} />
        <StatCard title="Profit / Loss Days" value={`${totalProfitDays}W / ${totalLossDays}L`} subtitle="Winning vs losing days"
          color={totalProfitDays >= totalLossDays ? 'green' : 'red'} icon={<Activity size={20} />} delay={180} />
      </div>

      {/* Stat Cards Row 2 - Averages & Extrema */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: 36 }}>
        <StatCard title="Avg Win" value={fmtCurrency(stats.avgWin)} subtitle="Average profitable trade"
          color="green" icon={<Award size={20} />} delay={240} />
        <StatCard title="Avg Loss" value={fmtCurrency(stats.avgLoss)} subtitle="Average losing trade"
          color="red" icon={<TrendingDown size={20} />} delay={300} />
        <StatCard title="Worst Day" value={fmtCurrency(worstTradingDay)} subtitle="Highest single day loss"
          color="red" icon={<ArrowDownRight size={20} />} delay={360} />
        <StatCard title="Best Trade" value={fmtCurrency(stats.bestTrade)} subtitle="Highest single profit"
          color="green" icon={<ArrowUpRight size={20} />} delay={420} />
      </div>

      {/* Recent Trades */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={16} color="var(--text-muted)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Recent Performance</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-edit" onClick={() => onNavigate('add-trade')}>+ Add Trade</button>
            <button className="btn-edit" onClick={() => onNavigate('trades')}>View All</button>
          </div>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>No trades recorded yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="trade-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pair</th>
                  <th>Type</th>
                  <th>Entry</th>
                  <th>Lots</th>
                  <th>RR</th>
                  <th>P&L ({settings.defaultCurrency || 'USD'})</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {format(new Date(t.date), 'dd MMM')}
                    </td>
                    <td style={{ fontWeight: 600 }}>{t.pair}</td>
                    <td>
                      <span className={`badge ${t.type === 'Buy' ? 'badge-buy' : 'badge-sell'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>{t.entryPrice.toFixed(5)}</td>
                    <td><span className="badge badge-lots">{t.lotSize}</span></td>
                    <td style={{ fontWeight: 600, color: (t.riskReward || 0) >= 2 ? 'var(--accent-green)' : 'inherit' }}>
                        1:{t.riskReward || '—'}
                      </td>
                    <td className={t.profitLoss >= 0 ? 'pnl-positive' : 'pnl-negative'}>
                      {fmtCurrency(t.profitLoss)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
