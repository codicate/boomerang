import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { BOOMERANG_ABI } from "@/abi/boomerang";

// Contract configuration
const BOOMERANG_CONTRACT_ADDRESS =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;
const USDC_CONTRACT_ADDRESS =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

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
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [BOOMERANG_CONTRACT_ADDRESS, BigInt(stakeFee * 10 ** 6)], // USDC has 6 decimals
        chainId: 84532, // Base Sepolia
      });
    } catch (err: any) {
      console.error("Error approving USDC:", err);
      toast("Failed to approve USDC. Please try again.");
    }
  };

  const stake = async () => {
    try {
      writeContractStake({
        address: BOOMERANG_CONTRACT_ADDRESS,
        abi: BOOMERANG_ABI,
        functionName: "stake",
        chainId: 84532, // Base Sepolia
      });
    } catch (err: any) {
      console.error("Error staking:", err);
      toast("Failed to stake. Please try again.");
    }
  };

  const startStaking = () => {
    approveUSDC();
  };

  const retryStaking = () => {
    stake();
  };

  // Handle approval transaction status changes
  useEffect(() => {
    if (isApprovalConfirming) {
      toast("Waiting for USDC approval confirmation...");
    }
  }, [isApprovalConfirming]);

  useEffect(() => {
    if (isApprovalConfirmed) {
      toast("USDC approved! Now staking...");
      // Automatically proceed to staking
      setTimeout(() => {
        stake();
      }, 1000);
    }
  }, [isApprovalConfirmed]);

  // Handle stake transaction status changes
  useEffect(() => {
    if (isStakeConfirming) {
      toast("Waiting for stake confirmation...");
    }
  }, [isStakeConfirming]);

  useEffect(() => {
    if (isStakeConfirmed) {
      toast("Successfully staked! Welcome to the community!");
    }
  }, [isStakeConfirmed]);

  // Log errors to console instead of showing to user
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
