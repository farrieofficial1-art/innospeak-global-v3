import {
  BookOpen, GraduationCap, Brain, Lightbulb, Cpu, Code2, BriefcaseBusiness,
} from 'lucide-react';
import { TUTOR_PERSONAS } from './tutorPersonas';
import { cn } from '../../utils/cn.js';

const ICONS = { BookOpen, GraduationCap, Brain, Lightbulb, Cpu, Code2, BriefcaseBusiness };

export default function TutorPersonaChips({ activeId, onChange, className = '' }) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto pb-1 scrollbar-none', className)}>
      {TUTOR_PERSONAS.map((persona) => {
        const Icon = ICONS[persona.icon];
        const active = persona.id === activeId;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onChange(persona.id)}
            title={persona.tagline}
            className={cn(
              'group inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all',
              active
                ? 'border-gold-400/50 bg-gold-400/15 text-gold-700 shadow-sm'
                : 'border-navy-100 bg-white text-navy-600 hover:border-gold-300 hover:bg-gold-50'
            )}
          >
            {Icon && <Icon size={15} />}
            <span>{persona.label}</span>
          </button>
        );
      })}
    </div>
  );
}
