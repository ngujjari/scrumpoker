import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Scrum Planning Poker</h1>
      <div className="space-x-4">
        <Link
          href="/teams"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Scrum Teams
        </Link>
        <Link
          href="/points"
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Story Points
        </Link>
      </div>
    </main>
  );
}