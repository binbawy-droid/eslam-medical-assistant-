/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, AgeGroup, MedicalSpecialty, DiseaseInfo, PrescriptionAnalysisResult } from './types';
import LoginModal from './components/LoginModal';
import DiseaseSearchEngine from './components/DiseaseSearchEngine';
import PrescriptionAnalyzer from './components/PrescriptionAnalyzer';
import ClinicalDosageGuide from './components/ClinicalDosageGuide';
import VitalCapillaryScanner from './components/VitalCapillaryScanner';
import DoctorSsemamboDashboard from './components/DoctorSsemamboDashboard';
import { 
  Heart, 
  Brain, 
  Activity, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  Server, 
  Globe, 
  Database, 
  Info, 
  Layout, 
  AlertTriangle, 
  Cpu, 
  FileText, 
  BookOpen, 
  RotateCcw,
  ListFilter,
  Clock
} from 'lucide-react';

export default function App() {
  // Store the active logged in clinician or patient
  const [profile, setProfile] = useState<UserProfile | null>({
    id: "p1",
    name: "Dr. Evelyn Brain",
    age: 42,
    ageGroup: "Adults",
    specialtyFocus: "Neurology",
    email: "evelyn.brain@healthai.int",
    gender: "Female",
    weightKg: 65,
    chronicConditions: ["None"],
    allergies: ["Penicillin"]
  });

  // Track the switched disease currently charted/searched
  const [activeDiseaseSheet, setActiveDiseaseSheet] = useState<DiseaseInfo | null>(null);

  // Active Electronic Medical Record (EMR) Biometrics from Fingerprint Spectrometer
  const [emrVitals, setEmrVitals] = useState<{
    bpm: number;
    spo2: number;
    bpSystolic: number;
    bpDiastolic: number;
    rbcCount: number;
    hemoglobin: number;
    scannedAt: string;
  } | null>(null);

  // Active filters controlled by clicking the Sidebar, preset selectors, or profile changes
  const [activeSpecialty, setActiveSpecialty] = useState<MedicalSpecialty>("Neurology");
  const [activeAgeGroup, setActiveAgeGroup] = useState<AgeGroup>("Adults");

  // Track session selection history
  const [filterHistory, setFilterHistory] = useState<Array<{
    timestamp: string;
    specialty: MedicalSpecialty;
    ageGroup: AgeGroup;
  }>>([]);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(true);

  // Sync state and log to history on change
  useEffect(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFilterHistory(prev => {
      // Avoid duplicate logs if the last log is the same as current
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (last.specialty === activeSpecialty && last.ageGroup === activeAgeGroup) {
          return prev;
        }
      }
      return [
        ...prev,
        {
          timestamp: timeStr,
          specialty: activeSpecialty,
          ageGroup: activeAgeGroup
        }
      ];
    });
  }, [activeSpecialty, activeAgeGroup]);

  // Keep filters in sync when a profile logins
  useEffect(() => {
    if (profile) {
      setActiveSpecialty(profile.specialtyFocus);
      setActiveAgeGroup(profile.ageGroup);
    }
  }, [profile]);

  // Telemetry indicators that shift realistically depending on the active specialization
  const [telemetry, setTelemetry] = useState({
    metricA: { label: "Cerebral Flow", val: "94.2%", ratio: "4/5", color: "bg-indigo-500" },
    metricB: { label: "Myelin Integrity", val: "0.88", ratio: "3/4", color: "bg-violet-500" },
    metricC: { label: "Seizure Frequency", val: "Sub-clinical", ratio: "1/5", color: "bg-teal-500" },
    metricD: { label: "Cortical Signal Loss", val: "Minimal", ratio: "1/4", color: "bg-emerald-500" }
  });

  useEffect(() => {
    if (activeSpecialty === 'Cardiology') {
      setTelemetry({
        metricA: { label: "Ejection Fraction", val: "61.2%", ratio: "4/5", color: "bg-rose-500" },
        metricB: { label: "Arrhythmia Index", val: "0.14 Q-t", ratio: "1/4", color: "bg-amber-500" },
        metricC: { label: "Vasolidation", val: "Stable", ratio: "3/5", color: "bg-blue-500" },
        metricD: { label: "Myocardial Stress Factor", val: "Low Profile", ratio: "2/5", color: "bg-rose-600" }
      });
    } else if (activeSpecialty === 'Hematology') {
      setTelemetry({
        metricA: { label: "Hemoglobin S Index", val: "11.4 g/dL", ratio: "3/5", color: "bg-indigo-500" },
        metricB: { label: "Thrombosis Coagulation", val: "1.05 INR", ratio: "2/4", color: "bg-orange-500" },
        metricC: { label: "Leukocyte Concentration", val: "Normal", ratio: "4/5", color: "bg-teal-500" },
        metricD: { label: "Planetary Strain Load", val: "Optimal Balance", ratio: "1/5", color: "bg-cyan-500" }
      });
    } else if (activeSpecialty === 'Neurology') {
      setTelemetry({
        metricA: { label: "Cerebral Flow Ratio", val: "94.2%", ratio: "4/5", color: "bg-violet-500" },
        metricB: { label: "Synaptic Latency", val: "0.88 ms", ratio: "3/4", color: "bg-purple-500" },
        metricC: { label: "Spasm Probability", val: "Sub-clinical", ratio: "1/5", color: "bg-fuchsia-500" },
        metricD: { label: "Cortical Stress Load", val: "Low Factor", ratio: "1/4", color: "bg-indigo-500" }
      });
    } else if (activeSpecialty === 'Oncology') {
      setTelemetry({
        metricA: { label: "Mitotic Activity", val: "Controlled", ratio: "4/5", color: "bg-rose-500" },
        metricB: { label: "TKI Serum Conc", val: "0.41 mcg/L", ratio: "3/4", color: "bg-rose-600" },
        metricC: { label: "Myeloid Blast count", val: "< 5%", ratio: "1/5", color: "bg-teal-500" },
        metricD: { label: "ANC Status", val: "Safe Limit", ratio: "4/5", color: "bg-emerald-500" }
      });
    } else if (activeSpecialty === 'Nephrology') {
      setTelemetry({
        metricA: { label: "Phosphate Level", val: "4.2 mg/dL", ratio: "4/5", color: "bg-sky-500" },
        metricB: { label: "Urea Clearance", val: "72 mL/min", ratio: "3/4", color: "bg-sky-600" },
        metricC: { label: "Urine Protein g/d", val: "0.25 g", ratio: "1/5", color: "bg-teal-500" },
        metricD: { label: "Alkaline Poptas", val: "Optimal", ratio: "3/5", color: "bg-cyan-500" }
      });
    } else if (activeSpecialty === 'Endocrinology') {
      setTelemetry({
        metricA: { label: "HbA1c Ratio", val: "6.2%", ratio: "4/5", color: "bg-amber-500" },
        metricB: { label: "Fast Plasma Gluc", val: "105 mg/dL", ratio: "3/4", color: "bg-amber-600" },
        metricC: { label: "Insulin Sensitivity", val: "Elevated", ratio: "3/5", color: "bg-teal-500" },
        metricD: { label: "Amylin Response", val: "Normal", ratio: "1/4", color: "bg-emerald-500" }
      });
    } else if (activeSpecialty === 'Immunology') {
      setTelemetry({
        metricA: { label: "C-Reactive Protein", val: "1.2 mg/L", ratio: "5/5", color: "bg-fuchsia-500" },
        metricB: { label: "IgG Concentr", val: "940 mg/dL", ratio: "3/4", color: "bg-fuchsia-600" },
        metricC: { label: "ANA Auto-antibody", val: "Negative", ratio: "1/5", color: "bg-teal-500" },
        metricD: { label: "T-Cell Cd4 Ratio", val: "Stable", ratio: "1/4", color: "bg-indigo-500" }
      });
    } else if (activeSpecialty === 'Pediatrics') {
      setTelemetry({
        metricA: { label: "Growth Percentile", val: "75th Pctl", ratio: "5/5", color: "bg-indigo-500" },
        metricB: { label: "Bilirubin Index", val: "0.8 mg/dL", ratio: "4/4", color: "bg-indigo-600" },
        metricC: { label: "Neonatal Spasm Rate", val: "0 detected", ratio: "1/5", color: "bg-teal-500" },
        metricD: { label: "Oxygen Sat SpO2", val: "99%", ratio: "5/5", color: "bg-emerald-500" }
      });
    } else if (activeSpecialty === 'Geriatrics') {
      setTelemetry({
        metricA: { label: "Cognitive MMSE", val: "28 / 30", ratio: "4/5", color: "bg-teal-500" },
        metricB: { label: "Beers Hazard Count", val: "0 contra-ind", ratio: "4/4", color: "bg-teal-600" },
        metricC: { label: "Polypharmacy Count", val: "3 medicines", ratio: "2/5", color: "bg-amber-500" },
        metricD: { label: "GFR Cleared Ratio", val: "Stable clearance", ratio: "3/5", color: "bg-purple-500" }
      });
    } else {
      setTelemetry({
        metricA: { label: "Neonatal Growth Index", val: "1.02-SD", ratio: "5/5", color: "bg-emerald-500" },
        metricB: { label: "Intercellular Fluidity", val: "0.91", ratio: "3/4", color: "bg-teal-500" },
        metricC: { label: "Pediatric Clearance", val: "Fully Active", ratio: "2/5", color: "bg-indigo-500" },
        metricD: { label: "Geriatric Beers Warning", val: "Operational", ratio: "1/4", color: "bg-blue-500" }
      });
    }
  }, [activeSpecialty]);

  // Dynamic state representation for life-cycle risk analysis table
  const getRiskMatrix = () => {
    if (activeSpecialty === 'Cardiology') {
      return [
        { age: "Babies (0-2)", risk: "Congenital Defects (ToF/VSD)", severity: "Critical", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Node-1.02" },
        { age: "Children (3-12)", risk: "Rheumatic/Kawasaki Coronary Risk", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Sector-9.4" },
        { age: "Adults (20-59)", risk: "Atherosclerotic Ischemic Distress", severity: "Moderate Trace", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "Cluster-A" },
        { age: "Geriatrics (60-100)", risk: "Congestive Output Volume Failure", severity: "Critical Risk", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Node-9.82" }
      ];
    } else if (activeSpecialty === 'Hematology') {
      return [
        { age: "Babies (0-2)", risk: "Hemolytic Antibody Alloimmunity", severity: "Critical", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Neonatal-3" },
        { age: "Children (3-12)", risk: "Vaso-Occlusive Sickly Thrombi", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Node-Beta" },
        { age: "Adults (20-59)", risk: "Hypercoagulable Venous Thromboembolism", severity: "Moderate Trace", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "Vessel-4A" },
        { age: "Geriatrics (60-100)", risk: "Refractory Oncology Cytopenias", severity: "High Warning", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Geriatric-72" }
      ];
    } else if (activeSpecialty === 'Neurology') {
      return [
        { age: "Babies (0-2)", risk: "Encephalopathic West Spasms", severity: "Critical", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Cereb-X" },
        { age: "Children (3-12)", risk: "Juvenile Absence Staring Spells", severity: "Moderate Trace", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "A-Absent" },
        { age: "Adults (20-59)", risk: "Demyelinating Multiple Sclerosis", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Cluster-Neuro" },
        { age: "Geriatrics (60-100)", risk: "Neurodegenerative Amyloid Dementia", severity: "Critical Risk", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Node-Cogni" }
      ];
    } else if (activeSpecialty === 'Oncology') {
      return [
        { age: "Babies (0-2)", risk: "Hereditary Retinoblastoma / ATRT high risk", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Onco-Ped" },
        { age: "Children (3-12)", risk: "Acute Lymphoblastic Leukemia (ALL)", severity: "Critical Check", severityColor: "bg-red-50 text-red-700 border-red-200", node: "All-9.2" },
        { age: "Adults (20-59)", risk: "BCR-ABL Myelogenous Translocation", severity: "Moderate Target", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "Node-Gleevec" },
        { age: "Geriatrics (60-100)", risk: "Refractory Myelodysplastic Cytopenia", severity: "High Risk", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Node-MDS" }
      ];
    } else if (activeSpecialty === 'Nephrology') {
      return [
        { age: "Babies (0-2)", risk: "Congenital Nephrotic Micro-clearance", severity: "Critical Risk", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Renal-0" },
        { age: "Children (3-12)", risk: "Post-Streptococcal Vasculitis", severity: "Moderate Concern", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-250", node: "Glom-B" },
        { age: "Adults (20-59)", risk: "Proteinuric Diabetic Nephropathy", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "GFR-45" },
        { age: "Geriatrics (60-100)", risk: "Dialysis Hyperphosphatemia bone-mineral", severity: "Severe Warning", severityColor: "bg-red-50 text-red-700 border-red-200", node: "KDOQI-Node" }
      ];
    } else if (activeSpecialty === 'Endocrinology') {
      return [
        { age: "Babies (0-2)", risk: "Congenital Hypothyroidism Markers", severity: "High Warning", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Endo-01" },
        { age: "Children (3-12)", risk: "Type 1 Juvenile Ketoacidosis (DKA)", severity: "Critical Check", severityColor: "bg-red-50 text-red-700 border-red-200", node: "DKA-Check" },
        { age: "Adults (20-59)", risk: "Insulin Resistant Biguanide Sync", severity: "Moderate Index", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "HbA1c-Ref" },
        { age: "Geriatrics (60-100)", risk: "Geriatric Hypoglycemic Auton. Failure", severity: "Critical Risk", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Beers-Endo" }
      ];
    } else if (activeSpecialty === 'Immunology') {
      return [
        { age: "Babies (0-2)", risk: "SCID Immunodeficiency Screening", severity: "Critical Risk", severityColor: "bg-red-50 text-red-700 border-red-200", node: "SCID-Node" },
        { age: "Children (3-12)", risk: "Juvenile Idiopathic Polyarthritis", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "JIA-Track" },
        { age: "Adults (20-59)", risk: "Systemic Lupus Erythematosus Flare", severity: "Moderate Flare", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "SLE-Flare" },
        { age: "Geriatrics (60-100)", risk: "Corticosteroid Osteopenic Fragility", severity: "High Caution", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Bone-82" }
      ];
    } else if (activeSpecialty === 'Pediatrics') {
      return [
        { age: "Babies (0-2)", risk: "Neonatal Respiratory Distress Syndrome", severity: "Critical", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Neonat-1" },
        { age: "Children (3-12)", risk: "Acute Bronchial Asthma Airways", severity: "High Severity", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Ped-Air" },
        { age: "Adults (20-59)", risk: "Transition to Systemic Care", severity: "Low", severityColor: "bg-slate-100 text-slate-500 border-slate-200", node: "N/A" },
        { age: "Geriatrics (60-100)", risk: "Immunology Decline Reference", severity: "Low Check", severityColor: "bg-slate-100 text-slate-500 border-slate-200", node: "N/A" }
      ];
    } else if (activeSpecialty === 'Geriatrics') {
      return [
        { age: "Babies (0-2)", risk: "Ineligible Cohort Mismatch", severity: "Low", severityColor: "bg-slate-100 text-slate-500 border-slate-200", node: "N/A" },
        { age: "Children (3-12)", risk: "Ineligible Cohort Mismatch", severity: "Low", severityColor: "bg-slate-100 text-slate-500 border-slate-200", node: "N/A" },
        { age: "Adults (20-59)", risk: "Slowing Metabolism Sync", severity: "Moderate", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-200", node: "N/A" },
        { age: "Geriatrics (60-100)", risk: "Beers Polypharmacy Intersectional Syndrome", severity: "Critical Warning", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Beers-100" }
      ];
    } else {
      return [
        { age: "Babies (0-2)", risk: "Renal Clearance Liquid Doses", severity: "High Concern", severityColor: "bg-orange-50 text-orange-700 border-orange-200", node: "Ped-01" },
        { age: "Children (3-12)", risk: "Severe Acute Asthma Hypoxia", severity: "Moderate Trace", severityColor: "bg-yellow-50 text-yellow-700 border-yellow-250", node: "Air-Node" },
        { age: "Adults (20-59)", risk: "Metabolic Diabetic Neuropathy", severity: "Low Index", severityColor: "bg-sky-50 text-sky-700 border-sky-100", node: "Metab-9B" },
        { age: "Geriatrics (60-100)", risk: "Beers-Criteria Polypharmacy Risk", severity: "Severe Warning", severityColor: "bg-red-50 text-red-700 border-red-200", node: "Geriatric-X" }
      ];
    }
  };

  const handleSidebarSpecialtyChange = (spec: MedicalSpecialty) => {
    setActiveSpecialty(spec);
  };

  const handleSidebarAgeGroupChange = (age: AgeGroup) => {
    setActiveAgeGroup(age);
  };

  const syncStateFromPresets = (spec: MedicalSpecialty, age: AgeGroup) => {
    setActiveSpecialty(spec);
    setActiveAgeGroup(age);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900 overflow-hidden" id="applet-primary-container">
      
      {/* Top Clinical Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm" id="aether-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold tracking-tight shadow-md">
            Æ
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-800 uppercase flex items-center gap-1.5 leading-none">
              Aether Health <span className="text-blue-600 block">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Global Clinical Portal</span>
          </div>
        </div>

        {/* Dynamic header information display */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 border-l border-slate-100 pl-6 flex-1 max-w-xl">
          <div className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono">
              Cluster Node: <strong className="text-slate-800 font-semibold font-sans">EUR-WEST-PRIME</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono">
              Consensus: <strong className="text-slate-800 font-semibold font-sans">WHO + PubMed Grounded</strong>
            </span>
          </div>
        </div>

        {/* User Login Section Trigger */}
        <div className="flex items-center gap-3">
          <LoginModal 
            currentProfile={profile} 
            onLogin={(newProfile) => {
              setProfile(newProfile);
            }} 
            onLogout={() => setProfile(null)} 
          />
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden" id="workspace-layout">
        
        {/* Sidebar Navigation Panel */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden lg:flex" id="control-sidebar">
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            
            {/* Specialization Section */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Disease Tracks</span>
                <ListFilter className="w-3 h-3 text-slate-400" />
              </p>
              <nav className="space-y-1">
                {(['Cardiology', 'Hematology', 'Neurology', 'Pediatrics', 'Geriatrics', 'Oncology', 'Nephrology', 'Endocrinology', 'Immunology', 'General'] as MedicalSpecialty[]).map((spec) => {
                  const isActive = activeSpecialty === spec;
                  return (
                    <button
                      key={spec}
                      onClick={() => handleSidebarSpecialtyChange(spec)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-tight transition ${
                        isActive 
                          ? "bg-blue-50 text-blue-700 border border-blue-105 border-blue-100" 
                          : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          spec === 'Cardiology' ? "bg-red-500" :
                          spec === 'Hematology' ? "bg-emerald-500" :
                          spec === 'Neurology' ? "bg-violet-500" :
                          spec === 'Pediatrics' ? "bg-indigo-500" :
                          spec === 'Geriatrics' ? "bg-teal-500" :
                          spec === 'Oncology' ? "bg-rose-500" :
                          spec === 'Nephrology' ? "bg-sky-500" :
                          spec === 'Endocrinology' ? "bg-amber-500" :
                          spec === 'Immunology' ? "bg-fuchsia-500" : "bg-blue-550"
                        }`} />
                        <span>{spec}</span>
                      </div>
                      {isActive && <span className="text-[8px] bg-blue-100 text-blue-700 px-1 rounded font-mono">ON</span>}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Demographic Cohort Selectors */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>Demographics (Age Base)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Babies', 'Children', 'Teenagers', 'Adults', 'Seniors'] as AgeGroup[]).map((ageGrp) => {
                  const isActive = activeAgeGroup === ageGrp;
                  return (
                    <button
                      key={ageGrp}
                      onClick={() => handleSidebarAgeGroupChange(ageGrp)}
                      className={`px-2 py-1.5 text-[10px] text-center font-bold border rounded-lg transition ${
                        isActive 
                          ? "bg-slate-900 text-white border-slate-950 shadow-sm" 
                          : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {ageGrp}
                      <span className="block text-[8px] opacity-60 font-mono font-normal">
                        {ageGrp === 'Babies' && '0-2 yr'}
                        {ageGrp === 'Children' && '3-12 yr'}
                        {ageGrp === 'Teenagers' && '13-19 yr'}
                        {ageGrp === 'Adults' && '20-59 yr'}
                        {ageGrp === 'Seniors' && '60-100 yr'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Connection Stats */}
            <div className="pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[10px] uppercase">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  <span>Earth Data Servers</span>
                </div>
                <div className="space-y-1 text-[10px] text-slate-500 font-mono">
                  <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span>WHO Index Cache:</span>
                    <span className="text-emerald-600 font-semibold font-sans">Syncing</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                    <span>Clinical trials:</span>
                    <span className="text-slate-800">420 Million</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Refresh:</span>
                    <span className="text-slate-800">2ms ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Operational Status Footer Card */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="bg-blue-600 rounded-xl p-4 text-white shadow-md">
              <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest">Aether AI Status</p>
              <h4 className="text-base font-extrabold tracking-tight">Fully Operational</h4>
              
              <div className="mt-3 bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[96%] animate-pulse"></div>
              </div>
              <p className="text-[9px] mt-2 opacity-90 leading-normal">
                Connected with 4.2PB global medicine assets securely
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Workspace Content (high dense grid cockpit) */}
        <main className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50 flex flex-col" id="clinical-cockpit">
          
          {/* Top dynamic filters overlay banner for mobile/tablet where sidebar is hidden */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-xl lg:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 font-sans uppercase">Active Target:</span>
              <div className="flex gap-1.5">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded">
                  {activeSpecialty} Focus
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded">
                  Cohort: {activeAgeGroup}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <select 
                value={activeSpecialty} 
                onChange={(e) => setActiveSpecialty(e.target.value as MedicalSpecialty)}
                className="bg-slate-50 border border-slate-200 rounded text-[11px] p-1 font-bold"
              >
                <option value="General">General</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Hematology">Hematology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Geriatrics">Geriatrics</option>
                <option value="Oncology">Oncology</option>
                <option value="Nephrology">Nephrology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Immunology">Immunology</option>
              </select>
              <select 
                value={activeAgeGroup} 
                onChange={(e) => setActiveAgeGroup(e.target.value as AgeGroup)}
                className="bg-slate-50 border border-slate-200 rounded text-[11px] p-1 font-bold"
              >
                <option value="Babies">Babies</option>
                <option value="Children">Children</option>
                <option value="Teenagers">Teenagers</option>
                <option value="Adults">Adults</option>
                <option value="Seniors">Seniors</option>
              </select>
            </div>
          </div>

          {/* Interactive Capillary Scanner Widget */}
          <div className="shrink-0" id="capillary-scanner-section">
            <VitalCapillaryScanner 
              selectedAgeGroup={activeAgeGroup}
              onCommitToEMR={(vitals) => setEmrVitals(vitals)}
            />
          </div>

          {/* Row 1: Prescription OCR Analyser (Left) & Planet Node Telemetry stream (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 shrink-0" id="analytics-grid-row">
            
            {/* Scanned upload analyzer container */}
            <div className="xl:col-span-5 h-full flex flex-col">
              <PrescriptionAnalyzer 
                userProfile={profile} 
                onAnalysisSuccess={() => {}} 
              />
            </div>

            {/* Earth Data Core Status Correlation */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm xl:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4.5 h-4.5 text-slate-500" />
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">
                      Earth-Node Correlation metrics <span className="text-slate-400 font-normal font-mono text-[10px] ml-1">Live streaming telemetry</span>
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic mb-4">
                  "AI is cross-referencing global database clusters for <span className="text-blue-600 font-bold">{activeSpecialty}</span> under patient parameters representing {activeAgeGroup}."
                </p>

                {/* Live EMR Vitals banner overlay once committed */}
                {emrVitals && (
                  <div className="mb-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-slate-800 animate-fade-in" id="active-emr-sensor-banner">
                    <div className="flex items-center gap-2">
                      <div className="p-1 px-1.5 bg-emerald-600 rounded text-white text-[8px] font-mono font-bold uppercase tracking-wider">
                        EMR ACTIVE
                      </div>
                      <div>
                        <span className="block text-[10px] font-extrabold text-slate-900 leading-none">
                          Capillary Biometrics Synchronized
                        </span>
                        <span className="block text-[8.5px] text-slate-500 font-mono">
                          Physiologic capture • {emrVitals.scannedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold font-mono">
                      <div className="text-center">
                        <span className="block text-[7.5px] text-slate-400 font-sans uppercase">Heart BPM</span>
                        <span className="text-slate-900 font-extrabold font-mono">{emrVitals.bpm}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[7.5px] text-slate-400 font-sans uppercase">Oxygen SpO₂</span>
                        <span className="text-blue-600 font-extrabold font-mono">{emrVitals.spo2}%</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[7.5px] text-slate-400 font-sans uppercase">BP Pressure</span>
                        <span className="text-slate-900 font-extrabold font-mono">{emrVitals.bpSystolic}/{emrVitals.bpDiastolic}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[7.5px] text-slate-400 font-sans uppercase">RBC M/µL</span>
                        <span className="text-slate-900 font-extrabold font-mono">{emrVitals.rbcCount}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Telemetry dials mapping directly to specialty filters dynamically */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{telemetry.metricA.label}</p>
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">{telemetry.metricA.val}</p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${telemetry.metricA.color} rounded-full`} style={{ width: "80%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{telemetry.metricB.label}</p>
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">{telemetry.metricB.val}</p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${telemetry.metricB.color} rounded-full`} style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{telemetry.metricC.label}</p>
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">{telemetry.metricC.val}</p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${telemetry.metricC.color} rounded-full`} style={{ width: "25%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{telemetry.metricD.label}</p>
                    <p className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">{telemetry.metricD.val}</p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${telemetry.metricD.color} rounded-full`} style={{ width: "40%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informative nodes */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-[10px] text-slate-500 gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-blue-100 border border-blue-400"></div> 
                    <span>N-America Primary Load</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-400"></div> 
                    <span>Asia-Pacific Cluster Node</span>
                  </div>
                </div>
                <span className="font-mono text-[9px] bg-slate-100 px-1.5 p-0.5 rounded text-slate-600">
                  Secure Server Farm Hash: 4A-9B-CERN
                </span>
              </div>
            </div>

          </div>

          {/* Row 2: Clinical Search Dossiers & Full Life-Cycle Risk Matrix */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5" id="dossiers-and-matrix-row">
            
            {/* AI Clinical search dossiers component */}
            <div className="xl:col-span-7 flex flex-col">
              <DiseaseSearchEngine 
                userProfile={profile} 
                activeSpecialty={activeSpecialty}
                activeAgeGroup={activeAgeGroup}
                onFilterChange={syncStateFromPresets}
                onSearchPerform={(sheet) => setActiveDiseaseSheet(sheet)}
                vitals={emrVitals}
              />
            </div>

            {/* Right side co-pilot controls stack */}
            <div className="xl:col-span-5 flex flex-col gap-5">
              
              {/* Doctor Ssemambo Specialized AI Assistant Dashboard */}
              <DoctorSsemamboDashboard
                activeDisease={activeDiseaseSheet}
                vitals={emrVitals}
                currentSpecialty={activeSpecialty}
                currentAgeGroup={activeAgeGroup}
              />

              {/* Life-Cycle demographic matrix based on selected filters */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit">
                
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                      Life-Cycle Clinical risk analysis ({activeSpecialty})
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">Interactive Node Feed</span>
                </div>

                <div className="p-4 flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100">
                        <th className="pb-2">Age Bracket</th>
                        <th className="pb-2">Extracted Primary Concern</th>
                        <th className="pb-2">Severity Check</th>
                        <th className="pb-2 text-right">Cluster</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                      {getRiskMatrix().map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition">
                          <td className="py-2.5 font-sans whitespace-nowrap">{row.age}</td>
                          <td className="py-2.5 text-slate-600 pr-1.5">{row.risk}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-full ${row.severityColor}`}>
                              {row.severity}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-mono text-[9px] text-slate-450">{row.node}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Status metrics footer info bar */}
                <div className="p-3 bg-slate-900 text-slate-400 text-[10px] flex justify-between items-center shrink-0">
                  <span className="flex items-center gap-1 leading-none">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block"></span>
                    Active Earth Sync: Continuous Stream
                  </span>
                  <span className="text-blue-400 font-semibold uppercase hover:underline cursor-pointer">
                    Data Registry: CERN-WHO-NCI
                  </span>
                </div>

              </div>

              {/* Timestamped Sequence of Medical Filters History Drawer */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-fit animate-fade-in" id="filter-history-drawer">
                <button
                  type="button"
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="w-full text-left p-4 bg-slate-50/50 flex justify-between items-center outline-none transition duration-150 hover:bg-slate-100/50"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                        Session Filter Audit Log
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                        {filterHistory.length === 1 ? '1 state' : `${filterHistory.length} states`} logged this session
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="text-[9px] font-mono bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                      {isHistoryExpanded ? 'Collapse' : 'Expand'}
                    </span>
                  </div>
                </button>

                {isHistoryExpanded && (
                  <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/30">
                    {filterHistory.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic text-center py-2">
                        No filter history recorded in this session.
                      </p>
                    ) : (
                      <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1" id="history-scroll-container">
                        {filterHistory.map((item, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setActiveSpecialty(item.specialty);
                              setActiveAgeGroup(item.ageGroup);
                            }}
                            className="group flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50/40 hover:border-indigo-200/80 transition duration-100 cursor-pointer text-left"
                            title="Click to restore this combination"
                          >
                            <div className="flex items-center gap-2 text-[10.5px]">
                              <span className="text-slate-400 text-[9px] font-mono leading-none">
                                [{item.timestamp}]
                              </span>
                              <span className="font-sans font-bold text-slate-700">
                                {item.specialty}
                              </span>
                              <span className="text-slate-350 font-sans">•</span>
                              <span className="text-slate-500 font-sans font-medium">
                                {item.ageGroup}
                              </span>
                            </div>
                            <span className="opacity-0 group-hover:opacity-100 text-[8px] bg-indigo-150 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-sans font-extrabold transition">
                              Restore
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-200/60 text-[9px] font-sans">
                      <span className="text-slate-400 italic font-medium">Click any logged card to restore filters</span>
                      <button 
                        type="button"
                        onClick={() => {
                          setFilterHistory([{
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            specialty: activeSpecialty,
                            ageGroup: activeAgeGroup
                          }]);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold uppercase tracking-tight flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Clear Audit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Row 3: Standard Trusted Classified Medicines & Dose Clearance Matrix */}
          <div className="shrink-0" id="dosage-manual-row">
            <ClinicalDosageGuide 
              initialSpecialty={activeSpecialty}
              initialAgeGroup={activeAgeGroup}
            />
          </div>

        </main>

      </div>

    </div>
  );
}
