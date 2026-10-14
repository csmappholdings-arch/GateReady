import React, { useRef } from 'react';

interface DatePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  min?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

/**
 * Robust date input that allows both:
 * 1. Clicking the native "Show date picker" calendar indicator directly (unobscured by overlays)
 * 2. Typing directly into the month/day/year spinbuttons without click hijacking
 */
export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  className = '',
  min,
  required = false,
  id
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        ref={dateInputRef}
        id={id}
        type="date"
        value={value || ''}
        min={min}
        required={required}
        onChange={handleChange}
        className={`w-full text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 rounded-xl focus:outline-hidden focus:border-purple-500 cursor-text [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:p-1.5 [&::-webkit-calendar-picker-indicator]:rounded-md [&::-webkit-calendar-picker-indicator]:transition-opacity [&::-webkit-calendar-picker-indicator]:opacity-75 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 ${className}`}
      />
    </div>
  );
};
