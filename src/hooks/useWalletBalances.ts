import { useAccount, useBalance } from "wagmi";
import { useUSDCAddress } from "./useCommunityStaking";

export const useWalletBalances = () => {
  const { address, isConnected } = useAccount();
  const USDC_ADDRESS = useUSDCAddress();
  console.log(USDC_ADDRESS);

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
