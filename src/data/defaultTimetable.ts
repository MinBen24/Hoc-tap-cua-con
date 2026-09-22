import { DayInfo, LessonSlot, OverrideLessonSlot, PeriodDefinition, SubjectPreset } from '../types/timetable';

export const DAYS_CONFIG: DayInfo[] = [
  { key: 'T2', label: 'Thứ Hai', shortLabel: 'Thứ 2' },
  { key: 'T3', label: 'Thứ Ba', shortLabel: 'Thứ 3' },
  { key: 'T4', label: 'Thứ Tư', shortLabel: 'Thứ 4' },
  { key: 'T5', label: 'Thứ Năm', shortLabel: 'Thứ 5' },
  { key: 'T6', label: 'Thứ Sáu', shortLabel: 'Thứ 6' },
  { key: 'T7', label: 'Thứ Bảy', shortLabel: 'Thứ 7' }, // Thêm Thứ Bảy theo yêu cầu
  { key: 'CN', label: 'Chủ Nhật', shortLabel: 'CN', isWeekend: true },
];

// Thời gian và tiết theo đúng ảnh thời khóa biểu thực tế của học sinh
export const PERIODS_CONFIG: PeriodDefinition[] = [
  // BUỔI SÁNG (theo ảnh)
  { period: 1, session: 'morning', timeRange: '7h00 - 7h45', name: 'Tiết 1' },
  { period: 2, session: 'morning', timeRange: '7h45 - 8h30', name: 'Tiết 2' },
  // Ra chơi: 8h30 - 8h50
  { period: 3, session: 'morning', timeRange: '8h50 - 9h35', name: 'Tiết 3' },
  { period: 4, session: 'morning', timeRange: '9h35 - 10h20', name: 'Tiết 4' },
  { period: 5, session: 'morning', timeRange: '10h30 - 11h15', name: 'Tiết 5' },

  // BUỔI CHIỀU (theo ảnh: Tiết 2: 13h45-14h30, Tiết 3: 14h50-15h35, Tiết 4: 15h35-16h20, Tiết 5: 16h30-17h15)
  { period: 6, session: 'afternoon', timeRange: '13h00 - 13h45', name: 'Tiết 1 (Chiều)' },
  { period: 7, session: 'afternoon', timeRange: '13h45 - 14h30', name: 'Tiết 2 (Chiều)' },
  { period: 8, session: 'afternoon', timeRange: '14h50 - 15h35', name: 'Tiết 3 (Chiều)' },
  { period: 9, session: 'afternoon', timeRange: '15h35 - 16h20', name: 'Tiết 4 (Chiều)' },
  { period: 10, session: 'afternoon', timeRange: '16h30 - 17h15', name: 'Tiết 5 (Chiều)' },
];

export const BREAK_TIME_MORNING = 'Ra chơi: 8h30 - 8h50';

