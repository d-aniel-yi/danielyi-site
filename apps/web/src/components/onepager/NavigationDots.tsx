"use client";

interface NavigationDotsProps {
  totalSections: number;
  currentSection: number;
  onNavigate: (index: number) => void;
}

export function NavigationDots({
  totalSections,
  currentSection,
  onNavigate,
}: NavigationDotsProps) {
  return (
    <div 
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 enable-trig"
      data-trig="fadeIn slideLeft"
      data-trig-duration="600ms"
      data-trig-delay="800ms"
    >
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => onNavigate(index)}
          className={`w-3 h-3 rounded-full transition-all ${
            currentSection === index
              ? 'bg-slate-900 scale-125'
              : 'bg-slate-300 hover:bg-slate-400'
          }`}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
}

