import { redirect } from 'next/navigation';

interface LegacyGroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LegacyGroupPage({ params }: LegacyGroupPageProps) {
  const { id } = await params;
  redirect(`/dashboard/groups/${id}`);
}
