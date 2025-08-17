import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Toaster } from "@/components/ui/sonner";
import { CommunityDemo } from "./components/CommunityDemo";

function App() {
  return (
    <div className="flex flex-col p-4">
      <DynamicWidget />
      <CommunityDemo />
      <Toaster />
    </div>
  );
}

export default App;
