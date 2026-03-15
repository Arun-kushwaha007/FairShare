'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';

function getRealtimeOrigin(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
  try {
    const url = new URL(base);
    return `${url.protocol}//${url.host}`;
  } catch {
    return base.replace(/\\/api\\/v1.*$/, '');
  }
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const socketRef = useRef<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setToken(null);
      return;
    }

    const loadToken = async () => {
      const res = await fetch('/api/auth/token', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as { token?: string | null };
      setToken(data.token ?? null);
    };

    void loadToken();
  }, [user]);

  useEffect(() => {
    if (!token || !user) return;

    const socket = io(getRealtimeOrigin(), {
      transports: ['websocket'],
      auth: { token },
    });

    socketRef.current = socket;

    const refresh = () => router.refresh();
    ['expense_created', 'settlement_created', 'group_member_joined'].forEach((event) => {
      socket.on(event, refresh);
    });

    return () => {
      ['expense_created', 'settlement_created', 'group_member_joined'].forEach((event) => {
        socket.off(event, refresh);
      });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user, router]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const match = pathname.match(/\\/dashboard\\/groups\\/([^/]+)/);
    const groupId = match ? match[1] : null;

    if (groupId && joinedGroup !== groupId) {
      if (joinedGroup) {
        socket.emit('leave_group', { groupId: joinedGroup });
      }
      socket.emit('join_group', { groupId });
      setJoinedGroup(groupId);
    }

    if (!groupId && joinedGroup) {
      socket.emit('leave_group', { groupId: joinedGroup });
      setJoinedGroup(null);
    }
  }, [pathname, joinedGroup]);

  return <>{children}</>;
}
