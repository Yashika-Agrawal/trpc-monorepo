import Link from "next/link";
import { api } from "~/trpc/server";

export default async function DashboardPage() {
  const forms = await api.forms.list.query();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dashboard Nav */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10">
        <Link href="/" className="font-bold text-xl tracking-tighter bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          TypeBuilder Dashboard
        </Link>
        <Link href="/dashboard/forms/new" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + New Form
        </Link>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Forms</h1>

        {forms.length === 0 ? (
          <div className="text-center border border-dashed border-white/20 rounded-2xl py-20 bg-white/5">
            <h2 className="text-xl mb-2 text-gray-300">You don't have any forms yet.</h2>
            <Link href="/dashboard/forms/new" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
              Create your first form
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {forms.map(form => (
              <div key={form.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{form.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase ${
                    form.visibility === 'public' ? 'bg-green-500/20 text-green-400' :
                    form.visibility === 'unlisted' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {form.visibility}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-2">
                  {form.description || "No description"}
                </p>
                
                <div className="flex gap-2 mt-auto">
                  <Link href={`/dashboard/forms/${form.id}/edit`} className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-sm transition-colors">
                    Edit
                  </Link>
                  <Link href={`/dashboard/forms/${form.id}/responses`} className="flex-1 bg-white/10 hover:bg-white/20 text-center py-2 rounded-lg text-sm transition-colors">
                    Responses
                  </Link>
                </div>
                {(form.visibility === 'public' || form.visibility === 'unlisted') && (
                  <Link href={`/f/${form.slug}`} target="_blank" className="mt-2 text-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    View Public Form ↗
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
