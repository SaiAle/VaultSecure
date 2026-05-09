import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Key, ScrollText, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import clsx from 'clsx';

const nav = [
  { to: '/',        icon: Shield,     label: 'Dashboard' },
  { to: '/vault',   icon: Key,        label: 'Vault'     },
  { to: '/audit',   icon: ScrollText, label: 'Audit Log' },
  { to: '/settings',icon: Settings,   label: 'Settings'  },
];

export default function Sidebar() {
  const { username, logout } = useAuthStore();

  return (
    <aside className="w-60 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Shield className="text-vault-500 w-6 h-6" />
          <span className="text-lg font-bold text-white">VaultSecure</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-vault-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white')
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 truncate">{username}</span>
          <button onClick={logout} title="Sign out"
            className="text-gray-500 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
