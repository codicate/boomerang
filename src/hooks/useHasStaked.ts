import { useReadContract, useAccount } from "wagmi";
import { BOOMERANG_ABI } from "@/abi/boomerang";

const BOOMERANG_CONTRACT =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;

export function useHasStaked() {
  const { address } = useAccount();

  const {
    data: hasStaked,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: BOOMERANG_CONTRACT,
    abi: BOOMERANG_ABI,
    functionName: "hasStaked",
    args: [address as `0x${string}`],
    enabled: !!address, // Only run when user is connected
  });

  return {
    hasStaked: Boolean(hasStaked),
    isLoading,
    error,
    refetch,
  };
}
