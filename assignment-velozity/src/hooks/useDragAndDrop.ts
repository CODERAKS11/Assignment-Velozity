import { useEffect, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import type { Status } from '../types';

export function useDragAndDrop(cardRef: React.RefObject<HTMLDivElement | null>, taskId: string, currentStatus: Status) {
  const { dispatch } = useTaskContext();
  const draggingState = useRef<{
    isDragging: boolean;
    clone: HTMLElement | null;
    placeholder: HTMLElement | null;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    highlightedColumn: HTMLElement | null;
    originalColumnBg: string;
  }>({
    isDragging: false,
    clone: null,
    placeholder: null,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
    highlightedColumn: null,
    originalColumnBg: '',
  });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const clearHighlight = () => {
      const state = draggingState.current;
      if (state.highlightedColumn) {
        state.highlightedColumn.style.backgroundColor = state.originalColumnBg;
        state.highlightedColumn.style.boxShadow = '';
        state.highlightedColumn = null;
        state.originalColumnBg = '';
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // Only handle primary button (left click or touch)
      if (e.button !== 0) return;
      
      const rect = card.getBoundingClientRect();
      const state = draggingState.current;
      
      state.isDragging = true;
      state.offsetX = e.clientX - rect.left;
      state.offsetY = e.clientY - rect.top;
      state.startX = rect.left;
      state.startY = rect.top;
      
      // Create clone that follows cursor
      const clone = card.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.opacity = '0.85';
      clone.style.boxShadow = '0 12px 28px -4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)';
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '1000';
      clone.style.margin = '0';
      clone.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      clone.style.transform = 'scale(1.03) rotate(1.5deg)';
      clone.style.border = '1px solid #3f3f46';
      clone.style.backgroundColor = '#21222A'; // Matches the custom card color
      document.body.appendChild(clone);
      state.clone = clone;
      
      // Create placeholder at original position with matching height
      const placeholder = document.createElement('div');
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.border = '2px dashed #94a3b8';
      placeholder.style.borderRadius = '0.75rem';
      placeholder.style.backgroundColor = '#f1f5f9';
      placeholder.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(148,163,184,0.06) 8px, rgba(148,163,184,0.06) 16px)';
      placeholder.style.margin = window.getComputedStyle(card).margin;
      placeholder.style.transition = 'opacity 0.2s ease';
      placeholder.style.opacity = '0';
      card.parentNode?.insertBefore(placeholder, card);
      // Fade in the placeholder
      requestAnimationFrame(() => { placeholder.style.opacity = '1'; });
      state.placeholder = placeholder;
      
      card.style.display = 'none';
      
      card.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const state = draggingState.current;
      if (!state.isDragging || !state.clone) return;
      
      state.clone.style.left = `${e.clientX - state.offsetX}px`;
      state.clone.style.top = `${e.clientY - state.offsetY}px`;

      // Find which column the cursor is over
      state.clone.style.display = 'none';
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      state.clone.style.display = '';
      
      const columnEl = elements.find(el => el.hasAttribute('data-column-status')) as HTMLElement | undefined;
      
      // Clear previous highlight if we left that column
      if (state.highlightedColumn && state.highlightedColumn !== columnEl) {
        clearHighlight();
      }
      
      // Apply highlight to current column (only if different from source)
      if (columnEl && columnEl !== state.highlightedColumn) {
        const colStatus = columnEl.getAttribute('data-column-status');
        if (colStatus !== currentStatus) {
          state.originalColumnBg = columnEl.style.backgroundColor || '';
          state.highlightedColumn = columnEl;
          columnEl.style.backgroundColor = '#dbeafe';
          columnEl.style.boxShadow = 'inset 0 0 0 2px #93c5fd';
        }
      }
      
      // Clear highlight if hovering over the same column
      if (columnEl) {
        const colStatus = columnEl.getAttribute('data-column-status');
        if (colStatus === currentStatus && state.highlightedColumn === columnEl) {
          clearHighlight();
        }
      }
    };

    let cleanupDone = false;

    const cleanup = (animated = false) => {
      if (cleanupDone) return;
      cleanupDone = true;
      const state = draggingState.current;

      const removeClone = () => {
        if (state.clone && state.clone.parentNode) {
          state.clone.parentNode.removeChild(state.clone);
        }
        state.clone = null;
      };

      const removePlaceholder = () => {
        if (state.placeholder && state.placeholder.parentNode) {
          state.placeholder.parentNode.removeChild(state.placeholder);
        }
        state.placeholder = null;
      };

      clearHighlight();
      state.isDragging = false;

      if (!animated) {
        // Instant cleanup (valid drop or same-column)
        removeClone();
        removePlaceholder();
        card.style.display = '';
        card.style.opacity = '';
        card.style.transform = '';
        card.style.transition = '';
        cleanupDone = false;
        return;
      }

      // Animated cleanup: fade placeholder out, then show card with fade-in
      if (state.placeholder) {
        state.placeholder.style.transition = 'opacity 0.25s ease';
        state.placeholder.style.opacity = '0';
      }

      // After clone snap-back finishes, cross-fade to original card
      const finalize = () => {
        removeClone();
        // Show card with a smooth fade-in
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        // Force reflow so transition triggers
        void card.offsetHeight;
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        
        const onCardDone = () => {
          card.style.transition = '';
          card.style.transform = '';
          card.style.opacity = '';
          removePlaceholder();
          cleanupDone = false;
        };
        card.addEventListener('transitionend', onCardDone, { once: true });
        setTimeout(onCardDone, 300);
      };

      if (state.clone) {
        state.clone.addEventListener('transitionend', finalize, { once: true });
        setTimeout(finalize, 400); // Failsafe
      } else {
        finalize();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const state = draggingState.current;
      if (!state.isDragging) return;
      
      card.releasePointerCapture(e.pointerId);

      clearHighlight();
      
      // Find drop target
      if (state.clone) state.clone.style.display = 'none';
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      if (state.clone) state.clone.style.display = '';
      
      const columnEl = elements.find(el => el.hasAttribute('data-column-status'));
      
      if (columnEl) {
        const newStatus = columnEl.getAttribute('data-column-status') as Status;
        
        if (newStatus && newStatus !== currentStatus) {
          // Valid drop on a different column — update status
          dispatch({ type: 'UPDATE_STATUS', payload: { taskId, newStatus } });
          cleanup(false);
          return;
        }
        
        // Dropped on same column — just clean up quietly (no snap-back)
        cleanup(false);
        return;
      }

      // Dropped outside any column — snap back with smooth animation
      if (state.clone) {
        state.clone.style.transition = 'left 0.35s cubic-bezier(0.2, 0, 0, 1), top 0.35s cubic-bezier(0.2, 0, 0, 1), transform 0.35s ease, opacity 0.35s ease';
        state.clone.style.transform = 'scale(1)';
        state.clone.style.opacity = '1';
        state.clone.style.left = `${state.startX}px`;
        state.clone.style.top = `${state.startY}px`;
        
        cleanup(true);
      } else {
        cleanup(false);
      }
    };

    const onPointerCancel = () => cleanup(false);

    card.addEventListener('pointerdown', onPointerDown);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', onPointerCancel);

    return () => {
      card.removeEventListener('pointerdown', onPointerDown);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerup', onPointerUp);
      card.removeEventListener('pointercancel', onPointerCancel);
      cleanup(false);
    };
  }, [cardRef, taskId, currentStatus, dispatch]);
}
