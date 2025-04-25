import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-primary">Welcome to Swifin Dashboard</h1>
        <p className="mt-4">This is your modern, Swifin-branded dashboard starter built with Next.js and Tailwind CSS.</p>
      </main>
    </div>
  );
}