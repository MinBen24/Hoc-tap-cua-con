import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  ExternalLink, 
  X, 
  FileText, 
  Check, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { DayInfo, LessonSlot, OverrideLessonSlot, PeriodDefinition } from '../types/timetable';
import { DAYS_CONFIG, PERIODS_CONFIG, getSlotKey } from '../data/defaultTimetable';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekTitle: string;
  dateRangeText: string;
  baseSchedule: Record<string, LessonSlot>;
  currentWeekOverrides: Record<string, OverrideLessonSlot>;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  weekTitle,
  dateRangeText,
  baseSchedule,
  currentWeekOverrides,
}) => {
  const [printMode, setPrintMode] = useState<'current' | 'base'>('current');
  const [studentName, setStudentName] = useState(() => localStorage.getItem('tkb_print_student') || 'Học Sinh');
  const [className, setClassName] = useState(() => localStorage.getItem('tkb_print_class') || 'Lớp 7A');
  const [schoolName, setSchoolName] = useState(() => localStorage.getItem('tkb_print_school') || 'Trường THCS');
  const [isInIframe, setIsInIframe] = useState(false);
  const [printSuccessAlert, setPrintSuccessAlert] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tkb_print_student', studentName);
    localStorage.setItem('tkb_print_class', className);
    localStorage.setItem('tkb_print_school', schoolName);
  }, [studentName, className, schoolName]);

  if (!isOpen) return null;

  // Active days: T2 -> T7
  const printDays = DAYS_CONFIG.filter(d => !d.isWeekend || d.key === 'T7');
  const morningPeriods = PERIODS_CONFIG.filter(p => p.session === 'morning');
  const afternoonPeriods = PERIODS_CONFIG.filter(p => p.session === 'afternoon');

  const getSlot = (dayKey: string, periodNumber: number) => {
    const key = getSlotKey(dayKey, periodNumber);
    if (printMode === 'current' && currentWeekOverrides[key]) {
      return currentWeekOverrides[key];
    }
    return baseSchedule[key];
  };

  const getPrintUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('print', 'true');
    return url.toString();
  };

  const handleExecutePrint = () => {
    setPrintSuccessAlert(true);
    try {
      window.print();
    } catch (e) {
      console.warn('Direct print blocked by sandbox iframe:', e);
    }
  };

  return (
    <div 
      id="print-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="print-modal-container"
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header - No print */}
        <div className="no-print px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">In & Xuất Thời Khóa Biểu</h2>
              <p className="text-xs text-slate-300">Chuẩn khổ giấy A4, rõ nét và chuyên nghiệp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Controls Bar - No print */}
        <div className="no-print p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Print Mode Selector */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setPrintMode('current')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                printMode === 'current'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {weekTitle} (Kèm môn đã đổi)
            </button>
            <button
              onClick={() => setPrintMode('base')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                printMode === 'base'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Thời Khóa Biểu Gốc (Chuẩn kỳ)
            </button>
          </div>

          {/* Quick Info Inputs */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Tên học sinh"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs w-28 focus:outline-indigo-500"
              title="Tên học sinh"
            />
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Lớp"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs w-20 focus:outline-indigo-500"
              title="Lớp học"
            />
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Trường"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs w-32 focus:outline-indigo-500"
              title="Tên trường học"
            />
          </div>
        </div>

        {/* Notice if running inside iframe */}
        {isInIframe && (
          <div className="no-print mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Lưu ý khi xem trong trình duyệt thử nghiệm:</span> Một số trình duyệt chặn lệnh in trực tiếp từ khung xem trước (iframe). Bạn hãy bấm nút <strong className="text-amber-950 font-extrabold">"Mở tab mới để In"</strong> bên dưới để mở toàn màn hình và in/lưu PDF chuẩn 100%!
            </div>
            <a
              href={getPrintUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-2xs transition-all active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Mở Tab Mới
            </a>
          </div>
        )}

        {/* Printable Paper Preview (Scrollable container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/60">
          <div 
            id="printable-timetable-sheet"
            className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-300 max-w-3xl mx-auto text-black printable-page"
          >
            {/* Sheet Header */}
            <div className="text-center pb-4 mb-4 border-b-2 border-slate-800">
              <div className="flex justify-between items-start text-xs text-slate-600 mb-1">
                <span>{schoolName}</span>
                <span>Năm học 2026 - 2027</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900">
                THỜI KHÓA BIỂU HỌC TẬP
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700 mt-1.5">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {printMode === 'current' ? weekTitle : 'Lịch Gốc Chuẩn'}
                </span>
                {printMode === 'current' && <span>Áp dụng: {dateRangeText}</span>}
                {className && <span>Lớp: {className}</span>}
                {studentName && <span>Học sinh: {studentName}</span>}
              </div>
            </div>

            {/* Timetable Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-800 text-slate-900 font-bold">
                    <th className="border border-slate-400 p-2 w-16 text-center">Buổi</th>
                    <th className="border border-slate-400 p-2 w-16 text-center">Tiết</th>
                    {printDays.map(d => (
                      <th key={d.key} className="border border-slate-400 p-2 text-center font-extrabold">
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* BUỔI SÁNG */}
                  {morningPeriods.map((period, pIdx) => (
                    <tr key={`morning_${period.period}`} className="border-b border-slate-300">
                      {pIdx === 0 && (
                        <td 
                          rowSpan={morningPeriods.length} 
                          className="border border-slate-400 p-2 text-center font-bold bg-slate-50 uppercase tracking-wider text-[11px] align-middle"
                        >
                          SÁNG
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">(7h00 - 11h15)</div>
                        </td>
                      )}
                      <td className="border border-slate-400 p-1.5 text-center font-semibold bg-slate-50">
                        <div>Tiết {period.period}</div>
                        <div className="text-[9px] text-slate-500">{period.timeRange}</div>
                      </td>
                      {printDays.map(day => {
                        const slot = getSlot(day.key, period.period);
                        const isOverridden = Boolean(slot && 'isOverridden' in slot && (slot as OverrideLessonSlot).isOverridden);
                        return (
                          <td 
                            key={`morning_${day.key}_${period.period}`}
                            className={`border border-slate-400 p-2 text-center align-middle ${
                              isOverridden ? 'bg-amber-50/80 font-bold' : ''
                            }`}
                          >
                            {slot?.subject ? (
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {slot.subject}
                                </div>
                                {slot.room && (
                                  <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                                    {slot.room}
                                  </div>
                                )}
                                {isOverridden && (
                                  <div className="text-[9px] text-amber-700 italic">
                                    (Đổi tuần này)
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Giờ Ra Chơi */}
                  <tr className="bg-amber-50/50 border-y border-slate-400 text-center text-[10px] italic text-slate-600">
                    <td colSpan={printDays.length + 2} className="py-1">
                      ☕ Giờ Ra Chơi buổi sáng: 8h30 - 8h50 (20 phút)
                    </td>
                  </tr>

                  {/* BUỔI CHIỀU */}
                  {afternoonPeriods.map((period, pIdx) => (
                    <tr key={`afternoon_${period.period}`} className="border-b border-slate-300">
                      {pIdx === 0 && (
                        <td 
                          rowSpan={afternoonPeriods.length} 
                          className="border border-slate-400 p-2 text-center font-bold bg-slate-50 uppercase tracking-wider text-[11px] align-middle"
                        >
                          CHIỀU
                          <div className="text-[10px] text-slate-500 font-normal mt-0.5">(13h00 - 17h15)</div>
                        </td>
                      )}
                      <td className="border border-slate-400 p-1.5 text-center font-semibold bg-slate-50">
                        <div>Tiết {period.period - 5}</div>
                        <div className="text-[9px] text-slate-500">{period.timeRange}</div>
                      </td>
                      {printDays.map(day => {
                        const slot = getSlot(day.key, period.period);
                        const isOverridden = Boolean(slot && 'isOverridden' in slot && (slot as OverrideLessonSlot).isOverridden);
                        return (
                          <td 
                            key={`afternoon_${day.key}_${period.period}`}
                            className={`border border-slate-400 p-2 text-center align-middle ${
                              isOverridden ? 'bg-amber-50/80 font-bold' : ''
                            }`}
                          >
                            {slot?.subject ? (
                              <div>
                                <div className="font-bold text-slate-900 text-sm">
                                  {slot.subject}
                                </div>
                                {slot.room && (
                                  <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
                                    {slot.room}
                                  </div>
                                )}
                                {isOverridden && (
                                  <div className="text-[9px] text-amber-700 italic">
                                    (Đổi tuần này)
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Notes for printing */}
            <div className="mt-4 pt-3 border-t border-slate-300 flex justify-between text-[11px] text-slate-600">
              <div>
                <p className="italic">* Chú ý: Mang đầy đủ sách vở, dụng cụ học tập và đồng phục theo quy định.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">In từ hệ thống Thời Khóa Biểu Học Tập Thông Minh</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">Chữ ký phụ huynh / Học sinh</p>
                <p className="text-slate-400 italic text-[10px] mt-6">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer - No print */}
        <div className="no-print p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Tối ưu khổ A4 ngang (Landscape) khi chọn in trong máy tính</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all cursor-pointer"
            >
              Đóng
            </button>

            {/* Mở tab mới để in (hoàn toàn không bị chặn bởi iframe) */}
            <a
              href={getPrintUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs border border-slate-300 transition-all cursor-pointer"
              title="Mở tab riêng để in toàn màn hình"
            >
              <ExternalLink className="w-4 h-4 text-slate-600" />
              Mở Tab Mới Để In
            </a>

            {/* Nút In Ngay */}
            <button
              id="btn-confirm-print"
              onClick={handleExecutePrint}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              In Ngay (Print)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
