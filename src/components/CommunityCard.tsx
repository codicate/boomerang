import { cn } from "@/lib/utils";
import { formatPYUSD } from "@/lib/currency";
import { toast } from "sonner";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { BOOMERANG_ABI } from "@/abi/boomerang";
import React from "react";

// Contract configuration
const BOOMERANG_CONTRACT_ADDRESS =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;

// USDC contract address on Base Sepolia
const USDC_CONTRACT_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

// USDC ABI for approval function
const USDC_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

// Define the Community interface
export interface Community {
  name: string;
  description: string;
  imageUrl: string;
  stakeFee: number;
}

interface CommunityCardProps {
  community: Community;
  className?: string;
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  const isLoggedIn = useIsLoggedIn();
  const [approvalStep, setApprovalStep] = React.useState<'idle' | 'approving' | 'approved' | 'staking'>('idle');

  const { writeContract: writeContractApproval, data: approvalHash, isPending: isApproving, error: approvalError } = useWriteContract();
  const { writeContract: writeContractStake, data: stakeHash, isPending: isStaking, error: stakeError } = useWriteContract();
  
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } =
    useWaitForTransactionReceipt({
      hash: approvalHash,
    });

  const { isLoading: isStakeConfirming, isSuccess: isStakeConfirmed } =
    useWaitForTransactionReceipt({
      hash: stakeHash,
    });

  const approveUSDC = async () => {
    if (!isLoggedIn) {
      toast("Please log in to approve USDC");
      return;
    }

    try {
      setApprovalStep('approving');
      writeContractApproval({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [BOOMERANG_CONTRACT_ADDRESS, BigInt(community.stakeFee * 10**6)], // USDC has 6 decimals
        // Gas parameters for approval
   
        chainId: 84532, // Base Sepolia
      });
    } catch (err: any) {
      console.error("Error approving USDC:", err);
      setApprovalStep('idle');
      toast("Failed to approve USDC. Please try again.");
    }
  };

  const joinCommunity = async () => {
    if (!isLoggedIn) {
      toast("Please log in to join the community");
      return;
    }

    try {
      setApprovalStep('staking');
      writeContractStake({
        address: BOOMERANG_CONTRACT_ADDRESS,
        abi: BOOMERANG_ABI,
        functionName: "stake",
        // Add explicit gas parameters for Base Sepolia to avoid estimation issues
        chainId: 84532, // Base Sepolia
      });
    } catch (err: any) {
      console.error("Error staking:", err);
      setApprovalStep('idle');
      
      // Check if it's a gas estimation error
      if (err.message?.includes("gas") || err.message?.includes("estimate")) {
        toast("Gas estimation failed. Please try again or check your network connection.");
      } else {
        toast("Failed to stake. Please try again.");
      }
    }
  };

  // Handle approval transaction status changes
  React.useEffect(() => {
    if (isApprovalConfirming) {
      toast("Waiting for USDC approval confirmation...");
    }
  }, [isApprovalConfirming]);

  React.useEffect(() => {
    if (isApprovalConfirmed) {
      toast("USDC approved! Now staking...");
      setApprovalStep('approved');
      // Automatically proceed to staking
      setTimeout(() => {
        joinCommunity();
      }, 1000);
    }
  }, [isApprovalConfirmed]);

  React.useEffect(() => {
    if (approvalError) {
      toast(`Approval error: ${approvalError.message}`);
      setApprovalStep('idle');
    }
  }, [approvalError]);

  // Handle stake transaction status changes
  React.useEffect(() => {
    if (isStakeConfirming) {
      toast("Waiting for stake confirmation...");
    }
  }, [isStakeConfirming]);

  React.useEffect(() => {
    if (isStakeConfirmed) {
      toast("Successfully staked! Welcome to the community!");
      setApprovalStep('idle');
    }
  }, [isStakeConfirmed]);

  React.useEffect(() => {
    if (stakeError) {
      toast(`Stake error: ${stakeError.message}`);
      setApprovalStep('idle');
    }
  }, [stakeError]);

  const handleCardClick = () => {
    if (approvalStep === 'idle') {
      approveUSDC();
    }
  };

  const getButtonText = () => {
    switch (approvalStep) {
      case 'idle':
        return 'Join Community';
      case 'approving':
        return 'Approving USDC...';
      case 'approved':
        return 'Staking...';
      case 'staking':
        return 'Staking...';
      default:
        return 'Join Community';
    }
  };

  const isProcessing = approvalStep !== 'idle';

  return (
    <div
      onClick={isProcessing ? undefined : handleCardClick}
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow",
        isProcessing 
          ? "opacity-50 cursor-not-allowed" 
          : "cursor-pointer hover:shadow-md",
        className
      )}
    >
      {community.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={community.imageUrl}
            alt={`${community.name} community`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-lg font-semibold">{community.name}</h3>
        <p className="text-sm text-muted-foreground">{community.description}</p>
        <div className="mt-2 flex items-center text-sm">
          <span className="font-medium">Stake Fee:</span>
          <span className="ml-1">{formatPYUSD(community.stakeFee)}</span>
        </div>
        
        {/* Status indicators */}
        <div className="mt-2 text-sm">
          {approvalStep === 'idle' && (
            <div className="text-blue-600 font-medium">{getButtonText()}</div>
          )}
          {approvalStep === 'approving' && (
            <div className="text-blue-600">Approving USDC...</div>
          )}
          {approvalStep === 'approved' && (
            <div className="text-yellow-600">USDC Approved! Staking...</div>
          )}
          {approvalStep === 'staking' && (
            <div className="text-yellow-600">Staking...</div>
          )}
        </div>

        {/* Transaction status indicators */}
        {isApproving && (
          <div className="mt-2 text-sm text-blue-600">
            USDC approval pending...
          </div>
        )}
        {isStaking && (
          <div className="mt-2 text-sm text-blue-600">
            Stake transaction pending...
          </div>
        )}
        {isApprovalConfirming && (
          <div className="mt-2 text-sm text-yellow-600">
            Waiting for approval confirmation...
          </div>
        )}
        {isStakeConfirming && (
          <div className="mt-2 text-sm text-yellow-600">
            Waiting for stake confirmation...
          </div>
        )}
        {isApprovalConfirmed && (
          <div className="mt-2 text-sm text-green-600">
            USDC approved successfully!
          </div>
        )}
        {isStakeConfirmed && (
          <div className="mt-2 text-sm text-green-600">
            Successfully staked! Welcome to the community!
          </div>
        )}
        {approvalError && (
          <div className="mt-2 text-sm text-red-600">
            Approval Error: {approvalError.message}
          </div>
        )}
        {stakeError && (
          <div className="mt-2 text-sm text-red-600">
            Stake Error: {stakeError.message}
          </div>
        )}
      </div>
    </div>
  );
}
