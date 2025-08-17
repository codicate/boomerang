import { cn } from "@/lib/utils";
import { formatPYUSD } from "@/lib/currency";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

// Define the Community interface
export interface Community {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  stakeFee: number;
}

interface CommunityCardProps {
  community: Community;
  className?: string;
  onJoinCommunity: (community: Community) => void;
}

export function CommunityCard({
  community,
  onJoinCommunity,
}: CommunityCardProps) {
  const handleCardClick = () => {
    onJoinCommunity(community);
  };

  return (
    <div
      className="flex flex-col border rounded-xl overflow-hidden"
      onClick={handleCardClick}
    >
      {community.imageUrl && (
        <img
          className="aspect-video"
          src={community.imageUrl}
          alt={`${community.name} community`}
        />
      )}

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {community.name}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          {community.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <span className="text-zinc-500 font-medium">Stake Fee:</span>
            <span className="ml-2 text-lg font-bold text-green-400">
              {formatPYUSD(community.stakeFee)}
            </span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="w-full text-center">
          <div className="text-sm text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
            Click to join community
          </div>
        </div>
      </CardFooter>
    </div>
  );
}
