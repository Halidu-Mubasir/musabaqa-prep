
import React from 'react';

// Using the "skip track" style icon (like fast-forward arrow with a line)
export const SkipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 5.25v13.5" />
  </svg>
);

// The original paths were:
// <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25l7.5 7.5 7.5-7.5m-15 6l7.5 7.5 7.5-7.5" />
// <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />

// The SkipIconAlternative (which is now the main SkipIcon) was defined as:
// export const SkipIconAlternative: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
//   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
//     <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 5.25v13.5" />
//   </svg>
// );
