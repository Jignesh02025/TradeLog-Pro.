import React from 'react'
import { Settings as SettingsIcon, Trash2, Globe, CreditCard, Shield } from 'lucide-react'

const Settings = ({ settings, onUpdateSettings, onClearData }) => {
  const currencies = ['USD', 'INR', 'EUR', 'GBP']

  const setCurrency = (c) => {
    onUpdateSettings({ ...settings, defaultCurrency: c })
  }

  const setRisk = (val) => {
    const num = parseFloat(val) || 0
    onUpdateSettings({ ...settings, riskPercentage: num })
  }

  return (
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 12 }}>
          <SettingsIcon size={24} /> Account Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
          Manage your account currency and application preferences.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Currency Setting */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Base Currency</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>The default currency for your trading account calculations.</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {currencies.map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                style={{
                  padding: '12px 0',
                  borderRadius: 10,
                  border: '1px solid',
                  borderColor: settings.defaultCurrency === c ? 'var(--accent-blue)' : 'var(--border-color)',
                  background: settings.defaultCurrency === c ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                  color: settings.defaultCurrency === c ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  fontWeight: settings.defaultCurrency === c ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 14
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Percentage Setting */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(167,139,250,0.1)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Risk Management</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Set your default risk percentage per trade.</p>
            </div>
          </div>
          
          <div style={{ maxWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input 
                type="number" 
                step="0.1"
                className="form-input" 
                value={settings.riskPercentage} 
                onChange={(e) => setRisk(e.target.value)} 
              />
              <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>%</span>
            </div>
          </div>
        </div>

        {/* Security & Data */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Data Management</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Backup, restore or reset your trade history.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={onClearData}
              className="btn-danger" 
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}
            >
              <Trash2 size={16} /> Clear All Trade History
            </button>
            
            <button 
              className="btn-edit" 
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}
              onClick={() => alert('Exporting data as JSON...')}
            >
              <Globe size={16} /> Export Data (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
