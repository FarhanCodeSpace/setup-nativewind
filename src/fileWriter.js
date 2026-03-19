import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function writeConfigFiles(projectType) {
  const templateDir = path.join(__dirname, 'templates', projectType);
  const targetDir = process.cwd();
  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    const src = path.join(templateDir, file);
    const dest = path.join(targetDir, file);

    if (fs.existsSync(dest)) {
      console.log(`⚠️  Skipping ${file} — already exists`);
      continue;
    }

    await fs.copy(src, dest);
    console.log(`✅ Created ${file}`);
  }

  // For TS projects update tsconfig.json automatically
  if (projectType.includes('ts')) {
    await updateTsConfig(targetDir);
  }
}

async function updateTsConfig(targetDir) {
  const tsconfigPath = path.join(targetDir, 'tsconfig.json');

  if (!fs.existsSync(tsconfigPath)) return;

  const tsconfig = fs.readJsonSync(tsconfigPath);

  if (!tsconfig.include) {
    tsconfig.include = [];
  }

  if (!tsconfig.include.includes('nativewind-env.d.ts')) {
    tsconfig.include.push('nativewind-env.d.ts');
    fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });
    console.log('✅ Updated tsconfig.json');
  }
}