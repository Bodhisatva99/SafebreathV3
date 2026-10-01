import React from 'react';

interface SafeBreathLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  variant?: 'light' | 'dark'; // 'light' for light backgrounds (dark text), 'dark' for dark backgrounds (white text)
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
 * Authentic vector recreation of the official SafeBreath Shield Symbol
 * directly mapped from the user's uploaded PNG artwork:
 * - Dual-apex split crest shield (notch at top and bottom)
 * - Deep navy left rim & bright cyan-to-navy gradient right rim
 * - Stylized ascending green leaf (lime to rich emerald)
 * - Triple flowing aerodynamic air waves (cyan, ocean blue, deep navy)
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
        {/* Shield Frame Left Half Gradient (Dark Navy / Slate) */}
        <linearGradient id="sb-shield-left" x1="20" y1="20" x2="100" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#08202D" />
          <stop offset="60%" stopColor="#0B2B38" />
          <stop offset="100%" stopColor="#05151E" />
        </linearGradient>

        {/* Shield Frame Right Half Gradient (Vibrant Cyan/Teal to Deep Navy) */}
        <linearGradient id="sb-shield-right" x1="100" y1="20" x2="180" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00AEEF" />
          <stop offset="35%" stopColor="#0284C7" />
          <stop offset="70%" stopColor="#0B3042" />
          <stop offset="100%" stopColor="#061822" />
        </linearGradient>

        {/* Vibrant Green Leaf Gradient (Lime -> Vivid Green -> Deep Forest) */}
        <linearGradient id="sb-leaf-vibrant" x1="70" y1="35" x2="105" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8CE024" />
          <stop offset="25%" stopColor="#4ADE80" />
          <stop offset="60%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>

        {/* Leaf Fold Shadow */}
        <linearGradient id="sb-leaf-shadow" x1="60" y1="120" x2="90" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        {/* Wave 1: Top Cyan Air Wave */}
        <linearGradient id="sb-wave-top" x1="95" y1="100" x2="180" y2="125" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#00AEEF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Wave 2: Middle Ocean Blue Air Wave */}
        <linearGradient id="sb-wave-mid" x1="85" y1="125" x2="175" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="60%" stopColor="#0369A1" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>

        {/* Wave 3: Bottom Deep Navy/Azure Wave */}
        <linearGradient id="sb-wave-bot" x1="75" y1="150" x2="165" y2="185" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0369A1" />
          <stop offset="50%" stopColor="#075985" />
          <stop offset="100%" stopColor="#082A4A" />
        </linearGradient>
      </defs>

      {/* Outer Shield Crest - Left Half (with apex gaps at top & bottom) */}
      <path
        d="M 97 16 L 26 48 C 26 114 50 166 97 196"
        stroke={variant === 'white' ? '#FFFFFF' : 'url(#sb-shield-left)'}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Outer Shield Crest - Right Half (with apex gaps at top & bottom) */}
      <path
        d="M 103 16 L 174 48 C 174 114 150 166 103 196"
        stroke={variant === 'white' ? '#FFFFFF' : 'url(#sb-shield-right)'}
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner Stylized Leaf (Left) */}
      <path
        d="M 100 36 C 100 36 78 68 64 96 C 50 124 55 152 75 168 C 68 152 66 128 78 106 C 88 88 100 70 100 36 Z"
        fill="url(#sb-leaf-vibrant)"
      />
      <path
        d="M 100 36 C 100 36 108 72 104 104 C 100 126 88 150 75 168 C 90 156 108 132 110 104 C 112 78 100 36 100 36 Z"
        fill="url(#sb-leaf-vibrant)"
        opacity="0.95"
      />
      {/* Lower Leaf In-Curve Shade */}
      <path
        d="M 75 168 C 70 155 70 138 78 120 C 82 135 84 152 75 168 Z"
        fill="url(#sb-leaf-shadow)"
      />

      {/* Atmospheric Air Wave 1 (Top Wave) */}
      <path
        d="M 110 104 C 124 95 142 94 158 100 C 168 104 174 112 176 120 C 168 112 154 108 140 108 C 124 108 112 114 96 126 C 102 118 106 110 110 104 Z"
        fill="url(#sb-wave-top)"
      />

      {/* Atmospheric Air Wave 2 (Middle Wave) */}
      <path
        d="M 96 126 C 112 116 130 116 148 122 C 162 127 170 137 172 146 C 164 136 150 131 134 131 C 118 131 104 139 88 150 C 92 141 94 133 96 126 Z"
        fill="url(#sb-wave-mid)"
      />

      {/* Atmospheric Air Wave 3 (Bottom Wave) */}
      <path
        d="M 88 150 C 104 140 122 140 138 146 C 152 152 160 162 162 172 C 154 161 140 155 124 155 C 108 155 94 163 76 172 C 80 164 84 157 88 150 Z"
        fill="url(#sb-wave-bot)"
      />
    </svg>
  );
};

