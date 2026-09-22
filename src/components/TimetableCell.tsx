import React from 'react';
import { AppTheme, ChangeStatus, DayOfWeek, LessonSlot, OverrideLessonSlot } from '../types/timetable';
import { STATUS_LABELS } from '../data/defaultTimetable';
import { Edit3, MapPin, FileText } from 'lucide-react';

interface TimetableCellProps {
  dayKey: DayOfWeek;
  period: number;
  baseSlot: LessonSlot | undefined;
  overrideSlot: OverrideLessonSlot | undefined;
  isToday: boolean;
  theme: AppTheme;
  onClick: () => void;
}

export const TimetableCell: React.FC<TimetableCellProps> = ({
  dayKey,
  period,
  baseSlot,
  overrideSlot,
  isToday,
  theme,
  onClick,
}) => {
  const isOverridden = !!(overrideSlot && overrideSlot.isOverridden);
  
  // Resolve final display data - Dynamically follows baseSlot when base schedule is updated
  const currentSubject = isOverridden 
    ? (overrideSlot?.status === 'off' ? (baseSlot?.subject || 'Nghỉ Tiết') : (baseSlot?.subject || overrideSlot?.subject)) 
    : baseSlot?.subject;
  // Request 1: Bỏ phòng ở buổi sáng (period <= 5), buổi chiều để lại (period >= 6)
  const isAfternoon = period >= 6;
  const currentRoom = isAfternoon ? (isOverridden ? (overrideSlot?.room ?? baseSlot?.room) : baseSlot?.room) : undefined;
  const currentNote = isOverridden ? (overrideSlot?.note ?? baseSlot?.note) : baseSlot?.note;
  const status: ChangeStatus = isOverridden ? (overrideSlot?.status || 'changed') : 'normal';

  const statusConfig = STATUS_LABELS[status] || STATUS_LABELS.normal;

  // Render empty cell if no subject exists - Request 2: Thu nhỏ khung vừa vặn
  if (!currentSubject) {
    return (
      <div
        id={`slot-${dayKey}-${period}`}
        onClick={onClick}
        className="h-full min-h-[44px] py-1.5 px-1.5 rounded-lg border border-dashed border-slate-200/90 bg-slate-50/30 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer group flex items-center justify-center text-slate-300 hover:text-slate-500"
      >
        <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 text-slate-400">
          <Edit3 className="w-3 h-3" /> +
        </span>
      </div>
    );
  }

  return (
    <div
      id={`slot-${dayKey}-${period}`}
      onClick={onClick}
      className={`h-full min-h-[46px] py-1.5 px-2 rounded-lg border transition-all duration-150 cursor-pointer group relative flex flex-col justify-center select-none shadow-2xs hover:shadow-xs ${
        isOverridden
          ? `${theme.alteredSlotRing} shadow-amber-500/5`
          : 'border-slate-200/90 bg-white hover:border-slate-300'
      } ${isToday ? 'ring-1 ring-blue-500/50' : ''}`}
    >
      {/* Subject Line & Compact Badges */}
      <div className="flex items-center justify-between gap-1">
        <h4 className={`text-xs font-black leading-tight tracking-tight uppercase truncate ${
          status === 'off' 
            ? 'text-rose-600 line-through opacity-75' 
            : 'text-slate-800'
        }`}>
          {currentSubject}
        </h4>

        {/* Override status indicator */}
        <div className="flex items-center gap-0.5 shrink-0">
          {isOverridden && (
            <span 
              className={`inline-flex items-center px-1 py-0.2 rounded text-[9px] font-extrabold border ${statusConfig.badgeClass}`}
              title={`${statusConfig.label}: ${overrideSlot?.changeReason || overrideSlot?.note || ''}`}
            >
              {statusConfig.iconText}
            </span>
          )}

          {/* Quick Edit Hover Icon */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700">
            <Edit3 className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* Dòng ghi chú hiện luôn cả dòng bên dưới text môn học theo yêu cầu */}
      {currentNote && (
        <div 
          className="mt-1 text-[10px] text-amber-900 font-semibold bg-amber-50/90 hover:bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-200/90 flex items-center gap-1 transition-colors leading-tight"
          title={`Ghi chú: ${currentNote}`}
        >
          <FileText className="w-2.5 h-2.5 text-amber-600 shrink-0" />
          <span className="truncate">{currentNote}</span>
        </div>
      )}

      {/* Afternoon Room badge - Only for afternoon periods! */}
      {currentRoom && (
        <div className="mt-0.5 flex items-center gap-0.5 truncate text-[10px] font-bold text-blue-700 bg-blue-50/80 px-1 py-0.2 rounded border border-blue-100 w-fit">
          <MapPin className="w-2.5 h-2.5 text-blue-500 shrink-0" />
          <span className="truncate">{currentRoom}</span>
        </div>
      )}
    </div>
  );
};
