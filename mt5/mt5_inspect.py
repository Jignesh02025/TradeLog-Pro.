
import MetaTrader5 as mt5
from datetime import datetime, timedelta

def check_attributes():
    if not mt5.initialize():
        return

    from_date = datetime.now() - timedelta(days=30)
    deals = mt5.history_deals_get(from_date, datetime.now())
    if deals:
        d = deals[0]
        print("Deal attributes:", dir(d))
        for attr in dir(d):
            if not attr.startswith("_"):
                print(f"  {attr}: {getattr(d, attr)}")
    
    orders = mt5.history_orders_get(from_date, datetime.now())
    if orders:
        o = orders[0]
        print("\nOrder attributes:", dir(o))
        for attr in dir(o):
            if not attr.startswith("_"):
                print(f"  {attr}: {getattr(o, attr)}")

    mt5.shutdown()

if __name__ == "__main__":
    check_attributes()
