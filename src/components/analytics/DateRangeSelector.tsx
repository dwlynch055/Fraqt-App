import React from 'react';
import { Icons } from '../icons';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
  comparisonRange?: { start: Date; end: Date };
}

export function DateRangeSelector({ startDate, endDate, onDateChange, comparisonRange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedRange, setSelectedRange] = React.useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = React.useState(startDate);
  const [tempEnd, setTempEnd] = React.useState(endDate);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDateClick = (date: Date) => {
    if (selectedRange === 'start') {
      setTempStart(date);
      setSelectedRange('end');
    } else {
      setTempEnd(date);
      onDateChange(tempStart, date);
      setIsOpen(false);
    }
  };

  const handlePresetChange = (preset: string) => {
    const now = new Date();
    let start = startDate;
    let end = endDate;

    switch (preset) {
      case 'today':
        start = now;
        end = now;
        break;
      case 'yesterday':
        start = subDays(now, 1);
        end = subDays(now, 1);
        break;
      case '7d':
        start = subDays(now, 7);
        end = now;
        break;
      case '30d':
        start = subDays(now, 30);
        end = now;
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'last_month':
        start = startOfMonth(subDays(now, 30));
        end = endOfMonth(subDays(now, 30));
        break;
    }

    onDateChange(start, end);
  };

  const presetRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'This month', value: 'month' },
    { label: 'Last month', value: 'last_month' }
  ];

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-black border border-gray-800 rounded-lg p-4 mb-6 relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800"
          >
            <Icons.Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-white">
              {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
            </span>
            <Icons.ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          
          <div className="flex items-center gap-2">
            {presetRanges.map(range => (
              <button
                key={range.value}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => handlePresetChange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 p-4 bg-black border border-gray-800 rounded-lg shadow-xl z-50 w-[720px]"
        >
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-800 rounded-lg">
                <Icons.ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg">
                <Icons.ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                <div key={day} className="text-center text-sm text-gray-400 py-2">
                  {day}
                </div>
              ))}
              
              {days.map(day => {
                const isSelected = isSameDay(day, tempStart) || isSameDay(day, tempEnd);
                const isInRange = day >= tempStart && day <= tempEnd;
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={`
                      p-2 text-sm rounded-lg text-center transition-colors
                      ${isToday(day) ? 'bg-blue-500/20 text-blue-400' : ''}
                      ${isSelected ? 'bg-blue-500 text-white' : ''}
                      ${isInRange && !isSelected ? 'bg-blue-500/20 text-white' : ''}
                      ${!isSameMonth(day, currentMonth) ? 'text-gray-600' : 'text-gray-300'}
                      hover:bg-gray-800
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-800">
              <button 
                onClick={() => setIsOpen(false)} 
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  onDateChange(tempStart, tempEnd);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {comparisonRange && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Comparing to:</span>
            <span className="text-white">
              {format(comparisonRange.start, 'MMM d, yyyy')} - {format(comparisonRange.end, 'MMM d, yyyy')}
            </span>
            <button className="p-1 text-gray-400 hover:text-white">
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}