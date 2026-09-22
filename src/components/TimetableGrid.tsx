import React from 'react';
import { AppTheme, DayOfWeek, LessonSlot, OverrideLessonSlot, PeriodDefinition } from '../types/timetable';
import { DAYS_CONFIG, PERIODS_CONFIG, getSlotKey } from '../data/defaultTimetable';
import { TimetableCell } from './TimetableCell';
import { Sun, Sunset, Coffee } from 'lucide-react';

interface TimetableGridProps {
  currentWeekNumber: number;
  baseSchedule: Record<string, LessonSlot>;
  currentWeekOverrides: Record<string, OverrideLessonSlot>;
  daysMap: Record<DayOfWeek, { date: Date; dateStr: string; isToday: boolean }>;
  showWeekend: boolean;
  theme: AppTheme;
  onSlotClick: (dayKey: DayOfWeek, period: number) => void;
}

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  currentWeekNumber,
  baseSchedule,
  currentWeekOverrides,
  daysMap,
  showWeekend,
  theme,
  onSlotClick,
}) => {
  // Always include T2 -> T7; CN is toggleable
  const visibleDays = DAYS_CONFIG.filter(d => d.key !== 'CN' || showWeekend);
  const morningPeriods = PERIODS_CONFIG.filter(p => p.session === 'morning');
  const afternoonPeriods = PERIODS_CONFIG.filter(p => p.session === 'afternoon');

  const renderSessionSection = (
    title: string,
    icon: React.ReactNode,
    periods: PeriodDefinition[],
    sessionBg: string,
    isMorning?: boolean
  ) => {
    return (
      <div className="mb-4 last:mb-0">
        {/* Compact Session Sub-header */}
        <div className={`px-3 py-1.5 rounded-xl mb-2 flex items-center justify-between border ${sessionBg} border-slate-200/80`}>
          <div className="flex items-center gap-1.5 font-black text-xs text-slate-800 uppercase tracking-wide">
            {icon}
            <span>{title}</span>
            <span className="text-[11px] font-medium normal-case text-slate-500">
              ({periods[0]?.timeRange.split('-')[0].trim()} - {periods[periods.length - 1]?.timeRange.split('-')[1].trim()})
            </span>
          </div>
          <span className="text-[10px] text-slate-600 font-bold bg-white/80 px-1.5 py-0.2 rounded border border-slate-200/60">
            {periods.length} tiết
          </span>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto pb-1 scrollbar-thin">
          <table className="w-full min-w-[700px] table-fixed border-separate border-spacing-1">
            <thead>
              <tr>
                {/* Compact Time / Period column header */}
                <th className="w-20 p-1 text-center text-[11px] font-extrabold text-slate-600 bg-slate-100/90 rounded-lg">
                  Tiết
                </th>

                {/* Compact Day headers */}
                {visibleDays.map((day) => {
                  const dayInfo = daysMap[day.key];
                  const isToday = dayInfo?.isToday;

                  const hasDayOverride = periods.some(p => {
                    const k = getSlotKey(day.key, p.period);
                    return currentWeekOverrides[k]?.isOverridden;
                  });

                  return (
                    <th
                      key={day.key}
                      className={`p-1.5 rounded-lg border text-center transition-colors relative ${
                        isToday
                          ? `${theme.btnPrimary} shadow-xs border-transparent`
                          : `${theme.tableHeaderBg}`
                      }`}
                    >
                      <div className="flex flex-col items-center leading-tight">
                        <span className={`text-[11px] font-black uppercase tracking-wide ${isToday ? 'text-white' : ''}`}>
                          {day.shortLabel || day.label}
                        </span>
                        <span className={`text-[10px] font-medium ${isToday ? 'text-white/80' : 'text-slate-500'}`}>
                          {dayInfo?.dateStr}
                        </span>

                        {isToday && (
                          <span className="mt-0.5 px-1 py-0.2 rounded text-[8px] font-black bg-white text-slate-900 uppercase">
                            Hôm nay
                          </span>
                        )}

                        {hasDayOverride && !isToday && (
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" title="Có tiết đổi trong ngày" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {periods.map((period) => {
                const showBreakAfterThis = isMorning && period.period === 2;

                return (
                  <React.Fragment key={period.period}>
                    <tr>
                      {/* Compact Period Name & Time */}
                      <td className="p-1 bg-slate-50/90 border border-slate-200/90 rounded-lg text-center leading-tight">
                        <div className="font-extrabold text-[11px] text-slate-800">{period.name}</div>
                        <div className="text-[9px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                          {period.timeRange}
                        </div>
                      </td>

                      {/* Day Cells */}
                      {visibleDays.map((day) => {
                        const key = getSlotKey(day.key, period.period);
                        const baseSlot = baseSchedule[key];
                        const overrideSlot = currentWeekOverrides[key];
                        const isToday = !!daysMap[day.key]?.isToday;

                        return (
                          <td key={day.key} className="p-0 align-middle">
                            <TimetableCell
                              dayKey={day.key}
                              period={period.period}
                              baseSlot={baseSlot}
                              overrideSlot={overrideSlot}
                              isToday={isToday}
                              theme={theme}
                              onClick={() => onSlotClick(day.key, period.period)}
                            />
                          </td>
                        );
                      })}
                    </tr>

                    {/* Slim Ra Chơi break row */}
                    {showBreakAfterThis && (
                      <tr>
                        <td colSpan={visibleDays.length + 1} className="py-0.5 px-1">
                          <div className="bg-amber-100/70 border border-amber-300/60 rounded-md py-0.5 px-2 text-center flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-900">
                            <Coffee className="w-3 h-3 text-amber-700" />
                            <span>Giờ Ra Chơi (8h30 - 8h50) • 20 phút</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div id="timetable-grid-container" className="space-y-3">
      {/* Morning Session */}
      {renderSessionSection(
        'Buổi Sáng',
        <Sun className="w-3.5 h-3.5 text-amber-500" />,
        morningPeriods,
        'bg-amber-50/50',
        true
      )}

      {/* Afternoon Session */}
      {renderSessionSection(
        'Buổi Chiều',
        <Sunset className="w-3.5 h-3.5 text-orange-500" />,
        afternoonPeriods,
        'bg-orange-50/40',
        false
      )}
    </div>
  );
};
