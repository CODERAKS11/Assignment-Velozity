import { useCollaboration } from '../../context/CollaborationContext';
import { Avatar } from './Avatar';
import type { User } from '../../types';

interface ActiveUsersStackProps {
  taskId: string;
  assignee?: User | null;
}

export function ActiveUsersStack({ taskId, assignee }: ActiveUsersStackProps) {
  const { onlineUsers } = useCollaboration();
  const activeUsers = onlineUsers.filter(p => p.taskId === taskId);

  if (activeUsers.length === 0 && !assignee) return null;

  const MAX_DISPLAY = 2;
  const displayUsers = activeUsers.slice(0, MAX_DISPLAY);
  const excess = activeUsers.length - MAX_DISPLAY;

  return (
    <div className="flex items-center -space-x-2">
      {/* Assignee is statically rendered as they own the task */}
      {assignee && !activeUsers.find(p => p.user.id === assignee.id) && (
        <div className="relative inline-block ring-2 ring-app-surface rounded-full bg-app-surface z-0" title={`Assignee: ${assignee.name}`}>
          <Avatar name={assignee.name} />
        </div>
      )}
      
      {/* Invisible slots for the global avatar layer to target */}
      {displayUsers.map(p => (
        <div 
          key={p.user.id} 
          id={`avatar-slot-${p.user.id}`}
          className="w-8 h-8 rounded-full ring-2 ring-transparent invisible relative z-10"
          title={`Viewing: ${p.user.name}`}
        />
      ))}

      {/* Overflow bubble */}
      {excess > 0 && (
        <div className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-app-surface ring-2 ring-app-surface z-20 text-xs font-semibold text-app-text-secondary shadow-sm border border-app-border">
          +{excess}
          
          {/* Render the excess user slots absolutely positioned inside the bubble 
              so the global avatars fly precisely into the +N badge */}
          {activeUsers.slice(MAX_DISPLAY).map(p => (
            <div 
              key={p.user.id} 
              id={`avatar-slot-${p.user.id}`} 
              className="absolute inset-0 w-8 h-8 opacity-0 pointer-events-none" 
            />
          ))}
        </div>
      )}
    </div>
  );
}
