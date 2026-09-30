import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { APP_DOWNLOAD_URL } from '../lib/supabase';

interface DownloadAppButtonProps {
  variant?: 'hero' | 'header' | 'mobile-nav' | 'card' | 'footer' | 'inline';
  className?: string;
}

export const DownloadAppButton: React.FC<DownloadAppButtonProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const [downloading, setDownloading] = useState(false);

  // Latest GitHub Release direct APK download asset URL specified by user
  const downloadUrl =
    APP_DOWNLOAD_URL ||
    "https://github.com/Bodhisatva99/SafebreathV3/releases/latest/download/SafeBreathV3.apk";

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setDownloading(true);
    setTimeout(() => setDownloading(false), 3000);

    try {
      // Programmatic hidden iframe download:
      // Triggers immediate APK asset download without opening new tabs or leaving blank tabs hanging on mobile/desktop
      let iframe = document.getElementById('sb-hidden-apk-downloader') as HTMLIFrameElement | null;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'sb-hidden-apk-downloader';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);
      }
      iframe.src = downloadUrl;
    } catch {
      // Direct same-window fallback if iframes are blocked by host policy
      window.location.assign(downloadUrl);
    }
  };

  if (variant === 'header') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-300/80 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 transition-all text-xs font-semibold group shadow-sm shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
        aria-label="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-y-0.5 transition-transform shrink-0" />
        )}
        <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
        {!downloading && (
          <span className="text-[10px] text-emerald-700 font-normal hidden xl:inline">(Android APK)</span>
        )}
      </button>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-sm shadow-sm hover:bg-emerald-100 transition-colors cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-700 animate-pulse shrink-0" />
        ) : (
          <Download className="w-4 h-4 text-emerald-700 shrink-0" />
        )}
        <div className="flex flex-col sm:flex-row items-center sm:gap-1.5 text-center">
          <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
          {!downloading && <span className="text-xs font-normal text-emerald-700">(Android APK)</span>}
        </div>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-200 animate-pulse shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 shrink-0" />
        )}
        <div className="flex items-center gap-1.5">
          <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
          {!downloading && <span className="text-[10px] font-normal text-purple-200">(Android APK)</span>}
        </div>
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        )}
        <div className="flex items-center gap-1.5">
          <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
          {!downloading && <span className="text-[10px] text-slate-500 font-normal">(Android APK)</span>}
        </div>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-xs transition-colors cursor-pointer ${className}`}
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
        {!downloading && <span className="font-normal">(Android APK)</span>}
      </button>
    );
  }

  // Default: 'hero'
  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow flex items-center gap-2.5 group cursor-pointer ${className}`}
      title="Download SafeBreath for Android (Android APK)"
    >
      {downloading ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-pulse shrink-0" />
      ) : (
        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform shrink-0" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 text-left">
        <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
        {!downloading && <span className="text-xs font-normal text-emerald-100">(Android APK)</span>}
      </div>
    </button>
  );
};
