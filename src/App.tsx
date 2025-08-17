import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { CommunityDemo } from "./components/CommunityDemo";
import StakingStatus from "./pages/StakingStatus";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex space-x-4 mb-4">
      <Link 
        to="/" 
        className={`px-4 py-2 rounded-lg transition-colors ${
          location.pathname === '/' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Communities
      </Link>
      <Link 
        to="/staking-status" 
        className={`px-4 py-2 rounded-lg transition-colors ${
          location.pathname === '/staking-status' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        }`}
      >
        Staking Status
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <div className="sticky top-0 bg-black border-b border-gray-800 p-4">
          <div className="flex justify-between items-center">
            <Navigation />
            <DynamicWidget />
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<CommunityDemo />} />
          <Route path="/staking-status" element={<StakingStatus />} />
        </Routes>
        
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
