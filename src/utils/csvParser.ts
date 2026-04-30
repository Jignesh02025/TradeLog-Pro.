import type { Trade, TradeType } from '../types'
import { v4 as uuid } from 'uuid'
import { calculatePips, getPipValue } from './forexCalculations'

/**
 * Parses MT4/MT5 CSV exports.
 * Format usually: Symbol,Type,Lots,Time,Open Price,S/L,T/P,Close Time,Close Price,Profit
 */
export async function parseMT4MT5CSV(file: File): Promise<Partial<Trade>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim())
        
        // Skip header if it exists
        const startIdx = lines[0].toLowerCase().includes('symbol') ? 1 : 0
        
        const trades: Partial<Trade>[] = lines.slice(startIdx).map(line => {
          const cols = line.split(',').map(c => c.trim().replace(/"/g, ''))
          
          // Basic mapping for standard MT4 exports
          // Symbol, Type, Lots, Open Price, SL, TP, Close Price, Profit, Date
          // Note: CSV formats vary, this is a heuristic approach
          const pair = cols[0] || 'Unknown'
          const type = (cols[1]?.toLowerCase().includes('buy') ? 'Buy' : 'Sell') as TradeType
          const lots = parseFloat(cols[2]) || 0.01
          const entry = parseFloat(cols[4]) || 0
          const sl = parseFloat(cols[5]) || 0
          const tp = parseFloat(cols[6]) || 0
          const exit = parseFloat(cols[8]) || 0
          const pnl = parseFloat(cols[9]) || 0
          const date = cols[3]?.split(' ')[0] || new Error('Invalid Date').message
          
          return {
            id: uuid(),
            pair,
            type,
            lotSize: lots,
            entryPrice: entry,
            exitPrice: exit,
            stopLoss: sl > 0 ? sl : undefined,
            takeProfit: tp > 0 ? tp : undefined,
            profitLoss: pnl,
            date,
            manualOverride: true, // Imported P/L is usually treated as absolute
            notes: 'Imported from CSV',
            createdAt: new Date().toISOString(),
          }
        })
        
        resolve(trades.filter(t => t.pair !== 'Unknown'))
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
