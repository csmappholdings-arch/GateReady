import React, { useRef, useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

export function formatFriendlyDate(dStr: string): string {
  if (!dStr) return '';
  const parts = dStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  const d = new Date(dStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dStr;
}

export interface DatePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
  label?: React.ReactNode;
}

/**
 * Click-anywhere Departure Date field that displays friendly date formatting
 * (e.g. "Mon, Dec 15, 2026"), placeholder hint "Select date", visible calendar icon,
 * and reliable calendar popup with Day selection, Today, and Clear actions.
 */
export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select date',
  required = false,
  id,
  label
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

  // Parse current value or default to today
  const parseDate = (dStr: string): Date => {
    if (!dStr) return new Date();
    const parts = dStr.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const initialDate = parseDate(value);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-11

  // Keep view aligned when value changes externally
  useEffect(() => {
    if (value) {
      const d = parseDate(value);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Close calendar popup on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowCustomCalendar(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowCustomCalendar(false);
      }
    };

    if (showCustomCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCustomCalendar]);

  const handleApplyDate = (y: number, m: number, d: number) => {
    const yStr = y.toString().padStart(4, '0');
    const mStr = (m + 1).toString().padStart(2, '0');
    const dStr = d.toString().padStart(2, '0');
    const formatted = `${yStr}-${mStr}-${dStr}`;
    onChange(formatted);
    setShowCustomCalendar(false);
  };

  const handleClearDate = () => {
    onChange('');
    setShowCustomCalendar(false);
  };

  const handleTodayDate = () => {
    const now = new Date();
    handleApplyDate(now.getFullYear(), now.getMonth(), now.getDate());
  };

  // Generate calendar days for viewMonth and viewYear
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleQuickAddDays = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    handleApplyDate(target.getFullYear(), target.getMonth(), target.getDate());
  };

  return (
    <div className="relative w-full flex flex-col" ref={containerRef}>
      {/* Optional Label (clicking label opens picker directly) */}
      {label && (
        <label
          onClick={() => setShowCustomCalendar(true)}
          className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1 cursor-pointer select-none"
        >
          {label}
        </label>
      )}

      {/* Main Field Box - Clicking anywhere opens the calendar */}
      <div
        id={id}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={showCustomCalendar}
        onClick={() => setShowCustomCalendar((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setShowCustomCalendar((prev) => !prev);
          }
        }}
        className={`w-full flex items-center justify-between text-left transition-all cursor-pointer select-none bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 focus:outline-hidden focus:ring-2 focus:ring-purple-500/40 shadow-2xs ${className}`}
      >
        <span
          className={`truncate ${
            value
              ? 'text-slate-900 dark:text-white font-semibold'
              : 'text-slate-400 dark:text-slate-500 font-normal'
          }`}
        >
          {value ? formatFriendlyDate(value) : placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearDate();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Clear date"
              aria-label="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="p-1 rounded-md text-purple-600 dark:text-purple-400">
            <CalendarIcon className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Hidden input for form validation if required */}
      {required && (
        <input
          type="text"
          value={value}
          readOnly
          required={required}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Interactive Click-to-Select Calendar Popup */}
      {showCustomCalendar && (
        <div 
          className="absolute top-full left-0 sm:left-auto mt-2 z-[100050] w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 shadow-2xl p-3.5 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Month/Year Navigation */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-100 dark:border-purple-900/60">
            <span className="text-xs font-black text-purple-900 dark:text-purple-200">
              {monthNames[viewMonth]} {viewYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Previous month"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-600 dark:text-slate-300 cursor-pointer"
                title="Next month"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowCustomCalendar(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
                title="Close calendar"
                aria-label="Close calendar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Date Selectors with Clear and Today */}
          <div className="flex items-center justify-between gap-1 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold">
            <button
              type="button"
              onClick={handleClearDate}
              className="px-2 py-0.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
              title="Clear date"
            >
              Clear
            </button>
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={handleTodayDate}
                className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors cursor-pointer shrink-0 font-black"
                title="Today"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddDays(1)}
                className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors cursor-pointer shrink-0"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddDays(7)}
                className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors cursor-pointer shrink-0"
              >
                +1 Wk
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddDays(14)}
                className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors cursor-pointer shrink-0"
              >
                +2 Wks
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid: Click to Select Date */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty offset days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <span key={`empty-${i}`} className="h-7 w-7" />
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
              const isSelected = value === dateStr;
              const today = new Date();
              const isToday = today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleApplyDate(viewYear, viewMonth, dayNum)}
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400'
                      : isToday
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black'
                      : 'hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                  title={dateStr}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Bottom Clear & Today Quick Action Bar */}
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-purple-100 dark:border-purple-900/60 text-xs font-semibold">
            <button
              type="button"
              onClick={handleClearDate}
              className="text-slate-500 hover:text-rose-600 transition-colors cursor-pointer px-1 py-0.5"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleTodayDate}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline transition-colors cursor-pointer px-1 py-0.5"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
