import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Search } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-context';
import { useState, useEffect } from 'react';
import { DateRangePicker } from './date-range-picker';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onDateRangeSelect?: (startDate: Date, endDate: Date) => void;
  selectedRange?: string;
  onRangeChange?: (range: string) => void;
  debounceMs?: number;
}

export function SearchBar({ 
  placeholder = "Search events...", 
  onSearch,
  onDateRangeSelect,
  selectedRange,
  onRangeChange,
  debounceMs = 200 
}: SearchBarProps) {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, debounceMs]);
  
  return (
    <Box 
      className="p-4"
      style={{ backgroundColor: currentTheme.background.primary }}
    >
      <HStack space="md" className="items-center">
        <Input variant="rounded" size="sm" className="flex-1 h-10" style={{ backgroundColor: currentTheme.background.white }}>
          <InputField 
            placeholder={placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: currentTheme.text.primary }}
          />
          <InputSlot 
            className="rounded-full h-6 w-6 m-1.5"
            style={{ backgroundColor: currentTheme.primary[600] }}
          >
            <InputIcon as={Search} color={currentTheme.text.white} />
          </InputSlot>
        </Input>
        
        <DateRangePicker 
          onDateRangeSelect={onDateRangeSelect}
          selectedRange={selectedRange}
          onRangeChange={onRangeChange}
        />
      </HStack>
    </Box>
  );
}

