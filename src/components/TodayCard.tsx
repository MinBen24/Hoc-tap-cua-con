import React from 'react';
import { AppTheme, DayOfWeek, LessonSlot, OverrideLessonSlot } from '../types/timetable';
import { DAYS_CONFIG, PERIODS_CONFIG, STATUS_LABELS, getSlotKey } from '../data/defaultTimetable';
import { Clock, AlertTriangle, Sun, Sunset, MapPin, Sparkles, FileText } from 'lucide-react';

interface TodayCardProps {
  currentDayKey: DayOfWeek;
  baseSchedule: Record<string, LessonSlot>;
  currentWeekOverrides: Record<string, OverrideLessonSlot>;
  todayDateStr: string;
  theme: AppTheme;
  onSlotClick: (dayKey: DayOfWeek, period: number) => void;
  completedSlotsToday?: string[];
  onToggleSlotCompleted?: (slotKey: string) => void;
}

export const TodayCard: React.FC<TodayCardProps> = ({
  currentDayKey,
  baseSchedule,
  currentWeekOverrides,
  todayDateStr,
  theme,
  onSlotClick,
}) => {
  const currentDayInfo = DAYS_CONFIG.find(d => d.key === currentDayKey);

  // Separate morning and afternoon lessons for today
  const morningPeriods = PERIODS_CONFIG.filter(p => p.session === 'morning');
  const afternoonPeriods = PERIODS_CONFIG.filter(p => p.session === 'afternoon');

  const getSlotData = (period: number) => {
    const key = getSlotKey(currentDayKey, period);
    const base = baseSchedule[key];
    const override = currentWeekOverrides[key];
    const isOverridden = !!(override && override.isOverridden);

    return {
      key,
      // When baseSchedule changes, subject automatically reflects the baseSchedule subject
      subject: base?.subject || override?.subject,
      room: isOverridden ? (override?.room ?? base?.room) : base?.room,
      note: isOverridden ? (override?.note ?? base?.note) : base?.note,
      isOverridden,
      status: isOverridden ? (override?.status || 'changed') : 'normal',
      originalSubject: override?.originalSubject,
    };
  };

  const morningLessons = morningPeriods
    .map(p => ({ period: p, ...getSlotData(p.period) }))
    .filter(item => !!item.subject);

  const afternoonLessons = afternoonPeriods
    .map(p => ({ period: p, ...getSlotData(p.period) }))
    .filter(item => !!item.subject);

  const totalLessonsToday = morningLessons.length + afternoonLessons.length;
  const changedLessonsCount = [...morningLessons, ...afternoonLessons].filter(l => l.isOverridden).length;

  return (
    <div 
      id="today-schedule-widget" 
      className={`p-4 rounded-2xl bg-white/94 backdrop-blur-md border ${theme.containerBorder} shadow-xs mb-5 transition-all duration-300`}
    >
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl ${theme.primaryColor} flex items-center justify-center font-bold shadow-xs`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              Hôm Nay Học Gì?
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${theme.accentBadge}`}>
                {currentDayInfo?.label} ({todayDateStr})
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Tổng cộng {totalLessonsToday} tiết học ({morningLessons.length} tiết sáng, {afternoonLessons.length} tiết chiều)
            </p>
          </div>
        </div>

        {changedLessonsCount > 0 && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Có {changedLessonsCount} tiết đổi hôm nay!</span>
          </div>
        )}
      </div>

      {/* DÒNG 1: BUỔI SÁNG */}
      <div className="mb-3.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase tracking-wide">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Buổi sáng</span>
            <span className="text-[10px] normal-case font-medium text-slate-400">(7h00 - 11h15)</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {morningLessons.length > 0 ? `${morningLessons.length} tiết` : 'Nghỉ'}
          </span>
        </div>

        {morningLessons.length === 0 ? (
          <div className="p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs text-center bg-slate-50/50">
            Sáng nay không có tiết học
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {morningLessons.map((item) => {
              const statusConfig = STATUS_LABELS[item.status];

              return (
                <div
                  key={item.key}
                  className={`p-2 rounded-xl border transition-all relative flex flex-col justify-between ${
                    item.isOverridden 
                      ? `${theme.alteredSlotRing}` 
                      : 'bg-slate-50/70 border-slate-200/90 hover:bg-white'
                  }`}
                >
                  <div>
                    {/* Period Name */}
                    <div className="text-[10px] text-slate-500 mb-1">
                      <span className="font-bold">{item.period.name} ({item.period.timeRange})</span>
                    </div>

                    {/* Subject */}
                    <div 
                      onClick={() => onSlotClick(currentDayKey, item.period.period)}
                      className="cursor-pointer group"
                    >
                      <div className="font-black text-xs uppercase truncate text-slate-800">
                        {item.subject}
                      </div>

                      {item.note && (
                        <div className="mt-1 text-[10px] text-amber-900 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                          <span className="truncate">{item.note}</span>
                        </div>
                      )}

                      {item.isOverridden && (
                        <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded border ${statusConfig.badgeClass}`}>
                          {statusConfig.iconText} {statusConfig.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DÒNG 2: BUỔI CHIỀU */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-orange-700 uppercase tracking-wide">
            <Sunset className="w-3.5 h-3.5 text-orange-500" />
            <span>Buổi chiều</span>
            <span className="text-[10px] normal-case font-medium text-slate-400">(13h00 - 17h15)</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">
            {afternoonLessons.length > 0 ? `${afternoonLessons.length} tiết` : 'Nghỉ chiều'}
          </span>
        </div>

        {afternoonLessons.length === 0 ? (
          <div className="p-2.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs text-center bg-slate-50/50">
            Chiều nay không có lịch học (Được nghỉ chiều)
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {afternoonLessons.map((item) => {
              const statusConfig = STATUS_LABELS[item.status];

              return (
                <div
                  key={item.key}
                  className={`p-2 rounded-xl border transition-all relative flex flex-col justify-between ${
                    item.isOverridden 
                      ? `${theme.alteredSlotRing}` 
                      : 'bg-slate-50/70 border-slate-200/90 hover:bg-white'
                  }`}
                >
                  <div>
                    {/* Period Name */}
                    <div className="text-[10px] text-slate-500 mb-1">
                      <span className="font-bold">{item.period.name}</span>
                    </div>

                    {/* Subject & Room */}
                    <div 
                      onClick={() => onSlotClick(currentDayKey, item.period.period)}
                      className="cursor-pointer group"
                    >
                      <div className="font-black text-xs uppercase truncate text-slate-800">
                        {item.subject}
                      </div>

                      {/* Note tag */}
                      {item.note && (
                        <div className="mt-1 text-[10px] text-amber-900 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                          <FileText className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                          <span className="truncate">{item.note}</span>
                        </div>
                      )}

                      {/* Room tag - Specifically kept for afternoon */}
                      {item.room && (
                        <div className="mt-1 flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 w-fit">
                          <MapPin className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                          <span className="truncate">{item.room}</span>
                        </div>
                      )}

                      {item.isOverridden && (
                        <span className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded border ${statusConfig.badgeClass}`}>
                          {statusConfig.iconText} {statusConfig.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
