import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_LINKS } from '../../lib/nav';

/**
 * DesktopNav — in-bar primary navigation.
 *
 * Each item fades from navy/55 to navy on hover with an animated gold
 * underline. The active page renders a heavier weight plus a gold
 * underline that slides smoothly between items (Framer Motion shared
 * layout). NavLink's render-prop gives active state without an extra
 * useLocation subscription per render.
 */
export default function DesktopNav() {
  return (
    <nav className="hidden items-center lg:flex" aria-label="Primary">
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              className="group relative px-5 py-2"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`relative inline-block text-sm transition-all duration-300 ease-out-expo ${
                      isActive
                        ? 'font-semibold text-navy'
                        : 'font-medium text-navy/55 group-hover:text-navy'
                    }`}
                  >
                    {link.label}
                    {/* Hover underline */}
                    <span className="absolute -bottom-1.5 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-gold/60 transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
                    {/* Active underline — shared layout slides between items */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-underline"
                        className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gold"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
