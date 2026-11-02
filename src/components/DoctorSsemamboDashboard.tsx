/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { DiseaseInfo, AgeGroup, MedicalSpecialty } from '../types';
import { 
  Bot, 
  Send, 
  Activity, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  HelpCircle,
  Clock, 
  User, 
  Atom, 
  Globe, 
  Lightbulb, 
  FileText,
  BookmarkCheck,
  Award
} from 'lucide-react';

interface DoctorSsemamboDashboardProps {
  activeDisease: DiseaseInfo | null;
  vitals?: {
    bpm: number;
    spo2: number;
    bpSystolic: number;
    bpDiastolic: number;
    rbcCount: number;
    hemoglobin: number;
    scannedAt: string;
  } | null;
  currentSpecialty: MedicalSpecialty;
  currentAgeGroup: AgeGroup;
}

export default function DoctorSsemamboDashboard({
  activeDisease,
  vitals,
  currentSpecialty,
  currentAgeGroup
}: DoctorSsemamboDashboardProps) {
  const [activeTab, setActiveTab] = useState<'brief' | 'consult' | 'pharma'>('brief');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat when a new disease is switched to
  useEffect(() => {
    const diseaseName = activeDisease?.name || "General Planetary Health Criteria";
    
    setChatMessages([
      {
        role: 'assistant',
        text: `### Consultation Desk • Dr. SSEMAMBO DEHIA
Welcome to my secure clinical consultation terminal. I am **Dr. SSEMAMBO DEHIA**, General Medical Director. 

I've loaded the active file for **${diseaseName}**. 
${activeDisease ? `I am prepared to discuss complex diagnostic biomarkers, cell-level pathogenesis, and immediate dosage profiles approved by global health consensus servers. How shall we formulate today's clinical approach?` : `I am analyzing the global EMR feed under the **${currentSpecialty}** focus for **${currentAgeGroup}** individuals. Please select a preset disease or query the global search engine to formulate a grounded patient whitepaper.`}`
      }
    ]);
    setChatError(null);
  }, [activeDisease?.name, currentSpecialty, currentAgeGroup]);

  // Scroll messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  const handleSendMessage = async (e?: React.FormEvent, premadePrompt?: string) => {
    if (e) e.preventDefault();
    const messageToSend = premadePrompt || chatInput;
    if (!messageToSend.trim() || chatLoading) return;

    if (!premadePrompt) {
      setChatInput('');
    }
    setChatLoading(true);
    setChatError(null);

    const updated = [...chatMessages, { role: 'user' as const, text: messageToSend }];
    setChatMessages(updated);

    try {
      const resp = await fetch('/api/chat-disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          history: chatMessages.slice(-6).map(m => ({
            role: m.role,
            content: m.text
          })),
          diseaseName: activeDisease?.name || "General Medical Guidelines",
          diseaseContext: activeDisease?.detailedAnalysis || `Active Specialty: ${currentSpecialty}. Active Cohort: ${currentAgeGroup}.`,
          vitals: vitals || null
        }),
      });

      if (!resp.ok) {
        throw new Error("Planetary consulting nodes are temporarily fully loaded. Please retry shortly.");
      }

      const data = await resp.json();
      setChatMessages([...updated, { role: 'assistant' as const, text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "An unexpected latency spike occurred on connection vectors.");
    } finally {
      setChatLoading(false);
    }
  };

  const renderMarkdownText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) {
        return <h5 key={i} className="font-sans font-bold text-xs text-indigo-800 mt-3 mb-1">{line.replace('### ', '')}</h5>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={i} className="ml-4 text-[11px] text-slate-600 list-disc my-0.5">{line.replace(/^[\s-*]+/, '')}</li>;
      }
      if (!line.trim()) return <div key={i} className="h-1" />;
      return (
        <p key={i} className="text-[11px] text-slate-700 my-1 leading-relaxed">
          {line.split('**').map((item, idx) => idx % 2 === 1 ? <strong key={idx} className="text-slate-900 font-bold">{item}</strong> : item)}
        </p>
      );
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full" id="ssemambo-assistant-dashboard">
      
      {/* Upper Branding Header with Dr. Ssemambo's breathing avatar avatar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-4 shrink-0 flex items-center justify-between border-b border-indigo-900">
        <div className="flex items-center gap-3">
          
          {/* Breathing circular avatar indicator representing advanced AI Doctor */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25"></div>
            <div className="relative h-11 w-11 rounded-full bg-indigo-600 border border-indigo-400 p-0.5 flex items-center justify-center overflow-hidden">
              <div className="bg-slate-900 w-full h-full rounded-full flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-sky-300 animate-pulse" />
                <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900"></span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-sans font-extrabold text-xs tracking-wide uppercase text-white">DR. SSEMAMBO DEHIA</h3>
              <span className="text-[8px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1 rounded font-mono font-bold tracking-wider">DIRECTOR MODEL v4</span>
            </div>
            <p className="text-[10px] text-slate-300">General AI-Based Medical Director • Planetary Health Grid</p>
          </div>

        </div>

        <div className="hidden sm:flex flex-col items-end text-right font-mono text-[8.5px] text-slate-400">
          <span>SECURE GRID CORE: OK</span>
          <span className="text-sky-400">SSEMAMBO ACTIVE</span>
        </div>
      </div>

      {/* Specialty matching overview banners */}
      <div className="bg-indigo-50/50 border-b border-slate-100 p-2.5 px-4 flex justify-between items-center text-[11px] font-semibold shrink-0">
        <span className="text-slate-600 font-sans flex items-center gap-1.5 leading-none">
          <Atom className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
          General AI Assistant Node
        </span>
        <span className="text-[10px] text-indigo-700 bg-indigo-100/70 border border-indigo-200 rounded px-1.5 scale-95 uppercase font-bold tracking-tight">
          {currentSpecialty} Specialty Active
        </span>
      </div>

      {/* Tab Selectors */}
      <div className="border-b border-slate-150 bg-slate-50 flex shrink-0">
        <button
          onClick={() => setActiveTab('brief')}
          className={`flex-1 py-2 text-[11px] font-bold border-b-2 flex items-center justify-center gap-1 cursor-pointer transition ${activeTab === 'brief' ? 'bg-white text-indigo-700 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Clinical Brief</span>
        </button>
        <button
          onClick={() => setActiveTab('consult')}
          className={`flex-1 py-2 text-[11px] font-bold border-b-2 flex items-center justify-center gap-1 cursor-pointer transition ${activeTab === 'consult' ? 'bg-white text-indigo-700 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
        >
          <HelpCircle className="w-3.5 h-3.5 animate-pulse" />
          <span>Ssemambo Q&A Desk</span>
        </button>
        <button
          onClick={() => setActiveTab('pharma')}
          className={`flex-1 py-2 text-[11px] font-bold border-b-2 flex items-center justify-center gap-1 cursor-pointer transition ${activeTab === 'pharma' ? 'bg-white text-indigo-700 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Doctor's Directives</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/20" id="ssemambo-panels-container">
        
        {/* TAB 1: Clinical Brief */}
        {activeTab === 'brief' && (
          <div className="space-y-3.5 animate-fade-in text-left">
            <div>
              <h4 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-tight mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Active Focus: {activeDisease?.name || "General Planetary Health Standard"}
              </h4>
              <p className="text-[11px] text-slate-500">
                AI Director is monitoring your active filters ({currentSpecialty} focus for {currentAgeGroup} cohort) and extracts clinical consensus in real-time.
              </p>
            </div>

            {/* Basic Info Board */}
            <div className="bg-white border border-slate-250/70 p-3 rounded-lg space-y-2.5 shadow-xs">
              <span className="text-[9px] font-extrabold uppercase font-mono text-indigo-600 tracking-wider">Planetary Database Extraction</span>
              
              <div className="space-y-2 text-[11px] leading-relaxed text-slate-600">
                {activeDisease ? (
                  <>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <strong className="text-slate-800 font-bold block mb-0.5">Abstract Definition</strong>
                      <p className="text-[10px] leading-normal font-sans italic">
                        "Grounding sources depict this as a severe medical occurrence with high dependency on prompt diagnostic intervention and specific therapeutic clearing protocols."
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
                        <strong className="text-blue-800 font-bold block mb-0.5">Pathology Risk</strong>
                        <span className="text-slate-700">Underlying organ stress triggered by cellular or physiological deviation.</span>
                      </div>
                      <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100">
                        <strong className="text-emerald-800 font-bold block mb-1">Dosing Directives</strong>
                        <span className="text-slate-700">Strict safety parameters matching age groups from newborn babies to 100 yr seniors.</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-slate-400 text-[11px] space-y-2">
                    <Activity className="w-6 h-6 text-slate-300 mx-auto animate-pulse" />
                    <p>No active dossier matched yet. Search a disease or click any preset node in the menu to trigger SSEMAMBO's detailed biochemical summary.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Ssemambo's Professional Medical Pointers */}
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg space-y-2.5 border border-slate-950">
              <div className="flex items-center gap-1 text-emerald-400">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[9px] font-extrabold uppercase tracking-wider font-mono">Dr. Ssemambo's Warning Board</span>
              </div>
              <p className="text-[10.5px] leading-relaxed text-slate-300">
                "Doctors must first authenticate the safety of the renal pathway (GFR clearance indices) and vascular compliance metrics prior to initiating high-impact therapies designed in these modules."
              </p>
              <div className="h-px bg-slate-850"></div>
              <div className="flex justify-between items-center text-[9px] text-slate-400">
                <span>CONSENSUS REGISTERED</span>
                <span className="font-mono text-emerald-400 font-bold">AUTHENTICATED OK</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Doctor Ssemambo Q&A Desk */}
        {activeTab === 'consult' && (
          <div className="flex flex-col h-[280px] animate-fade-in">
            {/* Scrollable conversation */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto space-y-2.5 pr-1 border border-slate-200/60 rounded-lg p-3 bg-slate-50 max-h-[190px]"
            >
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-1.5 max-w-[88%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                  <div className={`rounded-xl p-2.5 text-[11px] ${msg.role === 'user' ? 'bg-indigo-600 text-white text-left' : 'bg-white border border-slate-200 shadow-sm text-slate-800'}`}>
                    {msg.role === 'user' ? (
                      <p className="font-medium">{msg.text}</p>
                    ) : (
                      <div className="prose-xs">
                        {renderMarkdownText(msg.text)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-1.5 max-w-[88%] mr-auto text-left">
                  <div className="bg-white border border-slate-200 rounded-xl p-2 text-[10.5px] text-slate-450 italic flex items-center gap-1">
                    <Clock className="w-3 h-3 animate-spin text-indigo-500" />
                    Doctor Ssemambo is reviewing biochemical logs...
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-[10px] rounded-lg">
                  {chatError}
                </div>
              )}
            </div>

            {/* Easy Suggestion Buttons */}
            <div className="flex gap-1 overflow-x-auto py-1.5 shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, `Explain standard life-cycle dosage variances for elderly vs pediatric clients.`)}
                disabled={chatLoading}
                className="whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-50 text-[9px] text-slate-600 px-2 py-0.5 rounded-full transition cursor-pointer font-bold"
              >
                👶 Baby vs Senior Dosages
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, `What are the chief clinical safety traps to watch for in ${currentSpecialty}?`)}
                disabled={chatLoading}
                className="whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-50 text-[9px] text-slate-600 px-2 py-0.5 rounded-full transition cursor-pointer font-bold"
              >
                ⚠️ Specialty Pitfalls
              </button>
            </div>

            {/* Floating input bar */}
            <form onSubmit={handleSendMessage} className="flex gap-1 shrink-0 mt-1">
              <input
                type="text"
                required
                disabled={chatLoading}
                placeholder="Query Doctor SSEMAMBO directly..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] outline-none text-slate-800"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Ssemambo's Directives & classified medicine guidelines */}
        {activeTab === 'pharma' && (
          <div className="space-y-3 animate-fade-in text-left">
            <div>
              <h4 className="font-sans font-bold text-xs text-slate-850 uppercase tracking-tight mb-1 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-500" />
                Consensus Directives & Safety Matrices
              </h4>
              <p className="text-[10.5px] text-slate-500">
                Doctor SSEMAMBO DEHIA enforces rigorous rules that support international clinical practice guidelines.
              </p>
            </div>

            <div className="space-y-2 text-[10.5px]">
              
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Clinical Contraindication Rule #1</span>
                </div>
                <p className="text-slate-600 leading-normal font-sans">
                  Never prescribe vaso-active agents or neurochemical triggers in infants or geriatric seniors without real-time GFR clearance calculation.
                </p>
              </div>

              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-800">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>Interactive Real-time Verification</span>
                </div>
                <p className="text-slate-600 leading-normal font-sans">
                  Always leverage the **EMR Fingerprint Capillary Scanner** at the top cockpit to verify continuous heart BPM and oxygen rate before approving medication charts.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer Network Indicator */}
      <div className="bg-slate-100 p-2 border-t border-slate-150 flex justify-between items-center text-[9px] font-mono text-slate-500 shrink-0">
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-indigo-500 animate-pulse" />
          Planetary Hospital Registry Node Sync
        </span>
        <span className="text-indigo-600 font-bold uppercase">SSEMAMBO ENCRYPTED</span>
      </div>

    </div>
  );
}
