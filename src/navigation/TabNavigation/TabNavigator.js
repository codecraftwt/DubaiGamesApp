import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import DashboardScreen from '../../screens/DashboardScreen/DashboardScreen';
import SettingsScreen from '../../screens/Setting/Settings';
import DrawerNavigator from '../DrawerNavigation/DrawerNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                animation: 'none',
                tabBarLabel: route.name === 'Dashboard' ? t('dashboard') : t('setting'),
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') iconName = 'home';
                    else if (route.name === 'Setting') iconName = 'settings';

                    return <Feather name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1e293b',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#f8fafc',
                    borderTopWidth: 1,
                    borderTopColor: '#e2e8f0',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: 'Poppins-Medium',
                },
                tabBarHideOnKeyboard: true,
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DrawerNavigator}
                options={{
                    animation: 'none',
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        navigation.navigate('Dashboard', { screen: 'Dashboard' });
                    },
                })}
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
