import HeroSection      from "@/components/hero/HeroSection";
import ImpactSection    from "@/components/sections/ImpactSection";
import ProjectsSection  from "@/components/sections/ProjectsSection";
import OriginSection    from "@/components/sections/OriginSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection    from "@/components/sections/SkillsSection";
import GitHubSection    from "@/components/sections/GitHubSection";
import GlobeSection     from "@/components/sections/GlobeSection";
import EducationSection from "@/components/sections/EducationSection";
import TimelineSection  from "@/components/sections/TimelineSection";
import ContactSection   from "@/components/sections/ContactSection";

export default function Page() {
  return (
    <main className="relative">
      <HeroSection />
      <ImpactSection />
      <ProjectsSection />
      <OriginSection />
      <ExperienceSection />
      <SkillsSection />
      <GitHubSection />
      <GlobeSection />
      <EducationSection />
      <TimelineSection />
      <ContactSection />
    </main>
  );
}
