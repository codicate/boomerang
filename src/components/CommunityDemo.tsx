import { useState } from "react";

import { CommunityCard, Community } from "./CommunityCard";
import { CommunityDetail } from "./CommunityDetail";

// Mock communities data
const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Web3 Developers",
    description:
      "A community for Web3 developers to share knowledge and collaborate on projects.",
    imageUrl:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
    stakeFee: 100,
  },
  {
    id: "2",
    name: "DeFi Traders",
    description:
      "Advanced DeFi trading strategies and alpha sharing community.",
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    stakeFee: 250,
  },
  {
    id: "3",
    name: "NFT Artists",
    description: "Creative community for NFT artists and collectors.",
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    stakeFee: 75,
  },
];

export function CommunityDemo() {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [view, setView] = useState<"list" | "detail">("list");

  const handleJoinCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedCommunity(null);
  };

  const handleGoToCommunity = () => {
    // In a real app, this would navigate to the actual community page
    console.log(`Navigating to ${selectedCommunity?.name} community`);
    alert(
      `Welcome to ${selectedCommunity?.name}! This would navigate to the community home page.`
    );
  };

  if (view === "detail" && selectedCommunity) {
    return (
      <CommunityDetail
        community={selectedCommunity}
        onGoToCommunity={handleGoToCommunity}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Communities</h1>
          <p className="text-gray-400">
            Choose a community to join and start earning rewards
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoinCommunity={handleJoinCommunity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
