/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse Rupiah string back to number
 * @param {string} rupiahString - The Rupiah string to parse
 * @returns {number} Parsed number
 */
export function parseRupiah(rupiahString) {
  if (typeof rupiahString === 'number') {
    return rupiahString;
  }
  
  // Remove currency symbol and dots, then parse as integer
  const cleanString = rupiahString.replace(/[Rp\s.]/g, '').replace(',', '.');
  return parseFloat(cleanString) || 0;
}
