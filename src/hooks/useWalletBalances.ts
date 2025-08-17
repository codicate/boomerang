import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";

// Base Sepolia USDC contract address
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

export const useWalletBalances = () => {
  const { address, isConnected } = useAccount();

  // Get ETH balance
  const {
    data: ethBalance,
    isLoading: isLoadingEth,
    error: ethError,
    refetch: refetchEth,
  } = useBalance({
    address,
    enabled: !!address && isConnected,
  });

  // Get USDC balance
  const {
    data: usdcBalance,
    isLoading: isLoadingUsdc,
    error: usdcError,
    refetch: refetchUsdc,
  } = useBalance({
    address,
    token: USDC_ADDRESS,
    enabled: !!address && isConnected,
  });

  const refetchBalances = () => {
    refetchEth();
    refetchUsdc();
  };

  return {
    ethBalance: ethBalance
      ? {
          value: ethBalance.value,
          formatted: ethBalance.formatted,
          symbol: ethBalance.symbol,
          decimals: ethBalance.decimals,
        }
      : null,
    usdcBalance: usdcBalance
      ? {
          value: usdcBalance.value,
          formatted: usdcBalance.formatted,
          symbol: usdcBalance.symbol,
          decimals: usdcBalance.decimals,
        }
      : null,
    isLoading: isLoadingEth || isLoadingUsdc,
    error: ethError || usdcError,
    refetchBalances,
    isConnected,
  };
};
