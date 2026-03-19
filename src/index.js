import chalk from 'chalk';
import ora from 'ora';
import { detectProjectType } from './detector.js';
import { installDependencies } from './installer.js';
import { writeConfigFiles } from './fileWriter.js';

async function run() {
  console.log(chalk.bold.cyan('\n🚀 NativeWind Setup\n'));

  // Step 1: Detect project
  let projectType;
  try {
    projectType = await detectProjectType();
    const isTS = projectType.includes('ts');
    console.log(
      `✔ Detected: ${chalk.green(projectType)} ${isTS ? chalk.blue('(TypeScript)') : chalk.yellow('(JavaScript)')}`
    );
  } catch (err) {
    console.error(chalk.red('✖ ' + err.message));
    process.exit(1);
  }

  // Step 2: Install dependencies
  const installSpinner = ora('Installing NativeWind & TailwindCSS...').start();
  try {
    installDependencies(projectType);
    installSpinner.succeed('Dependencies installed');
  } catch (err) {
    installSpinner.fail('Installation failed: ' + err.message);
    process.exit(1);
  }

  // Step 3: Write config files
  const fileSpinner = ora('Creating config files...').start();
  try {
    await writeConfigFiles(projectType);
    fileSpinner.succeed('Config files created');
  } catch (err) {
    fileSpinner.fail('File creation failed: ' + err.message);
    process.exit(1);
  }

  // Done!
  console.log(chalk.bold.green('\n✅ NativeWind setup complete!\n'));
  console.log(chalk.yellow('Next steps:'));
  console.log('  1. Import global.css in your root layout');
  console.log('  2. Start using Tailwind classes in your components');
  if (projectType.includes('ts')) {
    console.log('  3. nativewind-env.d.ts has been created for TypeScript support ✅');
  }
  console.log('');
}

run();
