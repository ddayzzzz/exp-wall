import { useEffect, useRef } from "react";

const TOTAL_IMAGES = 21;
const ALL_IMAGES = Array.from(
  { length: TOTAL_IMAGES },
  (_, i) => `/images/marquee/${i + 1}.jpg`
);

// 第1行前11個,第2行後10個
const ROW1_BASE = ALL_IMAGES.slice(0, 11);
const ROW2_BASE = ALL_IMAGES.slice(11, 21);

// 三倍複製實現無縫循環
const ROW1 = [...ROW1_BASE, ...ROW1_BASE, ...ROW1_BASE];
const ROW2 = [...ROW2_BASE, ...ROW2_BASE, ...ROW2_BASE];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const offset =
            (window.scrollY - sectionTop + window.innerHeight) * 0.3;

          if (row1Ref.current) {
            row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
          }
          if (row2Ref.current) {
            row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#0C0C0C] py-16 sm:py-24">
      <div className="flex flex-col gap-3">
        <div
          ref={row1Ref}
          className="flex gap-3"
          style={{ willChange: "transform" }}
        >
          {ROW1.map((src, i) => (
            <img
              key={`row1-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="h-[270px] w-[420px] flex-shrink-0 rounded-2xl object-cover"
            />
          ))}
        </div>
        <div
          ref={row2Ref}
          className="flex gap-3"
          style={{ willChange: "transform" }}
        >
          {ROW2.map((src, i) => (
            <img
              key={`row2-${i}`}
              src={src}
              alt=""
              loading="lazy"
              className="h-[270px] w-[420px] flex-shrink-0 rounded-2xl object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
