import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 shadow-[0_1px_2px_rgb(0,0,0,0.05)] backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="mr-4 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1] lg:hidden transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 lg:hidden">
          EMS
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-4 shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366F1]/10 text-[#6366F1]">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
          {user?.role && (
            <span className={`hidden sm:inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ml-2 ${
              user.role === 'Admin' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' :
              user.role === 'HR' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
              'bg-slate-50 text-slate-700 ring-slate-700/10'
            }`}>
              {user.role}
            </span>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
