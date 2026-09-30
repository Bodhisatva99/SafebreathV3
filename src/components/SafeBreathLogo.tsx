import React from 'react';

interface SafeBreathLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'light' | 'dark'; // 'light' is for light backgrounds (dark text), 'dark' is for dark backgrounds (white text)
  showSubtitle?: boolean;
}

interface SafeBreathShieldSymbolProps {
  className?: string;
  size?: number | string;
  variant?: 'default' | 'monochrome' | 'white';
}

interface SafeBreathAndroidAppIconProps {
  className?: string;
  size?: number | string;
}

/**
 * High-fidelity vector rendition of the official SafeBreath Shield Symbol.
 * Faithfully maps the stylized green leaf, triple atmospheric cyan/blue air waves,
 * and dual-apex crest shield frame.
 */
export const SafeBreathShieldSymbol: React.FC<SafeBreathShieldSymbolProps> = ({
  className = '',
  size = 36,
  variant = 'default',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      aria-label="SafeBreath Shield Symbol"
    >
      <defs>
        {/* Shield Frame Gradient */}
        <linearGradient id="sb-shield-stroke" x1="20" y1="15" x2="180" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#082A38" />
          <stop offset="50%" stopColor="#0B4052" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Leaf Green Vibrant Gradient */}
        <linearGradient id="sb-leaf-grad" x1="60" y1="35" x2="110" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#84CC16" />
          <stop offset="25%" stopColor="#22C55E" />
          <stop offset="65%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Wave 1: Top Cyan Wave */}
        <linearGradient id="sb-wave-1" x1="100" y1="105" x2="180" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Wave 2: Middle Ocean Blue Wave */}
        <linearGradient id="sb-wave-2" x1="90" y1="130" x2="175" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Wave 3: Bottom Deep Blue Wave */}
        <linearGradient id="sb-wave-3" x1="75" y1="155" x2="165" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="60%" stopColor="#075985" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>
      </defs>

      {/* Outer Shield Crest */}
      <path
        d="M100 14 L176 46 C176 112 152 165 100 196 C48 165 24 112 24 46 L100 14 Z"
        stroke={variant === 'white' ? '#FFFFFF' : 'url(#sb-shield-stroke)'}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner Leaf Form (Left Side) */}
      <path
        d="M100 38 C100 38 78 68 64 96 C50 124 55 152 75 168 C68 152 66 128 78 106 C88 88 100 70 100 38 Z"
        fill="url(#sb-leaf-grad)"
      />
      <path
        d="M100 38 C100 38 108 72 104 104 C100 126 88 150 75 168 C90 156 108 132 110 104 C112 78 100 38 100 38 Z"
        fill="url(#sb-leaf-grad)"
        opacity="0.95"
      />

      {/* Atmospheric Air Wave 1 (Top) */}
      <path
        d="M110 104 C124 95 142 94 158 100 C168 104 174 112 176 120 C168 112 154 108 140 108 C124 108 112 114 96 126 C102 118 106 110 110 104 Z"
        fill="url(#sb-wave-1)"
      />

      {/* Atmospheric Air Wave 2 (Middle) */}
      <path
        d="M96 126 C112 116 130 116 148 122 C162 127 170 137 172 146 C164 136 150 131 134 131 C118 131 104 139 88 150 C92 141 94 133 96 126 Z"
        fill="url(#sb-wave-2)"
      />

      {/* Atmospheric Air Wave 3 (Bottom) */}
      <path
        d="M88 150 C104 140 122 140 138 146 C152 152 160 162 162 172 C154 161 140 155 124 155 C108 155 94 163 76 172 C80 164 84 157 88 150 Z"
        fill="url(#sb-wave-3)"
      />
    </svg>
  );
};

/**
 * Official SafeBreath V3 Android Application Icon:
 * Composition: landscape scenery + central SafeBreath shield + SafeBreath V3 title banner.
 * Used exclusively in the Android download and client areas.
 */
