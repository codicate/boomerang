import { useState, useCallback, useEffect } from "react";
import { Resource, NewResourceInput } from "../types/resource";
import { ResourceService } from "../services/resourceService";

export const useResources = (userId?: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);

      try {
        const result = await ResourceService.addResource(newResource, userId);

        if (result.success && result.data) {
          // Add the new resource to the beginning of the list
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
    [userId]
  );

  const upvoteResource = useCallback(
    async (resourceId: string) => {
      if (!userId) {
        console.warn("User must be logged in to upvote");
        return;
      }

      try {
        // Optimistically update UI
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

        // Make API call
        const result = await ResourceService.toggleUpvote(resourceId, userId);

        // Update with actual values from server
        setResources((prev) =>
          prev.map((resource) => {
            if (resource.id === resourceId) {
              return {
                ...resource,
                upvotes: result.newUpvoteCount,
                hasUserUpvoted: result.hasUpvoted,
              };
            }
            return resource;
          })
        );
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
    [userId]
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
    isSubmitting,
  };
};
