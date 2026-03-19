import { execSync } from 'child_process';

const packages = {
  'expo-managed':    'nativewind tailwindcss',
  'expo-managed-ts': 'nativewind tailwindcss',
  'expo-bare':       'nativewind tailwindcss',
  'expo-bare-ts':    'nativewind tailwindcss',
  'rn-cli':          'nativewind tailwindcss react-native-reanimated react-native-safe-area-context',
  'rn-cli-ts':       'nativewind tailwindcss react-native-reanimated react-native-safe-area-context',
};

export function installDependencies(projectType) {
  const pkgs = packages[projectType];
  execSync(`npm install ${pkgs}`, { stdio: 'inherit' });
}