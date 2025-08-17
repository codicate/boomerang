import { TokenIcon } from "@web3icons/react";

interface FormatOptions {
  showSymbol?: boolean;
  showLogo?: boolean;
  decimalPlaces?: number;
}

/**
 * Format a number as PYUSD currency
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted currency string with PYUSD symbol
 */
export function formatPYUSD(amount: number, options: FormatOptions = {}) {
  const { decimalPlaces = 2 } = options;

  // Format the number with commas and fixed decimal places
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return (
    <span className="inline-flex items-center gap-1">
      {formattedAmount}
      <TokenIcon symbol="pyusd" size={16} />
    </span>
  );
}
