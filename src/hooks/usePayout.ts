import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { BOOMERANG_ABI } from "@/abi/boomerang";

const BOOMERANG_CONTRACT =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;
const CHAIN_ID = 84532; // Base Sepolia

export const usePayout = (onSuccess?: () => void) => {
  // Payout
  const {
    writeContract: writePayout,
    data: payoutHash,
    isPending: isPayoutPending,
    error: payoutError,
  } = useWriteContract();

  // Transaction confirmation
  const { isLoading: isPayoutConfirming, isSuccess: isPayoutConfirmed } =
    useWaitForTransactionReceipt({ hash: payoutHash });

  // Handle payout success
  useEffect(() => {
    if (isPayoutConfirmed) {
      toast.success("Payout claimed successfully! 🎉");
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isPayoutConfirmed, onSuccess]);

  // Handle errors
  useEffect(() => {
    if (payoutError) {
      console.error("Payout error:", payoutError);
      if (payoutError.message.includes("No votes received")) {
        toast.error(
          "No votes received yet. Add resources and get votes to claim rewards."
        );
      } else if (payoutError.message.includes("No new rewards to claim")) {
        toast.error("No new rewards to claim at this time.");
      } else {
        toast.error("Failed to claim payout. Please try again.");
      }
    }
  }, [payoutError]);

  const claimPayout = async () => {
    try {
      toast.info("Claiming payout...");

      await writePayout({
        address: BOOMERANG_CONTRACT,
        abi: BOOMERANG_ABI,
        functionName: "payout",
        chainId: CHAIN_ID,
      });
    } catch (error) {
      console.error("Error claiming payout:", error);
      toast.error("Failed to claim payout");
    }
  };

  return {
    claimPayout,
    isLoading: isPayoutPending || isPayoutConfirming,
    isSuccess: isPayoutConfirmed,
    error: payoutError,
  };
};
