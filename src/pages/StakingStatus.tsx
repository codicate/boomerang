import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { useHasStaked } from "@/hooks/useHasStaked";
import { Card } from "@/components/ui/card";

export default function StakingStatus({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return children;
}
