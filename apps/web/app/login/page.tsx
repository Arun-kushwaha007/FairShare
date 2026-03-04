export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-14">
      <h1 className="text-3xl font-bold">Login</h1>
      <form className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow">
        <input className="w-full rounded border border-slate-300 p-3" placeholder="Email" type="email" />
        <input className="w-full rounded border border-slate-300 p-3" placeholder="Password" type="password" />
        <button className="w-full rounded bg-brand p-3 font-semibold text-white" type="submit">Sign In</button>
      </form>
    </main>
  );
}
