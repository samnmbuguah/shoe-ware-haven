import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart, BarChart3 } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed bottom-0 w-full bg-white border-t md:relative md:border-t-0 md:border-r md:w-64 md:min-h-screen">
        <div className="hidden md:block p-4">
          <h1 className="text-2xl font-bold text-primary">Store POS</h1>
        </div>
        <ul className="flex justify-around md:flex-col md:space-y-2 p-4">
          <NavItem to="/" icon={<Home />} label="Dashboard" isActive={isActive("/")} />
          <NavItem to="/inventory" icon={<Package />} label="Inventory" isActive={isActive("/inventory")} />
          <NavItem to="/pos" icon={<ShoppingCart />} label="Point of Sale" isActive={isActive("/pos")} />
          <NavItem to="/reports" icon={<BarChart3 />} label="Reports" isActive={isActive("/reports")} />
        </ul>
      </nav>
      <main className="pb-20 md:pb-0 md:ml-64">
        <div className="container p-4 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </Link>
  </li>
);

export default Layout;