export const DEFAULT_SUBJECTS: SubjectPreset[] = [
  // Các môn chính xác theo thời khóa biểu học sinh hiện tại
  { id: 'toan', name: 'TOÁN', color: '#2563eb', badgeBg: 'bg-blue-100 text-blue-800 border-blue-200', badgeText: 'blue' },
  { id: 'van', name: 'VĂN', color: '#db2777', badgeBg: 'bg-pink-100 text-pink-800 border-pink-200', badgeText: 'pink' },
  { id: 'anh', name: 'ANH', color: '#059669', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200', badgeText: 'emerald' },
  { id: 'khtn', name: 'KHTN', color: '#7c3aed', badgeBg: 'bg-purple-100 text-purple-800 border-purple-200', badgeText: 'purple' },
  { id: 'su', name: 'SỬ', color: '#ea580c', badgeBg: 'bg-orange-100 text-orange-800 border-orange-200', badgeText: 'orange' },
  { id: 'dia', name: 'ĐỊA', color: '#0d9488', badgeBg: 'bg-teal-100 text-teal-800 border-teal-200', badgeText: 'teal' },
  { id: 'gdcd', name: 'GDCD', color: '#4f46e5', badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200', badgeText: 'indigo' },
  { id: 'tnhn', name: 'TNHN', color: '#e11d48', badgeBg: 'bg-rose-100 text-rose-800 border-rose-200', badgeText: 'rose', defaultRoom: 'P.19' },
  { id: 'cn', name: 'CN', color: '#65a30d', badgeBg: 'bg-lime-100 text-lime-800 border-lime-200', badgeText: 'lime' },
  { id: 'mt', name: 'MT', color: '#0284c7', badgeBg: 'bg-sky-100 text-sky-800 border-sky-200', badgeText: 'sky' },
  { id: 'nhac', name: 'NHẠC', color: '#a855f7', badgeBg: 'bg-purple-100 text-purple-800 border-purple-200', badgeText: 'purple', defaultRoom: 'P.19' },
  { id: 'td', name: 'TD', color: '#dc2626', badgeBg: 'bg-red-100 text-red-800 border-red-200', badgeText: 'red', defaultRoom: 'P.19' },
  { id: 'tin', name: 'TIN', color: '#06b6d4', badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200', badgeText: 'cyan', defaultRoom: 'PBM TIN HỌC 1' },
  { id: 'gddp', name: 'GDĐP', color: '#854d0e', badgeBg: 'bg-amber-100 text-amber-800 border-amber-200', badgeText: 'amber' },
  { id: 'shcn', name: 'SHCN', color: '#64748b', badgeBg: 'bg-slate-100 text-slate-800 border-slate-200', badgeText: 'slate' },
  // Các môn học bổ sung & tên viết đầy đủ để chọn nhanh
  { id: 'ls_dl', name: 'LỊCH SỬ & ĐỊA LÝ', color: '#c2410c', badgeBg: 'bg-amber-100 text-amber-800 border-amber-200', badgeText: 'amber' },
  { id: 'gdtc', name: 'GDTC', color: '#b91c1c', badgeBg: 'bg-red-100 text-red-800 border-red-200', badgeText: 'red' },
  { id: 'hoa', name: 'HÓA', color: '#047857', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200', badgeText: 'emerald' },
  { id: 'ly', name: 'LÝ', color: '#1d4ed8', badgeBg: 'bg-blue-100 text-blue-800 border-blue-200', badgeText: 'blue' },
  { id: 'sinh', name: 'SINH', color: '#15803d', badgeBg: 'bg-green-100 text-green-800 border-green-200', badgeText: 'green' },
  { id: 'chao_co', name: 'CHÀO CỜ', color: '#b45309', badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-200', badgeText: 'yellow' },
  { id: 'tu_hoc', name: 'TỰ HỌC', color: '#475569', badgeBg: 'bg-slate-100 text-slate-800 border-slate-200', badgeText: 'slate' },
  { id: 'on_tap', name: 'ÔN TẬP', color: '#4338ca', badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200', badgeText: 'indigo' },
];

export const getSlotKey = (day: string, period: number): string => `${day}_${period}`;

// CHÍNH XÁC THEO ẢNH THỜI KHÓA BIỂU CỦA NGƯỜI DÙNG:
export const DEFAULT_BASE_SCHEDULE: Record<string, LessonSlot> = {
  // --- THỨ 2 ---
  // Sáng: Tiết 1: TNHN, Tiết 2: GDCD, Tiết 3: KHTN, Tiết 4: KHTN
  'T2_1': { subject: 'TNHN' },
  'T2_2': { subject: 'GDCD' },
  'T2_3': { subject: 'KHTN' },
  'T2_4': { subject: 'KHTN' },
  // Chiều: Tiết 4: TNHN, Tiết 5: TNHN (Phòng P.19)
  'T2_9': { subject: 'TNHN', room: 'P.19' },
  'T2_10': { subject: 'TNHN', room: 'P.19' },

  // --- THỨ 3 ---
  // Sáng: Tiết 1: ANH, Tiết 2: ANH, Tiết 3: CN, Tiết 4: VĂN, Tiết 5: VĂN
  'T3_1': { subject: 'ANH' },
  'T3_2': { subject: 'ANH' },
  'T3_3': { subject: 'CN' },
  'T3_4': { subject: 'VĂN' },
  'T3_5': { subject: 'VĂN' },
  // Chiều: Tiết 4: NHẠC, Tiết 5: TD (Phòng P.19)
  'T3_9': { subject: 'NHẠC', room: 'P.19' },
  'T3_10': { subject: 'TD', room: 'P.19' },

  // --- THỨ 4 ---
  // Sáng: Tiết 1: MT, Tiết 2: SỬ, Tiết 3: GDĐP, Tiết 4: ANH, Tiết 5: ĐỊA
  'T4_1': { subject: 'MT' },
  'T4_2': { subject: 'SỬ' },
  'T4_3': { subject: 'GDĐP' },
  'T4_4': { subject: 'ANH' },
  'T4_5': { subject: 'ĐỊA' },
  // Chiều: Tiết 2: TIN, Tiết 3: TD (Phòng PBM TIN HỌC 1)
  'T4_7': { subject: 'TIN', room: 'PBM TIN HỌC 1' },
  'T4_8': { subject: 'TD', room: 'PBM TIN HỌC 1' },

  // --- THỨ 5 ---
  // Sáng: Tiết 1: TOÁN, Tiết 2: TOÁN, Tiết 3: ĐỊA, Tiết 4: KHTN, Tiết 5: KHTN
  'T5_1': { subject: 'TOÁN' },
  'T5_2': { subject: 'TOÁN' },
  'T5_3': { subject: 'ĐỊA' },
  'T5_4': { subject: 'KHTN' },
  'T5_5': { subject: 'KHTN' },

  // --- THỨ 6 ---
  // Sáng: Tiết 1: VĂN, Tiết 2: VĂN, Tiết 3: TOÁN, Tiết 4: TOÁN
  'T6_1': { subject: 'VĂN' },
  'T6_2': { subject: 'VĂN' },
  'T6_3': { subject: 'TOÁN' },
  'T6_4': { subject: 'TOÁN' },

  // --- THỨ 7 (Được thêm theo yêu cầu) ---
  // Mặc định để trống hoặc có thể thêm tiết tự học / hoạt động
  'T7_1': { subject: 'SHCN' },
};

// Initial sample override: minh họa cho tính năng chỉ sửa tiết bị đổi
export const INITIAL_SAMPLE_OVERRIDES: Record<string, Record<string, OverrideLessonSlot>> = {
  'week_1': {
    // Ví dụ Thứ 4 Tiết 2 môn SỬ đổi thành TIN
    'T4_2': {
      subject: 'TIN (Học bù)',
      room: 'PBM TIN HỌC 1',
      note: 'Thực hành bù bài kiểm tra máy tính',
      isOverridden: true,
      status: 'makeup',
      originalSubject: 'SỬ',
      originalRoom: '',
      changeReason: 'Học bù phòng máy',
      overrideTimestamp: Date.now() - 3600000 * 24,
    },
    // Ví dụ Thứ 6 Tiết 4 TOÁN kiểm tra 1 tiết
    'T6_4': {
      subject: 'TOÁN (Kiểm tra 45p)',
      note: 'Kiểm tra 1 tiết Hình học chương 1',
      isOverridden: true,
      status: 'exam',
      originalSubject: 'TOÁN',
      changeReason: 'Kiểm tra tập trung',
      overrideTimestamp: Date.now() - 3600000 * 12,
    },
  },
};

export const STATUS_LABELS: Record<string, { label: string; badgeClass: string; iconText: string; description: string }> = {
  normal: {
    label: 'Theo Lịch Gốc',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    iconText: '✓',
    description: 'Học bình thường theo thời khóa biểu cố định',
  },
  changed: {
    label: 'Đổi Môn Học',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
    iconText: '🔄',
    description: 'Môn này được đổi sang môn khác trong tuần',
  },
  makeup: {
    label: 'Học Bù',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',
    iconText: '⚡',
    description: 'Buổi học bù giáo viên xếp thêm',
  },
  off: {
    label: 'Nghỉ Tiết',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    iconText: '⛔',
    description: 'Tiết học này được nghỉ',
  },
  exam: {
    label: 'Kiểm Tra / Thi',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300 font-semibold',
    iconText: '📝',
    description: 'Có bài kiểm tra 15p, 45p hoặc thi',
  },
  room_change: {
    label: 'Đổi Phòng',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300 font-semibold',
    iconText: '📍',
    description: 'Học môn cũ nhưng chuyển phòng học khác',
  },
};
