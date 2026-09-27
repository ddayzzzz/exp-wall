import FadeIn from "../components/FadeIn";
import ContactButton from "../components/ContactButton";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ overflowX: "clip" }}>
      {/* 導航列 */}
      <FadeIn delay={0} className="relative z-20">
        <nav className="flex items-center justify-end gap-8 px-6 pt-8 sm:px-10 md:px-14">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs sm:text-sm uppercase tracking-wider text-[#D7E2EA]
                transition-opacity duration-200 hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* 大標題 */}
      <div className="relative z-10 mt-6 overflow-hidden px-4 sm:px-6 md:px-10">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase text-center leading-[0.95]
              text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
          >
            英雄之家
          </h1>
        </FadeIn>
      </div>

      {/* 人像 */}
      <FadeIn delay={0.6} y={30} className="absolute inset-x-0 bottom-0 top-32 z-0 flex items-end justify-center">
        <img
          src="/images/hero/portrait.jpg"
          alt="Hero portrait"
          className="h-full max-h-[70vh] w-auto object-cover object-top opacity-90"
          loading="eager"
        />
      </FadeIn>

      {/* 底部左右布局 */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex items-end justify-between px-6 sm:px-10 md:px-14">
        <FadeIn delay={0.35} y={20}>
          <p className="max-w-[220px] text-xs font-light uppercase leading-relaxed text-[#D7E2EA] sm:max-w-[280px] sm:text-sm">
            打造有記憶的品牌敘事,用光影與動態講述每一個英雄的故事。
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton id="contact" />
        </FadeIn>
      </div>
    </section>
  );
}
