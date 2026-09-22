import React, { useState } from 'react';
import { AppTheme, StudentProgress } from '../types/timetable';
import { Sparkles, Trophy, Flame, CheckCircle2, Award, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface GamificationWidgetProps {
  progress: StudentProgress;
  theme: AppTheme;
  onClaimDailyCheckin: () => void;
  todayCompletedCount: number;
  todayTotalCount: number;
}

export const GamificationWidget: React.FC<GamificationWidgetProps> = ({
  progress,
  theme,
  onClaimDailyCheckin,
  todayCompletedCount,
  todayTotalCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const expPercentage = Math.min(100, Math.round((progress.exp / progress.maxExp) * 100));
  const isAllTodayDone = todayTotalCount > 0 && todayCompletedCount >= todayTotalCount;

  return (
    <div className={`mb-4 rounded-2xl bg-white border ${theme.containerBorder} shadow-xs overflow-hidden transition-all duration-200`}>
      {/* Compact Gamification Top Bar */}
      <div className={`px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 ${theme.cardHeaderBg}`}>
        {/* Mascot & Level */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-black/5 flex items-center justify-center text-xl shrink-0">
            <span>{theme.mascotEmoji}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-800">
                Lv.{progress.level} {progress.title}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                {progress.exp}/{progress.maxExp} EXP
              </span>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-1">
              <strong className="font-semibold text-slate-700">{theme.mascotName}:</strong> &ldquo;{theme.mascotQuote}&rdquo;
            </p>
          </div>
        </div>

        {/* Right Stats & Quick Actions */}
        <div className="flex items-center gap-2 text-xs">
          {/* Streak Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-100/90 text-orange-900 border border-orange-200 font-bold shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-bounce" />
            <span>{progress.streakDays} ngày liên tiếp</span>
          </div>

          {/* Today Mission Progress */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-bold">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {todayCompletedCount}/{todayTotalCount} tiết xong
            </span>
          </div>

          {/* Expand quests toggle button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-black/5 text-slate-600 transition-colors"
            title="Xem nhiệm vụ & thành tích"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mini EXP progress bar line */}
      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
          style={{ width: `${expPercentage}%` }}
        />
      </div>

      {/* Expandable Quest / Achievement Panel */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 bg-white/95 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs animate-fadeIn">
          {/* Quest 1 */}
          <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Điểm danh học tập</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Mở app xem thời khóa biểu mỗi ngày</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
              ✓ +20 EXP
            </span>
          </div>

          {/* Quest 2 */}
          <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Hoàn thành tiết học</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đánh dấu tiết học đã xong ({todayCompletedCount}/{todayTotalCount})
              </p>
            </div>
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              isAllTodayDone
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
              {isAllTodayDone ? 'Đạt +50 EXP' : '+15 EXP/tiết'}
            </span>
          </div>

          {/* Quest 3 */}
          <div className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Chiến Thần Chăm Chỉ</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Duy trì chuỗi ngày đi học đúng giờ</p>
            </div>
            <span className="shrink-0 text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200">
              🔥 {progress.streakDays} ngày
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
