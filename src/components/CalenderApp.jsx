"use client";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { format } from "date-fns";
import HeroPanel from "./HeroPanel";
import CalendarGrid from "./CalendarGrid";
import NotesSidebar from "./NotesSidebar";

export default function CalendarApp() {
  const [themeColor, setThemeColor] = useState("#0ea5e9");
  const [viewingMonth, setViewingMonth] = useState(new Date());
  const [selectionRange, setSelectionRange] = useState({ start: null, end: null });
  const [isDragging, setIsDragging] = useState(false);

  // Start with empty notes (matches server render), populate after mount
  const [notes, setNotes] = useState({});

  // mounted flag — false on server, true after first client render
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load notes from localStorage after hydration is complete
    try {
      const savedNotes = localStorage.getItem("calendar_notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch {
      // ignore parse errors
    }

    setMounted(true);
  }, []);

  // Show today's reminder toast once notes are loaded
  useEffect(() => {
    if (!mounted) return;

    const todayKey = format(new Date(), "yyyy-MM-dd");
    if (notes[todayKey]?.trim()) {
      const timer = setTimeout(() => {
        toast(`Reminder for today:\n${notes[todayKey]}`, {
          icon: "🗓️",
          duration: 6000,
          style: { border: `1px solid ${themeColor}` },
        });
      }, 800);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Save notes to state and localStorage simultaneously
  const updateNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem("calendar_notes", JSON.stringify(newNotes));
  };

  return (
    <div className="flex flex-col relative" onMouseUp={() => setIsDragging(false)}>
      <Toaster position="top-right" />

      {/* Hero Section */}
      <div className="h-64 sm:h-80 md:h-96 w-full bg-slate-300 relative">
        <HeroPanel
          viewingMonth={viewingMonth}
          setThemeColor={setThemeColor}
          themeColor={themeColor}
        />
      </div>

      <div className="flex flex-col md:flex-row w-full bg-white">
        {/* Left Side: Notes Sidebar */}
        <div className="w-full md:w-1/3 border-r border-gray-100 p-6 flex flex-col">
          <NotesSidebar 
            selectionRange={selectionRange} 
            setSelectionRange={setSelectionRange} // <-- NEW: Pass this prop
            notes={notes} 
            updateNotes={updateNotes} 
            themeColor={themeColor} 
          />
        </div>

        {/* Right Side: Grid */}
        <div className="w-full md:w-2/3 p-6">
          <CalendarGrid
            viewingMonth={viewingMonth}
            setViewingMonth={setViewingMonth}
            themeColor={themeColor}
            selectionRange={selectionRange}
            setSelectionRange={setSelectionRange}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            // Pass empty notes until mounted to keep server/client HTML in sync
            notes={mounted ? notes : {}}
          />
        </div>
      </div>
    </div>
  );
}