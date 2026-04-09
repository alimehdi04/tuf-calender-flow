"use client";

import { useEffect, useState } from "react";
import { format, isSameMonth, isToday, isBefore, isAfter, isSameDay, addMonths, subMonths, addDays, subDays } from "date-fns";
import { getCalendarDays } from "@/utils/dateUtils";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarGrid({ 
  viewingMonth, 
  setViewingMonth,
  themeColor,
  selectionRange,
  setSelectionRange,
  isDragging,
  setIsDragging,
  notes
}) {
  const days = getCalendarDays(viewingMonth);
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // --- NAVIGATION LOGIC ---
  const [direction, setDirection] = useState(0);

  const handlePrevMonth = () => {
    setDirection(-1);
    setViewingMonth((prev) => subMonths(prev, 1));
  };
  const handleNextMonth = () => {
    setDirection(1);
    setViewingMonth((prev) => addMonths(prev, 1));
  };
  const handleToday = () => {
    setDirection(0);
    setViewingMonth(new Date());
  };

  // --- KEYBOARD ACCESSIBILITY (PageUp/PageDown) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;

      if (e.key === "PageUp") {
        e.preventDefault();
        handlePrevMonth();
      } else if (e.key === "PageDown") {
        e.preventDefault();
        handleNextMonth();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- DRAG TO SELECT LOGIC ---
  const handleMouseDown = (day) => {
    setIsDragging(true);
    setSelectionRange({ start: day, end: day });
  };

  // const handleMouseEnter = (day) => {
  //   if (isDragging && selectionRange.start) {
  //     setSelectionRange({ ...selectionRange, end: day });
  //   }
  // };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (selectionRange.start && selectionRange.end) {
      if (isAfter(selectionRange.start, selectionRange.end)) {
        setSelectionRange({ start: selectionRange.end, end: selectionRange.start });
      }
    }
  };

  const handleDayKeyDown = (e, day) => {
    let targetDate = null;

    if (e.key === "ArrowRight") targetDate = addDays(day, 1);
    if (e.key === "ArrowLeft") targetDate = subDays(day, 1);
    if (e.key === "ArrowDown") targetDate = addDays(day, 7);
    if (e.key === "ArrowUp") targetDate = subDays(day, 7);
    
    if (e.key === "Enter") {
      e.preventDefault();
      setSelectionRange({ start: day, end: day });
      return;
    }

    if (targetDate) {
      e.preventDefault();
      const targetId = `date-${format(targetDate, "yyyy-MM-dd")}`;
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.focus();
      } else {
        if (isBefore(targetDate, viewingMonth)) handlePrevMonth();
        if (isAfter(targetDate, viewingMonth)) handleNextMonth();
      }
    }
  };

  const isDateInRange = (day) => {
    if (!selectionRange.start || !selectionRange.end) return false;
    const { start, end } = selectionRange;
    const actualStart = isBefore(start, end) ? start : end;
    const actualEnd = isAfter(end, start) ? end : start;
    return (isAfter(day, actualStart) && isBefore(day, actualEnd)) || isSameDay(day, actualStart) || isSameDay(day, actualEnd);
  };

  const handleInteractionStart = (day) => {
    // 1. If clicking a light-grey date, do nothing
    if (!isSameMonth(day, viewingMonth)) return; 

    // 2. Click-to-select logic: If a single day is already selected, use this click as the end date
    if (selectionRange.start && isSameDay(selectionRange.start, selectionRange.end) && !isSameDay(day, selectionRange.start)) {
      setSelectionRange((prev) => {
        const start = isBefore(day, prev.start) ? day : prev.start;
        const end = isAfter(day, prev.start) ? day : prev.start;
        return { start, end };
      });
      setIsDragging(false);
    } else {
      // 3. Start a new selection (Drag or Click 1)
      setIsDragging(true);
      setSelectionRange({ start: day, end: day });
    }
  };

  const handleMouseEnter = (day) => {
    if (isDragging && selectionRange.start && isSameMonth(day, viewingMonth)) {
      setSelectionRange({ ...selectionRange, end: day });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.dataset.date) {
      const hoveredDate = new Date(element.dataset.date);
      if (isSameMonth(hoveredDate, viewingMonth)) {
        setSelectionRange({ ...selectionRange, end: hoveredDate });
      }
    }
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
    if (selectionRange.start && selectionRange.end) {
      if (isAfter(selectionRange.start, selectionRange.end)) {
        setSelectionRange({ start: selectionRange.end, end: selectionRange.start });
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full" onMouseLeave={handleMouseUp}>
      
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleToday}
          className="flex items-center px-3 py-1.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          style={{ color: themeColor }}
        >
          <CalendarDays className="w-4 h-4 mr-2" />
          Today
        </button>

        {/* NEW: Dropdowns */}
        <div className="flex space-x-2 bg-gray-50 rounded-md p-1 border border-gray-100">
          <select 
            value={viewingMonth.getMonth()} 
            onChange={(e) => setViewingMonth(new Date(viewingMonth.getFullYear(), parseInt(e.target.value), 1))}
            className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer text-sm sm:text-base"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>{format(new Date(2020, i, 1), "MMM")}</option>
            ))}
          </select>
          <select 
            value={viewingMonth.getFullYear()} 
            onChange={(e) => setViewingMonth(new Date(parseInt(e.target.value), viewingMonth.getMonth(), 1))}
            className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer text-sm sm:text-base"
          >
            {/* Generate 10 years into the past and future */}
            {Array.from({ length: 21 }).map((_, i) => {
              const year = new Date().getFullYear() - 10 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day, idx) => (
          <div 
            key={day} 
            className={`text-center text-xs sm:text-sm font-bold ${idx >= 5 ? "text-blue-400" : "text-gray-700"}`}
            style={idx >= 5 ? { color: themeColor } : {}}
          >
            {day}
          </div>
        ))}
      </div>

      {/* NEW: Wrapped in Framer Motion for Page Flip Animation */}
      <div className="flex-grow relative flex flex-col" style={{ perspective: "1200px" }}>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={viewingMonth.toString()}
            custom={direction}
            // 3D Flip Variants
            initial={(d) => ({ opacity: 0, rotateX: d > 0 ? -90 : 90, originY: d > 0 ? 1 : 0 })}
            animate={{ opacity: 1, rotateX: 0, originY: direction > 0 ? 1 : 0 }}
            exit={(d) => ({ opacity: 0, rotateX: d > 0 ? 90 : -90, originY: d > 0 ? 0 : 1 })}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="grid grid-cols-7 gap-1 flex-grow auto-rows-fr w-full h-full"
            onTouchMove={handleTouchMove} // Attach touch move tracker here
          >
            {days.map((day) => {
              const isCurrentMonth = isSameMonth(day, viewingMonth);
              const isCurrentToday = isToday(day);
              const inRange = isDateInRange(day);
              const isStart = selectionRange.start && isSameDay(day, selectionRange.start);
              const isEnd = selectionRange.end && isSameDay(day, selectionRange.end);
              
              const dateKey = format(day, "yyyy-MM-dd");
              const hasNote = notes && notes[dateKey] && notes[dateKey].trim().length > 0;

              return (
                <button
                  id={`date-${format(day, "yyyy-MM-dd")}`}
                  data-date={day.toISOString()} // CRITICAL for touch tracking
                  key={day.toString()}
                  
                  // Desktop Mouse Events
                  onMouseDown={() => handleInteractionStart(day)}
                  onMouseEnter={() => handleMouseEnter(day)}
                  onMouseUp={handleInteractionEnd}
                  
                  // Mobile Touch Events
                  onTouchStart={() => handleInteractionStart(day)}
                  onTouchEnd={handleInteractionEnd}
                  
                  onKeyDown={(e) => handleDayKeyDown(e, day)}
                  disabled={!isCurrentMonth} // Disables interaction on light grey dates
                  
                  className={`
                    relative flex flex-col items-center justify-center rounded-full sm:rounded-md
                    text-sm sm:text-base font-medium transition-all select-none
                    /* Visual distinction for disabled state */
                    ${!isCurrentMonth ? "text-gray-300 opacity-40 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 cursor-pointer"}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-20
                  `}
                  style={{ '--tw-ring-color': themeColor }}
                >
                  <span className={`z-10 ${isStart || isEnd ? "text-white" : ""}`}>
                    {format(day, "d")}
                  </span>

                  {hasNote && (
                    <div 
                      className={`absolute bottom-1 w-1.5 h-1.5 rounded-full z-10 ${isStart || isEnd ? "bg-white" : ""}`}
                      style={!isStart && !isEnd ? { backgroundColor: themeColor } : {}}
                    />
                  )}

                  {(isStart || isEnd) && (
                    <div 
                      className="absolute inset-1 rounded sm:inset-2"
                      style={{ backgroundColor: themeColor }}
                    />
                  )}

                  {inRange && !isStart && !isEnd && (
                    <div 
                      className="absolute inset-1 rounded sm:inset-2 opacity-20"
                      style={{ backgroundColor: themeColor }}
                    />
                  )}

                  {isCurrentToday && !inRange && (
                    <div 
                      className="absolute inset-1 rounded sm:inset-2 border-2" 
                      style={{ borderColor: themeColor }} 
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}