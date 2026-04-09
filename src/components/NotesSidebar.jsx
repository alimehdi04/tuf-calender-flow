"use client";

import { format } from "date-fns";
import * as ics from "ics";
import { Download, X } from "lucide-react"; // NEW: Import X icon
import toast from "react-hot-toast";

export default function NotesSidebar({ 
  selectionRange, 
  setSelectionRange, // NEW: Destructure the prop
  notes, 
  updateNotes, 
  themeColor 
}) {
  const activeDate = selectionRange.start;
  const noteKey = activeDate ? format(activeDate, "yyyy-MM-dd") : "global";
  const currentNote = notes[noteKey] || "";

  const handleNoteChange = (e) => {
    updateNotes({
      ...notes,
      [noteKey]: e.target.value,
    });
  };

  // NEW: Function to clear selection and go back to month view
  const handleClearSelection = () => {
    setSelectionRange({ start: null, end: null });
  };

  const handleExportICS = () => {
    if (!activeDate || !currentNote.trim()) {
      toast.error("Please select a date and write a note first.");
      return;
    }

    const event = {
      start: [
        activeDate.getFullYear(),
        activeDate.getMonth() + 1, 
        activeDate.getDate(),
        9, 0 
      ],
      duration: { hours: 1, minutes: 0 },
      title: "Calendar Reminder",
      description: currentNote,
    };

    ics.createEvent(event, (error, value) => {
      if (error) {
        console.error(error);
        toast.error("Failed to create reminder file.");
        return;
      }
      
      const blob = new Blob([value], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reminder_${noteKey}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Reminder downloaded!");
    });
  };

  return (
    <div className="flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          {/* NEW: Added a flex container and the clear button next to the title */}
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              {activeDate ? "Date Notes" : "General Notes"}
            </h3>
            
            {/* The actual button that appears only when a date is selected */}
            {activeDate && (
              <button 
                onClick={handleClearSelection}
                className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
                title="Back to Monthly Notes"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mt-1" style={{ color: themeColor }}>
            {activeDate ? format(activeDate, "MMMM do, yyyy") : "Monthly Memos"}
          </h2>
        </div>
        
        {activeDate && (
          <button 
            onClick={handleExportICS}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            title="Export to Apple/Google Calendar"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>

      <textarea
        className="flex-grow w-full resize-none text-gray-950 outline-none p-2 leading-8 bg-transparent"
        style={{
          backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)",
          backgroundAttachment: "local"
        }}
        placeholder={activeDate ? "Add a note for this day..." : "Jot down general notes..."}
        value={currentNote}
        onChange={handleNoteChange}
      />
    </div>
  );
}