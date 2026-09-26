// Lucide icons used on cards and banners, keyed by what they stand for.
import FileUp from '@lucide/astro/icons/file-up';
import ScanEye from '@lucide/astro/icons/scan-eye';
import FileSpreadsheet from '@lucide/astro/icons/file-spreadsheet';
import Route from '@lucide/astro/icons/route';
import BookOpen from '@lucide/astro/icons/book-open';
import FlaskConical from '@lucide/astro/icons/flask-conical';
import Rocket from '@lucide/astro/icons/rocket';
import RefreshCw from '@lucide/astro/icons/refresh-cw';
import MessageSquareText from '@lucide/astro/icons/message-square-text';
import Handshake from '@lucide/astro/icons/handshake';
import Package from '@lucide/astro/icons/package';
import Users from '@lucide/astro/icons/users';
import Mail from '@lucide/astro/icons/mail';
import CalendarDays from '@lucide/astro/icons/calendar-days';
import Send from '@lucide/astro/icons/send';

export const icons = {
  input: FileUp,
  review: ScanEye,
  export: FileSpreadsheet,
  map: Route,
  learn: BookOpen,
  test: FlaskConical,
  apply: Rocket,
  repeat: RefreshCw,
  chat: MessageSquareText,
  agree: Handshake,
  box: Package,
  team: Users,
  mail: Mail,
  calendar: CalendarDays,
  send: Send,
};

export type IconName = keyof typeof icons;
