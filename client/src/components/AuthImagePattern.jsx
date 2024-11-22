import PropTypes from 'prop-types'

const AuthImagePattern = ({ title, subtitle, textColor, reverse, className }) => {
  return (
    <div className={`relative h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden ${className}`}>
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 animate-pulse ${reverse ? "opacity-0" : "opacity-100"}`} />
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="small-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-gray-900/[0.05]"
              />
            </pattern>
            <pattern
              id="grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <rect width="80" height="80" fill="url(#small-grid)" />
              <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gray-900/[0.08]"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
        <h1 className={`text-4xl font-bold mb-4 ${textColor}`}>{title}</h1>
        <p className={`text-lg opacity-80 ${textColor}`}>{subtitle}</p>
      </div>
    </div>
  )
}

AuthImagePattern.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  reverse: PropTypes.bool,
  className: PropTypes.string
}

export default AuthImagePattern