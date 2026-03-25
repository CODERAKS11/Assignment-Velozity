import { useCollaboration } from '../../context/CollaborationContext';
import { Avatar } from './Avatar';

export function GlobalPresence() {
  const { onlineUsers } = useCollaboration();
  
  if (onlineUsers.length === 0) return null;

  const maxDisplay = 4;
  const displayUsers = onlineUsers.slice(0, maxDisplay);
  const excessCount = onlineUsers.length - maxDisplay;

  return (
    <div className="flex items-center gap-3 bg-app-bg-secondary px-3 py-1.5 rounded-full shadow-sm border border-app-border">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        </span>
        <span className="text-[13px] font-medium text-app-text-secondary">{onlineUsers.length} people viewing this board</span>
      </div>
      
      <div className="flex -space-x-2">
        {displayUsers.map(p => (
          <div key={p.user.id} className="relative inline-block ring-2 ring-app-bg-secondary rounded-full transition-transform hover:-translate-y-1 z-10 hover:z-20" title={p.user.name}>
            <Avatar className="w-6 h-6 text-[10px]" name={p.user.name} />
          </div>
        ))}
        {excessCount > 0 && (
          <div className="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-app-surface ring-2 ring-app-bg-secondary z-0 text-[10px] font-medium text-app-text-secondary shadow-sm border border-app-border">
            +{excessCount}
          </div>
        )}
      </div>
    </div>
  );
}
