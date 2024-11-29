interface FourEasyIconProps {
  width?: number
  height?: number
  className?: string
}

const FourEasyIcon: React.FC<FourEasyIconProps> = ({ width = 32, height = 32, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      className={className}
    >
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#206de9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="6" ry="6" fill="url(#grad)" />
      <text
        x="50%"
        y="50%"
        fontFamily="Arial, sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        dy=".35em"
        className="select-none font-main text-lg text-foreground"
      >
        4e
      </text>
    </svg>
  )
}

export default FourEasyIcon