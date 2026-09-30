import React from 'react';
import { Download } from 'lucide-react';
import { APP_DOWNLOAD_URL } from '../lib/supabase';

interface DownloadAppButtonProps {
  variant?: 'hero' | 'header' | 'mobile-nav' | 'card' | 'footer' | 'inline';
  className?: stringIt looks like whatever platform or text editor you copied this from automatically converted your React JSX tags into Markdown links (`[text]({url})`) and stripped out all the HTML elements and Tailwind classes. 

Because the code you pasted is currently invalid TypeScript/React (it will throw syntax errors if you try to run it), I have fully restored the component for you below. 

This version includes the iframe download fix you mentioned, properly wires up the `lucide-react` icon, applies the click handler to prevent the blank tab issue, and restores a full set of Tailwind classes for all 6 variants.

```tsx
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
  // Permanent GitHub Release asset URL pointing to the latest version
  const downloadUrl = APP_DOWNLOAD_URL || "[https://github.com/Bodhisatva99/SafebreathV3/releases/latest/download/SafeBreathV3.apk](https://github.com/Bodhisatva99/SafebreathV3/releases/latest/download/SafeBreathV3.apk)";

  // Trigger download via hidden iframe to prevent blank/redirected mobile tabs
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl;
    document.body.appendChild(iframe);

    // Clean up DOM after download starts
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  };

  if (variant === 'header') {
    return (
      <a 
        href={downloadUrl} 
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors ${className}`}
      >
        <Download className="w-4 h-4"/>
        <div className="flex flex-col text-left leading-tight">
          <span>Download SafeBreath</span>
          <span className="text-[10px] text-blue-200">(Android APK)</span>
        </div>
      </a>
    );
  }

  if (variant === 'mobile-nav') {
    return (
      <a 
        href={downloadUrl} 
        onClick={handleDownload}
        className={`flex w-full items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors ${className}`}
      >
        <Download className="w-5 h-5"/>
        <span>Download SafeBreath APK</span>
      </a>
    );
  }

  if (variant === 'card') {
    return (
      <a 
        href={downloadUrl} 
        onClick={handleDownload}
        className={`inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors ${className}`}
      >
        <Download className="w-4 h-4"/>
        <span>Download APK</span>
      </a>
    );
  }

  if (variant === 'footer') {
    return (
      <a 
        href={downloadUrl} 
        onClick={handleDownload}
        className={`inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors ${className}`}
      >
        <Download className="w-4 h-4"/>
        <span>Download SafeBreath (APK)</span>
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a 
        href={downloadUrl} 
        onClick={handleDownload}
        className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium ${className}`}
      >
        <Download className="w-4 h-4"/>
        <span>Download the Android APK</span>
      </a>
    );
  }

  // Default: 'hero'
  return (
    <a 
      href={downloadUrl} 
      onClick={handleDownload}
      className={`inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      <Download className="w-6 h-6"/>
      <div className="flex flex-col text-left leading-tight">
        <span>Download SafeBreath</span>
        <span className="text-sm font-normal text-blue-200">Free Android APK</span>
      </div>
    </a>
  );
};
