import Link from "next/link";
import { api } from "~/trpc/server";

export default async function Home() {
  const { status } = await api.health.getHealth.query();
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="font-bold text-2xl tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          TypeBuilder
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/explore" className="hover:text-purple-400 transition-colors">Explore</Link>
          <Link href="/pricing" className="hover:text-purple-400 transition-colors">Pricing</Link>
          <Link href="/login" className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
          API Status: {status}
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-tight">
          Forms that feel <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">alive.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Create beautiful, dynamic forms in seconds. Share them anywhere, collect responses effortlessly, and analyze your data in real-time.
        </p>

        <div className="flex gap-4">
          <Link href="/dashboard" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105">
            Start Building Free
          </Link>
          <Link href="/explore" className="border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-md">
            View Templates
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Dynamic Logic" 
            desc="Show or hide fields based on previous answers. Keep your respondents engaged."
            icon="🧠"
          />
          <FeatureCard 
            title="Type-Safe APIs" 
            desc="Built on tRPC and Zod. Every form submission is strictly validated."
            icon="🛡️"
          />
          <FeatureCard 
            title="Beautiful Themes" 
            desc="From cyberpunk to minimal glassmorphism. Style it your way."
            icon="🎨"
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
