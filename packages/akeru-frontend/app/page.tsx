import { Metadata } from "next";
import HomeCard from "./components/ui/home-card/home-card";
import HeroSection from "./components/sections/hero-section";
import FormSection from "./components/sections/form-section";
import { homeCardData } from "./utils/data";

export const metadata = {
  title: "AkeruAI - HOME",
  description: "The best API to setup your AI Project",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      <FormSection />

      <section className="flex flex-col mt-10 md:mt-36 w-full gap-4 md:flex-row md:gap-10 mx-auto">
        {homeCardData.map((card) => (
          <HomeCard key={card.description} title={card.title} description={card.description} />
        ))}
      </section>
    </main>
  );
}
