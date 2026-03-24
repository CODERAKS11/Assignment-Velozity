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

  return (
    <div className="flex items-center -space-x-2">
      {assignee && !activeUsers.find(p => p.user.id === assignee.id) && (
        <div className="relative inline-block ring-2 ring-white rounded-full bg-white" title={`Assignee: ${assignee.name}`}>
          <Avatar name={assignee.name} />
        </div>
      )}
      {activeUsers.map(p => (
        <div 
          key={p.user.id} 
          className="relative inline-block ring-2 ring-blue-400 rounded-full z-10 transition-transform hover:-translate-y-1 hover:z-20 bg-white"
          title={`Viewing: ${p.user.name}`}
        >
          <Avatar name={p.user.name} />
          <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white translate-x-1/4 translate-y-1/4" />
        </div>
      ))}
    </div>
  );
}
