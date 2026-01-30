/**
 * Format numbers to remove decimal places when the number is whole
 * @param {number} num - The number to format
 * @param {number} decimals - Maximum decimal places to show (default: 2)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '0';
  
  const number = Number(num);
  if (isNaN(number)) return '0';
  
  // Check if the number is whole (no decimal part)
  if (Number.isInteger(number)) {
    return number.toLocaleString();
  }
  
  // For decimal numbers, show up to specified decimal places but remove trailing zeros
  const formatted = number.toFixed(decimals);
  // Remove trailing zeros after decimal point
  return formatted.replace(/\.?0+$/, '');
};

/**
 * Format currency with proper number formatting
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency symbol (default: 'TSh')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'TSh') => {
  return `${currency} ${formatNumber(amount)}`;
};

/**
 * Format quantity with proper unit display
 * @param {number} quantity - The quantity to format
 * @param {string} unit - The unit (optional)
 * @param {number} decimals - Maximum decimal places (default: 3 for quantities)
 * @returns {string} - Formatted quantity string
 */
export const formatQuantity = (quantity, unit = '', decimals = 3) => {
  const formatted = formatNumber(quantity, decimals);
  return unit ? `${formatted} ${unit}` : formatted;
};