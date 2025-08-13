import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-sky-900 p-6">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-lg text-center text-white">
        <h1 className="text-4xl font-bold mb-8 drop-shadow-lg">
          💱 Currency Feature Hub
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/redesign"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/50 font-semibold"
          >
            🎨 Redesign Currency
          </Link>

          <Link
            href="/quiz"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-green-500/50 font-semibold"
          >
            🧠 Play Currency Quiz
          </Link>

          <Link
            href="/currencycompare"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 font-semibold"
          >
            💹 Currency Converter
          </Link>
          <Link
            href="/inflation-analysis"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 font-semibold"
          >
            💹 Currency Inflation
          </Link>
        </div>
      </div>
    </main>
  );
}
