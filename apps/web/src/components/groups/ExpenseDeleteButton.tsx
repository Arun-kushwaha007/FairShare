'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteExpenseAction } from '../../lib/actions';
import { useToast } from '../ui/Toaster';

type ExpenseDeleteButtonProps = {
  expenseId: string;
  className?: string;
  onDeleted?: () => void;
  compact?: boolean;
};

export function ExpenseDeleteButton({ expenseId, className, onDeleted, compact = false }: ExpenseDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (deleting) {
      return;
    }

    const confirmed = window.confirm('Delete this expense? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteExpenseAction(expenseId);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast('Expense deleted');
      router.refresh();
      onDeleted?.();
    } catch (error) {
      toast((error as Error).message || 'Failed to delete expense', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleDelete()}
      disabled={deleting}
      className={
        className ??
        [
          'rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/15',
          compact ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm',
          'font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 inline-flex items-center justify-center gap-2',
        ].join(' ')
      }
      title="Delete expense"
    >
      <Trash2 className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
