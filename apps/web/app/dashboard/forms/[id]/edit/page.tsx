import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { FormBuilder } from "./FormBuilder";
import { FormPublishToggle } from "./FormPublishToggle";

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const form = await api.forms.getById.query({ id });

    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <nav className="h-14 px-4 pl-72 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-white/30 text-sm">Forms</span>
            <span className="text-white/20">/</span>
            <span className="font-medium text-sm text-white truncate max-w-[200px]">{form.title}</span>
          </div>
          <FormPublishToggle form={form} />
        </nav>

        <main className="flex-1 flex overflow-hidden">
          <FormBuilder form={form} />
        </main>
      </div>
    );
  } catch {
    return notFound();
  }
}