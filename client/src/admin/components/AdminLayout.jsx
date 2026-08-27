import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard', icon: '⊞', label: 'Dashboard' },
    ],
  },
  {
    label: 'Site Content',
    items: [
      { to: '/admin/settings', icon: '⚙', label: 'Site Settings' },
      { to: '/admin/services', icon: '◈', label: 'Services' },
      { to: '/admin/products', icon: '◉', label: 'Products (Own)' },
      { to: '/admin/client-projects', icon: '◎', label: 'Client Projects' },
      { to: '/admin/team', icon: '👥', label: 'Team Members' },
      { to: '/admin/testimonials', icon: '❝', label: 'Testimonials' },
      { to: '/admin/gallery', icon: '▣', label: 'Gallery' },
    ],
  },
  {
    label: 'Publishing',
    items: [
      { to: '/admin/blog', icon: '✍', label: 'Blog Posts' },
      { to: '/admin/careers', icon: '♦', label: 'Careers' },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { to: '/admin/inbox', icon: '✉', label: 'Contact Inbox' },
      { to: '/admin/applications', icon: '📄', label: 'Applications' },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out.');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-[#0d0d14] text-white overflow-hidden font-sans relative">
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[40]"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`absolute md:relative z-[50] h-full ${collapsed ? '-translate-x-full md:translate-x-0 w-64 md:w-16' : 'translate-x-0 w-64'} flex-shrink-0 flex flex-col bg-[#0a0a10] border-r border-white/5 transition-all duration-300`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/5 gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L7.5 4.5L12 9L7.5 13.5L3 9Z" fill="white" opacity="0.7"/>
              <path d="M7.5 9L12 4.5L16.5 9L12 13.5L7.5 9Z" fill="white"/>
            </svg>
          </div>
          <span className={`font-black text-sm tracking-tight text-white/90 ${collapsed ? 'md:hidden' : 'block'}`}>BN <span className="text-blue-500">ADMIN</span></span>
          <button onClick={() => setCollapsed(c => !c)} className="ml-auto text-white/30 hover:text-white/70 transition-colors text-lg hidden md:block">
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className={`text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-3 mb-2 ${collapsed ? 'md:hidden' : 'block'}`}>{group.label}</p>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => {
                        // Close sidebar on mobile when navigating
                        if (window.innerWidth < 768) {
                          setCollapsed(true);
                        }
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                        }`
                      }
                    >
                      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                      <span className={`${collapsed ? 'md:hidden' : 'block'}`}>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className={`flex-1 min-w-0 ${collapsed ? 'md:hidden' : 'block'}`}>
              <p className="text-xs font-bold text-white/80 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-white/30 capitalize">{user?.role || 'admin'}</p>
            </div>
            <button onClick={handleLogout} title="Sign out" className={`text-white/30 hover:text-red-400 transition-colors text-sm ${collapsed ? 'md:w-full md:flex md:justify-center' : ''}`}>⏻</button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0a0a10]/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setCollapsed(false)} className="md:hidden text-white/70 hover:text-white transition-colors text-xl">
              ☰
            </button>
            <p className="text-xs text-white/30 font-mono hidden sm:block">boostrnetwave.com/admin</p>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="text-xs text-white/40 hover:text-blue-400 transition-colors flex items-center gap-1.5 border border-white/10 px-3 py-1.5 rounded-lg hover:border-blue-500/30">
            ↗ <span className="hidden sm:inline">View live site</span>
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
