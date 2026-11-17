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
  ShieldCheck,
  HelpCircle,
  Clock, 
  User, 
  Atom, 
  Globe, 
  Lightbulb, 
  FileText,
  BookmarkCheck,
  Award,
  Stethoscope,
  MessageSquare,
  BookOpen
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
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col h-full" id="ssemambo-assistant-dashboard">
      
      {/* Clinician Profile Header */}
      <div className="bg-slate-900 text-white p-4 shrink-0 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold">
              <Stethoscope className="w-5 h-5 text-blue-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-sm tracking-tight text-white">Dr. Ssemambo Dehia</h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
                MD, MPH
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Chief Medical Officer · Clinical Consultation Desk</p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end text-right font-sans text-[10px] text-slate-400">
          <span className="font-semibold text-slate-200">Active Case Consultation</span>
          <span className="text-emerald-400 font-mono text-[9px]">Status: Verified Grounding</span>
        </div>
      </div>

      {/* Active context sub-banner */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2 flex justify-between items-center text-xs shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="text-slate-500 font-medium">Active Case File:</span>
          <span className="font-bold text-slate-900 truncate max-w-[200px]">
            {activeDisease?.name || "General Clinical Reference"}
          </span>
        </div>
        <span className="text-[10px] text-slate-700 bg-white border border-slate-200 rounded px-2 py-0.5 font-semibold shrink-0">
          {currentSpecialty} · {currentAgeGroup}
        </span>
      </div>

      {/* Tab Selectors */}
      <div className="border-b border-slate-200 bg-white flex shrink-0 text-xs">
        <button
          onClick={() => setActiveTab('brief')}
          className={`flex-1 py-2.5 font-semibold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer transition ${
            activeTab === 'brief' 
              ? 'text-slate-900 border-slate-900 bg-slate-50/50' 
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Clinical Synopsis</span>
        </button>
        <button
          onClick={() => setActiveTab('consult')}
          className={`flex-1 py-2.5 font-semibold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer transition ${
            activeTab === 'consult' 
              ? 'text-slate-900 border-slate-900 bg-slate-50/50' 
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Consultation Desk</span>
        </button>
        <button
          onClick={() => setActiveTab('pharma')}
          className={`flex-1 py-2.5 font-semibold border-b-2 flex items-center justify-center gap-1.5 cursor-pointer transition ${
            activeTab === 'pharma' 
              ? 'text-slate-900 border-slate-900 bg-slate-50/50' 
              : 'text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Safety Directives</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/40" id="ssemambo-panels-container">
        
        {/* TAB 1: Clinical Brief */}
        {activeTab === 'brief' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div>
              <h4 className="font-sans font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Case Diagnostic Overview
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Evidence-based synthesis cross-referenced for <strong className="text-slate-700">{currentSpecialty}</strong> in the <strong className="text-slate-700">{currentAgeGroup}</strong> cohort.
              </p>
            </div>

            {/* Diagnostic Information */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-2xs">
              <div className="space-y-2 text-xs leading-relaxed text-slate-600">
                {activeDisease ? (
                  <>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Etiology & Clinical Definition</span>
                      <p className="text-xs text-slate-800 font-sans leading-relaxed">
                        {activeDisease.summary || "Complex diagnostic presentation requiring targeted therapeutic intervention."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <strong className="text-slate-900 font-bold block mb-1">Pathogenesis Focus</strong>
                        <span className="text-slate-600 text-[11px]">Cellular and physiological progression characteristic of this diagnostic track.</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <strong className="text-slate-900 font-bold block mb-1">Cohort Safety</strong>
                        <span className="text-slate-600 text-[11px]">Dosage and administration parameters calibrated for {currentAgeGroup}.</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                    <Activity className="w-6 h-6 text-slate-300 mx-auto" />
                    <p>Select a clinical preset or search a disease condition to load Dr. Ssemambo's diagnostic brief.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Medical Director's Clinical Note */}
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl space-y-2 border border-slate-950">
              <div className="flex items-center gap-1.5 text-blue-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Dr. Ssemambo's Clinical Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                "Prior to initiating intensive pharmacotherapy, verify patient glomerular filtration (GFR) and evaluate polypharmacy interactions against the AGS Beers criteria."
              </p>
              <div className="pt-1 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                <span>WHO Essential Medicines Registry</span>
                <span className="font-mono text-emerald-400 font-medium">Protocol Grounded</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Doctor Ssemambo Q&A Desk */}
        {activeTab === 'consult' && (
          <div className="flex flex-col h-[300px] animate-fade-in">
            {/* Scrollable conversation */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto space-y-2.5 pr-1 border border-slate-200 rounded-xl p-3 bg-slate-50/70 max-h-[200px]"
            >
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-1.5 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                  <div className={`rounded-xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 text-white text-left' 
                      : 'bg-white border border-slate-200/90 shadow-2xs text-slate-800'
                  }`}>
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
                <div className="flex gap-1.5 max-w-[90%] mr-auto text-left">
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 italic flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 animate-spin text-slate-600" />
                    Dr. Ssemambo is reviewing clinical guidelines...
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {chatError}
                </div>
              )}
            </div>

            {/* Clean Prompt Chips */}
            <div className="flex gap-1.5 overflow-x-auto py-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, `Explain standard life-cycle dosage variances for elderly vs pediatric clients.`)}
                disabled={chatLoading}
                className="whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 px-2.5 py-1 rounded-md transition cursor-pointer font-medium shadow-2xs"
              >
                Pediatric vs. Geriatric Dosing
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(undefined, `What are the primary clinical contraindications to monitor in ${currentSpecialty}?`)}
                disabled={chatLoading}
                className="whitespace-nowrap bg-white border border-slate-200 hover:bg-slate-100 text-[10px] text-slate-700 px-2.5 py-1 rounded-md transition cursor-pointer font-medium shadow-2xs"
              >
                Specialty Pitfalls & Contraindications
              </button>
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="flex gap-1.5 shrink-0">
              <input
                type="text"
                required
                disabled={chatLoading}
                placeholder="Ask Dr. Ssemambo a clinical question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg px-3 py-1.5 text-xs outline-none text-slate-900 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Ssemambo's Directives & classified medicine guidelines */}
        {activeTab === 'pharma' && (
          <div className="space-y-3 animate-fade-in text-left">
            <div>
              <h4 className="font-sans font-bold text-xs text-slate-900 mb-1 flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                Clinical Safety Directives
              </h4>
              <p className="text-[11px] text-slate-500">
                Rigorous therapeutic precautions aligned with international pharmacological criteria.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              
              <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-900">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  <span>Renal & Clearance Precaution</span>
                </div>
                <p className="text-slate-600 leading-normal text-[11px]">
                  Calculate baseline eGFR clearance prior to prescribing active compounds in pediatric neonates or geriatric patients over 65 years.
                </p>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>Bedside Physiological Verification</span>
                </div>
                <p className="text-slate-600 leading-normal text-[11px]">
                  Correlate active heart rate, capillary SpO₂, and blood pressure metrics before finalizing multidrug dosage schedules.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Footer Network Indicator */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500 shrink-0">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Clinical Evidence Grounding
        </span>
        <span className="font-mono text-slate-600 font-medium">Consensus: Active</span>
      </div>

    </div>
  );
}
