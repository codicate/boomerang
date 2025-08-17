import { cn } from "@/lib/utils";
import { formatPYUSD } from "@/lib/currency";
import { toast } from "sonner";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";

// Define the Community interface
export interface Community {
  name: string;
  description: string;
  imageUrl: string;
  stakeFee: number;
}

interface CommunityCardProps {
  community: Community;
  className?: string;
}

export function CommunityCard({ community, className }: CommunityCardProps) {
  const isLoggedIn = useIsLoggedIn();

  const joinCommunity = () => {
    if (!isLoggedIn) {
      toast("Please log in to join the community");
    }
  };

  return (
    <div
      onClick={joinCommunity}
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm",
        className
      )}
    >
      {community.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={community.imageUrl}
            alt={`${community.name} community`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className="text-lg font-semibold">{community.name}</h3>
        <p className="text-sm text-muted-foreground">{community.description}</p>
        <div className="mt-2 flex items-center text-sm">
          <span className="font-medium">Stake Fee:</span>
          <span className="ml-1">{formatPYUSD(community.stakeFee)}</span>
        </div>
      </div>
    </div>
  );
}
