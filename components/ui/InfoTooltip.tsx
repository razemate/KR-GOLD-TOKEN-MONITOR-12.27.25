import React, { useState } from 'react';

interface InfoTooltipProps {
  content: string;
  position?: 'center' | 'right';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, position = 'center' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Position logic
  // center: left-1/2 -ml-32 (default)
  // right: right-0 top-full (anchors right edge to the icon's right edge)
  const positionClasses = position === 'right' 
    ? "right-0 mr-[-8px]" // Shift slightly right to align comfortably with edge, or keep strict right-0. mr-[-8px] aligns arrow approx.
    : "left-1/2 -ml-32";

  // Arrow position logic
  const arrowClasses = position === 'right'
    ? "right-2" // Put arrow near the right edge
    : "left-1/2 -ml-1";

  return (
    <div className="relative inline-block ml-2 group">
      <button 
        className="text-slate-500 hover:text-gold-500 transition-colors focus:outline-none"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="More info"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
      </button>
      
      {isVisible && (
        <div className={`absolute z-50 w-64 p-3 mt-2 text-xs font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl transition-colors duration-300 ${positionClasses}`}>
          {content}
          <div className={`absolute w-2 h-2 -mt-1 bg-white dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700 transform rotate-45 -top-1 ${arrowClasses}`}></div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
