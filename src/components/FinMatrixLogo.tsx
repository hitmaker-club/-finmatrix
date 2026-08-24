import React from 'react';

interface FinMatrixLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const FinMatrixLogo: React.FC<FinMatrixLogoProps> = ({
  className = 'w-9 h-9',
  size,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${showText ? 'select-none' : ''}`}>
      <svg
        viewBox="0 0 512 512"
        className={className}
        style={size ? { width: size, height: size } : undefined}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fmLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0e1726" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="fmNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="fmGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Outer squircle base */}
        <rect width="512" height="512" rx="120" fill="url(#fmLogoBg)" stroke="#1e293b" strokeWidth="8" />

        {/* Matrix grid lines */}
        <g stroke="#06b6d4" strokeWidth="3" opacity="0.25">
          <line x1="128" y1="80" x2="128" y2="432" />
          <line x1="256" y1="80" x2="256" y2="432" />
          <line x1="384" y1="80" x2="384" y2="432" />
          <line x1="80" y1="128" x2="432" y2="128" />
          <line x1="80" y1="256" x2="432" y2="256" />
          <line x1="80" y1="384" x2="432" y2="384" />
        </g>

        {/* Matrix Cyber Diamond */}
        <path
          d="M 256 64 L 448 256 L 256 448 L 64 256 Z"
          fill="none"
          stroke="url(#fmNeonGrad)"
          strokeWidth="14"
          strokeLinejoin="round"
        />

        {/* Corner Nodes */}
        <circle cx="256" cy="64" r="14" fill="#06b6d4" />
        <circle cx="448" cy="256" r="14" fill="#10b981" />
        <circle cx="256" cy="448" r="14" fill="#6366f1" />
        <circle cx="64" cy="256" r="14" fill="#06b6d4" />

        {/* Financial Flow Ribbon (Currency Matrix Node) */}
        <line x1="256" y1="130" x2="256" y2="382" stroke="#10b981" strokeWidth="16" strokeLinecap="round" />
        <line x1="256" y1="130" x2="256" y2="382" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />

        {/* S-curve financial matrix ribbon */}
        <path
          d="M 180 180 C 180 144, 220 136, 256 136 C 310 136, 338 162, 338 196 C 338 236, 280 248, 256 256 C 210 270, 174 284, 174 324 C 174 360, 206 376, 256 376 C 298 376, 332 358, 332 332"
          fill="none"
          stroke="url(#fmGoldGrad)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 180 180 C 180 144, 220 136, 256 136 C 310 136, 338 162, 338 196 C 338 236, 280 248, 256 256 C 210 270, 174 284, 174 324 C 174 360, 206 376, 256 376 C 298 376, 332 358, 332 332"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Crossbars */}
        <line x1="160" y1="216" x2="352" y2="216" stroke="url(#fmNeonGrad)" strokeWidth="16" strokeLinecap="round" />
        <line x1="160" y1="296" x2="352" y2="296" stroke="url(#fmNeonGrad)" strokeWidth="16" strokeLinecap="round" />
        <line x1="170" y1="216" x2="342" y2="216" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        <line x1="170" y1="296" x2="342" y2="296" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
            Fin Matrix
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Финансовая матрица
          </span>
        </div>
      )}
    </div>
  );
};
