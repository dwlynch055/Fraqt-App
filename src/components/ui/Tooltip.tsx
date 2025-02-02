import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'right' | 'left' | 'top' | 'bottom';
}

export function Tooltip({ content, children, side = 'right' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updatePosition() {
      if (!tooltipRef.current || !containerRef.current) return;
      
      const container = containerRef.current.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      
      if (side === 'right') {
        tooltip.style.left = `${container.width + 8}px`;
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translateY(-50%)';
      }
    }

    if (show) {
      updatePosition();
    }
  }, [show, side]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-2 py-1 text-sm font-medium text-white 
            bg-gray-900 rounded-md shadow-sm border border-gray-800 
            px-3 py-1.5 min-h-[32px] flex items-center
            whitespace-nowrap
          `}
          style={{ pointerEvents: 'none' }}
        >
          {content}
        </div>
      )}
    </div>
  );
}