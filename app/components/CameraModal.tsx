"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, Camera, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CameraModalProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" }, 
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please check permissions.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            onCapture(file);
            onClose();
          }
        }, "image/jpeg");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl relative digital-paper shadow-2xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Specimen Scan</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="relative aspect-video bg-slate-100 flex items-center justify-center">
          {error ? (
            <div className="text-center p-8 space-y-4">
              <RefreshCw className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">{error}</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-[2px] border-emerald-green/30 pointer-events-none">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border border-white/20 rounded-full animate-pulse-soft" />
                 </div>
              </div>
            </>
          )}
        </div>

        <div className="p-8 flex justify-center bg-white">
          <button 
            onClick={captureImage}
            disabled={!!error}
            className="w-20 h-20 bg-dark-slate text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl group disabled:opacity-50"
          >
            <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:border-white/40 transition-colors">
              <Camera className="w-8 h-8" />
            </div>
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </motion.div>
  );
}
