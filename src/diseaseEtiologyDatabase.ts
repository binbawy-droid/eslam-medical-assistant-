/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgeGroup, MedicalSpecialty } from './types';

export interface DiseasePrescription {
  medicine: string;
  genericName: string;
  standardDose: string;
  frequency: string;
  duration: string;
  clinicalNote: string;
}

export interface DetailedDiseaseRecord {
  id: string;
  name: string;
  category: MedicalSpecialty;
  ageGroup: AgeGroup;
  causes: string[];
  signs: string[];      // Objective findings visible to clinicians
  symptoms: string[];   // Subjective feelings reported by patients
  prescriptions: DiseasePrescription[];
}

export const DETAILED_DISEASES: DetailedDiseaseRecord[] = [
  // --- CARDIOLOGY ---
  {
    id: "dis-tof",
    name: "Tetralogy of Fallot",
    category: "Cardiology",
    ageGroup: "Babies",
    causes: [
      "Congenital developmental defect involving abnormal anterior deviation of the infundibular septum.",
      "Associated with chromosome 22q11.2 deletions (DiGeorge Syndrome) in up to 15% of infant cases."
    ],
    signs: [
      "Cyanotic skin discolouration and mucous membranes ('blue baby spell' or 'Tet spell').",
      "Harsh systolic ejection murmur loudest at the left mid-to-upper sternal border (caused by right ventricular tract obstruction).",
      "Boot-shaped heart outline ('cœur en sabot') visible on chest radiography."
    ],
    symptoms: [
      "Hyperpneic distress or quick gasping and paroxysmal dyspnea upon feeding/crying.",
      "Profound listlessness, physical feeding fatigue, and failure to thrive."
    ],
    prescriptions: [
      {
        medicine: "Inderal",
        genericName: "Propranolol",
        standardDose: "0.25 - 0.5 mg/kg orally or 0.1 mg/kg IV slow push",
        frequency: "Every 6 to 8 hours (for Tet spell prevention)",
        duration: "Maintained chronically until surgical shunt or corrective ventriculoplasty",
        clinicalNote: "Reduces infundibular spasm and stabilizes peripheral vascular resistance to shunt blood through the lungs."
      }
    ]
  },
  {
    id: "dis-kawasaki",
    name: "Kawasaki Disease",
    category: "Cardiology",
    ageGroup: "Children",
    causes: [
      "Idiopathic systemic medium-vessel necrotizing vasculitis with predisposing autoimmune genetic markers.",
      "Postulated viral triggers provoking extreme antigen-driven cytokine bursts in coronary artery vessels."
    ],
    signs: [
      "High fever lasting over 5 days refractory to conventional antipyretic control.",
      "Bilateral non-exudative conjunctivitis, 'strawberry tongue' hyperpigmentation, and erythema of oral mucosa.",
      "Polymorphous trunk rash with periungual desquamation (peeling around finger and toe nails) in subacute phases."
    ],
    symptoms: [
      "Intense irritability and systemic joint soreness.",
      "Abdominal pain, nausea, and progressive lethargy."
    ],
    prescriptions: [
      {
        medicine: "Gammagard",
        genericName: "IVIG (Intravenous Immunoglobulin)",
        standardDose: "2 g/kg administered as a single continuous intravenous infusion",
        frequency: "Once slowly over 10 - 12 hours",
        duration: "Acute primary dose intervention",
        clinicalNote: "Must administer within 10 days of onset of fever to arrest coronary aneurysm risk. Monitor fluid overload."
      },
      {
        medicine: "Bayer Children's Aspirin",
        genericName: "Aspirin (Acetylsalicylic Acid)",
        standardDose: "85 to 100 mg/kg/day during febrile phase; tape to 3-5 mg/kg once daily afterward",
        frequency: "Divided every 6 hours acutely; once daily post-fever",
        duration: "High dose for 14 days, low dose for 6 to 8 weeks if no coronary anomalies detected",
        clinicalNote: "Provides powerful immediate anti-inflammatory synergy followed by anti-platelet thrombosis prophylaxis."
      }
    ]
  },
  {
    id: "dis-pots",
    name: "Postural Orthostatic Tachycardia Syndrome (POTS)",
    category: "Cardiology",
    ageGroup: "Teenagers",
    causes: [
      "Autonomic nervous system dysregulation causing systemic peripheral pooling of blood.",
      "Posthypovolemic neuropathy or post-viral deconditioning affecting teenage developmental intervals."
    ],
    signs: [
      "Inability to maintain blood pressure/heart balance upon active standing tests.",
      "Postural tachycardia: increment of heart rate >= 40 beats per minute within 10 minutes of upright standing in teenage patients.",
      "Acrocyanosis (mottled skin discoloration in extremities) upon prolonged hanging of legs."
    ],
    symptoms: [
      "Severe orthostatic dizziness, lightheadedness, and systemic chronic fatigue.",
      "Palpitations, visual gray-outs, and brain fog when upright, which are alleviated by immediately lying flat."
    ],
    prescriptions: [
      {
        medicine: "Florinef",
        genericName: "Fludrocortisone Acetate",
        standardDose: "0.1 mg once daily",
        frequency: "Every morning",
        duration: "6 months to chronic maintenance as autonomic tone stabilizes",
        clinicalNote: "Promotes renal sodium retention to expand plasma volume. Monitor serum potassium carefully."
      },
      {
        medicine: "Tenormin",
        genericName: "Atenolol",
        standardDose: "12.5 - 25 mg once daily",
        frequency: "Once daily",
        duration: "Chronically as tolerated for tachycardia control",
        clinicalNote: "Blunts the hyperadrenergic sinus node surges without causing central CNS sedation common to older drugs."
      }
    ]
  },
  {
    id: "dis-ascvd",
    name: "Atherosclerotic Cardiovascular Disease (ASCVD)",
    category: "Cardiology",
    ageGroup: "Adults",
    causes: [
      "Chronic lipid-driven inflammatory injury to arterial endothelial linings.",
      "Fibrous lipid plaque build-up induced by hypertension, diabetes, hypercholesterolemia, and tobacco abuse."
    ],
    signs: [
      "Elevated systemic systolic blood pressures and abnormal LDL cholesterols (> 190 mg/dL raw).",
      "Dynamic ST-segment depression or T-wave inversion on ECG under cardiac stress tests.",
      "Arterial calcification on CT calcium scans."
    ],
    symptoms: [
      "Classic exertional angina: crushing retrosternal pressure radiating to the left shoulder, neck, or jaw.",
      "Dyspnea, diaphoresis, and acute exertion exhaustion."
    ],
    prescriptions: [
      {
        medicine: "Lipitor",
        genericName: "Atorvastatin Calcium",
        standardDose: "40 mg to 80 mg once daily",
        frequency: "Every evening at bedtime",
        duration: "Lifelong lipid-lowering plaque stabilization",
        clinicalNote: "First-line High Intensity Statin therapy. Crucial to check baseline hepatic transaminases."
      },
      {
        medicine: "Ecotrin",
        genericName: "Aspirin",
        standardDose: "81 mg once daily (enteric-coated)",
        frequency: "Once daily with food",
        duration: "Chronic lifelong secondary stroke/MI prevention",
        clinicalNote: "Acts as an irreversible inhibitor of platelet cyclooxygenase-1 to suppress thromboxane A2."
      }
    ]
  },
  {
    id: "dis-chf",
    name: "Congestive Heart Failure (Geriatric Care)",
    category: "Cardiology",
    ageGroup: "Seniors",
    causes: [
      "Myocardial remodeling secondary to long-term ischemia, severe chronic hypertension, or valvular sclerosis.",
      "Progressive diastolic stiffness or systolic pumping fatigue in geriatric cardiovascular structures."
    ],
    signs: [
      "Persistent bilateral pitting ankle edema and positive jugular venous distention (JVD).",
      "Bilateral lung rales (crackles) on auscultation; third heart sound (S3 gallop).",
      "Elevated plasma NT-proBNP (> 900 pg/mL in geriatric age bracket)."
    ],
    symptoms: [
      "Progressive dyspnea on minimal physical exertion, orthopnea (paroxysmal shortness of breath when lying flat), and nocturnal coughing.",
      "Profound geriatric fatigue and cognitive micro-confusion."
    ],
    prescriptions: [
      {
        medicine: "Lasix",
        genericName: "Furosemide",
        standardDose: "20 mg to 40 mg once daily to titrate upwards based on daily weight logs",
        frequency: "Once daily in the morning",
        duration: "Chronic volume overload maintenance",
        clinicalNote: "Loop diuretic targeting Na-K-2Cl cotransporter in loop of Henle. Monitor potassium and Beware Beers fall risk."
      },
      {
        medicine: "Entresto",
        genericName: "Sacubitril / Valsartan",
        standardDose: "24/26 mg to 49/51 mg twice daily",
        frequency: "Twice daily with or without food",
        duration: "Chronic guideline-directed therapy",
        clinicalNote: "ARNI compound: improves myocardial remodeling. Do not initiate within 36 hours of an ACE inhibitor."
      }
    ]
  },

  // --- NEUROLOGY ---
  {
    id: "dis-west",
    name: "Infantile Spasms (West Syndrome)",
    category: "Neurology",
    ageGroup: "Babies",
    causes: [
      "Congenital tuberous sclerosis complex, ischemic encephalopathy, or severe metabolic mitochondrial genetic mutations.",
      "Triggering of deep subcortical focal network pacemakers in the immature neonatal brain."
    ],
    signs: [
      "Sudden, paroxysmal neck-flexion and jackknife cluster muscle contractures occurring in infant waking stages.",
      "Classic chaotic hypsarrhythmia (highly disorganized high-amplitude slow-wave spikes) on 24-hour video-EEG.",
      "Severe regression in neonatal developmental milestones (loss of social smile, head control)."
    ],
    symptoms: [
      "Prolonged crying spells immediately following muscle contractions.",
      "Profound listlessness and regression of social engagement."
    ],
    prescriptions: [
      {
        medicine: "Sabril",
        genericName: "Vigabatrin",
        standardDose: "50 mg/kg/day starting dose, titrating to 150 mg/kg/day if required",
        frequency: "In two divided doses daily",
        duration: "6 months to 1 year continuously",
        clinicalNote: "Highly effective first-line choice, particularly in Tuberous Sclerosis cases. Black box warning: permanent concentric visual field loss."
      },
      {
        medicine: "Acthar Gel",
        genericName: "ACTH (Adrenocorticotropic Hormone)",
        standardDose: "75 IU/m² intramuscularly twice daily",
        frequency: "Twice daily",
        duration: "2-week course followed by a 12-day rapid steroid taper",
        clinicalNote: "Synthetic cortisol inducer. Requires vigilant systemic surveillance for severe steroid-induced hypertension and sepsis."
      }
    ]
  },
  {
    id: "dis-absence",
    name: "Pediatric Absence Epilepsy",
    category: "Neurology",
    ageGroup: "Children",
    causes: [
      "T-type calcium channel mutations in thalamocortical relay circuits provoking rhythmic synchrony.",
      "Autosomal dominant genetic predeterminations showing onset in school-age children (4-10 years)."
    ],
    signs: [
      "Brief starting episodes (5-15 seconds) accompanied by micro-eyelid fluttering.",
      "Symmetric 3-Hz generalized spike-and-wave rhythm complexes triggered by hyperventilation on EEG.",
      "Sudden pause in conversation or drawing, immediately resuming without postictal confusion."
    ],
    symptoms: [
      "Teacher reports of 'daydreaming' at school and drop in performance metrics.",
      "Unexplained spatial lapses and episodic physical freezes."
    ],
    prescriptions: [
      {
        medicine: "Zarontin",
        genericName: "Ethosuximide",
        standardDose: "250 mg once daily (for age 3-6) or 500 mg daily in older",
        frequency: "Divided twice daily with food",
        duration: "Chronically until seizure-free for over two continuous years",
        clinicalNote: "First-line agent. Specifically blocks low-threshold transient T-type calcium channels. Check liver functions."
      }
    ]
  },
  {
    id: "dis-migraine",
    name: "Migraine with Aura (Juvenile)",
    category: "Neurology",
    ageGroup: "Teenagers",
    causes: [
      "Cortical spreading depression (CSD) provoking trigeminovascular peptide activation.",
      "Genetic hyper-reactivity of neurotransmitter pathways triggered by teenage hormonal surges and sleep loss."
    ],
    signs: [
      "Scintillating scotomas (flashing jagged lines in visual fields) preceding severe headache phases.",
      "Systemic pupillary photophobia and hyper-responsiveness to room sound.",
      "Occasional transient hemiparesthesia (one-sided numbness) mimicking acute pediatric stroke."
    ],
    symptoms: [
      "Severe throbbing or pulsating unilateral frontotemporal pain.",
      "Intolerable nausea, sensory dizziness, and vomiting."
    ],
    prescriptions: [
      {
        medicine: "Maxalt-MLT",
        genericName: "Rizatriptan Benzoate",
        standardDose: "5 mg orally (for teens < 40 kg) or 10 mg orally (for teens >= 40 kg)",
        frequency: "Once at onset of headache; may repeat once after 2 hours if migraine persists",
        duration: "Acutely at onset of symptom",
        clinicalNote: "5-HT1B/1D receptor agonist leading to cranial vessel vasoconstriction. Contraindicated in angiopathic hemiplegia."
      }
    ]
  },
  {
    id: "dis-ms",
    name: "Multiple Sclerosis (Remitting-Relapsing)",
    category: "Neurology",
    ageGroup: "Adults",
    causes: [
      "Autoimmune-mediated attack on primary central nervous system myelin structures.",
      "Intersectional environmental factors (Epstein-Barr virus exposure, low Vitamin D) acting on immunogenetic susceptibility loci."
    ],
    signs: [
      "Positive Lhermitte's sign (electric shock feelings down the spine upon flexing the neck).",
      "Multiple hyperintense plaques in periventricular white matter (Dawson's fingers) on brain MRI.",
      "Oligoclonal IgG bands detected in cerebrospinal fluid (CSF) via lumbar puncture."
    ],
    symptoms: [
      "Optic neuritis: sudden painful red/green visual loss in one eye.",
      "Severe numbness, unilateral motor leg weakness, ataxia, and excessive heat-induced exhaustion (Uhthoff's phenomenon)."
    ],
    prescriptions: [
      {
        medicine: "Gilenya",
        genericName: "Fingolimod",
        standardDose: "0.5 mg once daily",
        frequency: "Once daily",
        duration: "Chronic immunomodulating disease modifier",
        clinicalNote: "Sphingosine-1-phosphate receptor modulator. Retains lymphocytes inside lymph nodes. First-dose mandates 6-hour ECG monitoring for severe bradycardia."
      },
      {
        medicine: "Solu-Medrol",
        genericName: "Methylprednisolone Sodium Succinate",
        standardDose: "1000 mg IV once daily",
        frequency: "Once daily",
        duration: "3 to 5 days for acute demyelinating flares",
        clinicalNote: "High-dose steroid pulse to shut down acute systemic central nervous system inflammation."
      }
    ]
  },
  {
    id: "dis-alzheimers",
    name: "Alzheimer's Disease & Vascular Dementia",
    category: "Neurology",
    ageGroup: "Seniors",
    causes: [
      "Extracellular accumulation of amyloid-beta plaques and intracellular hyperphosphorylated tau neurofibrillary tangles.",
      "Microvascular ischemic leukoencephalopathy secondary to senior arterial sclerosis and cerebral amyloid angiopathy."
    ],
    signs: [
      "Progressive cortical atrophy with bilateral hippocampal volume loss on MRI.",
      "Significant decline in cognitive screening (MMSE < 20 / 30).",
      "Gait apraxia, spatial disorientation, and difficulty performing simple daily tasks."
    ],
    symptoms: [
      "Severe memory loss (forgetting recent events, repeating questions), and inability to recognize family.",
      "Apathy, sleep disruptions, and evening anxiety outbursts ('sundown syndrome')."
    ],
    prescriptions: [
      {
        medicine: "Aricept",
        genericName: "Donepezil Hydrochloride",
        standardDose: "5 mg once daily, titrating to 10 mg after 4-6 weeks",
        frequency: "Once daily at bedtime",
        duration: "Chronic cognitive stabilization",
        clinicalNote: "Reversible acetylcholinesterase inhibitor. Watch Beers criteria: highly prone to bradycardia, syncopal falls, and gastrointestinal cramps."
      },
      {
        medicine: "Namenda",
        genericName: "Memantine Hydrochloride",
        standardDose: "5 mg once daily, titrating by 5mg weekly to 20 mg/day max",
        frequency: "Once daily (titrating to 10mg twice daily block)",
        duration: "Maintained chronically in moderate-to-severe phases",
        clinicalNote: "NMDA receptor antagonist. Protects neurons from pathologic tonic levels of glutamate. Minimal interaction."
      }
    ]
  },

  // --- HEMATOLOGY ---
  {
    id: "dis-hdn",
    name: "Hemolytic Disease of the Newborn",
    category: "Hematology",
    ageGroup: "Babies",
    causes: [
      "Maternal Rh-negative IgG antibodies passing transplacentally to destroy Rh-positive newborn erythrocytes.",
      "ABO blood group incompatibilities (Maternal Type O with Type A or B babies)."
    ],
    signs: [
      "Acute, pathologic newborn jaundice presenting in first 24 hours of life.",
      "Profound rapidly drops in hematocrit (anemia) and splenomegaly.",
      "Strong positive Direct Antiglobulin Test (DAT / Coombs test) on cord blood."
    ],
    symptoms: [
      "Floppy muscle tone (hypotonia) and extreme neonatal lethargy.",
      "Poor feeding latch and systemic high-pitched crying."
    ],
    prescriptions: [
      {
        medicine: "Rhophylac",
        genericName: "Rho(D) Immune Globulin (Maternal Prevention)",
        standardDose: "300 mcg intramuscularly or intravenously",
        frequency: "Administered to the mother at 28 weeks gestation and within 72 hours of Rh-positive birth",
        duration: "Single injection per immunizing event",
        clinicalNote: "Crucial preventative medicine. Prevents maternal sensitization to Rh positive red cells."
      },
      {
        medicine: "Privigen",
        genericName: "IVIG (Intravenous Immunoglobulin)",
        standardDose: "0.5 g/kg to 1 g/kg intravenously",
        frequency: "Infused once over 4 hours; may repeat once if hemolysis persists",
        duration: "Emergency neonatology stabilizer",
        clinicalNote: "Blocks Fc receptors on newborn splenic macrophages to arrest ongoing antibody-mediated RBC destruction."
      }
    ]
  },
  {
    id: "dis-sickle",
    name: "Sickle Cell Disease (Vaso-Occlusive Crisis)",
    category: "Hematology",
    ageGroup: "Children",
    causes: [
      "Autosomal recessive homozygous mutation in beta-globin gene (Glu6Val), producing abnormal Hemoglobin S (HbS).",
      "Deoxygenation anomalies causing polymerisation of HbS, turning red cells into rigid crescent-shapes that occlude capillaries."
    ],
    signs: [
      "Dactylitis (painful swelling of hands and feet) in early childhood.",
      "Splenic sequestration: sudden blood pooling in the spleen leading to hypovolemic shock (requires splenectomy).",
      "Icteric sclera (yellow eyes) and chronic mild-to-moderate anemia."
    ],
    symptoms: [
      "Intense, debilitating bone, chest, and back pain (vaso-occlusive crisis).",
      "Chronic weariness, exertional dyspnea, and visual deficits."
    ],
    prescriptions: [
      {
        medicine: "Droxia / Hydrea",
        genericName: "Hydroxyurea",
        standardDose: "15 mg/kg once daily, titrate based on blood cell counts to maximum tolerated dose",
        frequency: "Once daily",
        duration: "Chronic lifelong preventative therapy",
        clinicalNote: "Increases fetal hemoglobin (HbF) levels to prevent polymerization of HbS. Strong myelosuppressive properties: monitor CBC weekly."
      },
      {
        medicine: "Ultram",
        genericName: "Tramadol Hydrochloride",
        standardDose: "1 mg/kg to 1.5 mg/kg for pediatric pain control; up to 50mg",
        frequency: "Every 6 hours as needed for moderate pain crisis",
        duration: "Utilized strictly during active severe crisis flares",
        clinicalNote: "Dual-acting mu-opioid agonist and monoamine uptake inhibitor. Ensure hydration is maximized to prevent renal injury."
      }
    ]
  },
  {
    id: "dis-dvt",
    name: "Deep Vein Thrombosis & Pulmonary Embolism",
    category: "Hematology",
    ageGroup: "Adults",
    causes: [
      "Virchow's Triad: endothelial injury, venous stasis (immobilization), and hypercoagulable vascular states.",
      "Factor V Leiden mutations, antiphospholipid syndromes, active cancer, or major pelvic surgery."
    ],
    signs: [
      "Unilateral calf or thigh edema, deep warmth, and erythema.",
      "Positive Homans' sign (calf pain on pulling toes upward).",
      "Abrupt sinus tachycardia and wedge-shaped consolidation on CT pulmonary angiogram."
    ],
    symptoms: [
      "Severe localized muscular calf cramping.",
      "Pleuritic sharp chest pain, sudden dyspnea, hemoptysis, and pre-syncope."
    ],
    prescriptions: [
      {
        medicine: "Eliquis",
        genericName: "Apixaban",
        standardDose: "10 mg twice daily for 7 days, followed by 5 mg twice daily maintenance",
        frequency: "Twice daily",
        duration: "3 to 6 months depending on transient vs. unprovoked clot indicators",
        clinicalNote: "Highly selective direct Factor Xa inhibitor. Does not require INR monitoring. Check renal parameters before starting."
      }
    ]
  },

  // --- ONCOLOGY ---
  {
    id: "dis-retino",
    name: "Pediatric Retinoblastoma",
    category: "Oncology",
    ageGroup: "Babies",
    causes: [
      "Biallelic mutational inactivation of the RB1 tumor suppressor gene on chromosome 13q14.",
      "Congenital germline predisposition in familial bilateral retinoblastomas."
    ],
    signs: [
      "White pupillary reflex ('leukocoria' or 'cat's eye reflex') visible on flash photographs.",
      "Strabismus (misaligned eye gaze) and secondary intraocular inflammation.",
      "Intraocular mass containing dense calcification on ocular ultrasound."
    ],
    symptoms: [
      "Apparent vision loss or tracking deficits (does not follow parent's face).",
      "Intermittent ocular pain."
    ],
    prescriptions: [
      {
        medicine: "Alimta",
        genericName: "Vincristine / Carboplatin / Etoposide (VEC Protocol)",
        standardDose: "Weight-adjusted systemic chemotherapy doses (oncology specialized calculated)",
        frequency: "Every 3 to 4 weeks for 6 total cycles",
        duration: "6 months chemotherapy course",
        clinicalNote: "Targeted systemic chemo to reduce tumor mass before focal options (cryotherapy, plaque radiation). Prevent myelosuppression."
      }
    ]
  },
  {
    id: "dis-all",
    name: "Acute Lymphoblastic Leukemia (ALL)",
    category: "Oncology",
    ageGroup: "Children",
    causes: [
      "Malignant transformation of lymphoid progenitor stem cells in bone marrow.",
      "Somatic chromosomal translocations (hyperdiploidy, ETV6-RUNX1 fusions) causing cell proliferation."
    ],
    signs: [
      "Profound systemic pallor (due to anemia) and petechiae/bruising (due to thrombocytopenia).",
      "Generalized lymphadenopathy and hepato-splenomegaly.",
      "More than 20% lymphoblasts on bone marrow aspiration."
    ],
    symptoms: [
      "Unexplained bone and joint pain, and refusal to walk.",
      "Recurrent fevers, night sweats, and rapid weight loss."
    ],
    prescriptions: [
      {
        medicine: "Purinethol",
        genericName: "Mercaptopurine (6-MP)",
        standardDose: "75 mg/m² once daily (maintenance phase component)",
        frequency: "Once daily on an empty stomach",
        duration: "Up to 2 years of continuous maintenance therapy",
        clinicalNote: "Purine antagonist. Crucial to verify TPMT and NUDT15 genetic enzymes before starting to prevent toxicity."
      }
    ]
  },
  {
    id: "dis-cml",
    name: "Philadelphia Chromosome Ph+ CML",
    category: "Oncology",
    ageGroup: "Adults",
    causes: [
      "Reciprocal translocation t(9;22)(q34.1;q11.2) forming the BCR-ABL1 chimeric fusion gene.",
      "Constitutive tyrosine kinase enzyme activity provoking clonal expansion of myeloid cells."
    ],
    signs: [
      "Extreme splenomegaly extending to the pelvic brim.",
      "Prominent leukocytosis (WBC > 100,000 cells/µL) with full range of granulocytes.",
      "Presence of Philadelphia chromosome on bone marrow cytogenetics."
    ],
    symptoms: [
      "Left upper quadrant fullness or pain due to splenic engorgement.",
      "Night sweats, low-grade fever, and early satiety upon eating."
    ],
    prescriptions: [
      {
        medicine: "Gleevec",
        genericName: "Imatinib Mesylate",
        standardDose: "400 mg to 600 mg once daily with food and high water volume",
        frequency: "Once daily",
        duration: "Indefinite chronic targeted suppression",
        clinicalNote: "First-generation tyrosine kinase inhibitor (TKI). Prevents phosphorylation of BCR-ABL targets. Monitor for fluid retention and QTc prolongation."
      }
    ]
  },

  // --- NEPHROLOGY ---
  {
    id: "dis-nephritis",
    name: "Congenital Familial Nephritis",
    category: "Nephrology",
    ageGroup: "Babies",
    causes: [
      "Inherited mutations in genes encoding type IV collagen alpha chains (e.g., Alport syndrome).",
      "Structural basement membrane splits and leaks in renal glomeruli."
    ],
    signs: [
      "Hematuria (blood in urine) and persistent cellular casts.",
      "Diffuse bilateral peripheral edema and facial puffiness in newborn stages.",
      "Severe hypertension in newborns."
    ],
    symptoms: [
      "Extreme neonatal fussiness, poor feeding, and respiratory distress from systemic fluid buildup."
    ],
    prescriptions: [
      {
        medicine: "Zestril",
        genericName: "Lisinopril",
        standardDose: "0.07 mg/kg once daily",
        frequency: "Once daily",
        duration: "Chronic kidney protection",
        clinicalNote: "Reduces intraglomerular pressure and arrest progress of proteinuria. Ensure potassium is monitored continuously."
      }
    ]
  },
  {
    id: "dis-hyperphosph",
    name: "End-Stage Renal Disease Hyperphosphatemia",
    category: "Nephrology",
    ageGroup: "Seniors",
    causes: [
      "End-stage renal disease (GFR < 15) resulting in total failure to filter and excrete dietary phosphate.",
      "Secondary parathyroid hyper-drive extracting systemic calcium and phosphorus from bone reserves."
    ],
    signs: [
      "Extremely elevated serum phosphorus (> 6.5 mg/dL).",
      "Calcification deposits in large medium-sized vessels on X-ray.",
      "Pruritus scratching marks on elderly skin."
    ],
    symptoms: [
      "Insufferable all-body itching, bone pain, and muscle weakness."
    ],
    prescriptions: [
      {
        medicine: "Renvela",
        genericName: "Sevelamer Carbonate",
        standardDose: "800 mg to 1600 mg three times daily with meals",
        frequency: "Three times daily with first bite of food",
        duration: "Lifelong dialysis management",
        clinicalNote: "Non-absorbable anion exchange resin. Prevents gut absorption of phosphate. Contraindicated if bowel obstruction exists."
      }
    ]
  },

  // --- ENDOCRINOLOGY ---
  {
    id: "dis-dka",
    name: "Juvenile Type 1 Diabetes (DKA)",
    category: "Endocrinology",
    ageGroup: "Children",
    causes: [
      "Autoimmune-mediated destruction of pancreatic beta cells in the islets of Langerhans.",
      "Complete absence of insulin secretion leading to lipolysis and excessive ketone body creation."
    ],
    signs: [
      "Deep, sighing respiration pattern (Kussmaul breathing) to compensate for metabolic acidosis.",
      "Sweet, acetone-like fruity odor on breath.",
      "Elevated blood glucose (> 250 mg/dL), pH < 7.3, and bicarbonate < 15 mEq/L."
    ],
    symptoms: [
      "Polydipsia (excessive thirst), polyuria (bedwetting), and sudden severe weight loss.",
      "Abdominal pain, nausea, vomiting, and confusion."
    ],
    prescriptions: [
      {
        medicine: "Novolin R",
        genericName: "Regular Insulin",
        standardDose: "0.1 units/kg/hour continuous intravenous infusion",
        frequency: "Continuous intravenous infusion after initial fluid bolus",
        duration: "Continued until serum anion gap closes (pH > 7.3, bicarbonate >= 15)",
        clinicalNote: "Reverses ketogenesis and arrests lipolysis. Never give as a rapid bolus in young kids due to risks of cerebral edema."
      }
    ]
  },
  {
    id: "dis-t2d",
    name: "Type 2 Insulin-Resistant Mellitus",
    category: "Endocrinology",
    ageGroup: "Adults",
    causes: [
      "Impaired insulin receptor signaling combined with progressive pancreatic beta-cell dysfunction.",
      "Visceral adiposity, sedentary lifestyle, and high genetic polygenic penetrance."
    ],
    signs: [
      "Elevated glycated hemoglobin (HbA1c >= 6.5%).",
      "Hypartrophea of neck skin (Acanthosis nigricans) indicating severe insulin resistance.",
      "Elevated fasting plasma glucose levels."
    ],
    symptoms: [
      "Fatigue, blurred vision, slow-healing skin cuts, and frequent yeast infections.",
      "Increased hunger (polyphagia) and frequent nocturia."
    ],
    prescriptions: [
      {
        medicine: "Glucophage",
        genericName: "Metformin Hydrochloride",
        standardDose: "500 mg to 1000 mg twice daily with meals",
        frequency: "Twice daily with main meals",
        duration: "Indefinite glycemic control foundation",
        clinicalNote: "First-line oral antidiabetic agent. Direct AMPK activator. Hold immediately if GFR < 30 to prevent lactic acidosis."
      }
    ]
  },

  // --- IMMUNOLOGY ---
  {
    id: "dis-scid",
    name: "Severe Combined Immunodeficiency (SCID)",
    category: "Immunology",
    ageGroup: "Babies",
    causes: [
      "X-linked SCID due to mutations in il2rg gene, or autosomal recessive adenosine deaminase (ADA) gene deficiency.",
      "Complete failure of thymic lymphoid tissue to mature both T-cells and B-cells."
    ],
    signs: [
      "Recurrent, life-threatening opportunistic infections (Pneumocystis jirovecii, Candida mucosal thrush) inside the first months of life.",
      "Complete absence of lymphoid tissue (tonsils) and thymic shadow on chest radiograph.",
      "Absolute lymphocyte count (ALC) severely low (< 1000/µL in babies)."
    ],
    symptoms: [
      "Severe chronic diarrhea, failure to thrive, and physical developmental regression."
    ],
    prescriptions: [
      {
        medicine: "Septra Pediatric",
        genericName: "Trimethoprim / Sulfamethoxazole",
        standardDose: "150 mg/m²/day divided to twice daily (on three consecutive days/week)",
        frequency: "Twice daily every Mon/Tue/Wed",
        duration: "Continuously until successful bone marrow transplant",
        clinicalNote: "Vital prophylaxis. Protects fragile baby against fatal Pneumocystis jirovecii pneumonia."
      }
    ]
  },
  {
    id: "dis-lupus",
    name: "Systemic Lupus Erythematosus (SLE Flares)",
    category: "Immunology",
    ageGroup: "Adults",
    causes: [
      "Severe loss of immune self-tolerance and aberrant clearance of nuclear apologies.",
      "Deposition of ANA (antinuclear antibody) immune complexes in tissues, activating complement."
    ],
    signs: [
      "Malar classic 'butterfly' erythematous rash sparing the nasolabial folds.",
      "Elevated titers of anti-double-stranded DNA (anti-dsDNA) and anti-Smith antibodies.",
      "Active urine sediments (casts and protein) in lupus nephritis flares."
    ],
    symptoms: [
      "Symmetric, migratory polyarthritis in hands and wrist structures.",
      "Fever of unexplained origin, profound systemic exhaustion, ulcers, and hair loss."
    ],
    prescriptions: [
      {
        medicine: "Deltasone",
        genericName: "Prednisone",
        standardDose: "20 mg to 60 mg orally once daily, followed by structured weekly tapers",
        frequency: "Once daily in the morning with food",
        duration: "Acute flare control; taper to minimal possible dose",
        clinicalNote: "Powerful systemic anti-inflammatory glucocorticoid. Consider co-prescribing calcium and PPI for stomach protection."
      },
      {
        medicine: "Plaquenil",
        genericName: "Hydroxychloroquine Sulfate",
        standardDose: "200 mg to 400 mg once daily base on body weight",
        frequency: "Once daily with food",
        duration: "Indefinite lupus flare prevention basis",
        clinicalNote: "Inhibits toll-like receptor signaling. Essential baseline drug for all SLE patients. Annual dilated eye exams are mandatory for retinopathy check."
      }
    ]
  },
  // --- PEDIATRICS ---
  {
    id: "dis-pyloric",
    name: "Infantile Hypertrophic Pyloric Stenosis",
    category: "Pediatrics",
    ageGroup: "Babies",
    causes: [
      "Hypertrophy and hyperplasia of the circular muscle fibers of the pylorus.",
      "Genetic predisposition with higher family prevalence and male predominance."
    ],
    signs: [
      "Visible peristaltic waves traveling from left to right across the upper abdomen.",
      "Palpable olive-shaped mass in the right upper quadrant or epigastric region.",
      "Severe hypokalemic hypochloremic metabolic alkalosis due to loss of gastric secretions."
    ],
    symptoms: [
      "Non-bilious projectile vomiting immediately after feeding in a 3- to 6-week-old baby.",
      "Persistent hunger ('hungry vomiter'), weight loss, and signs of moderate to severe dehydration."
    ],
    prescriptions: [
      {
        medicine: "Normal Saline Bolus",
        genericName: "0.9% Sodium Chloride with 5% Dextrose",
        standardDose: "20 mL/kg IV bolus, followed by maintenance fluids with potassium",
        frequency: "Continuous intravenous infusion",
        duration: "Maintained pre-operatively until metabolic alkalosis is fully corrected",
        clinicalNote: "Essential fluid resus to correct severe hypokalemic hypochloremic alkalosis before safe general anesthesia can be administered for pyloromyotomy."
      }
    ]
  },
  {
    id: "dis-croup",
    name: "Acute Laryngotracheobronchitis (Croup)",
    category: "Pediatrics",
    ageGroup: "Children",
    causes: [
      "Viral infection of the upper airway, most commonly Parainfluenza Virus Type 1.",
      "Subglottic inflammation and narrowing causing airway impedance."
    ],
    signs: [
      "Inspiratory stridor exacerbated by agitations or crying.",
      "Deep, metallic 'barking' or seal-like cough.",
      "Anteroposterior neck radiograph displaying focal subglottic narrowing ('steeple sign')."
    ],
    symptoms: [
      "Hoarseness, respiratory distress with nasal flaring, and chest retractions.",
      "Low grade fever and worsening of symptoms at night."
    ],
    prescriptions: [
      {
        medicine: "Decadron",
        genericName: "Dexamethasone",
        standardDose: "0.6 mg/kg orally or intramuscularly as a single dose (Max 16 mg)",
        frequency: "Once as a single dose",
        duration: "Single acute dose",
        clinicalNote: "Long-acting corticosteroid that dramatically decreases subglottic laryngeal edema within 4 to 6 hours."
      },
      {
        medicine: "Vaponefrin",
        genericName: "Racemic Epinephrine 2.25%",
        standardDose: "0.5 mL of 2.25% solution diluted in 3 mL of normal saline via nebulizer",
        frequency: "Every 2 to 4 hours as needed for moderate to severe stridor",
        duration: "Inhalation therapy under clinical observation for post-nebulizer rebound",
        clinicalNote: "Locally vasoconstricts mucosal blood vessels to quickly relieve severe airway obstruction. Observe for at least 3 hours for rebound stridor."
      }
    ]
  },
  {
    id: "dis-otitis",
    name: "Acute Otitis Media",
    category: "Pediatrics",
    ageGroup: "Children",
    causes: [
      "Bacterial colonization of middle ear fluid, secondary to Eustachian tube dysfunction.",
      "Primary pathogens: Streptococcus pneumoniae, Haemophilus influenzae, or Moraxella catarrhalis."
    ],
    signs: [
      "Bulging, erythematous, opaque, or yellowish tympanic membrane on otoscopy with limited mobility.",
      "Otorrhea if tympanic membrane rupture has occurred."
    ],
    symptoms: [
      "Severe unilateral ear pain (otalgia), pulling or rubbing at the ears in young infants.",
      "Irritability, febrile spikes, sleep disturbances, and poor feeding."
    ],
    prescriptions: [
      {
        medicine: "Amoxil",
        genericName: "Amoxicillin",
        standardDose: "80 to 90 mg/kg/day divided into twice-daily doses",
        frequency: "Every 12 hours orally",
        duration: "10 days for children < 2 years, or 5 to 7 days for children >= 6 years",
        clinicalNote: "First-line high-dose Penicillin antibiotic targeting Streptococcus pneumoniae. Adjust to cephalosporins if penicillin-allergic."
      }
    ]
  },
  // --- GERIATRICS ---
  {
    id: "dis-parkinson",
    name: "Parkinson's Disease Encephalopathy",
    category: "Geriatrics",
    ageGroup: "Seniors",
    causes: [
      "Loss of pigmented dopaminergic neurons in the substantia nigra pars compacta.",
      "Intracellular accumulation of Lewy bodies containing alpha-synuclein proteins."
    ],
    signs: [
      "Resting 'pill-rolling' tremor (4-6 Hz) that attenuates with purposeful movement.",
      "Cogwheel rigidity, muscle stiffness, and lead-pipe resistance.",
      "Forward-flexed posture with shuffling gait, lack of arm swing, and postural instability."
    ],
    symptoms: [
      "Bradykinesia (extreme slowness of initiated movement), difficulty getting out of chairs.",
      "Micrographia (progressive shrinkage of handwriting), dysphagia, and cognitive slowness."
    ],
    prescriptions: [
      {
        medicine: "Sinemet",
        genericName: "Levodopa / Carbidopa (Immediate Release)",
        standardDose: "25/100 mg three times daily, adjusted gradually based on clinical response",
        frequency: "Three times daily, taken 30 minutes before or 1 hour after meals",
        duration: "Indefinite neurochemical baseline treatment",
        clinicalNote: "Carbidopa prevents peripheral conversion of levodopa so it can cross the blood-brain barrier. High protein meals interfere with absorption."
      }
    ]
  },
  {
    id: "dis-osteoporosis",
    name: "Frail Sarcopenia & Osteoporosis",
    category: "Geriatrics",
    ageGroup: "Seniors",
    causes: [
      "Uncoupled osteoclastic bone resorption exceeding osteoblastic bone formation in elderly cohorts.",
      "Primary estrogen/testosterone deficiency combined with muscle-wasting protein catabolism."
    ],
    signs: [
      "Bone Mineral Density T-score of -2.5 or lower in lumbar spine, femoral neck, or hip DEXA scans.",
      "Severe loss of height (>= 4 cm) or progressive thoracic kyphosis ('dowager's hump').",
      "Short physical performance gait speed < 0.8 meters/second."
    ],
    symptoms: [
      "Dull, persistent lower backache, muscle weakness, and extreme fear of falling.",
      "Severe acute vertebral body pain indicating an undiagnosed compression fracture."
    ],
    prescriptions: [
      {
        medicine: "Fosamax",
        genericName: "Alendronate Sodium",
        standardDose: "70 mg orally once weekly",
        frequency: "Once weekly in the morning on an empty stomach",
        duration: "3 to 5 years (re-evaluate with bone density markers)",
        clinicalNote: "Bisphosphonate that binds to bone surfaces and inhibits osteoclasts. Must take with 8 oz of plain water while upright and remain upright for 30 minutes to prevent severe esophagitis."
      }
    ]
  },
  {
    id: "dis-shingles",
    name: "Herpes Zoster (Shingles)",
    category: "Geriatrics",
    ageGroup: "Seniors",
    causes: [
      "Reactivation of latent Varicella-Zoster Virus (VZV) restricted within sensory dorsal root ganglia.",
      "Declining cell-mediated immunity associated with senescence in seniors."
    ],
    signs: [
      "Unilateral, painful vesicular eruption clustered strictly along a single dermatomal nerve path.",
      "Erythematous maculopapular base progressing to clear turgid vesicles, then crusting."
    ],
    symptoms: [
      "Intense localized burning, burning paresthesias, hyperesthesia, or lancinating severe neuropathic pain preceding vesicular rash by 48-72 hours.",
      "Intractable pruritus and localized nerve soreness."
    ],
    prescriptions: [
      {
        medicine: "Valtrex",
        genericName: "Valacyclovir Hydrochloride",
        standardDose: "1000 mg orally three times daily",
        frequency: "Every 8 hours orally",
        duration: "7 days",
        clinicalNote: "Anti-viral nucleoside analogue. Must initiate within 72 hours of rash onset to reduce severity and risk of long-term Post-Herpetic Neuralgia (PHN)."
      },
      {
        medicine: "Lyrica",
        genericName: "Pregabalin",
        standardDose: "25 mg to 75 mg orally twice daily, titrated up based on nerve pain control",
        frequency: "Twice daily",
        duration: "Maintained chronically during post-herpetic neuropathic phase",
        clinicalNote: "Gabapentinoid that binds to voltage-gated calcium channels in CNS to diminish neural transmitter discharge. Monitor for geriatric somnolence or confusion."
      }
    ]
  },
  // --- GENERAL MEDICINE ---
  {
    id: "dis-pneumonia",
    name: "Community-Acquired Pneumonia",
    category: "General",
    ageGroup: "Adults",
    causes: [
      "Infection of pulmonary parenchymal tissues by inhaled pathogens.",
      "Most frequent agent: Streptococcus pneumoniae, or atypicals like Mycoplasma pneumoniae."
    ],
    signs: [
      "Lobar consolidation, air bronchograms, or patchy infiltrates on chest radiograph.",
      "Crackles (crepitations) and bronchial breath sounds on lung auscultation.",
      "Tachycardia, tachypnea, and pyrexia with leucocytosis."
    ],
    symptoms: [
      "Cough with purulent or rust-colored sputum production.",
      "Sharp, pleuritic chest pain aggravated by deep inhalation or coughing.",
      "Shaking chills, rigors, dyspnea, and all-body myalgia."
    ],
    prescriptions: [
      {
        medicine: "Zithromax",
        genericName: "Azithromycin Monohydrate",
        standardDose: "500 mg orally on Day 1, followed by 250 mg daily on Days 2 through 5",
        frequency: "Once daily",
        duration: "5 days",
        clinicalNote: "Macrolide antibiotic. Blocks bacterial protein synthesis. Monitor for QTc interval prolongation, particularly in patients with cardiovascular histories."
      }
    ]
  },
  {
    id: "dis-gerd",
    name: "Gastroesophageal Reflux Disease (GERD)",
    category: "General",
    ageGroup: "Adults",
    causes: [
      "Incompetence or transient relaxation of the lower esophageal sphincter (LES).",
      "Delayed gastric emptying, hiatal hernia, or elevated intra-abdominal pressures."
    ],
    signs: [
      "Endoscopic discovery of distal esophageal mucosal erosions, peptic strictures, or columnar metaplasia (Barrett's Esophagus) on biopsy."
    ],
    symptoms: [
      "Frequent substernal burning sensation (heartburn) radiating up toward the throat, usually post-prandial.",
      "Sour or bitter acid regurgitation, dysphagia, globus sensation, and chronic nocturnal dry cough."
    ],
    prescriptions: [
      {
        medicine: "Prilosec d-r",
        genericName: "Omeprazole (Delayed-Release)",
        standardDose: "20 mg to 40 mg orally once daily",
        frequency: "Once daily inside 30 to 60 minutes before the first meal of the day",
        duration: "4 to 8 weeks",
        clinicalNote: "Irreversible Proton Pump Inhibitor (PPI). Suppresses basal and stimulated gastric acid. Long-term use in elderly can increase risks of osteoporosis and B12 deficiency."
      }
    ]
  },
  {
    id: "dis-asthma",
    name: "Asthma Bronchiospasms (Acute Exacerbation)",
    category: "General",
    ageGroup: "Teenagers",
    causes: [
      "Reversible bronchoconstriction driven by chronic eosinophilic or neutrophilic airway inflammation.",
      "Hyper-reactivity of tracheobronchial smooth muscle triggered by environmental allergens, stress or infections."
    ],
    signs: [
      "Diffuse bilateral high-pitched expiratory wheezing on chest auscultation.",
      "Use of accessory respiratory muscles, tachypnea, and decreased peak expiratory flow rate (PEFR)."
    ],
    symptoms: [
      "Acute dyspnea, severe chest tightness, persistent dry cough worsening at night.",
      "Extreme difficulty speaking in full sentences due to lung capacity depletion."
    ],
    prescriptions: [
      {
        medicine: "ProAir HFA",
        genericName: "Albuterol Sulfate",
        standardDose: "2 to 4 puffs via metered-dose inhaler with spacer every 20 minutes for up to 3 doses; then every 1 to 4 hours as needed",
        frequency: "Inhalation every 20 mins acutely; then PRN",
        duration: "Acute acute rescue phase",
        clinicalNote: "Rapid-acting selective beta2-adrenergic agonist that relaxes bronchial smooth muscle. Monitor for transient tremors or tachycardia."
      },
      {
        medicine: "Flovent HFA",
        genericName: "Fluticasone Propionate",
        standardDose: "88 mcg to 220 mcg inhaled twice daily",
        frequency: "Twice daily",
        duration: "Inhaled maintenance controller",
        clinicalNote: "Potent inhaled corticosteroid that reduces airway edema and cellular hyper-sensitivity. Always rinse oral cavity with water after use to prevent candidal thrust."
      }
    ]
  }
];
