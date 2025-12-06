import React, { useEffect, useState } from 'react';

interface ClockFaceProps {
  distributionFactor: number;
}

export const ClockFace: React.FC<ClockFaceProps> = ({ distributionFactor }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helpers to calculate angles
  const normalize = (val: number, max: number) => val / max;
  
  // The core math: map a normalized linear value (0-1) to a curved value (0-1)
  // factor = 1: Linear
  // factor > 1: Exponential (Antilog-ish) - Slow start, fast end
  // factor < 1: Logarithmic - Fast start, slow end
  const distribute = (norm: number) => Math.pow(norm, distributionFactor);
  
  const getAngle = (val: number, max: number) => distribute(normalize(val, max)) * 360;

  // Generate Ticks
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i + 1);

  // Calculate hands
  const ms = time.getMilliseconds();
  const sec = time.getSeconds() + ms / 1000;
  const min = time.getMinutes() + sec / 60;
  const hr = (time.getHours() % 12) + min / 60;

  const secAngle = getAngle(sec, 60);
  const minAngle = getAngle(min, 60);
  const hrAngle = getAngle(hr, 12);

  const radius = 140;

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 filter drop-shadow-[0_0_15px_rgba(99,102,241,0.15)]">
      <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
        {/* Outer Ring */}
        <circle cx="150" cy="150" r="148" className="stroke-slate-700 fill-slate-950" strokeWidth="2" />
        <circle cx="150" cy="150" r="140" className="stroke-slate-800 fill-none" strokeWidth="1" />

        {/* Center Guide Grid */}
        <circle cx="150" cy="150" r="100" className="stroke-slate-800/30 fill-none dashed" strokeDasharray="4 4" strokeWidth="1" />
        <circle cx="150" cy="150" r="50" className="stroke-slate-800/30 fill-none dashed" strokeDasharray="4 4" strokeWidth="1" />

        {/* Minute Ticks */}
        {minutes.map((m) => {
          const angle = getAngle(m, 60);
          const isMajor = m % 5 === 0;
          return (
            <line
              key={`m-${m}`}
              x1="150"
              y1="150"
              x2="150"
              y2="150"
              className={isMajor ? "stroke-slate-500" : "stroke-slate-800"}
              strokeWidth={isMajor ? 1.5 : 1}
              transform={`rotate(${angle} 150 150) translate(${isMajor ? 135 : 138})`}
              strokeLinecap="round"
            />
          );
        })}

        {/* Hour Numbers */}
        {hours.map((h) => {
          const angle = getAngle(h, 12);
          // Convert polar to cartesian for text positioning
          // Remember SVG is rotated -90deg, so we need to compensate for text rotation
          const rad = (angle * Math.PI) / 180;
          const r = 120;
          // Standard polar conversion
          const x = 150 + r * Math.cos(rad);
          const y = 150 + r * Math.sin(rad);

          return (
            <g key={`h-${h}`}>
               <text
                x={x}
                y={y}
                fill="#cbd5e1"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(90 ${x} ${y})`} // Counteract the parent -90 rotation
              >
                {h}
              </text>
            </g>
          );
        })}

        {/* Hands */}
        {/* Hour Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="150"
          className="stroke-indigo-400"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hrAngle} 150 150) translate(80)`}
        />
        
        {/* Minute Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="150"
          className="stroke-indigo-300"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${minAngle} 150 150) translate(110)`}
        />

        {/* Second Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2="150"
          className="stroke-rose-500"
          strokeWidth="1.5"
          transform={`rotate(${secAngle} 150 150) translate(125)`}
        />
        
        {/* Center Cap */}
        <circle cx="150" cy="150" r="4" className="fill-slate-100" />
        <circle cx="150" cy="150" r="2" className="fill-rose-500" />

      </svg>
      
      {/* Decorative Reflections */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};
