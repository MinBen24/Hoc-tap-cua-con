import React, { useState } from 'react';
import { Calendar, X, Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { AppTheme } from '../types/timetable';

interface EditWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentStartDate: string; // YYYY-MM-DD
  currentCustomDateRange: string;
  onSave: (newTitle: string, newStartDate: string, newCustomDateRange: string) => void;
  theme: AppTheme;
}

export const EditWeekModal: React.FC<EditWeekModalProps> = ({
  isOpen,
  onClose,
  currentTitle,
  currentStartDate,
  currentCustomDateRange,
  onSave,
  theme,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [startDate, setStartDate] = useState(currentStartDate);
  const [customRange, setCustomRange] = useState(currentCustomDateRange);

  if (!isOpen) return null;

  // Compute 7 days preview from selected startDate
  const getPreviewDays = (dateStr: string) => {
    if (!dateStr) return [];
    try {
      const parts = dateStr.split('-').map(Number);
      if (parts.length !== 3) return [];
      const monday = new Date(parts[0], parts[1] - 1, parts[2]);
      const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
      return dayNames.map((name, idx) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + idx);
        return {
          name,
          dateStr: `${d.getDate()}/${d.getMonth() + 1}`,
          fullDate: d,
        };
      });
    } catch {
      return [];
    }
  };

  const previewDays = getPreviewDays(startDate);
  const autoComputedRange = previewDays.length === 7
    ? `${previewDays[0].dateStr} - ${previewDays[6].dateStr}/${previewDays[6].fullDate.getFullYear()}`
    : '';

  // Quick preset titles
  const presetTitles = [
    'Tuần 1',
    'Tuần 2',
    'Tuần 3',
    'Tuần 4',
    'Tuần 5',
    'Tuần 6',
    'Tuần 7',
    'Tuần 8',
    'Tuần 9',
    'Tuần 10',
    'Tuần Ôn Tập',
    'Tuần Thi Học Kỳ',
  ];

  // Quick jump helper for date
  const adjustDateByDays = (days: number) => {
    try {
      const parts = startDate.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      d.setDate(d.getDate() + days);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setStartDate(`${yyyy}-${mm}-${dd}`);
    } catch {
      // ignore
    }
  };

  const handleSetTodayMonday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const yyyy = monday.getFullYear();
    const mm = String(monday.getMonth() + 1).padStart(2, '0');
    const dd = String(monday.getDate()).padStart(2, '0');
    setStartDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim() || 'Tuần 1';
    onSave(cleanTitle, startDate, customRange.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="edit-week-modal-container"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Chỉnh Sửa Tuần & Ngày Học</h2>
              <p className="text-xs text-slate-500">Tùy biến tên hiển thị tuần và khoảng thời gian học</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-800">
          {/* Section 1: Week Title */}
          <div>
            <label htmlFor="input-week-title" className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Tên hiển thị tuần học:
            </label>
            <input
              id="input-week-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Tuần 1, Tuần 2, Tuần 12..."
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-bold text-slate-800 bg-white"
            />

            {/* Quick Title Chips */}
            <div className="mt-2">
              <span className="text-[11px] text-slate-500 block mb-1">Gợi ý chọn nhanh:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {presetTitles.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTitle(t)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                      title === t
                        ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Date Setting */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-week-start-date" className="block text-xs font-bold text-slate-700">
                2. Ngày bắt đầu tuần học (Thứ Hai):
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSetTodayMonday}
                  className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                >
                  Tuần này
                </button>
                <button
                  type="button"
                  onClick={() => adjustDateByDays(-7)}
                  className="text-[10px] font-semibold text-slate-600 hover:bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 transition-colors"
                  title="Lùi 7 ngày"
                >
                  -7 ngày
                </button>
                <button
                  type="button"
                  onClick={() => adjustDateByDays(7)}
                  className="text-[10px] font-semibold text-slate-600 hover:bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 transition-colors"
                  title="Tiến 7 ngày"
                >
                  +7 ngày
                </button>
              </div>
            </div>

            <input
              id="input-week-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 bg-white"
            />

            {/* Preview of week days */}
            {previewDays.length > 0 && (
              <div className="mt-2.5 p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-[11px] font-bold text-blue-900 mb-1.5 flex items-center justify-between">
                  <span>Lịch 7 ngày trong tuần:</span>
                  <span className="text-blue-700 font-medium">({autoComputedRange})</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {previewDays.map((d) => (
                    <div key={d.name} className="p-1 rounded-lg bg-white border border-blue-100 shadow-2xs">
                      <div className="text-[10px] font-bold text-slate-600">{d.name}</div>
                      <div className="text-[10px] font-extrabold text-blue-700">{d.dateStr}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Custom date range text override (Optional) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="input-custom-date-range" className="block text-xs font-bold text-slate-700">
                3. Hoặc tự gõ dòng ngày hiển thị (tùy chọn):
              </label>
              {customRange && (
                <button
                  type="button"
                  onClick={() => setCustomRange('')}
                  className="text-[10px] text-rose-500 hover:underline"
                >
                  Dùng ngày tự động
                </button>
              )}
            </div>
            <input
              id="input-custom-date-range"
              type="text"
              value={customRange}
              onChange={(e) => setCustomRange(e.target.value)}
              placeholder={`Mặc định: ${autoComputedRange || '22/09 - 28/09/2026'}`}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-700 bg-white"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Nếu để trống, ứng dụng sẽ tự động tính ngày theo ngày bắt đầu bạn đã chọn ở trên.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
