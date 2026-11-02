/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Fingerprint, 
  ShieldAlert, 
  Save, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  User, 
  Compass, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AgeGroup } from '../types';

interface VitalCapillaryScannerProps {
  onCommitToEMR?: (record: {
    bpm: number;
    spo2: number;
    bpSystolic: number;
    bpDiastolic: number;
    rbcCount: number;
    hemoglobin: number;
    scannedAt: string;
  }) => void;
  selectedAgeGroup?: AgeGroup;
}

export default function VitalCapillaryScanner({ 
  onCommitToEMR, 
  selectedAgeGroup = 'Adults' 
}: VitalCapillaryScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [buttonFeedbackText, setButtonFeedbackText] = useState("PRESS AND HOLD FINGERPRINT SENSOR SECURELY");

  // Scanned telemetry readings state
  const [readings, setReadings] = useState<{
    bpm: number;
    spo2: number;
    bpSystolic: number;
    bpDiastolic: number;
    rbcCount: number;
    hemoglobin: number;
    scannedAt: string;
  } | null>(null);

  // EMR Log saved notification state
  const [isSaved, setIsSaved] = useState(false);

  // Canvas details for PPG wave rendering
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const ppgOffset = useRef(0);

  // Custom targets based on demographic age groups
  const getSimulatedRange = () => {
    switch(selectedAgeGroup) {
      case 'Babies':
        return {
          bpmMin: 110, bpmMax: 140,
          spo2Min: 98, spo2Max: 100,
          bpSysMin: 70, bpSysMax: 85,
          bpDiaMin: 45, bpDiaMax: 55,
          rbcMin: 4.0, rbcMax: 5.2,
          hbMin: 14.5, hbMax: 18.2
        };
      case 'Children':
        return {
          bpmMin: 80, bpmMax: 110,
          spo2Min: 97, spo2Max: 99,
          bpSysMin: 90, bpSysMax: 110,
          bpDiaMin: 60, bpDiaMax: 70,
          rbcMin: 3.8, rbcMax: 4.8,
          hbMin: 11.5, hbMax: 14.0
        };
      case 'Teenagers':
        return {
          bpmMin: 65, bpmMax: 95,
          spo2Min: 97, spo2Max: 100,
          bpSysMin: 105, bpSysMax: 120,
          bpDiaMin: 65, bpDiaMax: 75,
          rbcMin: 4.1, rbcMax: 5.4,
          hbMin: 12.0, hbMax: 15.5
        };
      case 'Adults':
        return {
          bpmMin: 60, bpmMax: 85,
          spo2Min: 96, spo2Max: 99,
          bpSysMin: 115, bpSysMax: 125,
          bpDiaMin: 75, bpDiaMax: 83,
          rbcMin: 4.5, rbcMax: 5.9,
          hbMin: 13.5, hbMax: 17.0
        };
      case 'Seniors':
        return {
          bpmMin: 68, bpmMax: 90,
          spo2Min: 94, spo2Max: 98,
          bpSysMin: 125, bpSysMax: 138,
          bpDiaMin: 70, bpDiaMax: 88,
          rbcMin: 4.0, rbcMax: 5.0,
          hbMin: 12.0, hbMax: 15.0
        };
      default:
        return {
          bpmMin: 72, bpmMax: 80,
          spo2Min: 98, spo2Max: 99,
          bpSysMin: 120, bpSysMax: 120,
          bpDiaMin: 80, bpDiaMax: 80,
          rbcMin: 4.7, rbcMax: 5.2,
          hbMin: 14.0, hbMax: 15.5
        };
    }
  };

  // Draw smooth continuous photoelectric PPG waves on our canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid lines
      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 15) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      ctx.strokeStyle = isScanning ? '#ef4444' : '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      // Compute wave structure mimicking arterial pressure contractions
      for (let x = 0; x < width; x++) {
        const factor = isScanning ? 4.5 : 1.5;
        const waveSpeed = isScanning ? 0.22 : 0.08;
        
        // Multi-frequency sine for professional PPG dicrotic notch
        const arg1 = (x * 0.04) - (ppgOffset.current * waveSpeed);
        const arg2 = (x * 0.08) - (ppgOffset.current * waveSpeed * 2);
        const y = (height / 2) + Math.sin(arg1) * (18 * factor) + Math.sin(arg2) * (6 * factor);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Update phase translation frame
      ppgOffset.current += 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning]);

  // Handle Scanning duration interval state
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScanning && scanProgress < 100) {
      timer = setInterval(() => {
        setScanProgress(p => {
          const next = p + 2.5; 
          if (next >= 100) {
            setIsScanning(false);
            setScanCompleted(true);
            computeFinalBiometrics();
            setButtonFeedbackText("OPTICAL PRESSURE ANALYSIS ACQUIRED");
            return 100;
          }
          return next;
        });
      }, 90);
    }
    return () => clearInterval(timer);
  }, [isScanning, scanProgress]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanCompleted(false);
    setIsSaved(false);
    setButtonFeedbackText("MAINTAIN EQUAL CAPILLARY COMPRESSION...");
  };

  const cancelScanOrRelease = () => {
    if (isScanning && scanProgress < 100) {
      setIsScanning(false);
      setScanProgress(0);
      setButtonFeedbackText("SCAN CANCELED - HOLD UNTIL COMPLETED");
    }
  };

  // Generate demographic-accurate realistic numeric measures
  const computeFinalBiometrics = () => {
    const limits = getSimulatedRange();
    
    const bpm = Math.floor(Math.random() * (limits.bpmMax - limits.bpmMin + 1)) + limits.bpmMin;
    const spo2 = Math.floor(Math.random() * (limits.spo2Max - limits.spo2Min + 1)) + limits.spo2Min;
    const bpSystolic = Math.floor(Math.random() * (limits.bpSysMax - limits.bpSysMin + 1)) + limits.bpSysMin;
    const bpDiastolic = Math.floor(Math.random() * (limits.bpDiaMax - limits.bpDiaMin + 1)) + limits.bpDiaMin;
    
    // Decimals for RBC and Hemoglobin markers
    const rbcCount = parseFloat((Math.random() * (limits.rbcMax - limits.rbcMin) + limits.rbcMin).toFixed(2));
    const hemoglobin = parseFloat((Math.random() * (limits.hbMax - limits.hbMin) + limits.hbMin).toFixed(1));

    setReadings({
      bpm,
      spo2,
      bpSystolic,
      bpDiastolic,
      rbcCount,
      hemoglobin,
      scannedAt: new Date().toLocaleTimeString()
    });
  };

  const commitToEMR = () => {
    if (!readings) return;
    if (onCommitToEMR) {
      onCommitToEMR(readings);
    }
    setIsSaved(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row" id="capillary-ppg-scanner">
      {/* Visual Sensor & Interface Section */}
      <div className="p-4 md:w-3/5 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-slate-800">
            <Fingerprint className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-tight text-slate-900 leading-none">
                Capillary Photoelectric Pulse & Red Cell Measure
              </h3>
              <span className="text-[10px] text-slate-400 font-mono uppercase">Photoplethysmography [Sensing Node]</span>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 leading-relaxed">
            By exposing the capillary beds of the finger to a combined 660nm (red) and 940nm (infrared) LED ray, we compute vascular pressure waves and estimate exact RBC / oxygen ratios.
          </p>
        </div>

        {/* Live PPG Canvas Waveform Graph */}
        <div className="my-4 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
          <canvas 
            ref={canvasRef} 
            width={380} 
            height={90} 
            className="w-full h-[90px] block bg-slate-950"
          />
          <div className="absolute top-2 left-3 flex items-center gap-1.5 text-[8.5px] font-mono text-slate-400 z-10 bg-black/40 px-1.5 py-0.5 rounded">
            <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? "bg-red-500 animate-ping" : "bg-slate-500"}`} />
            <span>PPG TRANSMISSION STATUS: {isScanning ? "STREAMING" : "STANDBY"}</span>
          </div>

          {isScanning && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-800">
              <div 
                className="h-full bg-red-500 transition-all duration-100 ease-out" 
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* The Sensory Fingerprint scan contact zone */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          
          <div className="relative">
            {/* Ambient scanner rings */}
            <div className={`absolute -inset-2.5 rounded-full opacity-30 transition blur-sm ${
              isScanning 
                ? "bg-red-400 animate-pulse scale-105" 
                : "bg-slate-300 scale-95"
            }`} />

            <button
              onMouseDown={startScan}
              onMouseUp={cancelScanOrRelease}
              onMouseLeave={cancelScanOrRelease}
              onTouchStart={startScan}
              onTouchEnd={cancelScanOrRelease}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition select-none outline-none ${
                isScanning 
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/20 scale-95" 
                  : scanCompleted 
                    ? "bg-emerald-600 text-white animate-bounce shadow-md shadow-emerald-600/10"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Fingerprint className="w-8 h-8" />
            </button>
          </div>

          <div className="text-center">
            <span className="block text-[10px] font-mono font-bold text-slate-700 tracking-tight">
              {buttonFeedbackText}
            </span>
            <span className="block text-[9px] text-slate-400">
              {isScanning 
                ? `Scanning progress: ${Math.floor(scanProgress)}% - Hold firm`
                : "Continuous mouse-down/touch on pad to activate diagnostic beams"
              }
            </span>
          </div>

        </div>
      </div>

      {/* Vital Telemetry Dossier Commuter Panel */}
      <div className="p-4 md:w-2/5 bg-slate-50/70 flex flex-col justify-between">
        <div>
          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Target EMR Vital Statistics ({selectedAgeGroup})
          </span>

          {!readings ? (
            <div className="p-6 border border-dashed border-slate-200 rounded-xl bg-white text-center flex flex-col justify-center items-center min-h-[175px]">
              <Activity className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-[11px] font-semibold text-slate-600">No Biometrics Scanned</p>
              <p className="text-[9px] text-slate-400 mt-0.5 max-w-[170px] leading-normal mx-auto">
                Press the fingerprint scanner pad on the left to measure real heart bpm, RBC counts, and pressure parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200">
              
              {/* Readings Block grid style */}
              <div className="grid grid-cols-2 gap-2 text-slate-800 font-mono">
                
                {/* BPM */}
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="block text-[8px] text-slate-400 font-sans uppercase">Heart Rate</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-900 font-sans">{readings.bpm}</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">BPM</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 text-[8px] text-emerald-600 font-sans">
                    <Heart className="w-2.5 h-2.5 fill-current animate-pulse text-red-500" />
                    <span>Sinus Rhythmic</span>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="block text-[8px] text-slate-400 font-sans uppercase">Oxygen rate</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-extrabold text-blue-600 font-sans">{readings.spo2}%</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">SpO₂</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-[8px] text-[10px] font-sans font-bold leading-none mt-0.5 text-blue-500">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    <span>Hemoglobin Sat</span>
                  </div>
                </div>

                {/* Pressure / Blood Pres */}
                <div className="p-2 border border-slate-100 rounded bg-slate-50 col-span-2">
                  <span className="block text-[8px] text-slate-400 font-sans uppercase">Arterial Blood Pressure</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-900 font-sans">
                      {readings.bpSystolic} / {readings.bpDiastolic}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">mmHg</span>
                  </div>
                  <span className="text-[8.5px] block font-sans text-slate-500 leading-normal mt-0.5">
                    Mean Arterial: {Math.floor((readings.bpSystolic + 2 * readings.bpDiastolic) / 3)} mmHg
                  </span>
                </div>

                {/* RBC Measure */}
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="block text-[8px] text-slate-400 font-sans uppercase">RBC Count</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-900 font-sans">{readings.rbcCount}</span>
                    <span className="text-[8px] text-slate-400 font-bold leading-none">M/µL</span>
                  </div>
                  <span className="text-[8px] block font-sans text-slate-500 font-semibold truncate">Erythrocytes</span>
                </div>

                {/* Hemoglobin */}
                <div className="p-2 border border-slate-100 rounded bg-slate-50">
                  <span className="block text-[8px] text-slate-400 font-sans uppercase">Hemoglobin (Hb)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-extrabold text-slate-900 font-sans">{readings.hemoglobin}</span>
                    <span className="text-[8px] text-slate-400 font-bold leading-none">g/dL</span>
                  </div>
                  <span className="text-[8px] block font-sans text-slate-500 font-semibold truncate">Spectroscopy Ray</span>
                </div>

              </div>
              
              <div className="mt-2 text-[9px] text-slate-400 flex justify-between items-center text-right font-mono border-t border-slate-100 pt-1.5">
                <span>Scanned At:</span>
                <span className="text-slate-700">{readings.scannedAt}</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3">
          {readings ? (
            <button
              onClick={commitToEMR}
              disabled={isSaved}
              className={`w-full py-2 px-3 rounded-lg text-[11px] font-bold tracking-tight transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isSaved 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-250 cursor-default"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>COMMITTED TO EMR DOSSIER FILE</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>COMMIT READINGS TO ACTIVE EMR</span>
                </>
              )}
            </button>
          ) : (
            <div className="bg-blue-50 border border-blue-100 p-2 text-[9px] text-blue-800 rounded-lg flex items-start gap-1">
              <Compass className="w-3 h-3 text-blue-500 shrink-0 mt-0.5" />
              <span>Grounded calibrations configured automatically for {selectedAgeGroup} patient profile characteristics.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
