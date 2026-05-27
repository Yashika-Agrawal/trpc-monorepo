import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
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

      <section className="pt-20 pb-20 px-6 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
          No hidden fees. Start for free, upgrade when you need more power.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Hobby</h3>
            <div className="text-4xl font-extrabold mb-6">$0<span className="text-xl text-gray-500 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-gray-300">
              <li className="flex items-center gap-2"><span>✓</span> 3 Forms</li>
              <li className="flex items-center gap-2"><span>✓</span> 100 Responses/mo</li>
              <li className="flex items-center gap-2"><span>✓</span> Standard Themes</li>
            </ul>
            <Link href="/dashboard" className="block text-center bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-colors">
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-900/50 to-black border border-purple-500/50 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-purple-300">Pro</h3>
            <div className="text-4xl font-extrabold mb-6">$29<span className="text-xl text-purple-500/50 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-gray-200">
              <li className="flex items-center gap-2 text-purple-300"><span>✓</span> Unlimited Forms</li>
              <li className="flex items-center gap-2 text-purple-300"><span>✓</span> 10,000 Responses/mo</li>
              <li className="flex items-center gap-2 text-purple-300"><span>✓</span> Custom Themes</li>
              <li className="flex items-center gap-2 text-purple-300"><span>✓</span> Advanced Analytics</li>
            </ul>
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              Subscribe Now
            </button>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <div className="text-4xl font-extrabold mb-6">Custom</div>
            <ul className="space-y-4 mb-8 flex-1 text-gray-300">
              <li className="flex items-center gap-2"><span>✓</span> Unlimited Everything</li>
              <li className="flex items-center gap-2"><span>✓</span> SLA Guarantee</li>
              <li className="flex items-center gap-2"><span>✓</span> Custom Domain</li>
            </ul>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
