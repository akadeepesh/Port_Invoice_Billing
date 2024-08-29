# Invoice Billing Native TS

This is an Expo React Native application for invoice billing, built with TypeScript.

## Project Structure

```
PORT INVOICE BILLING/
└── InvoiceBillingNativeTS/
    ├── expo/
    ├── assets/
    ├── components/
    │   ├── AuthForm.tsx
    │   └── TestButton.tsx
    ├── node_modules/
    ├── screens/
    │   ├── CreateInvoiceScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── SignupScreen.tsx
    │   └── ViewInvoiceScreen.tsx
    ├── types/
    ├── navigation.ts
    ├── .gitignore
    ├── app.json
    ├── App.tsx
    ├── babel.config.js
    ├── global.css
    ├── metro.config.js
    ├── nativewind-env.d.ts
    ├── package-lock.json
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── README.md
```

## Key Components

- `App.tsx`: The main application component.
- `screens/`: Contains the main screens of the application.
- `components/`: Reusable UI components.
- `types/`: TypeScript type definitions.
- `navigation.ts`: Navigation configuration.

## Setup and Installation

1. Ensure you have Node.js and npm installed.
2. Navigate to the project directory and run `npm install`.
3. Start the application with `npm start` or `npx expo start`.

## Available Scripts

- `npm start` or `npx expo start`: Starts the Expo development server.
- `npm run android`: Runs the app on an Android emulator or connected device.
- `npm run ios`: Runs the app on an iOS simulator or connected device.
- `npm run web`: Runs the app in a web browser.

## Dependencies

This project uses several key dependencies:

- Expo
- React Native
- TypeScript
- NativeWind (for styling)

For a full list of dependencies, please refer to the `package.json` file.
