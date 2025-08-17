import { useParams, useNavigate } from "react-router-dom";
import { useCommunityStaking } from "@/hooks/useCommunityStaking";
import { formatPYUSD } from "@/lib/currency";
import { CheckCircle, Circle, ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock community data - in real app this would come from props or API
const mockCommunity = {
  name: "Web3 Developers",
  description:
    "A community for Web3 developers to share knowledge and collaborate on projects.",
  imageUrl:
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800",
  stakeFee: 100,
};

export function CommunityDetail() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  const {
    startStaking,
    retryStaking,
    isApproving,
    isStaking,
    isApprovalConfirmed,
    isStakeConfirmed,
    approvalError,
    stakeError,
  } = useCommunityStaking(mockCommunity.stakeFee);

  const handleApprove = () => {
    startStaking();
  };

  const handleRetryApproval = () => {
    startStaking();
  };

  const handleRetryStaking = () => {
    // Re-trigger staking since approval is already confirmed
    retryStaking();
  };

  const handleGoToCommunity = () => {
    // Navigate to the actual community page
    navigate(`/community/${communityId}/home`);
  };

  const isStep1Completed = isApprovalConfirmed;
  const isStep2Completed = isStakeConfirmed;
  const bothStepsCompleted = isStep1Completed && isStep2Completed;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join {mockCommunity.name}
          </h1>
          <p className="text-gray-600 text-lg">
            Complete the steps below to join this community
          </p>
        </div>

        {/* Community Info Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-start space-x-6">
            {mockCommunity.imageUrl && (
              <img
                src={mockCommunity.imageUrl}
                alt={mockCommunity.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {mockCommunity.name}
              </h2>
              <p className="text-gray-600 mb-4">{mockCommunity.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="font-medium">Stake Fee:</span>
                <span className="ml-2 text-lg font-semibold text-green-600">
                  {formatPYUSD(mockCommunity.stakeFee)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Step Process */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Join Process
          </h3>

          {/* Step 1: Approve USDC */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                  isStep1Completed
                    ? "bg-green-100"
                    : approvalError
                    ? "bg-red-100"
                    : "bg-blue-100"
                }`}
              >
                {isStep1Completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : approvalError ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Circle className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <h4 className="text-lg font-medium text-gray-900">
                Step 1: Approve USDC Spending
              </h4>
              {isStep1Completed && (
                <span className="ml-3 text-sm text-green-600 font-medium">
                  Completed
                </span>
              )}
              {approvalError && !isStep1Completed && (
                <span className="ml-3 text-sm text-red-600 font-medium">
                  Failed
                </span>
              )}
            </div>

            <div className="ml-11">
              <p className="text-gray-600 mb-4">
                Allow the Boomerang contract to spend your USDC tokens for
                staking.
              </p>

              {!isStep1Completed && (
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isApproving ? "Approving..." : "Approve USDC"}
                </Button>
              )}

              {/* Error state for approval */}
              {approvalError && !isStep1Completed && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm mb-3">
                    Approval failed. Please try again.
                  </p>
                  <Button
                    onClick={handleRetryApproval}
                    disabled={isApproving}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {isApproving ? "Retrying..." : "Try Again"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Stake */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                  isStep2Completed
                    ? "bg-green-100"
                    : stakeError && isStep1Completed
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                {isStep2Completed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : stakeError && isStep1Completed ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <Circle className="w-5 h-5 text-green-400" />
                )}
              </div>
              <h4 className="text-lg font-medium text-gray-900">
                Step 2: Stake USDC
              </h4>
              {isStep2Completed && (
                <span className="ml-3 text-sm text-green-600 font-medium">
                  Completed
                </span>
              )}
              {stakeError && isStep1Completed && !isStep2Completed && (
                <span className="ml-3 text-sm text-red-600 font-medium">
                  Failed
                </span>
              )}
            </div>

            <div className="ml-11">
              <p className="text-gray-600 mb-4">
                Stake your USDC to join the community and start earning rewards.
              </p>

              {isStep1Completed && !isStep2Completed && (
                <div className="text-sm text-gray-500">
                  {isStaking
                    ? "Staking in progress..."
                    : "Staking will begin automatically..."}
                </div>
              )}

              {/* Error state for staking */}
              {stakeError && isStep1Completed && !isStep2Completed && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm mb-3">
                    Staking failed. Please try again.
                  </p>
                  <Button
                    onClick={handleRetryStaking}
                    disabled={isStaking}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {isStaking ? "Retrying..." : "Try Again"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Success State */}
          {bothStepsCompleted && (
            <div className="border-t pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to {mockCommunity.name}!
                </h4>
                <p className="text-gray-600 mb-6">
                  You have successfully joined the community. You can now access
                  all community features.
                </p>
                <Button
                  onClick={handleGoToCommunity}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
                >
                  Go to Community
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
