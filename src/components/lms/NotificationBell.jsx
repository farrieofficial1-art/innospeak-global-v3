import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { listMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../lib/supabase/lms';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (open && !loaded) {
      listMyNotifications()
        .then((n) => {
          setNotifications(n);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
  }, [open, loaded]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function handleOpen() {
    setOpen((v) => !v);
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  async function handleClickNotification(n) {
    if (!n.is_read) {
      await markNotificationRead(n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative rounded-lg p-2 text-navy-700 hover:bg-navy-50"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {loaded && unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 font-body text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-navy-100 bg-white shadow-premium-lg">
          <div className="flex items-center justify-between border-b border-navy-100 px-4 py-3">
            <p className="font-body text-sm font-bold text-navy-900">Notifications</p>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAllRead} className="font-body text-xs font-semibold text-gold-700 hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-6 text-center font-body text-sm text-navy-400">No notifications yet.</p>
            )}
            {notifications.map((n) => (
              <Link
                key={n.id}
                to={n.link_path || '#'}
                onClick={() => {
                  handleClickNotification(n);
                  setOpen(false);
                }}
                className={`block border-b border-navy-50 px-4 py-3 transition-colors hover:bg-navy-50/60 ${!n.is_read ? 'bg-gold-500/5' : ''}`}
              >
                <p className="font-body text-sm font-semibold text-navy-900">{n.title}</p>
                {n.body && <p className="mt-0.5 font-body text-xs text-navy-500">{n.body}</p>}
                <p className="mt-1 font-body text-xs text-navy-400">{new Date(n.created_at).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
