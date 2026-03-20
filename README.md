# setup-nativewind

> CLI tool to instantly set up NativeWind v4 for Expo and React Native projects

## Usage

```bash
npx setup-nativewind
```

## What it does

- ✅ Auto detects your project type (Expo managed, Expo bare, React Native CLI)
- ✅ Asks if your project is JavaScript or TypeScript
- ✅ Installs `nativewind` and `tailwindcss` automatically
- ✅ Creates all required config files
- ✅ Smart merges existing `babel.config.js` and `metro.config.js`
- ✅ Creates `nativewind-env.d.ts` for TypeScript projects
- ✅ Auto updates `tsconfig.json` for TypeScript projects

## Supported Project Types

| Project Type     | JavaScript | TypeScript |
| ---------------- | ---------- | ---------- |
| Expo Managed     | ✅         | ✅         |
| Expo Bare        | ✅         | ✅         |
| React Native CLI | ✅         | ✅         |

## Requirements

- Node.js 16+
- An existing Expo or React Native project

## License

MIT
