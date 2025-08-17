import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatPYUSD } from "@/lib/currency";

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
      className="transition-colors bg-gray-900 border-gray-800 overflow-hidden rounded-lg"
      onClick={handleCardClick}
    >
      {community.imageUrl && (
        <img
          className="aspect-video w-full object-cover"
          src={community.imageUrl}
          alt={`${community.name} community`}
        />
      )}

      <CardContent className="p-6 flex flex-col justify-between gap-2">
        <h3 className="text-xl font-semibold text-white">{community.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-3">
          {community.description}
        </p>

        <div className="flex items-center justify-between ">
          <div className="flex items-center text-sm">
            <span className="text-gray-400 font-medium">Stake Fee:</span>
            <span className="ml-2 text-lg font-semibold text-green-400">
              {formatPYUSD(community.stakeFee)}
            </span>
          </div>

          <ArrowRight className="w-5 h-5 text-blue-400" />
        </div>
      </CardContent>
    </div>
  );
}
