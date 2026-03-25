import { useState, useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';

interface UseVirtualScrollOptions {
  itemCount: number;
  rowHeight: number;
  containerRef: RefObject<HTMLDivElement | null>;
  buffer?: number;
}

export function useVirtualScroll({ itemCount, rowHeight, containerRef, buffer = 5 }: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const rafId = useRef(0);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    // Use rAF to batch scroll updates for smooth performance
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setScrollTop(container.scrollTop);
    });
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    setContainerHeight(container.clientHeight);
    container.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [containerRef, handleScroll]);

  const totalHeight = itemCount * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const visibleCount = containerHeight > 0 ? Math.ceil(containerHeight / rowHeight) : 20;
  const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + 2 * buffer);

  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY: startIndex * rowHeight,
  };
}
