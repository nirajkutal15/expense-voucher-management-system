import React, { useRef, useState, useEffect } from 'react';
import { Upload, RotateCcw, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../api/client';

interface SignaturePadProps {
  onSignatureChange: (url: string) => void;
  initialUrl?: string;
  label?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  initialUrl,
  label = 'Signature (Required)',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(initialUrl));
  const [currentUrl, setCurrentUrl] = useState<string | undefined>(initialUrl);
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current && mode === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [mode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setErrorMsg(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current && hasSignature) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      uploadBase64(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasSignature(false);
    setCurrentUrl(undefined);
    onSignatureChange('');
    setErrorMsg(null);
  };

  const uploadBase64 = async (base64Data: string) => {
    try {
      setIsUploading(true);
      setErrorMsg(null);
      const res = await apiClient.post('/uploads/signature-base64', { base64Data });
      if (res.data.success) {
        const url = res.data.data.url;
        setCurrentUrl(url);
        onSignatureChange(url);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to save signature');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const formData = new FormData();
      formData.append('signature', file);

      const res = await apiClient.post('/uploads/signature', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const url = res.data.data.url;
        setCurrentUrl(url);
        setHasSignature(true);
        onSignatureChange(url);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error?.message || 'Failed to upload signature file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">{label}</label>
        <div className="flex items-center space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              mode === 'draw' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Draw Signature
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              mode === 'upload' ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Upload File
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white p-2">
          <canvas
            ref={canvasRef}
            width={450}
            height={160}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-40 touch-none cursor-crosshair rounded-lg bg-slate-50/50"
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            {hasSignature && (
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white p-6 text-center">
          <input
            type="file"
            id="signature-file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="signature-file" className="cursor-pointer block">
            <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <span className="text-sm font-medium text-slate-700 block">Click to upload signature image</span>
            <span className="text-xs text-slate-400 block mt-1">PNG, JPG, or WebP up to 5MB</span>
          </label>
        </div>
      )}

      {isUploading && (
        <p className="text-xs text-brand-600 font-medium flex items-center">
          <span className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-1.5" />
          Uploading & validating signature magic bytes...
        </p>
      )}

      {currentUrl && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-800">Signature captured & attached</span>
          </div>
          <div className="h-10 bg-white p-1 rounded border border-emerald-200">
            <img src={currentUrl} alt="Signature Preview" className="h-full object-contain" />
          </div>
        </div>
      )}

      {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}
    </div>
  );
};
