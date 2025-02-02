import React from 'react';

interface UserAvatarProps {
  name: string;
  className?: string;
}

export function UserAvatar({ name, className = '' }: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white ${className}`}
    >
      {initials}
    </div>
  );
}
