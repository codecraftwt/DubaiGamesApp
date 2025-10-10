
import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './src/navigation/AppNavigation/AppNavigator';
import { Provider } from 'react-redux';
import store, { persistor } from './src/Redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast, { BaseToast } from 'react-native-toast-message';
import { globalColors } from './src/Theme/globalColors';
import './src/utils/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './src/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalNetworkWrapperAdvanced from './src/components/NetworkStatus/GlobalNetworkWrapperAdvanced';
import GlobalStatusBar from './src/components/GlobalStatusBar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';


  const customToastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftWidth: 2, borderRightWidth: 2, borderColor: globalColors.green, width: '90%' }}
      />
    ),
    error: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftWidth: 2, borderRightWidth: 2, borderColor: globalColors.red, width: '90%' }}
      />
    ),
  };


  // Load saved language on app start
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('user-language');
        console.log("savedLanguage", savedLanguage)
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Error loading language:', error);
      }
    };

    loadLanguage();
  }, [i18n]);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <GlobalStatusBar />
            <SafeAreaView style={{ flex: 1 }}>
              <GlobalNetworkWrapperAdvanced>
                <AppNavigator />
              </GlobalNetworkWrapperAdvanced>
            </SafeAreaView>
          </SafeAreaProvider>
        </PersistGate>
        <Toast config={customToastConfig} />
      </I18nextProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
