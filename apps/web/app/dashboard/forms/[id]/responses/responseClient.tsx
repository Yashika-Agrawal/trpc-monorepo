"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

type Answer = {
  fieldId: string;
  value: string;
  label: string;
  type: string;
};

type Response = {
  id: string;
  respondentEmail: string | null;
  submittedAt: Date | string;
  answers: Answer[];
};

type Field = {
  id: string;
  label: string;
  type: string;
};

function formatValue(value: string, type: string): string {
  if (!value) return "—";
  if (type === "multi_select") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join(", ") : value;
    } catch { return value; }
  }
  if (type === "rating") return "★".repeat(Number(value)) + "☆".repeat(5 - Number(value));
  if (type === "checkbox") return value === "true" ? "✓ Yes" : "✗ No";
  return value;
}

function exportCSV(responses: Response[], fields: Field[], formTitle: string) {
  const headers = ["Submission ID", "Email", "Submitted At", ...fields.map(f => f.label)];

  const rows = responses.map(r => {
    const answerMap = Object.fromEntries(r.answers.map(a => [a.fieldId, a.value]));
    return [
      r.id.split("-")[0],
      r.respondentEmail ?? "Anonymous",
      new Date(r.submittedAt).toISOString(),
      ...fields.map(f => {
        const val = answerMap[f.id] ?? "";
        if (f.type === "multi_select") {
          try { return JSON.parse(val).join("; "); } catch { return val; }
        }
        return val;
      }),
    ];
  });

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${formTitle.replace(/\s+/g, "_")}_responses.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ResponsesClient({
  responses,
  fields,
  formTitle,
}: {
  responses: Response[];
  fields: Field[];
  formTitle: string;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white/60">
          {responses.length} submission{responses.length !== 1 ? "s" : ""}
        </h2>
        {responses.length > 0 && (
          <button
            onClick={() => exportCSV(responses, fields, formTitle)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
          <p className="text-white/20 text-sm">No responses yet.</p>
          <p className="text-white/10 text-xs mt-1">Share your form link to start collecting.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {responses.map((res) => {
            const isOpen = expandedId === res.id;
            return (
              <div
                key={res.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isOpen ? "border-purple-500/30 bg-[#0f0f14]" : "border-white/8 bg-[#111] hover:border-white/15"
                }`}
              >
                {/* Row header — always visible */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : res.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded">
                      #{res.id.split("-")[0]}
                    </span>
                    <span className="text-sm text-white/70">
                      {res.respondentEmail ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-white/30">
                      {res.answers.length} answer{res.answers.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/30">
                      {formatDistanceToNow(new Date(res.submittedAt), { addSuffix: true })}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded answers */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-white/8">
                    <div className="pt-4 grid gap-3">
                      {res.answers.length === 0 ? (
                        <p className="text-xs text-white/20 italic">No answers recorded.</p>
                      ) : (
                        res.answers.map((ans) => (
                          <div key={ans.fieldId} className="flex gap-4">
                            <div className="w-1/3">
                              <p className="text-xs text-white/40 leading-relaxed">{ans.label}</p>
                              <p className="text-[10px] text-white/20 uppercase font-mono mt-0.5">
                                {ans.type.replace("_", " ")}
                              </p>
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${
                                ans.value
                                  ? "text-white/80"
                                  : "text-white/20 italic"
                              }`}>
                                {formatValue(ans.value, ans.type)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}