"use client";

import { useState } from "react";
import { api } from "~/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const FIELD_TYPES = [
  { type: "short_text",   label: "Short Text",    icon: "📝", group: "text" },
  { type: "long_text",    label: "Long Text",     icon: "📄", group: "text" },
  { type: "email",        label: "Email",         icon: "📧", group: "text" },
  { type: "number",       label: "Number",        icon: "🔢", group: "text" },
  { type: "single_select",label: "Single Select", icon: "🔘", group: "select" },
  { type: "multi_select", label: "Multi Select",  icon: "☑️", group: "select" },
  { type: "dropdown",     label: "Dropdown",      icon: "🔽", group: "select" },
  { type: "checkbox",     label: "Checkbox",      icon: "✅", group: "special" },
  { type: "date",         label: "Date",          icon: "📅", group: "special" },
  { type: "rating",       label: "Rating",        icon: "⭐", group: "special" },
];

const GROUP_STYLES: Record<string, string> = {
  text:   "border-l-2 border-blue-500/60 hover:bg-blue-500/10",
  select: "border-l-2 border-purple-500/60 hover:bg-purple-500/10",
  special:"border-l-2 border-amber-500/60 hover:bg-amber-500/10",
};

const BADGE_STYLES: Record<string, string> = {
  text:   "bg-blue-500/15 text-blue-400",
  select: "bg-purple-500/15 text-purple-400",
  special:"bg-amber-500/15 text-amber-400",
};

function getGroup(type: string) {
  return FIELD_TYPES.find((f) => f.type === type)?.group ?? "text";
}

