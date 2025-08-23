import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          AI-powered business automation,{' '}
          <span className="text-purple-200">uncompromised</span>
        </h1>
        <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          B.L.O.X. (Barlow Logic Operations Executive) gives you direct, 
          transparent access to intelligent business automation with no limits, 
          no surprises, and no operational lock-in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/signin"
            className="px-8 py-4 bg-white text-purple-700 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-colors shadow-lg"
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="px-8 py-4 bg-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-400 transition-colors border border-purple-400"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
