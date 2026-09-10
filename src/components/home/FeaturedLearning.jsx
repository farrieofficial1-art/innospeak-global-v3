import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import { getFeaturedCourses } from '../../lib/data/programmeData.js';
import { getCourseGovernance } from '../../lib/data/catalogPolicy.js';

export default function FeaturedLearning() {
  const courses = getFeaturedCourses().filter((c) => getCourseGovernance(c).status === 'Active').slice(0, 6);
  return (
    <section className="py-20 sm:py-24">
      <div className="container-premium">
        <SectionHeading eyebrow="Featured learning" title="Start with a course that moves you forward" subtitle="Explore selected courses from the current catalogue, then build practical evidence through Labs and your learner portfolio." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <article key={course.code} className="group rounded-3xl border border-navy-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
              <div className="flex items-center justify-between"><span className="rounded-full bg-gold-500/10 px-3 py-1 font-body text-[11px] font-bold text-gold-700">{course.level}</span><span className="font-mono text-[11px] text-navy-400">{course.code}</span></div>
              <h3 className="mt-5 font-display text-xl font-bold text-navy-900">{course.name}</h3>
              <p className="mt-2 line-clamp-3 font-body text-sm leading-6 text-navy-500">{course.shortDescription}</p>
              <div className="mt-5 flex gap-4 font-body text-xs text-navy-500"><span className="inline-flex items-center gap-1.5"><Clock3 size={13}/>{course.duration}</span><span className="inline-flex items-center gap-1.5"><BookOpen size={13}/>{course.studyMode}</span></div>
              <Link to={`/courses/${course.code}`} className="mt-6 inline-flex items-center gap-2 font-body text-sm font-bold text-navy-900 group-hover:text-gold-700">Explore course <ArrowRight size={15}/></Link>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/courses" className="btn-gold inline-flex items-center gap-2">Browse the full catalogue <ArrowRight size={17}/></Link></div>
      </div>
    </section>
  );
}
