import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-amber-50 to-yellow-100">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-6xl font-bold text-center text-amber-800">Kudu</h1>

        <Link
          href="/dashboard"
          className="rounded-full border border-amber-300 transition-colors flex items-center justify-center bg-amber-400 text-amber-900 gap-2 hover:bg-amber-500 hover:border-amber-400 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 shadow-md hover:shadow-lg"
        >
          Get Started
        </Link>
      </main>
    </div>
  );
}
