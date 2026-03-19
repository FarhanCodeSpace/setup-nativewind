import fs from 'fs-extra';
import path from 'path';
import prompts from 'prompts';

export async function detectProjectType() {
  const pkgPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(pkgPath)) {
    throw new Error('No package.json found. Are you in the root of a React Native project?');
  }

  const pkg = fs.readJsonSync(pkgPath);
  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Ask user for language
  const { language } = await prompts({
    type: 'select',
    name: 'language',
    message: 'Is your project JavaScript or TypeScript?',
    choices: [
      { title: 'JavaScript', value: 'js' },
      { title: 'TypeScript', value: 'ts' },
    ],
  });

  const isTypeScript = language === 'ts';

  if (deps['expo']) {
    const isBare =
      fs.existsSync(path.join(process.cwd(), 'android')) ||
      fs.existsSync(path.join(process.cwd(), 'ios'));

    if (isBare) return isTypeScript ? 'expo-bare-ts' : 'expo-bare';
    return isTypeScript ? 'expo-managed-ts' : 'expo-managed';
  }

  if (deps['react-native']) {
    return isTypeScript ? 'rn-cli-ts' : 'rn-cli';
  }

  throw new Error('Could not detect project type. Make sure you are in a React Native or Expo project.');
}