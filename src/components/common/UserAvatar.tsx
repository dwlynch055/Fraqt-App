import React from 'react';

interface UserAvatarProps {
  name: string;
  className?: string;
}

export function UserAvatar({ name, className = '' }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={`w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white ${className}`}
    >
      {initials}
    </div>
  );
}