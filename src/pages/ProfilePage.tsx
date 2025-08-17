import { useAccount } from "wagmi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Wallet,
  TrendingUp,
  BarChart3,
  Coins,
  Zap,
  MessageSquare,
  Copy,
} from "lucide-react";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { useUserStats } from "@/hooks/useUserStats";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useContractStats } from "@/hooks/useContractStats";
import { useSimulateYield } from "@/hooks/useSimulateYield";
import { MetricCard } from "@/components/MetricCard";
import { ConnectWalletPrompt } from "@/components/ui/connect-wallet-prompt";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { userId } = useCurrentUser();
  const {
    ethBalance,
    usdcBalance,
    isLoading: isLoadingBalances,
  } = useWalletBalances();
  const { stats, isLoading: isLoadingStats } = useUserStats(userId);
  const {
    totalPrincipal,
    totalYield,
    totalVotes,
    isLoading: isLoadingContract,
    refetchAll,
  } = useContractStats();
  const { simulateYield, isLoading: isSimulatingYield } = useSimulateYield();

  if (!isConnected) {
    return <ConnectWalletPrompt variant="wallet" />;
  }

  return (
    <div className="min-h-full bg-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="space-y-6">
          {/* Wallet Info */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Wallet Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">Address</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      onClick={() => {
                        if (address) {
                          navigator.clipboard.writeText(address);
                          toast.success("Address copied to clipboard!");
                        }
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-300">
                          Ξ
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">ETH Balance</span>
                    </div>
                    {isLoadingBalances ? (
                      <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-lg font-semibold text-white">
                        {ethBalance
                          ? `${parseFloat(ethBalance.formatted).toFixed(4)}`
                          : "0.0000"}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600/20 rounded-full flex items-center justify-center">
                        <Coins className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-gray-400 text-sm">
                        USDC Balance
                      </span>
                    </div>
                    {isLoadingBalances ? (
                      <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-lg font-semibold text-white">
                        {usdcBalance
                          ? `${parseFloat(usdcBalance.formatted).toFixed(2)}`
                          : "0.00"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Community Activity */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Community Activity
                </h2>
              </div>

              {isLoadingStats ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                  <span className="text-gray-400">Loading activity...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard
                      title="Resources Owned"
                      value={stats.resourcesOwned}
                      subtitle="Total resources shared"
                      icon={BarChart3}
                      iconBgColor="bg-blue-600/20"
                      iconTextColor="text-blue-400"
                      gradientFrom="from-blue-600/10"
                      gradientTo="to-blue-600/5"
                      borderColor="border-blue-600/20"
                      isLoading={isLoadingStats}
                    />

                    <MetricCard
                      title="Total Votes Cast"
                      value={stats.totalVotes}
                      subtitle="Votes across all resources"
                      icon={MessageSquare}
                      iconBgColor="bg-green-600/20"
                      iconTextColor="text-green-400"
                      gradientFrom="from-green-600/10"
                      gradientTo="to-green-600/5"
                      borderColor="border-green-600/20"
                      isLoading={isLoadingStats}
                    />
                  </div>

                  {stats.resourcesOwned === 0 && stats.totalVotes === 0 && (
                    <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-300 mb-1">
                            Get Started
                          </p>
                          <p className="text-xs text-gray-400">
                            Add resources and vote on others' content to build
                            your community presence and earn rewards.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Contract Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Contract Statistics
                </h2>
              </div>

              {isLoadingContract ? (
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
                  <span className="text-gray-400">
                    Loading contract data...
                  </span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                      title="Principal Balance"
                      value={
                        totalPrincipal
                          ? `${parseFloat(totalPrincipal.formatted).toFixed(2)}`
                          : "0.00"
                      }
                      subtitle="USDC staked in contract"
                      icon={Coins}
                      iconBgColor="bg-purple-600/20"
                      iconTextColor="text-purple-400"
                      gradientFrom="from-purple-600/10"
                      gradientTo="to-purple-600/5"
                      borderColor="border-purple-600/20"
                      isLoading={isLoadingContract}
                    />

                    <MetricCard
                      title="Total Yield"
                      value={
                        totalYield
                          ? `${parseFloat(totalYield.formatted).toFixed(2)}`
                          : "0.00"
                      }
                      subtitle="USDC yield generated"
                      icon={TrendingUp}
                      iconBgColor="bg-green-600/20"
                      iconTextColor="text-green-400"
                      gradientFrom="from-green-600/10"
                      gradientTo="to-green-600/5"
                      borderColor="border-green-600/20"
                      isLoading={isLoadingContract}
                    />

                    <MetricCard
                      title="Total Votes"
                      value={totalVotes}
                      subtitle="Votes across all resources"
                      icon={MessageSquare}
                      iconBgColor="bg-orange-600/20"
                      iconTextColor="text-orange-400"
                      gradientFrom="from-orange-600/10"
                      gradientTo="to-orange-600/5"
                      borderColor="border-orange-600/20"
                      isLoading={isLoadingContract}
                    />
                  </div>

                  <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Zap className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-300">
                            Debug Mode
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          simulateYield("1");
                          setTimeout(() => refetchAll(), 3000);
                        }}
                        disabled={isSimulatingYield}
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium whitespace-nowrap"
                      >
                        {isSimulatingYield ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                            Generating...
                          </div>
                        ) : (
                          "Generate 1 USDC"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
