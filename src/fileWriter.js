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
      console.warn(`⚠️  Skipping ${file} — already exists`);
      continue;
    }

    await fs.copy(src, dest);
    console.log(`✅ Created ${file}`);
  }
}