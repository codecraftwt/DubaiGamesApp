import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import SettingsScreen from '../../screens/Setting/Settings';
import DailyResultFormScreen from '../../screens/DailyResultFormScreen';
import MyWallet from '../../screens/MyWallet/MyWallet';
import AddFundAccount from '../../screens/MyWallet/AddFundAccount';
import { globalColors } from '../../Theme/globalColors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                animation: 'none',
                tabBarLabel: route.name === 'Dashboard' ? t('dashboard') :
                    route.name === 'Result' ? t('result') :
                        route.name === 'Wallet' ? t('wallet') : t('setting'),
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') iconName = 'home';
                    else if (route.name === 'Result') iconName = 'clipboard';
                    else if (route.name === 'Wallet') iconName = 'credit-card';
                    else if (route.name === 'Setting') iconName = 'settings';

                    return <Feather name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: globalColors.blue || '#1e293b',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#f8fafc',
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                    height: 55,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontFamily: 'Poppins-Medium',
                },
                tabBarHideOnKeyboard: true,
            })}
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
