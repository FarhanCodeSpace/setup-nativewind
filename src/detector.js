import fs from 'fs-extra';
import path from 'path';

export function detectProjectType() {
  const pkgPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(pkgPath)) {
    throw new Error('No package.json found. Are you in the root of a React Native project?');
  }

  const pkg = fs.readJsonSync(pkgPath);
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  if (deps['expo']) {
    // Check if it's bare or managed
    if (fs.existsSync(path.join(process.cwd(), 'android')) ||
        fs.existsSync(path.join(process.cwd(), 'ios'))) {
      return 'expo-bare';
    }
    return 'expo-managed';
  }

  if (deps['react-native']) {
    return 'rn-cli';
  }

  throw new Error('Could not detect project type. Make sure you are in a React Native or Expo project.');
}