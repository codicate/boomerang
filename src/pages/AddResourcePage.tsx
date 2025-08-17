import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useResources } from "../hooks/useResources";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { AddResourceForm } from "../components/AddResourceForm";
import { Button } from "../components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { NewResourceInput } from "../types/resource";

export default function AddResourcePage() {
  const { userId } = useCurrentUser();
  const { addResource, isSubmitting, hasStaked } = useResources(userId);
  const navigate = useNavigate();

  const handleSubmit = async (resource: NewResourceInput) => {
    const result = await addResource(resource);
    if (result.success) {
      toast.success("Resource shared successfully! 🎉");
      // Navigation will be handled automatically after contract confirmation
    }
    return result;
  };

  const handleCancel = () => {
    navigate("/resource");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with navigation */}
      <div className="sticky top-0 bg-black border-b border-gray-800 z-50">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-white">
                Share a Resource
              </h1>
            </div>

            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <p className="text-gray-400 text-center">
            Share time-sensitive opportunities, discounts, and valuable
            resources with the community
          </p>
        </div>

        {!hasStaked ? (
          <div className="bg-orange-900/50 border border-orange-700 text-orange-200 px-6 py-4 rounded-lg text-center">
            <p className="mb-4">
              You must stake before adding resources to the community.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Go to Community Page to Stake
            </Button>
          </div>
        ) : (
          <AddResourceForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Cancel button at the bottom */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
