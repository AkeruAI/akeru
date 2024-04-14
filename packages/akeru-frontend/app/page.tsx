import HeroSection from "./components/section/hero-section/hero-section";
import HomeCard from "./components/ui/home-card/home-card";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="flex items-center justify-center mt-40 lg:mt-20 ">
        <HeroSection />
      </div>

      <div className="flex w-9/12 gap-12 mx-auto pt-52 lg:pt-12 lg:w-11/12 sm:flex-col sm:gap-3.5 ">
        <HomeCard
          title="Fast and secure"
          description="Lorem ipsum dolor sit amet consectetur. Ac commodo proin montes mattis."
        />
        <HomeCard
          title="Fast and secure"
          description="Lorem ipsum dolor sit amet consectetur. Ac commodo proin montes mattis."
        />
        <HomeCard
          title="Fast and secure"
          description="Lorem ipsum dolor sit amet consectetur. Ac commodo proin montes mattis."
        />
      </div>
    </main>
  );
}
