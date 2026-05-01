const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: { rejectUnauthorized: false }
});

async function checkData() {
  try {
    const res = await pool.query("SELECT pair, profit_loss, date FROM trades ORDER BY date DESC");
    console.log('--- ALL TRADES ---');
    res.rows.forEach(r => {
      console.log(`${r.date.toISOString()} | ${r.pair} | ${r.profit_loss} (Type: ${typeof r.profit_loss})`);
    });
    console.log('------------------');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkData();
