import React, { useState } from 'react';

interface GreenvestLogoProps {
  variant?: 'full' | 'emblem' | 'horizontal';
  theme?: 'light' | 'dark' | 'on-dark';
  className?: string;
  heightClass?: string;
  showTagline?: boolean;
  onSecretTrigger?: () => void;
}

export const GreenvestLogo: React.FC<GreenvestLogoProps> = ({
  variant = 'horizontal',
  theme = 'on-dark',
  className = '',
  heightClass = 'h-11 sm:h-12',
  showTagline = true,
  onSecretTrigger,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [imgError, setImgError] = useState(false);

  const triggerAdmin = () => {
    if (onSecretTrigger) {
      onSecretTrigger();
    } else {
      window.location.hash = '#/admin';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setClickCount(0);
      triggerAdmin();
    }
    setTimeout(() => {
      setClickCount(0);
    }, 1500);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerAdmin();
  };

  // If user requested full logo variant
  if (variant === 'full') {
    return (
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`inline-flex items-center select-none cursor-pointer ${className}`}
        title="Greenvest Farms Limited"
      >
        {!imgError ? (
          <img
            src="/images/greenvest_logo.png"
            alt="Greenvest Farms - Cultivating Wealth, Feeding Nations"
            className={`${heightClass} w-auto object-contain rounded-lg shadow-xs transition-transform duration-200 hover:scale-[1.02]`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center gap-3">
            <GreenvestEmblemSvg className="w-10 h-10 shrink-0" />
            <div className="flex flex-col">
              <span className={`font-serif-display font-bold tracking-tight text-xl leading-none ${theme === 'on-dark' ? 'text-white' : 'text-[#075E2B]'}`}>
                Greenvest
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-widest ${theme === 'on-dark' ? 'text-[#F4B400]' : 'text-[#075E2B]'}`}>
                — FARMS —
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // If emblem only
  if (variant === 'emblem') {
    return (
      <div
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`inline-flex items-center justify-center select-none cursor-pointer ${className}`}
        title="Greenvest Farms"
      >
        {!imgError ? (
          <img
            src="/images/greenvest_emblem.png"
            alt="Greenvest Farms Seal"
            className={`${heightClass} w-auto object-contain drop-shadow-sm transition-transform duration-200 hover:scale-105`}
            onError={() => setImgError(true)}
          />
        ) : (
          <GreenvestEmblemSvg className="w-10 h-10" />
        )}
      </div>
    );
  }

  // Horizontal variant (default used in Navbar and Footer)
  const isDarkBg = theme === 'on-dark';

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      title="Greenvest Farms Limited"
    >
      {/* Official Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        {!imgError ? (
          <img
            src="/images/greenvest_emblem.png"
            alt="Greenvest Seal"
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm rounded-full bg-white/95 p-0.5 transition-transform duration-200 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#F4B400] text-[#075E2B] flex items-center justify-center p-1.5 shadow-sm">
            <GreenvestEmblemSvg className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Gold Divider Line */}
      <div className={`w-[2px] h-9 sm:h-10 rounded-full ${isDarkBg ? 'bg-[#F4B400]/80' : 'bg-[#F4B400]'}`} />

      {/* Typography with Greenvest + Leaf accent + FARMS + Slogan */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1 leading-none">
          <span
            className={`font-serif-display font-bold tracking-tight text-xl sm:text-2xl ${
              isDarkBg ? 'text-white' : 'text-[#075E2B]'
            }`}
          >
            Greenvest
          </span>
          {/* Leaf accent */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 text-[#7CB342] -mt-2 -ml-0.5 inline-block shrink-0"
          >
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5c0 2 1.5 3.5 3.5 3.5c3 0 7-3 8-6c.5-1.5 1.5-2 3.5-3z" />
          </svg>
        </div>

        {/* FARMS with flanking gold rules */}
        <div className="flex items-center gap-1.5 my-0.5">
          <span className={`h-[1px] w-3 sm:w-4 ${isDarkBg ? 'bg-[#F4B400]/80' : 'bg-[#F4B400]'}`} />
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase ${
              isDarkBg ? 'text-[#F4B400]' : 'text-[#075E2B]'
            }`}
          >
            FARMS
          </span>
          <span className={`h-[1px] w-3 sm:w-4 ${isDarkBg ? 'bg-[#F4B400]/80' : 'bg-[#F4B400]'}`} />
        </div>

        {/* Slogan */}
        {showTagline && (
          <span
            className={`text-[9px] sm:text-[10px] italic font-medium leading-none tracking-normal hidden sm:block ${
              isDarkBg ? 'text-emerald-100/90' : 'text-[#2E8B57]'
            }`}
          >
            Cultivating Wealth, Feeding Nations.
          </span>
        )}
      </div>
    </div>
  );
};

// Scalable vector emblem SVG as rock-solid fallback
export const GreenvestEmblemSvg: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Greenvest Logo Emblem"
  >
    {/* Outer Green Ring / Crest */}
    <circle cx="50" cy="50" r="46" stroke="#075E2B" strokeWidth="7" fill="#FFFFFF" />

    {/* Green Farm Field Furrows (Bottom) */}
    <path
      d="M16 66 C28 62, 50 62, 84 66 L82 82 C50 87, 30 85, 18 82 Z"
      fill="#0B4D26"
    />
    <path
      d="M18 73 C30 69, 52 69, 82 73"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M23 80 C36 76, 50 76, 77 80"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Seedling Plant (Left) */}
    <path
      d="M32 64 C32 50, 36 42, 33 34 C38 34, 43 38, 43 45 C43 53, 39 60, 37 64"
      fill="#2E8B57"
    />
    <path
      d="M33 46 C27 44, 23 48, 22 55 C27 55, 31 52, 33 48 Z"
      fill="#7CB342"
    />
    <path
      d="M35 38 C32 30, 38 24, 46 25 C45 32, 40 37, 35 38 Z"
      fill="#7CB342"
    />

    {/* Golden Financial Growth Bars (Center-Right) */}
    <rect x="49" y="52" width="6" height="12" rx="1.5" fill="#F4B400" />
    <rect x="57" y="44" width="6" height="20" rx="1.5" fill="#F4B400" />
    <rect x="65" y="36" width="6" height="28" rx="1.5" fill="#F4B400" />
    <rect x="73" y="28" width="6" height="36" rx="1.5" fill="#F4B400" />

    {/* Golden Ascending Growth Arrow */}
    <path
      d="M48 60 C56 58, 68 50, 78 31"
      stroke="#F4B400"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M72 26 L82 28 L79 38 Z"
      fill="#F4B400"
    />
  </svg>
);
