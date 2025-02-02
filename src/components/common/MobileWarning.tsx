import React from 'react';
import { Icons } from '../icons';

function usePreventScroll(shouldPrevent: boolean) {
  React.useEffect(() => {
    if (shouldPrevent) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldPrevent]);
}

export function MobileWarning() {
  const [isMobile] = React.useState(window.innerWidth < 640);
  usePreventScroll(isMobile);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-gray-800 bg-black p-6 text-center">
        <Icons.Smartphone className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-semibold text-white">Desktop Only</h2>
        <p className="text-gray-400">
          This application is optimised for tablet and desktop viewing. Please access it from a
          larger device for the best experience.
        </p>
      </div>
    </div>
  );
}
