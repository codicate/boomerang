import { ArrowRight, ArrowLeft, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/ui/page-layout";
import { StepIndicator } from "@/components/ui/step-indicator";
import { useCommunityStaking } from "@/hooks/useCommunityStaking";
import { formatPYUSD } from "@/lib/currency";
import { Community } from "./CommunityCard";

interface CommunityDetailProps {
  community: Community;
  onGoToCommunity: () => void;
  onBack: () => void;
}

export function CommunityDetail({
  community,
  onGoToCommunity,
  onBack,
}: CommunityDetailProps) {
  const {
    startStaking,
    isApproving,
    isStaking,
    isApprovalConfirmed,
    isStakeConfirmed,
  } = useCommunityStaking(community.stakeFee);

  const handleApprove = () => {
    startStaking();
  };

  const isStep1Completed = isApprovalConfirmed;
  const isStep2Completed = isStakeConfirmed;
  const bothStepsCompleted = isStep1Completed && isStep2Completed;

  return (
    <PageLayout>
      {/* Header with back button */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to communities
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Join {community.name}
        </h1>
        <p className="text-gray-400 text-lg">
          Complete the steps below to join this community and start earning
          rewards
        </p>
      </div>

      {/* Community Info Card */}
      <Card className="bg-gray-900 border-gray-800 mb-8">
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {community.imageUrl && (
              <img
                src={community.imageUrl}
                alt={community.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-2">
                {community.name}
              </h2>
              <p className="text-gray-400 mb-4">{community.description}</p>
              <div className="flex items-center text-sm text-gray-400">
                <span className="font-medium">Stake Fee:</span>
                <span className="ml-2 text-lg font-semibold text-green-400">
                  {formatPYUSD(community.stakeFee)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-Step Process */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">
            Join Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Approve USDC */}
            <StepIndicator
              stepNumber={1}
              title="Approve USDC Spending"
              description="Allow the Boomerang contract to spend your USDC tokens for staking."
              isCompleted={isStep1Completed}
              isInProgress={isApproving}
              backgroundColor="bg-blue-900"
              completedColor="text-blue-400"
            >
              {!isStep1Completed && (
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isApproving ? "Approving..." : "Approve USDC"}
                </Button>
              )}
            </StepIndicator>

            {/* Step 2: Stake */}
            <StepIndicator
              stepNumber={2}
              title="Stake USDC"
              description="Stake your USDC to join the community and start earning rewards."
              isCompleted={isStep2Completed}
              isInProgress={isStep1Completed && !isStep2Completed && isStaking}
              backgroundColor="bg-green-900"
              completedColor="text-green-400"
            >
              {isStep1Completed && !isStep2Completed && (
                <div className="text-sm text-gray-400">
                  {isStaking
                    ? "Staking in progress..."
                    : "Staking will begin automatically..."}
                </div>
              )}
            </StepIndicator>
          </div>

          {/* Success State */}
          {bothStepsCompleted && (
            <div className="border-t border-gray-700 pt-6 mt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900 mb-4">
                  <ArrowRight className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  Welcome to {community.name}!
                </h4>
                <p className="text-gray-400 mb-6">
                  You have successfully joined the community. You can now access
                  all community features.
                </p>
                <Button
                  onClick={onGoToCommunity}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg"
                >
                  Go to Community
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </PageLayout>
  );
}
