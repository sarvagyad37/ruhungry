import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton } from '@/components/ui/modal';
import { Icon } from '@/components/ui/icon';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-context';
import { useState } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (startDate: Date, endDate: Date) => void;
}

export function CalendarModal({ isOpen, onClose, onDateSelect }: CalendarModalProps) {
  const { currentTheme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateSelected = (date: Date) => {
    if (selectedStartDate && date.getTime() === selectedStartDate.getTime()) return true;
    if (selectedEndDate && date.getTime() === selectedEndDate.getTime()) return true;
    return false;
  };

  const handleDatePress = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // Complete selection
      if (date >= selectedStartDate) {
        setSelectedEndDate(date);
      } else {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedStartDate && selectedEndDate) {
      // Ensure we're setting proper start and end of day for the date range
      const startOfDay = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), selectedStartDate.getDate());
      const endOfDay = new Date(selectedEndDate.getFullYear(), selectedEndDate.getMonth(), selectedEndDate.getDate());
      endOfDay.setHours(23, 59, 59, 999); // End of day
      
      onDateSelect(startOfDay, endOfDay);
      onClose();
    }
  };

  const handleClear = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent style={{ backgroundColor: currentTheme.background.white }}>
        <ModalHeader className="pb-2">
          <HStack className="justify-between items-center w-full">
            <Text className="text-lg font-semibold" style={{ color: currentTheme.text.primary }}>
              Select Date Range
            </Text>
            <ModalCloseButton>
              <Icon as={X} style={{ color: currentTheme.text.secondary }} />
            </ModalCloseButton>
          </HStack>
        </ModalHeader>

        <ModalBody className="px-4">
          {/* Month Navigation */}
          <HStack className="justify-between items-center mb-4">
            <Pressable onPress={() => navigateMonth('prev')}>
              <Icon as={ChevronLeft} style={{ color: currentTheme.text.secondary }} />
            </Pressable>
            <Text className="text-lg font-medium" style={{ color: currentTheme.text.primary }}>
              {formatMonthYear(currentMonth)}
            </Text>
            <Pressable onPress={() => navigateMonth('next')}>
              <Icon as={ChevronRight} style={{ color: currentTheme.text.secondary }} />
            </Pressable>
          </HStack>

          {/* Week Days Header */}
          <HStack className="justify-between mb-2">
            {weekDays.map((day) => (
              <Box key={day} className="w-10 items-center">
                <Text className="text-sm font-medium" style={{ color: currentTheme.text.secondary }}>
                  {day}
                </Text>
              </Box>
            ))}
          </HStack>

          {/* Calendar Grid */}
          <VStack space="xs">
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
              <HStack key={weekIndex} className="justify-between">
                {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => (
                  <Box key={dayIndex} className="w-10 h-10">
                    {date ? (
                      <Pressable
                        onPress={() => handleDatePress(date)}
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          isDateSelected(date) ? 'bg-amber-600' : ''
                        } ${
                          isDateInRange(date) && !isDateSelected(date) ? 'bg-amber-100' : ''
                        }`}
                        style={{
                          backgroundColor: isDateSelected(date) 
                            ? currentTheme.primary[600] 
                            : isDateInRange(date) && !isDateSelected(date)
                            ? currentTheme.primary[100]
                            : 'transparent'
                        }}
                      >
                        <Text 
                          className="text-sm font-medium"
                          style={{ 
                            color: isDateSelected(date) 
                              ? currentTheme.text.white 
                              : currentTheme.text.primary 
                          }}
                        >
                          {date.getDate()}
                        </Text>
                      </Pressable>
                    ) : (
                      <Box className="w-10 h-10" />
                    )}
                  </Box>
                ))}
              </HStack>
            ))}
          </VStack>

          {/* Selected Range Display */}
          {(selectedStartDate || selectedEndDate) && (
            <Box className="mt-4 p-3 rounded-lg" style={{ backgroundColor: currentTheme.background.secondary }}>
              <Text className="text-sm font-medium mb-2" style={{ color: currentTheme.text.primary }}>
                Selected Range:
              </Text>
              <HStack className="justify-between">
                <Text className="text-sm" style={{ color: currentTheme.text.secondary }}>
                  {selectedStartDate ? formatDate(selectedStartDate) : 'Start date'}
                </Text>
                <Text className="text-sm" style={{ color: currentTheme.text.secondary }}>
                  to
                </Text>
                <Text className="text-sm" style={{ color: currentTheme.text.secondary }}>
                  {selectedEndDate ? formatDate(selectedEndDate) : 'End date'}
                </Text>
              </HStack>
            </Box>
          )}
        </ModalBody>

        <ModalFooter className="pt-4">
          <HStack className="justify-between w-full">
            <Pressable onPress={handleClear}>
              <Text className="text-sm font-medium" style={{ color: currentTheme.text.secondary }}>
                Clear
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className="px-4 py-2 rounded-lg"
              style={{ 
                backgroundColor: selectedStartDate && selectedEndDate 
                  ? currentTheme.primary[600] 
                  : currentTheme.background.secondary 
              }}
            >
              <Text 
                className="text-sm font-medium"
                style={{ 
                  color: selectedStartDate && selectedEndDate 
                    ? currentTheme.text.white 
                    : currentTheme.text.secondary 
                }}
              >
                Confirm
              </Text>
            </Pressable>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
