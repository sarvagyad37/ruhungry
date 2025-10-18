import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme } from '@/theme/theme-context';

export function ThemeToggle() {
  const { themeName, setTheme, currentTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(themeName === 'light' ? 'dark' : 'light');
  };

  return (
    <Pressable onPress={toggleTheme}>
      <Icon 
        as={themeName === 'light' ? Moon : Sun} 
        style={{ color: currentTheme.text.primary }}
      />
    </Pressable>
  );
}
