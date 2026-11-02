/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AgeGroup = 'Babies' | 'Children' | 'Teenagers' | 'Adults' | 'Seniors';

export type MedicalSpecialty = 'Cardiology' | 'Hematology' | 'Neurology' | 'Pediatrics' | 'Geriatrics' | 'Oncology' | 'Nephrology' | 'Endocrinology' | 'Immunology' | 'General';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  ageGroup: AgeGroup;
  specialtyFocus: MedicalSpecialty;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  weightKg?: number;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface DiseaseInfo {
  name: string;
  category: MedicalSpecialty;
  ageGroup: AgeGroup;
  summary: string;
  detailedAnalysis: string; // Markdown text
  clinicalGuidelines: string[];
  symptoms: string[];
  riskFactors: string[];
  dosagePrecautions: string;
  groundingSources: GroundingSource[];
  timestamp: string;
  isQuotaExceeded?: boolean;
  isFallback?: boolean;
  fallbackReason?: string;
}

export interface PrescriptionAnalysisResult {
  id: string;
  patientName: string;
  patientAge: number;
  patientAgeGroup: AgeGroup;
  specialtyContext: MedicalSpecialty;
  detectedMedicines: Array<{
    name: string;
    dosageStrength: string;
    frequency: string;
    description: string;
    specialtyInsight: string; // specificity for cardiology/hematology/neurology
    ageAppropriateNotes: string; // safety assessment for patient's age
    risksOrSideEffects: string[];
  }>;
  drugInteractionsCheck: string;
  generalPrecautions: string;
  doctorInstructions: string;
  relevanceToSpecialty: string;
  criticalAlerts: string[];
  rawAnalysisText: string;
  timestamp: string;
  isQuotaExceeded?: boolean;
  isFallback?: boolean;
  fallbackReason?: string;
}

export interface PreservedPreset {
  id: string;
  title: string;
  content: string;
  category: MedicalSpecialty;
  ageGroup: AgeGroup;
}
