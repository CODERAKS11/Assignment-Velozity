import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { USERS } from '../utils/seedData';
import { useTaskContext } from './TaskContext';

export interface Presence {
  user: User;
  taskId: string | null;
}

interface CollaborationContextType {
  onlineUsers: Presence[];
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState<Presence[]>([]);
  const { tasks } = useTaskContext();

  useEffect(() => {
    if (tasks.length === 0) return;

    // Initialize 2-4 random dummy online users
    const numUsers = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...USERS].sort(() => 0.5 - Math.random());
    // Current actual user is assumed to be USERS[0] to prevent self-collision
    const initialUsers = shuffled.filter(u => u.id !== USERS[0].id).slice(0, numUsers);

    const assignRandomTask = () => {
      if (Math.random() > 0.8) return null; // 20% just browsing the app
      // Increase collision chances by picking from a smaller subset of tasks 
      const poolSize = Math.min(tasks.length, 30);
      const randomTask = tasks[Math.floor(Math.random() * poolSize)];
      return randomTask.id;
    };

    setOnlineUsers(initialUsers.map(user => ({
      user,
      taskId: assignRandomTask()
    })));

    const intervalId = setInterval(() => {
      setOnlineUsers(current => 
        current.map(presence => {
          // ~30% chance a user navigates to a different task per tick
          if (Math.random() > 0.7) {
            return { ...presence, taskId: assignRandomTask() };
          }
          return presence;
        })
      );
    }, 6000); // Trigger every 6 seconds

    return () => clearInterval(intervalId);
  }, [tasks]);

  return (
    <CollaborationContext.Provider value={{ onlineUsers }}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}
