import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { CommunityCard, type Community } from "./components/CommunityCard";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const sampleCommunity: Community = {
    name: "Sample Community",
    description:
      "This is a sample community for testing the community card component.",
    imageUrl:
      "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    stakeFee: 1250.5,
  };

  return (
    <div className="flex flex-col p-4">
      <DynamicWidget />
      <div className="mt-8">
        <CommunityCard community={sampleCommunity} />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
