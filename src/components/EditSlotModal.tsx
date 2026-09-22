import React, { useState, useEffect } from 'react';
import { ChangeStatus, DayOfWeek, LessonSlot, OverrideLessonSlot, SubjectPreset } from '../types/timetable';
import { DAYS_CONFIG, PERIODS_CONFIG } from '../data/defaultTimetable';
import { RotateCcw, Save, X, Calendar, AlertCircle, BookOpen, MapPin, FileText } from 'lucide-react';

interface EditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayKey: DayOfWeek;
  period: number;
  weekNumber: number;
  weekTitle?: string;
  baseSlot: LessonSlot | undefined;
  currentOverride: OverrideLessonSlot | undefined;
  onSaveOverride: (override: {
    subject: string;
    status: ChangeStatus;
    room?: string;
    note?: string;
    changeReason?: string;
  }) => void;
  onRemoveOverride: () => void;
  subjectPresets: SubjectPreset[];
}

export const EditSlotModal: React.FC<EditSlotModalProps> = ({
  isOpen,
  onClose,
  dayKey,
  period,
  weekNumber,
  weekTitle,
  baseSlot,
  currentOverride,
  onSaveOverride,
  onRemoveOverride,
  subjectPresets,
}) => {
  const dayInfo = DAYS_CONFIG.find(d => d.key === dayKey);
  const periodInfo = PERIODS_CONFIG.find(p => p.period === period);

  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState<ChangeStatus>('changed');
  const [room, setRoom] = useState('');
  const [note, setNote] = useState('');
  const [changeReason, setChangeReason] = useState('');

  // Synchronize state on open
  useEffect(() => {
    if (isOpen) {
      if (currentOverride && currentOverride.isOverridden) {
        setSubject(currentOverride.subject || '');
        setStatus(currentOverride.status || 'changed');
        setRoom(currentOverride.room || '');
        setNote(currentOverride.note || '');
        setChangeReason(currentOverride.changeReason || '');
      } else {
        setSubject(baseSlot?.subject || '');
        setStatus('changed');
        setRoom(baseSlot?.room || '');
        setNote(baseSlot?.note || '');
        setChangeReason('');
      }
    }
  }, [isOpen, currentOverride, baseSlot]);

  if (!isOpen) return null;

  const isAlreadyOverridden = !!(currentOverride && currentOverride.isOverridden);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSubject = baseSlot?.subject || currentOverride?.subject || 'Tiết học';

    onSaveOverride({
      subject: effectiveSubject,
      status,
      room: room.trim() || undefined,
      note: note.trim() || undefined,
      changeReason: changeReason.trim() || undefined,
    });
    onClose();
  };

  const handleQuickStatusChange = (newStatus: ChangeStatus) => {
    setStatus(newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        id="edit-slot-modal-container"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                Chỉnh Lịch Buổi Học
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                  {weekTitle || `Tuần ${weekNumber}`}
                </span>
              </h3>
              <p className="text-xs text-white/80">
                {dayInfo?.label} • {periodInfo?.name} ({periodInfo?.timeRange})
              </p>
            </div>
          </div>
          <button
            id="close-edit-slot-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Base Schedule Reference Display */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wide">Môn học (theo thời khóa biểu gốc)</div>
                <div className="text-sm font-black text-slate-900 uppercase">
                  {baseSlot?.subject ? baseSlot.subject : <span className="text-slate-400 italic font-normal">Trống (chưa có tiết trong lịch gốc)</span>}
                </div>
              </div>
            </div>
            {baseSlot?.room && (
              <span className="text-xs font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                {baseSlot.room}
              </span>
            )}
          </div>

          {/* Status selection pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Hình thức thay đổi tuần này:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                id="status-btn-normal"
                onClick={() => handleQuickStatusChange('normal')}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'normal'
                    ? 'bg-slate-800 text-white border-slate-900 shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>✓</span> Bình Thường
              </button>

              <button
                type="button"
                id="status-btn-off"
                onClick={() => handleQuickStatusChange('off')}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'off'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>⛔</span> Nghỉ Tiết
              </button>

              <button
                type="button"
                id="status-btn-makeup"
                onClick={() => handleQuickStatusChange('makeup')}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'makeup'
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>⚡</span> Học Bù
              </button>

              <button
                type="button"
                id="status-btn-exam"
                onClick={() => handleQuickStatusChange('exam')}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'exam'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>📝</span> Kiểm Tra
              </button>
            </div>
          </div>

          {/* Room Input (Phòng học) - Yêu cầu 1: Bỏ phòng ở buổi sáng, buổi chiều để lại */}
          {period >= 6 ? (
            <div>
              <label htmlFor="slot-room-input" className="block text-xs font-bold text-slate-700 mb-1">
                Phòng Học Bộ Môn (Buổi Chiều):
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <input
                  id="slot-room-input"
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Ví dụ: P.19, PBM TIN HỌC 1..."
                  className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800"
                />
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic">
              ℹ️ Buổi sáng học tại phòng học lớp cố định (không cần nhập phòng).
            </div>
          )}

          {/* Ghi chú nhắc nhở / Lý do đổi */}
          <div>
            <label htmlFor="slot-note-input" className="block text-xs font-bold text-slate-700 mb-1">
              Ghi Chú Nhắc Nhở Cho Buổi Này:
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-2.5 text-slate-400 pointer-events-none">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <textarea
                id="slot-note-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Kiểm tra 1 tiết, mang dụng cụ thực hành, nộp bài..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800 resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            {isAlreadyOverridden ? (
              <button
                type="button"
                id="btn-revert-slot"
                onClick={() => {
                  onRemoveOverride();
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors"
                title="Khôi phục lại môn học gốc theo thời khóa biểu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Khôi Phục Tiết Gốc
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Chưa chỉnh sửa</span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-cancel-slot-edit"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                id="btn-save-slot-override"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu Cho Tuần Này
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
