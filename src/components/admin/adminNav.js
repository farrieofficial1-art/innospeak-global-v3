import { LayoutDashboard, Users, GraduationCap, CalendarRange, BookMarked, SendHorizontal as SendHorizonal, LifeBuoy, Award, Megaphone, ClipboardList, Mail, Wallet, CalendarDays, ChartBar as BarChart3, UsersRound, BriefcaseBusiness, UserCheck } from 'lucide-react';

export const adminNav = [
  { key: 'dashboard', label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { key: 'lms-overview', label: 'E-Learning Overview', path: '/admin/lms', icon: BarChart3 },
  { key: 'cohorts', label: 'Cohorts & Intakes', path: '/admin/cohorts', icon: UsersRound },
  { key: 'career-opportunities', label: 'Career Opportunities', path: '/admin/career-opportunities', icon: BriefcaseBusiness },
  { key: 'students', label: 'Students', path: '/admin/students', icon: Users },
  { key: 'applications', label: 'Applications', path: '/admin/applications', icon: ClipboardList },
  { key: 'tutor-applications', label: 'Tutor Applications', path: '/admin/tutor-applications', icon: UserCheck },
  { key: 'messages', label: 'Contact Messages', path: '/admin/messages', icon: Mail },
  { key: 'programs', label: 'Programs', path: '/admin/programs', icon: GraduationCap },
  { key: 'semesters', label: 'Semesters', path: '/admin/semesters', icon: CalendarRange },
  { key: 'units', label: 'Units', path: '/admin/units', icon: BookMarked },
  { key: 'timetable-exams', label: 'Timetable & Exams', path: '/admin/timetable-exams', icon: CalendarDays },
  { key: 'fees', label: 'Fee Structures', path: '/admin/fees', icon: Wallet },
  { key: 'requests', label: 'Requests', path: '/admin/requests', icon: SendHorizonal },
  { key: 'support', label: 'Support Tickets', path: '/admin/support', icon: LifeBuoy },
  { key: 'graduation', label: 'Graduation', path: '/admin/graduation', icon: Award },
  { key: 'announcements', label: 'Announcements', path: '/admin/announcements', icon: Megaphone },
];
