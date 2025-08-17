import { useState } from "react";
import { Users } from "lucide-react";

import { CommunityCard, Community } from "./CommunityCard";
import { CommunityDetail } from "./CommunityDetail";
import { PageLayout } from "./ui/page-layout";
import { PageHeader } from "./ui/page-header";

// Mock communities data
const mockCommunities: Community[] = [
  {
    id: "1",
    name: "2026 New Grad Jobs",
    description: "A collection of jobs for 2026 new grads",
    imageUrl:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
    stakeFee: 10,
  },
  {
    id: "2",
    name: "Uber Eats Coupon",
    description: "We share the latest Uber Eats or Postmates coupons",
    imageUrl:
      "https://www.jotform.com/blog/wp-content/uploads/2020/04/ubereats-alternatives.jpg",
    stakeFee: 20,
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
    <PageLayout maxWidth="6xl">
      <PageHeader
        title="Communities"
        subtitle="Choose a community to join and start earning rewards"
        icon={Users}
        iconBgColor="bg-blue-600/20"
        iconTextColor="text-blue-400"
      />

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
    </PageLayout>
  );
}
