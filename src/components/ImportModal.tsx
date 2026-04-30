import React, { useState } from 'react'
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { parseMT4MT5CSV } from '../utils/csvParser'
import type { Trade } from '../types'

interface ImportModalProps {
  onImport: (trades: Partial<Trade>[]) => void
  onClose: () => void
}

const ImportModal: React.FC<ImportModalProps> = ({ onImport, onClose }) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<Partial<Trade>[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setError(null)
      setLoading(true)
      try {
        const parsed = await parseMT4MT5CSV(selected)
        setPreview(parsed)
      } catch (err) {
        setError('Failed to parse CSV. Please ensure it is a valid MT4/MT5 export.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleConfirm = () => {
    if (preview) {
      onImport(preview)
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Upload size={20} /> Import Trades (CSV)
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {!file ? (
          <div 
            onClick={() => document.getElementById('csv-input')?.click()}
            style={{ border: '2px dashed var(--border-color)', borderRadius: 16, padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Choose MT4/MT5 CSV File</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 300, margin: '0 auto' }}>
              Drag and drop your MetaTrader export file here or click to browse.
            </p>
            <input id="csv-input" type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} style={{ color: 'var(--accent-blue)' }} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{file.name}</span>
              </div>
              <button onClick={() => { setFile(null); setPreview(null); }} style={{ fontSize: 12, color: 'var(--accent-red)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Change</button>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Loader2 size={32} className="spinner" style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-blue)' }} />
                <p style={{ marginTop: 12, fontSize: 14, color: 'var(--text-secondary)' }}>Parsing trades...</p>
              </div>
            )}

            {error && (
              <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, display: 'flex', gap: 10, color: 'var(--accent-red)', fontSize: 14 }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {preview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 10 }}>
                  <table className="trade-table" style={{ fontSize: 12 }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                      <tr>
                        <th>Date</th>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Lots</th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((t, i) => (
                        <tr key={i}>
                          <td>{t.date}</td>
                          <td style={{ fontWeight: 600 }}>{t.pair}</td>
                          <td><span className={`badge ${t.type === 'Buy' ? 'badge-buy' : 'badge-sell'}`} style={{ fontSize: 10 }}>{t.type}</span></td>
                          <td>{t.lotSize}</td>
                          <td className={(t.profitLoss || 0) >= 0 ? 'pnl-positive' : 'pnl-negative'}>${t.profitLoss?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Found <strong>{preview.length}</strong> trades to import.
                  </span>
                  <button onClick={handleConfirm} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={16} /> Confirm Import
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong>Note:</strong> CSV format detection is heuristic. We expect columns for Symbol, Type, Lots, Open Price, SL, TP, Close Price, and Profit in that order or similar.
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default ImportModal
