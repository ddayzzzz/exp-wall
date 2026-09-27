import FadeIn from "../components/FadeIn";
import AnimatedText from "../components/AnimatedText";
import ContactButton from "../components/ContactButton";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-[#0C0C0C] px-6 py-24 sm:gap-12"
    >
      <FadeIn>
        <h2
          className="hero-heading text-center font-black uppercase"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          About me
        </h2>
      </FadeIn>

      <AnimatedText
        text="這裡放你的自我介紹啊喂"
        className="mx-auto max-w-[560px] text-center text-base font-light leading-relaxed text-[#D7E2EA] sm:text-lg"
      />

      <FadeIn delay={0.1} y={20}>
        <ContactButton />
      </FadeIn>
    </section>
  );
}
