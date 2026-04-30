export type TradeType = 'Buy' | 'Sell'
export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP'

export interface Profile {
  id: string
  name: string
  avatarUrl?: string
  accountCurrency: string
  createdAt: string
}

export interface Trade {
  id: string
  date: string            // ISO date string or timestamp
  pair: string            // e.g. "EUR/USD"
  type: TradeType
  lotSize: number
  entryPrice: number
  exitPrice: number
  stopLoss?: number
  takeProfit?: number
  pips: number
  pipValue: number
  profitLoss: number      // renamed from pnl
  manualOverride: boolean // renamed from isManualPnl
  riskReward: number      // renamed from rr
  tradeResult?: string    // new field
  screenshot?: string     // public URL
  notes: string
  createdAt: string
}

export interface AccountSettings {
  id?: string
  userId?: string
  defaultCurrency: Currency
  riskPercentage: number
  theme: string
  createdAt?: string
}

export type Page = 'dashboard' | 'add-trade' | 'trades' | 'analytics' | 'settings' | 'connect-mt5'

export interface FilterState {
  search: string
  dateFrom: string
  dateTo: string
  profitLossFilter: 'all' | 'profit' | 'loss'
  minProfitLoss?: string
  maxProfitLoss?: string
}

export interface Stats {
  totalTrades: number
  winRate: number
  totalProfitLoss: number
  totalPips: number
  avgProfitLoss: number
  avgWin: number       // average of winning trades
  avgLoss: number      // average of losing trades
  rrAvg: number        // average risk/reward ratio
  maxDrawdown: number  // max percentage drop from peak
  bestTrade: number
  worstTrade: number
  wins: number
  losses: number
}
