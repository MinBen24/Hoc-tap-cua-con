import React from 'react';
import { APP_THEMES } from '../themes/themeConfig';
import { THEME_BACKGROUND_IMAGES } from '../themes/themeBackgrounds';
import { Check, Sparkles, X } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const handleSelect = (themeId: string) => {
    onSelectTheme(themeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        id="theme-modal-container"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-wide uppercase">Themes</h2>
            </div>
          </div>
          <button
            id="close-theme-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme List - Full grid without gender tabs */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {APP_THEMES.map((theme) => {
              const isSelected = theme.id === currentThemeId;
              return (
                <div
                  key={theme.id}
                  id={`theme-card-${theme.id}`}
                  onClick={() => handleSelect(theme.id)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white'
                  }`}
                >
                  <div>
                    {/* Header line: Emoji, Theme Name, Selection Check */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{theme.mascotEmoji}</span>
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">{theme.name}</span>
                        </div>
                      </div>
                      
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {theme.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                      {theme.subtitle}
                    </p>

                    {/* Scenic background thumbnail */}
                    {THEME_BACKGROUND_IMAGES[theme.id] && (
                      <div className="w-full h-16 rounded-lg overflow-hidden mb-2 border border-slate-200/80 shadow-inner relative group-hover:scale-[1.01] transition-transform">
                        <img
                          src={THEME_BACKGROUND_IMAGES[theme.id]}
                          alt={theme.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>

                  {/* Color Palettes preview */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                    <div className="flex items-center gap-1.5">
                      {theme.previewColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(theme.id);
                        onClose();
                      }}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Đang dùng ✓' : 'Áp dụng ngay'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Giao diện sẽ tự động đổi màu toàn bộ ứng dụng và lưu lại.</span>
          <button
            id="btn-confirm-theme"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
