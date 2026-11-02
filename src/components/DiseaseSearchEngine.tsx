/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AgeGroup, MedicalSpecialty, DiseaseInfo, UserProfile } from '../types';
import { 
  Search, 
  Heart, 
  Brain, 
  Activity, 
  User, 
  Compass, 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle,
  FileText,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Info,
  MessageSquare,
  Send,
  Bot,
  Baby,
  Stethoscope
} from 'lucide-react';
import { DETAILED_DISEASES } from '../diseaseEtiologyDatabase';

interface DiseaseSearchEngineProps {
  userProfile: UserProfile | null;
  activeSpecialty?: MedicalSpecialty;
  activeAgeGroup?: AgeGroup;
  onFilterChange?: (spec: MedicalSpecialty, age: AgeGroup) => void;
  onSearchPerform?: (sheet: DiseaseInfo | null) => void;
  vitals?: {
    bpm: number;
    spo2: number;
    bpSystolic: number;
    bpDiastolic: number;
    rbcCount: number;
    hemoglobin: number;
    scannedAt: string;
  } | null;
}

const PRESET_DISEASES: Array<{
  name: string;
  category: MedicalSpecialty;
  ageGroup: AgeGroup;
  description: string;
}> = [
  // Cardiology
  { name: "Tetralogy of Fallot", category: "Cardiology", ageGroup: "Babies", description: "Congenital heart defect with four anatomical abnormalities, causing cyanosis in newborns ('blue baby syndrome')." },
  { name: "Kawasaki Disease", category: "Cardiology", ageGroup: "Children", description: "Acute vasculitis primarily affecting coronary arteries in children, with specific coronary aneurysm risks." },
  { name: "Postural Orthostatic Tachycardia Syndrome (POTS)", category: "Cardiology", ageGroup: "Teenagers", description: "Autonomic heart rate elevation condition frequent in young adults, mimicking cardiovascular distress." },
  { name: "Atherosclerotic Cardiovascular Disease (ASCVD)", category: "Cardiology", ageGroup: "Adults", description: "Plaque build-up in arteries, causing coronary artery disease, angina, and myocardial infarction." },
  { name: "Congestive Heart Failure (Geriatric Care)", category: "Cardiology", ageGroup: "Seniors", description: "Declining cardiac output with pulmonary/systolic congestion, needing strict fluid and Beers-criteria checks." },
  
  // Neurology
  { name: "Infantile Spasms (West Syndrome)", category: "Neurology", ageGroup: "Babies", description: "Severe epileptic encephalopathy starting in first year of life, characterized by hypsarrhythmia." },
  { name: "Pediatric Absence Epilepsy", category: "Neurology", ageGroup: "Children", description: "Generalized seizures shown as brief staring spells in children, requiring localized anticonvulsants." },
  { name: "Migraine with Aura (Juvenile)", category: "Neurology", ageGroup: "Teenagers", description: "Sensory disturbances and visual disturbances preceding severe juvenile unilateral headaches." },
  { name: "Multiple Sclerosis (Remitting-Relapsing)", category: "Neurology", ageGroup: "Adults", description: "Demyelinating CNS disease presenting in young and mid-adulthood with multiple neurological spots." },
  { name: "Alzheimer's Disease & Vascular Dementia", category: "Neurology", ageGroup: "Seniors", description: "Neurodegenerative cognitive loss with amyloid plaques, requiring geriatric neurochemical adjustments." },

  // Hematology
  { name: "Hemolytic Disease of the Newborn", category: "Hematology", ageGroup: "Babies", description: "Alloimmune disease where maternal antibodies destroy fetal Rh-positive red blood cells." },
  { name: "Sickle Cell Disease (Vaso-Occlusive Crisis)", category: "Hematology", ageGroup: "Children", description: "Hemoglobin S disorder causing cell sickling, microvascular obstruction, and pain crises." },
  { name: "Infectious Mononucleosis Splenomegaly", category: "Hematology", ageGroup: "Teenagers", description: "Epstein-Barr virus infection elevating spleen rupture risks and lymphocytosis in young people." },
  { name: "Deep Vein Thrombosis & Pulmonary Embolism", category: "Hematology", ageGroup: "Adults", description: "Hypercoagulable state forming thrombi in deep veins, demanding rapid anticoagulant profiling." },
  { name: "Myelodysplastic Syndromes (MDS)", category: "Hematology", ageGroup: "Seniors", description: "Ineffective hematopoiesis resulting in refractory cytopenias, highly prevalent in geriatric oncology." },

  // Pediatrics
  { name: "Infantile Hypertrophic Pyloric Stenosis", category: "Pediatrics", ageGroup: "Babies", description: "Circular pyloric muscle hypertrophy producing post-feeding projectile vomiting in neonates." },
  { name: "Acute Laryngotracheobronchitis (Croup)", category: "Pediatrics", ageGroup: "Children", description: "Viral subglottic laryngeal inflammation leading to barking cough and acute stridor." },
  { name: "Acute Otitis Media", category: "Pediatrics", ageGroup: "Children", description: "Middle ear bacterial infection causing bulging, red tympanic membrane and intense ear pain." },

  // Geriatrics
  { name: "Parkinson's Disease Encephalopathy", category: "Geriatrics", ageGroup: "Seniors", description: "Loss of dopaminergic neurons in substantia nigra causing resting tremors, rigidity, and bradykinesia." },
  { name: "Frail Sarcopenia & Osteoporosis", category: "Geriatrics", ageGroup: "Seniors", description: "Severe muscle wasting and uncoupled osteoclastic bone resorption triggering fall risks." },
  { name: "Herpes Zoster (Shingles)", category: "Geriatrics", ageGroup: "Seniors", description: "Latent varicella-zoster virus reactivation restricted along a painful unilateral dermatome." },

  // Oncology
  { name: "Pediatric Retinoblastoma", category: "Oncology", ageGroup: "Babies", description: "Congenital intraocular tumor resulting from RB1 gene mutations in newborns." },
  { name: "Acute Lymphoblastic Leukemia (ALL)", category: "Oncology", ageGroup: "Children", description: "A high-proliferation blood cancer in children, responding well to modern targeted protocols." },
  { name: "Philadelphia Chromosome Ph+ CML", category: "Oncology", ageGroup: "Adults", description: "BCR-ABL translocation myeloid leukemia treated with targeted tyrosine kinase inhibitors." },

  // Nephrology
  { name: "Congenital Familial Nephritis", category: "Nephrology", ageGroup: "Babies", description: "Glomerular membrane defect causing proteinuria and fluid retention in early infancy." },
  { name: "End-Stage Renal Disease Hyperphosphatemia", category: "Nephrology", ageGroup: "Seniors", description: "Phosphate retention in severe chronic dialysis, requiring non-calcium Renvela binders." },

  // Endocrinology
  { name: "Juvenile Type 1 Diabetes (DKA)", category: "Endocrinology", ageGroup: "Children", description: "Acute autoimmune insulin deficiency triggering life-threatening diabetic ketoacidosis." },
  { name: "Type 2 Insulin-Resistant Mellitus", category: "Endocrinology", ageGroup: "Adults", description: "Metabolic glucose resistance treated with first-line Glucophage (Metformin)." },

  // Immunology
  { name: "Severe Combined Immunodeficiency (SCID)", category: "Immunology", ageGroup: "Babies", description: "Primary genetic immune system deficiency ('bubble boy disease') needing sterile precautions." },
  { name: "Systemic Lupus Erythematosus (SLE Flares)", category: "Immunology", ageGroup: "Adults", description: "Autoimmune connective tissue inflammation treated with synthetic corticosteroids like Prednisone." },

  // General Medicine
  { name: "Community-Acquired Pneumonia", category: "General", ageGroup: "Adults", description: "Parenchymal lung infection producing cough, fever, purulent sputum, and crackles." },
  { name: "Gastroesophageal Reflux Disease (GERD)", category: "General", ageGroup: "Adults", description: "Lower esophageal sphincter incompetence provoking distressing chronic acid regurgitation." },
  { name: "Asthma Bronchiospasms (Acute Exacerbation)", category: "General", ageGroup: "Teenagers", description: "Reversible bronchoconstriction causing severe wheezing, dyspnea, and chest tightness." }
];

