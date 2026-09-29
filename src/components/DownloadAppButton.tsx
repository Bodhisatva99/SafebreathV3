import React from 'react';
import { Download } from 'lucide-react';
import { APP_DOWNLOAD_URL } from '../lib/supabase';

interface DownloadAppButtonProps {
  variant?: 'hero' | 'header' | 'mobile-nav' | 'card' | 'footer' | 'inline';
  className?: string;
}

export const DownloadAppButton: React.FC<DownloadAppButtonProps> = ({
  variant = 'hero',
  className = '',
}) => {
  // Permanent GitHub Release asset URL specified by user
  const downloadUrl = APP_DOWNLOAD_URL || "https://github.com/Bodhisatva99/SafebreathV3/releases/download/V3.0.0/SafeBreathV3.apk";

  if (variant === 'header') {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-300/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all text-xs font-semibold group shadow-sm shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${className}`}
        title="Download SafeBreath for Android (Android APK)"
        aria-label="Download SafeBreath for Android (Android APK)"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-y-0.5 transition-transform shrink-0" />
        <span>Download SafeBreath for Android</span>
        <span className="text-[10px] text-emerald-700 font-normal hidden xl:inline">(Android APK)</span>
      </a>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-sm shadow-sm hover:bg-emerald-100 transition-colors ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        <Download className="w-4 h-4 text-emerald-700 shrink-0" />
        <div className="flex flex-col sm:flex-row items-center sm:gap-1.5 text-center">
          <span>Download SafeBreath for Android</span>
          <span className="text-xs font-normal text-emerald-700">(Android APK)</span>
        </div>
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <div className="flex items-center gap-1.5">
          <span>Download SafeBreath for Android</span>
          <span className="text-[10px] font-normal text-purple-200">(Android APK)</span>
        </div>
      </a>
    );
  }

  if (variant === 'footer') {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-semibold transition-colors ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <div className="flex items-center gap-1.5">
          <span>Download SafeBreath for Android</span>
          <span className="text-[10px] text-slate-500 font-normal">(Android APK)</span>
        </div>
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-xs transition-colors ${className}`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span>Download SafeBreath for Android</span>
        <span className="font-normal">(Android APK)</span>
      </a>
    );
  }

  // Default: 'hero'
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2.5 group cursor-pointer ${className}`}
      title="Download SafeBreath for Android (Android APK)"
    >
      <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform shrink-0" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 text-left">
        <span>Download SafeBreath for Android</span>
        <span className="text-xs font-normal text-emerald-100">(Android APK)</span>
      </div>
    </a>
  );
};
