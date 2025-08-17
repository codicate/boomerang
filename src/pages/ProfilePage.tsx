import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useUserStats } from "@/hooks/useUserStats";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { userId } = useCurrentUser();
  const {
    ethBalance,
    usdcBalance,
    isLoading: isLoadingBalances,
  } = useWalletBalances();
  const { stats, isLoading: isLoadingStats } = useUserStats(userId);

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
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ETH Balance:</span>
              {isLoadingBalances ? (
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              ) : (
                <span className="font-medium">
                  {ethBalance
                    ? `${parseFloat(ethBalance.formatted).toFixed(4)} ${
                        ethBalance.symbol
                      }`
                    : "0 ETH"}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">USDC Balance:</span>
              {isLoadingBalances ? (
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              ) : (
                <span className="font-medium">
                  {usdcBalance
                    ? `${parseFloat(usdcBalance.formatted).toFixed(2)} ${
                        usdcBalance.symbol
                      }`
                    : "0 USDC"}
                </span>
              )}
            </div>
          </div>
        </Card>

        {/* Community Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Community Activity</h2>

          {isLoadingStats ? (
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">Loading activity...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.resourcesOwned}
                  </div>
                  <div className="text-sm text-gray-600">Resources Owned</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalVotes}
                  </div>
                  <div className="text-sm text-gray-600">Total Votes Cast</div>
                </div>
              </div>

              {stats.resourcesOwned === 0 && stats.totalVotes === 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🚀 <strong>Get Started:</strong> Add resources and vote on
                    others' content to build your community presence.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
