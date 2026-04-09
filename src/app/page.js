// src/app/page.js
import CalendarApp from "@/components/CalenderApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8">
      {/* This wrapper centers the calendar on the page and limits its maximum width.
        We add a nice shadow to emulate a physical object. 
      */}
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden">
        <CalendarApp />
      </div>
    </main>
  );
}