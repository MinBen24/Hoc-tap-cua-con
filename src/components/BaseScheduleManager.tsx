import React, { useState, useMemo } from 'react';
import { AppTheme, LessonSlot, PeriodDefinition, SubjectPreset } from '../types/timetable';
import { DAYS_CONFIG, PERIODS_CONFIG, getSlotKey } from '../data/defaultTimetable';
import { Layers, RotateCcw, Sun, Sunset, MapPin } from 'lucide-react';

interface BaseScheduleManagerProps {
  baseSchedule: Record<string, LessonSlot>;
  onUpdateBaseSlot: (slotKey: string, lesson: LessonSlot | null) => void;
  onResetToSampleBase: () => void;
  subjectPresets: SubjectPreset[];
  theme: AppTheme;
}

export const BaseScheduleManager: React.FC<BaseScheduleManagerProps> = ({
  baseSchedule,
  onUpdateBaseSlot,
  onResetToSampleBase,
  subjectPresets,
  theme,
}) => {
  const [editingSlotKey, setEditingSlotKey] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editRoom, setEditRoom] = useState('');

  const morningPeriods = PERIODS_CONFIG.filter(p => p.session === 'morning');
  const afternoonPeriods = PERIODS_CONFIG.filter(p => p.session === 'afternoon');
  // Include Monday to Saturday (T2 to T7)
  const visibleDays = DAYS_CONFIG.filter(d => d.key !== 'CN');

  // Đầy đủ danh sách tất cả các môn từ thời khóa biểu hiện tại và các môn phổ biến
  const allAvailableSubjects = useMemo(() => {
    const list: { name: string; defaultRoom?: string }[] = [];
    const seen = new Set<string>();

    // 1. Ưu tiên thêm các môn đang có trong thời khóa biểu hiện tại
    Object.values(baseSchedule).forEach((slot) => {
      const name = slot?.subject?.trim();
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({ name, defaultRoom: slot.room });
      }
    });

    // 2. Thêm tất cả các môn mẫu có trong presets
    subjectPresets.forEach((preset) => {
      const name = preset.name.trim();
      if (!seen.has(name)) {
        seen.add(name);
        list.push({ name, defaultRoom: preset.defaultRoom });
      }
    });

    return list;
  }, [baseSchedule, subjectPresets]);

  const startEditing = (key: string) => {
    const current = baseSchedule[key];
    setEditingSlotKey(key);
    setEditSubject(current?.subject || '');
    setEditRoom(current?.room || '');
  };

  const handleSaveSlot = (key: string) => {
    if (!editSubject.trim()) {
      onUpdateBaseSlot(key, null);
    } else {
      onUpdateBaseSlot(key, {
        subject: editSubject.trim(),
        room: editRoom.trim() || undefined,
      });
    }
    setEditingSlotKey(null);
  };

  const renderSessionGrid = (
    title: string,
    icon: React.ReactNode,
    periods: PeriodDefinition[]
  ) => {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 font-extrabold text-sm text-slate-800 mb-3 px-1 uppercase tracking-wide">
          {icon}
          <span>{title}</span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <table className="w-full min-w-[760px] table-fixed border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-24 p-2 text-center text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">
                  Tiết
                </th>
                {visibleDays.map((day) => (
                  <th
                    key={day.key}
                    className="p-2 rounded-xl border border-slate-200 bg-slate-100 text-center text-xs font-bold text-slate-700 uppercase"
                  >
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => (
                <tr key={period.period}>
                  <td className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <div className="font-bold text-xs text-slate-800">{period.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{period.timeRange}</div>
                  </td>

                  {visibleDays.map((day) => {
                    const key = getSlotKey(day.key, period.period);
                    const slot = baseSchedule[key];
                    const isEditing = editingSlotKey === key;

                    return (
                      <td key={day.key} className="p-0 align-top">
                        {isEditing ? (
                          <div className="p-1.5 rounded-lg border-2 border-blue-500 bg-blue-50/60 shadow-md space-y-1">
                            <input
                              type="text"
                              value={editSubject}
                              onChange={(e) => setEditSubject(e.target.value)}
                              placeholder="Tên môn..."
                              autoFocus
                              className="w-full px-2 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {/* Room input only for afternoon */}
                            {period.session === 'afternoon' && (
                              <div>
                                <input
                                  type="text"
                                  value={editRoom}
                                  onChange={(e) => setEditRoom(e.target.value)}
                                  placeholder="Phòng học (P.19, Tin học 1...)"
                                  className="w-full px-1.5 py-0.5 text-[11px] rounded-lg border border-slate-300 bg-white focus:outline-none"
                                />
                              </div>
                            )}

                            {/* Preset subjects - Hiển thị đầy đủ tất cả các môn */}
                            <div className="pt-0.5">
                              <span className="text-[9px] text-slate-500 font-bold block mb-0.5">
                                Chọn nhanh môn ({allAvailableSubjects.length} môn):
                              </span>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto py-0.5 pr-0.5 scrollbar-thin">
                                {allAvailableSubjects.map((s) => (
                                  <button
                                    key={s.name}
                                    type="button"
                                    onClick={() => {
                                      setEditSubject(s.name);
                                      if (period.session === 'afternoon' && s.defaultRoom) setEditRoom(s.defaultRoom);
                                    }}
                                    className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold transition-all ${
                                      editSubject === s.name
                                        ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                                        : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    {s.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateBaseSlot(key, null);
                                  setEditingSlotKey(null);
                                }}
                                className="text-[10px] text-rose-600 hover:underline font-semibold"
                              >
                                Xóa tiết
                              </button>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingSlotKey(null)}
                                  className="px-2 py-0.5 text-[11px] rounded-lg bg-slate-200 text-slate-700 font-medium"
                                >
                                  Hủy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveSlot(key)}
                                  className="px-2.5 py-0.5 text-[11px] rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                >
                                  Lưu
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditing(key)}
                            className="min-h-[46px] p-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                          >
                            {slot?.subject ? (
                              <>
                                <div>
                                  <div className="text-xs font-black text-slate-800 line-clamp-1 uppercase">
                                    {slot.subject}
                                  </div>
                                </div>
                                {period.session === 'afternoon' && slot.room && (
                                  <div className="text-[9px] text-blue-700 font-bold flex items-center gap-0.5 truncate mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                                    {slot.room}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="h-full min-h-[36px] flex items-center justify-center text-slate-300 group-hover:text-blue-500 text-xs font-medium">
                                + Thêm môn
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div id="base-schedule-manager" className={`bg-white/94 backdrop-blur-md rounded-2xl border ${theme.containerBorder} shadow-xs p-5 mb-6 transition-all duration-300`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Thời Khóa Biểu Cố Định (Lịch Gốc)
            </h2>
            <p className="text-xs text-slate-500">
              Khung giờ và môn học được nhập sẵn theo ảnh thời khóa biểu. Các tuần học sẽ lấy lịch này làm gốc!
            </p>
          </div>
        </div>

        <button
          onClick={onResetToSampleBase}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors"
          title="Tải lại thời khóa biểu đúng theo ảnh gốc"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Đặt Lại Theo Ảnh Gốc
        </button>
      </div>

      {/* Tables for Morning and Afternoon */}
      {renderSessionGrid('Buổi Sáng', <Sun className="w-4 h-4 text-amber-500" />, morningPeriods)}
      {renderSessionGrid('Buổi Chiều', <Sunset className="w-4 h-4 text-orange-500" />, afternoonPeriods)}
    </div>
  );
};
