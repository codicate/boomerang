import { useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { toast } from "sonner";
import { BOOMERANG_ABI } from "@/abi/boomerang";

export const useUSDCAddress = () => {
  const USDC_ADDRESSES = {
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const,
    11155111: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8" as const,
  };

  const CHAIN_ID = useChainId();
  const USDC_ADDRESS = USDC_ADDRESSES[CHAIN_ID as keyof typeof USDC_ADDRESSES];
  return USDC_ADDRESS;
};

// Contract configuration
const BOOMERANG = "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D";

const USDC_DECIMALS = 6;

// USDC ABI for approval function
const USDC_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function useCommunityStaking(stakeFee: number) {
  const USDC_ADDRESS = useUSDCAddress();
  const CHAIN_ID = useChainId();

  // USDC Approval
  const {
    writeContract: writeContractApproval,
    data: approvalHash,
    isPending: isApproving,
    error: approvalError,
  } = useWriteContract();

  // Staking
  const {
    writeContract: writeContractStake,
    data: stakeHash,
    isPending: isStaking,
    error: stakeError,
  } = useWriteContract();

  // Transaction receipts
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({ hash: approvalHash });

  const { isLoading: isStakeConfirming, isSuccess: isStakeConfirmed } =
    useWaitForTransactionReceipt({ hash: stakeHash });

  const approveUSDC = async () => {
    try {
      writeContractApproval({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [BOOMERANG, BigInt(stakeFee * 10 ** USDC_DECIMALS)],
        chainId: CHAIN_ID,
      });
    } catch (error) {
      console.error("Error approving USDC:", error);
      toast.error("Failed to approve USDC. Please try again.");
    }
  };

  const stake = async () => {
    try {
      writeContractStake({
        address: BOOMERANG,
        abi: BOOMERANG_ABI,
        functionName: "stake",
        chainId: CHAIN_ID,
      });
    } catch (error) {
      console.error("Error staking:", error);
      toast.error("Failed to stake. Please try again.");
    }
  };

  const startStaking = () => {
    approveUSDC();
  };

  const retryStaking = () => {
    stake();
  };

  // Handle transaction status changes
  useEffect(() => {
    if (isApprovalConfirming) {
      toast.loading("Waiting for USDC approval confirmation...");
    }
  }, [isApprovalConfirming]);

  useEffect(() => {
    if (isApprovalConfirmed) {
      toast.success("USDC approved! Now staking...");
      // Automatically proceed to staking after a short delay
      const timeoutId = setTimeout(stake, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isApprovalConfirmed]);

  useEffect(() => {
    if (isStakeConfirming) {
      toast.loading("Waiting for stake confirmation...");
    }
  }, [isStakeConfirming]);

  useEffect(() => {
    if (isStakeConfirmed) {
      toast.success("Successfully staked! Welcome to the community!");
    }
  }, [isStakeConfirmed]);

  // Log errors to console
  useEffect(() => {
    if (approvalError) {
      console.error("USDC approval error:", approvalError);
    }
  }, [approvalError]);

  useEffect(() => {
    if (stakeError) {
      console.error("Staking error:", stakeError);
    }
  }, [stakeError]);

  return {
    // Status
    isApproving,
    isStaking,
    isApprovalConfirming,
    isStakeConfirming,
    isApprovalConfirmed,
    isStakeConfirmed,

    // Errors
    approvalError,
    stakeError,

    // Actions
    startStaking,
    retryStaking,
  };
}
