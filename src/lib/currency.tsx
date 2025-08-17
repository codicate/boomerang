import { TokenIcon } from "@web3icons/react";
/**
 * Format a number as PYUSD currency
 * @param amount The amount to format
 * @param options Formatting options
 * @returns Formatted currency string with PYUSD symbol
 */
export function formatPYUSD(
  amount: number,
  options: {
    showSymbol?: boolean;
    showLogo?: boolean;
    decimalPlaces?: number;
  } = {}
) {
  const { showSymbol = true, decimalPlaces = 2 } = options;

  // Format the number with commas and fixed decimal places
  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return (
    <span className="inline-flex items-center">
      {formattedAmount}
      <TokenIcon symbol="pyusd" />
      {/* {showSymbol && <span className="mr-1">PYUSD</span>} */}
    </span>
  );
}
