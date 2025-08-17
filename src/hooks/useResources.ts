import { useState, useCallback, useEffect } from "react";
import { Resource, NewResourceInput } from "../types/resource";
import { ResourceService } from "../services/resourceService";
import { HybridResourceService } from "../services/hybridResourceService";
import { useResourceContract } from "./useResourceContract";
import { useHasStaked } from "./useHasStaked";

export const useResources = (userId?: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { hasStaked } = useHasStaked();
  const {
    addResourceToContract,
    rateResourceOnContract,
    isAddingResource,
    isRatingResource,
  } = useResourceContract();

  // Load resources on mount and when userId changes
  const loadResources = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ResourceService.getResources(userId);
      setResources(data);
    } catch (error) {
      console.error("Failed to load resources:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const addResource = useCallback(
    async (
      newResource: NewResourceInput
    ): Promise<{ success: boolean; error?: string }> => {
      // Check staking requirement
      if (!hasStaked) {
        return {
          success: false,
          error: "You must stake before adding resources",
        };
      }

      setIsSubmitting(true);

      try {
        const result = await HybridResourceService.addResource(
          newResource,
          userId,
          hasStaked ? addResourceToContract : undefined
        );

        if (result.success && result.data) {
          setResources((prev) => [result.data!, ...prev]);
        }

        setIsSubmitting(false);
        return result;
      } catch (error) {
        setIsSubmitting(false);
        return {
          success: false,
          error: "Failed to add resource. Please try again.",
        };
      }
    },
    [userId, hasStaked, addResourceToContract]
  );

  const upvoteResource = useCallback(
    async (resourceId: string) => {
      if (!userId) {
        console.warn("User must be logged in to upvote");
        return;
      }

      if (!hasStaked) {
        console.warn("User must stake before upvoting");
        return;
      }

      try {
        // Find the resource to get its URL
        const resource = resources.find((r) => r.id === resourceId);
        if (!resource) return;

        // Optimistically update UI
        setResources((prev) =>
          prev.map((r) => {
            if (r.id === resourceId) {
              const hasUpvoted = r.hasUserUpvoted;
              return {
                ...r,
                upvotes: hasUpvoted ? r.upvotes - 1 : r.upvotes + 1,
                hasUserUpvoted: !hasUpvoted,
              };
            }
            return r;
          })
        );

        // Make hybrid call (blockchain + database)
        const result = await HybridResourceService.upvoteResource(
          resourceId,
          resource.url,
          userId,
          hasStaked ? rateResourceOnContract : undefined
        );

        if (result.success && "newUpvoteCount" in result) {
          // Update with actual values from server
          setResources((prev) =>
            prev.map((r) => {
              if (r.id === resourceId) {
                return {
                  ...r,
                  upvotes: result.newUpvoteCount,
                  hasUserUpvoted: result.hasUpvoted,
                };
              }
              return r;
            })
          );
        }
      } catch (error) {
        console.error("Failed to toggle upvote:", error);
        // Revert optimistic update on error
        setResources((prev) =>
          prev.map((resource) => {
            if (resource.id === resourceId) {
              const hasUpvoted = resource.hasUserUpvoted;
              return {
                ...resource,
                upvotes: hasUpvoted
                  ? resource.upvotes - 1
                  : resource.upvotes + 1,
                hasUserUpvoted: !hasUpvoted,
              };
            }
            return resource;
          })
        );
      }
    },
    [userId, hasStaked, resources, rateResourceOnContract]
  );

  const refreshResources = useCallback(() => {
    loadResources();
  }, [loadResources]);

  return {
    resources,
    addResource,
    upvoteResource,
    refreshResources,
    isLoading,
    isSubmitting: isSubmitting || isAddingResource || isRatingResource,
    hasStaked,
  };
};
