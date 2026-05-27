"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/client";

export function PublicFormViewer({ form, fields }: { form: any, fields: any[] }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submitMutation = api.responses.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => setErrorMsg(e.message),
  });

  const onSubmit = (data: any) => {
    // Transform form data to answers array
    const answers = fields.map(field => {
      let val = data[field.id];
      if (Array.isArray(val)) val = JSON.stringify(val);
      return {
        fieldId: field.id,
        value: val ? String(val) : "",
      };
    });

    submitMutation.mutate({
      formId: form.id,
      respondentEmail: data["_email"] || undefined,
      answers,
    });
  };

  if (submitted) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
        <p className="opacity-80 mb-8">Your response has been recorded.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            type="button"
            onClick={() => { setSubmitted(false); reset(); }} 
            className={`px-6 py-3 rounded-xl font-bold transition-all border ${form.theme === 'anime' ? 'border-pink-400/30 hover:bg-white/10 text-pink-100' : form.theme === 'tech' ? 'border-green-500/30 hover:bg-green-500/10 text-green-400' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}
          >
            Submit Another Response
          </button>
          
          <Link href="/" className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${form.theme === 'anime' ? 'bg-white text-pink-600 hover:scale-105' : form.theme === 'tech' ? 'bg-green-500 text-black hover:scale-105' : 'bg-black text-white hover:bg-gray-800'}`}>
            Create your own form
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = `w-full p-4 rounded-xl border bg-transparent transition-all outline-none focus:ring-2
    ${form.theme === 'anime' ? 'border-white/20 focus:border-white focus:ring-white/50 text-white placeholder:text-white/50' : 
      form.theme === 'tech' ? 'border-green-500/30 focus:border-green-500 focus:ring-green-500/50 text-green-400 placeholder:text-green-800' : 
      'border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 text-gray-900 bg-gray-50'}`;

  const labelClass = `block mb-2 font-bold ${form.theme === 'tech' ? 'text-green-500' : ''}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {errorMsg && (
        <div className="p-4 bg-red-500/20 border border-red-500 text-red-500 rounded-xl">
          {errorMsg}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.id} className="space-y-2 animate-in slide-in-from-bottom-4 fade-in duration-500" style={{ animationFillMode: 'both' }}>
          <label className={labelClass}>
            {field.label} {field.isRequired && <span className="text-red-500">*</span>}
          </label>
          
          {field.description && <p className="text-sm opacity-70 mb-2">{field.description}</p>}

          {(field.type === "short_text" || field.type === "email" || field.type === "number" || field.type === "date") && (
            <div className="relative flex items-center">
              {field.type === "number" && (field.label.toLowerCase().includes("pay") || field.label.toLowerCase().includes("price")) && (
                <span className={`absolute left-4 font-bold ${form.theme === 'tech' ? 'text-green-500' : 'text-gray-400'}`}>$</span>
              )}
              <input
                type={field.type === "short_text" ? "text" : field.type}
                className={`${inputClass} ${field.type === "number" && (field.label.toLowerCase().includes("pay") || field.label.toLowerCase().includes("price")) ? "pl-10" : ""}`}
                placeholder={`Enter your ${field.label.toLowerCase()}...`}
                min={field.type === "number" ? "0" : undefined}
                {...register(field.id, { required: field.isRequired })}
              />
            </div>
          )}

          {field.type === "long_text" && (
            <textarea
              className={`${inputClass} min-h-[120px]`}
              placeholder={`Enter your ${field.label.toLowerCase()}...`}
              {...register(field.id, { required: field.isRequired })}
            />
          )}

          {(field.type === "dropdown" || field.type === "single_select") && (
            <select className={inputClass} {...register(field.id, { required: field.isRequired })}>
              <option value="">Select an option</option>
              {field.options && (() => {
                let parsedOptions: string[] = [];
                try {
                  if (typeof field.options === "string") {
                    const parsed = JSON.parse(field.options);
                    parsedOptions = Array.isArray(parsed) ? parsed : field.options.split(",");
                  } else if (Array.isArray(field.options)) {
                    parsedOptions = field.options;
                  }
                } catch (e) {
                  parsedOptions = typeof field.options === "string" ? field.options.split(",") : [];
                }
                return parsedOptions.map((opt: string) => (
                  <option key={opt.trim()} value={opt.trim()} className="text-black bg-white">{opt.trim()}</option>
                ));
              })()}
            </select>
          )}

          {field.type === "multi_select" && (
            <div className="space-y-3 mt-2">
              {field.options && (() => {
                let parsedOptions: string[] = [];
                try {
                  if (typeof field.options === "string") {
                    const parsed = JSON.parse(field.options);
                    parsedOptions = Array.isArray(parsed) ? parsed : field.options.split(",");
                  } else if (Array.isArray(field.options)) {
                    parsedOptions = field.options;
                  }
                } catch (e) {
                  parsedOptions = typeof field.options === "string" ? field.options.split(",") : [];
                }
                return parsedOptions.map((opt: string) => (
                  <label key={opt.trim()} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors">
                    <input 
                      type="checkbox" 
                      value={opt.trim()} 
                      {...register(field.id, { required: field.isRequired })}
                      className="w-5 h-5 rounded border-white/20 bg-black text-purple-500 focus:ring-purple-500/50" 
                    />
                    <span className="opacity-90">{opt.trim()}</span>
                  </label>
                ));
              })()}
            </div>
          )}

          {field.type === "checkbox" && (
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors mt-2">
              <input 
                type="checkbox" 
                {...register(field.id, { required: field.isRequired })}
                className="w-5 h-5 rounded border-white/20 bg-black text-purple-500 focus:ring-purple-500/50" 
              />
              <span className="font-medium">Yes, I agree / confirm</span>
            </label>
          )}

          {/* Quick rudimentary rating */}
          {field.type === "rating" && (
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className={`flex flex-col items-center cursor-pointer p-4 rounded-xl border ${inputClass} hover:bg-white/5`}>
                  <input type="radio" value={num} className="mb-2" {...register(field.id, { required: field.isRequired })} />
                  <span>{num}</span>
                </label>
              ))}
            </div>
          )}

          {errors[field.id] && <span className="text-red-500 text-sm font-medium">This field is required</span>}
        </div>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
          ${form.theme === 'anime' ? 'bg-white text-pink-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 
            form.theme === 'tech' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
            'bg-black text-white hover:bg-gray-800'}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Response'}
      </button>
    </form>
  );
}
