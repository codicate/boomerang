import { toast } from "sonner";
import { useResources } from "../hooks/useResources";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { ResourceList } from "../components/ResourceList";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConnectWalletPrompt } from "../components/ui/connect-wallet-prompt";

export default function ResourcePage() {
  const { userId } = useCurrentUser();
  const { resources, upvoteResource, isLoading, hasStaked } =
    useResources(userId);
  const navigate = useNavigate();

  const handleTip = (_resourceId: string) => {
    // Placeholder for tipping functionality
    toast.info("Tipping feature coming soon! 🪙");
  };

  if (!hasStaked) {
    return <ConnectWalletPrompt variant="community" />;
  }

  return (
    <div className="min-h-full bg-black text-white relative">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading resources...</div>
          </div>
        ) : (
          <ResourceList
            resources={resources}
            onUpvote={upvoteResource}
            onTip={handleTip}
            currentUserId={userId}
          />
        )}

        {/* Floating Action Button */}
        {userId && (
          <Button
            onClick={() =>
              hasStaked
                ? navigate("/resource/add")
                : toast.error("You must stake before adding resources")
            }
            size="icon"
            className={`absolute bottom-5 right-5 text-white z-999 size-12 ${
              hasStaked ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <Plus />
          </Button>
        )}
      </div>
    </div>
  );
}
