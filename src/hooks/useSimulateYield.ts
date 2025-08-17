import { useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { BOOMERANG_ABI } from "@/abi/boomerang";

const BOOMERANG_CONTRACT =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;
const USDC_DECIMALS = 6;
const CHAIN_ID = 84532; // Base Sepolia

export const useSimulateYield = () => {
  const { address } = useAccount();

  // Simulate Yield
  const {
    writeContract: writeSimulateYield,
    data: simulateHash,
    isPending: isSimulatePending,
    error: simulateError,
  } = useWriteContract();

  // Transaction confirmation
  const { isLoading: isSimulateConfirming, isSuccess: isSimulateConfirmed } =
    useWaitForTransactionReceipt({ hash: simulateHash });

  // Handle simulate yield success
  useEffect(() => {
    if (isSimulateConfirmed) {
      toast.success("Debug yield generated successfully! 🎉");
    }
  }, [isSimulateConfirmed]);

  // Handle errors
  useEffect(() => {
    if (simulateError) {
      toast.error(
        "Failed to simulate yield. Make sure you're the contract owner."
      );
    }
  }, [simulateError]);

  const simulateYield = async (yieldAmount: string = "1") => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const amountInWei = parseUnits(yieldAmount, USDC_DECIMALS);

      toast.info("Simulating yield generation...");

      await writeSimulateYield({
        address: BOOMERANG_CONTRACT,
        abi: BOOMERANG_ABI,
        functionName: "simulateYield",
        args: [amountInWei],
        chainId: CHAIN_ID,
      });
    } catch (error) {
      console.error("Error simulating yield:", error);
      toast.error("Failed to simulate yield");
    }
  };

  return {
    simulateYield,
    isLoading: isSimulatePending || isSimulateConfirming,
    error: simulateError,
  };
};
