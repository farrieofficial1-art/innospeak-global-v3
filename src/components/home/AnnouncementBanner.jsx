import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="relative z-40 bg-gold-500 text-navy-950">
      <div className="container-premium flex min-h-11 items-center justify-center gap-3 px-12 py-2 text-center">
        <p className="font-body text-xs font-bold sm:text-sm">
          <span className="mr-2 rounded-full bg-navy-950 px-2 py-1 text-[10px] uppercase tracking-wider text-white">Featured</span>
          Explore current courses and practical learning opportunities at InnoSpeak Global.
        </p>
        <Link to="/courses" className="hidden items-center gap-1 font-body text-xs font-extrabold underline underline-offset-2 sm:inline-flex">Browse courses <ArrowRight size={13} /></Link>
        <button type="button" aria-label="Dismiss announcement" onClick={() => setOpen(false)} className="absolute right-3 rounded-full p-1.5 transition hover:bg-navy-950/10 sm:right-6"><X size={16} /></button>
      </div>
    </div>
  );
}
