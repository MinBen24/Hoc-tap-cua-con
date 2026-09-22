export type DayOfWeek = 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'CN';

export interface DayInfo {
  key: DayOfWeek;
  label: string; // e.g. "Thứ Hai"
  shortLabel: string; // e.g. "T2"
  isWeekend?: boolean;
}

export type SlotSession = 'morning' | 'afternoon';

export interface PeriodDefinition {
  period: number; // 1 -> 10
  session: SlotSession;
  timeRange: string; // e.g. "07:00 - 07:45"
  name: string; // "Tiết 1"
}

export type ChangeStatus = 
  | 'normal'     // Học bình thường theo lịch gốc
  | 'changed'    // Đổi môn học
  | 'makeup'     // Học bù
  | 'off'        // Nghỉ tiết / Được nghỉ
  | 'exam'       // Kiểm tra / Thi
  | 'room_change'// Đổi phòng học

export interface LessonSlot {
  subject: string;
  room?: string;
  color?: string; // hex or tailwind badge style
  note?: string;
}

export interface OverrideLessonSlot extends LessonSlot {
  isOverridden: boolean;
  status: ChangeStatus;
  originalSubject?: string;
  originalRoom?: string;
  changeReason?: string;
  overrideTimestamp?: number;
}

export interface SubjectPreset {
  id: string;
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  defaultRoom?: string;
}

export type ThemeGender = 'boy' | 'girl' | 'neutral';

export interface AppTheme {
  id: string;
  name: string;
  subtitle: string;
  gender: ThemeGender;
  badge: string; // e.g. "👦 Nam" or "👧 Nữ"
  previewColors: string[]; // for theme selector cards
  // Class mappings
  bodyBg: string;
  surfaceBg: string;
  cardBg: string;
  headerGradient: string;
  primaryColor: string; // for buttons and accents
  primaryHover: string;
  accentBadge: string;
  tableHeaderBg: string;
  tableBorder: string;
  cellHoverBg: string;
  alteredSlotRing: string;
  accentText: string;
  // Enhanced theme styling
  containerBorder: string;
  btnPrimary: string;
  mascotEmoji: string;
  mascotName: string;
  mascotQuote: string;
  cardHeaderBg: string;
  todayMorningBg: string;
  todayAfternoonBg: string;
}

export interface StudentProgress {
  level: number;
  exp: number;
  maxExp: number;
  streakDays: number;
  title: string;
  completedSlotsToday: string[]; // e.g. ["T2_1", "T2_2"]
  lastActiveDate: string; // YYYY-MM-DD
}

export interface WeeklyScheduleState {
  currentWeekNumber: number; // e.g. Week 1, 2, 3...
  baseSchedule: Record<string, LessonSlot>; // key: `${day}_${period}`
  overrides: Record<string, Record<string, OverrideLessonSlot>>; // key: `week_${weekNumber}` -> `${day}_${period}` -> OverrideLessonSlot
  customSubjects: SubjectPreset[];
  showWeekend: boolean;
  selectedThemeId: string;
  semesterStartDate: string; // YYYY-MM-DD
}
