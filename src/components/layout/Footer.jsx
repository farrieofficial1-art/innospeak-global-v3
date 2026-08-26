import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  UserCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Founder', to: '/founder' },
  { label: 'Impact', to: '/impact' },
  { label: 'Contact', to: '/contact' },
];

const programmes = [
  { label: 'Academy', to: '/academy' },
  { label: 'Foundation', to: '/foundation' },
  { label: 'Labs', to: '/labs' },
  { label: 'Apply Now', to: '/apply' },
];

const socials = [
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
  { Icon: Linkedin, label: 'LinkedIn', href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Youtube, label: 'YouTube', href: '#' },
];

const linkClass =
  'font-body text-sm text-navy-100/80 transition-colors duration-200 hover:text-gold-300';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-navy-gradient text-white">
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + socials */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center">
              <span className="font-display text-xl font-bold text-white">InnoSpeak</span>
              <span className="ml-1 inline-block h-2 w-2 rounded-full bg-gold-gradient shadow-gold" />
              <span className="ml-2 font-display text-xl font-bold text-white">Global</span>
            </Link>
            <p className="mt-4 font-body text-sm leading-relaxed text-navy-100/80">
              Transforming communication, technical and leadership skills for the next
              generation of innovators.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-navy-100/90 transition-all duration-300 hover:border-gold-400/40 hover:bg-gold-500/10 hover:text-gold-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base font-semibold text-white">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={user ? '/portal' : '/login'}
                  className={`flex items-center gap-2 font-body text-sm font-semibold text-gold-300 transition-colors duration-200 hover:text-gold-200`}
                >
                  <UserCircle2 size={16} />
                  {user ? 'Student Portal' : 'Student Login'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Programmes */}
          <div>
            <h3 className="font-display text-base font-semibold text-white">Programmes</h3>
            <ul className="mt-5 space-y-3">
              {programmes.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-display text-base font-semibold text-white">Get in Touch</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-gold-400" />
                <a href="mailto:hello@innospeak.global" className={linkClass}>
                  hello@innospeak.global
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold-400" />
                <a href="tel:+10000000000" className={linkClass}>
                  +1 (000) 000-0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
                <span className={linkClass}>Global · Remote &amp; On-site</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="font-body text-xs text-navy-100/70">
            © {new Date().getFullYear()} InnoSpeak Global. All rights reserved.
          </p>
          <p className="font-body text-xs text-navy-100/70">
            Built for the next generation of leaders.
          </p>
        </div>
      </div>
    </footer>
  );
}
