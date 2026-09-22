import { DayOfWeek } from '../types/timetable';

// Default semester start: Monday of current week or early September
export function getSemesterStart(): Date {
  const now = new Date();
  // Get Monday of current week
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getWeekDateRange(weekNumber: number, semesterStartDate?: string): {
  start: Date;
  end: Date;
  daysMap: Record<DayOfWeek, { date: Date; dateStr: string; isToday: boolean }>;
} {
  const baseStart = semesterStartDate ? new Date(semesterStartDate) : getSemesterStart();
  // Add (weekNumber - 1) * 7 days
  const weekStart = new Date(baseStart);
  weekStart.setDate(baseStart.getDate() + (weekNumber - 1) * 7);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const daysKeys: DayOfWeek[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const daysMap = {} as Record<DayOfWeek, { date: Date; dateStr: string; isToday: boolean }>;

  daysKeys.forEach((key, index) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + index);
    const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const displayDate = `${d.getDate()}/${d.getMonth() + 1}`;
    daysMap[key] = {
      date: d,
      dateStr: displayDate,
      isToday: dStr === todayStr,
    };
  });

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return {
    start: weekStart,
    end: weekEnd,
    daysMap,
  };
}

export function getCurrentDayKey(): DayOfWeek {
  const day = new Date().getDay();
  // 0 is Sunday, 1 is Monday, 2 is Tuesday, etc.
  const map: Record<number, DayOfWeek> = {
    0: 'CN',
    1: 'T2',
    2: 'T3',
    3: 'T4',
    4: 'T5',
    5: 'T6',
    6: 'T7',
  };
  return map[day] || 'T2';
}

export function formatVietnameseDate(date: Date): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[date.getDay()];
  return `${dayName}, ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
