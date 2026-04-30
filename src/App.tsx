import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AddTrade from './pages/AddTrade'
import TradeList from './pages/TradeList'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import ConnectMT5 from './pages/ConnectMT5'
import Auth from './pages/Auth'
import ImportModal from './components/ImportModal'
import useTrades from './hooks/useTrades'
import type { Page } from './types'
import { Menu, Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AIChat from './components/AIChat'

const AppContent: React.FC = () => {
  const [page, setPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  
  const { user, loading: authLoading } = useAuth()
  const { 
    trades, settings, setSettings, addTrade, updateTrade, 
    deleteTrade, importTrades, clearAllTrades, stats, loading: tradesLoading 
  } = useTrades()

  const navigate = (p: Page) => {
    setPage(p)
    setSidebarOpen(false)
  }

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Loader2 size={32} className="spinner" style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-blue)' }} />
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard trades={trades} stats={stats} settings={settings} onNavigate={navigate} />
      case 'add-trade':
        return <AddTrade onAdd={addTrade} />
      case 'trades':
        return <TradeList trades={trades} settings={settings} onUpdate={updateTrade} onDelete={deleteTrade} />
      case 'analytics':
        return <Analytics trades={trades} stats={stats} settings={settings} />
      case 'settings':
        return <Settings settings={settings} onUpdateSettings={setSettings} onClearData={clearAllTrades} />
      case 'connect-mt5':
        return <ConnectMT5 />
      default:
        return <Dashboard trades={trades} stats={stats} settings={settings} onNavigate={navigate} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <Sidebar activePage={page} onNavigate={navigate} onOpenImport={() => setImportOpen(true)} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50 }}
          onClick={() => setSidebarOpen(false)}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ width: 240, height: '100%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
            <Sidebar activePage={page} onNavigate={navigate} onOpenImport={() => setImportOpen(true)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {/* Mobile top bar */}
        <div style={{
          display: 'none',
          alignItems: 'center', gap: 12,
          padding: '14px 20px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          position: 'sticky', top: 0, zIndex: 10,
        }} className="mobile-topbar">
          <button
            id="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>TradeLog Pro</span>
        </div>

        {tradesLoading && page !== 'add-trade' && (
          <div style={{ position: 'absolute', top: 20, right: 36, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <Loader2 size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> Syncing with Cloud...
          </div>
        )}

        {renderPage()}
        <AIChat />
      </main>

      {/* Import Modal */}
      {importOpen && (
        <ImportModal onImport={importTrades} onClose={() => setImportOpen(false)} />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
