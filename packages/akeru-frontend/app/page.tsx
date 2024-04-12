import HeroSection from "./components/section/hero-section/hero-section";
import HomeCard from "./components/ui/home-card/home-card";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="flex items-center justify-center mt-[150px] lg:mt-[80px] ">
        <HeroSection />
      </div>

      <div className="flex w-[70%] gap-[50px] mx-auto pt-[200px] lg:pt-[50px] ] lg:w-[90%] sm:flex-col sm:gap-[15px] ">
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
