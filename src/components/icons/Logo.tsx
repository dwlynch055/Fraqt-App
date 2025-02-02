import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <img 
      src="/assets/logo_white.png"
      alt="Fraqt AI"
      className={className}
    />
  );
}