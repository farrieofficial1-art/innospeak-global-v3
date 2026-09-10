import { BookOpen, Lightbulb, Cpu, Code } from 'lucide-react';
import { TUTOR_PERSONAS } from './tutorPersonas';
import { cn } from '../../utils/cn.js';

const PERSONA_ICONS = { BookOpen, Lightbulb, Cpu, Code };

export default function TutorPersonaChips({ activeId, onChange, className = '' }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {TUTOR_PERSONAS.map((persona) => {
        const Icon = PERSONA_ICONS[persona.icon];
        const active = persona.id === activeId;
        return (
          <button
            key={persona.id}
            type="button"
            onClick={() => onChange(persona.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-body text-xs font-semibold transition-all duration-200',
              active
                ? 'border-transparent bg-gold-gradient text-navy-900 shadow-gold'
                : 'border-navy-100 bg-white text-navy-600 hover:border-gold-300 hover:text-gold-700'
            )}
          >
            {Icon && <Icon size={13} />}
            {persona.label}
          </button>
        );
      })}
    </div>
  );
}