import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock3, Layers3, Search, Sparkles } from 'lucide-react';
import Seo from '../components/ui/Seo.jsx';
import { COURSES, getVisiblePrograms } from '../lib/data/programmeData.js';

const PATHWAYS = getVisiblePrograms();

const areaMap = {
  'global-language': { label: 'Languages & Communication', icon: '◌' },
  languages: { label: 'World Languages', icon: '文' },
  'international-qualifications': { label: 'Qualifications', icon: '◆' },
  'national-tvet': { label: 'TVET & Curriculum', icon: '▣' },
  'digital-literacy-productivity': { label: 'Digital Skills', icon: '⌘' },
  'creative-design': { label: 'Creative & Media', icon: '✦' },
  business: { label: 'Business & Leadership', icon: '↗' },
  freelancing: { label: 'Freelancing & Remote Work', icon: '◎' },
  career: { label: 'Career Development', icon: '↗' },
  'education-teaching-excellence': { label: 'Education & Teaching', icon: '◫' },
  'health-hospitality-community': { label: 'Community & Hospitality', icon: '◇' },
  'personal-development-life-skills': { label: 'Personal Development', icon: '✧' },
};

export default function Programs() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('all');

  const counts = useMemo(() => Object.fromEntries(PATHWAYS.map((p) => [p.id, COURSES.filter((c) => c.pathwayId === p.id).length])), []);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PATHWAYS.filter((p) => active === 'all' || p.id === active).map((p) => ({
      ...p,
      courses: COURSES.filter((c) => c.pathwayId === p.id && (!q || `${c.name} ${c.shortDescription} ${c.category}`.toLowerCase().includes(q))),
    })).filter((p) => !q || p.courses.length);
  }, [active, query]);

  return <>
    <Seo title="Programs" description="Explore InnoSpeak Global learning programs and professional courses." path="/programs" />
    <section className="bg-navy-gradient text-white">
      <div className="container-premium py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="font-body text-xs font-bold uppercase tracking-[0.22em] text-gold-300">Learning & Development</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Programs built around skills, practice and progression.</h1>
          <p className="mt-5 max-w-2xl font-body text-base leading-7 text-white/70">Explore focused learning areas, then move from a program into the courses, practical projects and learning experiences that support your goals.</p>
        </div>
        <div className="mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
          <Search size={19} className="ml-2 shrink-0 text-white/60" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search programs and courses…" className="w-full bg-transparent px-2 py-2 font-body text-sm text-white outline-none placeholder:text-white/45" />
        </div>
      </div>
    </section>

    <section className="container-premium py-12 sm:py-16">
      <div className="flex gap-2 overflow-x-auto pb-3">
        <button onClick={() => setActive('all')} className={`shrink-0 rounded-full px-4 py-2 font-body text-sm font-semibold ${active === 'all' ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600'}`}>All areas</button>
        {PATHWAYS.map((p) => <button key={p.id} onClick={() => setActive(p.id)} className={`shrink-0 rounded-full px-4 py-2 font-body text-sm font-semibold ${active === p.id ? 'bg-navy-900 text-white' : 'bg-navy-50 text-navy-600'}`}>{areaMap[p.id]?.label || p.title}</button>)}
      </div>

      <div className="mt-8 space-y-10">
        {visible.map((program) => <article key={program.id} className="overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.05fr_1.95fr]">
            <div className="bg-navy-900 p-7 text-white sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/15 text-xl text-gold-300">{areaMap[program.id]?.icon || <Sparkles size={20} />}</div>
              <h2 className="mt-6 font-display text-2xl font-bold">{program.title}</h2>
              <p className="mt-3 font-body text-sm leading-6 text-white/65">{program.description}</p>
              <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-xs font-semibold text-white/80"><Layers3 size={14} /> {counts[program.id] || 0} courses</div>
              <Link to={`/programs/${program.slug}`} className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold text-gold-300 hover:text-gold-200">View program details <ArrowRight size={15} /></Link>
            </div>
            <div className="p-6 sm:p-8">
              {program.courses.length ? <div className="grid gap-4 sm:grid-cols-2">{program.courses.slice(0, 6).map((course) => <div key={course.code} className="rounded-2xl border border-navy-100 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-gold-500/10 px-2.5 py-1 font-body text-[11px] font-bold text-gold-700">{course.level}</span><span className="font-body text-xs font-semibold text-navy-400">{course.code}</span></div>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{course.name}</h3>
                <p className="mt-2 line-clamp-3 font-body text-sm leading-6 text-navy-500">{course.shortDescription}</p>
                <div className="mt-4 flex flex-wrap gap-3 font-body text-xs text-navy-500"><span className="inline-flex items-center gap-1"><Clock3 size={13}/> {course.duration}</span><span className="inline-flex items-center gap-1"><BookOpen size={13}/> {course.studyMode}</span></div>
                <Link to={`/courses/${course.code}`} className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-800 hover:text-gold-700">View course <ArrowRight size={15}/></Link>
              </div>)}</div> : <div className="rounded-2xl bg-navy-50 p-8 text-center font-body text-sm text-navy-500">No matching courses in this learning area yet.</div>}
              {program.courses.length > 6 && <Link to="/academy" className="mt-5 inline-flex items-center gap-2 font-body text-sm font-bold text-gold-700">Explore the full academy catalogue <ArrowRight size={15}/></Link>}
            </div>
          </div>
        </article>)}
      </div>
    </section>
  </>;
}
