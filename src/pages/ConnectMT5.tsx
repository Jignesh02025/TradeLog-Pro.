import React from 'react'
import { Terminal, Download, ShieldCheck, Zap, Info, Copy, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ConnectMT5: React.FC = () => {
  const { user } = useAuth()
  const [copied, setCopied] = React.useState(false)

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Zap size={28} className="gradient-text" /> 
          Connect MetaTrader 5
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: 15, maxWidth: 600 }}>
          Sync your MetaTrader 5 trades automatically to your journal using our secure Python bridge. 
          No complex MQL5 setup required.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Step 1: Preparation */}
          <section className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>1</div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Preparation</h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Ensure you have Python installed on your Windows machine. You'll need the following libraries:
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)', position: 'relative' }}>
              <code style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>
                pip install MetaTrader5 requests
              </code>
            </div>
          </section>

          {/* Step 2: Bridge Script */}
          <section className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>2</div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Setup the Bridge</h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              A script named <code style={{ color: 'var(--accent-blue)' }}>mt5_bridge.py</code> has been created in your project root. 
              Open it and paste your <strong>User ID</strong> below:
            </p>
            
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.05)', 
              border: '1px dashed rgba(59, 130, 246, 0.3)', 
              padding: '16px', 
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(59, 130, 246, 0.7)', textTransform: 'uppercase', marginBottom: 4 }}>Your Unique User ID</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  {user?.id || 'Not Signed In'}
                </div>
              </div>
              <button 
                onClick={copyUserId}
                className="btn-secondary" 
                style={{ padding: '8px 12px', fontSize: 12, minWidth: 90 }}
              >
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy ID</>}
              </button>
            </div>
          </section>

          {/* Step 3: Run */}
          <section className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>3</div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Run & Sync</h2>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Keep MetaTrader 5 open and run the script. Your trades will appear in the History section instantly.
            </p>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-color)' }}>
              <code style={{ fontSize: 13, color: '#10b981', fontFamily: 'monospace' }}>
                python mt5_bridge.py
              </code>
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Status Card */}
          <div className="glass-card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(5,150,105,0.05) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#10b981', marginBottom: 16 }}>
              <ShieldCheck size={20} />
              <span style={{ fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Connection Ready</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Our server is configured to accept MT5 tickets. Duplicate trades are automatically filtered to keep your data clean.
            </div>
          </div>

          {/* Tips Card */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={16} color="var(--accent-blue)" /> Tips
            </h3>
            <ul style={{ padding: 0, margin: 0, list_style: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                <div style={{ minWidth: 4, height: 4, borderRadius: '50%', background: 'var(--accent-blue)', marginTop: 6 }} />
                The script syncs the last 7 days of history by default. You can change this in the script.
              </li>
              <li style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                <div style={{ minWidth: 4, height: 4, borderRadius: '50%', background: 'var(--accent-blue)', marginTop: 6 }} />
                Commissions and swaps are included in the Profit/Loss calculation.
              </li>
              <li style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                <div style={{ minWidth: 4, height: 4, borderRadius: '50%', background: 'var(--accent-blue)', marginTop: 6 }} />
                You can set up a Task Scheduler to run the script every hour for fully automated journaling.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectMT5
