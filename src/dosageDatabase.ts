/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { AgeGroup, MedicalSpecialty } from './types';

export interface ClassifiedMedicine {
  id: string;
  name: string;
  genericName: string;
  classification: string;
  specialty: MedicalSpecialty;
  primaryIndication: string;
  route: 'Oral' | 'IV' | 'IM' | 'Subcutaneous' | 'Inhaled';
  
  // High-reliability age group dosing rules
  dosingRules: {
    [key in AgeGroup]: {
      recommendedDose: string;
      clinicalCriteria: string; // e.g., weight-based vs standard
      maxDose: string;
      renalHepaticAdjustments: string;
      specialtyInsight: string;
    }
  };
  
  // Global Scientific Endorsers
  authorityGuidelines: {
    society: string; // e.g. "American College of Cardiology (ACC)"
    recommendationGrade: 'Class I (Strong)' | 'Class IIa (Moderate)' | 'Class IIb (Weak)' | 'Class III (Harmful)';
    referenceText: string;
  };
}

export const CLASSIFIED_MEDICINES: ClassifiedMedicine[] = [
  // 1. CARDIOLOGY
  {
    id: "med-lisinopril",
    name: "Prinivil / Zestril",
    genericName: "Lisinopril",
    classification: "ACE Inhibitor",
    specialty: "Cardiology",
    primaryIndication: "Essential Hypertension & Post-Myocardial Infarction Heart Failure",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "0.07 mg/kg once daily",
        clinicalCriteria: "Weight-dependent starting dose in pediatrics",
        maxDose: "5 mg daily maximum",
        renalHepaticAdjustments: "Contraindicated if GFR < 30 mL/min/1.73m² (infantile renal immature system)",
        specialtyInsight: "Monitor serum potassium. Do NOT administer to neonates with patent ductus arteriosus needing prostaglandins."
      },
      "Children": {
        recommendedDose: "0.07 mg/kg to 0.1 mg/kg once daily",
        clinicalCriteria: "Weight-dependent starting dose; titrate at 1-2 week intervals",
        maxDose: "20 mg daily maximum",
        renalHepaticAdjustments: "Reduce dose by 50% if creatinine clearance is < 30 mL/min",
        specialtyInsight: "Observe for dry cough, hyperkalemia, or angioedema syndromes."
      },
      "Teenagers": {
        recommendedDose: "2.5 to 5 mg once daily, titrate upwards",
        clinicalCriteria: "Standard junior adult pathway; adjust based on cuff pressure logs",
        maxDose: "40 mg daily",
        renalHepaticAdjustments: "Standard pediatric adjustment if underlying congenital kidney defect present",
        specialtyInsight: "Check baseline chemistry, particularly serum creatinine and potassium levels."
      },
      "Adults": {
        recommendedDose: "5 to 10 mg once daily, maintenance at 20-40 mg",
        clinicalCriteria: "Adult essential hypertension dosing protocol",
        maxDose: "80 mg daily",
        renalHepaticAdjustments: "CrCl < 30 mL/min: starts at 2.5 mg daily. Hemodialysis clearable.",
        specialtyInsight: "AHA Class I guidance for systolic ejection fraction dysfunction < 40%."
      },
      "Seniors": {
        recommendedDose: "2.5 mg once daily initially (prevent profound orthostasis)",
        clinicalCriteria: "Geriatric low-and-slow initiation strategy",
        maxDose: "40 mg daily",
        renalHepaticAdjustments: "Renal clearance is reduced in seniors: initiate at 2.5 mg if GFR < 45 mL/min.",
        specialtyInsight: "Beers Criteria: High risk of orthostatic hypotension leading to fall risks in 80+ age personnel."
      }
    },
    authorityGuidelines: {
      society: "American Heart Association (AHA) / ACC Hypertension Guidelines",
      recommendationGrade: "Class I (Strong)",
      referenceText: "Lisinopril is strongly indicated as first-line therapy for left ventricular dysfunction and systemic atherosclerosis."
    }
  },
  {
    id: "med-metoprolol",
    name: "Lopressor / Toprol XL",
    genericName: "Metoprolol Succinate",
    classification: "Cardioselective Beta-1 Adrenergic Blocker",
    specialty: "Cardiology",
    primaryIndication: "Chronic Heart Failure & Cardiac Arrhythmia (Atrial Fibrillation rate control)",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "0.5 mg/kg once daily (clinical trial use only)",
        clinicalCriteria: "Requires continuous ECG telemetry for pediatric neonates",
        maxDose: "2.5 mg/kg daily",
        renalHepaticAdjustments: "Severe hepatic impairment requires extensive down-dose titration",
        specialtyInsight: "May cause bronchospasms in sensitive pediatric airways."
      },
      "Children": {
        recommendedDose: "1 mg/kg once daily in extended-release prep",
        clinicalCriteria: "For systemic hypertension or pediatric POTS syndromic tachycardia",
        maxDose: "2 mg/kg daily up to 50 mg",
        renalHepaticAdjustments: "No renal adjustment required; metabolized via CYP2D6 pathway",
        specialtyInsight: "Avoid abrupt withdrawal: can provoke fatal rebound tachycardia."
      },
      "Teenagers": {
        recommendedDose: "12.5 to 25 mg once daily",
        clinicalCriteria: "Adjust for heart rate Target (>60 BPM in rest state)",
        maxDose: "100 mg daily",
        renalHepaticAdjustments: "Hepatic monitoring required in systemic portal hypertension",
        specialtyInsight: "May mask hypoglycemic autonomic symptoms in teenage diabetic insulin-users."
      },
      "Adults": {
        recommendedDose: "25 to 50 mg once daily (Succinate) or bid (Tartrate)",
        clinicalCriteria: "Target chronic titration to 200 mg daily as tolerated",
        maxDose: "200 mg daily",
        renalHepaticAdjustments: "No dose adjustment for renal failure; hemodialysis does not remove Toprol XL.",
        specialtyInsight: "Exceptional benefit profile for post-MI prophylaxis."
      },
      "Seniors": {
        recommendedDose: "12.5 mg once daily initially (elderly clearance slows down)",
        clinicalCriteria: "Initiate extremely low to prevent bradyarrhythmias",
        maxDose: "100 mg daily",
        renalHepaticAdjustments: "Check for age-related hepatic blood flow decline.",
        specialtyInsight: "Beers criteria caution: Heart block or severe baseline bradycardia (<50 bpm) are absolute contraindications."
      }
    },
    authorityGuidelines: {
      society: "European Society of Cardiology (ESC) Heart Failure Directive",
      recommendationGrade: "Class I (Strong)",
      referenceText: "Beta-blockade reduces all-cause mortality by up to 34% in clinical chronic heart failure targets."
    }
  },

  // 2. HEMATOLOGY
  {
    id: "med-enoxaparin",
    name: "Lovenox",
    genericName: "Enoxaparin Sodium",
    classification: "Low Molecular Weight Heparin (LMWH)",
    specialty: "Hematology",
    primaryIndication: "Prevention & Treatment of Deep Vein Thrombosis (DVT) and Acute Pulmonary Embolism",
    route: "Subcutaneous",
    dosingRules: {
      "Babies": {
        recommendedDose: "1.5 mg/kg subcutaneously every 12 hours",
        clinicalCriteria: "Requires specialized anti-Xa serum monitoring (target 0.5 - 1.0 units/mL)",
        maxDose: "2 mg/kg every 12 hours max",
        renalHepaticAdjustments: "Impairment of neonatal clearance mandates extreme down-titration",
        specialtyInsight: "Avoid in active neonatal intracranial hemorrhage. High risk of heparin-induced thrombocytopenia."
      },
      "Children": {
        recommendedDose: "1.0 mg/kg subcutaneously every 12 hours",
        clinicalCriteria: "Treatment dose for thrombophilics; check anti-Xa levels weekly",
        maxDose: "1.5 mg/kg q12h",
        renalHepaticAdjustments: "GFR < 30: reduce therapeutic treatment to 1.0 mg/kg once daily only.",
        specialtyInsight: "Ensure needle length is appropriate for pediatric subcutaneous adipose layer."
      },
      "Teenagers": {
        recommendedDose: "1.0 mg/kg subcutaneously every 12 hours",
        clinicalCriteria: "Weight-dependent for full thrombus resolution",
        maxDose: "150 mg per single dose",
        renalHepaticAdjustments: "Use unfractionated heparin (UFH) if severe acute renal failure is concurrent",
        specialtyInsight: "Verify baseline platelet count prior to and during therapy."
      },
      "Adults": {
        recommendedDose: "1.5 mg/kg once daily OR 1 mg/kg every 12 hours",
        clinicalCriteria: "Standard adult deep thrombophlebitis resolution regimen",
        maxDose: "180 mg per single injection",
        renalHepaticAdjustments: "CrCl < 30 mL/min: Reduce therapeutic parameters to 1 mg/kg once daily only.",
        specialtyInsight: "First-line bridging anticoagulant for cardioversion or atrial fibrillatory procedures."
      },
      "Seniors": {
        recommendedDose: "0.75 mg/kg subcutaneously every 12 hours",
        clinicalCriteria: "Reduced dose in senior oncology or coronary acute syndrome patients (75+ yrs)",
        maxDose: "100 mg per single dose",
        renalHepaticAdjustments: "CrCl < 30 mL/min: Mandates 30-50% dose reduction. Elderly renal function must be estimated via Cockcroft-Gault.",
        specialtyInsight: "Beers Criteria: Highly critical bleeding risk in patients older than 80. Monitor for micro-hematuria."
      }
    },
    authorityGuidelines: {
      society: "American Society of Hematology (ASH) Anticoagulation Guidelines",
      recommendationGrade: "Class I (Strong)",
      referenceText: "LMWH is preferred over oral non-vitamin K anticoagulants for oncology-associated clotting."
    }
  },

  // 3. NEUROLOGY
  {
    id: "med-levetiracetam",
    name: "Keppra",
    genericName: "Levetiracetam",
    classification: "Second Generation Antiviral Synaptic Vesicle Glycoprotein (SV2A) Ligand Anticonvulsant",
    specialty: "Neurology",
    primaryIndication: "Monotherapy and Adjunct Therapy of Partial Onset, Myoclonic, & Generalized Seizures",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "10 mg/kg twice daily",
        clinicalCriteria: "Start at 10 mg/kg bid, increase by 10 mg/kg increments every 7 days",
        maxDose: "30 mg/kg twice daily",
        renalHepaticAdjustments: "Renal excretion is directly dependent on GFR. Reduce dose in impaired neonatal clearance.",
        specialtyInsight: "Highly trusted profile: does not interact with CYP450 liver metabolic pathways."
      },
      "Children": {
        recommendedDose: "10 mg/kg to 15 mg/kg twice daily",
        clinicalCriteria: "Adjust up to maximum of 30 mg/kg twice daily (60 mg/kg daily load)",
        maxDose: "1500 mg twice daily",
        renalHepaticAdjustments: "Renal titration required if congenital metabolic insufficiency exists.",
        specialtyInsight: "Monitor behavioral changes, pediatric somnolence, and mood alterations."
      },
      "Teenagers": {
        recommendedDose: "250 mg to 500 mg twice daily",
        clinicalCriteria: "Titrate upward by 500 mg daily at 2-week milestones as clinical seizures dictate",
        maxDose: "1500 mg twice daily",
        renalHepaticAdjustments: "Check baseline GFR for teen patients with traumatic physical injury history.",
        specialtyInsight: "Excellent safety profile; no contraceptive hormonal interactions."
      },
      "Adults": {
        recommendedDose: "500 mg twice daily, maintenance at 1000-1500 mg bid",
        clinicalCriteria: "Adult epilepsy standard dosage protocol",
        maxDose: "3000 mg daily limit",
        renalHepaticAdjustments: "CrCl 50-80: 500-1000mg q12h; CrCl 30-50: 250-750mg q12h; CrCl < 30: 250-500mg q12h.",
        specialtyInsight: "First-line choice for neuro-trauma seizure prophylaxis in ICU environments."
      },
      "Seniors": {
        recommendedDose: "250 mg twice daily (seniors have slower renal clearance parameters)",
        clinicalCriteria: "Initiate at lower therapeutic thresholds to minimize sedation sync",
        maxDose: "1000 mg twice daily",
        renalHepaticAdjustments: "GFR is physiologically lower in seniors: calculate clearance and reduce endpoints by 30-50%.",
        specialtyInsight: "Beers Criteria: CNS active drug. Elevates dizziness, somnolence, and gait instabilities leading to falls. Use with caution."
      }
    },
    authorityGuidelines: {
      society: "American Epilepsy Society (AES) Guidelines",
      recommendationGrade: "Class I (Strong)",
      referenceText: "Strongly recommended as a broad-spectrum, low-interaction first-line anticonvulsant."
    }
  },

  // 4. ONCOLOGY
  {
    id: "med-imatinib",
    name: "Gleevec",
    genericName: "Imatinib Mesylate",
    classification: "Tyrosine Kinase Inhibitor (BCR-ABL)",
    specialty: "Oncology",
    primaryIndication: "Philadelphia Chromosome Positive (Ph+) Chronic Myelogenous Leukemia (CML)",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "Safety not established in under 1 year",
        clinicalCriteria: "Strict investigational neonatology oversight if selected",
        maxDose: "230 mg/m² daily",
        renalHepaticAdjustments: "Highly customized based on BSA (body surface area)",
        specialtyInsight: "Monitor severe bone marrow suppression, absolute neutrophil counts, and skeletal growth plates."
      },
      "Children": {
        recommendedDose: "230 mg/m² to 340 mg/m² once daily",
        clinicalCriteria: "Dose calculated dynamically utilizing Body Surface Area (BSA) charts",
        maxDose: "600 mg daily maximum",
        renalHepaticAdjustments: "Hepatic transaminases elevations mandate a temporary therapeutic hold.",
        specialtyInsight: "Excellent outcomes in pediatric chronic-phase Ph+ granulocytic leukemias."
      },
      "Teenagers": {
        recommendedDose: "400 mg once daily with a heavy water load and food",
        clinicalCriteria: "Transition to standard adult dosing once physical growth limits peak",
        maxDose: "600 mg daily",
        renalHepaticAdjustments: "Reduce dosage if GFR diminishes under severe cytokine syndromes",
        specialtyInsight: "Advise on strict adherence to prevent leukemic resistance mutations."
      },
      "Adults": {
        recommendedDose: "400 mg to 600 mg once daily",
        clinicalCriteria: "Maintained in chronic phase Ph+ CML. Escalate to 800 mg if accelerated phase occurs.",
        maxDose: "800 mg daily total",
        renalHepaticAdjustments: "Moderate renal impairment (CrCl 20-59): 400 mg max. Severe (CrCl < 20): 300 mg max.",
        specialtyInsight: "Targeted therapy breakthrough. Major cyto-genetic response reaches up to 87%."
      },
      "Seniors": {
        recommendedDose: "400 mg once daily (highly vulnerable to subclinical congestive toxicity)",
        clinicalCriteria: "Close monitoring for excessive fluid retention and peripheral edema",
        maxDose: "600 mg once daily",
        renalHepaticAdjustments: "Dose-dependent renal clearance: reduce endpoints if GFR calculated < 40 mL/min.",
        specialtyInsight: "ASCO recommendation: May trigger left ventricular ejection decline in elderly. Monitor ejection fraction."
      }
    },
    authorityGuidelines: {
      society: "American Society of Clinical Oncology (ASCO) Leukemia Directive",
      recommendationGrade: "Class I (Strong)",
      referenceText: "Standard of care for BCR-ABL chronic granulocytic leukemia with molecular-proven responses."
    }
  },

  // 5. NEPHROLOGY
  {
    id: "med-sevelamer",
    name: "Renvela",
    genericName: "Sevelamer Carbonate",
    classification: "Non-Calcium Phosphate Binder",
    specialty: "Nephrology",
    primaryIndication: "Control of serum phosphorus levels in chronic kidney disease (CKD) on dialysis",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "Investigational only",
        clinicalCriteria: "Weight-adjusted liquid compound formula if mandatory",
        maxDose: "800 mg daily limits",
        renalHepaticAdjustments: "Drug acts locally in gut lumen. No systemic absorption context.",
        specialtyInsight: "Avoid if severe congenital micro-bowel bowel obstruction is concurrent."
      },
      "Children": {
        recommendedDose: "800 mg three times daily with meals",
        clinicalCriteria: "Starting dose depends on serum phosphorus > 5.5 mg/dL",
        maxDose: "1600 mg tid",
        renalHepaticAdjustments: "Aids in reducing phosphorus retention in end-stage pediatric renal failure.",
        specialtyInsight: "Must swallow whole; do not chew or crush. Generates bowel impaction risk."
      },
      "Teenagers": {
        recommendedDose: "800 mg to 1600 mg three times daily with meals",
        clinicalCriteria: "Match serum phosphorus goals dynamically (Target: 3.5 - 5.5 mg/dL)",
        maxDose: "2400 mg tid with meals",
        renalHepaticAdjustments: "Acts locally. No hepatic adjustments needed.",
        specialtyInsight: "Ensure calcium, calcitriol, and PTH levels are carefully balanced."
      },
      "Adults": {
        recommendedDose: "800 mg to 1600 mg three times daily with meals",
        clinicalCriteria: "If serum phosphorus >5.5 and <7.5: 800mg tid. If >=7.5 to 9.0: 1600mg tid. Larger: 2400mg tid.",
        maxDose: "7.2 grams total daily",
        renalHepaticAdjustments: "No systemic dose adjustment required as it is non-absorbable but direct compliance is vital.",
        specialtyInsight: "KDOQI guidelines: Reduces aortic calcification rates relative to calcium-based binders."
      },
      "Seniors": {
        recommendedDose: "800 mg three times daily with meals",
        clinicalCriteria: "Initiate lower to prevent severe constipation and bowel motility decline",
        maxDose: "4.8 grams daily total",
        renalHepaticAdjustments: "No systemic dose adjustments. Actions are entirely gastrointestinal.",
        specialtyInsight: "Beers criteria check: Watch for severe colon impaction or fecaloma. Hydration status must be estimated."
      }
    },
    authorityGuidelines: {
      society: "Kidney Disease Outcomes Quality Initiative (KDOQI)",
      recommendationGrade: "Class I (Strong)",
      referenceText: "Indicated to manage bone-mineral disorder pathways and arrest high hyperphosphatemia."
    }
  },

  // 6. ENDOCRINOLOGY
  {
    id: "med-metformin",
    name: "Glucophage",
    genericName: "Metformin Hydrochloride",
    classification: "Biguanide Oral Antidiabetic agent",
    specialty: "Endocrinology",
    primaryIndication: "Type 2 Diabetes Mellitus Management & Insulin Sensitizer",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "Contraindicated (safety/efficacy not proven under 10)",
        clinicalCriteria: "Alternative pediatric protocols required (e.g. basal insulin)",
        maxDose: "N/A",
        renalHepaticAdjustments: "Banned: Severe risk of fatal pediatric metabolic acidosis and tissue hypoxemia.",
        specialtyInsight: "Absolute pediatric contraindication."
      },
      "Children": {
        recommendedDose: "500 mg once daily (only for children 10 years or older)",
        clinicalCriteria: "Titrate by 500 mg weekly based on capillary glucose targets",
        maxDose: "2000 mg daily (in divided doses)",
        renalHepaticAdjustments: "Stop therapy immediately if systemic illness with risk of dehydration exists.",
        specialtyInsight: "Promotes significant insulin receptor affinity, lowering baseline HbA1c."
      },
      "Teenagers": {
        recommendedDose: "500 mg once daily, titrating to two times daily with main meals",
        clinicalCriteria: "Standard junior diabetic titration; monitor for early abdominal cramping",
        maxDose: "2000 mg daily",
        renalHepaticAdjustments: "GFR < 45: reduce dose by 50%. GFR < 30: Discontinue immediately.",
        specialtyInsight: "GI side-effects can be mitigated by utilising Metformin ER (Extended Release) preparations."
      },
      "Adults": {
        recommendedDose: "500 mg bid or 850 mg once daily with meals, target 2000mg",
        clinicalCriteria: "Adult first-line glycemic target therapy",
        maxDose: "2550 mg daily",
        renalHepaticAdjustments: "GFR 45-59: Continue with caution. GFR 30-44: 1000 mg maximum daily. GFR < 30: Contraindicated.",
        specialtyInsight: "Incredible cardioprotective profile. Helps lower hyperinsulinemic vascular burden."
      },
      "Seniors": {
        recommendedDose: "500 mg once daily with a high-protein breakfast",
        clinicalCriteria: "Begin lower; seniors are highly sensitive to systemic dehydration anomalies",
        maxDose: "1500 mg daily limit",
        renalHepaticAdjustments: "Physiologic age-related decline of renal function in seniors demands GFR checks every 6 months. Absolute hold if CrCl < 30.",
        specialtyInsight: "Beers criteria caution: Highly prone to severe gastrointestinal intolerances and subclinical B12 deficiencies."
      }
    },
    authorityGuidelines: {
      society: "American Diabetes Association (ADA) Clinical Criteria Standards",
      recommendationGrade: "Class I (Strong)",
      referenceText: "First-line pharmacological agent representing the foundation of cardiovascular and metabolic stabilization."
    }
  },

  // 7. IMMUNOLOGY
  {
    id: "med-prednisone",
    name: "Deltasone",
    genericName: "Prednisone",
    classification: "Glucocorticoid / Synthetic Corticosteroid",
    specialty: "Immunology",
    primaryIndication: "Severe Inflammatory and Autoimmune Disorders (Lupus, Nephritis, Vasculitis flares)",
    route: "Oral",
    dosingRules: {
      "Babies": {
        recommendedDose: "0.5 mg/kg to 2.0 mg/kg daily as a single dose or divided",
        clinicalCriteria: "Weight-dependent for severe acute immune anomalies or croup syndromic state",
        maxDose: "60 mg total daily",
        renalHepaticAdjustments: "Requires hepatic conversion of prednisone to prednisolone: caution in hepatic dysfunction.",
        specialtyInsight: "Prolonged use arrested due to severe bone growth plates restriction/growth failure."
      },
      "Children": {
        recommendedDose: "0.5 mg/kg to 2 mg/kg daily, taper rapidly",
        clinicalCriteria: "Calculate tapering dose to prevent secondary adrenal insufficiency crashes",
        maxDose: "80 mg total daily",
        renalHepaticAdjustments: "No major renal adjustment required; watch fluid retention.",
        specialtyInsight: "May trigger acute immunologic Cushing syndromic traits, hyperglycemia, or psychological mania."
      },
      "Teenagers": {
        recommendedDose: "5 mg to 60 mg once daily depending on autoimmune flare intensity",
        clinicalCriteria: "Aggressive induction dose tapering down to minimal maintenance targets",
        maxDose: "100 mg daily maximum",
        renalHepaticAdjustments: "No renal adjustment. Hepatic transaminases monitoring recommended.",
        specialtyInsight: "Check blood glucose. Accelerates bone resorption and osteopenia in teen females."
      },
      "Adults": {
        recommendedDose: "5 mg to 60 mg once daily, adjusted by disease activity markers (CRP/ESR)",
        clinicalCriteria: "Induction therapy for severe immunologic rheumatoid/lupus flareups",
        maxDose: "100 mg daily",
        renalHepaticAdjustments: "No renal adjustment, although potassium loss must be estimated.",
        specialtyInsight: "Strong, rapid anti-inflammatory efficacy. Co-prescribe PPI to prevent peptic ulcers."
      },
      "Seniors": {
        recommendedDose: "2.5 to 5 mg once daily with rapid, structured taper strategies",
        clinicalCriteria: "Initiate minimal possible dose due to systemic elderly fragility",
        maxDose: "40 mg daily",
        renalHepaticAdjustments: "Monitor potassium depletion and fluid indices closely.",
        specialtyInsight: "Beers Criteria warning: High Risk. Drives rapid osteoporosis, delirium, cataracts, and systemic muscle weakness in geriatric personnel."
      }
    },
    authorityGuidelines: {
      society: "American College of Rheumatology (ACR) Flare Mandates",
      recommendationGrade: "Class I (Strong)",
      referenceText: "High clinical utility for rapid control of severe extra-articular manifestations of rheumatologic disease."
    }
  }
];
