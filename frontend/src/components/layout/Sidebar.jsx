import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-[#0F172A] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10 bg-[#0F172A]">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6366F1] text-white shadow-lg shadow-indigo-500/30">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">SyntecxHub</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-4 py-6">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Overview
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-0 w-full p-4">
          <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
            <h4 className="text-sm font-semibold text-white">EMS v1.0</h4>
            <p className="text-xs text-slate-400 mt-1">Manage employees efficiently and seamlessly.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
