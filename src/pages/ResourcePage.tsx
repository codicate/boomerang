import { toast } from "sonner";
import { useResources } from "../hooks/useResources";
import { AddResourceForm } from "../components/AddResourceForm";
import { ResourceList } from "../components/ResourceList";

export default function ResourcePage() {
  const { resources, addResource, upvoteResource, isSubmitting } =
    useResources();

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

        {/* Add Resource Form */}
        <AddResourceForm onSubmit={addResource} isSubmitting={isSubmitting} />

        {/* Resource List */}
        <ResourceList
          resources={resources}
          onUpvote={upvoteResource}
          onTip={handleTip}
        />
      </div>
    </div>
  );
}
