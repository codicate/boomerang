export interface Resource {
  id: string;
  title: string;
  url: string;
  urlHash: string; // Auto-generated hash for uniqueness
  description: string;
  tags: string[];
  upvotes: number;
  timestamp: number;
  created_at?: string; // Supabase timestamp
  updated_at?: string; // Supabase timestamp
  user_id?: string; // Creator's user ID
  hasUserUpvoted?: boolean; // Client-side state for current user
}

export interface NewResourceInput {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

// Database schema type for Supabase
export interface ResourceRow {
  id: string;
  title: string;
  url: string;
  url_hash: string;
  description: string;
  tags: string[];
  upvotes: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// Upvote tracking table
export interface ResourceUpvote {
  id: string;
  resource_id: string;
  user_id: string;
  created_at: string;
}
