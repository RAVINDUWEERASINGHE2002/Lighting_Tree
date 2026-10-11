import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 48, showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-1.5 shadow-md shadow-brand-900/30 border border-gold-500/40"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="sunGlowSmall" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#166443" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="treeGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D9967" />
              <stop offset="60%" stopColor="#166443" />
              <stop offset="100%" stopColor="#0F402D" />
            </linearGradient>
            <linearGradient id="trunkGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B89028" />
              <stop offset="100%" stopColor="#664A21" />
            </linearGradient>
            <filter id="glowSmall" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Halo ring */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="#0A3324"
            stroke="#D4AF37"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <circle cx="100" cy="100" r="80" fill="url(#sunGlowSmall)" />

          {/* Trunk */}
          <path
            d="M93 148 C93 125 82 110 88 95 C90 90 98 86 100 86 C102 86 110 90 112 95 C118 110 107 125 107 148 C115 152 125 155 130 157 C122 154 114 152 105 151 C100 151 95 151 90 152 C82 154 75 157 70 158 C75 155 85 152 93 148 Z"
            fill="url(#trunkGradSmall)"
          />

          {/* Foliage */}
          <path
            d="M52 115 C45 105 48 90 60 84 C62 72 75 64 88 68 C94 56 110 54 120 62 C130 56 144 62 148 74 C158 78 162 92 154 102 C160 112 152 124 140 126 C132 127 126 122 122 118 C116 125 102 126 95 120 C88 126 76 125 70 118 C65 122 55 121 52 115 Z"
            fill="url(#treeGradSmall)"
          />
          <path
            d="M68 95 C62 88 66 76 75 73 C80 64 92 60 100 66 C108 58 122 60 128 68 C136 72 138 84 132 92 C126 88 118 88 112 92 C104 86 92 88 86 94 C80 92 72 92 68 95 Z"
            fill="#2D9967"
            opacity="0.9"
          />

          {/* String lights wire */}
          <path
            d="M58 92 Q80 105 100 90 Q120 105 142 92"
            stroke="#E4BC5E"
            strokeWidth="1.2"
            strokeDasharray="2 1"
            fill="none"
          />
          <path
            d="M72 78 Q100 95 128 78"
            stroke="#E4BC5E"
            strokeWidth="1"
            strokeDasharray="2 1"
            fill="none"
          />

          {/* Glowing bulbs */}
          <circle cx="58" cy="92" r="3.5" fill="#FFFBEB" filter="url(#glowSmall)" />
          <circle cx="76" cy="100" r="4.2" fill="#FCD34D" filter="url(#glowSmall)" />
          <circle cx="100" cy="90" r="4.8" fill="#FFFBEB" filter="url(#glowSmall)" />
          <circle cx="124" cy="100" r="4.2" fill="#FCD34D" filter="url(#glowSmall)" />
          <circle cx="142" cy="92" r="3.5" fill="#FFFBEB" filter="url(#glowSmall)" />
          <circle cx="88" cy="85" r="4" fill="#FCD34D" filter="url(#glowSmall)" />
          <circle cx="112" cy="85" r="4" fill="#FCD34D" filter="url(#glowSmall)" />
          <circle cx="100" cy="52" r="5" fill="#FFFBEB" filter="url(#glowSmall)" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-bold text-lg leading-tight tracking-wide text-brand-900 dark:text-brand-100 flex items-center gap-1.5">
            Lighting Tree
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-700 dark:text-gold-300 border border-gold-500/30">
              POS
            </span>
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Opposite Busstand, Thanamalwila
          </span>
        </div>
      )}
    </div>
  );
};
