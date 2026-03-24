import { useEffect, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Status } from '../types';

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
  }>({
    isDragging: false,
    clone: null,
    placeholder: null,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0,
  });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

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
      
      // Create clone
      const clone = card.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.opacity = '0.85';
      clone.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '1000';
      clone.style.margin = '0';
      document.body.appendChild(clone);
      state.clone = clone;
      
      // Create placeholder
      const placeholder = document.createElement('div');
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      placeholder.style.border = '2px dashed #cbd5e1';
      placeholder.style.borderRadius = '0.375rem';
      placeholder.style.margin = window.getComputedStyle(card).margin;
      card.parentNode?.insertBefore(placeholder, card);
      state.placeholder = placeholder;
      
      card.style.display = 'none';
      
      card.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const state = draggingState.current;
      if (!state.isDragging || !state.clone) return;
      
      state.clone.style.left = `${e.clientX - state.offsetX}px`;
      state.clone.style.top = `${e.clientY - state.offsetY}px`;

      // Update drop zone highlights
      state.clone.style.display = 'none';
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      state.clone.style.display = '';
      
      const columnEl = elements.find(el => el.hasAttribute('data-column-status'));
      
      document.querySelectorAll('[data-column-status]').forEach(el => {
        el.classList.remove('bg-blue-50');
      });
      
      if (columnEl) {
        columnEl.classList.add('bg-blue-50');
      }
    };

    const cleanup = () => {
      const state = draggingState.current;
      if (state.clone && state.clone.parentNode) {
        state.clone.parentNode.removeChild(state.clone);
      }
      if (state.placeholder && state.placeholder.parentNode) {
        state.placeholder.parentNode.removeChild(state.placeholder);
      }
      state.isDragging = false;
      state.clone = null;
      state.placeholder = null;
      card.style.display = '';
    };

    const onPointerUp = (e: PointerEvent) => {
      const state = draggingState.current;
      if (!state.isDragging) return;
      
      card.releasePointerCapture(e.pointerId);

      document.querySelectorAll('[data-column-status]').forEach(el => {
        el.classList.remove('bg-blue-50');
      });
      
      // Find drop target
      if (state.clone) state.clone.style.display = 'none';
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      if (state.clone) state.clone.style.display = '';
      
      const columnEl = elements.find(el => el.hasAttribute('data-column-status'));
      let isValidDrop = false;
      
      if (columnEl) {
        const newStatus = columnEl.getAttribute('data-column-status') as Status;
        if (newStatus && newStatus !== currentStatus) {
          dispatch({ type: 'UPDATE_STATUS', payload: { taskId, newStatus } });
          isValidDrop = true;
        }
      }

      if (!isValidDrop && state.clone) {
        // Snap back animation
        state.clone.style.transition = 'all 0.3s ease';
        state.clone.style.left = `${state.startX}px`;
        state.clone.style.top = `${state.startY}px`;
        
        state.clone.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 350); // Failsafe
      } else {
        cleanup();
      }
    };

    card.addEventListener('pointerdown', onPointerDown);
    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerup', onPointerUp);
    card.addEventListener('pointercancel', cleanup);

    return () => {
      card.removeEventListener('pointerdown', onPointerDown);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerup', onPointerUp);
      card.removeEventListener('pointercancel', cleanup);
      cleanup();
    };
  }, [cardRef, taskId, currentStatus, dispatch]);
}
