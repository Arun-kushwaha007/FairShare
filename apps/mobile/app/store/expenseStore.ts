import { create } from 'zustand';
import { ExpenseDto } from '@fairshare/shared-types';

type ExpenseState = {
  expensesByGroup: Record<string, ExpenseDto[]>;
  setExpenses: (groupId: string, expenses: ExpenseDto[]) => void;
};

export const useExpenseStore = create<ExpenseState>((set) => ({
  expensesByGroup: {},
  setExpenses: (groupId, expenses) =>
    set((state) => ({
      expensesByGroup: {
        ...state.expensesByGroup,
        [groupId]: expenses,
      },
    })),
}));
