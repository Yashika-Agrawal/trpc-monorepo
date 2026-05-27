"use client";

import { useState } from "react";
import { api } from "~/trpc/client";
import { useRouter } from "next/navigation";

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const createMutation = api.forms.create.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/forms/${data.id}/edit`);
    },
    onError: (e) => {
      setErrorMsg(e.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, slug, description: "" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-6">Create New Form</h1>
        
        {errorMsg && <div className="mb-4 text-red-500 text-sm bg-red-500/10 p-3 rounded">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Form Title</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Auto generate slug
                if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }}
              className="w-full p-3 rounded-lg bg-black border border-white/20 focus:border-purple-500 outline-none"
              placeholder="e.g. Feedback Survey"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Custom URL Slug</label>
            <div className="flex bg-white/10 rounded-lg overflow-hidden border border-white/20">
              <span className="px-4 py-3 bg-white/5 text-gray-400 font-mono text-sm border-r border-white/10 flex items-center">
                typebuilder.com/f/
              </span>
              <input 
                required
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-transparent p-3 text-white focus:outline-none"
                placeholder="my-awesome-form"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold mt-4 transition-colors disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Form"}
          </button>
        </form>
      </div>
    </div>
  );
}
