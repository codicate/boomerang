import supabase from "../lib/supabase";
import { Resource, NewResourceInput, ResourceRow } from "../types/resource";

// Utility function to create hash from URL
const createUrlHash = (url: string): string => {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
};

// Convert database row to Resource interface
const dbRowToResource = (
  row: ResourceRow,
  hasUserUpvoted = false
): Resource => ({
  id: row.id,
  title: row.title,
  url: row.url,
  urlHash: row.url_hash,
  description: row.description || undefined,
  tags: row.tags,
  upvotes: row.upvotes,
  timestamp: new Date(row.created_at).getTime(),
  created_at: row.created_at,
  updated_at: row.updated_at,
  user_id: row.user_id,
  hasUserUpvoted,
});

export class ResourceService {
  // Get all resources with upvote status for current user
  static async getResources(userId?: string): Promise<Resource[]> {
    try {
      const { data: resources, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!userId || !resources) {
        return (resources || []).map((row) => dbRowToResource(row, false));
      }

      // Get user's upvotes
      const { data: upvotes } = await supabase
        .from("resource_upvotes")
        .select("resource_id")
        .eq("user_id", userId);

      const upvotedResourceIds = new Set(
        upvotes?.map((v) => v.resource_id) || []
      );

      return resources.map((row) =>
        dbRowToResource(row, upvotedResourceIds.has(row.id))
      );
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  }

  // Add a new resource
  static async addResource(
    resource: NewResourceInput,
    userId?: string
  ): Promise<{ success: boolean; error?: string; data?: Resource }> {
    try {
      const urlHash = createUrlHash(resource.url);

      // Check if URL already exists
      const { data: existing } = await supabase
        .from("resources")
        .select("id")
        .eq("url_hash", urlHash)
        .single();

      if (existing) {
        return { success: false, error: "This URL has already been shared!" };
      }

      // Insert new resource
      const { data, error } = await supabase
        .from("resources")
        .insert({
          title: resource.title,
          url: resource.url,
          url_hash: urlHash,
          description: resource.description || null,
          tags: resource.tags,
          upvotes: 0,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: dbRowToResource(data, false),
      };
    } catch (error) {
      console.error("Error adding resource:", error);
      return {
        success: false,
        error: "Failed to add resource. Please try again.",
      };
    }
  }

  // Toggle upvote for a resource
  static async toggleUpvote(
    resourceId: string,
    userId: string
  ): Promise<{
    success: boolean;
    newUpvoteCount: number;
    hasUpvoted: boolean;
  }> {
    try {
      // Check if user has already upvoted
      const { data: existingUpvote } = await supabase
        .from("resource_upvotes")
        .select("id")
        .eq("resource_id", resourceId)
        .eq("user_id", userId)
        .single();

      let newUpvoteCount: number;
      let hasUpvoted: boolean;

      if (existingUpvote) {
        // Remove upvote and decrement count in a transaction-like operation
        await supabase
          .from("resource_upvotes")
          .delete()
          .eq("id", existingUpvote.id);

        // Manually decrement upvote count
        const { data: currentResource } = await supabase
          .from("resources")
          .select("upvotes")
          .eq("id", resourceId)
          .single();

        const currentUpvotes = currentResource?.upvotes || 0;
        const { data: updatedResource } = await supabase
          .from("resources")
          .update({ upvotes: Math.max(0, currentUpvotes - 1) })
          .eq("id", resourceId)
          .select("upvotes")
          .single();

        newUpvoteCount = updatedResource?.upvotes || 0;
        hasUpvoted = false;
      } else {
        // Add upvote and increment count
        await supabase.from("resource_upvotes").insert({
          resource_id: resourceId,
          user_id: userId,
        });

        // Manually increment upvote count
        const { data: currentResource } = await supabase
          .from("resources")
          .select("upvotes")
          .eq("id", resourceId)
          .single();

        const currentUpvotes = currentResource?.upvotes || 0;
        const { data: updatedResource } = await supabase
          .from("resources")
          .update({ upvotes: currentUpvotes + 1 })
          .eq("id", resourceId)
          .select("upvotes")
          .single();

        newUpvoteCount = updatedResource?.upvotes || 1;
        hasUpvoted = true;
      }

      return { success: true, newUpvoteCount, hasUpvoted };
    } catch (error) {
      console.error("Error toggling upvote:", error);
      throw error;
    }
  }

  // Get user's resources
  static async getUserResources(userId: string): Promise<Resource[]> {
    try {
      const { data: resources, error } = await supabase
        .from("resources")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (resources || []).map((row) => dbRowToResource(row, false));
    } catch (error) {
      console.error("Error fetching user resources:", error);
      throw error;
    }
  }
}
