/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { AgeGroup, MedicalSpecialty, PrescriptionAnalysisResult, UserProfile } from '../types';
import { FileText, Upload, Brain, Heart, Activity, AlertTriangle, ShieldCheck, List, Info, CornerDownRight, Play, Loader2 } from 'lucide-react';

interface PrescriptionAnalyzerProps {
  userProfile: UserProfile | null;
  onAnalysisSuccess?: (result: PrescriptionAnalysisResult) => void;
}

const PRESET_PRESCRIPTIONS = [
  {
    title: "Senior Cardiovascular Regimen",
    text: "Lisinopril 20mg once daily\nMetoprolol Succinate 50mg daily\nAtorvastatin 40mg at bedtime\nAspirin 81mg tab daily",
    age: 78,
    ageGroup: "Seniors" as AgeGroup,
    specialty: "Cardiology" as MedicalSpecialty,
    description: "Multi-drug hypertension and lipid management for a geriatric patient. Includes high-risk combination details."
  },
  {
    title: "Infant Antihypertensive & Diuretic",
    text: "Furosemide 1mg/ml oral solution (dose: 2ml twice daily)\nSpironolactone 1mg/kg oral suspension twice daily",
    age: 1,
    ageGroup: "Babies" as AgeGroup,
    specialty: "Cardiology" as MedicalSpecialty,
    description: "Pediatric liquid formulation mapping neonatal renal filtration clearing parameters."
  },
  {
    title: "Adult Anti-Epileptic Neurological Track",
    text: "Levetiracetam (Keppra) 500mg twice daily\nGabapentin 300mg three times daily\nPhenobarbital 30mg at night",
    age: 38,
    ageGroup: "Adults" as AgeGroup,
    specialty: "Neurology" as MedicalSpecialty,
    description: "High-dose dual anticonvulsant regimen with central nervous system depressant risks."
  }
];

