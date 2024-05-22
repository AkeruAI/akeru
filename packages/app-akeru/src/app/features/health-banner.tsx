interface HealthData {
  name: string,
  description: string,
  timestamp: number,
}

export default async function HealthBanner() {
  const healthCheck = await fetch('https://akeru-server.onrender.com', { cache: 'no-store' });
  const healthData: HealthData = await healthCheck.json();

  return (
    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 truncate my-2 max-w-96">{healthData.name}</span>
  )
}
