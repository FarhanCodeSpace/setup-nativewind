import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function writeConfigFiles(projectType) {
  const templateDir = path.join(__dirname, "templates", projectType);
  const targetDir = process.cwd();
  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    const src = path.join(templateDir, file);
    const dest = path.join(targetDir, file);

    if (fs.existsSync(dest)) {
      // Smart merge for babel.config.js
      if (file === "babel.config.js") {
        await mergeBabelConfig(dest, projectType);
        continue;
      }

      // Smart merge for metro.config.js
      if (file === "metro.config.js") {
        await mergeMetroConfig(dest, projectType);
        continue;
      }

      console.log(`⚠️  Skipping ${file} — already exists`);
      continue;
    }

    await fs.copy(src, dest);
    console.log(`✅ Created ${file}`);
  }

  // For TS projects update tsconfig.json automatically
  if (projectType.includes("ts")) {
    await updateTsConfig(targetDir);
  }
}

async function mergeBabelConfig(destPath, projectType) {
  const content = fs.readFileSync(destPath, "utf8");

  // Already has nativewind config
  if (content.includes("nativewind")) {
    console.log("⚠️  Skipping babel.config.js — already has NativeWind config");
    return;
  }

  let updated;

  if (projectType.includes("expo")) {
    // Expo babel config
    updated = content.replace(
      /presets:\s*\[/,
      `presets: [\n      ["babel-preset-expo", { jsxImportSource: "nativewind" }],\n      "nativewind/babel",`,
    );
  } else {
    // RN CLI babel config
    updated = content.replace(
      /plugins:\s*\[/,
      `plugins: [\n    "nativewind/babel",`,
    );

    // If no plugins array exists add it
    if (!content.includes("plugins")) {
      updated = content.replace(
        /presets:\s*\[([^\]]*)\]/,
        `presets: [$1],\n  plugins: ["nativewind/babel"]`,
      );
    }
  }

  fs.writeFileSync(destPath, updated, "utf8");
  console.log("✅ Updated babel.config.js");
}

async function mergeMetroConfig(destPath, projectType) {
  const content = fs.readFileSync(destPath, "utf8");

  // Already has nativewind config
  if (content.includes("nativewind")) {
    console.log("⚠️  Skipping metro.config.js — already has NativeWind config");
    return;
  }

  let updated;

  if (projectType.includes("expo")) {
    // Expo metro config
    updated = `const { getDefaultConfig } = require("expo/metro-config");\nconst { withNativeWind } = require("nativewind/metro");\n\nconst config = getDefaultConfig(__dirname);\n\nmodule.exports = withNativeWind(config, { input: "./global.css" });\n`;
  } else {
    // RN CLI metro config — add withNativeWind import and wrap export
    updated = content
      .replace(
        /const\s*\{\s*getDefaultConfig,\s*mergeConfig\s*\}\s*=\s*require\(['"]@react-native\/metro-config['"]\);/,
        `const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");\nconst { withNativeWind } = require("nativewind/metro");`,
      )
      .replace(
        /module\.exports\s*=\s*mergeConfig\(([^;]+)\);/s, // ← fixed: [^;]+ with s flag
        `const mergedConfig = mergeConfig($1);\nmodule.exports = withNativeWind(mergedConfig, { input: "./global.css" });`,
      );
  }

  fs.writeFileSync(destPath, updated, "utf8");
  console.log("✅ Updated metro.config.js");
}

async function updateTsConfig(targetDir) {
  const tsconfigPath = path.join(targetDir, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) return;

  const tsconfig = fs.readJsonSync(tsconfigPath);

  if (!tsconfig.include) {
    tsconfig.include = [];
  }

  if (!tsconfig.include.includes("nativewind-env.d.ts")) {
    tsconfig.include.push("nativewind-env.d.ts");
    fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });
    console.log("✅ Updated tsconfig.json");
  }
}
