import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "sonner";
import { BOOMERANG_ABI } from "@/abi/boomerang";

const BOOMERANG_CONTRACT =
  "0xA7d455cf3CeCF4211589f1Da1Fd486812e9f426D" as const;
const CHAIN_ID = 84532; // Base Sepolia

// Convert URL to bytes32 hash for contract
export const urlToBytes32 = (url: string): `0x${string}` => {
  // Simple deterministic hash - can be improved later
  const encoder = new TextEncoder();
  const data = encoder.encode(url);

  // Create a simple hash by taking first 32 bytes and padding
  const hash = new Uint8Array(32);
  for (let i = 0; i < Math.min(data.length, 32); i++) {
    hash[i] = data[i];
  }

  return `0x${Array.from(hash)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
};

export const useResourceContract = () => {
  // Add Resource
  const {
    writeContract: writeAddResource,
    data: addResourceHash,
    isPending: isAddingResource,
    error: addResourceError,
  } = useWriteContract();

  // Rate Resource (Upvote)
  const {
    writeContract: writeRateResource,
    data: rateResourceHash,
    isPending: isRatingResource,
    error: rateResourceError,
  } = useWriteContract();

  // Transaction receipts
  const { isSuccess: isAddResourceConfirmed } = useWaitForTransactionReceipt({
    hash: addResourceHash,
  });

  const { isSuccess: isRateResourceConfirmed } = useWaitForTransactionReceipt({
    hash: rateResourceHash,
  });

  const addResourceToContract = async (url: string) => {
    try {
      const resourceHash = urlToBytes32(url);

      writeAddResource({
        address: BOOMERANG_CONTRACT,
        abi: BOOMERANG_ABI,
        functionName: "addResource",
        args: [resourceHash],
        chainId: CHAIN_ID,
      });

      return { resourceHash, success: true };
    } catch (error) {
      console.error("Error adding resource to contract:", error);
      toast.error("Failed to add resource to blockchain");
      return { success: false, error };
    }
  };

  const rateResourceOnContract = async (url: string) => {
    try {
      const resourceHash = urlToBytes32(url);

      writeRateResource({
        address: BOOMERANG_CONTRACT,
        abi: BOOMERANG_ABI,
        functionName: "rateResource",
        args: [resourceHash],
        chainId: CHAIN_ID,
      });

      return { resourceHash, success: true };
    } catch (error) {
      console.error("Error rating resource on contract:", error);
      toast.error("Failed to rate resource on blockchain");
      return { success: false, error };
    }
  };

  return {
    // Actions
    addResourceToContract,
    rateResourceOnContract,

    // States
    isAddingResource,
    isRatingResource,
    isAddResourceConfirmed,
    isRateResourceConfirmed,

    // Transaction hashes
    addResourceHash,
    rateResourceHash,

    // Errors
    addResourceError,
    rateResourceError,
  };
};