/**
 * Authentic 3D SafeBreath Mobile Application Icon
 * Directly recreated from the user's uploaded "Safebreath App Logo.png":
 * - Dark squircle tile with ambient cyan and emerald neon rim glows
 * - 3D beveled split shield with center vertical fold
 * - Left metallic rim in electric cyan-blue, right rim in neon lime-emerald
 * - Recessed dark interior with 3 fluid glowing cyan air waves
 * - Dual fresh 3D green leaves on the right
 */
export const SafeBreath3DAppIcon: React.FC<{ className?: string; size?: number | string }> = ({
  className = '',
  size = 56,
}) => {
  const pixelSize = typeof size === 'number' ? size : 56;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-hidden rounded-[24%] shadow-xl shrink-0 group ${className}`}
      style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      title="SafeBreath V3 for Android"
      aria-label="SafeBreath V3 for Android Application Icon"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Tile Background Radial Lights */}
          <radialGradient id="sb3d-ambient-cyan" cx="20" cy="20" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#0284C7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="sb3d-ambient-green" cx="180" cy="20" r="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#10B981" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0" />
          </radialGradient>

          {/* Squircle Rim Border Glow */}
          <linearGradient id="sb3d-rim-glow" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00FF88" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
          </linearGradient>

          {/* Left Shield Bevel (Electric Cyan-Blue) */}
          <linearGradient id="sb3d-shield-left-bevel" x1="36" y1="24" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="30%" stopColor="#00B4D8" />
            <stop offset="70%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#023E8A" />
          </linearGradient>

          {/* Right Shield Bevel (Neon Lime-Emerald) */}
          <linearGradient id="sb3d-shield-right-bevel" x1="100" y1="24" x2="164" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="25%" stopColor="#34D399" />
            <stop offset="65%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Shield Interior Shading (Left vs Right Fold) */}
          <linearGradient id="sb3d-shield-interior" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#051525" />
            <stop offset="50%" stopColor="#030A14" />
            <stop offset="100%" stopColor="#010408" />
          </linearGradient>

          {/* Wave 1: Top Glowing Cyan Wave */}
          <linearGradient id="sb3d-wave-1" x1="55" y1="70" x2="145" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="35%" stopColor="#00E5FF" />
            <stop offset="75%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>

          {/* Wave 2: Middle Cyan Wave */}
          <linearGradient id="sb3d-wave-2" x1="50" y1="90" x2="145" y2="125" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#00B4D8" />
            <stop offset="85%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </linearGradient>

          {/* Wave 3: Bottom Ocean Wave */}
          <linearGradient id="sb3d-wave-3" x1="55" y1="110" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="55%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#082F49" />
          </linearGradient>

          {/* Upper Leaf 3D Gradient (Vivid Lime / Green) */}
          <linearGradient id="sb3d-leaf-top" x1="125" y1="60" x2="160" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#BEF264" />
            <stop offset="35%" stopColor="#84CC16" />
            <stop offset="70%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          {/* Lower Leaf 3D Gradient (Emerald) */}
          <linearGradient id="sb3d-leaf-bot" x1="135" y1="85" x2="162" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="40%" stopColor="#22C55E" />
            <stop offset="85%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
        </defs>

        {/* 1. Squircle Tile Base */}
        <rect width="200" height="200" rx="44" fill="#030712" />
        <rect width="200" height="200" rx="44" fill="url(#sb3d-ambient-cyan)" />
        <rect width="200" height="200" rx="44" fill="url(#sb3d-ambient-green)" />
        <rect width="200" height="200" rx="44" stroke="url(#sb3d-rim-glow)" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />

        {/* 2. Outer Shield Body with 3D Beveled Rim */}
        {/* Left Half Beveled Rim */}
        <path
          d="M 100 24 L 36 50 C 36 112 60 156 100 178 Z"
          fill="url(#sb3d-shield-left-bevel)"
        />
        {/* Right Half Beveled Rim */}
        <path
          d="M 100 24 L 164 50 C 164 112 140 156 100 178 Z"
          fill="url(#sb3d-shield-right-bevel)"
        />

        {/* Inner Recessed Shield Face */}
        <path
          d="M 100 36 L 46 58 C 46 108 66 146 100 166 C 134 146 154 108 154 58 L 100 36 Z"
          fill="url(#sb3d-shield-interior)"
        />

        {/* 3D Vertical Center Fold Shading */}
        <path
          d="M 100 36 L 100 166 L 46 58 Z"
          fill="#000000"
          fillOpacity="0.22"
        />

        {/* 3. Fluid Glowing Air Waves */}
        {/* Top Wave */}
        <path
          d="M 54 88 C 70 72 90 70 108 80 C 122 88 134 94 146 96 C 132 104 116 104 102 96 C 88 88 74 86 54 88 Z"
          fill="url(#sb3d-wave-1)"
        />

        {/* Middle Wave */}
        <path
          d="M 48 108 C 64 92 84 90 104 98 C 118 104 132 110 144 112 C 130 120 114 120 98 114 C 82 108 68 106 48 108 Z"
          fill="url(#sb3d-wave-2)"
        />

        {/* Bottom Wave */}
        <path
          d="M 58 124 C 74 114 90 114 106 120 C 120 125 132 128 140 128 C 126 136 110 136 96 130 C 82 125 70 124 58 124 Z"
          fill="url(#sb3d-wave-3)"
        />

        {/* 4. Dual Fresh 3D Green Leaves */}
        {/* Upper Major Leaf */}
        <path
          d="M 124 92 C 122 72 134 54 150 58 C 158 68 156 86 142 98 C 136 94 130 92 124 92 Z"
          fill="url(#sb3d-leaf-top)"
        />
        {/* Upper Leaf Highlight Ridge */}
        <path
          d="M 128 88 C 134 76 142 66 149 60 C 146 72 140 82 132 90 Z"
          fill="#ECFCCB"
          fillOpacity="0.6"
        />

        {/* Lower Minor Leaf */}
        <path
          d="M 138 98 C 140 84 152 76 162 82 C 166 90 162 102 150 108 C 146 104 142 100 138 98 Z"
          fill="url(#sb3d-leaf-bot)"
        />
        {/* Lower Leaf Highlight Ridge */}
        <path
          d="M 142 96 C 148 88 154 84 161 83 C 157 91 152 98 146 102 Z"
          fill="#D1FAE5"
          fillOpacity="0.6"
        />
      </svg>
    </div>
  );
};

/**
 * Official SafeBreath Android Application Tile Icon.
 * Renders the authentic 3D SafeBreath App Icon matching "Safebreath App Logo.png".
 */
export const SafeBreathAndroidAppIcon: React.FC<SafeBreathAndroidAppIconProps> = ({
  className = '',
  size = 56,
}) => {
  return <SafeBreath3DAppIcon className={className} size={size} />;
};

/**
 * Primary Horizontal SafeBreath Brand Logo Lockup.
 * Matches the user's uploaded "Untitled design (2).png":
 * - Authentic Shield Symbol on the left
 * - "Safe" in heavy dark navy charcoal
 * - "Breath" in smooth gradient (deep teal to vibrant cyan & blue)
 * - Subtitle: "SMART ATMOSPHERIC SAFETY" in clean spaced uppercase
 */
export const SafeBreathLogo: React.FC<SafeBreathLogoProps> = ({
  className = '',
  width,
  height,
  variant = 'light',
  showSubtitle = true,
}) => {
  const isLightBg = variant === 'light';

  return (
    <div
      className={`inline-flex items-center gap-3 select-none transition-opacity ${className}`}
      style={{ width, height }}
      aria-label="SafeBreath - SMART ATMOSPHERIC SAFETY"
    >
      {/* Shield Icon Mark */}
      <div className="shrink-0 flex items-center justify-center">
        <SafeBreathShieldSymbol size={showSubtitle ? 40 : 32} />
      </div>

      {/* Typography Lockup */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline font-extrabold tracking-tight text-[20px] sm:text-[22px] font-sans">
          {/* "Safe" in solid dark navy */}
          <span className={isLightBg ? 'text-[#0B132B]' : 'text-white'}>
            Safe
          </span>
          {/* "Breath" with the teal-to-cyan-to-blue gradient */}
          <span className="bg-gradient-to-r from-[#082F3B] via-[#058296] to-[#00AEEF] bg-clip-text text-transparent ml-[0.5px]">
            Breath
          </span>
        </div>

        {/* Subtitle: SMART ATMOSPHERIC SAFETY */}
        {showSubtitle && (
          <div
            className={`text-[7px] sm:text-[7.5px] font-bold tracking-[0.28em] uppercase mt-[4px] font-sans ${
              isLightBg ? 'text-[#1E293B]' : 'text-slate-300'
            }`}
          >
            SMART ATMOSPHERIC SAFETY
          </div>
        )}
      </div>
    </div>
  );
};
