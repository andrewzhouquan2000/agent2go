'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  name: string
  href: string
  icon: string
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Agents', href: '/agents', icon: '🤖' },
  { name: 'Tasks', href: '/tasks', icon: '✅' },
  { name: 'Workflows', href: '/workflows', icon: '🔗' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