export const SafeBreathAndroidAppIcon: React.FC<SafeBreathAndroidAppIconProps> = ({
  className = '',
  size = 56,
}) => {
  return (
    <div
      className={`relative inline-block select-none overflow-hidden rounded-[22%] shadow-md border border-slate-700/20 bg-slate-900 shrink-0 ${className}`}
      style={{ width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }}
      title="SafeBreath V3 for Android"
      aria-label="SafeBreath V3 for Android Application Icon"
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="sb-app-sky" x1="60" y1="0" x2="60" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="45%" stopColor="#38BDF8" />
            <stop offset="80%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>

          {/* Sun / Fresh Air Glow */}
          <radialGradient id="sb-app-sun" cx="30" cy="25" r="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#FEF08A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </radialGradient>

          {/* Distant Mountains Gradient */}
          <linearGradient id="sb-app-mountains" x1="60" y1="40" x2="60" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Foreground Rolling Hills Gradient */}
          <linearGradient id="sb-app-hills" x1="60" y1="60" x2="60" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>

          {/* Bottom Banner Glass Gradient */}
          <linearGradient id="sb-app-banner" x1="0" y1="92" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#061A24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0B3042" stopOpacity="0.98" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="120" height="120" fill="url(#sb-app-sky)" />

        {/* Ambient Sun Atmosphere */}
        <circle cx="30" cy="25" r="35" fill="url(#sb-app-sun)" />

        {/* Background Mountain Peaks */}
        <path
          d="M0 68 L22 50 L45 62 L74 44 L102 60 L120 54 L120 90 L0 90 Z"
          fill="url(#sb-app-mountains)"
          opacity="0.85"
        />

        {/* Foreground Rolling Green Hills */}
        <path
          d="M-10 82 Q30 64 65 76 T130 72 L130 120 L-10 120 Z"
          fill="url(#sb-app-hills)"
        />

        {/* Central SafeBreath Shield Backdrop Glow */}
        <ellipse cx="60" cy="52" rx="30" ry="32" fill="#FFFFFF" fillOpacity="0.45" />

        {/* Shield Icon Lockup (Centered) */}
        <g transform="translate(36, 26) scale(0.24)">
          {/* Outer Shield Crest */}
          <path
            d="M100 14 L176 46 C176 112 152 165 100 196 C48 165 24 112 24 46 L100 14 Z"
            stroke="#FFFFFF"
            strokeWidth="18"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="#062433"
          />
          <path
            d="M100 14 L176 46 C176 112 152 165 100 196 C48 165 24 112 24 46 L100 14 Z"
            stroke="url(#sb-shield-stroke)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Leaf Form */}
          <path
            d="M100 38 C100 38 78 68 64 96 C50 124 55 152 75 168 C68 152 66 128 78 106 C88 88 100 70 100 38 Z"
            fill="url(#sb-leaf-grad)"
          />
          <path
            d="M100 38 C100 38 108 72 104 104 C100 126 88 150 75 168 C90 156 108 132 110 104 C112 78 100 38 100 38 Z"
            fill="url(#sb-leaf-grad)"
            opacity="0.95"
          />

          {/* Waves */}
          <path
            d="M110 104 C124 95 142 94 158 100 C168 104 174 112 176 120 C168 112 154 108 140 108 C124 108 112 114 96 126 C102 118 106 110 110 104 Z"
            fill="url(#sb-wave-1)"
          />
          <path
            d="M96 126 C112 116 130 116 148 122 C162 127 170 137 172 146 C164 136 150 131 134 131 C118 131 104 139 88 150 C92 141 94 133 96 126 Z"
            fill="url(#sb-wave-2)"
          />
          <path
            d="M88 150 C104 140 122 140 138 146 C152 152 160 162 162 172 C154 161 140 155 124 155 C108 155 94 163 76 172 C80 164 84 157 88 150 Z"
            fill="url(#sb-wave-3)"
          />
        </g>

        {/* Bottom Banner Ribbon: SafeBreath V3 */}
        <rect y="92" width="120" height="28" fill="url(#sb-app-banner)" />
        <line x1="0" y1="92" x2="120" y2="92" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.4" />
        
        <text
          x="60"
          y="108.5"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="10.5"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="0.4"
        >
          SafeBreath V3
        </text>
      </svg>
    </div>
  );
};

/**
 * Primary Horizontal SafeBreath Brand Logo.
 * Matches the official horizontal mark with Shield symbol + SafeBreath wordmark + subtitle.
 * Designed to fit seamlessly at 150px - 175px width on desktop headers, footers, and brand touchpoints.
 */
export const SafeBreathLogo: React.FC<SafeBreathLogoProps> = ({
  className = '',
  width = 168,
  height,
  variant = 'light',
  showSubtitle = true,
}) => {
  const isLightBg = variant === 'light';

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none transition-opacity ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width, height }}
      aria-label="SafeBreath - Smart Atmospheric Safety"
    >
      {/* Shield Icon Mark */}
      <div className="shrink-0">
        <SafeBreathShieldSymbol size={showSubtitle ? 38 : 32} />
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline font-bold tracking-tight text-[18px] sm:text-[19px] font-sans">
          <span className={isLightBg ? 'text-[#0F172A]' : 'text-white'}>
            Safe
          </span>
          <span className="bg-gradient-to-r from-[#0284C7] to-[#026AA2] bg-clip-text text-transparent ml-[0.5px]">
            Breath
          </span>
        </div>

        {showSubtitle && (
          <div
            className={`text-[6.5px] sm:text-[7px] font-semibold tracking-[0.22em] uppercase mt-[3px] font-sans ${
              isLightBg ? 'text-[#334155]' : 'text-slate-300'
            }`}
          >
            Smart Atmospheric Safety
          </div>
        )}
      </div>
    </div>
  );
};
