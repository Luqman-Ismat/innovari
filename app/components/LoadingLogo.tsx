import React, { FC } from 'react';

// Loading Screen Component
const LoadingScreen: FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-black text-white">
    <div className="relative text-[20rem] font-bold leading-none">
      <div className="absolute top-[-4rem] left-1/2 transform -translate-x-1/2 text-white bounce-animation">
        .
      </div>
      <div className="text-gray-900">i</div>
    </div>
  </div>
);

// Logo Component (for header)
interface LogoProps {
  isDarkMode: boolean;
  isEditing: boolean;
  isItemSelected: boolean;
}

const Logo: FC<LogoProps> = ({ isDarkMode, isEditing, isItemSelected }) => {
  const logoDotColor = isEditing || isItemSelected ? 'text-red-500' : 'text-green-500';
  
  return (
    <div className="relative text-4xl font-light leading-none select-none pr-6" style={{ fontFamily: 'Inter, Space Grotesk, system-ui, sans-serif' }}>
      <span className="text-white">
        innoVari
      </span>
      <span
        className={`absolute text-5xl ${logoDotColor}`}
        style={{ top: '-1.5rem', right: '0' }}
      >
        .
      </span>
    </div>
  );
};

export { LoadingScreen, Logo };
