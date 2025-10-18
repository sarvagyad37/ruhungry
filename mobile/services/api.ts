// API service for fetching real event data
const API_BASE_URL = 'https://ruhungry.vercel.app';

export interface ApiEvent {
  id: string;
  title: string;
  startsOn: string;
  endsOn: string;
  org: string;
  locationText: string;
  benefits: string[];
  eventUrl: string;
  imageUrl: string | null;
}

export interface ApiResponse {
  lastRefresh: string;
  count: number;
  events: ApiEvent[];
}

export async function fetchEvents(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/free-food`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
}

// Transform API event to our app's Event interface
export function transformApiEvent(apiEvent: ApiEvent) {
  // Use a more reliable fallback image
  const fallbackImage = 'https://picsum.photos/400/300?random=' + apiEvent.id;
  
  const eventDate = new Date(apiEvent.startsOn);
  const eventEndDate = new Date(apiEvent.endsOn);
  
  console.log('Transforming event:', apiEvent.title, 'Image URL:', apiEvent.imageUrl);
  console.log('Event date:', apiEvent.startsOn, 'Parsed as:', eventDate.toLocaleDateString(), 'Local time:', eventDate.toLocaleString());
  console.log('Event ends:', apiEvent.endsOn, 'Parsed as:', eventEndDate.toLocaleDateString(), 'Local time:', eventEndDate.toLocaleString());
  
  return {
    id: parseInt(apiEvent.id),
    title: apiEvent.title,
    time: formatEventTime(apiEvent.startsOn, apiEvent.endsOn),
    location: apiEvent.locationText,
    image: apiEvent.imageUrl && apiEvent.imageUrl !== 'null' ? apiEvent.imageUrl : fallbackImage,
    isFree: apiEvent.benefits.includes('Free Food'),
    date: eventDate,
    endDate: eventEndDate,
    org: apiEvent.org,
    eventUrl: apiEvent.eventUrl,
    benefits: apiEvent.benefits,
  };
}

// Format event time from API dates
function formatEventTime(startsOn: string, endsOn: string): string {
  const startDate = new Date(startsOn);
  const endDate = new Date(endsOn);
  
  const startTime = startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  const endTime = endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `${startTime} - ${endTime}`;
}
