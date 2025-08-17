import { useReadContract } from "wagmi";
import { BOOMERANG_ABI } from "@/abi/boomerang";
import { formatUnits } from "viem";

const BOOMERANG_CONTRACT =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;
const USDC_DECIMALS = 6;

export const useContractStats = () => {
  // Get total principal staked
  const {
    data: totalPrincipal,
    isLoading: isLoadingPrincipal,
    error: principalError,
    refetch: refetchPrincipal,
  } = useReadContract({
    address: BOOMERANG_CONTRACT,
    abi: BOOMERANG_ABI,
    functionName: "totalPrincipal",
  });

  // Get total yield generated
  const {
    data: totalYield,
    isLoading: isLoadingYield,
    error: yieldError,
    refetch: refetchYield,
  } = useReadContract({
    address: BOOMERANG_CONTRACT,
    abi: BOOMERANG_ABI,
    functionName: "totalYield",
  });

  // Get total votes in the system
  const {
    data: totalVotes,
    isLoading: isLoadingVotes,
    error: votesError,
    refetch: refetchVotes,
  } = useReadContract({
    address: BOOMERANG_CONTRACT,
    abi: BOOMERANG_ABI,
    functionName: "totalVotes",
  });

  const refetchAll = () => {
    refetchPrincipal();
    refetchYield();
    refetchVotes();
  };

  return {
    totalPrincipal: totalPrincipal
      ? {
          raw: totalPrincipal,
          formatted: formatUnits(totalPrincipal, USDC_DECIMALS),
        }
      : null,
    totalYield: totalYield
      ? {
          raw: totalYield,
          formatted: formatUnits(totalYield, USDC_DECIMALS),
        }
      : null,
    totalVotes: totalVotes ? Number(totalVotes) : 0,
    isLoading: isLoadingPrincipal || isLoadingYield || isLoadingVotes,
    error: principalError || yieldError || votesError,
    refetchAll,
  };
};
