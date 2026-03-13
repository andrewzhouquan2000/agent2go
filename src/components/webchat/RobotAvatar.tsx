'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface RobotAvatarProps {
  role: 'CEO' | 'Researcher' | 'Coder' | 'Designer' | 'user' | 'system';
  size?: 'sm' | 'md' | 'lg';
}

const robotConfig = {
  CEO: { color: 'bg-red-500', initials: 'CEO', label: 'CEO' },
  Researcher: { color: 'bg-blue-500', initials: 'RES', label: 'Researcher' },
  Coder: { color: 'bg-green-500', initials: 'COD', label: 'Coder' },
  Designer: { color: 'bg-purple-500', initials: 'DES', label: 'Designer' },
  user: { color: 'bg-gray-500', initials: 'U', label: 'User' },
  system: { color: 'bg-yellow-500', initials: 'SYS', label: 'System' },
};

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export function RobotAvatar({ role, size = 'md' }: RobotAvatarProps) {
  const config = robotConfig[role] || robotConfig.user;

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarFallback className={`${config.color} text-white font-semibold`}>
        {config.initials}
      </AvatarFallback>
    </Avatar>
  );
}
