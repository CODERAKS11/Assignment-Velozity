import { useState, useEffect, RefObject } from 'react';
import { flushSync } from 'react-dom';

interface UseVirtualScrollOptions {
  itemCount: number;
  rowHeight: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function useVirtualScroll({ itemCount, rowHeight, containerRef }: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  const BUFFER = 5;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = (e: Event) => {
      flushSync(() => {
        setScrollTop((e.target as HTMLDivElement).scrollTop);
      });
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    setContainerHeight(container.clientHeight);
    container.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER);
  const visibleCount = containerHeight > 0 ? Math.ceil(containerHeight / rowHeight) : 15;
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + 2 * BUFFER);

  return {
    startIndex,
    endIndex,
    totalHeight: itemCount * rowHeight,
    offsetY: startIndex * rowHeight,
  };
}
