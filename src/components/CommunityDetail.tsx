import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to communities
          </button>
          <h1 className="text-3xl font-bold text-white mb-3">
            Join {community.name}
          </h1>
          <p className="text-gray-400 text-lg">
            Complete the steps below to join this community and start earning
            rewards
          </p>
        </div>

        {/* Community Info Card */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
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
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Join Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Approve USDC */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-900 mr-3">
                  {isStep1Completed ? (
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">
                    Step 1: Approve USDC Spending
                  </h4>
                  {isStep1Completed && (
                    <span className="text-sm text-green-400 font-medium">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-11">
                <p className="text-gray-400 mb-4">
                  Allow the Boomerang contract to spend your USDC tokens for
                  staking.
                </p>

                {!isStep1Completed && (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isApproving ? "Approving..." : "Approve USDC"}
                  </Button>
                )}
              </div>
            </div>

            {/* Step 2: Stake */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-900 mr-3">
                  {isStep2Completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">
                    Step 2: Stake USDC
                  </h4>
                  {isStep2Completed && (
                    <span className="text-sm text-green-400 font-medium">
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-11">
                <p className="text-gray-400 mb-4">
                  Stake your USDC to join the community and start earning
                  rewards.
                </p>

                {isStep1Completed && !isStep2Completed && (
                  <div className="text-sm text-gray-400">
                    {isStaking
                      ? "Staking in progress..."
                      : "Staking will begin automatically..."}
                  </div>
                )}
              </div>
            </div>

            {/* Success State */}
            {bothStepsCompleted && (
              <div className="border-t pt-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Welcome to {community.name}!
                  </h4>
                  <p className="text-gray-400 mb-6">
                    You have successfully joined the community. You can now
                    access all community features.
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
      </div>
    </div>
  );
}
