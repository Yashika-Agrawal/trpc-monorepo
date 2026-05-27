"use client";

import { useState } from "react";
import { api } from "~/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const THEMES = [
  { value: "default", label: "Default" },
  { value: "tech", label: "Tech" },
  { value: "anime", label: "Anime" },
  { value: "minimal", label: "Minimal" },
];

const VISIBILITY = [
  { value: "unpublished", label: "Unpublished", dot: "bg-red-500",   pill: "bg-red-500/10 text-red-400 border-red-500/30" },
  { value: "unlisted",    label: "Unlisted",    dot: "bg-yellow-400", pill: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  { value: "public",      label: "Public",      dot: "bg-green-400",  pill: "bg-green-500/10 text-green-400 border-green-500/30" },
];

export function FormPublishToggle({ form }: { form: any }) {
  const router = useRouter();
  const [visibility, setVisibility] = useState(form.visibility ?? "unpublished");
  const [theme, setTheme] = useState(form.theme ?? "default");
  const [themeOpen, setThemeOpen] = useState(false);

  const updateMutation = api.forms.update.useMutation({
    onSuccess: () => {
      toast.success("Form updated");
      router.refresh();
    },
    onError: () => toast.error("Failed to update form"),
  });

  const handleVisibility = () => {
    const order = ["unpublished", "unlisted", "public"];
    const next = order[(order.indexOf(visibility) + 1) % order.length];
    setVisibility(next);
    updateMutation.mutate({ id: form.id, visibility: next });
  };

  const handleTheme = (val: string) => {
    setTheme(val);
    setThemeOpen(false);
    updateMutation.mutate({ id: form.id, theme: val });
  };

  const vis = VISIBILITY.find((v) => v.value === visibility) ?? VISIBILITY[0];

  return (
    <div className="flex items-center gap-3">
      {/* Theme picker */}
      <div className="relative">
        <button
          onClick={() => setThemeOpen((o) => !o)}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-white/80"
        >
          <span>🎨</span>
          <span>{THEMES.find((t) => t.value === theme)?.label ?? "Theme"}</span>
          <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {themeOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTheme(t.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                  theme === t.value ? "text-purple-400 bg-purple-500/10" : "text-white/70"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visibility pill — click to cycle */}
      <button
        onClick={handleVisibility}
        disabled={updateMutation.isPending}
        className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${vis.pill}`}
        title="Click to cycle: Unpublished → Unlisted → Public"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${vis.dot} ${visibility === "public" ? "animate-pulse" : ""}`} />
        {vis.label}
        {updateMutation.isPending && (
          <svg className="w-3 h-3 animate-spin ml-1 opacity-50" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
        )}
      </button>

      {/* Preview link */}
      <a
        href={`/f/${form.slug}`}
        target="_blank"
        className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-purple-500/10"
      >
        Preview
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}