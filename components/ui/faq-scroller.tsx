import React from 'react';

/**
 * FaqCard
 * Reusable card for a single FAQ item.
 */
export const FaqCard = ({ question, answer }: { question: string, answer: string }) => {
  return (
    <div className="flex flex-col items-start gap-4 p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl shadow-2xl w-96 flex-shrink-0 faq-card hover:bg-white/10 transition-colors duration-300">
      <h3 className="text-xl font-bold text-white faq-title">{question}</h3>
      <p className="text-sm sm:text-base text-white/60 faq-answer leading-relaxed">{answer}</p>
    </div>
  );
};

/**
 * HorizontalScroller
 * Wraps children and creates a seamless horizontal looping animation.
 */
export const HorizontalScroller = ({ children, speed = '40s', direction = 'left' }: { children: React.ReactNode, speed?: string, direction?: 'left' | 'right' }) => {
  const animationClass =
    direction === 'right' ? 'animate-scroll-horizontal-reverse' : 'animate-scroll-horizontal';

  // Inline style to set the CSS custom property for scroll duration.
  const style = { '--scroll-duration': speed } as React.CSSProperties;

  return (
    <div className="w-full overflow-hidden group relative scroller-mask" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div className={`flex ${animationClass}`} style={style}>
        <div className="flex items-stretch justify-center flex-shrink-0 gap-8 px-4">
          {children}
        </div>
        {/* duplicate for seamless loop */}
        <div className="flex items-stretch justify-center flex-shrink-0 gap-8 px-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * FaqSection
 * Assembles title, subtitle, and multiple horizontal rows.
 */
export const FaqSection = ({ data }: { data: any }) => {
  return (
    <div className="relative flex flex-col items-center gap-12 py-20 w-full overflow-hidden">
      <div className="flex flex-col items-center gap-4 text-center z-10 max-w-2xl px-4">
        <h2
          className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight"
          style={{ opacity: 0, animation: 'fadeInUp 0.7s ease-out 0.2s forwards' }}
        >
          {data.mainTitle}
        </h2>
        <p
          className="text-sm md:text-lg text-white/60"
          style={{ opacity: 0, animation: 'fadeInUp 0.7s ease-out 0.4s forwards' }}
        >
          {data.mainSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-8 z-10 w-full mt-10">
        {data.rows.map((row: any) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item: any) => (
              <FaqCard key={item.id} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>
    </div>
  );
};
