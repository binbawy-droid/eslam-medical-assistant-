/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, AgeGroup, MedicalSpecialty } from '../types';
import { ShieldAlert, User, LogIn, Heart, Brain, Activity, Sparkles } from 'lucide-react';

interface LoginModalProps {
  onLogin: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
  onLogout: () => void;
}

const PRESET_PROFILES: UserProfile[] = [
  {
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
  },
  {
    id: "p2",
    name: "Dr. Clara Heart",
    age: 67,
    ageGroup: "Seniors",
    specialtyFocus: "Cardiology",
    email: "clara.heart@healthai.int",
    gender: "Female",
    weightKg: 68,
    chronicConditions: ["Mild Hypertension"],
    allergies: ["Sulfa drugs"]
  },
  {
    id: "p3",
    name: "Dr. Ryan Todd",
    age: 31,
    ageGroup: "Babies",
    specialtyFocus: "General",
    email: "ryan.todd@pediatrics.int",
    gender: "Male",
    weightKg: 80,
    chronicConditions: ["None"],
    allergies: ["None"]
  },
  {
    id: "p4",
    name: "Marcus Bleed",
    age: 8,
    ageGroup: "Children",
    specialtyFocus: "Hematology",
    email: "marcus.kid@guardian.com",
    gender: "Male",
    weightKg: 26,
    chronicConditions: ["Beta-Thalassemia Minor"],
    allergies: ["Peanuts"]
  }
];

export default function LoginModal({ onLogin, currentProfile, onLogout }: LoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customAge, setCustomAge] = useState<number>(35);
  const [customSpecialty, setCustomSpecialty] = useState<MedicalSpecialty>("General");
  const [customGender, setCustomGender] = useState<'Male' | 'Female' | 'Other'>("Male");
  const [customAllergies, setCustomAllergies] = useState("");
  const [customConditions, setCustomConditions] = useState("");

  const getAgeGroup = (age: number): AgeGroup => {
    if (age <= 2) return 'Babies';
    if (age <= 12) return 'Children';
    if (age <= 19) return 'Teenagers';
    if (age <= 59) return 'Adults';
    return 'Seniors';
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const ageGroup = getAgeGroup(customAge);
    const profile: UserProfile = {
      id: "custom-" + Math.random().toString(36).substring(2, 9),
      name: customName,
      age: customAge,
      ageGroup,
      specialtyFocus: customSpecialty,
      email: `${customName.toLowerCase().replace(/\s+/g, '')}@clinical-sim.local`,
      gender: customGender,
      allergies: customAllergies ? customAllergies.split(',').map(s => s.trim()) : [],
      chronicConditions: customConditions ? customConditions.split(',').map(s => s.trim()) : []
    };
    onLogin(profile);
    setIsOpen(false);
  };

  const selectPreset = (profile: UserProfile) => {
    onLogin(profile);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" id="login-module-container">
      {/* Trigger Button or Active User Pill */}
      {currentProfile ? (
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 pl-3 rounded-xl shadow-lg transition duration-200">
          <div className="flex flex-col text-right">
            <span className="font-sans text-sm font-semibold text-white/95">{currentProfile.name}</span>
            <span className="font-mono text-[10px] text-emerald-400">
              {currentProfile.ageGroup} • {currentProfile.specialtyFocus} Focus
            </span>
          </div>
          <div className="h-9 w-9 bg-teal-950/70 text-teal-400 border border-teal-800/80 rounded-lg flex items-center justify-center font-bold font-mono shadow-inner">
            {currentProfile.name.charAt(0)}
          </div>
          <button
            onClick={onLogout}
            id="btn-logout"
            className="text-xs hover:text-rose-400 text-slate-400 bg-slate-800 hover:bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700 font-sans transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          id="btn-login-trigger"
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md hover:from-teal-400 hover:to-emerald-400 transition transform hover:-translate-y-0.5 active:translate-y-0 font-sans"
        >
          <LogIn className="w-4 h-4 text-slate-950" />
          Access Medical Portal (Login)
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-900/40 via-emerald-950/10 to-transparent p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white">Select Clinical Section / Login</h3>
                  <p className="text-xs text-slate-400">Identify clinical specialty and demographic cohort constraints</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Preset Section Accounts */}
              <div>
                <h4 className="font-sans font-semibold text-xs text-teal-400 uppercase tracking-wider mb-3">
                  Pre-Configured Specialist Tracks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => selectPreset(profile)}
                      className="group text-left p-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl transition duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700/40 group-hover:bg-teal-500/10 rounded-lg text-slate-300 group-hover:text-teal-400 transition">
                          {profile.specialtyFocus === 'Cardiology' && <Heart className="w-4 h-4" />}
                          {profile.specialtyFocus === 'Neurology' && <Brain className="w-4 h-4" />}
                          {profile.specialtyFocus === 'Hematology' && <Activity className="w-4 h-4" />}
                          {profile.specialtyFocus === 'General' && <User className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-sans text-sm font-semibold text-slate-200 group-hover:text-white transition">
                            {profile.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded">
                              Age: {profile.age}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-teal-950 text-teal-300 border border-teal-900 rounded">
                              {profile.specialtyFocus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Sign In */}
              <div className="border-t border-slate-800 pt-5">
                <h4 className="font-sans font-semibold text-xs text-emerald-400 uppercase tracking-wider mb-4">
                  Or Create Custom Clinical / Patient Profile
                </h4>
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-sans font-medium">Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Jane Smith"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-sans font-medium">
                        Age (0 to 100 yr old)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="110"
                        required
                        value={customAge}
                        onChange={(e) => setCustomAge(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none transition"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                        Mapped Cohort: {getAgeGroup(customAge)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-sans font-medium">Primary Focus</label>
                      <select
                        value={customSpecialty}
                        onChange={(e) => setCustomSpecialty(e.target.value as MedicalSpecialty)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none transition"
                      >
                        <option value="General">General/Pediatrics</option>
                        <option value="Cardiology">Cardiology (Heart)</option>
                        <option value="Hematology">Hematology (Blood)</option>
                        <option value="Neurology">Neurology (Brain)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-sans font-medium">Gender</label>
                      <select
                        value={customGender}
                        onChange={(e) => setCustomGender(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 outline-none transition"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5 font-sans font-medium">Known Allergies</label>
                      <input
                        type="text"
                        placeholder="e.g. Penicillin, nuts (comma separated)"
                        value={customAllergies}
                        onChange={(e) => setCustomAllergies(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-sans font-medium">Chronic Diseases / Base Conditions</label>
                    <input
                      type="text"
                      placeholder="e.g. Hypertension, Leukemia, Alzheimer, Epilepsy (comma separated)"
                      value={customConditions}
                      onChange={(e) => setCustomConditions(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-sans transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="btn-login-submit"
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold rounded-xl text-sm font-sans transition shadow-md"
                    >
                      Initialize Workspace
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
