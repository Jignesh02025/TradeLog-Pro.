// Static conversion rates relative to 1 USD (as of mid-2024 approximation)
const RATES = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
}

/**
 * Converts an amount from one currency to another.
 */
export function convertCurrency(amount, from, to) {
  if (from === to) return amount
  
  // Convert from source to USD first
  const usdAmount = amount / RATES[from]
  
  // Convert from USD to target
  return usdAmount * RATES[to]
}

/**
 * Formats a number as a currency string.
 */
export function formatCurrency(amount, currency) {
  const sign = amount >= 0 ? '+' : ''
  return sign + amount.toLocaleString(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
