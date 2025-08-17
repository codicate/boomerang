import { Resource } from "../types/resource";
import { ResourceCard } from "./ResourceCard";

interface ResourceListProps {
  resources: Resource[];
  onUpvote: (resourceId: string) => void;
  onTip?: (resourceId: string) => void;
  currentUserId?: string;
}

export const ResourceList = ({
  resources,
  onUpvote,
  onTip,
  currentUserId,
}: ResourceListProps) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No resources yet</div>
        <div className="text-gray-400 text-sm">
          Be the first to share a resource!
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          Latest Resources ({resources.length})
        </h2>
        <div className="text-sm text-gray-400">Sorted by newest first</div>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            onUpvote={onUpvote}
            onTip={onTip}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};
