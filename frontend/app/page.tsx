import Timeline from '../components/Timeline';

export default function HomePage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-gray-50 dark:bg-black text-sm">
      <div className="max-w-md mx-auto px-4 py-6">
        <Timeline />
      </div>
    </main>
  );
}
