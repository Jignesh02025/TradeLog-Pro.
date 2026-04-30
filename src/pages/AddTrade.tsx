import React, { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import TradeForm from '../components/TradeForm'
import type { TradeFormData } from '../hooks/useTrades'

interface AddTradeProps {
  onAdd: (data: TradeFormData) => Promise<any>
}

const AddTrade: React.FC<AddTradeProps> = ({ onAdd }) => {
  const [successMsg, setSuccessMsg] = useState(false)

  const handleSubmit = async (data: TradeFormData) => {
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
    <div className="fade-in" style={{ padding: '32px 36px', maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Log a Trade</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
          Fill in the details below — P&L is calculated automatically.
        </p>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div style={{
          marginBottom: 20, padding: '14px 18px',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10,
          color: '#10b981', fontWeight: 500, fontSize: 14,
          animation: 'fadeIn 0.3s ease',
        }}>
          <CheckCircle size={18} />
          Trade logged successfully!
        </div>
      )}

      <div className="glass-card" style={{ padding: 32 }}>
        <TradeForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default AddTrade
