import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/theme-context';
import { ThemeToggle } from './theme-toggle';
export function Header({ text = "RU Hungry" }) {
  const insets = useSafeAreaInsets();
  const { currentTheme } = useTheme();
  
  return (
    <Box 
      className="px-4 py-3"
      style={{ 
        paddingTop: insets.top + 12,
        backgroundColor: currentTheme.background.primary 
      }}
    >
      <HStack className="justify-between items-center">
        <ThemeToggle />
        <Text 
          className="text-2xl font-bold"
          style={{ color: currentTheme.text.primary }}
        >
          {text}
        </Text>
        <Box className="w-6" />
      </HStack>
    </Box>
  );
}
