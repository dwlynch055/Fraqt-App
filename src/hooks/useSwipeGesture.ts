import { useEffect } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipeGesture({ onSwipeLeft, onSwipeRight }: SwipeConfig) {
  // Return empty object since we're removing swipe functionality
  return { showHint: false };
}
