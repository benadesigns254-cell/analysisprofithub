export function PHLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="url(#gradient)" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      
      {/* P letter */}
      <path
        d="M16 14V34M16 14H24C27.314 14 30 16.686 30 20C30 23.314 27.314 26 24 26H16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* H letter */}
      <path
        d="M34 14V34M34 24H40C42.209 24 44 22.209 44 20V20C44 17.791 42.209 16 40 16H34V34"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Gradient accent line */}
      <line
        x1="24"
        y1="26"
        x2="32"
        y2="34"
        stroke="url(#accentGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PHLogoBadge({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-lg ${className}`} style={{ width: size, height: size }}>
      <PHLogo size={size - 4} className="text-green-400" />
    </div>
  )
}
