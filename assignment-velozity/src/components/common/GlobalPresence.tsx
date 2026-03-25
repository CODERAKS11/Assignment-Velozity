import { useCollaboration } from '../../context/CollaborationContext';
import { Avatar } from './Avatar';

export function GlobalPresence() {
  const { onlineUsers } = useCollaboration();
  
  if (onlineUsers.length === 0) return null;

  const maxDisplay = 4;
  const displayUsers = onlineUsers.slice(0, maxDisplay);
  const excessCount = onlineUsers.length - maxDisplay;

  return (
    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-semibold text-gray-600">{onlineUsers.length} people are viewing this board</span>
      </div>
      
      <div className="flex -space-x-2">
        {displayUsers.map(p => (
          <div key={p.user.id} className="relative inline-block ring-2 ring-white rounded-full bg-gray-50 transition-transform hover:-translate-y-1 z-10 hover:z-20" title={p.user.name}>
            <Avatar name={p.user.name} />
          </div>
        ))}
        {excessCount > 0 && (
          <div className="relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white z-0 text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
            +{excessCount}
          </div>
        )}
      </div>
    </div>
  );
}
