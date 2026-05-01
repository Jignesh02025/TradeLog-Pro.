import MetaTrader5 as mt5
import requests
import re
from datetime import datetime, timedelta
import sys

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- CONFIGURATION ---
# Your Backend API URL (default local port 5000)
API_URL = os.getenv("MT5_API_URL", "http://localhost:5000/api/trades/bulk")

# Your User ID (Get this from your Profile page in the Trading Journal)
USER_ID = os.getenv("MT5_USER_ID")

if not USER_ID:
    print("ERROR: MT5_USER_ID not found in environment. Please set it in .env file.")
    sys.exit(1)

# How many days of history to sync
SYNC_DAYS = int(os.getenv("SYNC_DAYS", "365"))

# --- SYNC LOGIC ---

def parse_sl_tp_from_comment(comment: str):
    """
    Your broker stores SL/TP in the closing order's comment field.
    Examples: "[tp 1.15972]", "[sl 1.17058]"
    This function extracts those values.
    """
    sl = 0.0
    tp = 0.0
    if not comment:
        return sl, tp
    
    # Match [sl <price>] or [tp <price>]
    sl_match = re.search(r'\[sl\s+([\d.]+)\]', comment, re.IGNORECASE)
    tp_match = re.search(r'\[tp\s+([\d.]+)\]', comment, re.IGNORECASE)
    
    if sl_match:
        sl = float(sl_match.group(1))
    if tp_match:
        tp = float(tp_match.group(1))
    
    return sl, tp

def sync_trades():
    if not mt5.initialize():
        print("MetaTrader5 initialize() failed. Make sure MT5 terminal is open.")
        return

    print("Connected to MT5 successfully!")
    
    from_date = datetime.now() - timedelta(days=SYNC_DAYS)
    to_date = datetime.now()

    print(f"Fetching deals for the last {SYNC_DAYS} days...")
    all_deals = mt5.history_deals_get(from_date, to_date)
    
    if all_deals is None:
        print("No deals found in history.")
        mt5.shutdown()
        return

    print(f"Processing {len(all_deals)} deals...")

    trades_to_sync = []
    
    for deal in all_deals:
        # We look for 'OUT' deals (Exits)
        if deal.entry in [1, 2]:
            if deal.profit == 0 and deal.commission == 0 and deal.swap == 0:
                continue 
                
            # --- 1. GET ENTRY PRICE ---
            entry_price = deal.price
            for p_deal in all_deals:
                if p_deal.position_id == deal.position_id and p_deal.entry == 0:
                    entry_price = p_deal.price
                    break

            # --- 2. GET SL/TP ---
            stop_loss = 0.0
            take_profit = 0.0
            close_reason = 0  # 4 = SL hit, 5 = TP hit

            pos_orders = mt5.history_orders_get(position=deal.position_id)
            if pos_orders:
                for o in pos_orders:
                    # Parse SL/TP from broker comment field e.g. "[sl 1.17058]" or "[tp 1.15972]"
                    parsed_sl, parsed_tp = parse_sl_tp_from_comment(o.comment)
                    if parsed_sl > 0: stop_loss = parsed_sl
                    if parsed_tp > 0: take_profit = parsed_tp
                    
                    # Also check the numeric sl/tp fields as fallback
                    if stop_loss == 0 and o.sl > 0: stop_loss = o.sl
                    if take_profit == 0 and o.tp > 0: take_profit = o.tp

                    # Track the close reason from the exit order
                    # reason 4 = SL hit, reason 5 = TP hit
                    if o.position_id == deal.position_id and o.reason in [4, 5]:
                        close_reason = o.reason

            # Method B: Use exit price as the hit level when reason is known
            # If closed by SL (reason=4) and TP is still missing → set TP as 0 (not available)
            # If closed by TP (reason=5) and SL is still missing → set SL as 0 (not available)
            # This correctly labels the field that WAS hit using the actual execution price
            if close_reason == 4 and stop_loss == 0:
                # Closed by SL - use deal exit price as the SL price
                stop_loss = deal.price
            elif close_reason == 5 and take_profit == 0:
                # Closed by TP - use deal exit price as the TP price
                take_profit = deal.price

            # Method C: Check orders with Position: 0 (some brokers don't link position_id on entry)
            if stop_loss == 0 or take_profit == 0:
                entry_order_ticket = getattr(deal, 'order', 0)
                for p_deal in all_deals:
                    if p_deal.position_id == deal.position_id and p_deal.entry == 0:
                        entry_order_ticket = getattr(p_deal, 'order', 0)
                        break
                if entry_order_ticket > 0:
                    entry_order_rec = mt5.history_orders_get(ticket=entry_order_ticket)
                    if entry_order_rec:
                        o = entry_order_rec[0]
                        if stop_loss == 0 and o.sl > 0: stop_loss = o.sl
                        if take_profit == 0 and o.tp > 0: take_profit = o.tp

            # --- 3. CALCULATE PIPS ---
            symbol_info = mt5.symbol_info(deal.symbol)
            pips = 0
            if symbol_info:
                multiplier = 100 if ("JPY" in deal.symbol or symbol_info.digits < 4) else 10000
                diff = deal.price - entry_price
                if deal.type == 1: # Original was Buy
                    pips = diff * multiplier
                else: # Original was Sell
                    pips = -diff * multiplier

            # --- 4. CALCULATE RISK/REWARD RATIO ---
            risk_reward = 0.0
            if stop_loss > 0 and take_profit > 0 and entry_price > 0:
                if deal.type == 1:  # Original was Buy
                    risk = entry_price - stop_loss
                    reward = take_profit - entry_price
                else:  # Original was Sell
                    risk = stop_loss - entry_price
                    reward = entry_price - take_profit
                if risk > 0 and reward > 0:
                    risk_reward = round(reward / risk, 2)

            original_type = "Buy" if deal.type == 1 else "Sell" if deal.type == 0 else "Other"
            total_profit = deal.profit + deal.commission + deal.swap

            trade_data = {
                "external_id": str(deal.ticket),
                "date": datetime.fromtimestamp(deal.time).isoformat(),
                "pair": deal.symbol,
                "type": original_type,
                "lot_size": deal.volume,
                "profit_loss": total_profit,
                "entry_price": entry_price, 
                "exit_price": deal.price,
                "stop_loss": stop_loss,
                "take_profit": take_profit,
                "pips": round(pips, 1),
                "pip_value": round(total_profit / pips, 2) if pips != 0 else 0,
                "risk_reward": risk_reward,
                "notes": f"MT5 Ticket: {deal.ticket} | Position: {deal.position_id}"
            }
            
            trades_to_sync.append(trade_data)
            rr_str = f"1:{risk_reward}" if risk_reward > 0 else "N/A"
            print(f"  [MT5 DATA] {deal.symbol} {original_type} | P/L: {total_profit:.2f} | Pips: {pips:.1f} | SL: {stop_loss} | TP: {take_profit} | RR: {rr_str}")

    if not trades_to_sync:
        print("No completed trades found to sync.")
        mt5.shutdown()
        return

    print(f"\nSyncing {len(trades_to_sync)} trades to backend...")

    try:
        response = requests.post(API_URL, json={"userId": USER_ID, "trades": trades_to_sync})
        if response.status_code == 200:
            print(f"Successfully synced {response.json().get('count')} trades!")
        else:
            print(f"Failed to sync. Status: {response.status_code}")
    except Exception as e:
        print(f"Error connecting to backend: {e}")

    mt5.shutdown()

if __name__ == "__main__":
    sync_trades()
