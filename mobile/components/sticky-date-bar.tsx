import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Calendar, X } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-context';

interface StickyDateBarProps {
  dateRange?: { startDate?: Date; endDate?: Date };
  onClear?: () => void;
  onResetToAll?: () => void;
}

export function StickyDateBar({ dateRange, onClear, onResetToAll }: StickyDateBarProps) {
  const { currentTheme } = useTheme();

  // Check if we have a valid date range (not the "no filter" marker)
  const hasValidRange = dateRange?.startDate && dateRange?.endDate && 
    !(dateRange.startDate.getTime() === new Date(0).getTime() && 
      dateRange.endDate.getTime() === new Date(0).getTime());

  if (!hasValidRange) {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatRange = () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return '';
    
    const start = formatDate(dateRange.startDate);
    const end = formatDate(dateRange.endDate);
    
    // If same date, show single date
    if (start === end) {
      return start;
    }
    
    // If same month, show "Jan 15-20"
    if (dateRange.startDate.getMonth() === dateRange.endDate.getMonth() && 
        dateRange.startDate.getFullYear() === dateRange.endDate.getFullYear()) {
      return `${formatDate(dateRange.startDate).replace(/\d+/, '')}${dateRange.startDate.getDate()}-${dateRange.endDate.getDate()}`;
    }
    
    // Different months, show full range
    return `${start} - ${end}`;
  };

  return (
    <Pressable onPress={onResetToAll}>
      <Box 
        className="px-4 py-2 border-b"
        style={{ 
          backgroundColor: currentTheme.background.white,
          borderBottomColor: currentTheme.border.light
        }}
      >
        <HStack className="justify-between items-center">
          <HStack className="items-center">
            <Icon 
              as={Calendar} 
              className="mr-2" 
              style={{ color: currentTheme.text.secondary }}
            />
            <Text 
              className="text-sm font-medium"
              style={{ color: currentTheme.text.primary }}
            >
              {formatRange()}
            </Text>
          </HStack>
          
          {onClear && (
            <Pressable onPress={onClear}>
              <Icon 
                as={X} 
                style={{ color: currentTheme.text.secondary }}
              />
            </Pressable>
          )}
        </HStack>
      </Box>
    </Pressable>
  );
}
