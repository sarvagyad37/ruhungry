import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { EventCard } from '@/components/event-card';
import { formatDate } from '@/utils/date-helper';
import { useTheme } from '@/theme/theme-context';

interface Event {
  id: number;
  title: string;
  time: string;
  location: string;
  image: string;
  isFree: boolean;
  date: Date;
}

interface DateSectionProps {
  date: Date;
  events: Event[];
  onEventPress?: (event: Event) => void;
}

export function DateSection({ date, events, onEventPress }: DateSectionProps) {
  const { currentTheme } = useTheme();
  
  if (events.length === 0) return null;

  return (
    <Box className="mb-6">
      <Text 
        className="text-lg font-semibold mb-3 px-4"
        style={{ color: currentTheme.text.primary }}
      >
        {formatDate(date)}
      </Text>
      <VStack space="md" className="px-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            time={event.time}
            location={event.location}
            image={event.image}
            isFree={event.isFree}
            onPress={() => onEventPress?.(event)}
          />
        ))}
      </VStack>
    </Box>
  );
}

