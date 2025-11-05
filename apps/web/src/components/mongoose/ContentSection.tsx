"use client";

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  content: string;
  isEven: boolean;
}

export function ContentSection({
  title,
  subtitle,
  content,
  isEven,
}: ContentSectionProps) {
  return (
    <section 
      className="scroll-section min-h-screen flex items-center py-20 relative z-10"
      style={{ backgroundColor: isEven ? 'var(--op-white)' : '#f9f9f9' }}
    >
      <div className="max-w-6xl mx-auto px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Title & Subtitle */}
          <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
            <h2 
              className="display-serif text-4xl md:text-5xl font-bold mb-3"
              data-animate
              data-delay="100"
              style={{ color: 'var(--op-black)' }}
            >
              {title}
            </h2>
            
            {subtitle && (
              <p 
                className="text-xl mb-8"
                data-animate
                data-delay="200"
                style={{ color: 'var(--op-gray)' }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div className={`space-y-6 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
            <div 
              className="rounded-xl p-6 shadow-sm target-card"
              data-animate
              data-delay="300"
              style={{ backgroundColor: 'var(--op-white)', borderWidth: '1px', borderColor: 'var(--op-gray)' }}
            >
              <p className="leading-relaxed text-sm whitespace-pre-line" style={{ color: 'var(--op-dark-gray)' }}>{content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
