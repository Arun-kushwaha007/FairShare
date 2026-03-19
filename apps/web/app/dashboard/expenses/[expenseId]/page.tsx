import Link from 'next/link';
import { ExpenseDto } from '@fairshare/shared-types';
import { notFound } from 'next/navigation';

import { ExpenseDetailCard } from '../../../../src/components/groups';
import { DashboardLayout } from '../../../../src/components/layout';
import { backendFetch } from '../../../../src/lib/backend';
import { getPublicS3BaseUrl } from '../../../../src/lib/env';

interface ExpenseDetailPageProps {
  params: {
    expenseId: string;
  };
}

export default async function ExpenseDetailPage({ params }: ExpenseDetailPageProps) {
  try {
    const expense = await backendFetch<ExpenseDto>(`/expenses/${params.expenseId}`);
    const s3BaseUrl = getPublicS3BaseUrl();
    const receiptUrl = expense.receiptFileKey && s3BaseUrl ? `${s3BaseUrl.replace(/\/$/, '')}/${expense.receiptFileKey}` : null;

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Link
            href={`/dashboard/groups/${expense.groupId}`}
            className="inline-flex items-center rounded-xl border border-[var(--fs-border)] bg-[var(--fs-card)] px-4 py-2 text-sm font-bold text-[var(--fs-text-primary)] hover:border-[var(--fs-primary)]"
          >
            Back to group
          </Link>
          <ExpenseDetailCard expense={expense} receiptUrl={receiptUrl} />
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Failed to fetch expense details:', error);
    return notFound();
  }
}
