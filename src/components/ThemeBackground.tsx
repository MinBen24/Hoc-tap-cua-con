import React, { useState } from 'react';
import { THEME_BACKGROUND_IMAGES } from '../themes/themeBackgrounds';

interface ThemeBackgroundProps {
  themeId: string;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ themeId }) => {
  const [loadedThemes, setLoadedThemes] = useState<Record<string, boolean>>({});
  const bgImage = THEME_BACKGROUND_IMAGES[themeId] || THEME_BACKGROUND_IMAGES['theme-christmas'];

  const handleImageLoaded = (id: string) => {
    setLoadedThemes(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div
      aria-hidden="true"
      className="theme-bg-layer fixed inset-0 pointer-events-none -z-10 select-none overflow-hidden"
    >
      {/* Dynamic Background Image corresponding to the active theme */}
      <img
        key={themeId}
        src={bgImage}
        alt=""
        referrerPolicy="no-referrer"
        onLoad={() => handleImageLoaded(themeId)}
        className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
          loadedThemes[themeId] !== false ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />

      {/* Subtle soft gradient overlay to ensure perfect contrast and text readability on all screens */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/40 backdrop-contrast-[1.02]" />

      {/* Soft vignette around borders */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.06)]" />
    </div>
  );
};
