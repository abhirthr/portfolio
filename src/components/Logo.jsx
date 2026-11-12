// The AR monogram. The A's right leg is the R's stem; the crossbar is solar amber.
// Strokes use currentColor, so it takes the colour of its parent on night or day.
function Logo({ className = '', title = 'Abhijeet Rathore' }) {
  return (
    <svg
      viewBox="0 0 66 64"
      className={`logo ${className}`.trim()}
      role="img"
      aria-label={title}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="5"
    >
      <path d="M8 54 L28 10 L46 54" stroke="currentColor" />
      <path d="M28 10 H46 A11 11 0 0 1 46 32 H36" stroke="currentColor" />
      <path d="M44 32 L58 54" stroke="currentColor" />
      <line x1="16.5" y1="36" x2="40" y2="36" stroke="var(--sun)" />
    </svg>
  )
}

export default Logo
