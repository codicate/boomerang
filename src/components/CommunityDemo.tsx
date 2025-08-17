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
    <div className="min-h-screen ">
      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCommunities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            onJoinCommunity={handleJoinCommunity}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <div className="inline-block p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Join?</h3>
          <p className="text-zinc-400 mb-6">
            Select a community above to get started on your Web3 journey
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            <div
              className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
