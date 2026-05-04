import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import TradeForm from '../components/TradeForm'

const AddTrade = ({ onAdd }) => {
  const [successMsg, setSuccessMsg] = useState(false)

  const handleSubmit = async (data) => {
    try {
      const result = await onAdd(data)
      if (result) {
        setSuccessMsg(true)
        setTimeout(() => setSuccessMsg(false), 3000)
      } else {
        alert('Failed to save trade. Please ensure you have run the SQL setup script in your Supabase dashboard and that your API keys are correct.')
      }
    } catch (err) {
      console.error('Failed to add trade:', err)
      alert('An unexpected error occurred while saving.')
    }
  }

  return (
    <div className="page-content" style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <h1 className="page-title" style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
          Log a <span className="gradient-text">Trade</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
          Fill in the details below — P&L is calculated automatically.
        </p>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="scale-in" style={{
          marginBottom: 20, padding: '14px 18px',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.35)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#10b981', fontWeight: 500, fontSize: 14,
          boxShadow: '0 0 20px rgba(16,185,129,0.1)',
        }}>
          <CheckCircle size={18} />
          Trade logged successfully!
        </div>
      )}

      <div className="glass-card fade-in stagger-1" style={{ padding: 32 }}>
        <TradeForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default AddTrade
