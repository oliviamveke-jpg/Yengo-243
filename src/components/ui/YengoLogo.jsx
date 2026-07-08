import React from 'react';

const BLUE = '#0A4DFF';
const YELLOW = '#FCB116';
const FONT = "'Poppins', 'Montserrat', system-ui, sans-serif";

/**
 * Yengo Icon (Symbol only)
 * Stylized 'Y' whose left leg doubles as a location pin.
 */
export const YengoIcon = ({ color = BLUE, size = 40, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 110 130"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Yengo"
    {...props}
  >
    {/* Left leg → tapers into a pin tip */}
    <path d="M6 8H40L58 60L40 74L28 60V96L6 70V8Z" fill={color} />
    {/* Pin tip continues below */}
    <path d="M28 74L40 74L34 128L28 96V74Z" fill={color} />
    {/* Right diagonal leg */}
    <path d="M104 8H72L52 58L66 74L104 8Z" fill={color} />
    {/* Pin hole */}
    <circle cx="27" cy="66" r="8" fill="#fff" />
  </svg>
);

/**
 * Yengo Full Logo
 * Recreates the wordmark: pin-Y + "+243" (yellow) + "ENGO" (blue) + swoosh.
 */
export const YengoLogo = ({ size = 'medium', className = '', ...props }) => {
  const scaleMap = { small: 0.62, medium: 1, large: 1.5 };
  const scale = scaleMap[size] ?? 1;
  const width = 300 * scale;
  const height = 108 * scale;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 360 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Yengo +243"
      {...props}
    >
      {/* Pin-Y symbol */}
      <g transform="translate(6, 10)">
        <path d="M4 4H40L60 58L42 72L30 58V98L4 72V4Z" fill={BLUE} />
        <path d="M30 72H42L36 122L30 98V72Z" fill={BLUE} />
        <path d="M104 4H70L50 56L64 72L104 4Z" fill={BLUE} />
        <circle cx="28" cy="63" r="8.5" fill="#fff" />
      </g>

      {/* "+243" — yellow, italic, sits above the wordmark */}
      <text
        x="120"
        y="42"
        fontFamily={FONT}
        fontSize="34"
        fontWeight="800"
        fontStyle="italic"
        fill={YELLOW}
      >
        +243
      </text>

      {/* "ENGO" — bold blue wordmark */}
      <text
        x="110"
        y="92"
        fontFamily={FONT}
        fontSize="72"
        fontWeight="800"
        fill={BLUE}
        letterSpacing="-1"
      >
        ENGO
      </text>

      {/* Yellow swoosh sweeping under the wordmark */}
      <path
        d="M22 118 C130 104 250 104 344 116"
        stroke={YELLOW}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};
