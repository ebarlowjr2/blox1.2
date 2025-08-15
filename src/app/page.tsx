export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center">Welcome to B.L.O.X.</h1>
      <p className="mt-4 text-lg text-gray-600 text-center max-w-xl">
        B.L.O.X. (Barlow Logic Operations Xecutive) is your intelligent business automation agent.
      </p>
      <a
        href="/dashboard"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </a>
    </main>
  );
}