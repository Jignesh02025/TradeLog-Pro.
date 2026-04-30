import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isToday 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Trade, Currency } from '../types';
import { formatCurrency } from '../utils/currencyUtils';

interface TradingCalendarProps {
  trades: Trade[];
  currency: Currency;
}

const TradingCalendar: React.FC<TradingCalendarProps> = ({ trades, currency }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Group trades by date
  const tradesByDate = useMemo(() => {
    const map: Record<string, { pnl: number; count: number }> = {};
    trades.forEach(t => {
      // Assuming t.date is an ISO string or similar
      const d = new Date(t.date);
      const dateStr = format(d, 'yyyy-MM-dd');
      if (!map[dateStr]) {
        map[dateStr] = { pnl: 0, count: 0 };
      }
      map[dateStr].pnl += t.profitLoss;
      map[dateStr].count += 1;
    });
    return map;
  }, [trades]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthPnl = useMemo(() => {
    let total = 0;
    Object.entries(tradesByDate).forEach(([dateStr, data]) => {
      if (isSameMonth(new Date(dateStr), currentDate)) {
        total += data.pnl;
      }
    });
    return total;
  }, [tradesByDate, currentDate]);

  // Weekly stats
  const weeklyStats = useMemo(() => {
    const weeks: { pnl: number; count: number }[] = [];
    let currentWeekPnl = 0;
    let currentWeekCount = 0;

    calendarDays.forEach((day, index) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayData = tradesByDate[dateStr] || { pnl: 0, count: 0 };
      
      currentWeekPnl += dayData.pnl;
      currentWeekCount += dayData.count;

      if ((index + 1) % 7 === 0) {
        weeks.push({ pnl: currentWeekPnl, count: currentWeekCount });
        currentWeekPnl = 0;
        currentWeekCount = 0;
      }
    });

    return weeks;
  }, [calendarDays, tradesByDate]);

  return (
    <div className="glass-card" style={{ padding: 24, marginTop: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Monthly PnL</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: monthPnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {formatCurrency(monthPnl, currency)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={prevMonth} className="nav-btn" title="Previous Month"><ChevronLeft size={20} /></button>
          <div style={{ fontSize: 18, fontWeight: 800, minWidth: 160, textAlign: 'center', letterSpacing: '-0.01em' }}>
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <button onClick={nextMonth} className="nav-btn" title="Next Month"><ChevronRight size={20} /></button>
        </div>

        <button onClick={goToToday} className="today-btn">Today</button>
      </div>

      {/* Calendar Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr) 160px', 
        background: 'rgba(255,255,255,0.05)',
        gap: '1px',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        {/* Day Headers */}
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', "WEEK'S TOTAL"].map(day => (
          <div key={day} style={{ 
            padding: '12px 0', 
            fontSize: 11, 
            fontWeight: 800, 
            color: 'var(--text-muted)',
            textAlign: 'center',
            letterSpacing: '0.1em',
            background: 'var(--bg-card)'
          }}>
            {day}
          </div>
        ))}

        {/* Days */}
        {calendarDays.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayData = tradesByDate[dateStr];
          const isCurrMonth = isSameMonth(day, monthStart);
          const isDayToday = isToday(day);

          return (
            <React.Fragment key={dateStr}>
              <div style={{
                aspectRatio: '1/0.85',
                padding: '12px 14px',
                background: !isCurrMonth ? 'rgba(15, 23, 42, 0.4)' : 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isCurrMonth ? 1 : 0.4,
                position: 'relative',
                transition: 'background 0.2s',
                ...(dayData ? {
                  backgroundColor: dayData.pnl >= 0 ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)'
                } : {})
              }} className="calendar-day">
                <div style={{ 
                  fontSize: 13, 
                  fontWeight: 700,
                  color: isDayToday ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <span style={isDayToday ? { 
                    background: 'var(--accent-blue)', 
                    width: 26, height: 26, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '50%',
                    fontSize: 12,
                    boxShadow: '0 0 12px rgba(59,130,246,0.4)'
                  } : {}}>{format(day, 'd')}</span>
                </div>

                {dayData && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: 13, 
                      fontWeight: 800, 
                      color: dayData.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' 
                    }}>
                      {formatCurrency(dayData.pnl, currency)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
                      {dayData.count} trade{dayData.count !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Weekly Total at the end of each row (after Saturday) */}
              {(i + 1) % 7 === 0 && (
                <div style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeft: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>WEEK {Math.ceil((i+1)/7)}</div>
                  <div style={{ 
                    fontSize: 14, 
                    fontWeight: 800, 
                    color: weeklyStats[Math.floor(i/7)]?.pnl >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'
                  }}>
                    {formatCurrency(weeklyStats[Math.floor(i/7)]?.pnl || 0, currency)}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>
                    {weeklyStats[Math.floor(i/7)]?.count || 0} trade{weeklyStats[Math.floor(i/7)]?.count !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .nav-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          color: white;
          transform: translateY(-1px);
        }
        .today-btn {
          background: transparent;
          border: 1px solid var(--accent-orange);
          color: var(--accent-orange);
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .today-btn:hover {
          background: rgba(249,115,22,0.1);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249,115,22,0.15);
        }
        .calendar-day:hover {
          background: rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default TradingCalendar;
