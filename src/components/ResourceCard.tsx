import { Resource } from "../types/resource";
import { Button } from "./ui/button";

interface ResourceCardProps {
  resource: Resource;
  onUpvote: (resourceId: string) => void;
  onTip?: (resourceId: string) => void;
  currentUserId?: string;
}

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
};

const getDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
};

const truncateAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ResourceCard = ({
  resource,
  onUpvote,
  onTip,
  currentUserId,
}: ResourceCardProps) => {
  const isOwner = currentUserId && resource.user_id === currentUserId;

  const handleLinkClick = (e: React.MouseEvent) => {
    // Prevent upvote when clicking the link
    e.stopPropagation();
  };

  const handleUpvote = () => {
    if (isOwner) return; // Prevent self-upvoting
    onUpvote(resource.id);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
            {resource.title}
          </h3>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors inline-flex items-center gap-1"
          >
            {getDomainFromUrl(resource.url)}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
        <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
          {formatTimeAgo(resource.timestamp)}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-3 line-clamp-3">
        {resource.description}
      </p>

      {/* Owner */}
      {resource.user_id && (
        <div className="mb-4">
          <span className="text-xs text-gray-500">
            Owner:{" "}
            <span className="font-mono text-gray-400">
              {truncateAddress(resource.user_id)}
            </span>
          </span>
        </div>
      )}

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-full border border-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Upvote Button */}
          <Button
            onClick={handleUpvote}
            disabled={!!isOwner}
            title={isOwner ? "Cannot rate your own resource" : undefined}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isOwner
                ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                : resource.hasUserUpvoted
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
            }`}
          >
            <svg
              className={`w-4 h-4 ${
                resource.hasUserUpvoted
                  ? "fill-current"
                  : "stroke-current fill-none"
              }`}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            {resource.upvotes}
          </Button>

          {/* Tip Button (Placeholder) */}
          {onTip && (
            <Button
              onClick={() => onTip(resource.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Tip
            </Button>
          )}
        </div>

        {/* Share/Copy Link Button */}
        <Button
          onClick={() => navigator.clipboard.writeText(resource.url)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};
