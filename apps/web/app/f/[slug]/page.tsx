import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { PublicFormViewer } from "./PublicFormViewer";

export default async function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { form, fields } = await api.publicForms.getBySlug.query({ slug });
    
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 
        ${form.theme === 'anime' ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white' : 
          form.theme === 'tech' ? 'bg-slate-900 text-green-400 font-mono' : 
          'bg-gray-50 text-gray-900'}`}>
        <div className={`w-full max-w-2xl p-8 rounded-3xl shadow-2xl backdrop-blur-md
          ${form.theme === 'anime' ? 'bg-white/20 border border-white/30' : 
            form.theme === 'tech' ? 'bg-black border border-green-500/30' : 
            'bg-white border border-gray-100'}`}>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">{form.title}</h1>
            {form.description && <p className="text-opacity-80 text-lg">{form.description}</p>}
          </div>

          <PublicFormViewer form={form} fields={fields} />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