export default function DiseaseSearchEngine({ 
  userProfile, 
  activeSpecialty = "General", 
  activeAgeGroup = "Adults",
  onFilterChange,
  onSearchPerform,
  vitals
}: DiseaseSearchEngineProps) {
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [clinicalSheet, setClinicalSheet] = useState<DiseaseInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Follow-up interactive chat states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  React.useEffect(() => {
    if (clinicalSheet) {
      setChatMessages([
        {
          role: 'assistant',
          text: `### Clinical Consultation with **Dr. SSEMAMBO DEHIA**
Greetings. I am **Dr. SSEMAMBO DEHIA**, your AI-based General Medical Director. I have compiled and active-synced the planets' clinical databases regarding **${clinicalSheet.name}** in context of the **${clinicalSheet.category}** specialty for this **${clinicalSheet.ageGroup}** demographic.

Tell me, how can I assist you in your clinical charting? For instance:
- What are the primary pathophysiological pathways of this condition?
- Are there any critical age-dependent contraindications or side-effects for prescribed medications?
- How do the patient's active capillary EMR biometrics align with expected cardiac, hematologic, or neurologic markers?
`
        }
      ]);
      setChatError(null);
    } else {
      setChatMessages([]);
    }
  }, [clinicalSheet?.name, clinicalSheet?.ageGroup, clinicalSheet?.category]);

function cleanErrorMessage(raw: string): string {
  if (!raw) return "An unexpected error occurred.";
  try {
    const json = JSON.parse(raw);
    if (json?.error?.message) {
      if (json.error.code === 429 || json.error.message.includes("quota") || json.error.status === "RESOURCE_EXHAUSTED") {
        return "Gemini API quota exceeded (429 Rate Limit). The system has automatically engaged offline clinical guidelines.";
      }
      return json.error.message;
    }
  } catch {
    // not JSON
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED") || raw.toLowerCase().includes("quota") || raw.toLowerCase().includes("rate-limits")) {
    return "Gemini API quota exceeded (429 Rate Limit). Live queries are temporarily throttled; verified clinical protocols are available.";
  }
  return raw;
}

  const triggerSearch = async (searchQuery: string, ageGrp: AgeGroup, cat: MedicalSpecialty) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setClinicalSheet(null);
    if (onSearchPerform) onSearchPerform(null);

    // Map approximate age based on age group
    let ageVal = 35;
    if (ageGrp === 'Babies') ageVal = 1;
    else if (ageGrp === 'Children') ageVal = 7;
    else if (ageGrp === 'Teenagers') ageVal = 16;
    else if (ageGrp === 'Seniors') ageVal = 75;

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          age: ageVal,
          ageGroup: ageGrp,
          category: cat,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok) {
        const errRaw = data?.error || "Medical search failed to complete";
        const cleaned = cleanErrorMessage(errRaw);

        // Immediate offline contingency if backend failed
        const localMatch = DETAILED_DISEASES.find(
          d => d.name.toLowerCase() === searchQuery.toLowerCase() ||
               searchQuery.toLowerCase().includes(d.name.toLowerCase()) ||
               d.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (localMatch) {
          const fallbackSheet: DiseaseInfo = {
            name: localMatch.name,
            category: localMatch.category,
            ageGroup: localMatch.ageGroup,
            summary: "Verified Offline Clinical Dossier",
            detailedAnalysis: `### Clinical Summary\nOffline guideline profile loaded for **${localMatch.name}** (${localMatch.category}).\n\n### Pathological Causes\n${localMatch.causes.map(c => `- ${c}`).join('\n')}\n\n### Objective Signs\n${localMatch.signs.map(s => `- ${s}`).join('\n')}\n\n### Subjective Symptoms\n${localMatch.symptoms.map(s => `- ${s}`).join('\n')}`,
            clinicalGuidelines: [],
            symptoms: localMatch.symptoms,
            riskFactors: [],
            dosagePrecautions: "",
            groundingSources: [{ title: "Offline Clinical Etiology Repository", uri: "" }],
            timestamp: new Date().toISOString(),
            isQuotaExceeded: true,
            isFallback: true,
            fallbackReason: cleaned
          };
          setClinicalSheet(fallbackSheet);
          if (onSearchPerform) onSearchPerform(fallbackSheet);
          return;
        }

        throw new Error(cleaned);
      }

      const rawText: string = data.text;
      
      const parsedSheet: DiseaseInfo = {
        name: searchQuery,
        category: cat,
        ageGroup: ageGrp,
        summary: data.isQuotaExceeded ? "Verified Internal Clinical Guidelines (Offline Fallback)" : "Extracted Grounded Clinical Profile",
        detailedAnalysis: rawText,
        clinicalGuidelines: [],
        symptoms: [],
        riskFactors: [],
        dosagePrecautions: "",
        groundingSources: data.groundingSources || [],
        timestamp: data.timestamp,
        isQuotaExceeded: data.isQuotaExceeded,
        isFallback: data.isFallback,
        fallbackReason: data.fallbackReason
      };

      setClinicalSheet(parsedSheet);
      if (onSearchPerform) {
        onSearchPerform(parsedSheet);
      }
    } catch (err: any) {
      console.error("Clinical Search Handler:", err);
      setErrorMsg(cleanErrorMessage(err.message || "An unexpected network error occurred while reaching clinical servers."));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(query, activeAgeGroup, activeSpecialty);
  };

  const selectPreset = (presetName: string, presetCat: MedicalSpecialty, presetAge: AgeGroup) => {
    setQuery(presetName);
    if (onFilterChange) {
      onFilterChange(presetCat, presetAge);
    }
    triggerSearch(presetName, presetAge, presetCat);
  };

  const handleSendChatMessage = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const messageToSend = promptOverride || chatInput;
    if (!messageToSend.trim() || !clinicalSheet || chatLoading) return;

    if (!promptOverride) {
      setChatInput("");
    }
    setChatLoading(true);
    setChatError(null);

    // Append user message
    const updatedMessages = [...chatMessages, { role: 'user' as const, text: messageToSend }];
    setChatMessages(updatedMessages);

    try {
      const res = await fetch('/api/chat-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          history: chatMessages.slice(-8).map(m => ({
            role: m.role,
            content: m.text
          })),
          diseaseName: clinicalSheet.name,
          diseaseContext: clinicalSheet.detailedAnalysis,
          vitals: vitals || null
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }

      if (!res.ok) {
        throw new Error(cleanErrorMessage(data?.error || "Failed to reach medical consultant node."));
      }

      setChatMessages([...updatedMessages, { role: 'assistant' as const, text: data.text }]);
    } catch (err: any) {
      console.error("Chat Handler Error:", err);
      setChatError(cleanErrorMessage(err.message || "An unexpected error occurred while conveying the inquiry."));
    } finally {
      setChatLoading(false);
    }
  };

  // Safe manual renderer for Markdown lines on a light theme background
  const renderMarkdownContent = (markdown: string) => {
    const lines = markdown.split('\n');
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-sans font-bold text-sm text-blue-800 mt-5 mb-2 border-b border-slate-100 pb-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-sans font-bold text-base text-slate-800 mt-6 mb-3 border-b border-blue-100 pb-1.5 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-blue-500" />
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h2 key={idx} className="font-sans font-extrabold text-lg text-slate-900 mt-8 mb-4">
            {line.replace('# ', '')}
          </h2>
        );
      }
      // Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="font-sans text-[12px] text-slate-600 ml-5 list-disc my-1 leading-relaxed">
            {line.replace(/^[\s-*]+/, '')}
          </li>
        );
      }
      // Tables (simple bypass)
      if (line.trim().startsWith('|')) {
        return (
          <div key={idx} className="font-mono text-[11px] bg-slate-50 p-1 px-3 border border-slate-200 rounded my-0.5 max-w-full overflow-x-auto text-slate-500">
            {line}
          </div>
        );
      }
      // Empty lines
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Bold rendering fallback for medical terms
      return (
        <p key={idx} className="font-sans text-[12px] text-slate-700 my-1.5 leading-relaxed">
          {line.split('**').map((tok, i) => i % 2 === 1 ? <strong key={i} className="text-slate-900 font-bold">{tok}</strong> : tok)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-4" id="disease-engine-card">
      
      {/* Search Input Card Frame in Light Theme */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-slate-800">Global Clinical Search Grounding</h3>
            <p className="text-[11px] text-slate-500">Real-time access to WHO, CDC, PubMed registry, and active multi-specialty servers</p>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
              <input
                type="text"
                required
                placeholder="Query global disease indexes (e.g., Atrial Fibrillation, Infant West Syndrome...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              id="btn-disease-search"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 self-stretch transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Sourcing Planetary Nodes...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  Request Dossier
                </>
              )}
            </button>
          </div>

          {/* Specialization & Age Quick Filters synced indicator */}
          <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-100 p-2 rounded-lg">
            <span className="text-slate-500 font-medium font-sans">
              Filters: <strong className="text-slate-800 font-semibold">{activeSpecialty} Focus</strong> • <strong className="text-slate-800 font-semibold">{activeAgeGroup}</strong> cohort
            </span>
            <span className="text-[10px] text-blue-600 font-semibold uppercase hover:underline cursor-pointer" onClick={() => triggerSearch(query || "General Health", activeAgeGroup, activeSpecialty)}>
              Force Sync
            </span>
          </div>
        </form>
      </div>

      {/* Specialty Preset Lists grouped under High Density panels */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-100 pb-2">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <h4 className="font-sans font-bold text-xs text-slate-700 uppercase tracking-tight">
            Comprehensive Life-Cycle Clinical Presets
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(['Cardiology', 'Neurology', 'Hematology', 'Pediatrics', 'Geriatrics', 'Oncology', 'Nephrology', 'Endocrinology', 'Immunology', 'General'] as MedicalSpecialty[]).map((spec) => {
            const list = PRESET_DISEASES.filter(d => d.category === spec);
            return (
              <div key={spec} className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-200/50 space-y-1">
                <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-slate-200/60 font-medium">
                  {spec === 'Cardiology' && <Heart className="w-3 h-3 text-red-500" />}
                  {spec === 'Neurology' && <Brain className="w-3 h-3 text-purple-500" />}
                  {spec === 'Hematology' && <Activity className="w-3 h-3 text-emerald-500" />}
                  {spec === 'Pediatrics' && <Baby className="w-3 h-3 text-indigo-500" />}
                  {spec === 'Geriatrics' && <User className="w-3 h-3 text-teal-500" />}
                  {spec === 'Oncology' && <Sparkles className="w-3 h-3 text-rose-500" />}
                  {spec === 'Nephrology' && <Compass className="w-3 h-3 text-sky-500" />}
                  {spec === 'Endocrinology' && <Compass className="w-3 h-3 text-amber-500" />}
                  {spec === 'Immunology' && <Compass className="w-3 h-3 text-fuchsia-500" />}
                  {spec === 'General' && <Stethoscope className="w-3 h-3 text-blue-500" />}
                  <span className="text-[10px] font-bold text-slate-700 tracking-tight uppercase">{spec} Nodes</span>
                </div>
                <div className="space-y-1">
                  {list.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => selectPreset(d.name, d.category, d.ageGroup)}
                      className="w-full text-left p-1 text-[10px] text-slate-500 hover:text-blue-700 hover:bg-slate-100/85 rounded transition-all flex justify-between items-center cursor-pointer"
                    >
                      <span className="font-semibold truncate max-w-[120px]" title={d.name}>{d.name}</span>
                      <span className="font-mono text-[8px] text-slate-400 bg-white/80 border border-slate-200 rounded px-1 scale-90">
                        {d.ageGroup}
                      </span>
                    </button>
                  ))}
                  {list.length === 0 && (
                    <span className="text-[9px] text-slate-400 italic block">No preset cache loaded</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinician Query Error feedback */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200/60 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-xs text-red-900">Clinical Query Notice</span>
              <button
                type="button"
                onClick={() => {
                  const match = DETAILED_DISEASES[0];
                  if (match) {
                    selectPreset(match.name, match.category, match.ageGroup);
                  }
                }}
                className="text-[10px] font-semibold text-red-700 hover:text-red-900 underline"
              >
                Load Verified Preset
              </button>
            </div>
            <p className="text-[11px] text-red-700 mt-1 font-sans leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Sourcing State indicator */}
      {loading && (
        <div className="bg-white border border-slate-200 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <div>
            <h4 className="font-sans font-bold text-xs text-slate-800">Reaching Scientific Repositories</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mx-auto mt-0.5">
              Merging consensus criteria for cardiology / hematology / neurology under cohort age rules...
            </p>
          </div>
        </div>
      )}

      {/* Output whitepaper dossier */}
      {clinicalSheet && !loading && (() => {
        // Find if current condition matches any local entries in our pre-compiled diagnostic database
        const localMatch = DETAILED_DISEASES.find(
          d => d.name.toLowerCase() === clinicalSheet.name.toLowerCase() ||
               clinicalSheet.name.toLowerCase().includes(d.name.toLowerCase()) ||
               d.name.toLowerCase().includes(clinicalSheet.name.toLowerCase())
        );

        return (
          <div className="space-y-4" id="dossier-output-region">
            
            {/* API Quota Notice Banner */}
            {(clinicalSheet.isQuotaExceeded || clinicalSheet.isFallback) && (
              <div className="bg-amber-50 border border-amber-200/90 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
                <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-bold text-xs text-amber-900">
                      Gemini API Rate Limit / Quota Notice (429 Rate Limit)
                    </h4>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-tight bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      Offline Mode Active
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
                    Live web grounding is temporarily limited by Gemini API provider quota thresholds. Comprehensive clinical guidelines, etiology causes, objective signs, subjective symptoms, and dosage rules have been loaded seamlessly from the internal verified medical registry.
                  </p>
                </div>
              </div>
            )}

            {/* 1. Authoritative Clinical Profile & Prescription Card (Causes, Signs, Symptoms, Prescriptions) */}
            {localMatch && (
              <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-950 shadow-md p-5 space-y-4" id="authoritative-registry-card">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase">
                          Authoritative EMR Sheet
                        </span>
                        <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase">
                          Match: {localMatch.category} {localMatch.ageGroup}
                        </span>
                      </div>
                      <h3 className="font-sans font-extrabold text-sm text-white mt-1">
                        Professional Disease Profile: {localMatch.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">REGISTRY V-4.5</span>
                </div>

                {/* Grid layout for Causes, Signs, Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] leading-relaxed">
                  
                  {/* Causes (Pathogenesis) Section */}
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-300 uppercase tracking-tight flex items-center gap-1.5 pb-1 border-b border-slate-800">
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      Causes & Etiologic Factors
                    </h4>
                    <ul className="space-y-1.5 text-slate-400 list-none pl-0">
                      {localMatch.causes.map((cause, i) => (
                        <li key={i} className="relative pl-3.5">
                          <span className="absolute left-0 text-blue-400 font-sans">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Signs Section (Objective) */}
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-300 uppercase tracking-tight flex items-center gap-1.5 pb-1 border-b border-slate-800">
                      <Activity className="w-3.5 h-3.5 text-amber-400" />
                      Clinical Signs (Objective)
                    </h4>
                    <ul className="space-y-1.5 text-slate-400 list-none pl-0">
                      {localMatch.signs.map((sign, i) => (
                        <li key={i} className="relative pl-3.5">
                          <span className="absolute left-0 text-amber-400 font-sans">•</span>
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Symptoms Section (Subjective) */}
                  <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-300 uppercase tracking-tight flex items-center gap-1.5 pb-1 border-b border-slate-800">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      Symptoms (Subjective)
                    </h4>
                    <ul className="space-y-1.5 text-slate-400 list-none pl-0">
                      {localMatch.symptoms.map((sym, i) => (
                        <li key={i} className="relative pl-3.5">
                          <span className="absolute left-0 text-purple-400 font-sans">•</span>
                          {sym}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Immediate Clinical Prescription & Dosages Section */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-850">
                    <Pill className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-sans font-bold text-xs uppercase text-emerald-300 tracking-wide">
                      Immediate Prescriptions & Dynamic Directives
                    </h4>
                  </div>

                  <div className="space-y-3 text-[11px]">
                    {localMatch.prescriptions.map((p, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-extrabold text-white text-xs mr-2">{p.medicine}</span>
                            <span className="text-[10px] text-slate-400 italic">({p.genericName})</span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono rounded">
                            Standard Starting Admin
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1.5 border-t border-b border-slate-800 text-slate-300 font-mono text-[10px]">
                          <div>
                            <span className="text-slate-500 font-sans block text-[9px] uppercase">Dosage Strength:</span>
                            <span className="text-white font-semibold">{p.standardDose}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-sans block text-[9px] uppercase">Frequency:</span>
                            <span className="text-white font-semibold">{p.frequency}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-sans block text-[9px] uppercase">Recommended Duration:</span>
                            <span className="text-white font-semibold">{p.duration}</span>
                          </div>
                        </div>

                        <div className="flex gap-1 bg-red-500/5 p-2 rounded border border-red-500/10 text-[10px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-slate-400 font-sans">
                            <strong className="text-red-300">Vigilance instruction: </strong> {p.clinicalNote}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Earth-Consensus Grounding AI Whitepaper Dossier */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-left" id="dossier-output">
              {/* Dossier Header */}
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono font-bold">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded uppercase">
                      {clinicalSheet.category} SPECIALIZATION
                    </span>
                    <span className="bg-slate-200 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded uppercase">
                      ACTIVE COHORT: {clinicalSheet.ageGroup}
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-sm text-slate-900 leading-tight">
                    Earth-Grounding Search Synthesis: {clinicalSheet.name}
                  </h3>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Planetary Grounding Timestamp</span>
                  <span className="text-[10px] text-slate-600 font-sans block font-semibold">
                    {new Date(clinicalSheet.timestamp).toLocaleTimeString()} (Active Cache)
                  </span>
                </div>
              </div>

              {/* Dossier Body with clean prose render rules */}
              <div className="p-5 space-y-3 bg-white text-slate-800 leading-relaxed max-h-[420px] overflow-auto border-b border-slate-100">
                {renderMarkdownContent(clinicalSheet.detailedAnalysis)}
              </div>

              {/* Grounding web sources */}
              {clinicalSheet.groundingSources.length > 0 && (
                <div className="bg-slate-50/70 p-4">
                  <h4 className="font-sans font-bold text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                    Planetary Resource Citations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {clinicalSheet.groundingSources.slice(0, 4).map((source, i) => (
                      <a
                        key={i}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white border border-slate-200 hover:border-blue-400 rounded-lg flex items-start gap-2 transition group"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-slate-700 group-hover:text-blue-700 block truncate transition-colors">
                            {source.title}
                          </span>
                          <span className="text-[8.5px] font-mono text-slate-400 block truncate group-hover:text-blue-500 transition-colors">
                            {source.uri}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Interactive AI Clinical Consultant Q&A Box */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-left" id="dossier-interactive-chat">
              
              {/* Box Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/15 rounded-lg">
                    <Bot className="w-4 h-4 text-sky-200" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-xs">Dr. SSEMAMBO DEHIA Consultation Suite</h3>
                    <p className="text-[10px] text-sky-100 opacity-90">AI General Medical Director • Synchronized with planetary consensus servers</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-black/10 px-2 py-0.5 rounded text-[8.5px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>SSEMAMBO ACTIVE</span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="p-4 bg-slate-50/50 space-y-3 max-h-[300px] overflow-y-auto border-b border-slate-100" id="chat-messages-scroll-area">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                    <div className={`p-1 mt-0.5 rounded-md shrink-0 h-6 w-6 flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`rounded-xl p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-slate-50 text-left' : 'bg-white border border-slate-200 shadow-sm'}`}>
                      {msg.role === 'user' ? (
                        <p className="font-medium">{msg.text}</p>
                      ) : (
                        <div className="space-y-1 block prose-sm text-slate-800">
                          {renderMarkdownContent(msg.text)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex gap-2.5 max-w-[85%] mr-auto text-left animate-pulse">
                    <div className="p-1 mt-0.5 rounded bg-slate-200 text-slate-500 shrink-0 h-6 w-6 flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-400">
                      Synthesizing biochemical pathways and active guidelines...
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p>{chatError}</p>
                  </div>
                )}
              </div>

              {/* Suggestion Chips */}
              <div className="p-3 bg-white border-b border-slate-100 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSendChatMessage(undefined, `Explain standard clinical signs or emergency thresholds to note for ${clinicalSheet.name}.`)}
                  disabled={chatLoading}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-semibold rounded-full cursor-pointer transition"
                >
                  ⚠️ Signs & Safety Benchmarks
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage(undefined, `What triggers or etiologic risk factors affect the ${clinicalSheet.ageGroup} group regarding ${clinicalSheet.name}?`)}
                  disabled={chatLoading}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-semibold rounded-full cursor-pointer transition"
                >
                  👶 Age Vulnerability Factors
                </button>
                <button
                  type="button"
                  onClick={() => handleSendChatMessage(undefined, `Detail standard medication classes, starting doses and Beers-criteria risk points for ${clinicalSheet.name} in this demographic.`)}
                  disabled={chatLoading}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-semibold rounded-full cursor-pointer transition"
                >
                  💊 Prescription & Toxicities
                </button>
                {vitals && (
                  <button
                    type="button"
                    onClick={() => handleSendChatMessage(undefined, `CORRELATE MY PATIENT VITALS: How do BPM=${vitals.bpm}, SpO2=${vitals.spo2}%, BP=${vitals.bpSystolic}/${vitals.bpDiastolic}, RBC=${vitals.rbcCount} map to warnings for this condition?`)}
                    disabled={chatLoading}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] text-emerald-700 font-bold rounded-full cursor-pointer transition-all animate-pulse"
                  >
                    🩺 Correlate EMR Biometrics
                  </button>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={(e) => handleSendChatMessage(e)} className="p-3 bg-white flex gap-2">
                <input
                  type="text"
                  required
                  disabled={chatLoading}
                  placeholder={`Ask follow-up query on ${clinicalSheet.name} (e.g. pathways, treatment, EMR compliance)...`}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-3 py-1.5 text-xs outline-none transition disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

            </div>

          </div>
        );
      })()}

    </div>
  );
}
