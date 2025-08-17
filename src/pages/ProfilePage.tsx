import { useAccount } from "wagmi";
import { useHasStaked } from "@/hooks/useHasStaked";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { hasStaked, isLoading } = useHasStaked();

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">🔌</div>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600">
              Please connect your wallet to view your profile and staking
              status.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>

        {/* Wallet Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Address:</span>
              <span className="font-mono text-sm">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
          </div>
        </Card>

        {/* Staking Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Staking Status</h2>

          {isLoading ? (
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Checking staking status...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{hasStaked ? "✅" : "❌"}</span>
                <div>
                  <p className="font-semibold">
                    {hasStaked ? "Staked" : "Not Staked"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {hasStaked
                      ? "You are actively staking and can participate in communities"
                      : "Stake to unlock community features"}
                  </p>
                </div>
              </div>

              {!hasStaked && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    💡 <strong>Tip:</strong> Go to the Community tab to find and
                    join a community by staking.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Community Participation */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Community Activity</h2>

          {hasStaked ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Resources Added</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Votes Cast</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🚧 <strong>Coming Soon:</strong> Detailed activity tracking
                  and rewards dashboard.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🏘️</div>
              <p className="text-gray-600">
                Join a community to start tracking your activity and earning
                rewards.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
