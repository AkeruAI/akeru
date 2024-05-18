import { Suspense } from "react";
import HealthBanner from "./components/health-banner";

export default async function Home() {
  const healthData = await fetch('https://akeru-server.onrender.com');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Welcome to Akeru! 
      <Suspense fallback={<div>Performing Health Check!</div>}>
        <HealthBanner />
      </Suspense>
    </main>
  );
}
