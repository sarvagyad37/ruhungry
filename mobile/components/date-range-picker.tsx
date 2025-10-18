import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-context';
import { useState } from 'react';
import { CalendarModal } from './calendar-modal';

interface DateRangePickerProps {
  onDateRangeSelect?: (startDate: Date, endDate: Date) => void;
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
}

export function DateRangePicker({ onDateRangeSelect, selectedRange: externalSelectedRange, onRangeChange }: DateRangePickerProps) {
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [internalSelectedRange, setInternalSelectedRange] = useState<string>('All');
  
  // Use external selectedRange if provided, otherwise use internal state
  const selectedRange = externalSelectedRange !== undefined ? externalSelectedRange : internalSelectedRange;

  const handleRangeSelect = (range: string, startDate?: Date, endDate?: Date) => {
    // Update internal state if no external control
    if (externalSelectedRange === undefined) {
      setInternalSelectedRange(range);
    }
    // Notify parent of range change
    if (onRangeChange) {
      onRangeChange(range);
    }
    setIsOpen(false);
    
    if (onDateRangeSelect && startDate && endDate) {
      onDateRangeSelect(startDate, endDate);
    } else if ((range === 'All' || range === 'Custom') && onDateRangeSelect) {
      // For "All" and "Custom", we don't apply date filtering (shows all events)
      // We can pass undefined or a special marker to indicate no date filtering
      onDateRangeSelect(new Date(0), new Date(0)); // Special marker for no filtering
    }
  };

  const getDateRangeOptions = () => {
    const now = new Date();
    
    // Today: start of day to end of day
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    // Tomorrow: start of tomorrow to end of tomorrow
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(tomorrowStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    
    // This Week: today to end of week (Sunday)
    const thisWeekStart = todayStart;
    const thisWeekEnd = new Date(todayStart);
    thisWeekEnd.setDate(todayStart.getDate() + (7 - todayStart.getDay())); // End of current week
    thisWeekEnd.setHours(23, 59, 59, 999); // End of day

    return [
      {
        label: 'All',
        value: 'all',
        onPress: () => handleRangeSelect('All')
      },
      {
        label: 'Today',
        value: 'today',
        onPress: () => handleRangeSelect('Today', todayStart, todayEnd)
      },
      {
        label: 'Tomorrow',
        value: 'tomorrow',
        onPress: () => handleRangeSelect('Tomorrow', tomorrowStart, tomorrowEnd)
      },
      {
        label: 'This Week',
        value: 'week',
        onPress: () => handleRangeSelect('This Week', thisWeekStart, thisWeekEnd)
      },
      {
        label: 'Custom',
        value: 'custom',
        onPress: () => {
          if (externalSelectedRange === undefined) {
            setInternalSelectedRange('Custom');
          }
          if (onRangeChange) {
            onRangeChange('Custom');
          }
          setIsOpen(false);
          setIsCalendarOpen(true);
        }
      }
    ];
  };

  return (
    <Box className="relative">
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center px-3 py-2 rounded-lg border"
        style={{
          backgroundColor: currentTheme.background.white,
          borderColor: currentTheme.border.light,
        }}
      >
        <Icon 
          as={Calendar} 
          className="mr-2" 
          style={{ color: currentTheme.text.secondary }}
        />
        <Text 
          className="text-sm font-medium mr-1"
          style={{ color: currentTheme.text.primary }}
        >
          {selectedRange}
        </Text>
        <Icon 
          as={ChevronDown} 
          style={{ 
            color: currentTheme.text.secondary,
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }]
          }}
        />
      </Pressable>

      {isOpen && (
        <Box 
          className="absolute top-full right-0 mt-1 rounded-lg border shadow-lg z-50"
          style={{
            backgroundColor: currentTheme.background.white,
            borderColor: currentTheme.border.light,
            minWidth: 160,
          }}
        >
          {getDateRangeOptions().map((option) => (
            <Pressable
              key={option.value}
              onPress={option.onPress}
              className="px-4 py-3 border-b"
              style={{
                borderBottomColor: currentTheme.border.light,
              }}
            >
              <Text 
                className="text-sm"
                style={{ 
                  color: selectedRange === option.label 
                    ? currentTheme.primary[600] 
                    : currentTheme.text.primary 
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </Box>
      )}

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={(startDate, endDate) => {
          if (onDateRangeSelect) {
            onDateRangeSelect(startDate, endDate);
          }
        }}
      />
    </Box>
  );
}
