import { toast } from "sonner";
import { useResources } from "../hooks/useResources";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { ResourceList } from "../components/ResourceList";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResourcePage() {
  const { userId } = useCurrentUser();
  const { resources, upvoteResource, isLoading } = useResources(userId);
  const navigate = useNavigate();

  const handleTip = (_resourceId: string) => {
    // Placeholder for tipping functionality
    toast.info("Tipping feature coming soon! 🪙");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Resource Hub</h1>
          <p className="text-gray-400">
            Share and discover time-sensitive opportunities, discounts, and
            valuable resources
          </p>
        </div>

        {/* Resource List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading resources...</div>
          </div>
        ) : (
          <ResourceList
            resources={resources}
            onUpvote={upvoteResource}
            onTip={handleTip}
          />
        )}

        {/* Floating Action Button */}
        <Button
          onClick={() => navigate("/resource/add")}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 z-40"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
