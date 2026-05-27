import Link from "next/link";
import { api } from "~/trpc/server";
import { formatDistanceToNow } from "date-fns";

export default async function ExplorePage() {
  const forms = await api.publicForms.listExplore.query();

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <Link href="/" className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          TypeBuilder
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/explore" className="hover:text-purple-400 transition-colors">Explore</Link>
          <Link href="/dashboard" className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-all">
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="pt-12 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Explore Templates
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Discover public forms created by the community. Try them out or draw inspiration for your own.
          </p>
        </div>

        {forms.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            No public forms available right now. Be the first to publish one!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Link href={`/f/${form.slug}`} key={form.id} className="block group">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
                      {form.theme}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(form.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">
                    {form.description || "No description provided."}
                  </p>
                  <div className="text-sm font-medium text-purple-400 flex items-center">
                    Fill Form 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
