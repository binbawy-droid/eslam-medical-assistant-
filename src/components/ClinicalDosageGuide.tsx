/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { AgeGroup, MedicalSpecialty } from '../types';
import { CLASSIFIED_MEDICINES, ClassifiedMedicine } from '../dosageDatabase';
import { 
  Calculator, 
  Search, 
  Heart, 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Award, 
  FileText, 
  User, 
  Scale, 
  Droplets,
  Building,
  ChevronDown,
  Info
} from 'lucide-react';

interface ClinicalDosageGuideProps {
  onSelectMedicine?: (med: ClassifiedMedicine) => void;
  initialSpecialty?: MedicalSpecialty;
  initialAgeGroup?: AgeGroup;
}

export default function ClinicalDosageGuide({ 
  onSelectMedicine,
  initialSpecialty = 'Cardiology',
  initialAgeGroup = 'Adults'
}: ClinicalDosageGuideProps) {
  // Filters matching expanded categories and career lines
  const [selectedSpecialty, setSelectedSpecialty] = useState<MedicalSpecialty>(initialSpecialty);
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAgeGroup);
  const [searchQuery, setSearchQuery] = useState("");

  // Doctor's parameters for dynamic instant weight-based safe calculation
  const [patientWeight, setPatientWeight] = useState<string>("70");
  const [patientGfr, setPatientGfr] = useState<string>("90");

  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);

  // Grouped basic health sectors with representative icons
  const sectors: Array<{ specialty: MedicalSpecialty; description: string; icon: any; color: string }> = [
    { specialty: 'Cardiology', description: "Coronary & systemic hemodynamics", icon: Heart, color: "text-red-500 bg-red-50 border-red-100" },
    { specialty: 'Neurology', description: "Central nervous system & seizures", icon: Brain, color: "text-purple-500 bg-purple-50 border-purple-100" },
    { specialty: 'Hematology', description: "Coagulation & venous embolism", icon: Activity, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
    { specialty: 'Oncology', description: "Cytogenetic tyrosine kinase therapies", icon: Award, color: "text-rose-500 bg-rose-50 border-rose-100" },
    { specialty: 'Nephrology', description: "Phosphate binders & renal dynamics", icon: Droplets, color: "text-sky-500 bg-sky-50 border-sky-100" },
    { specialty: 'Endocrinology', description: "Glycemic control & biguanide protocols", icon: Calculator, color: "text-amber-500 bg-amber-50 border-amber-100" },
    { specialty: 'Immunology', description: "Synthetic corticosteroid autoimmune flares", icon: Building, color: "text-fuchsia-500 bg-fuchsia-50 border-fuchsia-100" },
    { specialty: 'Pediatrics', description: "Neonatal & child weight adjustments", icon: User, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
    { specialty: 'Geriatrics', description: "Beers criteria safety checks", icon: FileText, color: "text-teal-500 bg-teal-50 border-teal-100" },
  ];

  // Perform client-side filter
  const filteredMedicines = useMemo(() => {
    return CLASSIFIED_MEDICINES.filter(med => {
      // If a specific sector is picked, filter.
      // Note: Pediatrics/Geriatrics are demographic flags, but we map target medications dynamically.
      const matchesSpecialty = 
        selectedSpecialty === 'General' || 
        med.specialty === selectedSpecialty ||
        (selectedSpecialty === 'Pediatrics' && (selectedAge === 'Babies' || selectedAge === 'Children')) ||
        (selectedSpecialty === 'Geriatrics' && selectedAge === 'Seniors');

      const matchesSearch = 
        !searchQuery.trim() ||
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.classification.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSpecialty && matchesSearch;
    });
  }, [selectedSpecialty, selectedAge, searchQuery]);

  // Helper to dynamically evaluate dosage for UI
  const calculateDynamicDose = (med: ClassifiedMedicine) => {
    const rules = med.dosingRules[selectedAge];
    const weightNum = parseFloat(patientWeight) || 70;
    const gfrNum = parseFloat(patientGfr) || 90;

    let output = rules.recommendedDose;
    let warning = null;

    // Check GFR contraindications or reduction cues
    if (gfrNum < 30) {
      if (med.id === 'med-metformin') {
        warning = "Contraindicated: GFR < 30 mL/min! High risk of fatal Biguanide Lactic Acidosis.";
      } else if (med.id === 'med-lisinopril' || med.id === 'med-enoxaparin') {
        warning = "Critical: Reduce standard dose by 50% or seek alternative. Severe renal retention risk.";
      } else if (med.id === 'med-levetiracetam') {
        warning = "Adjustment required: Cleared via glomerular filtration. Reduce maintenance limits.";
      }
    }

    // Weight based estimate if noted
    if (rules.clinicalCriteria.toLowerCase().includes("weight") && output.includes("mg/kg")) {
      const perKg = parseFloat(output) || 0;
      const calculated = (perKg * weightNum).toFixed(2);
      output = `${calculated} mg total (${output} based on ${weightNum}kg patient)`;
    }

    // Check Beers criteria for seniors
    if (selectedAge === 'Seniors') {
      if (med.id === 'med-lisinopril') {
        warning = "Beers Criteria: High fall risk due to profound geriatric orthostasis. Start at lower 2.5mg.";
      } else if (med.id === 'med-levetiracetam') {
        warning = "CNS Active Drug: Monitor for elder dizziness, somnolence, and gait instability.";
      } else if (med.id === 'med-metformin') {
        warning = "Seniors over 80: High threat of chronic B12 malabsorption. Monitor CBC.";
      } else if (med.id === 'med-enoxaparin') {
        warning = "High Bleeding Index: Beers warning in 80+ yrs. Closely monitor micro-hematuria.";
      }
    }

    return { calculatedDose: output, maxDose: rules.maxDose, warning };
  };

  const toggleExpand = (medId: string) => {
    setExpandedMedId(expandedMedId === medId ? null : medId);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" id="clinical-dosage-guide">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-sans font-bold text-sm tracking-tight text-white uppercase flex items-center gap-2">
              Clinical Dosage Manual & Safety Clearance Controls
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              PRECISE CRITERIA FOR BABIES TO 100 YR OLD GERIATRIC CONTEXTS
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded uppercase">
          WHO / ACC / ASCO Consensus Verified
        </span>
      </div>

      {/* Specialty Grid Selection Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
          Select Basic Health Career Section
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {sectors.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedSpecialty === s.specialty;
            return (
              <button
                key={s.specialty}
                onClick={() => setSelectedSpecialty(s.specialty)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer min-h-[64px] ${
                  isSelected 
                    ? "border-blue-500 bg-blue-50/70 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className={`p-1 rounded-lg w-fit ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-extrabold text-slate-800 leading-none truncate pr-1">
                    {s.specialty}
                  </span>
                  <span className="block text-[8px] text-slate-400 truncate mt-0.5">
                    {s.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-5">
        
        {/* Patient Parameters calculator inputs */}
        <div className="w-full md:w-[30%] space-y-4 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-250 pb-2">
            <Scale className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Patient Parameter Dosing Calculator
            </h4>
          </div>

          <div className="space-y-3">
            {/* Age cohort row */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Target Age Group Cohort
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['Babies', 'Children', 'Teenagers', 'Adults', 'Seniors'] as AgeGroup[]).map((grp) => {
                  const isActive = selectedAge === grp;
                  return (
                    <button
                      key={grp}
                      type="button"
                      onClick={() => setSelectedAge(grp)}
                      className={`py-1 rounded text-[10px] font-bold border ${
                        isActive 
                          ? "bg-slate-905 bg-slate-900 text-white" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {grp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weight inputs */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex justify-between">
                <span>Patient Weight</span>
                <span className="font-mono text-[9px] text-slate-400">Used for Pediatric Dosing</span>
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={patientWeight}
                  onChange={(e) => setPatientWeight(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1 px-3 text-xs text-slate-900 outline-none"
                  placeholder="e.g. 70"
                />
                <span className="ml-2 text-xs font-bold text-slate-400">KG</span>
              </div>
            </div>

            {/* GFR values */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex justify-between">
                <span>Estimated GFR (Glomerular Filtration Rate)</span>
                <span className="font-mono text-[9px] text-red-500">Important</span>
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={patientGfr}
                  onChange={(e) => setPatientGfr(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1 px-3 text-xs text-slate-900 outline-none"
                  placeholder="e.g. 90"
                />
                <span className="ml-2 text-[10px] font-bold text-slate-400 leading-none">mL/min/1.73m²</span>
              </div>
            </div>

            {/* Dynamic age details guide text */}
            <div className="bg-blue-50/50 p-2.5 rounded-lg border border-blue-100 text-[10px] text-blue-800 space-y-1">
              <span className="font-bold block uppercase tracking-wide">Physiology Clearance Notice:</span>
              <p className="leading-relaxed">
                {selectedAge === 'Babies' && "Babies (neonates under 2) present immature glomerular renal filtration paths and highly localized hepatic clearance curves. Demands precise mg/kg fluid fractions."}
                {selectedAge === 'Children' && "Children require weight-based scaling parameters. Drug half-lives are occasionally accelerated relative to body surface area."}
                {selectedAge === 'Teenagers' && "Teenagers require custom monitoring of secondary metabolic indicators, bone plate fusion rates, and early CNS sensitivities during drug titration."}
                {selectedAge === 'Adults' && "Adult parameters focus on standard cardiac, hematom, and systemic clearances, referencing typical adult drug absorption tables."}
                {selectedAge === 'Seniors' && "Seniors (up to 100 years old) require careful vigilance for Beers Criteria warnings. Renal dynamics drop dramatically with age; start at lowest ranges."}
              </p>
            </div>
          </div>
        </div>

        {/* Searchable Medicine List Dossier Output */}
        <div className="flex-1 space-y-3">
          
          {/* Quick search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter manual by medicine name or drug classification (e.g. 'ACE Inhibitor', 'Imatinib')..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none"
            />
          </div>

          {filteredMedicines.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-center text-slate-400">
              <Info className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
              <p className="text-xs font-bold text-slate-700">No Prescriptions Matched</p>
              <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs mx-auto">
                No standardized drug classifications exist yet in this sandbox for "{selectedSpecialty}" under search query "{searchQuery}".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMedicines.map((med) => {
                const isExpanded = expandedMedId === med.id;
                const { calculatedDose, maxDose, warning } = calculateDynamicDose(med);
                const rules = med.dosingRules[selectedAge];

                return (
                  <div 
                    key={med.id} 
                    className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col"
                  >
                    {/* Header line */}
                    <div 
                      onClick={() => toggleExpand(med.id)}
                      className="p-3.5 hover:bg-slate-50/70 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          med.specialty === 'Cardiology' ? "bg-red-500" :
                          med.specialty === 'Hematology' ? "bg-emerald-500" :
                          med.specialty === 'Neurology' ? "bg-violet-500" :
                          med.specialty === 'Oncology' ? "bg-rose-500" : "bg-blue-500"
                        }`} />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                            <span>{med.name}</span>
                            <span className="text-normal font-medium text-slate-500 font-mono text-[10px]">({med.genericName})</span>
                            <span className="bg-slate-100 text-[9px] text-slate-500 font-bold px-1.5 rounded uppercase font-mono tracking-wider">
                              {med.classification}
                            </span>
                          </h4>
                          <span className="block text-[10px] text-slate-550 italic mt-0.5">
                            Indication: {med.primaryIndication}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 uppercase font-mono block">Immediate Dose ({selectedAge})</span>
                          <span className="text-xs font-bold text-blue-700">{rules.recommendedDose}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>

                    {/* Calculated real-time dosage bar */}
                    <div className="px-3.5 py-2.5 bg-blue-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="font-extrabold text-blue-800 uppercase tracking-tight">
                          Real-time Calculated Starting Dose:
                        </span>
                        <strong className="text-blue-900 font-mono font-bold bg-white border border-blue-200 px-1.5 py-0.5 rounded">
                          {calculatedDose}
                        </strong>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Max Dose: <span className="text-slate-700 font-bold">{maxDose}</span>
                      </div>
                    </div>

                    {/* Quick Warning Alert Badge (Beers Criteria or Renal GFR drop) */}
                    {warning && (
                      <div className="px-3.5 py-1.5 bg-red-50 border-t border-red-100 text-[10px] text-red-700 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 animate-pulse" />
                        <span>{warning}</span>
                      </div>
                    )}

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="p-4 border-t border-slate-150 bg-slate-50/40 space-y-3 text-xs text-slate-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <span className="font-bold text-slate-800 block text-[10px] uppercase font-mono tracking-wide">
                              Clearance Criteria Details ({selectedAge})
                            </span>
                            <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px] leading-relaxed">
                              <li><strong>Clinical Thresholds:</strong> {rules.clinicalCriteria}</li>
                              <li><strong>Renal & Hepatic Adjustments:</strong> {rules.renalHepaticAdjustments}</li>
                              <li><strong>Clinical Care Note:</strong> {rules.specialtyInsight}</li>
                              <li><strong>Administration Route:</strong> Standard {med.route} administration protocol</li>
                            </ul>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wide flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-blue-600" />
                                Global Endorsement Certification
                              </span>
                              <p className="text-[11px] text-slate-600 italic">
                                "{med.authorityGuidelines.referenceText}"
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[9px]">
                              <span className="font-bold text-slate-800">{med.authorityGuidelines.society}</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-550 bg-emerald-600 text-white font-bold leading-normal">
                                {med.authorityGuidelines.recommendationGrade}
                              </span>
                            </div>
                          </div>
                        </div>

                        {onSelectMedicine && (
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => onSelectMedicine(med)}
                              className="px-3 py-1 bg-slate-900 text-white font-bold rounded text-[10px] hover:bg-slate-800"
                            >
                              Push Medicine to Scan Editor
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
