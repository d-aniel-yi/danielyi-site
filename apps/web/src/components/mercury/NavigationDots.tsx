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
            className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
            data-animate
            data-delay="800"
        >
            {Array.from({ length: totalSections }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => onNavigate(index)}
                    className="w-3 h-3 rounded-full transition-all"
                    style={{
                        backgroundColor: currentSection === index ? 'var(--mercury-accent)' : 'var(--mercury-border)',
                        transform: currentSection === index ? 'scale(1.25)' : 'scale(1)',
                    }}
                    aria-label={`Go to section ${index + 1}`}
                />
            ))}
        </div>
    );
}
