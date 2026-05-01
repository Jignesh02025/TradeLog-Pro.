"""
DEFINITIVE SL/TP DIAGNOSIS
This script dumps ALL raw data for every field of every order and deal
to find exactly where (or if) SL/TP values exist in the MT5 data.
"""
import MetaTrader5 as mt5
from datetime import datetime, timedelta

def diagnose():
    if not mt5.initialize():
        print("Failed to initialize MT5")
        return

    from_date = datetime.now() - timedelta(days=365)
    to_date = datetime.now()

    all_deals = mt5.history_deals_get(from_date, to_date)
    all_orders = mt5.history_orders_get(from_date, to_date)

    print("=" * 60)
    print("DEALS - All SL/TP related fields:")
    print("=" * 60)
    # Check what fields a Deal has
    if all_deals:
        d = all_deals[0]
        deal_fields = [f for f in dir(d) if not f.startswith('_')]
        sl_tp_fields = [f for f in deal_fields if 'sl' in f.lower() or 'tp' in f.lower() or 'stop' in f.lower() or 'profit' in f.lower() or 'loss' in f.lower()]
        print(f"Deal has these SL/TP related fields: {sl_tp_fields}")
        print(f"All deal fields: {deal_fields}")

    print("\n" + "=" * 60)
    print("ORDERS - Dump ALL fields for every order linked to EURUSD positions:")
    print("=" * 60)
    
    # Find EURUSD exit deals to get their position IDs
    eurusd_positions = set()
    if all_deals:
        for d in all_deals:
            if d.symbol == 'EURUSD' and d.entry in [1, 2]:
                eurusd_positions.add(d.position_id)
    
    print(f"Found {len(eurusd_positions)} EURUSD positions: {eurusd_positions}")
    
    if all_orders:
        for o in all_orders:
            if o.position_id in eurusd_positions:
                print(f"\n  Order Ticket: {o.ticket} | Position: {o.position_id}")
                for f in [f for f in dir(o) if not f.startswith('_')]:
                    val = getattr(o, f)
                    if callable(val): continue
                    print(f"    {f}: {val}")

    # Also check if there are orders NOT found via position_id
    print("\n" + "=" * 60)
    print("CHECKING if orders exist with non-matching position IDs:")
    print("=" * 60)
    if all_orders:
        for o in all_orders:
            if o.sl > 0 or o.tp > 0:
                print(f"  Found order with SL/TP! Ticket: {o.ticket} | Position: {o.position_id} | SL: {o.sl} | TP: {o.tp} | Symbol: {o.symbol}")

    mt5.shutdown()

if __name__ == "__main__":
    diagnose()