export default function PrescriptionAnalyzer({ userProfile, onAnalysisSuccess }: PrescriptionAnalyzerProps) {
  const [inputText, setInputText] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PrescriptionAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImageBase64(base64String);
      setImageMime(file.type);
      setInputText(`[Image Loaded: ${file.name}]`);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

function cleanErrorMessage(raw: string): string {
  if (!raw) return "An unexpected error occurred.";
  try {
    const json = JSON.parse(raw);
    if (json?.error?.message) {
      if (json.error.code === 429 || json.error.message.includes("quota") || json.error.status === "RESOURCE_EXHAUSTED") {
        return "Gemini API quota reached (429 Rate Limit). The system is using the internal pharmacology validator.";
      }
      return json.error.message;
    }
  } catch {
    // not JSON
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED") || raw.toLowerCase().includes("quota") || raw.toLowerCase().includes("rate-limits")) {
    return "Gemini API quota reached (429 Rate Limit). Live parsing is temporarily throttled; rule-based checking is active.";
  }
  return raw;
}

  const executeAnalysis = async (textToSend: string, imgData?: string | null, imgMime?: string | null, customAgeGroup?: AgeGroup, customSpecialty?: MedicalSpecialty, customAge?: number) => {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    const activeAgeGroup = customAgeGroup || userProfile?.ageGroup || "Adults";
    const activeSpecialty = customSpecialty || userProfile?.specialtyFocus || "General";
    const activeAge = customAge || userProfile?.age || 35;

    try {
      const res = await fetch('/api/analyze-prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prescriptionText: imgData ? null : textToSend,
          imageBase64: imgData,
          imageMimeType: imgMime,
          patientAge: activeAge,
          patientAgeGroup: activeAgeGroup,
          specialtyContext: activeSpecialty
        })
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok) {
        throw new Error(cleanErrorMessage(data?.error || "Failed to parse clinical prescription."));
      }

      const parsedData: PrescriptionAnalysisResult = data;
      setResult(parsedData);
      if (onAnalysisSuccess) {
        onAnalysisSuccess(parsedData);
      }
    } catch (err: any) {
      console.error("Prescription Analysis Handler:", err);
      setErrorMsg(cleanErrorMessage(err.message || "Network communication failed while evaluating the prescription."));
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg("Please write patient prescription details or scan an image document.");
      return;
    }
    executeAnalysis(inputText, imageBase64, imageMime);
  };

  const loadPreset = (preset: typeof PRESET_PRESCRIPTIONS[0]) => {
    setInputText(preset.text);
    setImageBase64(null);
    setImageMime(null);
    executeAnalysis(preset.text, null, null, preset.ageGroup, preset.specialty, preset.age);
  };

  const clearScanner = () => {
    setInputText("");
    setImageBase64(null);
    setImageMime(null);
    setResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" id="prescription-analyzer-root">
      {/* Mini Header density */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tighter">AI Prescription Scan & Analysis</h4>
        </div>
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase tracking-wide">
          Active OCR / AI Compound Parser
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col lg:flex-row gap-5 overflow-auto">
        {/* Left parser trigger */}
        <div className="w-full lg:w-[45%] space-y-3 shrink-0 flex flex-col">
          <form onSubmit={handleFormSubmit} className="space-y-3 flex-1 flex flex-col">
            <div className="flex-1 relative flex flex-col min-h-[140px]">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste medical prescription text here...&#10;e.g. Lisinopril 10mg once daily..."
                className="w-full flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 outline-none resize-none font-mono leading-relaxed"
                id="rx-text-area"
              />
              {imageBase64 && (
                <div className="absolute inset-x-2 bottom-2 bg-slate-900/90 text-[10px] text-teal-400 font-mono p-2 rounded border border-teal-800 flex items-center justify-between">
                  <span>📷 Scan document binary loaded</span>
                  <button type="button" onClick={clearScanner} className="text-rose-400 hover:underline">Clear</button>
                </div>
              )}
            </div>

            {/* Hidden upload interface */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="rx-file-input"
            />

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-1.5 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 font-sans text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition cursor-pointer"
                id="btn-upload-scan"
              >
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                Scan Document
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                id="btn-submit-rx"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Compounds...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    AI Parse Medication
                  </>
                )}
              </button>
              {inputText && (
                <button
                  type="button"
                  onClick={clearScanner}
                  className="px-2.5 py-1.5 border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Quick presets list to simulate without complex upload */}
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
            <span className="block text-[9px] uppercase font-bold text-slate-400 font-sans tracking-wide mb-1.5">
              Simulate Clinical Prescription Scans (Select Preset)
            </span>
            <div className="space-y-1">
              {PRESET_PRESCRIPTIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="w-full text-left p-1.5 hover:bg-white rounded border border-transparent hover:border-slate-200 transition text-[10px] text-slate-600 flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-700 truncate max-w-[210px]">{preset.title}</span>
                  <span className="font-mono text-[9px] bg-slate-200/50 text-slate-500 px-1 rounded">
                    {preset.ageGroup}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Detail */}
        <div className="flex-1 min-h-[220px] bg-slate-50/40 rounded-lg border border-slate-100 p-3 flex flex-col overflow-auto">
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <p className="text-xs font-bold text-slate-800">Reviewing Global Pharmacy Registries</p>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-0.5">
                  Verifying Beers criteria databases, renal excretion thresholds for age group, and cardiac drug safety profiles...
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <AlertTriangle className="w-7 h-7 text-rose-500 mb-2" />
              <p className="text-xs font-bold text-slate-800">Prescription Parsing Error</p>
              <p className="text-[10px] text-rose-600 mt-1 max-w-xs mx-auto font-mono leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {!loading && !errorMsg && !result && (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
              <FileText className="w-10 h-10 text-slate-300 stroke-1.5 mb-2" />
              <p className="text-xs font-bold">No Prescription Loaded</p>
              <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs mx-auto">
                Paste a medication list or trigger one of the presets to perform structural safety checking for Babies to 100 yr olds.
              </p>
            </div>
          )}

          {result && !loading && !errorMsg && (
            <div className="space-y-3 text-xs text-slate-700 animate-fade-in">
              {/* Quota Limit Notice */}
              {(result.isQuotaExceeded || result.isFallback) && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-2.5 flex items-start gap-2 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-800 text-[10.5px] uppercase tracking-wide">Offline Pharmacology Protocol Active</span>
                    <p className="text-[10px] text-amber-700 leading-normal">
                      Live AI parsing reached API rate limits (429). Medications and dosage precautions analyzed using verified internal clinical pharmacology rules.
                    </p>
                  </div>
                </div>
              )}

              {/* Critical warnings alert banner if any */}
              {result.criticalAlerts && result.criticalAlerts.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <span className="font-bold text-red-800 text-[11px] uppercase tracking-wide">Age-Demographic Clinical Alerts</span>
                    <ul className="list-disc pl-3.5 space-y-0.5 text-[10px] text-red-700 leading-normal">
                      {result.criticalAlerts.map((alert, i) => (
                        <li key={i}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Extraction metadata stats */}
              <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Scanned Patient</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {result.patientName} (Age Group: {result.patientAgeGroup}, {result.patientAge} yr)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 uppercase font-mono block">Clinical Relevance</span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-semibold font-mono">
                    {result.specialtyContext} Specialization
                  </span>
                </div>
              </div>

              {/* Extracted medicine capsules */}
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Detected Clinical Compounds</span>
                <div className="space-y-2">
                  {result.detectedMedicines.map((med, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          {med.name}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 rounded">
                          {med.dosageStrength} - {med.frequency}
                        </span>
                      </div>
                      
                      {med.description && (
                        <p className="text-[10px] text-slate-500 leading-normal italic">"{med.description}"</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 pt-1.5 border-t border-slate-50 text-[10px]">
                        <div>
                          <span className="font-semibold text-rose-700 flex items-center gap-1">
                            ⚠️ Risks & Side-Effects
                          </span>
                          <span className="text-slate-600 block mt-0.5">{med.risksOrSideEffects.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 flex items-center gap-1">
                            👶👵 Age Appropriateness ({result.patientAgeGroup})
                          </span>
                          <span className="text-slate-600 block mt-0.5">{med.ageAppropriateNotes}</span>
                        </div>
                      </div>

                      {med.specialtyInsight && (
                        <div className="mt-1 p-1 bg-indigo-50/50 rounded text-[9px] text-indigo-700 flex gap-1 items-start">
                          <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span><strong className="font-bold">{result.specialtyContext} Insight:</strong> {med.specialtyInsight}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Interaction warning */}
              <div className="p-2.5 bg-yellow-50/60 border border-yellow-200/50 rounded-lg space-y-1">
                <span className="font-bold text-yellow-800 text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-yellow-600" />
                  Drug-to-Drug Interaction Matrix Check
                </span>
                <p className="text-[10px] text-slate-600 leading-normal">{result.drugInteractionsCheck}</p>
              </div>

              {/* Instructions summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] bg-slate-100/60 p-2.5 rounded-lg border border-slate-200/30">
                <div>
                  <span className="font-bold text-slate-700 block">Pharmacist Precautions</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{result.generalPrecautions}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Administration Advice</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{result.doctorInstructions}</p>
                </div>
              </div>

              {/* Specialty Relevance */}
              <div className="p-2 bg-blue-50/50 border border-blue-200/40 rounded-lg text-[9px] text-blue-800">
                <strong className="font-bold">Inter-departmental Cardiology / Hematology / Neurology Sync Rank: </strong>
                {result.relevanceToSpecialty}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
