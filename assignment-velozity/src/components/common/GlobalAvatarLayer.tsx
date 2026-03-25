import { useEffect, useState } from 'react';
import { useCollaboration } from '../../context/CollaborationContext';
import { Avatar } from './Avatar';

interface TransformState {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  isAppearing?: boolean;
}

export function GlobalAvatarLayer() {
  const { onlineUsers } = useCollaboration();
  const [positions, setPositions] = useState<Record<string, TransformState>>({});

  useEffect(() => {
    let animationFrameId: number;

    const updatePositions = () => {
      setPositions(prev => {
        const newPositions: Record<string, TransformState> = {};
        
        onlineUsers.forEach(presence => {
          const userId = presence.user.id;
          const curr = prev[userId];
          
          // If they aren't looking at a task, hide them in place
          if (!presence.taskId) {
            newPositions[userId] = curr ? { ...curr, opacity: 0, scale: 0.5, isAppearing: false } : { x: 0, y: 0, opacity: 0, scale: 0.5, isAppearing: false };
            return;
          }

          const slotId = `avatar-slot-${userId}`;
          const slotEl = document.getElementById(slotId);
          
          if (slotEl) {
            // Task is in the DOM
            let isClipped = false;
            const rect = slotEl.getBoundingClientRect();
            
            // Check if it's clipped by the nearest scroll container (.overflow-y-auto, .overflow-auto)
            const scrollParent = slotEl.closest('.overflow-y-auto, .overflow-auto');
            if (scrollParent) {
              const parentRect = scrollParent.getBoundingClientRect();
              if (rect.bottom < parentRect.top || rect.top > parentRect.bottom || rect.right < parentRect.left || rect.left > parentRect.right) {
                isClipped = true;
              }
            }

            if (isClipped) {
              newPositions[userId] = curr ? { ...curr, opacity: 0, scale: 0.5, isAppearing: false } : { x: 0, y: 0, opacity: 0, scale: 0.5, isAppearing: false };
            } else {
              newPositions[userId] = {
                x: rect.left,
                y: rect.top,
                opacity: 1,
                scale: 1,
                isAppearing: !curr || curr.opacity === 0
              };
            }
          } else {
            // Task is virtualized out of the DOM (scrolled away)
            // Hide the avatar to prevent it from floating randomly
            newPositions[userId] = curr ? { ...curr, opacity: 0, scale: 0.5, isAppearing: false } : { x: 0, y: 0, opacity: 0, scale: 0.5, isAppearing: false };
          }
        });

        // Only update state if something actually moved to prevent unnecessary re-renders
        let hasChanges = Object.keys(newPositions).length !== Object.keys(prev).length;
        if (!hasChanges) {
          for (const userId of Object.keys(newPositions)) {
            const curr = prev[userId];
            const next = newPositions[userId];
            if (!curr || curr.x !== next.x || curr.y !== next.y || curr.opacity !== next.opacity || curr.scale !== next.scale || curr.isAppearing !== next.isAppearing) {
              hasChanges = true;
              break;
            }
          }
        }
        return hasChanges ? newPositions : prev;
      });
      
      // Continously poll positions to ensure avatars stick to cards during slow scrolls or resizes
      animationFrameId = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onlineUsers]);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {onlineUsers.map(presence => {
        const pos = positions[presence.user.id] || { x: 0, y: 0, opacity: 0, scale: 0.5, isAppearing: false };
        
        return (
          <div
            key={presence.user.id}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${pos.scale})`,
              opacity: pos.opacity,
              transitionProperty: pos.isAppearing ? 'opacity' : 'all',
              transitionDuration: '700ms',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div className="relative inline-block ring-2 ring-blue-400 rounded-full bg-white shadow-md">
              <Avatar name={presence.user.name} />
              <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white translate-x-1/4 translate-y-1/4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
