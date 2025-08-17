import { Card } from "@/components/ui/card";

export default function ResourcePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Resources</h1>

        {/* Placeholder content */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Community Resources</h2>
          <p className="text-gray-600 mb-4">
            Discover and share valuable resources with the community.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800">
                📚 Learning Materials
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Educational content and tutorials
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800">🔗 Useful Links</h3>
              <p className="text-sm text-gray-600 mt-1">
                Important links and references
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800">
                🛠️ Tools & Templates
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Development tools and code templates
              </p>
            </div>
          </div>
        </Card>

        {/* Coming soon banner */}
        <div className="text-center p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-gray-800">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-gray-400">
            Resource management and sharing features are being developed.
          </p>
        </div>
      </div>
    </div>
  );
}
