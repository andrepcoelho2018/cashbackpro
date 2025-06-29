import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  TrendingUp, 
  Gift, 
  UserPlus, 
  Settings,
  MessageSquare,
  Target,
  Building,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'branches', label: 'Filiais', icon: Building },
    { id: 'levels', label: 'Níveis', icon: Star },
    { id: 'movements', label: 'Movimentos', icon: TrendingUp },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'referrals', label: 'Indicações', icon: UserPlus },
    { id: 'communication', label: 'Comunicação', icon: MessageSquare },
    { id: 'objectives', label: 'Objetivos', icon: Target },
    { id: 'settings', label: 'Personalização', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
          <Gift className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold">Cashback Pro</span>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64 p-4 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export default Layout;