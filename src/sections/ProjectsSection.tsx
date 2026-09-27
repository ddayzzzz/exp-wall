import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Project {
  index: string;
  name: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    name: "Aurora",
    col1Image1: "/images/projects/p1-1.jpg",
    col1Image2: "/images/projects/p1-2.jpg",
    col2Image: "/images/projects/p1-wide.jpg",
  },
  {
    index: "02",
    name: "Nebula",
    col1Image1: "/images/projects/p2-1.jpg",
    col1Image2: "/images/projects/p2-2.jpg",
    col2Image: "/images/projects/p2-wide.jpg",
  },
  {
    index: "03",
    name: "Solstice",
    col1Image1: "/images/projects/p3-1.jpg",
    col1Image2: "/images/projects/p3-2.jpg",
    col2Image: "/images/projects/p3-wide.jpg",
  },
  {
    index: "04",
    name: "Horizon",
    col1Image1: "/images/projects/p4-1.jpg",
    col1Image2: "/images/projects/p4-2.jpg",
    col2Image: "/images/projects/p4-wide.jpg",
  },
];

const TOTAL_CARDS = PROJECTS.length;

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="projects"
      className="relative z-10 -mt-16 w-full rounded-t-[3rem] bg-[#0C0C0C] pb-24 pt-20 sm:rounded-t-[4rem] sm:pt-28"
    >
      <h2
        className="hero-heading mx-auto mb-16 text-center font-black uppercase"
        style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
      >
        Project
      </h2>

      <div ref={containerRef} className="relative mx-auto h-[85vh] max-w-6xl px-4 sm:px-8">
        {PROJECTS.map((project, index) => (
          <StackedCard
            key={project.index}
            project={project}
            index={index}
            totalCards={TOTAL_CARDS}
          />
        ))}
      </div>
    </section>
  );
}

function StackedCard({
  project,
  index,
  totalCards,
}: {
  project: Project;
  index: number;
  totalCards: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={cardRef}
      className="sticky top-24 md:top-32"
      style={{ top: `calc(6rem + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale }}
        className="mx-auto w-full rounded-[2rem] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-6 sm:rounded-[2.5rem] sm:p-8 md:p-10"
      >
        {/* 頂部行:序號 + 項目名 */}
        <div className="mb-6 flex items-baseline justify-between sm:mb-8">
          <span className="hero-heading font-black" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {project.index}
          </span>
          <span className="text-xl font-semibold uppercase text-[#D7E2EA] sm:text-2xl md:text-3xl">
            {project.name}
          </span>
        </div>

        {/* 底部雙欄圖片網格 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-4">
          <div className="flex flex-col gap-3 sm:col-span-2">
            <img
              src={project.col1Image1}
              alt={`${project.name} image 1`}
              loading="lazy"
              className="h-40 w-full rounded-2xl object-cover sm:h-1/2"
            />
            <img
              src={project.col1Image2}
              alt={`${project.name} image 2`}
              loading="lazy"
              className="h-40 w-full rounded-2xl object-cover sm:h-1/2"
            />
          </div>
          <div className="sm:col-span-3">
            <img
              src={project.col2Image}
              alt={`${project.name} wide image`}
              loading="lazy"
              className="h-full max-h-[340px] w-full rounded-2xl object-cover sm:max-h-none"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
