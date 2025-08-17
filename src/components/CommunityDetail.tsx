import { useCommunityStaking } from "@/hooks/useCommunityStaking";
import { formatPYUSD } from "@/lib/currency";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen    py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to communities
          </button>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Join {community.name}
          </h1>
          <p className="text-zinc-400 text-lg">
            Complete the steps below to join this community and start earning
            rewards
          </p>
        </div>

        {/* Community Info Card */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-8 shadow-2xl shadow-blue-500/10">
          <CardContent className="p-8">
            <div className="flex items-start space-x-8">
              {community.imageUrl && (
                <div className="relative">
                  <img
                    src={community.imageUrl}
                    alt={community.name}
                    className="w-32 h-32 rounded-2xl object-cover ring-2 ring-blue-500/20"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-blue-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {community.name}
                </h2>
                <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                  {community.description}
                </p>
                <div className="flex items-center text-sm">
                  <span className="text-zinc-400 font-medium">Stake Fee:</span>
                  <span className="ml-3 text-2xl font-bold text-green-400">
                    {formatPYUSD(community.stakeFee)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Step Process */}
        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shadow-2xl shadow-blue-500/10">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-white">
              Join Process
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {/* Step 1: Approve USDC */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mr-4 ring-2 ring-blue-500/30">
                  {isStep1Completed ? (
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">
                    Step 1: Approve USDC Spending
                  </h4>
                  {isStep1Completed && (
                    <span className="text-sm text-green-400 font-medium">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-16">
                <p className="text-zinc-300 mb-6 text-lg">
                  Allow the Boomerang contract to spend your USDC tokens for
                  staking.
                </p>

                {!isStep1Completed && (
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40"
                  >
                    {isApproving ? "Approving..." : "Approve USDC"}
                  </Button>
                )}
              </div>
            </div>

            {/* Step 2: Stake */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mr-4 ring-2 ring-green-500/30">
                  {isStep2Completed ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-green-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">
                    Step 2: Stake USDC
                  </h4>
                  {isStep2Completed && (
                    <span className="text-sm text-green-400 font-medium">
                      ✓ Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-16">
                <p className="text-zinc-300 mb-6 text-lg">
                  Stake your USDC to join the community and start earning
                  rewards.
                </p>

                {isStep1Completed && !isStep2Completed && (
                  <div className="text-sm text-zinc-400 bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                    {isStaking
                      ? "🔄 Staking in progress..."
                      : "⏳ Staking will begin automatically..."}
                  </div>
                )}
              </div>
            </div>

            {/* Success State */}
            {bothStepsCompleted && (
              <div className="border-t border-zinc-700 pt-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 ring-4 ring-green-500/30">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">
                    Welcome to {community.name}!
                  </h4>
                  <p className="text-zinc-300 mb-8 text-lg max-w-md mx-auto">
                    You have successfully joined the community. You can now
                    access all community features.
                  </p>
                  <Button
                    onClick={onGoToCommunity}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 text-xl font-bold shadow-2xl shadow-green-500/25 transition-all duration-200 hover:shadow-2xl hover:shadow-green-500/40 hover:scale-105"
                  >
                    Go to Community
                    <ArrowRight className="w-6 h-6 ml-3" />
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
