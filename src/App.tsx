import StarfieldBackground from "./components/StarfieldBackground";
import ClothEffect from "./effects/ClothEffect";
import ClickInkEffect from "./effects/ClickInkEffect";
import HeroSection from "./sections/HeroSection";
import MarqueeSection from "./sections/MarqueeSection";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";

function App() {
  return (
    <div
      className="relative min-h-screen w-full bg-[#0C0C0C]"
      style={{ overflowX: "clip", filter: "url(#cloth-filter)" }}
    >
      <ClothEffect />
      <StarfieldBackground />
      <div className="relative z-10">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ProjectsSection />
      </div>
      <ClickInkEffect />
    </div>
  );
}

export default App;
