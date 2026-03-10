import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import SettingsScreen from '../../screens/Setting/Settings';
import DailyResultFormScreen from '../../screens/DailyResultFormScreen';
import MyWallet from '../../screens/MyWallet/MyWallet';
import ChartsScreen from '../../screens/Charts/ChartsScreen';
import { globalColors } from '../../Theme/globalColors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            sceneContainerStyle={{ paddingBottom: 90 }}
            screenOptions={({ route }) => {
                const globalContentPadding = { contentStyle: { paddingBottom: 120 } };
                const tabLabels = {
                    Dashboard: t('dashboard'),
                    Result: t('result'),
                    Wallet: t('wallet'),
                    Charts: t('charts'),
                    Setting: t('setting'),
                };

                const tabIcons = {
                    Dashboard: 'home',
                    Result: 'clipboard',
                    Wallet: 'credit-card',
                    Charts: 'bar-chart-2',
                    Setting: 'settings',
                };

                return {
                    ...globalContentPadding,
                    headerShown: false,
                    animation: 'none',
                    tabBarLabel: tabLabels[route.name] || route.name,
                    tabBarIcon: ({ color, size }) => (
                        <Feather name={tabIcons[route.name] || 'circle'} size={size} color={color} />
                    ),
                    tabBarActiveTintColor: globalColors.purplegradient1,
                    tabBarInactiveTintColor: '#94a3b8',
                    tabBarStyle: {
                        backgroundColor: globalColors.white,
                        borderTopWidth: 0,
                        borderRadius: 32,
                        height: 64,
                        marginHorizontal: 16,
                        marginBottom: 4,
                        marginTop: 4,
                        shadowColor: '#ffffff',
                        transparent: true,
                        shadowOpacity: 0.1,
                        shadowRadius: 14,
                        shadowOffset: { width: 0, height: 6 },
                        elevation: 16,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontFamily: 'Poppins-Medium',
                    },
                    tabBarHideOnKeyboard: true,
                };
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    animation: 'none',
                }}
            />
            <Tab.Screen
                name="Result"
                component={DailyResultFormScreen}
                options={{
                    animation: 'none',
                }}
            />
            <Tab.Screen
                name="Wallet"
                component={MyWallet}
                options={{
                    animation: 'none',
                }}
            />
            <Tab.Screen
                name="Charts"
                component={ChartsScreen}
                options={{
                    animation: 'none',
                }}
            />
            <Tab.Screen
                name="Setting"
                component={SettingsScreen}
                options={{
                    animation: 'none',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
