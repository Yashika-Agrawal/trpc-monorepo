import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ResponsesClient } from "./responseClient";

export default async function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const form = await api.forms.getById.query({ id });
    const { responses, fields } = await api.responses.listByFormId.query({ formId: id });

    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="h-14 px-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-20">
          <div className="flex items-center gap-3 text-sm">
            <Link href="/dashboard" className="text-white/40 hover:text-white transition-colors">
              Dashboard
            </Link>
            <span className="text-white/20">/</span>
            <Link href={`/dashboard/forms/${form.id}/edit`} className="text-white/40 hover:text-white transition-colors truncate max-w-[160px]">
              {form.title}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white/80">Responses</span>
          </div>
          <Link
            href={`/dashboard/forms/${form.id}/edit`}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Edit Form
          </Link>
        </nav>

        <main className="p-8 max-w-6xl mx-auto w-full">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#111] border border-white/8 rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">Total responses</p>
              <p className="text-4xl font-bold">{responses.length}</p>
            </div>
            <div className="bg-[#111] border border-white/8 rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">Form status</p>
              <p className={`text-xl font-semibold capitalize ${
                form.visibility === "public" ? "text-green-400" :
                form.visibility === "unlisted" ? "text-yellow-400" :
                "text-white/40"
              }`}>
                {form.visibility}
              </p>
            </div>
            <div className="bg-[#111] border border-white/8 rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">Public link</p>
              <a
                href={`/f/${form.slug}`}
                target="_blank"
                className="text-purple-400 hover:text-purple-300 text-sm truncate block transition-colors"
              >
                /f/{form.slug} ↗
              </a>
            </div>
          </div>

          <ResponsesClient responses={responses} fields={fields} formTitle={form.title} />
        </main>
      </div>
    );
  } catch {
    return notFound();
  }
}