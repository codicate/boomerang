import { NewResourceInput } from "../types/resource";
import { ResourceService } from "./resourceService";

// Simplified hybrid service - blockchain first, then database
export class HybridResourceService {
  // Add resource: Contract -> Database
  static async addResource(
    resource: NewResourceInput,
    userId?: string,
    onContractCall?: (
      url: string
    ) => Promise<{ success: boolean; resourceHash?: string; error?: any }>
  ) {
    try {
      // Step 1: Call smart contract if provided
      if (onContractCall) {
        const contractResult = await onContractCall(resource.url);
        if (!contractResult.success) {
          return { success: false, error: "Blockchain transaction failed" };
        }
      }

      // Step 2: Save to database
      const dbResult = await ResourceService.addResource(resource, userId);
      return dbResult;
    } catch (error) {
      console.error("Hybrid add resource error:", error);
      return { success: false, error: "Failed to add resource" };
    }
  }

  // Upvote resource: Contract -> Database
  static async upvoteResource(
    resourceId: string,
    resourceUrl: string,
    userId: string,
    onContractCall?: (url: string) => Promise<{ success: boolean; error?: any }>
  ): Promise<{
    success: boolean;
    newUpvoteCount: number;
    hasUpvoted: boolean;
    error?: string;
  }> {
    try {
      // Step 1: Call smart contract if provided
      if (onContractCall) {
        const contractResult = await onContractCall(resourceUrl);
        if (!contractResult.success) {
          return {
            success: false,
            newUpvoteCount: 0,
            hasUpvoted: false,
            error: "Blockchain transaction failed",
          };
        }
      }

      // Step 2: Update database
      const dbResult = await ResourceService.toggleUpvote(resourceId, userId);
      return { success: true, ...dbResult };
    } catch (error) {
      console.error("Hybrid upvote error:", error);
      return {
        success: false,
        newUpvoteCount: 0,
        hasUpvoted: false,
        error: "Failed to upvote resource",
      };
    }
  }
}
