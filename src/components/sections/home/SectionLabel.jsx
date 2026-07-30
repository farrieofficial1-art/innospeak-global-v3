/**
 * SectionLabel — Premium Eyebrow Label
 *
 * Elegant gold pill with subtle glow and luxury styling.
 */

export default function SectionLabel({
  children,
  className = '',
}) {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-4
        ${className}
      `}
    >
      {/* Left Accent */}

      <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-[#C89B3C] to-transparent" />

      {/* Premium Badge */}

      <span
  className="
    inline-flex
    items-center
    rounded-full
    border
    border-[#E9D9B8]
    bg-[#FBF6EC]
    px-6
    py-2.5
    text-xs
    font-bold
    uppercase
    tracking-[0.30em]
    text-[#8B6A2F]
    shadow-sm
  "
>
  {children}
</span>

      {/* Right Accent */}

      <div className="h-[2px] w-10 rounded-full bg-gradient-to-l from-[#C89B3C] to-transparent" />
    </div>
  );
}