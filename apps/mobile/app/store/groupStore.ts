import { create } from 'zustand';
import { GroupDto } from '@fairshare/shared-types';

type GroupState = {
  groups: GroupDto[];
  selectedGroupId: string | null;
  setGroups: (groups: GroupDto[]) => void;
  setSelectedGroup: (groupId: string | null) => void;
};

export const useGroupStore = create<GroupState>((set) => ({
  groups: [],
  selectedGroupId: null,
  setGroups: (groups) => set({ groups }),
  setSelectedGroup: (groupId) => set({ selectedGroupId: groupId }),
}));
