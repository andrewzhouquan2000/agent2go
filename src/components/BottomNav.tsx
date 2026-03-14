'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CheckSquare, Workflow, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/agents',
    label: 'Agents',
    icon: Users,
  },
  {
    href: '/tasks',
    label: 'Tasks',
    icon: CheckSquare,
  },
  {
    href: '/workflows',
    label: 'Workflows',
    icon: Workflow,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn('bottom-nav-item', isActive && 'active')}
          >
            <Icon
              size={24}
              strokeWidth={2}
              className={cn(isActive && 'stroke-[#2563EB]')}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
