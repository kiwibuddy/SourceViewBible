# SourceView Bible

A mobile app for exploring the Bible through Sources (speakers) and Spheres (thematic categories).

## About

SourceView Bible was originally launched in 2016 and is available on the [App Store](https://apps.apple.com/us/app/sourceview-bible/id1114617271). This repository contains the v2 rewrite using Expo and modern React Native.

## Tech Stack

- **Expo SDK 52+** with development builds
- **React Native** with New Architecture enabled
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Realm** for local database
- **Emdros** custom native module for Bible text queries
- **EAS Build** for cloud builds
- **EAS Update** for OTA updates

## Project Structure

```
/SourceViewBible
├── app/                    # Expo Router screens
├── src/
│   ├── api/                # Emdros and data APIs
│   ├── common/             # Shared utilities, styles, constants
│   ├── components/         # Reusable UI components
│   ├── database/           # Realm schemas and queries
│   ├── hooks/              # Custom React hooks
│   └── modules/            # Native modules (Emdros)
├── assets/                 # Images, fonts, icons
├── datasets/               # Bible data files (.realm, .bpt)
├── legacy/                 # Original 2016 codebase (reference)
├── app.json                # Expo configuration
├── eas.json                # EAS Build configuration
└── package.json
```

## Development

### Prerequisites

- Node.js 20.x or later
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Xcode (for iOS development)
- Android Studio (for Android development)

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Create development build (required for native modules)
eas build --profile development --platform ios
eas build --profile development --platform android
```

### OTA Updates

JavaScript changes can be pushed instantly without app store review:

```bash
eas update --branch production --message "Description of changes"
```

## Legacy Code

The original 2016 codebase is preserved in the `legacy/` folder for reference during migration. Key files:

- `legacy/App/js/Components/` - Original UI components
- `legacy/App/js/Scenes/` - Original screens
- `legacy/App/js/Database/Realm.js` - Original database schema
- `legacy/Libraries/Emdros/` - Original native module

## License

Proprietary - All rights reserved
