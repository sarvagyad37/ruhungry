import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/theme/theme-context';
import { ThemeName } from '@/theme/colors';

const themeOptions: { name: ThemeName; label: string }[] = [
  { name: 'light', label: 'Light' },
  { name: 'dark', label: 'Dark' },
];

export function ThemeSwitcher() {
  const { themeName, setTheme, currentTheme } = useTheme();

  return (
    <Box 
      className="px-4 pb-2"
      style={{ backgroundColor: currentTheme.background.primary }}
    >
      <HStack space="sm">
        {themeOptions.map((option) => (
          <Pressable 
            key={option.name}
            onPress={() => setTheme(option.name)}
          >
            <Badge style={{
              backgroundColor: themeName === option.name 
                ? currentTheme.badge.active 
                : currentTheme.badge.inactive,
              borderColor: currentTheme.border.light,
              borderWidth: themeName === option.name ? 0 : 1
            }}>
              <Text 
                className="text-xs font-medium"
                style={{ 
                  color: themeName === option.name 
                    ? currentTheme.text.white 
                    : currentTheme.text.secondary 
                }}
              >
                {option.label}
              </Text>
            </Badge>
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
}
