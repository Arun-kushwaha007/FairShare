import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Note: This expects a 'todos' table to exist in your Supabase project.
  const { data: todos, error } = await supabase.from('todos').select();

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Supabase Connection Error</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Success</h1>
      <p className="mb-4 text-gray-600">Successfully connected to: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      
      <h2 className="text-xl font-semibold mb-2">Todos:</h2>
      {todos && todos.length > 0 ? (
        <ul className="list-disc pl-5">
          {todos.map((todo: any) => (
            <li key={todo.id}>{todo.name}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No todos found or 'todos' table is empty.</p>
      )}
    </div>
  );
}