export function FormBuilder({ form }: { form: any }) {
  const utils = api.useUtils();

  const { data: fields = [], isLoading } = api.fields.listByFormId.useQuery({ formId: form.id });
  const upsertMutation = api.fields.upsertFields.useMutation({
    onSuccess: () => {
      utils.fields.listByFormId.invalidate({ formId: form.id });
      toast.success("Fields saved");
    },
    onError: () => toast.error("Failed to save fields"),
  });

  const [localFields, setLocalFields] = useState<any[] | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!isLoading && localFields === null) {
    setLocalFields(fields);
  }

  const addField = (type: string) => {
    const hasOptions = ["single_select", "multi_select", "dropdown"].includes(type);
    setLocalFields((prev) => [
      ...(prev || []),
      {
        id: crypto.randomUUID(),
        type,
        label: "",
        isRequired: false,
        order: (prev || []).length + 1,
        options: hasOptions ? ["", ""] : undefined,
      },
    ]);
    // Auto-focus the new field
    setActiveIdx((localFields?.length ?? 0));
  };

  const updateField = (index: number, updates: any) => {
    setLocalFields((prev) => {
      const next = [...(prev || [])];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const removeField = (index: number) => {
    setLocalFields((prev) => {
      const next = [...(prev || [])];
      next.splice(index, 1);
      return next;
    });
    setActiveIdx(null);
  };

  const handleSave = () => {
    upsertMutation.mutate({
      formId: form.id,
      fields: (localFields || []).map((f, i) => ({
        ...f,
        id: f.id.length > 30 ? undefined : f.id,
        order: i + 1,
        options: f.options ? JSON.stringify(f.options) : undefined,
      })),
    });
  };

  if (isLoading || localFields === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
        Loading builder...
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-56 bg-[#0d0d0d] border-r border-white/8 flex flex-col fixed left-0 top-14 h-[calc(100vh-56px)] overflow-y-auto z-10">
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Field Types</p>
        </div>

        <div className="px-3 pb-2">
          <p className="text-[10px] text-white/25 px-1 mb-1">Text</p>
          {FIELD_TYPES.filter((f) => f.group === "text").map((f) => (
            <button
              key={f.type}
              onClick={() => addField(f.type)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white transition-all mb-0.5 flex items-center gap-2.5 ${GROUP_STYLES.text}`}
            >
              <span className="text-base leading-none">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        <div className="px-3 pb-2">
          <p className="text-[10px] text-white/25 px-1 mb-1 mt-2">Select</p>
          {FIELD_TYPES.filter((f) => f.group === "select").map((f) => (
            <button
              key={f.type}
              onClick={() => addField(f.type)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white transition-all mb-0.5 flex items-center gap-2.5 ${GROUP_STYLES.select}`}
            >
              <span className="text-base leading-none">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        <div className="px-3 pb-4">
          <p className="text-[10px] text-white/25 px-1 mb-1 mt-2">Special</p>
          {FIELD_TYPES.filter((f) => f.group === "special").map((f) => (
            <button
              key={f.type}
              onClick={() => addField(f.type)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white transition-all mb-0.5 flex items-center gap-2.5 ${GROUP_STYLES.special}`}
            >
              <span className="text-base leading-none">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 ml-56 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-8 py-8 pb-28">
          <div className="max-w-2xl mx-auto">
            {localFields.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                <p className="text-white/20 text-sm mb-1">← Pick a field type to get started</p>
                <p className="text-white/10 text-xs">Your fields will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {localFields.map((field, idx) => {
                  const group = getGroup(field.type);
                  const isActive = activeIdx === idx;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`bg-[#111] rounded-xl p-5 relative group cursor-pointer transition-all border ${
                        isActive
                          ? "border-purple-500/50 ring-1 ring-purple-500/20 shadow-[0_0_0_1px_rgba(168,85,247,0.1)]"
                          : "border-white/8 hover:border-white/15"
                      }`}
                    >
                      {/* Drag handle */}
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/15 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity select-none">
                        ⠿
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeField(idx); }}
                        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all text-xs"
                      >
                        ✕
                      </button>

                      {/* Type badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${BADGE_STYLES[group]}`}>
                          {field.type.replace("_", " ")}
                        </span>
                        <span className="text-white/20 text-xs">Field {idx + 1}</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-white/40 block mb-1">Label</label>
                          <input
                            type="text"
                            value={field.label}
                            placeholder="Enter field label"
                            onChange={(e) => updateField(idx, { label: e.target.value })}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/20"
                          />
                        </div>

                        {field.type !== "checkbox" && (
                          <div>
                            <label className="text-xs text-white/40 block mb-1">Description <span className="text-white/20">(optional)</span></label>
                            <input
                              type="text"
                              value={field.description || ""}
                              onChange={(e) => updateField(idx, { description: e.target.value })}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/20"
                            />
                          </div>
                        )}

                        {["checkbox", "date", "rating"].includes(field.type) && (
                          <p className="text-xs text-white/25 bg-white/3 border border-white/5 px-3 py-2 rounded-lg italic">
                            {field.type === "checkbox" && "Renders as a single confirmation toggle."}
                            {field.type === "date" && "Renders a date picker automatically."}
                            {field.type === "rating" && "Renders a 1–5 star rating automatically."}
                          </p>
                        )}

                        {["single_select", "multi_select", "dropdown"].includes(field.type) && (
                          <OptionsEditor field={field} idx={idx} updateField={updateField} />
                        )}

                        <label
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 cursor-pointer mt-1 w-fit"
                        >
                          <input
                            type="checkbox"
                            checked={field.isRequired}
                            onChange={(e) => updateField(idx, { isRequired: e.target.checked })}
                            className="w-3.5 h-3.5 rounded accent-purple-500 bg-black border-white/20"
                          />
                          <span className="text-xs text-white/50">Required</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sticky save bar */}
        <div className="fixed bottom-0 left-56 right-0 bg-[#0a0a0a]/90 backdrop-blur border-t border-white/8 px-8 py-3 flex items-center justify-between z-10">
          <p className="text-xs text-white/30">
            {localFields.length} field{localFields.length !== 1 ? "s" : ""}
            {upsertMutation.isSuccess && <span className="text-green-400 ml-2">✓ Saved</span>}
          </p>
          <button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            {upsertMutation.isPending ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Saving...
              </>
            ) : "Save Fields"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OptionsEditor({ field, idx, updateField }: { field: any; idx: number; updateField: any }) {
  let opts: string[] = [];
  if (Array.isArray(field.options)) {
    opts = field.options;
  } else if (typeof field.options === "string") {
    try { opts = JSON.parse(field.options); } catch { opts = [field.options]; }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <label className="text-xs text-white/40 block mb-2">Options</label>
      <div className="space-y-1.5">
        {opts.map((opt, optIdx) => (
          <div key={optIdx} className="flex gap-2 items-center">
            <span className="text-white/20 text-xs w-4 text-right flex-shrink-0">{optIdx + 1}</span>
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const next = [...opts];
                next[optIdx] = e.target.value;
                updateField(idx, { options: next });
              }}
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500/50 transition-colors placeholder:text-white/20"
              placeholder={`Option ${optIdx + 1}`}
            />
            <button
              onClick={() => updateField(idx, { options: opts.filter((_, i) => i !== optIdx) })}
              className="w-7 h-7 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all text-xs"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={() => updateField(idx, { options: [...opts, ""] })}
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 px-2 py-1.5 hover:bg-purple-500/10 rounded-lg transition-colors mt-1"
        >
          + Add option
        </button>
      </div>
    </div>
  );
}