import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ScrollView, TouchableWithoutFeedback, Keyboard, RefreshControl } from 'react-native';
import { DateSection } from './date-section';
import { getDateKey } from '@/utils/date-helper';
import { useTheme } from '@/theme/theme-context';
import { fetchEvents, transformApiEvent } from '@/services/api';
import { useState, useEffect } from 'react';

interface Event {
  id: number;
  title: string;
  time: string;
  location: string;
  image: string;
  isFree: boolean;
  date: Date;
  endDate?: Date; // Add end date for proper filtering
  org?: string;
  eventUrl?: string;
  benefits?: string[];
}

interface EventListProps {
  onEventPress?: (event: Event) => void;
  searchQuery?: string;
  dateRange?: { startDate?: Date; endDate?: Date };
}

export function EventList({ onEventPress, searchQuery = '', dateRange }: EventListProps) {
  const { currentTheme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiResponse = await fetchEvents();
      const transformedEvents = apiResponse.events.map(transformApiEvent);
      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search query, date range, and remove past events (but keep ongoing events)
  const filteredEvents = events.filter(event => {
    // First filter out past events (events that have already ended)
    const now = new Date();
    
    // Use actual end time from API, or fallback to start time + 2 hours if endDate not available
    const eventEndTime = event.endDate || new Date(event.date.getTime() + (2 * 60 * 60 * 1000));
    
    // Keep events that haven't ended yet (ongoing or future events)
    if (eventEndTime < now) {
      console.log(`Filtering out past event: ${event.title} (ended at ${eventEndTime.toLocaleString()})`);
      return false; // Remove past events
    }
    
    // Apply date range filter if specified and not "All" or "Custom"
    if (dateRange?.startDate && dateRange?.endDate) {
      // Check if this is the special "no filtering" marker (All or Custom selected)
      const isNoFilterMarker = dateRange.startDate.getTime() === new Date(0).getTime() && 
                               dateRange.endDate.getTime() === new Date(0).getTime();
      
      if (!isNoFilterMarker) {
        const eventStartDate = new Date(event.date);
        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date.getTime() + (2 * 60 * 60 * 1000));
        
        // Normalize dates to compare only date parts (ignore time)
        const normalizeDate = (date: Date) => {
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };
        
        const eventStartNormalized = normalizeDate(eventStartDate);
        const eventEndNormalized = normalizeDate(eventEndDate);
        const rangeStartNormalized = normalizeDate(dateRange.startDate);
        const rangeEndNormalized = normalizeDate(dateRange.endDate);
        
        // Check if event date falls within the selected range
        // Event is included if it starts or ends within the range, or if it spans the entire range
        const isInRange = (
          // Event starts within range
          (eventStartNormalized >= rangeStartNormalized && eventStartNormalized <= rangeEndNormalized) ||
          // Event ends within range  
          (eventEndNormalized >= rangeStartNormalized && eventEndNormalized <= rangeEndNormalized) ||
          // Event spans the entire range
          (eventStartNormalized <= rangeStartNormalized && eventEndNormalized >= rangeEndNormalized)
        );
        
        if (!isInRange) {
          console.log(`Filtering out event outside date range: ${event.title} (${eventStartNormalized.toDateString()} - ${eventEndNormalized.toDateString()})`);
          return false;
        }
        
        console.log(`Event within date range: ${event.title} (${eventStartNormalized.toDateString()} - ${eventEndNormalized.toDateString()})`);
      }
    }
    
    // Then apply search filter
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      (event.org && event.org.toLowerCase().includes(query))
    );
  });

  // Group filtered events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = getDateKey(event.date);
    console.log(`Grouping event "${event.title}" - Event date: ${event.date.toLocaleDateString()}, Date key: ${dateKey}`);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort dates chronologically
  const sortedDates = Object.keys(eventsByDate).sort();

  if (loading) {
    return (
      <Box className="flex-1 items-center justify-center" style={{ backgroundColor: currentTheme?.background?.primary || '#FEF7ED' }}>
        <Text className="text-lg" style={{ color: currentTheme?.text?.primary || '#78350F' }}>Loading events...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 items-center justify-center p-4" style={{ backgroundColor: currentTheme?.background?.primary || '#FEF7ED' }}>
        <Text className="text-lg mb-4" style={{ color: currentTheme?.text?.primary || '#78350F' }}>Failed to load events</Text>
        <Text className="text-sm mb-4 text-center" style={{ color: currentTheme?.text?.secondary || '#A16207' }}>{error}</Text>
        <Text className="text-sm" style={{ color: currentTheme?.text?.secondary || '#A16207' }}>Pull down to refresh</Text>
      </Box>
    );
  }

  if (searchQuery.trim() && filteredEvents.length === 0) {
    return (
      <Box className="flex-1 items-center justify-center p-4" style={{ backgroundColor: currentTheme?.background?.primary || '#FEF7ED' }}>
        <Text className="text-lg mb-2" style={{ color: currentTheme?.text?.primary || '#78350F' }}>No events found</Text>
        <Text className="text-sm text-center" style={{ color: currentTheme?.text?.secondary || '#A16207' }}>
          Try searching for different keywords
        </Text>
      </Box>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        className="flex-1"
        style={{ backgroundColor: currentTheme?.background?.primary || '#FEF7ED' }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadEvents}
            tintColor={currentTheme?.primary?.[600] || '#D97706'}
          />
        }
      >
        <Box className="pb-4">
          {sortedDates.map((dateKey) => {
            // Parse date key correctly to avoid timezone issues
            const [year, month, day] = dateKey.split('-').map(Number);
            const sectionDate = new Date(year, month - 1, day); // month is 0-indexed
            
            console.log(`Creating DateSection for key: ${dateKey}, parsed date: ${sectionDate.toLocaleDateString()}`);
            
            return (
              <DateSection
                key={dateKey}
                date={sectionDate}
                events={eventsByDate[dateKey]}
                onEventPress={onEventPress}
              />
            );
          })}
        </Box>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
