import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Users, BookOpen, User } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";
import { CommunityDemo } from "./components/CommunityDemo";
import ResourcePage from "./pages/ResourcePage";
import AddResourcePage from "./pages/AddResourcePage";
import ProfilePage from "./pages/ProfilePage";

function Footer() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Community", icon: Users },
    { path: "/resource", label: "Resource", icon: BookOpen },
    { path: "/profile", label: "Profile", icon: User },
  ];

  // Hide footer on add resource page
  if (location.pathname === "/resource/add") {
    return null;
  }

  return (
    <footer className="bg-black border-t border-gray-800 px-4 py-3 flex-shrink-0">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "text-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <IconComponent className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

function App() {
  const location = useLocation();
  const isAddResourcePage = location.pathname === "/resource/add";

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      {!isAddResourcePage && (
        <header className="bg-black border-b border-gray-800 p-4 flex-shrink-0">
          <div className="flex justify-end">
            <DynamicWidget />
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<CommunityDemo />} />
          <Route path="/resource" element={<ResourcePage />} />
          <Route path="/resource/add" element={<AddResourcePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      <Footer />
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
