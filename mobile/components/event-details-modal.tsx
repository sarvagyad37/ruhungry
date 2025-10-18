import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@/components/ui/modal';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { X, Loader2 } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-context';
import { Image as ExpoImage } from 'expo-image';
import { Image as RNImage } from 'react-native';

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

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
}

export function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  const { currentTheme } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);

  // Reset loading state when modal opens with new event
  useEffect(() => {
    if (isOpen && event) {
      setImageLoading(true);
    }
  }, [isOpen, event?.id]);

  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalBackdrop />
      <ModalContent style={{ 
        backgroundColor: currentTheme.background.white,
        borderColor: currentTheme.border.light,
        borderWidth: 1
      }}>
        
        {/* Body */}
        <ModalBody>
          {/* Close Button - Top Right */}
          <Box className="absolute top-4 right-4 z-10">
            <ModalCloseButton>
              <Box 
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{ backgroundColor: currentTheme.background.white }}
              >
                <Icon as={X} style={{ color: currentTheme.text.secondary }} />
              </Box>
            </ModalCloseButton>
          </Box>
          <VStack space="lg">
            {/* Hero Image */}
            <Box className="w-full h-48 relative">
              {imageLoading && (
                <Box 
                  className="absolute inset-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: currentTheme.background.secondary }}
                >
                  <Icon as={Loader2} style={{ color: currentTheme.text.secondary }} />
                  <Text className="text-sm mt-2" style={{ color: currentTheme.text.secondary }}>
                    Loading...
                  </Text>
                </Box>
              )}
              <RNImage 
                source={{ uri: event.image || 'https://picsum.photos/400/300?random=' + event.id }} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: 8,
                  opacity: imageLoading ? 0 : 1 
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', event.image);
                  setImageLoading(false);
                }}
                onError={(error) => {
                  console.log('Image failed to load:', event.image, error);
                  setImageLoading(false);
                }}
                resizeMode="cover"
              />
            </Box>

            {/* Event Info */}
            <VStack space="md">
              {/* Event Name */}
              <Text className="text-2xl font-bold" style={{ color: currentTheme.text.primary }}>
                {event.title}
              </Text>

              {/* Time Badge */}
              <Badge style={{ backgroundColor: currentTheme.badge.time }} className="self-start">
                <Text className="text-sm font-medium" style={{ color: currentTheme.text.primary }}>
                  {event.time}
                </Text>
              </Badge>

              {/* Organization */}
              {event.org && (
                <Text className="text-base" style={{ color: currentTheme.text.secondary }}>
                  🏛️ {event.org}
                </Text>
              )}

              {/* Location */}
              <Text className="text-base" style={{ color: currentTheme.text.secondary }}>
                📍 {event.location}
              </Text>


              {/* Description */}
              <Text className="text-sm leading-relaxed" style={{ color: currentTheme.text.secondary }}>
                Join us for this amazing food event! Great food, good company, and lots of fun.
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        {/* Footer */}
        <ModalFooter>
          <VStack space="md" className="w-full">
            {/* View Event Button */}
            {event.eventUrl && (
              <Button className="w-full" style={{ backgroundColor: currentTheme.primary[600] }}>
                <ButtonText style={{ color: currentTheme.text.white }}>View Event Details</ButtonText>
              </Button>
            )}
            
            {/* Primary Actions */}
            <HStack space="md">
              <Button className="flex-1" style={{ backgroundColor: currentTheme.badge.active }}>
                <ButtonText style={{ color: currentTheme.text.white }}>I'm Going</ButtonText>
              </Button>
              <Button variant="outline" className="flex-1" style={{ borderColor: currentTheme.border.light }}>
                <ButtonText style={{ color: currentTheme.text.secondary }}>Favorite</ButtonText>
              </Button>
            </HStack>

            {/* Secondary Actions */}
            <HStack space="sm">
              <Button variant="outline" className="flex-1" style={{ borderColor: currentTheme.border.light }}>
                <ButtonText style={{ color: currentTheme.text.secondary }}>Share</ButtonText>
              </Button>
              <Button variant="outline" className="flex-1" style={{ borderColor: currentTheme.border.light }}>
                <ButtonText style={{ color: currentTheme.text.secondary }}>Directions</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
