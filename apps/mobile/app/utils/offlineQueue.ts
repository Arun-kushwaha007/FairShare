import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

type OfflineRequest = {
  id: string;
  method: 'POST';
  url: string;
  data: unknown;
};

const STORAGE_KEY = 'fairshare_offline_queue';

class OfflineQueue {
  private initialized = false;
  private flushing = false;

  async enqueue(req: OfflineRequest): Promise<void> {
    const queue = await this.readQueue();
    queue.push(req);
    await this.writeQueue(queue);
  }

  async start(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        void this.flush();
      }
    });

    const state = await NetInfo.fetch();
    if (state.isConnected) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.flushing) {
      return;
    }
    this.flushing = true;

    try {
      const queue = await this.readQueue();
      if (queue.length === 0) {
        return;
      }

      const remaining: OfflineRequest[] = [];
      for (const item of queue) {
        try {
          await api.request({
            method: item.method,
            url: item.url,
            data: item.data,
            headers: { 'x-offline-retry': '1' },
          });
        } catch {
          remaining.push(item);
        }
      }

      await this.writeQueue(remaining);
    } finally {
      this.flushing = false;
    }
  }

  private async readQueue(): Promise<OfflineRequest[]> {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw) as OfflineRequest[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private async writeQueue(queue: OfflineRequest[]): Promise<void> {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(queue));
  }
}

export const offlineQueue = new OfflineQueue();
