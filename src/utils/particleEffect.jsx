import React from 'react';

const ParticleEffect = ({ darkMode }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0.7;
            }
            50% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
              opacity: 0.7;
            }
          }
          .animate-float {
            animation: float linear infinite;
          }
        `}
      </style>
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 4 + 2; // Single random size for width and height
        return (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              darkMode ? 'bg-gray-100' : 'bg-white'
            }`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 20 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: darkMode
                ? '0 0 8px 2px rgba(255, 255, 255, 0.6)'
                : '0 0 4px 1px rgba(0, 0 , 150, 0.6)',
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleEffect;