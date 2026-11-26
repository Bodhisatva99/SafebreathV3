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
        className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F] hover:bg-black text-white transition-colors text-xs font-semibold shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 min-h-[36px] cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
        aria-label="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 text-white shrink-0" />
        )}
        <span>{downloading ? 'Starting Download...' : 'Download App'}</span>
      </button>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1D1D1F] hover:bg-black text-white font-semibold text-sm transition-colors min-h-[44px] whitespace-nowrap cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Download className="w-4 h-4 shrink-0" />
        )}
        <span>{downloading ? 'Starting APK Download...' : 'Download Android App (APK)'}</span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#1D1D1F] hover:bg-black text-white font-semibold text-xs sm:text-sm transition-colors min-h-[46px] whitespace-nowrap cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Download className="w-4 h-4 text-white shrink-0" />
        )}
        <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android'}</span>
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xs font-semibold transition-colors whitespace-nowrap min-h-[40px] cursor-pointer ${className}`}
        title="Download SafeBreath for Android (Android APK)"
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 text-white shrink-0" />
        )}
        <span>{downloading ? 'Starting APK Download...' : 'Download Android App (APK)'}</span>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-semibold text-xs transition-colors whitespace-nowrap cursor-pointer ${className}`}
      >
        {downloading ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{downloading ? 'Starting APK Download...' : 'Download SafeBreath for Android (APK)'}</span>
      </button>
    );
  }

  // Default: 'hero'
  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2.5 group whitespace-nowrap min-h-[48px] cursor-pointer ${className}`}
      title="Download SafeBreath for Android (Android APK)"
    >
      {downloading ? (
        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
      ) : (
        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform shrink-0" />
      )}
      <span>{downloading ? 'Starting APK Download...' : 'Download Android App'}</span>
    </button>
  );
};
