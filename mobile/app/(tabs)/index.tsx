import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { EventList } from '@/components/event-list';
import { EventDetailsModal } from '@/components/event-details-modal';
import { StickyDateBar } from '@/components/sticky-date-bar';
import { useTheme } from '@/theme/theme-context';
import { Keyboard, View } from 'react-native';
import { useState } from 'react';

interface Event {
  id: number;
  title: string;
  time: string;
  location: string;
  image: string;
  isFree: boolean;
  date: Date;
  endDate?: Date;
  org?: string;
  eventUrl?: string;
  benefits?: string[];
}

export default function HomeScreen() {
  const { currentTheme } = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ startDate?: Date; endDate?: Date }>({});
  const [selectedRange, setSelectedRange] = useState<string>('All');

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setDateRange({ startDate, endDate });
  };

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
  };

  const handleClearDateRange = () => {
    setDateRange({});
    setSelectedRange('All');
  };

  const handleResetToAll = () => {
    setDateRange({});
    setSelectedRange('All');
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: currentTheme?.background?.primary || '#FEF7ED' }}>
      <Header />
      <SearchBar 
        onSearch={handleSearch} 
        onDateRangeSelect={handleDateRangeSelect}
        selectedRange={selectedRange}
        onRangeChange={handleRangeChange}
      />
      <StickyDateBar 
        dateRange={dateRange} 
        onClear={handleClearDateRange} 
        onResetToAll={handleResetToAll} 
      />
      <EventList 
        onEventPress={handleEventPress} 
        searchQuery={searchQuery}
        dateRange={dateRange}
      />
      
      {/* Event Details Modal */}
      <EventDetailsModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
      
      {/* Bottom Navigation */}
    </View>
  );
}
