import { Wallet, Users } from "lucide-react";
import { Card } from "./card";

interface ConnectWalletPromptProps {
  variant?: "wallet" | "community";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function ConnectWalletPrompt({
  variant = "wallet",
  title,
  description,
  icon,
}: ConnectWalletPromptProps) {
  const defaultContent = {
    wallet: {
      title: "Connect Your Wallet",
      description:
        "Please connect your wallet to view your profile, balances, and community activity.",
      icon: <Wallet className="w-8 h-8 text-gray-400" />,
    },
    community: {
      title: "Join a Community",
      description: "Please join a community to view and contribute resources.",
      icon: <Users className="w-8 h-8 text-gray-400" />,
    },
  };

  const content = defaultContent[variant];
  const displayTitle = title || content.title;
  const displayDescription = description || content.description;
  const displayIcon = icon || content.icon;

  return (
    <div className="min-h-full bg-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          {variant === "wallet" ? "Profile" : "Resources"}
        </h1>
        <Card className="bg-gray-900 border-gray-800 p-8 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            {displayIcon}
          </div>
          <h2 className="text-xl font-semibold text-white mb-3">
            {displayTitle}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">{displayDescription}</p>
        </Card>
      </div>
    </div>
  );
}
