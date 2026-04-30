# TradeLog-Pro

A comprehensive Trading Journal application with MT5 integration and AI-powered analytics.

## Features
- **MT5 Bridge**: Automatically sync trades from MetaTrader 5 to your journal.
- **AI Chat Assistant**: Ask questions about your trading performance in natural language.
- **Dashboard**: Track your profit, win rate, and key performance metrics.
- **Supabase Integration**: Secure data storage and authentication.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.8+ (for MT5 Bridge)
- MetaTrader 5 Terminal (for MT5 Bridge)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/TradeLog-Pro.git
   cd TradeLog-Pro
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   ```

3. **Backend Server Setup:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Python Bridge Setup:**
   ```bash
   pip install MetaTrader5 requests python-dotenv
   ```

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required environment variables in `.env`:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - `DB_*` credentials for the Supabase database.
   - `MT5_USER_ID` (Found in your profile page).
   - `GROQ_API_KEY` for AI features.

### Running the Application

1. **Start the Frontend:**
   ```bash
   npm run dev
   ```

2. **Start the Backend Server:**
   ```bash
   npm run server
   ```

3. **Run the MT5 Bridge:**
   Ensure your MT5 terminal is open and logged in, then:
   ```bash
   python mt5_bridge.py
   ```

## License
MIT
"# TradeLog-Pro" 
