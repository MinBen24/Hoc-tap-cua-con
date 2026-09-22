import React from 'react';
import { AppTheme, DayOfWeek, LessonSlot, OverrideLessonSlot } from '../types/timetable';
import { DAYS_CONFIG, PERIODS_CONFIG, STATUS_LABELS } from '../data/defaultTimetable';
import { ListFilter, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight, Edit3, Trash2 } from 'lucide-react';

interface WeekSummaryCardProps {
  currentWeekNumber: number;
  baseSchedule: Record<string, LessonSlot>;
  currentWeekOverrides: Record<string, OverrideLessonSlot>;
  theme: AppTheme;
  onSlotClick: (dayKey: DayOfWeek, period: number) => void;
  onRemoveOverride: (slotKey: string) => void;
  onResetAllThisWeek: () => void;
}

export const WeekSummaryCard: React.FC<WeekSummaryCardProps> = ({
  currentWeekNumber,
  baseSchedule,
  currentWeekOverrides,
  theme,
  onSlotClick,
  onRemoveOverride,
  onResetAllThisWeek,
}) => {
  // Extract all overridden slots
  const overrideEntries = Object.entries(currentWeekOverrides).filter(
    ([_, slot]) => slot && slot.isOverridden
  );

  const parsedOverrides = overrideEntries.map(([slotKey, override]) => {
    const [dayKey, periodStr] = slotKey.split('_') as [DayOfWeek, string];
    const period = parseInt(periodStr, 10);
    const dayInfo = DAYS_CONFIG.find(d => d.key === dayKey);
    const periodInfo = PERIODS_CONFIG.find(p => p.period === period);
    const base = baseSchedule[slotKey];

    return {
      slotKey,
      dayKey,
      period,
      dayInfo,
      periodInfo,
      override,
      base,
      statusConfig: STATUS_LABELS[override.status || 'changed'],
    };
  });

  return (
    <div id="week-summary-container" className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs mb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
              Các Buổi Học Thay Đổi Trong Tuần {currentWeekNumber}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-300">
                {parsedOverrides.length} tiết đổi
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Chỉ các tiết này bị thay đổi so với thời khóa biểu gốc
            </p>
          </div>
        </div>

        {parsedOverrides.length > 0 && (
          <button
            id="btn-reset-all-week-overrides"
            onClick={onResetAllThisWeek}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors"
            title="Khôi phục tất cả các tiết trong tuần này về lịch gốc"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi Phục Toàn Bộ Tuần {currentWeekNumber}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="pt-4">
        {parsedOverrides.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">
              Tuần {currentWeekNumber} học đúng theo thời khóa biểu gốc!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Không có tiết học nào bị thay đổi. Nếu có môn nào đổi lịch, bạn chỉ cần bấm vào ô môn học trong bảng để chỉnh sửa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {parsedOverrides.map((item) => (
              <div
                key={item.slotKey}
                className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/60 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Day & Period badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      {item.dayInfo?.label} • {item.periodInfo?.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${item.statusConfig.badgeClass}`}>
                      {item.statusConfig.iconText} {item.statusConfig.label}
                    </span>
                  </div>

                  {/* Subject transition */}
                  <div className="flex items-center gap-2 mb-2 p-2 bg-white rounded-lg border border-slate-100">
                    <div className="text-xs text-slate-400 line-through truncate max-w-[40%]">
                      {item.base?.subject || 'Trống'}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <div className="text-xs font-extrabold text-slate-800 truncate">
                      {item.override.subject}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-[11px] text-slate-600 space-y-0.5 mb-2">
                    {item.override.room && (
                      <p className="truncate">Phòng: <span className="font-semibold">{item.override.room}</span></p>
                    )}
                    {item.override.note && (
                      <p className="text-amber-800 font-medium bg-amber-100/50 p-1 rounded mt-1 line-clamp-2">
                        💡 {item.override.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between gap-2 mt-1">
                  <button
                    onClick={() => onSlotClick(item.dayKey, item.period)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Chỉnh sửa
                  </button>

                  <button
                    onClick={() => onRemoveOverride(item.slotKey)}
                    className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    title="Khôi phục lại tiết gốc"
                  >
                    <RotateCcw className="w-3 h-3" /> Đặt lại gốc
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
