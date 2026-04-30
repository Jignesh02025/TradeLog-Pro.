import React from 'react'
import { 
  LayoutDashboard, PlusCircle, List, BarChart2, 
  Settings, UploadCloud, LogOut, ChevronRight, TrendingUp, BookOpen, User as UserIcon, Zap
} from 'lucide-react'
import type { Page } from '../types'
import { useAuth } from '../context/AuthContext'

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
  onOpenImport?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onOpenImport }) => {
  const { user, signOut } = useAuth()
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'add-trade', label: 'Add Trade', icon: <PlusCircle size={18} /> },
    { id: 'trades',    label: 'History',    icon: <List size={18} /> },
    { id: 'analytics', label: 'Analytics',  icon: <BarChart2 size={18} /> },
  ]

  const toolItems = [
    { id: 'import',      label: 'Import CSV',   icon: <UploadCloud size={18} />, action: onOpenImport },
    { id: 'connect-mt5', label: 'Connect MT5', icon: <Zap size={18} /> },
    { id: 'settings',    label: 'Settings',     icon: <Settings size={18} /> },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
              Trade<span className="gradient-text">Log</span> Pro
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: '1px' }}>
              Cloud Edition
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', padding: '12px 14px 8px', textTransform: 'uppercase' }}>
          Menu
        </div>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Page)}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {activePage === item.id && <ChevronRight size={14} style={{ opacity: 0.5 }} />}
          </button>
        ))}

        <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', padding: '24px 14px 8px', textTransform: 'uppercase' }}>
          Tools
        </div>
        {toolItems.map(item => (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : onNavigate(item.id as Page)}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 4px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={16} color="var(--text-muted)" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
              <div style={{ fontSize: 10, color: 'var(--accent-green)' }}>Account Active</div>
            </div>
          </div>
        )}
        
        <button 
          onClick={signOut}
          className="nav-item" 
          style={{ color: 'var(--accent-red)', opacity: 0.8, padding: '8px 14px', width: '100%' }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
