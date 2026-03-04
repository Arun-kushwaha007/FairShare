export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-bold">Features</h1>
      <ul className="mt-6 list-disc space-y-3 pl-6 text-slate-700">
        <li>Group management with role-based membership</li>
        <li>Expense entry with detailed split modeling</li>
        <li>Live balances computed server-side</li>
        <li>Settlement and debt simplification</li>
        <li>Receipt upload via secure presigned URLs</li>
      </ul>
    </main>
  );
}
