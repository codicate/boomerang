export interface Resource {
  id: string;
  title: string;
  url: string;
  urlHash: string; // Auto-generated hash for uniqueness
  description: string;
  tags: string[];
  upvotes: number;
  timestamp: number;
  hasUserUpvoted?: boolean;
}

export interface NewResourceInput {
  title: string;
  url: string;
  description: string;
  tags: string[];
}
