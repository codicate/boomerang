import { useState, useCallback } from "react";
import { Resource, NewResourceInput } from "../types/resource";

// Utility function to create hash from URL
const createUrlHash = (url: string): string => {
  // Simple hash function for demo purposes
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Example dummy data
const initialResources: Resource[] = [
  {
    id: "1",
    title: "Senior React Developer at TechCorp",
    url: "https://jobs.techcorp.com/senior-react-dev",
    urlHash: createUrlHash("https://jobs.techcorp.com/senior-react-dev"),
    description:
      "Remote position with excellent benefits. Looking for 5+ years React experience.",
    tags: ["job", "react", "remote", "senior"],
    upvotes: 23,
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    hasUserUpvoted: false,
  },
  {
    id: "2",
    title: "50% Off Udemy Courses",
    url: "https://udemy.com/discount/SAVE50",
    urlHash: createUrlHash("https://udemy.com/discount/SAVE50"),
    description: "Limited time offer on all programming courses. Ends tonight!",
    tags: ["discount", "education", "programming", "urgent"],
    upvotes: 87,
    timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
    hasUserUpvoted: true,
  },
  {
    id: "3",
    title: "Netflix Referral Code",
    url: "https://netflix.com/refer/ABC123",
    urlHash: createUrlHash("https://netflix.com/refer/ABC123"),
    description:
      "Get one month free with this referral link. Both of us get benefits!",
    tags: ["referral", "netflix", "entertainment", "free"],
    upvotes: 12,
    timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    hasUserUpvoted: false,
  },
  {
    id: "4",
    title: "YC Startup Jobs Board",
    url: "https://ycombinator.com/jobs",
    urlHash: createUrlHash("https://ycombinator.com/jobs"),
    description:
      "Curated list of startup positions from Y Combinator companies.",
    tags: ["job", "startup", "ycombinator", "equity"],
    upvotes: 156,
    timestamp: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
    hasUserUpvoted: false,
  },
  {
    id: "5",
    title: "Figma Pro Discount - 30% Off",
    url: "https://figma.com/promo/DESIGN30",
    urlHash: createUrlHash("https://figma.com/promo/DESIGN30"),
    description:
      "Professional plan discount for new subscribers only. Valid for 3 months.",
    tags: ["discount", "design", "figma", "tools"],
    upvotes: 45,
    timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    hasUserUpvoted: false,
  },
];

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addResource = useCallback(
    async (
      newResource: NewResourceInput
    ): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const urlHash = createUrlHash(newResource.url);

        // Check if URL already exists
        const existingResource = resources.find((r) => r.urlHash === urlHash);
        if (existingResource) {
          setIsSubmitting(false);
          return { success: false, error: "This URL has already been shared!" };
        }

        const resource: Resource = {
          id: Date.now().toString(),
          ...newResource,
          urlHash,
          upvotes: 0,
          timestamp: Date.now(),
          hasUserUpvoted: false,
        };

        setResources((prev) => [resource, ...prev]);
        setIsSubmitting(false);
        return { success: true };
      } catch (error) {
        setIsSubmitting(false);
        return {
          success: false,
          error: "Failed to add resource. Please try again.",
        };
      }
    },
    [resources]
  );

  const upvoteResource = useCallback((resourceId: string) => {
    setResources((prev) =>
      prev.map((resource) => {
        if (resource.id === resourceId) {
          const hasUpvoted = resource.hasUserUpvoted;
          return {
            ...resource,
            upvotes: hasUpvoted ? resource.upvotes - 1 : resource.upvotes + 1,
            hasUserUpvoted: !hasUpvoted,
          };
        }
        return resource;
      })
    );
  }, []);

  const sortedResources = resources.sort((a, b) => b.timestamp - a.timestamp);

  return {
    resources: sortedResources,
    addResource,
    upvoteResource,
    isSubmitting,
  };
};
