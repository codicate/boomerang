import { useState, useEffect, useCallback } from "react";
import supabase from "../lib/supabase";

interface UserStats {
  resourcesOwned: number;
  totalVotes: number;
}

export const useUserStats = (userId?: string) => {
  const [stats, setStats] = useState<UserStats>({
    resourcesOwned: 0,
    totalVotes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserStats = useCallback(async () => {
    if (!userId) {
      setStats({ resourcesOwned: 0, totalVotes: 0 });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get number of resources owned by the user
      const { count: resourcesOwned, error: resourcesError } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (resourcesError) throw resourcesError;

      // Get total votes cast by the user across all resources
      const { count: totalVotes, error: votesError } = await supabase
        .from("resource_upvotes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (votesError) throw votesError;

      setStats({
        resourcesOwned: resourcesOwned || 0,
        totalVotes: totalVotes || 0,
      });
    } catch (err) {
      console.error("Error fetching user stats:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch user stats"
      );
      setStats({ resourcesOwned: 0, totalVotes: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  const refetchStats = useCallback(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    stats,
    isLoading,
    error,
    refetchStats,
  };
};
