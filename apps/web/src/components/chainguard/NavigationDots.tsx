"use client";

interface NavigationDotsProps {
  totalSections: number;
  currentSection: number;
  onNavigate: (index: number) => void;
}

export function NavigationDots({ totalSections, currentSection, onNavigate }: NavigationDotsProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className="transition-all duration-300"
            aria-label={`Navigate to section ${index + 1}`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSection ? 'scale-125' : 'scale-100'
              }`}
              style={{
                backgroundColor: index === currentSection ? 'var(--cg-primary)' : 'var(--cg-gray)',
                opacity: index === currentSection ? 1 : 0.5,
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

