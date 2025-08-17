import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { CommunityDemo } from "./components/CommunityDemo";
import ResourcePage from "./pages/ResourcePage";
import AddResourcePage from "./pages/AddResourcePage";
import ProfilePage from "./pages/ProfilePage";

function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Community", icon: "🏘️" },
    { path: "/resource", label: "Resource", icon: "📚" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  // Hide bottom navigation on add resource page
  if (location.pathname === "/resource/add") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "text-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function App() {
  const location = useLocation();
  const isAddResourcePage = location.pathname === "/resource/add";

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Top header with wallet connection - hide on add resource page */}
      {!isAddResourcePage && (
        <div className="sticky top-0 bg-black border-b border-gray-800 p-4 z-40">
          <div className="flex justify-end">
            <DynamicWidget />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<CommunityDemo />} />
          <Route path="/resource" element={<ResourcePage />} />
          <Route path="/resource/add" element={<AddResourcePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      {/* Bottom navigation */}
      <BottomNavigation />

      <Toaster />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
