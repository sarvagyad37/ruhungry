import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Badge } from '@/components/ui/badge';
import { Pressable } from '@/components/ui/pressable';
import { useTheme } from '@/theme/theme-context';
import { Image } from 'react-native';

export function EventCard({ 
  title, 
  time, 
  location, 
  image, 
  isFree = false,
  onPress
}: {
  title: string;
  time: string;
  location: string;
  image: string;
  isFree: boolean;
  onPress?: () => void;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <Pressable onPress={onPress}>
      <Card 
        className="p-4 rounded-xl shadow-sm"
        style={{ 
          backgroundColor: currentTheme.background.white,
          borderColor: currentTheme.border.card,
          borderWidth: 1
        }}
      >
        <HStack className="justify-between items-center">
          {/* Left Section - Text Content */}
          <Box className="flex-1 mr-4">
            <VStack space="sm">
              <Badge 
                className="self-start"
                style={{ backgroundColor: currentTheme.badge.time }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: currentTheme.text.primary }}
                >
                  {time}
                </Text>
              </Badge>
              <Text 
                className="text-lg font-semibold"
                style={{ color: currentTheme.text.primary }}
              >
                {title}
              </Text>
              <Text 
                className="text-sm"
                style={{ color: currentTheme.text.secondary }}
              >
                {location}
              </Text>
            </VStack>
          </Box>
          
          {/* Right Section - Image */}
          <Box className="w-28 h-20">
            <Image
              source={{ uri: image || 'https://picsum.photos/400/300?random=' + Date.now() }}
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: 8 
              }}
              resizeMode="cover"
              onError={() => console.log('Event card image failed to load:', image)}
            />
          </Box>
        </HStack>
      </Card>
    </Pressable>
  );
}
