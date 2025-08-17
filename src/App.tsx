import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

import { Toaster } from "@/components/ui/sonner";
import { CommunityDemo } from "./components/CommunityDemo";

function App() {
  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 bg-black border-b border-gray-800 p-4">
        <DynamicWidget />
      </div>
      <CommunityDemo />
      <Toaster />
    </div>
  );
}

export default App;
