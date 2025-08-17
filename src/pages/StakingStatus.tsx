import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useHasStaked } from "@/hooks/useHasStaked";
import { Card } from "@/components/ui/card";

export default function StakingStatus() {
  const { address, isConnected } = useAccount();
  const { hasStaked, isLoading, error } = useHasStaked();
  const navigate = useNavigate();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Staking Status</h1>
          <p className="text-gray-600">
            Please connect your wallet to check your staking status.
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Staking Status</h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600">Checking staking status...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Staking Status</h1>
          <p className="text-red-600">
            Error checking staking status. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-6">Staking Status</h1>

        {hasStaked ? (
          <div className="space-y-4">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-700">
              You have staked!
            </h2>
            <p className="text-gray-600">
              Welcome to the community! Your staking is active.
            </p>

            {/* Placeholder for future features */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 italic">
                🚧 Additional features coming soon...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-orange-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-orange-700">
              Not Staked
            </h2>
            <p className="text-gray-600">
              Please go and stake in a community to access all features.
            </p>

            <div className="mt-6">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Communities
              </button>
            </div>
          </div>
        )}

        {/* User address info */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
      </Card>
    </div>
  );
}
