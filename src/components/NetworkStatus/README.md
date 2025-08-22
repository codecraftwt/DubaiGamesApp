# Network Status Components

This directory contains React Native components for displaying network connectivity status to users. The network status banner now appears **GLOBALLY** above ALL screens in your app.

## Components

### 1. NetworkStatus (Basic)
A simple network status banner that shows when there's no internet connection.

**Features:**
- Basic network connectivity check
- Simple slide-down animation
- Basic styling

### 2. NetworkStatusEnhanced (Intermediate)
An enhanced version with better network detection and user interaction.

**Features:**
- Multiple endpoint checking for reliability
- Retry and Help buttons
- Auto-retry functionality
- Better error handling

### 3. NetworkStatusAdvanced (Recommended)
The most advanced version using a custom hook for better state management.

**Features:**
- Custom hook for network status
- Loading states
- Better UI/UX
- Comprehensive error messages
- Auto-retry with visual feedback

### 4. GlobalNetworkWrapper
Wraps your entire app to show network status above all screens.

**Features:**
- Global network status banner
- Appears above ALL screens automatically
- Proper status bar handling
- Safe area compatibility

### 5. GlobalNetworkWrapperAdvanced
Enhanced global wrapper with better positioning and SafeAreaView support.

**Features:**
- All features of GlobalNetworkWrapper
- SafeAreaView integration
- Better iOS/Android compatibility
- Configurable network status display

## Usage

### Basic Usage
```jsx
import { NetworkStatus } from '../../components/NetworkStatus';

const MyScreen = () => {
  return (
    <>
      <NetworkStatus />
      {/* Your screen content */}
    </>
  );
};
```

### Global Implementation (Current Setup)
The network status banner is now **automatically shown above ALL screens** in your app. No need to add it to individual screens!

```jsx
// In App.tsx - Already implemented
import GlobalNetworkWrapperAdvanced from './src/components/NetworkStatus/GlobalNetworkWrapperAdvanced';

function App() {
  return (
    <Provider store={store}>
      <GlobalNetworkWrapperAdvanced>
        <AppNavigator />
      </GlobalNetworkWrapperAdvanced>
    </Provider>
  );
}
```

### Individual Screen Usage (Optional)
If you want to control network status behavior for specific screens:

```jsx
import useScreenNetworkStatus from '../../utils/useScreenNetworkStatus';

const MyScreen = () => {
  const { isOnline, isOffline, checkNetworkStatus } = useScreenNetworkStatus({
    requireInternet: true,
    showOfflineScreen: false,
  });

  if (isOffline) {
    return <Text>This screen requires internet</Text>;
  }

  return <Text>You are online!</Text>;
};
```

### Using the Hook
```jsx
import useNetworkStatus from '../../utils/useNetworkStatus';

const MyComponent = () => {
  const { isConnected, connectionType, checkNetworkStatus } = useNetworkStatus();
  
  if (!isConnected) {
    return <Text>No internet connection</Text>;
  }
  
  return <Text>Connected to {connectionType}</Text>;
};
```

## Global Implementation

The network status banner is now **automatically implemented** across your entire app! 

### What's Already Done:
✅ **App.tsx updated** - GlobalNetworkWrapperAdvanced wraps your entire app  
✅ **All screens covered** - Network status appears above every screen automatically  
✅ **Proper positioning** - Banner appears at the top with correct z-index  
✅ **Status bar handling** - Proper iOS/Android status bar integration  

### Installation

The components work with your existing dependencies. For production use, consider installing:

```bash
npm install @react-native-community/netinfo
```

Then update the `useNetworkStatus` hook to use NetInfo instead of fetch-based checking.

## Customization

You can customize the appearance by modifying the styles in each component file. The components use your app's global colors from `globalColors`.

## Network Detection

The components use multiple strategies to detect network connectivity:

1. **Fetch-based checking**: Tries to reach multiple endpoints
2. **Timeout handling**: 5-second timeout for each request
3. **Multiple endpoints**: Google, Cloudflare, Apple for reliability
4. **Auto-retry**: Automatically retries every 30 seconds
5. **Manual retry**: User can manually retry connection

## Best Practices

1. **Place at the top**: Always place the NetworkStatus component at the top of your screen
2. **High z-index**: The component uses high z-index to appear above other content
3. **Status bar padding**: Includes padding for status bar on iOS/Android
4. **Accessibility**: Uses semantic icons and clear text messages
5. **Performance**: Minimal re-renders and efficient network checking

## Troubleshooting

If the network status isn't working:

1. Check if the component is imported correctly
2. Ensure it's placed at the top of your screen component
3. Verify that your app has internet permissions
4. Check console for any error messages
5. Try the manual retry button

## Future Enhancements

- [ ] Add NetInfo integration for better network detection
- [ ] Add offline mode support
- [ ] Add network quality indicators
- [ ] Add custom network checking endpoints
- [ ] Add network change event listeners 