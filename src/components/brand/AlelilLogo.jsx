import React from 'react'

/**
 * AlelilLogo Component
 * Recreates the official Alelil brand logo with options for variant, dark/light theme, and slogan display.
 * 
 * Brand Colors:
 * - Azul Navy: #0B2D5B
 * - Verde Menta: #00C896
 * - Light/Negative: #FFFFFF
 */
const AlelilLogo = ({
  variant = 'horizontal', // 'horizontal' | 'stacked' | 'icon'
  theme = 'light', // 'light' (navy text) | 'dark' (white text)
  showSlogan = false,
  height = 42,
  className = '',
}) => {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0B2D5B'
  const mintColor = '#00C896'
  const sloganColor = theme === 'dark' ? '#D1D5DB' : '#556987'

  if (variant === 'icon') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Alelil Icon"
      >
        {/* 'A' Icon background / geometry */}
        <path
          d="M50 12 L15 88 H32 L41 68 H59 L68 88 H85 L50 12 Z M46 54 L50 42 L54 54 H46 Z"
          fill={textColor}
        />
        {/* Mint Swoosh crossing the 'A' */}
        <path
          d="M18 84 C 28 65, 45 56, 68 56 C 52 64, 38 72, 26 84 Z"
          fill={mintColor}
        />
      </svg>
    )
  }

  return (
    <div className={`d-inline-flex flex-column align-items-start ${className}`} style={{ userSelect: 'none' }}>
      <svg
        height={height}
        viewBox="0 0 380 95"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* A letter */}
        <g fill={textColor}>
          {/* Main A */}
          <path d="M42 8 L8 88 H26 L34 68 H62 L70 88 H88 L54 8 H42 Z M48 32 L57 54 H39 L48 32 Z" />
          
          {/* l letter */}
          <path d="M96 8 H114 V88 H96 Z" />
          
          {/* e letter */}
          <path d="M124 50 C124 32 138 20 156 20 C174 20 186 32 186 52 V56 H142 C144 67 152 74 164 74 C172 74 179 70 183 64 L196 72 C189 83 176 90 160 90 C138 90 124 74 124 50 Z M168 42 C168 34 162 29 154 29 C146 29 141 34 140 42 H168 Z" />
          
          {/* l letter */}
          <path d="M198 8 H216 V88 H198 Z" />
          
          {/* i letter with dot */}
          <circle cx="236" cy="14" r="9" />
          <path d="M227 28 H245 V88 H227 Z" />
          
          {/* l letter */}
          <path d="M256 8 H274 V88 H256 Z" />
        </g>

        {/* Mint green leaf/swoosh inside 'A' */}
        <path
          d="M10 85 C 24 64, 46 54, 76 53 C 55 63, 38 72, 22 86 Z"
          fill={mintColor}
        />

        {/* OFICIAL Subtitle */}
        <text
          x="190"
          y="118"
          fill={textColor}
          fontSize="17"
          fontWeight="800"
          letterSpacing="11"
          textAnchor="middle"
          fontFamily="'Montserrat', sans-serif"
        >
          OFICIAL
        </text>
      </svg>

      {showSlogan && (
        <span
          className="mt-1"
          style={{
            fontSize: '0.85rem',
            fontStyle: 'italic',
            color: sloganColor,
            fontFamily: "'Open Sans', sans-serif",
            letterSpacing: '0.2px',
          }}
        >
          Todo lo que necesitas, en un solo lugar
        </span>
      )}
    </div>
  )
}

export default AlelilLogo
