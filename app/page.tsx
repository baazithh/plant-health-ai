"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Leaf, AlertCircle, ShieldCheck, Zap, Droplets, Info } from "lucide-react";
import ChatBot from "./components/ChatBot";
import CameraModal from "./components/CameraModal";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setPreview(URL.createObjectURL(file));
    
    // Simulate API delay
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Mock call or real if backend is up
      // const response = await fetch("http://localhost:8000/predict", { method: "POST", body: formData });
      // const data = await response.json();
      
      // Simulation for now
      setTimeout(() => {
        setDiagnosis({
          disease: "Early Blight",
          confidence: 94.2,
          severity: 65,
          treatment: {
            mechanical: "Prune heavily infected lower leaves and destroy them. Ensure proper spacing between plants.",
            biological: "Apply Bacillus subtilis based bio-fungicides to the plant and soil.",
            chemical: "Use Chlorothalonil or Copper-based fungicides if the infection persists."
          }
        });
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-green">
            <Leaf className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F172A]/40">Intelligence Engine</span>
          </div>
          <h2 className="text-5xl font-medium tracking-tight text-[#0F172A]">
            Monitor Your <span className="text-emerald-green italic">Plant's Life.</span>
          </h2>
          <p className="max-w-xl mx-auto text-slate-500 text-lg leading-relaxed font-light">
            An advanced AI-driven ecosystem designed to diagnose, treat, and monitor plant health with surgical precision.
          </p>
        </motion.div>

        {/* Upload Zone */}
        {!diagnosis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl"
          >
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative h-96 digital-paper rounded-3xl border-dashed border-2 transition-all flex flex-col items-center justify-center gap-6 ${
                dragActive ? "border-emerald-green bg-emerald-50/50" : "border-slate-200"
              }`}
            >
              <AnimatePresence mode="wait">
                {isUploading ? (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-green rounded-full animate-spin" />
                    <span className="text-xs uppercase tracking-widest font-semibold text-slate-400">Analyzing Specimen...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-slate-100 border text-slate-400">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Drag and drop specimen image</p>
                      <p className="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP</p>
                    </div>
                    <div className="flex gap-4">
                      <label className="bg-dark-slate text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full cursor-pointer hover:bg-slate-800 transition-all shadow-lg hover:shadow-emerald-500/10">
                        Select File
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                      </label>
                      <button 
                        onClick={() => setIsCameraOpen(true)}
                        className="bg-white text-dark-slate border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-full cursor-pointer hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                        <Camera className="w-3 h-3" />
                        Camera
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {isCameraOpen && (
            <CameraModal 
              onCapture={handleFileUpload} 
              onClose={() => setIsCameraOpen(false)} 
            />
          )}
        </AnimatePresence>

        {/* Result View */}
        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid lg:grid-cols-2 gap-12 text-left"
          >
            {/* Image Preview with Bounding Box Placeholder */}
            <div className="relative group rounded-3xl overflow-hidden digital-paper aspect-[4/3]">
              {preview && (
                <img src={preview} alt="Specimen" className="w-full h-full object-cover" />
              )}
              {/* Mock Bounding Box Overlay */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-emerald-green rounded-lg glass animate-pulse-soft">
                <div className="absolute top-0 left-0 -translate-y-1/2 bg-emerald-green text-[8px] font-bold text-white uppercase px-2 py-0.5 tracking-widest">
                  Target: {diagnosis.disease}
                </div>
              </div>
            </div>

            {/* Diagnosis Card */}
            <div className="space-y-8 flex flex-col justify-center">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-green">Diagnosis Report</span>
                <h3 className="text-4xl font-medium text-dark-slate">{diagnosis.disease}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 digital-paper rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Confidence</span>
                  <div className="text-2xl font-medium text-emerald-green">{diagnosis.confidence}%</div>
                </div>
                <div className="p-6 digital-paper rounded-2xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Severity Index</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${diagnosis.severity}%` }}
                      className={`h-full ${diagnosis.severity > 70 ? 'bg-red-500' : 'bg-orange-400'}`}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setDiagnosis(null); setPreview(null); }}
                className="text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-dark-slate transition-colors underline underline-offset-4"
              >
                Scan Another Specimen
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Treatment Plan Section */}
      {diagnosis && (
        <section className="space-y-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <h3 className="text-2xl font-medium tracking-tight text-dark-slate">Treatment Ecosystem</h3>
            <div className="w-24 h-px bg-slate-100" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="digital-paper p-8 rounded-3xl space-y-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-dark-slate">Mechanical Action</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{diagnosis.treatment.mechanical}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="digital-paper p-8 rounded-3xl space-y-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                <ShieldCheck className="w-6 h-6 text-emerald-green" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-dark-slate">Biological Remedy</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{diagnosis.treatment.biological}</p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="digital-paper p-8 rounded-3xl space-y-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest text-dark-slate">Chemical Solution</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{diagnosis.treatment.chemical}</p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer Info */}
      <footer className="pt-24 pb-12 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-slate-400">
            <Droplets className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Hydration Intelligence Active</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-dark-slate transition-colors">Framework</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-dark-slate transition-colors">Open Data</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-dark-slate transition-colors">Ethics</a>
          </div>
        </div>
      </footer>

      <ChatBot currentDiagnosis={diagnosis} />
    </div>
  );
}
